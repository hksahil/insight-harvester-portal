
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Relationship } from '@/services/VpaxProcessor';
import RelationshipVisualizer from './RelationshipVisualizer';

interface RelationshipsTabProps {
  relationships: Relationship[];
}

const RelationshipsTab: React.FC<RelationshipsTabProps> = ({ relationships }) => {
  const [tableFilters, setTableFilters] = useState<string[]>([]);
  const [cardinalityFilters, setCardinalityFilters] = useState<string[]>([]);
  const [showTableDropdown, setShowTableDropdown] = useState(false);
  const [showCardinalityDropdown, setShowCardinalityDropdown] = useState(false);
  
  // Get unique table names
  const tableNames = Array.from(new Set([
    ...relationships.map(rel => rel.FromTableName),
    ...relationships.map(rel => rel.ToTableName)
  ])).filter(Boolean).sort();
  
  // Get unique cardinality types
  const cardinalityTypes = Array.from(new Set([
    ...relationships.map(rel => rel.cardinality)
  ])).filter(Boolean).sort();
  
  // Filter relationships based on selected filters
  const filteredRelationships = relationships.filter(rel => {
    // Apply table filter
    if (tableFilters.length > 0) {
      if (!tableFilters.some(table => rel.FromTableName === table || rel.ToTableName === table)) {
        return false;
      }
    }
    
    // Apply cardinality filter
    if (cardinalityFilters.length > 0) {
      if (!cardinalityFilters.includes(rel.cardinality)) {
        return false;
      }
    }
    
    return true;
  });

  const toggleTableFilter = (tableName: string) => {
    if (tableFilters.includes(tableName)) {
      setTableFilters(tableFilters.filter(t => t !== tableName));
    } else {
      setTableFilters([...tableFilters, tableName]);
    }
  };

  const toggleCardinalityFilter = (cardinality: string) => {
    if (cardinalityFilters.includes(cardinality)) {
      setCardinalityFilters(cardinalityFilters.filter(c => c !== cardinality));
    } else {
      setCardinalityFilters([...cardinalityFilters, cardinality]);
    }
  };
  
  return (
    <div className="animate-fade-in space-y-6">
      <RelationshipVisualizer relationships={relationships} />
      
      <div className="space-y-4 p-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Relationships</h2>
          <button 
            onClick={() => {
              setTableFilters([]);
              setCardinalityFilters([]);
            }} 
            className="text-sm text-primary hover:underline"
          >
            Reset filters
          </button>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center pb-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            
            {/* Table filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowTableDropdown(!showTableDropdown);
                  setShowCardinalityDropdown(false);
                }}
                className="bg-background border border-input rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all flex items-center justify-between gap-2"
              >
                <span>Table</span>
                <span className="text-xs text-muted-foreground">
                  {tableFilters.length ? `(${tableFilters.length})` : '(All)'}
                </span>
              </button>
              
              {showTableDropdown && (
                <div className="absolute z-50 mt-1 w-64 max-h-60 overflow-y-auto bg-background border border-input rounded-md shadow-lg">
                  <div className="p-2 border-b border-border">
                    <Label className="text-xs font-medium text-muted-foreground">Select Tables</Label>
                  </div>
                  <div className="p-2 space-y-1">
                    {tableNames.map((name) => (
                      <div key={name} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`table-${name}`} 
                          checked={tableFilters.includes(name)}
                          onCheckedChange={() => toggleTableFilter(name)}
                        />
                        <Label 
                          htmlFor={`table-${name}`}
                          className="text-sm cursor-pointer"
                        >
                          {name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Cardinality filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCardinalityDropdown(!showCardinalityDropdown);
                  setShowTableDropdown(false);
                }}
                className="bg-background border border-input rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all flex items-center justify-between gap-2"
              >
                <span>Cardinality</span>
                <span className="text-xs text-muted-foreground">
                  {cardinalityFilters.length ? `(${cardinalityFilters.length})` : '(All)'}
                </span>
              </button>
              
              {showCardinalityDropdown && (
                <div className="absolute z-50 mt-1 w-64 max-h-60 overflow-y-auto bg-background border border-input rounded-md shadow-lg">
                  <div className="p-2 border-b border-border">
                    <Label className="text-xs font-medium text-muted-foreground">Select Cardinalities</Label>
                  </div>
                  <div className="p-2 space-y-1">
                    {cardinalityTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`cardinality-${type}`}
                          checked={cardinalityFilters.includes(type)}
                          onCheckedChange={() => toggleCardinalityFilter(type)}
                        />
                        <Label 
                          htmlFor={`cardinality-${type}`}
                          className="text-sm cursor-pointer"
                        >
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>FromTableName</TableHead>
                  <TableHead>FromFullColumnName</TableHead>
                  <TableHead>FromCardinalityType</TableHead>
                  <TableHead>ToTableName</TableHead>
                  <TableHead>ToFullColumnName</TableHead>
                  <TableHead>ToCardinalityType</TableHead>
                  <TableHead>Cardinality</TableHead>
                  <TableHead>JoinOnDateBehavior</TableHead>
                  <TableHead>CrossFilteringBehavior</TableHead>
                  <TableHead>RelationshipType</TableHead>
                  <TableHead>IsActive</TableHead>
                  <TableHead>SecurityFilteringBehavior</TableHead>
                  <TableHead>UsedSizeFrom</TableHead>
                  <TableHead>UsedSize</TableHead>
                  <TableHead>MissingKeys</TableHead>
                  <TableHead>InvalidRows</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRelationships.length > 0 ? filteredRelationships.map((rel, index) => (
                  <TableRow key={index}>
                    <TableCell>{rel.FromTableName || '-'}</TableCell>
                    <TableCell>{rel.FromFullColumnName || '-'}</TableCell>
                    <TableCell>{rel.FromCardinalityType || '-'}</TableCell>
                    <TableCell>{rel.ToTableName || '-'}</TableCell>
                    <TableCell>{rel.ToFullColumnName || '-'}</TableCell>
                    <TableCell>{rel.ToCardinalityType || '-'}</TableCell>
                    <TableCell className="font-medium text-primary">{rel.cardinality || '-'}</TableCell>
                    <TableCell>{rel.JoinOnDateBehavior || '-'}</TableCell>
                    <TableCell>{rel.CrossFilteringBehavior || '-'}</TableCell>
                    <TableCell>{rel.RelationshipType || '-'}</TableCell>
                    <TableCell>{rel.IsActive?.toString() || '-'}</TableCell>
                    <TableCell>{rel.SecurityFilteringBehavior || '-'}</TableCell>
                    <TableCell>{rel.UsedSizeFrom || '-'}</TableCell>
                    <TableCell>{rel.UsedSize || '-'}</TableCell>
                    <TableCell>{rel.MissingKeys || '-'}</TableCell>
                    <TableCell>{rel.InvalidRows || '-'}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={16} className="text-center py-6 text-muted-foreground">
                      No relationships found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelationshipsTab;
