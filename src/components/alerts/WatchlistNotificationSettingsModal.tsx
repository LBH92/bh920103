import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  Send, 
  Volume2, 
  VolumeX, 
  Clock, 
  Moon, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ShieldCheck, 
  Radio, 
  Smartphone,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserNotificationSettings } from '../../types';
import { userNotificationSettingsService, DEFAULT_NOTIFICATION_SETTINGS } from '../../services/userNotificationSettingsService';
import { browserPushNotificationService } from '../../services/browserPushNotificationService';

interface WatchlistNotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved?: (settings: UserNotificationSettings) => void;
}

export const WatchlistNotificationSettingsModal: React.FC<WatchlistNotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  onSettingsSaved,
}) => {
  const { user, showToast } = useApp();

  const [settings, setSettings] = useState<UserNotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  // Load initial settings and check permission
  useEffect(() => {
    if (!isOpen) return;

    if (browserPushNotificationService.isSupported()) {
      setPermission(browserPushNotificationService.getPermission());
    }

    setIsLoading(true);
    userNotificationSettingsService.getSettings(user?.id)
      .then(data => {
        setSettings(data);
      })
      .catch(err => {
        console.warn('Failed to load notification settings:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isOpen, user?.id]);

  if (!isOpen) return null;

  // Request browser permission
  const handleRequestPermission = async () => {
    const perm = await browserPushNotificationService.requestPermission();
    setPermission(perm);
    if (perm === 'granted') {
      showToast('브라우저 알림 권한이 허용되었습니다.', 'success');
      setSettings(prev => ({ ...prev, browserPushEnabled: true }));
    } else if (perm === 'denied') {
      showToast('알림 권한이 차단되었습니다. 브라우저 설정에서 허용해주세요.', 'error');
    }
  };

  // Test push notification
  const handleTestNotification = async () => {
    setIsTesting(true);
    try {
      const result = await browserPushNotificationService.sendTestAlert(settings);
      if (result.success) {
        showToast(result.message, 'success');
        setPermission('granted');
      } else {
        showToast(result.message, 'error');
      }
    } finally {
      setIsTesting(false);
    }
  };

  // Save settings to Firestore
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const saved = await userNotificationSettingsService.saveSettings(settings, user?.id);
      showToast('알림 설정이 Firestore에 저장되었습니다.', 'success');
      if (onSettingsSaved) onSettingsSaved(saved);
      onClose();
    } catch (err) {
      showToast('설정 저장 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const gainThresholdOptions = [2.0, 3.0, 5.0, 7.0, 10.0];
  const lossThresholdOptions = [-2.0, -3.0, -5.0, -7.0, -10.0];
  const cooldownOptions = [5, 10, 15, 30, 60];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-finance-card border border-finance-border rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-finance-text animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-finance-border flex items-center justify-between shrink-0 bg-finance-sub-bg/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-finance-accent/15 text-finance-accent border border-finance-accent/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-finance-text">
                  관심종목 급변 브라우저 알림 설정
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-finance-accent/15 text-finance-accent border border-finance-accent/30 font-mono">
                  PUSH
                </span>
              </div>
              <p className="text-xs text-finance-sub-text mt-0.5">
                등록된 관심종목의 등락률이 급변할 때 브라우저 팝업 알림을 즉시 수신합니다.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-finance-sub-text hover:text-finance-text hover:bg-finance-sub-bg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-finance-sub-text">
              알림 설정을 불러오는 중입니다...
            </div>
          ) : (
            <>
              {/* 1. Browser Permission & Master Toggle Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-finance-sub-bg/50 border border-finance-border space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-finance-card border border-finance-border text-finance-accent">
                      <Radio className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-finance-text">
                          브라우저 푸시 알림 (Notification API)
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          permission === 'granted'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : permission === 'denied'
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        }`}>
                          {permission === 'granted' ? '✓ 허용됨' : permission === 'denied' ? '✕ 차단됨' : '! 권한 대기'}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-finance-sub-text mt-0.5">
                        시세가 급등·급락할 때 PC 데스크톱 및 스마트폰 화면에 실시간 알림 팝업을 표시합니다.
                      </p>
                    </div>
                  </div>

                  {/* Master Toggle */}
                  <button
                    type="button"
                    onClick={() => setSettings(prev => ({ ...prev, browserPushEnabled: !prev.browserPushEnabled }))}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.browserPushEnabled ? 'bg-finance-accent' : 'bg-finance-border'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        settings.browserPushEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Permission Request & Test Push Buttons */}
                <div className="pt-3 border-t border-finance-border flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    {permission !== 'granted' ? (
                      <button
                        type="button"
                        onClick={handleRequestPermission}
                        className="px-3 py-1.5 rounded-xl bg-finance-accent text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-xs"
                      >
                        브라우저 알림 권한 허용하기
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>브라우저 알림이 정상 활성화되어 있습니다.</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleTestNotification}
                    disabled={isTesting}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-finance-card border border-finance-border text-finance-text hover:bg-finance-sub-bg text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 text-finance-accent" />
                    <span>{isTesting ? '발송 중...' : '테스트 알림 발송'}</span>
                  </button>
                </div>
              </div>

              {/* 2. 관심종목 급등 알림 (Surge Gain Threshold) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-finance-card border border-finance-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-finance-up" />
                    <span className="font-bold text-sm text-finance-text">
                      관심종목 급등 감지 알림
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.surgeGainEnabled}
                      onChange={e => setSettings(prev => ({ ...prev, surgeGainEnabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-finance-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-finance-up" />
                  </label>
                </div>

                <p className="text-xs text-finance-sub-text">
                  보유 및 관심 종목의 당일 등락률이 기준치 이상 상승할 때 알립니다.
                </p>

                {settings.surgeGainEnabled && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] text-finance-sub-text font-semibold block">
                      급등 기준 등락률 선택
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {gainThresholdOptions.map(val => (
                        <button
                          key={`gain-${val}`}
                          type="button"
                          onClick={() => setSettings(prev => ({ ...prev, surgeGainThreshold: val }))}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer tabular-nums ${
                            settings.surgeGainThreshold === val
                              ? 'bg-finance-up text-white shadow-xs'
                              : 'bg-finance-sub-bg text-finance-sub-text hover:text-finance-text hover:bg-finance-border'
                          }`}
                        >
                          +{val}%
                        </button>
                      ))}

                      <div className="flex items-center gap-1 ml-auto">
                        <span className="text-xs text-finance-sub-text">직접 입력:</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          max="30"
                          value={settings.surgeGainThreshold}
                          onChange={e => setSettings(prev => ({ ...prev, surgeGainThreshold: Math.max(0.1, Number(e.target.value)) }))}
                          className="w-16 px-2 py-1 rounded-lg bg-finance-sub-bg border border-finance-border text-xs text-right font-mono font-bold text-finance-up focus:outline-none focus:ring-1 focus:ring-finance-accent"
                        />
                        <span className="text-xs text-finance-sub-text">%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. 관심종목 급락 알림 (Surge Plunge Threshold) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-finance-card border border-finance-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-finance-down" />
                    <span className="font-bold text-sm text-finance-text">
                      관심종목 급락 위험 알림
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.surgeLossEnabled}
                      onChange={e => setSettings(prev => ({ ...prev, surgeLossEnabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-finance-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-finance-down" />
                  </label>
                </div>

                <p className="text-xs text-finance-sub-text">
                  보유 및 관심 종목의 당일 등락률이 기준치 이하로 급락할 때 손절 및 리스크 관리를 위해 알립니다.
                </p>

                {settings.surgeLossEnabled && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] text-finance-sub-text font-semibold block">
                      급락 기준 등락률 선택
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {lossThresholdOptions.map(val => (
                        <button
                          key={`loss-${val}`}
                          type="button"
                          onClick={() => setSettings(prev => ({ ...prev, surgeLossThreshold: val }))}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer tabular-nums ${
                            settings.surgeLossThreshold === val
                              ? 'bg-finance-down text-white shadow-xs'
                              : 'bg-finance-sub-bg text-finance-sub-text hover:text-finance-text hover:bg-finance-border'
                          }`}
                        >
                          {val}%
                        </button>
                      ))}

                      <div className="flex items-center gap-1 ml-auto">
                        <span className="text-xs text-finance-sub-text">직접 입력:</span>
                        <input
                          type="number"
                          step="0.5"
                          max="-0.5"
                          min="-30"
                          value={settings.surgeLossThreshold}
                          onChange={e => {
                            const val = Number(e.target.value);
                            setSettings(prev => ({ ...prev, surgeLossThreshold: val > 0 ? -val : val }));
                          }}
                          className="w-16 px-2 py-1 rounded-lg bg-finance-sub-bg border border-finance-border text-xs text-right font-mono font-bold text-finance-down focus:outline-none focus:ring-1 focus:ring-finance-accent"
                        />
                        <span className="text-xs text-finance-sub-text">%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. 거래량 급증 알림 (Volume Spike) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-finance-card border border-finance-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-sm text-finance-text">
                      대량 수급 유입 (거래량 급증)
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.volumeSurgeEnabled}
                      onChange={e => setSettings(prev => ({ ...prev, volumeSurgeEnabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-finance-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
                  </label>
                </div>

                <p className="text-xs text-finance-sub-text">
                  20일 평균 거래량 대비 폭발적인 거래량이 터질 때 포착하여 알립니다.
                </p>

                {settings.volumeSurgeEnabled && (
                  <div className="flex items-center gap-2 pt-2">
                    {[150, 200, 300, 500].map(val => (
                      <button
                        key={`vol-${val}`}
                        type="button"
                        onClick={() => setSettings(prev => ({ ...prev, volumeSurgeThreshold: val }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer tabular-nums ${
                          settings.volumeSurgeThreshold === val
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-finance-sub-bg text-finance-sub-text hover:text-finance-text hover:bg-finance-border'
                        }`}
                      >
                        {val}% 이상
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. 쿨다운 & 사운드 & 방해금지 시간대 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-finance-card border border-finance-border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-finance-accent" />
                    <span className="font-bold text-sm text-finance-text">
                      동일 종목 재알림 방지 (쿨다운)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {cooldownOptions.map(m => (
                      <button
                        key={`cool-${m}`}
                        type="button"
                        onClick={() => setSettings(prev => ({ ...prev, cooldownMinutes: m }))}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          settings.cooldownMinutes === m
                            ? 'bg-finance-accent text-white shadow-xs'
                            : 'bg-finance-sub-bg text-finance-sub-text hover:text-finance-text hover:bg-finance-border'
                        }`}
                      >
                        {m}분
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sound & Quiet Hours Toggles */}
                <div className="pt-3 border-t border-finance-border grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Sound Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-finance-sub-bg/50 border border-finance-border">
                    <div className="flex items-center gap-2">
                      {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-finance-accent" /> : <VolumeX className="w-4 h-4 text-finance-sub-text" />}
                      <span className="text-xs font-bold text-finance-text">알림 효과음</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.soundEnabled}
                        onChange={e => setSettings(prev => ({ ...prev, soundEnabled: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-finance-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-finance-accent" />
                    </label>
                  </div>

                  {/* Quiet Hours */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-finance-sub-bg/50 border border-finance-border">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-bold text-finance-text">야간 방해금지</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.quietHoursEnabled}
                        onChange={e => setSettings(prev => ({ ...prev, quietHoursEnabled: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-finance-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-500" />
                    </label>
                  </div>
                </div>

                {settings.quietHoursEnabled && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-finance-sub-bg text-xs">
                    <span className="text-finance-sub-text">방해금지 시간대:</span>
                    <div className="flex items-center gap-2 font-mono">
                      <input
                        type="time"
                        value={settings.quietHoursStart}
                        onChange={e => setSettings(prev => ({ ...prev, quietHoursStart: e.target.value }))}
                        className="px-2 py-1 rounded bg-finance-card border border-finance-border text-xs text-finance-text"
                      />
                      <span>~</span>
                      <input
                        type="time"
                        value={settings.quietHoursEnd}
                        onChange={e => setSettings(prev => ({ ...prev, quietHoursEnd: e.target.value }))}
                        className="px-2 py-1 rounded bg-finance-card border border-finance-border text-xs text-finance-text"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Firestore Persistence Notice */}
              <div className="p-3.5 rounded-2xl bg-finance-accent/5 border border-finance-accent/20 flex items-center justify-between text-xs text-finance-sub-text">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-finance-accent shrink-0" />
                  <span>설정값은 Firestore 클라우드 데이터베이스에 실시간 영구 보관됩니다.</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-finance-accent">
                  {user ? 'Firestore 계정 연동됨' : '로컬 캐시 보관 (로그인 권장)'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-finance-border flex items-center justify-end gap-3 shrink-0 bg-finance-sub-bg/30">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-finance-border hover:bg-finance-sub-bg text-xs font-bold text-finance-sub-text transition-colors cursor-pointer"
          >
            닫기
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-finance-accent hover:opacity-90 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isSaving ? 'Firestore 저장 중...' : '설정 저장하기'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
