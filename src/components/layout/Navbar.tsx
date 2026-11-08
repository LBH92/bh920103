import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  Search, 
  Bell, 
  User, 
  Moon, 
  Sun, 
  Radio, 
  Activity, 
  Shield, 
  Bookmark, 
  MessageSquare, 
  BarChart2, 
  Home, 
  Layers,
  ChevronDown,
  LogIn,
  LogOut,
  FileText,
  Key,
  Newspaper,
  Flame,
  Menu,
  X,
  MoreHorizontal,
  Briefcase,
  Calendar,
  Gamepad2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ViewTab } from '../../types';
import { notificationService } from '../../services/notificationService';
import { KiwoomConfigModal } from '../common/KiwoomConfigModal';
import { getKRXMarketStatus, MarketStatusInfo } from '../../utils/marketHours';
import { isPreviewEnvironment } from '../../utils/environment';
import { KstClock } from '../common/KstClock';
import { MobileDrawer } from './MobileDrawer';

export const Navbar: React.FC = () => {
  const {
    isDark,
    toggleTheme,
    activeTab,
    setActiveTab,
    indices,
    exchangeRate,
    stocks,
    navigateToStock,
    setIsSearchOpen,
    isSimulatingLiveTicks,
    toggleLiveSimulation,
    stockDataSource,
    toggleStockDataSource,
    isStockLoading,
    realtimeStatus,
    checkRealtimeConnection,
    user,
    isAuthenticated,
    logout,
    setIsAuthModalOpen,
    navigateToMyPosts,
    isSideChatOpen,
    toggleSideChat,
    unreadChatCount,
  } = useApp();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);
  const [isKiwoomModalOpen, setIsKiwoomModalOpen] = useState(false);
  const [marketStatus, setMarketStatus] = useState<MarketStatusInfo>(() => getKRXMarketStatus());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on active tab change or browser navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [activeTab]);

  // Handle outside click & escape key to close open menus
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (profileDropdownOpen && profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setProfileDropdownOpen(false);
      }
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        // Only close if not clicking on the mobile toggle button
        const toggleBtn = (target as HTMLElement).closest?.('[data-mobile-toggle="true"]');
        if (!toggleBtn) {
          setMobileMenuOpen(false);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProfileDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [profileDropdownOpen, mobileMenuOpen]);

  useEffect(() => {
    const updateMarket = () => setMarketStatus(getKRXMarketStatus());
    updateMarket();
    const timer = setInterval(updateMarket, 10000); // 10초마다 갱신
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    notificationService.getNotifications(user?.id)
      .then(res => setUnreadNotifCount(res.filter(n => !n.read).length))
      .catch(() => {});
    const interval = setInterval(() => {
      notificationService.getNotifications(user?.id)
        .then(res => setUnreadNotifCount(res.filter(n => !n.read).length))
        .catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [user?.id]);

  // 7 Core Main Navigation Tabs (Always preserved and displayed)
  const mainNavItems: { tab: ViewTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { tab: 'home', label: '홈', icon: <Home className="w-3.5 h-3.5 shrink-0" /> },
    { tab: 'stocks', label: '종목', icon: <BarChart2 className="w-3.5 h-3.5 shrink-0" /> },
    { tab: 'compare', label: '비교', icon: <Layers className="w-3.5 h-3.5 shrink-0" /> },
    { tab: 'ranking', label: '실시간 순위', icon: <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />, badge: 'TOP' },
    { tab: 'insight', label: '시장 인사이트', icon: <Activity className="w-3.5 h-3.5 text-rose-500 shrink-0" />, badge: 'LIVE' },
    { tab: 'portfolio', label: '모의투자', icon: <Briefcase className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> },
    { tab: 'watchlist', label: '관심종목', icon: <Bookmark className="w-3.5 h-3.5 shrink-0" /> },
    { tab: 'calendar', label: '증시 캘린더', icon: <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> },
    { tab: 'community', label: '커뮤니티', icon: <Layers className="w-3.5 h-3.5 shrink-0" /> },
    { tab: 'chat', label: '실시간 톡', icon: <MessageSquare className="w-3.5 h-3.5 text-rose-500 shrink-0" />, badge: 'LIVE' },
    { tab: 'games', label: '미니게임', icon: <Gamepad2 className="w-3.5 h-3.5 shrink-0" /> },
    ...(user?.role === 'admin' || user?.role === 'superadmin' ? [{ tab: 'admin' as ViewTab, label: '관리자', icon: <Shield className="w-3.5 h-3.5 shrink-0" /> }] : []),
  ];

  // All navigation items for Mobile Responsive Drawer
  const allNavItems: { tab: ViewTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    ...mainNavItems,
    { tab: 'news', label: '뉴스/속보', icon: <Newspaper className="w-4 h-4 text-blue-500 shrink-0" /> },
    { tab: 'inquiry', label: '고객센터/문의', icon: <MessageSquare className="w-4 h-4 text-rose-500 shrink-0" /> },
    { 
      tab: 'alerts', 
      label: '알림', 
      icon: <Bell className="w-4 h-4 shrink-0" />, 
      badge: unreadNotifCount > 0 ? `${unreadNotifCount}` : undefined 
    },
    ...(user?.role === 'admin' || user?.role === 'superadmin' ? [{ tab: 'admin' as ViewTab, label: '관리자', icon: <Shield className="w-4 h-4 text-indigo-500 shrink-0" /> }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-finance-border bg-finance-card/95 backdrop-blur-md">
        {/* Top Real-time Market Ticker Ribbon */}
        <div className="hidden sm:flex items-center justify-between px-4 py-1.5 text-xs tablet:text-[11.5px] text-finance-sub-text border-b border-finance-border bg-finance-sub-bg/60">
           <div className="flex gap-4">
              <span className="font-medium">{marketStatus.statusLabel}</span>
              <KstClock />
           </div>
           <div className="flex gap-4 font-mono font-medium tabular-nums">
              {indices.map(idx => (
                <span key={idx.symbol} className="whitespace-nowrap">
                  {idx.symbol}: {idx.value.toLocaleString()} <span className={idx.changePercent >= 0 ? 'text-finance-up' : 'text-finance-down'}>({idx.changePercent >= 0 ? '+' : ''}{idx.changePercent}%)</span>
                </span>
              ))}
           </div>
        </div>
        
        {/* Main Navigation Bar */}
        <nav className="max-w-[95rem] mx-auto px-4 py-3 tablet:py-2.5 flex items-center justify-between gap-3">
           <div className="flex items-center gap-6 tablet:gap-3 min-w-0">
             <button onClick={() => setActiveTab('home')} className="brand-logo text-xl tablet:text-[20px] font-black text-finance-text tracking-tight hover:opacity-90 transition-opacity shrink-0 whitespace-nowrap">병돌 인베스트먼트</button>
             <div className="hidden md:flex gap-1.5 tablet:gap-1 items-center nav-items-wrapper overflow-x-auto no-scrollbar">
               {mainNavItems.map(item => (
                 <button 
                   key={item.tab} 
                   onClick={() => setActiveTab(item.tab)} 
                   className={`nav-item-btn flex items-center gap-1.5 tablet:gap-1 px-3 py-1.5 tablet:px-2 tablet:py-1 rounded-lg text-sm tablet:text-[13px] font-medium transition-colors shrink-0 whitespace-nowrap ${
                     activeTab === item.tab 
                       ? 'bg-finance-accent/15 text-finance-accent font-bold' 
                       : 'text-finance-sub-text hover:text-finance-text hover:bg-finance-sub-bg'
                   }`}
                 >
                    {item.icon}
                    <span>{item.label}</span>
                 </button>
               ))}
             </div>
           </div>
           <div className="flex items-center gap-2 tablet:gap-1.5 shrink-0">
              <button onClick={() => setIsSearchOpen(true)} className="p-2 tablet:p-1.5 rounded-xl text-finance-sub-text hover:text-finance-text hover:bg-finance-sub-bg transition-colors" title="종목 및 기능 검색"><Search className="w-4 h-4" /></button>
              <button onClick={toggleTheme} className="p-2 tablet:p-1.5 rounded-xl text-finance-sub-text hover:text-finance-text hover:bg-finance-sub-bg transition-colors" title="화면 모드 전환">{isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-finance-accent" />}</button>
              {isAuthenticated ? (
                <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="p-2 tablet:p-1.5 rounded-xl text-finance-sub-text hover:text-finance-text hover:bg-finance-sub-bg transition-colors"><User className="w-4 h-4" /></button>
              ) : (
                <button onClick={() => setIsAuthModalOpen(true)} className="px-3.5 py-1.5 tablet:px-3 tablet:py-1 rounded-lg bg-finance-accent text-white text-xs tablet:text-[12px] font-bold hover:opacity-90 shadow-xs transition-opacity whitespace-nowrap">로그인</button>
              )}
              <button 
                data-mobile-toggle="true"
                className="md:hidden p-2 rounded-xl text-finance-text hover:bg-finance-sub-bg transition-colors" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="전체 메뉴 열기"
              >
                <Menu className="w-5 h-5" />
              </button>
           </div>
        </nav>
      </header>

      {/* Categorized Mobile Drawer */}
      <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Profile Dropdown */}
      {profileDropdownOpen && (
        <div ref={profileMenuRef} className="absolute right-4 top-16 z-50 w-48 bg-finance-card rounded-xl shadow-lg border border-finance-border p-2 animate-in fade-in zoom-in-95 duration-100">
            <button onClick={() => { setActiveTab('profile'); setProfileDropdownOpen(false); }} className="w-full flex items-center gap-2 p-2 text-finance-text hover:bg-finance-sub-bg rounded-lg text-xs font-medium"><User className="w-4 h-4 text-finance-sub-text" /> 내 프로필</button>
            <button onClick={logout} className="w-full flex items-center gap-2 p-2 hover:bg-finance-sub-bg rounded-lg text-finance-up text-xs font-medium"><LogOut className="w-4 h-4" /> 로그아웃</button>
        </div>
      )}

      <KiwoomConfigModal isOpen={isKiwoomModalOpen} onClose={() => setIsKiwoomModalOpen(false)} />
    </>
  );
};
