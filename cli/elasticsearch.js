const commands = {
	"create-index": require("./elasticsearch/create-index"),
	index: require("./elasticsearch/index"),
};

module.exports = async ({ argv, logger }) => {
	const command = argv[3];
	return commands[command]({ argv, logger });
};
