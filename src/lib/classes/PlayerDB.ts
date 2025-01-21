import {
  type DatabaseReference,
  get,
  push,
  ref,
  set,
  update,
} from 'firebase/database'
import { database } from '../firebase/config'
import { type BasePlayer, type FirebasePlayer } from '@/types/player'
import { type PlayerFine } from '@/types/fine'
import { generateRandomStr } from '../utils/helpers'

export class PlayersCollection {
  private playersCollection: string
  private dbRef: DatabaseReference

  constructor() {
    this.playersCollection = process.env.FIREBASE_DB_COLLECTION!
    this.dbRef = ref(database, this.playersCollection)
  }

  private getSnapshot = async (ref: DatabaseReference) => {
    let snapshot = await get(ref)

    return snapshot.exists() ? snapshot.val() : []
  }

  private initPlayerRef = (playerKey: string) => {
    return ref(database, `${this.playersCollection}/${playerKey}`)
  }

  private createPlayer = (playerName: string): FirebasePlayer => ({
    _id: generateRandomStr(16),
    player: playerName,
    finesList: [],
  })

  initPlayers = (players: BasePlayer[]) => {
    players.forEach(async (player) => {
      let newPlayer = this.createPlayer(`${player.lastName}_${player.number}`)
      await this.pushData(newPlayer)
    })
  }

  getEntries = async (): Promise<FirebasePlayer[]> => {
    let players = await this.getSnapshot(this.dbRef)

    return Object.entries(players).map(([key, value]) => ({
      ...(value as FirebasePlayer),
      key,
    })) as FirebasePlayer[]
  }

  pushData = async (data: any) => {
    let dataToPushRef = push(this.dbRef)
    await set(dataToPushRef, data)
  }

  updateFinesList = async (playerKey: string, newFine: PlayerFine) => {
    const playerRef = this.initPlayerRef(playerKey)
    const playerData = (await this.getSnapshot(playerRef)) as FirebasePlayer

    let currentFinesList = playerData.finesList || []
    let updatedFinesList = [...currentFinesList, newFine]

    await update(playerRef, { finesList: updatedFinesList })
  }

  getFinesListByKey = async (playerKey: string) => {
    const playerRef = this.initPlayerRef(playerKey)
    const playerData = (await this.getSnapshot(playerRef)) as FirebasePlayer

    return playerData.finesList || []
  }

  getFine = async (playerKey: string, fineObjId: string): Promise<PlayerFine | undefined> => {
    const finesList = await this.getFinesListByKey(playerKey)
    let fineIndex = finesList.findIndex((fine) => fine._id === fineObjId)

    if (fineIndex === -1) return

    return finesList[fineIndex]
  }

  convertToPaid = async (playerKey: string, fineObjId: string)=> {
    const playerRef = this.initPlayerRef(playerKey)
    const playerData = (await this.getSnapshot(playerRef)) as FirebasePlayer

    let finesList = playerData.finesList || []
    let fineIndex = finesList.findIndex((fine) => fine._id === fineObjId)

    if (fineIndex === -1) return

    finesList[fineIndex].paid = true

    await update(playerRef, { finesList })
  }

  deleteFine = async (playerKey: string, fineObjId: string) => {
    const playerRef = this.initPlayerRef(playerKey)
    const playerData = (await this.getSnapshot(playerRef)) as FirebasePlayer

    let finesList = playerData.finesList || []
    let fineIndex = finesList.findIndex((fine) => fine._id === fineObjId)

    if (fineIndex === -1) return

    let updatedFinesList = finesList.filter((fine, index) => index !== fineIndex)

    await update(playerRef, { finesList: updatedFinesList })
  }
}
