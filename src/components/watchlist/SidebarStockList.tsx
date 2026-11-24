import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, Plus, Check, Trash2, ChevronUp, ChevronDown, Loader2, RefreshCw } from 'lucide-react';
import { Stock } from '../../types';
import { inferStockCurrency, inferStockExchange, formatMoney } from '../../utils/currency';
import { getStockUniqueKey } from '../../utils/stocks/ticker';
import { stockRepository } from '../../services/stockRepository';

type MarketTab = 'OVERALL' | 'KOSPI' | 'KOSDAQ' | 'US' | 'CRYPTO';

interface SearchItem {
  symbol: string;
  name: string;
  market: string;
  exchange?: string;
  currency?: string;
  productType?: string;
  price?: number;
  change?: number;
  changePercent?: number;
  tradingPair?: string;
}

export const SidebarStockList: React.FC = () => {
  const { 
    watchlist,
    watchlistDetails,
    addToWatchlist,
    removeFromWatchlist,
    reorderWatchlist,
    navigateToStock, 
    navigateToIndex,
    isWatchlisted,
  } = useApp();

  const [activeTab, setActiveTab] = useState<MarketTab>('OVERALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [retryNonce, setRetryNonce] = useState(0);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Map activeTab to search API market parameter
  const getSearchMarketParam = (tab: MarketTab): string => {
    switch (tab) {
      case 'KOSPI': return 'KOSPI';
      case 'KOSDAQ': return 'KOSDAQ';
      case 'US': return 'US';
      case 'CRYPTO': return 'COIN';
      default: return 'ALL';
    }
  };

  // Filter watchlist items for the current tab
  const getFilteredWatchlist = (): Stock[] => {
    switch (activeTab) {
      case 'KOSPI':
        return watchlistDetails.filter(s => (s.market as string) === 'KOSPI' || (s.exchange as string) === 'KOSPI');
      case 'KOSDAQ':
        return watchlistDetails.filter(s => (s.market as string) === 'KOSDAQ' || (s.exchange as string) === 'KOSDAQ');
      case 'US':
        return watchlistDetails.filter(s => {
          const m = s.market as string;
          return m === 'US' || m === 'INDEX' || m === 'NASDAQ' || m === 'NYSE' || m === 'AMEX' || s.symbol.startsWith('^');
        });
      case 'CRYPTO':
        return watchlistDetails.filter(s => {
          const m = s.market as string;
          return m === 'COIN' || m === 'CRYPTO' || s.symbol.includes('-') || s.symbol.endsWith('USDT');
        });
      default:
        return watchlistDetails;
    }
  };

  const displayStocks = getFilteredWatchlist();

  // Perform debounced search for active tab with AbortController
  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    let mounted = true;
    setIsSearching(true);
    setSearchError(null);

    const timer = setTimeout(async () => {
      try {
        const marketParam = getSearchMarketParam(activeTab);
        const data = await stockRepository.searchStocks({
          query,
          market: marketParam,
          limit: 12,
          signal: controller.signal,
        });
        if (mounted && !controller.signal.aborted) {
          setSearchResults(data as unknown as SearchItem[]);
          setShowSearchResults(true);
        }
      } catch (err: any) {
        if (err?.name === 'AbortError' || controller.signal.aborted) return;
        console.warn('[SidebarSearch] Search error:', err);
        if (mounted) {
          setSearchError(err?.message || '종목 검색에 실패했습니다.');
          setSearchResults([]);
          setShowSearchResults(true);
        }
      } finally {
        if (mounted && !controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 180);

    return () => {
      mounted = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, activeTab, retryNonce]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRegister = async (e: React.MouseEvent, item: SearchItem) => {
    e.stopPropagation();
    if (isWatchlisted(item.symbol)) return;
    await addToWatchlist(item.symbol, {
      name: item.name,
      market: item.market as any,
      exchange: inferStockExchange(item.symbol, item.market, item.exchange),
      currency: inferStockCurrency(item.symbol, item.market, item.currency),
      productType: item.productType as any,
      price: item.price || 0,
      change: item.change || 0,
      changePercent: item.changePercent || 0,
    });
  };

  const handleItemClick = (stock: Stock) => {
    if (stock.symbol === 'KOSPI' || stock.symbol === 'KOSDAQ') {
      navigateToIndex(stock.symbol);
    } else {
      navigateToStock(stock.symbol);
    }
  };

  const handleMoveUp = (e: React.MouseEvent, symbol: string) => {
    e.stopPropagation();
    const idx = watchlist.indexOf(symbol);
    if (idx <= 0) return;
    const newOrder = [...watchlist];
    const temp = newOrder[idx - 1];
    newOrder[idx - 1] = newOrder[idx];
    newOrder[idx] = temp;
    reorderWatchlist(newOrder);
  };

  const handleMoveDown = (e: React.MouseEvent, symbol: string) => {
    e.stopPropagation();
    const idx = watchlist.indexOf(symbol);
    if (idx < 0 || idx >= watchlist.length - 1) return;
    const newOrder = [...watchlist];
    const temp = newOrder[idx + 1];
    newOrder[idx + 1] = newOrder[idx];
    newOrder[idx] = temp;
    reorderWatchlist(newOrder);
  };

  const tabs: { id: MarketTab; label: string }[] = [
    { id: 'OVERALL', label: '전체' },
    { id: 'KOSPI', label: '코스피' },
    { id: 'KOSDAQ', label: '코스닥' },
    { id: 'US', label: '미국' },
    { id: 'CRYPTO', label: '코인' },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#131722] select-none">
      {/* 5 Market Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchQuery('');
              setShowSearchResults(false);
            }}
            className={`flex-1 py-2 text-[11px] font-bold cursor-pointer transition-colors ${
              activeTab === tab.id 
                ? 'text-rose-600 dark:text-rose-400 border-b-2 border-rose-600 dark:border-rose-400 bg-rose-50/20 dark:bg-rose-950/20' 
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab-specific Inline Search */}
      <div className="p-2 border-b border-slate-200 dark:border-slate-800 relative shrink-0" ref={searchContainerRef}>
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (searchResults.length > 0) setShowSearchResults(true); }}
            placeholder={`${tabs.find(t => t.id === activeTab)?.label} 종목 검색 및 관심 등록`}
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
                setShowSearchResults(false);
              }}
              className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Popover */}
        {showSearchResults && searchQuery.trim() && (
          <div className="absolute left-2 right-2 top-full mt-1 bg-white dark:bg-[#1c2130] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto">
            {searchError ? (
              <div className="p-4 text-center space-y-2">
                <p className="text-xs text-rose-500 font-medium">{searchError}</p>
                <button
                  type="button"
                  onClick={() => setRetryNonce(n => n + 1)}
                  className="px-2.5 py-1 rounded bg-rose-500 text-white text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>다시 시도</span>
                </button>
              </div>
            ) : isSearching ? (
              <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
                <span>검색 중...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="py-1 divide-y divide-slate-100 dark:divide-slate-800">
                {searchResults.map((item) => {
                  const registered = isWatchlisted(item.symbol);
                  return (
                    <div
                      key={getStockUniqueKey(item)}
                      className="px-3 py-2 flex items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <div 
                        className="min-w-0 flex-1 cursor-pointer"
                        onClick={() => {
                          setShowSearchResults(false);
                          navigateToStock(item.symbol);
                        }}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {item.name}
                          </span>
                          <span className="text-[10px] font-mono px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
                            {item.exchange || item.market}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.symbol}
                          </span>
                          {item.price !== undefined && item.price > 0 && (
                            <span className="text-[10px] font-mono font-medium text-slate-600 dark:text-slate-300">
                              {formatMoney(item.price, inferStockCurrency(item.symbol, item.market, item.currency))}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleRegister(e, item)}
                        disabled={registered}
                        className={`shrink-0 px-2.5 py-1 text-[11px] font-bold rounded-md flex items-center gap-1 transition-all ${
                          registered
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default'
                            : 'bg-rose-500 hover:bg-rose-600 text-white cursor-pointer shadow-xs active:scale-95'
                        }`}
                      >
                        {registered ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>등록됨</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>관심 등록</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">
                일치하는 종목이 없습니다.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 px-3 py-1.5 text-[10px] font-bold text-slate-400 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="col-span-5">종목명</div>
        <div className="col-span-3 text-right">현재가</div>
        <div className="col-span-2 text-right">등락%</div>
        <div className="col-span-2 text-center">관리</div>
      </div>

      {/* Table Body (Watchlist Items) */}
      <div className="flex-1 overflow-y-auto">
        {displayStocks.map((stock) => {
          const isUp = stock.change >= 0;
          return (
            <div
              key={getStockUniqueKey(stock)}
              onClick={() => handleItemClick(stock)}
              className="group grid grid-cols-12 px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer border-b border-slate-100 dark:border-slate-800/50 transition-colors items-center"
            >
              {/* Name & Symbol */}
              <div className="col-span-5 truncate pr-1">
                <div className="font-bold text-slate-900 dark:text-white truncate text-[11px] leading-tight">
                  {stock.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate leading-tight">
                  {stock.symbol} · {inferStockCurrency(stock.symbol, stock.market, stock.currency)}
                </div>
              </div>

              {/* Price */}
              <div className="col-span-3 text-right font-mono font-medium text-slate-700 dark:text-slate-300 text-[11px]">
                {stock.price ? formatMoney(stock.price, inferStockCurrency(stock.symbol, stock.market, stock.currency)) : '-'}
              </div>

              {/* Change % */}
              <div className="col-span-2 text-right font-mono font-bold text-[11px]">
                <span className={isUp ? 'text-rose-500' : 'text-blue-500'}>
                  {stock.changePercent > 0 ? '+' : ''}{stock.changePercent?.toFixed(2) || '0.00'}%
                </span>
              </div>

              {/* Quick Actions (Reorder & Delete) */}
              <div className="col-span-2 flex items-center justify-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                <div className="flex flex-col">
                  <button
                    type="button"
                    title="위로 이동"
                    onClick={(e) => handleMoveUp(e, stock.symbol)}
                    className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                  >
                    <ChevronUp className="w-2.5 h-2.5" />
                  </button>
                  <button
                    type="button"
                    title="아래로 이동"
                    onClick={(e) => handleMoveDown(e, stock.symbol)}
                    className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                  >
                    <ChevronDown className="w-2.5 h-2.5" />
                  </button>
                </div>
                <button
                  type="button"
                  title="관심종목 해제"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWatchlist(stock.symbol);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 cursor-pointer rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}

        {displayStocks.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-400 space-y-1">
            <p className="font-medium">등록된 관심종목이 없습니다.</p>
            <p className="text-[11px] text-slate-500">상단 검색창에서 종목을 검색하여 등록해 보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
};
