import React from 'react';
import { Wallet, TrendingUp, DollarSign } from 'lucide-react';
import type { UserWallet } from '../data/mockData';

interface PortfolioOverviewProps {
  wallets: UserWallet[];
}

export function PortfolioOverview({ wallets }: PortfolioOverviewProps) {
  const totalUSDC = wallets.reduce((sum, wallet) => sum + wallet.balanceUsdc, 0);
  const totalOther = wallets.reduce((sum, wallet) => sum + wallet.balanceOtherStablecoins, 0);
  const totalValue = totalUSDC + totalOther;

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Wallet size={24} className="text-purple-500" />
        <h2 className="text-xl font-semibold text-dark-text">Portfolio Overview</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
            <DollarSign size={20} className="text-blue-400" />
            <span className="text-sm text-dark-muted">Total Value</span>
          </div>
          <p className="text-2xl font-bold text-dark-text">${totalValue.toLocaleString()}</p>
        </div>
        
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-dark-muted">USDC</span>
          </div>
          <p className="text-xl font-semibold text-dark-text">${totalUSDC.toLocaleString()}</p>
        </div>
        
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-dark-muted">Other Stablecoins</span>
          </div>
          <p className="text-xl font-semibold text-dark-text">${totalOther.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-dark-muted uppercase tracking-wide">Connected Wallets</h3>
        {wallets.map((wallet, index) => (
          <div key={wallet.walletId} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-medium">
                {wallet.chain[0]}
              </div>
              <div>
                <p className="font-medium text-dark-text">{wallet.chain}</p>
                <p className="text-sm text-dark-muted">{wallet.address}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-dark-text">
                ${(wallet.balanceUsdc + wallet.balanceOtherStablecoins).toLocaleString()}
              </p>
              <p className="text-sm text-dark-muted">Total Balance</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
