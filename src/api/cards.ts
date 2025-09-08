interface Card {
  phone_fmt: 'string'
  phone_raw: 'string'
  uuid: '095be615-a8ad-4c33-8e9c-c7612fbf6c9f'
  created_at: '2019-08-24T14:15:22Z'
  updated_at: '2019-08-24T14:15:22Z'
  public: false
  company: 'string'
  name: 'string'
  job_title: 'string'
  email: 'string'
  picture: 'string'
  location: 'string'
  bio: 'string'
  website: 'string'
  slug: 'string'
}

interface Response {
  count: number
  items: Card[]
}

function buildUrl(url: string, params?: Record<string, string | number | boolean>): string {
  if (!params) return url
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    searchParams.append(key, String(value))
  }
  return `${url}?${searchParams.toString()}`
}

async function fetchWithTimeout<T>(
  url: string,
  {
    method = 'GET',
    params,
    body,
    headers,
    timeoutMs = 5000,
  }: {
    method?: string
    params?: Record<string, string | number | boolean>
    body?: object
    headers?: Record<string, string>
    timeoutMs?: number
  } = {},
): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const fullUrl = buildUrl(url, params)

    const response = await fetch(fullUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = (await response.json()) as T
    return data
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timed out')
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

export function listCards(limit: number, offset: number) {
  return await fetchWithTimeout<{ items: string[] }>('https://api.example.com/search', {
    params: { limit: limit, offset: offset },
  })
}
