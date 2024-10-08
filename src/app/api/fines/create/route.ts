import { FinesCollection } from '@/lib/classes/FineDB'
import { generateRandomStr } from '@/lib/utils/helpers'

export async function POST(req: Request) {
  const data = (await req.json()) as {
    name: string
    penitence: string
  }

  const fineToPush = {
    _id: generateRandomStr(16),
    ...data,
  }

  const finesCollection = new FinesCollection()
  await finesCollection.pushData(fineToPush)

  return Response.json({ data: 'Nuova multa creata!' })
}
