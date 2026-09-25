import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  BarChart2,
  DollarSign,
  Activity,
  Layers
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { getMarketAssets } from '../services/api';
import { MarketAsset } from '../types';
import { TrendBadge } from '../components/TrendBadge';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { TradeModal } from '../components/TradeModal';

export const MarketsPage: React.FC = () => {
  const { formatCurrency } = useAuth();
  const [assets, setAssets] = useState<MarketAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  // Trade Modal
  const [tradeSymbol, setTradeSymbol] = useState<string | null>(null);

  const fetchMarkets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMarketAssets(searchQuery, selectedSector);
      setAssets(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load market telemetry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, [searchQuery, selectedSector]);

  // Client-side filtering by asset type
  const filteredAssets = assets.filter(a => {
    if (selectedType === 'ALL') return true;
    return a.type === selectedType;
  });

  const sectors = ['ALL', 'Information Technology', 'Banking & Financials', 'Energy & Conglomerate', 'Automotive & EV', 'Semiconductors & AI', 'Consumer Electronics', 'Digital Currency'];

  return (
    <div className="min-h-screen bg-slate-950 py-8 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Live Paper Exchange
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Market Telemetry & Watchlist
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Explore equities, technology giants, and digital assets available for simulated paper trading.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
              <span className="text-slate-500">Tracked Assets: </span>
              <span className="font-bold text-emerald-400">{filteredAssets.length} Instruments</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="markets-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by symbol or company name (e.g. RELIANCE, NVDA, TCS)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Sector Selector */}
          <div className="sm:col-span-3">
            <select
              id="markets-sector-filter"
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec} className="bg-slate-900 text-white">
                  {sec === 'ALL' ? 'All Sectors' : sec}
                </option>
              ))}
            </select>
          </div>

          {/* Asset Type Filter */}
          <div className="sm:col-span-3">
            <select
              id="markets-type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="ALL">All Asset Types</option>
              <option value="Stock">Stocks & Equities</option>
              <option value="Crypto">Crypto & Digital</option>
            </select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <ErrorState
            title="Could not load market assets"
            message={error}
            onRetry={fetchMarkets}
          />
        )}

        {/* Loading State */}
        {isLoading && <TableSkeleton rows={6} />}

        {/* Empty State */}
        {!isLoading && !error && filteredAssets.length === 0 && (
          <EmptyState
            icon={Search}
            title="No assets match your search"
            description={`We couldn't find any instruments matching "${searchQuery}". Try clearing filters or searching for symbols like RELIANCE, TCS, INFY, or NVDA.`}
            actionText="Clear Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedSector('ALL');
              setSelectedType('ALL');
            }}
          />
        )}

        {/* Assets Table */}
        {!isLoading && !error && filteredAssets.length > 0 && (
          <div className="w-full overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/60 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/80 uppercase font-semibold text-slate-400">
                <tr>
                  <th scope="col" className="px-4 py-3.5">Asset Symbol & Name</th>
                  <th scope="col" className="px-4 py-3.5 hidden md:table-cell">Sector</th>
                  <th scope="col" className="px-4 py-3.5 text-right font-mono">Market Price</th>
                  <th scope="col" className="px-4 py-3.5 text-right font-mono">24h Change</th>
                  <th scope="col" className="px-4 py-3.5 text-right font-mono hidden sm:table-cell">24h High / Low</th>
                  <th scope="col" className="px-4 py-3.5 text-right font-mono hidden lg:table-cell">Volume</th>
                  <th scope="col" className="px-4 py-3.5 text-center hidden sm:table-cell">Trend (7D)</th>
                  <th scope="col" className="px-4 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredAssets.map((asset) => {
                  const isPositive = asset.changePercent24h >= 0;
                  const sparkColor = isPositive ? '#34d399' : '#f87171';
                  const sparkData = asset.sparkline.map((v, i) => ({ i, v }));

                  return (
                    <tr
                      key={asset.symbol}
                      id={`market-asset-row-${asset.symbol.toLowerCase()}`}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Asset & Name */}
                      <td className="px-4 py-3.5">
                        <Link
                          to={`/markets/${asset.symbol}`}
                          className="flex flex-col group-hover:text-emerald-400 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">
                              {asset.symbol}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-slate-400 px-1.5 py-0.2 rounded bg-slate-800 font-sans">
                              {asset.type}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-sans truncate max-w-[150px] sm:max-w-[220px]">
                            {asset.name}
                          </span>
                        </Link>
                      </td>

                      {/* Sector */}
                      <td className="px-4 py-3.5 hidden md:table-cell font-sans text-slate-400 text-xs">
                        {asset.sector}
                      </td>

                      {/* Market Price */}
                      <td className="px-4 py-3.5 text-right font-bold text-white text-sm">
                        {formatCurrency(asset.price)}
                      </td>

                      {/* 24h Change with strict +/- and icon */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <TrendBadge
                            value={asset.change24h}
                            prefix={asset.change24h >= 0 ? '+' : '-'}
                            size="sm"
                          />
                          <TrendBadge
                            value={asset.changePercent24h}
                            isPercent={true}
                            size="sm"
                          />
                        </div>
                      </td>

                      {/* 24h High / Low */}
                      <td className="px-4 py-3.5 text-right text-slate-400 text-[11px] hidden sm:table-cell">
                        <div>H: {formatCurrency(asset.high24h)}</div>
                        <div>L: {formatCurrency(asset.low24h)}</div>
                      </td>

                      {/* Volume */}
                      <td className="px-4 py-3.5 text-right text-slate-300 text-xs hidden lg:table-cell">
                        {asset.volume.toLocaleString()}
                      </td>

                      {/* Mini Sparkline */}
                      <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                        <div className="w-20 h-7 mx-auto">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sparkData}>
                              <Line
                                type="monotone"
                                dataKey="v"
                                stroke={sparkColor}
                                strokeWidth={1.5}
                                dot={false}
                                isAnimationActive={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5 font-sans">
                          <button
                            id={`trade-btn-${asset.symbol.toLowerCase()}`}
                            type="button"
                            onClick={() => setTradeSymbol(asset.symbol)}
                            className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-sm cursor-pointer"
                          >
                            Trade
                          </button>
                          <Link
                            to={`/markets/${asset.symbol}`}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                            title="Interactive Chart & Metrics"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Trade Modal */}
      {tradeSymbol && (
        <TradeModal
          isOpen={!!tradeSymbol}
          defaultSymbol={tradeSymbol}
          onClose={() => setTradeSymbol(null)}
          onOrderSuccess={() => {
            setTradeSymbol(null);
          }}
        />
      )}
    </div>
  );
};
