
// Mock data for blogs with embed URLs
export const MOCK_BLOGS = [
    {
      id: 1,
      title: "Query tagging isn't supported in Microsoft Power BI",
      subtitle: "Day 1 of highlighting Power BI product limitations to Microsoft.",
      slug: "why-isnt-query-tagging-supported-in-microsoft-power-bi-snowflake-connector",
      tag: "PBI limitations",
      excerpt: "No way to filter Snowflake query history by report name",
      embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7310351811222073344"
    },
    {
      id: 2,
      title: "Can't export data from visuals with more than 150k rows",
      subtitle: "Day 2 of highlighting Power BI product limitations to Microsoft.",
      slug: "why-cant-we-export-data-from-visuals-with-more-than-150k-rows-in-power-bi",
      tag: "PBI limitations",
      excerpt: "Export to Excel limited to 150k rows",
      embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7310565550085050368"
    },
    {
      id: 3,
      title: "Exported Power BI reports include scrollbars in PDF exports",
      subtitle: "Day 3 of highlighting Power BI product limitations to Microsoft.",
      slug: "why-do-exported-power-bi-reports-include-scrollbars-in-pdf-exports",
      tag: "PBI limitations",
      excerpt: "Inflexible PDF export with unwanted scrollbars",
      embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7310908451872731137"
    },
    {
      id: 4,
      title: "No 'Export to Excel' button to export all tables/crosstabs in one shot",
      subtitle: "Day 4 of highlighting Power BI product limitations to Microsoft.",
      slug: "why-isnt-there-an-export-to-excel-button-to-export-all-tables-crosstabs-in-one-shot",
      tag: "PBI limitations",
      excerpt: "Tedious export process requiring multiple clicks",
      embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7311269400458760192"
    },
    {
      id: 5,
      title: "No multi-layered medallion-style data modeling architecture in Power BI",
      subtitle: "Day 5 of highlighting Power BI product limitations to Microsoft.",
      slug: "why-cant-we-have-a-multi-layered-medallion-style-data-modelling-architecture-in-power-bi",
      tag: "PBI limitations",
      excerpt: "Lack of multi-layered medallion architecture support",
      embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7312382045282791425"
    },
    {
      id: 6,
      title: "Hyperlinks inside tooltips aren't possible in Power BI reports",
      subtitle: "Day 6 of highlighting Power BI product limitations to Microsoft.",
      slug: "why-cant-we-have-hyperlinks-inside-tooltips-in-power-bi-reports",
      tag: "PBI limitations",
      excerpt: "Tooltips lack support for clickable hyperlinks",
      embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7312717580052348928"
    },
    {
      id: 7,
      title: "Can't have a DirectQuery/Live connection to SharePoint files in Power BI",
      subtitle: "Day 7 of highlighting Power BI product limitations to Microsoft.",
      slug: "why-cant-we-have-directquery-live-connection-to-sharepoint-files-in-power-bi",
      tag: "PBI limitations",
      excerpt: "No DirectQuery support for SharePoint files",
      embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7314948139696734209"
    },
    {
      id: 8,
      title: "Less Control over visualisations in Power BI",
      subtitle: "Day 8 of highlighting Power BI product limitations to Microsoft.",
      slug: "why-cant-we-have-better-native-control-over-visualizations-like-grouped-stacked-bar-and-line-charts-in-power-bi",
      tag: "PBI limitations",
      excerpt: "No support for complex combined visual types",
      embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7315775111872098305"
    },
    {
      id: 9,
      title: "Limited control over data refresh intervals beyond the 30-minute granularity in Power BI",
      subtitle: "Day 9 of highlighting Power BI product limitations to Microsoft.",
      slug: "why-cant-we-have-full-control-over-data-refresh-intervals-beyond-the-30-minute-granularity-in-power-bi",
      tag: "PBI limitations",
      excerpt: "Limited to 30-minute refresh intervals",
      embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7316187194677698560"
    },
    {
      id: 10,
      title: "No once except model owners can change parameters",
      subtitle: "Day 10 of highlighting Power BI product limitations to Microsoft.",
      slug: "why-cant-anyone-other-than-the-data-model-owners-change-parameters-in-power-bi",
      tag: "PBI limitations",
      excerpt: "Only model owners can modify parameters",
      embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7317111954014121984"
    },
    {
      id: 11,
      title: "Can't join tables on multiple columns while creating the data model in Power BI",
      subtitle: "Day 11 of highlighting Power BI product limitations to Microsoft.",
      slug: "why-cant-we-join-tables-on-multiple-columns-while-creating-the-data-model-in-power-bi",
      tag: "PBI limitations",
      excerpt: "Only single-column joins; composite keys required",
      embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7318151169665613824"
    },
    {
      id: 12,
      title: "Direct Query fails after 225s wait time",
      subtitle: "Day 12 of highlighting Power BI product limitations to Microsoft.",
      slug: "why-cant-we-control-query-timeouts-in-directquery-mode-beyond-the-fixed-225-second-limit-in-power-bi",
      tag: "PBI limitations",
      excerpt: "Fixed 225-second DirectQuery timeout without customization",
      embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7317125382946660353"
    },
    {
      id: 13,
      title: "Can't schedule monthly data refreshes for data models in Power BI",
      subtitle: "Day 13 of highlighting Power BI product limitations to Microsoft.",
      slug: "why-cant-we-schedule-monthly-data-refreshes-for-data-models-in-power-bi",
      tag: "PBI limitations",
      excerpt: "No monthly refresh option for data models",
      embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7317218148720549889"
    },
    {
      id: 14,
      title: "Need to pay more just to schedule hourly data refreshes in Power BI",
      subtitle: "Day 14 of highlighting Power BI product limitations to Microsoft.",
      slug: "why-should-we-pay-more-for-premium-capacity-just-to-schedule-hourly-data-refreshes-in-power-bi",
      tag: "PBI limitations",
      excerpt: "Hourly refresh requires Premium and manual setup",
      embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7318981730617511939"
    },
    {
      id: 15,
      title: "No version control features available by default in Power BI",
      subtitle: "Day 15 of highlighting Power BI product limitations to Microsoft.",
      slug: "why-dont-we-have-any-version-control-features-available-by-default-in-power-bi",
      tag: "PBI limitations",
      excerpt: "No native version control for reports and models",
      embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7318984914354286593"
    },
    {
      id: 16,
      title: "We can't use Power BI on a Mac",
      subtitle: "Day 16 of highlighting Power BI product limitations to Microsoft.",
      slug: "why-cant-we-use-power-bi-on-a-mac",
      tag: "PBI limitations",
      excerpt: "No native Power BI Desktop for macOS",
      embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7320687963179294722"
    },
    {
      id: 17,
      title: "No public platform to host and showcase Power BI dashboards",
      subtitle: "Day 17 of highlighting Power BI product limitations to Microsoft.",
      slug: "why-dont-we-have-a-public-platform-to-host-and-showcase-power-bi-dashboards",
      tag: "PBI limitations",
      excerpt: "No public gallery to showcase dashboards",
      embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7321050311505174528"
    },
    {
      id: 18,
      title: "Moving reports & data models from one workspace to another so challenging",
      subtitle: "Day 18 of highlighting Power BI product limitations to Microsoft.",
      slug: "why-is-moving-reports-and-data-models-from-one-workspace-to-another-so-challenging-in-power-bi",
      tag: "PBI limitations",
      excerpt: "Lack of scalable solution to move reports and models across workspaces",
      embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7320067844656742400"
    }
];
