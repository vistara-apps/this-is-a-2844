import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { TrendingUp, Settings, Bell } from 'lucide-react';

const Header = ({ user }) => {
  return (
    <header className="sticky top-0 z-50 glass-card border-b border-white/10">
      <div className="max-w-6xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-primary neon-glow">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">StableSwap AI</h1>
              <p className="text-sm text-gray-400">DeFi Yield Optimization</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</a>
            <a href="#pools" className="text-gray-300 hover:text-white transition-colors">Pools</a>
            <a href="#optimize" className="text-gray-300 hover:text-white transition-colors">Optimize</a>
            <a href="#swap" className="text-gray-300 hover:text-white transition-colors">Cross-Chain</a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg glass-card hover:bg-white/10 transition-colors">
              <Bell className="h-5 w-5 text-gray-300" />
            </button>
            <button className="p-2 rounded-lg glass-card hover:bg-white/10 transition-colors">
              <Settings className="h-5 w-5 text-gray-300" />
            </button>
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;