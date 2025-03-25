import {
  Database,
  DatabaseReference,
  get,
  push,
  ref,
  remove,
  set,
  update,
} from 'firebase/database'
import { database } from './config'
import {
  CashFlowT,
  type FirebasePlayer,
  FirebasePlayerListSchema,
  type PlayerBaseInfo,
} from '@/types/player'
import { generateRandomStr } from '../utils/helpers'
import {
  type FirebaseFine,
  FirebaseFineListSchema,
  type PlayerFine,
} from '@/types/fine'

class FirebaseUtils {
  protected db: Database

  constructor() {
    this.db = database
  }

  protected createDbRef = (collection: string) => {
    return ref(this.db, collection)
  }

  protected getSnapshot = async (ref: DatabaseReference) => {
    let snapshot = await get(ref)
    return snapshot.exists() ? snapshot.val() : []
  }

  protected getEntries = async (s: any) => {
    return Object.entries(s).map(([key, value]) => ({
      ...(value as any),
      key,
    }))
  }

  protected pushData = async (ref: DatabaseReference, d: any) => {
    let dRef = push(ref)
    await set(dRef, d)
  }
}

export class PlayerC extends FirebaseUtils {
  protected coll: string
  protected dbRef: DatabaseReference

  constructor() {
    super()
    this.coll = process.env.FIREBASE_DB_COLLECTION!
    this.dbRef = this.createDbRef(this.coll)
  }

  private initPlayerData = (data: PlayerBaseInfo): FirebasePlayer => ({
    ...data,
    finesList: [],
    _id: generateRandomStr(16),
    key: null,
  })

  getPlayer = async (): Promise<FirebasePlayer[]> => {
    let snapValues = await this.getSnapshot(this.dbRef)
    let entries = (await this.getEntries(snapValues)) as FirebasePlayer[]

    let validatedEntries = FirebasePlayerListSchema.safeParse(entries)

    if (!validatedEntries.success)
      throw new Error(validatedEntries.error.message)

    return validatedEntries.data
  }

  addPlayer = async (data: any) => {
    await this.pushData(this.dbRef, data)
  }

  createPlayer = async (pData: PlayerBaseInfo) => {
    let p = this.initPlayerData(pData)
    await this.addPlayer(p)
  }
}

export class PlayerFinesC extends PlayerC {
  private playerKey: string
  private playerRef: DatabaseReference

  constructor(key: string) {
    super()
    this.playerKey = key
    this.playerRef = ref(this.db, `${this.coll}/${this.playerKey}`)
  }

  private findFineIndexById = async (fineId: string) => {
    let playerFines = await this.getPlayerFinesList()
    return playerFines.findIndex((fine) => fine._id === fineId)
  }

  getPlayerFinesList = async (): Promise<PlayerFine[]> => {
    let playerData = (await this.getSnapshot(this.playerRef)) as FirebasePlayer
    return playerData.finesList || []
  }

  getFineById = async (fineId: string): Promise<PlayerFine | null> => {
    let playerFines = await this.getPlayerFinesList()
    let fineIndex = await this.findFineIndexById(fineId)

    return fineIndex === -1 ? null : playerFines[fineIndex]
  }

  addFine = async (newFineData: PlayerFine) => {
    let playerFines = await this.getPlayerFinesList()
    let updatedFines = [...playerFines, newFineData]

    await update(this.playerRef, { finesList: updatedFines })
  }

  deleteFine = async (fineId: string) => {
    let playerFines = await this.getPlayerFinesList()
    let fineIndex = await this.findFineIndexById(fineId)

    if (fineIndex === -1) return

    let updatedFinesList = playerFines.filter(
      (fine, index) => index !== fineIndex
    )

    await update(this.playerRef, { finesList: updatedFinesList })
  }

  convertToPaid = async (fineId: string) => {
    let playerFines = await this.getPlayerFinesList()
    let fineIndex = await this.findFineIndexById(fineId)

    if (fineIndex === -1) return

    playerFines[fineIndex].paid = true

    await update(this.playerRef, { finesList: playerFines })
  }
}

export class FineC extends FirebaseUtils {
  private coll: string
  private dbRef: DatabaseReference

  constructor() {
    super()
    this.coll = process.env.FIREBASE_DB_COLLECTION_FINES!
    this.dbRef = this.createDbRef(this.coll)
  }

  getFines = async (): Promise<FirebaseFine[]> => {
    let snapValues = await this.getSnapshot(this.dbRef)
    let entries = (await this.getEntries(snapValues)) as FirebaseFine[]

    let validatedEntries = FirebaseFineListSchema.safeParse(entries)

    if (!validatedEntries.success)
      throw new Error(validatedEntries.error.message)

    return validatedEntries.data
  }

  addFine = async (data: any) => {
    await this.pushData(this.dbRef, data)
  }

  deleteFine = async (fineId: string) => {
    let fineSpanshots = await this.getSnapshot(this.dbRef)

    let fineKey = Object.keys(fineSpanshots).find((key) => {
      let currentFine: FirebaseFine = fineSpanshots[key]
      return currentFine.fineId === fineId
    })

    if (!fineKey) throw new Error('Multa non trovata!')

    let fineRef = ref(this.db, `${this.dbRef}/${fineKey}`)
    await remove(fineRef)
  }
}

export class CashC extends FirebaseUtils {
  private coll: string
  private dbRef: DatabaseReference

  constructor() {
    super()
    this.coll = process.env.FIREBASE_DB_COLLECTION_CASH!
    this.dbRef = this.createDbRef(this.coll)
  }

  private setCashFlowOnAdd = async (fineAmount: number): Promise<CashFlowT> => {
    const currentCashFlow = await this.getCashFlow()
    let updatedMissing = (currentCashFlow.missing += fineAmount)
    let updatedTotal = (currentCashFlow.total += fineAmount)

    return {
      ...currentCashFlow,
      missing: updatedMissing,
      total: updatedTotal,
    }
  }

  private setCashFlowOnPaid = async (
    fineAmount: number
  ): Promise<CashFlowT> => {
    const currentCashFlow = await this.getCashFlow()
    let updatedMissing = (currentCashFlow.missing += fineAmount)
    let updatedCollected = (currentCashFlow.collected += fineAmount)

    return {
      ...currentCashFlow,
      missing: updatedMissing,
      collected: updatedCollected,
    }
  }

  private setCashFlowOnDelete = async (
    fineAmount: number,
    isPaid: boolean
  ): Promise<CashFlowT> => {
    const currentCashFlow = await this.getCashFlow()
    let updatedTotal = currentCashFlow.total - fineAmount

    return {
      ...currentCashFlow,
      total: updatedTotal,
      missing: isPaid
        ? currentCashFlow.missing
        : currentCashFlow.missing - fineAmount,
      collected: isPaid
        ? currentCashFlow.collected - fineAmount
        : currentCashFlow.collected,
    }
  }

  private updateCashFlow = async (updatedCashFlow: CashFlowT) => {
    await update(this.dbRef, updatedCashFlow)
  }

  getCashFlow = async (): Promise<CashFlowT> => {
    return await this.getSnapshot(this.dbRef)
  }

  updateOnFineAdd = async (fineAmount: number) => {
    let updatedCashFlow = await this.setCashFlowOnAdd(fineAmount)
    await this.updateCashFlow(updatedCashFlow)
  }

  updateOnFinePaid = async (fineAmount: number) => {
    let updatedCashFlow = await this.setCashFlowOnPaid(fineAmount)
    await this.updateCashFlow(updatedCashFlow)
  }

  updateOnFineDelete = async (fineAmount: number, isPaid: boolean) => {
    let updatedCashFlow = await this.setCashFlowOnDelete(fineAmount, isPaid)
    await this.updateCashFlow(updatedCashFlow)
  }

  calculateCashFlowFromPlayersEntries = async (): Promise<CashFlowT> => {
    const playersC = new PlayerC()
    const players = await playersC.getPlayer()

    let cashFlow: CashFlowT = {
      missing: 0,
      collected: 0,
      total: 0,
    }

    players.forEach((player) => {
      if (!player.finesList) return

      player.finesList.forEach((fine) => {
        const fineAmount = parseInt(fine.penitence.split('€')[0])

        if (isNaN(fineAmount)) return

        if (fine.paid) {
          cashFlow.collected += fineAmount
        } else {
          cashFlow.missing += fineAmount
        }

        cashFlow.total += fineAmount
      })
    })

    return cashFlow
  }
}
