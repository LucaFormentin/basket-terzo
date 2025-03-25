import { DatabaseReference, update } from 'firebase/database'
import { CashFlowT } from '@/types/player'
import { FirebaseUtils } from '../firebase/FirebaseUtils'
import { PlayerC } from './Player'

export class CashC extends FirebaseUtils {
  private coll: string
  private dbRef: DatabaseReference

  constructor() {
    super()
    this.coll = process.env.FIREBASE_DB_COLLECTION_CASH!
    this.dbRef = this.createDbRef(this.coll)
  }

  private setCashFlowOnAdd = async (fineAmount: number): Promise<CashFlowT> => {
    const currentCashFlow = await this.getCashFlow()
    let updatedMissing = (currentCashFlow.missing += fineAmount)
    let updatedTotal = (currentCashFlow.total += fineAmount)

    return {
      ...currentCashFlow,
      missing: updatedMissing,
      total: updatedTotal,
    }
  }

  private setCashFlowOnPaid = async (
    fineAmount: number
  ): Promise<CashFlowT> => {
    const currentCashFlow = await this.getCashFlow()
    let updatedMissing = (currentCashFlow.missing += fineAmount)
    let updatedCollected = (currentCashFlow.collected += fineAmount)

    return {
      ...currentCashFlow,
      missing: updatedMissing,
      collected: updatedCollected,
    }
  }

  private setCashFlowOnDelete = async (
    fineAmount: number,
    isPaid: boolean
  ): Promise<CashFlowT> => {
    const currentCashFlow = await this.getCashFlow()
    let updatedTotal = currentCashFlow.total - fineAmount

    return {
      ...currentCashFlow,
      total: updatedTotal,
      missing: isPaid
        ? currentCashFlow.missing
        : currentCashFlow.missing - fineAmount,
      collected: isPaid
        ? currentCashFlow.collected - fineAmount
        : currentCashFlow.collected,
    }
  }

  private updateCashFlow = async (updatedCashFlow: CashFlowT) => {
    await update(this.dbRef, updatedCashFlow)
  }

  getCashFlow = async (): Promise<CashFlowT> => {
    return await this.getSnapshot(this.dbRef)
  }

  updateOnFineAdd = async (fineAmount: number) => {
    let updatedCashFlow = await this.setCashFlowOnAdd(fineAmount)
    await this.updateCashFlow(updatedCashFlow)
  }

  updateOnFinePaid = async (fineAmount: number) => {
    let updatedCashFlow = await this.setCashFlowOnPaid(fineAmount)
    await this.updateCashFlow(updatedCashFlow)
  }

  updateOnFineDelete = async (fineAmount: number, isPaid: boolean) => {
    let updatedCashFlow = await this.setCashFlowOnDelete(fineAmount, isPaid)
    await this.updateCashFlow(updatedCashFlow)
  }

  calculateCashFlowFromPlayersEntries = async (): Promise<CashFlowT> => {
    const playersC = new PlayerC()
    const players = await playersC.getPlayer()

    let cashFlow: CashFlowT = {
      missing: 0,
      collected: 0,
      total: 0,
    }

    players.forEach((player) => {
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
}
