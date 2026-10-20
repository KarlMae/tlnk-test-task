import { skipToken, useQuery } from '@tanstack/react-query'
import { useApiClient } from '../../data-access/hooks/useApiClient.ts'
import { ApiClient } from '../../model/apiClient.ts'
import { Quote, QuoteRequest } from './quote.types.ts'
import { quoteKeys } from './quoteKeys.ts'

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
