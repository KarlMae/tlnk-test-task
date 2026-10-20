export enum KeypadKey {
  Zero = '0',
  One = '1',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  DoubleZero = '00',
  Dot = 'dot',
  Backspace = 'backspace',
  Clear = 'clear',
  Save = 'save',
  Up = 'up',
  Down = 'down',
  Ok = 'ok',
}

export interface KeypadButton {
  readonly key: KeypadKey
  readonly label: string
  readonly historyOnly?: boolean
}
