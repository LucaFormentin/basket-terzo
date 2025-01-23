import { Database } from 'firebase/database'
import { database } from './config'

export class FirebaseUtils {
  protected db: Database

  constructor() {
    this.db = database
  }

  protected getSnapshot = async () => {}

  protected pushData = async () => {}

  protected getData = async () => {}
}
