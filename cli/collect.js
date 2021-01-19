const axios = require("axios").default;
const fs = require("fs").promises;
const path = require("path");
const mkdirp = require("mkdirp");
const R = require("ramda");
const { createId, getEntityPathById } = require("./common/file-store.js");
const { getConfPath, getRunPath, getReportPath } = require("./common/paths.js");
const prepareQueries = require('./collect/prepare-queries.js');

const queriesConf = require(getConfPath("queries.js"));

const API_ENDPOINT =
	queriesConf.apiEndpoint ||
	"https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const REQUEST_PAUSE = queriesConf.requestPause || 3000;
const PSI_CACHE_TTL = queriesConf.psiCacheTtl || 30 * 1000;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = async ({ logger }) => {
	const collectLogger = logger.child({ command: "collect" });

	const runStartTime = Date.now();
	const runId = createId();
	const runLogger = collectLogger.child({ runId });
	runLogger.info({
		step: "start run",
		config: R.omit(["queries"], queriesConf),
	});

	const queue = prepareQueries(queriesConf);

	// START PROCESSING THE REQUESTS
	// this is more elaborate as it could be because we want to
	// avoid the PSI caching of approx. 30s and rate limiting of approx 60 request per 100 seconds
	// at the same time
	runLogger.info({ step: "start requests", queueSize: queue.length });

	/**
	 * Determine the pause time which is required for a certain request to avoid the caching.
	 *
	 * @param {*} statusTracker
	 * @param {*} url
	 */
	const getRequestTimeout = (statusTracker, url) => {
		const now = Date.now();
		if (statusTracker[url] === undefined) return 0; // there was no request for this URL yet

		const { finishTime } = statusTracker[url];
		if (finishTime === null) return Infinity; // there is an ongoing request right now

		const releaseTime = finishTime + PSI_CACHE_TTL;
		if (releaseTime < now) return 0; // the pause was long enough already
		return releaseTime - now; // we have to wait for so many ms until the next release
	};

	/**
	 * Analyze the queue and find out the minimum required timeout for all requests.
	 *
	 * @param {*} queue
	 * @param {*} statusTracker
	 */
	const findSmallestRequestTimeout = (queue, statusTracker) => {
		let smallestTimeout = Infinity;
		for (const query of queue) {
			const timeout = getRequestTimeout(statusTracker, query.request.url);
			if (timeout === 0) return timeout; // cannot be smaller as zero
			smallestTimeout = smallestTimeout > timeout ? timeout : smallestTimeout;
		}
		return smallestTimeout;
	};

	const promises = [];
	const index = [];
	const status = {};
	const errors = [];

	while (queue.length) {
		const query = queue.shift();

		if (getRequestTimeout(status, query.request.url) === 0) {
			const requestStartTime = Date.now();
			const reportId = createId();

			// mark the request as ongoing
			status[query.request.url] = {
				finishTime: null,
			};

			runLogger.debug({ step: "start request", query });

			await delay(REQUEST_PAUSE); // add a pause before each request to avoid PSI rate limiting

			// initiate the request
			const promise = axios
				.get(API_ENDPOINT, { params: query.request })
				.then(async (response) => {
					// report on the request finish
					const requestFinishTime = Date.now();
					runLogger.info({
						step: "finish request",
						duration: Math.round((requestFinishTime - requestStartTime) / 1000),
						query,
						queueSize: queue.length,
					});
					status[query.request.url].finishTime = requestFinishTime;
					// add the report to the run index
					index.push(reportId);
					// save the report into a file
					const reportFile = getReportPath(getEntityPathById(reportId, "json"));
					await mkdirp(path.dirname(reportFile));
					return fs.writeFile(
						reportFile,
						JSON.stringify(response.data, null, 2)
					);
				})
				.catch((err) => {
					const requestFinishTime = Date.now();

					status[query.request.url].finishTime = requestFinishTime; // mark the request as finished to avoid loops
					errors.push({ query, err });
					if (err.response) {
						runLogger.error({
							step: "abort request",
							duration: Math.round(
								(requestFinishTime - requestStartTime) / 1000
							),
							query,
							statusCode: err.response.status,
							responseData: err.response.data,
						});
					} else {
						runLogger.error({
							step: "abort request",
							duration: Math.round(
								(requestFinishTime - requestStartTime) / 1000
							),
							query,
							msg: err,
						});
					}
				});

			// to run requests in parallel we collect the promises
			promises.push(promise);
		} else {
			// the request for the same URL is either ongoing or it was done a short time ago
			runLogger.debug({
				step: "postpone request",
				query,
				queueSize: queue.length + 1,
			});
			queue.push(query);
			let smallestTimeout = findSmallestRequestTimeout(queue, status);

			if (smallestTimeout > 0) {
				if (smallestTimeout === Infinity) {
					smallestTimeout = 1000; // all requests are ongoing, lets wait for 1 second
				}
				// we don't have anything in the queue that we can do right now
				runLogger.info({
					step: "pause queue",
					timeout: smallestTimeout,
					queueSize: queue.length + 1,
				});
				await delay(smallestTimeout + 1);
			}
		}
	}

	await Promise.allSettled(promises);

	const runFinishTime = Date.now();

	runLogger.info({
		step: "finish run",
		duration: Math.floor((runFinishTime - runStartTime) / 1000),
		durationMinutes: `${+(
			Math.floor((runFinishTime - runStartTime) / 1000) / 60
		).toFixed(2)}m`,
		errorNumber: errors.length,
		runStartTime,
		runId,
	});

	const runFile = getRunPath(getEntityPathById(runId));
	runLogger.info({
		step: "create runfile",
		file: path.dirname(runFile),
	});
	await mkdirp(path.dirname(runFile));
	await fs.writeFile(runFile, JSON.stringify(index, null, 2));
};
