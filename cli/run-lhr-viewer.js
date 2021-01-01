const http = require("http");
const express = require("express");
const asyncHandler = require("express-async-handler");
const fs = require("fs").promises;

const { getReportPath } = require("./common/paths.js");
const { getEntityPathById } = require("./common/file-store.js");
const getCliParam = require("./common/get-cli-param.js");

const readReportById = async (id) => {
	return fs.readFile(getReportPath(getEntityPathById(id)), {
		encoding: "utf8",
	});
};

module.exports = async ({ argv }) => {
	const app = express();

	app.get(
		"/api/report/:id",
		asyncHandler(async (req, res) => {
			res.setHeader("Content-Type", "application/json");
			res.send(await readReportById(req.params.id));
		})
	);

	app.get(
		"/api/report/:id/lighthouse-result",
		asyncHandler(async (req, res) => {
			const report = JSON.parse(await readReportById(req.params.id));
			res.send(report.lighthouseResult);
		})
	);

	app.get(
		"/api/report/:id/lighthouse-html",
		asyncHandler(async (req, res) => {
			const report = JSON.parse(await readReportById(req.params.id));
			const ReportGenerator = require("lighthouse/lighthouse-core/report/report-generator.js");
			const html = ReportGenerator.generateReportHtml(report.lighthouseResult);
			res.send(html);
		})
	);

	return new Promise((resolve) => {
		const host = getCliParam(argv, "--host", "localhost");
		const port = getCliParam(argv, "--port", 3001);

		const server = http.createServer(app);

		process.on("SIGTERM", () => {
			// handle graceful shutdown
			server.close(() => {
				process.exit(0);
			});
		});

		server.listen({ port, host }, () => resolve(server.address()));
	});
};
