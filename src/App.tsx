import React, { useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import { UnifiedDashboard } from './components/UnifiedDashboard';
import YieldOptimizer from './components/YieldOptimizer';
import CrossChainSwap from './components/CrossChainSwap';
import { PaymentProvider } from './contexts/PaymentContext';

type ActiveView = 'dashboard' | 'optimizer' | 'swap';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <UnifiedDashboard />;
      case 'optimizer':
        return <YieldOptimizer />;
      case 'swap':
        return <CrossChainSwap />;
      default:
        return <UnifiedDashboard />;
    }
  };

  return (
    <PaymentProvider>
      <DashboardLayout activeView={activeView} onViewChange={setActiveView}>
        {renderActiveView()}
      </DashboardLayout>
    </PaymentProvider>
  );
}

export default App;
