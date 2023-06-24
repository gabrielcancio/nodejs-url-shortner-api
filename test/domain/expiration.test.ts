import { Expiration } from "../../src/domain/expiration";

describe("Expiration", () => {
  test("Should have a default expiration of 30 days", () => {
    const dateOfCreation = new Date("2023-06-15");
    const expiration = new Expiration(dateOfCreation);
    expect(expiration.getDate()).toBe("2023-07-15T00:00:00.000Z");
  });

  test("Should be able to create an expiration with a custom date", () => {
    const dateOfCreation = new Date("2023-06-15");
    const customDate = new Date("2023-06-24");
    const expiration = new Expiration(dateOfCreation, customDate);
    expect(expiration.getDate()).toBe(customDate.toISOString());
  });

  test("Should no be able to created an expiration with a custom date smaller than creation date", () => {
    const dateOfCreation = new Date("2023-06-15");
    const customDate = new Date("2023-06-14");
    expect(() => new Expiration(dateOfCreation, customDate)).toThrow(new Error("Custom date should be bigger than creation date"));
  });
});