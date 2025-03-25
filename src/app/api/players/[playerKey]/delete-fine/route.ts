import { CashC, PlayerFinesC } from '@/lib/firebase/FirebaseUtils'

export async function GET(
  request: Request,
  { params }: { params: { playerKey: string } }
) {
  const playerFirebaseKey = params.playerKey
  const { searchParams } = new URL(request.url)
  const fineObjId = searchParams.get('fineObjId') as string

  // update player's fines list
  const playerFinesC = new PlayerFinesC(playerFirebaseKey)

  const updatedFine = await playerFinesC.getFineById(fineObjId)
  const { penitence, paid } = updatedFine!
  const fineAmount = parseInt(penitence.split('€')[0])

  await playerFinesC.deleteFine(fineObjId)

  // update cash flow
  const cashC = new CashC()
  await cashC.updateOnFineDelete(fineAmount, paid)
  
  return Response.json({ data: 'Multa eliminata' })
}
