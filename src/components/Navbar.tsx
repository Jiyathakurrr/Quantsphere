import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  TrendingUp,
  Briefcase,
  Layers,
  Cpu,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  PlusCircle,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getPortfolio } from '../services/api';
import { PortfolioSummary } from '../types';
import { TradeModal } from './TradeModal';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, currency, setCurrency, formatCurrency, portfolioVersion } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      getPortfolio().then(data => setPortfolio(data)).catch(() => {});
    }
  }, [isAuthenticated, portfolioVersion]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Markets', path: '/markets', icon: TrendingUp },
    { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
    { name: 'Strategies', path: '/strategies', icon: Layers },
    { name: 'Backtesting', path: '/backtesting', icon: Cpu },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        {/* Top simulated disclaimer notice bar */}
        <div className="bg-emerald-950/40 border-b border-emerald-500/10 px-4 py-1 text-center text-[11px] text-emerald-400/90 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Paper Trading Simulation Active • Virtual Funds Only • No Real Capital at Risk</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link
                to={isAuthenticated ? "/dashboard" : "/"}
                id="navbar-brand-logo"
                className="flex items-center gap-2.5 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-lg tracking-tight text-white font-mono">
                      QUANTSPHERE
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                      SIM
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium tracking-wide -mt-0.5 hidden sm:inline">
                    Algorithmic & Paper Trading
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      id={`nav-link-${link.name.toLowerCase()}`}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                        isActive
                          ? 'bg-slate-800/90 text-emerald-400 border border-slate-700/80 shadow-sm'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span>{link.name}</span>
                    </NavLink>
                  );
                })}
              </nav>
            )}

            {/* Right Actions / Balance Chip / User controls */}
            <div className="flex items-center gap-2.5">
              {isAuthenticated ? (
                <>
                  {/* Virtual Cash Status Chip */}
                  <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 shadow-sm">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                      Cash:
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      {portfolio ? formatCurrency(portfolio.availableCash) : '...'}
                    </span>
                  </div>

                  {/* Currency Switcher */}
                  <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900 p-0.5">
                    <button
                      id="currency-toggle-inr"
                      type="button"
                      onClick={() => setCurrency('INR')}
                      className={`px-2 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer ${
                        currency === 'INR'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      ₹ INR
                    </button>
                    <button
                      id="currency-toggle-usd"
                      type="button"
                      onClick={() => setCurrency('USD')}
                      className={`px-2 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer ${
                        currency === 'USD'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      $ USD
                    </button>
                  </div>

                  {/* Quick Trade Button */}
                  <button
                    id="navbar-quick-trade-btn"
                    type="button"
                    onClick={() => setTradeModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Quick Trade</span>
                  </button>

                  {/* User Profile Link */}
                  <Link
                    to="/profile"
                    id="navbar-profile-btn"
                    title="User Profile & Settings"
                    className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                      location.pathname === '/profile'
                        ? 'bg-slate-800 text-emerald-400 border-slate-700'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <UserIcon className="w-4 h-4" />
                  </Link>

                  {/* Logout Button */}
                  <button
                    id="navbar-logout-btn"
                    type="button"
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    title="Sign Out"
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 hover:bg-rose-950/20 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    id="navbar-login-link"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    id="navbar-get-started-link"
                    className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-sm"
                  >
                    Get Started Free
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              {isAuthenticated && (
                <button
                  id="navbar-mobile-toggle"
                  type="button"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isAuthenticated && mobileOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 py-4 space-y-2">
            {/* Mobile balance info */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center mb-3">
              <span className="text-xs text-slate-400 font-semibold uppercase">Simulated Cash</span>
              <span className="font-mono text-sm font-bold text-emerald-400">
                {portfolio ? formatCurrency(portfolio.availableCash) : '...'}
              </span>
            </div>

            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  id={`mobile-nav-${link.name.toLowerCase()}`}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
              <Link
                to="/profile"
                className="text-xs text-slate-400 hover:text-white flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4" /> Profile & Settings
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Quick Trade Modal */}
      {tradeModalOpen && (
        <TradeModal
          isOpen={tradeModalOpen}
          onClose={() => setTradeModalOpen(false)}
        />
      )}
    </>
  );
};
