import {
  type DatabaseReference,
  get,
  push,
  ref,
  set,
  update,
} from 'firebase/database'
import { database } from '../firebase/config'
import type { PlayerBaseInfo, FirebasePlayer } from '@/types/player'
import { type PlayerFine } from '@/types/fine'
import { generateRandomStr } from '../utils/helpers'

// DA TESTARE IL PORTING DI QUESTA CLASSE
export class PlayersCollection {
  private playersCollection: string
  private dbRef: DatabaseReference

  constructor() {
    this.playersCollection = process.env.FIREBASE_DB_COLLECTION!
    this.dbRef = ref(database, this.playersCollection)
  }

  // ok
  private getSnapshot = async (ref: DatabaseReference) => {
    let snapshot = await get(ref)

    return snapshot.exists() ? snapshot.val() : []
  }

  // ok
  private initPlayerRef = (playerKey: string) => {
    return ref(database, `${this.playersCollection}/${playerKey}`)
  }

  // ok
  getEntries = async (): Promise<FirebasePlayer[]> => {
    let players = await this.getSnapshot(this.dbRef)

    return Object.entries(players).map(([key, value]) => ({
      ...(value as FirebasePlayer),
      key,
    })) as FirebasePlayer[]
  }

  // ok
  pushData = async (data: any) => {
    let dataToPushRef = push(this.dbRef)
    await set(dataToPushRef, data)
  }

  // ok
  private initPlayerData = (data: PlayerBaseInfo): FirebasePlayer => ({
    ...data,
    _id: generateRandomStr(16),
    finesList: [],
    key: null,
  })

  // ok
  createPlayer = async (playerData: PlayerBaseInfo) => {
    const pData = this.initPlayerData(playerData)
    await this.pushData(pData)
  }

  // ok
  updateFinesList = async (playerKey: string, newFine: PlayerFine) => {
    const playerRef = this.initPlayerRef(playerKey)
    const playerData = (await this.getSnapshot(playerRef)) as FirebasePlayer

    let currentFinesList = playerData.finesList || []
    let updatedFinesList = [...currentFinesList, newFine]

    await update(playerRef, { finesList: updatedFinesList })
  }

  // ok
  getFinesListByKey = async (playerKey: string) => {
    const playerRef = this.initPlayerRef(playerKey)
    const playerData = (await this.getSnapshot(playerRef)) as FirebasePlayer

    return playerData.finesList || []
  }

  // ok
  getFine = async (
    playerKey: string,
    fineObjId: string
  ): Promise<PlayerFine | undefined> => {
    const finesList = await this.getFinesListByKey(playerKey)
    let fineIndex = finesList.findIndex((fine) => fine._id === fineObjId)

    if (fineIndex === -1) return

    return finesList[fineIndex]
  }

  // ok
  convertToPaid = async (playerKey: string, fineObjId: string) => {
    const playerRef = this.initPlayerRef(playerKey)
    const playerData = (await this.getSnapshot(playerRef)) as FirebasePlayer

    let finesList = playerData.finesList || []
    let fineIndex = finesList.findIndex((fine) => fine._id === fineObjId)

    if (fineIndex === -1) return

    finesList[fineIndex].paid = true

    await update(playerRef, { finesList })
  }

  // ok
  deleteFine = async (playerKey: string, fineObjId: string) => {
    const playerRef = this.initPlayerRef(playerKey)
    const playerData = (await this.getSnapshot(playerRef)) as FirebasePlayer

    let finesList = playerData.finesList || []
    let fineIndex = finesList.findIndex((fine) => fine._id === fineObjId)

    if (fineIndex === -1) return

    let updatedFinesList = finesList.filter(
      (fine, index) => index !== fineIndex
    )

    await update(playerRef, { finesList: updatedFinesList })
  }
}
