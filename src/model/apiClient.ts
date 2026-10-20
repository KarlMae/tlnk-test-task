export interface ApiClient {
  get<T>(path: string): Promise<T>
  post<T, U>(path: string, body: U): Promise<T>
}
