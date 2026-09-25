export type CurrencyCode = 'INR' | 'USD';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  joinedDate: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Quant';
}

export interface MarketAsset {
  symbol: string;
  name: string;
  sector: string;
  type: 'Stock' | 'Crypto' | 'Index';
  price: number;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  volume: number;
  marketCap: number;
  sparkline: number[];
  description: string;
}

export interface PricePoint {
  time: string;
  date: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  maFast?: number;
  maSlow?: number;
  rsi?: number;
}

export interface Holding {
  symbol: string;
  name: string;
  shares: number;
  avgBuyPrice: number;
  currentPrice: number;
  totalValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  allocationPercent: number;
  sector: string;
}

export type OrderType = 'BUY' | 'SELL';
export type OrderStatus = 'COMPLETED' | 'PENDING' | 'CANCELLED' | 'REJECTED';

export interface Transaction {
  id: string;
  symbol: string;
  name: string;
  type: OrderType;
  shares: number;
  price: number;
  total: number;
  fee: number;
  timestamp: string;
  status: OrderStatus;
}

export interface PortfolioSummary {
  totalEquity: number;
  availableCash: number;
  holdingsValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  realizedPnL: number;
  todayChange: number;
  todayChangePercent: number;
  initialCapital: number;
  sparkline: number[];
  equityHistory: {
    '1D': { time: string; value: number }[];
    '1W': { time: string; value: number }[];
    '1M': { time: string; value: number }[];
    'ALL': { time: string; value: number }[];
  };
}

export interface StrategyParameter {
  key: string;
  label: string;
  type: 'number' | 'select';
  defaultValue: number | string;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: string | number }[];
  description: string;
}

export interface StrategyDefinition {
  id: string;
  name: string;
  tagline: string;
  category: 'Trend Following' | 'Momentum' | 'Mean Reversion';
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  explanation: string;
  rules: {
    buy: string;
    sell: string;
    risk: string;
  };
  parameters: StrategyParameter[];
  defaultParams: Record<string, number | string>;
}

export interface BacktestRequest {
  assetSymbol: string;
  strategyId: string;
  timeframe: '3M' | '6M' | '1Y' | '2Y';
  initialCapital: number;
  parameters: Record<string, number | string>;
}

export interface BacktestTrade {
  id: string;
  date: string;
  type: 'BUY' | 'SELL';
  price: number;
  shares: number;
  value: number;
  pnl?: number;
  pnlPercent?: number;
  reason: string;
}

export interface BacktestResult {
  assetSymbol: string;
  assetName: string;
  strategyName: string;
  timeframe: string;
  initialCapital: number;
  finalEquity: number;
  totalReturn: number;
  totalReturnPercent: number;
  benchmarkReturnPercent: number;
  winRate: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  maxDrawdownPercent: number;
  sharpeRatio: number;
  profitFactor: number;
  avgTradeReturnPercent: number;
  equityCurve: {
    date: string;
    strategyEquity: number;
    benchmarkEquity: number;
    signal?: 'BUY' | 'SELL' | null;
  }[];
  trades: BacktestTrade[];
}
