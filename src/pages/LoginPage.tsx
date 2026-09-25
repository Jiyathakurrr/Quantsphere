import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, ArrowRight, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('trader@quantsphere.io');
    setPassword('quant2026');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="font-mono font-bold text-2xl tracking-tight text-white">
              QUANTSPHERE
            </span>
          </Link>
        </div>

        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-white">
          Sign in to Simulator Terminal
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Access your paper trading portfolio, live telemetry & backtester
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 py-8 px-6 sm:px-8 border border-slate-800 rounded-2xl shadow-xl space-y-5">
          
          {/* Demo account quick fill pill */}
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-emerald-400">Quick Testing:</span> Demo credentials available
            </div>
            <button
              id="login-quick-fill-btn"
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-bold transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Fill Demo</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              id="login-error-alert"
              className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-xs font-semibold text-slate-300">
                Email Address or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@quantsphere.io"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="login-password" className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Simulated Account</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Terminal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-slate-800/80 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              id="login-to-register-link"
              className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Create simulated account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
