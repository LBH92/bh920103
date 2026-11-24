import { n as WebPlugin } from "./dist-DItgYJMn.js";
import { t as AdmobConsentStatus } from "./adMobService-B3mU9wZJ.js";
//#region node_modules/@capacitor-community/admob/dist/esm/consent/privacy-options-requirement-status.enum.js
/**
*  For more information:
*  https://developers.google.com/admob/unity/reference/namespace/google-mobile-ads/ump/api#privacyoptionsrequirementstatus
*
* */
var PrivacyOptionsRequirementStatus;
(function(PrivacyOptionsRequirementStatus) {
	/**
	* Privacy options entry point is not required.
	*/
	PrivacyOptionsRequirementStatus["NOT_REQUIRED"] = "NOT_REQUIRED";
	/**
	* Privacy options entry point is required.
	*/
	PrivacyOptionsRequirementStatus["REQUIRED"] = "REQUIRED";
	/**
	* Privacy options requirement status is unknown.
	*/
	PrivacyOptionsRequirementStatus["UNKNOWN"] = "UNKNOWN";
})(PrivacyOptionsRequirementStatus || (PrivacyOptionsRequirementStatus = {}));
//#endregion
//#region node_modules/@capacitor-community/admob/dist/esm/web.js
var AdMobWeb = class extends WebPlugin {
	async initialize() {
		console.log("initialize");
	}
	async requestTrackingAuthorization() {
		console.log("requestTrackingAuthorization");
	}
	async trackingAuthorizationStatus() {
		return { status: "authorized" };
	}
	async requestConsentInfo(options) {
		console.log("requestConsentInfo", options);
		return {
			status: AdmobConsentStatus.REQUIRED,
			isConsentFormAvailable: true,
			canRequestAds: true,
			privacyOptionsRequirementStatus: PrivacyOptionsRequirementStatus.REQUIRED
		};
	}
	async showPrivacyOptionsForm() {
		console.log("showPrivacyOptionsForm");
	}
	async showConsentForm() {
		console.log("showConsentForm");
		return {
			status: AdmobConsentStatus.REQUIRED,
			canRequestAds: true,
			privacyOptionsRequirementStatus: PrivacyOptionsRequirementStatus.REQUIRED
		};
	}
	async resetConsentInfo() {
		console.log("resetConsentInfo");
	}
	async setApplicationMuted(options) {
		console.log("setApplicationMuted", options);
	}
	async setApplicationVolume(options) {
		console.log("setApplicationVolume", options);
	}
	async getAdaptiveBannerSize() {
		throw this.unavailable("Adaptive banner sizes are only available on iOS and Android");
	}
	async getBannerSize() {
		return {
			width: 0,
			height: 0
		};
	}
	async prepareBanner(options) {
		console.log("prepareBanner", options);
	}
	async showBanner(options) {
		console.log("showBanner", options);
	}
	async hideBanner() {
		console.log("hideBanner");
	}
	async resumeBanner() {
		console.log("resumeBanner");
	}
	async removeBanner() {
		console.log("removeBanner");
	}
	async startNativeAdFeed() {
		throw new Error("Native ads are only available on iOS and Android");
	}
	async destroyNativeAdFeed(options) {
		console.log("destroyNativeAdFeed", options);
	}
	async loadNativeAd() {
		throw new Error("Native ads are only available on iOS and Android");
	}
	async updateNativeAdPlacements(options) {
		console.log("updateNativeAdPlacements", options);
	}
	async removeNativeAd(options) {
		console.log("removeNativeAd", options);
	}
	async prepareInterstitial(options) {
		console.log("prepareInterstitial", options);
		return { adUnitId: options.adId };
	}
	async showInterstitial(options) {
		console.log("showInterstitial", options);
	}
	async prepareRewardVideoAd(options) {
		console.log("prepareRewardVideoAd", options);
		return { adUnitId: options.adId };
	}
	async showRewardVideoAd(options) {
		console.log("showRewardVideoAd", options);
		return {
			type: "",
			amount: 0
		};
	}
	async prepareRewardInterstitialAd(options) {
		console.log("prepareRewardInterstitialAd", options);
		return { adUnitId: options.adId };
	}
	async showRewardInterstitialAd(options) {
		console.log("showRewardInterstitialAd", options);
		return {
			type: "",
			amount: 0
		};
	}
	async loadAppOpen(options) {
		console.log("loadAppOpen", options);
		return { adUnitId: options.adId };
	}
	async showAppOpen(options) {
		console.log("showAppOpen", options);
	}
	async isAppOpenLoaded() {
		return { value: false };
	}
	addListener(eventName, listenerFunc) {
		console.log("addListener", eventName);
		return Promise.resolve({ remove: () => Promise.resolve() });
	}
};
//#endregion
export { AdMobWeb };
