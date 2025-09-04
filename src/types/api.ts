// API Types and Interfaces for StableSwap AI

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Airstack API Types
export interface AirstackPoolData {
  poolId: string;
  protocol: string;
  chain: string;
  tokenA: string;
  tokenB: string;
  tokenC?: string;
  apy: number;
  tvl: number;
  volume24h: number;
  fees: number;
  lastUpdated: string;
}

export interface AirstackTokenBalance {
  tokenAddress: string;
  tokenSymbol: string;
  balance: string;
  balanceFormatted: number;
  chain: string;
}

// Alchemy API Types
export interface AlchemyTokenBalance {
  contractAddress: string;
  tokenBalance: string;
  error?: string;
}

export interface AlchemyTransactionReceipt {
  blockHash: string;
  blockNumber: string;
  transactionHash: string;
  status: string;
  gasUsed: string;
  effectiveGasPrice: string;
}

// Wallet Service Types
export interface WalletTransaction {
  to: string;
  value: string;
  data: string;
  gasLimit?: string;
  gasPrice?: string;
}

export interface SignedTransaction {
  hash: string;
  signature: string;
  rawTransaction: string;
}

// AI Service Types
export interface YieldOptimizationRequest {
  currentPortfolio: {
    chain: string;
    token: string;
    amount: number;
  }[];
  riskTolerance: 'low' | 'medium' | 'high';
  targetAPY?: number;
  excludeProtocols?: string[];
}

export interface YieldOptimizationResponse {
  recommendations: {
    poolId: string;
    protocol: string;
    chain: string;
    suggestedAmount: number;
    expectedAPY: number;
    riskScore: number;
    reasoning: string;
  }[];
  totalExpectedYield: number;
  riskAssessment: string;
  executionSteps: string[];
}

// Cross-Chain Types
export interface CrossChainQuote {
  fromChain: string;
  toChain: string;
  fromToken: string;
  toToken: string;
  amount: string;
  estimatedOutput: string;
  bridgeFee: string;
  gasFee: string;
  estimatedTime: number; // in minutes
  route: string[];
}

export interface BridgeTransaction {
  transactionId: string;
  status: 'pending' | 'confirmed' | 'failed' | 'completed';
  fromChain: string;
  toChain: string;
  fromTxHash?: string;
  toTxHash?: string;
  amount: string;
  estimatedCompletion: string;
}

// Rate Limiting Types
export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  retryAfter?: number;
}

export interface RequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  rateLimit?: RateLimitConfig;
}
