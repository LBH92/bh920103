import { Capacitor } from '@capacitor/core';
import { AdMob, BannerAdPosition, AdmobConsentStatus } from '@capacitor-community/admob';

const USE_PRODUCTION_ADS = false;
const PRODUCTION_ANDROID_APP_ID = 'ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy';
const PRODUCTION_ANDROID_BANNER_ID = 'ca-app-pub-xxxxxxxxxxxxxxxx/zzzzzzzzzz';
const TEST_ANDROID_BANNER_AD_ID = 'ca-app-pub-3940256099942544/6300978111';

const ACTIVE_BANNER_AD_ID = USE_PRODUCTION_ADS ? PRODUCTION_ANDROID_BANNER_ID : TEST_ANDROID_BANNER_AD_ID;

class AdMobService {
  private isInitialized = false;
  private isInitializing = false;
  private isBannerShown = false;
  private bannerLock = false;
  private canRequestAds = false;

  public async initialize(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      console.log('[AdMob] Not a native platform (Web browser). Skipping AdMob.');
      return;
    }

    if (this.isInitialized || this.isInitializing) return;
    this.isInitializing = true;

    try {
      // 1. Google UMP Consent & Privacy Info Update
      try {
        if (typeof AdMob.requestConsentInfo === 'function') {
          const consentInfo = await AdMob.requestConsentInfo();
          console.log('[AdMob] UMP Consent Info:', consentInfo);
          this.canRequestAds = Boolean(consentInfo?.canRequestAds);

          if (
            consentInfo?.status === AdmobConsentStatus.REQUIRED &&
            consentInfo?.isConsentFormAvailable
          ) {
            const consentResult = await AdMob.showConsentForm();
            console.log('[AdMob] UMP Consent Form Result:', consentResult);
            // Re-check consent info after showing form
            const postConsentInfo = await AdMob.requestConsentInfo();
            this.canRequestAds = Boolean(postConsentInfo?.canRequestAds);
          }
        } else {
          // Fallback if UMP method missing in plugin version
          this.canRequestAds = true;
        }
      } catch (umpErr) {
        console.warn('[AdMob] UMP consent check warning (defaulting canRequestAds to false for policy safety):', umpErr);
        this.canRequestAds = false;
      }

      // If consent strictly prohibits ad requests, abort initialization to prevent policy violations
      if (!this.canRequestAds && !USE_PRODUCTION_ADS) {
        // For testing purposes in debug, allow if testing
        this.canRequestAds = true;
      }

      if (!this.canRequestAds) {
        console.warn('[AdMob] Ad requests not permitted by user consent policy.');
        this.isInitializing = false;
        return;
      }

      // 2. Initialize AdMob SDK
      await AdMob.initialize({
        initializeForTesting: !USE_PRODUCTION_ADS,
      });

      this.isInitialized = true;
      console.log('[AdMob] Initialized successfully with strict UMP compliance.');
    } catch (err) {
      console.error('[AdMob] Initialization failed:', err);
      this.canRequestAds = false;
    } finally {
      this.isInitializing = false;
    }
  }

  public async showBanner(margin = 60): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    if (this.bannerLock) return;
    this.bannerLock = true;

    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (!this.canRequestAds) {
        console.warn('[AdMob] Cannot show banner: UMP consent not obtained or ad requests restricted.');
        this.bannerLock = false;
        return;
      }

      if (this.isBannerShown) {
        this.bannerLock = false;
        return;
      }

      await AdMob.showBanner({
        adId: ACTIVE_BANNER_AD_ID,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: margin,
        npa: !this.canRequestAds,
      });

      this.isBannerShown = true;
      console.log('[AdMob] Banner shown successfully.');
    } catch (err) {
      console.warn('[AdMob] Failed to show banner (graceful fallback):', err);
      this.isBannerShown = false;
    } finally {
      this.bannerLock = false;
    }
  }

  public async hideBanner(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    if (!this.isBannerShown) return;

    try {
      await AdMob.hideBanner();
      this.isBannerShown = false;
    } catch (err) {
      console.warn('[AdMob] Failed to hide banner:', err);
    }
  }

  public async removeBanner(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    if (!this.isBannerShown) return;

    try {
      await AdMob.removeBanner();
      this.isBannerShown = false;
    } catch (err) {
      console.warn('[AdMob] Failed to remove banner:', err);
    }
  }
}

export const adMobService = new AdMobService();
