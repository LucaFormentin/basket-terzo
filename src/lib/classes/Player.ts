import { DatabaseReference, ref, update } from 'firebase/database'
import {
  type FirebasePlayer,
  FirebasePlayerListSchema,
  type PlayerBaseInfo,
} from '@/types/player'
import { generateRandomStr } from '../utils/helpers'
import { type PlayerFine } from '@/types/fine'
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
