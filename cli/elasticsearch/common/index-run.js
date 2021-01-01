const fs = require("fs").promises;
const path = require("path");
const R = require("ramda");

const { getRunPath, getReportPath } = require("../../common/paths.js");
const { getEntityPathById } = require("../../common/file-store.js");

const executeSelectors = (config, report) =>
	R.reduce(
		(acc, cur) => R.assoc(cur.id, cur.selector(report), acc),
		{},
		config
	);

module.exports = async (
	runId,
	indexName,
	elasticClient,
	onResponse = () => {}
) => {
	const runFile = getRunPath(getEntityPathById(runId));
	const reportIds = JSON.parse(
		await fs.readFile(runFile, { encoding: "utf8" })
	);
	const metricsConfig = require("../../common/metrics.js");
	const termsConfig = require("../../common/terms.js");

	for (const reportId of reportIds) {
		const fullPath = getReportPath(getEntityPathById(reportId));
		const json = await fs.readFile(fullPath, { encoding: "utf8" });
		const report = JSON.parse(json);
		const metrics = executeSelectors(metricsConfig, report);
		const terms = executeSelectors(termsConfig, report);
		const result = await elasticClient.index({
			index: indexName,
			id: reportId,
			body: { ...metrics, ...terms, report: reportId, run: runId },
		});
		onResponse(result);
	}
};
