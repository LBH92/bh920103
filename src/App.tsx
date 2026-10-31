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

import { Suspense, lazy } from 'react';

// Robust lazy loading with retry for 429 errors
const lazyWithRetry = (importFn: () => Promise<any>, componentName: string) => lazy(async () => {
  const MAX_RETRIES = 3;
  const DELAY = 2000;
  
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await importFn();
    } catch (err: any) {
      console.error(`[App] Lazy load failed for ${componentName} (attempt ${i + 1}/${MAX_RETRIES})`, {
        error: err.message,
        url: window.location.href,
        status: err.response?.status
      });
      if (i === MAX_RETRIES - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, DELAY));
    }
  }
  return await importFn();
});

// Views - Lazy Loaded
const HomeView = lazyWithRetry(() => import('./components/home/HomeView').then(m => ({ default: m.HomeView })), 'HomeView');
const StockListView = lazyWithRetry(() => import('./components/stocks/StockListView').then(m => ({ default: m.StockListView })), 'StockListView');
const StockDetailView = lazyWithRetry(() => import('./components/stocks/StockDetailView').then(m => ({ default: m.StockDetailView })), 'StockDetailView');
const WatchlistView = lazyWithRetry(() => import('./components/watchlist/WatchlistView').then(m => ({ default: m.WatchlistView })), 'WatchlistView');
const CommunityView = lazyWithRetry(() => import('./components/community/CommunityView').then(m => ({ default: m.CommunityView })), 'CommunityView');
const PostDetailView = lazyWithRetry(() => import('./components/community/PostDetailView').then(m => ({ default: m.PostDetailView })), 'PostDetailView');
const ChatView = lazyWithRetry(() => import('./components/chat/ChatView').then(m => ({ default: m.ChatView })), 'ChatView');
const AlertsView = lazyWithRetry(() => import('./components/alerts/AlertsView').then(m => ({ default: m.AlertsView })), 'AlertsView');
const StockInsightView = lazyWithRetry(() => import('./components/insight/StockInsightView').then(m => ({ default: m.StockInsightView })), 'StockInsightView');
const ProfileView = lazyWithRetry(() => import('./components/profile/ProfileView').then(m => ({ default: m.ProfileView })), 'ProfileView');
const AdminView = lazyWithRetry(() => import('./components/admin/AdminView').then(m => ({ default: m.AdminView })), 'AdminView');
const NewsView = lazyWithRetry(() => import('./components/news/NewsView').then(m => ({ default: m.NewsView })), 'NewsView');
const StockRankingView = lazyWithRetry(() => import('./components/stocks/StockRankingView').then(m => ({ default: m.StockRankingView })), 'StockRankingView');
const IndexDetailView = lazyWithRetry(() => import('./components/indices/IndexDetailView').then(m => ({ default: m.IndexDetailView })), 'IndexDetailView');
const PortfolioView = lazyWithRetry(() => import('./components/portfolio/PortfolioView').then(m => ({ default: m.PortfolioView })), 'PortfolioView');
const StockComparisonView = lazyWithRetry(() => import('./components/stocks/StockComparisonView').then(m => ({ default: m.StockComparisonView })), 'StockComparisonView');
const CalendarView = lazyWithRetry(() => import('./components/calendar/CalendarView').then(m => ({ default: m.CalendarView })), 'CalendarView');
const InquiryPage = lazyWithRetry(() => import('./components/inquiry/InquiryPage').then(m => ({ default: m.InquiryPage })), 'InquiryPage');
import { SideChatPanel } from './components/chat/SideChatPanel';

// Loading component
const ViewLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-rose-500/30 border-t-rose-600 rounded-full animate-spin" />
  </div>
);

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
    isAuthLoading
  } = useApp();

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
  }, []);

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
    let ViewComponent;
    if (selectedIndexSymbol) {
      ViewComponent = IndexDetailView;
    } else {
      switch (activeTab) {
        case 'home': ViewComponent = HomeView; break;
        case 'stocks': ViewComponent = selectedSymbol ? StockDetailView : StockListView; break;
        case 'compare': ViewComponent = StockComparisonView; break;
        case 'ranking': ViewComponent = StockRankingView; break;
        case 'insight': ViewComponent = StockInsightView; break;
        case 'watchlist': ViewComponent = WatchlistView; break;
        case 'calendar': ViewComponent = CalendarView; break;
        case 'portfolio': ViewComponent = PortfolioView; break;
        case 'community': ViewComponent = selectedPostId ? PostDetailView : CommunityView; break;
        case 'chat': ViewComponent = ChatView; break;
        case 'alerts': ViewComponent = AlertsView; break;
        case 'inquiry': ViewComponent = InquiryPage; break;
        case 'news': ViewComponent = NewsView; break;
        case 'profile': ViewComponent = ProfileView; break;
        default: ViewComponent = HomeView; break;
      }
    }
    
    return (
      <Suspense fallback={<ViewLoader />}>
        {selectedIndexSymbol === 'KOSPI' ? <IndexDetailView symbol="KOSPI" />
         : selectedIndexSymbol === 'KOSDAQ' ? <IndexDetailView symbol="KOSDAQ" />
         : activeTab === 'stocks' && selectedSymbol ? <StockDetailView symbol={selectedSymbol} />
         : activeTab === 'community' && selectedPostId ? <PostDetailView postId={selectedPostId} />
         : activeTab === 'home' ? <HomeView />
         : activeTab === 'stocks' ? <StockListView />
         : activeTab === 'compare' ? <StockComparisonView />
         : activeTab === 'ranking' ? <StockRankingView />
         : activeTab === 'insight' ? <StockInsightView />
         : activeTab === 'watchlist' ? <WatchlistView />
         : activeTab === 'calendar' ? <CalendarView />
         : activeTab === 'portfolio' ? <PortfolioView />
         : activeTab === 'community' ? <CommunityView />
         : activeTab === 'chat' ? <ChatView />
         : activeTab === 'alerts' ? <AlertsView />
         : activeTab === 'inquiry' ? <InquiryPage />
         : activeTab === 'news' ? <NewsView />
         : activeTab === 'profile' ? <ProfileView />
         : <HomeView />}
      </Suspense>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c0f17] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150 relative">
      <Navbar />

      {/* Main Container with responsive right padding when SideChatPanel is open on lg screens */}
      <div className={`flex-1 flex flex-col transition-all duration-200 min-w-0 overflow-x-hidden ${
        activeTab !== 'chat' && isSideChatOpen ? 'lg:pr-[340px] xl:pr-[360px]' : activeTab !== 'chat' ? 'lg:pr-0' : ''
      }`}>
        <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12 overflow-x-hidden">

          <ErrorBoundary fallbackTitle="화면을 불러오는 중 문제가 발생했습니다.">
            {renderActiveView()}
          </ErrorBoundary>
        </main>
        <Footer />
      </div>

      {/* Side Chat Panel (Only render when activeTab is not full chat) */}
      {activeTab !== 'chat' && (
        <SideChatPanel onOpenFullChat={() => setActiveTab('chat')} />
      )}

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
