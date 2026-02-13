import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import FinOps from './components/FinOps';
import SecOps from './components/SecOps';
import ChatInterface from './components/ChatInterface';
import Approvals from './components/Approvals';
import Welcome from './components/Welcome';
import Introduction from './components/Introduction';

type Phase = 'welcome' | 'intro' | 'app';

const App: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('welcome');
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

  if (phase === 'welcome') {
    return <Welcome onNext={() => setPhase('intro')} />;
  }

  if (phase === 'intro') {
    return <Introduction onStart={() => setPhase('app')} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;