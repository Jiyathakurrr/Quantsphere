import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Wallet,
  TrendingUp,
  BarChart3,
  Layers,
  Cpu,
  PlusCircle,
  RotateCcw,
  Sliders,
  Calendar,
  AlertCircle,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getPortfolio,
  getHoldings,
  getTransactions,
  getMarketAssets,
  resetPortfolio
} from '../services/api';
import {
  PortfolioSummary,
  Holding,
  Transaction,
  MarketAsset
} from '../types';
import { StatCard } from '../components/StatCard';
import { PriceChart } from '../components/PriceChart';
import { HoldingsTable } from '../components/HoldingsTable';
import { MarketPulseWidget } from '../components/MarketPulseWidget';
import { AllocationChart } from '../components/AllocationChart';
import { TransactionTable } from '../components/TransactionTable';
import { CardSkeleton, ChartSkeleton, TableSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { TrendBadge } from '../components/TrendBadge';
import { TradeModal } from '../components/TradeModal';

export const DashboardPage: React.FC = () => {
  const { formatCurrency, portfolioVersion, triggerPortfolioRefresh } = useAuth();

  // Async data states
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [marketAssets, setMarketAssets] = useState<MarketAsset[]>([]);

  // Page states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | 'ALL'>('1M');
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [pData, hData, txData, mData] = await Promise.all([
        getPortfolio(),
        getHoldings(),
        getTransactions(),
        getMarketAssets()
      ]);

      setPortfolio(pData);
      setHoldings(hData);
      setTransactions(txData);
      setMarketAssets(mData);
    } catch (err: any) {
      setError(err.message || 'Failed to load simulated dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [portfolioVersion]);

  const handleResetFunds = async () => {
    if (window.confirm('Reset simulated account back to default ₹10,00,000 cash balance? This will clear current holdings.')) {
      setIsResetting(true);
      try {
        await resetPortfolio();
        triggerPortfolioRefresh();
      } catch (err: any) {
        alert(err.message || 'Reset failed.');
      } finally {
        setIsResetting(false);
      }
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ErrorState
          id="dashboard-error-state"
          title="Terminal Connection Failed"
          message={error}
          onRetry={fetchDashboardData}
        />
      </div>
    );
  }

  // Active equity chart points based on timeframe toggle
  const currentChartData = portfolio ? portfolio.equityHistory[timeframe] : [];

  return (
    <div className="min-h-screen bg-slate-950 py-8 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header with Distinct Non-Duplicated Telemetry (Today's Change vs Equity) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                Active Terminal Session
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Trading Desk Overview
            </h1>
          </div>

          {/* Header Metric: Daily Market Movement (Does NOT duplicate Total Equity) */}
          <div className="flex flex-wrap items-center gap-3">
            {portfolio && (
              <div className="p-2.5 px-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Today's Net Change
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">
                      {formatCurrency(portfolio.todayChange)}
                    </span>
                    <TrendBadge
                      value={portfolio.todayChangePercent}
                      isPercent={true}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quick Action CTAs */}
            <button
              id="dashboard-trade-btn"
              type="button"
              onClick={() => setTradeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Simulate Order</span>
            </button>

            <Link
              to="/backtesting"
              id="dashboard-run-backtest-link"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Run Backtest</span>
            </Link>

            <button
              id="dashboard-reset-funds-btn"
              type="button"
              onClick={handleResetFunds}
              disabled={isResetting}
              title="Reset Virtual Funds to Default"
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 1. Summary Stat Cards Row */}
        {isLoading ? (
          <CardSkeleton count={4} />
        ) : portfolio ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Portfolio Equity */}
            <StatCard
              id="stat-total-equity"
              title="Total Portfolio Equity"
              value={formatCurrency(portfolio.totalEquity)}
              trendValue={portfolio.unrealizedPnLPercent}
              trendLabel="total return"
              sparklineData={portfolio.sparkline}
              variant="highlight"
              icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
            />

            {/* Available Virtual Cash */}
            <StatCard
              id="stat-available-cash"
              title="Available Cash"
              value={formatCurrency(portfolio.availableCash)}
              subtitle="Virtual liquidity ready to deploy"
              sparklineData={[portfolio.availableCash, portfolio.availableCash]}
              icon={<Wallet className="w-5 h-5 text-slate-300" />}
            />

            {/* Holdings Market Value */}
            <StatCard
              id="stat-holdings-value"
              title="Holdings Market Value"
              value={formatCurrency(portfolio.holdingsValue)}
              subtitle={`${holdings.length} open position${holdings.length === 1 ? '' : 's'}`}
              trendValue={portfolio.todayChangePercent}
              trendLabel="today"
              sparklineData={holdings.length > 0 ? portfolio.sparkline : []}
              icon={<Briefcase className="w-5 h-5 text-teal-400" />}
            />

            {/* Unrealized P&L */}
            <StatCard
              id="stat-unrealized-pnl"
              title="Unrealized P&L"
              value={formatCurrency(portfolio.unrealizedPnL)}
              trendValue={portfolio.unrealizedPnLPercent}
              trendLabel="overall gain"
              sparklineData={portfolio.sparkline}
              icon={<BarChart3 className="w-5 h-5 text-amber-400" />}
            />
          </div>
        ) : null}

        {/* 2. Main Equity Performance Chart & Market Pulse Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-8">
            {isLoading ? (
              <ChartSkeleton height="h-96" />
            ) : (
              <PriceChart
                id="dashboard-equity-chart"
                title="Portfolio Equity Performance"
                subtitle="Simulated Net Worth Curve"
                data={currentChartData}
                timeframe={timeframe}
                onTimeframeChange={(tf) => setTimeframe(tf as any)}
                height={320}
                emptyLabel="Start trading to see your equity curve"
              />
            )}
          </div>

          {/* Market Pulse Watchlist Widget */}
          <div className="lg:col-span-4">
            <MarketPulseWidget assets={marketAssets} />
          </div>
        </div>

        {/* 3. Holdings Summary Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Current Holdings
              </h2>
              <p className="text-xs text-slate-400">
                Active open positions simulated with real-time quote feeds
              </p>
            </div>
            {holdings.length > 0 && (
              <Link
                to="/portfolio"
                id="dashboard-view-full-portfolio-link"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
              >
                <span>Full Portfolio Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {isLoading ? (
            <TableSkeleton rows={4} />
          ) : (
            <HoldingsTable
              holdings={holdings}
              onRefresh={fetchDashboardData}
            />
          )}
        </div>

        {/* 4. Portfolio Allocation & Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Allocation Donut */}
          <div className="lg:col-span-5">
            {portfolio && (
              <AllocationChart
                holdings={holdings}
                availableCash={portfolio.availableCash}
              />
            )}
          </div>

          {/* Recent Transactions List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Recent Simulated Executions
              </h3>
              <Link
                to="/transactions"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                All Orders →
              </Link>
            </div>

            {isLoading ? (
              <TableSkeleton rows={3} />
            ) : (
              <TransactionTable
                transactions={transactions}
                limit={4}
                showViewAll={transactions.length > 4}
              />
            )}
          </div>
        </div>

        {/* Algorithmic Strategy Banner */}
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
              <Layers className="w-4 h-4" />
              <span>ALGO TRADING LAB</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Ready to automate your trading logic?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore the Moving Average Crossover and RSI Momentum rule templates. Adjust parameter thresholds and run simulated backtests across multi-year asset candles.
            </p>
          </div>
          <Link
            to="/strategies"
            id="dashboard-explore-strategies-btn"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-md active:scale-95 whitespace-nowrap cursor-pointer"
          >
            Explore Algo Strategies →
          </Link>
        </div>

      </div>

      {/* Global Trade Modal */}
      {tradeModalOpen && (
        <TradeModal
          isOpen={tradeModalOpen}
          onClose={() => setTradeModalOpen(false)}
          onOrderSuccess={fetchDashboardData}
        />
      )}
    </div>
  );
};
