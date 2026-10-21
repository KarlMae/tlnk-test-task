import { AnimatePresence, motion, useIsPresent } from 'motion/react'
import type { BaseHTMLAttributes } from 'react'
import { KeypadKey, Tab } from '../../model'
import styles from './Keypad.module.css'
import classNames from 'classnames'
import { Icon } from '../Icon/Icon'

type Props = Omit<BaseHTMLAttributes<HTMLDivElement>, 'onKeyPress'> & {
  readonly tab: Tab
  readonly onKeyPress: (key: KeypadKey) => void
}

interface KeypadButton {
  readonly key: KeypadKey
  readonly label: string
  readonly visibleOn: readonly Tab[]
  readonly enabledOn: readonly Tab[]
  readonly className?: string
}

const ROWS: KeypadButton[][] = [
  [
    {
      key: KeypadKey.Clear,
      label: 'C',
      visibleOn: [Tab.Exchange, Tab.History],
      enabledOn: [Tab.Exchange, Tab.History],
      className: styles.clear,
    },
    {
      key: KeypadKey.Backspace,
      label: '⌫',
      visibleOn: [Tab.Exchange, Tab.History],
      enabledOn: [Tab.Exchange],
      className: styles.delete,
    },
    {
      key: KeypadKey.Save,
      label: 'm',
      visibleOn: [Tab.Exchange],
      enabledOn: [Tab.Exchange],
    },
  ],
  [
    {
      key: KeypadKey.Seven,
      label: '7',
      visibleOn: [Tab.Exchange, Tab.History],
      enabledOn: [Tab.Exchange],
    },
    {
      key: KeypadKey.Eight,
      label: '8',
      visibleOn: [Tab.Exchange, Tab.History],
      enabledOn: [Tab.Exchange],
    },
    {
      key: KeypadKey.Nine,
      label: '9',
      visibleOn: [Tab.Exchange, Tab.History],
      enabledOn: [Tab.Exchange],
    },
    { key: KeypadKey.Up, label: '🔼', visibleOn: [Tab.History], enabledOn: [Tab.History] },
  ],
  [
    {
      key: KeypadKey.Four,
      label: '4',
      visibleOn: [Tab.Exchange, Tab.History],
      enabledOn: [Tab.Exchange],
    },
    {
      key: KeypadKey.Five,
      label: '5',
      visibleOn: [Tab.Exchange, Tab.History],
      enabledOn: [Tab.Exchange],
    },
    {
      key: KeypadKey.Six,
      label: '6',
      visibleOn: [Tab.Exchange, Tab.History],
      enabledOn: [Tab.Exchange],
    },
    { key: KeypadKey.Down, label: '🔽', visibleOn: [Tab.History], enabledOn: [Tab.History] },
  ],
  [
    {
      key: KeypadKey.One,
      label: '1',
      visibleOn: [Tab.Exchange, Tab.History],
      enabledOn: [Tab.Exchange],
    },
    {
      key: KeypadKey.Two,
      label: '2',
      visibleOn: [Tab.Exchange, Tab.History],
      enabledOn: [Tab.Exchange],
    },
    {
      key: KeypadKey.Three,
      label: '3',
      visibleOn: [Tab.Exchange, Tab.History],
      enabledOn: [Tab.Exchange],
    },
    { key: KeypadKey.Ok, label: '🆗', visibleOn: [Tab.History], enabledOn: [Tab.History] },
  ],
  [
    {
      key: KeypadKey.DoubleZero,
      label: '00',
      visibleOn: [Tab.Exchange, Tab.History],
      enabledOn: [Tab.Exchange],
    },
    {
      key: KeypadKey.Zero,
      label: '0',
      visibleOn: [Tab.Exchange, Tab.History],
      enabledOn: [Tab.Exchange],
    },
    {
      key: KeypadKey.Dot,
      label: '.',
      visibleOn: [Tab.Exchange, Tab.History],
      enabledOn: [Tab.Exchange],
    },
  ],
]

function Key({
  button,
  tab,
  gridRow,
  gridColumn,
  onKeyPress,
}: {
  readonly button: KeypadButton
  readonly tab: Tab
  readonly gridRow: number
  readonly gridColumn: number
  readonly onKeyPress: Props['onKeyPress']
}) {
  const isPresent = useIsPresent()
  const enabled = button.enabledOn.includes(tab)

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: enabled ? 1 : 0.2 }}
      exit={{ opacity: 0 }}
      type="button"
      data-testid={`key-${button.key}`}
      aria-hidden={!isPresent}
      aria-label={
        button.key === KeypadKey.Backspace
          ? tab === Tab.History
            ? 'Delete selected record'
            : 'Backspace'
          : undefined
      }
      disabled={!enabled || !isPresent}
      style={{ gridRow, gridColumn }}
      className={classNames(styles.key, button.className)}
      onClick={() => onKeyPress(button.key)}
    >
      {button.key === KeypadKey.Backspace ? (
        <Icon type="back" width={43} height={29} />
      ) : (
        button.label
      )}
    </motion.button>
  )
}

export function Keypad({ className, tab, onKeyPress }: Props) {
  return (
    <div className={classNames(className, styles.keypad)}>
      <AnimatePresence initial={false}>
        {ROWS.flatMap((row, rowIndex) =>
          row.map(
            (button, columnIndex) =>
              button.visibleOn.includes(tab) && (
                <Key
                  key={button.key}
                  button={button}
                  tab={tab}
                  gridRow={rowIndex + 1}
                  gridColumn={columnIndex + 1}
                  onKeyPress={onKeyPress}
                />
              ),
          ),
        )}
      </AnimatePresence>
    </div>
  )
}
