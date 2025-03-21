
import React from 'react';
import ModelMetadataCard from '@/components/ModelMetadataCard';
import RelationshipFlowVisualizer from '@/components/RelationshipFlowVisualizer';
import UseCaseHelper from '@/components/UseCaseHelper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProcessedData } from '@/services/VpaxProcessor';

interface ModelMetadataWithVisualizationProps {
  data: ProcessedData;
}

const ModelMetadataWithVisualization: React.FC<ModelMetadataWithVisualizationProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <UseCaseHelper type="model-metadata" />
      
      <ModelMetadataCard metadata={data.modelInfo} />
      
      <div className="mt-8 space-y-4">
        <h3 className="text-xl font-semibold">Relationship Visualization</h3>
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
