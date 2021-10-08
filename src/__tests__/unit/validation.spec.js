import { splitLines, validateData } from "../../validation";

describe("Validation utils", () => {
  const data = "3\n8 5\n........\n..x..x..\n..x.....\n..x.....\n...x....";

  describe("splitLines util", () => {
    const splitedData = [
      "3",
      "8 5",
      "........",
      "..x..x..",
      "..x.....",
      "..x.....",
      "...x....",
    ];

    it("should split data by new line and return array", () => {
      const result = splitLines(data);
      expect(result).toEqual(splitedData);
    });
  });

  describe("validateData util", () => {
    it("should return field and generation count if data passed validation", () => {
      const result = validateData(data);

      expect(result).toEqual({
        field: [
          [".", ".", ".", ".", ".", ".", ".", "."],
          [".", ".", "x", ".", ".", "x", ".", "."],
          [".", ".", "x", ".", ".", ".", ".", "."],
          [".", ".", "x", ".", ".", ".", ".", "."],
          [".", ".", ".", "x", ".", ".", ".", "."],
        ],
        generationCount: 3,
      });
    });

    describe("should return error on", () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it("generation count if received value is more than 1", () => {
        expect(() => validateData("3 5\n4\n....")).toThrow(
          "Check generation count."
        );
      });

      it("generation count if received value is empty", () => {
        expect(() => validateData("\n4\n....")).toThrow(
          "Check generation count."
        );
      });

      it("number of rows and columns if received value is single", () => {
        expect(() => validateData("3\n4\n....")).toThrow(
          "Check number of rows and columns."
        );
      });

      it("number of field columns if they are not even in every row", () => {
        expect(() => validateData("3\n8 3\n.......\n..x..x..\n..x..")).toThrow(
          "Nubmer of columns is not even in every row."
        );
      });

      it("field size if it doesn't match received values of rows and columns", () => {
        expect(() =>
          validateData(
            "3\n6 4\n........\n..x..x..\n..x.....\n..x.....\n...x...."
          )
        ).toThrow(
          "The size of field doesn't match with received number of rows and columns."
        );
      });

      it("invalid character for cell value", () => {
        expect(() =>
          validateData(
            "3\n8 5\n........\n..a..x..\n..x.....\n..x.....\n...x...."
          )
        ).toThrow("Invalid character for cell value");
      });
    });
  });
});
