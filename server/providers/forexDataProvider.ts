/**
 * Forex Data Provider
 * 
 * Sources:
 * 1. Frankfurter API (European Central Bank Official Reference Rates)
 *    - Free, open source, 0 cost, no API key required
 *    - Official publication: Every working day around 16:00 CET
 * 2. FX Open Market Data (Yahoo Finance Forex Public Feeds for intraday 15m delayed quotes)
 */

import { UnifiedFinancialItem } from './types.js';

interface FrankfurterResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export class ForexDataProvider {
  private lastEcbDate: string = '';
  private ecbRates: Record<string, number> = {};

  /**
   * Fetch official ECB reference rates from Frankfurter API
   */
  async fetchEcbRates(): Promise<FrankfurterResponse | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=KRW,EUR,JPY,GBP,CNY,AUD,CAD,CHF', {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ByeongdolInvestment/1.0 (Financial Data Hub)',
        },
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Frankfurter API returned HTTP ${res.status}`);
      }

      const json: FrankfurterResponse = await res.json();
      this.lastEcbDate = json.date;
      this.ecbRates = json.rates;
      return json;
    } catch (err: any) {
      console.warn('[ForexDataProvider] Frankfurter ECB API fetch notice:', err.message);
      return null;
    }
  }

  /**
   * Fetch intraday forex ticker with sparkline from public chart endpoint
   */
  private async fetchYahooForexTicker(pair: {
    ticker: string;
    symbol: string;
    name: string;
    currency: string;
    unit: string;
    is100Yen?: boolean;
    ecbRateFn: (rates: Record<string, number>) => number | null;
  }): Promise<UnifiedFinancialItem> {
    const { ticker, symbol, name, currency, unit, is100Yen = false, ecbRateFn } = pair;
    const nowStr = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) + ' (KST)';
    const multiplier = is100Yen ? 100 : 1;

    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=5d`;
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
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      const result = json.chart?.result?.[0];
      if (!result) throw new Error('Invalid format');

      const meta = result.meta;
      const rawPrice = meta.regularMarketPrice ?? meta.chartPreviousClose;
      const rawPrev = meta.chartPreviousClose ?? rawPrice;
      const decimals = currency === 'USD' ? 4 : 2;

      const price = Number((rawPrice * multiplier).toFixed(decimals));
      const prevClose = Number((rawPrev * multiplier).toFixed(decimals));
      const change = Number((price - prevClose).toFixed(decimals));
      const changePercent = prevClose !== 0 ? Number(((change / prevClose) * 100).toFixed(2)) : 0;

      const closeArray = (result.indicators?.quote?.[0]?.close || [])
        .filter((v: any) => v !== null && v !== undefined)
        .map((v: number) => Number((v * multiplier).toFixed(decimals)));
      const sparkline = closeArray.length >= 2 ? closeArray.slice(-8) : [prevClose, price];

      // If ECB reference rate exists, note official date
      let ecbNote = '';
      if (this.lastEcbDate && this.ecbRates['KRW']) {
        ecbNote = `ECB 고시 기준일: ${this.lastEcbDate}`;
      }

      return {
        id: ticker.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
        category: 'forex',
        assetType: 'forex',
        name,
        symbol,
        value: price,
        displayValue: is100Yen
          ? `${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}원 / 100엔`
          : currency === 'USD'
          ? `$${price.toFixed(4)}`
          : currency === 'JPY'
          ? `¥${price.toFixed(2)}`
          : undefined,
        change,
        changePercent,
        currency,
        unit,
        high: meta.regularMarketDayHigh ? Number((meta.regularMarketDayHigh * multiplier).toFixed(decimals)) : undefined,
        low: meta.regularMarketDayLow ? Number((meta.regularMarketDayLow * multiplier).toFixed(decimals)) : undefined,
        prevClose,
        sparkline,
        provider: 'ECB (Frankfurter) / FX Open Data',
        delayStatus: 'delayed_15m',
        delayLabel: '15분 지연 시세',
        isRealtime: false,
        lastUpdated: nowStr,
        status: 'ok',
        notes: ecbNote,
        license: 'ECB Open Data / Open FX',
      };
    } catch {
      const ecbVal = Object.keys(this.ecbRates).length > 0 ? ecbRateFn(this.ecbRates) : null;
      if (ecbVal && Number.isFinite(ecbVal) && ecbVal > 0) {
        const decimals = currency === 'USD' ? 4 : 2;
        const rounded = Number(ecbVal.toFixed(decimals));
        return {
          id: ticker.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
          category: 'forex',
          assetType: 'forex',
          name,
          symbol,
          value: rounded,
          change: 0,
          changePercent: 0,
          currency,
          unit,
          provider: 'ECB (Frankfurter) 공식 고시환율',
          delayStatus: 'official_notice',
          delayLabel: '공식 고시 (ECB)',
          isRealtime: false,
          lastUpdated: nowStr,
          status: 'delayed',
          notes: this.lastEcbDate ? `ECB 공식 고시일: ${this.lastEcbDate}` : '공식 고시 기준',
        };
      }

      return {
        id: ticker.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
        category: 'forex',
        assetType: 'forex',
        name,
        symbol,
        value: 0,
        change: 0,
        changePercent: 0,
        currency,
        unit,
        provider: 'ECB (Frankfurter) / FX Open Data',
        delayStatus: 'delayed_15m',
        delayLabel: '수신 지연',
        isRealtime: false,
        lastUpdated: nowStr,
        status: 'error',
        errorMessage: `${symbol} 실시간 환율 데이터를 수신할 수 없습니다.`,
      };
    }
  }

  /**
   * Get all major currency pairs
   */
  async getForexItems(): Promise<UnifiedFinancialItem[]> {
    // 1. Refresh ECB base rates in background
    await this.fetchEcbRates().catch(() => null);

    // 2. Fetch primary pairs with exact quote currencies & cross-rate ECB formulas (base=USD)
    const pairs = [
      { ticker: 'KRW=X', symbol: 'USD/KRW', name: '원/달러 (USD/KRW)', currency: 'KRW', unit: '원', ecbRateFn: (r: Record<string, number>) => r['KRW'] || null },
      { ticker: 'JPYKRW=X', symbol: '100JPY/KRW', name: '원/100엔 (100JPY/KRW)', currency: 'KRW', unit: '원', is100Yen: true, ecbRateFn: (r: Record<string, number>) => (r['KRW'] && r['JPY'] ? (r['KRW'] / r['JPY']) * 100 : null) },
      { ticker: 'EURKRW=X', symbol: 'EUR/KRW', name: '원/유로 (EUR/KRW)', currency: 'KRW', unit: '원', ecbRateFn: (r: Record<string, number>) => (r['KRW'] && r['EUR'] ? r['KRW'] / r['EUR'] : null) },
      { ticker: 'CNYKRW=X', symbol: 'CNY/KRW', name: '원/위안 (CNY/KRW)', currency: 'KRW', unit: '원', ecbRateFn: (r: Record<string, number>) => (r['KRW'] && r['CNY'] ? r['KRW'] / r['CNY'] : null) },
      { ticker: 'GBPKRW=X', symbol: 'GBP/KRW', name: '원/파운드 (GBP/KRW)', currency: 'KRW', unit: '원', ecbRateFn: (r: Record<string, number>) => (r['KRW'] && r['GBP'] ? r['KRW'] / r['GBP'] : null) },
      { ticker: 'CADKRW=X', symbol: 'CAD/KRW', name: '원/캐나다달러 (CAD/KRW)', currency: 'KRW', unit: '원', ecbRateFn: (r: Record<string, number>) => (r['KRW'] && r['CAD'] ? r['KRW'] / r['CAD'] : null) },
      { ticker: 'AUDKRW=X', symbol: 'AUD/KRW', name: '원/호주달러 (AUD/KRW)', currency: 'KRW', unit: '원', ecbRateFn: (r: Record<string, number>) => (r['KRW'] && r['AUD'] ? r['KRW'] / r['AUD'] : null) },
      { ticker: 'CHFKRW=X', symbol: 'CHF/KRW', name: '원/스위스프랑 (CHF/KRW)', currency: 'KRW', unit: '원', ecbRateFn: (r: Record<string, number>) => (r['KRW'] && r['CHF'] ? r['KRW'] / r['CHF'] : null) },
      { ticker: 'EURUSD=X', symbol: 'EUR/USD', name: '유로/달러 (EUR/USD)', currency: 'USD', unit: '$', ecbRateFn: (r: Record<string, number>) => (r['EUR'] ? 1 / r['EUR'] : null) },
      { ticker: 'JPY=X', symbol: 'USD/JPY', name: '달러/엔 (USD/JPY)', currency: 'JPY', unit: '엔', ecbRateFn: (r: Record<string, number>) => r['JPY'] || null },
    ];

    return Promise.all(pairs.map(p => this.fetchYahooForexTicker(p)));
  }
}

export const forexDataProvider = new ForexDataProvider();
