
import React from 'react';
import { CalendarDays, Database, Table, FileBox, Layers, Grid, BarChart3, GitFork } from 'lucide-react';

interface ModelMetadataProps {
  metadata: {
    Attribute: string[];
    Value: any[];
  };
}

const ModelMetadataCard: React.FC<ModelMetadataProps> = ({ metadata }) => {
  const getIconForAttribute = (attribute: string) => {
    switch(attribute) {
      case 'Model Name':
        return <Database className="h-5 w-5 text-primary" />;
      case 'Date Modified':
        return <CalendarDays className="h-5 w-5 text-primary" />;
      case 'Total Size of Model':
        return <FileBox className="h-5 w-5 text-primary" />;
      case 'Number of Tables':
        return <Table className="h-5 w-5 text-primary" />;
      case 'Number of Partitions':
        return <Layers className="h-5 w-5 text-primary" />;
      case 'Max Row Count of Biggest Table':
        return <Grid className="h-5 w-5 text-primary" />;
      case 'Total Columns':
        return <Grid className="h-5 w-5 text-primary" />;
      case 'Total Measures':
        return <BarChart3 className="h-5 w-5 text-primary" />;
      case 'Total Relationships':
        return <GitFork className="h-5 w-5 text-primary" />;
      default:
        return <FileBox className="h-5 w-5 text-primary" />;
    }
  };

  const formatValue = (value: any, attribute: string) => {
    // For Max Row Count of Biggest Table, if it's 0, show "Not Available"
    if (value === 0 && attribute === 'Max Row Count of Biggest Table') {
      return "Not Available";
    }
    
    // For Max Row Count, convert to millions
    if (attribute === 'Max Row Count of Biggest Table' && typeof value === 'number') {
      return `${(value / 1000000).toFixed(2)}M`;
    }
    
    return value?.toString() || "N/A";
  };

  return (
    <div className="animate-zoom-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-2">
      {metadata.Attribute.map((attr, index) => (
        <div 
          key={attr} 
          className="glass card-shine p-6 rounded-xl border border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
        >
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              {getIconForAttribute(attr)}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{attr}</p>
              <p className="mt-1 text-xl font-semibold">{formatValue(metadata.Value[index], attr)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModelMetadataCard;
