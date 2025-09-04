import React, { useState } from 'react';
import { TrendingUp, ExternalLink, ArrowUpRight, Zap } from 'lucide-react';

const PoolCard = ({ pool }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getChainColor = (chain) => {
    const colors = {
      ethereum: 'bg-blue-500',
      base: 'bg-blue-600',
      arbitrum: 'bg-blue-400',
      polygon: 'bg-purple-500',
      optimism: 'bg-red-500',
    };
    return colors[chain] || 'bg-gray-500';
  };

  const formatLiquidity = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="glass-card rounded-lg p-6 hover:bg-white/5 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${getChainColor(pool.chain)}`}></div>
          <div>
            <h3 className="font-semibold text-white">{pool.stablecoinPair}</h3>
            <p className="text-sm text-gray-400 capitalize">{pool.protocol} • {pool.chain}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>

      {/* APY Display */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-1">
          <TrendingUp className="h-4 w-4 text-green-400" />
          <span className="text-2xl font-bold text-green-400">{pool.currentAPY.toFixed(2)}%</span>
        </div>
        <p className="text-xs text-gray-500">Annual Percentage Yield</p>
      </div>

      {/* Pool Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Liquidity</p>
          <p className="text-sm font-medium text-gray-300">{formatLiquidity(pool.liquiditySize)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Fees</p>
          <p className="text-sm font-medium text-gray-300">{pool.fees}%</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button className="flex-1 bg-gradient-primary text-white py-2 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          Add Liquidity
        </button>
        <button className="p-2 glass-card hover:bg-white/10 rounded-lg transition-colors">
          <Zap className="h-4 w-4 text-gray-300" />
        </button>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">24h Volume:</span>
            <span className="text-white">{formatLiquidity(pool.liquiditySize * 0.1)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">7d APY Change:</span>
            <span className="text-green-400">+0.3%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Risk Level:</span>
            <span className="text-yellow-400">Low</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoolCard;