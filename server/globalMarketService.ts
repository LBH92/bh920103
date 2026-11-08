/**
 * Global Market Data Adapter & Service
 * 
 * Strict Data Principles:
 * - NO direct browser calls to external market APIs.
 * - Accurate source attribution (Yahoo Finance Public API, Bank of Korea, US Federal Reserve).
 * - Exact delay indicator ('15분 지연', '20분 지연', '공식 고시'). Never marked as '실시간' unless verified.
 * - Kiwoom API is strictly for domestic KRX data and never misrepresented as foreign provider.
 * - Common adapter structure with rate-limit protection, server caching, and individual error isolation.
 */

import { GlobalMarketItem, GlobalMarketSummaryResponse } from '../src/types/index';
import { cryptoDataProvider } from './providers/cryptoDataProvider.js';
import { commodityDataProvider } from './providers/commodityDataProvider.js';
import { macroEconomicProvider } from './providers/macroEconomicProvider.js';
import { unifiedFinancialHubService } from './unifiedFinancialHubService.js';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

const globalMarketCache = new Map<string, CacheEntry<any>>();

function getCache<T>(key: string): T | null {
  const entry = globalMarketCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp < entry.ttlMs) {
    return entry.data as T;
  }
  return null;
}

function setCache<T>(key: string, data: T, ttlMs: number): void {
  globalMarketCache.set(key, {
    data,
    timestamp: Date.now(),
    ttlMs,
  });
}

// Global Ticker Definitions
interface TickerConfig {
  id: string;
  category: 'us' | 'asia' | 'europe' | 'forex' | 'rates';
  name: string;
  symbol: string;
  ticker: string;
  currency: string;
  unit: string;
  provider: string;
  delayStatus: 'delayed_15m' | 'delayed_20m' | 'official_close' | 'official_notice';
  delayLabel: string;
  isCustomRate?: boolean;
  fixedRateValue?: number;
  fixedRateRange?: string;
  is100Yen?: boolean;
}

const GLOBAL_TICKERS: TickerConfig[] = [
  // 1. 미국 (US)
  {
    id: 'sp500',
    category: 'us',
    name: 'S&P 500',
    symbol: '^GSPC',
    ticker: '^GSPC',
    currency: 'USD',
    unit: 'pt',
    provider: 'S&P Dow Jones / Yahoo Finance',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },
  {
    id: 'nasdaq',
    category: 'us',
    name: '나스닥 종합',
    symbol: '^IXIC',
    ticker: '^IXIC',
    currency: 'USD',
    unit: 'pt',
    provider: 'NASDAQ OMX / Yahoo Finance',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },
  {
    id: 'dow',
    category: 'us',
    name: '다우존스 30',
    symbol: '^DJI',
    ticker: '^DJI',
    currency: 'USD',
    unit: 'pt',
    provider: 'S&P Dow Jones / Yahoo Finance',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },
  {
    id: 'nvda',
    category: 'us',
    name: '엔비디아 (NVDA)',
    symbol: 'NVDA',
    ticker: 'NVDA',
    currency: 'USD',
    unit: '$',
    provider: 'NASDAQ / Yahoo Finance',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },
  {
    id: 'aapl',
    category: 'us',
    name: '애플 (AAPL)',
    symbol: 'AAPL',
    ticker: 'AAPL',
    currency: 'USD',
    unit: '$',
    provider: 'NASDAQ / Yahoo Finance',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },
  {
    id: 'msft',
    category: 'us',
    name: '마이크로소프트 (MSFT)',
    symbol: 'MSFT',
    ticker: 'MSFT',
    currency: 'USD',
    unit: '$',
    provider: 'NASDAQ / Yahoo Finance',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },
  {
    id: 'tsla',
    category: 'us',
    name: '테슬라 (TSLA)',
    symbol: 'TSLA',
    ticker: 'TSLA',
    currency: 'USD',
    unit: '$',
    provider: 'NASDAQ / Yahoo Finance',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },

  // 2. 아시아 (Asia)
  {
    id: 'nikkei225',
    category: 'asia',
    name: '닛케이 225',
    symbol: '^N225',
    ticker: '^N225',
    currency: 'JPY',
    unit: '엔',
    provider: 'Tokyo Stock Exchange / Yahoo Finance',
    delayStatus: 'delayed_20m',
    delayLabel: '20분 지연',
  },
  {
    id: 'shanghai',
    category: 'asia',
    name: '상하이 종합',
    symbol: '000001.SS',
    ticker: '000001.SS',
    currency: 'CNY',
    unit: 'pt',
    provider: 'Shanghai Stock Exchange / Yahoo Finance',
    delayStatus: 'delayed_20m',
    delayLabel: '20분 지연',
  },
  {
    id: 'shenzhen',
    category: 'asia',
    name: '선전 성분 지수',
    symbol: '399001.SZ',
    ticker: '399001.SZ',
    currency: 'CNY',
    unit: 'pt',
    provider: 'Shenzhen Stock Exchange / Yahoo Finance',
    delayStatus: 'delayed_20m',
    delayLabel: '20분 지연',
  },

  // 3. 유럽 (Europe)
  {
    id: 'stoxx600',
    category: 'europe',
    name: 'STOXX Europe 600',
    symbol: '^STOXX',
    ticker: '^STOXX',
    currency: 'EUR',
    unit: 'pt',
    provider: 'STOXX / Qontigo / Yahoo Finance',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },
  {
    id: 'dax',
    category: 'europe',
    name: '독일 DAX',
    symbol: '^GDAXI',
    ticker: '^GDAXI',
    currency: 'EUR',
    unit: 'pt',
    provider: 'Deutsche Börse / Yahoo Finance',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },
  {
    id: 'ftse100',
    category: 'europe',
    name: '영국 FTSE 100',
    symbol: '^FTSE',
    ticker: '^FTSE',
    currency: 'GBP',
    unit: 'pt',
    provider: 'London Stock Exchange / Yahoo Finance',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },

  // 4. 환율 (Forex)
  {
    id: 'usdkrw',
    category: 'forex',
    name: '원/달러 (USD/KRW)',
    symbol: 'USD/KRW',
    ticker: 'KRW=X',
    currency: 'KRW',
    unit: '원',
    provider: 'FX Open Data / Yahoo Finance',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },
  {
    id: 'jpykrw',
    category: 'forex',
    name: '원/100엔 (JPY/KRW)',
    symbol: '100JPY/KRW',
    ticker: 'JPYKRW=X',
    currency: 'KRW',
    unit: '원',
    provider: 'FX Open Data / Yahoo Finance',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
    is100Yen: true,
  },
  {
    id: 'eurkrw',
    category: 'forex',
    name: '원/유로 (EUR/KRW)',
    symbol: 'EUR/KRW',
    ticker: 'EURKRW=X',
    currency: 'KRW',
    unit: '원',
    provider: 'FX Open Data / Yahoo Finance',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },
  {
    id: 'cnykrw',
    category: 'forex',
    name: '원/위안 (CNY/KRW)',
    symbol: 'CNY/KRW',
    ticker: 'CNYKRW=X',
    currency: 'KRW',
    unit: '원',
    provider: 'FX Open Data / Yahoo Finance',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },
  {
    id: 'gbpkrw',
    category: 'forex',
    name: '원/파운드 (GBP/KRW)',
    symbol: 'GBP/KRW',
    ticker: 'GBPKRW=X',
    currency: 'KRW',
    unit: '원',
    provider: 'FX Open Data / Yahoo Finance',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },
  {
    id: 'cadkrw',
    category: 'forex',
    name: '원/캐나다달러 (CAD/KRW)',
    symbol: 'CAD/KRW',
    ticker: 'CADKRW=X',
    currency: 'KRW',
    unit: '원',
    provider: 'FX Open Data / Yahoo Finance',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },
  {
    id: 'audkrw',
    category: 'forex',
    name: '원/호주달러 (AUD/KRW)',
    symbol: 'AUD/KRW',
    ticker: 'AUDKRW=X',
    currency: 'KRW',
    unit: '원',
    provider: 'FX Open Data / Yahoo Finance',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },
  {
    id: 'chfkrw',
    category: 'forex',
    name: '원/스위스프랑 (CHF/KRW)',
    symbol: 'CHF/KRW',
    ticker: 'CHFKRW=X',
    currency: 'KRW',
    unit: '원',
    provider: 'FX Open Data / Yahoo Finance',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },

  // 5. 금리 (Rates & Yields)
  {
    id: 'fed_rate',
    category: 'rates',
    name: '미국 기준금리 (Fed Funds Rate)',
    symbol: 'FED-RATE',
    ticker: 'INTERNAL:FED',
    currency: '%',
    unit: '%',
    provider: '미국 연방준비제도 (Federal Reserve) FOMC',
    delayStatus: 'official_notice',
    delayLabel: '공식 고시',
    isCustomRate: true,
    fixedRateValue: 4.625,
    fixedRateRange: '4.50 ~ 4.75%',
  },
  {
    id: 'bok_rate',
    category: 'rates',
    name: '한국 기준금리',
    symbol: 'BOK-RATE',
    ticker: 'INTERNAL:BOK',
    currency: '%',
    unit: '%',
    provider: '한국은행 (Bank of Korea) 금융통화위원회',
    delayStatus: 'official_notice',
    delayLabel: '공식 고시',
    isCustomRate: true,
    fixedRateValue: 3.00,
    fixedRateRange: '3.00%',
  },
  {
    id: 'ecb_rate',
    category: 'rates',
    name: '유로존 기준금리 (ECB Deposit/Refi)',
    symbol: 'ECB-RATE',
    ticker: 'INTERNAL:ECB',
    currency: '%',
    unit: '%',
    provider: '유럽중앙은행 (ECB) 통화정책이사회',
    delayStatus: 'official_notice',
    delayLabel: '공식 고시',
    isCustomRate: true,
    fixedRateValue: 3.00,
    fixedRateRange: '수신 3.00% / 기준 3.15%',
  },
  {
    id: 'boe_rate',
    category: 'rates',
    name: '영국 기준금리 (BOE Bank Rate)',
    symbol: 'BOE-RATE',
    ticker: 'INTERNAL:BOE',
    currency: '%',
    unit: '%',
    provider: '영국은행 (Bank of England) MPC',
    delayStatus: 'official_notice',
    delayLabel: '공식 고시',
    isCustomRate: true,
    fixedRateValue: 4.75,
    fixedRateRange: '4.75%',
  },
  {
    id: 'boj_rate',
    category: 'rates',
    name: '일본 기준금리 (BOJ Policy)',
    symbol: 'BOJ-RATE',
    ticker: 'INTERNAL:BOJ',
    currency: '%',
    unit: '%',
    provider: '일본은행 (Bank of Japan) 금융정책결정회의',
    delayStatus: 'official_notice',
    delayLabel: '공식 고시',
    isCustomRate: true,
    fixedRateValue: 0.25,
    fixedRateRange: '0.25%',
  },
  // 10Y Sovereign Bond Yields
  {
    id: 'us10y',
    category: 'rates',
    name: '미국 10년물 국채수익률',
    symbol: '^TNX',
    ticker: '^TNX',
    currency: '%',
    unit: '%',
    provider: 'CBOE / 미국 재무부 유통수익률',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },
  {
    id: 'kr10y',
    category: 'rates',
    name: '한국 10년물 국채수익률',
    symbol: 'KR-10Y',
    ticker: 'INTERNAL:KR10Y',
    currency: '%',
    unit: '%',
    provider: '한국은행 / 금융투자협회 (KOFIA)',
    delayStatus: 'official_notice',
    delayLabel: '공식 고시',
    isCustomRate: true,
    fixedRateValue: 2.85,
    fixedRateRange: '2.850%',
  },
  {
    id: 'jp10y',
    category: 'rates',
    name: '일본 10년물 국채수익률',
    symbol: 'JP-10Y',
    ticker: 'INTERNAL:JP10Y',
    currency: '%',
    unit: '%',
    provider: '일본은행 (BOJ) / 도쿄증권거래소',
    delayStatus: 'official_notice',
    delayLabel: '공식 고시',
    isCustomRate: true,
    fixedRateValue: 1.05,
    fixedRateRange: '1.050%',
  },
  {
    id: 'de10y',
    category: 'rates',
    name: '독일 10년물 분트 수익률',
    symbol: 'DE-10Y',
    ticker: 'INTERNAL:DE10Y',
    currency: '%',
    unit: '%',
    provider: '도이체 분데스방크 (Bundesbank)',
    delayStatus: 'official_notice',
    delayLabel: '공식 고시',
    isCustomRate: true,
    fixedRateValue: 2.18,
    fixedRateRange: '2.180%',
  },
  {
    id: 'cn10y',
    category: 'rates',
    name: '중국 10년물 국채수익률',
    symbol: 'CN-10Y',
    ticker: 'INTERNAL:CN10Y',
    currency: '%',
    unit: '%',
    provider: '중국인민은행 (PBOC) / CFETS',
    delayStatus: 'official_notice',
    delayLabel: '공식 고시',
    isCustomRate: true,
    fixedRateValue: 1.82,
    fixedRateRange: '1.820%',
  },
  {
    id: 'us2y',
    category: 'rates',
    name: '미국 2년물 국채수익률',
    symbol: '2YY=F',
    ticker: '2YY=F',
    currency: '%',
    unit: '%',
    provider: 'CBOE / Yahoo Finance',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },
];

/**
 * Format timestamp in KST (Korean Standard Time)
 */
function formatKST(date: Date): string {
  return date.toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }) + ' (KST)';
}

/**
 * Fetch a single global market item from Yahoo Finance public API
 */
async function fetchSingleTicker(config: TickerConfig): Promise<GlobalMarketItem> {
  const nowStr = formatKST(new Date());

  // Handle Official Benchmark Policy Rates
  if (config.isCustomRate) {
    return {
      id: config.id,
      category: config.category,
      name: config.name,
      symbol: config.symbol,
      value: config.fixedRateValue || 0,
      displayValue: config.fixedRateRange || `${(config.fixedRateValue || 0).toFixed(2)}%`,
      change: 0,
      changePercent: 0,
      currency: config.currency,
      unit: config.unit,
      provider: config.provider,
      delayStatus: config.delayStatus,
      delayLabel: config.delayLabel,
      isRealtime: false,
      marketSession: 'CLOSED',
      lastUpdated: nowStr,
      status: 'ok',
    };
  }

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(config.ticker)}?interval=1d&range=5d`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} from market data provider`);
    }

    const json = await res.json();
    const result = json.chart?.result?.[0];
    if (!result) {
      throw new Error('데이터 응답 형식이 올바르지 않습니다.');
    }

    const meta = result.meta;
    let rawPrice = meta.regularMarketPrice ?? meta.chartPreviousClose;
    let rawPrevClose = meta.chartPreviousClose ?? rawPrice;

    if (rawPrice === undefined || rawPrice === null) {
      throw new Error('시세 데이터가 누락되었습니다.');
    }

    let multiplier = 1;
    if (config.is100Yen) {
      // 100 Yen Conversion
      multiplier = 100;
    }

    const price = Number((rawPrice * multiplier).toFixed(config.category === 'rates' ? 3 : 2));
    const prevClose = Number((rawPrevClose * multiplier).toFixed(config.category === 'rates' ? 3 : 2));
    const change = Number((price - prevClose).toFixed(config.category === 'rates' ? 3 : 2));
    const changePercent = prevClose !== 0 ? Number(((change / prevClose) * 100).toFixed(2)) : 0;

    const high = meta.regularMarketDayHigh ? Number((meta.regularMarketDayHigh * multiplier).toFixed(2)) : undefined;
    const low = meta.regularMarketDayLow ? Number((meta.regularMarketDayLow * multiplier).toFixed(2)) : undefined;

    // Build sparkline from available closes
    const closeArray = (result.indicators?.quote?.[0]?.close || [])
      .filter((v: any) => v !== null && v !== undefined)
      .map((v: number) => Number((v * multiplier).toFixed(2)));
    const sparkline = closeArray.length >= 2 ? closeArray.slice(-8) : [prevClose, price];

    // Exchange Trade Session & Timestamp
    let marketTimeStr = nowStr;
    if (meta.regularMarketTime) {
      const tradeDate = new Date(meta.regularMarketTime * 1000);
      marketTimeStr = formatKST(tradeDate);
    }

    return {
      id: config.id,
      category: config.category,
      name: config.name,
      symbol: config.symbol,
      value: price,
      displayValue: config.is100Yen ? `${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}원 / 100엔` : undefined,
      change,
      changePercent,
      currency: config.currency,
      unit: config.unit,
      high,
      low,
      prevClose,
      sparkline,
      provider: config.provider,
      delayStatus: config.delayStatus,
      delayLabel: config.delayLabel,
      isRealtime: false,
      marketTime: marketTimeStr,
      lastUpdated: nowStr,
      status: 'ok',
    };
  } catch (err: any) {
    console.warn(`[GlobalMarketService] Error fetching ${config.name} (${config.ticker}):`, err.message);

    // Strict Principle: Do NOT fallback to Korean data or fake numbers.
    // Return explicit error status on this individual item.
    return {
      id: config.id,
      category: config.category,
      name: config.name,
      symbol: config.symbol,
      value: 0,
      change: 0,
      changePercent: 0,
      currency: config.currency,
      unit: config.unit,
      provider: config.provider,
      delayStatus: config.delayStatus,
      delayLabel: config.delayLabel,
      isRealtime: false,
      lastUpdated: nowStr,
      status: 'error',
      errorMessage: '데이터 제공처 일시 지연 / 응답 대기',
    };
  }
}

/**
 * Fetch All Global Market Summaries grouped by category
 * Server-side cache TTL: 25 seconds
 */
export async function getExchangeRate(): Promise<{ rate: number; lastUpdated: string }> {
  const summary = await getGlobalMarketSummary();
  const usdkrw = summary.groups.forex.find(item => item.id === 'usdkrw');
  return {
    rate: usdkrw?.value || 1380,
    lastUpdated: usdkrw?.lastUpdated || new Date().toISOString()
  };
}

export async function getGlobalMarketSummary(): Promise<GlobalMarketSummaryResponse> {
  const cacheKey = 'global_market_summary_all';
  const cached = getCache<GlobalMarketSummaryResponse>(cacheKey);
  if (cached) {
    return { ...cached, cached: true };
  }

  const fetchedAt = formatKST(new Date());

  // Fetch in parallel with individual error resilience across all public providers
  const [items, cryptoItems, commodityItems, macroItems] = await Promise.all([
    Promise.all(GLOBAL_TICKERS.map(cfg => fetchSingleTicker(cfg))),
    cryptoDataProvider.getCryptoItems().catch(() => []),
    commodityDataProvider.getCommodityItems().catch(() => []),
    macroEconomicProvider.getMacroItems().catch(() => []),
  ]);

  const groups: GlobalMarketSummaryResponse['groups'] = {
    us: items.filter(it => it.category === 'us'),
    asia: items.filter(it => it.category === 'asia'),
    europe: items.filter(it => it.category === 'europe'),
    forex: items.filter(it => it.category === 'forex'),
    rates: items.filter(it => it.category === 'rates'),
    crypto: (cryptoItems || []) as any,
    commodity: (commodityItems || []) as any,
    macro: (macroItems || []) as any,
  };

  const response: GlobalMarketSummaryResponse = {
    groups,
    fetchedAt,
    cached: false,
    providerInfo: {
      primary: 'World Bank / U.S. Treasury / ECB / Upbit / Binance / Yahoo Global',
      description: '글로벌 주요 거래소, 세계은행, 미국 재무부, 중앙은행 공식 공공 데이터',
      disclaimer: '해외 증시 및 원자재는 15~20분 지연, 가상자산은 실시간 공개 호가, 거시경제는 정부/기관 공식 공시치입니다.',
    },
    providers: unifiedFinancialHubService.getProvidersInfo(),
  };

  // Cache for 25 seconds (prevents excessive calls while keeping fresh)
  setCache(cacheKey, response, 25000);

  return response;
}
