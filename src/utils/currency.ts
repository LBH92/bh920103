import { ExchangeRate } from '../types';
import { isUSStockSymbol } from './stocks/ticker';

export type SupportedCurrency = 'KRW' | 'USD' | 'USDT' | 'BTC';
export type FiatCurrency = 'KRW' | 'USD';

/**
 * Infers ISO 4217 currency code from explicit currency, market, or symbol.
 * Guarantees deterministic KRW vs USD separation even on legacy data without `currency`.
 */
export function inferStockCurrency(
  symbol?: string,
  market?: string,
  explicitCurrency?: string
): SupportedCurrency {
  const cur = (explicitCurrency || '').toUpperCase().trim();
  if (cur === 'KRW' || cur === 'USD' || cur === 'USDT' || cur === 'BTC') {
    return cur;
  }

  const mkt = (market || '').toUpperCase().trim();
  const sym = (symbol || '').toUpperCase().trim();

  if (mkt === 'COIN' || sym.startsWith('KRW-') || sym.endsWith('USDT') || sym.endsWith('BTC')) {
    if (sym.startsWith('KRW-')) return 'KRW';
    if (sym.endsWith('BTC')) return 'BTC';
    return 'USDT';
  }

  if (mkt === 'US' || mkt === 'GLOBAL' || mkt === 'NASDAQ' || mkt === 'NYSE' || mkt === 'AMEX') {
    return 'USD';
  }

  if (mkt === 'KOSPI' || mkt === 'KOSDAQ' || mkt === 'KR' || mkt === 'KRX') {
    return 'KRW';
  }

  if (/^\d{6}$/.test(sym)) {
    return 'KRW';
  }

  if (sym && isUSStockSymbol(sym)) {
    return 'USD';
  }

  return 'KRW';
}

export function inferFiatCurrency(
  symbol?: string,
  market?: string,
  explicitCurrency?: string
): FiatCurrency {
  const c = inferStockCurrency(symbol, market, explicitCurrency);
  return c === 'USD' || c === 'USDT' || c === 'BTC' ? 'USD' : 'KRW';
}

export function inferStockExchange(
  symbol?: string,
  market?: string,
  explicitExchange?: string
): string {
  if (explicitExchange && explicitExchange.trim()) return explicitExchange.trim();
  const mkt = (market || '').toUpperCase().trim();
  if (mkt === 'KOSPI' || mkt === 'KOSDAQ') return mkt;
  if (mkt === 'US' || mkt === 'GLOBAL') return 'US (NASDAQ/NYSE)';
  if (mkt === 'COIN') {
    const sym = (symbol || '').toUpperCase();
    return sym.startsWith('KRW-') ? 'UPBIT' : 'BINANCE';
  }
  const currency = inferStockCurrency(symbol, market);
  if (currency === 'USD') return 'NASDAQ/NYSE';
  if (/^\d{6}$/.test((symbol || '').trim())) return 'KRX';
  return mkt || 'KRX';
}

export function roundByCurrency(amount: number, currency: SupportedCurrency = 'KRW'): number {
  if (!Number.isFinite(amount)) return 0;
  if (currency === 'KRW') return Math.round(amount);
  if (currency === 'USD') return Number(amount.toFixed(2));
  if (currency === 'USDT') return Number(amount.toFixed(Math.abs(amount) < 1 ? 4 : 2));
  if (currency === 'BTC') return Number(amount.toFixed(8));
  return Math.round(amount);
}

export interface FormatMoneyOptions {
  showSign?: boolean;
  /** 'symbol' -> ₩1,000,000 / $1,000.00 (default); 'unit' -> 1,000,000원 / $1,000.00 */
  krwStyle?: 'symbol' | 'unit';
  decimals?: number;
}

/**
 * Unified money formatter
 * Defaults strictly to:
 *  - KRW: ₩1,000,000 (or -₩1,000,000)
 *  - USD: $1,000.00 (or -$1,000.00)
 */
export function formatMoney(
  amount: number,
  currency: SupportedCurrency = 'KRW',
  options: FormatMoneyOptions = {}
): string {
  const { showSign = false, krwStyle = 'symbol', decimals } = options;
  const safe = Number.isFinite(amount) ? amount : 0;
  const isNeg = safe < 0;
  const absVal = Math.abs(safe);
  const sign = isNeg ? '-' : (showSign && safe > 0 ? '+' : '');

  if (currency === 'USD') {
    const d = decimals ?? 2;
    const formatted = absVal.toLocaleString('en-US', {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    });
    return `${sign}$${formatted}`;
  }

  if (currency === 'USDT') {
    const d = decimals ?? (absVal > 0 && absVal < 1 ? 4 : 2);
    const formatted = absVal.toLocaleString('en-US', {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    });
    return `${sign}${formatted} USDT`;
  }

  if (currency === 'BTC') {
    return `${sign}${absVal.toFixed(decimals ?? 8)} BTC`;
  }

  const rounded = Math.round(absVal).toLocaleString('ko-KR');
  return krwStyle === 'unit' ? `${sign}${rounded}원` : `${sign}₩${rounded}`;
}

export function getCurrencySymbol(currency: SupportedCurrency = 'KRW'): string {
  switch (currency) {
    case 'USD': return '$';
    case 'USDT': return 'USDT';
    case 'BTC': return 'BTC';
    default: return '₩';
  }
}

export function formatMarketCapByCurrency(marketCap: number, currency: SupportedCurrency = 'KRW'): string {
  if (!Number.isFinite(marketCap) || marketCap <= 0) return '-';
  if (currency === 'USD') {
    // Stock.marketCap for US is stored in 억 달러 (100M USD) or M USD depending on provider;
    // existing US server calculation uses Math.round((price * shares) / 100000000) -> 억 달러
    if (marketCap >= 10000) {
      return `$${(marketCap / 10).toFixed(1)}B (${(marketCap / 10000).toFixed(1)}조 달러)`;
    }
    return `$${(marketCap / 10).toFixed(1)}B (${marketCap.toLocaleString()}억 달러)`;
  }
  if (marketCap >= 10000) {
    return `${(marketCap / 10000).toFixed(1)}조 원`;
  }
  return `${marketCap.toLocaleString()}억 원`;
}

export function formatTradingValueByCurrency(tradingValue: number, currency: SupportedCurrency = 'KRW'): string {
  if (!Number.isFinite(tradingValue) || tradingValue <= 0) return '-';
  if (currency === 'USD') {
    // Stock.tradingValue for US is stored in 백만 달러 ($M)
    if (tradingValue >= 1000) {
      return `$${(tradingValue / 1000).toFixed(2)}B`;
    }
    return `$${tradingValue.toLocaleString()}M`;
  }
  if (currency === 'USDT') {
    if (tradingValue >= 1000) return `$${(tradingValue / 1000).toFixed(2)}B`;
    return `$${tradingValue.toLocaleString()}M`;
  }
  if (tradingValue >= 10000) {
    return `${(tradingValue / 10000).toFixed(1)}조 원`;
  }
  return `${tradingValue.toLocaleString()}억 원`;
}

export interface ExchangeRateValidation {
  valid: boolean;
  rate: number | null;
  status: 'ok' | 'delayed' | 'stale' | 'error' | 'unavailable';
  lastUpdated: string;
  reason?: string;
}

/**
 * Validates exchange rate metadata strictly.
 * Rejects missing, <= 0, stale, error, or unavailable rates so NO arbitrary fallback conversion runs.
 */
export function validateExchangeRate(fx?: Partial<ExchangeRate> | null): ExchangeRateValidation {
  if (!fx) {
    return {
      valid: false,
      rate: null,
      status: 'unavailable',
      lastUpdated: '-',
      reason: '환율 정보를 수신하지 못했습니다.',
    };
  }

  const rate = typeof fx.rate === 'number' && Number.isFinite(fx.rate) && fx.rate > 0 ? fx.rate : null;
  const status = fx.status || (fx.isStale ? 'stale' : rate ? 'ok' : 'unavailable');
  const lastUpdated = fx.lastUpdated || '-';

  if (rate === null) {
    return {
      valid: false,
      rate: null,
      status: status === 'ok' ? 'error' : status,
      lastUpdated,
      reason: fx.errorMessage || '유효한 USD/KRW 환율 값이 없습니다.',
    };
  }

  if (fx.isStale || status === 'stale' || status === 'error' || status === 'unavailable') {
    return {
      valid: false,
      rate,
      status: status === 'ok' ? 'stale' : status,
      lastUpdated,
      reason: fx.errorMessage || '실시간 환율 지연/만료 상태로 KRW 환산을 중단했습니다.',
    };
  }

  return {
    valid: true,
    rate,
    status,
    lastUpdated,
  };
}

/**
 * Converts a monetary amount to KRW ONLY when exchange rate is valid (for USD).
 */
export function convertToKRW(
  amount: number,
  currency: SupportedCurrency,
  fx?: Partial<ExchangeRate> | null
): { valid: boolean; valueKRW: number | null; rateUsed: number | null; reason?: string } {
  if (currency === 'KRW') {
    return { valid: true, valueKRW: Math.round(amount), rateUsed: 1 };
  }

  const check = validateExchangeRate(fx);
  if (!check.valid || check.rate === null) {
    return {
      valid: false,
      valueKRW: null,
      rateUsed: check.rate,
      reason: check.reason,
    };
  }

  return {
    valid: true,
    valueKRW: Math.round(amount * check.rate),
    rateUsed: check.rate,
  };
}

export interface CurrencyAssetMetrics {
  currency: FiatCurrency;
  cash: number;
  initialCash: number;
  investedCost: number;
  evaluationAmount: number;
  unrealizedPnL: number;
  realizedPnL: number;
  totalPnL: number;
  totalAssets: number;
  returnRatePercent: number;
  holdingsCount: number;
}

export interface MultiCurrencyPortfolioAggregation {
  krw: CurrencyAssetMetrics;
  usd: CurrencyAssetMetrics;
  fx: ExchangeRateValidation;
  missingQuoteCount: number;
  convertedKRW: {
    totalAssets: number;
    totalCash: number;
    investedCost: number;
    evaluationAmount: number;
    unrealizedPnL: number;
    realizedPnL: number;
    /** Stock performance P&L at entry FX (or current FX when entry FX is unavailable) */
    stockPnLKRW: number;
    /** FX rate fluctuation P&L on USD cost basis when entry FX exists */
    fxPnLKRW: number;
    totalPnL: number;
    returnRatePercent: number;
    hasEntryFxData: boolean;
  } | null;
}

export interface AggregatablePosition {
  symbol: string;
  currency?: 'KRW' | 'USD';
  market?: string;
  quantity: number;
  avgBuyPrice: number;
  totalCost: number;
  currentPrice?: number | null;
  entryExchangeRate?: number;
}

export interface AggregatableRealizedTrade {
  symbol?: string;
  currency?: 'KRW' | 'USD';
  market?: string;
  realizedProfit?: number;
  exchangeRate?: number;
}

/**
 * Pure portfolio aggregation separating KRW & USD natively and computing
 * stock-only P&L vs FX-fluctuation P&L cleanly without mixing raw currencies.
 */
export function aggregateMultiCurrencyPortfolio(params: {
  positions: AggregatablePosition[];
  realizedTrades?: AggregatableRealizedTrade[];
  cashKRW?: number;
  initialCashKRW?: number;
  cashUSD?: number;
  initialCashUSD?: number;
  fx?: Partial<ExchangeRate> | null;
  fallbackValuationToCost?: boolean;
}): MultiCurrencyPortfolioAggregation {
  const {
    positions = [],
    realizedTrades = [],
    cashKRW = 0,
    initialCashKRW = 0,
    cashUSD = 0,
    initialCashUSD = 0,
    fx,
    fallbackValuationToCost = false,
  } = params;

  const fxCheck = validateExchangeRate(fx);
  let missingQuoteCount = 0;

  let krwCost = 0;
  let krwValuation = 0;
  let krwCount = 0;

  let usdCost = 0;
  let usdValuation = 0;
  let usdCount = 0;

  let usdCostAtEntryFxKRW = 0;
  let usdValuationAtEntryFxKRW = 0;
  let hasEntryFxData = false;

  for (const pos of positions) {
    const cur = inferFiatCurrency(pos.symbol, pos.market, pos.currency);
    const hasPrice = typeof pos.currentPrice === 'number' && Number.isFinite(pos.currentPrice) && pos.currentPrice > 0;
    if (!hasPrice) missingQuoteCount++;

    const rawValuation = hasPrice
      ? pos.currentPrice! * pos.quantity
      : (fallbackValuationToCost ? pos.totalCost : 0);

    if (cur === 'USD') {
      usdCount++;
      usdCost += pos.totalCost;
      usdValuation += rawValuation;

      if (pos.entryExchangeRate && pos.entryExchangeRate > 0) {
        hasEntryFxData = true;
        usdCostAtEntryFxKRW += pos.totalCost * pos.entryExchangeRate;
        usdValuationAtEntryFxKRW += rawValuation * pos.entryExchangeRate;
      } else if (fxCheck.valid && fxCheck.rate) {
        usdCostAtEntryFxKRW += pos.totalCost * fxCheck.rate;
        usdValuationAtEntryFxKRW += rawValuation * fxCheck.rate;
      }
    } else {
      krwCount++;
      krwCost += pos.totalCost;
      krwValuation += rawValuation;
    }
  }

  let krwRealized = 0;
  let usdRealized = 0;
  let usdRealizedStockKRW = 0;
  let usdRealizedFxKRW = 0;

  for (const t of realizedTrades) {
    if (t.realizedProfit === undefined || !Number.isFinite(t.realizedProfit)) continue;
    const cur = inferFiatCurrency(t.symbol, t.market, t.currency);
    if (cur === 'USD') {
      usdRealized += t.realizedProfit;
      if (t.exchangeRate && t.exchangeRate > 0) {
        usdRealizedStockKRW += t.realizedProfit * t.exchangeRate;
        if (fxCheck.valid && fxCheck.rate) {
          usdRealizedFxKRW += t.realizedProfit * (fxCheck.rate - t.exchangeRate);
        }
      } else if (fxCheck.valid && fxCheck.rate) {
        usdRealizedStockKRW += t.realizedProfit * fxCheck.rate;
      }
    } else {
      krwRealized += t.realizedProfit;
    }
  }

  const krwCostRounded = Math.round(krwCost);
  const krwValRounded = Math.round(krwValuation);
  const krwUnrealized = krwValRounded - krwCostRounded;
  const krwRealizedRounded = Math.round(krwRealized);
  const krwTotalPnL = krwUnrealized + krwRealizedRounded;
  const krwTotalAssets = Math.round(cashKRW) + krwValRounded;
  const krwDenominator = initialCashKRW > 0 ? initialCashKRW : krwCostRounded;
  const krwReturnRate = krwDenominator > 0
    ? Number((((initialCashKRW > 0 ? (krwTotalAssets - initialCashKRW) : krwUnrealized) / krwDenominator) * 100).toFixed(2))
    : 0;

  const usdCostRounded = Number(usdCost.toFixed(2));
  const usdValRounded = Number(usdValuation.toFixed(2));
  const usdUnrealized = Number((usdValRounded - usdCostRounded).toFixed(2));
  const usdRealizedRounded = Number(usdRealized.toFixed(2));
  const usdTotalPnL = Number((usdUnrealized + usdRealizedRounded).toFixed(2));
  const usdTotalAssets = Number((cashUSD + usdValRounded).toFixed(2));
  const usdDenominator = initialCashUSD > 0 ? initialCashUSD : usdCostRounded;
  const usdReturnRate = usdDenominator > 0
    ? Number((((initialCashUSD > 0 ? (usdTotalAssets - initialCashUSD) : usdUnrealized) / usdDenominator) * 100).toFixed(2))
    : 0;

  const krw: CurrencyAssetMetrics = {
    currency: 'KRW',
    cash: Math.round(cashKRW),
    initialCash: Math.round(initialCashKRW),
    investedCost: krwCostRounded,
    evaluationAmount: krwValRounded,
    unrealizedPnL: krwUnrealized,
    realizedPnL: krwRealizedRounded,
    totalPnL: krwTotalPnL,
    totalAssets: krwTotalAssets,
    returnRatePercent: krwReturnRate,
    holdingsCount: krwCount,
  };

  const usd: CurrencyAssetMetrics = {
    currency: 'USD',
    cash: Number(cashUSD.toFixed(2)),
    initialCash: Number(initialCashUSD.toFixed(2)),
    investedCost: usdCostRounded,
    evaluationAmount: usdValRounded,
    unrealizedPnL: usdUnrealized,
    realizedPnL: usdRealizedRounded,
    totalPnL: usdTotalPnL,
    totalAssets: usdTotalAssets,
    returnRatePercent: usdReturnRate,
    holdingsCount: usdCount,
  };

  let convertedKRW: MultiCurrencyPortfolioAggregation['convertedKRW'] = null;
  if (fxCheck.valid && fxCheck.rate !== null) {
    const rate = fxCheck.rate;
    const totalCashKRW = Math.round(cashKRW + cashUSD * rate);
    const usdCostAtCurrentFx = Math.round(usdCost * rate);
    const usdValAtCurrentFx = Math.round(usdValuation * rate);
    const totalInvestedCostKRW = krwCostRounded + usdCostAtCurrentFx;
    const totalEvalKRW = krwValRounded + usdValAtCurrentFx;
    const totalUnrealizedCurrentFx = krwUnrealized + Math.round(usdUnrealized * rate);
    const totalRealizedCurrentFx = krwRealizedRounded + Math.round(usdRealized * rate);

    // Separate pure stock performance vs FX rate effect:
    // If entry FX exists, stockPnL uses entry FX and fxPnL captures valuation delta from FX shift.
    // Otherwise, stockPnL is evaluated at current FX and fxPnL is 0.
    const usdStockUnrealizedKRW = Math.round(usdValuationAtEntryFxKRW - usdCostAtEntryFxKRW);
    const stockPnLKRW = krwUnrealized + krwRealizedRounded + usdStockUnrealizedKRW + Math.round(usdRealizedStockKRW);
    const fxUnrealizedKRW = hasEntryFxData
      ? Math.round((usdValAtCurrentFx - usdCostAtEntryFxKRW) - usdStockUnrealizedKRW)
      : 0;
    const fxPnLKRW = fxUnrealizedKRW + Math.round(usdRealizedFxKRW);

    const totalAssetsCombined = totalCashKRW + totalEvalKRW;
    const initialCombinedKRW = initialCashKRW + (initialCashUSD > 0 ? Math.round(initialCashUSD * rate) : 0);
    const totalPnLCombined = initialCombinedKRW > 0
      ? totalAssetsCombined - initialCombinedKRW
      : totalUnrealizedCurrentFx + totalRealizedCurrentFx;
    const denom = initialCombinedKRW > 0 ? initialCombinedKRW : totalInvestedCostKRW;
    const combinedRoi = denom > 0 ? Number(((totalPnLCombined / denom) * 100).toFixed(2)) : 0;

    convertedKRW = {
      totalAssets: totalAssetsCombined,
      totalCash: totalCashKRW,
      investedCost: totalInvestedCostKRW,
      evaluationAmount: totalEvalKRW,
      unrealizedPnL: totalUnrealizedCurrentFx,
      realizedPnL: totalRealizedCurrentFx,
      stockPnLKRW,
      fxPnLKRW,
      totalPnL: totalPnLCombined,
      returnRatePercent: combinedRoi,
      hasEntryFxData,
    };
  }

  return {
    krw,
    usd,
    fx: fxCheck,
    missingQuoteCount,
    convertedKRW,
  };
}
