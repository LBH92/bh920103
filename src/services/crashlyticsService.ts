import { Capacitor } from '@capacitor/core';
import { FirebaseCrashlytics } from '@capacitor-firebase/crashlytics';

/**
 * Global Error Reporting Service using Firebase Crashlytics
 * Monitors and logs runtime exceptions, Promise rejections, and React component crashes
 * across production Android and iOS native environments.
 */
class CrashlyticsService {
  private isInitialized = false;
  private isNative = false;

  constructor() {
    this.isNative = typeof window !== 'undefined' && Boolean(Capacitor?.isNativePlatform?.());
  }

  /**
   * Initializes Firebase Crashlytics, enables automatic crash collection on native platforms,
   * sends pending reports, and attaches global unhandled exception listeners.
   */
  public async init(): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;

    try {
      if (this.isNative) {
        // Enable automatic data collection
        await FirebaseCrashlytics.setEnabled({ enabled: true });

        // Check if app crashed previously and upload unsent crash reports
        const prevCrash = await FirebaseCrashlytics.didCrashOnPreviousExecution();
        if (prevCrash.crashed) {
          console.warn('[Crashlytics] Detected crash on previous execution, uploading unsent reports...');
          await FirebaseCrashlytics.sendUnsentReports();
        }

        // Set global baseline context keys
        await this.setCustomKey('app_name', 'byeongdol-investment');
        await this.setCustomKey('app_version', '1.0.0');
        await this.setCustomKey('platform', Capacitor.getPlatform());
        await this.setCustomKey('environment', 'production');

        await FirebaseCrashlytics.log({ message: 'Firebase Crashlytics initialized successfully' });
      }
    } catch (err) {
      console.warn('[Crashlytics] Native initialization notice:', err);
    }

    // Attach global window error & unhandled promise rejection listeners
    this.attachGlobalListeners();
  }

  /**
   * Records a non-fatal exception to Firebase Crashlytics with optional context.
   */
  public async recordException(
    error: Error | string | unknown,
    context?: Record<string, string | number | boolean>
  ): Promise<void> {
    const errorMessage = error instanceof Error 
      ? `${error.name}: ${error.message}\n${error.stack || ''}`
      : typeof error === 'string'
        ? error
        : JSON.stringify(error);

    // Suppress known development/iframe HMR noise
    if (
      errorMessage.includes('WebSocket') || 
      errorMessage.includes('24678') || 
      errorMessage.includes('@vite/client') ||
      errorMessage.includes('closed without opened') ||
      errorMessage.includes('ResizeObserver')
    ) {
      return;
    }

    // Log to console for development visibility
    console.error('[GlobalErrorReporter]', errorMessage, context || '');

    if (!this.isNative) return;

    try {
      // Set contextual custom keys if provided
      if (context) {
        for (const [key, val] of Object.entries(context)) {
          await this.setCustomKey(key, val);
        }
      }

      await FirebaseCrashlytics.recordException({
        message: errorMessage,
      });
    } catch (err) {
      console.warn('[Crashlytics] Failed to record exception:', err);
    }
  }

  /**
   * Identifies the current logged-in user in Crashlytics reports.
   */
  public async setUserId(userId: string | null): Promise<void> {
    if (!this.isNative) return;
    try {
      await FirebaseCrashlytics.setUserId({
        userId: userId || 'anonymous',
      });
    } catch (err) {
      console.warn('[Crashlytics] Failed to set user ID:', err);
    }
  }

  /**
   * Sets a diagnostic key-value pair in Crashlytics.
   */
  public async setCustomKey(key: string, value: string | number | boolean): Promise<void> {
    if (!this.isNative) return;
    try {
      let type: 'string' | 'int' | 'double' | 'boolean' = 'string';
      if (typeof value === 'boolean') {
        type = 'boolean';
      } else if (typeof value === 'number') {
        type = Number.isInteger(value) ? 'int' : 'double';
      }

      await FirebaseCrashlytics.setCustomKey({
        key,
        value,
        type,
      });
    } catch (err) {
      console.warn(`[Crashlytics] Failed to set custom key "${key}":`, err);
    }
  }

  /**
   * Logs a contextual breadcrumb event leading up to a potential error.
   */
  public async logBreadcrumb(message: string): Promise<void> {
    if (!this.isNative) return;
    try {
      await FirebaseCrashlytics.log({ message });
    } catch (err) {
      console.warn('[Crashlytics] Failed to log breadcrumb:', err);
    }
  }

  /**
   * Attaches unhandled window and promise error listeners.
   */
  private attachGlobalListeners(): void {
    if (typeof window === 'undefined') return;

    // 1. Uncaught global runtime exceptions
    window.addEventListener('error', (event: ErrorEvent) => {
      const err = event.error || event.message;
      this.recordException(err, {
        filename: event.filename || 'unknown',
        lineno: event.lineno || 0,
        colno: event.colno || 0,
        type: 'uncaught_window_error',
      });
    });

    // 2. Unhandled Promise rejections
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      this.recordException(reason || 'Unhandled Promise Rejection', {
        type: 'unhandled_promise_rejection',
      });
    });
  }
}

export const crashlyticsService = new CrashlyticsService();
