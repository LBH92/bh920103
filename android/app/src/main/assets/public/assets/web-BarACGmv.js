import { n as WebPlugin } from "./dist-DItgYJMn.js";
//#region node_modules/@capacitor-firebase/crashlytics/dist/esm/web.js
var FirebaseCrashlyticsWeb = class extends WebPlugin {
	async crash() {
		throw this.unimplemented("Not implemented on web.");
	}
	async setCustomKey(_options) {
		throw this.unimplemented("Not implemented on web.");
	}
	async setUserId(_options) {
		throw this.unimplemented("Not implemented on web.");
	}
	async log(_options) {
		throw this.unimplemented("Not implemented on web.");
	}
	async setEnabled(_options) {
		throw this.unimplemented("Not implemented on web.");
	}
	async isEnabled() {
		throw this.unimplemented("Not implemented on web.");
	}
	async didCrashOnPreviousExecution() {
		throw this.unimplemented("Not implemented on web.");
	}
	async sendUnsentReports() {
		throw this.unimplemented("Not implemented on web.");
	}
	async deleteUnsentReports() {
		throw this.unimplemented("Not implemented on web.");
	}
	async recordException(_options) {
		throw this.unimplemented("Not implemented on web.");
	}
};
//#endregion
export { FirebaseCrashlyticsWeb };
