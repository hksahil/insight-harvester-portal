import React, { useState, useEffect } from 'react';
import NavigationBar from "@/components/NavigationBar";
import FileUploader from "@/components/FileUploader";
import TabsContainer from "@/components/TabsContainer";
import ModelMetadataWithVisualization from "@/components/ModelMetadataWithVisualization";
import DataTab from "@/components/DataTab";
import RelationshipsTab from "@/components/RelationshipsTab";
import ExpressionDisplay from "@/components/ExpressionDisplay";
import AskGPT from "@/components/AskGPT";
import DocumentationTab from "@/components/DocumentationTab";
import MeasureVisualizer from "@/components/MeasureVisualizer";
import BestPracticesAnalyzer from "@/components/BestPracticesAnalyzer";
import Footer from "@/components/Footer";
import SampleData from "@/components/SampleData";
import SnippetsTab from "@/components/SnippetsTab";
import UseCaseHelper from "@/components/UseCaseHelper";
import { toast } from 'sonner';
import { processVpaxFile, ProcessedData } from '@/services/VpaxProcessor';
import { DatabaseZap, LineChart, FileCode, BarChart3, FileText, Brain, LogIn } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
const Index = () => {
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isDataProcessing, setIsDataProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setUser(session?.user ?? null);
    });
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);
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
      const sampleData: ProcessedData = {
        modelInfo: {
          Attribute: ["Model Name", "Date Modified", "Total Size of Model", "Number of Tables", "Number of Partitions", "Max Row Count of Biggest Table", "Total Columns", "Total Measures", "Total Relationships"],
          Value: ["Adventure Works", "2023-06-15", "1.2 GB", 15, 20, 1500000, 120, 45, 35]
        },
        tableData: Array(15).fill(0).map((_, i) => {
          const tableSize = Math.floor(Math.random() * 5000000) + 100000;
          const columnsSize = Math.floor(tableSize * 0.8);
          const relationshipsSize = tableSize - columnsSize;
          return {
            "Table Name": `Table_${i + 1}`,
            "Mode": i % 2 === 0 ? "DirectQuery" : "Import",
            "Partitions": Math.floor(Math.random() * 3) + 1,
            "Rows": Math.floor(Math.random() * 1000000) + 1000,
            "Total Table Size": tableSize,
            "Columns Size": columnsSize,
            "Relationships Size": relationshipsSize,
            "PctOfTotalSize": "6.67%",
            "Is Hidden": i % 5 === 0,
            "Latest Partition Modified": "2023-06-10",
            "Latest Partition Refreshed": "2023-06-12"
          };
        }),
        columnData: Array(120).fill(0).map((_, i) => {
          const totalSize = Math.floor(Math.random() * 500000) + 1000;
          return {
            TableName: `Table_${Math.floor(i / 8) + 1}`,
            ColumnName: `Column_${i + 1}`,
            FullColumnName: `Table_${Math.floor(i / 8) + 1}[Column_${i + 1}]`,
            DataType: ["String", "Integer", "Decimal", "DateTime", "Boolean"][i % 5],
            ColumnType: ["Data", "Calculated", "Key"][i % 3],
            IsHidden: i % 7 === 0,
            Encoding: "UTF-8",
            DisplayFolder: i % 4 === 0 ? "Metrics" : i % 3 === 0 ? "Dimensions" : "",
            Description: `Description for column ${i + 1}`,
            IsKey: i % 10 === 0,
            DataSize: Math.floor(Math.random() * 400000) + 1000,
            TotalSize: totalSize,
            PctOfTotalSize: "0.83%"
          };
        }),
        measureData: Array(45).fill(0).map((_, i) => ({
          MeasureName: `Measure_${i + 1}`,
          TableName: `Table_${Math.floor(i / 3) + 1}`,
          FullMeasureName: `Table_${Math.floor(i / 3) + 1}[Measure_${i + 1}]`,
          MeasureExpression: `SUM(Table_${Math.floor(i / 3) + 1}[Column_${i + 1}])`,
          DisplayFolder: i % 3 === 0 ? "KPIs" : i % 2 === 0 ? "Metrics" : "Analysis",
          Description: `Calculates the ${i + 1}th metric`,
          DataType: ["Currency", "Number", "Percentage", "Text"][i % 4],
          FormatString: i % 4 === 0 ? "$#,0.00" : i % 4 === 1 ? "#,0" : i % 4 === 2 ? "0.00%" : "@"
        })),
        expressionData: Array(15).fill(0).map((_, i) => ({
          "Table Name": `Table_${i + 1}`,
          "Expression": `let\n  Source = Sql.Database(\"server\", \"database\"),\n  dbo_Table${i + 1} = Source{[Schema=\"dbo\",Item=\"Table${i + 1}\"]}[Data],\n  #\"Filtered Rows\" = Table.SelectRows(dbo_Table${i + 1}, each [Column1] <> null)\nin\n  #\"Filtered Rows\"`
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
    return [{
      id: 'model-metadata',
      label: 'Model',
      content: <ModelMetadataWithVisualization data={processedData} />
    }, {
      id: 'relationships',
      label: 'Relationships',
      content: <div className="space-y-6">
            <UseCaseHelper type="relationships" />
            <RelationshipsTab relationships={processedData.relationships} />
          </div>
    }, {
      id: 'tables-metadata',
      label: 'Tables',
      content: <div className="space-y-6">
            <UseCaseHelper type="tables" />
            <DataTab data={processedData.tableData} title="Tables Metadata" filterColumns={["Mode", "Is Hidden"]} />
          </div>
    }, {
      id: 'columns-metadata',
      label: 'Columns',
      content: <div className="space-y-6">
            <UseCaseHelper type="columns" />
            <DataTab data={processedData.columnData} title="Columns Metadata" filterColumns={["TableName", "DataType", "IsHidden"]} searchColumn="ColumnName" enableColumnSelection={true} />
          </div>
    }, {
      id: 'measures-metadata',
      label: 'Measures',
      content: <div className="space-y-6">
            <UseCaseHelper type="measures" />
            <DataTab data={processedData.measureData} title="Measures Metadata" filterColumns={["TableName", "DataType"]} searchColumn="MeasureExpression" enableColumnSelection={true} />
          </div>
    }, {
      id: 'measure-visualizer',
      label: 'Impact Analysis',
      content: <div className="space-y-6">
            <MeasureVisualizer measureData={processedData.measureData} columnData={processedData.columnData} />
          </div>
    }, {
      id: 'best-practices',
      label: 'Best Practices',
      content: <div className="space-y-6">
            <BestPracticesAnalyzer data={processedData} />
          </div>
    }, {
      id: 'expressions',
      label: 'PowerQuery',
      content: <div className="space-y-6">
            <UseCaseHelper type="expressions" />
            <ExpressionDisplay expressions={processedData.expressionData} />
          </div>
    }, {
      id: 'snippets',
      label: 'Reusable Snippets',
      content: <SnippetsTab />
    }, {
      id: 'documentation',
      label: 'Documentation',
      content: <div className="space-y-6">
            <DocumentationTab data={processedData} />
          </div>
    }, {
      id: 'ask-gpt',
      label: 'Ask GPT',
      content: <AskGPT tableData={processedData.tableData} columnData={processedData.columnData} />
    }];
  };
  return <div className="min-h-screen pb-16 bg-gradient-to-b from-background to-muted/20" style={{
    paddingBottom: '0px'
  }}>
      <NavigationBar />
      
      <main className="container mx-auto pt-24 px-4 sm:px-6">
        {!isFileUploaded ? <div>
            <div className="animate-fade-in max-w-3xl mx-auto text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-foreground/20 blur-3xl opacity-70 -z-10 rounded-full"></div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary">
                  Power BI Assistant
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload your Power BI .vpax to to benchmark your model, perform impact analysis, maintain a code repository, leverage AI capabilities & much more.
              </p>
            </div>
            
            <div className="mt-2 flex flex-col items-center justify-center gap-6 my-0">
              <div className="flex gap-4 items-center">
                {!user && <>
                    <SampleData onLoadSample={loadSampleData} />
                    <Button variant="default" size="lg" className="flex items-center gap-2" style={{
                backgroundColor: 'rgb(0, 128, 255)',
                color: 'white'
              }} onClick={() => navigate('/auth')}>
                      <LogIn className="h-4 w-4" />
                      Login to use your own Power BI models
                    </Button>
                  </>}
              </div>
              {user && <FileUploader onFileUpload={handleFileUpload} />}
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="p-6 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <DatabaseZap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Model Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Analyze your Power BI model structure including tables, columns, measures, and relationships.
                  </p>
                </div>
              </Card>
              
              <Card className="p-6 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <LineChart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Impact Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Understand dependencies and relationships between measures, columns, and tables in your model.
                  </p>
                </div>
              </Card>
              
              <Card className="p-6 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <FileCode className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">DAX Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Review DAX expressions, measure dependencies, and identify optimization opportunities.
                  </p>
                </div>
              </Card>

              <Card className="p-6 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Best Practices</h3>
                  <p className="text-sm text-muted-foreground">
                    Evaluate your model against industry best practices and get recommendations for improvements.
                  </p>
                </div>
              </Card>

              <Card className="p-6 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Documentation</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically generate comprehensive documentation for your Power BI model.
                  </p>
                </div>
              </Card>

              <Card className="p-6 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Brain className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">AI Assistant</h3>
                  <p className="text-sm text-muted-foreground">
                    Get AI-powered insights and suggestions for improving your Power BI model.
                  </p>
                </div>
              </Card>
            </div>
          </div> : <div className="mt-12 animate-fade-in">
            <TabsContainer tabs={getTabs()} />
          </div>}
        
        {isDataProcessing && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="space-y-4 text-center">
              <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-lg font-medium">Processing file...</p>
            </div>
          </div>}
      </main>
      
      <Footer />
    </div>;
};
export default Index;