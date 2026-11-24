//#region src/services/newsService.ts
var NewsService = class {
	constructor() {
		this.cache = /* @__PURE__ */ new Map();
		this.inFlight = /* @__PURE__ */ new Map();
		this.rateLimitCooldownUntil = 0;
		this.defaultTtlMs = 6e4;
	}
	/**
	* Safe fetch with cache, deduplication, and HTTP 429 rate limit backoff
	*/
	async safeFetch(url, cacheKey, forceRefresh = false) {
		const now = Date.now();
		if (!forceRefresh) {
			const cached = this.cache.get(cacheKey);
			if (cached && now < cached.expiresAt) return {
				...cached.data,
				cached: true
			};
		}
		if (now < this.rateLimitCooldownUntil) {
			const stale = this.cache.get(cacheKey);
			if (stale) return {
				...stale.data,
				cached: true,
				error: "요청 빈도 제한으로 캐시된 뉴스를 표시합니다."
			};
		}
		if (this.inFlight.has(cacheKey)) return this.inFlight.get(cacheKey);
		const fetchPromise = (async () => {
			try {
				const res = await fetch(url);
				if (res.status === 429) {
					const retryAfter = parseInt(res.headers.get("Retry-After") || "30", 10);
					this.rateLimitCooldownUntil = Date.now() + retryAfter * 1e3;
					console.warn(`[newsService] Received HTTP 429, cooling down for ${retryAfter}s`);
					const stale = this.cache.get(cacheKey);
					if (stale) return {
						...stale.data,
						cached: true,
						error: "요청 빈도 제한으로 최근 뉴스를 유지합니다."
					};
					return {
						query: "",
						category: "all",
						total: 0,
						page: 1,
						limit: 20,
						hasMore: false,
						items: [],
						source: "google_rss",
						cached: false,
						timestamp: Date.now(),
						error: "요청 빈도가 일시적으로 높습니다. 잠시 후 갱신됩니다."
					};
				}
				if (!res.ok) throw new Error(`뉴스 조회 실패 (HTTP ${res.status})`);
				const data = await res.json();
				this.cache.set(cacheKey, {
					data,
					expiresAt: Date.now() + this.defaultTtlMs
				});
				return data;
			} catch (err) {
				const stale = this.cache.get(cacheKey);
				if (stale) return {
					...stale.data,
					cached: true,
					error: "네트워크 연결 지연으로 캐시된 뉴스를 표시합니다."
				};
				return {
					query: "",
					category: "all",
					total: 0,
					page: 1,
					limit: 20,
					hasMore: false,
					items: [],
					source: "google_rss",
					cached: false,
					timestamp: Date.now(),
					error: err.message || "뉴스를 불러올 수 없습니다."
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
	async getMarketNews(category = "all", page = 1, limit = 20, refresh = false) {
		const url = `/api/news?category=${category}&page=${page}&limit=${limit}${refresh ? "&refresh=true" : ""}`;
		const cacheKey = `market_${category}_p${page}_l${limit}`;
		return this.safeFetch(url, cacheKey, refresh);
	}
	/**
	* Fetch stock specific news
	*/
	async getStockNews(symbol, page = 1, limit = 10) {
		const url = `/api/news/stock/${symbol}?page=${page}&limit=${limit}`;
		const cacheKey = `stock_${symbol}_p${page}_l${limit}`;
		return this.safeFetch(url, cacheKey);
	}
	/**
	* Search news by query
	*/
	async searchNews(keyword, page = 1, limit = 20) {
		const url = `/api/news/search?q=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`;
		const cacheKey = `search_${keyword.trim().toLowerCase()}_p${page}_l${limit}`;
		return this.safeFetch(url, cacheKey);
	}
};
var newsService = new NewsService();
//#endregion
export { newsService as t };
