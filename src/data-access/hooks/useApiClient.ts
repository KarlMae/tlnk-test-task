import { useMemo } from 'react'
import { createHttpClient } from '../clients/apiClient.ts'

export const useApiClient = () => useMemo(() => createHttpClient(), [])
