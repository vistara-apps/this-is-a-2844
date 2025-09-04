import React, { useState } from 'react';
import { Zap, Settings, Play, Crown } from 'lucide-react';
import { PoolCard } from './PoolCard';
import { mockPools } from '../data/mockData';
import { usePayment } from '../contexts/PaymentContext';
import { usePaymentContext } from '../hooks/usePaymentContext';

export function YieldOptimizer() {
  const [autoRebalance, setAutoRebalance] = useState(false);
  const [minAPY, setMinAPY] = useState(5);
  const [riskLevel, setRiskLevel] = useState('medium');
  const [paid, setPaid] = useState(false);
  const { isPremium, hasAccessToFeature } = usePayment();
  const { createSession } = usePaymentContext();

  const handleUpgrade = async () => {
    try {
      await createSession();
      setPaid(true);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const optimizedPools = mockPools
    .filter(pool => pool.currentAPY >= minAPY)
    .sort((a, b) => b.currentAPY - a.currentAPY);

  const hasAccess = isPremium || paid || hasAccessToFeature('yield-optimizer');

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Zap size={28} className="text-purple-500" />
          <h1 className="text-3xl font-bold text-dark-text">Yield Optimizer</h1>
          <Crown size={20} className="text-yellow-500" />
        </div>

        <div className="bg-dark-card border border-dark-border rounded-lg p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <Crown size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-dark-text mb-2">Premium Feature</h2>
            <p className="text-dark-muted mb-6">
              Unlock automated yield optimization and advanced rebalancing strategies with our premium subscription.
            </p>
            <button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              Upgrade to Premium - $15/month
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          <Zap size={28} className="text-purple-500" />
          <div>
            <h1 className="text-3xl font-bold text-dark-text">Yield Optimizer</h1>
            <p className="text-dark-muted">Maximize your stablecoin returns with automated strategies</p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2">
            <Play size={16} />
            <span>Start Optimization</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Settings size={20} className="text-purple-500" />
            <h2 className="text-lg font-semibold text-dark-text">Settings</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Auto-Rebalance
              </label>
              <button
                onClick={() => setAutoRebalance(!autoRebalance)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  autoRebalance
                    ? 'bg-purple-600/20 border-purple-500 text-purple-400'
                    : 'bg-dark-bg border-dark-border text-dark-muted'
                }`}
              >
                <span>Enable Auto-Rebalance</span>
                <div className={`w-6 h-6 rounded border-2 ${
                  autoRebalance ? 'bg-purple-500 border-purple-500' : 'border-dark-border'
                }`}>
                  {autoRebalance && (
                    <div className="w-full h-full flex items-center justify-center text-white text-xs">
                      ✓
                    </div>
                  )}
                </div>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Minimum APY: {minAPY}%
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={minAPY}
                onChange={(e) => setMinAPY(Number(e.target.value))}
                className="w-full h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Risk Level
              </label>
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
                className="w-full p-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
              </select>
            </div>

            <div className="pt-4 border-t border-dark-border">
              <h3 className="text-sm font-medium text-dark-text mb-3">Strategy Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark-muted">Target APY:</span>
                  <span className="text-green-400">{minAPY}%+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-muted">Risk Level:</span>
                  <span className="text-dark-text capitalize">{riskLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-muted">Auto-Rebalance:</span>
                  <span className={autoRebalance ? 'text-green-400' : 'text-red-400'}>
                    {autoRebalance ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-dark-text">Optimized Pools</h2>
            <div className="text-sm text-dark-muted">
              Found {optimizedPools.length} pools matching your criteria
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {optimizedPools.map((pool) => (
              <PoolCard key={pool.poolId} pool={pool} variant="expanded" />
            ))}
          </div>

          {optimizedPools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-dark-muted">No pools match your current criteria.</p>
              <p className="text-dark-muted">Try adjusting your minimum APY or risk level.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}