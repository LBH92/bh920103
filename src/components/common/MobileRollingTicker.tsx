import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { validateExchangeRate } from '../../utils/currency';
import { globalMarketClient } from '../../services/globalMarketClient';
import { GlobalMarketSummaryResponse } from '../../types';

export const MobileRollingTicker: React.FC = () => {
  const { indices, exchangeRate, stocks } = useApp();
  const [globalSummary, setGlobalSummary] = useState<GlobalMarketSummaryResponse | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    globalMarketClient.getSummary().then(res => setGlobalSummary(res)).catch(() => {});
    
    const updateTime = () => {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      setCurrentDateTime(`${yyyy}.${mm}.${dd} ${hh}:${min}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // Extract key items
  const kospi = indices.find(i => i.symbol === 'KOSPI');
  const kosdaq = indices.find(i => i.symbol === 'KOSDAQ');

  const usGroup = globalSummary?.groups?.us || [];
  const nasdaq = usGroup.find(i => i.symbol === 'NASDAQ' || i.name.includes('나스닥'));
  const sp500 = usGroup.find(i => i.symbol === 'S&P500' || i.name.includes('S&P'));
  const dow = usGroup.find(i => i.symbol === 'DOW' || i.name.includes('다우'));

  const fxCheck = validateExchangeRate(exchangeRate);
  
  const btc = stocks.find(s => s.symbol === 'KRW-BTC' || s.symbol === 'BTC' || s.symbol === 'BTC-USD');
  const eth = stocks.find(s => s.symbol === 'KRW-ETH' || s.symbol === 'ETH' || s.symbol === 'ETH-USD');

  const tickerItems = [
    kospi && { label: 'KOSPI', val: kospi.value.toLocaleString(undefined, { maximumFractionDigits: 2 }), change: kospi.changePercent },
    kosdaq && { label: 'KOSDAQ', val: kosdaq.value.toLocaleString(undefined, { maximumFractionDigits: 2 }), change: kosdaq.changePercent },
    nasdaq && { label: 'NASDAQ', val: Number(nasdaq.value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 }), change: nasdaq.changePercent || 0 },
    sp500 && { label: 'S&P 500', val: Number(sp500.value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 }), change: sp500.changePercent || 0 },
    dow && { label: 'DOW', val: Number(dow.value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 }), change: dow.changePercent || 0 },
    fxCheck.valid && fxCheck.rate && { label: 'USD/KRW', val: fxCheck.rate.toLocaleString(undefined, { maximumFractionDigits: 2 }), change: exchangeRate?.changePercent || 0 },
    btc && { label: 'BTC', val: btc.price.toLocaleString(), change: btc.changePercent },
    eth && { label: 'ETH', val: eth.price.toLocaleString(), change: eth.changePercent },
  ].filter(Boolean) as { label: string; val: string; change: number }[];

  if (tickerItems.length === 0) return null;

  return (
    <div 
      className="md:hidden h-[26px] bg-finance-sub-bg/95 border-b border-finance-border overflow-hidden relative flex items-center select-none text-[10.5px] font-mono"
    >
      {/* Fixed Date & Time on the Left */}
      <div className="shrink-0 px-2.5 bg-finance-card border-r border-finance-border text-finance-sub-text font-bold z-10 flex items-center tracking-tighter">
        {currentDateTime || '2026.11.18 05:00'}
      </div>

      {/* Rolling Ticker Area on the Right */}
      <div 
        className="flex-1 overflow-hidden relative flex items-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div 
          ref={containerRef}
          className={`flex items-center gap-6 whitespace-nowrap animate-marquee px-4 ${isPaused ? '[animation-play-state:paused]' : ''}`}
          style={{
            animationDuration: '25s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
        >
          {[...tickerItems, ...tickerItems].map((item, idx) => {
            const isUp = item.change >= 0;
            return (
              <div key={`${item.label}-${idx}`} className="inline-flex items-center gap-1.5 shrink-0">
                <span className="font-bold text-finance-sub-text">{item.label}</span>
                <span className="font-semibold text-finance-text">{item.val}</span>
                <span className={`font-bold tabular-nums ${isUp ? 'text-finance-up' : 'text-finance-down'}`}>
                  {isUp ? '+' : ''}{item.change.toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
