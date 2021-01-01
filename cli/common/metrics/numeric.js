const R = require("ramda");

module.exports = [
	{
		id: "interactive-numeric",
		label: "Time To Interactive",

		selector: (report) =>
			report.lighthouseResult.audits.interactive.numericValue,
	},
	{
		id: "speed-index-numeric",
		label: "Speed Index",
		selector: (report) =>
			report.lighthouseResult.audits["speed-index"].numericValue,
	},
	{
		id: "first-contentful-paint-numeric",
		label: "First Contentful Paint",
		selector: (report) =>
			report.lighthouseResult.audits["first-contentful-paint"].numericValue,
	},
	{
		id: "first-cpu-idle-numeric",
		label: "First CPU Idle",
		selector: (report) =>
			report.lighthouseResult.audits["first-cpu-idle"].numericValue,
	},
	{
		id: "first-meaningful-paint-numeric",
		label: "First Meaningful Paint",
		selector: (report) =>
			report.lighthouseResult.audits["first-meaningful-paint"].numericValue,
	},
	{
		id: "total-timing-numeric",
		label: "Total Timing",

		selector: (report) => report.lighthouseResult.timing.total,
	},
	{
		id: "dom-size-numeric",
		label: "DOM Size",

		selector: (report) =>
			report.lighthouseResult.audits["dom-size"].numericValue,
	},
	{
		id: "total-byte-weight-numeric",
		label: "Total Byte Weight",
		selector: (report) =>
			report.lighthouseResult.audits["total-byte-weight"].numericValue,
	},
	{
		id: "time-to-first-byte-numeric",
		label: "Time To First Byte",
		selector: R.path([
			"lighthouseResult",
			"audits",
			"time-to-first-byte",
			"numericValue",
		]),
	},
	{
		id: "server-response-time",
		label: "Server Response Time",
		selector: R.path([
			"lighthouseResult",
			"audits",
			"server-response-time",
			"numericValue",
		]),
	},
	{
		id: "estimated-input-latency-numeric",
		label: "Estimated Input Latency",
		selector: (report) =>
			report.lighthouseResult.audits["estimated-input-latency"].numericValue,
	},
	{
		id: "total-blocking-time-numeric",
		label: "Total Blocking Time",
		selector: (report) =>
			report.lighthouseResult.audits["total-blocking-time"].numericValue,
	},
];
