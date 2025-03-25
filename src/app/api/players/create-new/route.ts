import { PlayerC } from "@/lib/classes/Player"
import { PlayerBaseInfo } from "@/types/player"

export async function POST(req: Request) {
  const newPlayerData = (await req.json()) as PlayerBaseInfo
  const playersC = new PlayerC()

  await playersC.createPlayer(newPlayerData)

  return Response.json({ data: 'Nuovo giocatore aggiunto!' })
}
