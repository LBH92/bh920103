import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { PieChart as PieIcon, BarChart2 } from 'lucide-react';
import { VirtualHolding } from '../../types';

interface PortfolioChartsProps {
  holdings: VirtualHolding[];
  quotesMap: Map<string, { price: number; change?: number; changePercent?: number }>;
  exchangeRate?: { rate: number };
  onSelectStock?: (symbol: string) => void;
}

const PALETTE = [
  '#f43f5e', // rose-500
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // purple-500
  '#06b6d4', // cyan-500
  '#ec4899', // pink-500
  '#64748b', // slate-500
];

export const PortfolioCharts: React.FC<PortfolioChartsProps> = ({
  holdings,
  quotesMap,
  exchangeRate,
  onSelectStock
}) => {
  const currentRate = exchangeRate?.rate || 1400;

  const chartData = holdings.map(h => {
    const quote = quotesMap.get(h.symbol);
    const isUSD = h.currency === 'USD';
    const price = quote?.price || 0;
    const valuation = price * h.quantity;
    const valuationKRW = isUSD ? valuation * currentRate : valuation;
    const cost = h.totalBuyAmount * (isUSD ? currentRate : 1);
    const profit = valuationKRW - cost;
    const profitRate = cost > 0 ? (profit / cost) * 100 : 0;

    return {
      symbol: h.symbol,
      name: h.name || h.symbol,
      valuation: Math.max(0, Math.round(valuationKRW)),
      profit: Math.round(profit),
      profitRate: Number(profitRate.toFixed(2)),
      cost: Math.round(cost),
      quantity: h.quantity,
      currency: h.currency,
    };
  }).filter(d => d.valuation > 0 || Math.abs(d.profit) > 0);

  const totalValuation = chartData.reduce((sum, d) => sum + d.valuation, 0);

  if (chartData.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <PieIcon className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
          차트를 표시할 보유 자산 데이터가 없습니다.
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          종목을 등록하시면 자산 비중과 평가손익 차트가 실시간으로 시각화됩니다.
        </p>
      </div>
    );
  }

  // Safe handler to navigate without crashing
  const handleItemClick = (sym?: string) => {
    if (sym && typeof sym === 'string' && onSelectStock) {
      onSelectStock(sym);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 select-none">
      {/* 1. Asset Allocation Pie Chart */}
      <div className="p-6 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm outline-none focus:outline-none">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-rose-500" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              자산 비중 (파이 차트)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            총 평가액 {totalValuation.toLocaleString()}원
          </span>
        </div>

        {/* CSS outline reset container to prevent square bounding box on click */}
        <div 
          tabIndex={-1}
          style={{ outline: 'none' }}
          className="w-full h-[300px] outline-none focus:outline-none focus:ring-0 [&_*]:outline-none [&_*:focus]:outline-none [&_.recharts-surface]:outline-none [&_.recharts-pie]:outline-none [&_path]:outline-none cursor-pointer"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart style={{ outline: 'none' }}>
              <Pie
                data={chartData}
                dataKey="valuation"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={95}
                innerRadius={45}
                paddingAngle={3}
                isAnimationActive={false}
                onClick={(entry: any) => handleItemClick(entry?.symbol)}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-pie-${index}`}
                    fill={PALETTE[index % PALETTE.length]}
                    style={{ outline: 'none', cursor: 'pointer' }}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const weight = totalValuation > 0 ? ((data.valuation / totalValuation) * 100).toFixed(1) : '0';
                    return (
                      <div className="p-3 bg-white dark:bg-[#1c2333] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl text-xs space-y-1">
                        <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-1.5 font-bold">
                          <span className="text-slate-900 dark:text-white">{data.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{data.symbol}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 pt-1 text-slate-600 dark:text-slate-300">
                          <span>평가금액:</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            {data.valuation.toLocaleString()}원
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-slate-600 dark:text-slate-300">
                          <span>비중:</span>
                          <span className="font-mono font-bold text-rose-500">
                            {weight}%
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 pt-1 text-center">클릭 시 종목 상세 이동</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                formatter={(value: string) => (
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300 mr-2">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Profit & Loss Bar Chart */}
      <div className="p-6 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm outline-none focus:outline-none">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-500" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              종목별 평가손익 (바 차트)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-sans">
            손익(원) / 클릭 시 종목 이동
          </span>
        </div>

        <div 
          tabIndex={-1}
          style={{ outline: 'none' }}
          className="w-full h-[300px] outline-none focus:outline-none focus:ring-0 [&_*]:outline-none [&_*:focus]:outline-none [&_.recharts-surface]:outline-none [&_path]:outline-none cursor-pointer"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              style={{ outline: 'none' }}
              onClick={(state: any) => {
                const sym = state?.activePayload?.[0]?.payload?.symbol || state?.symbol;
                handleItemClick(sym);
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                stroke="#64748b"
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                stroke="#64748b"
                tickFormatter={(val) => {
                  if (Math.abs(val) >= 10000000) return `${(val / 100000000).toFixed(1)}억`;
                  if (Math.abs(val) >= 10000) return `${(val / 10000).toFixed(0)}만`;
                  return `${val}`;
                }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const isProfit = data.profit >= 0;
                    return (
                      <div className="p-3 bg-white dark:bg-[#1c2333] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl text-xs space-y-1">
                        <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-1.5 font-bold">
                          <span className="text-slate-900 dark:text-white">{data.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{data.symbol}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 pt-1">
                          <span className="text-slate-600 dark:text-slate-300">평가손익:</span>
                          <span className={`font-mono font-bold ${isProfit ? 'text-rose-500' : 'text-blue-500'}`}>
                            {isProfit ? '+' : ''}{data.profit.toLocaleString()}원 ({isProfit ? '+' : ''}{data.profitRate}%)
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-slate-600 dark:text-slate-300">
                          <span>투자원금:</span>
                          <span className="font-mono">{data.cost.toLocaleString()}원</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-slate-600 dark:text-slate-300">
                          <span>현재평가액:</span>
                          <span className="font-mono">{data.valuation.toLocaleString()}원</span>
                        </div>
                        <p className="text-[10px] text-slate-400 pt-1 text-center">클릭 시 종목 상세 이동</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="profit"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
                style={{ cursor: 'pointer' }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-bar-${index}`}
                    fill={entry.profit >= 0 ? '#f43f5e' : '#3b82f6'}
                    style={{ outline: 'none', cursor: 'pointer' }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
