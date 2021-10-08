import { logger } from "./logger.js";

// ----- Game logic -----

export const convertOverflowValues = (value, minLimit, maxLimit) => {
  let newValue;

  switch (true) {
    case value < minLimit:
      newValue = maxLimit - 1;
      break;
    case value > maxLimit - 1:
      newValue = minLimit;
      break;
    default:
      newValue = value;
      break;
  }

  return newValue;
};

export const findCellByPosition = (field, x, y) => {
  const newY = convertOverflowValues(y, 0, field.length);
  const newX = convertOverflowValues(x, 0, field[newY].length);

  return field[newY][newX];
};

export const findCellNeighbors = (field, x, y) => {
  let cellNeighbors = [];

  for (let i = y - 1; i <= y + 1; i++) {
    for (let j = x - 1; j <= x + 1; j++) {
      const cellValue =
        i === y && j === x ? null : findCellByPosition(field, i, j);
      cellNeighbors.push(cellValue);
    }
  }
  return cellNeighbors;
};

const deadCell = ".";
const aliveCell = "x";

export const handleCellLiveCycle = (field) => {
  const fieldRows = field.length;
  const fieldColumns = field[0].length;

  let newField = Array(fieldRows)
    .fill()
    .map(() =>
      Array(fieldColumns)
        .fill()
        .map(() => deadCell)
    );

  for (let i = 0; i < fieldRows; i++) {
    for (let j = 0; j < fieldColumns; j++) {
      const cellNeighbors = findCellNeighbors(field, j, i);
      const aliveNeighbors = cellNeighbors.filter((cell) => cell === aliveCell);

      if (
        aliveNeighbors.length === 3 &&
        findCellByPosition(field, i, j) === deadCell
      ) {
        newField[j][i] = aliveCell;
      } else if (
        aliveNeighbors.length === 2 &&
        findCellByPosition(field, i, j) === aliveCell
      ) {
        newField[j][i] = aliveCell;
      }
    }
  }

  return newField;
};

export const startGenerating = (field, count) => {
  logger("Start");
  console.table(field);

  for (let i = 0; i < count; i++) {
    field = handleCellLiveCycle(field);

    logger(`Generation ${i + 1}`);
    console.table(field);
  }

  return field;
};
