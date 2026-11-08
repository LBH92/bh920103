/**
 * Utility to standardize stock ticker symbols for US exchanges (NYSE, NASDAQ, AMEX).
 */

export const standardizeTicker = (symbol: string): string => {
  if (!symbol) return '';

  // 1. Basic standardization: uppercase, trim, and remove trailing dots
  const ticker = symbol.toUpperCase().trim().replace(/\.$/, '');

  // 2. Handle known US ticker quirks (e.g., BRK-B -> BRK.B, BF-B -> BF.B)
  const dotNormalized = ticker.replace(/-/g, '.');

  // Standard symbols keep uppercase letters, digits, and internal dots.
  return dotNormalized.replace(/[^A-Z0-9\.]/g, '');
};

/**
 * Checks if a symbol represents a US stock/ETF/ADR ticker format
 * Supports standard 1-5 char tickers (AAPL, TSLA, SPY) and share-class tickers (BRK.B, BRK-B, BF.B)
 */
export const isUSStockSymbol = (symbol: string): boolean => {
  if (!symbol || typeof symbol !== 'string') return false;
  const clean = symbol.toUpperCase().trim();
  return /^[A-Z]{1,5}([.-][A-Z]{1,3})?$/.test(clean);
};

/**
 * Converts standard display symbol to provider query format
 * E.g. 'BRK.B' -> 'BRK-B' for Yahoo Finance query, while preserving 'BRK.B' for display/storage
 */
export const toProviderTicker = (symbol: string): string => {
  if (!symbol) return '';
  return symbol.toUpperCase().trim().replace(/\./g, '-');
};

/**
 * Converts provider query symbol back to standard display format
 * E.g. 'BRK-B' -> 'BRK.B'
 */
export const fromProviderTicker = (symbol: string): string => {
  if (!symbol) return '';
  return symbol.toUpperCase().trim().replace(/-/g, '.');
};

