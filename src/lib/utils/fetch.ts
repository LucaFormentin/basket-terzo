export default async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init)
  return res.json()
}

const getResponse = async (res: Response) => {
  if (!res.ok) throw new Error(`Failed to fetch api: ${res.url}`)

  const data = await res.json()

  return data
}

export const fetchGET = async (route: string) => {
  const res = await fetch(route)

  return await getResponse(res)
}

export const fetchPOST = async (route: string, event: unknown) => {
  const res = await fetch(route, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  })

  return await getResponse(res)
}
