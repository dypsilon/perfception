#!/usr/bin/env node
const pino = require("pino");

const getCliParam = require("./cli/common/get-cli-param.js");

const commands = {
	collect: require("./cli/collect.js"),
	"run-lhr-viewer": require("./cli/run-lhr-viewer.js"),
	elasticsearch: require("./cli/elasticsearch.js"),
};

const logger = pino({
	name: "perfception",
	level: getCliParam(process.argv, "--level", "trace"),
	prettyPrint: getCliParam(process.argv, "--pretty", false, true),
	// the next line can be moved to the child logger config after https://github.com/pinojs/pino/issues/831 is closed
	redact: ['config.apiKey', 'query.request.key']
});

const run = async (argv) => {
	return commands[argv[2]]({ argv, logger });
};

run(process.argv).then(
	(output) => output && logger.info(output),
	(error) => logger.error(error)
);
