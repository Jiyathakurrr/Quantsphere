import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  Cpu,
  Layers,
  Info,
  DollarSign,
  BarChart3,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { getAssetDetail, submitOrder, getPortfolio } from '../services/api';
import { MarketAsset, PricePoint, PortfolioSummary } from '../types';
import { TrendBadge } from '../components/TrendBadge';
import { CardSkeleton, ChartSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { TradeModal } from '../components/TradeModal';

export const AssetDetailPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { formatCurrency, triggerPortfolioRefresh } = useAuth();
  const navigate = useNavigate();

  const [asset, setAsset] = useState<MarketAsset | null>(null);
  const [history, setHistory] = useState<PricePoint[]>([]);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1M');
  const [showIndicators, setShowIndicators] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inline Trade Form State
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [sharesInput, setSharesInput] = useState('10');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tradeSuccess, setTradeSuccess] = useState<string | null>(null);
  const [tradeError, setTradeError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchDetail = async () => {
    if (!symbol) return;
    setIsLoading(true);
    setError(null);
    try {
      const [detailData, pData] = await Promise.all([
        getAssetDetail(symbol, timeframe),
        getPortfolio()
      ]);
      setAsset(detailData.asset);
      setHistory(detailData.history);
      setPortfolio(pData);
    } catch (err: any) {
      setError(err.message || 'Failed to load asset details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [symbol, timeframe]);

  const shares = parseFloat(sharesInput) || 0;
  const currentPrice = asset ? asset.price : 0;
  const estimatedTotal = Math.round(shares * currentPrice * 100) / 100;
  const availableCash = portfolio ? portfolio.availableCash : 0;
  const isAffordable = orderType === 'SELL' || availableCash >= estimatedTotal;

  const handleExecuteTrade = async () => {
    if (!asset) return;
    setIsSubmitting(true);
    setTradeError(null);
    setTradeSuccess(null);

    try {
      const res = await submitOrder({
        symbol: asset.symbol,
        type: orderType,
        shares,
        price: currentPrice
      });

      if (res.success) {
        setTradeSuccess(res.message);
        setShowConfirmModal(false);
        triggerPortfolioRefresh();
        // Refresh cash balance
        const updatedP = await getPortfolio();
        setPortfolio(updatedP);
      }
    } catch (err: any) {
      setTradeError(err.message || 'Order failed to execute.');
      setShowConfirmModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error || (!isLoading && !asset)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ErrorState
          title="Asset Not Found"
          message={error || `Could not find trading instrument "${symbol}".`}
          onRetry={fetchDetail}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Back Link & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/markets"
            id="asset-detail-back-link"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Markets Watchlist</span>
          </Link>

          {asset && (
            <Link
              to={`/backtesting?symbol=${asset.symbol}`}
              id="asset-detail-backtest-link"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors w-fit"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Backtest Algorithms on {asset.symbol}</span>
            </Link>
          )}
        </div>

        {isLoading || !asset ? (
          <div className="space-y-6">
            <CardSkeleton count={4} />
            <ChartSkeleton height="h-96" />
          </div>
        ) : (
          <>
            {/* Primary Asset Telemetry Header */}
            <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-extrabold font-mono text-white tracking-tight">
                    {asset.symbol}
                  </h1>
                  <span className="text-xs uppercase font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                    {asset.type}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {asset.sector}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-300">
                  {asset.name}
                </p>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  {asset.description}
                </p>
              </div>

              {/* Price & 24h Metrics */}
              <div className="flex flex-col md:items-end gap-2 shrink-0">
                <span className="text-xs text-slate-400 uppercase font-semibold">
                  Live Simulated Quote
                </span>
                <div className="font-mono text-3xl sm:text-4xl font-extrabold text-white">
                  {formatCurrency(asset.price)}
                </div>
                <div className="flex items-center gap-2">
                  <TrendBadge value={asset.change24h} prefix={asset.change24h >= 0 ? '+' : '-'} />
                  <TrendBadge value={asset.changePercent24h} isPercent={true} />
                </div>
              </div>
            </div>

            {/* Main Interactive Chart & Trading Terminal Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left: Chart & Indicators */}
              <div className="lg:col-span-8 space-y-4">
                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 space-y-4">
                  {/* Controls Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Interactive Price Action
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Indicator toggle */}
                      <button
                        id="chart-toggle-indicators-btn"
                        type="button"
                        onClick={() => setShowIndicators(!showIndicators)}
                        className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-colors cursor-pointer ${
                          showIndicators
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        {showIndicators ? 'Indicators: ON (MA 9/21)' : 'Indicators: OFF'}
                      </button>

                      {/* Timeframe selector */}
                      <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-0.5">
                        {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
                          <button
                            key={tf}
                            id={`asset-tf-${tf.toLowerCase()}`}
                            type="button"
                            onClick={() => setTimeframe(tf)}
                            className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-md transition-all cursor-pointer ${
                              timeframe === tf
                                ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {tf}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Main Price Canvas */}
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={history} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                        <defs>
                          <linearGradient id="assetGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
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
                                <div className="rounded-lg border border-slate-700 bg-slate-900 p-3 shadow-2xl font-mono text-xs space-y-1">
                                  <div className="text-slate-400 text-[10px]">{d.date || d.time}</div>
                                  <div className="font-bold text-emerald-400 text-sm">
                                    Close: {formatCurrency(d.close || d.price)}
                                  </div>
                                  {showIndicators && d.maFast && (
                                    <div className="text-cyan-400 text-[11px]">Fast MA(9): {formatCurrency(d.maFast)}</div>
                                  )}
                                  {showIndicators && d.maSlow && (
                                    <div className="text-amber-400 text-[11px]">Slow MA(21): {formatCurrency(d.maSlow)}</div>
                                  )}
                                  {d.rsi && (
                                    <div className="text-purple-400 text-[11px]">RSI(14): {d.rsi}</div>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} fill="url(#assetGradient)" />
                        {showIndicators && (
                          <Line type="monotone" dataKey="maFast" stroke="#06b6d4" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                        )}
                        {showIndicators && (
                          <Line type="monotone" dataKey="maSlow" stroke="#f59e0b" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                        )}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Indicator Legend */}
                  {showIndicators && (
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-2 border-t border-slate-800/80 text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 bg-emerald-400 rounded-full" />
                        <span>Price Action</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 bg-cyan-400 rounded-full" />
                        <span>Fast MA (9)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 bg-amber-400 rounded-full" />
                        <span>Slow MA (21)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Key Statistics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">24h High</span>
                    <p className="font-mono font-bold text-white text-sm mt-0.5">{formatCurrency(asset.high24h)}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">24h Low</span>
                    <p className="font-mono font-bold text-white text-sm mt-0.5">{formatCurrency(asset.low24h)}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Volume (24h)</span>
                    <p className="font-mono font-bold text-slate-200 text-sm mt-0.5">{asset.volume.toLocaleString()}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Market Cap</span>
                    <p className="font-mono font-bold text-slate-200 text-sm mt-0.5">{formatCurrency(asset.marketCap, { precision: 0 })}</p>
                  </div>
                </div>
              </div>

              {/* Right: Simulated Order Execution Panel */}
              <div className="lg:col-span-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-xl sticky top-24">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                      Simulated Order Desk
                    </span>
                    <h2 className="text-lg font-bold text-white">
                      Execute {asset.symbol}
                    </h2>
                  </div>

                  {/* Feedback alerts */}
                  {tradeSuccess && (
                    <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{tradeSuccess}</span>
                    </div>
                  )}

                  {tradeError && (
                    <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{tradeError}</span>
                    </div>
                  )}

                  {/* Buy / Sell Tabs */}
                  <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                    <button
                      id="detail-tab-buy"
                      type="button"
                      onClick={() => setOrderType('BUY')}
                      className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        orderType === 'BUY'
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      BUY
                    </button>
                    <button
                      id="detail-tab-sell"
                      type="button"
                      onClick={() => setOrderType('SELL')}
                      className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        orderType === 'SELL'
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      SELL
                    </button>
                  </div>

                  {/* Quantity Input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <label htmlFor="detail-shares-input" className="font-semibold text-slate-300">
                        Quantity (Shares)
                      </label>
                      <span className="text-slate-400 font-mono">
                        Cash: {formatCurrency(availableCash)}
                      </span>
                    </div>
                    <input
                      id="detail-shares-input"
                      type="number"
                      min="1"
                      step="1"
                      value={sharesInput}
                      onChange={(e) => setSharesInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Order Summary Box */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Execution Price</span>
                      <span className="text-white">{formatCurrency(currentPrice)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Quantity</span>
                      <span className="text-white">{shares} Units</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm">
                      <span className="text-slate-300 font-sans">Estimated Total:</span>
                      <span className={isAffordable ? 'text-emerald-400' : 'text-rose-400'}>
                        {formatCurrency(estimatedTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    id="detail-submit-order-btn"
                    type="button"
                    disabled={!isAffordable || shares <= 0 || isSubmitting}
                    onClick={() => setShowConfirmModal(true)}
                    className={`w-full py-3 rounded-xl font-bold text-xs tracking-wide transition-all shadow-md active:scale-95 cursor-pointer ${
                      orderType === 'BUY'
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                        : 'bg-rose-500 hover:bg-rose-400 text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <span>Place Simulated {orderType} Order</span>
                  </button>

                  <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Instant virtual settlement • 0 slippage simulated</span>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}

      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && asset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">
              Confirm {orderType} Order
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to execute a simulated {orderType} order for <strong className="text-white">{shares} shares</strong> of <strong className="text-white">{asset.symbol}</strong> at {formatCurrency(currentPrice)} per share?
            </p>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Total Value:</span>
                <span className="font-bold text-emerald-400">{formatCurrency(estimatedTotal)}</span>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="w-1/2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteTrade}
                disabled={isSubmitting}
                className={`w-1/2 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 ${
                  orderType === 'BUY' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                }`}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
