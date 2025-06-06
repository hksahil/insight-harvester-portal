
import React, { useMemo } from 'react';
import ModelMetadataCard from '@/components/ModelMetadataCard';
import RelationshipFlowVisualizer from '@/components/RelationshipFlowVisualizer';
import UseCaseHelper from '@/components/UseCaseHelper';
import { ProcessedData } from '@/services/VpaxProcessor';

interface ModelMetadataWithVisualizationProps {
  data: ProcessedData;
}

const ModelMetadataWithVisualization: React.FC<ModelMetadataWithVisualizationProps> = ({ data }) => {
  // Update the model info to reflect the updated Max Row Count and Total Size of Model
  const updatedModelInfo = useMemo(() => {
    const modelInfo = { ...data.modelInfo };
    
    // Find index of Max Row Count attribute
    const maxRowCountIndex = modelInfo.Attribute.findIndex(attr => attr === "Max Row Count of Biggest Table");
    if (maxRowCountIndex !== -1) {
      // Calculate maximum rows from tableData using the RowsCount from DaxVpaView
      const maxRows = Math.max(...data.tableData.map(table => 
        typeof table.Rows === 'number' ? table.Rows : 0
      ));
      modelInfo.Value[maxRowCountIndex] = maxRows > 0 ? maxRows : "No row count data available";
    }
    
    // Find index of Total Size of Model attribute
    const totalSizeIndex = modelInfo.Attribute.findIndex(attr => attr === "Total Size of Model");
    if (totalSizeIndex !== -1) {
      // Check if this is a DirectQuery model
      const isDirectQuery = data.tableData.some(table => 
        typeof table.Mode === 'string' && 
        table.Mode.toLowerCase().includes('directquery'));
      
      // Calculate total size from the sum of Total Table Size in tableData
      let totalSize = 0;
      let hasValidSize = false;
      
      data.tableData.forEach(table => {
        const tableSize = table["Total Table Size"] || 0;
        if (tableSize > 0) {
          hasValidSize = true;
          totalSize += tableSize;
        }
      });
      
      if (hasValidSize) {
        // Convert to GB for display with appropriate unit
        const totalGB = totalSize / (1024 * 1024 * 1024);
        
        // If less than 1GB, show in MB
        if (totalGB < 1) {
          const totalMB = totalSize / (1024 * 1024);
          modelInfo.Value[totalSizeIndex] = `${totalMB.toFixed(3)}MB`;
        } else {
          modelInfo.Value[totalSizeIndex] = `${totalGB.toFixed(3)}GB`;
        }
      } else if (isDirectQuery) {
        // Handle DirectQuery models with no size data
        modelInfo.Value[totalSizeIndex] = "DirectQuery (Size N/A)";
      } else {
        modelInfo.Value[totalSizeIndex] = "0MB";
      }
    }
    
    return modelInfo;
  }, [data]);

  return (
    <div className="space-y-6">
      <UseCaseHelper type="model-metadata" />
      <h3 className="text-xl font-semibold" style={{paddingLeft:'10px'}}>Model Summary</h3>
      <ModelMetadataCard metadata={updatedModelInfo} />
      
      <div className="mt-8 space-y-4">
        <h3 className="text-xl font-semibold" style={{paddingLeft:'10px'}}>Relationship Visualization</h3>
        <div className="p-4 bg-muted/30 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground italic">
            <strong>Note:</strong> Click on tables or relationship lines in the diagram to get more information
          </p>
        </div>
        <RelationshipFlowVisualizer relationships={data.relationships} />
      </div>
    </div>
  );
};

export default ModelMetadataWithVisualization;
