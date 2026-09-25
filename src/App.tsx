import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';

// Page Imports
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { MarketsPage } from './pages/MarketsPage';
import { AssetDetailPage } from './pages/AssetDetailPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { StrategiesPage } from './pages/StrategiesPage';
import { BacktestingPage } from './pages/BacktestingPage';
import { ProfilePage } from './pages/ProfilePage';

// Layout Wrapper to optionally hide Navbar on auth pages if desired, but our Navbar has links for both
const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/markets" element={<MarketsPage />} />
          <Route path="/markets/:symbol" element={<AssetDetailPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/strategies" element={<StrategiesPage />} />
          <Route path="/backtesting" element={<BacktestingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      
      {/* Global Terminal Footer (shown on all non-auth pages) */}
      {!isAuthPage && (
        <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-white tracking-wider">QUANTSPHERE</span>
              <span>• Educational Quantitative Paper Trading Simulator</span>
            </div>
            <div className="font-mono text-[11px] text-slate-400">
              Virtual Balance Model • 0 Real Financial Risk
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

