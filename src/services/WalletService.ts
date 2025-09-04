// Wallet Service for Turnkey/Privy Integration

import { BaseService } from './BaseService';
import { ApiResponse, WalletTransaction, SignedTransaction } from '../types/api';

export class WalletService extends BaseService {
  private provider: 'turnkey' | 'privy';
  
  constructor(provider: 'turnkey' | 'privy', apiKey: string, baseURL?: string) {
    const defaultURLs = {
      turnkey: 'https://api.turnkey.com',
      privy: 'https://auth.privy.io'
    };
    
    super(baseURL || defaultURLs[provider], apiKey);
    this.provider = provider;
  }

  /**
   * Create a new wallet for a user
   */
  async createWallet(userId: string): Promise<ApiResponse<{ walletId: string; address: string }>> {
    try {
      if (this.provider === 'turnkey') {
        return this.createTurnkeyWallet(userId);
      } else {
        return this.createPrivyWallet(userId);
      }
    } catch (error) {
      this.log('error', 'Error creating wallet', error);
      return {
        data: null as any,
        success: false,
        error: 'Failed to create wallet',
      };
    }
  }

  /**
   * Sign a transaction using the wallet service
   */
  async signTransaction(
    walletId: string,
    transaction: WalletTransaction
  ): Promise<ApiResponse<SignedTransaction>> {
    try {
      if (this.provider === 'turnkey') {
        return this.signTurnkeyTransaction(walletId, transaction);
      } else {
        return this.signPrivyTransaction(walletId, transaction);
      }
    } catch (error) {
      this.log('error', 'Error signing transaction', error);
      return {
        data: null as any,
        success: false,
        error: 'Failed to sign transaction',
      };
    }
  }

  /**
   * Get wallet information
   */
  async getWallet(walletId: string): Promise<ApiResponse<{ address: string; chain: string }>> {
    try {
      if (this.provider === 'turnkey') {
        return this.getTurnkeyWallet(walletId);
      } else {
        return this.getPrivyWallet(walletId);
      }
    } catch (error) {
      this.log('error', 'Error fetching wallet', error);
      return {
        data: null as any,
        success: false,
        error: 'Failed to fetch wallet information',
      };
    }
  }

  /**
   * List all wallets for a user
   */
  async listWallets(userId: string): Promise<ApiResponse<Array<{ walletId: string; address: string; chain: string }>>> {
    try {
      if (this.provider === 'turnkey') {
        return this.listTurnkeyWallets(userId);
      } else {
        return this.listPrivyWallets(userId);
      }
    } catch (error) {
      this.log('error', 'Error listing wallets', error);
      return {
        data: [],
        success: false,
        error: 'Failed to list wallets',
      };
    }
  }

  // Turnkey-specific implementations
  private async createTurnkeyWallet(userId: string): Promise<ApiResponse<{ walletId: string; address: string }>> {
    const response = await this.makeRequest<any>('/public/v1/submit/create_wallet', {
      method: 'POST',
      body: JSON.stringify({
        type: 'ACTIVITY_TYPE_CREATE_WALLET',
        organizationId: process.env.TURNKEY_ORGANIZATION_ID,
        parameters: {
          walletName: `wallet-${userId}-${Date.now()}`,
          accounts: [{
            curve: 'CURVE_SECP256K1',
            pathFormat: 'PATH_FORMAT_BIP32',
            path: "m/44'/60'/0'/0/0",
            addressFormat: 'ADDRESS_FORMAT_ETHEREUM'
          }]
        },
        timestampMs: Date.now().toString()
      })
    });

    if (!response.success) {
      return response;
    }

    // Extract wallet ID and address from Turnkey response
    const walletId = response.data.activity?.result?.createWalletResult?.walletId;
    const address = response.data.activity?.result?.createWalletResult?.addresses?.[0];

    return {
      data: { walletId, address },
      success: true,
    };
  }

  private async signTurnkeyTransaction(
    walletId: string,
    transaction: WalletTransaction
  ): Promise<ApiResponse<SignedTransaction>> {
    const response = await this.makeRequest<any>('/public/v1/submit/sign_transaction', {
      method: 'POST',
      body: JSON.stringify({
        type: 'ACTIVITY_TYPE_SIGN_TRANSACTION_V2',
        organizationId: process.env.TURNKEY_ORGANIZATION_ID,
        parameters: {
          signWith: walletId,
          type: 'TRANSACTION_TYPE_ETHEREUM',
          unsignedTransaction: JSON.stringify({
            to: transaction.to,
            value: transaction.value,
            data: transaction.data,
            gasLimit: transaction.gasLimit,
            gasPrice: transaction.gasPrice,
          })
        },
        timestampMs: Date.now().toString()
      })
    });

    if (!response.success) {
      return response;
    }

    const signedTx = response.data.activity?.result?.signTransactionResult?.signedTransaction;
    
    return {
      data: {
        hash: '', // Would be computed from signed transaction
        signature: signedTx,
        rawTransaction: signedTx
      },
      success: true,
    };
  }

  private async getTurnkeyWallet(walletId: string): Promise<ApiResponse<{ address: string; chain: string }>> {
    const response = await this.makeRequest<any>(`/public/v1/query/get_wallet?walletId=${walletId}`);

    if (!response.success) {
      return response;
    }

    const wallet = response.data.wallet;
    
    return {
      data: {
        address: wallet.addresses?.[0] || '',
        chain: 'ethereum' // Default chain
      },
      success: true,
    };
  }

  private async listTurnkeyWallets(_userId: string): Promise<ApiResponse<Array<{ walletId: string; address: string; chain: string }>>> {
    const response = await this.makeRequest<any>('/public/v1/query/list_wallets', {
      method: 'POST',
      body: JSON.stringify({
        organizationId: process.env.TURNKEY_ORGANIZATION_ID,
      })
    });

    if (!response.success) {
      return response;
    }

    const wallets = response.data.wallets?.map((wallet: any) => ({
      walletId: wallet.walletId,
      address: wallet.addresses?.[0] || '',
      chain: 'ethereum'
    })) || [];

    return {
      data: wallets,
      success: true,
    };
  }

  // Privy-specific implementations
  private async createPrivyWallet(userId: string): Promise<ApiResponse<{ walletId: string; address: string }>> {
    const response = await this.makeRequest<any>('/api/v1/wallets', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        chainType: 'ethereum'
      })
    });

    if (!response.success) {
      return response;
    }

    return {
      data: {
        walletId: response.data.id,
        address: response.data.address
      },
      success: true,
    };
  }

  private async signPrivyTransaction(
    walletId: string,
    transaction: WalletTransaction
  ): Promise<ApiResponse<SignedTransaction>> {
    const response = await this.makeRequest<any>(`/api/v1/wallets/${walletId}/sign`, {
      method: 'POST',
      body: JSON.stringify({
        transaction: {
          to: transaction.to,
          value: transaction.value,
          data: transaction.data,
          gasLimit: transaction.gasLimit,
          gasPrice: transaction.gasPrice,
        }
      })
    });

    if (!response.success) {
      return response;
    }

    return {
      data: {
        hash: response.data.hash,
        signature: response.data.signature,
        rawTransaction: response.data.rawTransaction
      },
      success: true,
    };
  }

  private async getPrivyWallet(walletId: string): Promise<ApiResponse<{ address: string; chain: string }>> {
    const response = await this.makeRequest<any>(`/api/v1/wallets/${walletId}`);

    if (!response.success) {
      return response;
    }

    return {
      data: {
        address: response.data.address,
        chain: response.data.chainType || 'ethereum'
      },
      success: true,
    };
  }

  private async listPrivyWallets(userId: string): Promise<ApiResponse<Array<{ walletId: string; address: string; chain: string }>>> {
    const response = await this.makeRequest<any>(`/api/v1/users/${userId}/wallets`);

    if (!response.success) {
      return response;
    }

    const wallets = response.data.map((wallet: any) => ({
      walletId: wallet.id,
      address: wallet.address,
      chain: wallet.chainType || 'ethereum'
    }));

    return {
      data: wallets,
      success: true,
    };
  }
}
