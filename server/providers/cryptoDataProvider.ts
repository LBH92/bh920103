/**
 * Crypto Data Provider
 * 
 * Free Public Data Sources:
 * 1. Upbit Public Quotation API (https://api.upbit.com/v1/ticker)
 *    - Real-time KRW market quotes, 24h volume & price change
 *    - Free public API (10 req/sec limit, cached at server level)
 * 2. Binance Public 24hr Ticker API (https://api.binance.com/api/v3/ticker/24hr)
 *    - Global USD/USDT reference pricing & 24h volume
 *    - Free public market data endpoint
 */

import { UnifiedFinancialItem } from './types.js';

interface UpbitTickerItem {
  market: string;
  trade_date: string;
  trade_time: string;
  trade_timestamp: number;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  prev_closing_price: number;
  change: 'RISE' | 'EVEN' | 'FALL';
  change_price: number;
  change_rate: number;
  signed_change_price: number;
  signed_change_rate: number;
  trade_volume: number;
  acc_trade_price_24h: number;
  acc_trade_volume_24h: number;
}

interface BinanceTickerItem {
  symbol: string;
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
}

const CRYPTO_COINS = [
  { symbol: 'BTC', name: '비트코인', upbitMarket: 'KRW-BTC', binanceSymbol: 'BTCUSDT' },
  { symbol: 'ETH', name: '이더리움', upbitMarket: 'KRW-ETH', binanceSymbol: 'ETHUSDT' },
  { symbol: 'SOL', name: '솔라나', upbitMarket: 'KRW-SOL', binanceSymbol: 'SOLUSDT' },
  { symbol: 'XRP', name: '리플', upbitMarket: 'KRW-XRP', binanceSymbol: 'XRPUSDT' },
  { symbol: 'DOGE', name: '도지코인', upbitMarket: 'KRW-DOGE', binanceSymbol: 'DOGEUSDT' },
  { symbol: 'ADA', name: '에이다', upbitMarket: 'KRW-ADA', binanceSymbol: 'ADAUSDT' },
];

export class CryptoDataProvider {
  /**
   * Fetch Upbit tickers for all supported KRW pairs in a single request
   */
  async fetchUpbitTickers(): Promise<Map<string, UpbitTickerItem>> {
    const markets = CRYPTO_COINS.map(c => c.upbitMarket).join(',');
    const url = `https://api.upbit.com/v1/ticker?markets=${markets}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ByeongdolInvestment/1.0 (Public Quote Client)',
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Upbit API returned HTTP ${res.status}`);
    }

    const list: UpbitTickerItem[] = await res.json();
    const map = new Map<string, UpbitTickerItem>();
    list.forEach(item => map.set(item.market, item));
    return map;
  }

  /**
   * Fetch Binance USD reference prices
   */
  async fetchBinanceTickers(): Promise<Map<string, BinanceTickerItem>> {
    try {
      const symbolsParam = encodeURIComponent(JSON.stringify(CRYPTO_COINS.map(c => c.binanceSymbol)));
      const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=${symbolsParam}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ByeongdolInvestment/1.0',
        },
      });
      clearTimeout(timeoutId);

      if (!res.ok) return new Map();

      const list: BinanceTickerItem[] = await res.json();
      const map = new Map<string, BinanceTickerItem>();
      list.forEach(item => map.set(item.symbol, item));
      return map;
    } catch {
      return new Map();
    }
  }

  /**
   * Get unified crypto items
   */
  async getCryptoItems(): Promise<UnifiedFinancialItem[]> {
    const nowStr = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) + ' (KST)';

    try {
      const [upbitMap, binanceMap] = await Promise.all([
        this.fetchUpbitTickers(),
        this.fetchBinanceTickers(),
      ]);

      return CRYPTO_COINS.map(coin => {
        const upbit = upbitMap.get(coin.upbitMarket);
        const binance = binanceMap.get(coin.binanceSymbol);

        if (!upbit) {
          return {
            id: `crypto_${coin.symbol.toLowerCase()}`,
            category: 'crypto',
            assetType: 'crypto',
            name: coin.name,
            symbol: coin.symbol,
            value: 0,
            change: 0,
            changePercent: 0,
            currency: 'KRW',
            unit: '원',
            provider: '업비트 (Upbit) 공개 호가창 API',
            delayStatus: 'realtime',
            delayLabel: '실시간 (Upbit)',
            isRealtime: true,
            lastUpdated: nowStr,
            status: 'unavailable',
            errorMessage: '호가 데이터를 수신하지 못했습니다.',
          };
        }

        const price = upbit.trade_price;
        const change = upbit.signed_change_price;
        const changePercent = Number((upbit.signed_change_rate * 100).toFixed(2));
        const prevClose = upbit.prev_closing_price;
        const high = upbit.high_price;
        const low = upbit.low_price;
        const tradingValue = Math.round(upbit.acc_trade_price_24h / 100000000); // 억 원 단위

        // Note global USD price if available
        let usdNote = '';
        if (binance) {
          const usdPrice = parseFloat(binance.lastPrice);
          usdNote = `글로벌(Binance): $${usdPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
        }

        return {
          id: `crypto_${coin.symbol.toLowerCase()}`,
          category: 'crypto',
          assetType: 'crypto',
          name: coin.name,
          symbol: coin.symbol,
          value: price,
          displayValue: `${price.toLocaleString()}원`,
          change,
          changePercent,
          currency: 'KRW',
          unit: '원',
          high,
          low,
          prevClose,
          tradingValue,
          volume: upbit.acc_trade_volume_24h,
          sparkline: [prevClose, low, high, price],
          provider: '업비트 (Upbit) 공개 시세 API',
          delayStatus: 'realtime',
          delayLabel: '실시간 (KRW)',
          isRealtime: true,
          marketSession: 'OPEN', // Crypto markets 24/7
          lastUpdated: nowStr,
          status: 'ok',
          notes: usdNote,
          license: '업비트 공개 시세 API 이용약관 준수 (비상업적 정보제공)',
        };
      });
    } catch (err: any) {
      console.warn('[CryptoDataProvider] Failed to fetch crypto quotes:', err.message);
      return [];
    }
  }
}

export const cryptoDataProvider = new CryptoDataProvider();
