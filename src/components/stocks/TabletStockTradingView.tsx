import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  BarChart2, 
  Layers, 
  Newspaper, 
  MessageSquare, 
  Activity, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  SlidersHorizontal,
  RefreshCw,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Stock } from '../../types';
import { InteractiveStockChart } from './InteractiveStockChart';
import { OrderBookWidget } from './OrderBookWidget';
import { StockNewsSection } from './StockNewsSection';
import { StockCommunitySection } from './StockCommunitySection';
import { matchHangulSearch } from '../../utils/hangul';
import { isUSStockSymbol, getStockUniqueKey } from '../../utils/stocks/ticker';
import { stockRepository } from '../../services/stockRepository';
import { Loader2, AlertCircle } from 'lucide-react';
import { MockTradeModal } from '../portfolio/MockTradeModal';
import {
  inferStockCurrency,
  inferStockExchange,
  formatMoney,
  formatMarketCapByCurrency,
} from '../../utils/currency';

export const TabletStockTradingView: React.FC = () => {
  const { 
    stocks, 
    watchlist, 
    toggleWatchlist, 
    isWatchlisted, 
    selectedSymbol: globalSelectedSymbol,
    navigateToStock,
    requireAuth,
    exchangeRate
  } = useApp();

  const [selectedSymbol, setSelectedSymbol] = useState<string>(() => {
    return globalSelectedSymbol || (stocks.length > 0 ? stocks[0].symbol : '005930');
  });

  const [marketFilter, setMarketFilter] = useState<'ALL' | 'KOSPI' | 'KOSDAQ' | 'US' | 'COIN' | 'WATCHLIST'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [remoteSearchResults, setRemoteSearchResults] = useState<Stock[]>([]);
  const [isSearchingRemote, setIsSearchingRemote] = useState<boolean>(false);
  const [remoteSearchError, setRemoteSearchError] = useState<string | null>(null);
  const [remoteSearchRetry, setRemoteSearchRetry] = useState<number>(0);
  const [selectedRemoteStock, setSelectedRemoteStock] = useState<Stock | null>(null);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState<boolean>(false);
  const [activeRightTab, setActiveRightTab] = useState<'orderbook' | 'metrics' | 'news' | 'community'>('orderbook');
  const [isTradeModalOpen, setIsTradeModalOpen] = useState<boolean>(false);

  // Selected Stock Realtime Detail State (check tracked stocks first, then remote selection)
  const activeStock = useMemo(() => {
    const local = stocks.find(s => s.symbol === selectedSymbol);
    if (local) return local;
    if (selectedRemoteStock && selectedRemoteStock.symbol === selectedSymbol) return selectedRemoteStock;
    return stocks[0] || null;
  }, [stocks, selectedSymbol, selectedRemoteStock]);

  // Sync when globalSelectedSymbol changes
  useEffect(() => {
    if (globalSelectedSymbol && globalSelectedSymbol !== selectedSymbol) {
      setSelectedSymbol(globalSelectedSymbol);
      if (!stocks.some(s => s.symbol === globalSelectedSymbol)) {
        stockRepository.getStock(globalSelectedSymbol).then(fetched => {
          if (fetched) setSelectedRemoteStock(fetched);
        }).catch(() => {});
      }
    }
  }, [globalSelectedSymbol]);

  // Remote unified search across KOSPI / KOSDAQ / US / COIN when typing
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q || marketFilter === 'WATCHLIST') {
      setRemoteSearchResults([]);
      setIsSearchingRemote(false);
      setRemoteSearchError(null);
      return;
    }

    const controller = new AbortController();
    setIsSearchingRemote(true);
    setRemoteSearchError(null);

    const timer = setTimeout(async () => {
      try {
        const results = await stockRepository.searchStocks({
          query: q,
          limit: 25,
          market: marketFilter !== 'ALL' ? marketFilter : undefined,
          signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          setRemoteSearchResults(results);
        }
      } catch (err: any) {
        if (err?.name === 'AbortError' || controller.signal.aborted) return;
        setRemoteSearchResults([]);
        setRemoteSearchError(err?.message || '검색 서버 연결 실패');
      } finally {
        if (!controller.signal.aborted) {
          setIsSearchingRemote(false);
        }
      }
    }, 180);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [searchQuery, marketFilter, remoteSearchRetry]);

  // Filtered Stock List for Left Column
  const filteredStocks = useMemo(() => {
    const q = searchQuery.trim();
    if (q && marketFilter !== 'WATCHLIST') {
      return remoteSearchResults;
    }

    return stocks.filter(stock => {
      if (q) {
        const matchesName = matchHangulSearch(stock.name, q);
        const matchesNameEn = stock.nameEn ? stock.nameEn.toLowerCase().includes(q.toLowerCase()) : false;
        const matchesSymbol = stock.symbol.toLowerCase().includes(q.toLowerCase());
        const matchesSector = stock.sector.toLowerCase().includes(q.toLowerCase());
        if (!matchesName && !matchesNameEn && !matchesSymbol && !matchesSector) return false;
      }

      if (marketFilter === 'WATCHLIST') {
        return isWatchlisted(stock.symbol);
      }
      if (marketFilter === 'KOSPI') {
        return stock.market === 'KOSPI';
      }
      if (marketFilter === 'KOSDAQ') {
        return stock.market === 'KOSDAQ';
      }
      if (marketFilter === 'US') {
        return stock.market === 'US' || isUSStockSymbol(stock.symbol);
      }
      if (marketFilter === 'COIN') {
        return stock.market === 'COIN' || stock.symbol.includes('-') || stock.symbol.endsWith('USDT');
      }
      return true;
    });
  }, [stocks, remoteSearchResults, searchQuery, marketFilter, watchlist, isWatchlisted]);

  const handleSelectListStock = async (stock: Stock) => {
    setSelectedSymbol(stock.symbol);
    setSelectedRemoteStock(stock);
    if (!stocks.some(s => s.symbol === stock.symbol)) {
      try {
        const full = await stockRepository.getStock(stock.symbol);
        if (full) setSelectedRemoteStock(full);
      } catch {}
    }
  };

  // Keep first stock selected only when not actively typing search
  useEffect(() => {
    if (!searchQuery.trim() && filteredStocks.length > 0 && !filteredStocks.some(s => s.symbol === selectedSymbol) && !selectedRemoteStock) {
      setSelectedSymbol(filteredStocks[0].symbol);
    }
  }, [filteredStocks, selectedSymbol, searchQuery, selectedRemoteStock]);

  const activeCur = activeStock
    ? inferStockCurrency(activeStock.symbol, activeStock.market, activeStock.currency)
    : 'KRW';
  const activeExchange = activeStock
    ? inferStockExchange(activeStock.symbol, activeStock.market, activeStock.exchange)
    : '';
  const isWatch = activeStock ? isWatchlisted(activeStock.symbol) : false;
  const isUp = activeStock ? activeStock.change >= 0 : true;

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-120px)] rounded-2xl bg-finance-card border border-finance-border shadow-xs overflow-hidden select-none text-finance-text">
      {/* ========================================================= */}
      {/* LEFT COLUMN: Stock List & Search Panel (Hidden on mobile)  */}
      {/* ========================================================= */}
      <div 
        className={`hidden md:flex flex-col border-r border-finance-border bg-finance-sub-bg/30 transition-all duration-200 shrink-0 ${
          isLeftCollapsed ? 'w-12' : 'w-[32%] min-w-[260px] max-w-[360px]'
        }`}
      >
        {/* Left Column Header */}
        <div className="p-3 border-b border-finance-border flex items-center justify-between gap-2">
          {!isLeftCollapsed && (
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-finance-sub-text pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="종목명·코드·초성 (ㅅㅅ, aapl)"
                className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-finance-card border border-finance-border text-xs tablet:text-[13px] text-finance-text placeholder:text-finance-sub-text focus:outline-none focus:ring-1 focus:ring-finance-accent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-finance-sub-text hover:text-finance-text"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          <button
            onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
            className="p-1.5 rounded-lg border border-finance-border hover:bg-finance-sub-bg text-finance-sub-text transition-colors"
            title={isLeftCollapsed ? '종목 목록 펼치기' : '종목 목록 접기'}
          >
            {isLeftCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Market Filter Tabs */}
        {!isLeftCollapsed && (
          <div className="px-2.5 py-2 border-b border-finance-border bg-finance-sub-bg/50 flex items-center gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'ALL', label: '전체' },
              { id: 'KOSPI', label: '코스피' },
              { id: 'KOSDAQ', label: '코스닥' },
              { id: 'US', label: '미국' },
              { id: 'COIN', label: '코인' },
              { id: 'WATCHLIST', label: '관심' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setMarketFilter(tab.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] tablet:text-[12px] font-bold shrink-0 transition-all cursor-pointer ${
                  marketFilter === tab.id
                    ? 'bg-finance-accent text-white shadow-xs'
                    : 'text-finance-sub-text hover:text-finance-text hover:bg-finance-sub-bg'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Table Column Headers */}
        {!isLeftCollapsed && (
          <div className="px-3 py-1.5 bg-finance-sub-bg/70 border-b border-finance-border text-[10px] tablet:text-[11px] text-finance-sub-text font-semibold flex items-center justify-between uppercase">
            <span>종목명 / 코드</span>
            <div className="flex items-center gap-4">
              <span>현재가</span>
              <span className="w-14 text-right">등락률</span>
            </div>
          </div>
        )}

        {/* Scrollable Stock List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {isSearchingRemote ? (
            <div className="p-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
              <span>통합 종목 검색 중...</span>
            </div>
          ) : remoteSearchError && searchQuery.trim() ? (
            <div className="p-5 text-center space-y-2 text-xs">
              <AlertCircle className="w-5 h-5 text-amber-500 mx-auto" />
              <p className="text-slate-500">{remoteSearchError}</p>
              <button
                type="button"
                onClick={() => setRemoteSearchRetry(n => n + 1)}
                className="px-3 py-1 rounded-lg bg-rose-500 text-white font-bold cursor-pointer"
              >
                다시 시도
              </button>
            </div>
          ) : filteredStocks.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              일치하는 종목이 없습니다.
            </div>
          ) : (
            filteredStocks.map(stock => {
              const isSelected = stock.symbol === selectedSymbol;
              const stockIsUp = stock.change >= 0;

              if (isLeftCollapsed) {
                return (
                  <button
                    key={getStockUniqueKey(stock)}
                    onClick={() => handleSelectListStock(stock)}
                    className={`w-full py-3 flex flex-col items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-rose-500/10 border-l-4 border-rose-500 text-rose-600 font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-500'
                    }`}
                    title={`${stock.name} (${stock.symbol})`}
                  >
                    <span className="text-[10px] font-mono font-bold uppercase truncate max-w-[40px]">
                      {stock.symbol.slice(0, 4)}
                    </span>
                    <span className={`text-[9px] font-mono tabular-nums ${stockIsUp ? 'text-rose-500' : 'text-blue-500'}`}>
                      {stockIsUp ? '+' : ''}{stock.changePercent.toFixed(1)}%
                    </span>
                  </button>
                );
              }

              return (
                <div
                  key={getStockUniqueKey(stock)}
                  onClick={() => handleSelectListStock(stock)}
                  className={`px-3 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-finance-accent/15 border-l-4 border-finance-accent text-finance-text font-bold'
                      : 'hover:bg-finance-sub-bg/60 text-finance-text'
                  }`}
                >
                  {/* Left: Name and Symbol */}
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs tablet:text-[14.5px] truncate max-w-[120px] tablet:max-w-[150px] text-finance-text whitespace-nowrap">
                        {stock.name}
                      </span>
                      {isWatchlisted(stock.symbol) && (
                        <span className="text-amber-500 text-[10px] tablet:text-[11px]" title="관심종목">★</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px] tablet:text-[11.5px] text-finance-sub-text font-mono tabular-nums">{stock.symbol}</span>
                      <span className="text-[9px] tablet:text-[10.5px] px-1 py-0.2 rounded bg-finance-sub-bg text-finance-sub-text border border-finance-border/50">
                        {stock.market}
                      </span>
                    </div>
                  </div>

                  {/* Right: Price & Change Rate */}
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-xs tablet:text-[14px] block text-finance-text tabular-nums whitespace-nowrap">
                      {formatMoney(stock.price, inferStockCurrency(stock.symbol, stock.market, stock.currency))}
                    </span>
                    <span className={`text-[10px] tablet:text-[11.5px] font-mono font-bold block tabular-nums whitespace-nowrap ${stockIsUp ? 'text-finance-up' : 'text-finance-down'}`}>
                      {stockIsUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: Large Chart & Comprehensive Details (68~72%)*/}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {activeStock ? (
          <>
            {/* Mobile Stock Switcher Bar */}
            <div className="md:hidden px-4 py-2 bg-finance-sub-bg/80 border-b border-finance-border flex items-center justify-between gap-2">
              <span className="text-xs text-finance-sub-text font-semibold">종목 전환:</span>
              <select
                value={selectedSymbol}
                onChange={(e) => {
                  const found = stocks.find(s => s.symbol === e.target.value);
                  if (found) handleSelectListStock(found);
                }}
                className="flex-1 bg-finance-card border border-finance-border rounded-lg px-2.5 py-1 text-xs text-finance-text font-bold focus:outline-none"
              >
                {stocks.map(s => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.name} ({s.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* 1. Header Overview Bar */}
            <div className="p-4 sm:p-5 border-b border-finance-border bg-finance-card flex flex-wrap items-center justify-between gap-4">
              {/* Left: Stock Name & Real-time Price */}
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl tablet:text-[21px] font-black text-finance-text truncate whitespace-nowrap">
                      {activeStock.name}
                    </h2>
                    <span className="text-xs tablet:text-[12px] px-2 py-0.5 rounded-md bg-finance-sub-bg font-mono tabular-nums text-finance-sub-text border border-finance-border">
                      {activeStock.symbol}
                    </span>
                    <span className="text-xs tablet:text-[12px] font-semibold px-2 py-0.5 rounded-full bg-finance-accent/15 text-finance-accent border border-finance-accent/30">
                      {activeExchange} · {activeCur}
                    </span>
                    <span className="text-xs tablet:text-[12px] text-finance-sub-text hidden sm:inline">
                      {activeStock.sector}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-xl sm:text-2xl tablet:text-[22px] font-black font-mono tabular-nums whitespace-nowrap text-finance-text">
                      {formatMoney(activeStock.price, activeCur)}
                    </span>
                    <span className={`text-sm tablet:text-[14px] font-bold font-mono tabular-nums whitespace-nowrap flex items-center gap-0.5 ${isUp ? 'text-finance-up' : 'text-finance-down'}`}>
                      {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      <span>{isUp ? '+' : ''}{activeStock.changePercent.toFixed(2)}%</span>
                      <span className="text-xs tablet:text-[11.5px] font-normal tabular-nums">
                        ({formatMoney(activeStock.change, activeCur, { showSign: true })})
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Quick Actions (Watchlist, Mock Trade, Link) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWatchlist(activeStock.symbol)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs tablet:text-[13px] font-bold transition-all whitespace-nowrap ${
                    isWatch
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      : 'bg-finance-sub-bg hover:bg-finance-card text-finance-text border border-finance-border'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isWatch ? 'fill-amber-500 text-amber-500' : ''}`} />
                  <span>{isWatch ? '관심 등록됨' : '관심 등록'}</span>
                </button>

                <button
                  onClick={() => setIsTradeModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-finance-accent hover:opacity-90 text-white text-xs tablet:text-[13px] font-bold transition-all shadow-xs active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>모의 매매</span>
                </button>

                <button
                  onClick={() => navigateToStock(activeStock.symbol)}
                  className="p-2 rounded-xl border border-finance-border hover:bg-finance-sub-bg text-finance-sub-text transition-colors"
                  title="전체 상세 화면으로 보기"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. Key Trading Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5 py-3 bg-finance-sub-bg/30 border-b border-finance-border text-xs text-finance-text">
              <div>
                <span className="text-[11px] tablet:text-[11.5px] text-finance-sub-text block leading-snug">당일 고가 / 저가</span>
                <span className="font-mono font-bold text-finance-text text-xs tablet:text-[13.5px] tabular-nums whitespace-nowrap">
                  {formatMoney(activeStock.highPrice || activeStock.price, activeCur)}
                  <span className="text-finance-sub-text font-normal"> / </span>
                  {formatMoney(activeStock.lowPrice || activeStock.price, activeCur)}
                </span>
              </div>

              <div>
                <span className="text-[11px] tablet:text-[11.5px] text-finance-sub-text block leading-snug">거래량 (24H)</span>
                <span className="font-mono font-bold text-finance-text text-xs tablet:text-[13.5px] tabular-nums whitespace-nowrap">
                  {(activeStock.volume || 0).toLocaleString()}{activeStock.market === 'COIN' ? '' : '주'}
                </span>
              </div>

              <div>
                <span className="text-[11px] tablet:text-[11.5px] text-finance-sub-text block leading-snug">시가총액</span>
                <span className="font-mono font-bold text-finance-text text-xs tablet:text-[13.5px] tabular-nums whitespace-nowrap">
                  {formatMarketCapByCurrency(activeStock.marketCap, activeCur)}
                </span>
              </div>

              <div>
                <span className="text-[11px] tablet:text-[11.5px] text-finance-sub-text block leading-snug">PER / PBR</span>
                <span className="font-mono font-bold text-finance-text text-xs tablet:text-[13.5px] tabular-nums whitespace-nowrap">
                  {activeStock.per ? `${activeStock.per.toFixed(1)}배` : '-'} / {activeStock.pbr ? `${activeStock.pbr.toFixed(2)}배` : '-'}
                </span>
              </div>
            </div>

            {/* 3. Large Interactive Chart */}
            <div className="p-4 bg-finance-card border-b border-finance-border">
              <InteractiveStockChart
                symbol={activeStock.symbol}
                candles={activeStock.candles}
                stockPrice={activeStock.price}
                prevClose={activeStock.prevClose || activeStock.price}
                currency={activeStock.currency}
              />
            </div>

            {/* 4. Sub-Navigation Tabs under Chart */}
            <div className="p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-finance-border pb-3 overflow-x-auto no-scrollbar">
                {[
                  { id: 'orderbook', label: '실시간 호가 / 체결', icon: <BarChart2 className="w-3.5 h-3.5" /> },
                  { id: 'metrics', label: '기업 분석 & 재무비율', icon: <Activity className="w-3.5 h-3.5" /> },
                  { id: 'news', label: '뉴스 & 공시', icon: <Newspaper className="w-3.5 h-3.5" /> },
                  { id: 'community', label: '주주 토론방', icon: <MessageSquare className="w-3.5 h-3.5" /> },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveRightTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs tablet:text-[13px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeRightTab === tab.id
                        ? 'bg-finance-accent text-white shadow-xs'
                        : 'text-finance-sub-text hover:text-finance-text hover:bg-finance-sub-bg'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Sub-Tab Contents */}
              <div>
                {activeRightTab === 'orderbook' && (
                  <div className="max-w-xl">
                    <OrderBookWidget stock={activeStock} />
                  </div>
                )}

                {activeRightTab === 'metrics' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-finance-sub-bg/30 border border-finance-border">
                    <div className="p-3 bg-finance-card rounded-xl border border-finance-border">
                      <span className="text-finance-sub-text text-xs tablet:text-[11.5px] block mb-1">52주 최고가</span>
                      <span className="font-mono font-bold text-sm tablet:text-[14px] text-finance-text tabular-nums whitespace-nowrap">
                        {activeStock.high52w ? formatMoney(activeStock.high52w, activeCur) : '-'}
                      </span>
                    </div>

                    <div className="p-3 bg-finance-card rounded-xl border border-finance-border">
                      <span className="text-finance-sub-text text-xs tablet:text-[11.5px] block mb-1">52주 최저가</span>
                      <span className="font-mono font-bold text-sm tablet:text-[14px] text-finance-text tabular-nums whitespace-nowrap">
                        {activeStock.low52w ? formatMoney(activeStock.low52w, activeCur) : '-'}
                      </span>
                    </div>

                    <div className="p-3 bg-finance-card rounded-xl border border-finance-border">
                      <span className="text-finance-sub-text text-xs tablet:text-[11.5px] block mb-1">주당순이익 (EPS)</span>
                      <span className="font-mono font-bold text-sm tablet:text-[14px] text-finance-text tabular-nums whitespace-nowrap">
                        {activeStock.eps ? formatMoney(activeStock.eps, activeCur) : '-'}
                      </span>
                    </div>

                    <div className="p-3 bg-finance-card rounded-xl border border-finance-border">
                      <span className="text-finance-sub-text text-xs tablet:text-[11.5px] block mb-1">배당수익률</span>
                      <span className="font-mono font-bold text-sm tablet:text-[14px] text-finance-accent tabular-nums whitespace-nowrap">
                        {activeStock.dividendYield ? `${activeStock.dividendYield.toFixed(2)}%` : '-'}
                      </span>
                    </div>
                  </div>
                )}

                {activeRightTab === 'news' && (
                  <StockNewsSection stock={activeStock} />
                )}

                {activeRightTab === 'community' && (
                  <StockCommunitySection stock={activeStock} />
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-slate-400 text-xs">
            종목을 선택해주세요.
          </div>
        )}
      </div>

      {/* Mock Trade Modal */}
      {activeStock && isTradeModalOpen && (
        <MockTradeModal
          isOpen={isTradeModalOpen}
          onClose={() => setIsTradeModalOpen(false)}
          symbol={activeStock.symbol}
          stockName={activeStock.name}
          initialType="BUY"
        />
      )}
    </div>
  );
};
