import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CurrencyCode } from '../types';
import { getUserProfile } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatCurrency: (amount: number, options?: { hideSymbol?: boolean; precision?: number }) => string;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  portfolioVersion: number;
  triggerPortfolioRefresh: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('quantsphere_auth_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
      id: 'usr-9481',
      name: 'Alex Vance',
      email: 'trader@quantsphere.io',
      username: 'quant_alex',
      joinedDate: 'August 2026',
      experienceLevel: 'Quant',
    };
  });

  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    return (localStorage.getItem('quantsphere_currency') as CurrencyCode) || 'INR';
  });

  const [portfolioVersion, setPortfolioVersion] = useState(0);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem('quantsphere_currency', c);
  };

  const triggerPortfolioRefresh = () => {
    setPortfolioVersion(prev => prev + 1);
  };

  const formatCurrency = (amount: number, options?: { hideSymbol?: boolean; precision?: number }): string => {
    const precision = options?.precision !== undefined ? options.precision : 2;
    // Conversion factor if user toggles to USD for global view
    const rate = currency === 'USD' ? 0.012 : 1; 
    const converted = amount * rate;
    const symbol = options?.hideSymbol ? '' : (currency === 'INR' ? '₹' : '$');
    
    // Formatting with commas
    const parts = converted.toLocaleString('en-IN', {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });

    return `${symbol}${parts}`;
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    // Artificial verification delay
    await new Promise(r => setTimeout(r, 400));
    if (!email || !pass) {
      throw new Error('Please enter both email and password.');
    }
    if (pass.length < 4) {
      throw new Error('Invalid credentials. Please check your password.');
    }
    const loggedUser: User = {
      id: 'usr-9481',
      name: email.split('@')[0].toUpperCase(),
      email,
      username: email.split('@')[0],
      joinedDate: 'August 2026',
      experienceLevel: 'Intermediate'
    };
    setUser(loggedUser);
    localStorage.setItem('quantsphere_auth_user', JSON.stringify(loggedUser));
    return true;
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 450));
    if (!name || !email || !pass) {
      throw new Error('All fields are required.');
    }
    const newUser: User = {
      id: `usr-${Math.floor(Math.random() * 9000 + 1000)}`,
      name,
      email,
      username: email.split('@')[0],
      joinedDate: 'August 2026',
      experienceLevel: 'Beginner'
    };
    setUser(newUser);
    localStorage.setItem('quantsphere_auth_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('quantsphere_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        currency,
        setCurrency,
        formatCurrency,
        login,
        register,
        logout,
        portfolioVersion,
        triggerPortfolioRefresh
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
