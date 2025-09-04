import React from 'react';
import { BarChart3, Zap, ArrowLeftRight, Settings, CreditCard } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'optimizer', label: 'Yield Optimizer', icon: Zap },
    { id: 'swap', label: 'Cross-Chain Swap', icon: ArrowLeftRight },
  ];

  return (
    <div className="w-64 bg-dark-surface border-r border-dark-border flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <h1 className="text-xl font-bold text-dark-text">StableSwap AI</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-dark-muted hover:text-dark-text hover:bg-dark-card'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-dark-border">
        <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-dark-card">
          <CreditCard size={20} className="text-dark-muted" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-dark-text">Free Plan</p>
            <p className="text-xs text-dark-muted">Upgrade for more features</p>
          </div>
        </div>
      </div>
    </div>
  );
}