import React, { useState } from 'react';
import { TrendingUp, Zap, ArrowRight, RefreshCw } from 'lucide-react';

const YieldOptimizer = ({ pools, user }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimization, setOptimization] = useState(null);

  const runOptimization = () => {
    setIsOptimizing(true);
    
    // Simulate optimization calculation
    setTimeout(() => {
      const bestPool = [...pools].sort((a, b) => b.currentAPY - a.currentAPY)[0];
      const currentPool = pools.find(p => p.protocol === 'Compound');
      
      setOptimization({
        currentPool,
        recommendedPool: bestPool,
        potentialGain: (bestPool.currentAPY - currentPool.currentAPY).toFixed(2),
        estimatedReturn: ((bestPool.currentAPY - currentPool.currentAPY) * 10000 / 100).toFixed(0)
      });
      setIsOptimizing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-heading gradient-text">Yield Optimization</h2>
          <p className="text-gray-400">AI-powered recommendations to maximize your returns</p>
        </div>
        <button
          onClick={runOptimization}
          disabled={isOptimizing}
          className="flex items-center space-x-2 bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>{isOptimizing ? 'Optimizing...' : 'Run Optimization'}</span>
        </button>
      </div>

      {/* Current Portfolio */}
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Current Portfolio</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">$10,000</div>
            <div className="text-sm text-gray-400">Total Stablecoins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">5.2%</div>
            <div className="text-sm text-gray-400">Current APY</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">$520</div>
            <div className="text-sm text-gray-400">Annual Returns</div>
          </div>
        </div>
      </div>

      {/* Optimization Results */}
      {optimization && (
        <div className="glass-card rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Zap className="h-6 w-6 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Optimization Recommendation</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Position */}
            <div className="bg-dark-surface/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-300 mb-3">Current Position</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Protocol:</span>
                  <span className="text-white">{optimization.currentPool.protocol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Chain:</span>
                  <span className="text-white capitalize">{optimization.currentPool.chain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">APY:</span>
                  <span className="text-yellow-400">{optimization.currentPool.currentAPY.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            {/* Recommended Position */}
            <div className="bg-gradient-primary/20 border border-dark-accent/30 rounded-lg p-4">
              <h4 className="font-medium text-white mb-3">Recommended Position</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Protocol:</span>
                  <span className="text-white">{optimization.recommendedPool.protocol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Chain:</span>
                  <span className="text-white capitalize">{optimization.recommendedPool.chain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">APY:</span>
                  <span className="text-green-400">{optimization.recommendedPool.currentAPY.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-6 p-4 bg-green-400/10 border border-green-400/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-400 mb-1">Potential Benefits</h4>
                <p className="text-sm text-gray-300">
                  Increase APY by <span className="font-bold text-green-400">+{optimization.potentialGain}%</span>
                </p>
                <p className="text-sm text-gray-300">
                  Additional annual return: <span className="font-bold text-green-400">${optimization.estimatedReturn}</span>
                </p>
              </div>
              <ArrowRight className="h-6 w-6 text-green-400" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6">
            <button className="flex-1 bg-gradient-primary text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity">
              Execute Rebalance
            </button>
            <button className="px-6 py-3 glass-card hover:bg-white/10 rounded-lg font-medium text-gray-300 transition-colors">
              More Details
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isOptimizing && (
        <div className="glass-card rounded-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-accent mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-white mb-2">Analyzing Opportunities</h3>
          <p className="text-gray-400">Scanning 100+ pools across 12 chains for optimal yield...</p>
        </div>
      )}
    </div>
  );
};

export default YieldOptimizer;