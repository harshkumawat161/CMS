import React from 'react';

export const CardSkeleton: React.FC<{ count?: number; className?: string }> = ({
  count = 3,
  className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
}) => {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 animate-pulse"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-800 mb-4" />
          <div className="h-5 bg-slate-800 rounded-md w-3/4 mb-3" />
          <div className="h-3.5 bg-slate-800/80 rounded w-full mb-2" />
          <div className="h-3.5 bg-slate-800/80 rounded w-4/5 mb-4" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-slate-800 rounded-md" />
            <div className="h-6 w-16 bg-slate-800 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const TimelineSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 p-6 rounded-2xl border border-slate-800 bg-slate-900/40 animate-pulse"
        >
          <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-slate-800 rounded w-1/3" />
            <div className="h-4 bg-slate-800/80 rounded w-1/4" />
            <div className="h-3 bg-slate-800/60 rounded w-full" />
            <div className="h-3 bg-slate-800/60 rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
};
