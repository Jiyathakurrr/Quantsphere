import React, { useState, useEffect } from 'react';
import { History, Filter, Search, ArrowUpRight, ArrowDownRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getTransactions, getMarketAssets } from '../services/api';
import { Transaction, MarketAsset } from '../types';
import { TransactionTable } from '../components/TransactionTable';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';

export const TransactionsPage: React.FC = () => {
  const { formatCurrency, portfolioVersion } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [marketAssets, setMarketAssets] = useState<MarketAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedSymbol, setSelectedSymbol] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [txData, assetData] = await Promise.all([
        getTransactions({
          symbol: selectedSymbol !== 'ALL' ? selectedSymbol : undefined,
          type: selectedType !== 'ALL' ? selectedType : undefined
        }),
        getMarketAssets()
      ]);
      setTransactions(txData);
      setMarketAssets(assetData);
    } catch (err: any) {
      setError(err.message || 'Failed to load transaction history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [selectedSymbol, selectedType, portfolioVersion]);

  // Client search filtering
  const filteredTxs = transactions.filter(t => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return t.symbol.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
  });

  const totalVolume = filteredTxs.reduce((sum, t) => sum + t.total, 0);
  const buyCount = filteredTxs.filter(t => t.type === 'BUY').length;
  const sellCount = filteredTxs.filter(t => t.type === 'SELL').length;

  return (
    <div className="min-h-screen bg-slate-950 py-8 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Audit & Execution Logs
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Transaction History
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Complete historical record of simulated orders, executions, and algorithm fills.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 px-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs text-slate-300">
              <span className="text-slate-500">Cumulative Volume: </span>
              <span className="font-bold text-white">{formatCurrency(totalVolume)}</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="tx-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID or asset symbol..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Asset Selector */}
          <div className="sm:col-span-3">
            <select
              id="tx-asset-filter"
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="ALL">All Assets</option>
              {marketAssets.map((a) => (
                <option key={a.symbol} value={a.symbol}>
                  {a.symbol}
                </option>
              ))}
            </select>
          </div>

          {/* Order Type Selector */}
          <div className="sm:col-span-3">
            <select
              id="tx-type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="ALL">All Order Types (BUY & SELL)</option>
              <option value="BUY">BUY Orders Only</option>
              <option value="SELL">SELL Orders Only</option>
            </select>
          </div>
        </div>

        {/* Breakdown chips */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
            <span>Total Executions:</span>
            <strong className="text-white">{filteredTxs.length}</strong>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-emerald-400">
            <span>BUY Orders:</span>
            <strong>{buyCount}</strong>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-950/30 border border-rose-500/20 text-rose-400">
            <span>SELL Orders:</span>
            <strong>{sellCount}</strong>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <ErrorState
            title="Could not load transactions"
            message={error}
            onRetry={fetchTransactions}
          />
        )}

        {/* Loading State */}
        {isLoading && <TableSkeleton rows={6} />}

        {/* Success / Table View */}
        {!isLoading && !error && (
          <TransactionTable
            transactions={filteredTxs}
          />
        )}

      </div>
    </div>
  );
};
