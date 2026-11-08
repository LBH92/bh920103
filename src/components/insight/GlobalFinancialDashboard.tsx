import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Coins, 
  Layers, 
  DollarSign, 
  Percent, 
  BarChart3, 
  RefreshCw, 
  Search, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles,
  Info,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Building2,
  FileCheck
} from 'lucide-react';
import { globalMarketClient } from '../../services/globalMarketClient';
import { GlobalMarketSummaryResponse, GlobalMarketItem, ProviderMetadata, GlobalMarketCategory } from '../../types';
import { PriceBadge } from '../common/PriceBadge';
import { MiniSparkline } from '../common/MiniSparkline';

interface GlobalFinancialDashboardProps {
  onSelectSymbol?: (symbol: string) => void;
}

export const GlobalFinancialDashboard: React.FC<GlobalFinancialDashboardProps> = ({ onSelectSymbol }) => {
  const [data, setData] = useState<GlobalMarketSummaryResponse | null>(null);
  const [providers, setProviders] = useState<ProviderMetadata[]>([]);
  const [activeTab, setActiveTab] = useState<GlobalMarketCategory>('us');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showProviderModal, setShowProviderModal] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const loadData = async (force: boolean = false) => {
    setIsLoading(true);
    try {
      const [summary, providerList] = await Promise.all([
        globalMarketClient.getSummary(force),
        globalMarketClient.getProviders(),
      ]);
      setData(summary);
      setProviders(providerList.length > 0 ? providerList : (summary.providers || []));
      setLastRefreshed(summary.fetchedAt);
    } catch (err) {
      console.warn('[GlobalFinancialDashboard] Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const tabList: { key: GlobalMarketCategory; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: 'us', label: '미국 증시', icon: <Globe className="w-4 h-4 text-rose-500" />, desc: 'S&P 500, 나스닥, 다우존스, 러셀 2000' },
    { key: 'asia', label: '아시아 증시', icon: <Globe className="w-4 h-4 text-amber-500" />, desc: '닛케이 225, 상하이종합, 항셍지수' },
    { key: 'europe', label: '유럽 증시', icon: <Globe className="w-4 h-4 text-blue-500" />, desc: '유로스톡스 50, 독일 DAX, 프랑스 CAC, 영국 FTSE' },
    { key: 'crypto', label: '가상자산', icon: <Coins className="w-4 h-4 text-emerald-500" />, desc: '비트코인, 이더리움, 솔라나, 리플 (실시간 업비트·바이낸스)' },
    { key: 'commodity', label: '국제 원자재', icon: <Layers className="w-4 h-4 text-yellow-500" />, desc: '금, 은, WTI 원유, 브렌트유, 구리, 천연가스' },
    { key: 'forex', label: '주요 환율', icon: <DollarSign className="w-4 h-4 text-cyan-500" />, desc: '원/달러, 원/엔, 유로, 위안 (ECB 공식 고시환율)' },
    { key: 'rates', label: '금리 & 국채', icon: <Percent className="w-4 h-4 text-indigo-500" />, desc: '한·미·유럽 기준금리, 미국 10년물/2년물 국채수익률' },
    { key: 'macro', label: '거시경제 지표', icon: <BarChart3 className="w-4 h-4 text-purple-500" />, desc: '세계은행 주요국 GDP 성장률, 인플레이션, 미국 재무부 총부채' },
  ];

  const currentItems: GlobalMarketItem[] = (data?.groups?.[activeTab as keyof typeof data.groups] as GlobalMarketItem[]) || [];

  const filteredItems = currentItems.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return item.name.toLowerCase().includes(q) || item.symbol.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Globe className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                글로벌 통합 금융 데이터 허브
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                비용 0원 원칙 · 공식 공개 데이터
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              키움 증권 API 의존도를 탈피하여 세계은행(World Bank), 미국 재무부(U.S. Treasury), 유럽중앙은행(Frankfurter ECB), 업비트, 바이낸스 등 무료 공식 데이터 공급원을 통합 연동합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowProviderModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-indigo-400" />
              <span>공급원 및 라이선스 (0원)</span>
            </button>

            <button
              onClick={() => loadData(true)}
              disabled={isLoading}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer disabled:opacity-50"
              title="데이터 새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Background glow ornament */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Category Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabList.map(tab => {
          const isActive = activeTab === tab.key;
          const count = ((data?.groups?.[tab.key as keyof typeof data.groups] as any[]) || []).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/20'
                  : 'bg-white dark:bg-[#131722] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Search & Category Status Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#131722] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="항목명 또는 심볼 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:border-rose-500 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>갱신 시각: {lastRefreshed ? lastRefreshed.replace(' (KST)', '') : '실시간'}</span>
          <span>·</span>
          <span>총 {filteredItems.length}개 항목</span>
        </div>
      </div>

      {/* 4. Financial Items Grid */}
      {isLoading && !data ? (
        <div className="p-16 text-center space-y-3 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800">
          <RefreshCw className="w-8 h-8 text-rose-500 animate-spin mx-auto" />
          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
            공식 무료 공급원으로부터 글로벌 금융 데이터를 집계 중입니다...
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 text-center space-y-2 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400">
          <Info className="w-6 h-6 mx-auto text-slate-400" />
          <p className="text-xs">검색 조건에 맞는 데이터 항목이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => onSelectSymbol && onSelectSymbol(item.symbol)}
              className="p-4 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs flex flex-col justify-between group cursor-default"
            >
              <div>
                {/* Header: Name, Symbol, Delay Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {item.symbol}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {item.currency}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 font-mono ${
                    item.delayStatus === 'realtime'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : item.delayStatus === 'official_notice' || item.delayStatus === 'annual' || item.delayStatus === 'monthly'
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  }`}>
                    {item.delayLabel}
                  </span>
                </div>

                {/* Main Values & Change */}
                <div className="mt-3.5 flex items-baseline justify-between gap-2">
                  <div>
                    <div className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                      {item.displayValue ? item.displayValue : (
                        <>
                          {item.value.toLocaleString(undefined, {
                            minimumFractionDigits: item.category === 'rates' ? 3 : 2,
                            maximumFractionDigits: item.category === 'rates' ? 3 : 2
                          })}
                          {item.unit && <span className="text-xs font-normal text-slate-400 ml-1">{item.unit}</span>}
                        </>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      {item.change === 0 && (item.category === 'rates' || item.category === 'macro') ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                          변동 없음
                        </span>
                      ) : (
                        <PriceBadge change={item.change} changePercent={item.changePercent} size="sm" />
                      )}
                    </div>
                  </div>

                  {item.sparkline && item.sparkline.length >= 2 && (
                    <div className="shrink-0 pt-1">
                      <MiniSparkline data={item.sparkline} isUp={item.change >= 0} width={80} height={28} />
                    </div>
                  )}
                </div>

                {/* High/Low/PrevClose if available */}
                {(item.high !== undefined || item.low !== undefined) && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>고 {item.high?.toLocaleString()}</span>
                    <span>저 {item.low?.toLocaleString()}</span>
                  </div>
                )}

                {/* Additional Notes (e.g. GDP indicator ID, Binance price, ECB date) */}
                {item.notes && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-900/60 p-1.5 rounded border border-slate-100 dark:border-slate-800/60 leading-relaxed">
                    {item.notes}
                  </p>
                )}
              </div>

              {/* Card Footer: Provider Source */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span className="truncate font-medium text-slate-500 dark:text-slate-400" title={item.provider}>
                  {item.provider}
                </span>
                <span className="font-mono shrink-0">
                  {item.marketTime ? item.marketTime.replace(' (KST)', '') : (item.lastUpdated ? item.lastUpdated.replace(' (KST)', '') : '')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Providers & Open Data License Modal */}
      {showProviderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  무료 공식 데이터 공급원 & 오픈 라이선스 규정
                </h3>
              </div>
              <button
                onClick={() => setShowProviderModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold cursor-pointer"
              >
                닫기
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              본 서비스는 실제 주식 매매를 실행하지 않는 순수 투자 분석 서비스로, <strong>비용 0원 원칙</strong>에 따라 이용 허가된 공개 API 및 공공 데이터만을 수집·가공하여 표기합니다.
            </p>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {providers.map((p, idx) => (
                <div key={idx} className="py-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                      {p.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {p.cost}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    <strong>제공 데이터:</strong> {p.assetScope}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    <strong>라이선스:</strong> {p.license} · <strong>갱신 주기:</strong> {p.updateFrequency}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowProviderModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold cursor-pointer"
              >
                확인 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
