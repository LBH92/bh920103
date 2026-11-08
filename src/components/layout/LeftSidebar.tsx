import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  BarChart2, 
  Layers, 
  Flame, 
  Activity, 
  Briefcase, 
  Bookmark, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  Shield 
} from 'lucide-react';
import { ViewTab } from '../../types';

export const LeftSidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    indices, 
    exchangeRate, 
    navigateToIndex,
    user 
  } = useApp();

  const kospi = indices.find(i => i.symbol === 'KOSPI');
  const kosdaq = indices.find(i => i.symbol === 'KOSDAQ');

  const navItems: { tab: ViewTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { tab: 'home', label: '대시보드 홈', icon: <Home className="w-4 h-4" /> },
    { tab: 'stocks', label: '전종목 시세', icon: <BarChart2 className="w-4 h-4" /> },
    { tab: 'compare', label: '종목 비교', icon: <Layers className="w-4 h-4 text-purple-500" /> },
    { tab: 'ranking', label: '실시간 순위', icon: <Flame className="w-4 h-4 text-amber-500" />, badge: 'TOP' },
    { tab: 'insight', label: '시장 인사이트', icon: <Activity className="w-4 h-4 text-rose-500" />, badge: 'LIVE' },
    { tab: 'portfolio', label: '가상 모의투자', icon: <Briefcase className="w-4 h-4 text-emerald-500" /> },
    { tab: 'watchlist', label: '관심종목 센터', icon: <Bookmark className="w-4 h-4 text-cyan-500" /> },
    { tab: 'calendar', label: '금융 캘린더', icon: <Calendar className="w-4 h-4 text-indigo-500" /> },
    { tab: 'community', label: '주주 커뮤니티', icon: <MessageSquare className="w-4 h-4 text-slate-400" /> },
    ...(user?.role === 'admin' || user?.role === 'superadmin' ? [
      { tab: 'admin' as ViewTab, label: '시스템 관리자', icon: <Shield className="w-4 h-4 text-amber-500" /> }
    ] : [])
  ];

  return (
    <aside className="w-64 hidden md:flex flex-col h-full border-r border-finance-border bg-finance-card select-none">
      {/* 1. Market Indices Quick Ticker */}
      <div className="p-3 border-b border-finance-border space-y-2 bg-finance-sub-bg/50">
        <div className="flex items-center justify-between text-[11px] font-bold text-finance-sub-text uppercase tracking-wider px-1">
          <span>주요 시장 지수</span>
          <span className="text-[10px] text-finance-accent font-mono flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-finance-accent animate-pulse" />
            LIVE
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {kospi && (
            <div 
              onClick={() => navigateToIndex('KOSPI')}
              className="p-2 rounded-xl bg-finance-card border border-finance-border cursor-pointer hover:border-finance-accent transition-colors shadow-2xs"
            >
              <div className="text-[11px] font-bold text-finance-sub-text">코스피</div>
              <div className="font-mono font-bold text-xs text-finance-text mt-0.5">
                {kospi.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`text-[10px] font-mono font-bold mt-0.5 ${kospi.changePercent >= 0 ? 'text-finance-up' : 'text-finance-down'}`}>
                {kospi.changePercent >= 0 ? '+' : ''}{kospi.changePercent.toFixed(2)}%
              </div>
            </div>
          )}

          {kosdaq && (
            <div 
              onClick={() => navigateToIndex('KOSDAQ')}
              className="p-2 rounded-xl bg-finance-card border border-finance-border cursor-pointer hover:border-finance-accent transition-colors shadow-2xs"
            >
              <div className="text-[11px] font-bold text-finance-sub-text">코스닥</div>
              <div className="font-mono font-bold text-xs text-finance-text mt-0.5">
                {kosdaq.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`text-[10px] font-mono font-bold mt-0.5 ${kosdaq.changePercent >= 0 ? 'text-finance-up' : 'text-finance-down'}`}>
                {kosdaq.changePercent >= 0 ? '+' : ''}{kosdaq.changePercent.toFixed(2)}%
              </div>
            </div>
          )}
        </div>

        {exchangeRate && (
          <div className="px-2.5 py-1.5 rounded-xl bg-finance-card border border-finance-border flex items-center justify-between text-xs">
            <span className="font-semibold text-finance-sub-text text-[11px]">원/달러 환율</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-finance-text text-xs">
                {exchangeRate.rate.toLocaleString()}원
              </span>
              <span className={`text-[10px] font-mono font-bold ${exchangeRate.changePercent >= 0 ? 'text-finance-up' : 'text-finance-down'}`}>
                {exchangeRate.changePercent >= 0 ? '+' : ''}{exchangeRate.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="px-3 pt-2 pb-1 text-[10px] font-black uppercase text-finance-sub-text tracking-wider">
          주요 메뉴
        </div>
        {navItems.map(item => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-finance-accent text-white shadow-xs'
                  : 'text-finance-sub-text hover:bg-finance-sub-bg hover:text-finance-text'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-finance-accent/15 text-finance-accent border border-finance-accent/30'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Terminal Info Footer */}
      <div className="p-3 border-t border-finance-border text-[10px] text-finance-sub-text font-mono flex items-center justify-between">
        <span>병돌 인베스트먼트</span>
        <span className="text-finance-accent flex items-center gap-1 font-bold">
          <Globe className="w-3 h-3" />
          글로벌 연동
        </span>
      </div>
    </aside>
  );
};
