import { PlayersCollection } from '@/lib/classes/PlayerDB'

export async function GET(
  request: Request,
  { params }: { params: { playerKey: string } }
) {
  const playerFirebaseKey = params.playerKey
  const { searchParams } = new URL(request.url)
  const fineObjId = searchParams.get('fineObjId') as string

  const playersCollection = new PlayersCollection()
  await playersCollection.convertToPaid(playerFirebaseKey, fineObjId)

  return Response.json({ data: 'Multa pagata' })
}
