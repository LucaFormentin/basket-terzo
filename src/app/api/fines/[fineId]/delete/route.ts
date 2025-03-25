import { FineC } from '@/lib/firebase/FirebaseUtils'

export async function GET(
  request: Request,
  { params }: { params: { fineId: string } }
) {
  const finesC = new FineC()
  await finesC.deleteFine(params.fineId)
  
  return Response.json({ data: 'Multa eliminata!' })
}
