/**
 * User Notification Settings Service (Firestore Persistent Storage)
 * 
 * Manages user preferences for:
 * - Browser Notification API push toggle
 * - Watchlist rapid surge / plunge thresholds (e.g. +3%, -3%, +5%, -5%)
 * - Volume surge threshold
 * - Duplicate alert cooldown duration
 * - Notification sound & quiet hours
 */

import { db, auth } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserNotificationSettings } from '../types';

export const DEFAULT_NOTIFICATION_SETTINGS: UserNotificationSettings = {
  uid: '',
  browserPushEnabled: true,
  surgeGainEnabled: true,
  surgeGainThreshold: 3.0,
  surgeLossEnabled: true,
  surgeLossThreshold: -3.0,
  volumeSurgeEnabled: true,
  volumeSurgeThreshold: 200,
  cooldownMinutes: 10,
  soundEnabled: true,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  updatedAt: new Date().toISOString(),
};

const LOCAL_STORAGE_KEY = 'byeongdol_user_notification_settings';

class UserNotificationSettingsService {
  /**
   * Load user settings from Firestore with localStorage fallback
   */
  async getSettings(uid?: string): Promise<UserNotificationSettings> {
    const targetUid = uid || auth.currentUser?.uid;

    // 1. If user is signed in, load from Firestore
    if (targetUid) {
      try {
        const ref = doc(db, 'userNotificationSettings', targetUid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as UserNotificationSettings;
          // Cache locally
          this.saveToLocal(data);
          return {
            ...DEFAULT_NOTIFICATION_SETTINGS,
            ...data,
            uid: targetUid,
          };
        }
      } catch (err) {
        console.warn('[UserNotificationSettingsService] Firestore load error, using local fallback:', err);
      }
    }

    // 2. LocalStorage fallback
    const local = this.loadFromLocal();
    if (local) {
      return {
        ...DEFAULT_NOTIFICATION_SETTINGS,
        ...local,
        uid: targetUid || 'guest',
      };
    }

    return {
      ...DEFAULT_NOTIFICATION_SETTINGS,
      uid: targetUid || 'guest',
    };
  }

  /**
   * Save user settings to Firestore and localStorage
   */
  async saveSettings(settings: Partial<UserNotificationSettings>, uid?: string): Promise<UserNotificationSettings> {
    const targetUid = uid || auth.currentUser?.uid || settings.uid || 'guest';
    const now = new Date().toISOString();

    const current = await this.getSettings(targetUid);
    const updated: UserNotificationSettings = {
      ...current,
      ...settings,
      uid: targetUid,
      updatedAt: now,
    };

    // 1. Save to localStorage immediately
    this.saveToLocal(updated);

    // 2. Save to Firestore if authenticated
    if (targetUid && targetUid !== 'guest' && auth.currentUser) {
      try {
        const ref = doc(db, 'userNotificationSettings', targetUid);
        await setDoc(ref, updated, { merge: true });
        console.log('[UserNotificationSettingsService] Settings saved to Firestore for UID:', targetUid);
      } catch (err) {
        console.error('[UserNotificationSettingsService] Failed to save settings to Firestore:', err);
        throw err;
      }
    }

    return updated;
  }

  private saveToLocal(settings: UserNotificationSettings): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }

  private loadFromLocal(): UserNotificationSettings | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  }
}

export const userNotificationSettingsService = new UserNotificationSettingsService();
