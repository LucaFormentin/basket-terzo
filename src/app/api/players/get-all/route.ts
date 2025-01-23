import { PlayersCollection } from '@/lib/classes/PlayerDB'

export async function GET(request: Request) {
  const playersCollection = new PlayersCollection()
  const players = await playersCollection.getEntries()

  return Response.json({ data: players || [] })
}
