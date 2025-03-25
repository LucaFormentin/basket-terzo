import { DatabaseReference, ref, remove } from 'firebase/database'
import { type FirebaseFine, FirebaseFineListSchema } from '@/types/fine'
import { FirebaseUtils } from '../firebase/FirebaseUtils'

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
