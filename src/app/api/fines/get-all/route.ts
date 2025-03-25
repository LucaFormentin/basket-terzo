import { FineC } from "@/lib/classes/Fine"

export async function GET(request: Request) {
  const finesC = new FineC()
  const fines = await finesC.getFines()

  return Response.json({ finesList: fines || [] })
}
