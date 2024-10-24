import { getCashFlow } from '@/app/(routes)/lista-multe/actions'

export async function GET(request: Request) {
  const cashFlow = await getCashFlow()

  return new Response(
    JSON.stringify({ data: cashFlow }),
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    }
  );
  
}
