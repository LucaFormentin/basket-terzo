import { FinesCollection } from '@/lib/classes/FineDB'

export async function GET(
  request: Request,
  { params }: { params: { fineId: string } }
) {  
  const finesCollection = new FinesCollection()
  await finesCollection.deleteData(params.fineId)
  
  return Response.json({ data: 'Multa eliminata!' })
}
