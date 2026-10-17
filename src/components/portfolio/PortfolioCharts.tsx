import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { VirtualHolding } from '../../types';

interface PortfolioChartsProps {
  holdings: VirtualHolding[];
  quotesMap: Map<string, { price: number }>;
  exchangeRate?: { rate: number };
}

const COLORS = ['#f43f5e', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#64748b'];

export const PortfolioCharts: React.FC<PortfolioChartsProps> = ({ holdings, quotesMap, exchangeRate }) => {
  const currentRate = exchangeRate?.rate || 1400;

  const chartData = holdings.map(h => {
    const quote = quotesMap.get(h.symbol);
    const isUSD = h.currency === 'USD';
    const price = quote?.price || 0;
    const valuation = price * h.quantity;
    const valuationKRW = isUSD ? valuation * currentRate : valuation;
    const cost = h.totalBuyAmount * (isUSD ? currentRate : 1);
    const profit = valuationKRW - cost;

    return {
      name: h.name,
      valuation: Math.max(0, valuationKRW),
      profit: profit,
    };
  }).filter(d => d.valuation > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-6 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-white mb-6">자산 비중 (파이 차트)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} dataKey="valuation" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {chartData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="p-6 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-white mb-6">종목별 손익 (바 차트)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="profit" fill="#8884d8">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#f43f5e' : '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
