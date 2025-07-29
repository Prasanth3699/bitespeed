import {
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { IoLogoWhatsapp } from "react-icons/io";
import { BiMessageRoundedDetail } from "react-icons/bi";

// Define the expected props for our text node component
interface TextNodeProps {
  data: {
    message?: string;    // The message content to display
  };
  selected?: boolean;    // Whether this node is currently selected
}

// Custom node component for displaying messages in the flow
// Includes connection handles and styling based on selection state
const TextNode = ({ data, selected }: TextNodeProps) => {
  return (
    // Main node container with dynamic styling based on selection state
    // Uses a combination of border and shadow effects for visual feedback
    <div className={`bg-white rounded-sm min-w-[240px] overflow-visible transition-all relative ${
      selected ? 'border-2 border-blue-500' : 'border-2 border-gray-200'
    }`} style={{ 
      // Complex shadow effects for depth and emphasis
      boxShadow: selected 
        ? '0 8px 25px rgba(59, 130, 246, 0.15), 0 4px 15px rgba(0, 0, 0, 0.1)' 
        : '0 4px 15px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
      filter: selected 
        ? 'drop-shadow(0 4px 12px rgba(59, 130, 246, 0.2))' 
        : 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1))'
    }}>
      {/* Input connection point on the left side 
          Handle component from ReactFlow for node connections */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ 
          // Precise positioning and styling for the connection point
          left: -6,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 12,
          height: 12,
          background: selected ? '#3b82f6' : '#6b7280',
          border: '2px solid white',
          borderRadius: '50%',
          zIndex: 10
        }}
      />
      
      {/* Node header with icons and type indicator
          Changes color intensity based on selection */}
      <div className={`px-4 py-2 flex items-center justify-between transition-colors ${
        selected ? 'bg-teal-300' : 'bg-teal-200'
      }`}>
        {/* Left side with message icon and label */}
        <div className="flex items-center gap-2">
          <BiMessageRoundedDetail className="w-3 h-3 text-gray-600" />
          <span className="text-sm font-medium text-gray-800">Send Message</span>
        </div>
        {/* WhatsApp icon in white circle
            Visual indicator for message platform */}
        <div className="bg-white rounded-full p-1 flex items-center justify-center">
          <IoLogoWhatsapp className={`w-3 h-3 transition-colors ${
            selected ? 'text-green-600' : 'text-green-500'
          }`} />
        </div>
      </div>
      
      {/* Message content area
          Shows actual message or placeholder */}
      <div className="px-4 py-3 bg-white">
        <div className="text-sm text-gray-700">
          {data.message || 'Enter your message...'}
        </div>
      </div>
      
      {/* Output connection point on the right side
          Similar styling to input handle but for outgoing connections */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ 
          right: -6,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 12,
          height: 12,
          background: selected ? '#3b82f6' : '#6b7280',
          border: '2px solid white',
          borderRadius: '50%',
          zIndex: 10
        }}
      />
    </div>
  );
};

export default TextNode;