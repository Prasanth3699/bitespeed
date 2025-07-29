import { BiMessageRoundedDetail } from "react-icons/bi";

// List of available node types that can be added to the flow
// Each node type has specific properties like icon, label, and category
// Makes it easy to add new node types in the future
const AVAILABLE_NODE_TYPES = [
  {
    type: 'textNode',
    label: 'Message',
    icon: BiMessageRoundedDetail,
    description: 'Send a text message',
    category: 'messaging'
  }
];

// Type definition for a node's properties
// Helps maintain consistency when adding new node types
interface Node {
  type: string;          // Unique identifier for the node type
  label: string;         // Display name shown to users
  icon: React.ComponentType<{ className?: string }>;  // Visual representation
  description: string;   // Tooltip text explaining the node's purpose
  category: string;      // Groups similar nodes together
}

// Props interface for the NodesPanel component
interface NodesPanelProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
  availableNodeTypes?: Node[];  // Optional override for default node types
}

// Component that displays available nodes that can be dragged onto the canvas
const NodesPanel = ({ onDragStart, availableNodeTypes = AVAILABLE_NODE_TYPES }: NodesPanelProps) => {
  return (
    // Right sidebar panel with a clean white background
    <div className="w-64 bg-white border-l-2 border-gray-300 p-4">
      {/* Panel header with title and instructions */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Nodes Panel</h3>
        <p className="text-xs text-gray-500 mt-1">Drag nodes to the canvas</p>
      </div>
      
      {/* Grid of draggable node types */}
      <div className="space-y-3">
        {availableNodeTypes.map((nodeType) => {
          // Get the icon component for the current node type
          const IconComponent = nodeType.icon;
          
          return (
            // Individual node card that can be dragged
            // Uses hover and group animations for better interactivity
            <div
              key={nodeType.type}
              className="flex flex-col items-center justify-center p-6 border-2 border-blue-500 rounded-lg cursor-move hover:bg-blue-50 transition-colors bg-white group"
              draggable
              onDragStart={(event) => onDragStart(event, nodeType.type)}
              title={nodeType.description} // Shows description on hover
            >
              {/* Node icon with hover animation */}
              <IconComponent className="w-6 h-6 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
              {/* Node label */}
              <span className="text-sm font-medium text-blue-500">{nodeType.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NodesPanel;