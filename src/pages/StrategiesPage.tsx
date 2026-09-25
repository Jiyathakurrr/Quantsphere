import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Cpu,
  Sliders,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Activity,
  Zap,
  Info,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { getStrategies, getMarketAssets } from '../services/api';
import { StrategyDefinition, MarketAsset } from '../types';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';

export const StrategiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [strategies, setStrategies] = useState<StrategyDefinition[]>([]);
  const [assets, setAssets] = useState<MarketAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected parameters per strategy
  const [paramState, setParamState] = useState<Record<string, Record<string, any>>>({});
  const [appliedStrategyId, setAppliedStrategyId] = useState<string | null>(null);

  const fetchStrategies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [stratData, assetData] = await Promise.all([
        getStrategies(),
        getMarketAssets()
      ]);
      setStrategies(stratData);
      setAssets(assetData);

      // Initialize default params map
      const initialMap: Record<string, Record<string, any>> = {};
      stratData.forEach(s => {
        initialMap[s.id] = { ...s.defaultParams };
      });
      setParamState(initialMap);
    } catch (err: any) {
      setError(err.message || 'Failed to load strategy definitions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, []);

  const handleParamChange = (strategyId: string, key: string, value: any) => {
    setParamState(prev => ({
      ...prev,
      [strategyId]: {
        ...prev[strategyId],
        [key]: value
      }
    }));
  };

  const handleApplyStrategy = (strategyId: string) => {
    setAppliedStrategyId(strategyId);
    setTimeout(() => {
      setAppliedStrategyId(null);
    }, 3500);
  };

  const handleLaunchBacktest = (strategyId: string) => {
    const params = paramState[strategyId];
    const query = new URLSearchParams();
    query.set('strategy', strategyId);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        query.set(k, String(v));
      });
    }
    navigate(`/backtesting?${query.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Quantitative Models & Rules
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Algorithmic Strategy Catalog
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Inspect quantitative formulas, adjust threshold parameters, and launch backtesting experiments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 px-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs text-slate-300">
              <span className="text-slate-500">Active Models: </span>
              <span className="font-bold text-emerald-400">{strategies.length} Strategy Templates</span>
            </div>
          </div>
        </div>

        {/* Global Toast for Applied Strategy */}
        {appliedStrategyId && (
          <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-between gap-4 animate-fade-in shadow-xl">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                <strong>Strategy Parameters Saved!</strong> Real-time signal monitors are now evaluating your customized thresholds.
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleLaunchBacktest(appliedStrategyId)}
              className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shrink-0"
            >
              Run Full Backtest Now →
            </button>
          </div>
        )}

        {/* Error State */}
        {error && (
          <ErrorState
            title="Could not load strategies"
            message={error}
            onRetry={fetchStrategies}
          />
        )}

        {/* Loading State */}
        {isLoading && <CardSkeleton count={3} />}

        {/* Strategy Cards */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {strategies.map((strategy) => {
              const currentParams = paramState[strategy.id] || strategy.defaultParams;

              return (
                <div
                  key={strategy.id}
                  id={`strategy-card-${strategy.id}`}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-lg hover:border-slate-700 transition-colors"
                >
                  {/* Top Meta */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {strategy.category}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                            {strategy.complexity}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight mt-2">
                          {strategy.name}
                        </h2>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-emerald-400">
                        <Cpu className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Tagline & Plain English Explanation */}
                    <p className="text-xs font-semibold text-emerald-400/90 font-mono">
                      {strategy.tagline}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {strategy.explanation}
                    </p>

                    {/* Execution Rules Breakdown */}
                    <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-2.5 text-xs font-mono">
                      <div className="flex items-start gap-2">
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold shrink-0">
                          BUY RULE
                        </span>
                        <span className="text-slate-300 font-sans">{strategy.rules.buy}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 font-bold shrink-0">
                          SELL RULE
                        </span>
                        <span className="text-slate-300 font-sans">{strategy.rules.sell}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold shrink-0">
                          RISK
                        </span>
                        <span className="text-slate-300 font-sans">{strategy.rules.risk}</span>
                      </div>
                    </div>

                    {/* Configurable Parameters Form */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Configurable Parameters</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {strategy.parameters.map((param) => (
                          <div key={param.key} className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <label htmlFor={`param-${strategy.id}-${param.key}`} className="font-semibold text-slate-300">
                                {param.label}
                              </label>
                              <span className="text-[11px] font-mono text-emerald-400">
                                {currentParams[param.key]}
                              </span>
                            </div>
                            {param.type === 'select' ? (
                              <select
                                id={`param-${strategy.id}-${param.key}`}
                                value={currentParams[param.key]}
                                onChange={(e) => handleParamChange(strategy.id, param.key, e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                              >
                                {param.options?.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                id={`param-${strategy.id}-${param.key}`}
                                type="number"
                                min={param.min}
                                max={param.max}
                                step={param.step || 1}
                                value={currentParams[param.key]}
                                onChange={(e) => handleParamChange(strategy.id, param.key, Number(e.target.value))}
                                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                              />
                            )}
                            <p className="text-[10px] text-slate-500">{param.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                    <button
                      id={`apply-strategy-${strategy.id}`}
                      type="button"
                      onClick={() => handleApplyStrategy(strategy.id)}
                      className="w-full sm:w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Save Parameters</span>
                    </button>
                    <button
                      id={`backtest-strategy-${strategy.id}`}
                      type="button"
                      onClick={() => handleLaunchBacktest(strategy.id)}
                      className="w-full sm:w-1/2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Run Historical Backtest</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
