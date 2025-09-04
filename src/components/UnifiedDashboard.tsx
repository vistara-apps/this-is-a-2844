import React from 'react';
import { PoolCard } from './PoolCard';
import { PortfolioOverview } from './PortfolioOverview';
import { YieldChart } from './YieldChart';
import { RecentTransactions } from './RecentTransactions';
import { DashboardSkeleton, PoolCardSkeleton } from './LoadingStates';
import { ErrorBoundary } from './ErrorBoundary';
import { usePoolData } from '../hooks/usePoolData';
import { useWalletBalances } from '../hooks/useWalletBalances';
import { useTransactionHistory } from '../hooks/useTransactionHistory';

export function UnifiedDashboard() {
  const { pools, loading: poolsLoading, error: poolsError } = usePoolData();
  const { wallets, totalBalance, loading: walletsLoading } = useWalletBalances();
  const { transactions, loading: transactionsLoading } = useTransactionHistory(10);

  const avgAPY = pools.length > 0 
    ? pools.reduce((sum, pool) => sum + pool.currentAPY, 0) / pools.length 
    : 0;

  const isLoading = poolsLoading || walletsLoading || transactionsLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

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
          <ErrorBoundary>
            <PortfolioOverview wallets={wallets} />
          </ErrorBoundary>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-dark-text">Top Liquidity Pools</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-dark-muted">Avg APY:</span>
                <span className="text-sm font-medium text-green-400">{avgAPY.toFixed(1)}%</span>
              </div>
            </div>
            
            {poolsError ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                <p className="text-red-400 mb-2">Failed to load pools</p>
                <p className="text-sm text-red-300">{poolsError}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {pools.length > 0 ? (
                  pools.slice(0, 4).map((pool) => (
                    <ErrorBoundary key={pool.poolId}>
                      <PoolCard pool={pool} />
                    </ErrorBoundary>
                  ))
                ) : (
                  Array.from({ length: 4 }).map((_, i) => (
                    <PoolCardSkeleton key={i} />
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <ErrorBoundary>
            <YieldChart />
          </ErrorBoundary>
          <ErrorBoundary>
            <RecentTransactions transactions={transactions.slice(0, 3)} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
