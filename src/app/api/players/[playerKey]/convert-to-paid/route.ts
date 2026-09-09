import { PlayerFinesC } from "@/lib/classes/Player"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ playerKey: string }> }
) {
  const { playerKey: playerFirebaseKey } = await params
  const { searchParams } = new URL(request.url)
  const fineObjId = searchParams.get('fineObjId') as string

  // update player's fines list
  const playersC = new PlayerFinesC(playerFirebaseKey)
  await playersC.convertToPaid(fineObjId)

  return Response.json({ data: 'Multa pagata' })
}
