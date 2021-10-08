import fs from "fs";
import { startGenerating } from "./game.js";
import { logger } from "./logger.js";
import { validateData } from "./validation.js";

// ----- Read file and run program -----

export const handleData = (data) => {
  const { field, generationCount } = validateData(data);
  const newField = startGenerating(field, generationCount);

  const outputField = newField
    .toString()
    .replace(/\,/g, "")
    .replace(/.{8}/g, "$&\n");

  return outputField;
};

export const writeFile = (data) =>
  fs.writeFile("output.txt", data, (err) => {
    if (err) {
      logger(err);
    }

    data && logger("The result is successfully written in file output.txt");
  });

export const executeProgram = () =>
  fs.readFile("input.txt", "utf8", (err, data) => {
    try {
      const outputData = handleData(data);

      writeFile(outputData);
    } catch (error) {
      logger(error || "Input file is empty");
    }
  });

executeProgram();
