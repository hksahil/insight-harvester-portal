
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Relationship } from '@/services/VpaxProcessor';

interface RelationshipsTabProps {
  relationships: Relationship[];
}

const RelationshipsTab: React.FC<RelationshipsTabProps> = ({ relationships }) => {
  const [tableFilter, setTableFilter] = useState<string>("");
  const [cardinalityFilter, setCardinalityFilter] = useState<string>("");
  
  // Get unique table names
  const tableNames = Array.from(new Set([
    ...relationships.map(rel => rel.FromTableName),
    ...relationships.map(rel => rel.ToTableName)
  ])).filter(Boolean).sort();
  
  // Get unique cardinality types
  const cardinalityTypes = Array.from(new Set([
    ...relationships.map(rel => rel.FromCardinalityType),
    ...relationships.map(rel => rel.ToCardinalityType)
  ])).filter(Boolean).sort();
  
  // Filter relationships based on selected filters
  const filteredRelationships = relationships.filter(rel => {
    // Apply table filter
    if (tableFilter && tableFilter !== "All") {
      if (rel.FromTableName !== tableFilter && rel.ToTableName !== tableFilter) {
        return false;
      }
    }
    
    // Apply cardinality filter
    if (cardinalityFilter && cardinalityFilter !== "All") {
      if (rel.FromCardinalityType !== cardinalityFilter && rel.ToCardinalityType !== cardinalityFilter) {
        return false;
      }
    }
    
    return true;
  });
  
  return (
    <div className="animate-fade-in space-y-4 p-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Relationships</h2>
        <button 
          onClick={() => {
            setTableFilter("");
            setCardinalityFilter("");
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
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">Table:</span>
            <select
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value)}
              className="bg-background border border-input rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            >
              <option value="">All Tables</option>
              {tableNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Cardinality filter */}
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">Cardinality:</span>
            <select
              value={cardinalityFilter}
              onChange={(e) => setCardinalityFilter(e.target.value)}
              className="bg-background border border-input rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            >
              <option value="">All Cardinalities</option>
              {cardinalityTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
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
                  <TableCell colSpan={15} className="text-center py-6 text-muted-foreground">
                    No relationships found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default RelationshipsTab;
