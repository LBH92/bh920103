export const formatTradingValue = (value: number): string => {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}조`;
  }
  return `${value.toLocaleString()}억`;
};
