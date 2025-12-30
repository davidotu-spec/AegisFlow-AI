
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import FinOps from './components/FinOps';
import SecOps from './components/SecOps';
import ChatInterface from './components/ChatInterface';
import Approvals from './components/Approvals';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'finops':
        return <FinOps />;
      case 'secops':
        return <SecOps />;
      case 'approvals':
        return <Approvals />;
      case 'ai':
        return <ChatInterface />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
