import React, { useState, useEffect } from 'react';
import { portfolioService } from '../../services/portfolioService';
import { calendarService } from '../../services/calendarService';
import { CalendarEvent, PortfolioHolding } from '../../types';

export const DividendCalculator: React.FC<{ uid: string }> = ({ uid }) => {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [dividendEvents, setDividendEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const holdingsData = await portfolioService.getVirtualHoldings(uid);
      // For simplicity, we directly fetch holdings and calculate valuation
      // In a real scenario, use portfolioAnalyzerService or aggregate data
      const summary = await import('../../services/portfolioAnalyzerService').then(s => s.portfolioAnalyzerService.getPortfolioSummary(uid));
      
      const events = await calendarService.getEvents({ type: 'DIVIDEND' });
      
      setHoldings(summary.holdings);
      setDividendEvents(events.events);
      setLoading(false);
    };
    loadData();
  }, [uid]);

  if (loading) return <div>Loading dividend data...</div>;

  // Calculate annual dividends (simplified: sum of events * holdings qty)
  const calculateAnnualDividend = (holding: PortfolioHolding) => {
    const relevantEvents = dividendEvents.filter(e => e.symbol === holding.symbol);
    return relevantEvents.reduce((sum, e) => sum + (parseFloat(e.dividendAmount || '0') * holding.quantity), 0);
  };

  return (
    <div className="p-4 bg-white rounded shadow-md mt-4">
      <h2 className="text-xl font-bold mb-4">배당 수익 계산기</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>종목</th>
            <th>보유수량</th>
            <th>주당 예상배당</th>
            <th>연간 예상배당(세전)</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map(h => {
            const annual = calculateAnnualDividend(h);
            return (
              <tr key={h.symbol} className="border-t">
                <td>{h.symbol}</td>
                <td>{h.quantity}</td>
                <td>-</td>
                <td>{annual.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
