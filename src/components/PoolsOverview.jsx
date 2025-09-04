import React, { useState } from 'react';
import PoolCard from './PoolCard';
import StatsCard from './StatsCard';
import { DollarSign, TrendingUp, Activity, Zap } from 'lucide-react';

const PoolsOverview = ({ pools, user }) => {
  const [sortBy, setSortBy] = useState('apy');
  const [filterChain, setFilterChain] = useState('all');

  const sortedPools = [...pools].sort((a, b) => {
    switch (sortBy) {
      case 'apy':
        return b.currentAPY - a.currentAPY;
      case 'liquidity':
        return b.liquiditySize - a.liquiditySize;
      case 'protocol':
        return a.protocol.localeCompare(b.protocol);
      default:
        return 0;
    }
  });

  const filteredPools = filterChain === 'all' 
    ? sortedPools 
    : sortedPools.filter(pool => pool.chain === filterChain);

  const totalValue = user?.wallets?.reduce((sum, wallet) => sum + wallet.balanceUsdc + wallet.balanceOtherStablecoins, 0) || 0;
  const avgAPY = pools.reduce((sum, pool) => sum + pool.currentAPY, 0) / pools.length;
  const totalLiquidity = pools.reduce((sum, pool) => sum + pool.liquiditySize, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-heading gradient-text">Liquidity Dashboard</h2>
          <p className="text-gray-400">Monitor and optimize your stablecoin positions</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-dark-surface border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-dark-accent"
          >
            <option value="apy">Sort by APY</option>
            <option value="liquidity">Sort by Liquidity</option>
            <option value="protocol">Sort by Protocol</option>
          </select>
          
          <select 
            value={filterChain} 
            onChange={(e) => setFilterChain(e.target.value)}
            className="bg-dark-surface border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-dark-accent"
          >
            <option value="all">All Chains</option>
            <option value="ethereum">Ethereum</option>
            <option value="base">Base</option>
            <option value="arbitrum">Arbitrum</option>
            <option value="polygon">Polygon</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={DollarSign}
          title="Total Value"
          value={`$${totalValue.toLocaleString()}`}
          change="+2.5%"
          positive={true}
        />
        <StatsCard
          icon={TrendingUp}
          title="Average APY"
          value={`${avgAPY.toFixed(2)}%`}
          change="+0.3%"
          positive={true}
        />
        <StatsCard
          icon={Activity}
          title="Active Pools"
          value={pools.length.toString()}
          change="12 chains"
          positive={true}
        />
        <StatsCard
          icon={Zap}
          title="Total Liquidity"
          value={`$${(totalLiquidity / 1000000).toFixed(1)}M`}
          change="+5.2%"
          positive={true}
        />
      </div>

      {/* Pools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredPools.map((pool) => (
          <PoolCard key={pool.poolId} pool={pool} />
        ))}
      </div>
    </div>
  );
};

export default PoolsOverview;