import React, { useState } from 'react';
import { ArrowRightLeft, ArrowDown, Zap, Clock } from 'lucide-react';

const CrossChainSwap = ({ user }) => {
  const [fromChain, setFromChain] = useState('ethereum');
  const [toChain, setToChain] = useState('base');
  const [fromToken, setFromToken] = useState('USDC');
  const [toToken, setToToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);

  const chains = [
    { id: 'ethereum', name: 'Ethereum', color: 'bg-blue-500' },
    { id: 'base', name: 'Base', color: 'bg-blue-600' },
    { id: 'arbitrum', name: 'Arbitrum', color: 'bg-blue-400' },
    { id: 'polygon', name: 'Polygon', color: 'bg-purple-500' },
    { id: 'optimism', name: 'Optimism', color: 'bg-red-500' },
  ];

  const tokens = ['USDC', 'USDT', 'DAI', 'FRAX'];

  const executeSwap = () => {
    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      alert('Swap executed successfully!');
    }, 3000);
  };

  const swapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  const estimatedFee = amount ? (parseFloat(amount) * 0.001).toFixed(4) : '0.0000';
  const estimatedTime = fromChain === toChain ? '~30 seconds' : '~2-5 minutes';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-heading gradient-text">Cross-Chain Swap</h2>
        <p className="text-gray-400">Seamlessly move stablecoins across different blockchain networks</p>
      </div>

      {/* Swap Interface */}
      <div className="max-w-md mx-auto">
        <div className="glass-card rounded-lg p-6 space-y-4">
          {/* From Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">From</label>
            <div className="bg-dark-surface rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <select
                  value={fromChain}
                  onChange={(e) => setFromChain(e.target.value)}
                  className="bg-transparent text-white font-medium focus:outline-none"
                >
                  {chains.map(chain => (
                    <option key={chain.id} value={chain.id} className="bg-dark-surface">
                      {chain.name}
                    </option>
                  ))}
                </select>
                <select
                  value={fromToken}
                  onChange={(e) => setFromToken(e.target.value)}
                  className="bg-transparent text-white font-medium focus:outline-none"
                >
                  {tokens.map(token => (
                    <option key={token} value={token} className="bg-dark-surface">
                      {token}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="w-full bg-transparent text-2xl text-white placeholder-gray-500 focus:outline-none"
              />
              <p className="text-sm text-gray-400 mt-1">Balance: 1,250.00 {fromToken}</p>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapChains}
              className="p-2 glass-card hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowDown className="h-5 w-5 text-gray-300" />
            </button>
          </div>

          {/* To Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">To</label>
            <div className="bg-dark-surface rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <select
                  value={toChain}
                  onChange={(e) => setToChain(e.target.value)}
                  className="bg-transparent text-white font-medium focus:outline-none"
                >
                  {chains.map(chain => (
                    <option key={chain.id} value={chain.id} className="bg-dark-surface">
                      {chain.name}
                    </option>
                  ))}
                </select>
                <select
                  value={toToken}
                  onChange={(e) => setToToken(e.target.value)}
                  className="bg-transparent text-white font-medium focus:outline-none"
                >
                  {tokens.map(token => (
                    <option key={token} value={token} className="bg-dark-surface">
                      {token}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-2xl text-white">
                {amount || '0.0'}
              </div>
              <p className="text-sm text-gray-400 mt-1">Balance: 0.00 {toToken}</p>
            </div>
          </div>

          {/* Swap Details */}
          {amount && (
            <div className="bg-dark-surface/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Exchange Rate:</span>
                <span className="text-white">1 {fromToken} = 1 {toToken}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Estimated Fee:</span>
                <span className="text-white">{estimatedFee} {fromToken}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Estimated Time:</span>
                <span className="text-white">{estimatedTime}</span>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <button
            onClick={executeSwap}
            disabled={!amount || isSwapping}
            className="w-full bg-gradient-primary text-white py-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isSwapping ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Swapping...</span>
              </>
            ) : (
              <>
                <ArrowRightLeft className="h-5 w-5" />
                <span>Swap {fromToken}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Cross-Chain Swaps</h3>
        <div className="space-y-3">
          {[
            { from: 'Ethereum', to: 'Base', amount: '500 USDC', time: '2 hours ago', status: 'completed' },
            { from: 'Polygon', to: 'Arbitrum', amount: '1,000 USDT', time: '1 day ago', status: 'completed' },
            { from: 'Base', to: 'Optimism', amount: '250 DAI', time: '3 days ago', status: 'completed' },
          ].map((tx, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-dark-surface/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <ArrowRightLeft className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-white font-medium">{tx.amount}</p>
                  <p className="text-sm text-gray-400">{tx.from} → {tx.to}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-green-400 capitalize">{tx.status}</span>
                </div>
                <p className="text-xs text-gray-500">{tx.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CrossChainSwap;