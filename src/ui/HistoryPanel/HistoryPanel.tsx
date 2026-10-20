import type { HistoryRecord } from '../../model'
import { HistoryRow } from '../HistoryRow/HistoryRow'

interface Props {
  readonly history: readonly HistoryRecord[]
  readonly selected: number
}

export function HistoryPanel({ history, selected }: Props) {
  return (
    <div>
      <ul>
        {history.map((record, i) => (
          <HistoryRow key={i} record={record} selected={i === selected} />
        ))}
      </ul>
      <p data-testid="history-count">{history.length} records</p>
    </div>
  )
}
