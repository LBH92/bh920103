import React from 'react';

interface MarketBadgeProps {
  market: 'KOSPI' | 'KOSDAQ' | 'US';
  exchange?: string;
  className?: string;
}

export const MarketBadge: React.FC<MarketBadgeProps> = ({ market, exchange, className = "" }) => {
  const getBadgeStyles = () => {
    if (market === 'US') {
      if (exchange === 'NASDAQ') return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20';
      if (exchange === 'NYSE') return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
      if (exchange === 'AMEX') return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20';
    }
    if (market === 'KOSPI') return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20';
    if (market === 'KOSDAQ') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
    return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20';
  };

  const label = exchange || market;

  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getBadgeStyles()} ${className}`}>
      {label}
    </span>
  );
};
