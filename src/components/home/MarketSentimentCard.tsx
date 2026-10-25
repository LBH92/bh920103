import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  RefreshCw, 
  Info, 
  Flame, 
  MessageSquare, 
  ChevronRight, 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatMessage, CommunityPost } from '../../types';
import { storageService } from '../../services/storageService';
import { firebaseRepository } from '../../services/firebaseRepository';
import { sentimentService, SentimentAnalysisResult } from '../../services/sentimentService';
import { PriceBadge } from '../common/PriceBadge';

interface MarketSentimentCardProps {
  onNavigateToStock?: (symbol: string) => void;
  onNavigateToChat?: () => void;
  onNavigateToCommunity?: () => void;
}

export const MarketSentimentCard: React.FC<MarketSentimentCardProps> = ({
  onNavigateToStock,
  onNavigateToChat,
  onNavigateToCommunity,
}) => {
  const { stocks, navigateToStock, setActiveTab, showToast } = useApp();

  const [filterMode, setFilterMode] = useState<'all' | 'chat' | 'posts'>('all');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      return storageService.getChatMessages('all') || [];
    } catch {
      return [];
    }
  });
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    try {
      return storageService.getPosts() || [];
    } catch {
      return [];
    }
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userVote, setUserVote] = useState<'bull' | 'bear' | null>(() => sentimentService.getUserVote());
  const [hasVotedToday, setHasVotedToday] = useState<boolean>(() => Boolean(sentimentService.getUserVote()));
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);

  // Real-time Chat Subscription
  useEffect(() => {
    let unsubscribeChat: (() => void) | null = null;
    try {
      unsubscribeChat = firebaseRepository.subscribeAllChat(
        msgs => {
          if (msgs && msgs.length > 0) {
            setChatMessages(msgs);
          }
        },
        100,
        err => {
          console.warn('[MarketSentimentCard] chat stream fallback:', err);
        }
      );
    } catch (e) {
      console.warn('[MarketSentimentCard] chat subscription error:', e);
    }

    return () => {
      if (unsubscribeChat) unsubscribeChat();
    };
  }, []);

  // Real-time Posts Subscription
  useEffect(() => {
    let unsubscribePosts: (() => void) | null = null;
    try {
      unsubscribePosts = firebaseRepository.subscribePosts(
        remotePosts => {
          if (remotePosts && remotePosts.length > 0) {
            setPosts(remotePosts);
          }
        },
        () => {}
      );
    } catch (e) {
      console.warn('[MarketSentimentCard] posts subscription error:', e);
    }

    return () => {
      if (unsubscribePosts) unsubscribePosts();
    };
  }, []);

  // Compute sentiment analysis based on active filter
  const sentimentData: SentimentAnalysisResult = useMemo(() => {
    const effectiveChat = filterMode === 'posts' ? [] : chatMessages;
    const effectivePosts = filterMode === 'chat' ? [] : posts;
    return sentimentService.analyzeSentiment(effectiveChat, effectivePosts, stocks);
  }, [chatMessages, posts, stocks, filterMode, userVote]);

  // Handle User Vote
  const handleVote = (vote: 'bull' | 'bear') => {
    sentimentService.castUserVote(vote);
    setUserVote(vote);
    setHasVotedToday(true);
    showToast(
      vote === 'bull' 
        ? '🚀 강세(Bull) 심리 투표가 실시간 지수에 반영되었습니다!' 
        : '📉 약세(Bear) 심리 투표가 실시간 지수에 반영되었습니다!', 
      'success'
    );
  };

  // Manual Refresh
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    // Fetch latest posts and chats
    firebaseRepository.getPosts()
      .then(p => {
        if (p && p.length > 0) setPosts(p);
      })
      .catch(() => {})
      .finally(() => {
        setTimeout(() => setIsRefreshing(false), 500);
      });
  };

  const handleStockClick = (symbol: string) => {
    if (onNavigateToStock) {
      onNavigateToStock(symbol);
    } else {
      navigateToStock(symbol);
    }
  };

  // Calculate needle angle for speedometer gauge (-90deg to +90deg, 0 to 100)
  // 0 -> -90 deg (extreme bear)
  // 50 -> 0 deg (neutral)
  // 100 -> +90 deg (extreme bull)
  const needleAngle = useMemo(() => {
    const clamped = Math.max(0, Math.min(100, sentimentData.indexScore));
    return -90 + (clamped / 100) * 180;
  }, [sentimentData.indexScore]);

  return (
    <section 
      aria-label="커뮤니티 시장 심리지수" 
      className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors relative overflow-hidden"
    >
      {/* Background Glow Accents */}
      <div 
        className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-10 transition-colors duration-700 ${
          sentimentData.indexScore >= 50 ? 'bg-emerald-500' : 'bg-rose-500'
        }`}
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-500" />
              <span>커뮤니티 시장 심리지수</span>
              <span className="font-mono text-xs font-bold text-slate-400">
                (Bull vs Bear Index)
              </span>
            </h2>

            {/* Live Indicator */}
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              LIVE
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap">
            <span>실시간 주주톡 · 토론 게시글 · 종목별 긍부정 형태소 빅데이터 분석</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <button
              onClick={() => setShowMethodologyModal(true)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 underline flex items-center gap-0.5 cursor-pointer"
            >
              <Info className="w-3 h-3" />
              <span>산출 방식</span>
            </button>
          </p>
        </div>

        {/* Action Controls & Filter Tabs */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Segmented Filter Control */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterMode === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              통합 심리
            </button>
            <button
              onClick={() => setFilterMode('chat')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterMode === 'chat'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              실시간 톡
            </button>
            <button
              onClick={() => setFilterMode('posts')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterMode === 'posts'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              토론 게시판
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            title="실시간 심리 데이터 새로고침"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid: Gauge & Stats on Left (5 cols) | Stock & Keyword Breakdown on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
        {/* Left: Sentiment Gauge & Index Meter */}
        <div className="lg:col-span-5 flex flex-col justify-between p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80">
          <div>
            {/* Index Label and Score */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  현재 시장 심리 지수
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                    {sentimentData.indexScore}
                  </span>
                  <span className="text-xs font-bold text-slate-400">/ 100</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    sentimentData.indexScore >= 56
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : sentimentData.indexScore <= 44
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}>
                    {sentimentData.zoneLabel}
                  </span>
                </div>
              </div>

              {/* Trend vs yesterday */}
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">전일 대비</span>
                <span className="text-xs font-mono font-bold text-emerald-500 flex items-center justify-end gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +{sentimentData.trendVsYesterday}pt
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {sentimentData.zoneDescription}
            </p>

            {/* SVG Speedometer Semi-circle Gauge */}
            <div className="relative flex flex-col items-center justify-center my-4 pt-1">
              <svg viewBox="0 0 200 115" className="w-48 sm:w-56 h-auto overflow-visible">
                <defs>
                  {/* Gauge Arc Gradient */}
                  <linearGradient id="bullBearGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />    {/* Red / Extreme Fear */}
                    <stop offset="25%" stopColor="#f97316" />   {/* Orange / Fear */}
                    <stop offset="50%" stopColor="#eab308" />   {/* Yellow / Neutral */}
                    <stop offset="75%" stopColor="#10b981" />   {/* Emerald / Bull */}
                    <stop offset="100%" stopColor="#059669" />  {/* Deep Green / Extreme Bull */}
                  </linearGradient>
                  <filter id="needleGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.5" />
                  </filter>
                </defs>

                {/* Track Arc Background */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="14"
                  strokeLinecap="round"
                  className="text-slate-200 dark:text-slate-800"
                />

                {/* Colored Gradient Arc */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="url(#bullBearGaugeGradient)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  opacity="0.9"
                />

                {/* Gauge Tick Markers */}
                <circle cx="20" cy="100" r="2.5" fill="#ef4444" />
                <circle cx="60" cy="40" r="2" fill="#f97316" opacity="0.6" />
                <circle cx="100" cy="20" r="3" fill="#eab308" />
                <circle cx="140" cy="40" r="2" fill="#10b981" opacity="0.6" />
                <circle cx="180" cy="100" r="2.5" fill="#059669" />

                {/* Needle Indicator (Pivot at cx=100, cy=100) */}
                <g 
                  transform={`rotate(${needleAngle} 100 100)`} 
                  style={{ transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                  filter="url(#needleGlow)"
                >
                  {/* Needle Pointer */}
                  <polygon points="98,100 102,100 100,26" fill="#f8fafc" />
                  <polygon points="99,100 101,100 100,22" fill="#e2e8f0" />
                  <circle cx="100" cy="100" r="7" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2.5" />
                  <circle cx="100" cy="100" r="3" fill="#38bdf8" />
                </g>

                {/* Gauge Labels */}
                <text x="18" y="112" fontSize="9" fontWeight="bold" fill="#ef4444" textAnchor="start">
                  BEAR (0)
                </text>
                <text x="100" y="34" fontSize="8" fontWeight="600" fill="#94a3b8" textAnchor="middle">
                  50
                </text>
                <text x="182" y="112" fontSize="9" fontWeight="bold" fill="#10b981" textAnchor="end">
                  BULL (100)
                </text>
              </svg>
            </div>

            {/* Split Bull vs Bear Ratio Bar */}
            <div className="space-y-1.5 mt-1">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-emerald-500 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  강세 {sentimentData.bullPercent}%
                </span>
                <span className="text-slate-400 text-[11px] font-normal">
                  중립 {sentimentData.neutralPercent}%
                </span>
                <span className="text-rose-500 flex items-center gap-1">
                  약세 {sentimentData.bearPercent}%
                  <TrendingDown className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Comparative Dual Bar */}
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500 transition-all duration-700"
                  style={{ width: `${sentimentData.bullPercent}%` }}
                />
                <div
                  className="h-full bg-slate-300 dark:bg-slate-700 transition-all duration-700"
                  style={{ width: `${sentimentData.neutralPercent}%` }}
                />
                <div
                  className="h-full bg-rose-500 transition-all duration-700"
                  style={{ width: `${sentimentData.bearPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive User Sentiment Vote Section */}
          <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                오늘 시장 내 전망 투표
              </span>
              {hasVotedToday && (
                <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  투표 반영됨 ({userVote === 'bull' ? '강세' : '약세'})
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleVote('bull')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  userVote === 'bull'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>강세 (상승 기대)</span>
              </button>

              <button
                onClick={() => handleVote('bear')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  userVote === 'bear'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>약세 (조정 경계)</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5">
              <span>총 {sentimentData.totalAnalyzed.toLocaleString()}건의 데이터 분석</span>
              <span className="font-mono">{sentimentData.lastUpdated} 기준</span>
            </div>
          </div>
        </div>

        {/* Right: Stock Sentiment Breakdown & Hot Keywords */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Top Discussed Stocks Sentiment List */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  커뮤니티 최다 언급 종목 심리 체감도
                </h3>
              </div>
              <button
                onClick={() => {
                  if (onNavigateToChat) onNavigateToChat();
                  else setActiveTab('chat');
                }}
                className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>실시간 주주톡 바로가기</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Stocks Sentiment List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 overflow-hidden">
              {sentimentData.topDiscussedStocks.map(stock => (
                <div
                  key={stock.symbol}
                  onClick={() => handleStockClick(stock.symbol)}
                  className="p-3 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                >
                  {/* Stock Identification */}
                  <div className="min-w-0 sm:w-1/3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors truncate">
                        {stock.name}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {stock.symbol}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                      <span>언급 {stock.totalMentions}건</span>
                      {stock.topKeywords.length > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-500 dark:text-slate-400 truncate">
                            #{stock.topKeywords.join(' #')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Sentiment Dual Bar & Ratio */}
                  <div className="flex-1 sm:px-3">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1">
                      <span className="text-emerald-500">
                        Bull {stock.bullPercent}%
                      </span>
                      <span className="text-rose-500">
                        Bear {stock.bearPercent}%
                      </span>
                    </div>

                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${stock.bullPercent}%` }}
                      />
                      <div
                        className="h-full bg-rose-500"
                        style={{ width: `${stock.bearPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Stock Price & Change Badge */}
                  <div className="text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                    {stock.price ? (
                      <div className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                        {stock.price.toLocaleString()}원
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-normal">시세 연동</span>
                    )}
                    {stock.changePercent !== undefined ? (
                      <PriceBadge change={stock.changePercent} changePercent={stock.changePercent} size="sm" />
                    ) : (
                      <span className={`text-[11px] font-bold ${stock.dominantSentiment === 'bull' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {stock.dominantSentiment === 'bull' ? '강세 우세' : '조정 경계'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Community Sentiment Keywords */}
          <div className="p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
              <span>실시간 커뮤니티 감성 키워드 랭킹</span>
              <span className="text-[11px] font-normal text-slate-400">자연어 형태소 분석</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Bullish Keywords */}
              <div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1.5">
                  <TrendingUp className="w-3 h-3" />
                  강세 주요 키워드
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sentimentData.trendingBullKeywords.map(kw => (
                    <span
                      key={kw.keyword}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-medium"
                    >
                      <span>#{kw.keyword}</span>
                      <span className="font-mono text-[10px] text-emerald-500 font-bold">
                        {kw.count}
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Bearish Keywords */}
              <div>
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 mb-1.5">
                  <TrendingDown className="w-3 h-3" />
                  약세 주요 키워드
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sentimentData.trendingBearKeywords.map(kw => (
                    <span
                      key={kw.keyword}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20 font-medium"
                    >
                      <span>#{kw.keyword}</span>
                      <span className="font-mono text-[10px] text-rose-500 font-bold">
                        {kw.count}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Methodology Modal */}
      {showMethodologyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-rose-500" />
                Bull vs Bear 심리지수 산출 기준
              </h3>
              <button
                onClick={() => setShowMethodologyModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2.5 leading-relaxed">
              <p>
                <strong>커뮤니티 시장 심리지수(Bull vs Bear Index)</strong>는 Stock Insight 커뮤니티의 모든 실시간 대화 및 종목 토론 게시글을 종합하여 시장 참여자들의 심리를 0부터 100 사이의 수치로 산출합니다.
              </p>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-rose-500 font-bold">0 ~ 25</span>
                  <span>극단적 공포 / 약세 우위 (Extreme Bear)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-500 font-bold">26 ~ 44</span>
                  <span>약세 우위 / 조정 경계 (Bearish)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-500 font-bold">45 ~ 55</span>
                  <span>중립 / 방향성 탐색 관망 (Neutral)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-500 font-bold">56 ~ 74</span>
                  <span>강세 우위 / 매수 심리 견고 (Bullish)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rose-500 font-bold">75 ~ 100</span>
                  <span>극단적 탐욕 / 과열 랠리 (Extreme Greed)</span>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="font-bold text-slate-800 dark:text-slate-200">데이터 수집 및 가중치:</div>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>실시간 주주톡</strong>: 사용자가 메시지 전송 시 선택한 강세(Bull)/약세(Bear) 태그 (가중치 1.5x)</li>
                  <li><strong>게시글 및 댓글</strong>: 증시 전문 긍·부정 금융 형태소 분석 (상한가, 신고가, 수혜 vs 손절, 급락, 공매도 등)</li>
                  <li><strong>투자자 즉석 투표</strong>: 매일 참여하는 사용자 전망 투표 (가중치 2.0x)</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowMethodologyModal(false)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
