/**
 * Global Stock Indices Provider
 * 
 * Free Public Data Sources:
 * - Major World Stock Market Exchanges:
 *   - United States: S&P 500, NASDAQ, Dow Jones 30, Russell 2000
 *   - Europe: Euro Stoxx 50, German DAX, French CAC 40, UK FTSE 100
 *   - Asia: Japan Nikkei 225, Japan TOPIX, China Shanghai Composite, Hong Kong Hang Seng
 *   - 15~20 minute delayed official exchange closing & intraday index quotes
 */

import { UnifiedFinancialItem, FinancialCategory } from './types.js';

interface IndexConfig {
  id: string;
  category: 'us' | 'asia' | 'europe';
  name: string;
  symbol: string;
  ticker: string;
  currency: string;
  unit: string;
  provider: string;
  delayStatus: 'delayed_15m' | 'delayed_20m';
  delayLabel: string;
}

const GLOBAL_INDEX_LIST: IndexConfig[] = [
  // 1. 미국 (US)
  {
    id: 'sp500',
    category: 'us',
    name: 'S&P 500',
    symbol: '^GSPC',
    ticker: '^GSPC',
    currency: 'USD',
    unit: 'pt',
    provider: 'S&P Dow Jones / 미국 증시',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },
  {
    id: 'nasdaq',
    category: 'us',
    name: '나스닥 종합 (NASDAQ)',
    symbol: '^IXIC',
    ticker: '^IXIC',
    currency: 'USD',
    unit: 'pt',
    provider: 'NASDAQ OMX / 미국 증시',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },
  {
    id: 'dow',
    category: 'us',
    name: '다우존스 30 (Dow Jones)',
    symbol: '^DJI',
    ticker: '^DJI',
    currency: 'USD',
    unit: 'pt',
    provider: 'S&P Dow Jones / 미국 증시',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },
  {
    id: 'russell2000',
    category: 'us',
    name: '러셀 2000 (Russell 2000)',
    symbol: '^RUT',
    ticker: '^RUT',
    currency: 'USD',
    unit: 'pt',
    provider: 'FTSE Russell / 미국 소형주',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },

  // 2. 유럽 (Europe)
  {
    id: 'stoxx50',
    category: 'europe',
    name: '유로 스톡스 50 (Euro Stoxx 50)',
    symbol: '^STOXX50E',
    ticker: '^STOXX50E',
    currency: 'EUR',
    unit: 'pt',
    provider: 'STOXX / 유럽 주요 50대 우량주',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },
  {
    id: 'dax',
    category: 'europe',
    name: '독일 DAX 40',
    symbol: '^GDAXI',
    ticker: '^GDAXI',
    currency: 'EUR',
    unit: 'pt',
    provider: 'Deutsche Börse / 독일 증시',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },
  {
    id: 'cac40',
    category: 'europe',
    name: '프랑스 CAC 40',
    symbol: '^FCHI',
    ticker: '^FCHI',
    currency: 'EUR',
    unit: 'pt',
    provider: 'Euronext Paris / 프랑스 증시',
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
    provider: 'London Stock Exchange / 영국 증시',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },

  // 3. 아시아 (Asia)
  {
    id: 'nikkei225',
    category: 'asia',
    name: '닛케이 225 (Nikkei 225)',
    symbol: '^N225',
    ticker: '^N225',
    currency: 'JPY',
    unit: '엔',
    provider: '도쿄증권거래소 (TSE) / 일본 증시',
    delayStatus: 'delayed_20m',
    delayLabel: '20분 지연',
  },
  {
    id: 'shanghai',
    category: 'asia',
    name: '상하이 종합 (Shanghai Composite)',
    symbol: '000001.SS',
    ticker: '000001.SS',
    currency: 'CNY',
    unit: 'pt',
    provider: '상하이증권거래소 (SSE) / 중국 증시',
    delayStatus: 'delayed_20m',
    delayLabel: '20분 지연',
  },
  {
    id: 'hangseng',
    category: 'asia',
    name: '홍콩 항셍 (Hang Seng Index)',
    symbol: '^HSI',
    ticker: '^HSI',
    currency: 'HKD',
    unit: 'pt',
    provider: '홍콩증권거래소 (HKEX) / 홍콩 증시',
    delayStatus: 'delayed_15m',
    delayLabel: '15분 지연',
  },
];

export class GlobalMarketProvider {
  private async fetchSingleIndex(cfg: IndexConfig): Promise<UnifiedFinancialItem> {
    const nowStr = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) + ' (KST)';

    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(cfg.ticker)}?interval=1d&range=5d`;
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

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const result = json.chart?.result?.[0];
      if (!result) throw new Error('Data unavailable');

      const meta = result.meta;
      const rawPrice = meta.regularMarketPrice ?? meta.chartPreviousClose;
      const rawPrev = meta.chartPreviousClose ?? rawPrice;

      const price = Number(rawPrice.toFixed(2));
      const prevClose = Number(rawPrev.toFixed(2));
      const change = Number((price - prevClose).toFixed(2));
      const changePercent = prevClose !== 0 ? Number(((change / prevClose) * 100).toFixed(2)) : 0;

      const closeArray = (result.indicators?.quote?.[0]?.close || [])
        .filter((v: any) => v !== null && v !== undefined)
        .map((v: number) => Number(v.toFixed(2)));
      const sparkline = closeArray.length >= 2 ? closeArray.slice(-8) : [prevClose, price];

      return {
        id: `idx_${cfg.id}`,
        category: cfg.category,
        assetType: 'index',
        name: cfg.name,
        symbol: cfg.symbol,
        value: price,
        displayValue: `${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${cfg.unit}`,
        change,
        changePercent,
        currency: cfg.currency,
        unit: cfg.unit,
        high: meta.regularMarketDayHigh ? Number(meta.regularMarketDayHigh.toFixed(2)) : undefined,
        low: meta.regularMarketDayLow ? Number(meta.regularMarketDayLow.toFixed(2)) : undefined,
        prevClose,
        sparkline,
        provider: cfg.provider,
        delayStatus: cfg.delayStatus,
        delayLabel: cfg.delayLabel,
        isRealtime: false,
        lastUpdated: nowStr,
        status: 'ok',
      };
    } catch (err: any) {
      console.warn(`[GlobalMarketProvider] Error fetching ${cfg.name}:`, err.message);
      return {
        id: `idx_${cfg.id}`,
        category: cfg.category,
        assetType: 'index',
        name: cfg.name,
        symbol: cfg.symbol,
        value: 0,
        change: 0,
        changePercent: 0,
        currency: cfg.currency,
        unit: cfg.unit,
        provider: cfg.provider,
        delayStatus: cfg.delayStatus,
        delayLabel: cfg.delayLabel,
        isRealtime: false,
        lastUpdated: nowStr,
        status: 'unavailable',
        errorMessage: '지수 시세 일시 지연',
      };
    }
  }

  async getIndexItems(category?: 'us' | 'asia' | 'europe'): Promise<UnifiedFinancialItem[]> {
    const targets = category ? GLOBAL_INDEX_LIST.filter(i => i.category === category) : GLOBAL_INDEX_LIST;
    return Promise.all(targets.map(c => this.fetchSingleIndex(c)));
  }
}

export const globalMarketProvider = new GlobalMarketProvider();
