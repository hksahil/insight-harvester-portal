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
  Handle,
  Position,
  useReactFlow,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ArrowUpRight, Code, Database, Eye, EyeOff, Filter, Search } from 'lucide-react';
import { MeasureData, ColumnData } from '@/services/VpaxProcessor';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import UseCaseHelper from './UseCaseHelper';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import * as dagre from 'dagre';

interface MeasureVisualizerProps {
  measureData: MeasureData[];
  columnData: ColumnData[];
}

// Custom node for measures
const MeasureNode = ({ data }: { data: any }) => (
  <div className="p-3 rounded-lg border border-primary/50 bg-primary/5 w-full max-w-xs">
    <Handle
      type="target"
      position={Position.Left}
      className="w-3 h-3 bg-black rounded-full"
      id={`measure-target-${data.id}`}
    />
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
    <Handle
      type="source"
      position={Position.Right}
      className="w-3 h-3 bg-black rounded-full"
      id={`measure-source-${data.id}`}
    />
  </div>
);

// Custom node for columns
const ColumnNode = ({ data }: { data: any }) => (
  <div className="p-3 rounded-lg border border-green-500/50 bg-green-500/5 w-full max-w-xs">
    <Handle
      type="target"
      position={Position.Left}
      className="w-3 h-3 bg-black rounded-full"
      id={`column-target-${data.id}`}
    />
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
    <Handle
      type="source"
      position={Position.Right}
      className="w-3 h-3 bg-black rounded-full"
      id={`column-source-${data.id}`}
    />
  </div>
);

// Define node types for the flow
const nodeTypes = {
  measure: MeasureNode,
  column: ColumnNode,
};

// Setup the dagre graph
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// Helper function to layout the graph using dagre
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const nodeWidth = 250;
  const nodeHeight = 120;
  
  dagreGraph.setGraph({ rankdir: direction });
  
  // Clear the graph before adding nodes
  dagreGraph.nodes().forEach(n => dagreGraph.removeNode(n));
  
  // Add nodes to the graph
  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });
  
  // Add edges to the graph
  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });
  
  // Calculate the layout using dagre
  dagre.layout(dagreGraph);
  
  // Get the positions from dagre
  const layoutedNodes = nodes.map(node => {
    const dagreNode = dagreGraph.node(node.id);
    
    // Set the new position from dagre
    return {
      ...node,
      position: {
        x: dagreNode.x - nodeWidth / 2,
        y: dagreNode.y - nodeHeight / 2,
      },
    };
  });
  
  return { nodes: layoutedNodes, edges };
};

// The inner component that uses ReactFlow hooks
const MeasureVisualizerInner: React.FC<MeasureVisualizerProps> = ({ measureData, columnData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState<string>('All');
  const [hideDisconnectedColumns, setHideDisconnectedColumns] = useState(false);
  const [layoutDirection, setLayoutDirection] = useState('TB');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowInstance = useReactFlow();

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

  // Improved function to extract column references from a measure expression
  const extractColumnReferences = useCallback((expression: string): string[] => {
    if (!expression) return [];
    
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

  // Improved helper function to find a column by name with exact matching
  const findColumnByName = useCallback((columnName: string, tableName?: string) => {
    let column = columnData.find(col => 
      col.ColumnName === columnName && 
      (!tableName || col.TableName === tableName)
    );
    
    if (!column) {
      column = columnData.find(col => 
        col.ColumnName === columnName ||
        col.FullColumnName === `[${columnName}]`
      );
    }
    
    return column;
  }, [columnData]);

  // Helper function to check if a measure is referenced in another measure's expression
  const isMeasureReferenced = useCallback((measure: MeasureData, expression?: string): boolean => {
    if (!expression) return false;
    
    const patterns = [
      `${measure.TableName}[${measure.MeasureName}]`,
      `[${measure.MeasureName}]`,
      measure.FullMeasureName
    ].filter(Boolean);
    
    return patterns.some(pattern => {
      if (!pattern) return false;
      return expression.includes(pattern);
    });
  }, []);

  // Generate nodes and edges based on measures and columns
  const generateGraph = useCallback(() => {
    console.log("Generating graph with search term:", searchTerm, "and selected table:", selectedTable);
    console.log("Hide disconnected columns:", hideDisconnectedColumns);
    
    const filteredMeasures = measureData.filter(measure => {
      const matchesSearch = searchTerm === '' || 
        measure.MeasureName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (measure.MeasureExpression && measure.MeasureExpression.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesTable = selectedTable === 'All' || measure.TableName === selectedTable;
      
      return matchesSearch && matchesTable;
    });

    console.log("Filtered measures:", filteredMeasures.length);
    
    const referencedColumnIds = new Set<string>();
    
    const measureToColumnConnections: {measureId: string, columnId: string}[] = [];
    
    filteredMeasures.forEach(measure => {
      if (!measure.MeasureExpression) return;
      
      const columnRefs = extractColumnReferences(measure.MeasureExpression);
      console.log(`Measure ${measure.MeasureName} references columns:`, columnRefs);
      
      columnRefs.forEach(columnRef => {
        const column = findColumnByName(columnRef, measure.TableName) || 
                       findColumnByName(columnRef);
        
        if (column) {
          const measureId = `measure-${measure.TableName}-${measure.MeasureName}`;
          const columnId = `column-${column.TableName}-${column.ColumnName}`;
          
          referencedColumnIds.add(columnId);
          measureToColumnConnections.push({measureId, columnId});
          
          console.log(`Found reference: Column ${columnRef} (${columnId}) is used by measure ${measure.MeasureName} (${measureId})`);
        } else {
          console.log(`Could not find column for reference: ${columnRef}`);
        }
      });
    });
    
    const measureToMeasureConnections: {sourceMeasureId: string, targetMeasureId: string}[] = [];
    
    filteredMeasures.forEach(sourceMeasure => {
      filteredMeasures.forEach(targetMeasure => {
        if (sourceMeasure.MeasureName === targetMeasure.MeasureName) return;
        
        if (targetMeasure.MeasureExpression && 
            isMeasureReferenced(sourceMeasure, targetMeasure.MeasureExpression)) {
          
          const sourceMeasureId = `measure-${sourceMeasure.TableName}-${sourceMeasure.MeasureName}`;
          const targetMeasureId = `measure-${targetMeasure.TableName}-${targetMeasure.MeasureName}`;
          
          measureToMeasureConnections.push({
            sourceMeasureId,
            targetMeasureId
          });
        }
      });
    });
    
    console.log("Referenced column IDs:", Array.from(referencedColumnIds));
    console.log("Measure-to-Column connections:", measureToColumnConnections);
    console.log("Measure-to-Measure connections:", measureToMeasureConnections);
    
    const filteredColumns = columnData.filter(column => {
      const matchesSearch = searchTerm === '' || 
        column.ColumnName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTable = selectedTable === 'All' || column.TableName === selectedTable;
      
      const columnId = `column-${column.TableName}-${column.ColumnName}`;
      const isReferenced = referencedColumnIds.has(columnId);
      
      if (hideDisconnectedColumns && !isReferenced) {
        return false;
      }
      
      return matchesSearch && matchesTable;
    });

    console.log("Final filtered columns:", filteredColumns.length);
    
    const measureNodes: Node[] = filteredMeasures.map((measure) => {
      const id = `measure-${measure.TableName}-${measure.MeasureName}`;
      return {
        id,
        type: 'measure',
        position: { x: 0, y: 0 },
        data: {
          id,
          label: measure.MeasureName,
          tableName: measure.TableName,
          expression: measure.MeasureExpression,
          fullName: measure.FullMeasureName || `${measure.TableName}[${measure.MeasureName}]`
        }
      };
    });

    const columnNodes: Node[] = filteredColumns.map((column) => {
      const id = `column-${column.TableName}-${column.ColumnName}`;
      return {
        id,
        type: 'column',
        position: { x: 0, y: 0 },
        data: {
          id,
          label: column.ColumnName,
          tableName: column.TableName,
          dataType: column.DataType,
          fullName: column.FullColumnName || `${column.TableName}[${column.ColumnName}]`
        }
      };
    });

    const columnEdges: Edge[] = measureToColumnConnections.map(({measureId, columnId}, index) => {
      return {
        id: `edge-${columnId}-to-${measureId}-${index}`,
        source: columnId,
        sourceHandle: `column-source-${columnId}`,
        target: measureId,
        targetHandle: `measure-target-${measureId}`,
        animated: false,
        type: 'smoothstep',
        style: { stroke: '#000000', strokeWidth: 2 }
      };
    });
    
    const measureEdges: Edge[] = measureToMeasureConnections.map(({sourceMeasureId, targetMeasureId}, index) => {
      return {
        id: `edge-${sourceMeasureId}-to-${targetMeasureId}-${index}`,
        source: sourceMeasureId,
        sourceHandle: `measure-source-${sourceMeasureId}`,
        target: targetMeasureId,
        targetHandle: `measure-target-${targetMeasureId}`,
        animated: true,
        type: 'smoothstep',
        style: { stroke: '#000000', strokeWidth: 2 }
      };
    });

    const newNodes = [...measureNodes, ...columnNodes];
    const newEdges = [...columnEdges, ...measureEdges];
    
    const { nodes: layoutedNodes } = getLayoutedElements(
      newNodes,
      newEdges,
      layoutDirection
    );
    
    console.log("Total nodes created:", layoutedNodes.length);
    console.log("Column edges created:", columnEdges.length);
    console.log("Measure edges created:", measureEdges.length);
    
    setNodes(layoutedNodes);
    setEdges(newEdges);
    
    setTimeout(() => {
      if (reactFlowInstance) {
        reactFlowInstance.fitView({ padding: 0.2 });
      }
    }, 100);
  }, [
    measureData, 
    columnData, 
    searchTerm, 
    selectedTable, 
    hideDisconnectedColumns,
    layoutDirection,
    extractColumnReferences, 
    findColumnByName, 
    isMeasureReferenced, 
    setNodes, 
    setEdges,
    reactFlowInstance
  ]);

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#000000', strokeWidth: 2 }
    }, eds)),
    [setEdges]
  );

  // Generate the graph when inputs change
  useEffect(() => {
    generateGraph();
  }, [generateGraph]);

  // Function to re-layout the graph with a new direction
  const onChangeLayoutDirection = (newDirection: string) => {
    setLayoutDirection(newDirection);
    generateGraph();
  };

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
          <Select
            value={selectedTable}
            onValueChange={setSelectedTable}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a table" />
            </SelectTrigger>
            <SelectContent>
              {tables.map((table) => (
                <SelectItem key={table} value={table}>
                  {table}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-auto">
          <Select
            value={layoutDirection}
            onValueChange={onChangeLayoutDirection}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select layout direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TB">Top to Bottom</SelectItem>
              <SelectItem value="BT">Bottom to Top</SelectItem>
              <SelectItem value="LR">Left to Right</SelectItem>
              <SelectItem value="RL">Right to Left</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="hideDisconnected" 
            checked={hideDisconnectedColumns}
            onCheckedChange={(checked) => {
              if (typeof checked === 'boolean') {
                setHideDisconnectedColumns(checked);
              }
            }}
          />
          <label
            htmlFor="hideDisconnected"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Hide disconnected columns
          </label>
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
            <MiniMap 
              nodeStrokeColor={(n) => {
                if (n.type === 'measure') return '#7c3aed';
                return '#10b981';
              }}
              nodeColor={(n) => {
                if (n.type === 'measure') return '#ede9fe';
                return '#d1fae5';
              }}
            />
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
        <div className="flex items-center gap-2">
          {hideDisconnectedColumns ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm">
            {hideDisconnectedColumns ? 'Showing only connected columns' : 'Showing all columns'}
          </span>
        </div>
      </div>
    </div>
  );
};

// The main wrapper component that provides ReactFlowProvider
const MeasureVisualizer: React.FC<MeasureVisualizerProps> = (props) => {
  return (
    <ReactFlowProvider>
      <MeasureVisualizerInner {...props} />
    </ReactFlowProvider>
  );
};

export default MeasureVisualizer;
