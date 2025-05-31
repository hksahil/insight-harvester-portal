
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
    },
      {
        id: 19,
        title: "What's difference between Postgres vs SQL",
        subtitle: "An overview of Postgres and SQL differences",
        slug: "postgres-vs-sql",
        tag: "Database internals",
        excerpt: "Comparing Postgres features and capabilities against SQL standards",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7222673078659506177"
      },
      {
        id: 20,
        title: "Microsoft Licensing",
        subtitle: "Understanding Microsoft's licensing models",
        slug: "msft-licensing",
        tag: "PowerBI",
        excerpt: "Overview of Microsoft's licensing options and their implications for users",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7195693038214533120"
      },
      {
        id: 21,
        title: "PowerBI Licensing",
        subtitle: "Breaking down Power BI licensing tiers",
        slug: "pbi-licensing",
        tag: "PowerBI",
        excerpt: "Breaking down Power BI licensing tiers and costs",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7196391490506391552"
      },
      {
        id: 22,
        title: "Report Rationalisation Framework",
        subtitle: "Framework for IT asset rationalization",
        slug: "rationalisation-framework",
        tag: "Thought leadership",
        excerpt: "Introducing a structured framework for rationalizing IT assets",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7238083062113165312"
      },
      {
        id: 23,
        title: "What exactly is Onelake",
        subtitle: "Introducing Microsoft's unified OneLake solution",
        slug: "onelake",
        tag: "Data engineering",
        excerpt: "Exploring Microsoft's OneLake platform for unified data storage",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7266071137309061120"
      },
      {
        id: 24,
        title: "Why Relational DBs are slow",
        subtitle: "Examining performance bottlenecks in relational databases",
        slug: "why-relational-dbs-are-slow",
        tag: "Database internals",
        excerpt: "Analyzing factors that impact relational database performance",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7173790079742664705"
      },
      {
        id: 25,
        title: "Understanding hidden Vendor Lockins",
        subtitle: "Risks of vendor lock-in in IT ecosystems",
        slug: "vendor-lockins",
        tag: "Thought leadership",
        excerpt: "Discussing risks and considerations of vendor lock-in in IT",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7174330978465640448"
      },
      {
        id: 26,
        title: "Analyst Roadmap",
        subtitle: "Key milestones for aspiring data analysts",
        slug: "analyst-roadmap",
        tag: "Thought leadership",
        excerpt: "A roadmap outlining key skills and milestones for analysts",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7220655285969772544"
      },
      {
        id: 27,
        title: "User Adoption of dashboards",
        subtitle: "Driving user adoption of analytics platforms",
        slug: "user-adoption",
        tag: "Thought leadership",
        excerpt: "Strategies to drive user adoption of analytics tools",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7212177537253220354"
      },
      {
        id: 28,
        title: "Self Serve Analytics",
        subtitle: "Empowering users with self-service analytics",
        slug: "self-serve-analytics",
        tag: "Thought leadership",
        excerpt: "Benefits and challenges of self-service analytics",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7211936535217127425"
      },
      {
        id: 29,
        title: "Snowflake vs Databricks",
        subtitle: "Comparing Snowflake and Databricks platforms",
        slug: "snowflake-vs-databricks",
        tag: "Data engineering",
        excerpt: "Comparing Snowflake and Databricks for data processing and analytics",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7210921498750980097"
      },
      {
        id: 30,
        title: "Why SSMS isn't dead",
        subtitle: "Advocating SQL Server Management Studio's relevance",
        slug: "ssms-isnt-dead",
        tag: "Database internals",
        excerpt: "Advocating for continued use of SQL Server Management Studio",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7209860805121490945"
      },
      {
        id: 31,
        title: "Why SSAS isn't dead",
        subtitle: "Highlighting SQL Server Analysis Services' strengths",
        slug: "ssas-isnt-dead",
        tag: "Database internals",
        excerpt: "Highlighting the relevance of SQL Server Analysis Services",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7207469601272520704"
      },
      {
        id: 32,
        title: "What exactly are OLAP Cubes",
        subtitle: "The enduring value of OLAP cubes in BI",
        slug: "olap-cubes",
        tag: "Database internals",
        excerpt: "Discussing the role and benefits of OLAP cubes in BI",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7207126516730667009"
      },
      {
        id: 33,
        title: "Brief History of Databases",
        subtitle: "Tracing the evolution of database technologies",
        slug: "db-history",
        tag: "Database internals",
        excerpt: "Tracing the evolution of databases over time",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7149991954364141568"
      },
      {
        id: 34,
        title: "Why Companies choose Open Source",
        subtitle: "Benefits of embracing open-source software",
        slug: "why-open-source",
        tag: "Thought leadership",
        excerpt: "Exploring reasons to embrace open-source software",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7149787765616820225"
      },
      {
        id: 35,
        title: "INT(10) is a lie",
        subtitle: "Clarifying misconceptions about INT(10) in SQL",
        slug: "int10-is-a-lie",
        tag: "Database internals",
        excerpt: "Debunking misconceptions about INT(10) in SQL",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7129302421406703616"
      },
      {
        id: 36,
        title: "Automating Modelling tasks in PowerBI",
        subtitle: "Enhancing BI model development with Tabular Editor",
        slug: "tabular-editor",
        tag: "PowerBI",
        excerpt: "Showcasing features of Tabular Editor for model development",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7293559074812542976"
      },
      {
        id: 37,
        title: "Advance Visuals in Analytics",
        subtitle: "Unlocking advanced analytics in Tableau",
        slug: "tableau-advance",
        tag: "Thought leadership",
        excerpt: "Highlighting advanced capabilities of Tableau for analytics",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7150199326797877248"
      },
      {
        id: 38,
        title: "Float vs Decimal",
        subtitle: "Comparing data types: float vs decimal",
        slug: "float-vs-decimal",
        tag: "Database internals",
        excerpt: "Contrasting float and decimal data types and their use cases",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7146852764856295424"
      },
      {
        id: 39,
        title: "Understanding the floating points",
        subtitle: "Understanding floating point number intricacies",
        slug: "floats",
        tag: "Database internals",
        excerpt: "In-depth look at floating point numbers and their precision issues",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7146846893141090304"
      },
      {
        id: 40,
        title: "Estimating Database Size",
        subtitle: "Techniques for estimating database storage size",
        slug: "estimating-db-size",
        tag: "Database internals",
        excerpt: "Methods for estimating database size requirements",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7138746228124684288"
      },
      {
        id: 41,
        title: "BI Systems sv Programming Systems",
        subtitle: "Contrasting BI systems and programming systems",
        slug: "bi-systems-vs-programming-systems",
        tag: "Thought leadership",
        excerpt: "Comparing business intelligence systems with programming systems",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7131600861079777280"
      },
      {
        id: 42,
        title: "Database Scaling strategies",
        subtitle: "Strategies for database scalability",
        slug: "scaling-dbs",
        tag: "Database internals",
        excerpt: "Approaches to scaling databases for performance and reliability",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7111239678099402752"
      },
      {
        id: 43,
        title: "dbt tool cheatsheet",
        subtitle: "Essential dbt commands and shortcuts",
        slug: "dbt-cheatsheet",
        tag: "Data engineering",
        excerpt: "A handy cheatsheet for dbt commands and best practices",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7198332620642906114"
      },
      {
        id: 44,
        title: "Why companies are shifting from ETL to ELT",
        subtitle: "Transitioning from ETL to ELT workflows",
        slug: "etl-to-elt",
        tag: "Data engineering",
        excerpt: "Examining the shift from ETL to ELT in data workflows",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7189611309527719936"
      },
      {
        id: 45,
        title: "Why's dbt tool poping",
        subtitle: "Exploring dbt's surge in popularity",
        slug: "whys-dbt-poping",
        tag: "Data engineering",
        excerpt: "Exploring reasons behind dbt's growing popularity",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7186993581025366017"
      },
      {
        id: 46,
        title: "Implementing Data governance",
        subtitle: "Implementing effective data governance practices",
        slug: "data-governance",
        tag: "Thought leadership",
        excerpt: "Best practices for data governance in organizations",
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7222427400091885568"
      },
    [
  {
    id: 47,
    title: "Custom sorting so complicated in PowerBI",
    subtitle: "Day [19/30] of highlighting Power BI product limitations to Microsoft",
    slug: "Custom-sorting so complicated in PowerBI",
    tag: "PBI limitations",
    excerpt: "Why to click on ten things just to sort my column",
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7323943135347146752"
  },
  {
    id: 48,
    title: "Hidden Cost of Power BI",
    subtitle: "Limitation post about hidden cost",
    slug: "hidden-cost-of-power-bi",
    tag: "PowerBI",
    excerpt: "Licensing, scalability, and workspace costs aren't transparent.",
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7324501606085877761"
  },
  {
    id: 49,
    title: "no feature for doing an ad hoc calculation in PowerBI",
    subtitle: "Subtitle",
    slug: "post-title",
    tag: "Tag",
    excerpt: "Excerpt summary.",
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7324482151981232128"
  },
  {
    id: 50,
    title: "Excel Limitation in Power BI",
    subtitle: "Power BI limitation while exporting to Excel",
    slug: "excel-export-limitation-power-bi",
    tag: "Excel limitations",
    excerpt: "Export doesn't respect format or hierarchy from Power BI.",
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7325154760813092866"
  },
  {
    id: 51,
    title: "Language Jargon in PowerBI",
    subtitle: "Day [21/30] of highlighting Power BI product limitations to Microsoft",
    slug: "Language Jargon in PowerBI",
    tag: "PBI limitations",
    excerpt: "Language Jargon in PowerBI",
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7324513140006621184"
  },
  {
    id: 52,
    title: "External Tools in PBI workflows",
    subtitle: "Discussing external tools usage in PBI",
    slug: "External Tools in PBI workflows",
    tag: "PowerBI",
    excerpt: "External tools can't be used in Power BI Service, only Desktop.",
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7325458745243631616"
  },
  {
    id: 53,
    title: "PowerBI's Excel connectivity is bad",
    subtitle: "Day [22/30] of highlighting Power BI product limitations to Microsoft",
    slug: "PowerBI's Excel connectivity is bad",
    tag: "PBI limitations",
    excerpt: "PowerBI's Excel connectivity is bad",
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7324516486683787264"
  },
  {
    id: 54,
    title: "Less control over the formatting & customization",
    subtitle: "Day [23/30] of highlighting Power BI product limitations to Microsoft",
    slug: "Less control over the formatting & customization",
    tag: "PBI limitations",
    excerpt: "Less control over the formatting & customization",
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7324540059108474880"
  },
  {
    id: 55,
    title: "Complicated to configure parameters in PowerBI",
    subtitle: "Day [24/30] of highlighting Power BI product limitations to Microsoft",
    slug: "Complicated to configure parameters in PowerBI",
    tag: "PBI limitations",
    excerpt: "Complicated to configure parameters in PowerBI",
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7327603369680785408"
  },
  {
    id: 56,
    title: "Limited interactivity options available in PowerBI",
    subtitle: "Day [25/30] of highlighting Power BI product limitations to Microsoft",
    slug: "Limited interactivity options available in PowerBI",
    tag: "PBI limitations",
    excerpt: "Limited interactivity options available in PowerBI",
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7324738257533984769"
  },
  {
    id: 57,
    title: "Why don’t table and matrix totals add up correctly?",
    subtitle: "Day [26/30] of highlighting Power BI product limitations to Microsoft",
    slug: "Why don’t table and matrix totals add up correctly?",
    tag: "PBI limitations",
    excerpt: "Why don’t table and matrix totals add up correctly?",
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7328352503480098816"
  },
  {
    id: 58,
    title: "Limited control over number formatting",
    subtitle: "Day [27/30] of highlighting Power BI product limitations to Microsoft",
    slug: "limited control over number formatting",
    tag: "PBI limitations",
    excerpt: "limited control over number formatting",
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7328653787609346049"
  },
  {
    id: 59,
    title: "User-actions are impossible in PBI",
    subtitle: "Day [28/30] of highlighting Power BI product limitations to Microsoft",
    slug: "User-actions are impossible in PBI",
    tag: "PBI limitations",
    excerpt: "User-actions are impossible in PBI",
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7324705616696856576"
  },
  {
    id: 60,
    title: "PBI sucks in transactional reporting",
    subtitle: "Day [29/30] of highlighting Power BI product limitations to Microsoft",
    slug: "PBI sucks in transactional reporting",
    tag: "PBI limitations",
    excerpt: "PBI sucks in transactional reporting",
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7329140078935449601"
  },
  {
    id: 61,
    title: "Advanced Reporting & Modelling Features Missing",
    subtitle: "Day [30/30] of highlighting Power BI product limitations to Microsoft",
    slug: "Advanced Reporting & Modelling Features Missing",
    tag: "PBI limitations",
    excerpt: "Advanced Reporting & Modelling Features Missing",
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7329391546917670912"
  }
];
