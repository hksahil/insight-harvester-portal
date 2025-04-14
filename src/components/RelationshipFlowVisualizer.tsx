
import React, { useEffect, useMemo } from 'react';
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
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Info } from 'lucide-react';
import { Relationship } from '@/services/VpaxProcessor';

interface FlowNode extends Node {
  data: {
    label: string;
    isFactTable?: boolean;
  };
}

interface FlowEdge extends Edge {
  data?: {
    fromTable: string;
    toTable: string;
    fromColumn?: string;
    toColumn?: string;
    cardinality?: string;
  };
}

interface RelationshipFlowVisualizerProps {
  relationships: Relationship[];
}

const RelationshipFlowVisualizer: React.FC<RelationshipFlowVisualizerProps> = ({ relationships }) => {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const tableNodes = new Map<string, FlowNode>();
    const relationshipEdges: FlowEdge[] = [];
    
    // First, identify all tables
    const allTables = new Set<string>();
    const tableConnections = new Map<string, number>();
    
    relationships.forEach(rel => {
      allTables.add(rel.FromTableName);
      allTables.add(rel.ToTableName);
      
      // Count connections to identify potential fact tables
      tableConnections.set(rel.FromTableName, (tableConnections.get(rel.FromTableName) || 0) + 1);
      tableConnections.set(rel.ToTableName, (tableConnections.get(rel.ToTableName) || 0) + 1);
    });
    
    // Find the table with the most connections (likely the fact table)
    let factTable = '';
    let maxConnections = 0;
    
    tableConnections.forEach((count, table) => {
      if (count > maxConnections) {
        maxConnections = count;
        factTable = table;
      }
    });
    
    // Create nodes for each table
    const circleRadius = 300;
    const angelStep = (2 * Math.PI) / (Math.max(allTables.size - 1, 1));
    let currentAngle = 0;
    let dimTableCount = 0;
    
    allTables.forEach(tableName => {
      const isFactTable = tableName === factTable;
      
      // Place fact table in the center, dimension tables in a circle around it
      let position = { x: 0, y: 0 };
      
      if (!isFactTable) {
        position = {
          x: circleRadius * Math.cos(currentAngle) + 450,
          y: circleRadius * Math.sin(currentAngle) + 300,
        };
        currentAngle += angelStep;
        dimTableCount++;
      } else {
        // Place fact table in the center
        position = { x: 450, y: 300 };
      }
      
      tableNodes.set(tableName, {
        id: tableName,
        data: { 
          label: tableName,
          isFactTable 
        },
        position,
        style: {
          background: '#EFF6FF', // All nodes are the same blue-ish color now
          border: '2px solid #3B82F6',
          borderRadius: '8px',
          padding: '15px',
          width: isFactTable ? 180 : 150,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });
    });
    
    // Create edges for each relationship - without arrows
    relationships.forEach((rel, index) => {
      relationshipEdges.push({
        id: `edge-${index}`,
        source: rel.FromTableName,
        target: rel.ToTableName,
        animated: false,
        style: { stroke: '#707070', strokeWidth: 2 },
        // Removed markerEnd to remove the arrow
        label: rel.cardinality,
        data: {
          fromTable: rel.FromTableName,
          toTable: rel.ToTableName,
          fromColumn: rel.FromColumn,
          toColumn: rel.ToColumn,
          cardinality: rel.cardinality,
        },
        labelBgStyle: { fill: '#F9FAFB' },
        labelStyle: { fill: '#111827', fontWeight: 500 },
      });
    });
    
    return {
      nodes: Array.from(tableNodes.values()),
      edges: relationshipEdges,
    };
  }, [relationships]);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedEdge, setSelectedEdge] = React.useState<FlowEdge | null>(null);
  
  useEffect(() => {
    // Update nodes and edges when relationships change
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);
  
  const onConnect = React.useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  
  const onEdgeClick = React.useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge as FlowEdge);
  }, []);
  
  return (
    <div className="space-y-8">
      <div style={{ width: '1200px', height: '800px', background: 'white', border: '1px solid #e5e7eb' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
          fitView
          attributionPosition="bottom-right"
          nodesDraggable={true}
        >
          <Controls />
          <MiniMap 
            nodeColor={() => '#3B82F6'} 
            maskColor="rgba(255, 255, 255, 0.5)"
            position="bottom-right" 
          />
          <Background color="#E5E7EB" gap={16} />
        </ReactFlow>
      </div>
      
      {selectedEdge && (
        <div className="p-4 border border-border rounded-lg bg-card animate-fade-in space-y-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            <h3 className="text-base font-semibold">Relationship Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-md">
              <div className="font-medium">{selectedEdge.data?.fromTable}</div>
              <div className="text-sm text-muted-foreground">
                {selectedEdge.data?.fromColumn || 'Unknown column'}
              </div>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-md">
              <div className="font-medium">{selectedEdge.data?.toTable}</div>
              <div className="text-sm text-muted-foreground">
                {selectedEdge.data?.toColumn || 'Unknown column'}
              </div>
            </div>
          </div>
          
          <div className="text-sm text-center">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full">
              {selectedEdge.data?.cardinality || 'Unknown cardinality'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelationshipFlowVisualizer;
