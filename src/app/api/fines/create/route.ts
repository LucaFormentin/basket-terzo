import { FineC } from '@/lib/classes/Fine'
import { generateRandomStr } from '@/lib/utils/helpers'

export async function POST(req: Request) {
  const data = (await req.json()) as {
    name: string
    penitence: string
  }

  const fineToPush = {
    fineId: generateRandomStr(16),
    ...data,
  }
  const finesC = new FineC()
  await finesC.addFine(fineToPush)

  return Response.json({ data: 'Nuova multa creata!' })
}
