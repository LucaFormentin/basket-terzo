import { CashCollection } from '@/lib/classes/CashDB'
import { PlayersCollection } from '@/lib/classes/PlayerDB'

export async function GET(
  request: Request,
  { params }: { params: { playerKey: string } }
) {
  const playerFirebaseKey = params.playerKey
  const { searchParams } = new URL(request.url)
  const fineObjId = searchParams.get('fineObjId') as string

  // update player's fines list
  const playersCollection = new PlayersCollection()

  const updatedFine = await playersCollection.getFine(
    playerFirebaseKey,
    fineObjId
  )
  const { penitence, paid } = updatedFine!
  const fineAmount = parseInt(penitence.split('€')[0])

  await playersCollection.deleteFine(playerFirebaseKey, fineObjId)

  // update cash flow
  const cashCollection = new CashCollection()
  await cashCollection.updateOnFineDeleted(fineAmount, paid)
  
  return Response.json({ data: 'Multa eliminata' })
}
