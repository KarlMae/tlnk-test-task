import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../model'
import { createHttpClient } from './apiClient'

const fetchMock = vi.fn<typeof fetch>()

const createJsonResponse = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: { 'Content-Type': 'application/json' },
  })

const quoteRequest = { from: 'EUR', to: 'USD', amount: 1 }

describe('createHttpClient', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    fetchMock.mockReset()
    vi.unstubAllGlobals()
  })

  describe.each([
    {
      method: 'get',
      send: () => createHttpClient().get('rates'),
      expectedUrl: '/api/rates',
      expectedInit: { method: 'GET', headers: undefined, body: undefined },
    },
    {
      method: 'post',
      send: () => createHttpClient().post('quote', quoteRequest),
      expectedUrl: '/api/quote',
      expectedInit: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteRequest),
      },
    },
  ])('$method', ({ send, expectedUrl, expectedInit }) => {
    it('should send the request to the api base path', async () => {
      fetchMock.mockResolvedValue(createJsonResponse({ ok: true }))

      await send()

      expect(fetchMock).toHaveBeenCalledWith(expectedUrl, expectedInit)
    })

    it('should resolve with the parsed JSON body', async () => {
      fetchMock.mockResolvedValue(createJsonResponse({ currencies: ['EUR'] }))

      await expect(send()).resolves.toEqual({ currencies: ['EUR'] })
    })

    it('should resolve with undefined for a non-JSON body', async () => {
      fetchMock.mockResolvedValue(new Response('plain text'))

      await expect(send()).resolves.toBeUndefined()
    })

    it('should reject with the error message from the body', async () => {
      fetchMock.mockResolvedValue(
        createJsonResponse({ error: 'Unknown currency' }, { status: 400 }),
      )

      const error = await send().catch((e: unknown) => e)

      expect(error).toBeInstanceOf(ApiError)
      expect(error).toMatchObject({
        status: 400,
        message: 'Unknown currency',
        body: { error: 'Unknown currency' },
      })
    })

    it('should reject with the status text when the body has no error message', async () => {
      fetchMock.mockResolvedValue(new Response(null, { status: 503, statusText: 'Unavailable' }))

      await expect(send()).rejects.toMatchObject({
        status: 503,
        message: 'Unavailable',
      })
    })
  })
})
