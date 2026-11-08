import React from 'react';
import {
  X,
  TrendingUp,
  BarChart2,
  Globe,
  Coins,
  Activity,
  Bookmark,
  Layers,
  Briefcase,
  DollarSign,
  Calendar,
  Flame,
  Search,
  MessageSquare,
  User,
  Bell,
  Shield,
  Moon,
  Sun,
  LogOut,
  LogIn,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ViewTab } from '../../types';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const {
    activeTab,
    setActiveTab,
    user,
    isAuthenticated,
    logout,
    setIsAuthModalOpen,
    isDark,
    toggleTheme,
    unreadChatCount,
  } = useApp();

  if (!isOpen) return null;

  const handleNav = (tab: ViewTab, extraAction?: () => void) => {
    setActiveTab(tab);
    extraAction?.();
    onClose();
  };

  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  return (
    <div className="fixed inset-0 z-50 flex justify-end md:hidden animate-in fade-in duration-200">
      {/* 1. Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Slide-out Drawer Panel */}
      <div className="relative w-[85%] max-w-sm h-full bg-finance-card border-l border-finance-border shadow-2xl flex flex-col z-10 overflow-hidden pt-safe pb-safe animate-in slide-in-from-right duration-250 text-finance-text">
        {/* Drawer Header */}
        <div className="p-4 border-b border-finance-border flex items-center justify-between bg-finance-sub-bg/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-finance-accent to-finance-up flex items-center justify-center text-white font-black text-sm shadow-xs">
              SI
            </div>
            <div>
              <span className="font-black text-sm text-finance-text tracking-tight block">
                병돌 인베스트먼트
              </span>
              <span className="text-[10px] text-finance-sub-text font-mono">전체 서비스 메뉴</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-finance-sub-text hover:text-finance-text hover:bg-finance-sub-bg transition-colors"
              title="다크/라이트 모드"
              aria-label="화면 모드 전환"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-finance-accent" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-finance-sub-text hover:text-finance-text hover:bg-finance-sub-bg transition-colors"
              aria-label="메뉴 닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Status Bar */}
        <div className="px-4 py-3 bg-finance-sub-bg/50 border-b border-finance-border flex items-center justify-between text-xs">
          {isAuthenticated ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-rose-500/10 text-rose-500 font-bold flex items-center justify-center text-xs">
                  {user?.name?.[0] || 'U'}
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block leading-tight">
                    {user?.name || '사용자'}
                  </span>
                  <span className="text-[10px] text-slate-400">{user?.email}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>로그아웃</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-slate-500 text-xs">로그인이 필요합니다</span>
              <button
                onClick={() => {
                  onClose();
                  setIsAuthModalOpen(true);
                }}
                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>로그인 / 회원가입</span>
              </button>
            </div>
          )}
        </div>

        {/* Nav Categories List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* 1. 시장 (Markets) */}
          <section className="space-y-1.5">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              시장 (Markets)
            </h4>
            <div className="space-y-0.5">
              <button
                onClick={() => handleNav('stocks')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'stocks'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart2 className="w-4 h-4 text-rose-500" />
                  <span>국내 시장 (KOSPI · KOSDAQ)</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleNav('stocks')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'stocks'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span>미국 시장 (NYSE · NASDAQ)</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleNav('stocks')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'stocks'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>가상자산 (Upbit · Binance)</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleNav('insight')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'insight'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-purple-500" />
                  <span>시장 히트맵 & 실시간 레이더</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-500 font-bold">
                  LIVE
                </span>
              </button>
            </div>
          </section>

          {/* 2. 투자 (Investments) */}
          <section className="space-y-1.5">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              투자 (Investments)
            </h4>
            <div className="space-y-0.5">
              <button
                onClick={() => handleNav('watchlist')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'watchlist'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bookmark className="w-4 h-4 text-amber-500" />
                  <span>관심종목 센터 (4대 시장)</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleNav('compare')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'compare'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <span>종목 비교 분석기</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleNav('portfolio')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'portfolio'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-emerald-500" />
                  <span>가상 보유 관리 & 물타기 계산</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleNav('portfolio')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'portfolio'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>모의투자 시스템 (가상 1억)</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleNav('portfolio')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'portfolio'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <DollarSign className="w-4 h-4 text-amber-500" />
                  <span>배당 수익 계산기 (공식 공시 연동)</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                  15.4%
                </span>
              </button>
            </div>
          </section>

          {/* 3. 정보 (Information) */}
          <section className="space-y-1.5">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              정보 (Information)
            </h4>
            <div className="space-y-0.5">
              <button
                onClick={() => handleNav('calendar')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'calendar'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <span>증시 캘린더 (휴장·실적·FOMC)</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleNav('ranking')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'ranking'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>경제 지표 & 실시간 순위</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold">
                  TOP
                </span>
              </button>

              <button
                onClick={() => handleNav('stocks')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'stocks'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-teal-500" />
                  <span>종목 정밀 분석 & 재무비율</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </section>

          {/* 4. 커뮤니티 (Community) */}
          <section className="space-y-1.5">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              커뮤니티 (Community)
            </h4>
            <div className="space-y-0.5">
              <button
                onClick={() => handleNav('community')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'community'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span>주주 게시판 & 토론방</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleNav('chat')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'chat'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-rose-500" />
                  <span>실시간 라이브 채팅</span>
                </div>
                {unreadChatCount > 0 ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold">
                    {unreadChatCount}
                  </span>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 font-bold">
                    LIVE
                  </span>
                )}
              </button>
            </div>
          </section>

          {/* 5. 계정 & 설정 (Account) */}
          <section className="space-y-1.5">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              계정 (Account)
            </h4>
            <div className="space-y-0.5">
              <button
                onClick={() => handleNav('profile')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-slate-500" />
                  <span>내 프로필 & 설정</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleNav('alerts')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'alerts'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-amber-500" />
                  <span>가격 알림 센터</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </section>

          {/* 6. 관리자 (Admin - Only visible if admin/superadmin) */}
          {isAdmin && (
            <section className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-[11px] font-bold text-amber-500 uppercase tracking-wider px-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>관리자 시스템 (Admin)</span>
              </h4>
              <button
                onClick={() => handleNav('admin')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'admin'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'text-amber-600 dark:text-amber-400 hover:bg-amber-500/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-amber-500" />
                  <span>시스템 통합 관리 콘솔</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
