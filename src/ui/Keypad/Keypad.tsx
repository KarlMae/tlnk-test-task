import { forwardRef } from 'react'
import { KeypadButton, KeypadProps } from '../../model'
import styles from './Keypad.module.css'

const ROWS: KeypadButton[][] = [
  [
    { label: 'C', testId: 'key-clear' },
    { label: '⌫', testId: 'key-backspace' },
    { label: 'm', testId: 'key-save' },
  ],
  [
    { label: '7', testId: 'key-7' },
    { label: '8', testId: 'key-8' },
    { label: '9', testId: 'key-9' },
    { label: '▲', testId: 'key-up', historyOnly: true },
  ],
  [
    { label: '4', testId: 'key-4' },
    { label: '5', testId: 'key-5' },
    { label: '6', testId: 'key-6' },
    { label: '▼', testId: 'key-down', historyOnly: true },
  ],
  [
    { label: '1', testId: 'key-1' },
    { label: '2', testId: 'key-2' },
    { label: '3', testId: 'key-3' },
    { label: 'OK', testId: 'key-ok', historyOnly: true },
  ],
  [
    { label: '00', testId: 'key-00' },
    { label: '0', testId: 'key-0' },
    { label: '.', testId: 'key-dot' },
  ],
]

const DISABLED_ON_HISTORY = new Set([
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '00',
  '.',
  'm',
])

export const Keypad = forwardRef<HTMLTableElement, KeypadProps>(({ tab }, ref) => {
  return (
    <table ref={ref} className={styles.keypad}>
      <tbody>
        {ROWS.map((row, i) => (
          <tr key={i}>
            {row.map((button) => {
              if (button.historyOnly && tab !== 'history') {
                return null
              }
              const disabled = tab === 'history' && DISABLED_ON_HISTORY.has(button.label)
              return (
                <td key={button.label}>
                  <button
                    type="button"
                    data-testid={button.testId}
                    disabled={disabled}
                    className={styles.key}
                  >
                    {button.label}
                  </button>
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
})
