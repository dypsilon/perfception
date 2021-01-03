# How To Import the Reports into Elasticsearch

## Outcome

Abridged reports are imported into Elasticsearch and can be examined with
Kibana.

## Prerequisites

- [Knowledge of the Setup and Usage of Elasticsearch](https://www.elastic.co/what-is/elk-stack)
- [Correctly Installed perfception](install-perfception.md)
- [A Collection of Reports](create-project-collect-reports.md).

## Steps

### 1. Create the Config File

Create a file `conf/elasticsearch.js` inside the project directory with the following contents:

```javascript
module.exports = {
	client: {
		node: "http://localhost:9200",
	},
	indexPrefix: "perfception_",
};
```

### 2. Install and Run Elasticsearch

A guide
"[Running the Elastic Stack on Docker](https://www.elastic.co/guide/en/elastic-stack-get-started/current/get-started-docker.html)"
can be used to get the Elastic Stack up and running quickly. The instance should
be available at the host and port configured in the `conf/elasticsearch.js`.

### 3. Create Elasticsearch Index

After an instance of Elasticsearch is available under the above URL, the
following command will create an appropriate index and configure the mappings:

```
perfception elasticsearch create-index
```

### 4. Index all Reports in the Collection

To index all available reports run `perfception elasticsearch index --all`. This
command will import the metrics. Perfception will automatically find the most
recent index with the configured prefix and import all available reports. This
command is idempotent. It will not insert the same reports again, but instead
update the existing ones.

### 5. Execute a New Run and Index Only the Corresponding Reports

Run `perfception collect` again to acquire some new reports. After the command
has finished executing, run `perfception elasticsearch index` to index only the
reports from the most recent run.