/**
 * Client for Gemini AI Stock Briefing Service & Server Functions
 */

export interface AiBriefingResponse {
  symbol: string;
  symbolName: string;
  query: string;
  dataTimestamp: string;
  quote: {
    symbol: string;
    name: string;
    market: string;
    sector: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    volumeRatio: number;
    tradingValue: number;
    openPrice: number;
    highPrice: number;
    lowPrice: number;
    prevClose: number;
    marketCap: string;
    per?: number;
    pbr?: number;
    dividendYield?: number;
    dataTimestamp: string;
  } | null;
  content: string; // Structured 5-section response
  sourcesUsed: {
    quote: boolean;
    chart: boolean;
    news: boolean;
    market: boolean;
    community: boolean;
  };
}
const CACHE_TTL_MS = 60000;
const requestCache = new Map<string, { data: any; timestamp: number }>();
const inFlightRequests = new Map<string, Promise<any>>();

export const aiBriefingClient = {
  /**
   * Request full AI Stock Briefing from server
   * Server executes the 5 functions and passes real data to Gemini.
   */
  async requestBriefing(query: string, symbol?: string, uid?: string): Promise<AiBriefingResponse> {
    const cacheKey = JSON.stringify({ query, symbol, uid: uid || 'anonymous' });
    
    // Check cache
    const cached = requestCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    // Check in-flight
    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey);
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (uid) {
      headers['x-user-uid'] = uid;
    }

    const requestPromise = (async () => {
      let retryCount = 0;
      const MAX_RETRIES = 3;

      async function doFetch(): Promise<any> {
        const res = await fetch('/api/ai/stock-briefing', {
          method: 'POST',
          headers,
          body: JSON.stringify({ query, symbol, uid }),
        });

        if (res.status === 429 && retryCount < MAX_RETRIES) {
          const retryAfter = parseInt(res.headers.get('Retry-After') || '1') * 1000;
          // Exponential backoff with jitter
          const jitter = Math.random() * 1000;
          const delay = Math.max(retryAfter, retryAfter * Math.pow(2, retryCount)) + jitter;
          await new Promise(resolve => setTimeout(resolve, delay));
          retryCount++;
          return doFetch();
        }

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          if (err.error === 'AI_NOT_CONNECTED' || err.message?.includes('AI_NOT_CONNECTED')) {
            throw new Error(err.message || '개인 Gemini AI 계정이 연결되지 않았습니다. 프로필 설정에서 본인의 Google AI Studio 키를 연결해주세요.');
          }
          throw new Error(err.error || err.message || 'AI 종목 브리핑 생성에 실패했습니다.');
        }

        const data = await res.json();
        requestCache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
      }
      try {
        return await doFetch();
      } finally {
        inFlightRequests.delete(cacheKey);
      }
    })();

    inFlightRequests.set(cacheKey, requestPromise);
    return requestPromise;
  },

  clearCache() {
    requestCache.clear();
    inFlightRequests.clear();
  },

  // Direct access to the 5 Server Functions if needed
  async getStockQuote(symbol: string) {
    const res = await fetch(`/api/ai/stock-data/quote?symbol=${encodeURIComponent(symbol)}`);
    if (!res.ok) return null;
    return await res.json();
  },

  async getStockChart(symbol: string, period: string = '1M') {
    const res = await fetch(`/api/ai/stock-data/chart?symbol=${encodeURIComponent(symbol)}&period=${period}`);
    if (!res.ok) return null;
    return await res.json();
  },

  async getStockNews(symbol: string) {
    const res = await fetch(`/api/ai/stock-data/news?symbol=${encodeURIComponent(symbol)}`);
    if (!res.ok) return null;
    return await res.json();
  },

  async getMarketStatus() {
    const res = await fetch('/api/ai/stock-data/market');
    if (!res.ok) return null;
    return await res.json();
  },

  async getRelatedPosts(symbol: string) {
    const res = await fetch(`/api/ai/stock-data/posts?symbol=${encodeURIComponent(symbol)}`);
    if (!res.ok) return null;
    return await res.json();
  },
};
