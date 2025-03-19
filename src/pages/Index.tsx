
import React, { useState } from 'react';
import NavigationBar from "@/components/NavigationBar";
import FileUploader from "@/components/FileUploader";
import TabsContainer from "@/components/TabsContainer";
import ModelMetadataCard from "@/components/ModelMetadataCard";
import RelationshipVisualizer from "@/components/RelationshipVisualizer";
import DataTab from "@/components/DataTab";
import ExpressionDisplay from "@/components/ExpressionDisplay";
import AskGPT from "@/components/AskGPT";
import { toast } from 'sonner';

// Sample data for demonstration
const sampleModelInfo = {
  Attribute: [
    "Model Name", 
    "Date Modified", 
    "Total Size of Model", 
    "Storage Format", 
    "Number of Tables", 
    "Number of Partitions", 
    "Max Row Count of Biggest Table",
    "Total Columns",
    "Total Measures"
  ],
  Value: [
    "Sales Analysis", 
    "2023-05-15", 
    "256MB", 
    "PBIX", 
    "12", 
    "24", 
    "1,250,000",
    "86",
    "42"
  ]
};

const sampleRelationships = [
  { FromTableName: "Sales", ToTableName: "Products", cardinality: "Many to One", FromColumn: "ProductID", ToColumn: "ID" },
  { FromTableName: "Sales", ToTableName: "Customers", cardinality: "Many to One", FromColumn: "CustomerID", ToColumn: "ID" },
  { FromTableName: "Sales", ToTableName: "Date", cardinality: "Many to One", FromColumn: "DateKey", ToColumn: "DateKey" },
  { FromTableName: "Products", ToTableName: "Categories", cardinality: "Many to One", FromColumn: "CategoryID", ToColumn: "ID" },
  { FromTableName: "Customers", ToTableName: "Geography", cardinality: "Many to One", FromColumn: "GeoID", ToColumn: "ID" }
];

const sampleTables = [
  { "Table Name": "Sales", "Mode": "Import", "Partitions": 4, "Rows": 1250000, "Table Size": 120000000, "% of Total Size": 46.88, "Is Hidden": false },
  { "Table Name": "Products", "Mode": "Import", "Partitions": 2, "Rows": 5000, "Table Size": 20000000, "% of Total Size": 7.81, "Is Hidden": false },
  { "Table Name": "Customers", "Mode": "Import", "Partitions": 2, "Rows": 50000, "Table Size": 40000000, "% of Total Size": 15.63, "Is Hidden": false },
  { "Table Name": "Date", "Mode": "Import", "Partitions": 1, "Rows": 3650, "Table Size": 5000000, "% of Total Size": 1.95, "Is Hidden": false },
  { "Table Name": "Geography", "Mode": "Import", "Partitions": 1, "Rows": 2000, "Table Size": 8000000, "% of Total Size": 3.13, "Is Hidden": false },
  { "Table Name": "Categories", "Mode": "Import", "Partitions": 1, "Rows": 100, "Table Size": 1000000, "% of Total Size": 0.39, "Is Hidden": false }
];

const sampleColumns = [
  { "TableName": "Sales", "ColumnName": "SalesAmount", "DataType": "Decimal", "IsHidden": false, "Format": "Currency" },
  { "TableName": "Sales", "ColumnName": "Quantity", "DataType": "Int64", "IsHidden": false, "Format": "Whole Number" },
  { "TableName": "Sales", "ColumnName": "ProductID", "DataType": "Int64", "IsHidden": true, "Format": "Whole Number" },
  { "TableName": "Products", "ColumnName": "ID", "DataType": "Int64", "IsHidden": false, "Format": "Whole Number" },
  { "TableName": "Products", "ColumnName": "ProductName", "DataType": "String", "IsHidden": false, "Format": "Text" },
  { "TableName": "Products", "ColumnName": "UnitPrice", "DataType": "Decimal", "IsHidden": false, "Format": "Currency" }
];

const sampleMeasures = [
  { "MeasureName": "Total Sales", "TableName": "Sales", "DataType": "Decimal", "MeasureExpression": "SUM(Sales[SalesAmount])" },
  { "MeasureName": "Total Quantity", "TableName": "Sales", "DataType": "Int64", "MeasureExpression": "SUM(Sales[Quantity])" },
  { "MeasureName": "Average Price", "TableName": "Products", "DataType": "Decimal", "MeasureExpression": "AVERAGE(Products[UnitPrice])" },
  { "MeasureName": "Sales YTD", "TableName": "Sales", "DataType": "Decimal", "MeasureExpression": "TOTALYTD(SUM(Sales[SalesAmount]), 'Date'[Date])" }
];

const sampleExpressions = [
  { "Table Name": "Sales", "Expression": "let\n  Source = Sql.Database(\"server\", \"database\"),\n  dbo_Sales = Source{[Schema=\"dbo\",Item=\"Sales\"]}[Data],\n  #\"Filtered Rows\" = Table.SelectRows(dbo_Sales, each [OrderDate] > #date(2020, 1, 1))\nin\n  #\"Filtered Rows\"" },
  { "Table Name": "Products", "Expression": "let\n  Source = Sql.Database(\"server\", \"database\"),\n  dbo_Products = Source{[Schema=\"dbo\",Item=\"Products\"]}[Data]\nin\n  dbo_Products" },
  { "Table Name": "Customers", "Expression": "let\n  Source = Sql.Database(\"server\", \"database\"),\n  dbo_Customers = Source{[Schema=\"dbo\",Item=\"Customers\"]}[Data],\n  #\"Filtered Rows\" = Table.SelectRows(dbo_Customers, each [Active] = true)\nin\n  #\"Filtered Rows\"" }
];

const Index = () => {
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isDataProcessing, setIsDataProcessing] = useState(false);

  const handleFileUpload = (file: File) => {
    // In a real implementation, we would process the uploaded file
    // For now, we'll simulate processing with a delay
    setIsDataProcessing(true);
    
    setTimeout(() => {
      setIsFileUploaded(true);
      setIsDataProcessing(false);
      toast.success('File processed successfully');
    }, 2000);
  };

  const tabs = [
    {
      id: 'model-metadata',
      label: 'Model Metadata',
      content: (
        <div className="space-y-6">
          <ModelMetadataCard metadata={sampleModelInfo} />
          <RelationshipVisualizer relationships={sampleRelationships} />
        </div>
      ),
    },
    {
      id: 'tables-metadata',
      label: 'Tables',
      content: <DataTab data={sampleTables} title="Tables Metadata" filterColumns={["Mode", "Is Hidden"]} />,
    },
    {
      id: 'columns-metadata',
      label: 'Columns',
      content: <DataTab data={sampleColumns} title="Columns Metadata" filterColumns={["TableName", "DataType", "IsHidden"]} />,
    },
    {
      id: 'measures-metadata',
      label: 'Measures',
      content: <DataTab data={sampleMeasures} title="Measures Metadata" filterColumns={["TableName", "DataType"]} searchColumn="MeasureExpression" />,
    },
    {
      id: 'expressions',
      label: 'Expressions',
      content: <ExpressionDisplay expressions={sampleExpressions} />,
    },
    {
      id: 'ask-gpt',
      label: 'Ask GPT',
      content: <AskGPT />,
    },
  ];

  return (
    <div className="min-h-screen pb-16">
      <NavigationBar />
      
      <main className="container mx-auto pt-24 px-4 sm:px-6">
        <div className="animate-fade-in max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Power BI Assistant
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your Power BI .vpax files to analyze model structure, relationships, and query data
          </p>
        </div>
        
        {!isFileUploaded ? (
          <FileUploader onFileUpload={handleFileUpload} />
        ) : (
          <div className="mt-12 animate-fade-in">
            <TabsContainer tabs={tabs} />
          </div>
        )}
        
        {isDataProcessing && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="space-y-4 text-center">
              <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-lg font-medium">Processing file...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
