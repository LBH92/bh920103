import React from 'react';
import { Home, BarChart2, Calendar, MessageSquare, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, setMobileMenuOpen } = useApp();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0c0f17]/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-lg pb-safe shadow-lg">
      <div className="flex items-center justify-around h-[50px] px-1 max-w-md mx-auto">
        {/* 1. 홈 (Home) */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center flex-1 py-0.5 transition-all active:scale-95 ${
            activeTab === 'home'
              ? 'text-rose-500 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="홈"
        >
          <Home className="w-4 h-4" />
          <span className={`text-[9.5px] mt-0.5 tracking-tight ${activeTab === 'home' ? 'font-bold text-rose-500' : 'font-medium'}`}>
            홈
          </span>
        </button>

        {/* 2. 종목 (Stocks) */}
        <button
          onClick={() => setActiveTab('stocks')}
          className={`flex flex-col items-center justify-center flex-1 py-0.5 transition-all active:scale-95 ${
            activeTab === 'stocks'
              ? 'text-rose-500 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="종목"
        >
          <BarChart2 className="w-4 h-4" />
          <span className={`text-[9.5px] mt-0.5 tracking-tight ${activeTab === 'stocks' ? 'font-bold text-rose-500' : 'font-medium'}`}>
            종목
          </span>
        </button>

        {/* 3. 캘린더 (Calendar) */}
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex flex-col items-center justify-center flex-1 py-0.5 transition-all active:scale-95 ${
            activeTab === 'calendar'
              ? 'text-indigo-500 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="캘린더"
        >
          <Calendar className="w-4 h-4" />
          <span className={`text-[9.5px] mt-0.5 tracking-tight ${activeTab === 'calendar' ? 'font-bold text-indigo-500' : 'font-medium'}`}>
            캘린더
          </span>
        </button>

        {/* 4. 커뮤니티 (Community) */}
        <button
          onClick={() => setActiveTab('community')}
          className={`flex flex-col items-center justify-center flex-1 py-0.5 transition-all active:scale-95 ${
            activeTab === 'community'
              ? 'text-rose-500 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="커뮤니티"
        >
          <MessageSquare className="w-4 h-4" />
          <span className={`text-[9.5px] mt-0.5 tracking-tight ${activeTab === 'community' ? 'font-bold text-rose-500' : 'font-medium'}`}>
            커뮤니티
          </span>
        </button>

        {/* 5. 전체 (All Menu / MobileDrawer) */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-0.5 transition-all active:scale-95 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          aria-label="전체 메뉴"
        >
          <Layers className="w-4 h-4" />
          <span className="text-[9.5px] mt-0.5 tracking-tight font-medium">
            전체
          </span>
        </button>
      </div>
    </nav>
  );
};
