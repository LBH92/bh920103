/**
 * Client Market Calendar Service
 * 
 * Interacts with /api/calendar/* endpoints
 */

import { CalendarEvent, CalendarSummary, CalendarAlertSettings, CalendarMarket, CalendarEventType } from '../types';

export const DEFAULT_CLIENT_CALENDAR_SETTINGS: CalendarAlertSettings = {
  enabled: true,
  timings: ['1d', '1h', '15m'],
  types: ['HOLIDAY', 'ECONOMIC', 'EARNINGS', 'DIVIDEND'],
  markets: ['KR', 'US'],
  watchlistOnly: false,
  browserPushEnabled: false,
  updatedAt: new Date().toISOString(),
};

const STORAGE_KEY_CALENDAR_SETTINGS = 'bd_calendar_alert_settings';

class CalendarService {
  /**
   * Fetch calendar events with optional filters
   */
  async getEvents(options: {
    year?: number;
    month?: number;
    market?: CalendarMarket;
    type?: CalendarEventType;
    symbol?: string;
  } = {}): Promise<{ events: CalendarEvent[]; total: number; source: string }> {
    const params = new URLSearchParams();
    if (options.year) params.append('year', options.year.toString());
    if (options.month) params.append('month', options.month.toString());
    if (options.market && options.market !== 'ALL') params.append('market', options.market);
    if (options.type) params.append('type', options.type);
    if (options.symbol) params.append('symbol', options.symbol);

    try {
      const res = await fetch(`/api/calendar/events?${params.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('[CalendarService] Fetch events error:', err);
    }

    return { events: [], total: 0, source: 'API 미연결' };
  }

  /**
   * Fetch summary (today, week highlights, counts)
   */
  async getSummary(): Promise<CalendarSummary> {
    try {
      const res = await fetch('/api/calendar/summary');
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('[CalendarService] Fetch summary error:', err);
    }

    return {
      todayEvents: [],
      weekEvents: [],
      upcomingHighImpact: [],
      counts: {
        totalThisMonth: 0,
        holidays: 0,
        economic: 0,
        earnings: 0,
        dividends: 0,
      },
      serverTime: new Date().toISOString(),
    };
  }

  /**
   * Get single event
   */
  async getEvent(id: string): Promise<CalendarEvent | null> {
    try {
      const res = await fetch(`/api/calendar/events/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('[CalendarService] Fetch event error:', err);
    }
    return null;
  }

  /**
   * Get calendar alert settings (syncs with localStorage & server)
   */
  async getAlertSettings(uid?: string): Promise<CalendarAlertSettings> {
    // 1. Try localStorage first
    try {
      const cached = localStorage.getItem(STORAGE_KEY_CALENDAR_SETTINGS);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}

    // 2. Fetch from server
    try {
      const targetUid = uid || 'local-user';
      const res = await fetch(`/api/calendar/alerts/settings?uid=${encodeURIComponent(targetUid)}`);
      if (res.ok) {
        const settings = await res.json();
        localStorage.setItem(STORAGE_KEY_CALENDAR_SETTINGS, JSON.stringify(settings));
        return settings;
      }
    } catch {}

    return { ...DEFAULT_CLIENT_CALENDAR_SETTINGS };
  }

  /**
   * Save calendar alert settings
   */
  async saveAlertSettings(settings: CalendarAlertSettings, uid?: string): Promise<CalendarAlertSettings> {
    const updated = { ...settings, updatedAt: new Date().toISOString() };
    try {
      localStorage.setItem(STORAGE_KEY_CALENDAR_SETTINGS, JSON.stringify(updated));
    } catch {}

    try {
      const targetUid = uid || 'local-user';
      await fetch('/api/calendar/alerts/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: targetUid, settings: updated }),
      });
    } catch (err) {
      console.warn('[CalendarService] Save settings error:', err);
    }

    return updated;
  }

  /**
   * Check upcoming advance alerts
   */
  async checkAdvanceAlerts(watchlist: string[] = [], uid?: string): Promise<any[]> {
    try {
      const targetUid = uid || 'local-user';
      const res = await fetch('/api/calendar/alerts/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: targetUid, watchlist }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.notifications || [];
      }
    } catch (err) {
      console.warn('[CalendarService] Check alerts error:', err);
    }
    return [];
  }
}

export const calendarService = new CalendarService();
