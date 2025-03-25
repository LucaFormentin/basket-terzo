import { PlayerC } from "@/lib/classes/Player"

export async function GET(request: Request) {
  const playersC = new PlayerC()
  const players = await playersC.getPlayer()

  return Response.json({ data: players || [] })
}
