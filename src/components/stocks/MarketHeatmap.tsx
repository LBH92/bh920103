import React, { useState, useEffect, useMemo } from 'react';
import { 
  Globe, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Clock, 
  SlidersHorizontal, 
  Info, 
  ChevronRight,
  ExternalLink,
  Layers,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HeatmapStockItem, HeatmapResponse } from '../../types';

export const MarketHeatmap: React.FC = () => {
  const { navigateToStock } = useApp();

  const [marketFilter, setMarketFilter] = useState<'ALL' | 'KR' | 'US' | 'KOSPI' | 'KOSDAQ' | 'NASDAQ' | 'NYSE'>('ALL');
  const [period, setPeriod] = useState<'1D' | '1M' | '1Y'>('1D');
  const [limit, setLimit] = useState<number>(100);
  const [includeEtf, setIncludeEtf] = useState<boolean>(false);
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');

  const [heatmapData, setHeatmapData] = useState<HeatmapResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch heatmap from server
  const loadHeatmap = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/market/heatmap?market=${marketFilter}&period=${period}&limit=${limit}&includeEtf=${includeEtf}`);
      if (!res.ok) {
        throw new Error('히트맵 데이터를 불러오지 못했습니다.');
      }
      const data: HeatmapResponse = await res.json();
      setHeatmapData(data);
    } catch (err: any) {
      console.warn('[MarketHeatmap] Fetch error:', err);
      setError(err.message || '시세 공급처와 통신 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHeatmap();
  }, [marketFilter, period, limit, includeEtf]);


  // Extract distinct sectors from loaded items
  const availableSectors = useMemo(() => {
    if (!heatmapData?.items) return ['ALL'];
    const s = new Set<string>();
    heatmapData.items.forEach(item => {
      if (item.sector) {
        const topSector = item.sector.split('/')[0].trim();
        s.add(topSector);
      }
    });
    return ['ALL', ...Array.from(s)];
  }, [heatmapData]);

  // Filtered items based on sector
  const displayItems = useMemo(() => {
    if (!heatmapData?.items) return [];
    if (sectorFilter === 'ALL') return heatmapData.items;
    return heatmapData.items.filter(item => item.sector.includes(sectorFilter));
  }, [heatmapData, sectorFilter]);

  // Calculate sum of weights for layout sizing
  const maxCap = useMemo(() => {
    if (displayItems.length === 0) return 1;
    return Math.max(...displayItems.map(i => i.marketCap || 1));
  }, [displayItems]);

  // Helper for return percentage according to active period
  const getChangePercent = (item: HeatmapStockItem): number => {
    if (period === '1D') return item.changePercent1D;
    if (period === '1M') return item.changePercent1M;
    return item.changePercent1Y;
  };

  // Color generator based on standard Korean financial UI:
  // Rising (+) = Red/Rose gradient
  // Falling (-) = Blue/Cyan gradient
  // Flat (0) = Slate neutral
  const getTileBgColor = (pct: number): string => {
    if (pct > 5) return 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500/50 shadow-rose-950/20';
    if (pct > 2.5) return 'bg-rose-500 hover:bg-rose-400 text-white border-rose-400/40';
    if (pct > 0.5) return 'bg-rose-500/80 hover:bg-rose-500 text-white border-rose-400/30';
    if (pct > 0) return 'bg-rose-500/40 hover:bg-rose-500/60 text-rose-100 border-rose-400/20';
    if (pct === 0) return 'bg-slate-700/60 hover:bg-slate-700 text-slate-200 border-slate-600';
    if (pct > -0.5) return 'bg-blue-500/40 hover:bg-blue-500/60 text-blue-100 border-blue-400/20';
    if (pct > -2.5) return 'bg-blue-500/80 hover:bg-blue-500 text-white border-blue-400/30';
    if (pct > -5) return 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500/40';
    return 'bg-blue-700 hover:bg-blue-600 text-white border-blue-600/50 shadow-blue-950/20';
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Market Selection Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              {marketFilter === 'ALL' ? '국내외 시장' : marketFilter === 'KR' || marketFilter === 'KOSPI' || marketFilter === 'KOSDAQ' ? '국내 시장' : '미국 시장'}:
            </span>
            {[
              { id: 'ALL', label: '한·미 전체' },
              { id: 'KR', label: '한국 (KOSPI·KOSDAQ)' },
              { id: 'KOSPI', label: 'KOSPI' },
              { id: 'KOSDAQ', label: 'KOSDAQ' },
              { id: 'US', label: '미국 (NASDAQ·NYSE)' },
              { id: 'NASDAQ', label: 'NASDAQ' },
              { id: 'NYSE', label: 'NYSE' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setMarketFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  marketFilter === tab.id
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/20'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Period Selection & Refresh */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-xl p-1 border border-slate-200/60 dark:border-slate-700/60">
              {[
                { id: '1D', label: '일간 (1D)' },
                { id: '1M', label: '월간 (1M)' },
                { id: '1Y', label: '연간 (1Y)' },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setPeriod(p.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    period === p.id
                      ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={includeEtf} 
                  onChange={(e) => setIncludeEtf(e.target.checked)}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">ETF 포함</span>
              </label>
            </div>

            <select 
              value={limit} 
              onChange={(e) => { setLimit(Number(e.target.value)); }}
              className="px-2 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 focus:ring-0 cursor-pointer"
            >
              <option value={50}>50개</option>
              <option value={100}>100개</option>
              <option value={200}>200개</option>
              {['US', 'NASDAQ', 'NYSE'].includes(marketFilter) && <option value={500}>500개</option>}
            </select>

            <button
              onClick={loadHeatmap}
              disabled={isLoading}
              title="히트맵 새로고침"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Sector secondary filter bar */}
        {availableSectors.length > 2 && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
              <Layers className="w-3 h-3 text-slate-400" />
              업종:
            </span>
            {availableSectors.map(sec => (
              <button
                key={sec}
                onClick={() => setSectorFilter(sec)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  sectorFilter === sec
                    ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {sec === 'ALL' ? '전체 업종' : sec}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Baseline Status & Legend Bar */}
      <div className="bg-slate-100/70 dark:bg-[#131722]/60 border border-slate-200/60 dark:border-slate-800/60 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-300 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">기준:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {heatmapData?.meta.calculationBaseline || '실제 거래일 종가 기준'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span>
              KRX:{' '}
              <strong className={heatmapData?.meta.krMarketStatus === 'OPEN' ? 'text-emerald-500' : 'text-slate-400'}>
                {heatmapData?.meta.krMarketStatus === 'OPEN' ? '장중(정규장)' : '장 마감'}
              </strong>
            </span>
            <span>
              NYSE/NASDAQ:{' '}
              <strong className={heatmapData?.meta.usMarketStatus === 'OPEN' ? 'text-emerald-500' : 'text-slate-400'}>
                {heatmapData?.meta.usMarketStatus === 'OPEN' ? '정규장 개장' : '장 마감'}
              </strong>
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono shrink-0">
          <span className="text-blue-500 font-bold">-3%</span>
          <div className="w-2.5 h-2.5 rounded bg-blue-600" />
          <div className="w-2.5 h-2.5 rounded bg-blue-400" />
          <div className="w-2.5 h-2.5 rounded bg-slate-600" />
          <div className="w-2.5 h-2.5 rounded bg-rose-400" />
          <div className="w-2.5 h-2.5 rounded bg-rose-600" />
          <span className="text-rose-500 font-bold">+3%</span>
          <span className="text-slate-400 ml-2 font-sans">(타일 크기: 시가총액 비례)</span>
        </div>
      </div>

      {/* Main Heatmap Treemap / Grid Container */}
      {isLoading ? (
        <div className="h-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131722] flex flex-col items-center justify-center p-8 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-rose-500 animate-spin" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
            한국·미국 주요 상장사 실제 시세 및 {period} 수익률 계산 중...
          </p>
          <p className="text-xs text-slate-400">
            한국거래소 및 미국 거래소 실거래 종가를 반영하고 있습니다.
          </p>
        </div>
      ) : error ? (
        <div className="p-8 rounded-2xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/20 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <p className="text-sm font-bold text-rose-700 dark:text-rose-300">{error}</p>
          <button
            onClick={loadHeatmap}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition-colors"
          >
            다시 시도
          </button>
        </div>
      ) : displayItems.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
          <p className="text-sm text-slate-500">선택한 조건에 부합하는 종목이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 min-h-[520px]">
          {displayItems.map(item => {
            const chg = getChangePercent(item);
            const isRising = chg > 0;
            const isFalling = chg < 0;
            const isDelayed = item.status === 'delayed';

            // Visual flex span based on market cap dominance
            const capRatio = item.marketCap / maxCap;
            const isMegaCap = capRatio > 0.45;
            const isLargeCap = capRatio > 0.15;

            const spanClass = isMegaCap
              ? 'col-span-2 row-span-2 min-h-[140px]'
              : isLargeCap
              ? 'col-span-2 sm:col-span-1 row-span-1 min-h-[105px]'
              : 'col-span-1 row-span-1 min-h-[95px]';

            const bgClass = isDelayed
              ? 'bg-slate-200 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
              : getTileBgColor(chg);

            return (
              <button
                key={item.symbol}
                onClick={() => navigateToStock(item.symbol)}
                className={`relative rounded-xl p-3 border transition-all duration-200 cursor-pointer flex flex-col justify-between text-left group overflow-hidden ${spanClass} ${bgClass}`}
              >
                {/* Header: Market Badge & Symbol */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-black bg-black/25 uppercase shrink-0">
                      {item.exchange}
                    </span>
                    <span className="font-mono text-xs font-black truncate">
                      {item.symbol}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium opacity-80 shrink-0">
                    {item.formattedMarketCap}
                  </span>
                </div>

                {/* Stock Name */}
                <div className="my-1 min-w-0">
                  <p className={`font-black truncate ${isMegaCap ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'}`}>
                    {item.name}
                  </p>
                  <p className="text-[10px] opacity-75 truncate">{item.sector}</p>
                </div>

                {/* Price & Change Rate */}
                <div className="flex items-baseline justify-between w-full mt-auto pt-1 border-t border-white/10">
                  <span className="text-[11px] font-mono font-bold">
                    {item.currency === 'USD'
                      ? `$${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : `${item.price.toLocaleString()}원`}
                  </span>

                  <div className="flex items-center gap-0.5 font-mono font-black text-xs">
                    {isRising && <TrendingUp className="w-3 h-3" />}
                    {isFalling && <TrendingDown className="w-3 h-3" />}
                    <span>{isRising ? `+${chg}%` : `${chg}%`}</span>
                  </div>
                </div>

                {/* Delayed / Missing state overlay */}
                {isDelayed && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 text-center">
                    <span className="text-[10px] font-bold text-amber-300">
                      시세 공급 지연 (확인 중)
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Informative footnote */}
      <div className="p-3 bg-slate-50 dark:bg-[#131722]/50 border border-slate-200/60 dark:border-slate-800/60 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          * <strong>시장 히트맵 기준 안내:</strong> 일간(1D)은 전 거래일 정규장 종가 대비 변동률, 월간(1M) 및 연간(1Y)은 각각 1개월 전(약 21거래일) 및 1년 전(약 250거래일)의 공식 종가 대비 누적 수익률입니다. 종목 타일 크기는 시가총액 비례로 산정되며, 종목 클릭 시 해당 종목의 정규 인터랙티브 차트 화면으로 이동합니다.
        </p>
      </div>
    </div>
  );
};
