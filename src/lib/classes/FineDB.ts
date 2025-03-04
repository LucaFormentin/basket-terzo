import { get, push, ref, remove, set, type DatabaseReference } from 'firebase/database'
import { database } from '../firebase/config'
import { type FirebaseFine } from '@/types/fine'

export class FinesCollection {
  private finesCollection: string
  private dbRef: DatabaseReference

  constructor() {
    this.finesCollection = process.env.FIREBASE_DB_COLLECTION_FINES!
    this.dbRef = ref(database, this.finesCollection)
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

  deleteData = async (fineId: string) => {
    let fines = await this.getSnapshot(this.dbRef)

    let fineKey = Object.keys(fines).find((key) => {
      let currentFine: FirebaseFine = fines[key]
      return currentFine.fineId === fineId
    })

    if (fineKey) {
      let fineRef = ref(database, `${this.finesCollection}/${fineKey}`)
      await remove(fineRef)
    } else {
      console.log('Multa non trovata!')
    }
  }
}
