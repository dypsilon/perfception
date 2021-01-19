const R = require('ramda');

// add base URL to every relative URL in the query
const absUrl = (baseUrl) => (query) => ({
	...query,
	relativeUrl: query.request.url,
	request: {
		...query.request,
		url: R.defaultTo('', baseUrl) + query.request.url,
	},
});

// if a global repeat is configured apply it to every query
// it can be overwritten by the query config itself
const applyGlobalRepeat = (globalRepeat) => (query) => {
	if (!globalRepeat || query.repeat) return query;
	if (globalRepeat)
		return {
			...query,
			repeat: globalRepeat,
		};
	return { ...query, repeat: 1 };
};

// apply global strategy configuration
const applyGlobalStrategy = (globalStrategy) => (query) => {
	if (!globalStrategy || query.request.strategy) return query;
	if (globalStrategy)
		return {
			...query,
			request: {
				...query.request,
				strategy: globalStrategy,
			},
		};
	return { ...query, strategy: 'desktop' };
};

// apply global api key configuration
const applyGlobalApiKey = (apiKey) => (query) => {
	if (!apiKey || query.request.key) return query;
	if (apiKey)
		return {
			...query,
			request: {
				...query.request,
				key: apiKey,
			},
		};
	return query;
};

// add additional query configs into the array according to the strategy configuration
const expandStrategies = R.reduce((acc, query) => {
	const setStrategy = (query) => (strategy) =>
		R.assocPath(['request', 'strategy'], strategy, query);
	if (R.is(Array, query.request.strategy)) {
		return [...acc, ...R.map(setStrategy(query), query.request.strategy)];
	} else {
		return [...acc, query];
	}
}, []);

// add additional query configs into the array according to the repeat configuration
const expandRepeats = R.reduce((acc, query) => {
	const iterator = (seed) =>
		seed.repeat > 0 ? [seed, { ...seed, repeat: seed.repeat - 1 }] : false;

	if (query.repeat && query.repeat > 1) {
		return [...acc, ...R.reverse(R.unfold(iterator, query))];
	} else {
		return [...acc, query];
	}
}, []);

module.exports = (queriesConf) => {
	const prepare = R.compose(
		expandStrategies,
		expandRepeats,
		R.map(
			R.compose(
				applyGlobalApiKey(queriesConf.apiKey),
				applyGlobalStrategy(queriesConf.strategy),
				applyGlobalRepeat(queriesConf.repeat),
				absUrl(queriesConf.baseUrl)
			)
		)
	);

	return prepare(queriesConf.queries);
};
