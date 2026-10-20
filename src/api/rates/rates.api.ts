import { useQuery } from '@tanstack/react-query'
import { useApiClient } from '../../data-access'
import { ApiClient } from '../../model'
import { RatesResponse } from './rates.types.ts'
import { ratesKeys } from './ratesKeys.ts'

const getRates = (client: ApiClient) => client.get<RatesResponse>('rates')

export const useRatesQuery = () => {
  const client = useApiClient()
  return useQuery({
    queryKey: ratesKeys.all(),
    queryFn: () => getRates(client),
  })
}
