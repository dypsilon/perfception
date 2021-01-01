const R = require("ramda");

module.exports = [
	{
		id: "performance-score",
		label: "Performance",
		selector: (report) => report.lighthouseResult.categories.performance.score,
		default: true,
	},
	{
		id: "interactive-score",
		label: "Time To Interactive",
		selector: (report) => report.lighthouseResult.audits.interactive.score,
	},
	{
		id: "speed-index-score",
		label: "Speed Index",
		selector: (report) => report.lighthouseResult.audits["speed-index"].score,
	},
	{
		id: "first-contentful-paint-score",
		label: "First Contentful Paint",
		selector: (report) =>
			report.lighthouseResult.audits["first-contentful-paint"].score,
	},
	{
		id: "first-cpu-idle-score",
		label: "First CPU Idle",
		selector: (report) =>
			report.lighthouseResult.audits["first-cpu-idle"].score,
	},
	{
		id: "first-meaningful-paint-score",
		label: "First Meaningful Paint",
		selector: (report) =>
			report.lighthouseResult.audits["first-meaningful-paint"].score,
	},
	{
		id: "mainthread-work-breakdown-score",
		label: "Mainthread Work Breakdown",
		selector: (report) =>
			report.lighthouseResult.audits["mainthread-work-breakdown"].score,
	},
	{
		id: "render-blocking-resources-score",
		label: "Render Blocking Resources",
		selector: (report) =>
			report.lighthouseResult.audits["render-blocking-resources"].score,
	},
	{
		id: "uses-long-cache-ttl-score",
		label: "Uses Long Cache TTL",
		selector: (report) =>
			report.lighthouseResult.audits["uses-long-cache-ttl"].score,
	},
	{
		id: "max-potential-fid-score",
		label: "Max Potential FID",
		selector: (report) =>
			report.lighthouseResult.audits["max-potential-fid"].score,
	},
	{
		id: "estimated-input-latency-score",
		label: "Estimated Input Latency",
		selector: (report) =>
			report.lighthouseResult.audits["estimated-input-latency"].score,
	},
	{
		id: "total-blocking-time-score",
		label: "Total Blocking Time",
		selector: (report) =>
			report.lighthouseResult.audits["total-blocking-time"].score,
	},
	{
		id: "bootup-time-score",
		label: "Bootup Time",
		selector: (report) => report.lighthouseResult.audits["bootup-time"].score,
	},
	{
		id: "offscreen-images-score",
		label: "Offscreen Images",
		selector: (report) =>
			report.lighthouseResult.audits["offscreen-images"].score,
	},
	{
		id: "uses-responsive-images-score",
		label: "Uses Responsive Images",
		selector: (report) =>
			report.lighthouseResult.audits["uses-responsive-images"].score,
	},
	{
		id: "unused-css-rules-score",
		label: "Unused CSS Rules",
		selector: (report) =>
			report.lighthouseResult.audits["unused-css-rules"].score,
	},
	{
		id: "largest-contentful-paint-score",
		selector: R.path([
			"lighthouseResult",
			"audits",
			"largest-contentful-paint",
			"score",
		]),
	},
	{
		id: "cumulative-layout-shift-score",
		selector: R.path([
			"lighthouseResult",
			"audits",
			"cumulative-layout-shift",
			"score",
		]),
	},
	{
		id: "cumulative-layout-shift-score",
		selector: R.path([
			"lighthouseResult",
			"audits",
			"cumulative-layout-shift",
			"score",
		]),
	},
];
