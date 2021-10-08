import {
  convertOverflowValues,
  findCellByPosition,
  findCellNeighbors,
  handleCellLiveCycle,
  startGenerating,
} from "../../game.js";
import { logger } from "../../logger.js";

jest.mock("../../logger.js", () => ({
  logger: jest.fn(),
}));

describe("Game utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const field = [
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", "x", ".", ".", "x", ".", "."],
    [".", ".", "x", ".", ".", ".", ".", "."],
    [".", ".", "x", ".", ".", ".", ".", "."],
    [".", ".", ".", "x", ".", ".", ".", "."],
  ];

  describe("convertOverflowValues", () => {
    const minLimit = 0;
    const maxLimit = 3;

    it("should return new value if received value is below min limit", () => {
      const result = convertOverflowValues(-1, minLimit, maxLimit);
      expect(result).toBe(2);
    });

    it("should return new value if received value is above max limit", () => {
      const result = convertOverflowValues(4, minLimit, maxLimit);
      expect(result).toBe(0);
    });

    it("should return same value if received value is between min and max value", () => {
      const result = convertOverflowValues(1, minLimit, maxLimit);
      expect(result).toBe(1);
    });
  });

  describe("findCellByPosition", () => {
    it("should return cell value by received coordinates (negative)", () => {
      const result = findCellByPosition(field, -1, -1);
      expect(result).toBe(".");
    });

    it("should return cell value by received coordinates (regular)", () => {
      const result = findCellByPosition(field, 2, 1);
      expect(result).toBe("x");
    });
  });

  describe("findCellNeighbors", () => {
    it("should find cell neighbors", () => {
      const result = findCellNeighbors(field, 1, 1);
      expect(result).toEqual([".", ".", ".", ".", null, ".", ".", "x", "x"]);
    });
  });

  describe("handleCellLiveCycle", () => {
    it("should return new field according to game rules", () => {
      const result = handleCellLiveCycle(field);
      expect(result).toEqual([
        [".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", "."],
        [".", "x", "x", "x", ".", ".", ".", "."],
        [".", ".", "x", "x", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", "."],
      ]);
    });
  });

  describe("startGenerating", () => {
    it("should return new field according to game rules", () => {
      console.table = jest.fn();

      const result = startGenerating(field, 3);

      expect(logger).toHaveBeenCalledTimes(4);
      expect(console.table).toHaveBeenCalledTimes(4);
      expect(result).toEqual([
        [".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", "."],
        [".", "x", "x", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", "."],
      ]);
    });
  });
});
