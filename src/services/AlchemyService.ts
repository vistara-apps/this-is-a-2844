// Alchemy API Service for Blockchain Interactions

import { BaseService } from './BaseService';
import { ApiResponse, AlchemyTokenBalance, AlchemyTransactionReceipt } from '../types/api';

export class AlchemyService extends BaseService {
  private chainEndpoints: Record<string, string> = {
    ethereum: 'https://eth-mainnet.g.alchemy.com/v2/',
    base: 'https://base-mainnet.g.alchemy.com/v2/',
    arbitrum: 'https://arb-mainnet.g.alchemy.com/v2/',
    polygon: 'https://polygon-mainnet.g.alchemy.com/v2/',
    optimism: 'https://opt-mainnet.g.alchemy.com/v2/',
  };

  constructor(apiKey: string) {
    super('', apiKey);
  }

  /**
   * Get token balances for a wallet address on a specific chain
   */
  async getTokenBalances(
    walletAddress: string, 
    chain: string,
    tokenAddresses?: string[]
  ): Promise<ApiResponse<AlchemyTokenBalance[]>> {
    const endpoint = this.chainEndpoints[chain.toLowerCase()];
    if (!endpoint) {
      return {
        data: [],
        success: false,
        error: `Unsupported chain: ${chain}`,
      };
    }

    const url = `${endpoint}${this.apiKey}`;
    
    try {
      const response = await this.makeRequest<any>(url, {
        method: 'POST',
        body: JSON.stringify({
          id: 1,
          jsonrpc: '2.0',
          method: 'alchemy_getTokenBalances',
          params: [
            walletAddress,
            tokenAddresses || [
              '0xA0b86a33E6441b8435b662303c0f218C8F8c0c0e', // USDC
              '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
              '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
            ]
          ]
        }),
      });

      if (!response.success) {
        return response;
      }

      const balances = response.data.result?.tokenBalances || [];
      
      return {
        data: balances,
        success: true,
      };
    } catch (error) {
      this.log('error', 'Error fetching token balances', error);
      return {
        data: [],
        success: false,
        error: 'Failed to fetch token balances from Alchemy',
      };
    }
  }

  /**
   * Get transaction receipt by hash
   */
  async getTransactionReceipt(txHash: string, chain: string): Promise<ApiResponse<AlchemyTransactionReceipt>> {
    const endpoint = this.chainEndpoints[chain.toLowerCase()];
    if (!endpoint) {
      return {
        data: null as any,
        success: false,
        error: `Unsupported chain: ${chain}`,
      };
    }

    const url = `${endpoint}${this.apiKey}`;
    
    try {
      const response = await this.makeRequest<any>(url, {
        method: 'POST',
        body: JSON.stringify({
          id: 1,
          jsonrpc: '2.0',
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        }),
      });

      if (!response.success) {
        return response;
      }

      return {
        data: response.data.result,
        success: true,
      };
    } catch (error) {
      this.log('error', 'Error fetching transaction receipt', error);
      return {
        data: null as any,
        success: false,
        error: 'Failed to fetch transaction receipt from Alchemy',
      };
    }
  }

  /**
   * Get current gas prices for a chain
   */
  async getGasPrice(chain: string): Promise<ApiResponse<string>> {
    const endpoint = this.chainEndpoints[chain.toLowerCase()];
    if (!endpoint) {
      return {
        data: '',
        success: false,
        error: `Unsupported chain: ${chain}`,
      };
    }

    const url = `${endpoint}${this.apiKey}`;
    
    try {
      const response = await this.makeRequest<any>(url, {
        method: 'POST',
        body: JSON.stringify({
          id: 1,
          jsonrpc: '2.0',
          method: 'eth_gasPrice',
          params: []
        }),
      });

      if (!response.success) {
        return response;
      }

      return {
        data: response.data.result,
        success: true,
      };
    } catch (error) {
      this.log('error', 'Error fetching gas price', error);
      return {
        data: '',
        success: false,
        error: 'Failed to fetch gas price from Alchemy',
      };
    }
  }

  /**
   * Estimate gas for a transaction
   */
  async estimateGas(
    from: string,
    to: string,
    data: string,
    value: string,
    chain: string
  ): Promise<ApiResponse<string>> {
    const endpoint = this.chainEndpoints[chain.toLowerCase()];
    if (!endpoint) {
      return {
        data: '',
        success: false,
        error: `Unsupported chain: ${chain}`,
      };
    }

    const url = `${endpoint}${this.apiKey}`;
    
    try {
      const response = await this.makeRequest<any>(url, {
        method: 'POST',
        body: JSON.stringify({
          id: 1,
          jsonrpc: '2.0',
          method: 'eth_estimateGas',
          params: [{
            from,
            to,
            data,
            value
          }]
        }),
      });

      if (!response.success) {
        return response;
      }

      return {
        data: response.data.result,
        success: true,
      };
    } catch (error) {
      this.log('error', 'Error estimating gas', error);
      return {
        data: '',
        success: false,
        error: 'Failed to estimate gas from Alchemy',
      };
    }
  }

  /**
   * Send raw transaction to the network
   */
  async sendRawTransaction(signedTx: string, chain: string): Promise<ApiResponse<string>> {
    const endpoint = this.chainEndpoints[chain.toLowerCase()];
    if (!endpoint) {
      return {
        data: '',
        success: false,
        error: `Unsupported chain: ${chain}`,
      };
    }

    const url = `${endpoint}${this.apiKey}`;
    
    try {
      const response = await this.makeRequest<any>(url, {
        method: 'POST',
        body: JSON.stringify({
          id: 1,
          jsonrpc: '2.0',
          method: 'eth_sendRawTransaction',
          params: [signedTx]
        }),
      });

      if (!response.success) {
        return response;
      }

      return {
        data: response.data.result,
        success: true,
      };
    } catch (error) {
      this.log('error', 'Error sending raw transaction', error);
      return {
        data: '',
        success: false,
        error: 'Failed to send transaction via Alchemy',
      };
    }
  }

  /**
   * Get transaction history for an address
   */
  async getTransactionHistory(
    address: string,
    chain: string,
    fromBlock?: string,
    toBlock?: string
  ): Promise<ApiResponse<any[]>> {
    const endpoint = this.chainEndpoints[chain.toLowerCase()];
    if (!endpoint) {
      return {
        data: [],
        success: false,
        error: `Unsupported chain: ${chain}`,
      };
    }

    const url = `${endpoint}${this.apiKey}`;
    
    try {
      const response = await this.makeRequest<any>(url, {
        method: 'POST',
        body: JSON.stringify({
          id: 1,
          jsonrpc: '2.0',
          method: 'alchemy_getAssetTransfers',
          params: [{
            fromBlock: fromBlock || '0x0',
            toBlock: toBlock || 'latest',
            fromAddress: address,
            category: ['erc20', 'external'],
            withMetadata: true,
            excludeZeroValue: true,
            maxCount: '0x64' // 100 transactions
          }]
        }),
      });

      if (!response.success) {
        return response;
      }

      return {
        data: response.data.result?.transfers || [],
        success: true,
      };
    } catch (error) {
      this.log('error', 'Error fetching transaction history', error);
      return {
        data: [],
        success: false,
        error: 'Failed to fetch transaction history from Alchemy',
      };
    }
  }

  /**
   * Get current block number for a chain
   */
  async getBlockNumber(chain: string): Promise<ApiResponse<number>> {
    const endpoint = this.chainEndpoints[chain.toLowerCase()];
    if (!endpoint) {
      return {
        data: 0,
        success: false,
        error: `Unsupported chain: ${chain}`,
      };
    }

    const url = `${endpoint}${this.apiKey}`;
    
    try {
      const response = await this.makeRequest<any>(url, {
        method: 'POST',
        body: JSON.stringify({
          id: 1,
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: []
        }),
      });

      if (!response.success) {
        return response;
      }

      const blockNumber = parseInt(response.data.result, 16);
      
      return {
        data: blockNumber,
        success: true,
      };
    } catch (error) {
      this.log('error', 'Error fetching block number', error);
      return {
        data: 0,
        success: false,
        error: 'Failed to fetch block number from Alchemy',
      };
    }
  }
}
