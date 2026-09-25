import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  TrendingUp,
  PieChart as PieIcon,
  Wallet,
  RotateCcw,
  PlusCircle,
  BarChart3,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getPortfolio, getHoldings, resetPortfolio } from '../services/api';
import { PortfolioSummary, Holding } from '../types';
import { HoldingsTable } from '../components/HoldingsTable';
import { AllocationChart } from '../components/AllocationChart';
import { PriceChart } from '../components/PriceChart';
import { StatCard } from '../components/StatCard';
import { CardSkeleton, ChartSkeleton, TableSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { TradeModal } from '../components/TradeModal';

export const PortfolioPage: React.FC = () => {
  const { formatCurrency, portfolioVersion, triggerPortfolioRefresh } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | 'ALL'>('1M');
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const fetchPortfolioData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [pData, hData] = await Promise.all([
        getPortfolio(),
        getHoldings()
      ]);
      setPortfolio(pData);
      setHoldings(hData);
    } catch (err: any) {
      setError(err.message || 'Failed to load portfolio telemetry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, [portfolioVersion]);

  const handleReset = async () => {
    if (window.confirm('Reset simulated portfolio back to default ₹10,00,000 cash balance? Current open holdings will be liquidated.')) {
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

  // Find best performing asset
  const bestAsset = holdings.length > 0
    ? [...holdings].sort((a, b) => b.unrealizedPnLPercent - a.unrealizedPnLPercent)[0]
    : null;

  return (
    <div className="min-h-screen bg-slate-950 py-8 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Asset Custody & Performance
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Portfolio Management
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Track open position P&L, sector concentration, cash reserves, and historical returns.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="portfolio-add-position-btn"
              type="button"
              onClick={() => setTradeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Simulate New Position</span>
            </button>

            <button
              id="portfolio-reset-btn"
              type="button"
              onClick={handleReset}
              disabled={isResetting}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span>Reset Portfolio</span>
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <ErrorState
            title="Portfolio Unavailable"
            message={error}
            onRetry={fetchPortfolioData}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6">
            <CardSkeleton count={4} />
            <ChartSkeleton height="h-80" />
            <TableSkeleton rows={4} />
          </div>
        )}

        {/* Success State */}
        {!isLoading && !error && portfolio && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                id="portfolio-stat-total-equity"
                title="Total Portfolio Value"
                value={formatCurrency(portfolio.totalEquity)}
                trendValue={portfolio.unrealizedPnLPercent}
                trendLabel="overall return"
                sparklineData={portfolio.sparkline}
                variant="highlight"
                icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
              />

              <StatCard
                id="portfolio-stat-available-cash"
                title="Unallocated Cash"
                value={formatCurrency(portfolio.availableCash)}
                subtitle={`${((portfolio.availableCash / portfolio.totalEquity) * 100).toFixed(1)}% of portfolio`}
                sparklineData={[portfolio.availableCash, portfolio.availableCash]}
                icon={<Wallet className="w-5 h-5 text-slate-300" />}
              />

              <StatCard
                id="portfolio-stat-unrealized-pnl"
                title="Total Unrealized P&L"
                value={formatCurrency(portfolio.unrealizedPnL)}
                trendValue={portfolio.unrealizedPnLPercent}
                trendLabel="net gain"
                sparklineData={portfolio.sparkline}
                icon={<BarChart3 className="w-5 h-5 text-teal-400" />}
              />

              <StatCard
                id="portfolio-stat-best-performer"
                title="Top Performing Asset"
                value={bestAsset ? bestAsset.symbol : 'None'}
                subtitle={bestAsset ? formatCurrency(bestAsset.unrealizedPnL) : '0 positions'}
                trendValue={bestAsset ? bestAsset.unrealizedPnLPercent : undefined}
                trendLabel={bestAsset ? 'gain' : undefined}
                icon={<Award className="w-5 h-5 text-amber-400" />}
              />
            </div>

            {/* Performance Chart & Allocation Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <PriceChart
                  id="portfolio-performance-chart"
                  title="Historical Equity Trajectory"
                  subtitle="Simulated Portfolio Growth"
                  data={portfolio.equityHistory[timeframe]}
                  timeframe={timeframe}
                  onTimeframeChange={(tf) => setTimeframe(tf as any)}
                  height={300}
                />
              </div>

              <div className="lg:col-span-5">
                <AllocationChart
                  holdings={holdings}
                  availableCash={portfolio.availableCash}
                />
              </div>
            </div>

            {/* Detailed Holdings Table Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Open Asset Positions
                  </h2>
                  <p className="text-xs text-slate-400">
                    Live valuation, cost basis, and unrealized profit/loss per instrument
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {holdings.length} Active Positions
                </span>
              </div>

              <HoldingsTable
                holdings={holdings}
                onRefresh={fetchPortfolioData}
                showFullDetails={true}
              />
            </div>
          </>
        )}

      </div>

      {/* Trade Modal */}
      {tradeModalOpen && (
        <TradeModal
          isOpen={tradeModalOpen}
          onClose={() => setTradeModalOpen(false)}
          onOrderSuccess={fetchPortfolioData}
        />
      )}
    </div>
  );
};
