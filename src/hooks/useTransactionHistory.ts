// Custom hook for transaction history management

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { Transaction } from '../data/mockData';
import { AlchemyService } from '../services/AlchemyService';

interface UseTransactionHistoryReturn {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getTransactionsByChain: (chain: string) => Transaction[];
  getTransactionsByType: (type: Transaction['type']) => Transaction[];
}

export function useTransactionHistory(limit: number = 50): UseTransactionHistoryReturn {
  const { address, isConnected } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Alchemy service
  const alchemyService = new AlchemyService(
    process.env.REACT_APP_ALCHEMY_API_KEY || 'demo-key'
  );

  const fetchTransactionHistory = useCallback(async () => {
    if (!address || !isConnected) {
      setTransactions([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const chains = ['ethereum', 'base', 'arbitrum', 'polygon', 'optimism'];
      const transactionPromises = chains.map(async (chain) => {
        try {
          const response = await alchemyService.getTransactionHistory(address, chain);
          
          if (response.success) {
            return response.data.map((tx: any) => transformAlchemyTransaction(tx, chain));
          }
          
          return [];
        } catch (chainError) {
          console.warn(`Error fetching transactions for ${chain}:`, chainError);
          return [];
        }
      });

      const allTransactions = await Promise.all(transactionPromises);
      const flatTransactions = allTransactions.flat();
      
      // Sort by timestamp (most recent first) and limit results
      const sortedTransactions = flatTransactions
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);

      setTransactions(sortedTransactions);
      
    } catch (err) {
      console.error('Error fetching transaction history:', err);
      setError('Failed to fetch transaction history');
      
      // Fallback to mock data
      const { mockTransactions } = await import('../data/mockData');
      setTransactions(mockTransactions);
    } finally {
      setLoading(false);
    }
  }, [address, isConnected, limit]);

  const refetch = useCallback(async () => {
    await fetchTransactionHistory();
  }, [fetchTransactionHistory]);

  const getTransactionsByChain = useCallback((chain: string): Transaction[] => {
    return transactions.filter(tx => 
      tx.fromChain.toLowerCase() === chain.toLowerCase() || 
      tx.toChain.toLowerCase() === chain.toLowerCase()
    );
  }, [transactions]);

  const getTransactionsByType = useCallback((type: Transaction['type']): Transaction[] => {
    return transactions.filter(tx => tx.type === type);
  }, [transactions]);

  useEffect(() => {
    if (isConnected && address) {
      fetchTransactionHistory();
    } else {
      setTransactions([]);
      setError(null);
    }
  }, [fetchTransactionHistory, isConnected, address]);

  return {
    transactions,
    loading,
    error,
    refetch,
    getTransactionsByChain,
    getTransactionsByType,
  };
}

// Helper function to transform Alchemy transaction data to our Transaction format
function transformAlchemyTransaction(alchemyTx: any, chain: string): Transaction {
  // Determine transaction type based on transaction data
  let type: Transaction['type'] = 'deposit';
  
  if (alchemyTx.category?.includes('erc20')) {
    if (alchemyTx.to && alchemyTx.from) {
      type = 'swap';
    } else if (alchemyTx.to) {
      type = 'deposit';
    } else {
      type = 'withdraw';
    }
  }

  // Determine if it's a cross-chain transaction
  const fromChain = chain;
  const toChain = chain; // For now, assume same chain unless we detect bridge activity
  
  // Check if it's a bridge transaction
  if (alchemyTx.to && isBridgeContract(alchemyTx.to)) {
    type = 'swap'; // Cross-chain swap
    // In a real implementation, you'd determine the destination chain
  }

  return {
    transactionId: alchemyTx.hash || `${chain}-${Date.now()}`,
    type,
    fromChain: fromChain.charAt(0).toUpperCase() + fromChain.slice(1),
    toChain: toChain.charAt(0).toUpperCase() + toChain.slice(1),
    amount: parseFloat(alchemyTx.value || '0') / 1e18, // Convert from wei
    stablecoin: getStablecoinFromAddress(alchemyTx.rawContract?.address) || 'USDC',
    timestamp: alchemyTx.metadata?.blockTimestamp || new Date().toISOString(),
    status: 'completed' as const, // Alchemy only returns confirmed transactions
  };
}

// Helper function to identify bridge contracts
function isBridgeContract(address: string): boolean {
  const bridgeContracts = [
    '0x4200000000000000000000000000000000000010', // Base bridge
    '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a', // Arbitrum bridge
    // Add more bridge contract addresses as needed
  ];
  
  return bridgeContracts.some(bridge => 
    bridge.toLowerCase() === address.toLowerCase()
  );
}

// Helper function to get stablecoin symbol from contract address
function getStablecoinFromAddress(address?: string): string {
  if (!address) return 'USDC';
  
  const stablecoinAddresses: Record<string, string> = {
    '0xa0b86a33e6441b8435b662303c0f218c8f8c0c0e': 'USDC', // USDC on Ethereum
    '0xdac17f958d2ee523a2206206994597c13d831ec7': 'USDT', // USDT on Ethereum
    '0x6b175474e89094c44da98b954eedeac495271d0f': 'DAI',  // DAI on Ethereum
    // Add more stablecoin addresses for different chains
  };
  
  return stablecoinAddresses[address.toLowerCase()] || 'USDC';
}
