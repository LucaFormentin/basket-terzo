import { CashCollection } from '@/lib/classes/CashDB'

export async function GET(
  request: Request,
  { params }: { params: { timestamp: string } }
) {
  const cashCollection = new CashCollection()
  const cashFlow = await cashCollection.getCashFlow()

  return new Response(JSON.stringify({ data: cashFlow }))
}
