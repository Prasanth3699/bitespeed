import { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Controls,
  MiniMap,
} from '@xyflow/react';
import type { Connection, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TextNode from './TextNode.tsx';
import SettingsPanel from './SettingsPanel.tsx';
import NodesPanel from './NodesPanel.tsx';

// Main component for building and managing flow diagrams
const FlowBuilder = () => {
  // Reference to the wrapper div for handling drag and drop operations
  const reactFlowWrapper = useRef(null);

  // Custom type definition for nodes that can have a message property
  interface CustomNode extends Node {
    data: {
      message?: string;
      [key: string]: unknown;
    };
  }

  // State management for nodes - stores all nodes in the flow
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>([]);
  
  // State management for edges - stores connections between nodes
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  
  // Track which node is currently selected
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // Controls visibility of the settings panel
  const [showSettings, setShowSettings] = useState(false);
  
  // State for displaying save operation feedback
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  // Utility for converting screen coordinates to flow positions
  const { screenToFlowPosition } = useReactFlow();

  // Register available node types in the flow
  const nodeTypes = {
    textNode: TextNode,
  };

  // Counter to ensure unique IDs for new nodes
  let dragCounter = 0;

  // Handles creating new connections between nodes
  const onConnect = useCallback(
    (params: Connection) => {
      // Prevent multiple edges from the same source/handle
      const hasExistingEdge = edges.some(edge =>
        edge.source === params.source && edge.sourceHandle === params.sourceHandle
      );
      
      if (hasExistingEdge) {
        return; 
      }
      
      setEdges((eds) => addEdge(params, eds));
    },
    [edges, setEdges]
  );

  // Handle node selection and show settings
  const onNodeClick = useCallback(( node: Node) => {
    setSelectedNodeId(node.id);
    setShowSettings(true);
    setSaveError('');
    setSaveSuccess('');
  }, []);

  // Clear selection when clicking on empty canvas
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setShowSettings(false);
    setSaveError('');
    setSaveSuccess('');
  }, []);

  // Setup drag operation for new nodes
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Handle dropping new nodes onto the canvas
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      // Get drop position in flow coordinates
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Set default data based on node type
      const getDefaultNodeData = (nodeType: string) => {
        switch (nodeType) {
          case 'textNode':
            return { message: `test message ${nodes.length + 1}` };
          default:
            return {};
        }
      };

      // Create new node with unique ID
      const newNode = {
        id: `${type}-${Date.now()}-${++dragCounter}`,
        type,
        position,
        data: getDefaultNodeData(type),
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes.length, screenToFlowPosition, setNodes]
  );

  // Enable drop zone for new nodes
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Update data for a specific node
  const updateNodeData = useCallback((nodeId: string, newData: Partial<{ message?: string }>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
  }, [setNodes]);

  // Validate flow structure - ensures only one root node
  const validateFlow = () => {
    if (nodes.length <= 1) {
      return true; 
    }
    const nodesWithIncomingEdges = new Set(edges.map(edge => edge.target));
    const nodesWithoutTargets = nodes.filter(node => !nodesWithIncomingEdges.has(node.id));
    return nodesWithoutTargets.length <= 1;
  };

  // Handle saving the flow
  const handleSave = () => {
    if (validateFlow()) {
      setSaveError('');
      setSaveSuccess('Flow saved successfully!');
      console.log('Flow saved successfully!', { nodes, edges });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess('');
      }, 3000);
    } else {
      setSaveSuccess('');
      setSaveError('Cannot save Flow');
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setSaveError('');
      }, 5000);
    }
  };

  // Get the currently selected node
  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;

  return (
    <div className="h-screen flex bg-gray-100">
      <div className="flex-1 relative">
        {/* Status messages container */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          {saveError && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-6 py-3 rounded-md text-sm font-medium shadow-md">
              {saveError}
            </div>
          )}
          {saveSuccess && (
            <div className="bg-green-100 border border-green-300 text-green-700 px-6 py-3 rounded-md text-sm font-medium shadow-md">
              {saveSuccess}
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>

        {/* Flow canvas */}
        <div ref={reactFlowWrapper} className="w-full h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
            deleteKeyCode={['Backspace', 'Delete']}
            multiSelectionKeyCode={['Meta', 'Ctrl']}
            selectionOnDrag={true}
            panOnDrag={[1]}
            selectNodesOnDrag={false}
          >
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>

      {/* Right side panel - switches between settings and node palette */}
      {showSettings && selectedNode ? (
        <SettingsPanel
          selectedNode={selectedNode}
          onUpdateNode={updateNodeData}
          onBack={() => setShowSettings(false)}
        />
      ) : (
        <NodesPanel onDragStart={onDragStart} />
      )}
    </div>
  );
};

export default FlowBuilder;
