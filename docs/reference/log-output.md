# Log Output

The logs are generally printed using [pino](https://github.com/pinojs/pino) in
[NDJSON](http://ndjson.org/) format.

## Useful Commands

Running collect with pretty output (recommended only for development).

```bash
perfception collect --pretty
```

Filtering output by a log level. One of 'fatal', 'error', 'warn', 'info',
'debug', 'trace' or 'silent'.

```bash
perfception collect --level info
```

Collecting and outputting the logs to a file in addition to the STDOUT.

```bash
perfception collect 2>&1 | tee logs/collect`date '+%Y-%m-%d_%H-%M-%S'`.log
```

See [jq](https://stedolan.github.io/jq/),
[pino-tee](https://www.npmjs.com/package/pino-tee) and
[pino-pretty](https://github.com/pinojs/pino-pretty) for more logging options.

For example the following command will create pretty output on stdout with a log
level "info" or above but write a full blown NDJSON file with trace level logs
in addition:

```bash
perfception collect 2>&1 | tee logs/collect-`date '+%Y-%m-%d_%H-%M-%S'`.log |  jq -c 'select(.level > 20)' | pino-pretty
```

You can now analyze the corresponding log if required with:

```bash
# replace the date and time in the file name and `.level > 0` with the level you want to work with (e.g. 30, 40, 50).
cat collect2020-05-16_17-40-14.log |  jq -c 'select(.level > 0)' | pino-pretty
```