import { portfolioService } from './portfolioService';
import { stockRepository } from './stockRepository';
import { PortfolioSummary, PortfolioHolding } from '../types';

export const portfolioAnalyzerService = {
  async getPortfolioSummary(uid: string): Promise<PortfolioSummary> {
    const holdings = await portfolioService.getVirtualHoldings(uid);
    const trades = await portfolioService.getVirtualHoldingTrades(uid);
    const account = await portfolioService.getMockAccount(uid);

    let totalAssets = account.currentCash;
    let evaluationAmount = 0;
    let unrealizedPnL = 0;
    
    const portfolioHoldings: PortfolioHolding[] = [];

    for (const h of holdings) {
      const stock = await stockRepository.getStock(h.symbol);
      const currentPrice = stock?.price || h.avgBuyPrice;
      const marketValue = currentPrice * h.quantity;
      const pnl = marketValue - (h.avgBuyPrice * h.quantity);
      
      evaluationAmount += marketValue;
      unrealizedPnL += pnl;

      portfolioHoldings.push({
        symbol: h.symbol,
        name: h.name,
        quantity: h.quantity,
        avgBuyPrice: h.avgBuyPrice,
        currentPrice: currentPrice,
        marketValue: marketValue,
        unrealizedPnL: pnl,
        unrealizedPnLRate: h.avgBuyPrice > 0 ? (pnl / (h.avgBuyPrice * h.quantity)) * 100 : 0,
        weight: 0, // Calculated later
        sector: stock?.sector || '기타',
        market: h.market as 'KOSPI' | 'KOSDAQ' | 'US',
        currency: h.currency,
      });
    }

    totalAssets += evaluationAmount;

    // Calculate weights
    portfolioHoldings.forEach(h => {
      h.weight = evaluationAmount > 0 ? (h.marketValue / evaluationAmount) * 100 : 0;
    });

    const realizedPnL = trades.reduce((sum, t) => sum + (t.realizedProfit || 0), 0);
    const totalPnL = unrealizedPnL + realizedPnL;

    return {
      totalAssets,
      totalCash: account.currentCash,
      totalInvested: holdings.reduce((sum, h) => sum + h.totalBuyAmount, 0),
      evaluationAmount,
      unrealizedPnL,
      realizedPnL,
      totalPnL,
      roi: totalAssets > 0 ? (totalPnL / (totalAssets - totalPnL)) * 100 : 0,
      currency: 'KRW',
      holdings: portfolioHoldings,
      sectorAllocations: [], // Placeholder
      marketAllocations: [], // Placeholder
      lastUpdated: new Date().toISOString(),
    };
  },
};
