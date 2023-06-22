import { Alias } from "../../src/domain/alias";

describe("Alias", () => {
  test("Should be able to create an alias", () => {
    const alias = new Alias("some-alias");
    expect(alias.getContent()).toBe("some-alias");
  });

  test("Should be able to trim the blank spaces in the start or the end of string", () => {
    const alias = new Alias("   some-alias    ");
    expect(alias.getContent()).toBe("some-alias");
  });

  test("Should be able to replace the blank spaces in the middle of string by hyphens", () => {
    const alias = new Alias("some alias for   url");
    expect(alias.getContent()).toBe("some-alias-for-url");
  });

  test("Should not be able to create an alias with alias bigger than 20 chars", () => {
    expect(() => new Alias("alias-bigger-than-20-characters")).toThrow(new Error("The alias should not have more than 20 characters"));
  });

  test("Should be able to know when the alias is not passed", () => {
    const aliasWithUndefinedArgument = new Alias(undefined);
    const aliasWithEmptyStringArgument = new Alias("");
    
    expect(aliasWithUndefinedArgument.isEmpty()).toBe(true);
    expect(aliasWithEmptyStringArgument.isEmpty()).toBe(true);
  });
});