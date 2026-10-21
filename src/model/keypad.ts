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

export const AMOUNT_KEYS = [
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
] as const

export type AmountKey = (typeof AMOUNT_KEYS)[number]
