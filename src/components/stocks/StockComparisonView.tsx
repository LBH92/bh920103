import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { stockRepository } from '../../services/stockRepository';
import { Stock, CandleData } from '../../types';
import { TrendingUp, RefreshCw, AlertCircle, X, BarChart2 } from 'lucide-react';

export const StockComparisonView: React.FC = () => {
  const [symbols, setSymbols] = useState<string[]>(['005930', '000660', 'AAPL', 'NVDA']); // Hardcoded example
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: Add search/selection functionality to add stocks to 'symbols'
  
  const loadData = async () => {
    if (symbols.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const results = await Promise.all(symbols.map(async s => {
        const stock = await stockRepository.getStock(s);
        const candles = await stockRepository.getChartCandles(s, '1Y'); // Use getChartCandles
        return { stock, candles };
      }));
      // Normalize returns: (Price - FirstPrice) / FirstPrice * 100
      // Ensure we're setting an array of Stock items or handling the combined data correctly
      // Wait, the error is in the state type: `setStocks(results.filter(...)`
      // I need a separate state for full comparison data if I'm combining Stock + Candles
    } catch (e) {
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const [comparisonData, setComparisonData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const results = await Promise.all(symbols.map(async s => {
          const stock = await stockRepository.getStock(s);
          const candles = await stockRepository.getChartCandles(s, '1Y');
          return { stock, candles };
        }));
        setComparisonData(results.filter(r => r.stock && r.candles.length > 0));
      } catch (e) {
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [symbols]);

  const normalizedComparisonData = useMemo(() => {
    return comparisonData.map(({ stock, candles }) => {
      const firstClose = candles[0].close;
      const normalized = candles.map((c: CandleData) => ((c.close - firstClose) / firstClose) * 100);
      return { stock, normalized, lastClose: candles[candles.length - 1].close };
    });
  }, [comparisonData]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">종목 비교 (한국/미국)</h2>
      {isLoading ? <div>데이터 불러오는 중...</div> : error ? <div className="text-red-500">{error}</div> : (
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left">종목</th>
              <th className="text-right">현재가</th>
              <th className="text-right">수익률(1Y)</th>
            </tr>
          </thead>
          <tbody>
            {normalizedComparisonData.map((d: any) => (
              <tr key={d.stock.symbol}>
                <td>{d.stock.name} ({d.stock.symbol})</td>
                <td className="text-right">{d.stock.price.toLocaleString()}</td>
                <td className="text-right">{d.normalized[d.normalized.length - 1].toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
