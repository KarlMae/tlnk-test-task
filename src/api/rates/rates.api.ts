import { useQuery } from '@tanstack/react-query'
import { useApiClient } from '../../data-access'
import type { ApiClient } from '../../model'
import type { RatesResponse } from './rates.types'
import { ratesKeys } from './ratesKeys'

const getRates = (client: ApiClient) => client.get<RatesResponse>('rates')

export const useRatesQuery = () => {
  const client = useApiClient()
  return useQuery({
    queryKey: ratesKeys.all(),
    queryFn: () => getRates(client),
  })
}
