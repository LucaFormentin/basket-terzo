import { FinesCollection } from '@/lib/classes/FineDB'

export async function GET(request: Request) {
  const finesCollection = new FinesCollection()
  const fines = await finesCollection.getEntries()

  return Response.json({ finesList: fines || [] })
}
