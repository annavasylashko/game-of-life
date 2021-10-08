import fs from "fs";
import { startGenerating } from "../../game.js";
import { handleData, writeFile, executeProgram } from "../../index";
import { logger } from "../../logger.js";
import { validateData } from "../../validation.js";

jest.mock("../../game.js", () => ({
  startGenerating: jest.fn(() => [
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", "x", "x", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
  ]),
}));

jest.mock("../../logger.js", () => ({
  logger: jest.fn(),
}));

const field = [
  [".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", "x", ".", ".", "x", ".", "."],
  [".", ".", "x", ".", ".", ".", ".", "."],
  [".", ".", "x", ".", ".", ".", ".", "."],
  [".", ".", ".", "x", ".", ".", ".", "."],
];

jest.mock("../../validation.js", () => ({
  validateData: jest.fn(() => ({
    field: field,
    generationCount: 3,
  })),
}));

describe("Executed file", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const data = "3\n8 5\n........\n..x..x..\n..x.....\n..x.....\n...x....";
  const outputField = "........\n........\n.xx.....\n........\n........\n";

  const callback = jest.fn(() => jest.fn());

  describe("handleData", () => {
    it("should validate data and start generating", () => {
      const result = handleData(data);

      expect(validateData).toHaveBeenCalledWith(data);
      expect(startGenerating).toHaveBeenCalledWith(field, 3);

      expect(result).toEqual(outputField);
    });
  });

  describe("writeFile", () => {
    it("should write data to file and log that result succeeded", () => {
      jest
        .spyOn(fs, "writeFile")
        .mockImplementation((path, options, callback) => {
          return callback(null);
        });
      const result = writeFile(outputField);
      expect(fs.writeFile).toHaveBeenCalledWith(
        "output.txt",
        outputField,
        expect.any(Function)
      );
      expect(logger).toHaveBeenCalledWith(
        "The result is successfully written in file output.txt"
      );
    });

    it("should log error if writing file failed", () => {
      const mError = new Error();
      jest
        .spyOn(fs, "writeFile")
        .mockImplementation((path, options, callback) => {
          return callback(mError);
        });

      writeFile(outputField);

      expect(fs.writeFile).toBeCalledWith(
        "output.txt",
        outputField,
        expect.any(Function)
      );
      expect(logger).toHaveBeenCalledWith(mError);
    });
  });

  describe("executeProgram", () => {
    it("should execute program successfully if input file containes data", () => {
      jest
        .spyOn(fs, "readFile")
        .mockImplementation((path, options, callback) => {
          return callback(null, data);
        });

      executeProgram();

      expect(fs.readFile).toBeCalledWith(
        "input.txt",
        "utf8",
        expect.any(Function)
      );

      expect(fs.writeFile).toHaveBeenCalledWith(
        "output.txt",
        outputField,
        expect.any(Function)
      );
    });

    it("should log error if readind file failed", () => {
      const mError = "Input file is empty";

      jest
        .spyOn(fs, "readFile")
        .mockImplementation((path, options, callback) => {
          return callback(mError, null);
        });

      executeProgram();

      expect(fs.readFile).toBeCalledWith(
        "input.txt",
        "utf8",
        expect.any(Function)
      );

      expect(logger).toHaveBeenCalledWith(new Error() || mError);
    });
  });
});
