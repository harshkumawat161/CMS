import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Loading data from server...' }) => {
  return (
    <div className="min-h-[45vh] flex flex-col items-center justify-center text-slate-400 p-8">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <Loader2 className="w-5 h-5 text-indigo-400 absolute" />
      </div>
      <p className="text-sm font-medium text-slate-300 tracking-wide">{message}</p>
      <p className="text-xs text-slate-500 mt-1">Connecting to REST endpoints</p>
    </div>
  );
};

export default LoadingState;
