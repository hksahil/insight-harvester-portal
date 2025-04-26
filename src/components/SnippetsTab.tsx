import React, { useState } from 'react';
import { Search, Copy, ExternalLink, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CodeDisplay from '@/components/CodeDisplay';
import { toast } from 'sonner';
import UseCaseHelper from './UseCaseHelper';
import { SubmitSnippetDialog } from './SubmitSnippetDialog';

interface SnippetCategory {
  id: string;
  name: string;
}

interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  category: string;
  submittedBy: string;
  submittedDate: string;
}

const SnippetsTab: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  
  const categories: SnippetCategory[] = [
    { id: 'all', name: 'All' },
    { id: 'prompt', name: 'Prompt' },
    { id: 'tmdl', name: 'TMDL' },
    { id: 'dax', name: 'DAX' },
    { id: 'sql', name: 'SQL' },
    { id: 'python', name: 'Python' },
    { id: 'powerquery', name: 'PowerQuery' }
  ];
  
  const snippets: Snippet[] = [
    {
      id: '1',
      title: 'TMDL view - Set descriptions for measures',
      description: 'Generates descriptions for measures in your model',
      code: `Help me add or replace descriptions for each measure.
Consider the following rules:
- insert or replace the description that should appear above the measure code and after ///
- use business friendly terms
- describe the DAX code in the description in business-friendly terms. Do not copy the code to the description.
- use the name and other measures as context
- description should not be longer than 500 chars`,
      language: 'sql',
      category: 'prompt',
      submittedBy: 'data.zoe',
      submittedDate: '2023-08-15'
    },
    {
      id: '2',
      title: 'Comment Highlighted Power Query Code',
      description: 'Generates comments for Power Query code',
      code: `You are an assistant to help Power Query developers comment their code. Please update each line of code by performing the following:

Insert a comment above the code explaining what that piece of code is doing.
Do not start the comment with the word Step or a number
Do not copy code into the comment.
Keep the comments to a maximum of 225 characters.`,
      language: 'sql',
      category: 'prompt',
      submittedBy: 'powerbi.tips',
      submittedDate: '2023-07-22'
    },
    {
      id: '3',
      title: 'Format all my numeric measures TMDL prompt',
      description: 'Formats numeric measures with appropriate format strings',
      code: `Here's TMDL for my existing Power BI measures. For all percentages, change the format string to one decimal point, and for all whole numbers, format with a comma in the format string. Output the full code to update the measures.`,
      language: 'sql',
      category: 'prompt',
      submittedBy: 'bi.baker',
      submittedDate: '2023-09-05'
    },
    {
      id: '4',
      title: 'Format and custom sort your date table',
      description: 'Formats and adds custom sorting to date tables',
      code: `(this requires a higher-grade model, like o3 or 3.7 Sonnet to handle wide date tables)

Here is my date table TMDL for Power BI. Add a line to each TEXT type column for sortByColumn, giving it a reference to the equivalent numeric or date type column in the code. Do not omit or change the Power Query text in your response.

Also format all date-type fields by adding a line like this to the date column TMDL:
formatString: m/d/yyyy

(paste your original date table TMDL here)`,
      language: 'sql',
      category: 'prompt',
      submittedBy: 'datazoepowerbi',
      submittedDate: '2023-10-12'
    },
    {
      id: '5',
      title: 'Object-level Security',
      description: 'TMDL template for object-level security in Power BI',
      code: `createOrReplace

	role '<Enter role name>'
		modelPermission: read

		tablePermission <Enter table name>

			columnPermission <Enter column name> = none

		tablePermission 'RLS Users' = 'RLS Users'[Email] = USERPRINCIPALNAME()`,
      language: 'sql',
      category: 'tmdl',
      submittedBy: 'adam.saxton',
      submittedDate: '2023-11-18'
    },
    {
      id: '6',
      title: 'Time Intelligence Calculation Group by DataZoe',
      description: 'TMDL for creating time intelligence calculation groups',
      code: `createOrReplace

	/// Defines additional DAX logic that can be used with model measures to perform analysis with the date table.
	table 'Time intelligence'
		

		calculationGroup

			calculationItem Total = SELECTEDMEASURE()

			calculationItem MTD = CALCULATE(SELECTEDMEASURE(), DATESMTD('Date'[Date]))

			calculationItem QTD = CALCULATE(SELECTEDMEASURE(), DATESQTD('Date'[Date]))

			calculationItem YTD = CALCULATE(SELECTEDMEASURE(), DATESYTD('Date'[Date]))

			calculationItem PY = CALCULATE(SELECTEDMEASURE(), SAMEPERIODLASTYEAR('Date'[Date]))

			calculationItem 'PY MTD' =
					CALCULATE(
					    SELECTEDMEASURE(),
					    SAMEPERIODLASTYEAR('Date'[Date]),
					    'Time Intelligence'[Time Calculation] = "MTD"
					)

			calculationItem 'PY QTD' =
					CALCULATE(
					    SELECTEDMEASURE(),
					    SAMEPERIODLASTYEAR('Date'[Date]),
					    'Time Intelligence'[Time Calculation] = "QTD"
					)

			calculationItem YOY = \`\`\`
					
					VAR _ThisYear = 
					    SELECTEDMEASURE()
					VAR _PY = 
					CALCULATE(
					    SELECTEDMEASURE(),
					    'Time Intelligence'[Time Calculation] = "PY"
					)
					RETURN
					IF(OR(ISBLANK(_ThisYear),ISBLANK(_PY)),BLANK(), _ThisYear-_PY)
					\`\`\`

			calculationItem YOY% =
					DIVIDE(
					    CALCULATE(
					        SELECTEDMEASURE(),
					        'Time Intelligence'[Time Calculation]="YOY"
					    ),
					    CALCULATE(
					        SELECTEDMEASURE(),
					        'Time Intelligence'[Time Calculation]="PY"
					    )
					)

				formatStringDefinition = "#,##0.0%"

		/// Use with measures & date table for Current: current value, MTD: month to date, QTD: quarter to date, YTD: year to date, PY: prior year, PY MTD, PY QTD, YOY: year over year change, YOY%: YOY as a %
		column 'Time calculation'
			dataType: string
			
			summarizeBy: none
			sourceColumn: Name
			sortByColumn: Ordinal

			annotation SummarizationSetBy = Automatic

		column Ordinal
			dataType: int64
			isHidden
			formatString: 0
			
			summarizeBy: sum
			sourceColumn: Ordinal

			annotation SummarizationSetBy = Automatic`,
      language: 'sql',
      category: 'tmdl',
      submittedBy: 'datazoepowerbi',
      submittedDate: '2023-07-29'
    },
    {
      id: '7',
      title: 'DAX Date table by DataZoe',
      description: 'TMDL for creating a comprehensive date table using DAX',
      code: `createOrReplace
	/// Date table used to show data as trends over time or compare to different time periods by similar groups, such as year, month, or quarter.
	table Date
		dataCategory: Time
		/// Each day's date. Other columns in this table are used to group dates by year, month, quarter, week, and other groups.
		column Date
			isKey
			formatString: dd mmm yyyy
			summarizeBy: none
			isNameInferred
			sourceColumn: [Date]
			annotation PBI_FormatHint = {"isCustom":true}
		/// Each year represented as the first date of that year. Can be used on visuals to have a continuous or categorical axis.
		column Yearly
			formatString: yyyy
			displayFolder: Parts as dates
			summarizeBy: none
			isNameInferred
			sourceColumn: [Yearly]
			annotation PBI_FormatHint = {"isCustom":true}
		/// Each quarter represented as the first date of that quarter. Can be used on visuals to have a continuous or categorical axis.
		column Quarterly
			formatString: "Q starting" mmm yyyy
			displayFolder: Parts as dates
			summarizeBy: none
			isNameInferred
			sourceColumn: [Quarterly]
			annotation PBI_FormatHint = {"isCustom":true}
		/// Each month represented as the first date of that month. Can be used on visuals to have a continuous or categorical axis.
		column Monthly
			formatString: mmm yyyy
			displayFolder: Parts as dates
			summarizeBy: none
			isNameInferred
			sourceColumn: [Monthly]
			annotation PBI_FormatHint = {"isCustom":true}
		/// Each week represented as the first date of that week, starting Sunday. Can be used on visuals to have a continuous or categorical axis.
		column Weekly
			formatString: "Week starting" ddd dd mmm yyyy
			displayFolder: Parts as dates
			summarizeBy: none
			isNameInferred
			sourceColumn: [Weekly]
			annotation PBI_FormatHint = {"isCustom":true}
		/// Each month of the year represented as a number starting at 1 in correct sort order and for comparing weeks year over year
		column 'Month of Year'
			formatString: 0
			displayFolder: Parts as numbers
			summarizeBy: none
			isNameInferred
			sourceColumn: [Month of Year]
			annotation SummarizationSetBy = User
		/// Each week of the year starting Sundays represented as a number starting at 1 in correct sort order and for comparing weeks year over year
		column 'Week of Year'
			formatString: 0
			displayFolder: Parts as numbers
			summarizeBy: none
			isNameInferred
			sourceColumn: [Week of Year]
			annotation SummarizationSetBy = User
		/// The 4-digit year
		column Year
			formatString: 0
			displayFolder: Parts as numbers
			summarizeBy: none
			isNameInferred
			sourceColumn: [Year]
			annotation SummarizationSetBy = User
		/// Each quarter of the year displayed as Q1, Q2, Q3, Q4.
		column Quarter
			displayFolder: Parts as text
			summarizeBy: none
			isNameInferred
			sourceColumn: [Quarter]
		/// Each quarter with it's year displayed as quarter, year. Sort correctly with ORDER BY CALCULATE(MIN('Date'[Quarterly])) 
		column 'Year Quarter'
			displayFolder: Parts as text
			summarizeBy: none
			isNameInferred
			sourceColumn: [Year Quarter]
			sortByColumn: Quarterly
		/// Each month of the year displayed as Jan, Feb, ..., Dec. Sort correctly with ORDER BY CALCULATE(MIN('Date'[Month of Year]))
		column Month
			displayFolder: Parts as text
			summarizeBy: none
			isNameInferred
			sourceColumn: [Month]
			sortByColumn: 'Month of Year'
		/// Each month as text formatted as mmm, yyyy
		column 'Year Month'
			displayFolder: Parts as text
			summarizeBy: none
			isNameInferred
			sourceColumn: [Year Month]
			sortByColumn: Monthly
		/// Each week starting Sunday displayed as start of week to end of week in format dd mmm 'yy - dd mmm 'yy. Sort correctly with ORDER BY CALCULATE(MIN('Date'[Weekly])) 
		column Week
			displayFolder: Parts as text
			summarizeBy: none
			isNameInferred
			sourceColumn: [Week]
			sortByColumn: Weekly
		/// Number of years offset from today's year, future years positive and prior years negative.
		column 'Today Year Offset'
			formatString: 0
			displayFolder: Offset to today
			summarizeBy: none
			isNameInferred
			sourceColumn: [Today Year Offset]
			annotation SummarizationSetBy = User
		/// Number of quarters offset from today's quarter, future quarters positive and prior quarters negative.
		column 'Today Quarter Offset'
			formatString: 0
			displayFolder: Offset to today
			summarizeBy: none
			isNameInferred
			sourceColumn: [Today Quarter Offset]
			annotation SummarizationSetBy = User
		/// Number of months offset from today's month, future months positive and prior months negative.
		column 'Today Month Offset'
			formatString: 0
			displayFolder: Offset to today
			summarizeBy: none
			isNameInferred
			sourceColumn: [Today Month Offset]
			annotation SummarizationSetBy = User
		/// Number of weeks starting Sunday offset from today's week, future weeks positive and prior weeks negative.
		column 'Today Week Offset'
			formatString: 0
			displayFolder: Offset to today
			summarizeBy: none
			isNameInferred
			sourceColumn: [Today Week Offset]
			annotation SummarizationSetBy = User
		/// Number of days offset from today, future days positive and prior days negative.
		column 'Today Day Offset'
			formatString: 0
			displayFolder: Offset to today
			summarizeBy: none
			isNameInferred
			sourceColumn: [Today Day Offset]
			annotation SummarizationSetBy = User
		hierarchy 'Date Hierarchy'
			level Year
				column: Year
			level Quarter
				column: Quarter
			level Month
				column: Month
			level Week
				column: Week
			level Date
				column: Date
		partition Date = calculated
			mode: import
			source = \`\`\`
					// Date Table by DataZoe, August 2021, datazoepowerbi.com
					// Here you can specify a start date, or the range of dates in your fact table.
					// If you have multiple fact tables, you can do MIN(MIN('Fact 1'[Date]),MIN('Fact 2'[Date])) etc.
					VAR _startdate =
					    DATE(2021,1,1)
					VAR _enddate =
						DATE(2026,1,1)-1
					RETURN
					    ADDCOLUMNS (
					        CALENDAR ( _startdate, _enddate ),
					        // Create DATE VERSIONS of the year, quarter, month, and week
					        // These will need to be formatted in the Column Format ribbon or in the Properties Pane in the Model view
					        // including custom formats, such as mmm yyyy for the month
					        "Yearly", DATE ( YEAR ( [Date] ), 1, 1 ),
					        "Quarterly",
					            DATE ( YEAR ( [Date] ), SWITCH (
					                MONTH ( [Date] ),
					                1, 1,
					                2, 1,
					                3, 1,
					                4, 4,
					                5, 4,
					                6, 4,
					                7, 7,
					                8, 7,
					                9, 7,
					                10, 10,
					                11, 10,
					                12, 10
					            ), 1 ),
					        "Monthly", DATE ( YEAR ( [Date] ), MONTH ( [Date] ), 1 ),
					        "Weekly",
					            [Date] - WEEKDAY ( [Date], 1 ) + 1,
					        // Month and Week OF YEAR to do accurate year over year week compares 
					        "Month of Year", MONTH ( [Date] ),
					        "Week of Year", WEEKNUM ( [Date] ),
					        // Create TEXT VERSIONS of the year, quarter, month, and week
					        // These will need to be sort by date versions above
					        // or the Month of Year to sort correctly
					        "Year", YEAR ( [Date] ),
					        "Quarter", CONCATENATE ( "Q", FORMAT ( QUARTER ( [Date] ), "0" ) ),
					        "Year Quarter", "Q" & FORMAT ( [Date], "q, yyyy" ),
					        "Month", FORMAT ( [Date], "MMM" ),
					        "Year Month", FORMAT ( [Date], "MMM, yyyy" ),
					        "Week",
					            FORMAT ( [Date] - WEEKDAY ( [Date], 1 ) + 1, "dd MMM 'yy" ) & " - "
					                & FORMAT ( ( [Date] - WEEKDAY ( [Date], 1 ) + 1 ) + 6, "dd MMM 'yy" ),
					        // Compared to today fields for when you want to always have say the current show by default
					        "Today Year Offset", DATEDIFF ( TODAY (), [Date], YEAR ),
					        "Today Quarter Offset", DATEDIFF ( TODAY (), [Date], QUARTER ),
					        "Today Month Offset", DATEDIFF ( TODAY (), [Date], MONTH ),
					        "Today Week Offset", DATEDIFF ( TODAY (), [Date], WEEK ),
					        "Today Day Offset", DATEDIFF ( TODAY (), [Date], DAY )
					    )
					\`\`\`
		annotation PBI_Id = f9ac7d56b5e34adebee8b0ca93c6be23`,
      language: 'sql',
      category: 'tmdl',
      submittedBy: 'datazoepowerbi',
      submittedDate: '2023-05-15'
    },
    {
      id: '8',
      title: 'Last Refresh With Europe MEZ Function',
      description: 'TMDL for creating a last refresh timestamp table with timezone handling',
      code: `createOrReplace

	table 'Last Refresh'
		lineageTag: c0699330-249d-42ca-b8f0-ff9fbbd427a0

		measure 'Last Refresh' = "Last Refresh: " & MAX('Last Refresh'[Last Refresh Timestamp])
			displayFolder: Meta
			lineageTag: 21571b32-a7a3-49fd-b4ee-88905bc5c9ef

		column 'Last Refresh Timestamp'
			dataType: dateTime
			isHidden
			formatString: General Date
			lineageTag: 8de71465-6a54-471a-81be-a3760e258a18
			summarizeBy: none
			sourceColumn: Last Refresh Timestamp

			annotation SummarizationSetBy = Automatic

		partition 'Last Refresh' = m
			mode: import
			source =
					let
					    Quelle = Table.FromRows({{#"UTC to CEST/CET"(DateTimeZone.UtcNow())}},{"Last Refresh"}),
					    #"Geänderter Typ" = Table.TransformColumnTypes(Quelle,{{"Last Refresh", type datetimezone}}),
					    #"Umbenannte Spalten" = Table.RenameColumns(#"Geänderter Typ",{{"Last Refresh", "Last Refresh Timestamp"}})
					in
					    #"Umbenannte Spalten"

		annotation PBI_NavigationStepName = Navigation

		annotation PBI_ResultType = Table
	
	expression 'UTC to CEST/CET' =
				(DateTimeZoneUTC as datetimezone) as datetimezone =>
				let
				    Jahr = Date.Year(DateTimeZoneUTC),
				    //Bestimmung Start der Sommerzeit
				    Sommerzeit = Date.StartOfWeek( #date(Jahr, 03, 31), Day.Sunday) & #time(1,0,0),
				    //Bestimmung Start der Winterzeit
				    Winterzeit = Date.StartOfWeek( #date(Jahr, 10, 31), Day.Sunday) & #time(1,0,0),
				    //Berechnung des Offset
				    Offset = if DateTimeZone.RemoveZone(DateTimeZoneUTC) >= Sommerzeit and DateTimeZone.RemoveZone(DateTimeZoneUTC) < Winterzeit then 2 else 1,
				    //Änderung der Zeitzoneninformation
				    DateTimeZoneMEZ = DateTimeZone.SwitchZone(DateTimeZoneUTC,Offset)
				in
				    DateTimeZoneMEZ
			lineageTag: 25393f5c-fc5f-4322-b0f9-c8b19f5606f8
			
			annotation PBI_NavigationStepName = Navigation

			annotation PBI_ResultType = Function`,
      language: 'sql',
      category: 'tmdl',
      submittedBy: 'markus.wegener',
      submittedDate: '2023-09-20'
    },
    {
      id: '9',
      title: '"Measure" table',
      description: 'TMDL for creating a basic measure table',
      code: `createOrReplace

	table Measure		

		measure 'Sample Measure' = NOW()
			formatString: General Date			

		column Value
			isHidden						
			summarizeBy: sum
			isNameInferred
			sourceColumn: [Value]

		partition _Measures = calculated
			mode: import
			source = {BLANK()}`,
      language: 'sql',
      category: 'tmdl',
      submittedBy: 'kasper.dejong',
      submittedDate: '2023-10-05'
    },
    {
      id: '10',
      title: 'UTC offset that adjusts for Daylight Saving Time',
      description: 'Power Query code for handling UTC offset with DST',
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
 AdjustedDateTime`,
      language: 'sql',
      category: 'powerquery',
      submittedBy: 'greg.deckler',
      submittedDate: '2023-12-10'
    },
    {
      id: '11',
      title: 'Running Total',
      description: 'SQL query to calculate running total partitioned by customer',
      code: `SELECT 
    SalesDate,
    CustomerID,
    SUM(SalesAmount) OVER (PARTITION BY CustomerID ORDER BY SalesDate) AS RunningTotal
FROM Sales`,
      language: 'sql',
      category: 'sql',
      submittedBy: 'sqlmaster',
      submittedDate: '2024-01-15'
    },
    {
      id: '12',
      title: 'Year-over-Year (YoY) Growth',
      description: 'SQL query to calculate year-over-year growth percentage',
      code: `SELECT 
    Year,
    SUM(SalesAmount) AS CurrentYearSales,
    LAG(SUM(SalesAmount)) OVER (ORDER BY Year) AS PreviousYearSales,
    (SUM(SalesAmount) - LAG(SUM(SalesAmount)) OVER (ORDER BY Year)) / 
        NULLIF(LAG(SUM(SalesAmount)) OVER (ORDER BY Year), 0) AS YoYGrowth
FROM Sales
GROUP BY Year`,
      language: 'sql',
      category: 'sql',
      submittedBy: 'analyticsguru',
      submittedDate: '2024-02-20'
    },
    {
      id: '13',
      title: 'Top N Customers',
      description: 'SQL query to get top N customers by total sales',
      code: `SELECT TOP 10 
    CustomerID,
    SUM(SalesAmount) AS TotalSales
FROM Sales
GROUP BY CustomerID
ORDER BY TotalSales DESC`,
      language: 'sql',
      category: 'sql',
      submittedBy: 'bizintel',
      submittedDate: '2024-03-05'
    },
    {
      id: '14',
      title: 'Pivoting Data',
      description: 'SQL query for pivoting sales data by year',
      code: `SELECT 
    ProductID,
    SUM(CASE WHEN Year = 2023 THEN SalesAmount ELSE 0 END) AS Sales_2023,
    SUM(CASE WHEN Year = 2024 THEN SalesAmount ELSE 0 END) AS Sales_2024
FROM Sales
GROUP BY ProductID`,
      language: 'sql',
      category: 'sql',
      submittedBy: 'sqlwhiz',
      submittedDate: '2024-04-10'
    },
    {
      id: '15',
      title: 'Refresh PBI via API',
      description: 'Python script to refresh Power BI dataset using the REST API',
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

refresh_dataset()`,
      language: 'python',
      category: 'python',
      submittedBy: 'pbiautomator',
      submittedDate: '2024-02-15'
    },
    {
      id: '16',
      title: 'Moving CSV from Local to Snowflake',
      description: 'Python script to upload CSV files to Snowflake database',
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

print("Data successfully uploaded to Snowflake!")`,
      language: 'python',
      category: 'python',
      submittedBy: 'snowflakedev',
      submittedDate: '2024-03-20'
    }
  ];
  
  const filteredSnippets = snippets.filter(snippet => {
    const matchesCategory = activeCategory === 'all' || snippet.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleSubmitSnippetClick = () => {
    setSubmitDialogOpen(true);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 max-w-[550px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search snippet titles and code, contributors, or categories..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleSubmitSnippetClick}
          >
            <Plus className="h-4 w-4" />
            Submit your snippet
          </Button>
        </div>
      </div>
      <UseCaseHelper type="snippets" />
      
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      <div className="space-y-8">
        {filteredSnippets.length > 0 ? (
          filteredSnippets.map(snippet => (
            <div key={snippet.id} className="border border-border rounded-lg overflow-hidden bg-card">
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{snippet.title}</h3>
                    <p className="text-muted-foreground text-sm">{snippet.description}</p>
                  </div>
                  <Badge className="uppercase">{snippet.category === 'tmdl' ? 'TMDL' : snippet.category}</Badge>
                </div>
              </div>
              
              <CodeDisplay code={snippet.code} language={snippet.language === 'prompt' ? 'markdown' : snippet.language} />
              
              <div className="p-4 border-t border-border flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      navigator.clipboard.writeText(snippet.code);
                      toast.success('Copied to clipboard');
                    }}
                    className="gap-1.5"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">No snippets found matching your criteria</p>
          </div>
        )}
      </div>
      
      <SubmitSnippetDialog 
        open={submitDialogOpen} 
        onOpenChange={setSubmitDialogOpen}
      />
    </div>
  );
};

export default SnippetsTab;
