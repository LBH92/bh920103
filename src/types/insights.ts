export type InsightCategory = 'domestic-market' | 'us-market' | 'economy';
export type InsightStatus = 'draft' | 'published';

export interface EditorialInsight {
  id: string; // URL slug or unique ID (e.g., "kospi-weekly-review-202611")
  title: string;
  summary: string; // Used for meta description
  content: string; // Detailed content (Structured Markdown/HTML)
  category: InsightCategory;
  categoryLabel: string;
  targetSymbol?: string;
  targetSymbolName?: string;
  tags: string[];
  status: InsightStatus;
  authorName: string;
  readTimeMinutes: number;
  viewCount: number;
  marketDataSnapshot?: {
    benchmarkPrice?: number;
    changePercent?: number;
    exchangeRate?: number;
    dataTimestamp: string;
  };
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  publishedAt?: string; // ISO 8601
}

export interface InsightDraftGenerateRequest {
  category: InsightCategory;
  topic?: string;
  targetSymbol?: string;
}

export interface InsightUpdateRequest {
  title?: string;
  summary?: string;
  content?: string;
  category?: InsightCategory;
  tags?: string[];
  status?: InsightStatus;
}
