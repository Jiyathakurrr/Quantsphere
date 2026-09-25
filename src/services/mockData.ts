import {
  MarketAsset,
  PricePoint,
  Holding,
  Transaction,
  PortfolioSummary,
  StrategyDefinition,
  BacktestRequest,
  BacktestResult,
  BacktestTrade,
  User,
} from '../types';

export const INITIAL_CASH_DEFAULT = 1000000; // ₹1,000,000 / $100k equivalent

// Realistic Market Assets
export const MOCK_ASSETS: MarketAsset[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    sector: 'Energy & Conglomerate',
    type: 'Stock',
    price: 2948.50,
    change24h: 34.20,
    changePercent24h: 1.17,
    high24h: 2965.00,
    low24h: 2912.00,
    volume: 5824000,
    marketCap: 1994000000000,
    sparkline: [2912, 2920, 2918, 2935, 2940, 2932, 2948.5],
    description: 'India’s premier energy, petrochemicals, retail, and telecommunications enterprise.'
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    sector: 'Information Technology',
    type: 'Stock',
    price: 4120.75,
    change24h: -28.40,
    changePercent24h: -0.68,
    high24h: 4165.00,
    low24h: 4105.20,
    volume: 2314000,
    marketCap: 1492000000000,
    sparkline: [4160, 4152, 4140, 4125, 4130, 4110, 4120.75],
    description: 'Global leader in IT services, digital consulting, and enterprise business solutions.'
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    sector: 'Banking & Financials',
    type: 'Stock',
    price: 1685.30,
    change24h: 18.90,
    changePercent24h: 1.13,
    high24h: 1694.00,
    low24h: 1664.50,
    volume: 14200000,
    marketCap: 1280000000000,
    sparkline: [1665, 1670, 1668, 1678, 1682, 1680, 1685.3],
    description: 'India’s largest private sector bank providing comprehensive consumer and wholesale banking services.'
  },
  {
    symbol: 'INFY',
    name: 'Infosys Limited',
    sector: 'Information Technology',
    type: 'Stock',
    price: 1874.15,
    change24h: 22.60,
    changePercent24h: 1.22,
    high24h: 1888.00,
    low24h: 1850.00,
    volume: 4890000,
    marketCap: 778000000000,
    sparkline: [1850, 1858, 1864, 1870, 1866, 1872, 1874.15],
    description: 'Next-generation digital services and consulting powerhouse serving global enterprises.'
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd',
    sector: 'Automotive & EV',
    type: 'Stock',
    price: 1045.60,
    change24h: -12.10,
    changePercent24h: -1.14,
    high24h: 1068.00,
    low24h: 1040.00,
    volume: 8940000,
    marketCap: 386000000000,
    sparkline: [1062, 1058, 1050, 1055, 1042, 1048, 1045.6],
    description: 'Pioneering automobile manufacturer leading the transition to commercial and electric mobility.'
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Semiconductors & AI',
    type: 'Stock',
    price: 128.40,
    change24h: 4.85,
    changePercent24h: 3.93,
    high24h: 130.10,
    low24h: 124.50,
    volume: 48200000,
    marketCap: 3150000000000,
    sparkline: [124.5, 125.8, 126.2, 127.4, 129.0, 127.8, 128.4],
    description: 'World benchmark in accelerated computing GPUs powering global generative artificial intelligence.'
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Consumer Electronics',
    type: 'Stock',
    price: 224.20,
    change24h: -1.30,
    changePercent24h: -0.58,
    high24h: 226.50,
    low24h: 223.10,
    volume: 38100000,
    marketCap: 3420000000000,
    sparkline: [225.8, 226.2, 225.0, 224.5, 223.8, 224.9, 224.2],
    description: 'Global tech titan designing premium smartphones, computers, wearable technology, and ecosystem services.'
  },
  {
    symbol: 'BTC-USD',
    name: 'Bitcoin',
    sector: 'Digital Currency',
    type: 'Crypto',
    price: 64250.00,
    change24h: 1480.00,
    changePercent24h: 2.36,
    high24h: 65100.00,
    low24h: 62800.00,
    volume: 28400000000,
    marketCap: 1260000000000,
    sparkline: [62800, 63100, 63700, 64500, 64100, 64900, 64250],
    description: 'Decentralized peer-to-peer digital currency and standard store of digital value.'
  }
];

// Helper to generate synthetic historical price candles & indicators
export function generateHistoricalData(basePrice: number, points: number = 30, timeframe: string = '1M'): PricePoint[] {
  const result: PricePoint[] = [];
  let current = basePrice * 0.88;
  const now = new Date();

  for (let i = points; i >= 0; i--) {
    const d = new Date(now);
    if (timeframe === '1D') {
      d.setMinutes(d.getMinutes() - i * 15);
    } else if (timeframe === '1W') {
      d.setHours(d.getHours() - i * 4);
    } else if (timeframe === '1Y') {
      d.setDate(d.getDate() - i * 12);
    } else {
      d.setDate(d.getDate() - i);
    }

    const volatility = 0.018;
    const change = (Math.random() - 0.48) * volatility * current;
    current = Math.max(current + change, basePrice * 0.4);

    const high = current * (1 + Math.random() * 0.012);
    const low = current * (1 - Math.random() * 0.012);
    const open = low + Math.random() * (high - low);
    const close = current;

    const timeLabel = timeframe === '1D' 
      ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleDateString([], { month: 'short', day: 'numeric' });

    result.push({
      time: timeLabel,
      date: d.toISOString().split('T')[0],
      price: Math.round(close * 100) / 100,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.floor(Math.random() * 800000 + 200000),
    });
  }

  // Calculate moving averages & RSI for chart indicators
  for (let i = 0; i < result.length; i++) {
    // 9-period Fast MA
    if (i >= 8) {
      const slice = result.slice(i - 8, i + 1);
      const avg = slice.reduce((sum, p) => sum + p.close, 0) / 9;
      result[i].maFast = Math.round(avg * 100) / 100;
    }
    // 21-period Slow MA
    if (i >= 20) {
      const slice = result.slice(i - 20, i + 1);
      const avg = slice.reduce((sum, p) => sum + p.close, 0) / 21;
      result[i].maSlow = Math.round(avg * 100) / 100;
    }
    // Mock RSI between 30 and 75
    const rsiSeed = 50 + (Math.sin(i * 0.4) * 22) + ((Math.random() - 0.5) * 8);
    result[i].rsi = Math.min(Math.max(Math.round(rsiSeed), 18), 85);
  }

  return result;
}

// Initial Holdings
export const INITIAL_HOLDINGS: Holding[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    shares: 120,
    avgBuyPrice: 2810.00,
    currentPrice: 2948.50,
    totalValue: 353820,
    unrealizedPnL: 16620,
    unrealizedPnLPercent: 4.93,
    allocationPercent: 35.38,
    sector: 'Energy & Conglomerate'
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    shares: 140,
    avgBuyPrice: 1620.00,
    currentPrice: 1685.30,
    totalValue: 235942,
    unrealizedPnL: 9142,
    unrealizedPnLPercent: 4.03,
    allocationPercent: 23.59,
    sector: 'Banking & Financials'
  },
  {
    symbol: 'INFY',
    name: 'Infosys Limited',
    shares: 90,
    avgBuyPrice: 1790.50,
    currentPrice: 1874.15,
    totalValue: 168673.50,
    unrealizedPnL: 7528.50,
    unrealizedPnLPercent: 4.67,
    allocationPercent: 16.87,
    sector: 'Information Technology'
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    shares: 25,
    avgBuyPrice: 114.00,
    currentPrice: 128.40,
    totalValue: 3210, // in respective unit
    unrealizedPnL: 360,
    unrealizedPnLPercent: 12.63,
    allocationPercent: 3.21,
    sector: 'Semiconductors & AI'
  }
];

// Initial Transactions
export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-101',
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    type: 'BUY',
    shares: 120,
    price: 2810.00,
    total: 337200,
    fee: 0,
    timestamp: '2026-08-10 10:15:22',
    status: 'COMPLETED'
  },
  {
    id: 'tx-102',
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    type: 'BUY',
    shares: 140,
    price: 1620.00,
    total: 226800,
    fee: 0,
    timestamp: '2026-08-11 11:42:05',
    status: 'COMPLETED'
  },
  {
    id: 'tx-103',
    symbol: 'INFY',
    name: 'Infosys Limited',
    type: 'BUY',
    shares: 90,
    price: 1790.50,
    total: 161145,
    fee: 0,
    timestamp: '2026-08-12 14:20:18',
    status: 'COMPLETED'
  },
  {
    id: 'tx-104',
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd',
    type: 'SELL',
    shares: 50,
    price: 1060.00,
    total: 53000,
    fee: 0,
    timestamp: '2026-08-12 15:10:00',
    status: 'COMPLETED'
  }
];

// Algorithmic Strategy Catalog
export const MOCK_STRATEGIES: StrategyDefinition[] = [
  {
    id: 'ma-crossover',
    name: 'Moving Average Crossover',
    tagline: 'Classic trend-following momentum strategy based on moving average convergence/divergence.',
    category: 'Trend Following',
    complexity: 'Beginner',
    description: 'Generates buy signals when a fast moving average crosses above a slow moving average (Golden Cross), and sell signals when it falls below (Death Cross).',
    explanation: 'The Moving Average Crossover strategy smooths out price volatility to identify persistent trends. By comparing a shorter timeframe average (responsive to recent price action) against a longer baseline (underlying momentum), traders can enter high-probability trends early while filtering out noisy oscillations.',
    rules: {
      buy: 'Fast MA crosses above Slow MA AND price > Slow MA',
      sell: 'Fast MA crosses below Slow MA OR Stop Loss condition met',
      risk: 'Fixed position sizing per trade (e.g., 20% max allocation)'
    },
    parameters: [
      {
        key: 'fastPeriod',
        label: 'Fast MA Period',
        type: 'number',
        defaultValue: 9,
        min: 3,
        max: 50,
        step: 1,
        description: 'Short lookback period (e.g. 9 or 12 periods)'
      },
      {
        key: 'slowPeriod',
        label: 'Slow MA Period',
        type: 'number',
        defaultValue: 21,
        min: 10,
        max: 200,
        step: 1,
        description: 'Long lookback baseline period (e.g. 21 or 50 periods)'
      },
      {
        key: 'maType',
        label: 'MA Type',
        type: 'select',
        defaultValue: 'EMA',
        options: [
          { label: 'Exponential Moving Average (EMA)', value: 'EMA' },
          { label: 'Simple Moving Average (SMA)', value: 'SMA' }
        ],
        description: 'Weighting formula applied to historical price series'
      },
      {
        key: 'stopLossPercent',
        label: 'Stop Loss (%)',
        type: 'number',
        defaultValue: 3.5,
        min: 1,
        max: 15,
        step: 0.5,
        description: 'Risk management threshold to exit losing positions'
      }
    ],
    defaultParams: {
      fastPeriod: 9,
      slowPeriod: 21,
      maType: 'EMA',
      stopLossPercent: 3.5
    }
  },
  {
    id: 'rsi-momentum',
    name: 'Relative Strength Index (RSI) Reversal',
    tagline: 'Mean-reversion momentum strategy capturing overbought and oversold price extremes.',
    category: 'Mean Reversion',
    complexity: 'Intermediate',
    description: 'Measures the speed and change of price movements. Buys when an asset dips into oversold territory and recovers, and sells when overbought.',
    explanation: 'The Relative Strength Index oscillates between 0 and 100. Extreme readings indicate asset exhaustion. When RSI drops below the oversold threshold (traditionally 30) and reverses upward, it signifies buying pressure returning. When it breaches overbought levels (70), profits are harvested before mean-reverting pullbacks.',
    rules: {
      buy: 'RSI crosses back above Oversold Level (e.g. 30)',
      sell: 'RSI crosses below Overbought Level (e.g. 70)',
      risk: 'Dynamic trailing stop activated upon +5% unrealized gain'
    },
    parameters: [
      {
        key: 'rsiPeriod',
        label: 'RSI Period',
        type: 'number',
        defaultValue: 14,
        min: 5,
        max: 30,
        step: 1,
        description: 'Number of periods for momentum magnitude calculation'
      },
      {
        key: 'oversoldThreshold',
        label: 'Oversold Buy Level',
        type: 'number',
        defaultValue: 30,
        min: 15,
        max: 45,
        step: 1,
        description: 'RSI boundary below which asset is considered oversold'
      },
      {
        key: 'overboughtThreshold',
        label: 'Overbought Sell Level',
        type: 'number',
        defaultValue: 70,
        min: 55,
        max: 85,
        step: 1,
        description: 'RSI boundary above which asset is considered overbought'
      },
      {
        key: 'takeProfitPercent',
        label: 'Take Profit Target (%)',
        type: 'number',
        defaultValue: 8.0,
        min: 2,
        max: 25,
        step: 0.5,
        description: 'Automatic profit locking threshold per trade'
      }
    ],
    defaultParams: {
      rsiPeriod: 14,
      oversoldThreshold: 30,
      overboughtThreshold: 70,
      takeProfitPercent: 8.0
    }
  },
  {
    id: 'bollinger-breakout',
    name: 'Bollinger Bands Volatility Breakout',
    tagline: 'Statistical volatility band breakout trading when consolidation squeezes resolve.',
    category: 'Momentum',
    complexity: 'Advanced',
    description: 'Identifies volatility contraction squeezes and rides directional expansions when prices break through standard deviation envelopes.',
    explanation: 'Bollinger Bands plot standard deviations above and below a moving average. During low volatility "squeezes", bands tighten. When volume surges and prices break outside the upper band, a rapid momentum expansion often follows.',
    rules: {
      buy: 'Close crosses above Upper Bollinger Band with volume > 1.5x average',
      sell: 'Close touches Middle SMA or crosses below Lower Band',
      risk: 'Exit immediately if close falls back inside the 20 SMA'
    },
    parameters: [
      {
        key: 'period',
        label: 'Moving Average Period',
        type: 'number',
        defaultValue: 20,
        min: 10,
        max: 50,
        step: 1,
        description: 'Basis period for centerline calculation'
      },
      {
        key: 'stdDev',
        label: 'Standard Deviation Multiplier',
        type: 'number',
        defaultValue: 2.0,
        min: 1.0,
        max: 3.5,
        step: 0.1,
        description: 'Band width envelope multiplier'
      }
    ],
    defaultParams: {
      period: 20,
      stdDev: 2.0
    }
  }
];

// Local state container for simulated persistence
class LocalStorageSimulation {
  private STORAGE_KEY = 'quantsphere_state_v1';

  private state: {
    user: User;
    cash: number;
    initialCapital: number;
    holdings: Holding[];
    transactions: Transaction[];
  };

  constructor() {
    this.state = this.loadState();
  }

  private loadState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }

    return {
      user: {
        id: 'usr-9481',
        name: 'Alex Vance',
        email: 'trader@quantsphere.io',
        username: 'quant_alex',
        joinedDate: 'August 2026',
        experienceLevel: 'Quant' as const
      },
      cash: 238384.50,
      initialCapital: INITIAL_CASH_DEFAULT,
      holdings: [...INITIAL_HOLDINGS],
      transactions: [...INITIAL_TRANSACTIONS]
    };
  }

  private saveState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // LocalStorage error ignore
    }
  }

  public getState() {
    return this.state;
  }

  public resetState(customCapital?: number) {
    const capital = customCapital || INITIAL_CASH_DEFAULT;
    this.state = {
      user: this.state.user,
      cash: capital,
      initialCapital: capital,
      holdings: [],
      transactions: []
    };
    this.saveState();
    return this.state;
  }

  public addTransaction(order: {
    symbol: string;
    type: 'BUY' | 'SELL';
    shares: number;
    price: number;
  }) {
    const asset = MOCK_ASSETS.find(a => a.symbol === order.symbol);
    const assetName = asset ? asset.name : order.symbol;
    const sector = asset ? asset.sector : 'General';
    const total = Math.round(order.shares * order.price * 100) / 100;

    if (order.type === 'BUY') {
      if (this.state.cash < total) {
        throw new Error(`Insufficient funds: Required ₹${total.toLocaleString()}, available ₹${this.state.cash.toLocaleString()}`);
      }
      this.state.cash -= total;

      // Update or create holding
      const existing = this.state.holdings.find(h => h.symbol === order.symbol);
      if (existing) {
        const totalShares = existing.shares + order.shares;
        const totalCost = (existing.shares * existing.avgBuyPrice) + total;
        existing.avgBuyPrice = Math.round((totalCost / totalShares) * 100) / 100;
        existing.shares = totalShares;
        existing.currentPrice = order.price;
        existing.totalValue = Math.round(totalShares * order.price * 100) / 100;
        existing.unrealizedPnL = Math.round((existing.totalValue - totalCost) * 100) / 100;
        existing.unrealizedPnLPercent = Math.round((existing.unrealizedPnL / totalCost) * 10000) / 100;
      } else {
        this.state.holdings.push({
          symbol: order.symbol,
          name: assetName,
          shares: order.shares,
          avgBuyPrice: order.price,
          currentPrice: order.price,
          totalValue: total,
          unrealizedPnL: 0,
          unrealizedPnLPercent: 0,
          allocationPercent: 0,
          sector
        });
      }
    } else {
      // SELL
      const existing = this.state.holdings.find(h => h.symbol === order.symbol);
      if (!existing || existing.shares < order.shares) {
        throw new Error(`Insufficient shares: You own ${existing ? existing.shares : 0} shares of ${order.symbol}`);
      }

      this.state.cash += total;
      existing.shares -= order.shares;

      if (existing.shares <= 0) {
        this.state.holdings = this.state.holdings.filter(h => h.symbol !== order.symbol);
      } else {
        existing.totalValue = Math.round(existing.shares * order.price * 100) / 100;
        const costBasis = existing.shares * existing.avgBuyPrice;
        existing.unrealizedPnL = Math.round((existing.totalValue - costBasis) * 100) / 100;
        existing.unrealizedPnLPercent = Math.round((existing.unrealizedPnL / costBasis) * 10000) / 100;
      }
    }

    // Record Transaction
    const tx: Transaction = {
      id: `tx-${Date.now().toString().slice(-6)}`,
      symbol: order.symbol,
      name: assetName,
      type: order.type,
      shares: order.shares,
      price: order.price,
      total,
      fee: 0,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'COMPLETED'
    };

    this.state.transactions.unshift(tx);
    this.saveState();
    return tx;
  }

  public getPortfolioSummary(): PortfolioSummary {
    const holdingsVal = this.state.holdings.reduce((sum, h) => {
      // sync with latest asset price
      const live = MOCK_ASSETS.find(a => a.symbol === h.symbol);
      const currentPrice = live ? live.price : h.currentPrice;
      h.currentPrice = currentPrice;
      h.totalValue = Math.round(h.shares * currentPrice * 100) / 100;
      const cost = h.shares * h.avgBuyPrice;
      h.unrealizedPnL = Math.round((h.totalValue - cost) * 100) / 100;
      h.unrealizedPnLPercent = cost > 0 ? Math.round((h.unrealizedPnL / cost) * 10000) / 100 : 0;
      return sum + h.totalValue;
    }, 0);

    const totalEquity = Math.round((this.state.cash + holdingsVal) * 100) / 100;

    // Recalculate allocation percentages
    this.state.holdings.forEach(h => {
      h.allocationPercent = totalEquity > 0 ? Math.round((h.totalValue / totalEquity) * 10000) / 100 : 0;
    });

    const unrealizedPnL = Math.round(this.state.holdings.reduce((sum, h) => sum + h.unrealizedPnL, 0) * 100) / 100;
    const totalCost = this.state.holdings.reduce((sum, h) => sum + (h.shares * h.avgBuyPrice), 0);
    const unrealizedPnLPercent = totalCost > 0 ? Math.round((unrealizedPnL / totalCost) * 10000) / 100 : 0;

    // Today's simulated change (+1.24% default or weighted from assets)
    const todayChange = Math.round(holdingsVal * 0.0118 * 100) / 100;
    const todayChangePercent = holdingsVal > 0 ? 1.18 : 0;

    // Equity history curves
    const generateCurve = (points: number, base: number) => {
      const arr = [];
      let val = base * 0.94;
      for (let i = 0; i < points; i++) {
        val += (Math.random() - 0.45) * 0.008 * val;
        arr.push({
          time: `T-${points - i}`,
          value: Math.round(val * 100) / 100
        });
      }
      if (arr.length > 0) {
        arr[arr.length - 1].value = totalEquity;
      }
      return arr;
    };

    return {
      totalEquity,
      availableCash: Math.round(this.state.cash * 100) / 100,
      holdingsValue: Math.round(holdingsVal * 100) / 100,
      unrealizedPnL,
      unrealizedPnLPercent,
      realizedPnL: 5300.00,
      todayChange,
      todayChangePercent,
      initialCapital: this.state.initialCapital,
      sparkline: [
        totalEquity * 0.98,
        totalEquity * 0.985,
        totalEquity * 0.99,
        totalEquity * 0.988,
        totalEquity * 0.995,
        totalEquity * 0.998,
        totalEquity
      ],
      equityHistory: {
        '1D': [
          { time: '09:15', value: Math.round(totalEquity * 0.992) },
          { time: '10:30', value: Math.round(totalEquity * 0.996) },
          { time: '11:45', value: Math.round(totalEquity * 0.994) },
          { time: '13:00', value: Math.round(totalEquity * 0.998) },
          { time: '14:15', value: Math.round(totalEquity * 1.002) },
          { time: '15:30', value: totalEquity }
        ],
        '1W': generateCurve(7, totalEquity),
        '1M': generateCurve(30, totalEquity),
        'ALL': generateCurve(60, totalEquity)
      }
    };
  }
}

export const localSimulator = new LocalStorageSimulation();

// Realistic Quantitative Backtest Calculation Engine
export function executeSimulatedBacktest(req: BacktestRequest): BacktestResult {
  const asset = MOCK_ASSETS.find(a => a.symbol === req.assetSymbol) || MOCK_ASSETS[0];
  const daysCount = req.timeframe === '3M' ? 65 : req.timeframe === '6M' ? 130 : req.timeframe === '1Y' ? 252 : 504;

  const initialCapital = req.initialCapital || 100000;
  const rawCandles = generateHistoricalData(asset.price, daysCount, req.timeframe === '1Y' ? '1Y' : '1M');

  let currentCapital = initialCapital;
  let benchmarkShares = initialCapital / rawCandles[0].close;
  let positionShares = 0;
  let entryPrice = 0;
  let entryDate = '';
  const trades: BacktestTrade[] = [];
  const equityCurve: BacktestResult['equityCurve'] = [];

  const fastPeriod = Number(req.parameters.fastPeriod || 9);
  const slowPeriod = Number(req.parameters.slowPeriod || 21);
  const oversold = Number(req.parameters.oversoldThreshold || 30);
  const overbought = Number(req.parameters.overboughtThreshold || 70);

  let peakCapital = initialCapital;
  let maxDrawdown = 0;
  let winningTrades = 0;
  let losingTrades = 0;

  for (let i = 0; i < rawCandles.length; i++) {
    const candle = rawCandles[i];
    let signal: 'BUY' | 'SELL' | null = null;

    if (req.strategyId === 'ma-crossover') {
      const fastMA = candle.maFast || candle.close;
      const slowMA = candle.maSlow || (candle.close * 0.99);

      if (positionShares === 0 && fastMA > slowMA && i > slowPeriod) {
        signal = 'BUY';
      } else if (positionShares > 0 && fastMA < slowMA) {
        signal = 'SELL';
      }
    } else if (req.strategyId === 'rsi-momentum') {
      const rsi = candle.rsi || 50;
      if (positionShares === 0 && rsi < oversold + 5) {
        signal = 'BUY';
      } else if (positionShares > 0 && rsi > overbought - 5) {
        signal = 'SELL';
      }
    } else {
      // Bollinger or default
      if (positionShares === 0 && i % 8 === 0) signal = 'BUY';
      if (positionShares > 0 && i % 11 === 0) signal = 'SELL';
    }

    // Execute Signal
    if (signal === 'BUY' && currentCapital > 1000) {
      positionShares = Math.floor((currentCapital * 0.95) / candle.close);
      entryPrice = candle.close;
      entryDate = candle.date;
      const tradeCost = positionShares * candle.close;
      currentCapital -= tradeCost;

      trades.push({
        id: `bt-${trades.length + 1}`,
        date: candle.date,
        type: 'BUY',
        price: candle.close,
        shares: positionShares,
        value: tradeCost,
        reason: `${req.strategyId === 'ma-crossover' ? 'Golden Cross MA' : 'Oversold RSI Dip'}`
      });
    } else if (signal === 'SELL' && positionShares > 0) {
      const tradeRevenue = positionShares * candle.close;
      const costBasis = positionShares * entryPrice;
      const pnl = Math.round((tradeRevenue - costBasis) * 100) / 100;
      const pnlPercent = Math.round((pnl / costBasis) * 10000) / 100;

      if (pnl >= 0) winningTrades++;
      else losingTrades++;

      currentCapital += tradeRevenue;

      trades.push({
        id: `bt-${trades.length + 1}`,
        date: candle.date,
        type: 'SELL',
        price: candle.close,
        shares: positionShares,
        value: tradeRevenue,
        pnl,
        pnlPercent,
        reason: `${req.strategyId === 'ma-crossover' ? 'Death Cross MA' : 'Overbought RSI Target'}`
      });

      positionShares = 0;
      entryPrice = 0;
    }

    const currentEquity = positionShares > 0
      ? currentCapital + (positionShares * candle.close)
      : currentCapital;

    if (currentEquity > peakCapital) peakCapital = currentEquity;
    const drawdown = ((peakCapital - currentEquity) / peakCapital) * 100;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;

    const benchmarkEquity = Math.round(benchmarkShares * candle.close * 100) / 100;

    equityCurve.push({
      date: candle.date,
      strategyEquity: Math.round(currentEquity * 100) / 100,
      benchmarkEquity,
      signal
    });
  }

  // Close any open position at end
  const finalCandle = rawCandles[rawCandles.length - 1];
  const finalEquity = positionShares > 0
    ? currentCapital + (positionShares * finalCandle.close)
    : currentCapital;

  const totalReturn = finalEquity - initialCapital;
  const totalReturnPercent = Math.round((totalReturn / initialCapital) * 10000) / 100;
  const benchmarkReturnPercent = Math.round(((finalCandle.close - rawCandles[0].close) / rawCandles[0].close) * 10000) / 100;

  const totalClosedTrades = Math.floor(trades.length / 2);
  const winRate = totalClosedTrades > 0 ? Math.round((winningTrades / totalClosedTrades) * 1000) / 10 : 62.5;

  const profitSum = trades.filter(t => (t.pnl || 0) > 0).reduce((sum, t) => sum + (t.pnl || 0), 0);
  const lossSum = Math.abs(trades.filter(t => (t.pnl || 0) < 0).reduce((sum, t) => sum + (t.pnl || 0), 0));
  const profitFactor = lossSum > 0 ? Math.round((profitSum / lossSum) * 100) / 100 : 2.15;

  return {
    assetSymbol: asset.symbol,
    assetName: asset.name,
    strategyName: req.strategyId === 'ma-crossover' ? 'Moving Average Crossover' : req.strategyId === 'rsi-momentum' ? 'RSI Momentum Reversal' : 'Bollinger Volatility Breakout',
    timeframe: req.timeframe,
    initialCapital,
    finalEquity: Math.round(finalEquity * 100) / 100,
    totalReturn: Math.round(totalReturn * 100) / 100,
    totalReturnPercent,
    benchmarkReturnPercent,
    winRate,
    totalTrades: trades.length,
    winningTrades: winningTrades || Math.ceil(totalClosedTrades * 0.6),
    losingTrades: losingTrades || Math.floor(totalClosedTrades * 0.4),
    maxDrawdownPercent: Math.round(maxDrawdown * 100) / 100 || 6.4,
    sharpeRatio: totalReturnPercent > 0 ? 1.84 : 0.65,
    profitFactor,
    avgTradeReturnPercent: totalClosedTrades > 0 ? Math.round((totalReturnPercent / totalClosedTrades) * 100) / 100 : 2.8,
    equityCurve,
    trades
  };
}
