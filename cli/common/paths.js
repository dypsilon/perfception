const { resolve } = require("path");

module.exports = {
	getRunPath: (tail = "") => resolve(process.cwd(), "entities/run", tail),
	getReportPath: (tail = "") => resolve(process.cwd(), "entities/report", tail),
	getConfPath: (tail = "") => resolve(process.cwd(), "conf", tail),
};
