/**
 * Server-Side Stock API Service
 * 
 * Strict Principle:
 * - NO external stock API is called directly from browser!
 * - All external API calls, keys, rate limiting, and caching live here on the server.
 */

import fs from 'fs';
import path from 'path';
import { CandleData, ChartCandleType, Stock, StockIndex, ExchangeRate, KiwoomChartResponse } from '../src/types';
import { kiwoomApiService, KiwoomInvestorFlowResult } from './kiwoomApiService';
import { serverResilienceService } from './serverResilienceService';
import { toProviderTicker, isUSStockSymbol } from '../src/utils/stocks/ticker';
import { sanitizeAndValidateCandles } from '../src/utils/chartSanitizer';
import { usStockSearchService } from './usStockMaster';
import { cryptoMasterService } from './cryptoMasterService';

interface ServerCacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

const serverCache = new Map<string, ServerCacheEntry<any>>();
const MAX_SERVER_CACHE_ENTRIES = 1000;

export function pruneServerCache(): number {
  const now = Date.now();
  let removed = 0;
  for (const [key, entry] of serverCache.entries()) {
    if (now - entry.timestamp >= Math.max(entry.ttlMs * 2, 60000)) {
      serverCache.delete(key);
      removed++;
    }
  }
  while (serverCache.size > MAX_SERVER_CACHE_ENTRIES) {
    const oldestKey = serverCache.keys().next().value;
    if (!oldestKey) break;
    serverCache.delete(oldestKey);
    removed++;
  }
  return removed;
}

const CACHE_FILE_PATH = path.join(process.cwd(), '.last_valid_stocks.json');

function loadLastValidStockCache(): Map<string, Stock> {
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const raw = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
      const data = JSON.parse(raw);
      if (data && typeof data === 'object') {
        const restored = new Map<string, Stock>();
        for (const [sym, val] of Object.entries(data)) {
          const st = val as Stock;
          if (st && typeof st === 'object' && typeof st.price === 'number' && Number.isFinite(st.price) && st.price > 0) {
            restored.set(sym, st);
          }
        }
        return restored;
      }
    }
  } catch (err) {
    console.warn('[StockAPI] Failed to load last valid stock cache from disk:', err);
  }
  return new Map<string, Stock>();
}



async function atomicWriteCacheAsync(serialized: string): Promise<void> {
  const tmpPath = `${CACHE_FILE_PATH}.tmp.${process.pid}.${Date.now()}`;
  try {
    await fs.promises.writeFile(tmpPath, serialized, 'utf-8');
    await fs.promises.rename(tmpPath, CACHE_FILE_PATH);
  } catch (err) {
    try {
      await fs.promises.unlink(tmpPath);
    } catch {}
    throw err;
  }
}

let persistCacheTimer: NodeJS.Timeout | null = null;
let persistChain: Promise<void> = Promise.resolve();
let persistQueued = false;

function writeCacheSnapshotAsync(): Promise<void> {
  if (persistQueued) return persistChain;
  persistQueued = true;
  persistChain = persistChain
    .then(async () => {
      persistQueued = false;
      const obj = Object.fromEntries(lastValidStockCache.entries());
      await atomicWriteCacheAsync(JSON.stringify(obj));
    })
    .catch((err) => {
      persistQueued = false;
      console.warn('[StockAPI] Failed to persist last valid stock cache to disk:', err);
    });
  return persistChain;
}

function schedulePersistLastValidStockCache() {
  if (persistCacheTimer) return;
  persistCacheTimer = setTimeout(() => {
    persistCacheTimer = null;
    void writeCacheSnapshotAsync();
  }, 3000);
}

export async function flushLastValidStockCache(): Promise<void> {
  if (persistCacheTimer) {
    clearTimeout(persistCacheTimer);
    persistCacheTimer = null;
  }
  await persistChain.catch(() => {});
  const tmpPath = `${CACHE_FILE_PATH}.tmp.${process.pid}.sync`;
  try {
    const obj = Object.fromEntries(lastValidStockCache.entries());
    fs.writeFileSync(tmpPath, JSON.stringify(obj), 'utf-8');
    fs.renameSync(tmpPath, CACHE_FILE_PATH);
  } catch (err) {
    try {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    } catch {}
    console.warn('[StockAPI] Failed to flush last valid stock cache to disk:', err);
  }
}

const lastValidStockCache = loadLastValidStockCache();

function validateAndPreserveStock(symbol: string, stock: Stock | null): Stock | null {
  if (!stock || stock.price <= 0 || !Number.isFinite(stock.price)) {
    const lastValid = lastValidStockCache.get(symbol);
    if (lastValid) {
      return {
        ...lastValid,
        isStale: true,
        delayLabel: '최근 정상 시세 유지 (시세 확인 중)',
      };
    }
    return null;
  }

  // Strict OHLC Integrity & Candle Validation
  if (stock.candles && Array.isArray(stock.candles)) {
    const seenTimes = new Set<string>();
    stock.candles = stock.candles.filter(c => {
      if (!c || typeof c.open !== 'number' || typeof c.high !== 'number' || typeof c.low !== 'number' || typeof c.close !== 'number') return false;
      if (c.open <= 0 || c.high <= 0 || c.low <= 0 || c.close <= 0) return false;
      if (!Number.isFinite(c.open) || !Number.isFinite(c.high) || !Number.isFinite(c.low) || !Number.isFinite(c.close)) return false;
      if (c.high < Math.max(c.open, c.close) || c.low > Math.min(c.open, c.close)) return false;
      if (seenTimes.has(c.time)) return false;
      seenTimes.add(c.time);
      return true;
    });
  }

  lastValidStockCache.set(symbol, stock);
  schedulePersistLastValidStockCache();
  return stock;
}

let inFlightAllStocks: Promise<FetchAllStocksResult> | null = null;
let inFlightIndices: Promise<FetchIndicesResult> | null = null;
let inFlightExchange: Promise<ExchangeRate> | null = null;
const inFlightSingleStock = new Map<string, Promise<FetchStockResult>>();

export function toCompactStockQuote(stock: Stock): Stock {
  if (!stock.candles || stock.candles.length === 0) return stock;
  return { ...stock, candles: [] };
}

function getFromCache<T>(key: string): T | null {
  const entry = serverCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp < entry.ttlMs) {
    return entry.data as T;
  }
  return null;
}

function setInCache<T>(key: string, data: T, ttlMs: number): void {
  serverCache.set(key, {
    data,
    timestamp: Date.now(),
    ttlMs,
  });
  if (serverCache.size > MAX_SERVER_CACHE_ENTRIES) {
    pruneServerCache();
  }
}

// Korean Stock Registry with Ticker mappings
export const TRACKED_STOCKS = [
  { symbol: '005930', ticker: '005930.KS', name: '삼성전자', market: 'KOSPI' as const, sector: '반도체 / IT' },
  { symbol: '000660', ticker: '000660.KS', name: 'SK하이닉스', market: 'KOSPI' as const, sector: '반도체 / HBM' },
  { symbol: '005380', ticker: '005380.KS', name: '현대차', market: 'KOSPI' as const, sector: '자동차 / 모빌리티' },
  { symbol: '000270', ticker: '000270.KS', name: '기아', market: 'KOSPI' as const, sector: '자동차 / 모빌리티' },
  { symbol: '196170', ticker: '196170.KQ', name: '알테오젠', market: 'KOSDAQ' as const, sector: '바이오 / 플랫폼' },
  { symbol: '042700', ticker: '042700.KS', name: '한미반도체', market: 'KOSPI' as const, sector: '반도체 / TC본더' },
  { symbol: '064350', ticker: '064350.KS', name: '현대로템', market: 'KOSPI' as const, sector: '방위산업 / 철도' },
  { symbol: '034020', ticker: '034020.KS', name: '두산에너빌리티', market: 'KOSPI' as const, sector: '원자력 / 플랜트' },
  { symbol: '373220', ticker: '373220.KS', name: 'LG에너지솔루션', market: 'KOSPI' as const, sector: '2차전지 / 배터리' },
  { symbol: '247540', ticker: '247540.KQ', name: '에코프로비엠', market: 'KOSDAQ' as const, sector: '2차전지 / 양극재' },
  { symbol: '086520', ticker: '086520.KQ', name: '에코프로', market: 'KOSDAQ' as const, sector: '2차전지 / 지주' },
  { symbol: '207940', ticker: '207940.KS', name: '삼성바이오로직스', market: 'KOSPI' as const, sector: '바이오 / CDMO' },
  { symbol: '035420', ticker: '035420.KS', name: 'NAVER', market: 'KOSPI' as const, sector: 'IT인터넷 / 플랫폼' },
  { symbol: '035720', ticker: '035720.KS', name: '카카오', market: 'KOSPI' as const, sector: 'IT인터넷 / 플랫폼' },
  { symbol: '005490', ticker: '005490.KS', name: 'POSCO홀딩스', market: 'KOSPI' as const, sector: '철강 / 친환경소재' },
  { symbol: '012330', ticker: '012330.KS', name: '현대모비스', market: 'KOSPI' as const, sector: '자동차부품' },
  { symbol: '105560', ticker: '105560.KS', name: 'KB금융', market: 'KOSPI' as const, sector: '금융 / 은행' },
  { symbol: '055550', ticker: '055550.KS', name: '신한지주', market: 'KOSPI' as const, sector: '금융 / 은행' },
  { symbol: '417860', ticker: '417860.KQ', name: '삼현', market: 'KOSDAQ' as const, sector: '로봇 / 액추에이터' },
  // US Major Stocks
  { symbol: 'AAPL', ticker: 'AAPL', name: '애플', market: 'US' as const, sector: '빅테크 / IT', currency: 'USD' as const, exchange: 'NASDAQ' },
  { symbol: 'NVDA', ticker: 'NVDA', name: '엔비디아', market: 'US' as const, sector: '반도체 / AI', currency: 'USD' as const, exchange: 'NASDAQ' },
  { symbol: 'MSFT', ticker: 'MSFT', name: '마이크로소프트', market: 'US' as const, sector: '클라우드 / AI', currency: 'USD' as const, exchange: 'NASDAQ' },
  { symbol: 'TSLA', ticker: 'TSLA', name: '테슬라', market: 'US' as const, sector: '전기차 / 자율주행', currency: 'USD' as const, exchange: 'NASDAQ' },
  { symbol: 'AMZN', ticker: 'AMZN', name: '아마존', market: 'US' as const, sector: '전자상거래 / 클라우드', currency: 'USD' as const, exchange: 'NASDAQ' },
  { symbol: 'GOOGL', ticker: 'GOOGL', name: '알파벳 A', market: 'US' as const, sector: '검색 / AI', currency: 'USD' as const, exchange: 'NASDAQ' },
  { symbol: 'META', ticker: 'META', name: '메타 플랫폼스', market: 'US' as const, sector: 'SNS / 메타버스', currency: 'USD' as const, exchange: 'NASDAQ' },
];

export interface FetchStockResult {
  stock: Stock | null;
  dataSource: 'kiwoom' | 'yahoo' | 'mock';
}

export interface FetchAllStocksResult {
  stocks: Stock[];
  dataSource: 'kiwoom' | 'yahoo' | 'mock';
}

/**
 * Fetch real stock data for a single symbol with data source tracking
 * Priority 1: Kiwoom Open API (if KIWOOM_APP_KEY and KIWOOM_APP_SECRET configured)
 * Priority 2: Yahoo Finance Live Chart API
 * Priority 3: Master stock cache / mock
 */
export async function fetchRealStockDataWithSource(symbol: string): Promise<FetchStockResult> {
  const cleanSym = symbol.toUpperCase().trim();
  const cacheKey = `stock_real_source_${cleanSym}`;
  const cached = getFromCache<FetchStockResult>(cacheKey);
  if (cached) return cached;

  const existingInFlight = inFlightSingleStock.get(cleanSym);
  if (existingInFlight) return existingInFlight;

  const task = (async (): Promise<FetchStockResult> => {
  const masterItem = kiwoomApiService.getMasterStock(symbol);
  const item = TRACKED_STOCKS.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
  const usMaster = usStockSearchService.getBySymbol(symbol) || usStockSearchService.getBySymbol(symbol.replace('-', '.'));
  const isUS = item?.market === 'US' || !!usMaster || (!masterItem && isUSStockSymbol(symbol));
  if (!masterItem && !item && !isUS && !kiwoomApiService.isConfigured()) {
    return { stock: null, dataSource: 'mock' };
  }

  const stockName = usMaster?.name || masterItem?.name || item?.name || symbol;
  const stockMarket = isUS ? 'US' : (masterItem?.market || item?.market || 'KOSPI');
  const stockSector = usMaster?.sector || item?.sector || masterItem?.sector || (isUS ? '미국 주식' : '기타');
  const currency: 'KRW' | 'USD' = isUS ? 'USD' : 'KRW';
  const exchange = usMaster?.exchange || item?.exchange || (isUS ? 'NASDAQ/NYSE' : undefined);

  // 1. Priority: Try Kiwoom REST API for domestic Korean stocks
  if (!isUS && kiwoomApiService.isConfigured()) {
    try {
      const kiwoomData = await kiwoomApiService.fetchStockPrice(symbol);
      if (kiwoomData && kiwoomData.price) {
        const price = kiwoomData.price;
        const change = kiwoomData.change || 0;
        const prevClose = kiwoomData.prevClose || (price - change);
        let kiwoomCandles = await kiwoomApiService.fetchStockCandles(symbol).catch(() => []);
        if (!kiwoomCandles || kiwoomCandles.length === 0) {
          kiwoomCandles = [
            { time: '09:00', open: kiwoomData.openPrice || price, high: price, low: kiwoomData.openPrice || price, close: price, volume: 10000 }
          ];
        }
        const investorFlow = await kiwoomApiService
          .fetchInvestorFlow(symbol, { amtQtyType: '1', tradeType: '0', unitType: '1' })
          .catch(() => null);
        const hasInvestorFlow = Boolean(investorFlow?.available && investorFlow.foreignNetBuy !== null && investorFlow.instNetBuy !== null);
        const sparkline = kiwoomCandles.slice(-7).map(c => c.close);
        const stock: Stock = {
          symbol,
          name: kiwoomData.name || stockName,
          market: stockMarket,
          sector: stockSector,
          price,
          change,
          changePercent: kiwoomData.changePercent !== undefined ? kiwoomData.changePercent : Number(((change / (prevClose || 1)) * 100).toFixed(2)),
          volume: kiwoomData.volume || 0,
          volumeRatio: 120.0,
          tradingValue: kiwoomData.tradingValue || Math.round((price * (kiwoomData.volume || 1000000)) / 100000000),
          openPrice: kiwoomData.openPrice || price,
          highPrice: kiwoomData.highPrice || price,
          lowPrice: kiwoomData.lowPrice || price,
          prevClose,
          high52w: kiwoomData.high52w || Math.round(price * 1.3),
          low52w: kiwoomData.low52w || Math.round(price * 0.7),
          marketCap: kiwoomData.marketCap || masterItem?.marketCap || Math.round((price * 500000000) / 100000000),
          per: kiwoomData.per || 15.2,
          pbr: kiwoomData.pbr || 1.4,
          eps: kiwoomData.eps || Math.round(price / 15.2),
          dividendYield: 1.5,
          foreignNetBuy: hasInvestorFlow ? investorFlow!.foreignNetBuy : null,
          instNetBuy: hasInvestorFlow ? investorFlow!.instNetBuy : null,
          individualNetBuy: hasInvestorFlow ? investorFlow!.individualNetBuy : null,
          foreignNetBuyAmountMillion: hasInvestorFlow ? investorFlow!.foreignAmountMillion : null,
          instNetBuyAmountMillion: hasInvestorFlow ? investorFlow!.instAmountMillion : null,
          individualNetBuyAmountMillion: hasInvestorFlow ? investorFlow!.individualAmountMillion : null,
          investorUnit: '억원',
          investorDataAvailable: hasInvestorFlow,
          investorDataSource: hasInvestorFlow ? investorFlow!.investorDataSource : '수급 데이터 미수신',
          investorBaseDate: hasInvestorFlow ? (investorFlow!.baseDate ?? undefined) : undefined,
          investorUpdateTime: hasInvestorFlow ? (investorFlow!.updateTime ?? undefined) : undefined,
          candles: kiwoomCandles,
          sparkline: sparkline.length >= 2 ? sparkline : [prevClose, price],
          currency: 'KRW',
          exchange: stockMarket,
          dataSource: 'kiwoom',
          lastUpdated: new Date().toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul' }),
        };
        const validStock = validateAndPreserveStock(symbol, stock);
        if (validStock) {
          const result: FetchStockResult = { stock: validStock, dataSource: 'kiwoom' };
          setInCache(cacheKey, result, 5000);
          return result;
        }
      }
    } catch (kiwoomErr: any) {
      console.log(`[StockAPI] Kiwoom API notice for ${symbol}, using Yahoo fallback: ${kiwoomErr.message}`);
    }
  }

  // 2. Secondary / Fallback & Primary for US stocks: Yahoo Finance Live Data API
  try {
    const yahooTicker = isUS
      ? (item?.ticker || toProviderTicker(symbol))
      : (item?.ticker || `${symbol}.${stockMarket === 'KOSDAQ' ? 'KQ' : 'KS'}`);
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooTicker)}?interval=1d&range=3mo`;
    const res = await serverResilienceService.resilientFetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
    }, {
      maxRetries: 3,
      baseDelayMs: 500,
      timeoutMs: 6000,
      serviceName: `YahooFinance(${symbol})`,
    });

    if (res.ok) {
      serverResilienceService.markMarketDataSuccess();
      const json = await res.json();
      const result = json.chart?.result?.[0];
      if (result) {
        const meta = result.meta;
        const rawPrice = meta.regularMarketPrice ?? meta.chartPreviousClose ?? 0;
        const price = isUS ? Number(rawPrice.toFixed(2)) : Math.round(rawPrice);

        // Parse Historical Candles first so we can derive accurate previous trading day close
        const candles: CandleData[] = [];
        const timestamps = result.timestamp || [];
        const quote = result.indicators?.quote?.[0] || {};
        const opens = quote.open || [];
        const highs = quote.high || [];
        const lows = quote.low || [];
        const closes = quote.close || [];
        const volumes = quote.volume || [];

        for (let i = 0; i < timestamps.length; i++) {
          if (closes[i] !== null && closes[i] !== undefined) {
            const d = new Date(timestamps[i] * 1000);
            const dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
            candles.push({
              time: dateStr,
              open: isUS ? Number((opens[i] || closes[i]).toFixed(2)) : Math.round(opens[i] || closes[i]),
              high: isUS ? Number((highs[i] || closes[i]).toFixed(2)) : Math.round(highs[i] || closes[i]),
              low: isUS ? Number((lows[i] || closes[i]).toFixed(2)) : Math.round(lows[i] || closes[i]),
              close: isUS ? Number(closes[i].toFixed(2)) : Math.round(closes[i]),
              volume: Math.round(volumes[i] || 0),
            });
          }
        }

        // Note: Yahoo v8 /chart meta.chartPreviousClose is the close BEFORE the chart range (e.g., 3 months ago),
        // NOT yesterday's close. Prefer meta.previousClose / regularMarketPreviousClose or second-to-last daily candle.
        let rawPrevClose =
          (typeof meta.previousClose === 'number' && meta.previousClose > 0 ? meta.previousClose : undefined) ??
          (typeof meta.regularMarketPreviousClose === 'number' && meta.regularMarketPreviousClose > 0 ? meta.regularMarketPreviousClose : undefined);
        if (rawPrevClose === undefined) {
          if (candles.length >= 2) {
            const lastCandle = candles[candles.length - 1];
            const isSameAsLatest = price > 0 && Math.abs(lastCandle.close - price) / price < 0.005;
            rawPrevClose = isSameAsLatest ? candles[candles.length - 2].close : lastCandle.close;
          } else {
            rawPrevClose = meta.chartPreviousClose ?? rawPrice;
          }
        }
        const prevClose = isUS ? Number(rawPrevClose.toFixed(2)) : Math.round(rawPrevClose);
        const rawChange = price - prevClose;
        const change = isUS ? Number(rawChange.toFixed(2)) : Math.round(rawChange);
        const changePercent = prevClose !== 0 ? Number(((change / prevClose) * 100).toFixed(2)) : 0;
        const volume = meta.regularMarketVolume || 1000000;
        const openPrice = isUS ? Number((meta.regularMarketDayLow || price).toFixed(2)) : Math.round(meta.regularMarketDayLow || price);
        const highPrice = isUS ? Number((meta.regularMarketDayHigh || price).toFixed(2)) : Math.round(meta.regularMarketDayHigh || price);
        const lowPrice = isUS ? Number((meta.regularMarketDayLow || price).toFixed(2)) : Math.round(meta.regularMarketDayLow || price);
        const tradingValue = isUS ? Math.round((price * volume) / 1000000) : Math.round((price * volume) / 100000000); // US: 백만 달러, KR: 억 원

        const sparkline = candles.slice(-7).map(c => c.close);
        const high52w = meta.fiftyTwoWeekHigh ? (isUS ? Number(meta.fiftyTwoWeekHigh.toFixed(2)) : Math.round(meta.fiftyTwoWeekHigh)) : (isUS ? Number((price * 1.3).toFixed(2)) : Math.round(price * 1.3));
        const low52w = meta.fiftyTwoWeekLow ? (isUS ? Number(meta.fiftyTwoWeekLow.toFixed(2)) : Math.round(meta.fiftyTwoWeekLow)) : (isUS ? Number((price * 0.7).toFixed(2)) : Math.round(price * 0.7));
        const marketCap = isUS ? Math.round((price * (volume * 50)) / 100000000) : (masterItem?.marketCap || Math.round((price * 500000000) / 100000000));

        // Delay status check for US markets
        const delayStatus = isUS ? 'delayed_15m' : undefined;
        const delayLabel = isUS ? '15분 지연 (정규장 23:30~06:00 KST)' : undefined;

        const stock: Stock = {
          symbol: isUS ? symbol.toUpperCase() : symbol,
          name: stockName,
          market: stockMarket,
          sector: stockSector,
          price,
          change,
          changePercent,
          volume,
          volumeRatio: 120.0,
          tradingValue,
          openPrice,
          highPrice,
          lowPrice,
          prevClose,
          high52w,
          low52w,
          marketCap,
          per: isUS ? 28.5 : 15.2,
          pbr: isUS ? 4.2 : 1.4,
          eps: isUS ? Number((price / 28.5).toFixed(2)) : Math.round(price / 15.2),
          dividendYield: isUS ? 0.8 : 1.5,
           foreignNetBuy: null,
       instNetBuy: null,
       investorDataAvailable: false,
       investorDataSource: '수급 데이터 미수신',
          candles,
          sparkline: sparkline.length >= 2 ? sparkline : [prevClose, price],
          currency,
          exchange,
          delayStatus,
          delayLabel,
          dataSource: 'yahoo',
          lastUpdated: new Date().toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul' }),
        };

        const validStock = validateAndPreserveStock(symbol, stock);
        if (validStock) {
          const fetchResult: FetchStockResult = { stock: validStock, dataSource: 'yahoo' };
          setInCache(cacheKey, fetchResult, 10000);
          return fetchResult;
        }
      }
    }
  } catch (err: any) {
    console.log(`[StockAPI] Yahoo data notice for ${symbol}: ${err.message}`);
  }

  // 3. Stale Data & Last Valid Price Fallback (if API fetch fails)
  const expiredCache = serverCache.get(cacheKey);
  if (expiredCache && expiredCache.data?.stock) {
    const staleStock = { ...expiredCache.data.stock, isStale: true, delayLabel: '오래된 시세 (캐시)' };
    const validStale = validateAndPreserveStock(symbol, staleStock);
    if (validStale) {
      return { stock: validStale, dataSource: expiredCache.data.dataSource };
    }
  }

  const lastValid = lastValidStockCache.get(symbol);
  if (lastValid) {
    return { stock: { ...lastValid, isStale: true, delayLabel: '최근 정상 시세 유지' }, dataSource: 'yahoo' };
  }

  // 4. Mock fallback (ONLY if source is NOT REAL)
  if (masterItem && process.env.STOCK_DATA_SOURCE !== 'REAL') {
    const stock: Stock = {
      symbol: masterItem.code,
      name: masterItem.name,
      market: masterItem.market,
      sector: masterItem.sector,
      price: masterItem.lastPrice || 0,
      change: 0,
      changePercent: 0,
      volume: 0,
      volumeRatio: 100,
      tradingValue: 0,
      openPrice: masterItem.lastPrice || 0,
      highPrice: masterItem.lastPrice || 0,
      lowPrice: masterItem.lastPrice || 0,
      prevClose: masterItem.lastPrice || 0,
      high52w: Math.round((masterItem.lastPrice || 0) * 1.3),
      low52w: Math.round((masterItem.lastPrice || 0) * 0.7),
      marketCap: masterItem.marketCap || 0,
      per: 15.2,
      pbr: 1.4,
      eps: Math.round((masterItem.lastPrice || 0) / 15.2),
      dividendYield: 1.5,
       foreignNetBuy: null,
       instNetBuy: null,
       investorDataAvailable: false,
       investorDataSource: '수급 데이터 미수신',
      candles: [],
      sparkline: [masterItem.lastPrice || 0, masterItem.lastPrice || 0],
      currency: 'KRW',
      exchange: masterItem.market,
      dataSource: 'mock',
      lastUpdated: new Date().toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul' }),
    };
    return { stock, dataSource: 'mock' };
  }

  return { stock: null, dataSource: 'mock' };
  })().finally(() => {
    inFlightSingleStock.delete(cleanSym);
  });

  inFlightSingleStock.set(cleanSym, task);
  return task;
}

/**
 * Fetch real stock data for a single symbol
 */
export async function fetchRealStockData(symbol: string): Promise<Stock | null> {
  const res = await fetchRealStockDataWithSource(symbol);
  return res.stock;
}

/**
 * Fetch all tracked stocks with real data and data source tracking
 */
export async function fetchAllRealStocksWithSource(): Promise<FetchAllStocksResult> {
  const cacheKey = 'all_real_stocks_with_source';
  const cached = getFromCache<FetchAllStocksResult>(cacheKey);
  if (cached && cached.stocks && cached.stocks.length > 0) return cached;

  if (inFlightAllStocks) return inFlightAllStocks;

  inFlightAllStocks = (async () => {
    try {
      const majorSymbols = [
        '005930', '000660', '005380', '000270', '196170', '042700', '064350', '034020', '373220', '247540',
        '086520', '207940', '035420', '035720', '005490', '012330', '105560', '055550', '417860',
        'AAPL', 'NVDA', 'MSFT', 'TSLA', 'AMZN', 'GOOGL', 'META',
      ];
      const majorStockMap = new Map<string, Stock>();
      let primarySource: 'kiwoom' | 'yahoo' | 'mock' = 'mock';

      await Promise.allSettled(
        majorSymbols.map(async sym => {
          try {
            const res = await fetchRealStockDataWithSource(sym);
            if (res.stock) {
              majorStockMap.set(sym, res.stock);
              if (res.dataSource === 'kiwoom') primarySource = 'kiwoom';
              else if (res.dataSource === 'yahoo' && primarySource !== 'kiwoom') primarySource = 'yahoo';
            }
          } catch {}
        })
      );

      const baseList = TRACKED_STOCKS.map(t => ({
        code: t.symbol,
        name: t.name,
        market: t.market,
        sector: t.sector,
        currency: (t as any).currency || (t.market === 'US' ? 'USD' : 'KRW'),
        exchange: (t as any).exchange || t.market,
        lastPrice: 0,
        listCount: 0,
        marketCap: 0,
      }));

      const results: Stock[] = baseList.map(item => {
        const live = majorStockMap.get(item.code);
        if (live) return live;
        const isUS = item.currency === 'USD' || item.market === 'US';
        const price = item.lastPrice || 0;
        return {
          symbol: item.code,
          name: item.name,
          market: item.market,
          sector: item.sector,
          currency: isUS ? 'USD' : 'KRW',
          exchange: item.exchange,
          price,
          change: 0,
          changePercent: 0,
          volume: 0,
          volumeRatio: 100,
          tradingValue: 0,
          openPrice: price,
          highPrice: price,
          lowPrice: price,
          prevClose: price,
          high52w: isUS ? Number((price * 1.3).toFixed(2)) : Math.round(price * 1.3),
          low52w: isUS ? Number((price * 0.7).toFixed(2)) : Math.round(price * 0.7),
          marketCap: item.marketCap || 0,
          per: isUS ? 28.5 : 15.2,
          pbr: isUS ? 4.2 : 1.4,
          eps: isUS ? Number((price / 28.5).toFixed(2)) : Math.round(price / 15.2),
          dividendYield: isUS ? 0.8 : 1.5,
           foreignNetBuy: null,
       instNetBuy: null,
       investorDataAvailable: false,
       investorDataSource: '수급 데이터 미수신',
          candles: [],
          sparkline: [price, price],
          isStale: true,
        };
      });

      const payload: FetchAllStocksResult = { stocks: results, dataSource: primarySource };
      if (results.length > 0) {
        setInCache(cacheKey, payload, 15000);
      }
      return payload;
    } finally {
      inFlightAllStocks = null;
    }
  })();

  return inFlightAllStocks;
}

/**
 * Fetch all tracked stocks with real data
 */
export async function fetchAllRealStocks(): Promise<Stock[]> {
  const res = await fetchAllRealStocksWithSource();
  return res.stocks;
}

export interface FetchIndicesResult {
  indices: StockIndex[];
  dataSource: 'kiwoom' | 'yahoo' | 'mock';
}

/**
 * Fetch real market indices (KOSPI, KOSDAQ) with data source tracking
 * Priority 1: Kiwoom Open API (TR: ka20001)
 * Priority 2: Yahoo Finance Live Chart API
 */
export async function fetchRealIndicesWithSource(): Promise<FetchIndicesResult> {
  const cacheKey = 'real_indices_cache';
  const cached = getFromCache<FetchIndicesResult>(cacheKey);
  if (cached) return cached;

  if (inFlightIndices) return inFlightIndices;

  inFlightIndices = (async () => {
    try {
      const nowFormatted = new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

      // 1. Priority: Try Kiwoom REST API if configured
      if (kiwoomApiService.isConfigured()) {
        try {
          const kospi = await kiwoomApiService.fetchIndexPrice('KOSPI');
          const kosdaq = await kiwoomApiService.fetchIndexPrice('KOSDAQ');
          if (kospi && kosdaq && kospi.value > 0 && kosdaq.value > 0) {
            kospi.lastUpdated = nowFormatted;
            kospi.dataSource = 'kiwoom';
            kosdaq.lastUpdated = nowFormatted;
            kosdaq.dataSource = 'kiwoom';
            const payload: FetchIndicesResult = { indices: [kospi, kosdaq], dataSource: 'kiwoom' };
            setInCache(cacheKey, payload, 15000);
            return payload;
          }
        } catch (err: any) {
          console.log('[StockAPI] Kiwoom index fetch notice, using fallback:', err.message);
        }
      }

      const indexDefs: { name: string; symbol: 'KOSPI' | 'KOSDAQ'; ticker: string; defaultVal: number }[] = [
        { name: '코스피', symbol: 'KOSPI', ticker: '^KS11', defaultVal: 2710.5 },
        { name: '코스닥', symbol: 'KOSDAQ', ticker: '^KQ11', defaultVal: 875.2 },
      ];

      const list: StockIndex[] = await Promise.all(
        indexDefs.map(async (def): Promise<StockIndex> => {
          try {
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(def.ticker)}?interval=1d&range=5d`;
            const res = await serverResilienceService.resilientFetch(url, {
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
            }, {
              maxRetries: 2,
              baseDelayMs: 500,
              timeoutMs: 6000,
              serviceName: `IndexYahoo(${def.symbol})`,
            });
            if (res.ok) {
              const json = await res.json();
              const chartRes = json.chart?.result?.[0];
              const meta = chartRes?.meta;
              if (meta) {
                const val = Number((meta.regularMarketPrice || def.defaultVal).toFixed(2));
                const rawCloses: any[] = chartRes?.indicators?.quote?.[0]?.close || [];
                const validCloses = rawCloses.filter((c: any): c is number => typeof c === 'number' && Number.isFinite(c) && c > 0);
                let rawPrev =
                  (typeof meta.previousClose === 'number' && meta.previousClose > 0 ? meta.previousClose : undefined) ??
                  (typeof meta.regularMarketPreviousClose === 'number' && meta.regularMarketPreviousClose > 0 ? meta.regularMarketPreviousClose : undefined);
                if (rawPrev === undefined) {
                  if (validCloses.length >= 2) {
                    const lastClose = validCloses[validCloses.length - 1];
                    const isSameAsLatest = val > 0 && Math.abs(lastClose - val) / val < 0.005;
                    rawPrev = isSameAsLatest ? validCloses[validCloses.length - 2] : lastClose;
                  } else {
                    rawPrev = meta.chartPreviousClose || val;
                  }
                }
                const prev = Number(rawPrev.toFixed(2));
                const change = Number((val - prev).toFixed(2));
                const changePercent = prev > 0 ? Number(((change / prev) * 100).toFixed(2)) : 0;

                return {
                  name: def.name,
                  symbol: def.symbol,
                  value: val,
                  change,
                  changePercent,
                  high: Number((meta.regularMarketDayHigh || val).toFixed(2)),
                  low: Number((meta.regularMarketDayLow || val).toFixed(2)),
                  volume: 524000,
                  tradingValue: 11.5,
                  advanceCount: 450,
                  declineCount: 380,
                  sparkline: [prev, val],
                  lastUpdated: nowFormatted,
                  dataSource: 'yahoo',
                  isStale: false,
                };
              }
            }
          } catch (err: any) {
            console.log(`[StockAPI] Yahoo index fetch notice for ${def.symbol}:`, err.message);
          }

          // Fallback if individual index fails
          return {
            name: def.name,
            symbol: def.symbol,
            value: def.defaultVal,
            change: 12.5,
            changePercent: 0.46,
            high: def.defaultVal + 5,
            low: def.defaultVal - 5,
            volume: 520000,
            tradingValue: 11.0,
            advanceCount: 420,
            declineCount: 400,
            sparkline: [def.defaultVal - 10, def.defaultVal],
            lastUpdated: nowFormatted,
            dataSource: 'mock',
            isStale: true,
          };
        })
      );

      const payload: FetchIndicesResult = { indices: list, dataSource: 'yahoo' };
      setInCache(cacheKey, payload, 15000);
      return payload;
    } finally {
      inFlightIndices = null;
    }
  })();

  return inFlightIndices;
}

/**
 * Fetch real market indices (KOSPI, KOSDAQ)
 */
export async function fetchRealIndices(): Promise<StockIndex[]> {
  const res = await fetchRealIndicesWithSource();
  return res.indices;
}

/**
 * Fetch real USD/KRW exchange rate
 */
export async function fetchRealExchangeRate(): Promise<ExchangeRate> {
  const cacheKey = 'real_exchange_rate_cache';
  const cached = getFromCache<ExchangeRate>(cacheKey);
  if (cached) return cached;

  if (inFlightExchange) return inFlightExchange;

  inFlightExchange = (async () => {
    const nowStr = new Date().toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }) + ' KST';

    try {
      const url = 'https://query1.finance.yahoo.com/v8/finance/chart/KRW=X?interval=1d&range=5d';
      const res = await serverResilienceService.resilientFetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      }, {
        maxRetries: 2,
        baseDelayMs: 500,
        timeoutMs: 6000,
        serviceName: 'ExchangeRateYahoo',
      });
      if (res.ok) {
        const json = await res.json();
        const chartRes = json.chart?.result?.[0];
        const meta = chartRes?.meta;
        if (meta && typeof meta.regularMarketPrice === 'number' && meta.regularMarketPrice > 0) {
          const rate = Number(meta.regularMarketPrice.toFixed(2));
          const rawCloses: any[] = chartRes?.indicators?.quote?.[0]?.close || [];
          const validCloses = rawCloses.filter((c: any): c is number => typeof c === 'number' && Number.isFinite(c) && c > 0);
          let rawPrev =
            (typeof meta.previousClose === 'number' && meta.previousClose > 0 ? meta.previousClose : undefined) ??
            (typeof meta.regularMarketPreviousClose === 'number' && meta.regularMarketPreviousClose > 0 ? meta.regularMarketPreviousClose : undefined);
          if (rawPrev === undefined) {
            if (validCloses.length >= 2) {
              const lastClose = validCloses[validCloses.length - 1];
              const isSameAsLatest = Math.abs(lastClose - rate) / rate < 0.005;
              rawPrev = isSameAsLatest ? validCloses[validCloses.length - 2] : lastClose;
            } else {
              rawPrev = meta.chartPreviousClose || rate;
            }
          }
          const prev = Number(rawPrev.toFixed(2));
          const change = Number((rate - prev).toFixed(2));
          const changePercent = prev !== 0 ? Number(((change / prev) * 100).toFixed(2)) : 0;

          const data: ExchangeRate = {
            currency: 'USD/KRW',
            baseCurrency: 'USD',
            quoteCurrency: 'KRW',
            pair: 'USD/KRW',
            name: '원/달러 환율',
            rate,
            change,
            changePercent,
            high: Number((meta.regularMarketDayHigh || rate).toFixed(2)),
            low: Number((meta.regularMarketDayLow || rate).toFixed(2)),
            sparkline: [prev, rate],
            lastUpdated: nowStr,
            timestamp: Date.now(),
            status: 'ok',
            isStale: false,
            provider: 'Yahoo Finance FX (KRW=X)',
          };
          setInCache(cacheKey, data, 20000);
          return data;
        }
      }
    } catch (err: any) {
      console.log('[StockAPI] Yahoo exchange rate fetch notice:', err.message);
    }

    // Secondary official reference fallback: ECB Frankfurter (explicitly marked delayed/official reference)
    try {
      const ecbRes = await fetch('https://api.frankfurter.app/latest?from=USD&to=KRW');
      if (ecbRes.ok) {
        const ecbJson: any = await ecbRes.json();
        const ecbRate = ecbJson?.rates?.KRW;
        if (typeof ecbRate === 'number' && ecbRate > 0) {
          const rate = Number(ecbRate.toFixed(2));
          const ecbData: ExchangeRate = {
            currency: 'USD/KRW',
            baseCurrency: 'USD',
            quoteCurrency: 'KRW',
            pair: 'USD/KRW',
            name: '원/달러 환율 (ECB 고시)',
            rate,
            change: 0,
            changePercent: 0,
            high: rate,
            low: rate,
            sparkline: [rate, rate],
            lastUpdated: `${ecbJson.date || ''} (ECB 고시)`,
            timestamp: Date.now(),
            status: 'delayed',
            isStale: false,
            provider: 'European Central Bank (Frankfurter)',
          };
          setInCache(cacheKey, ecbData, 60000);
          return ecbData;
        }
      }
    } catch {}

    // If expired cache exists, return it explicitly marked stale (do not pretend it is fresh)
    const expiredCache = serverCache.get(cacheKey);
    if (expiredCache?.data && typeof expiredCache.data.rate === 'number' && expiredCache.data.rate > 0) {
      return {
        ...expiredCache.data,
        status: 'stale',
        isStale: true,
        errorMessage: '실시간 환율 갱신 실패로 만료된 최근 환율을 표시합니다. 원화 환산이 중단됩니다.',
      };
    }

    // Honest unavailable/error payload (no silent arbitrary rate like 1382.50)
    return {
      currency: 'USD/KRW',
      baseCurrency: 'USD',
      quoteCurrency: 'KRW',
      pair: 'USD/KRW',
      name: '원/달러 환율',
      rate: 0,
      change: 0,
      changePercent: 0,
      high: 0,
      low: 0,
      sparkline: [],
      lastUpdated: nowStr,
      timestamp: Date.now(),
      status: 'error',
      isStale: true,
      provider: 'Yahoo Finance FX / ECB',
      errorMessage: '실시간 USD/KRW 환율 데이터를 수신할 수 없습니다.',
    };
  })().finally(() => {
    inFlightExchange = null;
  });

  return inFlightExchange;
}

export interface FetchStockChartOptions {
  period?: string;
  candleType?: ChartCandleType;
  date?: string; // YYYY-MM-DD
  startDate?: string;
  endDate?: string;
}

function formatExchangeTimestamp(epochMs: number, isUS: boolean, includeTime: boolean): string {
  const tz = isUS ? 'America/New_York' : 'Asia/Seoul';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit', hour12: false } : {}),
  }).formatToParts(new Date(epochMs));

  const map: Record<string, string> = {};
  for (const p of parts) {
    map[p.type] = p.value;
  }
  const datePart = `${map.year}-${map.month}-${map.day}`;
  if (!includeTime) return datePart;
  const hh = map.hour === '24' ? '00' : map.hour || '00';
  const mm = map.minute || '00';
  return `${datePart} ${hh}:${mm}`;
}

export async function fetchUnifiedStockChart(
  symbol: string,
  options: FetchStockChartOptions = {}
): Promise<KiwoomChartResponse> {
  const cleanSymbol = symbol.toUpperCase().trim();
  const rawPeriod = (options.period || '1d').toLowerCase().trim();
  const requestedCandleType = options.candleType;
  const targetDate = options.date?.trim() || null;
  const usMaster = usStockSearchService.getBySymbol(cleanSymbol) || usStockSearchService.getBySymbol(cleanSymbol.replace('-', '.'));
  const isUS = !!usMaster || isUSStockSymbol(cleanSymbol);

  // Cache key per symbol, period, candleType, and target date - strictly isolated
  const cacheKey = `chart_unified_${cleanSymbol}_${rawPeriod}_${requestedCandleType || 'auto'}_${targetDate || 'latest'}`;
  const cached = getFromCache<KiwoomChartResponse>(cacheKey);
  if (cached) return cached;

  // Determine Yahoo ticker
  let yahooTicker = isUS ? toProviderTicker(cleanSymbol) : cleanSymbol;
  if (!isUS) {
    const master = kiwoomApiService.getMasterStock(cleanSymbol);
    const tracked = TRACKED_STOCKS.find(s => s.symbol === cleanSymbol);
    const isKosdaq =
      master?.market === 'KOSDAQ' ||
      tracked?.market === 'KOSDAQ' ||
      (!master && !tracked && (
        cleanSymbol.startsWith('2') ||
        cleanSymbol.startsWith('08') ||
        cleanSymbol.startsWith('19') ||
        cleanSymbol.startsWith('02') ||
        cleanSymbol.startsWith('27') ||
        cleanSymbol.startsWith('039') ||
        cleanSymbol.startsWith('058')
      ));
    yahooTicker = `${cleanSymbol}.${isKosdaq ? 'KQ' : 'KS'}`;
  }

  // Interval & Range Mapping
  let interval = '1d';
  let rangeParam = '1mo';
  let periodLabel = '1개월';
  let resolvedCandleType: ChartCandleType = 'day';
  let cutoffEpochSec: number | null = null;

  const isExplicitMinutePeriod = ['1m', '5min', '5m', '15min', '15m', '30min', '30m', '60min', '1h'].includes(rawPeriod);

  switch (rawPeriod) {
    case '1d':
    case 'day':
      interval = '5m';
      rangeParam = '1d';
      periodLabel = '1일';
      resolvedCandleType = 'minute';
      break;
    case '1w':
    case '1week':
      interval = '15m';
      rangeParam = '5d';
      periodLabel = '1주';
      resolvedCandleType = 'minute';
      break;
    case '1m':
      interval = '1m';
      rangeParam = '1d';
      periodLabel = '1분';
      resolvedCandleType = 'minute';
      break;
    case '1mo':
    case '1month':
      interval = '1d';
      rangeParam = '1mo';
      periodLabel = '1개월';
      resolvedCandleType = 'day';
      break;
    case '3m':
    case '3mo':
    case '3months':
      interval = '1d';
      rangeParam = '3mo';
      periodLabel = '3개월';
      resolvedCandleType = 'day';
      break;
    case '6m':
    case '6mo':
    case '6months':
      interval = '1d';
      rangeParam = '6mo';
      periodLabel = '6개월';
      resolvedCandleType = 'day';
      break;
    case 'ytd':
      interval = '1d';
      rangeParam = 'ytd';
      periodLabel = '연간(YTD)';
      resolvedCandleType = 'day';
      break;
    case '1y':
    case '1year':
      interval = '1d';
      rangeParam = '1y';
      periodLabel = '1년';
      resolvedCandleType = 'day';
      break;
    case '3y':
    case '3years':
      interval = '1wk';
      rangeParam = '5y';
      periodLabel = '3년';
      resolvedCandleType = 'week';
      cutoffEpochSec = Math.floor(Date.now() / 1000) - 3 * 365 * 24 * 3600;
      break;
    case '5y':
    case '5years':
      interval = '1wk';
      rangeParam = '5y';
      periodLabel = '5년';
      resolvedCandleType = 'week';
      break;
    case 'week':
      interval = '1wk';
      rangeParam = '2y';
      periodLabel = '주봉';
      resolvedCandleType = 'week';
      break;
    case 'month':
      interval = '1mo';
      rangeParam = '5y';
      periodLabel = '월봉';
      resolvedCandleType = 'month';
      break;
    case 'all':
    case 'max':
      interval = '1mo';
      rangeParam = 'max';
      periodLabel = '전체';
      resolvedCandleType = 'month';
      break;
    case '5min':
    case '5m':
      interval = '5m';
      rangeParam = '1d';
      periodLabel = '5분';
      resolvedCandleType = 'minute';
      break;
    case '15min':
    case '15m':
      interval = '15m';
      rangeParam = '5d';
      periodLabel = '15분';
      resolvedCandleType = 'minute';
      break;
    case '30min':
    case '30m':
      interval = '30m';
      rangeParam = '5d';
      periodLabel = '30분';
      resolvedCandleType = 'minute';
      break;
    case '60min':
    case '1h':
      interval = '60m';
      rangeParam = '1mo';
      periodLabel = '60분';
      resolvedCandleType = 'minute';
      break;
    default:
      interval = '1d';
      rangeParam = '1mo';
      periodLabel = '1개월';
      resolvedCandleType = 'day';
  }

  // Apply explicit candleType override (when user selects 일봉 / 주봉 / 월봉 / 분봉 alongside a range)
  if (!isExplicitMinutePeriod && requestedCandleType) {
    resolvedCandleType = requestedCandleType;
    if (requestedCandleType === 'minute') {
      if (rawPeriod === '1d') {
        interval = '5m';
        rangeParam = '1d';
      } else if (rawPeriod === '1w' || rawPeriod === '1week') {
        interval = '15m';
        rangeParam = '5d';
      } else {
        interval = '60m';
        rangeParam = rawPeriod === '1mo' || rawPeriod === '1month' ? '1mo' : '3mo';
      }
      cutoffEpochSec = null;
    } else if (requestedCandleType === 'day') {
      interval = '1d';
      if (rawPeriod === '1d' || rawPeriod === '1w' || rawPeriod === '1week') rangeParam = '1mo';
      else if (rawPeriod === '3y' || rawPeriod === '3years') {
        rangeParam = '5y';
        cutoffEpochSec = Math.floor(Date.now() / 1000) - 3 * 365 * 24 * 3600;
      } else if (rawPeriod === 'all' || rawPeriod === 'max') {
        rangeParam = '5y';
      }
    } else if (requestedCandleType === 'week') {
      interval = '1wk';
      if (['1d', '1w', '1week', '1mo', '1month', '3m', '3mo', '3months', '6m', '6mo', '6months'].includes(rawPeriod)) {
        rangeParam = '1y';
        cutoffEpochSec = null;
      }
    } else if (requestedCandleType === 'month') {
      interval = '1mo';
      if (['1d', '1w', '1week', '1mo', '1month', '3m', '3mo', '3months', '6m', '6mo', '6months', '1y', '1year'].includes(rawPeriod)) {
        rangeParam = '2y';
        cutoffEpochSec = null;
      }
    }
  }

  // Handle custom date navigation (과거 날짜 이동)
  let url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooTicker)}?interval=${interval}&range=${rangeParam}`;

  let isHistoricalView = false;
  let targetDateClose: number | undefined;

  if (targetDate) {
    const targetDt = new Date(targetDate);
    if (!isNaN(targetDt.getTime())) {
      isHistoricalView = true;
      cutoffEpochSec = null;
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - targetDt.getTime()) / (1000 * 3600 * 24));

      // Yahoo Finance only retains minute intervals (<1d) for the last 55 days
      if (diffDays > 50 && (interval.includes('m') || interval === '1h') && interval !== '1mo') {
        interval = '1d';
        resolvedCandleType = 'day';
      }

      // Query around target date: span depends on period
      let spanDays = 30;
      if (rawPeriod === '1d' || isExplicitMinutePeriod) spanDays = 5;
      else if (rawPeriod === '1w') spanDays = 14;
      else if (rawPeriod === '3m' || rawPeriod === '3mo' || rawPeriod === '6m' || rawPeriod === '6mo') spanDays = 180;
      else if (rawPeriod === '1y') spanDays = 365;
      else if (rawPeriod === '3y') spanDays = 1095;
      else if (rawPeriod === '5y' || rawPeriod === 'all') spanDays = 1825;

      const p1 = Math.floor((targetDt.getTime() - spanDays * 24 * 3600 * 1000) / 1000);
      const p2 = Math.floor((targetDt.getTime() + 2 * 24 * 3600 * 1000) / 1000);

      url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooTicker)}?period1=${p1}&period2=${p2}&interval=${interval}`;
    }
  }

  try {
    const res = await serverResilienceService.resilientFetch(
      url,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
          Accept: 'application/json',
        },
      },
      {
        maxRetries: 2,
        baseDelayMs: 250,
        timeoutMs: 4500,
        serviceName: `Chart(${cleanSymbol})`,
      }
    );

    if (res.ok) {
      const json = await res.json();
      const result = json.chart?.result?.[0];
      if (result) {
        const meta = result.meta || {};
        const timestamps: number[] = result.timestamp || [];
        const quotes = result.indicators?.quote?.[0] || {};
        const opens = quotes.open || [];
        const highs = quotes.high || [];
        const lows = quotes.low || [];
        const closes = quotes.close || [];
        const volumes = quotes.volume || [];
        const includeTime = interval.endsWith('m') || interval === '1h' || interval === '60m';

        const rawCandles: CandleData[] = [];
        for (let i = 0; i < timestamps.length; i++) {
          const tsSec = timestamps[i];
          if (cutoffEpochSec && tsSec < cutoffEpochSec) continue;

          const c = closes[i];
          if (c !== null && typeof c === 'number' && Number.isFinite(c) && c > 0) {
            const o = opens[i] !== null && typeof opens[i] === 'number' && Number.isFinite(opens[i]) && opens[i] > 0 ? opens[i] : c;
            const h = highs[i] !== null && typeof highs[i] === 'number' && Number.isFinite(highs[i]) && highs[i] > 0 ? highs[i] : Math.max(o, c);
            const l = lows[i] !== null && typeof lows[i] === 'number' && Number.isFinite(lows[i]) && lows[i] > 0 ? lows[i] : Math.min(o, c);
            const v = volumes[i] !== null && typeof volumes[i] === 'number' && Number.isFinite(volumes[i]) && volumes[i] >= 0 ? volumes[i] : 0;

            const roundCandle = (val: number) => (isUS ? Number(val.toFixed(2)) : Math.round(val));
            const roundedO = roundCandle(o);
            const roundedC = roundCandle(c);
            const roundedH = Math.max(roundCandle(h), roundedO, roundedC);
            const roundedL = Math.min(roundCandle(l), roundedO, roundedC);

            rawCandles.push({
              time: formatExchangeTimestamp(tsSec * 1000, isUS, includeTime),
              open: roundedO,
              high: roundedH,
              low: roundedL,
              close: roundedC,
              volume: Math.round(v),
            });
          }
        }

        const candles = sanitizeAndValidateCandles(rawCandles);

        // If targetDate specified, locate closest candle
        if (targetDate && candles.length > 0) {
          const matched = candles.filter(c => c.time.startsWith(targetDate));
          if (matched.length > 0) {
            targetDateClose = matched[matched.length - 1].close;
          } else {
            const preceding = candles.filter(c => c.time <= targetDate);
            if (preceding.length > 0) {
              targetDateClose = preceding[preceding.length - 1].close;
            }
          }
        }

        // Determine current market status
        const isKr = !isUS;
        const now = new Date();
        const kstHours = (now.getUTCHours() + 9) % 24;
        const kstMins = now.getUTCMinutes();
        const kstTime = kstHours * 100 + kstMins;
        const kstDay = (now.getUTCDay() + (now.getUTCHours() + 9 >= 24 ? 1 : 0)) % 7;
        const isKrOpen = kstDay >= 1 && kstDay <= 5 && kstTime >= 900 && kstTime <= 1530;

        const rawCur = meta.regularMarketPrice || (candles.length > 0 ? candles[candles.length - 1].close : 0);
        const currentPrice = isUS ? Number(rawCur.toFixed(2)) : Math.round(rawCur);

        const chartResponse: KiwoomChartResponse = {
          symbol: cleanSymbol,
          period: rawPeriod,
          periodLabel,
          candleType: resolvedCandleType,
          interval,
          trId: isUS ? 'GLOBAL_US' : 'YAHOO_KR',
          supported: true,
          candles,
          currentPrice,
          lastCandleClose: candles.length > 0 ? candles[candles.length - 1].close : currentPrice,
          selectedDateClose: targetDateClose,
          selectedDate: targetDate || undefined,
          isHistoricalView,
          isStale: false,
          source: 'yahoo',
          cached: false,
          timestamp: Date.now(),
          currency: isUS ? 'USD' : 'KRW',
          marketStatus: (isKr ? isKrOpen : true) ? 'OPEN' : 'CLOSED',
          error: null,
        };

        const ttl = isHistoricalView ? 3600000 : rawPeriod === '1d' ? 15000 : 120000;
        setInCache(cacheKey, { ...chartResponse, cached: true }, ttl);
        return chartResponse;
      }
    }
  } catch (err: any) {
    console.warn(`[StockAPI] Chart fetch error for ${cleanSymbol}:`, err.message);
  }

  // Graceful empty response with honest error (no fake candles)
  return {
    symbol: cleanSymbol,
    period: rawPeriod,
    periodLabel,
    candleType: resolvedCandleType,
    interval,
    trId: 'ERROR',
    supported: false,
    candles: [],
    source: 'yahoo',
    cached: false,
    timestamp: Date.now(),
    currency: isUS ? 'USD' : 'KRW',
    isStale: true,
    error: `${cleanSymbol}의 해당 기간(${periodLabel}) 실제 캔들 데이터를 불러올 수 없습니다.`,
  };
}

export interface StockInvestorFlowResponse {
  symbol: string;
  trId: 'ka10059';
  available: boolean;
  investorDataAvailable: boolean;
  investorDataSource: string;
  investorUnit: '억원';
  investorQtyUnit: '주';
  baseDate: string | null;
  updateTime: string | null;
  tradeType: '0' | '1' | '2';
  foreignNetBuy: number | null;
  instNetBuy: number | null;
  individualNetBuy: number | null;
  foreignNetBuyAmountMillion: number | null;
  instNetBuyAmountMillion: number | null;
  individualNetBuyAmountMillion: number | null;
  foreignNetBuyQty: number | null;
  instNetBuyQty: number | null;
  individualNetBuyQty: number | null;
  isDirectInvestorIndividual: boolean;
  rows: KiwoomInvestorFlowResult['rows'];
  reason?: string;
}

export async function fetchStockInvestorFlow(
  symbol: string,
  options: { unit?: 'amount' | 'quantity' | 'both'; date?: string; tradeType?: '0' | '1' | '2' } = {}
): Promise<StockInvestorFlowResponse> {
  const cleanSym = symbol.toUpperCase().trim();
  const tradeType: '0' | '1' | '2' = options.tradeType === '1' || options.tradeType === '2' ? options.tradeType : '0';
  const unitMode = options.unit === 'amount' || options.unit === 'quantity' ? options.unit : 'both';

  const makeUnavailable = (sourceLabel: string, reason: string): StockInvestorFlowResponse => ({
    symbol: cleanSym,
    trId: 'ka10059',
    available: false,
    investorDataAvailable: false,
    investorDataSource: sourceLabel,
    investorUnit: '억원',
    investorQtyUnit: '주',
    baseDate: null,
    updateTime: null,
    tradeType,
    foreignNetBuy: null,
    instNetBuy: null,
    individualNetBuy: null,
    foreignNetBuyAmountMillion: null,
    instNetBuyAmountMillion: null,
    individualNetBuyAmountMillion: null,
    foreignNetBuyQty: null,
    instNetBuyQty: null,
    individualNetBuyQty: null,
    isDirectInvestorIndividual: false,
    rows: [],
    reason,
  });

  if (cryptoMasterService.isCryptoSymbol(cleanSym)) {
    return makeUnavailable('가상자산 미지원', '가상자산 마켓은 국내 투자자별 매매동향(ka10059) 지원 대상이 아닙니다.');
  }

  const masterItem = kiwoomApiService.getMasterStock(cleanSym);
  const trackedItem = TRACKED_STOCKS.find(s => s.symbol.toUpperCase() === cleanSym);
  const usMaster = usStockSearchService.getBySymbol(cleanSym) || usStockSearchService.getBySymbol(cleanSym.replace('-', '.'));
  const isUS = trackedItem?.market === 'US' || !!usMaster || (!masterItem && isUSStockSymbol(cleanSym));

  if (isUS) {
    return makeUnavailable('미국 시장 미지원', '미국 주식 시장은 국내 기관·외국인 수급(ka10059) 집계 대상이 아닙니다.');
  }

  if (!kiwoomApiService.isConfigured()) {
    return makeUnavailable('수급 데이터 미수신', '키움 Open API 인증 정보가 설정되지 않아 공식 수급 데이터를 조회할 수 없습니다.');
  }

  const cacheKey = `stock_investor_flow_${cleanSym}_${unitMode}_${tradeType}_${options.date || 'latest'}`;
  const cached = getFromCache<StockInvestorFlowResponse>(cacheKey);
  if (cached) return cached;

  try {
    const [amountRes, qtyRes] = await Promise.all([
      unitMode !== 'quantity'
        ? kiwoomApiService.fetchInvestorFlow(cleanSym, { date: options.date, amtQtyType: '1', tradeType, unitType: '1' })
        : Promise.resolve(null),
      unitMode !== 'amount'
        ? kiwoomApiService.fetchInvestorFlow(cleanSym, { date: options.date, amtQtyType: '2', tradeType, unitType: '1' })
        : Promise.resolve(null),
    ]);

    const amtAvailable = Boolean(amountRes?.available);
    const qtyAvailable = Boolean(qtyRes?.available);

    if (!amtAvailable && !qtyAvailable) {
      const reason = amountRes?.reason || qtyRes?.reason || '키움 ka10059 수급 데이터가 수신되지 않았습니다.';
      const unavail = makeUnavailable('수급 데이터 미수신', reason);
      setInCache(cacheKey, unavail, 15000);
      return unavail;
    }

    const primary = amtAvailable ? amountRes! : qtyRes!;
    const hasDirectIndividual =
      (amtAvailable && amountRes!.individualNetBuy !== null) ||
      (qtyAvailable && qtyRes!.individualQty !== null);

    const payload: StockInvestorFlowResponse = {
      symbol: cleanSym,
      trId: 'ka10059',
      available: true,
      investorDataAvailable: true,
      investorDataSource: primary.investorDataSource,
      investorUnit: '억원',
      investorQtyUnit: '주',
      baseDate: primary.baseDate,
      updateTime: primary.updateTime,
      tradeType,
      foreignNetBuy: amtAvailable ? amountRes!.foreignNetBuy : null,
      instNetBuy: amtAvailable ? amountRes!.instNetBuy : null,
      individualNetBuy: amtAvailable ? amountRes!.individualNetBuy : null,
      foreignNetBuyAmountMillion: amtAvailable ? amountRes!.foreignAmountMillion : null,
      instNetBuyAmountMillion: amtAvailable ? amountRes!.instAmountMillion : null,
      individualNetBuyAmountMillion: amtAvailable ? amountRes!.individualAmountMillion : null,
      foreignNetBuyQty: qtyAvailable ? qtyRes!.foreignQty : null,
      instNetBuyQty: qtyAvailable ? qtyRes!.instQty : null,
      individualNetBuyQty: qtyAvailable ? qtyRes!.individualQty : null,
      isDirectInvestorIndividual: hasDirectIndividual,
      rows: primary.rows,
    };

    setInCache(cacheKey, payload, 60000);
    return payload;
  } catch (err: any) {
    const errMsg = err?.message || '키움 ka10059 수급 조회 오류';
    const unavail = makeUnavailable('수급 데이터 미수신', errMsg);
    setInCache(cacheKey, unavail, 15000);
    return unavail;
  }
}
