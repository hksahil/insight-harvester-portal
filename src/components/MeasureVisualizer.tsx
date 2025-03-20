
import React, { useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ArrowUpRight, Code, Database, Filter, Search } from 'lucide-react';
import { MeasureData, ColumnData } from '@/services/VpaxProcessor';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import UseCaseHelper from './UseCaseHelper';

interface MeasureVisualizerProps {
  measureData: MeasureData[];
  columnData: ColumnData[];
}

// Custom node for measures
const MeasureNode = ({ data }: { data: any }) => (
  <div className="p-3 rounded-lg border border-primary/50 bg-primary/5 w-full max-w-xs">
    <div className="flex items-center gap-2 font-medium text-sm mb-2">
      <ArrowUpRight className="h-4 w-4 text-primary" />
      <span>{data.label}</span>
    </div>
    {data.expression && (
      <div className="text-xs mt-2 p-2 bg-background rounded border border-border overflow-hidden">
        <code className="whitespace-pre-wrap break-all text-xs">{data.expression}</code>
      </div>
    )}
    <div className="text-xs text-muted-foreground mt-2">
      Table: {data.tableName}
    </div>
  </div>
);

// Custom node for columns
const ColumnNode = ({ data }: { data: any }) => (
  <div className="p-3 rounded-lg border border-green-500/50 bg-green-500/5 w-full max-w-xs">
    <div className="flex items-center gap-2 font-medium text-sm">
      <Database className="h-4 w-4 text-green-600" />
      <span>{data.label}</span>
    </div>
    <div className="text-xs text-muted-foreground mt-2">
      Table: {data.tableName}
    </div>
    <div className="text-xs text-muted-foreground">
      Type: {data.dataType}
    </div>
  </div>
);

// Define node types for the flow
const nodeTypes = {
  measure: MeasureNode,
  column: ColumnNode,
};

const MeasureVisualizer: React.FC<MeasureVisualizerProps> = ({ measureData, columnData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState<string>('All');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Extract table names for filtering
  const tables = React.useMemo(() => {
    const allTables = new Set<string>();
    allTables.add('All');
    
    measureData.forEach(measure => {
      if (measure.TableName) allTables.add(measure.TableName);
    });
    
    columnData.forEach(column => {
      if (column.TableName) allTables.add(column.TableName);
    });
    
    return Array.from(allTables);
  }, [measureData, columnData]);

  // Extract column references from a measure expression
  // This is a much more direct approach focusing on square bracket extraction
  const extractColumnReferences = useCallback((expression: string): string[] => {
    if (!expression) return [];
    
    // Pattern: Look for anything within square brackets [...]
    const columnRefs: string[] = [];
    const regex = /\[(.*?)\]/g;
    let match;
    
    while ((match = regex.exec(expression)) !== null) {
      const columnName = match[1].trim();
      if (columnName) {
        columnRefs.push(columnName);
      }
    }
    
    console.log("Extracted column references:", columnRefs);
    return columnRefs;
  }, []);

  // Helper function to find a column by name (checking both FullColumnName and ColumnName)
  const findColumnByName = useCallback((columnName: string) => {
    // Try to find an exact match first
    let column = columnData.find(col => 
      col.ColumnName === columnName || 
      col.FullColumnName === columnName ||
      col.FullColumnName === `[${columnName}]` ||
      col.FullColumnName?.includes(`[${columnName}]`)
    );
    
    // If not found, try more flexible matching
    if (!column) {
      column = columnData.find(col => 
        columnName.includes(col.ColumnName) || 
        (col.FullColumnName && columnName.includes(col.FullColumnName))
      );
    }
    
    return column;
  }, [columnData]);

  // Helper function to check if a measure is referenced in another measure's expression
  const isMeasureReferenced = useCallback((measure: MeasureData, expression?: string): boolean => {
    if (!expression) return false;
    
    // Create different patterns for how the measure might be referenced
    const patterns = [
      `${measure.TableName}[${measure.MeasureName}]`, // Full reference: Table[Measure]
      `[${measure.MeasureName}]`, // Short reference: [Measure]
      measure.FullMeasureName // If available, use the full measure name
    ].filter(Boolean); // Remove empty patterns
    
    // Check if any of the patterns are in the expression
    return patterns.some(pattern => {
      if (!pattern) return false;
      return expression.includes(pattern);
    });
  }, []);

  // Generate nodes and edges based on measures and columns
  const generateGraph = useCallback(() => {
    console.log("Generating graph with search term:", searchTerm, "and selected table:", selectedTable);
    
    const filteredMeasures = measureData.filter(measure => {
      const matchesSearch = searchTerm === '' || 
        measure.MeasureName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (measure.MeasureExpression && measure.MeasureExpression.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesTable = selectedTable === 'All' || measure.TableName === selectedTable;
      
      return matchesSearch && matchesTable;
    });

    console.log("Filtered measures:", filteredMeasures.length);
    
    // Find all columns referenced by our filtered measures
    const referencedColumns = new Map<string, Set<string>>();
    
    filteredMeasures.forEach(measure => {
      if (!measure.MeasureExpression) return;
      
      // Extract column references from the measure expression
      const columnRefs = extractColumnReferences(measure.MeasureExpression);
      
      // For each column reference, find the matching column and add to the map
      columnRefs.forEach(columnRef => {
        const column = findColumnByName(columnRef);
        if (column) {
          const measureId = `measure-${measure.TableName}-${measure.MeasureName}`;
          const columnId = `column-${column.TableName}-${column.ColumnName}`;
          
          if (!referencedColumns.has(columnId)) {
            referencedColumns.set(columnId, new Set());
          }
          
          referencedColumns.get(columnId)?.add(measureId);
          console.log(`Found reference: Column ${columnRef} (${columnId}) is used by measure ${measure.MeasureName} (${measureId})`);
        } else {
          console.log(`Could not find column for reference: ${columnRef}`);
        }
      });
    });
    
    console.log("Referenced columns map size:", referencedColumns.size);
    
    // Filter columns based on search, table selection, and whether they're referenced
    const filteredColumns = columnData.filter(column => {
      const matchesSearch = searchTerm === '' || 
        column.ColumnName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTable = selectedTable === 'All' || column.TableName === selectedTable;
      
      const columnId = `column-${column.TableName}-${column.ColumnName}`;
      const isReferenced = referencedColumns.has(columnId);
      
      // Include the column if it matches search/table filter or if it's referenced by a measure
      return (matchesSearch && matchesTable) || isReferenced;
    });

    console.log("Final filtered columns:", filteredColumns.length);
    
    // Create nodes for measures
    const measureNodes: Node[] = filteredMeasures.map((measure, index) => ({
      id: `measure-${measure.TableName}-${measure.MeasureName}`,
      type: 'measure',
      position: { x: 100 + (index % 3) * 320, y: 100 + Math.floor(index / 3) * 220 },
      data: {
        label: measure.MeasureName,
        tableName: measure.TableName,
        expression: measure.MeasureExpression,
        fullName: measure.FullMeasureName || `${measure.TableName}[${measure.MeasureName}]`
      }
    }));

    // Create nodes for columns
    const columnNodes: Node[] = filteredColumns.map((column, index) => ({
      id: `column-${column.TableName}-${column.ColumnName}`,
      type: 'column',
      position: { x: 100 + (index % 3) * 320, y: 500 + Math.floor(index / 3) * 150 },
      data: {
        label: column.ColumnName,
        tableName: column.TableName,
        dataType: column.DataType,
        fullName: column.FullColumnName || `${column.TableName}[${column.ColumnName}]`
      }
    }));

    const newNodes = [...measureNodes, ...columnNodes];
    console.log("Total nodes created:", newNodes.length);
    
    // Create edges for column-measure dependencies
    const columnEdges: Edge[] = [];
    
    // Use our map of column-to-measure references to create edges
    referencedColumns.forEach((measureIds, columnId) => {
      measureIds.forEach(measureId => {
        const edgeId = `edge-${columnId}-to-${measureId}`;
        console.log(`Creating edge: ${edgeId}`);
        
        columnEdges.push({
          id: edgeId,
          source: columnId,
          target: measureId,
          animated: false,
          style: { stroke: '#000000' } // Black color for edges
        });
      });
    });

    console.log("Column edges created:", columnEdges.length);
    
    // Create edges for measure-measure dependencies
    const measureEdges: Edge[] = [];
    
    filteredMeasures.forEach(sourceMeasure => {
      filteredMeasures.forEach(targetMeasure => {
        // Skip self-references
        if (sourceMeasure.MeasureName === targetMeasure.MeasureName) return;
        
        if (targetMeasure.MeasureExpression && 
            isMeasureReferenced(sourceMeasure, targetMeasure.MeasureExpression)) {
          
          const edgeId = `edge-measure-${sourceMeasure.TableName}-${sourceMeasure.MeasureName}-to-${targetMeasure.TableName}-${targetMeasure.MeasureName}`;
          console.log(`Creating measure-measure edge: ${edgeId}`);
          
          measureEdges.push({
            id: edgeId,
            source: `measure-${sourceMeasure.TableName}-${sourceMeasure.MeasureName}`,
            target: `measure-${targetMeasure.TableName}-${targetMeasure.MeasureName}`,
            animated: true,
            style: { stroke: '#000000' } // Black color for edges
          });
        }
      });
    });

    console.log("Measure edges created:", measureEdges.length);
    
    setNodes(newNodes);
    setEdges([...columnEdges, ...measureEdges]);
  }, [measureData, columnData, searchTerm, selectedTable, extractColumnReferences, findColumnByName, isMeasureReferenced, setNodes, setEdges]);

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Generate the graph when inputs change
  useEffect(() => {
    generateGraph();
  }, [generateGraph]);

  return (
    <div className="animate-fade-in space-y-6 p-2">
      <h2 className="text-xl font-medium">Measure Dependencies</h2>
      
      <UseCaseHelper type="measures" />
      
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search measures or columns..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full sm:w-auto">
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="h-10 w-full min-w-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {tables.map((table) => (
              <option key={table} value={table}>
                {table}
              </option>
            ))}
          </select>
        </div>
        
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={generateGraph}
        >
          <Filter className="h-4 w-4" />
          Apply Filters
        </Button>
      </div>
      
      <div className="border rounded-md h-[600px] bg-muted/10">
        {nodes.length > 0 ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-right"
          >
            <Controls />
            <MiniMap />
            <Background color="#aaa" gap={16} />
          </ReactFlow>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Code className="mx-auto h-12 w-12 text-muted-foreground/60 mb-2" />
              <p>No measures or columns match your criteria</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-primary"></div>
          <span className="text-sm">Measures</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-green-500"></div>
          <span className="text-sm">Columns</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-black"></div>
          <span className="text-sm">Relationships</span>
        </div>
      </div>
    </div>
  );
};

export default MeasureVisualizer;
