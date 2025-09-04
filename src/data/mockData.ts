export interface Pool {
  poolId: string;
  protocol: string;
  chain: string;
  stablecoinPair: string;
  currentAPY: number;
  liquiditySize: number;
  fees: number;
  volume24h: number;
  icon: string;
}

export interface UserWallet {
  walletId: string;
  chain: string;
  address: string;
  balanceUsdc: number;
  balanceOtherStablecoins: number;
}

export interface Transaction {
  transactionId: string;
  type: 'swap' | 'rebalance' | 'deposit' | 'withdraw';
  fromChain: string;
  toChain: string;
  amount: number;
  stablecoin: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

export const mockPools: Pool[] = [
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

export const mockWallets: UserWallet[] = [
  {
    walletId: '1',
    chain: 'Ethereum',
    address: '0x1234...5678',
    balanceUsdc: 15420.50,
    balanceOtherStablecoins: 8950.25
  },
  {
    walletId: '2',
    chain: 'Base',
    address: '0x2345...6789',
    balanceUsdc: 8750.00,
    balanceOtherStablecoins: 3200.75
  },
  {
    walletId: '3',
    chain: 'Arbitrum',
    address: '0x3456...7890',
    balanceUsdc: 5200.25,
    balanceOtherStablecoins: 1850.50
  }
];

export const mockTransactions: Transaction[] = [
  {
    transactionId: '1',
    type: 'swap',
    fromChain: 'Ethereum',
    toChain: 'Base',
    amount: 5000,
    stablecoin: 'USDC',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'completed'
  },
  {
    transactionId: '2',
    type: 'rebalance',
    fromChain: 'Polygon',
    toChain: 'Arbitrum',
    amount: 2500,
    stablecoin: 'USDT',
    timestamp: '2024-01-14T15:45:00Z',
    status: 'completed'
  },
  {
    transactionId: '3',
    type: 'deposit',
    fromChain: 'Base',
    toChain: 'Base',
    amount: 10000,
    stablecoin: 'USDC',
    timestamp: '2024-01-13T09:15:00Z',
    status: 'pending'
  }
];

export const chartData = [
  { month: 'Jan', yield: 6.5 },
  { month: 'Feb', yield: 7.2 },
  { month: 'Mar', yield: 8.1 },
  { month: 'Apr', yield: 7.8 },
  { month: 'May', yield: 9.2 },
  { month: 'Jun', yield: 10.5 },
];