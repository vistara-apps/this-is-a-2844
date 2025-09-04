import React, { useState } from 'react';
import { ArrowLeftRight, RefreshCw, Crown } from 'lucide-react';
import { usePayment } from '../contexts/PaymentContext';
import { usePaymentContext } from '../hooks/usePaymentContext';

const chains = [
  { id: 'ethereum', name: 'Ethereum', icon: '⟠' },
  { id: 'base', name: 'Base', icon: '🔵' },
  { id: 'arbitrum', name: 'Arbitrum', icon: '🔷' },
  { id: 'polygon', name: 'Polygon', icon: '🟣' },
  { id: 'optimism', name: 'Optimism', icon: '🔴' },
];

const stablecoins = [
  { symbol: 'USDC', name: 'USD Coin', icon: '💙' },
  { symbol: 'USDT', name: 'Tether', icon: '💚' },
  { symbol: 'DAI', name: 'Dai', icon: '🟡' },
];

export function CrossChainSwap() {
  const [fromChain, setFromChain] = useState('ethereum');
  const [toChain, setToChain] = useState('base');
  const [fromToken, setFromToken] = useState('USDC');
  const [toToken, setToToken] = useState('USDC');
  const [amount, setAmount] = useState('');
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

  const swapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  const estimatedGas = 0.0045;
  const exchangeRate = 0.9998;
  const estimatedReceive = amount ? (parseFloat(amount) * exchangeRate - estimatedGas).toFixed(4) : '0';

  const hasAccess = isPremium || paid || hasAccessToFeature('cross-chain-swap');

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <ArrowLeftRight size={28} className="text-purple-500" />
          <h1 className="text-3xl font-bold text-dark-text">Cross-Chain Swap</h1>
          <Crown size={20} className="text-yellow-500" />
        </div>

        <div className="bg-dark-card border border-dark-border rounded-lg p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <Crown size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-dark-text mb-2">Premium Feature</h2>
            <p className="text-dark-muted mb-6">
              Access seamless cross-chain stablecoin swapping with minimal fees and maximum efficiency.
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
      <div className="flex items-center space-x-3">
        <ArrowLeftRight size={28} className="text-purple-500" />
        <div>
          <h1 className="text-3xl font-bold text-dark-text">Cross-Chain Swap</h1>
          <p className="text-dark-muted">Move stablecoins efficiently between different networks</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <div className="space-y-6">
            {/* From Section */}
            <div>
              <label className="block text-sm font-medium text-dark-text mb-3">From</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  value={fromChain}
                  onChange={(e) => setFromChain(e.target.value)}
                  className="w-full p-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {chains.map(chain => (
                    <option key={chain.id} value={chain.id}>
                      {chain.icon} {chain.name}
                    </option>
                  ))}
                </select>
                <select
                  value={fromToken}
                  onChange={(e) => setFromToken(e.target.value)}
                  className="w-full p-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {stablecoins.map(token => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.icon} {token.symbol}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-3">
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={swapChains}
                className="w-12 h-12 bg-dark-bg border border-dark-border rounded-full flex items-center justify-center hover:bg-dark-surface transition-colors"
              >
                <RefreshCw size={20} className="text-purple-500" />
              </button>
            </div>

            {/* To Section */}
            <div>
              <label className="block text-sm font-medium text-dark-text mb-3">To</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  value={toChain}
                  onChange={(e) => setToChain(e.target.value)}
                  className="w-full p-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {chains.map(chain => (
                    <option key={chain.id} value={chain.id}>
                      {chain.icon} {chain.name}
                    </option>
                  ))}
                </select>
                <select
                  value={toToken}
                  onChange={(e) => setToToken(e.target.value)}
                  className="w-full p-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {stablecoins.map(token => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.icon} {token.symbol}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-3">
                <div className="w-full p-3 bg-dark-bg border border-dark-border rounded-lg text-dark-muted text-lg">
                  ≈ {estimatedReceive} {toToken}
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            {amount && (
              <div className="bg-dark-bg rounded-lg p-4 space-y-2">
                <h3 className="font-medium text-dark-text mb-3">Transaction Details</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-muted">Exchange Rate</span>
                  <span className="text-dark-text">1 {fromToken} ≈ {exchangeRate} {toToken}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-muted">Estimated Gas</span>
                  <span className="text-dark-text">${estimatedGas} ETH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-muted">Processing Time</span>
                  <span className="text-dark-text">~2-5 minutes</span>
                </div>
                <div className="border-t border-dark-border pt-2 mt-3">
                  <div className="flex justify-between font-medium">
                    <span className="text-dark-text">You'll Receive</span>
                    <span className="text-green-400">{estimatedReceive} {toToken}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Swap Button */}
            <button
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {amount && parseFloat(amount) > 0 ? 'Execute Swap' : 'Enter Amount'}
            </button>
          </div>
        </div>

        {/* Recent Swaps */}
        <div className="mt-8 bg-dark-card border border-dark-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-dark-text mb-4">Recent Cross-Chain Swaps</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <span>⟠</span>
                  <ArrowLeftRight size={16} className="text-dark-muted" />
                  <span>🔵</span>
                </div>
                <div>
                  <p className="font-medium text-dark-text">5,000 USDC</p>
                  <p className="text-sm text-dark-muted">Ethereum → Base</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-400">Completed</p>
                <p className="text-xs text-dark-muted">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}