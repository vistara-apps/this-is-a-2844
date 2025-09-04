import React, { useState } from 'react';
import Sidebar from './Sidebar';
import PoolsOverview from './PoolsOverview';
import YieldOptimizer from './YieldOptimizer';
import CrossChainSwap from './CrossChainSwap';
import SubscriptionGate from './SubscriptionGate';

const DashboardLayout = ({ user, pools, setPools }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [subscriptionTier, setSubscriptionTier] = useState(user?.subscriptionTier || 'free');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <PoolsOverview pools={pools} user={user} />;
      case 'optimize':
        return subscriptionTier === 'free' ? 
          <SubscriptionGate feature="Yield Optimization" onUpgrade={() => setSubscriptionTier('premium')} /> :
          <YieldOptimizer pools={pools} user={user} />;
      case 'swap':
        return subscriptionTier === 'free' ? 
          <SubscriptionGate feature="Cross-Chain Swapping" onUpgrade={() => setSubscriptionTier('premium')} /> :
          <CrossChainSwap user={user} />;
      default:
        return <PoolsOverview pools={pools} user={user} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-6">
      <div className="flex gap-6">
        <Sidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          subscriptionTier={subscriptionTier}
        />
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;