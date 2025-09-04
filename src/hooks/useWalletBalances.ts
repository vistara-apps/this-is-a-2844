// Custom hook for wallet balance management

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { UserWallet } from '../data/mockData';
import { AirstackService } from '../services/AirstackService';
import { AlchemyService } from '../services/AlchemyService';

interface UseWalletBalancesReturn {
  wallets: UserWallet[];
  totalBalance: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getBalanceForChain: (chain: string) => number;
}

export function useWalletBalances(): UseWalletBalancesReturn {
  const { address, isConnected } = useAccount();
  const [wallets, setWallets] = useState<UserWallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize services
  const airstackService = new AirstackService(
    process.env.REACT_APP_AIRSTACK_API_KEY || 'demo-key'
  );
  
  const alchemyService = new AlchemyService(
    process.env.REACT_APP_ALCHEMY_API_KEY || 'demo-key'
  );

  const fetchBalances = useCallback(async () => {
    if (!address || !isConnected) {
      setWallets([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const chains = ['ethereum', 'base', 'arbitrum', 'polygon', 'optimism'];
      const walletPromises = chains.map(async (chain) => {
        try {
          // Try Airstack first for comprehensive data
          const airstackResponse = await airstackService.getUserBalances(address, [chain]);
          
          if (airstackResponse.success && airstackResponse.data.length > 0) {
            const totalUsdc = airstackResponse.data
              .filter(balance => balance.tokenSymbol === 'USDC')
              .reduce((sum, balance) => sum + balance.balanceFormatted, 0);
            
            const totalOther = airstackResponse.data
              .filter(balance => balance.tokenSymbol !== 'USDC')
              .reduce((sum, balance) => sum + balance.balanceFormatted, 0);

            return {
              walletId: `${chain}-${address}`,
              chain: chain.charAt(0).toUpperCase() + chain.slice(1),
              address,
              balanceUsdc: totalUsdc,
              balanceOtherStablecoins: totalOther,
            };
          }

          // Fallback to Alchemy for specific chain data
          const alchemyResponse = await alchemyService.getTokenBalances(address, chain);
          
          if (alchemyResponse.success) {
            // Process Alchemy token balances
            const usdcBalance = alchemyResponse.data
              .find(balance => balance.contractAddress.toLowerCase().includes('usdc'))?.tokenBalance || '0';
            
            const otherBalances = alchemyResponse.data
              .filter(balance => !balance.contractAddress.toLowerCase().includes('usdc'))
              .reduce((sum, balance) => sum + parseInt(balance.tokenBalance || '0'), 0);

            return {
              walletId: `${chain}-${address}`,
              chain: chain.charAt(0).toUpperCase() + chain.slice(1),
              address,
              balanceUsdc: parseInt(usdcBalance) / 1e6, // Assuming 6 decimals for USDC
              balanceOtherStablecoins: otherBalances / 1e18, // Assuming 18 decimals for others
            };
          }

          // Return empty wallet if both services fail
          return {
            walletId: `${chain}-${address}`,
            chain: chain.charAt(0).toUpperCase() + chain.slice(1),
            address,
            balanceUsdc: 0,
            balanceOtherStablecoins: 0,
          };
        } catch (chainError) {
          console.warn(`Error fetching balances for ${chain}:`, chainError);
          return {
            walletId: `${chain}-${address}`,
            chain: chain.charAt(0).toUpperCase() + chain.slice(1),
            address,
            balanceUsdc: 0,
            balanceOtherStablecoins: 0,
          };
        }
      });

      const walletResults = await Promise.all(walletPromises);
      
      // Filter out wallets with zero balances for cleaner UI
      const walletsWithBalances = walletResults.filter(
        wallet => wallet.balanceUsdc > 0 || wallet.balanceOtherStablecoins > 0
      );

      setWallets(walletsWithBalances.length > 0 ? walletsWithBalances : walletResults);
      
    } catch (err) {
      console.error('Error fetching wallet balances:', err);
      setError('Failed to fetch wallet balances');
      
      // Fallback to mock data
      const { mockWallets } = await import('../data/mockData');
      setWallets(mockWallets);
    } finally {
      setLoading(false);
    }
  }, [address, isConnected]);

  const refetch = useCallback(async () => {
    await fetchBalances();
  }, [fetchBalances]);

  const getBalanceForChain = useCallback((chain: string): number => {
    const wallet = wallets.find(w => w.chain.toLowerCase() === chain.toLowerCase());
    return wallet ? wallet.balanceUsdc + wallet.balanceOtherStablecoins : 0;
  }, [wallets]);

  const totalBalance = wallets.reduce(
    (sum, wallet) => sum + wallet.balanceUsdc + wallet.balanceOtherStablecoins,
    0
  );

  useEffect(() => {
    if (isConnected && address) {
      fetchBalances();
    } else {
      setWallets([]);
      setError(null);
    }
  }, [fetchBalances, isConnected, address]);

  return {
    wallets,
    totalBalance,
    loading,
    error,
    refetch,
    getBalanceForChain,
  };
}
