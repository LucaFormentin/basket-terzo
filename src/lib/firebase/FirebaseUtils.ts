import {
  Database,
  DatabaseReference,
  get,
  push,
  ref,
  set,
} from 'firebase/database'
import { database } from './config'

export class FirebaseUtils {
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
