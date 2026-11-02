import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search } from 'lucide-react';

type MarketTab = 'OVERALL' | 'KR' | 'US' | 'CRYPTO';

export const SidebarStockList: React.FC = () => {
  const { 
    stocks, 
    watchlist, 
    navigateToStock, 
    setIsSearchOpen 
  } = useApp();

  const [activeTab, setActiveTab] = useState<MarketTab>('OVERALL');

  const getFilteredStocks = () => {
    switch (activeTab) {
      case 'KR': return stocks.filter(s => s.market === 'KOSPI' || s.market === 'KOSDAQ').slice(0, 10);
      case 'US': return stocks.filter(s => s.market === 'US').slice(0, 10);
      case 'CRYPTO': return []; // Placeholder for crypto
      default: return watchlist
        .map(symbol => stocks.find(s => s.symbol === symbol))
        .filter((s): s is typeof stocks[0] => Boolean(s));
    }
  };

  const displayStocks = getFilteredStocks();

  const tabs: { id: MarketTab; label: string }[] = [
    { id: 'OVERALL', label: '종합' },
    { id: 'KR', label: '한국' },
    { id: 'US', label: '미장' },
    { id: 'CRYPTO', label: '코인' },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#131722]">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-[11px] font-bold ${
              activeTab === tab.id 
                ? 'text-rose-600 dark:text-rose-400 border-b-2 border-rose-600 dark:border-rose-400' 
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Header with search */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
          {tabs.find(t => t.id === activeTab)?.label} 시장
        </h3>
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100 dark:bg-slate-800 rounded-md cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 px-3 py-2 text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10">
        <div className="col-span-5">종목</div>
        <div className="col-span-3 text-right">현재가</div>
        <div className="col-span-4 text-right">등락%</div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-y-auto">
        {displayStocks.map(stock => {
          const isUp = stock.change >= 0;
          return (
            <div
              key={stock.symbol}
              onClick={() => navigateToStock(stock.symbol)}
              className="grid grid-cols-12 px-3 py-2.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer border-b border-slate-100 dark:border-slate-800/50 transition-colors"
            >
              <div className="col-span-5 truncate pr-1">
                <div className="font-bold text-slate-900 dark:text-white truncate">{stock.name}</div>
                <div className="text-[10px] text-slate-400 font-mono">{stock.symbol}</div>
              </div>
              <div className="col-span-3 text-right font-mono font-medium text-slate-700 dark:text-slate-300">
                {stock.price.toLocaleString()}
              </div>
              <div className="col-span-4 text-right font-mono font-bold">
                <span className={isUp ? 'text-rose-500' : 'text-blue-500'}>
                  {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
        {displayStocks.length === 0 && (
          <div className="p-4 text-center text-xs text-slate-400">
            데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};
