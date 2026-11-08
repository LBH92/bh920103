import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TimeProvider } from './context/TimeContext';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { SearchModal } from './components/layout/SearchModal';
import { AuthModal } from './components/layout/AuthModal';
import { ToastContainer } from './components/common/ToastContainer';
import { Footer } from './components/layout/Footer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AdminGuard } from './components/admin/AdminGuard';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { useWatchlistPriceMonitor } from './hooks/useWatchlistPriceMonitor';

import { Suspense, lazy } from 'react';



// Resilient Lazy Loader with automatic retry on temporary network/module load hiccups
const lazyWithRetry = <T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) =>
  lazy(async () => {
    try {
      return await factory();
    } catch (err) {
      console.warn('[LazyLoader] Dynamic import failed, retrying after short backoff...', err);
      await new Promise(res => setTimeout(res, 400));
      return await factory();
    }
  });

import { StockDetailView } from './components/stocks/StockDetailView';

// Views - Lazy Loaded with retry resilience
const HomeView = lazyWithRetry(() => import('./components/home/HomeView').then(m => ({ default: m.HomeView })));
const StockListView = lazyWithRetry(() => import('./components/stocks/StockListView').then(m => ({ default: m.StockListView })));
const WatchlistView = lazyWithRetry(() => import('./components/watchlist/WatchlistView').then(m => ({ default: m.WatchlistView })));
const CommunityView = lazyWithRetry(() => import('./components/community/CommunityView').then(m => ({ default: m.CommunityView })));
const PostDetailView = lazyWithRetry(() => import('./components/community/PostDetailView').then(m => ({ default: m.PostDetailView })));
const ChatView = lazyWithRetry(() => import('./components/chat/ChatView').then(m => ({ default: m.ChatView })));
const AlertsView = lazyWithRetry(() => import('./components/alerts/AlertsView').then(m => ({ default: m.AlertsView })));
const StockInsightView = lazyWithRetry(() => import('./components/insight/StockInsightView').then(m => ({ default: m.StockInsightView })));
const ProfileView = lazyWithRetry(() => import('./components/profile/ProfileView').then(m => ({ default: m.ProfileView })));
const AdminView = lazyWithRetry(() => import('./components/admin/AdminView').then(m => ({ default: m.AdminView })));
const NewsView = lazyWithRetry(() => import('./components/news/NewsView').then(m => ({ default: m.NewsView })));
const StockRankingView = lazyWithRetry(() => import('./components/stocks/StockRankingView').then(m => ({ default: m.StockRankingView })));
const IndexDetailView = lazyWithRetry(() => import('./components/indices/IndexDetailView').then(m => ({ default: m.IndexDetailView })));
const PortfolioView = lazyWithRetry(() => import('./components/portfolio/PortfolioView').then(m => ({ default: m.PortfolioView })));
const StockComparisonView = lazyWithRetry(() => import('./components/stocks/StockComparisonView').then(m => ({ default: m.StockComparisonView })));
const CalendarView = lazyWithRetry(() => import('./components/calendar/CalendarView').then(m => ({ default: m.CalendarView })));
const InquiryPage = lazyWithRetry(() => import('./components/inquiry/InquiryPage').then(m => ({ default: m.InquiryPage })));
const MiniGames = lazyWithRetry(() => import('./components/games/MiniGames').then(m => ({ default: m.MiniGames || m.default })));
import { SideChatPanel } from './components/chat/SideChatPanel';
import { RightSidebar } from './components/layout/RightSidebar';

// Loading component
const ViewLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-rose-500/30 border-t-rose-600 rounded-full animate-spin" />
  </div>
);

// Debug wrapper to identify mount issues
const LoggedView = ({ Component, name, props }: { Component: any, name: string, props: any }) => {
  useEffect(() => {
    console.log(`[DEBUG] Component ${name} mounted.`);
    return () => console.log(`[DEBUG] Component ${name} unmounted.`);
  }, [name]);
  return <Component {...props} />;
};

// ... (inside MainLayout, replace renderActiveView)
const MainLayout: React.FC = () => {
  const { 
    activeTab, 
    selectedSymbol, 
    selectedIndexSymbol,
    selectedPostId,
    setActiveTab, 
    user, 
    isAuthenticated, 
    showToast,
    isSideChatOpen,
    isAuthLoading,
    stocks,
    watchlist,
    navigateToStock
  } = useApp();

  // Active Watchlist Fluctuation Monitor for Browser Push Notifications
  useWatchlistPriceMonitor({
    watchlist,
    stocks,
    userId: user?.id,
    onNavigateStock: navigateToStock,
  });

  useEffect(() => {
    import('@capacitor/app').then(({ App }) => {
      App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          App.exitApp();
        } else {
          window.history.back();
        }
      });
    });

    // Phased Strategy: Pre-fetch heavy views after initial load or on interaction
    const preloadHeavyViews = () => {
      console.log('[DEBUG] Pre-fetching heavy views...');
      import('./components/stocks/StockDetailView');
      import('./components/community/CommunityView');
      import('./components/stocks/StockListView');
    };

    const timer = setTimeout(preloadHeavyViews, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Trigger on sidebar interaction
  useEffect(() => {
    if (isSideChatOpen) {
      console.log('[DEBUG] Pre-fetching heavy views due to sidebar interaction.');
      import('./components/stocks/StockDetailView');
      import('./components/community/CommunityView');
      import('./components/stocks/StockListView');
    }
  }, [isSideChatOpen]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0c0f17]">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  // If in Admin Mode, render the dedicated Admin System (completely separate AdminLayout)
  if (activeTab === 'admin') {
    return (
      <AdminGuard>
        <AdminView />
        <SearchModal />
        <AuthModal />
        <ToastContainer />
      </AdminGuard>
    );
  }

  const renderActiveView = () => {
    // Determine which view to render
    let Component;
    let componentKey = 'home'; // Default

    if (selectedIndexSymbol) {
      Component = IndexDetailView;
      componentKey = 'IndexDetailView';
    } else if (activeTab === 'stocks' && selectedSymbol) {
      Component = StockDetailView;
      componentKey = 'StockDetailView';
    } else if (activeTab === 'community' && selectedPostId) {
      Component = PostDetailView;
      componentKey = 'PostDetailView';
    } else {
      const viewMap: Record<string, any> = {
        home: HomeView,
        stocks: StockListView,
        compare: StockComparisonView,
        ranking: StockRankingView,
        insight: StockInsightView,
        watchlist: WatchlistView,
        calendar: CalendarView,
        portfolio: PortfolioView,
        community: CommunityView,
        chat: ChatView,
        alerts: AlertsView,
        inquiry: InquiryPage,
        news: NewsView,
        profile: ProfileView,
        games: MiniGames,
      };
      Component = viewMap[activeTab] || HomeView;
      componentKey = activeTab || 'home';
    }
    
    // Props helper
    const getProps = () => {
      if (selectedIndexSymbol) return { symbol: selectedIndexSymbol };
      if (activeTab === 'stocks' && selectedSymbol) return { symbol: selectedSymbol };
      if (activeTab === 'community' && selectedPostId) return { postId: selectedPostId };
      return {};
    };

    console.log(`[DEBUG] Attempting to render: ${componentKey}`);

    return (
      <Suspense fallback={<ViewLoader />}>
        <LoggedView Component={Component} name={componentKey} props={getProps()} />
      </Suspense>
    );
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-finance-bg text-finance-text font-sans transition-colors duration-150">
      <Navbar />

      <div className="flex-1 flex overflow-hidden pt-[64px] md:pt-[60px]">
        {/* Left Panel - Fixed width on Desktop (>= 1280px) */}
        <div className="hidden xl:flex flex-col w-64 border-r border-finance-border bg-finance-card overflow-hidden">
          <LeftSidebar />
        </div>

        {/* Center Content - Flex 1, independent scroll */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <div className="flex-1 p-2 sm:p-4 lg:p-6 pb-24 md:pb-6">
            <ErrorBoundary key={`${activeTab}-${selectedSymbol || ''}-${selectedIndexSymbol || ''}-${selectedPostId || ''}`} fallbackTitle="화면을 불러오는 중 문제가 발생했습니다.">
              {renderActiveView()}
            </ErrorBoundary>
          </div>
        </main>

        {/* Right Panel - Watchlist on Desktop Screens */}
        <div className="hidden 2xl:flex flex-col w-[320px] xl:w-[360px] border-l border-finance-border bg-finance-card overflow-hidden">
          {activeTab !== 'chat' && (
            <RightSidebar onOpenFullChat={() => setActiveTab('chat')} />
          )}
        </div>
      </div>

      <MobileNav />
      <SearchModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  console.log('App component rendering...');
  return (
    <ErrorBoundary fallbackTitle="서비스를 초기화하는 중 문제가 발생했습니다.">
      <AppProvider>
        <TimeProvider>
          <MainLayout />
        </TimeProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
