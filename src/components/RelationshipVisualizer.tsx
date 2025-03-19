
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Relationship } from '@/services/VpaxProcessor';

interface RelationshipVisualizerProps {
  relationships: Relationship[];
}

const RelationshipVisualizer: React.FC<RelationshipVisualizerProps> = ({ relationships }) => {
  // Group relationships by source table
  const groupedRelationships: Record<string, Relationship[]> = {};
  
  relationships.forEach(rel => {
    if (!groupedRelationships[rel.FromTableName]) {
      groupedRelationships[rel.FromTableName] = [];
    }
    groupedRelationships[rel.FromTableName].push(rel);
  });

  const [expandedTables, setExpandedTables] = React.useState<Record<string, boolean>>({});

  const toggleTable = (tableName: string) => {
    setExpandedTables({
      ...expandedTables,
      [tableName]: !expandedTables[tableName],
    });
  };

  return (
    <div className="animate-fade-in p-2">
      <div className="space-y-2">
        {Object.entries(groupedRelationships).map(([tableName, rels]) => (
          <div key={tableName} className="border border-border rounded-lg overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 bg-muted cursor-pointer"
              onClick={() => toggleTable(tableName)}
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium">{tableName}</span>
                <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full">
                  {rels.length} {rels.length === 1 ? 'relationship' : 'relationships'}
                </span>
              </div>
              {expandedTables[tableName] ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            
            {expandedTables[tableName] && (
              <div className="p-4 space-y-4 animate-slide-down">
                {rels.map((rel, index) => (
                  <div 
                    key={index} 
                    className="bg-card p-4 rounded-lg border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{rel.FromTableName}</p>
                      <p className="text-xs text-muted-foreground">{rel.FromColumn || 'Unknown column'}</p>
                    </div>
                    
                    <div className="flex items-center px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {rel.cardinality || 'Unknown cardinality'}
                    </div>
                    
                    <div className="flex-1 text-right">
                      <p className="text-sm font-medium">{rel.ToTableName}</p>
                      <p className="text-xs text-muted-foreground">{rel.ToColumn || 'Unknown column'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelationshipVisualizer;
