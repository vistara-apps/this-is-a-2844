import React from 'react';
import { Crown, Check, X } from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';

const SubscriptionGate = ({ feature, onUpgrade }) => {
  const { createSession } = usePaymentContext();

  const handleUpgrade = async () => {
    try {
      await createSession();
      onUpgrade();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Basic pool viewing',
        'Manual rebalancing',
        'Limited chain support',
      ],
      limitations: [
        'No automated optimization',
        'No cross-chain swaps',
        'Basic analytics only',
      ]
    },
    {
      name: 'Premium',
      price: '$15',
      period: 'month',
      features: [
        'Advanced yield optimization',
        'Automated rebalancing',
        'Cross-chain swapping',
        'Real-time notifications',
        'Advanced analytics',
        'Priority support',
      ],
      limitations: []
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <Crown className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-heading gradient-text">Unlock {feature}</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Upgrade to Premium to access advanced DeFi optimization tools and maximize your stablecoin yields
        </p>
      </div>

      {/* Plans Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {plans.map((plan, index) => (
          <div 
            key={plan.name}
            className={`rounded-lg p-6 ${index === 1 ? 'glass-card neon-glow border-2 border-dark-accent' : 'bg-dark-surface/50'}`}
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center space-x-1">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-400">/{plan.period}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
              {plan.limitations.map((limitation, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <X className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <span className="text-gray-500">{limitation}</span>
                </div>
              ))}
            </div>

            {index === 1 ? (
              <button
                onClick={handleUpgrade}
                className="w-full bg-gradient-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Upgrade Now
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-gray-600 text-gray-400 py-3 rounded-lg font-medium cursor-not-allowed"
              >
                Current Plan
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Feature Preview */}
      <div className="glass-card rounded-lg p-6 max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-white mb-4">What you'll get with Premium:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-green-400">Automated Optimization</h4>
            <p className="text-sm text-gray-400">AI-powered algorithms continuously monitor and rebalance your portfolio for maximum yield</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-blue-400">Cross-Chain Freedom</h4>
            <p className="text-sm text-gray-400">Seamlessly move assets between Ethereum, Base, Arbitrum, Polygon, and more</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-purple-400">Advanced Analytics</h4>
            <p className="text-sm text-gray-400">Detailed insights, performance tracking, and yield projections</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-yellow-400">Priority Access</h4>
            <p className="text-sm text-gray-400">Early access to new features and dedicated customer support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionGate;