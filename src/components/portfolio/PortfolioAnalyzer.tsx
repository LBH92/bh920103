import React, { useEffect, useState } from 'react';
import { portfolioAnalyzerService } from '../../services/portfolioAnalyzerService';
import { PortfolioSummary, PortfolioHolding } from '../../types';
import { AverageBuyPriceSimulator } from './AverageBuyPriceSimulator';

interface Props {
  uid: string;
}

export const PortfolioAnalyzer: React.FC<Props> = ({ uid }) => {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedHolding, setSelectedHolding] = useState<PortfolioHolding | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await portfolioAnalyzerService.getPortfolioSummary(uid);
      setSummary(data);
      setLoading(false);
    };
    fetchData();
  }, [uid]);

  if (loading) return <div>Loading...</div>;
  if (!summary) return <div>Failed to load portfolio</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Portfolio Summary</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-500">Total Assets</p>
          <p className="text-lg font-semibold">{summary.totalAssets.toLocaleString()} KRW</p>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-500">Total PnL</p>
          <p className={`text-lg font-semibold ${summary.totalPnL >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
            {summary.totalPnL >= 0 ? '+' : ''}{summary.totalPnL.toLocaleString()} KRW
          </p>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-2">Holdings</h3>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Qty</th>
            <th>Avg Price</th>
            <th>Market Value</th>
            <th>PnL</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {summary.holdings.map(h => (
            <tr key={h.symbol} className="border-b">
              <td>{h.symbol}</td>
              <td>{h.quantity}</td>
              <td>{h.avgBuyPrice.toLocaleString()}</td>
              <td>{h.marketValue.toLocaleString()}</td>
              <td className={h.unrealizedPnL >= 0 ? 'text-red-500' : 'text-blue-500'}>
                {h.unrealizedPnL >= 0 ? '+' : ''}{h.unrealizedPnL.toLocaleString()}
              </td>
              <td>
                <button 
                  onClick={() => setSelectedHolding(h)}
                  className="text-xs bg-gray-200 px-2 py-1 rounded"
                >
                  시뮬레이션
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedHolding && (
        <div className="mt-6">
          <AverageBuyPriceSimulator 
            symbol={selectedHolding.symbol}
            currentQty={selectedHolding.quantity}
            currentAvgPrice={selectedHolding.avgBuyPrice}
            commissionRate={0.00015} // Simplified default
            taxRate={0.0018} // Simplified default
          />
        </div>
      )}
    </div>
  );
};
