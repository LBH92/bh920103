import React, { useState, useEffect, useMemo } from 'react';
import { Stock, OrderBook } from '../../types';
import { stockRepository } from '../../services/stockRepository';
import { AlertCircle } from 'lucide-react';

interface OrderBookWidgetProps {
  stock: Stock;
}

export const OrderBookWidget = React.memo(({ stock }: OrderBookWidgetProps) => {
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(stock.price);
  const [change, setChange] = useState<number>(stock.change);
  const [changePercent, setChangePercent] = useState<number>(stock.changePercent);
  const [volume, setVolume] = useState<number>(stock.volume);
  const [isRealtime, setIsRealtime] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'10' | '5'>('10');

  // Helper for defensive number formatting
  const formatDefensiveNumber = (val: number | null | undefined, options?: Intl.NumberFormatOptions): string => {
    if (val === null || val === undefined || isNaN(val)) return '-';
    return val.toLocaleString(undefined, options);
  };

  const formatPercentage = (val: number | null | undefined): string => {
    if (val === null || val === undefined || isNaN(val)) return '-';
    return `${val > 0 ? '+' : ''}${val.toFixed(2)}%`;
  };

  const formatPrice = (p: number | null | undefined) => {
    if (p === null || p === undefined || p <= 0 || isNaN(p)) return '-';
    if (stock.currency === 'USD') return `$${p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (stock.currency === 'USDT') return `${p.toLocaleString(undefined, { minimumFractionDigits: p < 1 ? 4 : 2 })}`;
    if (stock.currency === 'BTC') return p.toFixed(8);
    return `${p.toLocaleString()}원`;
  };

  // Sync state if parent stock prop changes
  useEffect(() => {
    setCurrentPrice(stock.price);
    setChange(stock.change);
    setChangePercent(stock.changePercent);
    setVolume(stock.volume);
    setLastUpdated(new Date());
  }, [stock.symbol, stock.price, stock.change, stock.changePercent, stock.volume]);

  // Connect to Real-time Order Book and Execution Tick via Kiwoom WebSocket & SSE
  useEffect(() => {
    let isSubscribed = true;

    // 1. Initial REST fetch for Order Book
    stockRepository.getOrderBook(stock.symbol).then(data => {
      if (isSubscribed && data && Array.isArray(data.asks) && data.asks.length > 0) {
        setOrderBook(data);
        setLastUpdated(new Date());
        if (data.currentPrice) {
          setCurrentPrice(data.currentPrice);
        }
      }
    }).catch(err => {
      console.warn('[OrderBookWidget] Initial order book fetch error, using fallback:', err);
    });

    // 2. Subscribe to Real-time 10-level Order Book (Kiwoom WS H0STASP0)
    const unsubOrderBook = stockRepository.subscribeOrderBook?.(stock.symbol, (realtimeOrderBook) => {
      if (!isSubscribed) return;
      if (realtimeOrderBook && realtimeOrderBook.symbol === stock.symbol) {
        // 실시간 호가의 최우선 매도호가나 중심가가 현재 종목 주가와 10% 이상 괴리되면 오염 데이터로 간주하여 차단
        const samplePrice = realtimeOrderBook.asks?.[0]?.price || realtimeOrderBook.bids?.[0]?.price;
        if (stock.price > 0 && samplePrice && Math.abs(samplePrice - stock.price) / stock.price > 0.10) {
          return;
        }
        setOrderBook(realtimeOrderBook);
        setIsRealtime(true);
      }
    });

    // 3. Subscribe to Real-time Execution Tick (Kiwoom WS H0STCNT0) for 현재가 / 등락률 / 거래량
    const unsubExecution = stockRepository.subscribeExecutionTick?.(stock.symbol, (tick) => {
      if (stock.price > 0 && tick.price > 0 && Math.abs(tick.price - stock.price) / stock.price > 0.10) return;
      if (!isSubscribed) return;
      if (tick && tick.symbol === stock.symbol) {
        setCurrentPrice(tick.price);
        setChange(tick.change);
        setChangePercent(tick.changePercent);
        if (tick.volume > 0) {
          setVolume(prev => Math.max(prev, tick.volume));
        }
        setLastUpdated(new Date());
        setIsRealtime(true);
      }
    });

    // Cleanup: Unsubscribe on unmount or when stock.symbol changes to prevent duplicate subscriptions
    return () => {
      isSubscribed = false;
      unsubOrderBook?.();
      unsubExecution?.();
    };
  }, [stock.symbol]);

  const { hasRealDepth, displayedAsks, displayedBids, total, askRatio, bidRatio } = useMemo(() => {
    const hasRealDepth = Boolean(orderBook && Array.isArray(orderBook.asks) && orderBook.asks.length > 0);
    const displayedAsks = hasRealDepth && orderBook ? (viewMode === '5' ? orderBook.asks.slice(-5) : orderBook.asks) : [];
    const displayedBids = hasRealDepth && orderBook ? (viewMode === '5' ? orderBook.bids.slice(0, 5) : orderBook.bids) : [];

    const total = hasRealDepth && orderBook ? (orderBook.totalAskVolume + orderBook.totalBidVolume || 1) : 1;
    const askRatio = hasRealDepth && orderBook ? Math.round((orderBook.totalAskVolume / total) * 100) : 50;
    const bidRatio = 100 - askRatio;
    return { hasRealDepth, displayedAsks, displayedBids, total, askRatio, bidRatio };
  }, [orderBook, viewMode]);

  const assetUnit = stock.market === 'COIN' ? (stock.baseCurrency || '코인') : '주';

  return (
    <div className="bg-finance-card border border-finance-border rounded-2xl p-4 shadow-xs text-finance-text">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-sm tablet:text-[15px] text-finance-text">
            실시간 10단계 호가창
          </h4>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] tablet:text-[11px] font-bold bg-finance-accent/15 text-finance-accent border border-finance-accent/30 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-finance-accent animate-pulse" />
            {stock.market === 'COIN'
              ? `${stock.exchange === 'UPBIT' ? '업비트 실시간' : '바이낸스 실시간'}`
              : (isRealtime ? '키움 실시간' : '실시간 연동')}
          </span>
          {isRealtime && (
            <span className="text-[10px] tablet:text-[11px] text-finance-sub-text font-mono tabular-nums">
              {lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-finance-sub-bg rounded-lg p-0.5 text-[11px] tablet:text-[12px] font-medium border border-finance-border">
            <button
              type="button"
              onClick={() => setViewMode('10')}
              className={`px-2 tablet:px-2.5 py-0.5 rounded-md transition-colors whitespace-nowrap ${
                viewMode === '10'
                  ? 'bg-finance-card text-finance-text font-bold shadow-xs'
                  : 'text-finance-sub-text hover:text-finance-text'
              }`}
            >
              10호가
            </button>
            <button
              type="button"
              onClick={() => setViewMode('5')}
              className={`px-2 tablet:px-2.5 py-0.5 rounded-md transition-colors whitespace-nowrap ${
                viewMode === '5'
                  ? 'bg-finance-card text-finance-text font-bold shadow-xs'
                  : 'text-finance-sub-text hover:text-finance-text'
              }`}
            >
              5호가
            </button>
          </div>
          <span className="text-[11px] tablet:text-[11.5px] font-mono text-finance-sub-text tabular-nums whitespace-nowrap">
            단위: {assetUnit}
          </span>
        </div>
      </div>

      {/* 10-Level Order Book Table */}
      <div className="border border-finance-border rounded-xl overflow-hidden font-mono text-xs">
        {hasRealDepth ? (
          <>
            {/* Asks (매도 10~1호가) */}
            <div className="divide-y divide-finance-border/50 bg-finance-down/5 max-h-[260px] overflow-y-auto">
              {displayedAsks.map((ask: any, i: number) => {
                const isCurrent = ask.price === currentPrice;
                const askLevel = viewMode === '5' ? 5 - i : (orderBook?.asks.length || 10) - i;
                return (
                  <div
                    key={`ask-${ask.price}-${i}`}
                    className={`relative flex items-center justify-between py-1.5 px-3 transition-colors ${
                      isCurrent ? 'ring-1 ring-finance-up font-bold bg-finance-up/10' : 'hover:bg-finance-down/10'
                    }`}
                  >
                    <div
                      className="absolute right-0 top-0 bottom-0 bg-finance-down/15 pointer-events-none transition-all duration-300"
                      style={{ width: `${ask.barPercent}%` }}
                    />
                    <div className="relative z-10 flex items-center gap-1.5 text-finance-sub-text text-[11px] tablet:text-[11.5px] tabular-nums whitespace-nowrap">
                      <span className="text-[10px] tablet:text-[10.5px] text-finance-sub-text font-sans opacity-80">
                        {askLevel}호가
                      </span>
                      <span>{formatDefensiveNumber(ask.volume)}</span>
                    </div>
                    <span className="relative z-10 font-bold text-finance-down tablet:text-[13px] tabular-nums whitespace-nowrap">
                      {formatPrice(ask.price)}
                    </span>
                    <span className="relative z-10 text-[10px] tablet:text-[11px] text-finance-down tabular-nums whitespace-nowrap">
                      {formatPercentage(ask.changePercent)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Current Price Divider Bar */}
            <div className="py-2 px-3 bg-finance-sub-bg font-bold flex items-center justify-between text-finance-text border-y border-finance-border">
              <div className="flex items-center gap-1.5">
                <span className="text-xs tablet:text-[13px] font-sans whitespace-nowrap">현재가</span>
                <span className="text-[11px] tablet:text-[11.5px] font-mono text-finance-sub-text font-normal tabular-nums whitespace-nowrap">
                  누적 {formatDefensiveNumber(volume)}{assetUnit}
                </span>
              </div>
              <span className="text-sm tablet:text-[19px] font-black text-finance-up tabular-nums whitespace-nowrap">
                {formatPrice(currentPrice)}
              </span>
              <span className={`text-xs tablet:text-[13px] tabular-nums whitespace-nowrap ${change !== null && change !== undefined && change >= 0 ? 'text-finance-up' : 'text-finance-down'}`}>
                {change !== null && change !== undefined ? `${change >= 0 ? '+' : ''}${change.toLocaleString()}` : '-'} ({formatPercentage(changePercent)})
              </span>
            </div>

            {/* Bids (매수 1~10호가) */}
            <div className="divide-y divide-finance-border/50 bg-finance-up/5 max-h-[260px] overflow-y-auto">
              {displayedBids.map((bid: any, i: number) => {
                const isCurrent = bid.price === currentPrice;
                const bidLevel = i + 1;
                return (
                  <div
                    key={`bid-${bid.price}-${i}`}
                    className={`relative flex items-center justify-between py-1.5 px-3 transition-colors ${
                      isCurrent ? 'ring-1 ring-finance-up font-bold bg-finance-up/10' : 'hover:bg-finance-up/10'
                    }`}
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-finance-up/15 pointer-events-none transition-all duration-300"
                      style={{ width: `${bid.barPercent || 0}%` }}
                    />
                    <span className="relative z-10 text-[10px] tablet:text-[11px] text-finance-up tabular-nums whitespace-nowrap">
                      {formatPercentage(bid.changePercent)}
                    </span>
                    <span className="relative z-10 font-bold text-finance-up tablet:text-[13px] tabular-nums whitespace-nowrap">
                      {formatPrice(bid.price)}
                    </span>
                    <div className="relative z-10 flex items-center gap-1.5 text-finance-sub-text text-[11px] tablet:text-[11.5px] tabular-nums whitespace-nowrap">
                      <span>{formatDefensiveNumber(bid.volume)}</span>
                      <span className="text-[10px] tablet:text-[10.5px] text-finance-sub-text font-sans opacity-80">
                        {bidLevel}호가
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="p-6 text-center space-y-3">
            <div className="py-2 px-3 bg-finance-sub-bg font-bold flex items-center justify-between text-finance-text border border-finance-border rounded-lg">
              <span className="text-xs tablet:text-[13px] font-sans whitespace-nowrap">실시간 현재가</span>
              <span className="text-sm tablet:text-[19px] font-black text-finance-up tabular-nums whitespace-nowrap">
                {formatPrice(currentPrice)}
              </span>
              <span className={`text-xs tablet:text-[13px] tabular-nums whitespace-nowrap ${change !== null && change !== undefined && change >= 0 ? 'text-finance-up' : 'text-finance-down'}`}>
                {change !== null && change !== undefined ? `${change >= 0 ? '+' : ''}${change.toLocaleString()}` : '-'} ({changePercent !== null && changePercent !== undefined ? `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%` : '-'})
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs tablet:text-[13px] text-finance-sub-text bg-finance-sub-bg/70 border border-finance-border rounded-xl p-3">
              <AlertCircle className="w-4 h-4 shrink-0 text-finance-accent" />
              <span>
                {stock.market === 'US'
                  ? '미국 주식 시장은 10단계 호가창을 제공하지 않으며 단일 체결가 기준으로 거래됩니다.'
                  : stock.market === 'COIN'
                  ? '가상자산 거래소 호가 데이터를 연결 중입니다.'
                  : '실시간 10단계 호가 잔량은 증권사(키움증권 Open API) 연동 후 제공됩니다.'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Total Depth comparison bar */}
      {hasRealDepth && (
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-[11px] tablet:text-[11.5px] font-mono tabular-nums whitespace-nowrap">
            <span className="text-finance-down font-bold">
              매도잔량: {(orderBook?.totalAskVolume || 0).toLocaleString()} ({askRatio}%)
            </span>
            <span className="text-finance-up font-bold">
              매수잔량: {(orderBook?.totalBidVolume || 0).toLocaleString()} ({bidRatio}%)
            </span>
          </div>
          <div className="h-2 w-full bg-finance-sub-bg rounded-full overflow-hidden flex border border-finance-border/50">
            <div className="h-full bg-finance-down transition-all duration-300" style={{ width: `${askRatio}%` }} />
            <div className="h-full bg-finance-up transition-all duration-300" style={{ width: `${bidRatio}%` }} />
          </div>
        </div>
      )}
    </div>
  );
});

