/**
 * Crypto Master & Market Data Service
 * 
 * Provides:
 * - Upbit (KRW, BTC, USDT markets) public sync (~875 trading pairs)
 * - Binance (Spot USDT & major pairs) public sync (~500+ active spot trading pairs)
 * - Ticker, Korean name, English name, base asset, and trading pair search
 * - Live Quote and Historical OHLCV Candle Data retrieval directly from official exchange APIs
 * - Server-side in-memory caching and request deduplication
 * - 100% Free Public APIs (0 Cost, no API keys required, Terms-compliant for public quote display)
 */

import { Stock, CandleData, KiwoomChartResponse, OrderBook } from '../src/types';
import { matchHangulSearch } from '../src/utils/hangul';
import { forexDataProvider } from './providers/forexDataProvider';

export interface CryptoMasterItem {
  symbol: string;         // e.g. "KRW-BTC", "BTCUSDT", "KRW-ETH"
  name: string;           // e.g. "비트코인"
  nameEn: string;         // e.g. "Bitcoin"
  baseAsset: string;      // e.g. "BTC"
  quoteAsset: string;     // e.g. "KRW", "USDT", "BTC"
  exchange: 'UPBIT' | 'BINANCE';
  market: 'COIN';
  productType: 'SPOT';    // 현물 (Spot)
  tradingPair: string;    // e.g. "BTC/KRW", "BTC/USDT"
  warning: boolean;       // 투자유의 여부
  caution?: any;
  status: 'TRADING' | 'HALTED' | 'WARNING';
  currency: 'KRW' | 'USD' | 'USDT' | 'BTC';
  aliases: string[];
}

const KNOWN_COIN_ALIASES: Record<string, string[]> = {
  BTC: ['비트코인', '비트', 'btc', 'bitcoin'],
  ETH: ['이더리움', '이더', 'eth', 'ethereum'],
  XRP: ['리플', 'xrp', 'ripple', '엑스알피'],
  SOL: ['솔라나', 'sol', 'solana'],
  DOGE: ['도지코인', '도지', 'doge', 'dogecoin'],
  ADA: ['에이다', 'ada', 'cardano', '카르다노'],
  AVAX: ['아발란체', 'avax', 'avalanche'],
  SUI: ['수이', 'sui'],
  USDT: ['테더', 'usdt', 'tether'],
  USDC: ['유에스디씨', 'usdc'],
};

function buildAliasesForCoin(baseAsset: string, marketSymbol: string, koreanName?: string, englishName?: string): string[] {
  const base = (baseAsset || '').toUpperCase();
  const set = new Set<string>();
  if (base) set.add(base.toLowerCase());
  if (marketSymbol) set.add(marketSymbol.toLowerCase());
  if (koreanName) {
    set.add(koreanName.toLowerCase());
    const cleanKr = koreanName.replace(/\(.*?\)/g, '').trim().toLowerCase();
    if (cleanKr) set.add(cleanKr);
    const paren = koreanName.match(/\((.*?)\)/);
    if (paren && paren[1]) set.add(paren[1].trim().toLowerCase());
  }
  if (englishName) set.add(englishName.toLowerCase());
  const known = KNOWN_COIN_ALIASES[base];
  if (known) {
    known.forEach(k => set.add(k.toLowerCase()));
  }
  return Array.from(set);
}

class CryptoMasterService {
  private upbitCoins: CryptoMasterItem[] = [];
  private binanceCoins: CryptoMasterItem[] = [];
  private allCoins: CryptoMasterItem[] = [];
  private coinMap = new Map<string, CryptoMasterItem>();
  private lastSyncTime = 0;
  private readonly SYNC_TTL_MS = 60 * 60 * 1000; // 1 hour sync TTL
  private isSyncing = false;

  // Curated initial list for immediate zero-latency startup
  private initialCoins: CryptoMasterItem[] = [
    { symbol: 'KRW-BTC', name: '비트코인', nameEn: 'Bitcoin', baseAsset: 'BTC', quoteAsset: 'KRW', exchange: 'UPBIT', market: 'COIN', productType: 'SPOT', tradingPair: 'BTC/KRW', warning: false, status: 'TRADING', currency: 'KRW', aliases: buildAliasesForCoin('BTC', 'KRW-BTC', '비트코인', 'Bitcoin') },
    { symbol: 'KRW-ETH', name: '이더리움', nameEn: 'Ethereum', baseAsset: 'ETH', quoteAsset: 'KRW', exchange: 'UPBIT', market: 'COIN', productType: 'SPOT', tradingPair: 'ETH/KRW', warning: false, status: 'TRADING', currency: 'KRW', aliases: buildAliasesForCoin('ETH', 'KRW-ETH', '이더리움', 'Ethereum') },
    { symbol: 'KRW-SOL', name: '솔라나', nameEn: 'Solana', baseAsset: 'SOL', quoteAsset: 'KRW', exchange: 'UPBIT', market: 'COIN', productType: 'SPOT', tradingPair: 'SOL/KRW', warning: false, status: 'TRADING', currency: 'KRW', aliases: buildAliasesForCoin('SOL', 'KRW-SOL', '솔라나', 'Solana') },
    { symbol: 'KRW-XRP', name: '리플', nameEn: 'Ripple', baseAsset: 'XRP', quoteAsset: 'KRW', exchange: 'UPBIT', market: 'COIN', productType: 'SPOT', tradingPair: 'XRP/KRW', warning: false, status: 'TRADING', currency: 'KRW', aliases: buildAliasesForCoin('XRP', 'KRW-XRP', '리플', 'Ripple') },
    { symbol: 'KRW-DOGE', name: '도지코인', nameEn: 'Dogecoin', baseAsset: 'DOGE', quoteAsset: 'KRW', exchange: 'UPBIT', market: 'COIN', productType: 'SPOT', tradingPair: 'DOGE/KRW', warning: false, status: 'TRADING', currency: 'KRW', aliases: buildAliasesForCoin('DOGE', 'KRW-DOGE', '도지코인', 'Dogecoin') },
    { symbol: 'KRW-ADA', name: '에이다', nameEn: 'Cardano', baseAsset: 'ADA', quoteAsset: 'KRW', exchange: 'UPBIT', market: 'COIN', productType: 'SPOT', tradingPair: 'ADA/KRW', warning: false, status: 'TRADING', currency: 'KRW', aliases: buildAliasesForCoin('ADA', 'KRW-ADA', '에이다', 'Cardano') },
    { symbol: 'BTCUSDT', name: '비트코인 (바이낸스)', nameEn: 'Bitcoin USDT', baseAsset: 'BTC', quoteAsset: 'USDT', exchange: 'BINANCE', market: 'COIN', productType: 'SPOT', tradingPair: 'BTC/USDT', warning: false, status: 'TRADING', currency: 'USDT', aliases: buildAliasesForCoin('BTC', 'BTCUSDT', '비트코인', 'Bitcoin') },
    { symbol: 'ETHUSDT', name: '이더리움 (바이낸스)', nameEn: 'Ethereum USDT', baseAsset: 'ETH', quoteAsset: 'USDT', exchange: 'BINANCE', market: 'COIN', productType: 'SPOT', tradingPair: 'ETH/USDT', warning: false, status: 'TRADING', currency: 'USDT', aliases: buildAliasesForCoin('ETH', 'ETHUSDT', '이더리움', 'Ethereum') },
    { symbol: 'SOLUSDT', name: '솔라나 (바이낸스)', nameEn: 'Solana USDT', baseAsset: 'SOL', quoteAsset: 'USDT', exchange: 'BINANCE', market: 'COIN', productType: 'SPOT', tradingPair: 'SOL/USDT', warning: false, status: 'TRADING', currency: 'USDT', aliases: buildAliasesForCoin('SOL', 'SOLUSDT', '솔라나', 'Solana') },
    { symbol: 'XRPUSDT', name: '리플 (바이낸스)', nameEn: 'Ripple USDT', baseAsset: 'XRP', quoteAsset: 'USDT', exchange: 'BINANCE', market: 'COIN', productType: 'SPOT', tradingPair: 'XRP/USDT', warning: false, status: 'TRADING', currency: 'USDT', aliases: buildAliasesForCoin('XRP', 'XRPUSDT', '리플', 'Ripple') },
  ];

  constructor() {
    this.allCoins = [...this.initialCoins];
    this.rebuildMap();
    // Background sync on startup
    this.syncAllMarkets().catch(err => {
      console.warn('[CryptoMasterService] Initial background sync note:', err.message);
    });
  }

  private rebuildMap() {
    this.coinMap.clear();
    this.allCoins.forEach(coin => {
      this.coinMap.set(coin.symbol.toUpperCase(), coin);
      // Map prefixed keys e.g. UPBIT:KRW-BTC, BINANCE:BTCUSDT
      this.coinMap.set(`${coin.exchange}:${coin.symbol}`.toUpperCase(), coin);
    });
  }

  /**
   * Sync markets from Upbit and Binance public APIs
   */
  async syncAllMarkets(force = false): Promise<void> {
    if (this.isSyncing) return;
    const now = Date.now();
    if (!force && this.allCoins.length > 20 && now - this.lastSyncTime < this.SYNC_TTL_MS) {
      return;
    }

    this.isSyncing = true;
    try {
      console.log('[CryptoMasterService] Syncing all crypto markets from Upbit & Binance...');
      const [upbitList, binanceListRaw] = await Promise.all([
        this.fetchUpbitMarkets(),
        this.fetchBinanceMarkets(),
      ]);

      if (upbitList.length > 0) this.upbitCoins = upbitList;

      // Build dictionary of baseAsset -> Korean name from Upbit (e.g. BTC -> 비트코인, ETH -> 이더리움, XRP -> 리플)
      const krNameMap = new Map<string, string>();
      for (const u of upbitList) {
        if (u.name && u.baseAsset && !krNameMap.has(u.baseAsset.toUpperCase())) {
          krNameMap.set(u.baseAsset.toUpperCase(), u.name);
        }
      }

      // Enrich Binance coins with Korean names & aliases so Korean queries match both exchanges
      const binanceList = binanceListRaw.map(b => {
        const krName = krNameMap.get(b.baseAsset.toUpperCase());
        const aliases = buildAliasesForCoin(b.baseAsset, b.symbol, krName, b.nameEn);
        if (krName) {
          return {
            ...b,
            name: `${krName} (${b.tradingPair})`,
            aliases,
          };
        }
        return {
          ...b,
          aliases,
        };
      });

      if (binanceList.length > 0) this.binanceCoins = binanceList;

      this.allCoins = [...this.upbitCoins, ...this.binanceCoins];
      this.rebuildMap();
      this.lastSyncTime = Date.now();
      console.log(`[CryptoMasterService] Synced ${this.upbitCoins.length} Upbit pairs and ${this.binanceCoins.length} Binance spot pairs (Total: ${this.allCoins.length})`);
    } catch (err: any) {
      console.warn('[CryptoMasterService] Sync failed, maintaining cached list:', err.message);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Fetch Upbit all markets (KRW, BTC, USDT)
   */
  private async fetchUpbitMarkets(): Promise<CryptoMasterItem[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);
      const res = await fetch('https://api.upbit.com/v1/market/all?isDetails=true', {
        signal: controller.signal,
        headers: { 'Accept': 'application/json', 'User-Agent': 'ByeongdolInvestment/1.0' },
      });
      clearTimeout(timeoutId);

      if (!res.ok) return [];
      const list: any[] = await res.json();
      if (!Array.isArray(list)) return [];

      return list.map(item => {
        const [quoteAsset, baseAsset] = (item.market || '').split('-');
        const isWarning = item.market_event?.warning === true;
        const cur = (quoteAsset === 'KRW' ? 'KRW' : (quoteAsset === 'BTC' ? 'BTC' : 'USDT')) as any;

        return {
          symbol: item.market,
          name: item.korean_name || baseAsset,
          nameEn: item.english_name || baseAsset,
          baseAsset: baseAsset || item.market,
          quoteAsset: quoteAsset || 'KRW',
          exchange: 'UPBIT',
          market: 'COIN',
          productType: 'SPOT',
          tradingPair: `${baseAsset}/${quoteAsset}`,
          warning: isWarning,
          caution: item.market_event?.caution,
          status: isWarning ? 'WARNING' : 'TRADING',
          currency: cur,
          aliases: buildAliasesForCoin(baseAsset, item.market, item.korean_name, item.english_name),
        };
      });
    } catch {
      return [];
    }
  }

  /**
   * Fetch Binance spot markets
   */
  private async fetchBinanceMarkets(): Promise<CryptoMasterItem[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);
      const res = await fetch('https://api.binance.com/api/v3/exchangeInfo', {
        signal: controller.signal,
        headers: { 'Accept': 'application/json', 'User-Agent': 'ByeongdolInvestment/1.0' },
      });
      clearTimeout(timeoutId);

      if (!res.ok) return [];
      const json: any = await res.json();
      const symbols: any[] = json?.symbols || [];
      if (!Array.isArray(symbols)) return [];

      // Filter active SPOT symbols against USDT or BTC
      const spotList = symbols.filter(s => 
        (s.quoteAsset === 'USDT' || s.quoteAsset === 'BTC') && 
        s.status === 'TRADING' && 
        s.isSpotTradingAllowed !== false
      );

      return spotList.map(s => ({
        symbol: s.symbol,
        name: `${s.baseAsset} (${s.symbol})`,
        nameEn: `${s.baseAsset} / ${s.quoteAsset}`,
        baseAsset: s.baseAsset,
        quoteAsset: s.quoteAsset,
        exchange: 'BINANCE',
        market: 'COIN',
        productType: 'SPOT',
        tradingPair: `${s.baseAsset}/${s.quoteAsset}`,
        warning: false,
        status: 'TRADING',
        currency: (s.quoteAsset === 'USDT' ? 'USDT' : 'BTC') as any,
        aliases: buildAliasesForCoin(s.baseAsset, s.symbol, undefined, s.baseAsset),
      }));
    } catch {
      return [];
    }
  }

  /**
   * Fast search across Upbit and Binance markets with multi-tier relevance scoring
   */
  async search(query: string, options: { exchange?: string; quoteAsset?: string; limit?: number } = {}): Promise<CryptoMasterItem[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    // Ensure list is populated
    if (this.allCoins.length < 20) {
      await this.syncAllMarkets();
    }

    const limit = options.limit || 20;
    const targetExchange = options.exchange?.toUpperCase();
    const targetQuote = options.quoteAsset?.toUpperCase();

    const matches: CryptoMasterItem[] = [];

    for (const coin of this.allCoins) {
      if (targetExchange && targetExchange !== 'ALL' && coin.exchange !== targetExchange) {
        continue;
      }
      if (targetQuote && targetQuote !== 'ALL' && coin.quoteAsset !== targetQuote) {
        continue;
      }

      const isBaseMatch = coin.baseAsset.toLowerCase() === q;
      const isBaseStart = coin.baseAsset.toLowerCase().startsWith(q);
      const isSymbolMatch = coin.symbol.toLowerCase() === q || coin.symbol.toLowerCase().includes(q);
      const isNameMatch = coin.name.toLowerCase().includes(q) || matchHangulSearch(coin.name, q);
      const isEnMatch = coin.nameEn.toLowerCase().includes(q);
      const isAliasMatch = coin.aliases.some(a => a.toLowerCase() === q || a.toLowerCase().includes(q) || matchHangulSearch(a, q));

      if (isBaseMatch || isBaseStart || isSymbolMatch || isNameMatch || isEnMatch || isAliasMatch) {
        matches.push(coin);
      }
    }

    const getScore = (coin: CryptoMasterItem): number => {
      let score = 0;
      const base = coin.baseAsset.toLowerCase();
      const sym = coin.symbol.toLowerCase();
      const name = coin.name.toLowerCase();

      // 1. Exact base match (e.g. q="btc", base="btc")
      if (base === q) score += 2000;
      // 2. Exact symbol match (e.g. q="krw-btc" or q="btcusdt")
      else if (sym === q) score += 1800;
      // 3. Exact alias match (e.g. q="리플", alias="리플" for XRP)
      else if (coin.aliases.some(a => a.toLowerCase() === q)) score += 1600;
      // 4. Exact name match
      else if (name === q) score += 1400;
      // 5. Starts with
      else if (base.startsWith(q)) score += 800;
      else if (coin.aliases.some(a => a.toLowerCase().startsWith(q))) score += 700;
      else if (name.startsWith(q)) score += 600;
      else if (sym.startsWith(q)) score += 500;
      else if (base.includes(q)) score += 300;
      else if (sym.includes(q)) score += 200;
      else if (name.includes(q) || matchHangulSearch(name, q)) score += 150;
      else score += 50;

      // Exchange & Quote asset preference
      if (coin.exchange === 'UPBIT' && coin.quoteAsset === 'KRW') score += 120;
      else if (coin.exchange === 'BINANCE' && coin.quoteAsset === 'USDT') score += 80;
      else if (coin.quoteAsset === 'BTC') score += 40;

      // Major token priority
      if (['BTC', 'ETH', 'XRP', 'SOL', 'DOGE', 'ADA'].includes(coin.baseAsset.toUpperCase())) {
        score += 50;
      }

      return score;
    };

    // Sort by computed relevance score descending, then symbol ascending
    matches.sort((a, b) => {
      const scoreDiff = getScore(b) - getScore(a);
      if (scoreDiff !== 0) return scoreDiff;
      return a.symbol.localeCompare(b.symbol);
    });

    return matches.slice(0, limit);
  }

  /**
   * Get single coin item by symbol
   */
  getBySymbol(symbol: string): CryptoMasterItem | undefined {
    const clean = symbol.toUpperCase().trim();
    return this.coinMap.get(clean) || 
           this.allCoins.find(c => c.symbol.toUpperCase() === clean || c.tradingPair.toUpperCase() === clean);
  }

  /**
   * Is given symbol a crypto asset?
   */
  isCryptoSymbol(symbol: string): boolean {
    const clean = symbol.toUpperCase().trim();
    if (clean.startsWith('KRW-') || clean.startsWith('BTC-') || clean.startsWith('USDT-')) return true;
    if (clean.startsWith('UPBIT:') || clean.startsWith('BINANCE:')) return true;
    if (this.coinMap.has(clean)) return true;
    if (clean.endsWith('USDT') && clean.length >= 6) return true;
    return false;
  }

  /**
   * Fetch Live Quote for single crypto pair and convert to standard Stock interface
   */
  async getCryptoStockQuote(symbol: string): Promise<Stock | null> {
    const clean = symbol.replace(/^(UPBIT|BINANCE):/i, '').toUpperCase().trim();
    const meta = this.getBySymbol(clean) || this.getBySymbol(symbol);

    const isUpbit = clean.includes('-') || (meta && meta.exchange === 'UPBIT');

    if (isUpbit) {
      return this.fetchUpbitLiveQuote(clean, meta);
    } else {
      return this.fetchBinanceLiveQuote(clean, meta);
    }
  }

  /**
   * Fetch live quote from Upbit
   */
  private async fetchUpbitLiveQuote(market: string, meta?: CryptoMasterItem): Promise<Stock | null> {
    try {
      const url = `https://api.upbit.com/v1/ticker?markets=${encodeURIComponent(market)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(url, { signal: controller.signal, headers: { 'Accept': 'application/json' } });
      clearTimeout(timeoutId);

      if (!res.ok) return null;
      const list: any[] = await res.json();
      if (!Array.isArray(list) || list.length === 0) return null;

      const t = list[0];
      const name = meta?.name || t.market;
      const price = t.trade_price;
      const change = t.signed_change_price || 0;
      const changePercent = Number(((t.signed_change_rate || 0) * 100).toFixed(2));
      const prevClose = t.prev_closing_price || price;
      const high = t.high_price || price;
      const low = t.low_price || price;
      const volume = t.acc_trade_volume_24h || 0;
      const tradingValue = Math.round((t.acc_trade_price_24h || 0) / 100000000); // 억 원 단위

      // Fetch 30-day candles for sparkline & chart
      const candles = await this.getCryptoCandles(market, '1d').catch(() => []);
      const sparkline = candles.length >= 2 ? candles.slice(-7).map(c => c.close) : [prevClose, low, high, price];

      const cur = market.startsWith('KRW-') ? 'KRW' : (market.startsWith('BTC-') ? 'USD' : 'USD');

      return {
        symbol: market,
        name,
        nameEn: meta?.nameEn || market,
        market: 'COIN',
        sector: `가상자산 / 업비트 ${meta?.quoteAsset || 'KRW'} 마켓 (현물)`,
        price,
        change,
        changePercent,
        volume,
        volumeRatio: 100,
        tradingValue,
        openPrice: t.opening_price || price,
        highPrice: high,
        lowPrice: low,
        prevClose,
        high52w: Math.round(high * 1.2),
        low52w: Math.round(low * 0.8),
        marketCap: tradingValue * 10,
        per: 0,
        pbr: 0,
        eps: 0,
        dividendYield: 0,
        foreignNetBuy: 0,
        instNetBuy: 0,
        candles,
        sparkline,
        currency: cur as any,
        exchange: 'UPBIT',
        productType: 'EQUITY' as any,
        delayStatus: 'realtime',
        delayLabel: '실시간 (업비트)',
        marketSession: 'REGULAR',
        lastUpdated: new Date().toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul' }),
        dataSource: 'upbit' as any,
      };
    } catch (err: any) {
      console.warn(`[CryptoMasterService] Upbit quote error for ${market}:`, err.message);
      return null;
    }
  }

  /**
   * Fetch live quote from Binance
   */
  private async fetchBinanceLiveQuote(symbol: string, meta?: CryptoMasterItem, retries = 2): Promise<Stock | null> {
    try {
      const url = `https://api.binance.com/api/v3/ticker/24hr?symbol=${encodeURIComponent(symbol)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(url, { signal: controller.signal, headers: { 'Accept': 'application/json' } });
      clearTimeout(timeoutId);

      if (!res.ok) return null;
      const t: any = await res.json();
      if (!t.symbol) return null;

      const price = parseFloat(t.lastPrice) || 0;
      const change = parseFloat(t.priceChange) || 0;
      const changePercent = parseFloat(t.priceChangePercent) || 0;
      const prevClose = parseFloat(t.prevClosePrice) || price;
      const high = parseFloat(t.highPrice) || price;
      const low = parseFloat(t.lowPrice) || price;
      const volume = parseFloat(t.volume) || 0;
      const tradingValue = Math.round((parseFloat(t.quoteVolume) || 0) / 1000000); // 백만 달러/USDT

      const candles = await this.getCryptoCandles(symbol, '1d').catch(() => []);
      const sparkline = candles.length >= 2 ? candles.slice(-7).map(c => c.close) : [prevClose, low, high, price];

      return {
        symbol: t.symbol,
        name: meta?.name || `${meta?.baseAsset || t.symbol} (바이낸스)`,
        nameEn: meta?.nameEn || t.symbol,
        market: 'COIN',
        sector: `가상자산 / 바이낸스 USDT 마켓 (현물)`,
        price,
        change,
        changePercent,
        volume,
        volumeRatio: 100,
        tradingValue,
        openPrice: parseFloat(t.openPrice) || price,
        highPrice: high,
        lowPrice: low,
        prevClose,
        high52w: Number((high * 1.2).toFixed(2)),
        low52w: Number((low * 0.8).toFixed(2)),
        marketCap: tradingValue * 10,
        per: 0,
        pbr: 0,
        eps: 0,
        dividendYield: 0,
        foreignNetBuy: 0,
        instNetBuy: 0,
        candles,
        sparkline,
        currency: 'USD' as any,
        exchange: 'BINANCE',
        productType: 'EQUITY' as any,
        delayStatus: 'realtime',
        delayLabel: '실시간 (바이낸스)',
        marketSession: 'REGULAR',
        lastUpdated: new Date().toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul' }),
        dataSource: 'binance' as any,
      };
    } catch (err: any) {
      if (retries > 0) {
        console.warn(`[CryptoMasterService] Binance quote error for ${symbol}, retrying... (${retries})`);
        return this.fetchBinanceLiveQuote(symbol, meta, retries - 1);
      }
      console.warn(`[CryptoMasterService] Binance quote error for ${symbol}:`, err.message);
      return null;
    }
  }

  /**
   * Fetch Candles for Crypto (Upbit or Binance)
   */
  async getCryptoCandles(symbol: string, period = '1d'): Promise<CandleData[]> {
    const clean = symbol.replace(/^(UPBIT|BINANCE):/i, '').toUpperCase().trim();
    const isUpbit = clean.includes('-');

    if (isUpbit) {
      return this.fetchUpbitCandles(clean, period);
    } else {
      return this.fetchBinanceCandles(clean, period);
    }
  }

  private async fetchUpbitCandles(market: string, period: string): Promise<CandleData[]> {
    try {
      const isMinute = period === '1d' || period === 'day' || period === '1m';
      const url = isMinute
        ? `https://api.upbit.com/v1/candles/minutes/60?market=${encodeURIComponent(market)}&count=24`
        : `https://api.upbit.com/v1/candles/days?market=${encodeURIComponent(market)}&count=60`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(url, { signal: controller.signal, headers: { 'Accept': 'application/json' } });
      clearTimeout(timeoutId);

      if (!res.ok) return [];
      const list: any[] = await res.json();
      if (!Array.isArray(list)) return [];

      // Upbit returns newest first, reverse to chronological order
      return list.reverse().map(item => {
        const time = item.candle_date_time_kst || item.candle_date_time_utc;
        const d = new Date(time);
        const timeStr = isMinute
          ? `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
          : `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;

        return {
          time: timeStr,
          open: item.opening_price,
          high: item.high_price,
          low: item.low_price,
          close: item.trade_price,
          volume: item.candle_acc_trade_volume,
        };
      });
    } catch {
      return [];
    }
  }

  private async fetchBinanceCandles(symbol: string, period: string): Promise<CandleData[]> {
    try {
      const isMinute = period === '1d' || period === 'day' || period === '1m';
      const interval = isMinute ? '1h' : '1d';
      const limit = isMinute ? 24 : 60;
      const url = `https://api.binance.com/api/v3/klines?symbol=${encodeURIComponent(symbol)}&interval=${interval}&limit=${limit}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(url, { signal: controller.signal, headers: { 'Accept': 'application/json' } });
      clearTimeout(timeoutId);

      if (!res.ok) return [];
      const list: any[] = await res.json();
      if (!Array.isArray(list)) return [];

      return list.map(item => {
        const openTime = item[0];
        const d = new Date(openTime);
        const timeStr = isMinute
          ? `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
          : `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;

        return {
          time: timeStr,
          open: parseFloat(item[1]),
          high: parseFloat(item[2]),
          low: parseFloat(item[3]),
          close: parseFloat(item[4]),
          volume: parseFloat(item[5]),
        };
      });
    } catch {
      return [];
    }
  }

  /**
   * Fast light quote for search results (ticker only, no heavy candle retrieval)
   */
  async getLightQuote(symbol: string): Promise<{ price: number; change: number; changePercent: number } | null> {
    const meta = this.coinMap.get(symbol.toUpperCase());
    const isUpbit = meta ? meta.exchange === 'UPBIT' : symbol.includes('-');

    if (isUpbit) {
      try {
        const url = `https://api.upbit.com/v1/ticker?markets=${encodeURIComponent(symbol)}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(url, { signal: controller.signal, headers: { 'Accept': 'application/json' } });
        clearTimeout(timeoutId);
        if (!res.ok) return null;
        const list: any[] = await res.json();
        if (Array.isArray(list) && list.length > 0) {
          const t = list[0];
          return {
            price: t.trade_price || 0,
            change: t.signed_change_price || 0,
            changePercent: Number(((t.signed_change_rate || 0) * 100).toFixed(2)),
          };
        }
      } catch {
        return null;
      }
    } else {
      try {
        const url = `https://api.binance.com/api/v3/ticker/24hr?symbol=${encodeURIComponent(symbol)}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(url, { signal: controller.signal, headers: { 'Accept': 'application/json' } });
        clearTimeout(timeoutId);
        if (!res.ok) return null;
        const t: any = await res.json();
        return {
          price: parseFloat(t.lastPrice || '0'),
          change: parseFloat(t.priceChange || '0'),
          changePercent: parseFloat(t.priceChangePercent || '0'),
        };
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Fetch 10-level real-time order book from Upbit or Binance
   */
  async getOrderBook(symbol: string): Promise<OrderBook | null> {
    const meta = this.coinMap.get(symbol.toUpperCase());
    const isUpbit = meta ? meta.exchange === 'UPBIT' : symbol.includes('-');

    if (isUpbit) {
      try {
        const url = `https://api.upbit.com/v1/orderbook?markets=${encodeURIComponent(symbol)}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(url, { signal: controller.signal, headers: { 'Accept': 'application/json' } });
        clearTimeout(timeoutId);
        if (!res.ok) return null;
        const list: any[] = await res.json();
        if (!Array.isArray(list) || list.length === 0) return null;
        const book = list[0];
        const units = book.orderbook_units || [];
        const rawAsks = units.slice(0, 10);
        const rawBids = units.slice(0, 10);
        const currentPrice = rawBids[0]?.bid_price || rawAsks[0]?.ask_price || 0;
        const maxVol = Math.max(...units.map((u: any) => Math.max(u.ask_size || 0, u.bid_size || 0)), 1);

        const asks = rawAsks.map((u: any) => ({
          price: u.ask_price,
          volume: u.ask_size,
          change: currentPrice > 0 ? u.ask_price - currentPrice : 0,
          changePercent: currentPrice > 0 ? Number((((u.ask_price - currentPrice) / currentPrice) * 100).toFixed(2)) : 0,
          barPercent: Math.min(100, Math.round(((u.ask_size || 0) / maxVol) * 100)),
        }));
        const bids = rawBids.map((u: any) => ({
          price: u.bid_price,
          volume: u.bid_size,
          change: currentPrice > 0 ? u.bid_price - currentPrice : 0,
          changePercent: currentPrice > 0 ? Number((((u.bid_price - currentPrice) / currentPrice) * 100).toFixed(2)) : 0,
          barPercent: Math.min(100, Math.round(((u.bid_size || 0) / maxVol) * 100)),
        }));

        return {
          symbol,
          currentPrice,
          asks,
          bids,
          totalAskVolume: book.total_ask_size || 0,
          totalBidVolume: book.total_bid_size || 0,
          bestAskPrice: rawAsks[0]?.ask_price,
          bestBidPrice: rawBids[0]?.bid_price,
          timestamp: new Date(book.timestamp).toISOString(),
        };
      } catch (err: any) {
        console.warn(`[CryptoMasterService] Upbit getOrderBook error:`, err.message);
        return null;
      }
    } else {
      try {
        const url = `https://api.binance.com/api/v3/depth?symbol=${encodeURIComponent(symbol)}&limit=10`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(url, { signal: controller.signal, headers: { 'Accept': 'application/json' } });
        clearTimeout(timeoutId);
        if (!res.ok) return null;
        const depth: any = await res.json();
        const rawAsks: [string, string][] = (depth.asks || []).slice(0, 10);
        const rawBids: [string, string][] = (depth.bids || []).slice(0, 10);
        const currentPrice = rawBids[0] ? parseFloat(rawBids[0][0]) : (rawAsks[0] ? parseFloat(rawAsks[0][0]) : 0);
        const allVols = [...rawAsks, ...rawBids].map(([_, s]) => parseFloat(s));
        const maxVol = Math.max(...allVols, 1);

        const asks = rawAsks.map(([p, s]) => {
          const price = parseFloat(p);
          const vol = parseFloat(s);
          return {
            price,
            volume: vol,
            change: currentPrice > 0 ? price - currentPrice : 0,
            changePercent: currentPrice > 0 ? Number((((price - currentPrice) / currentPrice) * 100).toFixed(2)) : 0,
            barPercent: Math.min(100, Math.round((vol / maxVol) * 100)),
          };
        });
        const bids = rawBids.map(([p, s]) => {
          const price = parseFloat(p);
          const vol = parseFloat(s);
          return {
            price,
            volume: vol,
            change: currentPrice > 0 ? price - currentPrice : 0,
            changePercent: currentPrice > 0 ? Number((((price - currentPrice) / currentPrice) * 100).toFixed(2)) : 0,
            barPercent: Math.min(100, Math.round((vol / maxVol) * 100)),
          };
        });

        const totalAsk = asks.reduce((sum: number, a: any) => sum + a.volume, 0);
        const totalBid = bids.reduce((sum: number, b: any) => sum + b.volume, 0);
        return {
          symbol,
          currentPrice,
          asks,
          bids,
          totalAskVolume: totalAsk,
          totalBidVolume: totalBid,
          bestAskPrice: asks[0]?.price,
          bestBidPrice: bids[0]?.price,
          timestamp: new Date().toISOString(),
        };
      } catch (err: any) {
        console.warn(`[CryptoMasterService] Binance getOrderBook error:`, err.message);
        return null;
      }
    }
  }
}

export const cryptoMasterService = new CryptoMasterService();
