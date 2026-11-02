import React from 'react';
import { SidebarStockList } from '../watchlist/SidebarStockList';

export const LeftSidebar: React.FC = () => {
  return (
    <aside className="w-64 hidden md:flex flex-col h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131722]">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">관심종목</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <SidebarStockList />
      </div>
    </aside>
  );
};
