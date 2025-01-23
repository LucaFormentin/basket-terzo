import { PlayersCollection } from "@/lib/classes/PlayerDB"
import { PlayerBaseInfo } from "@/types/player"

export async function POST(req: Request) {
  const newPlayerData = (await req.json()) as PlayerBaseInfo
  const playersCollection = new PlayersCollection()

  await playersCollection.createPlayer(newPlayerData)

  return Response.json({ data: 'Nuovo giocatore aggiunto!' })
}
