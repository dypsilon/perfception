# Ho To View the Reports with Lighthouse

## Outcome

A report from the project `entities` directory is presented using the
[Lighthouse](https://github.com/GoogleChrome/lighthouse) HTML renderer.

- [Correctly Installed perfception](install-perfception.md)
- [A Collection of Reports](create-project-collect-reports.md).

## Steps

## 1. Start the Viewer

Start the Lighthouse Report Viewer by going to the project directory and running
`perfception run-lhr-viewer`. By default it will run on port `3001`. The reports
are now available at the following URL:

```
http://localhost:3001/api/report/<report-id>/lighthouse-html
```

## 2. View a Report

Replace `<report-id>` with an ID of the report you want to view. For example:

```
http://localhost:3001/api/report/1589551009-92b95d6cf956991e/lighthouse-html
```

The ID of the report is the filename of a deepest file in the `entities/report`
directory.