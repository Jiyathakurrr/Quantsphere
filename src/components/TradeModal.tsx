import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, ArrowRight, ShieldAlert, Loader2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { submitOrder, getMarketAssets, getPortfolio } from '../services/api';
import { MarketAsset, PortfolioSummary } from '../types';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSymbol?: string;
  defaultType?: 'BUY' | 'SELL';
  onOrderSuccess?: () => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  onClose,
  defaultSymbol,
  defaultType = 'BUY',
  onOrderSuccess
}) => {
  const { formatCurrency, triggerPortfolioRefresh } = useAuth();
  const [assets, setAssets] = useState<MarketAsset[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>(defaultSymbol || 'RELIANCE');
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>(defaultType);
  const [sharesInput, setSharesInput] = useState<string>('10');
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);

  // States: 'FORM' | 'CONFIRM' | 'SUCCESS'
  const [step, setStep] = useState<'FORM' | 'CONFIRM' | 'SUCCESS'>('FORM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    getMarketAssets().then(data => {
      setAssets(data);
      if (defaultSymbol) {
        setSelectedSymbol(defaultSymbol);
      } else if (data.length > 0 && !selectedSymbol) {
        setSelectedSymbol(data[0].symbol);
      }
    });

    getPortfolio().then(data => setPortfolio(data));
  }, [defaultSymbol]);

  if (!isOpen) return null;

  const currentAsset = assets.find(a => a.symbol === selectedSymbol) || assets[0];
  const shares = parseFloat(sharesInput) || 0;
  const currentPrice = currentAsset ? currentAsset.price : 0;
  const estimatedTotal = Math.round(shares * currentPrice * 100) / 100;
  const availableCash = portfolio ? portfolio.availableCash : 0;
  const isAffordable = orderType === 'SELL' || availableCash >= estimatedTotal;

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isNaN(shares) || shares <= 0) {
      setErrorMessage('Please enter a valid share quantity greater than 0.');
      return;
    }

    if (orderType === 'BUY' && estimatedTotal > availableCash) {
      setErrorMessage(`Insufficient virtual funds. Required ${formatCurrency(estimatedTotal)}, but only ${formatCurrency(availableCash)} available.`);
      return;
    }

    setStep('CONFIRM');
  };

  const handleExecuteTrade = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await submitOrder({
        symbol: selectedSymbol,
        type: orderType,
        shares,
        price: currentPrice
      });

      if (response.success) {
        setSuccessMessage(response.message);
        setStep('SUCCESS');
        triggerPortfolioRefresh();
        if (onOrderSuccess) onOrderSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Simulated trade execution failed.');
      setStep('FORM');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setStep('FORM');
    setErrorMessage(null);
    setSuccessMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        id="trade-modal-container"
        className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 overflow-hidden"
      >
        {/* Close Button */}
        <button
          id="trade-modal-close-btn"
          type="button"
          onClick={handleResetAndClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step 1: ORDER INPUT FORM */}
        {step === 'FORM' && (
          <form onSubmit={handleProceedToConfirm} className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Paper Trading Terminal
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Simulate Market Order
              </h2>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Buy / Sell Toggle Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                id="trade-tab-buy"
                type="button"
                onClick={() => setOrderType('BUY')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  orderType === 'BUY'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>BUY (LONG)</span>
              </button>
              <button
                id="trade-tab-sell"
                type="button"
                onClick={() => setOrderType('SELL')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  orderType === 'SELL'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>SELL (SHORT/EXIT)</span>
              </button>
            </div>

            {/* Asset Selector */}
            <div className="space-y-1.5">
              <label htmlFor="asset-select" className="text-xs font-semibold text-slate-300">
                Select Asset
              </label>
              <select
                id="asset-select"
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {assets.map((a) => (
                  <option key={a.symbol} value={a.symbol} className="bg-slate-900 text-white">
                    {a.symbol} — {a.name} ({formatCurrency(a.price)})
                  </option>
                ))}
              </select>
            </div>

            {/* Asset quick telemetry */}
            {currentAsset && (
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-400">Current Market Price:</span>
                  <p className="font-mono font-bold text-white text-sm">
                    {formatCurrency(currentPrice)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400">Available Virtual Cash:</span>
                  <p className="font-mono font-bold text-emerald-400">
                    {formatCurrency(availableCash)}
                  </p>
                </div>
              </div>
            )}

            {/* Share Quantity Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="shares-input" className="text-xs font-semibold text-slate-300">
                  Quantity (Shares)
                </label>
                <div className="flex gap-1.5">
                  {[5, 10, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSharesInput(preset.toString())}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
              <input
                id="shares-input"
                type="number"
                min="1"
                step="1"
                value={sharesInput}
                onChange={(e) => setSharesInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Enter quantity..."
                required
              />
            </div>

            {/* Order Summary Calculation */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Estimated Value</span>
                <span className="font-mono text-slate-200">
                  {shares} × {formatCurrency(currentPrice)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Trading Fee (Simulated)</span>
                <span className="font-mono text-emerald-400">₹0.00 (Free)</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
                <span className="text-white">Total Order Value:</span>
                <span className={`font-mono ${isAffordable ? 'text-white' : 'text-rose-400'}`}>
                  {formatCurrency(estimatedTotal)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-3">
              <button
                id="trade-modal-cancel-btn"
                type="button"
                onClick={handleResetAndClose}
                className="w-1/3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="trade-modal-review-btn"
                type="submit"
                disabled={!isAffordable || shares <= 0}
                className={`w-2/3 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${
                  orderType === 'BUY'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    : 'bg-rose-500 hover:bg-rose-400 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span>Review Simulated Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: CONFIRMATION DIALOG */}
        {step === 'CONFIRM' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">
                Confirm Simulated Order
              </h2>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Please verify your order parameters before executing on the simulated paper exchange.
            </p>

            <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Action:</span>
                <span className={`font-bold ${orderType === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {orderType} ORDER
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Asset:</span>
                <span className="text-white font-bold">{currentAsset.name} ({currentAsset.symbol})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Quantity:</span>
                <span className="text-white font-bold">{shares} Units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Execution Price:</span>
                <span className="text-white">{formatCurrency(currentPrice)}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm">
                <span className="text-slate-300">Total Settlement:</span>
                <span className="text-emerald-400">{formatCurrency(estimatedTotal)}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                id="trade-modal-back-btn"
                type="button"
                disabled={isSubmitting}
                onClick={() => setStep('FORM')}
                className="w-1/3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
              >
                Edit
              </button>
              <button
                id="trade-modal-confirm-btn"
                type="button"
                disabled={isSubmitting}
                onClick={handleExecuteTrade}
                className={`w-2/3 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                  orderType === 'BUY'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    : 'bg-rose-500 hover:bg-rose-400 text-white'
                } disabled:opacity-60`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Executing Trade...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm & Execute</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: SUCCESS FEEDBACK */}
        {step === 'SUCCESS' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Order Executed Successfully</h2>
              <p className="mt-1 text-xs text-slate-400">{successMessage}</p>
            </div>
            <button
              id="trade-modal-done-btn"
              type="button"
              onClick={handleResetAndClose}
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Done / Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
