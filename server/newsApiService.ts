/**
 * Server-Side News API Service
 * 
 * Strict Architecture:
 * - Real News API integration via leading Korean financial media RSS & Naver Search API
 * - Zero MOCK, zero Math.random(), zero hardcoded news articles
 * - Multi-source collection from Korea's top financial outlets:
 *   1. 한국경제 (Hankyung Finance/Stock Feed)
 *   2. 매일경제 (MK Stock Feed & Economy Feed)
 *   3. 동아일보 (Donga Economy Feed)
 *   4. Naver News Search API (if NAVER_CLIENT_ID & NAVER_CLIENT_SECRET configured)
 *   5. Google News RSS (safe fallback)
 * - Server-side caching (TTL: 60s) with request deduplication
 * - Extracts real publisher names (언론사), actual publication timestamps, titles, and original URLs
 */

import { TRACKED_STOCKS } from './stockApiService';

export interface NewsItem {
  id: string;
  title: string;
  source: string; // 언론사 (예: 한국경제, 매일경제, 동아일보 등)
  pubDate: string; // RFC 822 / ISO format
  publishedAt: number; // Unix timestamp in ms
  timeAgo: string; // "방금 전", "15분 전", "2시간 전", "어제" 등
  url: string; // 언론사 원문 기사 링크
  summary: string;
  relatedSymbol?: string;
  relatedSymbolName?: string;
  category?: 'breaking' | 'market' | 'kospi' | 'kosdaq' | 'economy' | 'general';
}

export interface NewsResponse {
  query: string;
  category: string;
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  items: NewsItem[];
  source: 'korean_rss' | 'google_rss' | 'naver';
  cached: boolean;
  timestamp: number;
  error?: string | null;
}

interface CacheEntry {
  data: NewsResponse;
  expiresAt: number;
}

interface RssFeedSource {
  name: string;
  url: string;
  defaultCategory: 'market' | 'economy' | 'general';
}

const KOREAN_FINANCIAL_FEEDS: RssFeedSource[] = [
  {
    name: '한국경제',
    url: 'https://www.hankyung.com/feed/all-news',
    defaultCategory: 'market',
  },
  {
    name: '매일경제',
    url: 'https://www.mk.co.kr/rss/50200011/', // 매경 증권
    defaultCategory: 'market',
  },
  {
    name: '매일경제',
    url: 'https://www.mk.co.kr/rss/30100041/', // 매경 경제
    defaultCategory: 'economy',
  },
  {
    name: '동아일보',
    url: 'https://rss.donga.com/economy.xml', // 동아 경제
    defaultCategory: 'economy',
  },
];

class NewsApiService {
  private cache = new Map<string, CacheEntry>();
  private inFlight = new Map<string, Promise<NewsResponse>>();
  private allFeedsCache: { items: NewsItem[]; expiresAt: number } | null = null;
  private defaultTtlMs = 60 * 1000; // 60 seconds server cache

  /**
   * Helper: Format publication timestamp into Korean timeAgo string
   */
  private formatTimeAgo(timestampMs: number): string {
    const diff = Date.now() - timestampMs;
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diff < 0) return '방금 전';
    if (diff < minute) return '방금 전';
    if (diff < hour) return `${Math.floor(diff / minute)}분 전`;
    if (diff < day) return `${Math.floor(diff / hour)}시간 전`;
    if (diff < day * 2) return '어제';
    if (diff < day * 7) return `${Math.floor(diff / day)}일 전`;

    const d = new Date(timestampMs);
    const kstYear = d.toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' });
    return kstYear;
  }

  /**
   * Helper: Clean CDATA, HTML entities and tags
   */
  private cleanText(raw: string): string {
    if (!raw) return '';
    let text = raw.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
    text = text
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .replace(/&middot;/g, '·');
    return text
      .replace(/<[^>]+>/g, '') // Strip all HTML tags
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Helper: Generate stable article ID
   */
  private generateId(title: string, url: string): string {
    const combined = `${title}_${url}`;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = (hash << 5) - hash + combined.charCodeAt(i);
      hash |= 0;
    }
    return `news_${Math.abs(hash).toString(36)}`;
  }

  /**
   * Helper: Classify news category based on title, description and source tags
   */
  private classifyCategory(title: string, desc: string): 'breaking' | 'kospi' | 'kosdaq' | 'economy' | 'market' {
    const text = `${title} ${desc}`.toLowerCase();
    if (
      text.includes('[속보]') ||
      text.includes('[단독]') ||
      text.includes('속보') ||
      text.includes('급등') ||
      text.includes('급락') ||
      text.includes('상한가') ||
      text.includes('하한가') ||
      text.includes('특징주')
    ) {
      return 'breaking';
    }
    if (text.includes('코스피') || text.includes('kospi') || text.includes('유가증권')) {
      return 'kospi';
    }
    if (text.includes('코스닥') || text.includes('kosdaq')) {
      return 'kosdaq';
    }
    if (
      text.includes('금리') ||
      text.includes('환율') ||
      text.includes('한국은행') ||
      text.includes('한은') ||
      text.includes('연준') ||
      text.includes('fomc') ||
      text.includes('물가') ||
      text.includes('gdp') ||
      text.includes('경제') ||
      text.includes('수출') ||
      text.includes('무역')
    ) {
      return 'economy';
    }
    return 'market';
  }

  /**
   * Fetch and parse a single RSS feed
   */
  private async fetchSingleRssFeed(source: RssFeedSource): Promise<NewsItem[]> {
    try {
      const res = await fetch(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/rss+xml, application/xml, text/xml',
        },
        signal: AbortSignal.timeout(4500),
      });

      if (!res.ok) {
        console.warn(`[NewsAPI] Feed ${source.name} returned HTTP ${res.status}`);
        return [];
      }

      const xmlText = await res.text();
      const itemMatches = xmlText.match(/<item[\s\S]*?<\/item>/gi) || [];

      const items: NewsItem[] = [];

      for (const itemXml of itemMatches) {
        const titleMatch = itemXml.match(/<title[\s\S]*?>([\s\S]*?)<\/title>/i);
        const linkMatch = itemXml.match(/<link[\s\S]*?>([\s\S]*?)<\/link>/i);
        const pubDateMatch = itemXml.match(/<pubDate[\s\S]*?>([\s\S]*?)<\/pubDate>/i);
        const authorMatch = itemXml.match(/<author[\s\S]*?>([\s\S]*?)<\/author>/i);
        const descMatch = itemXml.match(/<description[\s\S]*?>([\s\S]*?)<\/description>/i);

        if (!titleMatch || !linkMatch) continue;

        let rawTitle = this.cleanText(titleMatch[1]);
        let rawUrl = this.cleanText(linkMatch[1]);
        if (!rawTitle || !rawUrl) continue;

        // Ensure link is clean URL
        if (rawUrl.startsWith('//')) rawUrl = `https:${rawUrl}`;

        const rawPubDate = pubDateMatch ? this.cleanText(pubDateMatch[1]) : new Date().toUTCString();
        const publishedDate = new Date(rawPubDate);
        const publishedAt = !isNaN(publishedDate.getTime()) ? publishedDate.getTime() : Date.now();

        // Determine publisher name
        let publisher = source.name;
        if (authorMatch) {
          const authorText = this.cleanText(authorMatch[1]);
          if (authorText && !authorText.includes('@') && authorText.length < 15) {
            publisher = authorText.includes(source.name) ? authorText : `${source.name} (${authorText})`;
          }
        }

        let summary = descMatch ? this.cleanText(descMatch[1]) : '';
        if (summary.startsWith(rawTitle)) {
          summary = summary.slice(rawTitle.length).trim();
        }
        if (!summary || summary.length < 5) {
          summary = `${publisher} 보도: '${rawTitle}' 관련 증시 및 금융시장 최신 뉴스입니다.`;
        }

        const category = this.classifyCategory(rawTitle, summary);

        // Check if any tracked stock is mentioned
        let matchedSymbol: string | undefined;
        let matchedSymbolName: string | undefined;
        for (const stock of TRACKED_STOCKS) {
          if (rawTitle.includes(stock.name) || rawTitle.includes(stock.symbol)) {
            matchedSymbol = stock.symbol;
            matchedSymbolName = stock.name;
            break;
          }
        }

        items.push({
          id: this.generateId(rawTitle, rawUrl),
          title: rawTitle,
          source: publisher,
          pubDate: rawPubDate,
          publishedAt,
          timeAgo: this.formatTimeAgo(publishedAt),
          url: rawUrl,
          summary: summary.slice(0, 160),
          relatedSymbol: matchedSymbol,
          relatedSymbolName: matchedSymbolName,
          category,
        });
      }

      return items;
    } catch (err: any) {
      console.warn(`[NewsAPI] Error fetching RSS feed ${source.name} (${source.url}):`, err.message);
      return [];
    }
  }

  /**
   * Aggregate all Korean financial RSS feeds with deduplication and caching
   */
  private async getAggregatedKoreanFeeds(): Promise<NewsItem[]> {
    const now = Date.now();
    if (this.allFeedsCache && now < this.allFeedsCache.expiresAt && this.allFeedsCache.items.length > 0) {
      return this.allFeedsCache.items;
    }

    const feedPromises = KOREAN_FINANCIAL_FEEDS.map(feed => this.fetchSingleRssFeed(feed));
    const settled = await Promise.allSettled(feedPromises);

    const allItems: NewsItem[] = [];
    const seenTitles = new Set<string>();
    const seenUrls = new Set<string>();

    for (const res of settled) {
      if (res.status === 'fulfilled' && Array.isArray(res.value)) {
        for (const item of res.value) {
          const normTitle = item.title.replace(/\s+/g, '').slice(0, 30);
          if (seenTitles.has(normTitle) || seenUrls.has(item.url)) continue;
          seenTitles.add(normTitle);
          seenUrls.add(item.url);
          allItems.push(item);
        }
      }
    }

    // Sort by publication time descending (latest first)
    allItems.sort((a, b) => b.publishedAt - a.publishedAt);

    this.allFeedsCache = {
      items: allItems,
      expiresAt: now + this.defaultTtlMs,
    };

    return allItems;
  }

  /**
   * Fetch from Naver News Search API if NAVER_CLIENT_ID & NAVER_CLIENT_SECRET are configured
   */
  private async fetchFromNaver(
    query: string,
    categoryLabel: string = 'general',
    relatedSymbol?: string,
    relatedSymbolName?: string
  ): Promise<NewsItem[] | null> {
    const clientId = process.env.NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return null;
    }

    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `https://openapi.naver.com/v1/search/news.json?query=${encodedQuery}&display=30&sort=date`;

      const res = await fetch(url, {
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret,
        },
        signal: AbortSignal.timeout(4500),
      });

      if (!res.ok) {
        console.warn(`[NewsAPI] Naver News API error (HTTP ${res.status})`);
        return null;
      }

      const data = await res.json();
      if (!Array.isArray(data.items)) return null;

      return data.items.map((item: any) => {
        const title = this.cleanText(item.title);
        const url = item.originallink || item.link;
        const pubDate = item.pubDate;
        const publishedDate = new Date(pubDate);
        const publishedAt = !isNaN(publishedDate.getTime()) ? publishedDate.getTime() : Date.now();

        return {
          id: this.generateId(title, url),
          title,
          source: '네이버 뉴스',
          pubDate,
          publishedAt,
          timeAgo: this.formatTimeAgo(publishedAt),
          url,
          summary: this.cleanText(item.description).slice(0, 160),
          relatedSymbol,
          relatedSymbolName,
          category: categoryLabel as any,
        };
      });
    } catch (err: any) {
      console.warn('[NewsAPI] Naver fetch error:', err.message);
      return null;
    }
  }

  /**
   * Fetch from Google News RSS as secondary source (safe fallback)
   */
  private async fetchFromGoogleRss(
    query: string,
    categoryLabel: string = 'general',
    relatedSymbol?: string,
    relatedSymbolName?: string
  ): Promise<NewsItem[]> {
    try {
      const encodedQuery = encodeURIComponent(query);
      const feedUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=ko&gl=KR&ceid=KR:ko`;

      const res = await fetch(feedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/rss+xml, application/xml, text/xml',
        },
        signal: AbortSignal.timeout(4000),
      });

      if (!res.ok) {
        return [];
      }

      const xmlText = await res.text();
      const itemMatches = xmlText.match(/<item[\s\S]*?<\/item>/gi) || [];

      const items: NewsItem[] = [];

      for (const itemXml of itemMatches) {
        const titleMatch = itemXml.match(/<title[\s\S]*?>([\s\S]*?)<\/title>/i);
        const linkMatch = itemXml.match(/<link[\s\S]*?>([\s\S]*?)<\/link>/i);
        const pubDateMatch = itemXml.match(/<pubDate[\s\S]*?>([\s\S]*?)<\/pubDate>/i);
        const sourceMatch = itemXml.match(/<source[^>]*>([\s\S]*?)<\/source>/i);
        const descMatch = itemXml.match(/<description[\s\S]*?>([\s\S]*?)<\/description>/i);

        if (!titleMatch || !linkMatch) continue;

        let rawTitle = this.cleanText(titleMatch[1]);
        const rawUrl = linkMatch[1].trim();
        const rawPubDate = pubDateMatch ? pubDateMatch[1].trim() : new Date().toUTCString();
        let sourceName = sourceMatch ? this.cleanText(sourceMatch[1]) : '증권뉴스';

        const publishedDate = new Date(rawPubDate);
        const publishedAt = !isNaN(publishedDate.getTime()) ? publishedDate.getTime() : Date.now();

        if (!sourceMatch && rawTitle.includes(' - ')) {
          const parts = rawTitle.split(' - ');
          sourceName = parts.pop()?.trim() || sourceName;
          rawTitle = parts.join(' - ').trim();
        } else if (rawTitle.endsWith(` - ${sourceName}`)) {
          rawTitle = rawTitle.slice(0, -(sourceName.length + 3)).trim();
        }

        let summary = descMatch ? this.cleanText(descMatch[1]) : '';
        if (summary.startsWith(rawTitle)) {
          summary = summary.slice(rawTitle.length).trim();
        }
        if (!summary || summary.length < 5) {
          summary = `${sourceName} 보도: '${rawTitle}' 관련 금융시장 최신 뉴스입니다.`;
        }

        items.push({
          id: this.generateId(rawTitle, rawUrl),
          title: rawTitle,
          source: sourceName,
          pubDate: rawPubDate,
          publishedAt,
          timeAgo: this.formatTimeAgo(publishedAt),
          url: rawUrl,
          summary: summary.slice(0, 160),
          relatedSymbol,
          relatedSymbolName,
          category: categoryLabel as any,
        });
      }

      return items;
    } catch {
      return [];
    }
  }

  /**
   * Unified real news fetcher with server caching
   */
  public async getNews(
    query: string,
    category: string = 'all',
    page: number = 1,
    limit: number = 20,
    relatedSymbol?: string,
    relatedSymbolName?: string,
    bypassCache: boolean = false
  ): Promise<NewsResponse> {
    const p = Math.max(1, page);
    const l = Math.max(1, Math.min(50, limit));
    const cacheKey = `news_${category}_${query}_p${p}_l${l}`;

    // 1. Check Server Cache
    const now = Date.now();
    const cached = this.cache.get(cacheKey);
    if (!bypassCache && cached && now < cached.expiresAt) {
      return {
        ...cached.data,
        cached: true,
      };
    }

    // In-flight deduplication
    if (this.inFlight.has(cacheKey)) {
      return this.inFlight.get(cacheKey)!;
    }

    const fetchPromise = (async () => {
      try {
        let rawItems: NewsItem[] = [];
        let usedSource: 'korean_rss' | 'naver' | 'google_rss' = 'korean_rss';

        // 1. Try Naver if configured
        if (process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET) {
          const naverItems = await this.fetchFromNaver(query, category, relatedSymbol, relatedSymbolName);
          if (naverItems && naverItems.length > 0) {
            rawItems = naverItems;
            usedSource = 'naver';
          }
        }

        // 2. Primary Production Feed: Korea's Leading Financial Media RSS (Hankyung, Maekyung, Donga)
        if (rawItems.length === 0) {
          const feedItems = await this.getAggregatedKoreanFeeds();

          if (feedItems.length > 0) {
            let filtered = feedItems;

            // Apply category filtering
            if (category === 'breaking') {
              filtered = feedItems.filter(
                item =>
                  item.category === 'breaking' ||
                  item.title.includes('[속보]') ||
                  item.title.includes('[단독]') ||
                  item.title.includes('속보') ||
                  item.title.includes('급등') ||
                  item.title.includes('상한가') ||
                  item.title.includes('특징주')
              );
            } else if (category === 'kospi') {
              filtered = feedItems.filter(
                item =>
                  item.category === 'kospi' ||
                  item.title.includes('코스피') ||
                  item.title.includes('KOSPI') ||
                  item.summary.includes('코스피')
              );
            } else if (category === 'kosdaq') {
              filtered = feedItems.filter(
                item =>
                  item.category === 'kosdaq' ||
                  item.title.includes('코스닥') ||
                  item.title.includes('KOSDAQ') ||
                  item.summary.includes('코스닥')
              );
            } else if (category === 'economy') {
              filtered = feedItems.filter(
                item =>
                  item.category === 'economy' ||
                  item.title.includes('금리') ||
                  item.title.includes('환율') ||
                  item.title.includes('경제') ||
                  item.title.includes('한국은행') ||
                  item.title.includes('물가')
              );
            } else if (category === 'market') {
              filtered = feedItems.filter(
                item =>
                  item.category === 'market' ||
                  item.category === 'kospi' ||
                  item.category === 'kosdaq' ||
                  item.title.includes('증시') ||
                  item.title.includes('주식') ||
                  item.title.includes('지수')
              );
            }

            // Apply symbol / keyword query filtering if provided
            if (relatedSymbol || relatedSymbolName) {
              const sym = (relatedSymbol || '').toLowerCase();
              const sname = (relatedSymbolName || '').toLowerCase();
              const symbolFiltered = feedItems.filter(
                item =>
                  (sname && item.title.toLowerCase().includes(sname)) ||
                  (sym && item.title.toLowerCase().includes(sym)) ||
                  (sname && item.summary.toLowerCase().includes(sname))
              );
              if (symbolFiltered.length > 0) {
                filtered = symbolFiltered;
              }
            } else if (query && query !== '국내 증시 OR 코스피 OR 코스닥') {
              const qWords = query
                .replace(/[()OR]/g, ' ')
                .split(/\s+/)
                .filter(w => w.length >= 2)
                .map(w => w.toLowerCase());
              if (qWords.length > 0) {
                const queryMatched = filtered.filter(item => {
                  const combined = `${item.title} ${item.summary}`.toLowerCase();
                  return qWords.some(w => combined.includes(w));
                });
                if (queryMatched.length > 0) {
                  filtered = queryMatched;
                }
              }
            }

            rawItems = filtered.length > 0 ? filtered : feedItems;
            usedSource = 'korean_rss';
          }
        }

        // 3. Fallback to Google News RSS if Korean feeds returned 0 items
        if (rawItems.length === 0) {
          const googleItems = await this.fetchFromGoogleRss(query, category, relatedSymbol, relatedSymbolName);
          if (googleItems.length > 0) {
            rawItems = googleItems;
            usedSource = 'google_rss';
          }
        }

        const total = rawItems.length;
        const startIndex = (p - 1) * l;
        const paginated = rawItems.slice(startIndex, startIndex + l);
        const hasMore = startIndex + l < total;

        const response: NewsResponse = {
          query,
          category,
          total,
          page: p,
          limit: l,
          hasMore,
          items: paginated,
          source: usedSource,
          cached: false,
          timestamp: now,
          error: total === 0 ? '표시할 최신 뉴스가 없습니다.' : null,
        };

        // Store in Server Cache
        this.cache.set(cacheKey, {
          data: response,
          expiresAt: now + this.defaultTtlMs,
        });

        return response;
      } catch (err: any) {
        console.error(`[NewsAPI] 뉴스 조회 실패 (${category}, "${query}"):`, err.message);
        const errResp: NewsResponse = {
          query,
          category,
          total: 0,
          page: p,
          limit: l,
          hasMore: false,
          items: [],
          source: 'korean_rss',
          cached: false,
          timestamp: now,
          error: `일시적인 뉴스 수집 오류: ${err.message}`,
        };
        return errResp;
      } finally {
        this.inFlight.delete(cacheKey);
      }
    })();

    this.inFlight.set(cacheKey, fetchPromise);
    return fetchPromise;
  }

  /**
   * 1. Stock-specific News (종목별 최신 뉴스/속보)
   */
  public async getStockNews(symbol: string, page: number = 1, limit: number = 10): Promise<NewsResponse> {
    const matched = TRACKED_STOCKS.find(s => s.symbol === symbol);
    const stockName = matched?.name || symbol;

    const query = `${stockName} ${symbol}`;
    return this.getNews(query, 'stock', page, limit, symbol, stockName);
  }

  /**
   * 2. Market Categories News (전체 시장 뉴스 및 속보)
   * Categories: 'all' | 'breaking' | 'kospi' | 'kosdaq' | 'economy' | 'market'
   */
  public async getMarketNews(category: string = 'all', page: number = 1, limit: number = 20): Promise<NewsResponse> {
    let query = '국내 증시 OR 코스피 OR 코스닥';

    switch (category) {
      case 'breaking':
        query = '속보 특징주 급등 급락';
        break;
      case 'kospi':
        query = '코스피 KOSPI';
        break;
      case 'kosdaq':
        query = '코스닥 KOSDAQ';
        break;
      case 'economy':
        query = '경제 금리 환율 한국은행';
        break;
      case 'market':
        query = '국내 증시 주식 시장';
        break;
      default:
        query = '국내 증시 코스피 코스닥';
        break;
    }

    return this.getNews(query, category, page, limit);
  }

  /**
   * 3. Keyword Search News
   */
  public async searchNews(keyword: string, page: number = 1, limit: number = 20): Promise<NewsResponse> {
    const cleanQ = (keyword || '').trim();
    if (!cleanQ) {
      return this.getMarketNews('all', page, limit);
    }
    return this.getNews(cleanQ, 'search', page, limit);
  }

  /**
   * Diagnostic / Status check
   */
  public getStatus() {
    return {
      service: 'Stock News API Engine',
      providers: {
        koreanFeeds: {
          status: 'ACTIVE',
          sources: KOREAN_FINANCIAL_FEEDS.map(f => f.name),
        },
        naver: {
          configured: Boolean(process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET),
          cost: 'FREE (Daily 25,000 calls)',
        },
      },
      cachedQueriesCount: this.cache.size,
      ttlSeconds: this.defaultTtlMs / 1000,
    };
  }
}

export const newsApiService = new NewsApiService();
