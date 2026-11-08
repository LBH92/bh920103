import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  CornerDownLeft,
  AlertCircle,
  Bookmark,
  Loader2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Stock } from '../../types';
import { PriceBadge } from '../common/PriceBadge';
import { MarketBadge } from '../common/MarketBadge';
import { stockRepository } from '../../services/stockRepository';
import { extractChosung, isChosungQuery } from '../../utils/hangul';
import { MockTradeModal } from '../portfolio/MockTradeModal';

const RECENT_SEARCHES_KEY = 'bd_recent_stock_searches';

export const SearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    navigateToStock, 
    isWatchlisted, 
    addToWatchlist, 
    removeFromWatchlist, 
    toggleWatchlist, 
    exchangeRate 
  } = useApp();
  const [query, setQuery] = useState('');
  const [marketFilter, setMarketFilter] = useState<'ALL' | 'KR' | 'US' | 'COIN'>('ALL');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedTradeStock, setSelectedTradeStock] = useState<Stock | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : ['삼성전자', 'NVDA', 'SK하이닉스', 'AAPL', '005930', 'TSLA'];
    } catch {
      return ['삼성전자', 'NVDA', 'AAPL'];
    }
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setSearchResults([]);
      setIsSearching(false);
      setSearchError(null);
    }
  }, [isSearchOpen]);

  // Execute fast unified search via stockRepository with debounce
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchError(null);
      setSelectedIndex(0);
      return;
    }

    let isSubscribed = true;
    setIsSearching(true);
    setSearchError(null);

    const handler = setTimeout(async () => {
      try {
        const results = await stockRepository.searchStocks({ query, market: marketFilter, limit: 16 });
        if (isSubscribed) {
          setSearchResults(results);
          setSelectedIndex(0);
        }
      } catch (err: any) {
        if (isSubscribed) {
          setSearchError('데이터 공급자 연결 오류가 발생했습니다.');
        }
      } finally {
        if (isSubscribed) {
          setIsSearching(false);
        }
      }
    }, 250);

    return () => {
      isSubscribed = false;
      clearTimeout(handler);
    };
  }, [query, marketFilter]);

  // Save to recent searches
  const saveRecentSearch = (term: string) => {
    try {
      const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 8);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const removeRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== term);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSelectStock = (stock: Stock) => {
    saveRecentSearch(stock.name);
    navigateToStock(stock.symbol);
    setIsSearchOpen(false);
  };

  // Keyboard navigation (ArrowDown, ArrowUp, Enter, Esc)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (searchResults.length > 0) {
        setSelectedIndex(prev => (prev + 1) % searchResults.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (searchResults.length > 0) {
        setSelectedIndex(prev => (prev - 1 + searchResults.length) % searchResults.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults.length > 0 && searchResults[selectedIndex]) {
        handleSelectStock(searchResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  const popularKeywords = [
    { text: '삼성전자', symbol: '005930' },
    { text: '비트코인', symbol: 'KRW-BTC' },
    { text: '이더리움', symbol: 'KRW-ETH' },
    { text: '엔비디아', symbol: 'NVDA' },
    { text: 'TSMC ADR', symbol: 'TSM' },
    { text: 'SK하이닉스', symbol: '000660' },
    { text: '테슬라', symbol: 'TSLA' },
    { text: 'QQQ ETF', symbol: 'QQQ' },
    { text: 'SOXL (3X)', symbol: 'SOXL' },
    { text: 'BTC/USDT', symbol: 'BTCUSDT' },
  ];

  if (!isSearchOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3 bg-slate-50/50 dark:bg-slate-800/30">
          {isSearching ? (
            <Loader2 className="w-5 h-5 text-rose-500 animate-spin shrink-0" />
          ) : (
            <Search className="w-5 h-5 text-rose-500 shrink-0" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="종목명, 티커, 코드, 코인명, 초성 입력 (예: 삼성, NVDA, 비트코인, KRW-BTC, TSM)"
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
              title="검색어 지우기"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono font-medium text-slate-400 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Market Filter Bar (전체 / 한국 / 미국 / 가상자산) */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-900/40 text-xs font-medium overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setMarketFilter('ALL')}
            className={`px-3 py-1 rounded-lg transition-colors font-bold cursor-pointer shrink-0 ${
              marketFilter === 'ALL'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            전체 통합
          </button>
          <button
            type="button"
            onClick={() => setMarketFilter('KR')}
            className={`px-3 py-1 rounded-lg transition-colors font-bold cursor-pointer shrink-0 ${
              marketFilter === 'KR'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            🇰🇷 한국 (KOSPI · KOSDAQ)
          </button>
          <button
            type="button"
            onClick={() => setMarketFilter('US')}
            className={`px-3 py-1 rounded-lg transition-colors font-bold cursor-pointer shrink-0 ${
              marketFilter === 'US'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            🇺🇸 미국 (NASDAQ · NYSE)
          </button>
          <button
            type="button"
            onClick={() => setMarketFilter('COIN')}
            className={`px-3 py-1 rounded-lg transition-colors font-bold cursor-pointer shrink-0 ${
              marketFilter === 'COIN'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            🪙 가상자산 (Upbit · Binance)
          </button>
        </div>

        {/* Content Body */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-3">
          {query.trim() ? (
            /* Search Results View */
            searchResults.length > 0 ? (
              <div className="space-y-1">
                <div className="px-3 py-1.5 flex items-center justify-between text-xs font-semibold text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>검색 결과 ({searchResults.length}건)</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-500 font-bold border border-rose-500/20">
                      통합 데이터 (국내 2,073+ · 미국 8,000+ · 코인 1,300+)
                    </span>
                  </div>
                  <span className="hidden sm:inline text-[11px] text-slate-400">
                    방향키(↑↓)로 이동 후 Enter로 선택
                  </span>
                </div>

                {searchResults.map((stock, idx) => {
                  const isSelected = idx === selectedIndex;
                  const chosung = extractChosung(stock.name);
                  const isChosungSearch = isChosungQuery(query);

                  return (
                    <button
                      key={stock.symbol}
                      onClick={() => handleSelectStock(stock)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors text-left group cursor-pointer ${
                        isSelected
                          ? 'bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                      }`}
                    >
                      {/* Left: Code, Name, Market, Sector, Chosung hint */}
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        {/* 2. 종목코드 */}
                        <span className={`text-xs font-mono px-1.5 py-0.5 rounded font-bold ${
                          isSelected
                            ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}>
                          {stock.symbol}
                        </span>

                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            {/* 1. 종목명 */}
                            <span className={`font-bold text-sm sm:text-base transition-colors ${
                              isSelected
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-slate-900 dark:text-white'
                            }`}>
                              {stock.name}
                            </span>

                            {/* 3. 시장 / 거래소 / 상품 유형 */}
                            <MarketBadge market={stock.market} exchange={stock.exchange} />

                            {stock.productType && (
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                stock.productType === 'ETF'
                                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                  : stock.productType === 'ADR'
                                  ? 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                                  : stock.productType === 'SPOT'
                                  ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                              }`}>
                                {stock.productType === 'ETF' ? 'ETF' : (stock.productType === 'ADR' ? 'ADR' : (stock.productType === 'SPOT' ? '현물' : '보통주'))}
                              </span>
                            )}

                            {stock.warning && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/40">
                                ⚠️ 유의
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                            <span>{stock.sector}</span>
                            {stock.tradingPair && (
                              <span className="font-mono text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold">
                                [{stock.tradingPair}]
                              </span>
                            )}
                            {stock.nameEn && stock.nameEn !== stock.name && (
                              <span className="font-mono text-[10px] text-slate-400 truncate max-w-[150px]">
                                ({stock.nameEn})
                              </span>
                            )}
                            {isChosungSearch && (
                              <span className="font-mono text-rose-500 dark:text-rose-400 text-[11px]">
                                · 초성: {chosung}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Price & Change Rate, Watchlist toggle button, Selection prompt */}
                      <div className="flex items-center gap-2.5 shrink-0">
                        <div className="text-right">
                          {stock.price > 0 ? (
                            <>
                              <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                                {stock.currency === 'USD'
                                  ? `$${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                  : stock.currency === 'USDT'
                                  ? `${stock.price.toLocaleString(undefined, { minimumFractionDigits: stock.price < 1 ? 4 : 2 })} USDT`
                                  : stock.currency === 'BTC'
                                  ? `${stock.price.toFixed(8)} BTC`
                                  : `${stock.price.toLocaleString()}원`}
                              </div>
                              {(stock.currency === 'USD' || stock.currency === 'USDT') && exchangeRate?.rate && (
                                <div className="text-[10px] text-slate-400 font-mono">
                                  ≈ {Math.round(stock.price * exchangeRate.rate).toLocaleString()}원
                                </div>
                              )}
                              <PriceBadge change={stock.change} changePercent={stock.changePercent} size="sm" />
                            </>
                          ) : (
                            <div className="text-[11px] font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                              {stock.market === 'COIN' ? '가상자산 시세 조회' : (stock.market === 'US' ? '미국 주식 조회' : '키움 실시간 조회')}
                            </div>
                          )}
                        </div>

                        {/* 모의매매 퀵 버튼 */}
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTradeStock(stock);
                          }}
                          className="px-2 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors cursor-pointer"
                          title="모의 매매 바로가기"
                        >
                          모의매매
                        </div>

                        {/* 관심종목 추가/삭제 버튼 */}
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isWatchlisted(stock.symbol)) {
                              removeFromWatchlist(stock.symbol);
                            } else {
                              addToWatchlist(stock.symbol, stock);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.stopPropagation();
                              if (isWatchlisted(stock.symbol)) {
                                removeFromWatchlist(stock.symbol);
                              } else {
                                addToWatchlist(stock.symbol, stock);
                              }
                            }
                          }}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                            isWatchlisted(stock.symbol)
                              ? 'text-amber-500 bg-amber-500/10 hover:bg-amber-500/20'
                              : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          title={isWatchlisted(stock.symbol) ? '관심종목에서 삭제' : '관심종목에 추가'}
                        >
                          <Bookmark className={`w-4 h-4 ${isWatchlisted(stock.symbol) ? 'fill-amber-500' : ''}`} />
                        </div>

                        <div className={`p-1 rounded-lg ${isSelected ? 'text-rose-500' : 'text-slate-300 dark:text-slate-600'}`}>
                          <CornerDownLeft className="w-4 h-4" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : isSearching ? (
              /* Loading State */
              <div className="py-14 text-center px-4 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-800 dark:text-slate-200">
                    종목 및 가상자산 시세 검색 중...
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    국내 주식 · 미국 주식(ADR/ETF) · 코인(Upbit/Binance) 공식 데이터를 조회하고 있습니다.
                  </p>
                </div>
              </div>
            ) : searchError ? (
              /* Provider Error State */
              <div className="py-14 text-center px-4 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-800 dark:text-slate-200">
                    시세 공급자 연결 실패
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {searchError} 잠시 후 다시 시도해 주세요.
                  </p>
                </div>
              </div>
            ) : (
              /* Empty Search Results View */
              <div className="py-14 text-center px-4 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-800 dark:text-slate-200">
                    {marketFilter === 'US' ? '미국 주식 검색 결과 없음' : 
                     marketFilter === 'COIN' ? '가상자산 검색 결과 없음' :
                     marketFilter === 'KR' ? '국내 주식 검색 결과 없음' : '일치하는 종목을 찾을 수 없습니다'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    '<span className="text-rose-500 font-semibold">{query}</span>'에 해당하는 {marketFilter !== 'ALL' ? marketFilter + ' 시장 ' : ''}검색 결과가 없습니다.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 max-w-md mx-auto text-left text-xs space-y-1.5 text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">
                    💡 통합 종목 검색 팁
                  </span>
                  <p>• <strong>한국 주식:</strong> 삼성전자, 005930, SK하이닉스, 초성(ㅅㅅ, ㅅㅋㅎㅇㄴㅅ)</p>
                  <p>• <strong>미국 주식:</strong> NVDA, AAPL, TSLA, MSFT, 엔비디아, 테슬라, 애플</p>
                  <p>• <strong>가상자산:</strong> 비트코인, 이더리움, KRW-BTC, BTCUSDT, XRP, 초성(ㅂㅌㅋㅇ)</p>
                  <p>• <strong>레버리지 / 지수 ETF:</strong> SOXL, SOXS, QQQ, SPY</p>
                  <p>• <strong>시장 필터:</strong> 상단 [전체 / 한국 / 미국 / 가상자산] 탭으로 원하는 시장만 필터링 가능</p>
                </div>
              </div>
            )
          ) : (
            /* Idle View: Recent Searches & Popular Keywords */
            <div className="p-2 space-y-5">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2 px-1">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      최근 검색어
                    </span>
                    <button
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem(RECENT_SEARCHES_KEY);
                      }}
                      className="text-[11px] text-slate-400 hover:text-rose-500"
                    >
                      전체 삭제
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map(term => (
                      <div
                        key={term}
                        onClick={() => setQuery(term)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer group"
                      >
                        <span>{term}</span>
                        <button
                          onClick={e => removeRecentSearch(e, term)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                          title="삭제"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Keywords (Trending) */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2 px-1">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                  실시간 인기 종목 검색어
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {popularKeywords.map((item, i) => (
                    <button
                      key={item.symbol}
                      onClick={() => {
                        navigateToStock(item.symbol);
                        saveRecentSearch(item.text);
                        setIsSearchOpen(false);
                      }}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors text-left text-xs group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 font-mono font-bold text-rose-500">
                          {i + 1}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-rose-500">
                          {item.text}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">
                        {item.symbol}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>초성 검색 가능 (예: <span className="font-mono text-rose-500">ㅅㅅㅈㅈ</span>, <span className="font-mono text-rose-500">ㅅㅋ</span>)</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span>선택: Enter</span>
            <span>·</span>
            <span>닫기: ESC</span>
          </div>
        </div>
      </div>

      {/* Mock Trade Modal */}
      {selectedTradeStock && (
        <MockTradeModal
          isOpen={Boolean(selectedTradeStock)}
          onClose={() => setSelectedTradeStock(null)}
          symbol={selectedTradeStock.symbol}
          stockName={selectedTradeStock.name}
          defaultPrice={selectedTradeStock.price}
          initialType="BUY"
        />
      )}
    </div>
  );
};
