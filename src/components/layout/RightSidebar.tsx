import React, { useState } from 'react';
import { SidebarStockList } from '../watchlist/SidebarStockList';
import { SideChatPanel } from '../chat/SideChatPanel';
import { useApp } from '../../context/AppContext';
import { Bookmark, MessageSquare, Maximize2 } from 'lucide-react';

interface RightSidebarProps {
  onOpenFullChat?: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ onOpenFullChat }) => {
  const { unreadChatCount, setActiveTab } = useApp();
  const [rightPanelTab, setRightPanelTab] = useState<'WATCHLIST' | 'CHAT'>('WATCHLIST');

  return (
    <div className="flex flex-col h-full bg-finance-card text-finance-text overflow-hidden select-none">
      {/* Top Header Switcher between Watchlist and Live Chat */}
      <div className="flex items-center justify-between border-b border-finance-border bg-finance-sub-bg/50 px-2 py-1.5 shrink-0">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setRightPanelTab('WATCHLIST')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              rightPanelTab === 'WATCHLIST'
                ? 'bg-finance-card text-finance-accent shadow-xs border border-finance-border'
                : 'text-finance-sub-text hover:text-finance-text'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-finance-accent fill-finance-accent/20" />
            <span>관심종목</span>
          </button>

          <button
            type="button"
            onClick={() => setRightPanelTab('CHAT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${
              rightPanelTab === 'CHAT'
                ? 'bg-finance-card text-finance-accent shadow-xs border border-finance-border'
                : 'text-finance-sub-text hover:text-finance-text'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-finance-accent" />
            <span>실시간 톡</span>
            {unreadChatCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-finance-up absolute -top-0.5 -right-0.5 animate-pulse" />
            )}
          </button>
        </div>

        {rightPanelTab === 'CHAT' && (
          <button
            type="button"
            onClick={() => onOpenFullChat ? onOpenFullChat() : setActiveTab('chat')}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title="전체 채팅 화면으로 이동"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 overflow-hidden">
        {rightPanelTab === 'WATCHLIST' ? (
          <SidebarStockList />
        ) : (
          <SideChatPanel embedded onOpenFullChat={onOpenFullChat || (() => setActiveTab('chat'))} />
        )}
      </div>
    </div>
  );
};
