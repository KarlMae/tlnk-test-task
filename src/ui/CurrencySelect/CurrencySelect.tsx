import styles from './CurrencySelect.module.css'
import type { BaseHTMLAttributes } from 'react'

type Props = Omit<BaseHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
  readonly testId: string
  readonly currencies: readonly string[]
  readonly value: string | undefined
  readonly onChange: (currency: string) => void
}

export function CurrencySelect({ testId, currencies, value, onChange }: Props) {
  return (
    <select
      className={styles.select}
      data-testid={testId}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
    >
      {currencies.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  )
}
