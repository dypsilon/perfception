const elasticsearch = require("@elastic/elasticsearch");
const { getConfPath } = require("../../common/paths.js");

module.exports = () => {
	const elasticConfig = require(getConfPath("elasticsearch.js"));
	return new elasticsearch.Client(elasticConfig.client);
}
