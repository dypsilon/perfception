const R = require("ramda");
const createElasticsearchClient = require("./common/create-elasticsearch-client.js");
const { getRunPath, getConfPath } = require("../common/paths.js");
const {
	findAllEntities,
	findLatestEntity,
} = require("../common/file-store.js");
const getCliParam = require("../common/get-cli-param.js");
const indexRun = require("./common/index-run.js");

module.exports = async ({ argv, logger }) => {
	const config = require(getConfPath("elasticsearch.js"));
	const client = createElasticsearchClient();

	let indexName = getCliParam(argv, "--index");

	if (indexName === undefined) {
		const pattern = `${config.indexPrefix}*`;

		logger.info({
			step: "index",
			msg: `No index name was provided through '--index'. Looking for the last index matching the pattern [${pattern}]`,
		});

		const response = await client.cat.indices({
			index: pattern,
			format: "json",
		});

		const indices = response.body.filter((index) => index.status == "open");

		if (indices.length == 0) {
			throw new Error(
				`No index matching the pattern ${pattern} was found. Please run 'create-index' to create a new one.`
			);
		}

		const sorted = R.sort(
			(left, right) => right.index.localeCompare(left.index),
			indices
		);

		indexName = R.head(sorted).index;

		logger.info({
			step: "index",
			msg: `No index name was provided through '--index'. The latest index matching the pattern [${pattern}] is [${indexName}]. Will proceed using it.`,
			pattern,
			indexName,
		});
	}

	const report = (result) => {
		logger.info({
			step: "indexed report",
			index: result.body._index,
			report: result.body._id,
			result: result.body.result,
			shards: result.body._shards,
			statusCode: result.statusCode,
			warnings: result.warnings,
		});
	};

	if (getCliParam(process.argv, "--all", false, true)) {
		const runs = await findAllEntities(getRunPath());

		for (const run of runs) {
			await indexRun(run, indexName, client, report);

			logger.info({
				step: "indexed run",
				index: indexName,
				run,
			});
		}

		return;
	} else {
		let runId = getCliParam(argv, "--run");

		if (runId === undefined) {
			runId = await findLatestEntity(getRunPath());

			logger.info({
				step: "index",
				msg: `Run ID was not provided through '--run'. Will use the most recent run ID [${runId}]`,
				runId,
			});
		}

		await indexRun(runId, indexName, client, report);

		logger.info({
			step: "indexed run",
			index: indexName,
			run: runId,
		});

		return;
	}
};
