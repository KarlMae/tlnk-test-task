import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { ApiError } from '../model/apiError.ts'

const MAX_QUERY_RETRIES = 3

const isClientError = (error: Error) => error instanceof ApiError && error.status < 500

const shouldRetryQuery = (failureCount: number, error: Error) =>
  failureCount < MAX_QUERY_RETRIES && !isClientError(error)

const reportError = (error: Error) => console.error(error)

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: reportError }),
  mutationCache: new MutationCache({ onError: reportError }),
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: shouldRetryQuery,
    },
    mutations: {
      retry: 0,
    },
  },
})
