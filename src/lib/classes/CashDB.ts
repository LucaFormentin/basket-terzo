import { get, ref, update, type DatabaseReference } from 'firebase/database'
import { database } from '../firebase/config'
import { type CashFlowT } from '@/types/player'
import { PlayersCollection } from './PlayerDB'

export class CashCollection {
  private cashCollection: string
  private dbRef: DatabaseReference

  constructor() {
    this.cashCollection = process.env.FIREBASE_DB_COLLECTION_CASH!
    this.dbRef = ref(database, this.cashCollection)
  }

  private getSnapshot = async (ref: DatabaseReference) => {
    let snapshot = await get(ref)

    return snapshot.exists() ? snapshot.val() : []
  }

  getCashFlow = async (): Promise<CashFlowT> => {
    let entries = await this.getSnapshot(this.dbRef)

    return entries
  }

  calculateCashFlowFromPlayersEntries = async (): Promise<CashFlowT> => {
    const playersCollection = new PlayersCollection()
      const playersData = await playersCollection.getEntries()
    
      const cashFlow: CashFlowT = { missing: 0, collected: 0, total: 0 }
    
      playersData.forEach((player) => {
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

  updateOnNewFineAdd = async (newFineAmount: number) => {
    const currentCashFlow = await this.getCashFlow()
    let updatedMissing = (currentCashFlow.missing += newFineAmount)
    let updatedTotal = (currentCashFlow.total += newFineAmount)

    await update(this.dbRef, {
      ...currentCashFlow,
      total: updatedTotal,
      missing: updatedMissing,
    })
  }

  updateOnFinePaid = async (fineAmount: number) => {
    const currentCashFlow = await this.getCashFlow()
    let updatedMissing = currentCashFlow.missing - fineAmount
    let updatedCollected = (currentCashFlow.collected += fineAmount)

    await update(this.dbRef, {
      ...currentCashFlow,
      missing: updatedMissing,
      collected: updatedCollected,
    })
  }

  updateOnFineDeleted = async (fineAmount: number, isPaid: boolean) => {
    const currentCashFlow = await this.getCashFlow()
    let updatedTotal = currentCashFlow.total - fineAmount

    await update(this.dbRef, {
      ...currentCashFlow,
      total: updatedTotal,
      missing: isPaid
        ? currentCashFlow.missing
        : currentCashFlow.missing - fineAmount,
      collected: isPaid
        ? currentCashFlow.collected - fineAmount
        : currentCashFlow.collected,
    })
  }
}
