import { A as getAuth, C as getFirestore, D as setLogLevel, I as getApp, L as getApps, O as GoogleAuthProvider, R as initializeApp, S as doc, T as initializeFirestore, l as getDocFromServer } from "./vendor-firebase-Dm4AYEor.js";
var firebase_applet_config_default = {
	projectId: "calm-coder-vkx2q",
	appId: "1:291296239961:web:48f37f98420ba53a912c48",
	apiKey: "AIzaSyDgwYO4Rwh_grjUpFlLC5SD4t57MDXhJvg",
	authDomain: "calm-coder-vkx2q.firebaseapp.com",
	firestoreDatabaseId: "ai-studio-a4bb5224-8774-4d8f-9f3e-12e5750ad18a",
	storageBucket: "calm-coder-vkx2q.firebasestorage.app",
	messagingSenderId: "291296239961",
	measurementId: "",
	oAuthClientId: "291296239961-tg3n4hgth788nsccbmj5irckaibnveb7.apps.googleusercontent.com",
	recaptchaSiteKey: ""
};
//#endregion
//#region src/services/firebase.ts
setLogLevel("silent");
if (typeof console !== "undefined") {
	const originalError = console.error;
	console.error = (...args) => {
		const str = args.map((a) => typeof a === "string" ? a : a?.message || "").join(" ");
		if (str.includes("Disconnecting idle stream") || str.includes("Timed out waiting for new targets") || str.includes("@firebase/firestore") && str.includes("CANCELLED")) {
			console.debug("[Firebase] Idle stream disconnected:", ...args);
			return;
		}
		originalError.apply(console, args);
	};
}
var OperationType = /* @__PURE__ */ function(OperationType) {
	OperationType["CREATE"] = "create";
	OperationType["UPDATE"] = "update";
	OperationType["DELETE"] = "delete";
	OperationType["LIST"] = "list";
	OperationType["GET"] = "get";
	OperationType["WRITE"] = "write";
	return OperationType;
}({});
var app = !getApps().length ? initializeApp(firebase_applet_config_default) : getApp();
try {
	initializeFirestore(app, { experimentalForceLongPolling: true }, firebase_applet_config_default.firestoreDatabaseId);
} catch {}
var db = getFirestore(app, firebase_applet_config_default.firestoreDatabaseId);
var auth = getAuth(app);
var googleProvider = new GoogleAuthProvider();
function handleFirestoreError(error, operationType, path) {
	const errInfo = {
		error: error instanceof Error ? error.message : String(error),
		authInfo: {
			userId: auth.currentUser?.uid,
			email: auth.currentUser?.email,
			emailVerified: auth.currentUser?.emailVerified,
			isAnonymous: auth.currentUser?.isAnonymous,
			tenantId: auth.currentUser?.tenantId,
			providerInfo: auth.currentUser?.providerData?.map((provider) => ({
				providerId: provider.providerId,
				email: provider.email
			})) || []
		},
		operationType,
		path
	};
	console.error("Firestore Error: ", JSON.stringify(errInfo));
	throw new Error(JSON.stringify(errInfo));
}
async function testConnection() {
	try {
		await getDocFromServer(doc(db, "test", "connection"));
	} catch (error) {
		if (error instanceof Error && error.message.includes("the client is offline")) console.warn("Please check your Firebase configuration or network status.");
	}
}
testConnection();
//#endregion
export { googleProvider as a, db as i, app as n, handleFirestoreError as o, auth as r, OperationType as t };
