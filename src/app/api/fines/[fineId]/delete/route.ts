import { FineC } from '@/lib/classes/Fine'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ fineId: string }> }
) {
  const { fineId } = await params

  const finesC = new FineC()
  await finesC.deleteFine(fineId)

  return Response.json({ data: 'Multa eliminata!' })
}
