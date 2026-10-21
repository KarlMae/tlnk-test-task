import type { Conversion } from './conversion'

export interface HistoryRecord extends Conversion {
  readonly id: string
}
