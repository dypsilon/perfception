module.exports = (argv, paramName, def = undefined, flag = false) => {
	const index = argv.indexOf(paramName);
	if (index === -1) return def;
	if (flag) return true;
	return argv[index + 1] || def;
};
