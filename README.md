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
only way to view the data right now, except JSON, understanding of Elasticsearch
and Kibana is mandatory.

## How To

- [Install Perfception](docs/how-to/install-perfception.md)
- [Create a Project and Collect the Reports](docs/how-to/create-project-collect-reports.md)
- [Import the Reports into Elasticsearch](docs/how-to/elasticsearch-import.md)
- [View a Report with Lighthouse](docs/how-to/view-reports-with-lighthouse.md)

## Reference

- [Log Output](docs/reference/log-output.md)

## License

Copyright 2021 Tim Navrotskyy and contributors

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.