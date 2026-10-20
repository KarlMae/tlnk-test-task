import { ApiClient } from '../../model'
import { ApiError } from '../../model'

const API_BASE_URL = '/api'

type HttpMethod = 'GET' | 'POST'

const isJsonResponse = (response: Response) =>
  response.headers.get('Content-Type')?.startsWith('application/json') ?? false

const readBody = (response: Response): Promise<unknown> =>
  isJsonResponse(response) ? response.json() : Promise.resolve(undefined)

const hasErrorMessage = (body: unknown): body is { error: string } =>
  typeof body === 'object' && body !== null && 'error' in body && typeof body.error === 'string'

const errorMessageFrom = (body: unknown, response: Response) =>
  hasErrorMessage(body) ? body.error : response.statusText

export const createHttpClient = (): ApiClient => {
  const request = async <T>(method: HttpMethod, path: string, body?: unknown): Promise<T> => {
    const hasBody = body !== undefined
    const response = await fetch(`${API_BASE_URL}/${path}`, {
      method,
      headers: hasBody ? { 'Content-Type': 'application/json' } : undefined,
      body: hasBody ? JSON.stringify(body) : undefined,
    })
    const responseBody = await readBody(response)
    if (!response.ok) {
      throw new ApiError(response.status, errorMessageFrom(responseBody, response), responseBody)
    }
    return responseBody as T
  }

  return {
    get: <T>(path: string) => request<T>('GET', path),
    post: <T, U>(path: string, body: U) => request<T>('POST', path, body),
  }
}
