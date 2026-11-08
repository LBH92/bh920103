/**
 * Client-Side Global Market & Financial Hub Service
 * Fetches real market and financial data from /api/market/global-summary and /api/financial/hub
 */

import { GlobalMarketSummaryResponse, ProviderMetadata, GlobalMarketItem } from '../types';

class GlobalMarketClient {
  private cache: GlobalMarketSummaryResponse | null = null;
  private lastFetched: number = 0;
  private readonly TTL_MS = 15000; // 15 seconds client cache

  async getSummary(forceRefresh: boolean = false): Promise<GlobalMarketSummaryResponse> {
    const now = Date.now();
    if (!forceRefresh && this.cache && now - this.lastFetched < this.TTL_MS) {
      return this.cache;
    }

    const res = await fetch(`/api/market/global-summary${forceRefresh ? '?force=true' : ''}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`글로벌 시장 데이터 조회 실패 (HTTP ${res.status})`);
    }

    const data: GlobalMarketSummaryResponse = await res.json();
    this.cache = data;
    this.lastFetched = now;
    return data;
  }

  async getCategoryItems(category: string, forceRefresh: boolean = false): Promise<GlobalMarketItem[]> {
    const res = await fetch(`/api/financial/hub?category=${encodeURIComponent(category)}${forceRefresh ? '&force=true' : ''}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`카테고리(${category}) 데이터 조회 실패`);
    }

    const data = await res.json();
    return data.items || [];
  }

  async getProviders(): Promise<ProviderMetadata[]> {
    try {
      const res = await fetch('/api/financial/providers');
      if (!res.ok) return [];
      const json = await res.json();
      return json.providers || [];
    } catch {
      return [];
    }
  }
}

export const globalMarketClient = new GlobalMarketClient();
