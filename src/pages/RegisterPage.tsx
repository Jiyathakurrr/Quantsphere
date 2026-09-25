import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, User as UserIcon, ArrowRight, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
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
          Create Simulated Trading Account
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Get ₹10,00,000 in virtual funds to test strategies & execute paper orders
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 py-8 px-6 sm:px-8 border border-slate-800 rounded-2xl shadow-xl space-y-4">
          
          {/* Virtual funds perk */}
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Instant ₹10,00,000 virtual balance credited upon sign up</span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              id="register-error-alert"
              className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-300">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="reg-confirm-password" className="block text-xs font-semibold text-slate-300">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="reg-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              id="register-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Claim ₹10L</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-slate-800/80 text-center text-xs text-slate-400">
            Already registered?{' '}
            <Link
              to="/login"
              id="register-to-login-link"
              className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
