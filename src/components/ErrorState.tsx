import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  id?: string;
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  id,
  title = 'Failed to load data',
  message,
  onRetry
}) => {
  return (
    <div
      id={id || 'error-state-card'}
      className="flex flex-col items-center justify-center text-center p-8 rounded-xl border border-rose-900/40 bg-rose-950/20 text-rose-200"
    >
      <div className="w-12 h-12 rounded-xl bg-rose-900/50 border border-rose-700/50 flex items-center justify-center text-rose-300 mb-3">
        <AlertCircle className="w-6 h-6 stroke-[2]" />
      </div>
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      <p className="mt-1 text-xs text-rose-300/80 max-w-sm">{message}</p>
      
      {onRetry && (
        <button
          id="error-state-retry-btn"
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Request</span>
        </button>
      )}
    </div>
  );
};
