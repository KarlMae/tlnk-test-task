import { useMemo } from 'react'
import { createHttpClient } from '../clients/apiClient'

export const useApiClient = () => useMemo(() => createHttpClient(), [])
