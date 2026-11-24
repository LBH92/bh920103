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
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Stock } from '../../types';
import { isSurgeGain, isSurgeLoss, isVolumeSurge } from '../../utils/marketThresholds';
import { matchHangulSearch } from '../../utils/hangul';
import { isUSStockSymbol, getStockUniqueKey } from '../../utils/stocks/ticker';
import { inferStockCurrency, formatMoney, validateExchangeRate } from '../../utils/currency';

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
  const [searchFilter, setSearchFilter] = useState<'ALL' | 'KOSPI' | 'KOSDAQ' | 'US' | 'COIN'>('ALL');
  const [query, setQuery] = useState<string>('');

  // 1. Search Results if user types in mobile search box
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [retryNonce, setRetryNonce] = useState(0);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setSearchResults([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    let mounted = true;
    setIsSearching(true);
    setSearchError(null);

    const handler = setTimeout(async () => {
      try {
        const results = await stockRepository.searchStocks({
          query: q,
          limit: 15,
          market: searchFilter,
          signal: controller.signal,
        });
        if (mounted && !controller.signal.aborted) {
          setSearchResults(results);
        }
      } catch (err: any) {
        if (err?.name === 'AbortError' || controller.signal.aborted) return;
        console.error('[HomeMobileDashboard] Search API error:', err);
        if (mounted) {
          setSearchError(err?.message || '종목 검색에 실패했습니다.');
          setSearchResults([]);
        }
      } finally {
        if (mounted && !controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 180);

    return () => {
      mounted = false;
      clearTimeout(handler);
      controller.abort();
    };
  }, [query, searchFilter, retryNonce]);

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

        {/* Quick Market Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
          {[
            { id: 'ALL', label: '전체' },
            { id: 'KOSPI', label: '코스피' },
            { id: 'KOSDAQ', label: '코스닥' },
            { id: 'US', label: '미국' },
            { id: 'COIN', label: '코인' }
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
            {searchError ? (
              <div className="py-4 text-center space-y-2">
                <p className="text-xs text-rose-500 font-medium">{searchError}</p>
                <button
                  type="button"
                  onClick={() => setRetryNonce(n => n + 1)}
                  className="px-3 py-1 rounded-lg bg-rose-500 text-white text-[11px] font-bold inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>다시 시도</span>
                </button>
              </div>
            ) : isSearching && searchResults.length === 0 ? (
              <div className="py-4 text-center text-xs text-finance-sub-text flex items-center justify-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-finance-accent" />
                <span>검색 중...</span>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="py-4 text-center text-xs text-finance-sub-text">
                일치하는 검색 결과가 없습니다.
              </div>
            ) : (
              searchResults.map(stock => {
                const stockCur = inferStockCurrency(stock.symbol, stock.market, stock.currency);
                const isUp = stock.change >= 0;
                return (
                  <div
                    key={getStockUniqueKey(stock)}
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
                        {stock.symbol} · {stock.exchange || stock.market} · {stockCur}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-xs block text-finance-text tabular-nums">
                        {stock.price > 0 ? formatMoney(stock.price, stockCur) : '시세 확인'}
                      </span>
                      <span className={`text-[10px] font-mono font-bold tabular-nums ${isUp ? 'text-finance-up' : 'text-finance-down'}`}>
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

        {(() => {
          const fxCheck = validateExchangeRate(exchangeRate);
          return (
            <div className="px-3 py-2 rounded-xl bg-finance-card border border-finance-border shadow-2xs shrink-0 min-w-[130px]">
              <div className="flex items-center justify-between gap-1 text-[10px] text-finance-sub-text font-bold">
                <span>원/달러 환율</span>
                {!fxCheck.valid && <span className="text-amber-500">오류</span>}
              </div>
              {fxCheck.valid && fxCheck.rate ? (
                <>
                  <div className="font-mono font-bold text-xs text-finance-text">
                    {fxCheck.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}원
                  </div>
                  <div className={`text-[10px] font-mono font-bold ${(exchangeRate?.changePercent || 0) >= 0 ? 'text-finance-up' : 'text-finance-down'}`}>
                    {(exchangeRate?.changePercent || 0) >= 0 ? '+' : ''}{(exchangeRate?.changePercent || 0).toFixed(2)}%
                  </div>
                </>
              ) : (
                <div className="text-[11px] font-bold text-amber-500 mt-0.5">
                  {fxCheck.status === 'stale' ? '지연/만료' : '조회 실패'}
                </div>
              )}
            </div>
          );
        })()}
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
            const stockCur = inferStockCurrency(stock.symbol, stock.market, stock.currency);
            const isUp = stock.change >= 0;

            return (
              <div
                key={getStockUniqueKey(stock)}
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
                      {stock.exchange || stock.market} · {stockCur}
                    </span>
                    <span className="text-[10px] text-finance-sub-text truncate max-w-[90px]">
                      {stock.sector}
                    </span>
                  </div>
                </div>

                {/* Right: Real-time Price & Rate */}
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-xs block text-finance-text">
                    {formatMoney(stock.price, stockCur)}
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
