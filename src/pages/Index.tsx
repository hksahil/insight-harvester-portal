
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

  const getTabs = () => {
    if (!processedData) return [];
    
    return [
      {
        id: 'model-metadata',
        label: 'Model Metadata',
        content: (
          <div className="space-y-6">
            <ModelMetadataCard metadata={processedData.modelInfo} />
            <RelationshipVisualizer relationships={processedData.relationships} />
          </div>
        ),
      },
      {
        id: 'tables-metadata',
        label: 'Tables',
        content: <DataTab data={processedData.tableData} title="Tables Metadata" filterColumns={["Mode", "Is Hidden"]} />,
      },
      {
        id: 'columns-metadata',
        label: 'Columns',
        content: <DataTab data={processedData.columnData} title="Columns Metadata" filterColumns={["TableName", "DataType", "IsHidden"]} />,
      },
      {
        id: 'measures-metadata',
        label: 'Measures',
        content: <DataTab data={processedData.measureData} title="Measures Metadata" filterColumns={["TableName", "DataType"]} searchColumn="MeasureExpression" />,
      },
      {
        id: 'expressions',
        label: 'Expressions',
        content: <ExpressionDisplay expressions={processedData.expressionData} />,
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
          <FileUploader onFileUpload={handleFileUpload} />
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
    </div>
  );
};

export default Index;
