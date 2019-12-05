import * as constants from './constants';
import { copyArray } from './transformations';

export const getInitialState = () => {
  let cc = constants.STARTING_NOTE;
  return  copyArray(constants.EMPTY_MATRIX.map((row) => row.map(() => {
    const item = {
      cc,
      velocity: constants.MIN_VELOCITY,
    };
    cc += 1;
    return item;
  })).reverse());
};
