import { Alias } from "../../src/domain/alias";
import { ShortnedURL } from "../../src/domain/shortned-url";
import { getCompleteExpectedUrl } from "../shared/get-complete-expected-url";
import { isAlphaNumeric } from "../shared/is-alphanumeric";

describe("ShortnedUrl", () => {
  test("Should be able to create a random shortned url hash using uuid and base62", () => {
		const alias = new Alias();
    const shortenedUrl = new ShortnedURL("https://example.com", alias);

    const outputUrlObject = new URL(shortenedUrl.get());
		const urlHash = outputUrlObject.pathname.slice(1, 8);
    const baseUrl = `${outputUrlObject.protocol}//${outputUrlObject.host}`;

		expect(isAlphaNumeric(urlHash)).toBe(true);
		expect(urlHash.length).toBe(7);
    expect(baseUrl).toBe(process.env.BASE_URL);
  });

  test("Should not able to create a shortned url of a nonexistent url", () => {
		const alias = new Alias();
		const createShortnedUrl = () => new ShortnedURL("", alias);
		
		expect(createShortnedUrl).toThrow(new Error("The url should not be empty"));
	});

	test("Shortned url should have created with a expiration time of 30 days", async () => {
		jest.useFakeTimers({ now: new Date("2023-06-15") });
		const alias = new Alias();
		const shortenedUrl = new ShortnedURL("https://example.com", alias);
		const expiresAt = shortenedUrl.getExpirationDate();
		expect(expiresAt).toBe("2023-07-15T00:00:00.000Z")
		jest.useRealTimers();
	});

	test("Should be able to create a shortened url using a alias given by user", async () => {
		const originalUrl = "https://example.com";
		const alias = new Alias("samp");
		const shortenedUrl = new ShortnedURL(originalUrl, alias);
		const generatedUrl = shortenedUrl.get();
		const expectedUrl = getCompleteExpectedUrl(alias.getContent());
		expect(generatedUrl).toBe(expectedUrl);
	});
});