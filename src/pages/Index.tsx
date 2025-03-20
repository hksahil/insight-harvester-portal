
import React, { useState } from 'react';
import NavigationBar from "@/components/NavigationBar";
import FileUploader from "@/components/FileUploader";
import TabsContainer from "@/components/TabsContainer";
import ModelMetadataCard from "@/components/ModelMetadataCard";
import RelationshipVisualizer from "@/components/RelationshipVisualizer";
import RelationshipFlowVisualizer from "@/components/RelationshipFlowVisualizer";
import DataTab from "@/components/DataTab";
import RelationshipsTab from "@/components/RelationshipsTab";
import ExpressionDisplay from "@/components/ExpressionDisplay";
import AskGPT from "@/components/AskGPT";
import DocumentationTab from "@/components/DocumentationTab";
import Footer from "@/components/Footer";
import SampleData from "@/components/SampleData";
import UseCaseHelper from "@/components/UseCaseHelper";
import { toast } from 'sonner';
import { processVpaxFile, ProcessedData } from '@/services/VpaxProcessor';

const Index = () => {
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isDataProcessing, setIsDataProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsDataProcessing(true);
    
    try {
      const data = await processVpaxFile(file);
      setProcessedData(data);
      setIsFileUploaded(true);
      toast.success('File processed successfully');
    } catch (error) {
      toast.error(`Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDataProcessing(false);
    }
  };

  const loadSampleData = async () => {
    setIsDataProcessing(true);
    
    try {
      // This is just a mock sample data
      const sampleData: ProcessedData = {
        modelInfo: {
          Attribute: [
            "Model Name", "Date Modified", "Total Size of Model", 
            "Number of Tables", "Number of Partitions", 
            "Max Row Count of Biggest Table", "Total Columns", "Total Measures", 
            "Total Relationships"
          ],
          Value: [
            "Adventure Works", "2023-06-15", 25600000, 
            15, 20, 
            1500000, 120, 45, 
            35
          ]
        },
        tableData: Array(15).fill(0).map((_, i) => ({
          "Table Name": `Table_${i+1}`,
          "Mode": i % 2 === 0 ? "DirectQuery" : "Import",
          "Partitions": Math.floor(Math.random() * 3) + 1,
          "Rows": Math.floor(Math.random() * 1000000) + 1000,
          "Table Size": Math.floor(Math.random() * 5000000) + 100000,
          "% of Total Size": Math.random() * 20,
          "Is Hidden": i % 5 === 0,
          "Latest Partition Modified": "2023-06-10",
          "Latest Partition Refreshed": "2023-06-12"
        })),
        columnData: Array(120).fill(0).map((_, i) => ({
          TableName: `Table_${Math.floor(i/8) + 1}`,
          ColumnName: `Column_${i+1}`,
          FullColumnName: `Table_${Math.floor(i/8) + 1}[Column_${i+1}]`,
          DataType: ["String", "Integer", "Decimal", "DateTime", "Boolean"][i % 5],
          ColumnType: ["Data", "Calculated", "Key"][i % 3],
          IsHidden: i % 7 === 0,
          Encoding: "UTF-8",
          DisplayFolder: i % 4 === 0 ? "Metrics" : i % 3 === 0 ? "Dimensions" : "",
          Description: `Description for column ${i+1}`,
          IsKey: i % 10 === 0,
          DataSize: Math.floor(Math.random() * 500000) + 1000
        })),
        measureData: Array(45).fill(0).map((_, i) => ({
          MeasureName: `Measure_${i+1}`,
          TableName: `Table_${Math.floor(i/3) + 1}`,
          FullMeasureName: `Table_${Math.floor(i/3) + 1}[Measure_${i+1}]`,
          MeasureExpression: `SUM(Table_${Math.floor(i/3) + 1}[Column_${i+1}])`,
          DisplayFolder: i % 3 === 0 ? "KPIs" : i % 2 === 0 ? "Metrics" : "Analysis",
          Description: `Calculates the ${i+1}th metric`,
          DataType: ["Currency", "Number", "Percentage", "Text"][i % 4],
          FormatString: i % 4 === 0 ? "$#,0.00" : i % 4 === 1 ? "#,0" : i % 4 === 2 ? "0.00%" : "@"
        })),
        expressionData: Array(15).fill(0).map((_, i) => ({
          "Table Name": `Table_${i+1}`,
          "Expression": `let\n  Source = Sql.Database(\"server\", \"database\"),\n  dbo_Table${i+1} = Source{[Schema=\"dbo\",Item=\"Table${i+1}\"]}[Data],\n  #\"Filtered Rows\" = Table.SelectRows(dbo_Table${i+1}, each [Column1] <> null)\nin\n  #\"Filtered Rows\"`
        })),
        relationships: Array(35).fill(0).map((_, i) => {
          const fromTable = `Table_${Math.floor(Math.random() * 5) + 1}`;
          const toTable = `Table_${Math.floor(Math.random() * 10) + 6}`;
          const fromCardinality = Math.random() > 0.5 ? "Many" : "One";
          const toCardinality = Math.random() > 0.5 ? "Many" : "One";
          const fromColumn = `Column_${Math.floor(Math.random() * 20) + 1}`;
          const toColumn = `Column_${Math.floor(Math.random() * 20) + 1}`;
          
          return {
            FromTableName: fromTable,
            FromFullColumnName: `${fromTable}[${fromColumn}]`,
            FromCardinalityType: fromCardinality,
            ToTableName: toTable,
            ToFullColumnName: `${toTable}[${toColumn}]`,
            ToCardinalityType: toCardinality,
            JoinOnDateBehavior: "None",
            CrossFilteringBehavior: "OneDirection",
            RelationshipType: "SingleColumn",
            IsActive: Math.random() > 0.1,
            SecurityFilteringBehavior: "OneDirection",
            UsedSizeFrom: Math.floor(Math.random() * 10000),
            UsedSize: Math.floor(Math.random() * 10000),
            MissingKeys: Math.floor(Math.random() * 100),
            InvalidRows: Math.floor(Math.random() * 100),
            cardinality: `${fromCardinality === "Many" ? "M" : "1"}-${toCardinality === "Many" ? "M" : "1"}-S`,
            FromColumn: fromColumn,
            ToColumn: toColumn
          };
        })
      };

      setProcessedData(sampleData);
      setIsFileUploaded(true);
      toast.success('Sample data loaded successfully');
    } catch (error) {
      toast.error(`Error loading sample data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDataProcessing(false);
    }
  };

  const getTabs = () => {
    if (!processedData) return [];
    
    return [
      {
        id: 'model-metadata',
        label: 'Model Metadata',
        content: (
          <div className="space-y-6">
            <UseCaseHelper type="model-metadata" />
            <ModelMetadataCard metadata={processedData.modelInfo} />
            <RelationshipVisualizer relationships={processedData.relationships} />
          </div>
        ),
      },
      {
        id: 'relationship-flow',
        label: 'Relationship Visualizer',
        content: (
          <div className="space-y-6">
            <UseCaseHelper type="relationships" />
            <RelationshipFlowVisualizer relationships={processedData.relationships} />
          </div>
        ),
      },
      {
        id: 'relationships',
        label: 'Relationships',
        content: (
          <div className="space-y-6">
            <UseCaseHelper type="relationships" />
            <RelationshipsTab relationships={processedData.relationships} />
          </div>
        ),
      },
      {
        id: 'tables-metadata',
        label: 'Tables',
        content: (
          <div className="space-y-6">
            <UseCaseHelper type="tables" />
            <DataTab 
              data={processedData.tableData} 
              title="Tables Metadata" 
              filterColumns={["Mode", "Is Hidden"]} 
            />
          </div>
        ),
      },
      {
        id: 'columns-metadata',
        label: 'Columns',
        content: (
          <div className="space-y-6">
            <UseCaseHelper type="columns" />
            <DataTab 
              data={processedData.columnData} 
              title="Columns Metadata" 
              filterColumns={["TableName", "DataType", "IsHidden"]} 
              searchColumn="ColumnName"
              enableColumnSelection={true}
            />
          </div>
        ),
      },
      {
        id: 'measures-metadata',
        label: 'Measures',
        content: (
          <div className="space-y-6">
            <UseCaseHelper type="measures" />
            <DataTab 
              data={processedData.measureData} 
              title="Measures Metadata" 
              filterColumns={["TableName", "DataType"]} 
              searchColumn="MeasureExpression"
              enableColumnSelection={true}
            />
          </div>
        ),
      },
      {
        id: 'expressions',
        label: 'Expressions',
        content: (
          <div className="space-y-6">
            <UseCaseHelper type="expressions" />
            <ExpressionDisplay expressions={processedData.expressionData} />
          </div>
        ),
      },
      {
        id: 'documentation',
        label: 'Documentation',
        content: <DocumentationTab data={processedData} />,
      },
      {
        id: 'ask-gpt',
        label: 'Ask GPT',
        content: <AskGPT />,
      },
    ];
  };

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-b from-background to-muted/20">
      <NavigationBar />
      
      <main className="container mx-auto pt-24 px-4 sm:px-6">
        <div className="animate-fade-in max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
            Power BI Assistant
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your Power BI .vpax files to analyze model structure, relationships, and query data
          </p>
        </div>
        
        {!isFileUploaded ? (
          <div>
            <FileUploader onFileUpload={handleFileUpload} />
            <SampleData onLoadSample={loadSampleData} />
          </div>
        ) : (
          <div className="mt-12 animate-fade-in">
            <TabsContainer tabs={getTabs()} />
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
      
      <Footer />
    </div>
  );
};

export default Index;
