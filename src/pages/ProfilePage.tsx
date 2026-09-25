import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Calendar,
  Award,
  Wallet,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Server,
  Globe,
  Database,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { resetPortfolio } from '../services/api';

export const ProfilePage: React.FC = () => {
  const { user, currency, setCurrency, formatCurrency, triggerPortfolioRefresh } = useAuth();
  const [customCapital, setCustomCapital] = useState<string>('1000000');
  const [isResetting, setIsResetting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const handleResetCapital = async (e: React.FormEvent) => {
    e.preventDefault();
    const cap = parseFloat(customCapital);
    if (isNaN(cap) || cap < 1000) {
      alert('Please enter a minimum virtual fund amount of 1,000.');
      return;
    }

    if (window.confirm(`Reset simulated account balance to ${formatCurrency(cap)}? Current positions will be cleared.`)) {
      setIsResetting(true);
      try {
        await resetPortfolio(cap);
        triggerPortfolioRefresh();
        setToastMessage(`Simulated funds successfully reset to ${formatCurrency(cap)}.`);
        setTimeout(() => setToastMessage(null), 4000);
      } catch (err: any) {
        alert(err.message || 'Reset failed.');
      } finally {
        setIsResetting(false);
      }
    }
  };

  const handleClearCache = () => {
    if (window.confirm('Clear all local simulation cache and return to default state?')) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="pb-6 border-b border-slate-800/80">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
            Account & Environment Settings
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Trader Profile & Preferences
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your virtual fund allocations, default display currencies, and backend integration parameters.
          </p>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 shadow-xl animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. User Profile Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <UserIcon className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Identity & Qualifications
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-xs text-slate-400">Account Holder Name</span>
              <p className="font-bold text-white text-base">{user?.name || 'Alex Vance'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400">Email Address</span>
              <p className="font-mono text-sm text-slate-200">{user?.email || 'trader@quantsphere.io'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400">Trader Handle</span>
              <p className="font-mono text-sm text-emerald-400">@{user?.username || 'quant_alex'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400">Experience Tier</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Award className="w-3.5 h-3.5" />
                <span>{user?.experienceLevel || 'Quant'} Simulator</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2. Virtual Capital Manager */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Virtual Capital & Currency Preference
            </h2>
          </div>

          {/* Currency Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Default Display Currency
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                  currency === 'INR'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                ₹ Indian Rupee (INR)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                $ US Dollar (USD)
              </button>
            </div>
          </div>

          {/* Reset Capital Form */}
          <form onSubmit={handleResetCapital} className="space-y-3 pt-2">
            <label htmlFor="custom-capital-input" className="text-xs font-semibold text-slate-300 block">
              Reset Virtual Cash Balance
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="custom-capital-input"
                type="number"
                min="1000"
                step="10000"
                value={customCapital}
                onChange={(e) => setCustomCapital(e.target.value)}
                placeholder="1000000"
                className="w-full sm:w-64 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isResetting}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                <span>Reset Virtual Balance</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Preset default is ₹10,00,000 (approx. $100k equivalent) with 0 real-money exposure.
            </p>
          </form>
        </div>

        {/* 3. Backend & API Integration Info */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Server className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Backend Integration Guide (For Team Handoff)
            </h2>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Quantsphere is architected with a decoupled API service layer in <code className="font-mono text-emerald-400">services/api.js</code>. All mock endpoints are structured to match standard REST contracts:
          </p>

          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs space-y-2 text-slate-400">
            <div className="flex justify-between">
              <span>Environment Variable:</span>
              <span className="text-emerald-400 font-bold">VITE_API_BASE_URL</span>
            </div>
            <div className="flex justify-between">
              <span>Configured Endpoint:</span>
              <span className="text-white">{apiBaseUrl}</span>
            </div>
            <div className="flex justify-between">
              <span>Mode:</span>
              <span className="text-amber-400">Mock Provider Active (Swappable with Axios)</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleClearCache}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 cursor-pointer font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Local Storage Simulation Cache</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
