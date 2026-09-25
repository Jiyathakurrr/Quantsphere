import React from 'react';

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3 animate-pulse"
        >
          <div className="h-3.5 w-24 bg-slate-800 rounded" />
          <div className="h-7 w-36 bg-slate-800 rounded" />
          <div className="pt-2 border-t border-slate-800/60 flex justify-between items-center">
            <div className="h-4 w-16 bg-slate-800 rounded" />
            <div className="h-4 w-12 bg-slate-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden animate-pulse">
      <div className="h-12 border-b border-slate-800 bg-slate-900/80 px-6 flex items-center gap-4">
        <div className="h-4 w-24 bg-slate-800 rounded" />
        <div className="h-4 w-32 bg-slate-800 rounded ml-auto" />
      </div>
      <div className="divide-y divide-slate-800/60 p-4 space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 pt-2">
            <div className="space-y-1.5">
              <div className="h-4 w-28 bg-slate-800 rounded" />
              <div className="h-3 w-16 bg-slate-800/60 rounded" />
            </div>
            <div className="h-4 w-20 bg-slate-800 rounded" />
            <div className="h-4 w-16 bg-slate-800 rounded" />
            <div className="h-7 w-16 bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChartSkeleton: React.FC<{ height?: string }> = ({ height = 'h-72' }) => {
  return (
    <div className={`w-full ${height} rounded-xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between animate-pulse`}>
      <div className="flex justify-between items-center">
        <div className="h-4 w-36 bg-slate-800 rounded" />
        <div className="h-7 w-48 bg-slate-800 rounded" />
      </div>
      <div className="h-40 w-full bg-slate-800/30 rounded-lg flex items-end p-4 gap-2">
        <div className="w-full h-1/2 bg-slate-800/60 rounded" />
        <div className="w-full h-3/4 bg-slate-800/60 rounded" />
        <div className="w-full h-2/3 bg-slate-800/60 rounded" />
        <div className="w-full h-full bg-slate-800/60 rounded" />
      </div>
    </div>
  );
};
