import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Layers,
  BarChart3,
  CheckCircle2,
  Lock,
  Zap,
  Globe,
  Sliders
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMarketAssets } from '../services/api';
import { MarketAsset } from '../types';
import { TrendBadge } from '../components/TrendBadge';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, formatCurrency } = useAuth();
  const [assets, setAssets] = useState<MarketAsset[]>([]);

  useEffect(() => {
    getMarketAssets().then(data => setAssets(data)).catch(() => {});
  }, []);

  const features = [
    {
      icon: Activity,
      title: 'Risk-Free Paper Trading',
      tagline: 'Simulate trades in real time',
      description: 'Practice equities and crypto execution with ₹10,00,000 in virtual funds. Zero real financial exposure, true-to-life order simulation.'
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Market Telemetry',
      tagline: 'Live quotes & indicators',
      description: 'Track price action, moving averages, RSI momentum, 24h highs/lows, and volume depth across premier market assets.'
    },
    {
      icon: Layers,
      title: 'Algorithmic Strategies',
      tagline: 'MA Crossover & RSI rules',
      description: 'Explore quantitative trading algorithms with plain-English rule breakdowns, configurable parameters, and visual signal triggers.'
    },
    {
      icon: Cpu,
      title: 'Precision Backtesting',
      tagline: 'Evaluate historical alpha',
      description: 'Backtest customized parameters against historical candles. Review Sharpe ratio, Win Rate, Max Drawdown, and complete trade logs.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-800/80">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[200px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Simulated Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Simulated Environment • No Real Money Needed</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Master the Markets with{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Algorithmic Precision
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Quantsphere delivers a high-fidelity paper trading dashboard and quantitative strategy backtester. Experiment with virtual capital, formulate rules, and validate before deploying.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                id="hero-get-started-btn"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isAuthenticated ? "Enter Terminal Dashboard" : "Launch Simulator Free"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={isAuthenticated ? "/markets" : "/login"}
                id="hero-secondary-btn"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isAuthenticated ? "Explore Live Markets" : "Existing Account Sign In"}</span>
              </Link>
            </div>

            {/* Disclaimer Callout Box */}
            <div className="mt-8 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-center justify-center gap-2 max-w-xl mx-auto">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Educational Simulation:</strong> All funds, portfolio holdings, orders, and returns are strictly virtual simulations.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Market Snapshot Bar */}
      <section className="py-6 border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulated Market Watch</span>
            </span>
            <Link
              to="/markets"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              View All Assets →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {assets.slice(0, 4).map((asset) => (
              <Link
                key={asset.symbol}
                to={`/markets/${asset.symbol}`}
                className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors group cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                    {asset.symbol}
                  </span>
                  <TrendBadge value={asset.changePercent24h} isPercent={true} size="sm" />
                </div>
                <div className="mt-2 flex justify-between items-baseline">
                  <span className="font-mono text-sm font-semibold text-slate-200">
                    {formatCurrency(asset.price)}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase">
                    {asset.type}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Engineered For Modern Traders
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Everything You Need to Formulate Your Trading Edge
          </h2>
          <p className="text-sm text-slate-400">
            A comprehensive frontend workspace designed for paper simulation, algorithmic rule-building, and backtesting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 sm:p-8 hover:border-slate-700 transition-all space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-emerald-400 shadow-inner">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                    {f.tagline}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {f.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quantitative Backtesting Highlight Banner */}
      <section className="border-t border-slate-800/80 bg-slate-900/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>ALGO ENGINE V1.0</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Test Moving Average Crossovers & RSI Momentum Instantly
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Configure lookback periods, oversold/overbought boundaries, and position sizing. Run fast historical simulations with full benchmark comparisons.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Sharpe Ratio & Max Drawdown</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Win Rate & Profit Factor</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Trade-by-Trade Audit Log</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <Link
                  to="/backtesting"
                  id="landing-try-backtest-btn"
                  className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Configure Backtest Simulator</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="font-mono font-bold text-white tracking-wider">QUANTSPHERE</span>
        </div>
        <p>
          Simulated Paper & Algorithmic Trading Platform • Built for Academic & Research Exploration.
        </p>
      </footer>
    </div>
  );
};
