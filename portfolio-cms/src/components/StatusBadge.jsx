import React from 'react';
import { CheckCircle2, XCircle, Star } from 'lucide-react';

export const StatusBadge = ({ status, isPublished, isFeatured }) => {
  const published = isPublished !== undefined ? isPublished : status === 'PUBLISHED';

  if (isFeatured) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
        <Star className="w-3 h-3 fill-amber-300" />
        <span>Featured</span>
      </span>
    );
  }

  if (published) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <CheckCircle2 className="w-3 h-3" />
        <span>Published</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
      <XCircle className="w-3 h-3" />
      <span>Draft</span>
    </span>
  );
};

export default StatusBadge;
