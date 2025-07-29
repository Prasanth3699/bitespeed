import {
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import FlowBuilder from './components/FlowBuilder.tsx';

// Main App Component with Provider
const ChatbotFlowBuilderApp = () => {
  return (
    <ReactFlowProvider>
      <FlowBuilder />
    </ReactFlowProvider>
  );
};

export default ChatbotFlowBuilderApp;