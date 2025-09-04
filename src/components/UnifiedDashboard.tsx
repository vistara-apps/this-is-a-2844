import React from 'react';
import { PoolCard } from './PoolCard';
import { PortfolioOverview } from './PortfolioOverview';
import { YieldChart } from './YieldChart';
import { RecentTransactions } from './RecentTransactions';
import { mockPools, mockWallets, mockTransactions } from '../data/mockData';

export function UnifiedDashboard() {
  const totalBalance = mockWallets.reduce((sum, wallet) => 
    sum + wallet.balanceUsdc + wallet.balanceOtherStablecoins, 0
  );

  const avgAPY = mockPools.reduce((sum, pool) => sum + pool.currentAPY, 0) / mockPools.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-text">Dashboard</h1>
          <p className="text-dark-muted mt-1">Overview of your stablecoin positions and opportunities</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="text-right">
            <p className="text-sm text-dark-muted">Total Portfolio Value</p>
            <p className="text-2xl font-bold text-dark-text">${totalBalance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <PortfolioOverview wallets={mockWallets} />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-dark-text">Top Liquidity Pools</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-dark-muted">Avg APY:</span>
                <span className="text-sm font-medium text-green-400">{avgAPY.toFixed(1)}%</span>
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {mockPools.slice(0, 4).map((pool) => (
                <PoolCard key={pool.poolId} pool={pool} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <YieldChart />
          <RecentTransactions transactions={mockTransactions.slice(0, 3)} />
        </div>
      </div>
    </div>
  );
}