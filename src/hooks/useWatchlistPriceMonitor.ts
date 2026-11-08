/**
 * Hook for Active Watchlist Price Fluctuation Monitoring & Browser Push Trigger
 * 
 * Actively monitors the user's registered watchlist stocks against:
 * 1. Sudden Price Surges (+% threshold)
 * 2. Sudden Price Plunges (-% threshold)
 * 3. Volume Spikes
 * 
 * Automatically reads user settings from Firestore and fires native browser Notification API.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Stock, UserNotificationSettings } from '../types';
import { userNotificationSettingsService, DEFAULT_NOTIFICATION_SETTINGS } from '../services/userNotificationSettingsService';
import { browserPushNotificationService } from '../services/browserPushNotificationService';

interface UseWatchlistPriceMonitorProps {
  watchlist: string[];
  stocks: Stock[];
  userId?: string;
  onNavigateStock?: (symbol: string) => void;
}

export function useWatchlistPriceMonitor({
  watchlist,
  stocks,
  userId,
  onNavigateStock,
}: UseWatchlistPriceMonitorProps) {
  const [settings, setSettings] = useState<UserNotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [isLoadingSettings, setIsLoadingSettings] = useState<boolean>(true);

  // Keep a reference to previous changePercents to identify sudden jumps
  const prevChangeMap = useRef<Map<string, number>>(new Map());

  // 1. Load user notification settings from Firestore
  const refreshSettings = useCallback(async () => {
    try {
      const data = await userNotificationSettingsService.getSettings(userId);
      setSettings(data);
    } catch (err) {
      console.warn('[useWatchlistPriceMonitor] Failed to load settings:', err);
    } finally {
      setIsLoadingSettings(false);
    }
  }, [userId]);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  // 2. Listen to custom event for clicking on notification to navigate to stock
  useEffect(() => {
    const handleCustomNavigate = (e: Event) => {
      const customEvent = e as CustomEvent<{ symbol: string }>;
      if (customEvent.detail?.symbol && onNavigateStock) {
        onNavigateStock(customEvent.detail.symbol);
      }
    };

    window.addEventListener('app:navigate-stock', handleCustomNavigate);
    return () => {
      window.removeEventListener('app:navigate-stock', handleCustomNavigate);
    };
  }, [onNavigateStock]);

  // 3. Monitor watchlist stocks for rapid fluctuations
  useEffect(() => {
    if (!settings.browserPushEnabled || watchlist.length === 0 || stocks.length === 0) {
      return;
    }

    const currentMap = prevChangeMap.current;

    for (const symbol of watchlist) {
      const stock = stocks.find(s => s.symbol === symbol);
      if (!stock || stock.price <= 0 || isNaN(stock.price)) continue;

      const currentChange = stock.changePercent;
      const prevChange = currentMap.get(symbol);

      // Store current
      currentMap.set(symbol, currentChange);

      // Check 1: Surge Gain (+% threshold)
      if (settings.surgeGainEnabled && currentChange >= settings.surgeGainThreshold) {
        // Only trigger if crossed or significantly fluctuated
        const isFreshAlert = prevChange === undefined || Math.abs(currentChange - prevChange) >= 0.5 || currentChange >= settings.surgeGainThreshold;
        if (isFreshAlert) {
          browserPushNotificationService.sendWatchlistAlert(
            {
              symbol: stock.symbol,
              stockName: stock.name,
              type: 'surge_gain',
              currentPrice: stock.price,
              changePercent: stock.changePercent,
              change: stock.change,
              volume: stock.volume,
              currency: stock.currency,
              reason: `전일 대비 +${stock.changePercent.toFixed(2)}% 급등 포착 (설정 기준: +${settings.surgeGainThreshold}%)`,
            },
            settings,
            userId
          );
        }
      }

      // Check 2: Surge Plunge (-% threshold)
      if (settings.surgeLossEnabled && currentChange <= settings.surgeLossThreshold) {
        const isFreshAlert = prevChange === undefined || Math.abs(currentChange - prevChange) >= 0.5 || currentChange <= settings.surgeLossThreshold;
        if (isFreshAlert) {
          browserPushNotificationService.sendWatchlistAlert(
            {
              symbol: stock.symbol,
              stockName: stock.name,
              type: 'surge_loss',
              currentPrice: stock.price,
              changePercent: stock.changePercent,
              change: stock.change,
              volume: stock.volume,
              currency: stock.currency,
              reason: `전일 대비 ${stock.changePercent.toFixed(2)}% 급락 포착 (설정 기준: ${settings.surgeLossThreshold}%)`,
            },
            settings,
            userId
          );
        }
      }

      // Check 3: Volume Surge
      if (settings.volumeSurgeEnabled && (stock.volumeRatio || 0) >= (settings.volumeSurgeThreshold || 200)) {
        browserPushNotificationService.sendWatchlistAlert(
          {
            symbol: stock.symbol,
            stockName: stock.name,
            type: 'volume_spike',
            currentPrice: stock.price,
            changePercent: stock.changePercent,
            change: stock.change,
            volume: stock.volume,
            currency: stock.currency,
            reason: `20일 평균 대비 거래량 ${stock.volumeRatio}% 폭증 포착`,
          },
          settings,
          userId
        );
      }
    }
  }, [watchlist, stocks, settings, userId]);

  return {
    settings,
    isLoadingSettings,
    refreshSettings,
    updateSettings: async (newSettings: Partial<UserNotificationSettings>) => {
      const updated = await userNotificationSettingsService.saveSettings(newSettings, userId);
      setSettings(updated);
      return updated;
    },
  };
}
