import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import Dashboard from './components/Dashboard.tsx';
import FinOps from './components/FinOps.tsx';
import SecOps from './components/SecOps.tsx';
import ChatInterface from './components/ChatInterface.tsx';
import Approvals from './components/Approvals.tsx';
import Welcome from './components/Welcome.tsx';
import Introduction from './components/Introduction.tsx';
import DemoMode from './components/DemoMode.tsx';
import ContactUs from './components/ContactUs.tsx';
import CopyrightPolicy from './components/CopyrightPolicy.tsx';

type Phase = 'welcome' | 'intro' | 'app';

const App: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('welcome');
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTryDemo = () => {
    setPhase('app');
    setActiveTab('demo');
  };

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
      case 'demo':
        return <DemoMode />;
      case 'contact':
        return <ContactUs />;
      case 'copyright':
        return <CopyrightPolicy />;
      default:
        return <Dashboard />;
    }
  };

  if (phase === 'welcome') {
    return <Welcome onNext={() => setPhase('intro')} onTryDemo={handleTryDemo} />;
  }

  if (phase === 'intro') {
    return <Introduction onStart={() => setPhase('app')} onTryDemo={handleTryDemo} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;