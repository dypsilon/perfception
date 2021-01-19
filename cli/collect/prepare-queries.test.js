const prepareQueries = require("./prepare-queries.js");

describe("prepareQueries", () => {
	test("works as expected without baseUrl", () => {
		const result = prepareQueries({
			queries: [
				{ request: { url: "http://example.com/" } },
				{ request: { url: "http://example.org/" } },
			],
		});

		expect(result[0].request.url).toEqual("http://example.com/");
		expect(result[1].request.url).toEqual("http://example.org/");
	});
});
