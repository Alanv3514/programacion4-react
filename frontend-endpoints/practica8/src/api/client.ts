const API_URL = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'DELETE'
  body?: unknown
}

let onUnauthorized = () => {}

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler
}

function readDetail(text: string, status: number): string {
  try {
    const { detail } = JSON.parse(text)
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) {
      return detail
        .map((e: { loc: unknown[]; msg: string }) => `${e.loc.at(-1)}: ${e.msg}`)
        .join('; ')
    }
  } catch {
  }
  return text || `Error ${status}`
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {}
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    })
  } catch {
    throw new ApiError(
      0,
      'No se pudo conectar con la API. Si estaba andando, probablemente respondió ' +
        'un error 500: revisen la terminal de uvicorn.',
    )
  }

  const text = await response.text()
  if (!response.ok) {
    if (response.status === 401 && token) onUnauthorized()
    throw new ApiError(response.status, readDetail(text, response.status))
  }
  return JSON.parse(text) as T
}
