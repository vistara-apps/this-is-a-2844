// Custom hook for pool data management

import { useState, useEffect, useCallback } from 'react';
import { Pool } from '../data/mockData';
import { AirstackService } from '../services/AirstackService';

interface UsePoolDataReturn {
  pools: Pool[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  searchPools: (searchTerm: string) => Promise<void>;
  getPoolHistory: (poolId: string, days?: number) => Promise<any[]>;
}

export function usePoolData(chains?: string[]): UsePoolDataReturn {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Airstack service
  const airstackService = new AirstackService(
    process.env.REACT_APP_AIRSTACK_API_KEY || 'demo-key'
  );

  const fetchPools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await airstackService.getStablecoinPools(chains);
      
      if (response.success) {
        setPools(response.data);
      } else {
        setError(response.error || 'Failed to fetch pools');
        // Fallback to mock data on error
        const { mockPools } = await import('../data/mockData');
        setPools(mockPools);
      }
    } catch (err) {
      setError('Network error occurred');
      // Fallback to mock data on error
      const { mockPools } = await import('../data/mockData');
      setPools(mockPools);
    } finally {
      setLoading(false);
    }
  }, [chains]);

  const searchPools = useCallback(async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await airstackService.searchPools(searchTerm, chains);
      
      if (response.success) {
        setPools(response.data);
      } else {
        setError(response.error || 'Search failed');
      }
    } catch (err) {
      setError('Search error occurred');
    } finally {
      setLoading(false);
    }
  }, [chains]);

  const getPoolHistory = useCallback(async (poolId: string, days: number = 30) => {
    try {
      const response = await airstackService.getPoolHistoricalData(poolId, days);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to fetch pool history');
      }
    } catch (err) {
      console.error('Error fetching pool history:', err);
      return [];
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchPools();
  }, [fetchPools]);

  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  return {
    pools,
    loading,
    error,
    refetch,
    searchPools,
    getPoolHistory,
  };
}
