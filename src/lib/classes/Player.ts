import { DatabaseReference, ref, remove, set, update } from 'firebase/database'
import {
  type FirebasePlayer,
  FirebasePlayerListSchema,
  type PlayerBaseInfo,
} from '@/types/player'
import { generateRandomStr } from '../utils/helpers'
import { PlayerFineSchema, type PlayerFine } from '@/types/fine'
import { FirebaseUtils } from '../firebase/FirebaseUtils'

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

  private getPlayerFinesEntries = async () => {
    const playerData = (await this.getSnapshot(this.playerRef)) as {
      finesList?: unknown
    }
    const rawFines = playerData.finesList

    if (!rawFines || typeof rawFines !== 'object') return []

    return Object.entries(rawFines).map(([storageKey, value]) => {
      const parsedFine = PlayerFineSchema.safeParse(value)

      if (!parsedFine.success) throw new Error(parsedFine.error.message)

      return { storageKey, fine: parsedFine.data }
    })
  }

  private findFineEntryById = async (fineId: string) => {
    const entries = await this.getPlayerFinesEntries()
    return entries.find(({ fine }) => fine._id === fineId) ?? null
  }

  getPlayerFinesList = async (): Promise<PlayerFine[]> => {
    const entries = await this.getPlayerFinesEntries()
    return entries.map(({ fine }) => fine)
  }

  getFineById = async (fineId: string): Promise<PlayerFine | null> => {
    const entry = await this.findFineEntryById(fineId)
    return entry?.fine ?? null
  }

  addFine = async (newFineData: PlayerFine) => {
    const fineRef = ref(
      this.db,
      `${this.coll}/${this.playerKey}/finesList/${newFineData._id}`
    )
    await set(fineRef, newFineData)
  }

  deleteFine = async (fineId: string) => {
    const entry = await this.findFineEntryById(fineId)

    if (!entry) return false

    const fineRef = ref(
      this.db,
      `${this.coll}/${this.playerKey}/finesList/${entry.storageKey}`
    )
    await remove(fineRef)

    return true
  }

  convertToPaid = async (fineId: string) => {
    const entry = await this.findFineEntryById(fineId)

    if (!entry) return null
    if (entry.fine.paid) return entry.fine

    const paidFine = { ...entry.fine, paid: true }

    if (entry.storageKey === fineId) {
      const fineRef = ref(
        this.db,
        `${this.coll}/${this.playerKey}/finesList/${fineId}`
      )
      await set(fineRef, paidFine)
    } else {
      await update(this.playerRef, {
        [`finesList/${entry.storageKey}`]: null,
        [`finesList/${fineId}`]: paidFine,
      })
    }

    return paidFine
  }
}
