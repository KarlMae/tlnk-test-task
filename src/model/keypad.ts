export interface KeypadProps {
  tab: 'exchange' | 'history'
}

export interface KeypadButton {
  label: string
  testId: string
  historyOnly?: boolean
}
