/**
 * Client for Natural Language AI Stock Data Query Service & Server Functions
 */

export interface StockQueryExecutionResult {
  query: string;
  functionCalled: string;
  dataTimestamp: string;
  rawData: any;
  aiExplanation: string;
}

const CACHE_TTL_MS = 60000;
const requestCache = new Map<string, { data: any; timestamp: number }>();
const inFlightRequests = new Map<string, Promise<any>>();

export const aiStockQueryClient = {
  /**
   * Submit a natural language question.
   * Server executes the appropriate function, fetches verified data, and passes to Gemini.
   */
  async submitQuery(query: string, watchlist?: string[], uid?: string): Promise<StockQueryExecutionResult> {
    const cacheKey = JSON.stringify({ query, watchlist, uid: uid || 'anonymous' });
    
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
        const res = await fetch('/api/ai/stock-query', {
          method: 'POST',
          headers,
          body: JSON.stringify({ query, watchlist, uid }),
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
          throw new Error(err.error || err.message || 'AI 주식 데이터 질의 처리에 실패했습니다.');
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

  // Direct Server Functions
  async getStockQuote(symbol: string) {
    const res = await fetch(`/api/ai/stock-data/quote?symbol=${encodeURIComponent(symbol)}`);
    return res.ok ? await res.json() : null;
  },

  async getStockVolume(symbol: string) {
    const res = await fetch(`/api/ai/functions/stock-volume?symbol=${encodeURIComponent(symbol)}`);
    return res.ok ? await res.json() : null;
  },

  async getWatchlist(symbols?: string[]) {
    const query = symbols ? `?symbols=${encodeURIComponent(symbols.join(','))}` : '';
    const res = await fetch(`/api/ai/functions/watchlist${query}`);
    return res.ok ? await res.json() : null;
  },

  async getMarketSummary(market?: string) {
    const query = market ? `?market=${encodeURIComponent(market)}` : '';
    const res = await fetch(`/api/ai/functions/market-summary${query}`);
    return res.ok ? await res.json() : null;
  },

  async getTopGainers(limit: number = 5) {
    const res = await fetch(`/api/ai/functions/top-gainers?limit=${limit}`);
    return res.ok ? await res.json() : null;
  },

  async getTopLosers(limit: number = 5) {
    const res = await fetch(`/api/ai/functions/top-losers?limit=${limit}`);
    return res.ok ? await res.json() : null;
  },

  async getVolumeSpikes(threshold: number = 140) {
    const res = await fetch(`/api/ai/functions/volume-spikes?threshold=${threshold}`);
    return res.ok ? await res.json() : null;
  },
};
