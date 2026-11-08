/**
 * Unified Financial Data System Types
 * 
 * Defines standard data contracts across domestic/global stocks, forex,
 * crypto, commodities, bond yields, benchmark interest rates, and macro indicators.
 */

export type FinancialCategory = 
  | 'domestic'
  | 'us'
  | 'asia'
  | 'europe'
  | 'crypto'
  | 'commodity'
  | 'forex'
  | 'rates'
  | 'macro';

export type FinancialAssetType = 
  | 'stock'
  | 'index'
  | 'crypto'
  | 'forex'
  | 'commodity'
  | 'rate'
  | 'bond'
  | 'macro';

export type DelayStatus = 
  | 'realtime'
  | 'delayed_15m'
  | 'delayed_20m'
  | 'official_notice'
  | 'official_close'
  | 'annual'
  | 'monthly';

export interface UnifiedFinancialItem {
  id: string;
  category: FinancialCategory;
  assetType: FinancialAssetType;
  name: string;
  symbol: string;
  value: number;
  displayValue?: string;
  change: number;
  changePercent: number;
  currency: string;
  unit?: string;
  high?: number;
  low?: number;
  open?: number;
  prevClose?: number;
  volume?: number;
  tradingValue?: number;
  sparkline?: number[];
  provider: string;
  delayStatus: DelayStatus;
  delayLabel: string;
  isRealtime: boolean;
  marketSession?: 'OPEN' | 'CLOSED' | 'PRE' | 'POST';
  marketTime?: string;
  lastUpdated: string;
  status: 'ok' | 'delayed' | 'error' | 'unavailable';
  errorMessage?: string;
  license?: string;
  notes?: string;
}

export interface ProviderMetadata {
  name: string;
  assetScope: string;
  cost: string; // '0원 (무료 공개/공식 API)'
  license: string;
  updateFrequency: string;
  officialSourceUrl: string;
}

export interface UnifiedFinancialSummaryResponse {
  fetchedAt: string;
  cached: boolean;
  groups: {
    domestic: UnifiedFinancialItem[];
    us: UnifiedFinancialItem[];
    asia: UnifiedFinancialItem[];
    europe: UnifiedFinancialItem[];
    crypto: UnifiedFinancialItem[];
    commodity: UnifiedFinancialItem[];
    forex: UnifiedFinancialItem[];
    rates: UnifiedFinancialItem[];
    macro: UnifiedFinancialItem[];
  };
  providers: ProviderMetadata[];
}
