
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CodeDisplay from '@/components/CodeDisplay';
import SubmitSnippetForm from '@/components/SubmitSnippetForm';
import { FileText, Code, FileCode, Send } from 'lucide-react';

const SnippetsTab = () => {
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  const prompts = [
    {
      title: "TMDL view - Set descriptions for measures",
      description: "Help add or replace descriptions for each measure in a user-friendly way.",
      code: `Help me add or replace descriptions for each measure.
Consider the following rules:
- insert or replace the description that should appear above the measure code and after ///
- use business friendly terms
- describe the DAX code in the description in business-friendly terms. Do not copy the code to the description.
- use the name and other measures as context
- description should not be longer than 500 chars`
    },
    {
      title: "Comment Highlighted Power Query Code",
      description: "Get assistance with adding meaningful comments to Power Query code.",
      code: `You are an assistant to help Power Query developers comment their code. Please update each line of code by performing the following:

Insert a comment above the code explaining what that piece of code is doing.
Do not start the comment with the word Step or a number
Do not copy code into the comment.
Keep the comments to a maximum of 225 characters.`
    },
    {
      title: "Format all my numeric measures TMDL prompt",
      description: "Standardize the format of numeric measures in your TMDL code.",
      code: `Here's TMDL for my existing Power BI measures. For all percentages, change the format string to one decimal point, and for all whole numbers, format with a comma in the format string. Output the full code to update the measures.`
    },
    {
      title: "Format and custom sort your date table",
      description: "Apply proper sorting and formatting to date table columns.",
      code: `(this requires a higher-grade model, like o3 or 3.7 Sonnet to handle wide date tables)

Here is my date table TMDL for Power BI. Add a line to each TEXT type column for sortByColumn, giving it a reference to the equivalent numeric or date type column in the code. Do not omit or change the Power Query text in your response.

Also format all date-type fields by adding a line like this to the date column TMDL:
formatString: m/d/yyyy

(paste your original date table TMDL here)`
    }
  ];

  const tmdl = [
    {
      title: "Object-level Security",
      description: "Template for setting up object-level security in your Power BI model.",
      code: `createOrReplace

\trole '<Enter role name>'
\t\tmodelPermission: read

\t\ttablePermission <Enter table name>

\t\t\tcolumnPermission <Enter column name> = none

\t\ttablePermission 'RLS Users' = 'RLS Users'[Email] = USERPRINCIPALNAME()`
    },
    {
      title: "Time Intelligence Calculation Group by DataZoe",
      description: "Create a calculation group for time intelligence functions.",
      code: `createOrReplace

\t/// Defines additional DAX logic that can be used with model measures to perform analysis with the date table.
\ttable 'Time intelligence'
\t\t

\t\tcalculationGroup

\t\t\tcalculationItem Total = SELECTEDMEASURE()

\t\t\tcalculationItem MTD = CALCULATE(SELECTEDMEASURE(), DATESMTD('Date'[Date]))

\t\t\tcalculationItem QTD = CALCULATE(SELECTEDMEASURE(), DATESQTD('Date'[Date]))

\t\t\tcalculationItem YTD = CALCULATE(SELECTEDMEASURE(), DATESYTD('Date'[Date]))

\t\t\tcalculationItem PY = CALCULATE(SELECTEDMEASURE(), SAMEPERIODLASTYEAR('Date'[Date]))

\t\t\tcalculationItem 'PY MTD' =
\t\t\t\t\tCALCULATE(
\t\t\t\t\t    SELECTEDMEASURE(),
\t\t\t\t\t    SAMEPERIODLASTYEAR('Date'[Date]),
\t\t\t\t\t    'Time Intelligence'[Time Calculation] = "MTD"
\t\t\t\t\t)

\t\t\tcalculationItem 'PY QTD' =
\t\t\t\t\tCALCULATE(
\t\t\t\t\t    SELECTEDMEASURE(),
\t\t\t\t\t    SAMEPERIODLASTYEAR('Date'[Date]),
\t\t\t\t\t    'Time Intelligence'[Time Calculation] = "QTD"
\t\t\t\t\t)

\t\t\tcalculationItem YOY = \`\`\`
\t\t\t\t\t
\t\t\t\t\tVAR _ThisYear = 
\t\t\t\t\t    SELECTEDMEASURE()
\t\t\t\t\tVAR _PY = 
\t\t\t\t\tCALCULATE(
\t\t\t\t\t    SELECTEDMEASURE(),
\t\t\t\t\t    'Time Intelligence'[Time Calculation] = "PY"
\t\t\t\t\t)
\t\t\t\t\tRETURN
\t\t\t\t\tIF(OR(ISBLANK(_ThisYear),ISBLANK(_PY)),BLANK(), _ThisYear-_PY)
\t\t\t\t\t\`\`\`

\t\t\tcalculationItem YOY% =
\t\t\t\t\tDIVIDE(
\t\t\t\t\t    CALCULATE(
\t\t\t\t\t        SELECTEDMEASURE(),
\t\t\t\t\t        'Time Intelligence'[Time Calculation]="YOY"
\t\t\t\t\t    ),
\t\t\t\t\t    CALCULATE(
\t\t\t\t\t        SELECTEDMEASURE(),
\t\t\t\t\t        'Time Intelligence'[Time Calculation]="PY"
\t\t\t\t\t    )
\t\t\t\t\t)

\t\t\t\tformatStringDefinition = "#,##0.0%"

\t\t/// Use with measures & date table for Current: current value, MTD: month to date, QTD: quarter to date, YTD: year to date, PY: prior year, PY MTD, PY QTD, YOY: year over year change, YOY%: YOY as a %
\t\tcolumn 'Time calculation'
\t\t\tdataType: string
\t\t\t
\t\t\tsummarizeBy: none
\t\t\tsourceColumn: Name
\t\t\tsortByColumn: Ordinal

\t\t\tannotation SummarizationSetBy = Automatic

\t\tcolumn Ordinal
\t\t\tdataType: int64
\t\t\tisHidden
\t\t\tformatString: 0
\t\t\t
\t\t\tsummarizeBy: sum
\t\t\tsourceColumn: Ordinal

\t\t\tannotation SummarizationSetBy = Automatic`
    },
    {
      title: "DAX Date table by DataZoe",
      description: "Complete date table template with calendar functions and hierarchy.",
      code: `createOrReplace
\t/// Date table used to show data as trends over time or compare to different time periods by similar groups, such as year, month, or quarter.
\ttable Date
\t\tdataCategory: Time
\t\t/// Each day's date. Other columns in this table are used to group dates by year, month, quarter, week, and other groups.
\t\tcolumn Date
\t\t\tisKey
\t\t\tformatString: dd mmm yyyy
\t\t\tsummarizeBy: none
\t\t\tisNameInferred
\t\t\tsourceColumn: [Date]
\t\t\tannotation PBI_FormatHint = {"isCustom":true}
\t\t/// Each year represented as the first date of that year. Can be used on visuals to have a continuous or categorical axis.
\t\tcolumn Yearly
\t\t\tformatString: yyyy
\t\t\tdisplayFolder: Parts as dates
\t\t\tsummarizeBy: none
\t\t\tisNameInferred
\t\t\tsourceColumn: [Yearly]
\t\t\tannotation PBI_FormatHint = {"isCustom":true}
\t\t/// Each quarter represented as the first date of that quarter. Can be used on visuals to have a continuous or categorical axis.
\t\tcolumn Quarterly
\t\t\tformatString: "Q starting" mmm yyyy
\t\t\tdisplayFolder: Parts as dates
\t\t\tsummarizeBy: none
\t\t\tisNameInferred
\t\t\tsourceColumn: [Quarterly]
\t\t\tannotation PBI_FormatHint = {"isCustom":true}
\t\t/// Each month represented as the first date of that month. Can be used on visuals to have a continuous or categorical axis.
\t\tcolumn Monthly
\t\t\tformatString: mmm yyyy
\t\t\tdisplayFolder: Parts as dates
\t\t\tsummarizeBy: none
\t\t\tisNameInferred
\t\t\tsourceColumn: [Monthly]
\t\t\tannotation PBI_FormatHint = {"isCustom":true}
\t\t/// Each week represented as the first date of that week, starting Sunday. Can be used on visuals to have a continuous or categorical axis.
\t\tcolumn Weekly
\t\t\tformatString: "Week starting" ddd dd mmm yyyy
\t\t\tdisplayFolder: Parts as dates
\t\t\tsummarizeBy: none
\t\t\tisNameInferred
\t\t\tsourceColumn: [Weekly]
\t\t\tannotation PBI_FormatHint = {"isCustom":true}
\t\t/// Each month of the year represented as a number starting at 1 in correct sort order and for comparing weeks year over year
\t\tcolumn 'Month of Year'
\t\t\tformatString: 0
\t\t\tdisplayFolder: Parts as numbers
\t\t\tsummarizeBy: none
\t\t\tisNameInferred
\t\t\tsourceColumn: [Month of Year]
\t\t\tannotation SummarizationSetBy = User
\t\t/// Each week of the year starting Sundays represented as a number starting at 1 in correct sort order and for comparing weeks year over year
\t\tcolumn 'Week of Year'
\t\t\tformatString: 0
\t\t\tdisplayFolder: Parts as numbers
\t\t\tsummarizeBy: none
\t\t\tisNameInferred
\t\t\tsourceColumn: [Week of Year]
\t\t\tannotation SummarizationSetBy = User
\t\t/// The 4-digit year
\t\tcolumn Year
\t\t\tformatString: 0
\t\t\tdisplayFolder: Parts as numbers
\t\t\tsummarizeBy: none
\t\t\tisNameInferred
\t\t\tsourceColumn: [Year]
\t\t\tannotation SummarizationSetBy = User
\t\t/// Each quarter of the year displayed as Q1, Q2, Q3, Q4.
\t\tcolumn Quarter
\t\t\tdisplayFolder: Parts as text
\t\t\tsummarizeBy: none
\t\t\tisNameInferred
\t\t\tsourceColumn: [Quarter]
\t\t/// Each quarter with it's year displayed as quarter, year. Sort correctly with ORDER BY CALCULATE(MIN('Date'[Quarterly])) 
\t\tcolumn 'Year Quarter'
\t\t\tdisplayFolder: Parts as text
\t\t\tsummarizeBy: none
\t\t\tisNameInferred
\t\t\tsourceColumn: [Year Quarter]
\t\t\tsortByColumn: Quarterly
\t\t/// Each month of the year displayed as Jan, Feb, ..., Dec. Sort correctly with ORDER BY CALCULATE(MIN('Date'[Month of Year]))
\t\tcolumn Month
\t\t\tdisplayFolder: Parts as text
\t\t\tsummarizeBy: none
\t\t\tisNameInferred
\t\t\tsourceColumn: [Month]
\t\t\tsortByColumn: 'Month of Year'
\t\t/// Each month as text formatted as mmm, yyyy
\t\tcolumn 'Year Month'
\t\t\tdisplayFolder: Parts as text
\t\t\tsummarizeBy: none
\t\t\tisNameInferred
\t\t\tsourceColumn: [Year Month]
\t\t\tsortByColumn: Monthly
\t\t/// Each week starting Sunday displayed as start of week to end of week in format dd mmm 'yy - dd mmm 'yy. Sort correctly with ORDER BY CALCULATE(MIN('Date'[Weekly])) 
\t\tcolumn Week
\t\t\tdisplayFolder: Parts as text
\t\t\tsummarizeBy: none
\t\t\tisNameInferred
\t\t\tsourceColumn: [Week]
\t\t\tsortByColumn: Weekly
\t\t/// Number of years offset from today's year, future years positive and prior years negative.
\t\tcolumn 'Today Year Offset'
\t\t\tformatString: 0
\t\t\tdisplayFolder: Offset to today
\t\t\tsummarizeBy: none
\t\t\tisNameInferred
\t\t\tsourceColumn: [Today Year Offset]
\t\t\tannotation SummarizationSetBy = User
\t\t/// Number of quarters offset from today's quarter, future quarters positive and prior quarters negative.
\t\tcolumn 'Today Quarter Offset'
\t\t\tformatString: 0
\t\t\tdisplayFolder: Offset to today
\t\t\tsummarizeBy: none
\t\t\tisNameInferred
\t\t\tsourceColumn: [Today Quarter Offset]
\t\t\tannotation SummarizationSetBy = User
\t\t/// Number of months offset from today's month, future months positive and prior months negative.
\t\tcolumn 'Today Month Offset'
\t\t\tformatString: 0
\t\t\tdisplayFolder: Offset to today
\t\t\tsummarizeBy: none
\t\t\tisNameInferred
\t\t\tsourceColumn: [Today Month Offset]
\t\t\tannotation SummarizationSetBy = User
\t\t/// Number of weeks starting Sunday offset from today's week, future weeks positive and prior weeks negative.
\t\tcolumn 'Today Week Offset'
\t\t\tformatString: 0
\t\t\tdisplayFolder: Offset to today
\t\t\tsummarizeBy: none
\t\t\tisNameInferred
\t\t\tsourceColumn: [Today Week Offset]
\t\t\tannotation SummarizationSetBy = User
\t\t/// Number of days offset from today, future days positive and prior days negative.
\t\tcolumn 'Today Day Offset'
\t\t\tformatString: 0
\t\t\tdisplayFolder: Offset to today
\t\t\tsummarizeBy: none
\t\t\tisNameInferred
\t\t\tsourceColumn: [Today Day Offset]
\t\t\tannotation SummarizationSetBy = User
\t\thierarchy 'Date Hierarchy'
\t\t\tlevel Year
\t\t\t\tcolumn: Year
\t\t\tlevel Quarter
\t\t\t\tcolumn: Quarter
\t\t\tlevel Month
\t\t\t\tcolumn: Month
\t\t\tlevel Week
\t\t\t\tcolumn: Week
\t\t\tlevel Date
\t\t\t\tcolumn: Date
\t\tpartition Date = calculated
\t\t\tmode: import
\t\t\tsource = \`\`\`
\t\t\t\t\t// Date Table by DataZoe, August 2021, datazoepowerbi.com
\t\t\t\t\t// Here you can specify a start date, or the range of dates in your fact table.
\t\t\t\t\t// If you have multiple fact tables, you can do MIN(MIN('Fact 1'[Date]),MIN('Fact 2'[Date])) etc.
\t\t\t\t\tVAR _startdate =
\t\t\t\t\t    DATE(2021,1,1)
\t\t\t\t\tVAR _enddate =
\t\t\t\t\t\tDATE(2026,1,1)-1
\t\t\t\t\tRETURN
\t\t\t\t\t    ADDCOLUMNS (
\t\t\t\t\t        CALENDAR ( _startdate, _enddate ),
\t\t\t\t\t        // Create DATE VERSIONS of the year, quarter, month, and week
\t\t\t\t\t        // These will need to be formatted in the Column Format ribbon or in the Properties Pane in the Model view
\t\t\t\t\t        // including custom formats, such as mmm yyyy for the month
\t\t\t\t\t        "Yearly", DATE ( YEAR ( [Date] ), 1, 1 ),
\t\t\t\t\t        "Quarterly",
\t\t\t\t\t            DATE ( YEAR ( [Date] ), SWITCH (
\t\t\t\t\t                MONTH ( [Date] ),
\t\t\t\t\t                1, 1,
\t\t\t\t\t                2, 1,
\t\t\t\t\t                3, 1,
\t\t\t\t\t                4, 4,
\t\t\t\t\t                5, 4,
\t\t\t\t\t                6, 4,
\t\t\t\t\t                7, 7,
\t\t\t\t\t                8, 7,
\t\t\t\t\t                9, 7,
\t\t\t\t\t                10, 10,
\t\t\t\t\t                11, 10,
\t\t\t\t\t                12, 10
\t\t\t\t\t            ), 1 ),
\t\t\t\t\t        "Monthly", DATE ( YEAR ( [Date] ), MONTH ( [Date] ), 1 ),
\t\t\t\t\t        "Weekly",
\t\t\t\t\t            [Date] - WEEKDAY ( [Date], 1 ) + 1,
\t\t\t\t\t        // Month and Week OF YEAR to do accurate year over year week compares 
\t\t\t\t\t        "Month of Year", MONTH ( [Date] ),
\t\t\t\t\t        "Week of Year", WEEKNUM ( [Date] ),
\t\t\t\t\t        // Create TEXT VERSIONS of the year, quarter, month, and week
\t\t\t\t\t        // These will need to be sort by date versions above
\t\t\t\t\t        // or the Month of Year to sort correctly
\t\t\t\t\t        "Year", YEAR ( [Date] ),
\t\t\t\t\t        "Quarter", CONCATENATE ( "Q", FORMAT ( QUARTER ( [Date] ), "0" ) ),
\t\t\t\t\t        "Year Quarter", "Q" & FORMAT ( [Date], "q, yyyy" ),
\t\t\t\t\t        "Month", FORMAT ( [Date], "MMM" ),
\t\t\t\t\t        "Year Month", FORMAT ( [Date], "MMM, yyyy" ),
\t\t\t\t\t        "Week",
\t\t\t\t\t            FORMAT ( [Date] - WEEKDAY ( [Date], 1 ) + 1, "dd MMM 'yy" ) & " - "
\t\t\t\t\t                & FORMAT ( ( [Date] - WEEKDAY ( [Date], 1 ) + 1 ) + 6, "dd MMM 'yy" ),
\t\t\t\t\t        // Compared to today fields for when you want to always have say the current show by default
\t\t\t\t\t        "Today Year Offset", DATEDIFF ( TODAY (), [Date], YEAR ),
\t\t\t\t\t        "Today Quarter Offset", DATEDIFF ( TODAY (), [Date], QUARTER ),
\t\t\t\t\t        "Today Month Offset", DATEDIFF ( TODAY (), [Date], MONTH ),
\t\t\t\t\t        "Today Week Offset", DATEDIFF ( TODAY (), [Date], WEEK ),
\t\t\t\t\t        "Today Day Offset", DATEDIFF ( TODAY (), [Date], DAY )
\t\t\t\t\t    )
\t\t\t\t\t\`\`\`
\t\tannotation PBI_Id = f9ac7d56b5e34adebee8b0ca93c6be23`
    },
    {
      title: "Last Refresh With Europe MEZ Function adapted from Markus Wegener",
      description: "Create a table to display the last refresh time in European Central European Time.",
      code: `createOrReplace

\ttable 'Last Refresh'
\t\tlineageTag: c0699330-249d-42ca-b8f0-ff9fbbd427a0

\t\tmeasure 'Last Refresh' = "Last Refresh: " & MAX('Last Refresh'[Last Refresh Timestamp])
\t\t\tdisplayFolder: Meta
\t\t\tlineageTag: 21571b32-a7a3-49fd-b4ee-88905bc5c9ef

\t\tcolumn 'Last Refresh Timestamp'
\t\t\tdataType: dateTime
\t\t\tisHidden
\t\t\tformatString: General Date
\t\t\tlineageTag: 8de71465-6a54-471a-81be-a3760e258a18
\t\t\tsummarizeBy: none
\t\t\tsourceColumn: Last Refresh Timestamp

\t\t\tannotation SummarizationSetBy = Automatic

\t\tpartition 'Last Refresh' = m
\t\t\tmode: import
\t\t\tsource =
\t\t\t\t\tlet
\t\t\t\t\t    Quelle = Table.FromRows({{#"UTC to CEST/CET"(DateTimeZone.UtcNow())}},{"Last Refresh"}),
\t\t\t\t\t    #"Geänderter Typ" = Table.TransformColumnTypes(Quelle,{{"Last Refresh", type datetimezone}}),
\t\t\t\t\t    #"Umbenannte Spalten" = Table.RenameColumns(#"Geänderter Typ",{{"Last Refresh", "Last Refresh Timestamp"}})
\t\t\t\t\tin
\t\t\t\t\t    #"Umbenannte Spalten"

\t\tannotation PBI_NavigationStepName = Navigation

\t\tannotation PBI_ResultType = Table
\t
\texpression 'UTC to CEST/CET' =
\t\t\t\t(DateTimeZoneUTC as datetimezone) as datetimezone =>
\t\t\t\tlet
\t\t\t\t    Jahr = Date.Year(DateTimeZoneUTC),
\t\t\t\t    //Bestimmung Start der Sommerzeit
\t\t\t\t    Sommerzeit = Date.StartOfWeek( #date(Jahr, 03, 31), Day.Sunday) & #time(1,0,0),
\t\t\t\t    //Bestimmung Start der Winterzeit
\t\t\t\t    Winterzeit = Date.StartOfWeek( #date(Jahr, 10, 31), Day.Sunday) & #time(1,0,0),
\t\t\t\t    //Berechnung des Offset
\t\t\t\t    Offset = if DateTimeZone.RemoveZone(DateTimeZoneUTC) >= Sommerzeit and DateTimeZone.RemoveZone(DateTimeZoneUTC) < Winterzeit then 2 else 1,
\t\t\t\t    //Änderung der Zeitzoneninformation
\t\t\t\t    DateTimeZoneMEZ = DateTimeZone.SwitchZone(DateTimeZoneUTC,Offset)
\t\t\t\tin
\t\t\t\t    DateTimeZoneMEZ
\t\t\tlineageTag: 25393f5c-fc5f-4322-b0f9-c8b19f5606f8
\t\t\t
\t\t\tannotation PBI_NavigationStepName = Navigation

\t\t\tannotation PBI_ResultType = Function`
    },
    {
      title: "\"Measure\" table",
      description: "A simple template for creating a dedicated measure table.",
      code: `createOrReplace

\ttable Measure\t\t

\t\tmeasure 'Sample Measure' = NOW()
\t\t\tformatString: General Date\t\t\t

\t\tcolumn Value
\t\t\tisHidden\t\t\t\t\t\t\t
\t\t\tsummarizeBy: sum
\t\t\tisNameInferred
\t\t\tsourceColumn: [Value]

\t\tpartition _Measures = calculated
\t\t\tmode: import
\t\t\tsource = {BLANK()}`
    }
  ];

  const powerQuery = [
    {
      title: "UTC offset that adjusts for Daylight Saving Time",
      description: "Adjust UTC timestamps to local time accounting for DST changes.",
      code: ` 
 
 // Get max date from fact
 Kept_MaxDateTime = Table.MaxN(
 Table.SelectColumns(Navigation,{"DW_UPDATE_FIELD"})
 ,"DW_UPDATE_FIELD",1),
 Renamed_LastUpdate = Table.RenameColumns(Kept_MaxDateTime, {{"DW_UPDATE_FIELD", "Last Update"}}),
 // Get the latest date value for DST calculation
 LatestDate = Renamed_LastUpdate[Last Update]{0},
 // Check if date is in DST (US Eastern Time rules)
 Month = Date.Month(LatestDate),
 Day = Date.Day(LatestDate),
 DayOfWeek = Date.DayOfWeek(LatestDate, Day.Sunday),
 // DST is active if:
 // 1. It's April through October (definitely DST)
 // 2. It's March and after second Sunday (start of DST)
 // 3. It's November but before first Sunday (end of DST)
 IsDST = (Month > 3 and Month < 11) or
 (Month = 3 and Day > 7 + DayOfWeek) or
 (Month = 11 and Day < 1 + DayOfWeek),
 // Apply the correct offset based on DST result
 AdjustedDateTime = Table.TransformColumns(Renamed_LastUpdate,
 {{"Last Update", each _ - hashtag#duration(0, if IsDST then 4 else 5, 0, 0), type datetime}})
in
 AdjustedDateTime`
    }
  ];

  const sql = [
    {
      title: "Running Total",
      description: "Calculate a running total partitioned by customer across dates.",
      code: `SELECT 
    SalesDate,
    CustomerID,
    SUM(SalesAmount) OVER (PARTITION BY CustomerID ORDER BY SalesDate) AS RunningTotal
FROM Sales`
    },
    {
      title: "Year-over-Year (YoY) Growth",
      description: "Calculate year-over-year growth percentage for sales.",
      code: `SELECT 
    Year,
    SUM(SalesAmount) AS CurrentYearSales,
    LAG(SUM(SalesAmount)) OVER (ORDER BY Year) AS PreviousYearSales,
    (SUM(SalesAmount) - LAG(SUM(SalesAmount)) OVER (ORDER BY Year)) / 
        NULLIF(LAG(SUM(SalesAmount)) OVER (ORDER BY Year), 0) AS YoYGrowth
FROM Sales
GROUP BY Year`
    },
    {
      title: "Top N Customers",
      description: "Find your top 10 customers by total sales amount.",
      code: `SELECT TOP 10 
    CustomerID,
    SUM(SalesAmount) AS TotalSales
FROM Sales
GROUP BY CustomerID
ORDER BY TotalSales DESC`
    },
    {
      title: "Pivoting Data",
      description: "Pivot sales data to show yearly comparisons by product.",
      code: `SELECT 
    ProductID,
    SUM(CASE WHEN Year = 2023 THEN SalesAmount ELSE 0 END) AS Sales_2023,
    SUM(CASE WHEN Year = 2024 THEN SalesAmount ELSE 0 END) AS Sales_2024
FROM Sales
GROUP BY ProductID`
    }
  ];

  const python = [
    {
      title: "Refresh PBI via API",
      description: "Script to programmatically refresh your Power BI dataset using the API.",
      code: `import requests
import json

# Power BI details
CLIENT_ID = '<your_client_id>'
CLIENT_SECRET = '<your_client_secret>'
TENANT_ID = '<your_tenant_id>'
WORKSPACE_ID = '<your_workspace_id>'
DATASET_ID = '<your_dataset_id>'

# Get Power BI access token
def get_access_token():
    url = f"https://login.microsoftonline.com/{TENANT_ID}/oauth2/token"
    payload = {
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'resource': 'https://graph.microsoft.com/'
    }
    response = requests.post(url, data=payload)
    return response.json().get('access_token')

# Trigger dataset refresh
def refresh_dataset():
    access_token = get_access_token()
    url = f"https://api.powerbi.com/v1.0/myorg/groups/{WORKSPACE_ID}/datasets/{DATASET_ID}/refreshes"
    headers = {'Authorization': f'Bearer {access_token}'}
    
    response = requests.post(url, headers=headers)
    if response.status_code == 202:
        print("Dataset refresh triggered successfully.")
    else:
        print(f"Failed to refresh dataset: {response.text}")

refresh_dataset()`
    },
    {
      title: "Moving csv from local to Snowflake",
      description: "Upload local CSV files to Snowflake database tables.",
      code: `import snowflake.connector
import pandas as pd

# Snowflake connection details
SNOWFLAKE_ACCOUNT = '<your_account>.snowflakecomputing.com'
USER = '<your_username>'
PASSWORD = '<your_password>'
WAREHOUSE = '<your_warehouse>'
DATABASE = '<your_database>'
SCHEMA = '<your_schema>'

# Establish Snowflake connection
conn = snowflake.connector.connect(
    user=USER,
    password=PASSWORD,
    account=SNOWFLAKE_ACCOUNT,
    warehouse=WAREHOUSE,
    database=DATABASE,
    schema=SCHEMA
)

# Function to load DataFrame to Snowflake
def load_to_snowflake(df, table_name):
    with conn.cursor() as cur:
        # Create table if not exists
        create_table_query = f"""
        CREATE TABLE IF NOT EXISTS {table_name} (
            {', '.join([f"{col} STRING" for col in df.columns])}
        )
        """
        cur.execute(create_table_query)
        
        # Write DataFrame to Snowflake
        for index, row in df.iterrows():
            values = "', '".join(str(val) for val in row.values)
            insert_query = f"INSERT INTO {table_name} VALUES ('{values}')"
            cur.execute(insert_query)

# Example CSV file loading
tables_to_upload = {
    'sales_table': 'data/sales_data.csv',
    'customer_table': 'data/customers_data.csv'
}

for table, file_path in tables_to_upload.items():
    df = pd.read_csv(file_path)
    load_to_snowflake(df, table)

print("Data successfully uploaded to Snowflake!")`
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reusable Snippets</h2>
        <Button 
          onClick={() => setIsSubmitOpen(true)}
          className="flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          Submit your snippet
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        A collection of useful PowerBI snippets you can use in your projects. Copy and adapt these snippets to fit your specific needs.
      </p>
      
      <Tabs defaultValue="prompts">
        <TabsList className="mb-4 w-full overflow-x-auto">
          <TabsTrigger value="prompts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Prompts
          </TabsTrigger>
          <TabsTrigger value="tmdl" className="flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            TMDL
          </TabsTrigger>
          <TabsTrigger value="powerquery" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            PowerQuery
          </TabsTrigger>
          <TabsTrigger value="sql" className="flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            SQL
          </TabsTrigger>
          <TabsTrigger value="python" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Python
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="prompts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prompts.map((snippet, index) => (
              <Card key={index} className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>{snippet.title}</CardTitle>
                  <CardDescription>{snippet.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CodeDisplay code={snippet.code} language="markdown" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="tmdl" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {tmdl.map((snippet, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{snippet.title}</CardTitle>
                  <CardDescription>{snippet.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeDisplay code={snippet.code} language="sql" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="powerquery" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {powerQuery.map((snippet, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{snippet.title}</CardTitle>
                  <CardDescription>{snippet.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeDisplay code={snippet.code} language="sql" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="sql" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sql.map((snippet, index) => (
              <Card key={index} className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>{snippet.title}</CardTitle>
                  <CardDescription>{snippet.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CodeDisplay code={snippet.code} language="sql" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="python" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {python.map((snippet, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{snippet.title}</CardTitle>
                  <CardDescription>{snippet.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeDisplay code={snippet.code} language="python" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <SubmitSnippetForm open={isSubmitOpen} onOpenChange={setIsSubmitOpen} />
    </div>
  );
};

export default SnippetsTab;
