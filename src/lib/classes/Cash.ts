import { type CashFlowT, type FirebasePlayer } from '@/types/player'
import { PlayerC } from './Player'

export const calculateCashFlow = (
  players: Pick<FirebasePlayer, 'finesList'>[]
): CashFlowT => {
  const cashFlow: CashFlowT = {
    missing: 0,
    collected: 0,
    total: 0,
  }

  players.forEach((player) => {
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

export class CashC {
  calculateCashFlowFromPlayersEntries = async (): Promise<CashFlowT> => {
    const playersC = new PlayerC()
    const players = await playersC.getPlayer()
    return calculateCashFlow(players)
  }
}
