import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { stockRepository } from '../../services/stockRepository';
import { Stock, CandleData } from '../../types';
import { 
  Layers, 
  Search, 
  X, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  SlidersHorizontal, 
  Sparkles, 
  Check, 
  Info,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { PriceBadge } from '../common/PriceBadge';
import { MarketBadge } from '../common/MarketBadge';

interface ComparedStockData {
  stock: Stock;
  candles: CandleData[];
  normalized: number[]; // Percentage return relative to first candle
  periodReturn: number;
}

const STOCK_COLORS = [
  '#f43f5e', // Rose
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
];

const PRESETS = [
  { name: '글로벌 반도체', symbols: ['005930', '000660', 'NVDA', 'TSM'] },
  { name: '빅테크 매그니피센트', symbols: ['AAPL', 'MSFT', 'GOOGL', 'TSLA'] },
  { name: '국내 2차전지', symbols: ['373220', '247540', '086520', '051910'] },
  { name: '주요 가상자산', symbols: ['KRW-BTC', 'KRW-ETH', 'KRW-SOL', 'KRW-XRP'] },
];

export const StockComparisonView: React.FC = () => {
  const { navigateToStock, exchangeRate } = useApp();

  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(['005930', '000660', 'NVDA', 'AAPL']);
  const [period, setPeriod] = useState<'1W' | '1M' | '3M' | '1Y'>('3M');
  const [comparedData, setComparedData] = useState<ComparedStockData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search autocomplete state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Debounced search for adding stocks
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await stockRepository.searchStocks({ query: q, limit: 8 });
        setSearchResults(results);
        setShowSearchDropdown(true);
      } catch (err) {
        console.warn('[StockComparison] search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch candle data and stock quotes for selected symbols
  const loadComparisonData = async () => {
    if (selectedSymbols.length === 0) {
      setComparedData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const results: ComparedStockData[] = [];

      for (const symbol of selectedSymbols) {
        try {
          const [stock, candles] = await Promise.all([
            stockRepository.getStock(symbol),
            stockRepository.getChartCandles(symbol, period),
          ]);

          if (stock && candles && candles.length > 0) {
            const firstClose = candles[0].close || 1;
            const normalized = candles.map(c => ((c.close - firstClose) / firstClose) * 100);
            const lastClose = candles[candles.length - 1].close;
            const periodReturn = ((lastClose - firstClose) / firstClose) * 100;

            results.push({
              stock,
              candles,
              normalized,
              periodReturn,
            });
          }
        } catch (err) {
          console.warn(`[StockComparison] Failed to load data for ${symbol}:`, err);
        }
      }

      setComparedData(results);
    } catch (e: any) {
      setError('종목 비교 데이터를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComparisonData();
  }, [selectedSymbols, period]);

  const handleAddStock = (symbol: string) => {
    if (selectedSymbols.includes(symbol)) return;
    if (selectedSymbols.length >= 6) {
      alert('동시 비교는 최대 6개 종목까지 지원됩니다.');
      return;
    }
    setSelectedSymbols(prev => [...prev, symbol]);
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  const handleRemoveStock = (symbol: string) => {
    setSelectedSymbols(prev => prev.filter(s => s !== symbol));
  };

  const handleApplyPreset = (symbols: string[]) => {
    setSelectedSymbols(symbols);
  };

  // SVG Chart Calculations
  const chartMetrics = useMemo(() => {
    if (comparedData.length === 0) return null;

    let minVal = 0;
    let maxVal = 0;
    let maxPoints = 0;

    comparedData.forEach(d => {
      d.normalized.forEach(v => {
        if (v < minVal) minVal = v;
        if (v > maxVal) maxVal = v;
      });
      if (d.candles.length > maxPoints) maxPoints = d.candles.length;
    });

    // Add 10% breathing room to y-axis
    const range = Math.max(Math.abs(maxVal - minVal), 5);
    const yMin = Math.floor(minVal - range * 0.1);
    const yMax = Math.ceil(maxVal + range * 0.1);

    return { yMin, yMax, maxPoints };
  }, [comparedData]);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-purple-500" />
            <span>종목 다중 비교 (한국 · 미국 · 가상자산)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            국내 주식, 미국 빅테크, 주요 가상자산의 누적 수익률과 핵심 재무 지표를 실시간 비교하세요.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold self-start sm:self-auto">
          {(['1W', '1M', '3M', '1Y'] as const).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                period === p
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Quick Buttons & Search Box */}
      <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Preset Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              추천 테마:
            </span>
            {PRESETS.map(preset => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset.symbols)}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 transition-colors shrink-0 cursor-pointer border border-transparent hover:border-purple-300 dark:hover:border-purple-800"
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Add Stock Search Input */}
          <div className="relative w-full md:w-80" ref={searchRef}>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchResults.length > 0) setShowSearchDropdown(true); }}
                placeholder="비교할 종목 추가 (코드, 티커, 코인)"
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-[#1a1f2c] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {isSearching ? (
                  <div className="p-3 text-center text-xs text-slate-400">검색 중...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(stock => {
                    const isAdded = selectedSymbols.includes(stock.symbol);
                    return (
                      <div
                        key={stock.symbol}
                        onClick={() => !isAdded && handleAddStock(stock.symbol)}
                        className={`p-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                          isAdded ? 'opacity-50 cursor-default' : 'cursor-pointer'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                              {stock.name}
                            </span>
                            <span className="text-[10px] font-mono px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                              {stock.symbol}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {stock.market} · {stock.sector}
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={isAdded}
                          className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                            isAdded
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                        >
                          {isAdded ? '추가됨' : '+ 추가'}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-3 text-center text-xs text-slate-400">일치하는 종목이 없습니다.</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Selected Stock Tags */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-xs font-bold text-slate-400">비교 종목 ({selectedSymbols.length}/6):</span>
          {selectedSymbols.map((sym, idx) => {
            const data = comparedData.find(d => d.stock.symbol === sym);
            const color = STOCK_COLORS[idx % STOCK_COLORS.length];
            return (
              <div
                key={sym}
                className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70"
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-slate-900 dark:text-white">{data?.stock.name || sym}</span>
                <span className="text-[10px] font-mono text-slate-400">({sym})</span>
                <button
                  type="button"
                  onClick={() => handleRemoveStock(sym)}
                  className="p-0.5 text-slate-400 hover:text-rose-500 transition-colors ml-1 cursor-pointer"
                  title="종목 제거"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Normalized Return Chart Section */}
      <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>기간별 상대 수익률 비교 차트 ({period})</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 font-mono">
                기준점: 0.00%
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              비교 시작일의 종가를 0%로 정규화하여 기간 내 상대적 초과 수익률을 추적합니다.
            </p>
          </div>

          <button
            type="button"
            onClick={loadComparisonData}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer self-start sm:self-auto border border-slate-200 dark:border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-purple-500' : ''}`} />
            <span>새로고침</span>
          </button>
        </div>

        {isLoading ? (
          <div className="h-72 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-xs text-slate-400">
              <div className="w-8 h-8 border-3 border-purple-500/30 border-t-purple-600 rounded-full animate-spin" />
              <span>차트 및 캔들 정규화 계산 중...</span>
            </div>
          </div>
        ) : error ? (
          <div className="h-64 flex items-center justify-center text-rose-500 text-xs font-bold gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        ) : comparedData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
            비교할 종목을 상단 검색창에서 추가하세요.
          </div>
        ) : chartMetrics ? (
          <div className="space-y-4">
            {/* SVG Normalized Multi-line Chart */}
            <div className="w-full h-72 sm:h-80 relative select-none">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 800 300" preserveAspectRatio="none">
                {/* Horizontal Zero Baseline (0%) */}
                {(() => {
                  const zeroY = 300 - ((0 - chartMetrics.yMin) / (chartMetrics.yMax - chartMetrics.yMin)) * 300;
                  return (
                    <g>
                      <line
                        x1="0"
                        y1={zeroY}
                        x2="800"
                        y2={zeroY}
                        stroke="#94a3b8"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        opacity="0.6"
                      />
                      <text x="8" y={zeroY - 6} fill="#94a3b8" fontSize="10" fontWeight="bold">
                        0.00% (시작 기준가)
                      </text>
                    </g>
                  );
                })()}

                {/* Upper and Lower Grid Guide Lines */}
                <line x1="0" y1="10" x2="800" y2="10" stroke="#64748b" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.2" />
                <line x1="0" y1="150" x2="800" y2="150" stroke="#64748b" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.2" />
                <line x1="0" y1="290" x2="800" y2="290" stroke="#64748b" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.2" />

                {/* SVG Polylines for each stock */}
                {comparedData.map((d, stockIdx) => {
                  const color = STOCK_COLORS[stockIdx % STOCK_COLORS.length];
                  const points = d.normalized.map((val, ptIdx) => {
                    const x = (ptIdx / Math.max(d.normalized.length - 1, 1)) * 800;
                    const y = 300 - ((val - chartMetrics.yMin) / (chartMetrics.yMax - chartMetrics.yMin)) * 300;
                    return `${x},${y}`;
                  }).join(' ');

                  return (
                    <polyline
                      key={d.stock.symbol}
                      fill="none"
                      stroke={color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={points}
                    />
                  );
                })}
              </svg>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
              {comparedData.map((d, idx) => {
                const color = STOCK_COLORS[idx % STOCK_COLORS.length];
                const isPositive = d.periodReturn >= 0;
                return (
                  <div key={d.stock.symbol} className="flex items-center gap-1.5 text-xs">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{d.stock.name}:</span>
                    <span className={`font-mono font-bold ${isPositive ? 'text-rose-500' : 'text-blue-500'}`}>
                      {isPositive ? '+' : ''}{d.periodReturn.toFixed(2)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      {/* Side-by-Side Financial & Metric Comparison Matrix Table */}
      <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <span>핵심 재무 및 시세 비교 매트릭스</span>
          </h3>
          <span className="text-xs text-slate-400">클릭 시 해당 종목 상세 화면으로 이동</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-100 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold">
              <tr>
                <th className="py-3 px-4 min-w-[140px]">지표 항목</th>
                {comparedData.map((d, idx) => {
                  const color = STOCK_COLORS[idx % STOCK_COLORS.length];
                  return (
                    <th 
                      key={d.stock.symbol} 
                      className="py-3 px-4 min-w-[150px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                      onClick={() => navigateToStock(d.stock.symbol)}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-slate-900 dark:text-white font-black truncate">{d.stock.name}</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {d.stock.symbol} · {d.stock.exchange || d.stock.market}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
              {/* 현재가 */}
              <tr>
                <td className="py-3 px-4 text-slate-500 font-bold bg-slate-50/50 dark:bg-slate-900/30">현재가</td>
                {comparedData.map(d => (
                  <td key={d.stock.symbol} className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {d.stock.currency === 'USD'
                      ? `$${d.stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : d.stock.currency === 'USDT'
                      ? `${d.stock.price.toLocaleString()} USDT`
                      : `${d.stock.price.toLocaleString()}원`}
                  </td>
                ))}
              </tr>

              {/* 일간 등락률 */}
              <tr>
                <td className="py-3 px-4 text-slate-500 font-bold bg-slate-50/50 dark:bg-slate-900/30">일간 등락률</td>
                {comparedData.map(d => (
                  <td key={d.stock.symbol} className="py-3 px-4">
                    <PriceBadge change={d.stock.change} changePercent={d.stock.changePercent} size="sm" />
                  </td>
                ))}
              </tr>

              {/* 선택 기간 수익률 */}
              <tr>
                <td className="py-3 px-4 text-slate-500 font-bold bg-slate-50/50 dark:bg-slate-900/30">{period} 누적 수익률</td>
                {comparedData.map(d => {
                  const isPos = d.periodReturn >= 0;
                  return (
                    <td key={d.stock.symbol} className={`py-3 px-4 font-mono font-bold ${isPos ? 'text-rose-500' : 'text-blue-500'}`}>
                      {isPos ? '+' : ''}{d.periodReturn.toFixed(2)}%
                    </td>
                  );
                })}
              </tr>

              {/* 시가총액 */}
              <tr>
                <td className="py-3 px-4 text-slate-500 font-bold bg-slate-50/50 dark:bg-slate-900/30">시가총액</td>
                {comparedData.map(d => (
                  <td key={d.stock.symbol} className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                    {d.stock.marketCap > 0 ? `${(d.stock.marketCap / 10000).toFixed(1)}조 원` : '-'}
                  </td>
                ))}
              </tr>

              {/* PER (주가수익비율) */}
              <tr>
                <td className="py-3 px-4 text-slate-500 font-bold bg-slate-50/50 dark:bg-slate-900/30">PER (배)</td>
                {comparedData.map(d => (
                  <td key={d.stock.symbol} className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                    {d.stock.per ? `${d.stock.per.toFixed(2)}배` : '-'}
                  </td>
                ))}
              </tr>

              {/* PBR (주가순자산비율) */}
              <tr>
                <td className="py-3 px-4 text-slate-500 font-bold bg-slate-50/50 dark:bg-slate-900/30">PBR (배)</td>
                {comparedData.map(d => (
                  <td key={d.stock.symbol} className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                    {d.stock.pbr ? `${d.stock.pbr.toFixed(2)}배` : '-'}
                  </td>
                ))}
              </tr>

              {/* 52주 최고가 */}
              <tr>
                <td className="py-3 px-4 text-slate-500 font-bold bg-slate-50/50 dark:bg-slate-900/30">52주 최고가</td>
                {comparedData.map(d => (
                  <td key={d.stock.symbol} className="py-3 px-4 font-mono text-rose-500">
                    {d.stock.high52w ? d.stock.high52w.toLocaleString() : '-'}
                  </td>
                ))}
              </tr>

              {/* 52주 최저가 */}
              <tr>
                <td className="py-3 px-4 text-slate-500 font-bold bg-slate-50/50 dark:bg-slate-900/30">52주 최저가</td>
                {comparedData.map(d => (
                  <td key={d.stock.symbol} className="py-3 px-4 font-mono text-blue-500">
                    {d.stock.low52w ? d.stock.low52w.toLocaleString() : '-'}
                  </td>
                ))}
              </tr>

              {/* 거래량 */}
              <tr>
                <td className="py-3 px-4 text-slate-500 font-bold bg-slate-50/50 dark:bg-slate-900/30">당일 거래량</td>
                {comparedData.map(d => (
                  <td key={d.stock.symbol} className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                    {d.stock.volume ? d.stock.volume.toLocaleString() : '-'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
