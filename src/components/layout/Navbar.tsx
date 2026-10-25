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
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ViewTab } from '../../types';
import { notificationService } from '../../services/notificationService';
import { KiwoomConfigModal } from '../common/KiwoomConfigModal';
import { getKRXMarketStatus, MarketStatusInfo } from '../../utils/marketHours';
import { isPreviewEnvironment } from '../../utils/environment';
import { KstClock } from '../common/KstClock';

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
    { tab: 'insight', label: 'Stock Insight', icon: <Activity className="w-3.5 h-3.5 text-rose-500 shrink-0" />, badge: 'LIVE' },
    { tab: 'portfolio', label: '모의투자', icon: <Briefcase className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> },
    { tab: 'watchlist', label: '관심종목', icon: <Bookmark className="w-3.5 h-3.5 shrink-0" /> },
    { tab: 'calendar', label: '증시 캘린더', icon: <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> },
    { tab: 'community', label: '커뮤니티', icon: <Layers className="w-3.5 h-3.5 shrink-0" /> },
    { tab: 'chat', label: '실시간 톡', icon: <MessageSquare className="w-3.5 h-3.5 text-rose-500 shrink-0" />, badge: 'LIVE' },
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
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0c0f17]/95 backdrop-blur-md">
        {/* Top Real-time Market Ticker Ribbon */}
        <div className="hidden sm:flex items-center justify-between px-4 py-1 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
           <div className="flex gap-4">
              <span>{marketStatus.statusLabel}</span>
              <KstClock />
           </div>
           <div className="flex gap-4">
              {indices.map(idx => (
                <span key={idx.symbol}>{idx.symbol}: {idx.value.toLocaleString()} ({idx.changePercent}%)</span>
              ))}
           </div>
        </div>
        
        {/* Main Navigation Bar */}
        <nav className="max-w-[95rem] mx-auto px-4 py-3 flex items-center justify-between">
           <div className="flex items-center gap-6">
             <button onClick={() => setActiveTab('home')} className="text-xl font-bold text-slate-900 dark:text-white">BYEONGDOL</button>
             <div className="hidden md:flex gap-4">
               {mainNavItems.map(item => (
                 <button key={item.tab} onClick={() => setActiveTab(item.tab)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${activeTab === item.tab ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                    {item.icon}
                    {item.label}
                 </button>
               ))}
             </div>
           </div>
           <div className="flex items-center gap-3">
              <button onClick={() => setIsSearchOpen(true)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><Search className="w-5 h-5" /></button>
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">{isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</button>
              {isAuthenticated ? (
                <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><User className="w-5 h-5" /></button>
              ) : (
                <button onClick={() => setIsAuthModalOpen(true)} className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm">로그인</button>
              )}
              <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><Menu className="w-6 h-6" /></button>
           </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden fixed inset-0 z-50 bg-white dark:bg-[#0c0f17] pt-16 px-4">
          <button className="absolute top-4 right-4" onClick={() => setMobileMenuOpen(false)}><X className="w-6 h-6" /></button>
          <div className="flex flex-col gap-2">
            {allNavItems.map(item => (
              <button key={item.tab} onClick={() => { setActiveTab(item.tab); setMobileMenuOpen(false); }} className="flex items-center gap-3 p-3 text-lg font-medium">
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Profile Dropdown */}
      {profileDropdownOpen && (
        <div ref={profileMenuRef} className="absolute right-4 top-16 z-50 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-2">
            <button onClick={() => { setActiveTab('profile'); setProfileDropdownOpen(false); }} className="w-full flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><User className="w-4 h-4" /> 내 프로필</button>
            <button onClick={logout} className="w-full flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-red-500"><LogOut className="w-4 h-4" /> 로그아웃</button>
        </div>
      )}

      <KiwoomConfigModal isOpen={isKiwoomModalOpen} onClose={() => setIsKiwoomModalOpen(false)} />
    </>
  );
};
