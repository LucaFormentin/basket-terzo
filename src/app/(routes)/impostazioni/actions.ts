import { PlayersCollection } from "@/lib/classes/PlayerDB"
import type { CashFlowT } from "@/types/player"

export const getCashFlow = async (): Promise<CashFlowT> => {
  const playersCollection = new PlayersCollection()
  const playersData = await playersCollection.getEntries()

  const cashFlow = playersData.reduce<CashFlowT>(
    (acc, player) => {
      if (!player.finesList) return acc

      player.finesList.forEach((fine) => {
        const fineAmount = parseInt(fine.penitence.split('€')[0])

        if (isNaN(fineAmount)) return

        if (fine.paid) {
          acc.collectedCash += fineAmount
        } else {
          acc.missingCash += fineAmount
        }

        acc.totalCash += fineAmount
      })

      return acc
    },
    { missingCash: 0, collectedCash: 0, totalCash: 0 }
  )

  return cashFlow
}