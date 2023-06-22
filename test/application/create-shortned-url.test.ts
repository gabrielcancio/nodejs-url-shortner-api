import "dotenv/config";
import { CreateShortnedUrl } from "../../src/application/create-shortned-url";
import { ShortnedUrlRepositoryInMemory } from "../../src/infra/database/repositories/shortned-url-repository-in-memory";
import { isAlphaNumeric } from "../shared/is-alphanumeric";
import { getCompleteExpectedUrl } from "../shared/get-complete-expected-url";

describe("Create Shortned Url", () => {
	test("Should be able to create a random shortned url hash using uuid and base62", async () => {
		const { sut, shortnedUrlRepositoryInMemory } = makeSut();
		const input = {
			url: "https://example.com"
		};
		const output = await sut.execute(input);
		const outputUrlObject = new URL(output.generatedUrl);
		const urlHash = outputUrlObject.pathname.slice(1, 8);
		expect(isAlphaNumeric(urlHash)).toBe(true);
		expect(urlHash.length).toBe(7);
		expect(shortnedUrlRepositoryInMemory.isUrlSaved(input.url)).toBe(true);
	});

	test("Should not able to create a shortned url of a nonexistent url", async () => {
		const { sut } = makeSut();
		const input = {
			url: ""
		};
		await expect(() => sut.execute(input)).rejects.toThrow(new Error("The url should not be empty"));
	});

	test("Should a hash not be predictable in any matter", async () => {
		const { sut } = makeSut();
		const input = {
			url: "https://example.com"
		};
		const firstOutput = await sut.execute(input);
		const secondOutput = await sut.execute(input);
		expect(firstOutput.generatedUrl).not.toBe(secondOutput.generatedUrl);
	});

	test("Shortned url should have created with a expiration time of 30 days", async () => {
		jest.useFakeTimers({ now: new Date("2023-06-15") });
		const { sut } = makeSut();
		const input = {
			url: "https://example.com"
		};
		const output = await sut.execute(input);
		expect(output.expiresAt).toBe("2023-07-15T00:00:00.000Z")
		jest.useRealTimers();
	});

	test("Should be able to create a shortened url using a alias given by user", async () => {
		const { sut, shortnedUrlRepositoryInMemory } = makeSut();
		const input = {
			url: "https://example.com",
			alias: "samp"
		};
		const output = await sut.execute(input);
		const expectedUrl = getCompleteExpectedUrl(input.alias);
		const isRegisterAliased = (await shortnedUrlRepositoryInMemory.getByShortnedUrl(expectedUrl))?.isAliased;
		expect(output.generatedUrl).toBe(expectedUrl);
		expect(isRegisterAliased).toBe(true);
	});

	test("Should not be able to create a shortned url by alias when the alias is passed but it is an empty string", async () => {
		const { sut } = makeSut();
		const input = {
			url: "https://example.com",
			alias: ""
		};
		await expect(() => sut.execute(input)).rejects.toThrow(new Error("The alias passed should not be empty"));
	});

	test("Should not be able save a shortened url with blank spaces chars in alias given by user", async () => {
		const { sut } = makeSut();
		const input = {
			url: "https://example.com",
			alias: "    url			sample   v1         "
		};
		const output = await sut.execute(input);
		const expectedUrl = getCompleteExpectedUrl("url-sample-v1");
		expect(output.generatedUrl).toBe(expectedUrl);
	});

	test("Should not be able save a shortned url by user alias that exists", async () => {
		const { sut, shortnedUrlRepositoryInMemory } = makeSut();
		const input = {
			url: "https://example.com",
			alias: "samp"
		};
		await sut.execute(input);
		await expect(() => sut.execute(input)).rejects.toThrow(new Error("The alias is already used"));
		expect(shortnedUrlRepositoryInMemory.getRegistersWithSameAliasCount(input.url)).toBe(1);
	});
});

function makeSut() {
	const shortnedUrlRepositoryInMemory = new ShortnedUrlRepositoryInMemory();
	const sut = new CreateShortnedUrl(shortnedUrlRepositoryInMemory);
	return { sut, shortnedUrlRepositoryInMemory };
}