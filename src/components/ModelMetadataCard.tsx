
import React from 'react';
import { CalendarDays, Database, Table, FileBox } from 'lucide-react';

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
      case 'Number of Tables':
        return <Table className="h-5 w-5 text-primary" />;
      default:
        return <FileBox className="h-5 w-5 text-primary" />;
    }
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
              <p className="mt-1 text-xl font-semibold">{metadata.Value[index]?.toString() || "N/A"}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModelMetadataCard;
