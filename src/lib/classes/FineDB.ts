import { get, push, ref, set, type DatabaseReference } from 'firebase/database'
import { database } from '../firebase/config'
import { type FirebaseFine } from '@/types/fine'

export class FinesCollection {
  private playersCollection: string
  private dbRef: DatabaseReference

  constructor() {
    this.playersCollection = process.env.FIREBASE_DB_COLLECTION_FINES!
    this.dbRef = ref(database, this.playersCollection)
  }

  private getSnapshot = async (ref: DatabaseReference) => {
    let snapshot = await get(ref)

    return snapshot.exists() ? snapshot.val() : []
  }

  getEntries = async (): Promise<FirebaseFine[]> => {
    let fines = await this.getSnapshot(this.dbRef)

    return Object.entries(fines).map(([key, value]) => ({
      ...(value as FirebaseFine),
      key,
    })) as FirebaseFine[]
  }

  pushData = async (data: any) => {
    let dataToPushRef = push(this.dbRef)
    await set(dataToPushRef, data)
  }
}
