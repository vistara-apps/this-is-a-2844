
import { Clock, ArrowUpRight, ArrowDownLeft, RotateCcw } from 'lucide-react';
import type { Transaction } from '../data/mockData';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'swap':
        return <RotateCcw size={16} className="text-blue-400" />;
      case 'deposit':
        return <ArrowDownLeft size={16} className="text-green-400" />;
      case 'withdraw':
        return <ArrowUpRight size={16} className="text-red-400" />;
      default:
        return <RotateCcw size={16} className="text-purple-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-dark-muted';
    }
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Clock size={20} className="text-purple-500" />
        <h3 className="text-lg font-semibold text-dark-text">Recent Activity</h3>
      </div>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.transactionId} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-dark-surface flex items-center justify-center">
                {getTransactionIcon(tx.type)}
              </div>
              <div>
                <p className="font-medium text-dark-text capitalize">{tx.type}</p>
                <p className="text-sm text-dark-muted">
                  {tx.fromChain} → {tx.toChain}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-dark-text">
                ${tx.amount.toLocaleString()} {tx.stablecoin}
              </p>
              <p className={`text-sm capitalize ${getStatusColor(tx.status)}`}>
                {tx.status}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-purple-400 hover:text-purple-300 transition-colors">
        View All Transactions
      </button>
    </div>
  );
}
