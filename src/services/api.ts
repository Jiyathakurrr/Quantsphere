import axios from 'axios';
import {
  PortfolioSummary,
  Holding,
  Transaction,
  MarketAsset,
  PricePoint,
  StrategyDefinition,
  BacktestRequest,
  BacktestResult,
  User
} from '../types';
import {
  localSimulator,
  MOCK_ASSETS,
  generateHistoricalData,
  MOCK_STRATEGIES,
  executeSimulatedBacktest
} from './mockData';

// Base URL configured for production/Vercel or local development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Helper for simulated network delay to test loading skeletons & async states
const simulateDelay = <T>(data: T, delayMs: number = 250): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delayMs);
  });
};

/**
 * ==========================================
 * PORTFOLIO & BALANCES API
 * ==========================================
 */

// GET /api/portfolio
export const getPortfolio = async (): Promise<PortfolioSummary> => {
  /* Future Live Integration:
   * const response = await apiClient.get<PortfolioSummary>('/portfolio');
   * return response.data;
   */
  const summary = localSimulator.getPortfolioSummary();
  return simulateDelay(summary, 280);
};

// GET /api/holdings
export const getHoldings = async (): Promise<Holding[]> => {
  /* Future Live Integration:
   * const response = await apiClient.get<Holding[]>('/holdings');
   * return response.data;
   */
  const { holdings } = localSimulator.getState();
  return simulateDelay([...holdings], 220);
};

// POST /api/portfolio/reset
export const resetPortfolio = async (capital?: number): Promise<PortfolioSummary> => {
  /* Future Live Integration:
   * const response = await apiClient.post<PortfolioSummary>('/portfolio/reset', { capital });
   * return response.data;
   */
  localSimulator.resetState(capital);
  const summary = localSimulator.getPortfolioSummary();
  return simulateDelay(summary, 300);
};

/**
 * ==========================================
 * TRANSACTIONS & ORDER EXECUTION API
 * ==========================================
 */

// GET /api/transactions
export const getTransactions = async (filters?: { symbol?: string; type?: string }): Promise<Transaction[]> => {
  /* Future Live Integration:
   * const response = await apiClient.get<Transaction[]>('/transactions', { params: filters });
   * return response.data;
   */
  let txs = [...localSimulator.getState().transactions];
  if (filters?.symbol && filters.symbol !== 'ALL') {
    txs = txs.filter(t => t.symbol.toUpperCase() === filters.symbol?.toUpperCase());
  }
  if (filters?.type && filters.type !== 'ALL') {
    txs = txs.filter(t => t.type === filters.type);
  }
  return simulateDelay(txs, 240);
};

// POST /api/orders
export const submitOrder = async (order: {
  symbol: string;
  type: 'BUY' | 'SELL';
  shares: number;
  price: number;
}): Promise<{ success: boolean; message: string; transaction: Transaction }> => {
  /* Future Live Integration:
   * const response = await apiClient.post('/orders', order);
   * return response.data;
   */
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (!order.shares || order.shares <= 0 || isNaN(order.shares)) {
          throw new Error('Order quantity must be a valid number greater than 0.');
        }
        const tx = localSimulator.addTransaction(order);
        resolve({
          success: true,
          message: `Successfully executed ${order.type} order for ${order.shares} share(s) of ${order.symbol}.`,
          transaction: tx
        });
      } catch (err: any) {
        reject(new Error(err.message || 'Failed to execute simulated trade.'));
      }
    }, 350);
  });
};

/**
 * ==========================================
 * MARKET DATA API
 * ==========================================
 */

// GET /api/markets
export const getMarketAssets = async (query?: string, sector?: string): Promise<MarketAsset[]> => {
  /* Future Live Integration:
   * const response = await apiClient.get<MarketAsset[]>('/markets', { params: { query, sector } });
   * return response.data;
   */
  let assets = [...MOCK_ASSETS];
  if (query && query.trim()) {
    const q = query.toLowerCase();
    assets = assets.filter(a => a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q));
  }
  if (sector && sector !== 'ALL') {
    assets = assets.filter(a => a.sector === sector);
  }
  return simulateDelay(assets, 200);
};

// GET /api/markets/:symbol
export const getAssetDetail = async (symbol: string, timeframe: string = '1M'): Promise<{
  asset: MarketAsset;
  history: PricePoint[];
}> => {
  /* Future Live Integration:
   * const response = await apiClient.get(`/markets/${symbol}`, { params: { timeframe } });
   * return response.data;
   */
  const asset = MOCK_ASSETS.find(a => a.symbol.toUpperCase() === symbol.toUpperCase()) || MOCK_ASSETS[0];
  const points = timeframe === '1D' ? 24 : timeframe === '1W' ? 28 : timeframe === '1Y' ? 60 : 35;
  const history = generateHistoricalData(asset.price, points, timeframe);
  
  return simulateDelay({
    asset,
    history
  }, 260);
};

/**
 * ==========================================
 * ALGORITHMIC STRATEGIES & BACKTESTING API
 * ==========================================
 */

// GET /api/strategies
export const getStrategies = async (): Promise<StrategyDefinition[]> => {
  /* Future Live Integration:
   * const response = await apiClient.get<StrategyDefinition[]>('/strategies');
   * return response.data;
   */
  return simulateDelay([...MOCK_STRATEGIES], 180);
};

// POST /api/backtest
export const runBacktest = async (request: BacktestRequest): Promise<BacktestResult> => {
  /* Future Live Integration:
   * const response = await apiClient.post<BacktestResult>('/backtest', request);
   * return response.data;
   */
  const result = executeSimulatedBacktest(request);
  return simulateDelay(result, 450); // realistic computation time
};

/**
 * ==========================================
 * USER & AUTH API
 * ==========================================
 */

// GET /api/user/profile
export const getUserProfile = async (): Promise<User> => {
  /* Future Live Integration:
   * const response = await apiClient.get<User>('/user/profile');
   * return response.data;
   */
  const user = localSimulator.getState().user;
  return simulateDelay(user, 150);
};
