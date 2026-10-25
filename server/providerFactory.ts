import { StockProvider } from '../src/types/dataProvider';

export const getProvider = (): StockProvider => {
  const providerType = process.env.STOCK_PROVIDER || 'YAHOO';
  
  if (providerType === 'YAHOO') {
    return {
      name: 'Yahoo Finance',
      fetchQuote: async (symbol: string) => ({
          price: 0,
          currency: 'KRW',
          lastUpdated: new Date().toISOString(),
          delayStatus: 'unknown'
      }),
      fetchChart: async (symbol: string, period: string) => ({}),
      fetchReturns: async (symbol: string) => ({}),
      fetchExchangeRate: async () => ({}),
    };
  }
  
  throw new Error(`Unsupported provider: ${providerType}`);
};
