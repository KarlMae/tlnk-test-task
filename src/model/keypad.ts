export interface KeypadProps {
  readonly tab: 'exchange' | 'history'
}

export interface KeypadButton {
  readonly label: string
  readonly testId: string
  readonly historyOnly?: boolean
}
