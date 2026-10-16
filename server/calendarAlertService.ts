/**
 * Server Calendar Alert Service
 * 
 * Manages:
 * 1. User calendar alert settings (persisted per user)
 * 2. Pre-event advance notifications (1 day before, 1 hour before, 15 minutes before)
 * 3. Watchlist priority filtering for earnings and dividends
 * 4. Deduplication & in-app dispatch
 */

import { CalendarAlertSettings, CalendarEvent } from '../src/types';
import { marketCalendarService } from './marketCalendarService';

export const DEFAULT_CALENDAR_ALERT_SETTINGS: CalendarAlertSettings = {
  enabled: true,
  timings: ['1d', '1h', '15m'],
  types: ['HOLIDAY', 'ECONOMIC', 'EARNINGS', 'DIVIDEND'],
  markets: ['KR', 'US'],
  watchlistOnly: false,
  browserPushEnabled: false,
  updatedAt: new Date().toISOString(),
};

// In-memory alert settings cache per user (syncs with Firestore or localStorage on client)
const userSettingsStore = new Map<string, CalendarAlertSettings>();

// Sent notification tracking to prevent duplicate deliveries: key `${uid}_${eventId}_${timing}`
const dispatchedAlerts = new Set<string>();

export interface GeneratedCalendarNotification {
  id: string;
  uid: string;
  eventId: string;
  title: string;
  message: string;
  eventDate: string;
  timeKST: string;
  market: 'KR' | 'US' | 'GLOBAL';
  type: string;
  timing: '1d' | '1h' | '15m';
  dispatchedAt: string;
}

export class CalendarAlertService {
  /**
   * Get alert settings for a user
   */
  public getSettings(uid: string): CalendarAlertSettings {
    const existing = userSettingsStore.get(uid);
    if (existing) return existing;
    return { ...DEFAULT_CALENDAR_ALERT_SETTINGS };
  }

  /**
   * Save alert settings for a user
   */
  public saveSettings(uid: string, settings: Partial<CalendarAlertSettings>): CalendarAlertSettings {
    const current = this.getSettings(uid);
    const updated: CalendarAlertSettings = {
      ...current,
      ...settings,
      updatedAt: new Date().toISOString(),
    };
    userSettingsStore.set(uid, updated);
    return updated;
  }

  /**
   * Evaluate upcoming events and generate advance notifications for a user
   */
  public checkAdvanceAlerts(
    uid: string,
    userWatchlist: string[] = [],
    currentTime: Date = new Date()
  ): GeneratedCalendarNotification[] {
    const settings = this.getSettings(uid);
    if (!settings.enabled) return [];

    const nowMs = currentTime.getTime();
    const { events } = marketCalendarService.getEvents();
    const notifications: GeneratedCalendarNotification[] = [];

    for (const event of events) {
      // 1. Filter by market
      if (event.market !== 'GLOBAL' && !settings.markets.includes(event.market as 'KR' | 'US')) {
        continue;
      }

      // 2. Filter by event type
      if (!settings.types.includes(event.type)) {
        continue;
      }

      // 3. Watchlist only filter for stock-specific events (Earnings & Dividends)
      if (settings.watchlistOnly && (event.type === 'EARNINGS' || event.type === 'DIVIDEND')) {
        if (event.symbol && !userWatchlist.includes(event.symbol.toUpperCase())) {
          continue;
        }
      }

      const eventTimeMs = new Date(event.startDateTime).getTime();
      const diffMs = eventTimeMs - nowMs;

      // Skip past events
      if (diffMs < 0) continue;

      // Check timing windows:
      // 1d (24 hours): between 23h 30m and 24h 30m
      if (settings.timings.includes('1d')) {
        const oneDayMs = 24 * 60 * 60 * 1000;
        if (Math.abs(diffMs - oneDayMs) <= (30 * 60 * 1000)) {
          const dispatchKey = `${uid}_${event.id}_1d`;
          if (!dispatchedAlerts.has(dispatchKey)) {
            dispatchedAlerts.add(dispatchKey);
            notifications.push({
              id: `notif_cal_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
              uid,
              eventId: event.id,
              title: `📅 [내일 예정] ${event.title}`,
              message: `${event.title} 일정이 내일 ${event.timeKST}에 진행됩니다. (${event.source})`,
              eventDate: event.date,
              timeKST: event.timeKST,
              market: event.market,
              type: event.type,
              timing: '1d',
              dispatchedAt: new Date().toISOString(),
            });
          }
        }
      }

      // 1h (60 minutes): between 50m and 70m
      if (settings.timings.includes('1h')) {
        const oneHourMs = 60 * 60 * 1000;
        if (Math.abs(diffMs - oneHourMs) <= (10 * 60 * 1000)) {
          const dispatchKey = `${uid}_${event.id}_1h`;
          if (!dispatchedAlerts.has(dispatchKey)) {
            dispatchedAlerts.add(dispatchKey);
            notifications.push({
              id: `notif_cal_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
              uid,
              eventId: event.id,
              title: `⏰ [1시간 전] ${event.title}`,
              message: `약 1시간 후 (${event.timeKST}) ${event.title} 일정이 시작됩니다.`,
              eventDate: event.date,
              timeKST: event.timeKST,
              market: event.market,
              type: event.type,
              timing: '1h',
              dispatchedAt: new Date().toISOString(),
            });
          }
        }
      }

      // 15m (15 minutes): between 10m and 20m
      if (settings.timings.includes('15m')) {
        const fifteenMinMs = 15 * 60 * 1000;
        if (Math.abs(diffMs - fifteenMinMs) <= (5 * 60 * 1000)) {
          const dispatchKey = `${uid}_${event.id}_15m`;
          if (!dispatchedAlerts.has(dispatchKey)) {
            dispatchedAlerts.add(dispatchKey);
            notifications.push({
              id: `notif_cal_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
              uid,
              eventId: event.id,
              title: `🚨 [15분 전] ${event.title}`,
              message: `15분 후 (${event.timeKST}) ${event.title} 일정이 시작됩니다. 변동성에 유의하세요.`,
              eventDate: event.date,
              timeKST: event.timeKST,
              market: event.market,
              type: event.type,
              timing: '15m',
              dispatchedAt: new Date().toISOString(),
            });
          }
        }
      }
    }

    return notifications;
  }
}

export const calendarAlertService = new CalendarAlertService();
