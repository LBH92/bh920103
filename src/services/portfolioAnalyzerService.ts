import { portfolioService } from './portfolioService';
import { stockRepository } from './stockRepository';
import { ExchangeRate, PortfolioSummary, PortfolioHolding } from '../types';
import {
  aggregateMultiCurrencyPortfolio,
  convertToKRW,
  inferFiatCurrency,
  inferStockExchange,
  roundByCurrency,
} from '../utils/currency';

export const portfolioAnalyzerService = {
  async getPortfolioSummary(uid: string, exchangeRate?: ExchangeRate | null): Promise<PortfolioSummary> {
    const [holdings, trades, account, fx] = await Promise.all([
      portfolioService.getVirtualHoldings(uid),
      portfolioService.getVirtualHoldingTrades(uid),
      portfolioService.getMockAccount(uid),
      exchangeRate ? Promise.resolve(exchangeRate) : stockRepository.getExchangeRate().catch(() => null),
    ]);

    const portfolioHoldings: PortfolioHolding[] = [];
    const aggregatablePositions = [];

    for (const h of holdings) {
      const stock = await stockRepository.getStock(h.symbol);
      const currency = inferFiatCurrency(h.symbol, h.market, h.currency);
      const exchange = inferStockExchange(h.symbol, h.market, h.exchange);
      const currentPrice = stock?.price && stock.price > 0 ? stock.price : h.avgBuyPrice;
      const marketValue = roundByCurrency(currentPrice * h.quantity, currency);
      const cost = roundByCurrency(h.avgBuyPrice * h.quantity, currency);
      const pnl = roundByCurrency(marketValue - cost, currency);

      aggregatablePositions.push({
        symbol: h.symbol,
        currency,
        market: h.market,
        quantity: h.quantity,
        avgBuyPrice: h.avgBuyPrice,
        totalCost: h.totalBuyAmount || cost,
        currentPrice,
        entryExchangeRate: h.entryExchangeRate,
      });

      portfolioHoldings.push({
        id: h.id,
        symbol: h.symbol,
        name: h.name,
        quantity: h.quantity,
        avgBuyPrice: h.avgBuyPrice,
        currentPrice,
        marketValue,
        unrealizedPnL: pnl,
        unrealizedPnLRate: cost > 0 ? Number(((pnl / cost) * 100).toFixed(2)) : 0,
        weight: 0, // Calculated below on a common KRW basis when FX is valid
        sector: stock?.sector || '기타',
        market: (h.market as 'KOSPI' | 'KOSDAQ' | 'US') || (currency === 'USD' ? 'US' : 'KOSPI'),
        exchange,
        currency,
      });
    }

    const aggregated = aggregateMultiCurrencyPortfolio({
      positions: aggregatablePositions,
      realizedTrades: trades,
      cashKRW: account.currentCash,
      initialCashKRW: account.initialBalance,
      cashUSD: account.currentCashUsd ?? 0,
      initialCashUSD: account.initialBalanceUsd ?? 0,
      fx,
      fallbackValuationToCost: true,
    });

    // Compute weights on a single converted currency basis ONLY when FX is valid (or if no USD holdings)
    const krwEvalTotal = aggregated.convertedKRW
      ? aggregated.convertedKRW.evaluationAmount
      : aggregated.krw.evaluationAmount;

    portfolioHoldings.forEach(h => {
      if (aggregated.usd.holdingsCount === 0) {
        h.weight = krwEvalTotal > 0 ? Number(((h.marketValue / krwEvalTotal) * 100).toFixed(1)) : 0;
      } else if (aggregated.fx.valid && krwEvalTotal > 0) {
        const conv = convertToKRW(h.marketValue, h.currency, fx);
        h.weight = conv.valid && conv.valueKRW !== null
          ? Number(((conv.valueKRW / krwEvalTotal) * 100).toFixed(1))
          : 0;
      } else {
        // Without valid FX, mixed-currency share weights across KRW/USD cannot be accurately unified
        h.weight = 0;
      }
    });

    const conv = aggregated.convertedKRW;

    return {
      totalAssets: conv ? conv.totalAssets : aggregated.krw.totalAssets,
      totalCash: conv ? conv.totalCash : aggregated.krw.cash,
      totalInvested: conv ? conv.investedCost : aggregated.krw.investedCost,
      evaluationAmount: conv ? conv.evaluationAmount : aggregated.krw.evaluationAmount,
      unrealizedPnL: conv ? conv.unrealizedPnL : aggregated.krw.unrealizedPnL,
      realizedPnL: conv ? conv.realizedPnL : aggregated.krw.realizedPnL,
      totalPnL: conv ? conv.totalPnL : aggregated.krw.totalPnL,
      roi: conv ? conv.returnRatePercent : aggregated.krw.returnRatePercent,
      currency: 'KRW',
      krw: {
        currency: 'KRW',
        totalAssets: aggregated.krw.totalAssets,
        totalCash: aggregated.krw.cash,
        totalInvested: aggregated.krw.investedCost,
        evaluationAmount: aggregated.krw.evaluationAmount,
        unrealizedPnL: aggregated.krw.unrealizedPnL,
        realizedPnL: aggregated.krw.realizedPnL,
        totalPnL: aggregated.krw.totalPnL,
        roi: aggregated.krw.returnRatePercent,
        holdingsCount: aggregated.krw.holdingsCount,
      },
      usd: {
        currency: 'USD',
        totalAssets: aggregated.usd.totalAssets,
        totalCash: aggregated.usd.cash,
        totalInvested: aggregated.usd.investedCost,
        evaluationAmount: aggregated.usd.evaluationAmount,
        unrealizedPnL: aggregated.usd.unrealizedPnL,
        realizedPnL: aggregated.usd.realizedPnL,
        totalPnL: aggregated.usd.totalPnL,
        roi: aggregated.usd.returnRatePercent,
        holdingsCount: aggregated.usd.holdingsCount,
      },
      fxRate: aggregated.fx.rate,
      fxTimestamp: aggregated.fx.lastUpdated,
      fxValid: aggregated.fx.valid,
      fxStatus: aggregated.fx.status,
      stockPnLKRW: conv ? conv.stockPnLKRW : null,
      fxPnLKRW: conv ? conv.fxPnLKRW : null,
      hasEntryFxData: conv ? conv.hasEntryFxData : false,
      holdings: portfolioHoldings,
      sectorAllocations: [],
      marketAllocations: [],
      lastUpdated: new Date().toISOString(),
    };
  },
};
