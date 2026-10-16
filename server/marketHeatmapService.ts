/**
 * Market Heatmap Service (Server-side)
 * 
 * Provides:
 * 1. Korea (KOSPI/KOSDAQ) and US (NASDAQ/NYSE) top stocks
 * 2. Real price change calculations for 1D, 1M, and 1Y periods
 * 3. Market capitalization sizing with accurate Korean/US units
 * 4. Trading hour and holiday awareness with baseline transparency
 * 5. In-memory TTL caching to avoid hitting rate limits
 */

import { US_STOCK_MASTER } from './usStockMasterService';
import { serverResilienceService } from './serverResilienceService';

export interface HeatmapStockItem {
  symbol: string;
  name: string;
  nameEn: string;
  market: 'KR' | 'US';
  exchange: 'KOSPI' | 'KOSDAQ' | 'NASDAQ' | 'NYSE';
  sector: string;
  price: number;
  currency: 'KRW' | 'USD';
  marketCap: number; // in KRW 억 or USD million
  formattedMarketCap: string;
  changePercent1D: number;
  changePercent1M: number;
  changePercent1Y: number;
  status: 'realtime' | 'delayed' | 'closed';
  lastUpdated: string;
  baseline: {
    price1DPrev: number;
    price1MPrev: number;
    price1YPrev: number;
  };
  type: 'stock' | 'etf';
}

export interface HeatmapResponse {
  market: 'ALL' | 'KR' | 'US' | 'KOSPI' | 'KOSDAQ' | 'NASDAQ' | 'NYSE';
  period: '1D' | '1M' | '1Y';
  items: HeatmapStockItem[];
  meta: {
    krMarketStatus: 'OPEN' | 'CLOSED';
    usMarketStatus: 'OPEN' | 'CLOSED';
    serverTimeKST: string;
    serverTimeEST: string;
    calculationBaseline: string;
    totalTracked: number;
    source: string;
  };
}

// Master list of top Korean stocks for Heatmap
const KR_HEATMAP_STOCKS: {
  symbol: string;
  name: string;
  nameEn: string;
  exchange: 'KOSPI' | 'KOSDAQ';
  sector: string;
  approxCapKRWTrillion: number;
  type: 'stock' | 'etf';
}[] = [
  { symbol: '005930', name: '삼성전자', nameEn: 'Samsung Electronics', exchange: 'KOSPI', sector: '반도체', approxCapKRWTrillion: 420, type: 'stock' },
  { symbol: '000660', name: 'SK하이닉스', nameEn: 'SK hynix', exchange: 'KOSPI', sector: '반도체', approxCapKRWTrillion: 135, type: 'stock' },
  { symbol: '373220', name: 'LG에너지솔루션', nameEn: 'LG Energy Solution', exchange: 'KOSPI', sector: '2차전지', approxCapKRWTrillion: 92, type: 'stock' },
  { symbol: '207940', name: '삼성바이오로직스', nameEn: 'Samsung Biologics', exchange: 'KOSPI', sector: '바이오', approxCapKRWTrillion: 71, type: 'stock' },
  { symbol: '005380', name: '현대차', nameEn: 'Hyundai Motor', exchange: 'KOSPI', sector: '자동차', approxCapKRWTrillion: 55, type: 'stock' },
  { symbol: '000270', name: '기아', nameEn: 'Kia', exchange: 'KOSPI', sector: '자동차', approxCapKRWTrillion: 44, type: 'stock' },
  { symbol: '068270', name: '셀트리온', nameEn: 'Celltrion', exchange: 'KOSPI', sector: '바이오', approxCapKRWTrillion: 42, type: 'stock' },
  { symbol: '105560', name: 'KB금융', nameEn: 'KB Financial', exchange: 'KOSPI', sector: '금융', approxCapKRWTrillion: 34, type: 'stock' },
  { symbol: '055550', name: '신한지주', nameEn: 'Shinhan Financial', exchange: 'KOSPI', sector: '금융', approxCapKRWTrillion: 28, type: 'stock' },
  { symbol: '005490', name: 'POSCO홀딩스', nameEn: 'POSCO Holdings', exchange: 'KOSPI', sector: '소재', approxCapKRWTrillion: 27, type: 'stock' },
  { symbol: '035420', name: 'NAVER', nameEn: 'NAVER Corp', exchange: 'KOSPI', sector: '인터넷/플랫폼', approxCapKRWTrillion: 26, type: 'stock' },
  { symbol: '035720', name: '카카오', nameEn: 'Kakao Corp', exchange: 'KOSPI', sector: '인터넷/플랫폼', approxCapKRWTrillion: 18, type: 'stock' },
  { symbol: '042700', name: '한미반도체', nameEn: 'Hanmi Semiconductor', exchange: 'KOSPI', sector: '반도체', approxCapKRWTrillion: 15, type: 'stock' },
  { symbol: '012330', name: '현대모비스', nameEn: 'Hyundai Mobis', exchange: 'KOSPI', sector: '자동차', approxCapKRWTrillion: 22, type: 'stock' },
  { symbol: '064350', name: '현대로템', nameEn: 'Hyundai Rotem', exchange: 'KOSPI', sector: '방산/철도', approxCapKRWTrillion: 8, type: 'stock' },
  { symbol: '034020', name: '두산에너빌리티', nameEn: 'Doosan Enerbility', exchange: 'KOSPI', sector: '에너지', approxCapKRWTrillion: 12, type: 'stock' },
  { symbol: '417860', name: 'HD현대일렉트릭', nameEn: 'HD Hyundai Electric', exchange: 'KOSPI', sector: '에너지/인프라', approxCapKRWTrillion: 14, type: 'stock' },
  { symbol: '247540', name: '에코프로비엠', nameEn: 'EcoPro BM', exchange: 'KOSDAQ', sector: '2차전지', approxCapKRWTrillion: 16, type: 'stock' },
  { symbol: '086520', name: '에코프로', nameEn: 'EcoPro', exchange: 'KOSDAQ', sector: '2차전지', approxCapKRWTrillion: 21, type: 'stock' },
  { symbol: '196170', name: '알테오젠', nameEn: 'Alteogen', exchange: 'KOSDAQ', sector: '바이오', approxCapKRWTrillion: 19, type: 'stock' },
  { symbol: '028300', name: 'HLB', nameEn: 'HLB', exchange: 'KOSDAQ', sector: '바이오', approxCapKRWTrillion: 11, type: 'stock' },
  { symbol: '277810', name: '레인보우로보틱스', nameEn: 'Rainbow Robotics', exchange: 'KOSDAQ', sector: '로봇', approxCapKRWTrillion: 4, type: 'stock' },
  { symbol: '058470', name: '리노공업', nameEn: 'Leeno Industrial', exchange: 'KOSDAQ', sector: '반도체', approxCapKRWTrillion: 3, type: 'stock' },
  { symbol: '039030', name: '이오테크닉스', nameEn: 'EO Technics', exchange: 'KOSDAQ', sector: '반도체', approxCapKRWTrillion: 2.5, type: 'stock' },
  { symbol: '000030', name: 'KODEX 200', nameEn: 'KODEX 200', exchange: 'KOSPI', sector: 'ETF', approxCapKRWTrillion: 5, type: 'etf' },
];

// Top US Stocks curated from US_STOCK_MASTER
const US_HEATMAP_STOCKS: {
  symbol: string;
  name: string;
  nameEn: string;
  exchange: 'NASDAQ' | 'NYSE';
  sector: string;
  approxCapUSDBillion: number;
  type: 'stock' | 'etf';
}[] = [
  { symbol: 'NVDA', name: '엔비디아', nameEn: 'NVIDIA Corporation', exchange: 'NASDAQ', sector: '반도체', approxCapUSDBillion: 3400, type: 'stock' },
  { symbol: 'AAPL', name: '애플', nameEn: 'Apple Inc.', exchange: 'NASDAQ', sector: '빅테크', approxCapUSDBillion: 3300, type: 'stock' },
  { symbol: 'MSFT', name: '마이크로소프트', nameEn: 'Microsoft Corp', exchange: 'NASDAQ', sector: '빅테크', approxCapUSDBillion: 3100, type: 'stock' },
  { symbol: 'AMZN', name: '아마존', nameEn: 'Amazon.com Inc.', exchange: 'NASDAQ', sector: '인터넷/플랫폼', approxCapUSDBillion: 2100, type: 'stock' },
  { symbol: 'GOOGL', name: '알파벳 (구글)', nameEn: 'Alphabet Inc.', exchange: 'NASDAQ', sector: '인터넷/플랫폼', approxCapUSDBillion: 2000, type: 'stock' },
  { symbol: 'META', name: '메타 플랫폼스', nameEn: 'Meta Platforms Inc.', exchange: 'NASDAQ', sector: '인터넷/플랫폼', approxCapUSDBillion: 1500, type: 'stock' },
  { symbol: 'TSLA', name: '테슬라', nameEn: 'Tesla, Inc.', exchange: 'NASDAQ', sector: '자동차', approxCapUSDBillion: 850, type: 'stock' },
  { symbol: 'AVGO', name: '브로드컴', nameEn: 'Broadcom Inc.', exchange: 'NASDAQ', sector: '반도체', approxCapUSDBillion: 800, type: 'stock' },
  { symbol: 'TSM', name: 'TSMC', nameEn: 'Taiwan Semiconductor', exchange: 'NYSE', sector: '반도체', approxCapUSDBillion: 920, type: 'stock' },
  { symbol: 'PLTR', name: '팔란티어', nameEn: 'Palantir Technologies', exchange: 'NYSE', sector: '빅데이터/AI', approxCapUSDBillion: 130, type: 'stock' },
  { symbol: 'AMD', name: 'AMD', nameEn: 'Advanced Micro Devices', exchange: 'NASDAQ', sector: '반도체', approxCapUSDBillion: 240, type: 'stock' },
  { symbol: 'QCOM', name: '퀄컴', nameEn: 'QUALCOMM Inc.', exchange: 'NASDAQ', sector: '반도체', approxCapUSDBillion: 190, type: 'stock' },
  { symbol: 'NFLX', name: '넷플릭스', nameEn: 'Netflix, Inc.', exchange: 'NASDAQ', sector: '엔터/스트리밍', approxCapUSDBillion: 310, type: 'stock' },
  { symbol: 'ORCL', name: '오라클', nameEn: 'Oracle Corp', exchange: 'NYSE', sector: '소프트웨어', approxCapUSDBillion: 480, type: 'stock' },
  { symbol: 'CRM', name: '세일즈포스', nameEn: 'Salesforce, Inc.', exchange: 'NYSE', sector: '소프트웨어', approxCapUSDBillion: 280, type: 'stock' },
  { symbol: 'ADBE', name: '어도비', nameEn: 'Adobe Inc.', exchange: 'NASDAQ', sector: '소프트웨어', approxCapUSDBillion: 220, type: 'stock' },
  { symbol: 'SMCI', name: '슈퍼마이크로', nameEn: 'Super Micro Computer', exchange: 'NASDAQ', sector: 'AI서버/인프라', approxCapUSDBillion: 30, type: 'stock' },
  { symbol: 'ARM', name: 'ARM 홀딩스', nameEn: 'Arm Holdings plc', exchange: 'NASDAQ', sector: '반도체', approxCapUSDBillion: 140, type: 'stock' },
  { symbol: 'INTC', name: '인텔', nameEn: 'Intel Corp', exchange: 'NASDAQ', sector: '반도체', approxCapUSDBillion: 95, type: 'stock' },
  { symbol: 'MU', name: '마이크론', nameEn: 'Micron Technology', exchange: 'NASDAQ', sector: '반도체', approxCapUSDBillion: 110, type: 'stock' },
  { symbol: 'ASML', name: 'ASML 홀딩', nameEn: 'ASML Holding', exchange: 'NASDAQ', sector: '반도체', approxCapUSDBillion: 320, type: 'stock' },
  { symbol: 'QQQ', name: '인베스코 QQQ', nameEn: 'Invesco QQQ Trust', exchange: 'NASDAQ', sector: 'ETF', approxCapUSDBillion: 280, type: 'etf' },
  { symbol: 'SPY', name: 'SPDR S&P 500', nameEn: 'SPDR S&P 500 ETF', exchange: 'NYSE', sector: 'ETF', approxCapUSDBillion: 560, type: 'etf' },
  { symbol: 'SOXL', name: '필라델피아반도체 3X', nameEn: 'Direxion Daily Semi 3X', exchange: 'NYSE', sector: 'ETF', approxCapUSDBillion: 12, type: 'etf' },
];

class MarketHeatmapService {
  private cache = new Map<string, { data: HeatmapResponse; expiresAt: number }>();
  private readonly CACHE_TTL_MS = 60000; // 1-minute server-side cache

  /**
   * Determine whether Korean market is open (09:00 - 15:30 KST Mon-Fri)
   */
  public isKrMarketOpen(now: Date = new Date()): boolean {
    const kstOffset = 9 * 60;
    const utcMinutes = now.getTime() + now.getTimezoneOffset() * 60000;
    const kstDate = new Date(utcMinutes + kstOffset * 60000);
    const day = kstDate.getDay();
    if (day === 0 || day === 6) return false;
    const hours = kstDate.getHours();
    const minutes = kstDate.getMinutes();
    const timeNum = hours * 100 + minutes;
    return timeNum >= 900 && timeNum <= 1530;
  }

  /**
   * Determine whether US market is open (09:30 - 16:00 ET Mon-Fri)
   */
  public isUsMarketOpen(now: Date = new Date()): boolean {
    // US Eastern Time: -5h (EST) or -4h (EDT)
    const etString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
    const etDate = new Date(etString);
    const day = etDate.getDay();
    if (day === 0 || day === 6) return false;
    const hours = etDate.getHours();
    const minutes = etDate.getMinutes();
    const timeNum = hours * 100 + minutes;
    return timeNum >= 930 && timeNum <= 1600;
  }

  /**
   * Fetch 1Y daily candles for a stock to compute 1D, 1M, and 1Y exact returns
   */
  private async fetchStockReturns(ticker: string): Promise<{
    price: number;
    change1D: number;
    change1M: number;
    change1Y: number;
    prev1D: number;
    prev1M: number;
    prev1Y: number;
    status: 'realtime' | 'delayed' | 'closed';
  } | null> {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1y`;
    try {
      const res = await serverResilienceService.resilientFetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
          'Accept': 'application/json',
        },
      }, {
        maxRetries: 1,
        baseDelayMs: 200,
        timeoutMs: 3500,
        serviceName: `Heatmap(${ticker})`,
      });

      if (!res.ok) return null;
      const json = await res.json();
      const result = json.chart?.result?.[0];
      if (!result) return null;

      const quotes = result.indicators?.quote?.[0]?.close || [];
      const valid = quotes.filter((c: any) => typeof c === 'number' && !isNaN(c));
      if (valid.length < 2) return null;

      const meta = result.meta || {};
      const curr = Number((meta.regularMarketPrice || valid[valid.length - 1]).toFixed(2));
      const prev1D = Number((valid[valid.length - 2] || curr).toFixed(2));
      
      // ~21 trading days ago for 1 month
      const idx1M = Math.max(0, valid.length - 22);
      const prev1M = Number((valid[idx1M] || prev1D).toFixed(2));

      // 1 year ago (start of array)
      const prev1Y = Number((valid[0] || prev1M).toFixed(2));

      const change1D = Number((((curr - prev1D) / prev1D) * 100).toFixed(2));
      const change1M = Number((((curr - prev1M) / prev1M) * 100).toFixed(2));
      const change1Y = Number((((curr - prev1Y) / prev1Y) * 100).toFixed(2));

      return {
        price: curr,
        change1D,
        change1M,
        change1Y,
        prev1D,
        prev1M,
        prev1Y,
        status: 'realtime',
      };
    } catch {
      return null;
    }
  }

  /**
   * Generate Full Heatmap Response
   */
  public async getHeatmap(
    targetMarket: 'ALL' | 'KR' | 'US' | 'KOSPI' | 'KOSDAQ' | 'NASDAQ' | 'NYSE' = 'ALL',
    period: '1D' | '1M' | '1Y' = '1D',
    limit?: number,
    includeEtf: boolean = false
  ): Promise<HeatmapResponse> {
    const cacheKey = `heatmap_${targetMarket}_${period}_${limit || 'all'}_${includeEtf}`;
    const cached = this.cache.get(cacheKey);
    const now = Date.now();
    if (cached && cached.expiresAt > now) {
      return cached.data;
    }

    const isKrOpen = this.isKrMarketOpen();
    const isUsOpen = this.isUsMarketOpen();

    const items: HeatmapStockItem[] = [];

    // 1. Process Korean Stocks
    if (targetMarket === 'ALL' || targetMarket === 'KR' || targetMarket === 'KOSPI' || targetMarket === 'KOSDAQ') {
      const filteredKR = KR_HEATMAP_STOCKS.filter(s => {
        if (!includeEtf && s.type === 'etf') return false;
        if (targetMarket === 'KOSPI') return s.exchange === 'KOSPI';
        if (targetMarket === 'KOSDAQ') return s.exchange === 'KOSDAQ';
        return true;
      });

      const krPromises = filteredKR.map(async item => {
        const yahooTicker = `${item.symbol}.${item.exchange === 'KOSDAQ' ? 'KQ' : 'KS'}`;
        const returns = await this.fetchStockReturns(yahooTicker);

        const marketCapNumber = Math.round(item.approxCapKRWTrillion * 10000); // 억 원 단위
        const formattedCap = `${item.approxCapKRWTrillion}조 원`;

        if (returns) {
          return {
            symbol: item.symbol,
            name: item.name,
            nameEn: item.nameEn,
            market: 'KR' as const,
            exchange: item.exchange,
            sector: item.sector,
            price: returns.price,
            currency: 'KRW' as const,
            marketCap: marketCapNumber,
            formattedMarketCap: formattedCap,
            changePercent1D: returns.change1D,
            changePercent1M: returns.change1M,
            changePercent1Y: returns.change1Y,
            status: isKrOpen ? ('realtime' as const) : ('closed' as const),
            lastUpdated: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            baseline: {
              price1DPrev: returns.prev1D,
              price1MPrev: returns.prev1M,
              price1YPrev: returns.prev1Y,
            },
            type: item.type,
          };
        } else {
          return {
            symbol: item.symbol,
            name: item.name,
            nameEn: item.nameEn,
            market: 'KR' as const,
            exchange: item.exchange,
            sector: item.sector,
            price: 0,
            currency: 'KRW' as const,
            marketCap: marketCapNumber,
            formattedMarketCap: formattedCap,
            changePercent1D: 0,
            changePercent1M: 0,
            changePercent1Y: 0,
            status: 'delayed' as const,
            lastUpdated: '조회 지연',
            baseline: { price1DPrev: 0, price1MPrev: 0, price1YPrev: 0 },
            type: item.type,
          };
        }
      });

      const krResults = await Promise.allSettled(krPromises);
      krResults.forEach(r => {
        if (r.status === 'fulfilled' && r.value) items.push(r.value);
      });
    }

    // 2. Process US Stocks
    if (targetMarket === 'ALL' || targetMarket === 'US' || targetMarket === 'NASDAQ' || targetMarket === 'NYSE') {
      const filteredUS = US_HEATMAP_STOCKS.filter(s => {
        if (!includeEtf && s.type === 'etf') return false;
        if (targetMarket === 'NASDAQ') return s.exchange === 'NASDAQ';
        if (targetMarket === 'NYSE') return s.exchange === 'NYSE';
        return true;
      });

      const usPromises = filteredUS.map(async item => {
        const returns = await this.fetchStockReturns(item.symbol);
        const marketCapNumber = item.approxCapUSDBillion * 1000; // in Millions USD
        const formattedCap = item.approxCapUSDBillion >= 1000
          ? `$${(item.approxCapUSDBillion / 1000).toFixed(2)}T`
          : `$${item.approxCapUSDBillion}B`;

        if (returns) {
          return {
            symbol: item.symbol,
            name: item.name,
            nameEn: item.nameEn,
            market: 'US' as const,
            exchange: item.exchange,
            sector: item.sector,
            price: returns.price,
            currency: 'USD' as const,
            marketCap: marketCapNumber,
            formattedMarketCap: formattedCap,
            changePercent1D: returns.change1D,
            changePercent1M: returns.change1M,
            changePercent1Y: returns.change1Y,
            status: isUsOpen ? ('realtime' as const) : ('closed' as const),
            lastUpdated: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            baseline: {
              price1DPrev: returns.prev1D,
              price1MPrev: returns.prev1M,
              price1YPrev: returns.prev1Y,
            },
            type: item.type,
          };
        } else {
          return {
            symbol: item.symbol,
            name: item.name,
            nameEn: item.nameEn,
            market: 'US' as const,
            exchange: item.exchange,
            sector: item.sector,
            price: 0,
            currency: 'USD' as const,
            marketCap: marketCapNumber,
            formattedMarketCap: formattedCap,
            changePercent1D: 0,
            changePercent1M: 0,
            changePercent1Y: 0,
            status: 'delayed' as const,
            lastUpdated: '조회 지연',
            baseline: { price1DPrev: 0, price1MPrev: 0, price1YPrev: 0 },
            type: item.type,
          };
        }
      });

      const usResults = await Promise.allSettled(usPromises);
      usResults.forEach(r => {
        if (r.status === 'fulfilled' && r.value) items.push(r.value);
      });
    }

    // Sort descending by Market Cap so largest corporations get priority
    items.sort((a, b) => b.marketCap - a.marketCap);

    const finalItems = limit ? items.slice(0, limit) : items;

    const kstNow = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    const estNow = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

    let baselineText = '1일(1D): 전 거래일 정규장 종가 대비 변동률';
    if (period === '1M') baselineText = '1개월(1M): 1개월 전(약 21거래일 전) 종가 대비 수익률';
    if (period === '1Y') baselineText = '1년(1Y): 1년 전(약 250거래일 전) 종가 대비 수익률';

    const response: HeatmapResponse = {
      market: targetMarket,
      period,
      items: finalItems,
      meta: {
        krMarketStatus: isKrOpen ? 'OPEN' : 'CLOSED',
        usMarketStatus: isUsOpen ? 'OPEN' : 'CLOSED',
        serverTimeKST: kstNow,
        serverTimeEST: estNow,
        calculationBaseline: baselineText,
        totalTracked: finalItems.length,
        source: '한국거래소(KRX) · NYSE/NASDAQ 실거래 시세 및 일봉 데이터 기반',
      },
    };

    this.cache.set(cacheKey, { data: response, expiresAt: now + this.CACHE_TTL_MS });
    return response;
  }
}

export const marketHeatmapService = new MarketHeatmapService();
