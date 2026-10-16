import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Clock, 
  Bell, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  ExternalLink, 
  Check, 
  X, 
  Sparkles, 
  Globe, 
  Bookmark, 
  ShieldCheck, 
  HelpCircle,
  Sliders,
  CalendarCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  CalendarEvent, 
  CalendarSummary, 
  CalendarMarket, 
  CalendarEventType, 
  CalendarAlertSettings 
} from '../../types';
import { calendarService, DEFAULT_CLIENT_CALENDAR_SETTINGS } from '../../services/calendarService';
import { notificationService } from '../../services/notificationService';

type ViewMode = 'MONTH' | 'WEEK' | 'DAY';

export const CalendarView: React.FC = () => {
  const { user, watchlist, navigateToStock, showToast } = useApp();

  // Current calendar viewing state
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('MONTH');
  const [marketFilter, setMarketFilter] = useState<CalendarMarket>('ALL');
  const [typeFilter, setTypeFilter] = useState<CalendarEventType | 'ALL'>('ALL');

  // Data states
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [summary, setSummary] = useState<CalendarSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Alert Settings Modal State
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [alertSettings, setAlertSettings] = useState<CalendarAlertSettings>(DEFAULT_CLIENT_CALENDAR_SETTINGS);
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Load summary and alert settings on mount
  useEffect(() => {
    calendarService.getSummary().then(res => setSummary(res));
    calendarService.getAlertSettings(user?.id).then(res => setAlertSettings(res));
  }, [user?.id]);

  // Load calendar events based on year, month, and filters
  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const res = await calendarService.getEvents({
        year: currentYear,
        month: currentMonth,
        market: marketFilter !== 'ALL' ? marketFilter : undefined,
        type: typeFilter !== 'ALL' ? typeFilter : undefined,
      });
      setEvents(res.events || []);
    } catch (err) {
      console.warn('[CalendarView] load events failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [currentYear, currentMonth, marketFilter, typeFilter]);

  // Check advance alerts and deliver in-app notifications
  useEffect(() => {
    calendarService.checkAdvanceAlerts(watchlist, user?.id).then(notifs => {
      if (notifs && notifs.length > 0) {
        notifs.forEach(n => {
          notificationService.createNotification(
            n.title,
            n.message,
            'SYSTEM',
            undefined,
            user?.id
          );
        });
      }
    });
  }, [watchlist, user?.id]);

  // Navigation handlers
  const handlePrev = () => {
    if (viewMode === 'MONTH') {
      setCurrentDate(new Date(currentYear, currentMonth - 2, 1));
    } else if (viewMode === 'WEEK') {
      const prevWeek = new Date(currentDate);
      prevWeek.setDate(prevWeek.getDate() - 7);
      setCurrentDate(prevWeek);
    } else {
      const prevDay = new Date(currentDate);
      prevDay.setDate(prevDay.getDate() - 1);
      setCurrentDate(prevDay);
    }
  };

  const handleNext = () => {
    if (viewMode === 'MONTH') {
      setCurrentDate(new Date(currentYear, currentMonth, 1));
    } else if (viewMode === 'WEEK') {
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      setCurrentDate(nextWeek);
    } else {
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setCurrentDate(nextDay);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Save Alert Settings
  const handleSaveAlertSettings = async () => {
    setIsSavingSettings(true);
    try {
      const updated = await calendarService.saveAlertSettings(alertSettings, user?.id);
      setAlertSettings(updated);
      showToast('증시 캘린더 사전 알림 설정이 저장되었습니다.', 'success');
      setIsAlertModalOpen(false);
    } catch {
      showToast('알림 설정을 저장하는 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Browser Push Permission Request
  const handleRequestPushPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setAlertSettings(prev => ({ ...prev, browserPushEnabled: true }));
        showToast('브라우저 푸시 알림이 활성화되었습니다.', 'success');
      } else {
        showToast('브라우저 알림 권한이 거부되었습니다.', 'warning');
      }
    } else {
      showToast('현재 브라우저에서는 웹 푸시를 지원하지 않습니다.', 'info');
    }
  };

  // Helper styles by event type
  const getTypeBadge = (type: CalendarEventType) => {
    switch (type) {
      case 'HOLIDAY':
        return { label: '휴장일', bg: 'bg-rose-500/10 text-rose-500 border-rose-500/20' };
      case 'ECONOMIC':
        return { label: '경제지표', bg: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
      case 'EARNINGS':
        return { label: '기업실적', bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
      case 'DIVIDEND':
        return { label: '배당', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
    }
  };

  // Month grid calculations
  const monthDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const lastDay = new Date(currentYear, currentMonth, 0);
    const startDayOfWeek = firstDay.getDay(); // 0 is Sunday
    const totalDays = lastDay.getDate();

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean; events: CalendarEvent[] }[] = [];

    // Prev month padding
    const prevMonthLastDay = new Date(currentYear, currentMonth - 1, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const m = currentMonth - 1 <= 0 ? 12 : currentMonth - 1;
      const y = currentMonth - 1 <= 0 ? currentYear - 1 : currentYear;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: false,
        events: events.filter(e => e.date === dateStr),
      });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: true,
        events: events.filter(e => e.date === dateStr),
      });
    }

    // Next month padding to complete 35 or 42 grid cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const m = currentMonth + 1 > 12 ? 1 : currentMonth + 1;
      const y = currentMonth + 1 > 12 ? currentYear + 1 : currentYear;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: false,
        events: events.filter(e => e.date === dateStr),
      });
    }

    return days;
  }, [currentYear, currentMonth, events]);

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* 1. Header Bar: Title, Filters & Settings Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>증시 캘린더</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 font-mono">
                  KR · US LIVE
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                한국거래소 · 미국 NYSE/NASDAQ 휴장일, 경제지표, 기업 실적, 배당 일정을 공식 캘린더로 확인하세요.
              </p>
            </div>
          </div>
        </div>

        {/* Top-Right Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode (월 / 주 / 일) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('MONTH')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'MONTH'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              월간
            </button>
            <button
              onClick={() => setViewMode('WEEK')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'WEEK'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              주간
            </button>
            <button
              onClick={() => setViewMode('DAY')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'DAY'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              일간
            </button>
          </div>

          {/* 사전 알림 설정 모달 열기 버튼 */}
          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="증시 일정 사전 알림 설정 (1일 전, 1시간 전, 15분 전)"
          >
            <Bell className="w-3.5 h-3.5 text-rose-500" />
            <span>사전 알림 설정</span>
            {alertSettings.enabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Today & Week Highlights Banner */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Today Highlights */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 text-rose-500">
                <Clock className="w-3.5 h-3.5" />
                오늘의 일정 ({summary.todayEvents.length}건)
              </span>
              <span className="font-mono">{todayStr}</span>
            </div>
            {summary.todayEvents.length > 0 ? (
              <div className="space-y-1.5">
                {summary.todayEvents.slice(0, 2).map(e => (
                  <div 
                    key={e.id}
                    onClick={() => setSelectedEvent(e)}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer transition-colors"
                  >
                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {e.title}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {e.timeKST} · {e.market}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-3">오늘 예정된 주요 이벤트가 없습니다.</p>
            )}
          </div>

          {/* Card 2: Week High Impact Events */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-xs md:col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 text-amber-500">
                <Sparkles className="w-3.5 h-3.5" />
                이번 주 핵심 이벤트 ({summary.weekEvents.length}건)
              </span>
              <span className="text-[11px] text-slate-400">D-7일 이내</span>
            </div>
            {summary.weekEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {summary.weekEvents.slice(0, 4).map(e => (
                  <div 
                    key={e.id}
                    onClick={() => setSelectedEvent(e)}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-500/10 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold shrink-0">
                        {e.date.slice(5)}
                      </span>
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {e.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5 pl-0.5 truncate">
                      {e.timeKST} {e.localTime ? `(${e.localTime})` : ''}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-3">이번 주 예정된 주요 경제/기업 이벤트가 없습니다.</p>
            )}
          </div>

          {/* Card 3: Monthly Statistics */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs font-bold text-slate-400 mb-2 flex items-center justify-between">
              <span>{currentMonth}월 캘린더 통계</span>
              <span className="font-mono text-rose-500 font-bold">{summary.counts.totalThisMonth}건</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-rose-500/5 border border-rose-500/15">
                <span className="text-[10px] text-slate-400 block">휴장일</span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{summary.counts.holidays}일</span>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-500/15">
                <span className="text-[10px] text-slate-400 block">경제지표</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{summary.counts.economic}건</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                <span className="text-[10px] text-slate-400 block">기업실적</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{summary.counts.earnings}건</span>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/15">
                <span className="text-[10px] text-slate-400 block">배당일정</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{summary.counts.dividends}건</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Secondary Navigation & Multi-Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        {/* Month/Week Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="이전 기간"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="font-black text-base sm:text-lg text-slate-900 dark:text-white font-mono px-2">
            {currentYear}년 {currentMonth}월
          </div>
          <button
            onClick={handleNext}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="다음 기간"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-bold transition-colors cursor-pointer ml-1"
          >
            오늘
          </button>
        </div>

        {/* Filters: Market & Event Types */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Market Filter */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl font-medium">
            <button
              onClick={() => setMarketFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                marketFilter === 'ALL'
                  ? 'bg-rose-500 text-white font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              전체 시장
            </button>
            <button
              onClick={() => setMarketFilter('KR')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                marketFilter === 'KR'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🇰🇷 한국
            </button>
            <button
              onClick={() => setMarketFilter('US')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                marketFilter === 'US'
                  ? 'bg-purple-600 text-white font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🇺🇸 미국
            </button>
          </div>

          {/* Type Filter */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl font-medium">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                typeFilter === 'ALL'
                  ? 'bg-slate-900 dark:bg-slate-700 text-white font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setTypeFilter('HOLIDAY')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                typeFilter === 'HOLIDAY'
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              휴장일
            </button>
            <button
              onClick={() => setTypeFilter('ECONOMIC')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                typeFilter === 'ECONOMIC'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              경제지표
            </button>
            <button
              onClick={() => setTypeFilter('EARNINGS')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                typeFilter === 'EARNINGS'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              실적
            </button>
            <button
              onClick={() => setTypeFilter('DIVIDEND')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                typeFilter === 'DIVIDEND'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              배당
            </button>
          </div>
        </div>
      </div>

      {/* 4. Calendar Views (MONTH, WEEK, DAY) */}
      <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {viewMode === 'MONTH' && (
          <div>
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 text-center text-xs font-bold py-3 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-rose-500">일</span>
              <span>월</span>
              <span>화</span>
              <span>수</span>
              <span>목</span>
              <span>금</span>
              <span className="text-blue-500">토</span>
            </div>

            {/* 35 or 42 Days Calendar Grid */}
            <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800/80">
              {monthDays.map((cell, idx) => {
                const isToday = cell.dateStr === todayStr;
                const isSun = idx % 7 === 0;
                const isSat = idx % 7 === 6;

                return (
                  <div
                    key={cell.dateStr}
                    className={`min-h-[110px] sm:min-h-[130px] p-1.5 sm:p-2 transition-colors flex flex-col justify-between ${
                      !cell.isCurrentMonth
                        ? 'bg-slate-50/40 dark:bg-slate-900/30 opacity-40'
                        : isToday
                        ? 'bg-rose-500/5 dark:bg-rose-500/10'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    {/* Top Row: Date Number & Indicators */}
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-mono font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday
                          ? 'bg-rose-500 text-white font-black'
                          : isSun
                          ? 'text-rose-500'
                          : isSat
                          ? 'text-blue-500'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {cell.dayNum}
                      </span>
                      {cell.events.length > 0 && (
                        <span className="text-[10px] font-mono text-slate-400 font-bold hidden sm:inline">
                          {cell.events.length}건
                        </span>
                      )}
                    </div>

                    {/* Events List for Day */}
                    <div className="space-y-1 overflow-y-auto max-h-[85px] scrollbar-none flex-1">
                      {cell.events.slice(0, 3).map(e => {
                        const badge = getTypeBadge(e.type);
                        const isWatch = e.symbol && watchlist.includes(e.symbol);

                        return (
                          <div
                            key={e.id}
                            onClick={() => setSelectedEvent(e)}
                            className={`px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-medium border truncate cursor-pointer transition-transform hover:scale-[1.02] flex items-center gap-1 ${badge.bg}`}
                            title={`${e.title} (${e.timeKST})`}
                          >
                            <span className="font-bold shrink-0">{e.market === 'US' ? 'US' : 'KR'}</span>
                            <span className="truncate">{e.title}</span>
                            {isWatch && (
                              <Bookmark className="w-2.5 h-2.5 fill-amber-500 text-amber-500 shrink-0 ml-auto" />
                            )}
                          </div>
                        );
                      })}
                      {cell.events.length > 3 && (
                        <div 
                          onClick={() => {
                            setCurrentDate(new Date(cell.dateStr));
                            setViewMode('DAY');
                          }}
                          className="text-[10px] text-slate-400 font-bold text-center hover:text-rose-500 cursor-pointer pt-0.5"
                        >
                          +{cell.events.length - 3}건 더보기
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* WEEK & DAY Views */}
        {(viewMode === 'WEEK' || viewMode === 'DAY') && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span>
                {viewMode === 'WEEK' ? '주간 일정 타임라인' : `${currentDate.toISOString().slice(0, 10)} 일간 세부 일정`}
              </span>
              <span>총 {events.length}개 일정 등록됨</span>
            </div>

            {events.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {events.map(e => {
                  const badge = getTypeBadge(e.type);
                  const isWatch = e.symbol && watchlist.includes(e.symbol);

                  return (
                    <div
                      key={e.id}
                      onClick={() => setSelectedEvent(e)}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 px-3 rounded-xl transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="text-center font-mono shrink-0 w-14">
                          <span className="text-xs font-bold text-rose-500 block">{e.date.slice(5)}</span>
                          <span className="text-[11px] text-slate-400 block">{e.timeKST}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border font-mono ${badge.bg}`}>
                              {badge.label}
                            </span>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {e.market}
                            </span>
                            <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors">
                              {e.title}
                            </span>
                            {e.status === 'CONFIRMED' ? (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                확정
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                예정
                              </span>
                            )}
                            {isWatch && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 flex items-center gap-0.5">
                                <Bookmark className="w-2.5 h-2.5 fill-amber-500" />
                                관심종목
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                            {e.description || e.source}
                          </p>
                        </div>
                      </div>

                      {/* Right: Metrics or details */}
                      <div className="text-right text-xs font-mono shrink-0 self-end sm:self-center">
                        {e.forecast && (
                          <div className="text-slate-500 dark:text-slate-400">
                            예상치: <span className="font-bold text-slate-800 dark:text-slate-200">{e.forecast}</span>
                          </div>
                        )}
                        {e.dividendAmount && (
                          <div className="text-amber-600 font-bold">
                            배당금: {e.dividendAmount}
                          </div>
                        )}
                        {e.localTime && (
                          <div className="text-[11px] text-slate-400">
                            현지: {e.localTime}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-slate-400">
                선택한 기간과 필터에 해당하는 일정이 없습니다.
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Event Detail Modal */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="w-full max-w-lg bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getTypeBadge(selectedEvent.type).bg}`}>
                    {getTypeBadge(selectedEvent.type).label}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {selectedEvent.market}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    중요도: {selectedEvent.importance}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedEvent.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Time & Location Information */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[11px]">일정 날짜 (KST)</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedEvent.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">발표 시각</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedEvent.timeKST}</span>
              </div>
              {selectedEvent.localTime && (
                <div className="col-span-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">미국 현지 시간 (서머타임 자동 계산)</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{selectedEvent.localTime}</span>
                </div>
              )}
            </div>

            {/* Description & Metrics */}
            <div className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
              <p className="leading-relaxed bg-slate-50/50 dark:bg-slate-800/20 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                {selectedEvent.description || '공식 세부 설명이 제공되지 않는 일정입니다.'}
              </p>

              {(selectedEvent.forecast || selectedEvent.previous || selectedEvent.actual) && (
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl font-mono text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block">이전치</span>
                    <span className="font-bold">{selectedEvent.previous || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">시장 예상치</span>
                    <span className="font-bold text-blue-500">{selectedEvent.forecast || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">실제 발표치</span>
                    <span className="font-bold text-rose-500">{selectedEvent.actual || '대기 중'}</span>
                  </div>
                </div>
              )}

              {selectedEvent.dividendAmount && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-700 dark:text-amber-400 font-mono">
                  주당 배당금: <strong>{selectedEvent.dividendAmount}</strong> (예상 수익률: {selectedEvent.dividendYield || '-'})
                </div>
              )}
            </div>

            {/* Official Source & Verification */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 space-y-1 bg-slate-50/50 dark:bg-slate-800/20">
              <div className="flex items-center justify-between">
                <span>데이터 출처</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedEvent.source}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>일정 상태</span>
                <span className={`font-bold ${selectedEvent.status === 'CONFIRMED' ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {selectedEvent.status === 'CONFIRMED' ? '공식 확정 일정' : '예정 일정 (변경 가능)'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              {selectedEvent.symbol ? (
                <button
                  onClick={() => {
                    navigateToStock(selectedEvent.symbol!);
                    setSelectedEvent(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                  <span>{selectedEvent.symbolName || selectedEvent.symbol} 종목 상세 보기</span>
                </button>
              ) : <div />}

              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Alert Settings Modal */}
      {isAlertModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsAlertModalOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  증시 캘린더 사전 알림 설정
                </h3>
              </div>
              <button 
                onClick={() => setIsAlertModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Master Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block">
                  캘린더 사전 알림 켜기
                </span>
                <span className="text-xs text-slate-400">
                  주요 경제 지표 및 실적 발표 전 미리 알림 수신
                </span>
              </div>
              <input 
                type="checkbox"
                checked={alertSettings.enabled}
                onChange={e => setAlertSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
              />
            </div>

            {alertSettings.enabled && (
              <div className="space-y-4 text-xs">
                {/* Notification Timing Settings (1일 전, 1시간 전, 15분 전) */}
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    ⏰ 알림 발송 시점 선택
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['1d', '1h', '15m'] as const).map(timing => {
                      const isSelected = alertSettings.timings.includes(timing);
                      const labels = { '1d': '1일 전 (24h)', '1h': '1시간 전', '15m': '15분 전' };

                      return (
                        <button
                          key={timing}
                          type="button"
                          onClick={() => {
                            setAlertSettings(prev => ({
                              ...prev,
                              timings: isSelected 
                                ? prev.timings.filter(t => t !== timing)
                                : [...prev.timings, timing],
                            }));
                          }}
                          className={`p-2.5 rounded-xl border font-bold transition-all cursor-pointer text-center ${
                            isSelected
                              ? 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400'
                              : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {labels[timing]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Event Types to Notify */}
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    📌 수신할 이벤트 유형
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'HOLIDAY' as const, label: '휴장일' },
                      { id: 'ECONOMIC' as const, label: '경제지표 (FOMC/CPI)' },
                      { id: 'EARNINGS' as const, label: '기업 실적 발표' },
                      { id: 'DIVIDEND' as const, label: '배당락 / 배당일' },
                    ].map(t => {
                      const isChecked = alertSettings.types.includes(t.id);
                      return (
                        <label 
                          key={t.id}
                          className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 cursor-pointer"
                        >
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setAlertSettings(prev => ({
                                ...prev,
                                types: isChecked 
                                  ? prev.types.filter(item => item !== t.id)
                                  : [...prev.types, t.id],
                              }));
                            }}
                            className="w-4 h-4 accent-rose-600 rounded"
                          />
                          <span className="font-medium text-slate-700 dark:text-slate-300">{t.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Watchlist Priority Filter */}
                <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      ⭐ 관심종목 실적/배당 우선 알림
                    </span>
                    <span className="text-[11px] text-slate-400">
                      등록한 관심종목의 일정만 선별하여 알림 발송
                    </span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={alertSettings.watchlistOnly}
                    onChange={e => setAlertSettings(prev => ({ ...prev, watchlistOnly: e.target.checked }))}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                {/* Web Push Support */}
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      웹 브라우저 푸시 알림
                    </span>
                    <span className="text-[11px] text-slate-400">
                      앱을 닫은 상태에서도 브라우저 푸시 수신
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRequestPushPermission}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      alertSettings.browserPushEnabled
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-rose-500 hover:text-white'
                    }`}
                  >
                    {alertSettings.browserPushEnabled ? '권한 허용됨' : '권한 요청'}
                  </button>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAlertModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveAlertSettings}
                disabled={isSavingSettings}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20 cursor-pointer disabled:opacity-50"
              >
                {isSavingSettings ? '저장 중...' : '설정 저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
