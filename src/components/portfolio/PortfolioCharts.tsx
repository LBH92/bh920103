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
import { PieChart as PieIcon, BarChart2, AlertTriangle } from 'lucide-react';
import { ExchangeRate, VirtualHolding } from '../../types';
import { formatMoney, inferFiatCurrency, validateExchangeRate } from '../../utils/currency';

interface PortfolioChartsProps {
  holdings: VirtualHolding[];
  quotesMap: Map<string, { price: number; change?: number; changePercent?: number }>;
  exchangeRate?: Partial<ExchangeRate> | null;
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
  const fxCheck = validateExchangeRate(exchangeRate);
  const hasUsdHoldings = holdings.some(h => inferFiatCurrency(h.symbol, h.market, h.currency) === 'USD');

  if (hasUsdHoldings && !fxCheck.valid) {
    return (
      <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 shadow-sm text-center space-y-2">
        <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-500 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <h4 className="font-bold text-sm text-rose-700 dark:text-rose-300">
          환율 정보 지연/오류로 통화 혼합 포트폴리오 차트 환산을 일시 중단했습니다
        </h4>
        <p className="text-xs text-rose-600/90 dark:text-rose-400">
          {fxCheck.reason || '실시간 USD/KRW 환율이 정상 수신되면 KRW 및 USD 자산을 기준통화로 환산해 차트를 표시합니다.'}
        </p>
      </div>
    );
  }

  const rate = fxCheck.rate ?? 1;

  const chartData = holdings.map(h => {
    const quote = quotesMap.get(h.symbol);
    const cur = inferFiatCurrency(h.symbol, h.market, h.currency);
    const isUSD = cur === 'USD';
    const price = quote?.price || 0;
    const nativeValuation = price * h.quantity;
    const nativeCost = h.totalBuyAmount;
    const nativeProfit = nativeValuation - nativeCost;
    const valuationKRW = isUSD ? nativeValuation * rate : nativeValuation;
    const costKRW = isUSD ? nativeCost * rate : nativeCost;
    const profitKRW = valuationKRW - costKRW;
    const profitRate = nativeCost > 0 ? (nativeProfit / nativeCost) * 100 : 0;

    return {
      symbol: h.symbol,
      name: h.name || h.symbol,
      valuation: Math.max(0, Math.round(valuationKRW)),
      profit: Math.round(profitKRW),
      cost: Math.round(costKRW),
      nativeValuation,
      nativeCost,
      nativeProfit,
      profitRate: Number(profitRate.toFixed(2)),
      quantity: h.quantity,
      currency: cur,
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
              자산 비중 (KRW 환산 기준)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            총 평가액 {formatMoney(totalValuation, 'KRW')}
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
                          <span className="text-[10px] text-slate-400 font-mono">{data.symbol} · {data.currency}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 pt-1 text-slate-600 dark:text-slate-300">
                          <span>평가금액:</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            {formatMoney(data.nativeValuation, data.currency)}
                            {data.currency === 'USD' && ` (≈ ${formatMoney(data.valuation, 'KRW')})`}
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
              종목별 평가손익 (KRW 환산 기준)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-sans">
            손익(₩) / 클릭 시 종목 이동
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
                    const isProfit = data.nativeProfit >= 0;
                    return (
                      <div className="p-3 bg-white dark:bg-[#1c2333] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl text-xs space-y-1">
                        <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-1.5 font-bold">
                          <span className="text-slate-900 dark:text-white">{data.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{data.symbol} · {data.currency}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 pt-1">
                          <span className="text-slate-600 dark:text-slate-300">원화환산 손익:</span>
                          <span className={`font-mono font-bold ${data.profit >= 0 ? 'text-rose-500' : 'text-blue-500'}`}>
                            {formatMoney(data.profit, 'KRW', { showSign: true })} ({isProfit ? '+' : ''}{data.profitRate}%)
                          </span>
                        </div>
                        {data.currency === 'USD' && (
                          <div className="flex items-center justify-between gap-4 text-slate-600 dark:text-slate-300">
                            <span>원화 외 종목손익:</span>
                            <span className={`font-mono font-bold ${isProfit ? 'text-rose-500' : 'text-blue-500'}`}>
                              {formatMoney(data.nativeProfit, 'USD', { showSign: true })}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between gap-4 text-slate-600 dark:text-slate-300">
                          <span>투자원금:</span>
                          <span className="font-mono">{formatMoney(data.nativeCost, data.currency)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-slate-600 dark:text-slate-300">
                          <span>현재평가액:</span>
                          <span className="font-mono">{formatMoney(data.nativeValuation, data.currency)}</span>
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
