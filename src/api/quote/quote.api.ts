import { keepPreviousData, skipToken, useQuery } from '@tanstack/react-query'
import { differenceInMilliseconds, parseISO } from 'date-fns'
import { useApiClient } from '../../data-access'
import type { ApiClient } from '../../model'
import type { Quote, QuoteRequest } from './quote.types'
import { quoteKeys } from './quoteKeys'

const getQuote = (client: ApiClient, input: QuoteRequest) =>
  client.post<Quote, QuoteRequest>('quote', input)

const quoteLifetimeMs = (quote: Quote | undefined) =>
  quote ? differenceInMilliseconds(parseISO(quote.expiresAt), parseISO(quote.createdAt)) : false

export const useQuoteQuery = (input: QuoteRequest | undefined) => {
  const client = useApiClient()
  return useQuery({
    queryKey: quoteKeys.detail(input),
    queryFn: input ? () => getQuote(client, input) : skipToken,
    staleTime: 0,
    refetchInterval: (query) => quoteLifetimeMs(query.state.data),
  })
}
