/**
 * Storing many files in a single directory might be problematic.
 * This utility functions are for working with timeseries oriented
 * fiels in a directory structure.
 *
 * Path structure: ${entity}/${YYYY}/${MM}${DD}/${HH}${MM}/${TS}-${8BH}.${EXT}
 *
 * YYYY: number of the year
 * MM: number of the month
 * DD: number of the day
 * HH: hour in 24h format
 * MM: minute of a hour
 * TS: timestamp in seconds
 * 8BH: random 8 byte hash
 * Example: runs/2020/0511/2124/1589232286-e089cfb5066f4d5b.json
 *
 * Note: there is no separator between the month and the day, but also no separator between
 * the hour and the minute. The reason for this decision is to create as few hierarchy levels
 * as possible.
 *
 * All numbers will have leading zeroes for lexicographical sorting. For example 2020/0501/0204.
 *
 * The ID of the above entity would then be 1589232286-e089cfb5066f4d5b and can be used in a URL.
 */

const crypto = require("crypto");
const path = require("path");
const fs = require("fs").promises;
const R = require("ramda");

const pad = (input) => String(input).padStart(2, "0");

module.exports.createId = () => {
	return (
		Math.round(Date.now() / 1000) + "-" + crypto.randomBytes(8).toString("hex")
	);
};

module.exports.createNewEntityPath = (ext) =>
	this.getEntityPathById(this.createId(), ext);

module.exports.getEntityPathById = (id, ext = "json") => {
	const [timestamp] = id.split("-");
	const date = new Date(timestamp * 1000);
	return path.join(
		String(date.getUTCFullYear()),
		`${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`,
		`${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}`,
		`${id}.${ext}`
	);
};

/**
 * Finds the id of the latest file in the hierarchy using lexicographical sorting.
 */
module.exports.findLatestEntity = async (cur) => {
	const items = await fs.readdir(cur);
	if (items.length < 1) return undefined;
	const sorted = R.sort((left, right) => right.localeCompare(left), items);
	const latest = R.head(sorted);
	// we rely on the fact that the deepest level in our store is a file with an extension
	// we save some stating, but the directories are not allowed to have a . in the name
	const parts = latest.split(".");
	return parts.length > 1
		? parts[0]
		: this.findLatestEntity(path.join(cur, latest)); // recursion
};

module.exports.findAllEntities = async (dir) => {
	const files = await fs.readdir(dir);
	const entities = await Promise.all(
		files.map(async (file) => {
			// we rely on the fact that the deepest level in our store is a file with an extension
			// we save some stating, but the directories are not allowed to have a . in the name
			const parts = file.split(".");
			if (parts.length > 1) return parts[0];
			return this.findAllEntities(path.join(dir, file));
		})
	);

	// flatten the output
	return entities.reduce((all, cur) => all.concat(cur), []);
};
