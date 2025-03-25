import { CashC } from '@/lib/firebase/FirebaseUtils'

export async function GET(
  request: Request,
  { params }: { params: { timestamp: string } }
) {
  const cashC = new CashC()
  const cashFlow = await cashC.getCashFlow()

  return new Response(JSON.stringify({ data: cashFlow }))
}
