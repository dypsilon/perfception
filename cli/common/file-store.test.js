const { getEntityPathById } = require("./file-store.js");

test("getEntityPathById", () => {
	const path = getEntityPathById("1588471772-b9cb6b7d38489a3c", "json");
	expect(path).toEqual("2020/0503/0209/1588471772-b9cb6b7d38489a3c.json");
});
