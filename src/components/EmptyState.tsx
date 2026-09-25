import React from 'react';
import { LucideIcon, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  id?: string;
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  id,
  icon: Icon = FolderOpen,
  title,
  description,
  actionText,
  actionHref,
  onAction
}) => {
  return (
    <div
      id={id || 'empty-state-card'}
      className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-xl border border-dashed border-slate-800 bg-slate-900/30"
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        <Icon className="w-7 h-7 stroke-[1.75]" />
      </div>
      <h3 className="text-base font-semibold text-white tracking-tight">
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-slate-400 max-w-sm leading-relaxed">
        {description}
      </p>
      
      {(actionText && (actionHref || onAction)) && (
        <div className="mt-5">
          {actionHref ? (
            <Link
              to={actionHref}
              id="empty-state-action-link"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              {actionText}
            </Link>
          ) : (
            <button
              id="empty-state-action-btn"
              type="button"
              onClick={onAction}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
