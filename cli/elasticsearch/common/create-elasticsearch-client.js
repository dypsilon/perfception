const elasticsearch = require("@elastic/elasticsearch");
const { getConfPath } = require("../../common/paths.js");

const elasticConfig = require(getConfPath("elasticsearch.js"));

module.exports = () => new elasticsearch.Client(elasticConfig.client);
