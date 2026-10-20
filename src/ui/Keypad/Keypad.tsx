import { KeypadKey, Tab, type KeypadButton } from '../../model'
import styles from './Keypad.module.css'

interface Props {
  readonly tab: Tab
  readonly onKeyPress: (key: KeypadKey) => void
}

const ROWS: KeypadButton[][] = [
  [
    { key: KeypadKey.Clear, label: 'C' },
    { key: KeypadKey.Backspace, label: '⌫' },
    { key: KeypadKey.Save, label: 'm' },
  ],
  [
    { key: KeypadKey.Seven, label: '7' },
    { key: KeypadKey.Eight, label: '8' },
    { key: KeypadKey.Nine, label: '9' },
    { key: KeypadKey.Up, label: '▲', historyOnly: true },
  ],
  [
    { key: KeypadKey.Four, label: '4' },
    { key: KeypadKey.Five, label: '5' },
    { key: KeypadKey.Six, label: '6' },
    { key: KeypadKey.Down, label: '▼', historyOnly: true },
  ],
  [
    { key: KeypadKey.One, label: '1' },
    { key: KeypadKey.Two, label: '2' },
    { key: KeypadKey.Three, label: '3' },
    { key: KeypadKey.Ok, label: 'OK', historyOnly: true },
  ],
  [
    { key: KeypadKey.DoubleZero, label: '00' },
    { key: KeypadKey.Zero, label: '0' },
    { key: KeypadKey.Dot, label: '.' },
  ],
]

const DISABLED_ON_HISTORY = new Set<KeypadKey>([
  KeypadKey.Zero,
  KeypadKey.One,
  KeypadKey.Two,
  KeypadKey.Three,
  KeypadKey.Four,
  KeypadKey.Five,
  KeypadKey.Six,
  KeypadKey.Seven,
  KeypadKey.Eight,
  KeypadKey.Nine,
  KeypadKey.DoubleZero,
  KeypadKey.Dot,
  KeypadKey.Save,
])

export function Keypad({ tab, onKeyPress }: Props) {
  return (
    <table className={styles.keypad}>
      <tbody>
        {ROWS.map((row, i) => (
          <tr key={i}>
            {row.map((button) => {
              if (button.historyOnly && tab !== Tab.History) {
                return null
              }
              const disabled = tab === Tab.History && DISABLED_ON_HISTORY.has(button.key)
              return (
                <td key={button.key}>
                  <button
                    type="button"
                    data-testid={`key-${button.key}`}
                    disabled={disabled}
                    onClick={() => onKeyPress(button.key)}
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
}
