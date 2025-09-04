import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Bell, Search, HelpCircle } from 'lucide-react';

export function TopBar() {
  return (
    <header className="bg-dark-surface border-b border-dark-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-muted" size={20} />
            <input
              type="text"
              placeholder="Search pools, protocols..."
              className="w-full pl-10 pr-4 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-dark-muted hover:text-dark-text transition-colors">
            <Bell size={20} />
          </button>
          <button className="p-2 text-dark-muted hover:text-dark-text transition-colors">
            <HelpCircle size={20} />
          </button>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}