import { logger } from "../../logger.js";

describe("logger", () => {
  it("should log received data in correct format", () => {
    console.log = jest.fn();
    logger("data");

    expect(console.log).toHaveBeenNthCalledWith(
      1,
      "-----------------------------------------------------"
    );
    expect(console.log).toHaveBeenNthCalledWith(2, "data");
    expect(console.log).toHaveBeenNthCalledWith(
      3,
      "-----------------------------------------------------"
    );
  });
});
