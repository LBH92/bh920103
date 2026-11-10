import React, { useState, useMemo, useEffect } from 'react';
import { stockRepository } from '../../services/stockRepository';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  Zap, 
  Bookmark, 
  ArrowUpRight, 
  ArrowDownRight, 
  ChevronRight, 
  X,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Stock } from '../../types';
import { isSurgeGain, isSurgeLoss, isVolumeSurge } from '../../utils/marketThresholds';
import { matchHangulSearch } from '../../utils/hangul';
import { isUSStockSymbol } from '../../utils/stocks/ticker';

type MobileTabType = 'watchlist' | 'surge' | 'plunge' | 'volume' | 'kr' | 'us' | 'coin';

export const HomeMobileDashboard: React.FC = () => {
  const { 
    indices, 
    stocks, 
    exchangeRate, 
    watchlist, 
    isWatchlisted, 
    navigateToStock, 
    navigateToIndex,
    setIsSearchOpen 
  } = useApp();

  const [activeTab, setActiveTab] = useState<MobileTabType>('watchlist');
  const [searchFilter, setSearchFilter] = useState<'ALL' | 'KR' | 'US' | 'COIN'>('ALL');
  const [query, setQuery] = useState<string>('');

  // 1. Search Results if user types in mobile search box
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handler = setTimeout(async () => {
      const q = query.trim();
      if (q.length >= 2) {
        setIsSearching(true);
        try {
          const results = await stockRepository.searchStocks({ 
            query: q, 
            limit: 15,
            market: searchFilter !== 'ALL' ? searchFilter : undefined
          });
          setSearchResults(results);
        } catch (err) {
          console.error('[HomeMobileDashboard] Search API error:', err);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 200);

    return () => clearTimeout(handler);
  }, [query, searchFilter]);

  // 2. Filtered Stocks for the Active Tab
  const tabStocks = useMemo(() => {
    switch (activeTab) {
      case 'watchlist':
        return stocks.filter(s => isWatchlisted(s.symbol));
      case 'surge':
        return [...stocks].filter(s => isSurgeGain(s.changePercent)).sort((a, b) => b.changePercent - a.changePercent);
      case 'plunge':
        return [...stocks].filter(s => isSurgeLoss(s.changePercent)).sort((a, b) => a.changePercent - b.changePercent);
      case 'volume':
        return [...stocks].filter(s => isVolumeSurge(s.volumeRatio)).sort((a, b) => (b.volumeRatio || 0) - (a.volumeRatio || 0));
      case 'kr':
        return stocks.filter(s => s.market === 'KOSPI' || s.market === 'KOSDAQ');
      case 'us':
        return stocks.filter(s => s.market === 'US' || isUSStockSymbol(s.symbol));
      case 'coin':
        return stocks.filter(s => s.market === 'COIN' || s.symbol.includes('-'));
      default:
        return stocks;
    }
  }, [stocks, activeTab, isWatchlisted]);

  const mobileTabs: MobileTabType[] = ['watchlist', 'surge', 'plunge', 'volume', 'kr', 'us', 'coin'];
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    const idx = mobileTabs.indexOf(activeTab);
    if (diff > 50 && idx < mobileTabs.length - 1) {
      setActiveTab(mobileTabs[idx + 1]);
    } else if (diff < -50 && idx > 0) {
      setActiveTab(mobileTabs[idx - 1]);
    }
    setTouchStartX(null);
  };

  // Extract Major Indices
  const kospi = indices.find(i => i.symbol === 'KOSPI');
  const kosdaq = indices.find(i => i.symbol === 'KOSDAQ');

  return (
    <div className="block md:hidden space-y-4 pb-20 select-none animate-in fade-in duration-150 text-finance-text">
      {/* 1. Mobile Top Search Bar with Market Filter */}
      <div className="p-3.5 rounded-2xl bg-finance-card border border-finance-border shadow-xs space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-finance-accent absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="종목명·티커·코드 검색 (삼성전자, NVDA, 비트코인)"
            className="w-full pl-9 pr-8 py-2 bg-finance-sub-bg border border-finance-border rounded-xl text-xs text-finance-text placeholder:text-finance-sub-text focus:outline-none focus:ring-1 focus:ring-finance-accent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-2 text-finance-sub-text p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Market Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
          {[
            { id: 'ALL', label: '전체 통합' },
            { id: 'KR', label: '🇰🇷 한국' },
            { id: 'US', label: '🇺🇸 미국' },
            { id: 'COIN', label: '🪙 가상자산' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSearchFilter(f.id as any)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-colors ${
                searchFilter === f.id
                  ? 'bg-finance-accent text-white shadow-xs'
                  : 'bg-finance-sub-bg text-finance-sub-text hover:text-finance-text'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Instant Search Results Dropdown */}
        {query.trim() && (
          <div className="pt-2 border-t border-finance-border max-h-60 overflow-y-auto divide-y divide-finance-border/50">
            {searchResults.length === 0 ? (
              <div className="py-4 text-center text-xs text-finance-sub-text">
                일치하는 검색 결과가 없습니다.
              </div>
            ) : (
              searchResults.map(stock => {
                const isUSD = stock.currency === 'USD' || stock.market === 'US';
                const isUp = stock.change >= 0;
                return (
                  <div
                    key={stock.symbol}
                    onClick={() => {
                      navigateToStock(stock.symbol);
                      setQuery('');
                    }}
                    className="py-2 px-1 flex items-center justify-between cursor-pointer hover:bg-finance-sub-bg/50"
                  >
                    <div>
                      <span className="font-bold text-xs text-finance-text block">
                        {stock.name}
                      </span>
                      <span className="text-[10px] text-finance-sub-text font-mono">
                        {stock.symbol} · {stock.market}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-xs block text-finance-text">
                        {isUSD ? `$${stock.price.toFixed(2)}` : `${stock.price.toLocaleString()}원`}
                      </span>
                      <span className={`text-[10px] font-mono font-bold ${isUp ? 'text-finance-up' : 'text-finance-down'}`}>
                        {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* 2. Compact Major Market Indices Strip */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {kospi && (
          <div
            onClick={() => navigateToIndex('KOSPI')}
            className="px-3 py-2 rounded-xl bg-finance-card border border-finance-border shadow-2xs shrink-0 cursor-pointer min-w-[120px]"
          >
            <div className="text-[10px] text-finance-sub-text font-bold">코스피</div>
            <div className="font-mono font-bold text-xs text-finance-text">
              {kospi.value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-[10px] font-mono font-bold ${kospi.changePercent >= 0 ? 'text-finance-up' : 'text-finance-down'}`}>
              {kospi.changePercent >= 0 ? '+' : ''}{kospi.changePercent.toFixed(2)}%
            </div>
          </div>
        )}

        {kosdaq && (
          <div
            onClick={() => navigateToIndex('KOSDAQ')}
            className="px-3 py-2 rounded-xl bg-finance-card border border-finance-border shadow-2xs shrink-0 cursor-pointer min-w-[120px]"
          >
            <div className="text-[10px] text-finance-sub-text font-bold">코스닥</div>
            <div className="font-mono font-bold text-xs text-finance-text">
              {kosdaq.value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-[10px] font-mono font-bold ${kosdaq.changePercent >= 0 ? 'text-finance-up' : 'text-finance-down'}`}>
              {kosdaq.changePercent >= 0 ? '+' : ''}{kosdaq.changePercent.toFixed(2)}%
            </div>
          </div>
        )}

        {exchangeRate && (
          <div className="px-3 py-2 rounded-xl bg-finance-card border border-finance-border shadow-2xs shrink-0 min-w-[120px]">
            <div className="text-[10px] text-finance-sub-text font-bold">원/달러 환율</div>
            <div className="font-mono font-bold text-xs text-finance-text">
              {exchangeRate.rate.toLocaleString()}원
            </div>
            <div className={`text-[10px] font-mono font-bold ${exchangeRate.changePercent >= 0 ? 'text-finance-up' : 'text-finance-down'}`}>
              {exchangeRate.changePercent >= 0 ? '+' : ''}{exchangeRate.changePercent.toFixed(2)}%
            </div>
          </div>
        )}
      </div>

      {/* 3. Slideable Market Mover Tabs */}
      <div className="border-b border-finance-border overflow-x-auto no-scrollbar flex items-center gap-4 px-1">
        {[
          { id: 'watchlist', label: '관심종목' },
          { id: 'surge', label: '급등' },
          { id: 'plunge', label: '급락' },
          { id: 'volume', label: '거래폭증' },
          { id: 'kr', label: '국내' },
          { id: 'us', label: '미국' },
          { id: 'coin', label: '코인' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`py-2 text-xs font-bold shrink-0 relative transition-colors ${
              activeTab === t.id
                ? 'text-finance-accent'
                : 'text-finance-sub-text hover:text-finance-text'
            }`}
          >
            <span>{t.label}</span>
            {activeTab === t.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-finance-accent rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 4. Streamlined Stock List (증권사 앱 스타일, 좌우 스와이프 지원) */}
      <div 
        className="bg-finance-card rounded-2xl border border-finance-border shadow-xs divide-y divide-finance-border/50 overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {tabStocks.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Bookmark className="w-8 h-8 text-finance-sub-text opacity-40 mx-auto" />
            <p className="text-xs text-finance-sub-text">
              {activeTab === 'watchlist'
                ? '등록된 관심 종목이 없습니다. 검색창에서 별(★)을 눌러 추가해보세요.'
                : '조건에 해당하는 종목이 없습니다.'}
            </p>
          </div>
        ) : (
          tabStocks.slice(0, 30).map(stock => {
            const isUSD = stock.currency === 'USD' || stock.market === 'US';
            const isUp = stock.change >= 0;

            return (
              <div
                key={stock.symbol}
                onClick={() => navigateToStock(stock.symbol)}
                className="p-3.5 flex items-center justify-between cursor-pointer active:bg-finance-sub-bg/50 transition-colors"
              >
                {/* Left: Stock Name & Symbol */}
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs truncate text-finance-text">
                      {stock.name}
                    </span>
                    {isWatchlisted(stock.symbol) && (
                      <span className="text-amber-500 text-[10px]" title="관심 등록됨">★</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-finance-sub-text font-mono">{stock.symbol}</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-finance-sub-bg text-finance-sub-text border border-finance-border/50">
                      {stock.market}
                    </span>
                    <span className="text-[10px] text-finance-sub-text truncate max-w-[90px]">
                      {stock.sector}
                    </span>
                  </div>
                </div>

                {/* Right: Real-time Price & Rate */}
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-xs block text-finance-text">
                    {isUSD ? `$${stock.price.toFixed(2)}` : `${stock.price.toLocaleString()}원`}
                  </span>
                  <span className={`text-[11px] font-mono font-bold flex items-center justify-end gap-0.5 ${
                    isUp ? 'text-finance-up' : 'text-finance-down'
                  }`}>
                    {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    <span>{isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
