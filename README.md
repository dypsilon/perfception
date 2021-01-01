# Perfception

Utilities for website performance measurement and analysis.

## Installation

Clone the repository, run `npm install`, and add `cli.js` to the PATH.

For example:

```bash
git clone git@github.com:dypsilon/perfception.git
cd perfception
npm install
ln -s `realpath cli.js` /usr/local/bin/perfception
```

Now you are able to create project directory and run `perfception` inside of it.

## Creating a Project

1. Create a new directory with `conf` and `logs` subdirectories.
2. Create a simple config file.
3. Run collect to execute requests against the PSI and fetch the reports.
4. The reports will be available in the `entities` directories.

## Collecting

Note: `collect` is a command which should be run from the project directory as `cwd`.

Running collect with pretty output (recommended only for development).

```bash
perfception collect --pretty
```

Filtering output by a log level. One of 'fatal', 'error', 'warn', 'info', 'debug', 'trace' or 'silent'.

```bash
perfception collect --level info
```

Collecting and outputting the logs to a file in addition to the STDOUT.

```bash
perfception collect 2>&1 | tee logs/collect`date '+%Y-%m-%d_%H-%M-%S'`.log
```

See [jq](https://stedolan.github.io/jq/), [pino-tee](https://www.npmjs.com/package/pino-tee) and [pino-pretty](https://github.com/pinojs/pino-pretty) for more logging options.

For example the following command will create pretty output on stdout with a log level "info" or above but write a full blown NDJSON file with trace level logs in addition:

```bash
perfception collect 2>&1 | tee logs/collect-`date '+%Y-%m-%d_%H-%M-%S'`.log |  jq -c 'select(.level > 20)' | pino-pretty
```

You can now analyze the corresponding log if required with:

```bash
# replace the date and time in the file name and `.level > 0` with the level you want to work with (e.g. 30, 40, 50).
cat collect2020-05-16_17-40-14.log |  jq -c 'select(.level > 0)' | pino-pretty
```

## Indexing

For this to work correctly you need a file called `elasticsearch.js` inside of the `conf` directory in your project.

```javascript
module.exports = {
	client: {
		node: "http://localhost:9200",
	},
	indexPrefix: "pagespeed-perception_",
};
```

After an instance of elasticsearch is available under the above URL, it is possible to index all available data with `perfception reindex`. This command will create a new index with the corresponding prefix and import the metrics.
After this initial setup is done, it is possible to import all subsequent runs with `perfception index-run`. This
command will index only the most recent run by default, but it is possible to provide the ID of the run you want to be indexed as the first parameter.

## Viewing The Reports

Start the Lighthouse Report Viewer by going to the project directory and running `perfception run-lhr-viewer`.
By default it will run on port `3001`. The reports are now available under the following URL:

```
http://localhost:3001/api/report/<report-id>/lighthouse-html
```

Replace `<report-id>` with an ID of the report you want to view. For example:

```
http://localhost:3001/api/report/1589551009-92b95d6cf956991e/lighthouse-html
```

You can configure Kibana to create those links automatically by using [field formatters](https://www.elastic.co/guide/en/kibana/current/field-formatters-string.html).
