import { URLHash } from "../../src/domain/url-hash";
import { isAlphaNumeric } from "../shared/is-alphanumeric";

describe("URLHash", () => {
  test("Should be able to create a random shortned url hash using uuid and base62", () => {
    const urlHash = new URLHash("https://example.com");
    const content = urlHash.getContent()

		expect(isAlphaNumeric(content)).toBe(true);
		expect(content.length).toBe(7);
  });

  test("Should a hash not be predictable in any matter", async () => {
    const url = "https://example.com";
		const firstUrlHash = new URLHash(url);
    const secondUrlHash = new URLHash(url);

		const firstResult = firstUrlHash.getContent();
		const secondResult = secondUrlHash.getContent();

		expect(firstResult).not.toBe(secondResult);
	});
});