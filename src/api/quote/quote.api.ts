import { skipToken, useQuery } from '@tanstack/react-query'
import { useApiClient } from '../../data-access'
import type { ApiClient } from '../../model'
import type { Quote, QuoteRequest } from './quote.types'
import { quoteKeys } from './quoteKeys'

const getQuote = (client: ApiClient, input: QuoteRequest) =>
  client.post<Quote, QuoteRequest>('quote', input)

export const useQuoteQuery = (input: QuoteRequest | undefined) => {
  const client = useApiClient()
  return useQuery({
    queryKey: quoteKeys.detail(input),
    queryFn: input ? () => getQuote(client, input) : skipToken,
    staleTime: 0,
  })
}
