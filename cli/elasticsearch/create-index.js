const R = require("ramda");
const createElasticsearchClient = require("./common/create-elasticsearch-client.js");
const { getConfPath } = require("../common/paths.js");

const addMetricsMappings = (mappings) => {
	const config = require("../common/metrics.js");
	return config.reduce((acc, cur) => {
		return R.assocPath(["properties", cur.id], { type: "float" }, acc);
	}, mappings);
};

const addTermMappings = (mappings) => {
	const config = require("../common/terms.js");
	return config.reduce((acc, cur) => {
		return R.assocPath(["properties", cur.id], cur.mappings, acc);
	}, mappings);
};

module.exports = async ({ logger }) => {
	const config = require(getConfPath("elasticsearch.js"));
	const indexName = config.indexPrefix + Math.floor(Date.now() / 1000);
	const client = createElasticsearchClient();

	const initialMappings = {
		dynamic: false,
		properties: {
			report: {
				type: "keyword",
			},
			run: {
				type: "keyword",
			},
		},
	};

	const mappings = addTermMappings(addMetricsMappings(initialMappings));

	const response = await client.indices.create({
		index: indexName,
		body: { mappings },
	});

	logger.info({
		step: "created index",
		index: response.body.index,
		warnings: response.warnings,
	});
};
