/**
 * Client-Side News Service
 * Communicates with backend /api/news endpoints.
 * Includes client-side caching (60s TTL), request deduplication, and graceful 429 backoff handling.
 */

import { StockNews } from '../types';

export interface MarketNewsResponse {
  query: string;
  category: string;
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  items: StockNews[];
  source: 'google_rss' | 'naver';
  cached: boolean;
  timestamp: number;
  error?: string | null;
}

interface CacheRecord {
  data: MarketNewsResponse;
  expiresAt: number;
}

class NewsService {
  private cache = new Map<string, CacheRecord>();
  private inFlight = new Map<string, Promise<MarketNewsResponse>>();
  private rateLimitCooldownUntil = 0;
  private readonly defaultTtlMs = 60 * 1000; // 60 seconds

  /**
   * Safe fetch with cache, deduplication, and HTTP 429 rate limit backoff
   */
  private async safeFetch(url: string, cacheKey: string, forceRefresh: boolean = false): Promise<MarketNewsResponse> {
    const now = Date.now();

    // 1. Return cached data if valid and not forcing refresh
    if (!forceRefresh) {
      const cached = this.cache.get(cacheKey);
      if (cached && now < cached.expiresAt) {
        return { ...cached.data, cached: true };
      }
    }

    // 2. If currently under 429 cooldown, return stale cache if available
    if (now < this.rateLimitCooldownUntil) {
      const stale = this.cache.get(cacheKey);
      if (stale) {
        return { ...stale.data, cached: true, error: '요청 빈도 제한으로 캐시된 뉴스를 표시합니다.' };
      }
    }

    // 3. Deduplicate in-flight requests for the exact same URL
    if (this.inFlight.has(cacheKey)) {
      return this.inFlight.get(cacheKey)!;
    }

    const fetchPromise = (async () => {
      try {
        const res = await fetch(url);

        // Handle HTTP 429 Rate Limit gracefully
        if (res.status === 429) {
          const retryAfter = parseInt(res.headers.get('Retry-After') || '30', 10);
          this.rateLimitCooldownUntil = Date.now() + (retryAfter * 1000);
          console.warn(`[newsService] Received HTTP 429, cooling down for ${retryAfter}s`);

          // Return stale cache if we have it
          const stale = this.cache.get(cacheKey);
          if (stale) {
            return {
              ...stale.data,
              cached: true,
              error: '요청 빈도 제한으로 최근 뉴스를 유지합니다.',
            };
          }

          return {
            query: '',
            category: 'all',
            total: 0,
            page: 1,
            limit: 20,
            hasMore: false,
            items: [],
            source: 'google_rss' as const,
            cached: false,
            timestamp: Date.now(),
            error: '요청 빈도가 일시적으로 높습니다. 잠시 후 갱신됩니다.',
          };
        }

        if (!res.ok) {
          throw new Error(`뉴스 조회 실패 (HTTP ${res.status})`);
        }

        const data: MarketNewsResponse = await res.json();

        // Store in cache
        this.cache.set(cacheKey, {
          data,
          expiresAt: Date.now() + this.defaultTtlMs,
        });

        return data;
      } catch (err: any) {
        // Return stale cache on network or fetch error if available
        const stale = this.cache.get(cacheKey);
        if (stale) {
          return {
            ...stale.data,
            cached: true,
            error: '네트워크 연결 지연으로 캐시된 뉴스를 표시합니다.',
          };
        }

        return {
          query: '',
          category: 'all',
          total: 0,
          page: 1,
          limit: 20,
          hasMore: false,
          items: [],
          source: 'google_rss' as const,
          cached: false,
          timestamp: Date.now(),
          error: err.message || '뉴스를 불러올 수 없습니다.',
        };
      } finally {
        this.inFlight.delete(cacheKey);
      }
    })();

    this.inFlight.set(cacheKey, fetchPromise);
    return fetchPromise;
  }

  /**
   * Fetch market news by category
   */
  async getMarketNews(
    category: 'all' | 'breaking' | 'kospi' | 'kosdaq' | 'economy' | 'market' = 'all',
    page: number = 1,
    limit: number = 20,
    refresh: boolean = false
  ): Promise<MarketNewsResponse> {
    const url = `/api/news?category=${category}&page=${page}&limit=${limit}${refresh ? '&refresh=true' : ''}`;
    const cacheKey = `market_${category}_p${page}_l${limit}`;
    return this.safeFetch(url, cacheKey, refresh);
  }

  /**
   * Fetch stock specific news
   */
  async getStockNews(symbol: string, page: number = 1, limit: number = 10): Promise<MarketNewsResponse> {
    const url = `/api/news/stock/${symbol}?page=${page}&limit=${limit}`;
    const cacheKey = `stock_${symbol}_p${page}_l${limit}`;
    return this.safeFetch(url, cacheKey);
  }

  /**
   * Search news by query
   */
  async searchNews(keyword: string, page: number = 1, limit: number = 20): Promise<MarketNewsResponse> {
    const url = `/api/news/search?q=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`;
    const cacheKey = `search_${keyword.trim().toLowerCase()}_p${page}_l${limit}`;
    return this.safeFetch(url, cacheKey);
  }
}

export const newsService = new NewsService();
