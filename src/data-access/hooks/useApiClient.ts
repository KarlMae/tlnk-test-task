import { createContext, use } from 'react'
import type { ApiClient } from '../../model'
import { createHttpClient } from '../clients/apiClient'

export const ApiClientContext = createContext<ApiClient>(createHttpClient())

export const useApiClient = () => use(ApiClientContext)
