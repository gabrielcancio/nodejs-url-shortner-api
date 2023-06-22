export function getCompleteExpectedUrl(hash: string) {
	return `${process.env.BASE_URL}/${hash}`;
}