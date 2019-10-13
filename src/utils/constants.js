export const EMPTY_MATRIX = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

export const STARTING_NOTE = 36;
export const DEFAULT_BPM = 140;
export const MIDI_CHANNEL = 16;
export const NOTE_OFF = 0;
export const MAX_VELOCITY = 127;
export const DEFAULT_VELOCITY = 64;
export const NOTE_LENGTHS = {
  WHOLE: {
    text: '1/1',
    value: 1,
  },
  HALF: {
    text: '1/2',
    value: 2,
  },
  QUARTER: {
    text: '1/4',
    value: 4,
  },
  EIGHTH: {
    text: '1/8',
    value: 8,
  },
  SIXTEENTH: {
    text: '1/16',
    value: 16
  },
};

export const KEY_SHORTCUTS = {
  ADD_FRAME: 'Enter',
  COPY_FRAME: 'c',
  CLEAR_FRAME: 'Backspace',
  DELETE_FRAME: 'Delete',
  DOWNLOAD: 'b',
  GO_TO_FIRST_FRAME: ',',
  GO_TO_LAST_FRAME: '.',
  GO_TO_NEXT_FRAME: 'd',
  GO_TO_PREVIOUS_FRAME: 'a',
  HELP_MENU: '?',
  START_STOP: 'Space',
  TRANSLATE_DOWN: 'ArrowDown',
  TRANSLATE_LEFT: 'ArrowLeft',
  TRANSLATE_RIGHT: 'ArrowRight',
  TRANSLATE_UP: 'ArrowUp',
};
