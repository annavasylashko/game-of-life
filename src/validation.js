// ----- Check data -----

export const splitLines = (data) => data.split(/\r\n|\r|\n/);

export const validateData = (data) => {
  const splitedData = splitLines(data);

  const generationCount = Number(splitedData.shift());
  if (!generationCount || typeof generationCount !== "number") {
    throw "Check generation count.";
  }

  const rowsAndColumns = splitedData
    .shift()
    .split(" ")
    .map((element) => Number(element));
  if (rowsAndColumns.length !== 2) {
    throw "Check number of rows and columns.";
  }

  if (rowsAndColumns[0] < 3 || rowsAndColumns[1] < 3) {
    throw "Amount of rows and columns should be 3 or more.";
  }

  const field = splitedData.map((row) => Array.from(row));

  for (let i = 0; i < field.length - 1; i++) {
    if (field[i].length !== field[i + 1].length) {
      throw "Nubmer of columns is not even in every row.";
    }
  }

  return {
    field: field,
    generationCount: generationCount,
  };
};
