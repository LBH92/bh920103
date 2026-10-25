export interface StockProvider {
  name: string;
  fetchQuote: (symbol: string) => Promise<{
      price: number;
      currency: 'KRW' | 'USD';
      lastUpdated: string;
      delayStatus: 'realtime' | 'delayed_15m' | 'closed' | 'unknown';
      error?: string;
  }>;
  fetchChart: (symbol: string, period: string) => Promise<any>;
  fetchReturns: (symbol: string) => Promise<any>;
  fetchExchangeRate: () => Promise<any>;
}
