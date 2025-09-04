import React from 'react';
import { TrendingUp, ExternalLink } from 'lucide-react';
import type { Pool } from '../data/mockData';

interface PoolCardProps {
  pool: Pool;
  variant?: 'default' | 'expanded' | 'collapsed';
}

export function PoolCard({ pool, variant = 'default' }: PoolCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    }
    return `$${num.toLocaleString()}`;
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-4 hover:border-purple-500/50 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{pool.icon}</div>
          <div>
            <h3 className="font-semibold text-dark-text">{pool.stablecoinPair}</h3>
            <p className="text-sm text-dark-muted">{pool.protocol} • {pool.chain}</p>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-dark-border rounded">
          <ExternalLink size={16} className="text-dark-muted" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-dark-muted uppercase tracking-wide">APY</p>
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold text-green-400">{pool.currentAPY.toFixed(1)}%</span>
            <TrendingUp size={14} className="text-green-400" />
          </div>
        </div>
        <div>
          <p className="text-xs text-dark-muted uppercase tracking-wide">TVL</p>
          <p className="text-lg font-bold text-dark-text">{formatNumber(pool.liquiditySize)}</p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-dark-border grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-dark-muted">24h Volume: </span>
          <span className="text-dark-text">{formatNumber(pool.volume24h)}</span>
        </div>
        <div>
          <span className="text-dark-muted">Fees: </span>
          <span className="text-dark-text">{pool.fees}%</span>
        </div>
      </div>
    </div>
  );
}
