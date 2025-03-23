
import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronUp, ChevronDown } from 'lucide-react';
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
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  // Get unique table names
  const tableNames = Array.from(new Set([
    ...relationships.map(rel => rel.FromTableName),
    ...relationships.map(rel => rel.ToTableName)
  ])).filter(Boolean).sort();
  
  // Get unique cardinality types
  const cardinalityTypes = Array.from(new Set([
    ...relationships.map(rel => rel.cardinality)
  ])).filter(Boolean).sort();
  
  // Filter and sort relationships based on selected filters
  const filteredRelationships = useMemo(() => {
    // First filter the relationships
    let result = relationships.filter(rel => {
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
    
    // Then sort if sorting is configured
    if (sortConfig !== null) {
      result = [...result].sort((a, b) => {
        const key = sortConfig.key as keyof Relationship;
        
        // Handle numeric values (for columns like UsedSize, MissingKeys, etc.)
        if (!isNaN(Number(a[key])) && !isNaN(Number(b[key]))) {
          return sortConfig.direction === 'asc' 
            ? Number(a[key]) - Number(b[key])
            : Number(b[key]) - Number(a[key]);
        }
        
        // Handle string values
        const valueA = a[key]?.toString() || '';
        const valueB = b[key]?.toString() || '';
        
        if (valueA < valueB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [relationships, tableFilters, cardinalityFilters, sortConfig]);

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
  
  // Handle column sort
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      // If already sorted descending, remove sort
      setSortConfig(null);
      return;
    }
    
    setSortConfig({ key, direction });
  };
  
  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-xl font-medium">Relationships</h2>
      <RelationshipVisualizer relationships={relationships} />
      
      <div className="space-y-4 p-2">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => {
              setTableFilters([]);
              setCardinalityFilters([]);
              setSortConfig(null);
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
                  <TableHead 
                    className="whitespace-nowrap cursor-pointer hover:bg-muted/60"
                    onClick={() => handleSort('FromTableName')}
                  >
                    <div className="flex items-center gap-1">
                      FromTableName
                      {sortConfig?.key === 'FromTableName' && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="h-3 w-3" /> 
                          : <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="whitespace-nowrap cursor-pointer hover:bg-muted/60"
                    onClick={() => handleSort('FromFullColumnName')}
                  >
                    <div className="flex items-center gap-1">
                      FromFullColumnName
                      {sortConfig?.key === 'FromFullColumnName' && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="h-3 w-3" /> 
                          : <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="whitespace-nowrap cursor-pointer hover:bg-muted/60"
                    onClick={() => handleSort('FromCardinalityType')}
                  >
                    <div className="flex items-center gap-1">
                      FromCardinalityType
                      {sortConfig?.key === 'FromCardinalityType' && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="h-3 w-3" /> 
                          : <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="whitespace-nowrap cursor-pointer hover:bg-muted/60"
                    onClick={() => handleSort('ToTableName')}
                  >
                    <div className="flex items-center gap-1">
                      ToTableName
                      {sortConfig?.key === 'ToTableName' && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="h-3 w-3" /> 
                          : <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="whitespace-nowrap cursor-pointer hover:bg-muted/60"
                    onClick={() => handleSort('ToFullColumnName')}
                  >
                    <div className="flex items-center gap-1">
                      ToFullColumnName
                      {sortConfig?.key === 'ToFullColumnName' && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="h-3 w-3" /> 
                          : <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="whitespace-nowrap cursor-pointer hover:bg-muted/60"
                    onClick={() => handleSort('ToCardinalityType')}
                  >
                    <div className="flex items-center gap-1">
                      ToCardinalityType
                      {sortConfig?.key === 'ToCardinalityType' && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="h-3 w-3" /> 
                          : <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="whitespace-nowrap cursor-pointer hover:bg-muted/60"
                    onClick={() => handleSort('cardinality')}
                  >
                    <div className="flex items-center gap-1">
                      Cardinality
                      {sortConfig?.key === 'cardinality' && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="h-3 w-3" /> 
                          : <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="whitespace-nowrap cursor-pointer hover:bg-muted/60"
                    onClick={() => handleSort('JoinOnDateBehavior')}
                  >
                    <div className="flex items-center gap-1">
                      JoinOnDateBehavior
                      {sortConfig?.key === 'JoinOnDateBehavior' && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="h-3 w-3" /> 
                          : <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="whitespace-nowrap cursor-pointer hover:bg-muted/60"
                    onClick={() => handleSort('CrossFilteringBehavior')}
                  >
                    <div className="flex items-center gap-1">
                      CrossFilteringBehavior
                      {sortConfig?.key === 'CrossFilteringBehavior' && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="h-3 w-3" /> 
                          : <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="whitespace-nowrap cursor-pointer hover:bg-muted/60"
                    onClick={() => handleSort('RelationshipType')}
                  >
                    <div className="flex items-center gap-1">
                      RelationshipType
                      {sortConfig?.key === 'RelationshipType' && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="h-3 w-3" /> 
                          : <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="whitespace-nowrap cursor-pointer hover:bg-muted/60"
                    onClick={() => handleSort('IsActive')}
                  >
                    <div className="flex items-center gap-1">
                      IsActive
                      {sortConfig?.key === 'IsActive' && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="h-3 w-3" /> 
                          : <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="whitespace-nowrap cursor-pointer hover:bg-muted/60"
                    onClick={() => handleSort('SecurityFilteringBehavior')}
                  >
                    <div className="flex items-center gap-1">
                      SecurityFilteringBehavior
                      {sortConfig?.key === 'SecurityFilteringBehavior' && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="h-3 w-3" /> 
                          : <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="whitespace-nowrap cursor-pointer hover:bg-muted/60"
                    onClick={() => handleSort('UsedSizeFrom')}
                  >
                    <div className="flex items-center gap-1">
                      UsedSizeFrom
                      {sortConfig?.key === 'UsedSizeFrom' && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="h-3 w-3" /> 
                          : <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="whitespace-nowrap cursor-pointer hover:bg-muted/60"
                    onClick={() => handleSort('UsedSize')}
                  >
                    <div className="flex items-center gap-1">
                      UsedSize
                      {sortConfig?.key === 'UsedSize' && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="h-3 w-3" /> 
                          : <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="whitespace-nowrap cursor-pointer hover:bg-muted/60"
                    onClick={() => handleSort('MissingKeys')}
                  >
                    <div className="flex items-center gap-1">
                      MissingKeys
                      {sortConfig?.key === 'MissingKeys' && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="h-3 w-3" /> 
                          : <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="whitespace-nowrap cursor-pointer hover:bg-muted/60"
                    onClick={() => handleSort('InvalidRows')}
                  >
                    <div className="flex items-center gap-1">
                      InvalidRows
                      {sortConfig?.key === 'InvalidRows' && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="h-3 w-3" /> 
                          : <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
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
