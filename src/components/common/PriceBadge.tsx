import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface PriceBadgeProps {
  change: number;
  changePercent: number;
  price?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showPrice?: boolean;
  showIcon?: boolean;
  showSign?: boolean;
  pill?: boolean;
}

export const PriceBadge: React.FC<PriceBadgeProps> = ({
  change,
  changePercent,
  price,
  size = 'md',
  showPrice = false,
  showIcon = true,
  showSign = true,
  pill = false,
}) => {
  const isUp = change > 0;
  const isDown = change < 0;
  const isFlat = change === 0;

  // Financial design tokens: Rising = text-finance-up, Falling = text-finance-down
  const textColor = isUp
    ? 'text-finance-up'
    : isDown
    ? 'text-finance-down'
    : 'text-finance-sub-text';

  const bgColor = isUp
    ? 'bg-finance-up/10 text-finance-up border-finance-up/25'
    : isDown
    ? 'bg-finance-down/10 text-finance-down border-finance-down/25'
    : 'bg-finance-sub-bg text-finance-sub-text border-finance-border';

  const sizeClasses = {
    sm: 'text-xs tablet:text-[11.5px]',
    md: 'text-sm tablet:text-[13px] font-semibold',
    lg: 'text-base tablet:text-[15px] font-bold',
    xl: 'text-xl tablet:text-[18px] font-bold',
  }[size];

  const sign = isUp ? '+' : '';

  const content = (
    <span className={`inline-flex items-center gap-1 font-mono tracking-tight tabular-nums whitespace-nowrap ${textColor} ${sizeClasses}`}>
      {showIcon && (
        isUp ? (
          <ArrowUpRight className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
        ) : isDown ? (
          <ArrowDownRight className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
        ) : (
          <Minus className="w-3 h-3 shrink-0" />
        )
      )}
      {showPrice && price !== undefined && (
        <span className="font-semibold text-finance-text mr-1.5 font-sans">
          {price.toLocaleString()}원
        </span>
      )}
      <span>
        {showSign ? sign : ''}{changePercent.toFixed(2)}%
      </span>
      {change !== 0 && (
        <span className="text-[0.8em] opacity-80 ml-0.5 tabular-nums">
          ({showSign ? sign : ''}{change.toLocaleString()})
        </span>
      )}
    </span>
  );

  if (pill) {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-semibold tabular-nums whitespace-nowrap ${bgColor}`}>
        {content}
      </span>
    );
  }

  return content;
};
