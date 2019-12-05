import * as constants from './constants';

export const copyArray = (arr) => JSON.parse(JSON.stringify(arr));

export const mapCCtoNewMatrix = (newMatrix, oldMatrix) => {
  return newMatrix.map((r, ri) => r.map((m, ci) => ({
    cc: oldMatrix[ri][ci].cc,
    velocity: m.velocity,
  })))
};

export const up = (matrix) => {
  const newMatrix = copyArray(matrix);
  newMatrix.push(newMatrix.shift());
  return mapCCtoNewMatrix(newMatrix, matrix);
};

export const down = (matrix) => {
  const newMatrix = copyArray(matrix);
  newMatrix.unshift(newMatrix.pop());
  return mapCCtoNewMatrix(newMatrix, matrix);
};

export const left = (matrix) => {
  let newMatrix = copyArray(matrix);
  newMatrix = newMatrix.map((row) => {
    const newRow = copyArray(row);
    newRow.push(newRow.shift());
    return newRow;
  });
  return mapCCtoNewMatrix(newMatrix, matrix)
};

export const right = (matrix) => {
  let newMatrix = copyArray(matrix);
  newMatrix = newMatrix.map((row) => {
    const newRow = copyArray(row);
    newRow.unshift(newRow.pop());
    return newRow;
  });
  return mapCCtoNewMatrix(newMatrix, matrix)
};

export const shift = {
  [constants.DIRECTIONS.UP]: up,
  [constants.DIRECTIONS.DOWN]: down,
  [constants.DIRECTIONS.LEFT]: left,
  [constants.DIRECTIONS.RIGHT]: right,
};
