import React from 'react';
import { BarChart3, TrendingUp, ArrowRightLeft, Crown, Star } from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection, subscriptionTier }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, free: true },
    { id: 'optimize', label: 'Yield Optimizer', icon: TrendingUp, free: false },
    { id: 'swap', label: 'Cross-Chain Swap', icon: ArrowRightLeft, free: false },
  ];

  return (
    <aside className="w-64 glass-card rounded-lg p-6 h-fit">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          {subscriptionTier === 'premium' ? (
            <Crown className="h-5 w-5 text-yellow-400" />
          ) : (
            <Star className="h-5 w-5 text-gray-400" />
          )}
          <span className="text-sm font-medium capitalize">{subscriptionTier} Plan</span>
        </div>
        {subscriptionTier === 'free' && (
          <p className="text-xs text-gray-400">Upgrade for advanced features</p>
        )}
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isLocked = !item.free && subscriptionTier === 'free';
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-primary neon-glow text-white' 
                  : isLocked
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
              disabled={isLocked}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
              {isLocked && (
                <div className="ml-auto">
                  <Crown className="h-4 w-4 text-yellow-500" />
                </div>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;