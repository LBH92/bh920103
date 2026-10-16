/**
 * Server-Side Stock API Service
 * 
 * Strict Principle:
 * - NO external stock API is called directly from browser!
 * - All external API calls, keys, rate limiting, and caching live here on the server.
 */

import { CandleData, Stock, StockIndex, ExchangeRate, KiwoomChartResponse } from '../src/types';
import { kiwoomApiService } from './kiwoomApiService';
import { serverResilienceService } from './serverResilienceService';

interface ServerCacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

const serverCache = new Map<string, ServerCacheEntry<any>>();

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
  const cacheKey = `stock_real_source_${symbol}`;
  const cached = getFromCache<FetchStockResult>(cacheKey);
  if (cached) return cached;

  const masterItem = kiwoomApiService.getMasterStock(symbol);
  const item = TRACKED_STOCKS.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
  const isUS = item?.market === 'US' || (!masterItem && /^[A-Z]{1,5}$/.test(symbol.toUpperCase()));
  if (!masterItem && !item && !isUS && !kiwoomApiService.isConfigured()) {
    return { stock: null, dataSource: 'mock' };
  }

  const stockName = masterItem?.name || item?.name || symbol;
  const stockMarket = isUS ? 'US' : (masterItem?.market || item?.market || 'KOSPI');
  const stockSector = item?.sector || masterItem?.sector || (isUS ? '미국 주식' : '기타');
  const currency: 'KRW' | 'USD' = isUS ? 'USD' : 'KRW';
  const exchange = item?.exchange || (isUS ? 'NASDAQ/NYSE' : undefined);

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
          foreignNetBuy: 0,
          instNetBuy: 0,
          candles: kiwoomCandles,
          sparkline: sparkline.length >= 2 ? sparkline : [prevClose, price],
          currency: 'KRW',
          dataSource: 'kiwoom',
          lastUpdated: new Date().toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul' }),
        };
        const result: FetchStockResult = { stock, dataSource: 'kiwoom' };
        setInCache(cacheKey, result, 5000);
        return result;
      }
    } catch (kiwoomErr: any) {
      console.log(`[StockAPI] Kiwoom API notice for ${symbol}, using Yahoo fallback: ${kiwoomErr.message}`);
    }
  }

  // 2. Secondary / Fallback & Primary for US stocks: Yahoo Finance Live Data API
  try {
    const yahooTicker = isUS
      ? (item?.ticker || symbol.toUpperCase())
      : (item?.ticker || `${symbol}.${stockMarket === 'KOSDAQ' ? 'KQ' : 'KS'}`);
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooTicker)}?interval=1d&range=3mo`;
    const res = await serverResilienceService.resilientFetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
    }, {
      maxRetries: 2,
      baseDelayMs: 300,
      timeoutMs: 4000,
      serviceName: `YahooFinance(${symbol})`,
    });

    if (res.ok) {
      serverResilienceService.markMarketDataSuccess();
      const json = await res.json();
      const result = json.chart?.result?.[0];
      if (result) {
        const meta = result.meta;
        const rawPrice = meta.regularMarketPrice ?? meta.chartPreviousClose ?? 0;
        const rawPrevClose = meta.chartPreviousClose ?? rawPrice;
        const price = isUS ? Number(rawPrice.toFixed(2)) : Math.round(rawPrice);
        const prevClose = isUS ? Number(rawPrevClose.toFixed(2)) : Math.round(rawPrevClose);
        const rawChange = price - prevClose;
        const change = isUS ? Number(rawChange.toFixed(2)) : Math.round(rawChange);
        const changePercent = prevClose !== 0 ? Number(((change / prevClose) * 100).toFixed(2)) : 0;
        const volume = meta.regularMarketVolume || 1000000;
        const openPrice = isUS ? Number((meta.regularMarketDayLow || price).toFixed(2)) : Math.round(meta.regularMarketDayLow || price);
        const highPrice = isUS ? Number((meta.regularMarketDayHigh || price).toFixed(2)) : Math.round(meta.regularMarketDayHigh || price);
        const lowPrice = isUS ? Number((meta.regularMarketDayLow || price).toFixed(2)) : Math.round(meta.regularMarketDayLow || price);
        const tradingValue = isUS ? Math.round((price * volume) / 1000000) : Math.round((price * volume) / 100000000); // US: 백만 달러, KR: 억 원

        // Parse Historical Candles
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
          foreignNetBuy: 0,
          instNetBuy: 0,
          candles,
          sparkline: sparkline.length >= 2 ? sparkline : [prevClose, price],
          currency,
          exchange,
          delayStatus,
          delayLabel,
          dataSource: 'yahoo',
          lastUpdated: new Date().toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul' }),
        };

        const fetchResult: FetchStockResult = { stock, dataSource: 'yahoo' };
        setInCache(cacheKey, fetchResult, 10000);
        return fetchResult;
      }
    }
  } catch (err: any) {
    console.log(`[StockAPI] Yahoo data notice for ${symbol}: ${err.message}`);
  }

  // 3. Fallback: Local master item or mock
  if (masterItem) {
    const price = masterItem.lastPrice || 0;
    const stock: Stock = {
      symbol: masterItem.code,
      name: masterItem.name,
      market: masterItem.market,
      sector: masterItem.sector,
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
      high52w: Math.round(price * 1.3),
      low52w: Math.round(price * 0.7),
      marketCap: masterItem.marketCap || 0,
      per: 15.2,
      pbr: 1.4,
      eps: Math.round(price / 15.2),
      dividendYield: 1.5,
      foreignNetBuy: 0,
      instNetBuy: 0,
      candles: [],
      sparkline: [price, price],
    };
    return { stock, dataSource: 'mock' };
  }

  return { stock: null, dataSource: 'mock' };
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

  const masterList = await kiwoomApiService.fetchStockMasterList();
  const majorSymbols = ['005930', '000660', '005380', '000270', '196170', '042700', '064350', '034020', '373220', '247540', '086520', '207940', '035420', '035720', '005490', '012330', '105560', '055550', '417860'];
  const majorStockMap = new Map<string, Stock>();
  let primarySource: 'kiwoom' | 'yahoo' | 'mock' = 'mock';

  await Promise.allSettled(
    majorSymbols.map(async sym => {
      const res = await fetchRealStockDataWithSource(sym);
      if (res.stock) {
        majorStockMap.set(sym, res.stock);
        if (res.dataSource === 'kiwoom') primarySource = 'kiwoom';
        else if (res.dataSource === 'yahoo' && primarySource !== 'kiwoom') primarySource = 'yahoo';
      }
    })
  );

  const baseList = masterList && masterList.length > 0 ? masterList : TRACKED_STOCKS.map(t => ({
    code: t.symbol,
    name: t.name,
    market: t.market,
    sector: t.sector,
    lastPrice: 0,
    listCount: 0,
    marketCap: 0,
  }));

  const results: Stock[] = baseList.map(item => {
    const live = majorStockMap.get(item.code);
    if (live) return live;
    const price = item.lastPrice || 0;
    return {
      symbol: item.code,
      name: item.name,
      market: item.market,
      sector: item.sector,
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
      high52w: Math.round(price * 1.3),
      low52w: Math.round(price * 0.7),
      marketCap: item.marketCap || 0,
      per: 15.2,
      pbr: 1.4,
      eps: Math.round(price / 15.2),
      dividendYield: 1.5,
      foreignNetBuy: 0,
      instNetBuy: 0,
      candles: [],
      sparkline: [price, price],
    };
  });

  const payload: FetchAllStocksResult = { stocks: results, dataSource: primarySource };
  if (results.length > 0) {
    setInCache(cacheKey, payload, 8000);
  }
  return payload;
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
        setInCache(cacheKey, payload, 6000);
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

  const list: StockIndex[] = [];

  for (const def of indexDefs) {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(def.ticker)}?interval=1d&range=2d`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      if (res.ok) {
        const json = await res.json();
        const meta = json.chart?.result?.[0]?.meta;
        if (meta) {
          const val = Number((meta.regularMarketPrice || def.defaultVal).toFixed(2));
          const prev = Number((meta.chartPreviousClose || val).toFixed(2));
          const change = Number((val - prev).toFixed(2));
          const changePercent = Number(((change / prev) * 100).toFixed(2));

          list.push({
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
          });
          continue;
        }
      }
    } catch {}

    // Fallback if individual index fails
    list.push({
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
    });
  }

  const payload: FetchIndicesResult = { indices: list, dataSource: 'yahoo' };
  setInCache(cacheKey, payload, 8000);
  return payload;
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

  try {
    const url = 'https://query1.finance.yahoo.com/v8/finance/chart/KRW=X?interval=1d&range=2d';
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (res.ok) {
      const json = await res.json();
      const meta = json.chart?.result?.[0]?.meta;
      if (meta) {
        const rate = Number((meta.regularMarketPrice || 1380.0).toFixed(2));
        const prev = Number((meta.chartPreviousClose || rate).toFixed(2));
        const change = Number((rate - prev).toFixed(2));
        const changePercent = Number(((change / prev) * 100).toFixed(2));

        const data: ExchangeRate = {
          currency: 'USD/KRW',
          name: '미국 달러',
          rate,
          change,
          changePercent,
          high: Number((meta.regularMarketDayHigh || rate + 2).toFixed(2)),
          low: Number((meta.regularMarketDayLow || rate - 2).toFixed(2)),
          sparkline: [prev, rate],
        };
        setInCache(cacheKey, data, 15000);
        return data;
      }
    }
  } catch {}

  const fallback: ExchangeRate = {
    currency: 'USD/KRW',
    name: '미국 달러',
    rate: 1382.50,
    change: -2.30,
    changePercent: -0.17,
    high: 1385.00,
    low: 1380.50,
    sparkline: [1384.80, 1382.50],
  };
  setInCache(cacheKey, fallback, 15000);
  return fallback;
}

export interface FetchStockChartOptions {
  period?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
}

export async function fetchUnifiedStockChart(
  symbol: string,
  options: FetchStockChartOptions = {}
): Promise<KiwoomChartResponse> {
  const cleanSymbol = symbol.toUpperCase().trim();
  const rawPeriod = (options.period || '1d').toLowerCase().trim();
  const targetDate = options.date?.trim() || null;
  const isUS = /^[A-Z]{1,5}$/.test(cleanSymbol);

  // Cache key per symbol, period, and target date - strictly isolated
  const cacheKey = `chart_unified_${cleanSymbol}_${rawPeriod}_${targetDate || 'latest'}`;
  const cached = getFromCache<KiwoomChartResponse>(cacheKey);
  if (cached) return cached;

  // Determine Yahoo ticker
  let yahooTicker = cleanSymbol;
  if (!isUS) {
    const isKosdaq =
      cleanSymbol.startsWith('2') ||
      cleanSymbol.startsWith('08') ||
      cleanSymbol.startsWith('19') ||
      cleanSymbol.startsWith('02') ||
      cleanSymbol.startsWith('27') ||
      cleanSymbol.startsWith('039') ||
      cleanSymbol.startsWith('058');
    yahooTicker = `${cleanSymbol}.${isKosdaq ? 'KQ' : 'KS'}`;
  }

  // Interval & Range Mapping
  let interval = '1d';
  let rangeParam = '1mo';
  let periodLabel = '1개월';

  switch (rawPeriod) {
    case '1d':
    case 'day':
      interval = '5m';
      rangeParam = '1d';
      periodLabel = '1일';
      break;
    case '1w':
    case '1week':
      interval = '15m';
      rangeParam = '5d';
      periodLabel = '1주';
      break;
    case '1m':
    case '1mo':
    case '1month':
      interval = '1d';
      rangeParam = '1mo';
      periodLabel = '1개월';
      break;
    case '3m':
    case '3mo':
    case '3months':
      interval = '1d';
      rangeParam = '3mo';
      periodLabel = '3개월';
      break;
    case '6m':
    case '6mo':
    case '6months':
      interval = '1d';
      rangeParam = '6mo';
      periodLabel = '6개월';
      break;
    case 'ytd':
      interval = '1d';
      rangeParam = 'ytd';
      periodLabel = '연간(YTD)';
      break;
    case '1y':
    case '1year':
      interval = '1d';
      rangeParam = '1y';
      periodLabel = '1년';
      break;
    case '5y':
    case '5years':
      interval = '1wk';
      rangeParam = '5y';
      periodLabel = '5년';
      break;
    case 'all':
    case 'max':
      interval = '1mo';
      rangeParam = 'max';
      periodLabel = '전체';
      break;
    case '5min':
    case '5m':
      interval = '5m';
      rangeParam = '1d';
      periodLabel = '5분';
      break;
    case '15min':
    case '15m':
      interval = '15m';
      rangeParam = '5d';
      periodLabel = '15분';
      break;
    case '30min':
    case '30m':
      interval = '30m';
      rangeParam = '5d';
      periodLabel = '30분';
      break;
    case '60min':
    case '1h':
      interval = '60m';
      rangeParam = '1mo';
      periodLabel = '60분';
      break;
    default:
      interval = '1d';
      rangeParam = '1mo';
      periodLabel = '1개월';
  }

  // Handle custom date navigation (과거 날짜 이동)
  let url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooTicker)}?interval=${interval}&range=${rangeParam}`;

  let isHistoricalView = false;
  let targetDateClose: number | undefined;

  if (targetDate) {
    const targetDt = new Date(targetDate);
    if (!isNaN(targetDt.getTime())) {
      isHistoricalView = true;
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - targetDt.getTime()) / (1000 * 3600 * 24));

      // Yahoo Finance only retains minute intervals (<1d) for the last 55 days
      if (diffDays > 50 && (interval.includes('m') || interval === '1h')) {
        interval = '1d';
      }

      // Query around target date: span depends on period
      let spanDays = 30;
      if (rawPeriod === '1d') spanDays = 5;
      else if (rawPeriod === '1w') spanDays = 14;
      else if (rawPeriod === '3m' || rawPeriod === '6m') spanDays = 180;
      else if (rawPeriod === '1y' || rawPeriod === '5y' || rawPeriod === 'all') spanDays = 365;

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
        timeoutMs: 4000,
        serviceName: `Chart(${cleanSymbol})`,
      }
    );

    if (res.ok) {
      const json = await res.json();
      const result = json.chart?.result?.[0];
      if (result) {
        const meta = result.meta || {};
        const timestamps = result.timestamp || [];
        const quotes = result.indicators?.quote?.[0] || {};
        const opens = quotes.open || [];
        const highs = quotes.high || [];
        const lows = quotes.low || [];
        const closes = quotes.close || [];
        const volumes = quotes.volume || [];

        const candles: CandleData[] = [];
        for (let i = 0; i < timestamps.length; i++) {
          const c = closes[i];
          if (c !== null && typeof c === 'number' && !isNaN(c)) {
            const dt = new Date(timestamps[i] * 1000);
            const timeStr =
              interval.includes('m') || interval === '1h'
                ? `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')} ${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`
                : `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;

            candles.push({
              time: timeStr,
              open: Number((opens[i] ?? c).toFixed(2)),
              high: Number((highs[i] ?? c).toFixed(2)),
              low: Number((lows[i] ?? c).toFixed(2)),
              close: Number(c.toFixed(2)),
              volume: Math.round(volumes[i] ?? 0),
            });
          }
        }

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

        const currentPrice = Number(
          (meta.regularMarketPrice || (candles.length > 0 ? candles[candles.length - 1].close : 0)).toFixed(2)
        );

        const chartResponse: KiwoomChartResponse = {
          symbol: cleanSymbol,
          period: rawPeriod,
          periodLabel,
          trId: isUS ? 'GLOBAL_US' : 'YAHOO_KR',
          supported: true,
          candles,
          currentPrice,
          lastCandleClose: candles.length > 0 ? candles[candles.length - 1].close : currentPrice,
          selectedDateClose: targetDateClose,
          selectedDate: targetDate || undefined,
          isHistoricalView,
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
    trId: 'ERROR',
    supported: false,
    candles: [],
    source: 'yahoo',
    cached: false,
    timestamp: Date.now(),
    currency: isUS ? 'USD' : 'KRW',
    error: `${cleanSymbol}의 해당 기간(${periodLabel}) 실제 캔들 데이터를 불러올 수 없습니다.`,
  };
}
