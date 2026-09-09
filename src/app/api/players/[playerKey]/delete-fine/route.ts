import { PlayerFinesC } from "@/lib/classes/Player"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ playerKey: string }> }
) {
  const { playerKey: playerFirebaseKey } = await params
  const { searchParams } = new URL(request.url)
  const fineObjId = searchParams.get('fineObjId') as string

  // update player's fines list
  const playerFinesC = new PlayerFinesC(playerFirebaseKey)

  await playerFinesC.deleteFine(fineObjId)
  
  return Response.json({ data: 'Multa eliminata' })
}
