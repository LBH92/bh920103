/**
 * Browser Push Notification Service (HTML5 Notification API)
 * 
 * Direct client-side browser notification dispatcher:
 * - Checks and requests Notification.permission
 * - Synthesizes soft audio chimes via Web Audio API (no external file dependencies)
 * - Manages duplicate notification cooldowns per stock symbol
 * - Evaluates quiet hours
 * - Dispatches native desktop/mobile OS notifications
 * - Integrates with in-app notification history
 */

import { UserNotificationSettings } from '../types';
import { notificationService } from './notificationService';

export interface WatchlistAlertPayload {
  symbol: string;
  stockName: string;
  type: 'surge_gain' | 'surge_loss' | 'volume_spike';
  currentPrice: number;
  changePercent: number;
  change: number;
  volume?: number;
  currency?: string;
  reason: string;
}

class BrowserPushNotificationService {
  // Cooldown tracker: `${symbol}_${type}` -> lastTriggerTimestamp (ms)
  private cooldownMap: Map<string, number> = new Map();
  private audioContext: AudioContext | null = null;

  /**
   * Check if Notification API is supported by the current browser
   */
  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  /**
   * Get current Notification API permission state
   */
  public getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  /**
   * Request browser notification permission
   */
  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    try {
      const perm = await Notification.requestPermission();
      return perm;
    } catch (err) {
      console.warn('[BrowserPushNotificationService] Permission request failed:', err);
      return 'denied';
    }
  }

  /**
   * Clear cooldown map (for testing or reset)
   */
  public clearCooldowns(): void {
    this.cooldownMap.clear();
  }

  /**
   * Check if current time falls within user-specified quiet hours
   */
  public isQuietHours(settings: UserNotificationSettings): boolean {
    if (!settings.quietHoursEnabled) return false;
    try {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const [startH, startM] = (settings.quietHoursStart || '22:00').split(':').map(Number);
      const [endH, endM] = (settings.quietHoursEnd || '08:00').split(':').map(Number);

      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      if (startMinutes <= endMinutes) {
        return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
      } else {
        // Crosses midnight (e.g. 22:00 ~ 08:00)
        return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
      }
    } catch {
      return false;
    }
  }

  /**
   * Play subtle financial chime sound via Web Audio API
   */
  public playChime(type: 'gain' | 'loss' | 'neutral' = 'neutral'): void {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioContext || this.audioContext.state === 'closed') {
        this.audioContext = new AudioCtx();
      }

      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const ctx = this.audioContext;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';

      // Chime frequency based on alert mood
      if (type === 'gain') {
        // Rising two-tone: 587Hz (D5) -> 880Hz (A5)
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.12);
      } else if (type === 'loss') {
        // Falling two-tone: 659Hz (E5) -> 440Hz (A4)
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.exponentialRampToValueAtTime(440.00, now + 0.14);
      } else {
        // Clean neutral ping: 784Hz (G5)
        osc.frequency.setValueAtTime(783.99, now);
      }

      // Smooth envelope to avoid clicking
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.15, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Audio playback can fail if user hasn't interacted yet; safely ignore
    }
  }

  /**
   * Dispatch a browser push notification for watchlist sudden change
   */
  public async sendWatchlistAlert(
    payload: WatchlistAlertPayload,
    settings: UserNotificationSettings,
    uid?: string
  ): Promise<boolean> {
    // 1. Check if browser push is enabled in settings
    if (!settings.browserPushEnabled) return false;

    // 2. Check if quiet hours apply
    if (this.isQuietHours(settings)) {
      console.log(`[BrowserPushNotificationService] Suppressed due to quiet hours (${settings.quietHoursStart} ~ ${settings.quietHoursEnd})`);
      return false;
    }

    // 3. Check cooldown
    const cooldownMs = (settings.cooldownMinutes || 10) * 60 * 1000;
    const cooldownKey = `${payload.symbol}_${payload.type}`;
    const lastTrigger = this.cooldownMap.get(cooldownKey) || 0;
    const now = Date.now();

    if (now - lastTrigger < cooldownMs) {
      console.log(`[BrowserPushNotificationService] Suppressed by cooldown: ${cooldownKey} (remaining: ${Math.round((cooldownMs - (now - lastTrigger)) / 1000)}s)`);
      return false;
    }

    // 4. Construct Notification Title & Body
    let title = '';
    let body = '';
    const formattedPrice = payload.currency === 'USD' 
      ? `$${payload.currentPrice.toFixed(2)}` 
      : `${payload.currentPrice.toLocaleString()}원`;

    if (payload.type === 'surge_gain') {
      title = `🚀 [관심종목 급등] ${payload.stockName} +${payload.changePercent.toFixed(2)}%`;
      body = `현재가 ${formattedPrice} | 전일 대비 +${payload.changePercent.toFixed(2)}% 급등 중입니다. 터치하여 호가 및 차트를 확인하세요.`;
    } else if (payload.type === 'surge_loss') {
      title = `📉 [관심종목 급락] ${payload.stockName} ${payload.changePercent.toFixed(2)}%`;
      body = `현재가 ${formattedPrice} | 전일 대비 ${payload.changePercent.toFixed(2)}% 급락세입니다. 리스크 관리가 필요합니다.`;
    } else {
      title = `⚡ [관심종목 수급 폭증] ${payload.stockName}`;
      body = `현재가 ${formattedPrice} | 거래량이 평소 대비 급증하고 있습니다.`;
    }

    // 5. Update cooldown
    this.cooldownMap.set(cooldownKey, now);

    // 6. Play sound chime if enabled
    if (settings.soundEnabled) {
      this.playChime(payload.type === 'surge_gain' ? 'gain' : payload.type === 'surge_loss' ? 'loss' : 'neutral');
    }

    // 7. Dispatch Browser Notification via Notification API
    let dispatched = false;
    if (this.isSupported() && Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png',
          tag: `byeongdol-${payload.symbol}-${payload.type}-${now}`,
        });

        notif.onclick = () => {
          try {
            window.focus();
            window.dispatchEvent(new CustomEvent('app:navigate-stock', { detail: { symbol: payload.symbol } }));
            notif.close();
          } catch {}
        };

        dispatched = true;
      } catch (err) {
        console.warn('[BrowserPushNotificationService] Native Notification construction failed:', err);
      }
    }

    // 8. Always record in in-app notification center as well
    try {
      await notificationService.createNotification(
        title,
        body,
        payload.type === 'surge_gain' ? 'price_rise' : payload.type === 'surge_loss' ? 'price_fall' : 'volume_spike',
        payload.symbol,
        uid,
        payload.stockName
      );
    } catch {}

    return dispatched;
  }

  /**
   * Dispatch a test push notification to verify browser & sound functionality
   */
  public async sendTestAlert(settings: UserNotificationSettings): Promise<{ success: boolean; message: string }> {
    if (!this.isSupported()) {
      return { success: false, message: '이 브라우저는 웹 Notification API를 지원하지 않습니다.' };
    }

    let perm = Notification.permission;
    if (perm !== 'granted') {
      perm = await this.requestPermission();
      if (perm !== 'granted') {
        return { success: false, message: '브라우저 알림 권한이 허용되지 않았습니다. 브라우저 설정에서 알림을 허용해주세요.' };
      }
    }

    if (settings.soundEnabled) {
      this.playChime('gain');
    }

    try {
      const testNotif = new Notification('🔔 [병돌 인베스트먼트] 브라우저 푸시 알림 테스트', {
        body: '관심 종목 급등락 알림이 성공적으로 설정되었습니다! 시세 급변 시 알림을 받으실 수 있습니다.',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        tag: `byeongdol-test-${Date.now()}`,
      });

      testNotif.onclick = () => {
        window.focus();
        testNotif.close();
      };

      return { success: true, message: '테스트 알림이 성공적으로 발송되었습니다.' };
    } catch (err: any) {
      return { success: false, message: err.message || '알림 발송 중 오류가 발생했습니다.' };
    }
  }
}

export const browserPushNotificationService = new BrowserPushNotificationService();
