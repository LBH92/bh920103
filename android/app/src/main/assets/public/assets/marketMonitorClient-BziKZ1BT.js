//#region src/services/marketMonitorClient.ts
var MarketMonitorClient = class {
	async getConfig() {
		try {
			const res = await fetch("/api/market/monitoring/config");
			if (res.ok) return await res.json();
		} catch (err) {
			console.warn("[MarketMonitorClient] getConfig failed:", err);
		}
		return {
			PRICE_RISE_ALERT_PERCENT: 5,
			PRICE_FALL_ALERT_PERCENT: -5,
			VOLUME_SPIKE_MULTIPLIER: 2,
			TRADING_VALUE_ALERT_THRESHOLD: 3e3,
			MARKET_INDEX_ALERT_PERCENT: 2,
			SIDECAR_THRESHOLD_PERCENT: 5,
			CIRCUIT_BREAKER_LV1_PERCENT: -8,
			ALERT_COOLDOWN_MS: 18e4,
			MONITORING_INTERVAL_MS: 4e3,
			ENABLED: true
		};
	}
	async updateConfig(newConfig) {
		const res = await fetch("/api/market/monitoring/config", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newConfig)
		});
		if (!res.ok) throw new Error("설정 저장에 실패했습니다.");
		return await res.json();
	}
	async getEvents(scope) {
		try {
			const url = scope ? `/api/market/monitoring/events?scope=${scope}` : "/api/market/monitoring/events";
			const res = await fetch(url);
			if (res.ok) return await res.json();
		} catch (err) {
			console.warn("[MarketMonitorClient] getEvents failed:", err);
		}
		return [];
	}
	async explainEvent(eventId, uid, userRole) {
		const headers = {};
		if (uid) headers["x-user-uid"] = uid;
		if (userRole) headers["x-admin-role"] = userRole;
		const res = await fetch(`/api/market/monitoring/explain/${eventId}`, {
			method: "POST",
			headers
		});
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			if (err.error === "AI_NOT_CONNECTED") throw new Error(err.message || "시장 이벤트 AI 해설은 개인 Gemini AI 계정 연결 후 이용할 수 있습니다.");
			throw new Error(err.error || "AI 해설 생성에 실패했습니다.");
		}
		return (await res.json()).explanation;
	}
	async triggerTestEvent(eventData) {
		return await (await fetch("/api/market/monitoring/trigger-test", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(eventData || {})
		})).json();
	}
};
var marketMonitorClient = new MarketMonitorClient();
//#endregion
export { marketMonitorClient as t };
