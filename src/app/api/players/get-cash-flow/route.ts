import { PlayersCollection } from '@/lib/classes/PlayerDB'

export type CashFlowT = {
  missingCash: number
  collectedCash: number
  totalCash: number
}

export async function GET(request: Request) {
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

  return Response.json({ data: cashFlow })
}
