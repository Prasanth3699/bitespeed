import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

// Define the structure for node data
// Currently only handles message property, but can be extended
interface NodeData {
  message?: string;
}

// Basic node structure combining ID and data
interface Node {
  id: string;
  data: NodeData;
}

// Props needed for the settings panel to work
interface SettingsPanelProps {
  selectedNode: Node | null;        // Currently selected node to edit
  onUpdateNode: (id: string, data: NodeData) => void;  // Function to update node data
  onBack: () => void;              // Handler for going back to nodes panel
}

// Component for editing node properties
// Shows up when a node is selected in the flow
const SettingsPanel = ({ selectedNode, onUpdateNode, onBack }: SettingsPanelProps) => {
  // Track the message content locally
  // Initialize with selected node's message or empty string
  const [message, setMessage] = useState(selectedNode?.data?.message || '');

  // Handle message updates in textarea
  // Updates both local state and node data
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    
    // Only update if we have a selected node
    if (selectedNode) {
      onUpdateNode(selectedNode.id, { message: newMessage });
    }
  };

  // Don't render anything if no node is selected
  if (!selectedNode) return null;

  return (
    // Settings panel container - matches width of nodes panel
    <div className="w-64 bg-white border-l-2 border-gray-300 p-4">
      {/* Header with back button and title */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h3 className="text-lg font-semibold text-gray-800">Message</h3>
      </div>
      
      {/* Settings form content */}
      <div className="space-y-4">
        {/* Message input section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Text
          </label>
          {/* Textarea for message content
              Includes proper styling and focus states */}
          <textarea
            value={message}
            onChange={handleMessageChange}
            placeholder="Enter your message..."
            className="w-full p-3 border-2 border-gray-300 rounded-md resize-none h-24 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;