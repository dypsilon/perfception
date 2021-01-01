module.exports = [
	...require("./metrics/scores.js").map((x) => ({ ...x, numeric: false })),
	...require("./metrics/numeric.js").map((x) => ({ ...x, numeric: true })),
];
