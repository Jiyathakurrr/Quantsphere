import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Cpu,
  Sliders,
  Play,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  RotateCcw,
  Loader2,
  Calendar,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { getMarketAssets, getStrategies, runBacktest } from '../services/api';
import { MarketAsset, StrategyDefinition, BacktestResult, BacktestRequest } from '../types';
import { TrendBadge } from '../components/TrendBadge';
import { StatCard } from '../components/StatCard';
import { CardSkeleton, ChartSkeleton, TableSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';

export const BacktestingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { formatCurrency } = useAuth();

  const [assets, setAssets] = useState<MarketAsset[]>([]);
  const [strategies, setStrategies] = useState<StrategyDefinition[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  // Form State
  const [selectedAsset, setSelectedAsset] = useState<string>('RELIANCE');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('ma-crossover');
  const [timeframe, setTimeframe] = useState<'3M' | '6M' | '1Y' | '2Y'>('1Y');
  const [initialCapital, setInitialCapital] = useState<number>(100000);
  const [strategyParams, setStrategyParams] = useState<Record<string, any>>({});

  // Backtest Results State
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      setIsInitializing(true);
      try {
        const [assetData, stratData] = await Promise.all([
          getMarketAssets(),
          getStrategies()
        ]);
        setAssets(assetData);
        setStrategies(stratData);

        // Pre-select from URL search params if present
        const querySymbol = searchParams.get('symbol');
        const queryStrategy = searchParams.get('strategy');

        if (querySymbol && assetData.some(a => a.symbol === querySymbol)) {
          setSelectedAsset(querySymbol);
        } else if (assetData.length > 0) {
          setSelectedAsset(assetData[0].symbol);
        }

        const activeStratId = queryStrategy || 'ma-crossover';
        setSelectedStrategy(activeStratId);

        const currentStrat = stratData.find(s => s.id === activeStratId) || stratData[0];
        if (currentStrat) {
          const initialParams: Record<string, any> = { ...currentStrat.defaultParams };
          // Check for URL overrides
          searchParams.forEach((val, key) => {
            if (key !== 'symbol' && key !== 'strategy') {
              initialParams[key] = isNaN(Number(val)) ? val : Number(val);
            }
          });
          setStrategyParams(initialParams);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to initialize backtesting environment.');
      } finally {
        setIsInitializing(false);
      }
    };
    init();
  }, [searchParams]);

  // When strategy changes, update parameter defaults
  const handleStrategyChange = (stratId: string) => {
    setSelectedStrategy(stratId);
    const s = strategies.find(strat => strat.id === stratId);
    if (s) {
      setStrategyParams({ ...s.defaultParams });
    }
  };

  const handleParamChange = (key: string, val: any) => {
    setStrategyParams(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleRunBacktest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsBacktesting(true);
    setError(null);

    const request: BacktestRequest = {
      assetSymbol: selectedAsset,
      strategyId: selectedStrategy,
      timeframe,
      initialCapital,
      parameters: strategyParams
    };

    try {
      const result = await runBacktest(request);
      setBacktestResult(result);
    } catch (err: any) {
      setError(err.message || 'Backtesting execution failed.');
    } finally {
      setIsBacktesting(false);
    }
  };

  // Run backtest automatically once initialized
  useEffect(() => {
    if (!isInitializing && assets.length > 0 && strategies.length > 0 && !backtestResult) {
      handleRunBacktest();
    }
  }, [isInitializing]);

  const activeStrategyObj = strategies.find(s => s.id === selectedStrategy);

  return (
    <div className="min-h-screen bg-slate-950 py-8 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Quantitative Alpha Testing Engine
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Strategy Backtester
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Simulate rule performance against multi-period historical candles and benchmark against Buy & Hold.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
              Engine: <strong className="text-emerald-400">Deterministic Simulated Feed</strong>
            </span>
          </div>
        </div>

        {/* Configuration Setup Form */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Backtest Parameters & Settings
            </h2>
          </div>

          <form onSubmit={handleRunBacktest} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Asset Instrument */}
              <div className="space-y-1.5">
                <label htmlFor="bt-asset-select" className="text-xs font-semibold text-slate-300">
                  Target Asset
                </label>
                <select
                  id="bt-asset-select"
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  {assets.map((a) => (
                    <option key={a.symbol} value={a.symbol}>
                      {a.symbol} — {a.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Strategy Algorithm */}
              <div className="space-y-1.5">
                <label htmlFor="bt-strategy-select" className="text-xs font-semibold text-slate-300">
                  Quantitative Strategy
                </label>
                <select
                  id="bt-strategy-select"
                  value={selectedStrategy}
                  onChange={(e) => handleStrategyChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  {strategies.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timeframe Range */}
              <div className="space-y-1.5">
                <label htmlFor="bt-timeframe-select" className="text-xs font-semibold text-slate-300">
                  Historical Window
                </label>
                <select
                  id="bt-timeframe-select"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="3M">3 Months (~65 Trading Days)</option>
                  <option value="6M">6 Months (~130 Trading Days)</option>
                  <option value="1Y">1 Year (~252 Trading Days)</option>
                  <option value="2Y">2 Years (~504 Trading Days)</option>
                </select>
              </div>

              {/* Initial Capital */}
              <div className="space-y-1.5">
                <label htmlFor="bt-capital-input" className="text-xs font-semibold text-slate-300">
                  Initial Capital
                </label>
                <input
                  id="bt-capital-input"
                  type="number"
                  min="1000"
                  step="1000"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Dynamic Algorithm Parameters */}
            {activeStrategyObj && (
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-emerald-400 font-mono">
                  {activeStrategyObj.name} Parameter Tuner:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {activeStrategyObj.parameters.map((p) => (
                    <div key={p.key} className="space-y-1">
                      <label htmlFor={`bt-param-${p.key}`} className="text-[11px] font-semibold text-slate-300 block">
                        {p.label}
                      </label>
                      {p.type === 'select' ? (
                        <select
                          id={`bt-param-${p.key}`}
                          value={strategyParams[p.key] || p.defaultValue}
                          onChange={(e) => handleParamChange(p.key, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                        >
                          {p.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id={`bt-param-${p.key}`}
                          type="number"
                          min={p.min}
                          max={p.max}
                          step={p.step || 1}
                          value={strategyParams[p.key] !== undefined ? strategyParams[p.key] : p.defaultValue}
                          onChange={(e) => handleParamChange(p.key, Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Run Button */}
            <div className="flex justify-end">
              <button
                id="bt-run-engine-btn"
                type="submit"
                disabled={isBacktesting}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isBacktesting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Executing Simulation Model...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Run Backtest Engine</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <ErrorState
            title="Backtest Failed"
            message={error}
            onRetry={handleRunBacktest}
          />
        )}

        {/* Loading Skeletons during calculation */}
        {isBacktesting && (
          <div className="space-y-6">
            <CardSkeleton count={4} />
            <ChartSkeleton height="h-96" />
          </div>
        )}

        {/* Backtest Results View */}
        {!isBacktesting && backtestResult && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Metric KPI Cards Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Performance Metrics ({backtestResult.assetSymbol} • {backtestResult.timeframe})
                </h2>
                <span className="text-xs font-mono text-slate-400">
                  Initial Capital: {formatCurrency(backtestResult.initialCapital)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Total Strategy Return */}
                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 space-y-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Total Strategy Return
                  </span>
                  <div className="text-2xl font-bold font-mono text-white">
                    {formatCurrency(backtestResult.finalEquity)}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <TrendBadge
                      value={backtestResult.totalReturn}
                      prefix={backtestResult.totalReturn >= 0 ? '+' : '-'}
                      size="sm"
                    />
                    <TrendBadge
                      value={backtestResult.totalReturnPercent}
                      isPercent={true}
                      size="sm"
                    />
                  </div>
                </div>

                {/* Win Rate */}
                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 space-y-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Strategy Win Rate
                  </span>
                  <div className="text-2xl font-bold font-mono text-emerald-400">
                    {backtestResult.winRate}%
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    {backtestResult.winningTrades} Wins / {backtestResult.losingTrades} Losses
                  </p>
                </div>

                {/* Max Drawdown */}
                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 space-y-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Max Drawdown (Risk)
                  </span>
                  <div className="text-2xl font-bold font-mono text-rose-400">
                    -{backtestResult.maxDrawdownPercent}%
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Peak-to-trough drop
                  </p>
                </div>

                {/* Sharpe Ratio & Profit Factor */}
                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 space-y-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Sharpe & Profit Factor
                  </span>
                  <div className="text-2xl font-bold font-mono text-white">
                    {backtestResult.sharpeRatio} <span className="text-xs text-slate-400 font-normal">Sharpe</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Profit Factor: <strong className="text-emerald-400">{backtestResult.profitFactor}</strong>
                  </p>
                </div>

              </div>
            </div>

            {/* Strategy Equity vs Benchmark Chart */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Equity Curve: Strategy vs Buy & Hold Benchmark
                  </h3>
                  <p className="text-xs text-slate-400">
                    Comparing {backtestResult.strategyName} against baseline asset performance
                  </p>
                </div>

                <div className="flex items-center gap-4 font-mono text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-emerald-400 rounded-full" />
                    <span className="text-emerald-300 font-bold">Strategy ({backtestResult.totalReturnPercent > 0 ? '+' : ''}{backtestResult.totalReturnPercent}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-slate-500 rounded-full" />
                    <span className="text-slate-400">Benchmark ({backtestResult.benchmarkReturnPercent > 0 ? '+' : ''}{backtestResult.benchmarkReturnPercent}%)</span>
                  </div>
                </div>
              </div>

              {/* Chart Canvas */}
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={backtestResult.equityCurve} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      domain={['auto', 'auto']}
                      tickFormatter={(v) => formatCurrency(v, { precision: 0 })}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs font-mono shadow-2xl space-y-1">
                              <div className="text-slate-400 text-[10px]">{d.date}</div>
                              <div className="text-emerald-400 font-bold">
                                Strategy: {formatCurrency(d.strategyEquity)}
                              </div>
                              <div className="text-slate-400">
                                Benchmark: {formatCurrency(d.benchmarkEquity)}
                              </div>
                              {d.signal && (
                                <div className="text-amber-400 font-bold mt-1">
                                  Signal Trigger: {d.signal}
                                </div>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line type="monotone" dataKey="strategyEquity" stroke="#10b981" strokeWidth={2.5} dot={false} name="Strategy" />
                    <Line type="monotone" dataKey="benchmarkEquity" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Benchmark" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Backtested Trade Logs Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Simulated Trade Log
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sequential algorithmic entries and exits generated during backtest window
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {backtestResult.trades.length} Total Trade Events
                </span>
              </div>

              <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-sm">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b border-slate-800 bg-slate-950/80 uppercase font-semibold text-slate-400 font-sans">
                    <tr>
                      <th scope="col" className="px-4 py-3.5">Date</th>
                      <th scope="col" className="px-4 py-3.5">Type</th>
                      <th scope="col" className="px-4 py-3.5 text-right">Shares</th>
                      <th scope="col" className="px-4 py-3.5 text-right">Price</th>
                      <th scope="col" className="px-4 py-3.5 text-right">Value</th>
                      <th scope="col" className="px-4 py-3.5 text-right">Trade Return</th>
                      <th scope="col" className="px-4 py-3.5">Trigger Condition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {backtestResult.trades.map((trade) => (
                      <tr key={trade.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 text-slate-400 text-[11px] whitespace-nowrap">
                          {trade.date}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              trade.type === 'BUY'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {trade.type === 'BUY' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            <span>{trade.type}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-200">
                          {trade.shares.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-300">
                          {formatCurrency(trade.price)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-white">
                          {formatCurrency(trade.value)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {trade.pnlPercent !== undefined ? (
                            <TrendBadge
                              value={trade.pnlPercent}
                              isPercent={true}
                              size="sm"
                            />
                          ) : (
                            <span className="text-slate-500 text-[11px]">— (Entry)</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-sans text-xs text-slate-400">
                          {trade.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
