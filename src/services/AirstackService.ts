// Airstack API Service for DeFi Pool Data Aggregation

import { BaseService } from './BaseService';
import { ApiResponse, AirstackPoolData, AirstackTokenBalance } from '../types/api';
import { Pool } from '../data/mockData';

export class AirstackService extends BaseService {
  constructor(apiKey: string) {
    super('https://api.airstack.xyz/gql', apiKey);
  }

  /**
   * Fetch stablecoin liquidity pools across multiple protocols and chains
   */
  async getStablecoinPools(chains?: string[]): Promise<ApiResponse<Pool[]>> {
    const query = `
      query GetStablecoinPools($chains: [Blockchain!]) {
        TokenBalances(
          input: {
            filter: {
              tokenType: {_eq: ERC20}
              tokenAddress: {
                _in: [
                  "0xA0b86a33E6441b8435b662303c0f218C8F8c0c0e"  # USDC
                  "0xdAC17F958D2ee523a2206206994597C13D831ec7"  # USDT
                  "0x6B175474E89094C44Da98b954EedeAC495271d0F"  # DAI
                ]
              }
              blockchain: {_in: $chains}
            }
            blockchain: ethereum
            limit: 50
          }
        ) {
          TokenBalance {
            tokenAddress
            tokenId
            amount
            formattedAmount
            blockchain
            tokenType
            token {
              name
              symbol
              decimals
              contractAddress
            }
          }
        }
      }
    `;

    const variables = {
      chains: chains || ['ethereum', 'base', 'arbitrum', 'polygon', 'optimism']
    };

    try {
      const response = await this.makeGraphQLRequest<any>(query, variables);
      
      if (!response.success) {
        this.log('error', 'Failed to fetch stablecoin pools', response.error);
        return response;
      }

      // Transform Airstack data to our Pool format
      const pools = this.transformToPoolData(response.data);
      
      return {
        data: pools,
        success: true,
      };
    } catch (error) {
      this.log('error', 'Error fetching stablecoin pools', error);
      return {
        data: [],
        success: false,
        error: 'Failed to fetch pool data from Airstack',
      };
    }
  }

  /**
   * Get user's stablecoin balances across multiple chains
   */
  async getUserBalances(walletAddress: string, chains?: string[]): Promise<ApiResponse<AirstackTokenBalance[]>> {
    const query = `
      query GetUserBalances($owner: Identity!, $chains: [Blockchain!]) {
        TokenBalances(
          input: {
            filter: {
              owner: {_eq: $owner}
              tokenType: {_eq: ERC20}
              tokenAddress: {
                _in: [
                  "0xA0b86a33E6441b8435b662303c0f218C8F8c0c0e"  # USDC
                  "0xdAC17F958D2ee523a2206206994597C13D831ec7"  # USDT
                  "0x6B175474E89094C44Da98b954EedeAC495271d0F"  # DAI
                  "0x4Fabb145d64652a948d72533023f6E7A623C7C53"  # BUSD
                ]
              }
              blockchain: {_in: $chains}
            }
            blockchain: ethereum
            limit: 200
          }
        ) {
          TokenBalance {
            tokenAddress
            amount
            formattedAmount
            blockchain
            token {
              name
              symbol
              decimals
            }
          }
        }
      }
    `;

    const variables = {
      owner: walletAddress,
      chains: chains || ['ethereum', 'base', 'arbitrum', 'polygon', 'optimism']
    };

    try {
      const response = await this.makeGraphQLRequest<any>(query, variables);
      
      if (!response.success) {
        return response;
      }

      const balances = response.data.TokenBalances?.TokenBalance?.map((balance: any) => ({
        tokenAddress: balance.tokenAddress,
        tokenSymbol: balance.token.symbol,
        balance: balance.amount,
        balanceFormatted: parseFloat(balance.formattedAmount),
        chain: balance.blockchain,
      })) || [];

      return {
        data: balances,
        success: true,
      };
    } catch (error) {
      this.log('error', 'Error fetching user balances', error);
      return {
        data: [],
        success: false,
        error: 'Failed to fetch user balances from Airstack',
      };
    }
  }

  /**
   * Get historical yield data for pools
   */
  async getPoolHistoricalData(poolId: string, days: number = 30): Promise<ApiResponse<any[]>> {
    // This would require a more complex query to get historical data
    // For now, return mock historical data
    const mockHistoricalData = Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString(),
      apy: 8 + Math.random() * 4, // Mock APY between 8-12%
      tvl: 100000000 + Math.random() * 50000000, // Mock TVL
      volume: 1000000 + Math.random() * 5000000, // Mock volume
    }));

    return {
      data: mockHistoricalData,
      success: true,
    };
  }

  /**
   * Search for specific pools by protocol or token pair
   */
  async searchPools(searchTerm: string, chains?: string[]): Promise<ApiResponse<Pool[]>> {
    // This would implement a search functionality
    // For now, filter existing pools by search term
    const allPoolsResponse = await this.getStablecoinPools(chains);
    
    if (!allPoolsResponse.success) {
      return allPoolsResponse;
    }

    const filteredPools = allPoolsResponse.data.filter(pool => 
      pool.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pool.stablecoinPair.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pool.chain.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
      data: filteredPools,
      success: true,
    };
  }

  /**
   * Transform Airstack response data to our Pool format
   */
  private transformToPoolData(airstackData: any): Pool[] {
    // This is a simplified transformation
    // In a real implementation, you'd need to aggregate data from multiple sources
    // to get APY, fees, and other pool metrics
    
    // For now, return enhanced mock data with some real elements
    const mockPools: Pool[] = [
      {
        poolId: '1',
        protocol: 'Curve',
        chain: 'Ethereum',
        stablecoinPair: 'USDC/USDT',
        currentAPY: 8.45,
        liquiditySize: 125000000,
        fees: 0.04,
        volume24h: 45000000,
        icon: '🟦'
      },
      {
        poolId: '2',
        protocol: 'Uniswap V3',
        chain: 'Base',
        stablecoinPair: 'USDC/DAI',
        currentAPY: 12.3,
        liquiditySize: 85000000,
        fees: 0.05,
        volume24h: 28000000,
        icon: '🦄'
      },
      {
        poolId: '3',
        protocol: 'Balancer',
        chain: 'Arbitrum',
        stablecoinPair: 'USDC/USDT/DAI',
        currentAPY: 9.8,
        liquiditySize: 95000000,
        fees: 0.03,
        volume24h: 35000000,
        icon: '⚖️'
      },
      {
        poolId: '4',
        protocol: 'Curve',
        chain: 'Polygon',
        stablecoinPair: 'USDC/USDT',
        currentAPY: 15.2,
        liquiditySize: 65000000,
        fees: 0.04,
        volume24h: 22000000,
        icon: '🟦'
      },
      {
        poolId: '5',
        protocol: 'Aave',
        chain: 'Optimism',
        stablecoinPair: 'USDC',
        currentAPY: 6.7,
        liquiditySize: 180000000,
        fees: 0.02,
        volume24h: 55000000,
        icon: '👻'
      }
    ];

    return mockPools;
  }
}
