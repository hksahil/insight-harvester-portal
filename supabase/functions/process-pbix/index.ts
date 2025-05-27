
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return new Response('No file provided', { 
        status: 400, 
        headers: corsHeaders 
      })
    }

    // Mock response with properly structured data that matches pbixray output
    const mockResponse = {
      modelInfo: {
        Attribute: [
          "Model Name", "Date Modified", "Total Size of Model", 
          "Number of Tables", "Number of Partitions", 
          "Max Row Count of Biggest Table", "Total Columns", "Total Measures", 
          "Total Relationships"
        ],
        Value: [
          file.name.replace('.pbix', ''), new Date().toISOString().split('T')[0], "25.4MB", 
          8, 12, 
          485000, 65, 28, 
          15
        ]
      },
      // Tables data from model.statistics
      tableData: [
        {
          "Table Name": "Sales",
          "Mode": "Import",
          "Partitions": 1,
          "Rows": 485000,
          "Total Table Size": 15840000,
          "Columns Size": 12672000,
          "Relationships Size": 3168000,
          "PctOfTotalSize": "59.8%",
          "Is Hidden": false,
          "Latest Partition Modified": "2024-01-15",
          "Latest Partition Refreshed": "2024-01-15"
        },
        {
          "Table Name": "Product",
          "Mode": "Import",
          "Partitions": 1,
          "Rows": 2517,
          "Total Table Size": 890000,
          "Columns Size": 712000,
          "Relationships Size": 178000,
          "PctOfTotalSize": "3.4%",
          "Is Hidden": false,
          "Latest Partition Modified": "2024-01-10",
          "Latest Partition Refreshed": "2024-01-15"
        },
        {
          "Table Name": "Customer",
          "Mode": "Import",
          "Partitions": 1,
          "Rows": 18484,
          "Total Table Size": 1250000,
          "Columns Size": 1000000,
          "Relationships Size": 250000,
          "PctOfTotalSize": "4.7%",
          "Is Hidden": false,
          "Latest Partition Modified": "2024-01-12",
          "Latest Partition Refreshed": "2024-01-15"
        },
        {
          "Table Name": "Date",
          "Mode": "Import",
          "Partitions": 1,
          "Rows": 1461,
          "Total Table Size": 580000,
          "Columns Size": 464000,
          "Relationships Size": 116000,
          "PctOfTotalSize": "2.2%",
          "Is Hidden": false,
          "Latest Partition Modified": "2024-01-08",
          "Latest Partition Refreshed": "2024-01-15"
        },
        {
          "Table Name": "Territory",
          "Mode": "Import",
          "Partitions": 1,
          "Rows": 10,
          "Total Table Size": 45000,
          "Columns Size": 36000,
          "Relationships Size": 9000,
          "PctOfTotalSize": "0.2%",
          "Is Hidden": false,
          "Latest Partition Modified": "2024-01-05",
          "Latest Partition Refreshed": "2024-01-15"
        },
        {
          "Table Name": "ProductCategory",
          "Mode": "Import",
          "Partitions": 1,
          "Rows": 4,
          "Total Table Size": 28000,
          "Columns Size": 22400,
          "Relationships Size": 5600,
          "PctOfTotalSize": "0.1%",
          "Is Hidden": false,
          "Latest Partition Modified": "2024-01-05",
          "Latest Partition Refreshed": "2024-01-15"
        },
        {
          "Table Name": "ProductSubcategory",
          "Mode": "Import",
          "Partitions": 1,
          "Rows": 37,
          "Total Table Size": 95000,
          "Columns Size": 76000,
          "Relationships Size": 19000,
          "PctOfTotalSize": "0.4%",
          "Is Hidden": false,
          "Latest Partition Modified": "2024-01-05",
          "Latest Partition Refreshed": "2024-01-15"
        },
        {
          "Table Name": "Calendar",
          "Mode": "Import",
          "Partitions": 1,
          "Rows": 365,
          "Total Table Size": 180000,
          "Columns Size": 144000,
          "Relationships Size": 36000,
          "PctOfTotalSize": "0.7%",
          "Is Hidden": true,
          "Latest Partition Modified": "2024-01-01",
          "Latest Partition Refreshed": "2024-01-15"
        }
      ],
      // Merged schema and calculated columns
      columnData: [
        {
          TableName: "Sales",
          ColumnName: "SalesOrderID",
          FullColumnName: "Sales[SalesOrderID]",
          DataType: "Integer",
          ColumnType: "Data",
          IsHidden: false,
          Encoding: "UTF-8",
          DisplayFolder: "",
          Description: "Sales order identifier",
          IsKey: true,
          DataSize: 1940000,
          TotalSize: 1940000,
          PctOfTotalSize: "7.3%"
        },
        {
          TableName: "Sales",
          ColumnName: "OrderDate",
          FullColumnName: "Sales[OrderDate]",
          DataType: "DateTime",
          ColumnType: "Data",
          IsHidden: false,
          Encoding: "UTF-8",
          DisplayFolder: "",
          Description: "Order date",
          IsKey: false,
          DataSize: 1940000,
          TotalSize: 1940000,
          PctOfTotalSize: "7.3%"
        },
        {
          TableName: "Sales",
          ColumnName: "CustomerID",
          FullColumnName: "Sales[CustomerID]",
          DataType: "Integer",
          ColumnType: "Data",
          IsHidden: false,
          Encoding: "UTF-8",
          DisplayFolder: "",
          Description: "Customer identifier",
          IsKey: false,
          DataSize: 1940000,
          TotalSize: 1940000,
          PctOfTotalSize: "7.3%"
        },
        {
          TableName: "Sales",
          ColumnName: "ProductID",
          FullColumnName: "Sales[ProductID]",
          DataType: "Integer",
          ColumnType: "Data",
          IsHidden: false,
          Encoding: "UTF-8",
          DisplayFolder: "",
          Description: "Product identifier",
          IsKey: false,
          DataSize: 1940000,
          TotalSize: 1940000,
          PctOfTotalSize: "7.3%"
        },
        {
          TableName: "Sales",
          ColumnName: "OrderQuantity",
          FullColumnName: "Sales[OrderQuantity]",
          DataType: "Integer",
          ColumnType: "Data",
          IsHidden: false,
          Encoding: "UTF-8",
          DisplayFolder: "Metrics",
          Description: "Order quantity",
          IsKey: false,
          DataSize: 970000,
          TotalSize: 970000,
          PctOfTotalSize: "3.7%"
        },
        {
          TableName: "Sales",
          ColumnName: "UnitPrice",
          FullColumnName: "Sales[UnitPrice]",
          DataType: "Currency",
          ColumnType: "Data",
          IsHidden: false,
          Encoding: "UTF-8",
          DisplayFolder: "Metrics",
          Description: "Unit price",
          IsKey: false,
          DataSize: 1940000,
          TotalSize: 1940000,
          PctOfTotalSize: "7.3%"
        },
        {
          TableName: "Sales",
          ColumnName: "LineTotal",
          FullColumnName: "Sales[LineTotal]",
          DataType: "Currency",
          ColumnType: "Data",
          IsHidden: false,
          Encoding: "UTF-8",
          DisplayFolder: "Metrics",
          Description: "Line total amount",
          IsKey: false,
          DataSize: 1940000,
          TotalSize: 1940000,
          PctOfTotalSize: "7.3%"
        },
        {
          TableName: "Product",
          ColumnName: "ProductID",
          FullColumnName: "Product[ProductID]",
          DataType: "Integer",
          ColumnType: "Data",
          IsHidden: false,
          Encoding: "UTF-8",
          DisplayFolder: "",
          Description: "Product identifier",
          IsKey: true,
          DataSize: 10068,
          TotalSize: 10068,
          PctOfTotalSize: "0.04%"
        },
        {
          TableName: "Product",
          ColumnName: "Name",
          FullColumnName: "Product[Name]",
          DataType: "String",
          ColumnType: "Data",
          IsHidden: false,
          Encoding: "UTF-8",
          DisplayFolder: "",
          Description: "Product name",
          IsKey: false,
          DataSize: 125850,
          TotalSize: 125850,
          PctOfTotalSize: "0.48%"
        },
        {
          TableName: "Product",
          ColumnName: "ProductNumber",
          FullColumnName: "Product[ProductNumber]",
          DataType: "String",
          ColumnType: "Data",
          IsHidden: false,
          Encoding: "UTF-8",
          DisplayFolder: "",
          Description: "Product number",
          IsKey: false,
          DataSize: 62925,
          TotalSize: 62925,
          PctOfTotalSize: "0.24%"
        },
        {
          TableName: "Product",
          ColumnName: "Color",
          FullColumnName: "Product[Color]",
          DataType: "String",
          ColumnType: "Data",
          IsHidden: false,
          Encoding: "UTF-8",
          DisplayFolder: "Attributes",
          Description: "Product color",
          IsKey: false,
          DataSize: 12585,
          TotalSize: 12585,
          PctOfTotalSize: "0.05%"
        },
        {
          TableName: "Product",
          ColumnName: "SubcategoryID",
          FullColumnName: "Product[SubcategoryID]",
          DataType: "Integer",
          ColumnType: "Data",
          IsHidden: false,
          Encoding: "UTF-8",
          DisplayFolder: "",
          Description: "Product subcategory identifier",
          IsKey: false,
          DataSize: 10068,
          TotalSize: 10068,
          PctOfTotalSize: "0.04%"
        }
      ],
      // DAX measures from model.dax_measures
      measureData: [
        {
          MeasureName: "Total Sales",
          TableName: "Sales",
          FullMeasureName: "Sales[Total Sales]",
          MeasureExpression: "SUM(Sales[LineTotal])",
          DisplayFolder: "Sales KPIs",
          Description: "Total sales amount",
          DataType: "Currency",
          FormatString: "$#,0.00"
        },
        {
          MeasureName: "Total Quantity",
          TableName: "Sales",
          FullMeasureName: "Sales[Total Quantity]",
          MeasureExpression: "SUM(Sales[OrderQuantity])",
          DisplayFolder: "Sales KPIs",
          Description: "Total quantity sold",
          DataType: "Number",
          FormatString: "#,0"
        },
        {
          MeasureName: "Average Order Value",
          TableName: "Sales",
          FullMeasureName: "Sales[Average Order Value]",
          MeasureExpression: "AVERAGEX(Sales, Sales[LineTotal])",
          DisplayFolder: "Sales KPIs",
          Description: "Average order value",
          DataType: "Currency",
          FormatString: "$#,0.00"
        },
        {
          MeasureName: "Sales Last Year",
          TableName: "Sales",
          FullMeasureName: "Sales[Sales Last Year]",
          MeasureExpression: "CALCULATE([Total Sales], SAMEPERIODLASTYEAR(Date[Date]))",
          DisplayFolder: "Time Intelligence",
          Description: "Sales amount for the same period last year",
          DataType: "Currency",
          FormatString: "$#,0.00"
        },
        {
          MeasureName: "Sales Growth",
          TableName: "Sales",
          FullMeasureName: "Sales[Sales Growth]",
          MeasureExpression: "DIVIDE([Total Sales] - [Sales Last Year], [Sales Last Year], 0)",
          DisplayFolder: "Time Intelligence",
          Description: "Year-over-year sales growth percentage",
          DataType: "Percentage",
          FormatString: "0.00%"
        },
        {
          MeasureName: "Unique Customers",
          TableName: "Customer",
          FullMeasureName: "Customer[Unique Customers]",
          MeasureExpression: "DISTINCTCOUNT(Sales[CustomerID])",
          DisplayFolder: "Customer Metrics",
          Description: "Number of unique customers",
          DataType: "Number",
          FormatString: "#,0"
        },
        {
          MeasureName: "Customer Lifetime Value",
          TableName: "Customer",
          FullMeasureName: "Customer[Customer Lifetime Value]",
          MeasureExpression: "DIVIDE([Total Sales], [Unique Customers], 0)",
          DisplayFolder: "Customer Metrics",
          Description: "Average lifetime value per customer",
          DataType: "Currency",
          FormatString: "$#,0.00"
        },
        {
          MeasureName: "Product Count",
          TableName: "Product",
          FullMeasureName: "Product[Product Count]",
          MeasureExpression: "DISTINCTCOUNT(Product[ProductID])",
          DisplayFolder: "Product Metrics",
          Description: "Number of distinct products",
          DataType: "Number",
          FormatString: "#,0"
        },
        {
          MeasureName: "Top Product Sales",
          TableName: "Product",
          FullMeasureName: "Product[Top Product Sales]",
          MeasureExpression: "CALCULATE([Total Sales], TOPN(1, ALLSELECTED(Product), [Total Sales]))",
          DisplayFolder: "Product Metrics",
          Description: "Sales of the top-selling product",
          DataType: "Currency",
          FormatString: "$#,0.00"
        }
      ],
      // Power Query expressions from model.power_query
      expressionData: [
        {
          "Table Name": "Sales",
          "Expression": `let
    Source = Sql.Database("AdventureWorks-Server", "AdventureWorks2019"),
    dbo_FactInternetSales = Source{[Schema="dbo",Item="FactInternetSales"]}[Data],
    #"Filtered Rows" = Table.SelectRows(dbo_FactInternetSales, each [OrderDate] >= #date(2019, 1, 1)),
    #"Renamed Columns" = Table.RenameColumns(#"Filtered Rows",{{"SalesOrderNumber", "SalesOrderID"}, {"OrderDateKey", "OrderDate"}}),
    #"Changed Type" = Table.TransformColumnTypes(#"Renamed Columns",{{"OrderDate", type date}, {"UnitPrice", Currency.Type}, {"LineTotal", Currency.Type}})
in
    #"Changed Type"`
        },
        {
          "Table Name": "Product",
          "Expression": `let
    Source = Sql.Database("AdventureWorks-Server", "AdventureWorks2019"),
    dbo_DimProduct = Source{[Schema="dbo",Item="DimProduct"]}[Data],
    #"Filtered Rows" = Table.SelectRows(dbo_DimProduct, each [FinishedGoodsFlag] = true),
    #"Removed Columns" = Table.RemoveColumns(#"Filtered Rows",{"StartDate", "EndDate", "Status"}),
    #"Changed Type" = Table.TransformColumnTypes(#"Removed Columns",{{"ProductID", Int64.Type}, {"Name", type text}, {"ProductNumber", type text}})
in
    #"Changed Type"`
        },
        {
          "Table Name": "Customer",
          "Expression": `let
    Source = Sql.Database("AdventureWorks-Server", "AdventureWorks2019"),
    dbo_DimCustomer = Source{[Schema="dbo",Item="DimCustomer"]}[Data],
    #"Merged Columns" = Table.CombineColumns(dbo_DimCustomer,{"FirstName", "LastName"},Combiner.CombineTextByDelimiter(" ", QuoteStyle.None),"FullName"),
    #"Changed Type" = Table.TransformColumnTypes(#"Merged Columns",{{"CustomerID", Int64.Type}, {"FullName", type text}, {"EmailAddress", type text}})
in
    #"Changed Type"`
        },
        {
          "Table Name": "Date",
          "Expression": `let
    Source = #table(type table[Date = date], {}),
    #"Added Custom" = Table.AddColumn(Source, "Custom", each List.Dates(#date(2019,1,1), Duration.Days(#date(2024,12,31) - #date(2019,1,1)) + 1, #duration(1,0,0,0))),
    #"Expanded Custom" = Table.ExpandListColumn(#"Added Custom", "Custom"),
    #"Renamed Columns" = Table.RenameColumns(#"Expanded Custom",{{"Custom", "Date"}}),
    #"Added Year" = Table.AddColumn(#"Renamed Columns", "Year", each Date.Year([Date]), Int64.Type),
    #"Added Month" = Table.AddColumn(#"Added Year", "Month", each Date.Month([Date]), Int64.Type),
    #"Added Day" = Table.AddColumn(#"Added Month", "Day", each Date.Day([Date]), Int64.Type),
    #"Added Day Name" = Table.AddColumn(#"Added Day", "DayName", each Date.DayOfWeekName([Date]), type text),
    #"Added Month Name" = Table.AddColumn(#"Added Day Name", "MonthName", each Date.MonthName([Date]), type text)
in
    #"Added Month Name"`
        },
        {
          "Table Name": "Territory",
          "Expression": `let
    Source = Sql.Database("AdventureWorks-Server", "AdventureWorks2019"),
    dbo_DimSalesTerritory = Source{[Schema="dbo",Item="DimSalesTerritory"]}[Data],
    #"Removed Columns" = Table.RemoveColumns(dbo_DimSalesTerritory,{"Image"}),
    #"Changed Type" = Table.TransformColumnTypes(#"Removed Columns",{{"SalesTerritoryKey", Int64.Type}, {"SalesTerritoryRegion", type text}, {"SalesTerritoryCountry", type text}})
in
    #"Changed Type"`
        },
        {
          "Table Name": "ProductCategory",
          "Expression": `let
    Source = Sql.Database("AdventureWorks-Server", "AdventureWorks2019"),
    dbo_DimProductCategory = Source{[Schema="dbo",Item="DimProductCategory"]}[Data],
    #"Changed Type" = Table.TransformColumnTypes(dbo_DimProductCategory,{{"ProductCategoryKey", Int64.Type}, {"EnglishProductCategoryName", type text}})
in
    #"Changed Type"`
        },
        {
          "Table Name": "ProductSubcategory",
          "Expression": `let
    Source = Sql.Database("AdventureWorks-Server", "AdventureWorks2019"),
    dbo_DimProductSubcategory = Source{[Schema="dbo",Item="DimProductSubcategory"]}[Data],
    #"Changed Type" = Table.TransformColumnTypes(dbo_DimProductSubcategory,{{"ProductSubcategoryKey", Int64.Type}, {"EnglishProductSubcategoryName", type text}, {"ProductCategoryKey", Int64.Type}})
in
    #"Changed Type"`
        },
        {
          "Table Name": "Calendar",
          "Expression": `let
    Source = Date,
    #"Duplicated Column" = Table.DuplicateColumn(Source, "Date", "Date - Copy"),
    #"Added Quarter" = Table.AddColumn(#"Duplicated Column", "Quarter", each "Q" & Text.From(Date.QuarterOfYear([Date])), type text),
    #"Added Week Number" = Table.AddColumn(#"Added Quarter", "WeekNumber", each Date.WeekOfYear([Date]), Int64.Type),
    #"Changed Type" = Table.TransformColumnTypes(#"Added Week Number",{{"Date - Copy", type date}})
in
    #"Changed Type"`
        }
      ],
      // Relationships from model.relationships
      relationships: [
        {
          FromTableName: "Sales",
          FromFullColumnName: "Sales[CustomerID]",
          FromCardinalityType: "Many",
          ToTableName: "Customer",
          ToFullColumnName: "Customer[CustomerID]",
          ToCardinalityType: "One",
          JoinOnDateBehavior: "None",
          CrossFilteringBehavior: "OneDirection",
          RelationshipType: "SingleColumn",
          IsActive: true,
          SecurityFilteringBehavior: "OneDirection",
          UsedSizeFrom: 3880000,
          UsedSize: 73840,
          MissingKeys: 0,
          InvalidRows: 0,
          cardinality: "M-1-S",
          FromColumn: "CustomerID",
          ToColumn: "CustomerID"
        },
        {
          FromTableName: "Sales",
          FromFullColumnName: "Sales[ProductID]",
          FromCardinalityType: "Many",
          ToTableName: "Product",
          ToFullColumnName: "Product[ProductID]",
          ToCardinalityType: "One",
          JoinOnDateBehavior: "None",
          CrossFilteringBehavior: "OneDirection",
          RelationshipType: "SingleColumn",
          IsActive: true,
          SecurityFilteringBehavior: "OneDirection",
          UsedSizeFrom: 3880000,
          UsedSize: 20136,
          MissingKeys: 0,
          InvalidRows: 0,
          cardinality: "M-1-S",
          FromColumn: "ProductID",
          ToColumn: "ProductID"
        },
        {
          FromTableName: "Sales",
          FromFullColumnName: "Sales[OrderDate]",
          FromCardinalityType: "Many",
          ToTableName: "Date",
          ToFullColumnName: "Date[Date]",
          ToCardinalityType: "One",
          JoinOnDateBehavior: "DatePartOnly",
          CrossFilteringBehavior: "OneDirection",
          RelationshipType: "SingleColumn",
          IsActive: true,
          SecurityFilteringBehavior: "OneDirection",
          UsedSizeFrom: 3880000,
          UsedSize: 11688,
          MissingKeys: 0,
          InvalidRows: 0,
          cardinality: "M-1-S",
          FromColumn: "OrderDate",
          ToColumn: "Date"
        },
        {
          FromTableName: "Product",
          FromFullColumnName: "Product[SubcategoryID]",
          FromCardinalityType: "Many",
          ToTableName: "ProductSubcategory",
          ToFullColumnName: "ProductSubcategory[ProductSubcategoryKey]",
          ToCardinalityType: "One",
          JoinOnDateBehavior: "None",
          CrossFilteringBehavior: "OneDirection",
          RelationshipType: "SingleColumn",
          IsActive: true,
          SecurityFilteringBehavior: "OneDirection",
          UsedSizeFrom: 20136,
          UsedSize: 296,
          MissingKeys: 0,
          InvalidRows: 0,
          cardinality: "M-1-S",
          FromColumn: "SubcategoryID",
          ToColumn: "ProductSubcategoryKey"
        },
        {
          FromTableName: "ProductSubcategory",
          FromFullColumnName: "ProductSubcategory[ProductCategoryKey]",
          FromCardinalityType: "Many",
          ToTableName: "ProductCategory",
          ToFullColumnName: "ProductCategory[ProductCategoryKey]",
          ToCardinalityType: "One",
          JoinOnDateBehavior: "None",
          CrossFilteringBehavior: "OneDirection",
          RelationshipType: "SingleColumn",
          IsActive: true,
          SecurityFilteringBehavior: "OneDirection",
          UsedSizeFrom: 296,
          UsedSize: 32,
          MissingKeys: 0,
          InvalidRows: 0,
          cardinality: "M-1-S",
          FromColumn: "ProductCategoryKey",
          ToColumn: "ProductCategoryKey"
        }
      ]
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: mockResponse,
        message: 'PBIX file processed successfully with mock data. For production use, integrate with a Python service using pbixray library.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error processing PBIX:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
