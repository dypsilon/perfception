module.exports = [
	{
		id: "url",
		label: "URL",
		selector: (report) => report.lighthouseResult.finalUrl,
		mappings: {
			type: "keyword",
		},
	},
	{
		id: "lighthouse-version",
		label: "Lighthouse Version",
		selector: (report) => report.lighthouseResult.lighthouseVersion,
		mappings: {
			type: "keyword",
		},
	},
	{
		id: "fetch-time",
		label: "Fetch Time",
		selector: (report) => report.lighthouseResult.fetchTime,
		mappings: {
			type: "date",
		},
	},
	{
		id: "analysis-utc-timestamp",
		label: "Analysis UTC Timestamp",
		selector: (report) => report.analysisUTCTimestamp,
		mappings: {
			type: "date",
		},
	},
	{
		id: "benchmark-index",
		label: "Benchmark Index",
		selector: (report) => report.lighthouseResult.environment.benchmarkIndex,
		mappings: {
			type: "integer",
		},
	},
	{
		id: "emulated-form-factor",
		label: "Emulated Form Factor",
		selector: (report) =>
			report.lighthouseResult.configSettings.emulatedFormFactor,
		mappings: {
			type: "keyword",
		},
	},
];
