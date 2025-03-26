import { CashC } from '@/lib/classes/Cash'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ timestamp: string }> }
) {
  const cashC = new CashC()
  const cashFlow = await cashC.getCashFlow()

  return new Response(JSON.stringify({ data: cashFlow }))
}
