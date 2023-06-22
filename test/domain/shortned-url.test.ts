import { ShortnedURL } from "../../src/domain/shortned-url";
import { getCompleteExpectedUrl } from "../shared/get-complete-expected-url";
import { isAlphaNumeric } from "../shared/is-alphanumeric";

describe("ShortnedUrl", () => {
  test("Should be able to create a random shortned url hash using uuid and base62", () => {
    const shortenedUrl = new ShortnedURL("https://example.com");

    const outputUrlObject = new URL(shortenedUrl.get());
		const urlHash = outputUrlObject.pathname.slice(1, 8);
    const baseUrl = `${outputUrlObject.protocol}//${outputUrlObject.host}`;

		expect(isAlphaNumeric(urlHash)).toBe(true);
		expect(urlHash.length).toBe(7);
    expect(baseUrl).toBe(process.env.BASE_URL);
  });

  test("Should not able to create a shortned url of a nonexistent url", () => {
		const createShortnedUrl = () => new ShortnedURL("");
		
		expect(createShortnedUrl).toThrow(new Error("The url should not be empty"));
	});

  test("Should a hash not be predictable in any matter", async () => {
    const originalUrl = "https://example.com";
		const firstShortenedUrl = new ShortnedURL(originalUrl);
    const secondShortenedUrl = new ShortnedURL(originalUrl);

		const firstResult = firstShortenedUrl.get();
		const secondResult = secondShortenedUrl.get();

		expect(firstResult).not.toBe(secondResult);
	});

	test("Shortned url should have created with a expiration time of 30 days", async () => {
		jest.useFakeTimers({ now: new Date("2023-06-15") });
		const shortenedUrl = new ShortnedURL("https://example.com");
		const expiresAt = shortenedUrl.getExpirationDate();
		expect(expiresAt).toBe("2023-07-15T00:00:00.000Z")
		jest.useRealTimers();
	});

	test("Should be able to create a shortened url using a alias given by user", async () => {
		const originalUrl = "https://example.com";
		const alias = "samp";
		const shortenedUrl = new ShortnedURL(originalUrl, alias);
		const generatedUrl = shortenedUrl.get();
		const expectedUrl = getCompleteExpectedUrl(alias);
		expect(generatedUrl).toBe(expectedUrl);
	});

	test("Should not be able to create a shortned url by alias when the alias is passed but it is an empty string", async () => {
		const originalUrl = "https://example.com";
		const alias =  "";
		expect(() => new ShortnedURL(originalUrl, alias)).toThrow(new Error("The alias passed should not be empty"));
	});

	test("Should not be able save a shortened url with blank spaces chars in alias given by user", async () => {
		const originalUrl =  "https://example.com";
		const alias =  "  url 	sample   v1  ";
		const shortenedUrl = new ShortnedURL(originalUrl, alias);
		const expectedUrl = getCompleteExpectedUrl("url-sample-v1");
		expect(shortenedUrl.get()).toBe(expectedUrl);
	});

	test("Should not be able to save a shortned url with alias bigger than 20 chars", () => {
		const originalUrl =  "https://example.com";
		const alias =  "alias-bigger-than-20-characters";
		
		expect(() => new ShortnedURL(originalUrl, alias)).toThrow(new Error("Alias should not be bigger than 20 characters"));
	})
});