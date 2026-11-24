/**
 * RealStockRepository
 * 
 * Production implementation of IStockRepository.
 * 
 * Architecture:
 * Browser (RealStockRepository)
 *   ↓
 * Backend API (/api/stocks, /api/stocks/:symbol)
 *   ↓
 * External Real Stock API (Server-side fetch with API keys / Yahoo Finance)
 *   ↓
 * Backend (Server-side cache & rate limiter)
 *   ↓
 * Browser (L1/L2 cache & state update)
 * 
 * Strict Principle:
 * - NO external stock API is called directly from the browser!
 * - All API keys remain securely on the server.
 */

import { Stock, StockIndex, ExchangeRate, CandleData, StockNews, OrderBook, KiwoomChartPeriod, KiwoomChartResponse, ChartCandleType } from '../types';
import { IStockRepository, ChartPeriod, VolumeAnalysisData, StockDataSourceType } from './stockRepositoryInterface';
import { stockCache } from './stockCache';
import { matchHangulSearch } from '../utils/hangul';
import { INITIAL_STOCKS, INITIAL_INDICES, INITIAL_EXCHANGE_RATE, INITIAL_NEWS, generateOrderBook } from './mockData';
import { MockStockRepository } from './mockStockRepository';
import { isPreviewEnvironment } from '../utils/environment';

export class RealStockRepository implements IStockRepository {
  private subscribers: Set<(stocks: Stock[]) => void> = new Set();
  private pollIntervalId: any = null;
  private inFlightSearchRequests = new Map<string, Promise<Stock[]>>();
  private inFlightAllStocks: Promise<Stock[]> | null = null;
  private inFlightIndices: Promise<StockIndex[]> | null = null;
  private inFlightExchangeRate: Promise<ExchangeRate> | null = null;
  private inFlightBatchQuotes = new Map<string, Promise<Stock[]>>();

  // Shared multiplexed SSE connections (prevents HTTP/1.1 6-connection pool exhaustion & timer leaks)
  private sharedTickES: EventSource | null = null;
  private tickListeners = new Map<string, Set<(tick: any) => void>>();
  private tickReconnectTimer: any = null;
  private tickReconnectDelay = 2000;

  private sharedObES: EventSource | null = null;
  private obListeners = new Map<string, Set<(orderBook: OrderBook) => void>>();
  private obReconnectTimer: any = null;
  private obReconnectDelay = 2000;
  private obFallbackIntervals = new Map<string, any>();

  getSourceType(): StockDataSourceType {
    return 'REAL';
  }

  /**
   * 1. Get All Stocks from Backend
   */
  async getAllStocks(forceRefresh: boolean = false): Promise<Stock[]> {
    const cacheKey = 'real_stocks_all';

    if (!forceRefresh) {
      const cached = stockCache.get<Stock[]>(cacheKey);
      if (cached && cached.length > 0) {
        return cached;
      }
    }

    if (this.inFlightAllStocks) {
      return this.inFlightAllStocks;
    }

    this.inFlightAllStocks = (async () => {
      try {
        const res = await fetch('/api/stocks', {
          headers: { 'Accept': 'application/json' },
        });

        if (!res.ok) {
          throw new Error(`서버 응답 오류 (HTTP ${res.status})`);
        }

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const text = await res.text();
          try {
            const data: Stock[] = JSON.parse(text);
            if (Array.isArray(data) && data.length > 0) {
              stockCache.set(cacheKey, data, 5000);
              return data;
            }
          } catch {
            console.warn('[RealStockRepository] /api/stocks JSON parse error, using fallback');
          }
        } else {
          console.warn('[RealStockRepository] /api/stocks non-JSON response, using fallback');
        }
      } catch (err) {
        console.warn('[RealStockRepository] /api/stocks fetch failed:', err);
      }

      // Fallback if network or server error
      return stockCache.get<Stock[]>(cacheKey) || INITIAL_STOCKS;
    })().finally(() => {
      this.inFlightAllStocks = null;
    });

    return this.inFlightAllStocks;
  }

  /**
   * 2. Get Single Stock Details from Backend
   */
  async getStock(symbol: string): Promise<Stock | undefined> {
    const cacheKey = `real_stock_${symbol}`;

    const cached = stockCache.get<Stock>(cacheKey);
    if (cached && Array.isArray(cached.candles) && cached.candles.length > 0) return cached;

    try {
      const res = await fetch(`/api/stocks/${encodeURIComponent(symbol)}`);
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const text = await res.text();
          try {
            const data: Stock = JSON.parse(text);
            if (data && data.symbol) {
              stockCache.set(cacheKey, data, 5000);
              return data;
            }
          } catch {}
        }
      }
    } catch (err) {
      console.warn(`[RealStockRepository] /api/stocks/${symbol} failed:`, err);
    }

    if (cached) return cached;
    // Fallback to all stocks cache
    const all = await this.getAllStocks();
    return all.find(s => s.symbol === symbol);
  }

  /**
   * 2-1. Get Multiple Stocks Quotes by Symbols (Kiwoom Real Data)
   */
  async getStocksBySymbols(symbols: string[]): Promise<Stock[]> {
    if (!symbols || symbols.length === 0) return [];
    const batchKey = symbols.join(',');
    const existing = this.inFlightBatchQuotes.get(batchKey);
    if (existing) return existing;

    const promise = (async () => {
      try {
        const res = await fetch(`/api/stocks/quotes?symbols=${encodeURIComponent(batchKey)}`);
        if (res.ok) {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const text = await res.text();
            try {
              const data: Stock[] = JSON.parse(text);
              if (Array.isArray(data) && data.length > 0) {
                for (const s of data) {
                  // Only overwrite full cache entry if we preserve any existing candles
                  const prev = stockCache.get<Stock>(`real_stock_${s.symbol}`);
                  stockCache.set(`real_stock_${s.symbol}`, prev?.candles?.length && (!s.candles || s.candles.length === 0) ? { ...s, candles: prev.candles } : s, 5000);
                }
                return data;
              }
            } catch {}
          }
        }
      } catch (err) {
        console.warn('[RealStockRepository] /api/stocks/quotes fetch failed:', err);
      }

      const all = await this.getAllStocks();
      return symbols.map(sym => all.find(s => s.symbol === sym)).filter((s): s is Stock => Boolean(s));
    })().finally(() => {
      this.inFlightBatchQuotes.delete(batchKey);
    });

    this.inFlightBatchQuotes.set(batchKey, promise);
    return promise;
  }

  /**
   * 3. Search Stocks (L1 3s TTL cache + in-flight dedup + explicit error propagation)
   */
  async searchStocks(options: { query: string; limit?: number; market?: string; signal?: AbortSignal }): Promise<Stock[]> {
    const q = options.query.trim();
    if (!q) return [];
    if (options.signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const marketParam = (options.market || 'ALL').toUpperCase();
    const limitParam = options.limit || 12;
    const cacheKey = `search_${q.toLowerCase()}_${marketParam}_${limitParam}`;
    const cached = stockCache.get<Stock[]>(cacheKey);
    if (cached) return cached;

    const url = `/api/stocks/search?q=${encodeURIComponent(q)}${marketParam !== 'ALL' ? `&market=${encodeURIComponent(marketParam)}` : ''}&limit=${limitParam}`;

    const runFetch = async (signal?: AbortSignal): Promise<Stock[]> => {
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal,
      });

      if (!res.ok) {
        let msg = `검색 서버 오류 (HTTP ${res.status})`;
        try {
          const errBody = await res.json();
          if (errBody?.error) msg = errBody.error;
        } catch {}
        throw new Error(msg);
      }

      const results: Stock[] = await res.json();
      if (!Array.isArray(results)) {
        throw new Error('검색 응답 데이터 형식이 올바르지 않습니다.');
      }

      stockCache.set(cacheKey, results, 3000);
      return results;
    };

    // If caller supplied an AbortSignal, fetch directly with signal so abort cancels immediately
    if (options.signal) {
      return runFetch(options.signal);
    }

    const existing = this.inFlightSearchRequests.get(cacheKey);
    if (existing) return existing;

    const pending = runFetch().finally(() => {
      this.inFlightSearchRequests.delete(cacheKey);
    });
    this.inFlightSearchRequests.set(cacheKey, pending);
    return pending;
  }

  /**
   * 4. Get Historical Chart Candles from Backend
   */
  async getChartCandles(symbol: string, period: ChartPeriod): Promise<CandleData[]> {
    const cacheKey = `real_candles_${symbol}_${period}`;
    const cached = stockCache.get<CandleData[]>(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(`/api/stocks/${symbol}/chart?period=${period}`);
      if (res.ok) {
        const data: KiwoomChartResponse = await res.json();
        if (data && Array.isArray(data.candles)) {
          stockCache.set(cacheKey, data.candles, 15000);
          return data.candles;
        }
      }
    } catch (err) {
      console.error(`[RealStockRepository] fetch candles failed:`, err);
    }

    return [];
  }

  /**
   * 4-1. Get Real Chart with Metadata (candleType, date navigation, OHLCV)
   */
  async getKiwoomChart(
    symbol: string,
    period: KiwoomChartPeriod,
    options?: { candleType?: ChartCandleType; date?: string; signal?: AbortSignal }
  ): Promise<KiwoomChartResponse> {
    const params = new URLSearchParams({ period });
    if (options?.candleType) params.set('candleType', options.candleType);
    if (options?.date?.trim()) params.set('date', options.date.trim());

    const res = await fetch(`/api/stocks/${encodeURIComponent(symbol)}/chart?${params.toString()}`, {
      signal: options?.signal,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status} 차트 조회 실패`);
    }
    return res.json();
  }

  /**
   * 5. Get Related News (Real News API)
   */
  async getRelatedNews(symbol: string): Promise<StockNews[]> {
    const cacheKey = `real_news_${symbol}`;
    const cached = stockCache.get<StockNews[]>(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(`/api/news/stock/${symbol}?limit=10`);
      if (res.ok) {
        const data = await res.json();
        const newsItems: StockNews[] = Array.isArray(data.items) ? data.items : (Array.isArray(data) ? data : []);
        if (newsItems.length > 0) {
          stockCache.set(cacheKey, newsItems, 60000);
          return newsItems;
        }
      }
    } catch (err) {
      console.error(`[RealStockRepository] getRelatedNews failed for ${symbol}:`, err);
    }

    return [];
  }

  /**
   * 6. Get Volume & Investor Breakdown
   */
  async getVolumeAnalysis(symbol: string): Promise<VolumeAnalysisData> {
    const cacheKey = `real_vol_${symbol}`;
    const cached = stockCache.get<VolumeAnalysisData>(cacheKey);
    if (cached) return cached;

    const [stock, flow] = await Promise.all([
      this.getStock(symbol),
      fetch(`/api/stocks/${encodeURIComponent(symbol)}/investor-flow?unit=both`, {
        headers: { Accept: 'application/json' },
      })
        .then(async (res) => (res.ok ? res.json() : null))
        .catch(() => null),
    ]);

    const volumeRatio = stock ? stock.volumeRatio : 120.5;
    const volume = stock ? stock.volume : 5000000;
    const avgVolume20d = Math.round(volume / (Math.max(10, volumeRatio) / 100));
    const avgVolume5d = Math.round(volume * 0.95);
    const tradingValue = stock ? stock.tradingValue : 2500;
    const executionStrength = stock ? (stock.change >= 0 ? 118.5 : 84.2) : 105.0;
    const turnoverRatio = Number(((volume / ((stock?.marketCap || 100000) * 1000)) * 100).toFixed(2)) || 2.45;

    const foreignNetBuy = flow?.foreignNetBuy !== undefined ? flow.foreignNetBuy : (stock?.foreignNetBuy ?? null);
    const instNetBuy = flow?.instNetBuy !== undefined ? flow.instNetBuy : (stock?.instNetBuy ?? null);
    const individualNetBuy = flow?.individualNetBuy !== undefined ? flow.individualNetBuy : (stock?.individualNetBuy ?? null);

    const foreignNetBuyQty = flow?.foreignNetBuyQty ?? stock?.foreignNetBuyQty ?? null;
    const instNetBuyQty = flow?.instNetBuyQty ?? stock?.instNetBuyQty ?? null;
    const individualNetBuyQty = flow?.individualNetBuyQty ?? stock?.individualNetBuyQty ?? null;

    const hasAmountData = foreignNetBuy !== null && instNetBuy !== null;
    const hasQtyData = foreignNetBuyQty !== null && instNetBuyQty !== null;
    const investorDataAvailable = Boolean(
      (flow?.investorDataAvailable ?? stock?.investorDataAvailable) && (hasAmountData || hasQtyData)
    );

    const investorDataSource =
      flow?.investorDataSource ||
      stock?.investorDataSource ||
      (stock?.market === 'US' ? '미국 시장 미지원' : stock?.market === 'COIN' ? '가상자산 미지원' : '수급 데이터 미수신');
    const investorBaseDate = flow?.baseDate ?? stock?.investorBaseDate ?? undefined;
    const investorUpdateTime = flow?.updateTime ?? stock?.investorUpdateTime ?? undefined;

    const result: VolumeAnalysisData = {
      volumeRatio,
      volume,
      avgVolume20d,
      avgVolume5d,
      tradingValue,
      executionStrength,
      turnoverRatio,
      foreignNetBuy,
      instNetBuy,
      individualNetBuy,
      foreignNetBuyAmountMillion: flow?.foreignNetBuyAmountMillion ?? stock?.foreignNetBuyAmountMillion ?? null,
      instNetBuyAmountMillion: flow?.instNetBuyAmountMillion ?? stock?.instNetBuyAmountMillion ?? null,
      individualNetBuyAmountMillion: flow?.individualNetBuyAmountMillion ?? stock?.individualNetBuyAmountMillion ?? null,
      foreignNetBuyQty,
      instNetBuyQty,
      individualNetBuyQty,
      investorUnit: flow?.investorUnit || stock?.investorUnit || '억원',
      investorQtyUnit: flow?.investorQtyUnit || stock?.investorQtyUnit || '주',
      investorDataSource,
      investorBaseDate,
      investorUpdateTime,
      investorDataAvailable,
      isDirectInvestorIndividual: Boolean(flow?.isDirectInvestorIndividual || individualNetBuy !== null || individualNetBuyQty !== null),
    };

    stockCache.set(cacheKey, result, 10000);
    return result;
  }

  /**
   * 7. Get Indices from Backend
   */
  async getIndices(): Promise<StockIndex[]> {
    const cacheKey = 'real_indices';
    const cached = stockCache.get<StockIndex[]>(cacheKey);
    if (cached) return cached;

    if (this.inFlightIndices) return this.inFlightIndices;

    this.inFlightIndices = (async () => {
      try {
        const res = await fetch('/api/indices');
        if (res.ok) {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const text = await res.text();
            try {
              const data: StockIndex[] = JSON.parse(text);
              if (Array.isArray(data) && data.length > 0) {
                stockCache.set(cacheKey, data, 5000);
                return data;
              }
            } catch {
              console.warn('[RealStockRepository] getIndices parse error.');
            }
          } else {
            console.warn('[RealStockRepository] getIndices non-JSON response, using fallback.');
          }
        }
      } catch (err) {
        console.warn('[RealStockRepository] getIndices failed:', err);
      }

      return stockCache.get<StockIndex[]>(cacheKey) || INITIAL_INDICES;
    })().finally(() => {
      this.inFlightIndices = null;
    });

    return this.inFlightIndices;
  }

  /**
   * 8. Get Exchange Rate from Backend
   */
  async getExchangeRate(): Promise<ExchangeRate> {
    const cacheKey = 'real_exchange_rate';
    const cached = stockCache.get<ExchangeRate>(cacheKey);
    if (cached && cached.rate > 0 && !cached.isStale && cached.status !== 'error') {
      return cached;
    }

    if (this.inFlightExchangeRate) return this.inFlightExchangeRate;

    const pending: Promise<ExchangeRate> = (async (): Promise<ExchangeRate> => {
      try {
        const res = await fetch('/api/exchange-rate');
        if (res.ok) {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const text = await res.text();
            try {
              const data: ExchangeRate = JSON.parse(text);
              if (data && typeof data.rate === 'number' && !isNaN(data.rate)) {
                if (data.rate > 0 && !data.isStale && data.status !== 'error') {
                  stockCache.set(cacheKey, data, 5000);
                }
                return data;
              }
            } catch {
              console.warn('[RealStockRepository] getExchangeRate parse error.');
            }
          } else {
            console.warn('[RealStockRepository] getExchangeRate non-JSON response.');
          }
        }
      } catch (err) {
        console.warn('[RealStockRepository] getExchangeRate failed:', err);
      }

      if (cached && cached.rate > 0) {
        return {
          ...cached,
          status: 'stale',
          isStale: true,
          errorMessage: '환율 API 연결 실패로 만료된 최근 값을 유지합니다.',
        };
      }

      return {
        ...INITIAL_EXCHANGE_RATE,
        status: 'error',
        isStale: true,
        errorMessage: '환율 API 연결 실패',
      };
    })().finally(() => {
      this.inFlightExchangeRate = null;
    });

    this.inFlightExchangeRate = pending;
    return pending;
  }

  /**
   * Live Ticks Subscription with Visibility-Aware Polling from Backend
   */
  subscribeTicks(callback: (stocks: Stock[]) => void): () => void {
    this.subscribers.add(callback);

    if (!this.pollIntervalId) {
      let isPolling = false;
      this.pollIntervalId = setInterval(async () => {
        if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
        if (isPolling) return;
        isPolling = true;
        try {
          const freshStocks = await this.getAllStocks(true);
          this.subscribers.forEach(cb => cb(freshStocks));
        } catch {} finally {
          isPolling = false;
        }
      }, 15000);
    }

    return () => {
      this.subscribers.delete(callback);
      if (this.subscribers.size === 0 && this.pollIntervalId) {
        clearInterval(this.pollIntervalId);
        this.pollIntervalId = null;
      }
    };
  }

  private ensureSharedTickSSE() {
    if (this.sharedTickES || this.tickListeners.size === 0 || typeof EventSource === 'undefined') return;
    if (this.tickReconnectTimer) {
      clearTimeout(this.tickReconnectTimer);
      this.tickReconnectTimer = null;
    }

    try {
      const es = new EventSource('/api/stocks/ticks/stream');
      this.sharedTickES = es;

      es.onopen = () => {
        this.tickReconnectDelay = 2000;
      };

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (!data?.symbol) return;
          const callbacks = this.tickListeners.get(data.symbol);
          if (callbacks) {
            callbacks.forEach(cb => cb(data));
          }
        } catch {}
      };

      es.onerror = () => {
        if (this.sharedTickES) {
          this.sharedTickES.close();
          this.sharedTickES = null;
        }
        if (this.tickListeners.size > 0 && !this.tickReconnectTimer) {
          const delay = this.tickReconnectDelay;
          this.tickReconnectDelay = Math.min(this.tickReconnectDelay * 1.5, 15000);
          this.tickReconnectTimer = setTimeout(() => {
            this.tickReconnectTimer = null;
            this.ensureSharedTickSSE();
          }, delay);
        }
      };
    } catch {}
  }

  /**
   * Real-time single stock execution tick stream multiplexed over 1 shared EventSource
   */
  subscribeExecutionTick(
    symbol: string,
    callback: (tick: { symbol: string; price: number; change: number; changePercent: number; volume: number; open: number; high: number; low: number; time: string }) => void
  ): () => void {
    let set = this.tickListeners.get(symbol);
    const isFirstForSymbol = !set || set.size === 0;
    if (!set) {
      set = new Set();
      this.tickListeners.set(symbol, set);
    }
    set.add(callback);

    if (isFirstForSymbol) {
      fetch('/api/stocks/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol }),
      }).catch(() => {});
    }

    this.ensureSharedTickSSE();

    return () => {
      const callbacks = this.tickListeners.get(symbol);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.tickListeners.delete(symbol);
          fetch('/api/stocks/unsubscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symbol }),
          }).catch(() => {});
        }
      }

      if (this.tickListeners.size === 0) {
        if (this.tickReconnectTimer) {
          clearTimeout(this.tickReconnectTimer);
          this.tickReconnectTimer = null;
        }
        if (this.sharedTickES) {
          this.sharedTickES.close();
          this.sharedTickES = null;
        }
      }
    };
  }

  /**
   * Fetch 10-level Order Book from Backend / Kiwoom API
   */
  async getOrderBook(symbol: string): Promise<OrderBook> {
    try {
      const res = await fetch(`/api/stocks/${encodeURIComponent(symbol)}/orderbook`);
      if (res.ok) {
        const data: OrderBook = await res.json();
        if (data) {
          return data;
        }
      }
    } catch {}

    return {
      symbol,
      currentPrice: 0,
      asks: [],
      bids: [],
      totalAskVolume: 0,
      totalBidVolume: 0,
      timestamp: new Date().toISOString(),
      status: 'unavailable',
      dataSource: 'unavailable',
    };
  }

  private ensureSharedOrderBookSSE() {
    if (this.sharedObES || this.obListeners.size === 0 || typeof EventSource === 'undefined') return;
    if (this.obReconnectTimer) {
      clearTimeout(this.obReconnectTimer);
      this.obReconnectTimer = null;
    }

    try {
      const es = new EventSource('/api/stocks/orderbook/stream');
      this.sharedObES = es;

      es.onopen = () => {
        this.obReconnectDelay = 2000;
        for (const timer of this.obFallbackIntervals.values()) {
          clearInterval(timer);
        }
        this.obFallbackIntervals.clear();
      };

      es.onmessage = (event) => {
        try {
          const data: OrderBook = JSON.parse(event.data);
          if (!data?.symbol || !Array.isArray(data.asks) || data.asks.length === 0) return;
          const callbacks = this.obListeners.get(data.symbol);
          if (callbacks) {
            callbacks.forEach(cb => cb(data));
          }
        } catch {}
      };

      es.onerror = () => {
        if (this.sharedObES) {
          this.sharedObES.close();
          this.sharedObES = null;
        }
        if (this.obListeners.size > 0 && !this.obReconnectTimer) {
          const delay = this.obReconnectDelay;
          this.obReconnectDelay = Math.min(this.obReconnectDelay * 1.5, 15000);
          this.obReconnectTimer = setTimeout(() => {
            this.obReconnectTimer = null;
            this.ensureSharedOrderBookSSE();
          }, delay);
        }
      };
    } catch {}
  }

  /**
   * Real-time single stock order book stream multiplexed over 1 shared EventSource
   */
  subscribeOrderBook(
    symbol: string,
    callback: (orderBook: OrderBook) => void
  ): () => void {
    let set = this.obListeners.get(symbol);
    const isFirstForSymbol = !set || set.size === 0;
    if (!set) {
      set = new Set();
      this.obListeners.set(symbol, set);
    }
    set.add(callback);

    if (isFirstForSymbol) {
      fetch('/api/stocks/subscribe-orderbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol }),
      }).catch(() => {});
    }

    this.ensureSharedOrderBookSSE();

    return () => {
      const callbacks = this.obListeners.get(symbol);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.obListeners.delete(symbol);
          const fallbackTimer = this.obFallbackIntervals.get(symbol);
          if (fallbackTimer) {
            clearInterval(fallbackTimer);
            this.obFallbackIntervals.delete(symbol);
          }
          fetch('/api/stocks/unsubscribe-orderbook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symbol }),
          }).catch(() => {});
        }
      }

      if (this.obListeners.size === 0) {
        if (this.obReconnectTimer) {
          clearTimeout(this.obReconnectTimer);
          this.obReconnectTimer = null;
        }
        if (this.sharedObES) {
          this.sharedObES.close();
          this.sharedObES = null;
        }
      }
    };
  }
}
