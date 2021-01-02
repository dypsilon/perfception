# Perfception

Get a perception of your website's performance.

PageSpeed Insights and Lighthouse is a great way to measure the initial loading
performance of your website, but it is a one time snapshot of a single page
which you have to trigger manually every time. Furthermore, even though
PageSpeed Insights tries to normalize the results, you will likely get different
scores every time without any changes to the actual website. In addition, the
scoring system itself is sometimes adjusted by the Lighthouse team, leaving you
puzzled about what exactly changed - your website or the measurement method.

With frequent changes to the content of your website, the technical
implementation, measurement methods and environment, having historical data
which will show you how the performance is changing over time is crucial to be
able to reason about the metrics and make prudent decisions about what to
improve next. A dashboard showing all scores provided by Lighthouse, aggregated
for different page types, simulated devices and averaged between multiple test
runs will help you both save time collecting the metrics and provide vital
insights into how the changes of your website are affecting the loading
performance.

When installed and automated, Perfception will regularly trigger performance
audits and collect performance measurements using the PageSpeed Insights API.
The script will store the data in simple JSON files, which can be easily
archived and imported into an analytics platform. Elasticsearch + Kibana is
supported out of the box. You decide which pages of your website are checked and
how often.

## Project Status

The project is currently in the prototype phase and might never leave it. You
are welcome to fork it and play with it but it is only recommended to use it in
production scenarios only if you know exactly what you are doing. The data
format and the API will likely change in the upcoming releases. Furthermore,
continuous maintenance and development of new features is not guaranteed in the
long run.

## Target Users

Developers, Technical Leaders, Architects, Project Managers and Product Owners
of public facing websites will benefit from the insights provided by
Perfception. To install and configure it properly, intermediate knowledge of
Linux and Bash is required. If you want to use Kibana Dashboards, which is the
only way to view the data right now, understanding of Elasticsearch and Kibana
is mandatory.

## Installation

Clone the repository, run `npm install`, and add `cli.js` to the PATH.

For example:

```bash
git clone git@github.com:dypsilon/perfception.git
cd perfception
npm install
ln -s `realpath cli.js` /usr/local/bin/perfception
```

Now you are able to create a project directory and run `perfception` inside of it.

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
