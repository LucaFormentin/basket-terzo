type RequestOptions = {
  method?: string
  headers?: Record<string, string>
  body?: any
  cookie?: string
  params?: Record<string, string | number | boolean | undefined | null>
  cache?: RequestCache
  next?: NextFetchRequestConfig
}

/**
 * Builds a URL with query parameters.
 *
 * @param url - The base URL.
 * @param params - The query parameters.
 * @returns The URL with query parameters.
 */
const buildUrlWithParams = (
  url: string,
  params?: RequestOptions['params']
): string => {
  if (!params) return url

  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null
    )
  )

  if (Object.keys(filteredParams).length === 0) return url

  const queryString = new URLSearchParams(
    filteredParams as Record<string, string>
  ).toString()

  return `${url}?${queryString}`
}

/**
 * Makes an API request using the fetch function.
 *
 * @template T - The type of the response data.
 * @param {string} url - The URL to make the request to.
 * @param {RequestOptions} [options={}] - The options for the request.
 * @returns {Promise<T>} - A promise that resolves to the response data.
 * @throws {Error} - If the response is not successful, an error is thrown with the error message.
 */
const fetchApi = async <T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { method, body, params } = options
  const fullUrl = buildUrlWithParams(`/api/${url}`, params)

  const response = await fetch(fullUrl, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: options.cookie ? 'include' : 'omit',
    cache: options.cache,
  })

  if (!response.ok) {
    let errMsg = (await response.json()).message || response.statusText
    throw new Error(errMsg)
  }

  return response.json()
}

export const api = {
  get<T>(url: string, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'GET' })
  },
  post<T>(url: string, body: any, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'POST', body })
  },
}
