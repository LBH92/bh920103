const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/web-BarACGmv.js","assets/dist-DItgYJMn.js"])))=>i.map(i=>d[i]);
import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { bn as require_react } from "./vendor-lucide-Dji_Ij8j.js";
import { E as serverTimestamp, P as signOut, S as doc, _ as startAfter, a as onMessage, b as writeBatch, c as getDoc, d as limit, f as onSnapshot, g as setDoc, i as isWindowSupported, j as onAuthStateChanged, m as query, n as getMessagingInWindow, p as orderBy, r as getToken, s as deleteDoc, t as deleteToken, u as getDocs, v as updateDoc, w as increment, x as collection, y as where } from "./vendor-firebase-Dm4AYEor.js";
import { i as db, n as app, o as handleFirestoreError, r as auth, t as OperationType } from "./firebase-fxPuKVc_.js";
import { r as registerPlugin, t as Capacitor } from "./dist-DItgYJMn.js";
import { t as __vitePreload } from "./preload-helper-CWTytNQo.js";
//#region src/utils/dateUtils.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* Date & Time Utility for Asia/Seoul (KST, UTC+9)
* Canonical format: YYYY년 MM월 DD일 (요일) HH:mm:ss
*/
var kstPartsFormatter = new Intl.DateTimeFormat("ko-KR", {
	timeZone: "Asia/Seoul",
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	weekday: "short",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
	hour12: false
});
function getKstParts(date) {
	const parts = kstPartsFormatter.formatToParts(date);
	const map = {};
	for (const p of parts) map[p.type] = p.value;
	return {
		year: map.year || "",
		month: map.month || "",
		day: map.day || "",
		weekday: map.weekday || "",
		hour: map.hour || "",
		minute: map.minute || "",
		second: map.second || ""
	};
}
/**
* Safely parse any timestamp type (Date, ISO string, epoch ms/seconds, Firestore Timestamp, Korean relative string)
*/
function parseToDate(val) {
	if (val === null || val === void 0) return null;
	if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
	if (typeof val === "number") {
		const ms = val < 1e10 ? val * 1e3 : val;
		const d = new Date(ms);
		return isNaN(d.getTime()) ? null : d;
	}
	if (typeof val === "object") {
		if (typeof val.toDate === "function") try {
			const d = val.toDate();
			return isNaN(d.getTime()) ? null : d;
		} catch {
			return null;
		}
		if (typeof val.seconds === "number") {
			const d = new Date(val.seconds * 1e3 + (val.nanoseconds ? Math.floor(val.nanoseconds / 1e6) : 0));
			return isNaN(d.getTime()) ? null : d;
		}
	}
	if (typeof val === "string") {
		const trimmed = val.trim();
		if (!trimmed) return null;
		const minMatch = trimmed.match(/^(\d+)\s*분\s*전$/);
		if (minMatch) return /* @__PURE__ */ new Date(Date.now() - parseInt(minMatch[1], 10) * 60 * 1e3);
		const hrMatch = trimmed.match(/^(\d+)\s*시간\s*전$/);
		if (hrMatch) return /* @__PURE__ */ new Date(Date.now() - parseInt(hrMatch[1], 10) * 3600 * 1e3);
		const dayMatch = trimmed.match(/^(\d+)\s*일\s*전$/);
		if (dayMatch) return /* @__PURE__ */ new Date(Date.now() - parseInt(dayMatch[1], 10) * 86400 * 1e3);
		if (trimmed === "어제") return /* @__PURE__ */ new Date(Date.now() - 864e5);
		if (trimmed === "방금 전" || trimmed === "방금" || trimmed === "시간 정보 없음" || trimmed === "작성 시간 확인 불가" || trimmed === "날짜 정보 없음" || trimmed === "-") return null;
		const exactMatch = trimmed.match(/(?:작성:\s*)?(\d{4})[./-](\d{1,2})[./-](\d{1,2})(?:\s*\([^)]*\))?\s*(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/);
		if (exactMatch) {
			const [, y, mo, d, h, mi, s = "00"] = exactMatch;
			const iso = `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}T${h.padStart(2, "0")}:${mi.padStart(2, "0")}:${s.padStart(2, "0")}+09:00`;
			const parsed = new Date(iso);
			if (!isNaN(parsed.getTime())) return parsed;
		}
		const p1 = new Date(trimmed);
		if (!isNaN(p1.getTime())) return p1;
		const m = trimmed.match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
		if (m) {
			const [, y, mo, d, h = "00", mi = "00", s = "00"] = m;
			const iso = `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}T${h.padStart(2, "0")}:${mi.padStart(2, "0")}:${s.padStart(2, "0")}+09:00`;
			const p2 = new Date(iso);
			if (!isNaN(p2.getTime())) return p2;
		}
	}
	return null;
}
/**
* Standard Home Screen Format: `YYYY년 MM월 DD일 (요일) HH:mm:ss`
*/
var formatKST = (val, fallback = "-") => {
	const d = parseToDate(val ?? /* @__PURE__ */ new Date());
	if (!d) return fallback;
	const m = getKstParts(d);
	return `${m.year}년 ${m.month}월 ${m.day}일 (${m.weekday}) ${m.hour}:${m.minute}:${m.second}`;
};
/**
* Compact Date: `YYYY.MM.DD`
*/
var formatKSTDate = (val, fallback = "-") => {
	const d = parseToDate(val);
	if (!d) return typeof val === "string" && val.length > 0 ? val : fallback;
	const m = getKstParts(d);
	return `${m.year}.${m.month}.${m.day}`;
};
/**
* Compact Date & Time: `YYYY.MM.DD HH:mm:ss`
*/
var formatKSTDateTime = (val, fallback = "-") => {
	const d = parseToDate(val);
	if (!d) return typeof val === "string" && val.length > 0 ? val : fallback;
	const m = getKstParts(d);
	return `${m.year}.${m.month}.${m.day} (${m.weekday}) ${m.hour}:${m.minute}`;
};
/**
* Get KST calendar day key: `YYYY-MM-DD`
*/
function getKstDateKey(val) {
	const d = parseToDate(val);
	if (!d) return "unknown";
	const p = getKstParts(d);
	return `${p.year}-${p.month}-${p.day}`;
}
/**
* Calculate difference in calendar days in KST
*/
function getKstCalendarDaysDiff(target, now) {
	const targetParts = getKstParts(target);
	const nowParts = getKstParts(now);
	const targetMidnight = (/* @__PURE__ */ new Date(`${targetParts.year}-${targetParts.month}-${targetParts.day}T00:00:00+09:00`)).getTime();
	const nowMidnight = (/* @__PURE__ */ new Date(`${nowParts.year}-${nowParts.month}-${nowParts.day}T00:00:00+09:00`)).getTime();
	return Math.round((nowMidnight - targetMidnight) / 864e5);
}
/**
* Check if targetDate is yesterday relative to now in KST
*/
function isYesterdayKST(target, now) {
	return getKstCalendarDaysDiff(target, now) === 1;
}
/**
* Check if targetDate is today relative to now in KST
*/
function isTodayKST(target, now) {
	return getKstCalendarDaysDiff(target, now) === 0;
}
/**
* Canonical Community Time Formatter:
* - Requirements:
*   - 상대 시간과 실제 작성 시각을 함께 제공 (예: `3일 전 · 작성: 2026.11.05 (목) 15:55`)
*   - 작성 시간이 없는 레거시 데이터는 현재 시간으로 대체하지 않고 '작성 시간 확인 불가' 표시
*   - 방금 전 / 5분 전 / 1시간 전 / 어제 / N일 전 등 상대 시간 적용
*   - 한국 시간(KST) 기준 날짜와 요일 표시: YYYY.MM.DD (요일) HH:mm
*/
function formatCommunityTime(val) {
	const d = parseToDate(val);
	if (!d) return typeof val === "string" && val.length > 0 ? val : "작성 시간 확인 불가";
	const now = /* @__PURE__ */ new Date();
	const diffSec = Math.floor((now.getTime() - d.getTime()) / 1e3);
	const daysDiff = getKstCalendarDaysDiff(d, now);
	const p = getKstParts(d);
	const exact = `${p.year}.${p.month}.${p.day} (${p.weekday}) ${p.hour}:${p.minute}`;
	let relative = "";
	if (diffSec < 60) relative = "방금 전";
	else if (diffSec < 3600) relative = `${Math.floor(diffSec / 60)}분 전`;
	else if (daysDiff === 0 && diffSec < 86400) relative = `${Math.floor(diffSec / 3600)}시간 전`;
	else if (daysDiff === 1) relative = "어제";
	else if (daysDiff > 1) relative = `${daysDiff}일 전`;
	else relative = "방금 전";
	return `${relative} · 작성: ${exact}`;
}
/**
* Exact Community Date & Time Formatter:
* - `2026.11.07 (토) 14:35` or with seconds `2026.11.07 (토) 14:35:20`
* - Missing or invalid time displays '작성 시간 확인 불가'
*/
function formatCommunityExactDateTime(val, withSeconds = false) {
	const d = parseToDate(val);
	if (!d) return "작성 시간 확인 불가";
	const p = getKstParts(d);
	if (withSeconds) return `${p.year}.${p.month}.${p.day} (${p.weekday}) ${p.hour}:${p.minute}:${p.second}`;
	return `${p.year}.${p.month}.${p.day} (${p.weekday}) ${p.hour}:${p.minute}`;
}
/**
* Community Post List Time (Canonical Alias)
*/
function formatPostListTime(val) {
	return formatCommunityTime(val);
}
/**
* Community Post Detail Exact Date & Time (Canonical Alias)
*/
function formatPostExactDateTime(val, withSeconds = false) {
	return formatCommunityExactDateTime(val, withSeconds);
}
/**
* 3. Chat Date Divider Label:
* - 오늘
* - 어제
* - 2026년 11월 5일 (목)
* - 2026년 11월 4일 (수)
*/
function formatChatDividerDate(val) {
	if (val === null || val === void 0 || val === "") return "날짜 정보 없음";
	const d = parseToDate(val);
	if (!d) return "날짜 정보 없음";
	const now = /* @__PURE__ */ new Date();
	if (isTodayKST(d, now)) return "오늘";
	if (isYesterdayKST(d, now)) return "어제";
	const p = getKstParts(d);
	return `${parseInt(p.year, 10)}년 ${parseInt(p.month, 10)}월 ${parseInt(p.day, 10)}일 (${p.weekday})`;
}
/**
* 4. Chat Message Time:
* - HH:mm (e.g. 14:35)
*/
function formatChatTime(val) {
	if (val === null || val === void 0 || val === "") return "--:--";
	const d = parseToDate(val);
	if (!d) {
		if (typeof val === "string") {
			const parts = val.trim().split(":");
			if (parts.length >= 2) return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
		}
		return "--:--";
	}
	const p = getKstParts(d);
	return `${p.hour}:${p.minute}`;
}
/**
* 5. Chat Exact Timestamp for detail / tooltip:
* `2026.11.07 (토) 14:35:20`
*/
function formatChatExactDateTime(val) {
	if (val === null || val === void 0 || val === "") return "시간 정보 없음";
	const d = parseToDate(val);
	if (!d) return "시간 정보 없음";
	const p = getKstParts(d);
	return `${p.year}.${p.month}.${p.day} (${p.weekday}) ${p.hour}:${p.minute}:${p.second}`;
}
//#endregion
//#region src/utils/stocks/ticker.ts
/**
* Checks if a symbol represents a US stock/ETF/ADR ticker format
* Supports standard 1-5 char tickers (AAPL, TSLA, SPY) and share-class tickers (BRK.B, BRK-B, BF.B)
*/
var isUSStockSymbol = (symbol) => {
	if (!symbol || typeof symbol !== "string") return false;
	const clean = symbol.toUpperCase().trim();
	return /^[A-Z]{1,5}([.-][A-Z]{1,3})?$/.test(clean);
};
/**
* Generates a composite unique React key across markets/exchanges/currencies
* Prevents duplicate key collisions when identical symbols appear in multiple markets or pairs.
*/
var getStockUniqueKey = (item) => {
	const market = (item.market || "UNK").toUpperCase();
	return `${market}:${(item.exchange || market).toUpperCase()}:${(item.symbol || "").toUpperCase()}:${(item.tradingPair || item.currency || "").toUpperCase()}`;
};
//#endregion
//#region src/utils/currency.ts
/**
* Infers ISO 4217 currency code from explicit currency, market, or symbol.
* Guarantees deterministic KRW vs USD separation even on legacy data without `currency`.
*/
function inferStockCurrency(symbol, market, explicitCurrency) {
	const cur = (explicitCurrency || "").toUpperCase().trim();
	if (cur === "KRW" || cur === "USD" || cur === "USDT" || cur === "BTC") return cur;
	const mkt = (market || "").toUpperCase().trim();
	const sym = (symbol || "").toUpperCase().trim();
	if (mkt === "COIN" || sym.startsWith("KRW-") || sym.endsWith("USDT") || sym.endsWith("BTC")) {
		if (sym.startsWith("KRW-")) return "KRW";
		if (sym.endsWith("BTC")) return "BTC";
		return "USDT";
	}
	if (mkt === "US" || mkt === "GLOBAL" || mkt === "NASDAQ" || mkt === "NYSE" || mkt === "AMEX") return "USD";
	if (mkt === "KOSPI" || mkt === "KOSDAQ" || mkt === "KR" || mkt === "KRX") return "KRW";
	if (/^\d{6}$/.test(sym)) return "KRW";
	if (sym && isUSStockSymbol(sym)) return "USD";
	return "KRW";
}
function inferFiatCurrency(symbol, market, explicitCurrency) {
	const c = inferStockCurrency(symbol, market, explicitCurrency);
	return c === "USD" || c === "USDT" || c === "BTC" ? "USD" : "KRW";
}
function inferStockExchange(symbol, market, explicitExchange) {
	if (explicitExchange && explicitExchange.trim()) return explicitExchange.trim();
	const mkt = (market || "").toUpperCase().trim();
	if (mkt === "KOSPI" || mkt === "KOSDAQ") return mkt;
	if (mkt === "US" || mkt === "GLOBAL") return "US (NASDAQ/NYSE)";
	if (mkt === "COIN") return (symbol || "").toUpperCase().startsWith("KRW-") ? "UPBIT" : "BINANCE";
	if (inferStockCurrency(symbol, market) === "USD") return "NASDAQ/NYSE";
	if (/^\d{6}$/.test((symbol || "").trim())) return "KRX";
	return mkt || "KRX";
}
function roundByCurrency(amount, currency = "KRW") {
	if (!Number.isFinite(amount)) return 0;
	if (currency === "KRW") return Math.round(amount);
	if (currency === "USD") return Number(amount.toFixed(2));
	if (currency === "USDT") return Number(amount.toFixed(Math.abs(amount) < 1 ? 4 : 2));
	if (currency === "BTC") return Number(amount.toFixed(8));
	return Math.round(amount);
}
/**
* Unified money formatter
* Defaults strictly to:
*  - KRW: ₩1,000,000 (or -₩1,000,000)
*  - USD: $1,000.00 (or -$1,000.00)
*/
function formatMoney(amount, currency = "KRW", options = {}) {
	const { showSign = false, krwStyle = "symbol", decimals } = options;
	const safe = Number.isFinite(amount) ? amount : 0;
	const isNeg = safe < 0;
	const absVal = Math.abs(safe);
	const sign = isNeg ? "-" : showSign && safe > 0 ? "+" : "";
	if (currency === "USD") {
		const d = decimals ?? 2;
		return `${sign}$${absVal.toLocaleString("en-US", {
			minimumFractionDigits: d,
			maximumFractionDigits: d
		})}`;
	}
	if (currency === "USDT") {
		const d = decimals ?? (absVal > 0 && absVal < 1 ? 4 : 2);
		return `${sign}${absVal.toLocaleString("en-US", {
			minimumFractionDigits: d,
			maximumFractionDigits: d
		})} USDT`;
	}
	if (currency === "BTC") return `${sign}${absVal.toFixed(decimals ?? 8)} BTC`;
	const rounded = Math.round(absVal).toLocaleString("ko-KR");
	return krwStyle === "unit" ? `${sign}${rounded}원` : `${sign}₩${rounded}`;
}
function getCurrencySymbol(currency = "KRW") {
	switch (currency) {
		case "USD": return "$";
		case "USDT": return "USDT";
		case "BTC": return "BTC";
		default: return "₩";
	}
}
function formatMarketCapByCurrency(marketCap, currency = "KRW") {
	if (!Number.isFinite(marketCap) || marketCap <= 0) return "-";
	if (currency === "USD") {
		if (marketCap >= 1e4) return `$${(marketCap / 10).toFixed(1)}B (${(marketCap / 1e4).toFixed(1)}조 달러)`;
		return `$${(marketCap / 10).toFixed(1)}B (${marketCap.toLocaleString()}억 달러)`;
	}
	if (marketCap >= 1e4) return `${(marketCap / 1e4).toFixed(1)}조 원`;
	return `${marketCap.toLocaleString()}억 원`;
}
function formatTradingValueByCurrency(tradingValue, currency = "KRW") {
	if (!Number.isFinite(tradingValue) || tradingValue <= 0) return "-";
	if (currency === "USD") {
		if (tradingValue >= 1e3) return `$${(tradingValue / 1e3).toFixed(2)}B`;
		return `$${tradingValue.toLocaleString()}M`;
	}
	if (currency === "USDT") {
		if (tradingValue >= 1e3) return `$${(tradingValue / 1e3).toFixed(2)}B`;
		return `$${tradingValue.toLocaleString()}M`;
	}
	if (tradingValue >= 1e4) return `${(tradingValue / 1e4).toFixed(1)}조 원`;
	return `${tradingValue.toLocaleString()}억 원`;
}
/**
* Validates exchange rate metadata strictly.
* Rejects missing, <= 0, stale, error, or unavailable rates so NO arbitrary fallback conversion runs.
*/
function validateExchangeRate(fx) {
	if (!fx) return {
		valid: false,
		rate: null,
		status: "unavailable",
		lastUpdated: "-",
		reason: "환율 정보를 수신하지 못했습니다."
	};
	const rate = typeof fx.rate === "number" && Number.isFinite(fx.rate) && fx.rate > 0 ? fx.rate : null;
	const status = fx.status || (fx.isStale ? "stale" : rate ? "ok" : "unavailable");
	const lastUpdated = fx.lastUpdated || "-";
	if (rate === null) return {
		valid: false,
		rate: null,
		status: status === "ok" ? "error" : status,
		lastUpdated,
		reason: fx.errorMessage || "유효한 USD/KRW 환율 값이 없습니다."
	};
	if (fx.isStale || status === "stale" || status === "error" || status === "unavailable") return {
		valid: false,
		rate,
		status: status === "ok" ? "stale" : status,
		lastUpdated,
		reason: fx.errorMessage || "실시간 환율 지연/만료 상태로 KRW 환산을 중단했습니다."
	};
	return {
		valid: true,
		rate,
		status,
		lastUpdated
	};
}
/**
* Converts a monetary amount to KRW ONLY when exchange rate is valid (for USD).
*/
function convertToKRW(amount, currency, fx) {
	if (currency === "KRW") return {
		valid: true,
		valueKRW: Math.round(amount),
		rateUsed: 1
	};
	const check = validateExchangeRate(fx);
	if (!check.valid || check.rate === null) return {
		valid: false,
		valueKRW: null,
		rateUsed: check.rate,
		reason: check.reason
	};
	return {
		valid: true,
		valueKRW: Math.round(amount * check.rate),
		rateUsed: check.rate
	};
}
/**
* Pure portfolio aggregation separating KRW & USD natively and computing
* stock-only P&L vs FX-fluctuation P&L cleanly without mixing raw currencies.
*/
function aggregateMultiCurrencyPortfolio(params) {
	const { positions = [], realizedTrades = [], cashKRW = 0, initialCashKRW = 0, cashUSD = 0, initialCashUSD = 0, fx, fallbackValuationToCost = false } = params;
	const fxCheck = validateExchangeRate(fx);
	let missingQuoteCount = 0;
	let krwCost = 0;
	let krwValuation = 0;
	let krwCount = 0;
	let usdCost = 0;
	let usdValuation = 0;
	let usdCount = 0;
	let usdCostAtEntryFxKRW = 0;
	let usdValuationAtEntryFxKRW = 0;
	let hasEntryFxData = false;
	for (const pos of positions) {
		const cur = inferFiatCurrency(pos.symbol, pos.market, pos.currency);
		const hasPrice = typeof pos.currentPrice === "number" && Number.isFinite(pos.currentPrice) && pos.currentPrice > 0;
		if (!hasPrice) missingQuoteCount++;
		const rawValuation = hasPrice ? pos.currentPrice * pos.quantity : fallbackValuationToCost ? pos.totalCost : 0;
		if (cur === "USD") {
			usdCount++;
			usdCost += pos.totalCost;
			usdValuation += rawValuation;
			if (pos.entryExchangeRate && pos.entryExchangeRate > 0) {
				hasEntryFxData = true;
				usdCostAtEntryFxKRW += pos.totalCost * pos.entryExchangeRate;
				usdValuationAtEntryFxKRW += rawValuation * pos.entryExchangeRate;
			} else if (fxCheck.valid && fxCheck.rate) {
				usdCostAtEntryFxKRW += pos.totalCost * fxCheck.rate;
				usdValuationAtEntryFxKRW += rawValuation * fxCheck.rate;
			}
		} else {
			krwCount++;
			krwCost += pos.totalCost;
			krwValuation += rawValuation;
		}
	}
	let krwRealized = 0;
	let usdRealized = 0;
	let usdRealizedStockKRW = 0;
	let usdRealizedFxKRW = 0;
	for (const t of realizedTrades) {
		if (t.realizedProfit === void 0 || !Number.isFinite(t.realizedProfit)) continue;
		if (inferFiatCurrency(t.symbol, t.market, t.currency) === "USD") {
			usdRealized += t.realizedProfit;
			if (t.exchangeRate && t.exchangeRate > 0) {
				usdRealizedStockKRW += t.realizedProfit * t.exchangeRate;
				if (fxCheck.valid && fxCheck.rate) usdRealizedFxKRW += t.realizedProfit * (fxCheck.rate - t.exchangeRate);
			} else if (fxCheck.valid && fxCheck.rate) usdRealizedStockKRW += t.realizedProfit * fxCheck.rate;
		} else krwRealized += t.realizedProfit;
	}
	const krwCostRounded = Math.round(krwCost);
	const krwValRounded = Math.round(krwValuation);
	const krwUnrealized = krwValRounded - krwCostRounded;
	const krwRealizedRounded = Math.round(krwRealized);
	const krwTotalPnL = krwUnrealized + krwRealizedRounded;
	const krwTotalAssets = Math.round(cashKRW) + krwValRounded;
	const krwDenominator = initialCashKRW > 0 ? initialCashKRW : krwCostRounded;
	const krwReturnRate = krwDenominator > 0 ? Number(((initialCashKRW > 0 ? krwTotalAssets - initialCashKRW : krwUnrealized) / krwDenominator * 100).toFixed(2)) : 0;
	const usdCostRounded = Number(usdCost.toFixed(2));
	const usdValRounded = Number(usdValuation.toFixed(2));
	const usdUnrealized = Number((usdValRounded - usdCostRounded).toFixed(2));
	const usdRealizedRounded = Number(usdRealized.toFixed(2));
	const usdTotalPnL = Number((usdUnrealized + usdRealizedRounded).toFixed(2));
	const usdTotalAssets = Number((cashUSD + usdValRounded).toFixed(2));
	const usdDenominator = initialCashUSD > 0 ? initialCashUSD : usdCostRounded;
	const usdReturnRate = usdDenominator > 0 ? Number(((initialCashUSD > 0 ? usdTotalAssets - initialCashUSD : usdUnrealized) / usdDenominator * 100).toFixed(2)) : 0;
	const krw = {
		currency: "KRW",
		cash: Math.round(cashKRW),
		initialCash: Math.round(initialCashKRW),
		investedCost: krwCostRounded,
		evaluationAmount: krwValRounded,
		unrealizedPnL: krwUnrealized,
		realizedPnL: krwRealizedRounded,
		totalPnL: krwTotalPnL,
		totalAssets: krwTotalAssets,
		returnRatePercent: krwReturnRate,
		holdingsCount: krwCount
	};
	const usd = {
		currency: "USD",
		cash: Number(cashUSD.toFixed(2)),
		initialCash: Number(initialCashUSD.toFixed(2)),
		investedCost: usdCostRounded,
		evaluationAmount: usdValRounded,
		unrealizedPnL: usdUnrealized,
		realizedPnL: usdRealizedRounded,
		totalPnL: usdTotalPnL,
		totalAssets: usdTotalAssets,
		returnRatePercent: usdReturnRate,
		holdingsCount: usdCount
	};
	let convertedKRW = null;
	if (fxCheck.valid && fxCheck.rate !== null) {
		const rate = fxCheck.rate;
		const totalCashKRW = Math.round(cashKRW + cashUSD * rate);
		const usdCostAtCurrentFx = Math.round(usdCost * rate);
		const usdValAtCurrentFx = Math.round(usdValuation * rate);
		const totalInvestedCostKRW = krwCostRounded + usdCostAtCurrentFx;
		const totalEvalKRW = krwValRounded + usdValAtCurrentFx;
		const totalUnrealizedCurrentFx = krwUnrealized + Math.round(usdUnrealized * rate);
		const totalRealizedCurrentFx = krwRealizedRounded + Math.round(usdRealized * rate);
		const usdStockUnrealizedKRW = Math.round(usdValuationAtEntryFxKRW - usdCostAtEntryFxKRW);
		const stockPnLKRW = krwUnrealized + krwRealizedRounded + usdStockUnrealizedKRW + Math.round(usdRealizedStockKRW);
		const fxPnLKRW = (hasEntryFxData ? Math.round(usdValAtCurrentFx - usdCostAtEntryFxKRW - usdStockUnrealizedKRW) : 0) + Math.round(usdRealizedFxKRW);
		const totalAssetsCombined = totalCashKRW + totalEvalKRW;
		const initialCombinedKRW = initialCashKRW + (initialCashUSD > 0 ? Math.round(initialCashUSD * rate) : 0);
		const totalPnLCombined = initialCombinedKRW > 0 ? totalAssetsCombined - initialCombinedKRW : totalUnrealizedCurrentFx + totalRealizedCurrentFx;
		const denom = initialCombinedKRW > 0 ? initialCombinedKRW : totalInvestedCostKRW;
		convertedKRW = {
			totalAssets: totalAssetsCombined,
			totalCash: totalCashKRW,
			investedCost: totalInvestedCostKRW,
			evaluationAmount: totalEvalKRW,
			unrealizedPnL: totalUnrealizedCurrentFx,
			realizedPnL: totalRealizedCurrentFx,
			stockPnLKRW,
			fxPnLKRW,
			totalPnL: totalPnLCombined,
			returnRatePercent: denom > 0 ? Number((totalPnLCombined / denom * 100).toFixed(2)) : 0,
			hasEntryFxData
		};
	}
	return {
		krw,
		usd,
		fx: fxCheck,
		missingQuoteCount,
		convertedKRW
	};
}
//#endregion
//#region src/utils/dedupe.ts
function dedupeByKey(items, getKey) {
	const seen = /* @__PURE__ */ new Set();
	const result = [];
	for (const item of items) {
		if (!item) continue;
		const key = getKey(item);
		if (key !== void 0 && key !== null && key !== "") {
			if (seen.has(key)) continue;
			seen.add(key);
		}
		result.push(item);
	}
	return result;
}
function dedupeById(items) {
	return dedupeByKey(items, (item) => item?.id);
}
//#endregion
//#region src/services/firebaseRepository.ts
async function notifyVerifyActivity(uid, activityType) {
	if (!uid) return;
	try {
		const headers = { "Content-Type": "application/json" };
		const token = await auth.currentUser?.getIdToken().catch(() => null);
		if (token) headers.Authorization = `Bearer ${token}`;
		await fetch("/api/user/verify-activity", {
			method: "POST",
			headers,
			body: JSON.stringify({
				uid,
				activityType
			})
		});
	} catch (err) {
		console.warn("[firebaseRepository] verify-activity notice:", err);
	}
}
function extractTimestampIso(raw, fallbackServerRaw) {
	const attemptParse = (val) => {
		if (!val) return null;
		if (typeof val === "object" && typeof val.toDate === "function") try {
			return val.toDate().toISOString();
		} catch {}
		if (typeof val.seconds === "number") return (/* @__PURE__ */ new Date(val.seconds * 1e3)).toISOString();
		if (typeof val === "string") {
			const parsed = parseToDate(val);
			return parsed ? parsed.toISOString() : null;
		}
		return null;
	};
	const fallbackResult = attemptParse(fallbackServerRaw);
	if (fallbackResult) return fallbackResult;
	const rawResult = attemptParse(raw);
	if (rawResult) return rawResult;
	return "";
}
var firebaseRepository = {
	async syncUserProfile(uid, email, displayName, photoURL) {
		const userRef = doc(db, "users", uid);
		try {
			const snap = await getDoc(userRef);
			const isOwnerAdmin = email === "byunghyunlim92@gmail.com" || uid === "lr018vf8CcW5fAv707vsl77qJy53";
			if (!snap.exists()) {
				const newUser = {
					id: uid,
					email,
					name: displayName || (isOwnerAdmin ? "총괄관리자 (임병현)" : email.split("@")[0]),
					avatar: photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
					role: isOwnerAdmin ? "superadmin" : "user",
					tier: isOwnerAdmin ? "최고 관리자" : "일반회원",
					joinedDate: (/* @__PURE__ */ new Date()).toLocaleDateString("ko-KR"),
					bio: isOwnerAdmin ? "병돌 인베스트먼트 총괄 시스템 관리자" : "스마트한 가치 투자를 지향합니다.",
					postCount: 0,
					commentCount: 0,
					winRate: 70,
					level: 1,
					title: "주린이",
					badge: "",
					badges: [],
					status: "active",
					chatRestricted: false
				};
				await setDoc(userRef, {
					uid,
					email,
					nickname: newUser.name,
					displayName: newUser.name,
					photoURL: newUser.avatar,
					role: newUser.role,
					tier: newUser.tier,
					level: 1,
					title: "주린이",
					badge: "",
					badges: [],
					createdAt: (/* @__PURE__ */ new Date()).toISOString(),
					lastLoginAt: (/* @__PURE__ */ new Date()).toISOString(),
					isActive: true,
					status: "active",
					chatRestricted: false
				});
				return newUser;
			} else {
				const data = snap.data();
				if (isOwnerAdmin) {
					if (data.chatRestricted || data.chatMutedUntil) await updateDoc(userRef, {
						chatRestricted: false,
						chatMutedUntil: null,
						lastLoginAt: (/* @__PURE__ */ new Date()).toISOString()
					}).catch(() => {});
					else await updateDoc(userRef, { lastLoginAt: (/* @__PURE__ */ new Date()).toISOString() }).catch(() => {});
					await Promise.allSettled([deleteDoc(doc(db, "chatRestrictions", uid)), deleteDoc(doc(db, "chat_restrictions", uid))]);
				} else await updateDoc(userRef, { lastLoginAt: (/* @__PURE__ */ new Date()).toISOString() }).catch(() => {});
				return {
					id: uid,
					email: data.email || email,
					name: data.nickname || data.displayName || (isOwnerAdmin ? "총괄관리자 (임병현)" : "투자자"),
					avatar: data.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
					role: isOwnerAdmin ? "superadmin" : data.role || "user",
					tier: isOwnerAdmin ? "최고 관리자" : data.tier || "일반회원",
					joinedDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString("ko-KR") : "2026.01.15",
					bio: data.bio || (isOwnerAdmin ? "병돌 인베스트먼트 총괄 시스템 관리자" : "스마트한 가치 투자를 지향합니다."),
					postCount: data.postCount || 0,
					commentCount: data.commentCount || 0,
					winRate: data.winRate || 70,
					status: data.status || "active",
					chatRestricted: isOwnerAdmin ? false : Boolean(data.chatRestricted),
					chatMutedUntil: isOwnerAdmin ? void 0 : data.chatMutedUntil,
					level: data.level || 1,
					title: data.title || "주린이",
					badge: data.badge || "",
					badges: data.badges || []
				};
			}
		} catch (err) {
			console.warn("Firebase user sync failed, using local profile:", err);
			const isOwnerAdmin = email === "byunghyunlim92@gmail.com" || uid === "lr018vf8CcW5fAv707vsl77qJy53";
			return {
				id: uid,
				email,
				name: displayName || (isOwnerAdmin ? "총괄관리자 (임병현)" : "병돌투자자"),
				avatar: photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
				role: isOwnerAdmin ? "superadmin" : "user",
				tier: isOwnerAdmin ? "최고 관리자" : "일반회원",
				joinedDate: "2026.01.01",
				bio: "스마트한 가치 투자를 지향합니다.",
				postCount: 0,
				commentCount: 0,
				winRate: 70,
				status: "active",
				chatRestricted: false,
				level: 1,
				title: "주린이",
				badge: "",
				badges: []
			};
		}
	},
	subscribeUsers(callback, onError) {
		try {
			const q = query(collection(db, "users"), limit(300));
			return onSnapshot(q, (snap) => {
				const list = [];
				let hasRootAdmin = false;
				snap.forEach((d) => {
					const data = d.data();
					const uid = d.id;
					if (uid === "lr018vf8CcW5fAv707vsl77qJy53" || data.email === "byunghyunlim92@gmail.com") hasRootAdmin = true;
					list.push({
						id: uid,
						email: data.email || "",
						name: data.nickname || data.displayName || data.name || "회원",
						avatar: data.photoURL || data.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
						role: uid === "lr018vf8CcW5fAv707vsl77qJy53" || data.email === "byunghyunlim92@gmail.com" ? "superadmin" : data.role || "user",
						tier: data.tier || (uid === "lr018vf8CcW5fAv707vsl77qJy53" ? "최고 관리자" : "일반회원"),
						joinedDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString("ko-KR") : "2026.01.01",
						createdAt: data.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
						bio: data.bio || "",
						postCount: data.postCount || 0,
						commentCount: data.commentCount || 0,
						status: data.status || "active",
						suspendedReason: data.suspendedReason,
						chatRestricted: Boolean(data.chatRestricted),
						chatMutedUntil: data.chatMutedUntil,
						lastLoginAt: data.lastLoginAt ? new Date(data.lastLoginAt).toLocaleString("ko-KR") : void 0,
						reportedCount: data.reportedCount || 0,
						reportSubmitCount: data.reportSubmitCount || 0,
						level: data.level || 1,
						title: data.title || "주린이",
						badge: data.badge || "",
						badges: data.badges || []
					});
				});
				if (!hasRootAdmin) list.unshift({
					id: "lr018vf8CcW5fAv707vsl77qJy53",
					name: "총괄관리자 (임병현)",
					email: "byunghyunlim92@gmail.com",
					avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
					role: "superadmin",
					tier: "최고 관리자",
					joinedDate: "2026.01.01",
					createdAt: "2026-01-01T00:00:00.000Z",
					bio: "병돌 인베스트먼트 총괄 시스템 관리자",
					postCount: 0,
					commentCount: 0,
					status: "active",
					chatRestricted: false,
					lastLoginAt: (/* @__PURE__ */ new Date()).toLocaleString("ko-KR"),
					reportedCount: 0,
					reportSubmitCount: 0,
					level: 99,
					title: "시스템 총괄",
					badge: "최고 관리자",
					badges: ["superadmin"]
				});
				callback(list);
			}, (err) => {
				if (err.code === "cancelled") console.debug("[Firebase] Users listener cancelled");
				else {
					console.warn("[firebaseRepository] subscribeUsers onSnapshot error:", err);
					handleFirestoreError(err, OperationType.LIST, "users");
					if (onError) onError(err);
				}
			});
		} catch (err) {
			console.warn("[firebaseRepository] subscribeUsers exception:", err);
			handleFirestoreError(err, OperationType.LIST, "users");
			if (onError) onError(err);
			return () => {};
		}
	},
	async updateUserStatus(uid, status, reason) {
		try {
			const userRef = doc(db, "users", uid);
			await updateDoc(userRef, {
				status,
				suspendedReason: reason || null,
				chatRestricted: status === "suspended",
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
		} catch (err) {
			console.warn("[firebaseRepository] updateUserStatus error:", err);
		}
	},
	async updateUserRole(uid, role) {
		try {
			const userRef = doc(db, "users", uid);
			await updateDoc(userRef, {
				role,
				tier: role === "superadmin" ? "최고 관리자" : role === "admin" ? "운영자" : role === "moderator" ? "운영진 (Moderator)" : "일반회원",
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
		} catch (err) {
			console.warn("[firebaseRepository] updateUserRole error:", err);
		}
	},
	async updateUserChatRestricted(uid, restricted, durationDesc) {
		try {
			const userRef = doc(db, "users", uid);
			await updateDoc(userRef, {
				chatRestricted: restricted,
				chatMutedUntil: restricted ? durationDesc || "1시간" : null,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
		} catch (err) {
			console.warn("[firebaseRepository] updateUserChatRestricted error:", err);
		}
	},
	async deleteUser(uid) {
		try {
			await deleteDoc(doc(db, "users", uid));
		} catch (err) {
			console.warn("[firebaseRepository] deleteUser error:", err);
		}
	},
	async getUserWatchlists(uid) {
		const path = "watchlists";
		try {
			const q = query(collection(db, path), where("uid", "==", uid), limit(200));
			const snap = await getDocs(q);
			const items = [];
			snap.forEach((docSnap) => {
				const d = docSnap.data();
				if (d.symbol) items.push({
					symbol: d.symbol,
					orderIndex: typeof d.orderIndex === "number" ? d.orderIndex : 9999,
					createdAt: d.createdAt || ""
				});
			});
			items.sort((a, b) => a.orderIndex - b.orderIndex || a.createdAt.localeCompare(b.createdAt));
			return items.map((i) => i.symbol);
		} catch (err) {
			console.warn("Firebase get watchlists failed:", err);
			handleFirestoreError(err, OperationType.LIST, path);
			return [];
		}
	},
	subscribeUserWatchlists(uid, callback) {
		const path = "watchlists";
		try {
			const q = query(collection(db, path), where("uid", "==", uid), limit(200));
			const unsubscribe = onSnapshot(q, (snap) => {
				const items = [];
				snap.forEach((docSnap) => {
					const d = docSnap.data();
					if (d.symbol) items.push({
						symbol: d.symbol,
						orderIndex: typeof d.orderIndex === "number" ? d.orderIndex : 9999,
						createdAt: d.createdAt || ""
					});
				});
				items.sort((a, b) => a.orderIndex - b.orderIndex || a.createdAt.localeCompare(b.createdAt));
				callback(items.map((i) => i.symbol));
			}, (err) => {
				if (err.code === "cancelled") console.debug("[Firebase] Watchlists listener cancelled");
				else {
					console.warn("Watchlists onSnapshot error:", err);
					handleFirestoreError(err, OperationType.GET, path);
				}
			});
			return () => {
				unsubscribe();
			};
		} catch (err) {
			console.warn("subscribeUserWatchlists exception:", err);
			handleFirestoreError(err, OperationType.GET, path);
			return () => {};
		}
	},
	getWatchlistDocId(uid, market, symbol) {
		return `${uid}_${(market || "ALL").replace(/[^a-zA-Z0-9_-]/g, "_")}_${(symbol || "").replace(/[^a-zA-Z0-9_-]/g, (c) => `_${c.charCodeAt(0).toString(16)}_`)}`.slice(0, 120);
	},
	async addWatchlist(uid, symbol, orderIndex, market = "UNKNOWN", stockData) {
		const docId = this.getWatchlistDocId(uid, market, symbol);
		try {
			await setDoc(doc(db, "watchlists", docId), {
				uid,
				symbol,
				market,
				currency: inferStockCurrency(symbol, market, stockData?.currency),
				name: stockData?.name || symbol,
				exchange: inferStockExchange(symbol, market, stockData?.exchange),
				productType: stockData?.productType || "",
				orderIndex: typeof orderIndex === "number" ? orderIndex : Date.now(),
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			}, { merge: true });
		} catch (err) {
			console.warn("Firebase add watchlist error:", err);
			handleFirestoreError(err, OperationType.WRITE, `watchlists/${docId}`);
		}
	},
	async removeWatchlist(uid, symbol, market = "UNKNOWN") {
		const docId = this.getWatchlistDocId(uid, market, symbol);
		try {
			await deleteDoc(doc(db, "watchlists", docId)).catch(() => {});
			const q = query(collection(db, "watchlists"), where("uid", "==", uid), where("symbol", "==", symbol));
			const deletes = (await getDocs(q)).docs.map((d) => deleteDoc(d.ref));
			await Promise.allSettled(deletes);
		} catch (err) {
			console.warn("Firebase remove watchlist error:", err);
			handleFirestoreError(err, OperationType.DELETE, `watchlists/${docId}`);
		}
	},
	async updateWatchlistOrder(uid, orders) {
		const path = "watchlists";
		try {
			const promises = orders.map((order) => {
				const docId = this.getWatchlistDocId(uid, order.market, order.symbol);
				return updateDoc(doc(db, "watchlists", docId), { orderIndex: order.orderIndex }).catch(() => {
					return setDoc(doc(db, "watchlists", docId), {
						uid,
						symbol: order.symbol,
						market: order.market,
						orderIndex: order.orderIndex,
						createdAt: (/* @__PURE__ */ new Date()).toISOString()
					}, { merge: true });
				});
			});
			await Promise.allSettled(promises);
		} catch (err) {
			console.warn("Firebase update watchlist order error:", err);
			handleFirestoreError(err, OperationType.UPDATE, path);
		}
	},
	async getPosts() {
		try {
			const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(100));
			const snap = await getDocs(q);
			const list = [];
			snap.forEach((docSnap) => {
				const d = docSnap.data();
				if (d.isDeleted) return;
				list.push({
					id: docSnap.id,
					author: {
						id: d.authorId || "anon",
						name: d.authorName || "투자자",
						avatar: d.authorAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
						badge: d.authorBadge || "정회원",
						tier: d.authorTier || "골드",
						level: d.authorLevel || 0,
						title: d.authorTitle || "주린이"
					},
					category: d.category || "free",
					title: d.title || "제목 없음",
					content: d.content || "",
					symbol: d.stockSymbol,
					symbolName: d.stockName || d.stockSymbolName,
					likes: d.likeCount || 0,
					likedBy: d.likedBy || [],
					views: d.viewCount || 0,
					commentsCount: d.commentCount || (d.comments ? d.comments.length : 0),
					createdAt: extractTimestampIso(d.createdAt, d.serverCreatedAt),
					updatedAt: extractTimestampIso(d.updatedAt, d.serverUpdatedAt) || void 0,
					tags: d.tags || [],
					isHot: (d.likeCount || 0) >= 10,
					comments: Array.isArray(d.comments) ? d.comments.map((c) => ({
						...c,
						createdAt: extractTimestampIso(c.createdAt, c.serverCreatedAt) || c.createdAt || "",
						updatedAt: extractTimestampIso(c.updatedAt, c.serverUpdatedAt) || c.updatedAt
					})) : []
				});
			});
			return dedupeById(list);
		} catch (err) {
			console.warn("Firebase get posts failed:", err);
			return [];
		}
	},
	subscribePosts(callback, errorCallback) {
		try {
			const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(100));
			return onSnapshot(q, (snap) => {
				const list = [];
				snap.forEach((docSnap) => {
					const d = docSnap.data();
					if (d.isDeleted) return;
					list.push({
						id: docSnap.id,
						author: {
							id: d.authorId || "anon",
							name: d.authorName || "투자자",
							avatar: d.authorAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
							badge: d.authorBadge || "정회원",
							tier: d.authorTier || "골드",
							level: d.authorLevel || 0,
							title: d.authorTitle || "주린이"
						},
						category: d.category || "free",
						title: d.title || "제목 없음",
						content: d.content || "",
						symbol: d.stockSymbol,
						symbolName: d.stockName || d.stockSymbolName,
						likes: d.likeCount || 0,
						likedBy: d.likedBy || [],
						views: d.viewCount || 0,
						commentsCount: d.commentCount || (d.comments ? d.comments.length : 0),
						createdAt: extractTimestampIso(d.createdAt, d.serverCreatedAt),
						updatedAt: extractTimestampIso(d.updatedAt, d.serverUpdatedAt) || void 0,
						tags: d.tags || [],
						isHot: (d.likeCount || 0) >= 10,
						status: d.status || "published",
						isNotice: Boolean(d.isNotice || d.category === "notice"),
						comments: Array.isArray(d.comments) ? d.comments.map((c) => ({
							...c,
							createdAt: extractTimestampIso(c.createdAt, c.serverCreatedAt) || c.createdAt || "",
							updatedAt: extractTimestampIso(c.updatedAt, c.serverUpdatedAt) || c.updatedAt
						})) : []
					});
				});
				callback(dedupeById(list));
			}, (err) => {
				if (err.code === "cancelled") console.debug("[Firebase] Posts listener cancelled");
				else {
					console.warn("subscribePosts onSnapshot error:", err);
					handleFirestoreError(err, OperationType.LIST, "posts");
					if (errorCallback) errorCallback(err);
				}
			});
		} catch (err) {
			console.warn("subscribePosts exception:", err);
			handleFirestoreError(err, OperationType.LIST, "posts");
			if (errorCallback) errorCallback(err);
			return () => {};
		}
	},
	async getPostById(postId) {
		try {
			const snap = await getDoc(doc(db, "posts", postId));
			if (!snap.exists()) return void 0;
			const d = snap.data();
			return {
				id: snap.id,
				author: {
					id: d.authorId,
					name: d.authorName || "투자자",
					avatar: d.authorAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
					badge: d.authorBadge || "정회원",
					tier: d.authorTier || "골드",
					level: d.authorLevel || 0,
					title: d.authorTitle || "주린이"
				},
				category: d.category || "free",
				title: d.title,
				content: d.content,
				symbol: d.stockSymbol,
				symbolName: d.stockName || d.stockSymbolName,
				likes: d.likeCount || 0,
				likedBy: d.likedBy || [],
				views: d.viewCount || 0,
				commentsCount: d.commentCount || (d.comments ? d.comments.length : 0),
				createdAt: extractTimestampIso(d.createdAt, d.serverCreatedAt),
				updatedAt: extractTimestampIso(d.updatedAt, d.serverUpdatedAt) || void 0,
				tags: d.tags || [],
				isHot: (d.likeCount || 0) >= 10,
				comments: Array.isArray(d.comments) ? d.comments.map((c) => ({
					...c,
					createdAt: extractTimestampIso(c.createdAt, c.serverCreatedAt) || c.createdAt || "",
					updatedAt: extractTimestampIso(c.updatedAt, c.serverUpdatedAt) || c.updatedAt
				})) : []
			};
		} catch (err) {
			console.warn("Firebase getPostById failed:", err);
			return;
		}
	},
	async createPost(post) {
		try {
			const col = collection(db, "posts");
			const docRef = doc(col);
			await setDoc(docRef, {
				id: docRef.id,
				authorId: post.author.id,
				authorName: post.author.name,
				authorAvatar: post.author.avatar,
				authorBadge: post.author.badge,
				authorTier: post.author.tier,
				authorLevel: post.author.level,
				authorTitle: post.author.title,
				category: post.category,
				title: post.title,
				content: post.content,
				stockSymbol: post.symbol || "",
				stockName: post.symbolName || "",
				viewCount: 1,
				likeCount: 0,
				likedBy: [],
				commentCount: 0,
				comments: [],
				createdAt: serverTimestamp(),
				createdAtIso: (/* @__PURE__ */ new Date()).toISOString(),
				serverCreatedAt: serverTimestamp(),
				updatedAt: null,
				serverUpdatedAt: null,
				status: "published",
				isDeleted: false,
				tags: post.tags || []
			});
			notifyVerifyActivity(post.author.id, "post");
			return docRef.id;
		} catch (err) {
			console.warn("Firebase create post failed:", err);
			return `local-${Date.now()}`;
		}
	},
	async updatePost(postId, updates) {
		try {
			const updateData = {
				updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
				serverUpdatedAt: serverTimestamp()
			};
			delete updates.createdAt;
			delete updates.serverCreatedAt;
			delete updates.createdAtIso;
			if (updates.title !== void 0) updateData.title = updates.title;
			if (updates.content !== void 0) updateData.content = updates.content;
			if (updates.category !== void 0) updateData.category = updates.category;
			if (updates.symbol !== void 0) updateData.stockSymbol = updates.symbol;
			if (updates.symbolName !== void 0) updateData.stockName = updates.symbolName;
			if (updates.tags !== void 0) updateData.tags = updates.tags;
			await updateDoc(doc(db, "posts", postId), updateData);
		} catch (err) {
			console.warn("Firebase update post failed:", err);
		}
	},
	async deletePost(postId) {
		try {
			await updateDoc(doc(db, "posts", postId), {
				isDeleted: true,
				deletedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
		} catch (err) {
			console.warn("Firebase soft-delete post failed:", err);
		}
	},
	async updatePostStatus(postId, status) {
		try {
			if (status === "deleted") await updateDoc(doc(db, "posts", postId), {
				isDeleted: true,
				deletedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
			else await updateDoc(doc(db, "posts", postId), {
				status,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
		} catch (err) {
			console.warn("Firebase updatePostStatus failed:", err);
		}
	},
	async incrementPostView(postId) {
		try {
			const postRef = doc(db, "posts", postId);
			const snap = await getDoc(postRef);
			if (snap.exists()) {
				const curViews = snap.data().viewCount || 0;
				await updateDoc(postRef, { viewCount: curViews + 1 });
			}
		} catch (err) {
			console.warn("Firebase incrementPostView failed:", err);
		}
	},
	async togglePostLike(postId, userId) {
		try {
			const postRef = doc(db, "posts", postId);
			const snap = await getDoc(postRef);
			if (!snap.exists()) return null;
			const d = snap.data();
			let likedBy = d.likedBy || [];
			let likeCount = d.likeCount || 0;
			if (likedBy.includes(userId)) {
				likedBy = likedBy.filter((id) => id !== userId);
				likeCount = Math.max(0, likeCount - 1);
			} else {
				likedBy.push(userId);
				likeCount += 1;
			}
			await updateDoc(postRef, {
				likedBy,
				likeCount
			});
			return {
				likes: likeCount,
				likedBy
			};
		} catch (err) {
			console.warn("Firebase togglePostLike failed:", err);
			return null;
		}
	},
	async addComment(postId, comment) {
		try {
			const postRef = doc(db, "posts", postId);
			const snap = await getDoc(postRef);
			if (snap.exists()) {
				const curComments = snap.data().comments || [];
				curComments.push(comment);
				await updateDoc(postRef, {
					comments: curComments,
					commentCount: curComments.length
				});
				notifyVerifyActivity(comment.author.id, "comment");
			}
		} catch (err) {
			console.warn("Firebase addComment failed:", err);
		}
	},
	async updateComment(postId, commentId, newContent) {
		try {
			const postRef = doc(db, "posts", postId);
			const snap = await getDoc(postRef);
			if (snap.exists()) {
				const curComments = snap.data().comments || [];
				const target = curComments.find((c) => c.id === commentId);
				if (target) {
					target.content = newContent;
					target.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
					await updateDoc(postRef, { comments: curComments });
				}
			}
		} catch (err) {
			console.warn("Firebase updateComment failed:", err);
		}
	},
	async deleteComment(postId, commentId) {
		try {
			const postRef = doc(db, "posts", postId);
			const snap = await getDoc(postRef);
			if (snap.exists()) {
				const filtered = (snap.data().comments || []).filter((c) => c.id !== commentId);
				await updateDoc(postRef, {
					comments: filtered,
					commentCount: filtered.length
				});
			}
		} catch (err) {
			console.warn("Firebase deleteComment failed:", err);
		}
	},
	async createReport(report) {
		try {
			const col = collection(db, "reports");
			const docRef = doc(col);
			await setDoc(docRef, {
				id: docRef.id,
				reporterId: report.reporterId,
				reporterName: report.reporterName,
				targetType: report.targetType,
				targetId: report.targetId,
				postId: report.postId || "",
				targetContent: report.targetContent,
				targetAuthorName: report.targetAuthorName,
				reason: report.reason,
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				status: "pending"
			});
			return docRef.id;
		} catch (err) {
			console.warn("Firebase createReport failed:", err);
			return `rep-${Date.now()}`;
		}
	},
	subscribeReports(callback, onError) {
		try {
			const q = query(collection(db, "reports"), limit(150));
			return onSnapshot(q, (snap) => {
				const list = [];
				snap.forEach((d) => {
					const data = d.data();
					list.push({
						id: d.id,
						type: data.type || data.targetType || "post",
						targetId: data.targetId || "",
						targetTitle: data.targetTitle || data.targetContent?.slice(0, 30) || "신고 대상",
						targetContent: data.targetContent || data.details || "",
						targetAuthorId: data.targetAuthorId || "",
						targetAuthorName: data.targetAuthorName || "사용자",
						reporterId: data.reporterId || "",
						reportedBy: data.reportedBy || data.reporterName || "익명회원",
						reason: data.reason || "사유 미기재",
						status: data.status || "pending",
						handlerName: data.handlerName || data.reviewedBy,
						handledAt: data.handledAt || (data.reviewedAt ? new Date(data.reviewedAt).toLocaleString("ko-KR") : void 0),
						actionTaken: data.actionTaken,
						createdAt: data.createdAt ? data.createdAt.length < 20 ? data.createdAt : new Date(data.createdAt).toLocaleString("ko-KR") : "방금 전"
					});
				});
				callback(list);
			}, (err) => {
				if (err.code === "cancelled") console.debug("[Firebase] Reports listener cancelled");
				else {
					console.warn("[firebaseRepository] subscribeReports onSnapshot error:", err);
					handleFirestoreError(err, OperationType.LIST, "reports");
					if (onError) onError(err);
				}
			});
		} catch (err) {
			console.warn("[firebaseRepository] subscribeReports exception:", err);
			handleFirestoreError(err, OperationType.LIST, "reports");
			if (onError) onError(err);
			return () => {};
		}
	},
	async resolveReport(reportId, status, actionTaken, reviewerName) {
		try {
			const repRef = doc(db, "reports", reportId);
			await updateDoc(repRef, {
				status,
				actionTaken: actionTaken || (status === "resolved" ? "운영 조치 완료" : "기각 처리"),
				reviewedAt: (/* @__PURE__ */ new Date()).toISOString(),
				reviewedBy: reviewerName || "운영관리자"
			});
		} catch (err) {
			console.warn("[firebaseRepository] resolveReport failed:", err);
		}
	},
	async getChatRooms() {
		try {
			const snap = await getDocs(query(collection(db, "chatRooms"), limit(50)));
			const rooms = [];
			snap.forEach((d) => {
				const data = d.data();
				rooms.push({
					id: d.id,
					name: data.name,
					desc: data.desc,
					icon: data.icon || "💬",
					count: data.count || 0,
					category: data.category,
					creatorId: data.creatorId,
					creatorName: data.creatorName,
					symbol: data.symbol,
					createdAt: data.createdAt
				});
			});
			return dedupeById(rooms);
		} catch (err) {
			console.warn("Firebase getChatRooms error:", err);
			return [];
		}
	},
	subscribeChatRooms(callback) {
		try {
			const q = query(collection(db, "chatRooms"), limit(50));
			return onSnapshot(q, (snap) => {
				const rooms = [];
				snap.forEach((d) => {
					const data = d.data();
					rooms.push({
						id: d.id,
						name: data.name,
						desc: data.desc,
						icon: data.icon || "💬",
						count: data.count || 0,
						category: data.category,
						creatorId: data.creatorId,
						creatorName: data.creatorName,
						symbol: data.symbol,
						createdAt: data.createdAt
					});
				});
				callback(dedupeById(rooms));
			}, (err) => {
				if (err.code === "cancelled") console.debug("[Firebase] Chat rooms listener cancelled:", err.message);
				else {
					console.error("subscribeChatRooms snapshot error:", err);
					handleFirestoreError(err, OperationType.LIST, "chatRooms");
				}
			});
		} catch (err) {
			handleFirestoreError(err, OperationType.LIST, "chatRooms");
			return () => {};
		}
	},
	async createChatRoom(room) {
		try {
			const docRef = doc(collection(db, "chatRooms"));
			await setDoc(docRef, {
				...room,
				id: docRef.id,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			});
			return docRef.id;
		} catch (err) {
			console.warn("Firebase createChatRoom error:", err);
			return `custom-${Date.now()}`;
		}
	},
	async deleteChatRoom(roomId, adminUid) {
		try {
			if (!await this.isAdmin(adminUid)) throw new Error("Unauthorized: Admin access required.");
			await deleteDoc(doc(db, "chatRooms", roomId));
		} catch (err) {
			console.warn("Firebase deleteChatRoom error:", err);
			throw err;
		}
	},
	subscribeChat(roomId, callback, messageLimit = 50, onError) {
		let active = true;
		try {
			const q = query(collection(db, "chatMessages"), where("roomId", "==", roomId), orderBy("serverCreatedAt", "desc"), limit(messageLimit));
			const unsubscribe = onSnapshot(q, (snap) => {
				if (!active) return;
				const list = [];
				snap.forEach((docSnap) => {
					const d = docSnap.data();
					if (d.isDeleted) return;
					const date = parseToDate(d.serverCreatedAt || d.createdAt);
					const sortTime = date ? date.getTime() : 0;
					list.push({
						id: docSnap.id,
						roomId: d.roomId || roomId,
						author: {
							id: d.authorId || "",
							name: d.authorName || "투자자",
							avatar: d.authorAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
							role: d.authorRole
						},
						message: d.content || "",
						imageUrl: d.imageUrl || "",
						tempId: d.tempId || void 0,
						timestamp: formatChatTime(date || d.createdAt),
						createdAt: date ? date.toISOString() : d.createdAt || "",
						sentiment: d.sentiment,
						likes: 0,
						_sortTime: sortTime,
						status: "sent"
					});
				});
				list.sort((a, b) => (a._sortTime || 0) - (b._sortTime || 0));
				callback(dedupeById(list));
			}, (err) => {
				if (!active) return;
				if (err.code === "cancelled") console.debug(`[Firebase] Chat listener cancelled for room ${roomId}`);
				else {
					console.error("Firestore onSnapshot error in subscribeChat:", err);
					handleFirestoreError(err, OperationType.LIST, "chatMessages");
					if (onError) onError(err);
				}
			});
			return () => {
				active = false;
				unsubscribe();
			};
		} catch (err) {
			console.warn("subscribeChat exception:", err);
			handleFirestoreError(err, OperationType.LIST, "chatMessages");
			if (onError) onError(err);
			return () => {
				active = false;
			};
		}
	},
	subscribeAllChat(callback, messageLimit = 100, onError) {
		try {
			const q = query(collection(db, "chatMessages"), limit(messageLimit));
			return onSnapshot(q, (snap) => {
				const list = [];
				snap.forEach((docSnap) => {
					const d = docSnap.data();
					if (d.isDeleted) return;
					let time = "--:--";
					let createdAtIso = "";
					let sortTime = 0;
					if (d.serverCreatedAt && typeof d.serverCreatedAt.toMillis === "function") {
						const dt = d.serverCreatedAt.toDate();
						time = formatChatTime(dt);
						createdAtIso = dt.toISOString();
						sortTime = d.serverCreatedAt.toMillis();
					} else if (d.createdAt) {
						const dt = parseToDate(d.createdAt);
						if (dt) {
							time = formatChatTime(dt);
							createdAtIso = dt.toISOString();
							sortTime = dt.getTime();
						} else if (typeof d.createdAt === "string") {
							createdAtIso = d.createdAt;
							time = formatChatTime(d.createdAt);
						}
					}
					if (!time || time === "--:--") time = typeof d.timestamp === "string" && d.timestamp ? formatChatTime(d.timestamp) : "--:--";
					list.push({
						id: docSnap.id,
						roomId: d.roomId || "all",
						author: {
							id: d.authorId || "",
							name: d.authorName || "투자자",
							avatar: d.authorAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
							role: d.authorRole
						},
						message: d.content || "",
						imageUrl: d.imageUrl || "",
						tempId: d.tempId || void 0,
						timestamp: time,
						createdAt: createdAtIso,
						sentiment: d.sentiment,
						likes: 0,
						_sortTime: sortTime,
						status: "sent"
					});
				});
				list.sort((a, b) => (b._sortTime || 0) - (a._sortTime || 0));
				callback(dedupeById(list));
			}, (err) => {
				if (err.code === "cancelled") console.debug("[Firebase] AllChat listener cancelled");
				else {
					console.warn("Firestore subscribeAllChat error:", err);
					handleFirestoreError(err, OperationType.LIST, "chatMessages");
					if (onError) onError(err);
				}
			});
		} catch (err) {
			console.warn("subscribeAllChat exception:", err);
			handleFirestoreError(err, OperationType.LIST, "chatMessages");
			if (onError) onError(err);
			return () => {};
		}
	},
	async sendChatMessage(msg, messageId, tempId) {
		const docRef = doc(db, "chatMessages", messageId);
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		await setDoc(docRef, {
			id: messageId,
			tempId: tempId || null,
			roomId: msg.roomId,
			authorId: msg.author.id,
			authorName: msg.author.name,
			authorAvatar: msg.author.avatar,
			authorRole: msg.author.role || "회원",
			content: msg.message,
			imageUrl: msg.imageUrl || "",
			sentiment: msg.sentiment || "neutral",
			createdAt: nowIso,
			serverCreatedAt: serverTimestamp(),
			status: "active",
			isDeleted: false
		});
		return messageId;
	},
	async deleteChatMessage(messageId) {
		try {
			await updateDoc(doc(db, "chatMessages", messageId), {
				isDeleted: true,
				deletedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
		} catch (err) {
			console.warn("Firebase soft-delete chat message failed:", err);
		}
	},
	async restrictChatUser(uid, reason, adminUid) {
		if (uid === "lr018vf8CcW5fAv707vsl77qJy53") throw new Error("최고 운영자 계정은 채팅을 제한할 수 없습니다.");
		const docRef = doc(db, "chatRestrictions", uid);
		const userRef = doc(db, "users", uid);
		await Promise.all([setDoc(docRef, {
			uid,
			reason,
			restrictedBy: adminUid,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}), updateDoc(userRef, {
			chatRestricted: true,
			chatMutedUntil: reason || "24시간 발언 제한",
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		}).catch(() => {})]);
	},
	async unrestrictChatUser(uid) {
		const userRef = doc(db, "users", uid);
		await Promise.allSettled([
			deleteDoc(doc(db, "chatRestrictions", uid)),
			deleteDoc(doc(db, "chat_restrictions", uid)),
			updateDoc(userRef, {
				chatRestricted: false,
				chatMutedUntil: null,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			})
		]);
	},
	async isUserChatRestricted(uid) {
		if (uid === "lr018vf8CcW5fAv707vsl77qJy53") return false;
		try {
			return (await getDoc(doc(db, "chatRestrictions", uid))).exists();
		} catch (err) {
			console.warn("Firebase isUserChatRestricted check failed:", err);
			return false;
		}
	},
	subscribeChatRestrictions(callback) {
		try {
			const col = query(collection(db, "chatRestrictions"), limit(200));
			const colLegacy = query(collection(db, "chat_restrictions"), limit(100));
			let legacyUidsCache = null;
			let latestPrimaryUids = [];
			getDocs(colLegacy).then((snapLegacy) => {
				const legacy = [];
				snapLegacy.forEach((d) => {
					if (d.id !== "lr018vf8CcW5fAv707vsl77qJy53") legacy.push(d.id);
				});
				legacyUidsCache = legacy;
				if (legacy.length > 0) callback(Array.from(/* @__PURE__ */ new Set([...latestPrimaryUids, ...legacy])));
			}).catch(() => {
				legacyUidsCache = [];
			});
			return onSnapshot(col, (snap) => {
				const uids = [];
				snap.forEach((d) => {
					if (d.id !== "lr018vf8CcW5fAv707vsl77qJy53") uids.push(d.id);
				});
				latestPrimaryUids = uids;
				callback(legacyUidsCache ? Array.from(/* @__PURE__ */ new Set([...uids, ...legacyUidsCache])) : uids);
			}, (err) => {
				if (err.code === "cancelled") console.debug("[Firebase] Restrictions listener cancelled");
				else {
					console.warn("subscribeChatRestrictions error:", err);
					handleFirestoreError(err, OperationType.LIST, "chatRestrictions");
				}
			});
		} catch (err) {
			console.warn("subscribeChatRestrictions exception:", err);
			handleFirestoreError(err, OperationType.LIST, "chatRestrictions");
			return () => {};
		}
	},
	subscribeUserPriceAlerts(uid, onUpdate) {
		if (!uid) return () => {};
		try {
			const q = query(collection(db, "alerts"), where("uid", "==", uid), limit(200));
			const unsubscribe = onSnapshot(q, (snap) => {
				const list = [];
				snap.forEach((docSnap) => {
					const d = docSnap.data();
					list.push({
						id: docSnap.id,
						uid: d.uid,
						symbol: d.symbol,
						symbolName: d.symbolName || d.symbol,
						targetPrice: Number(d.targetPrice ?? d.value ?? 0),
						condition: d.condition || "above",
						createdAt: d.createdAt ? new Date(d.createdAt).toLocaleDateString("ko-KR") : (/* @__PURE__ */ new Date()).toLocaleDateString("ko-KR"),
						isTriggered: Boolean(d.isTriggered),
						triggeredAt: d.triggeredAt,
						triggeredPrice: d.triggeredPrice ? Number(d.triggeredPrice) : void 0,
						enabled: d.enabled !== false,
						note: d.note || ""
					});
				});
				list.sort((a, b) => {
					if (a.isTriggered !== b.isTriggered) return a.isTriggered ? 1 : -1;
					return (b.createdAt || "").localeCompare(a.createdAt || "");
				});
				onUpdate(dedupeById(list));
			}, (err) => {
				if (err.code === "cancelled") console.debug("[Firebase] Price alerts listener cancelled (likely idle/reconnecting):", err.message);
				else {
					console.error("[Firebase] Price alerts listener error:", err);
					handleFirestoreError(err, OperationType.LIST, "alerts");
				}
			});
			return () => {
				unsubscribe();
			};
		} catch (err) {
			console.warn("Firebase subscribeUserPriceAlerts init error:", err);
			handleFirestoreError(err, OperationType.LIST, "alerts");
			return () => {};
		}
	},
	async getUserAlerts(uid) {
		try {
			const q = query(collection(db, "alerts"), where("uid", "==", uid), limit(200));
			const snap = await getDocs(q);
			const list = [];
			snap.forEach((docSnap) => {
				const d = docSnap.data();
				list.push({
					id: docSnap.id,
					uid: d.uid,
					symbol: d.symbol,
					symbolName: d.symbolName || d.symbol,
					targetPrice: Number(d.targetPrice ?? d.value ?? 0),
					condition: d.condition,
					createdAt: d.createdAt ? new Date(d.createdAt).toLocaleDateString("ko-KR") : (/* @__PURE__ */ new Date()).toLocaleDateString("ko-KR"),
					isTriggered: Boolean(d.isTriggered),
					triggeredAt: d.triggeredAt,
					triggeredPrice: d.triggeredPrice ? Number(d.triggeredPrice) : void 0,
					enabled: d.enabled !== false,
					note: d.note || ""
				});
			});
			return dedupeById(list);
		} catch (err) {
			console.warn("Firebase get alerts failed:", err);
			return [];
		}
	},
	async createAlert(uid, alert) {
		try {
			const docRef = doc(collection(db, "alerts"));
			const targetVal = Number(alert.targetPrice);
			await setDoc(docRef, {
				id: docRef.id,
				uid,
				symbol: alert.symbol,
				symbolName: alert.symbolName,
				type: "price_target",
				condition: alert.condition,
				targetPrice: targetVal,
				value: targetVal,
				enabled: true,
				isTriggered: false,
				note: alert.note || "",
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			});
			return docRef.id;
		} catch (err) {
			console.warn("Firebase create alert failed:", err);
			throw err;
		}
	},
	async markAlertTriggered(alertId, triggeredPrice) {
		try {
			await updateDoc(doc(db, "alerts", alertId), {
				isTriggered: true,
				triggeredAt: (/* @__PURE__ */ new Date()).toISOString(),
				triggeredPrice: Number(triggeredPrice)
			});
		} catch (err) {
			console.warn("Firebase markAlertTriggered failed:", err);
		}
	},
	async toggleAlertEnabled(alertId, enabled) {
		try {
			await updateDoc(doc(db, "alerts", alertId), { enabled });
		} catch (err) {
			console.warn("Firebase toggleAlertEnabled failed:", err);
		}
	},
	async deleteAlert(alertId) {
		try {
			await deleteDoc(doc(db, "alerts", alertId));
		} catch (err) {
			console.warn("Firebase delete alert failed:", err);
		}
	},
	async clearAllReports() {
		try {
			for (let i = 0; i < 1e3; i++) {
				const snap = await getDocs(query(collection(db, "reports"), limit(400)));
				if (snap.empty) break;
				const batch = writeBatch(db);
				snap.docs.forEach((d) => batch.delete(d.ref));
				await batch.commit();
				if (snap.size < 400) break;
			}
		} catch (err) {
			console.warn("[firebaseRepository] clearAllReports failed:", err);
		}
	},
	async clearAllSanctions() {
		try {
			for (let i = 0; i < 1e3; i++) {
				const snap = await getDocs(query(collection(db, "chatRestrictions"), limit(400)));
				if (snap.empty) break;
				const batch = writeBatch(db);
				snap.docs.forEach((d) => batch.delete(d.ref));
				await batch.commit();
				if (snap.size < 400) break;
			}
		} catch (err) {
			console.warn("[firebaseRepository] clearAllSanctions failed:", err);
		}
	},
	async clearAllAdminLogs() {
		try {
			for (let i = 0; i < 1e3; i++) {
				const snap = await getDocs(query(collection(db, "adminAuditLogs"), limit(400)));
				if (snap.empty) break;
				const batch = writeBatch(db);
				snap.docs.forEach((d) => batch.delete(d.ref));
				await batch.commit();
				if (snap.size < 400) break;
			}
		} catch (err) {
			console.warn("[firebaseRepository] clearAllAdminLogs failed:", err);
		}
	},
	async pinMessage(messageId, roomId, pinned) {
		try {
			const msgRef = doc(db, "chatMessages", messageId);
			await updateDoc(msgRef, {
				isPinned: pinned,
				pinnedAt: pinned ? (/* @__PURE__ */ new Date()).toISOString() : null
			});
		} catch (err) {
			console.warn("Firebase pinMessage failed:", err);
		}
	},
	async logAdminAction(adminUid, adminName, action, details) {
		try {
			await setDoc(doc(collection(db, "adminLogs")), {
				adminUid,
				adminName,
				action,
				details,
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			});
		} catch (err) {
			console.warn("Firebase logAdminAction failed:", err);
		}
	},
	async isAdmin(uid) {
		try {
			const userSnap = await getDoc(doc(db, "users", uid));
			return userSnap.exists() && (userSnap.data().role === "admin" || userSnap.data().role === "superadmin");
		} catch {
			return false;
		}
	},
	async clearRoomChatHistory(roomId, adminUid) {
		try {
			if (!await this.isAdmin(adminUid)) throw new Error("Unauthorized: Admin access required.");
			let lastDoc = null;
			for (let i = 0; i < 1e3; i++) {
				const q = lastDoc ? query(collection(db, "chatMessages"), where("roomId", "==", roomId), startAfter(lastDoc), limit(400)) : query(collection(db, "chatMessages"), where("roomId", "==", roomId), limit(400));
				const snap = await getDocs(q);
				if (snap.empty) break;
				const batch = writeBatch(db);
				const nowIso = (/* @__PURE__ */ new Date()).toISOString();
				snap.docs.forEach((d) => {
					batch.update(d.ref, {
						isDeleted: true,
						deletedAt: nowIso
					});
				});
				await batch.commit();
				if (snap.size < 400) break;
				lastDoc = snap.docs[snap.docs.length - 1];
			}
		} catch (err) {
			console.warn("[firebaseRepository] clearRoomChatHistory failed:", err);
			throw err;
		}
	},
	async incrementAdStats(adId, type) {
		try {
			const docRef = doc(db, "adStats", adId);
			await setDoc(docRef, { [type]: increment(1) }, { merge: true });
		} catch (err) {
			console.warn("Firebase incrementAdStats failed:", err);
		}
	},
	async awardBadge(uid, badgeId) {
		try {
			const userRef = doc(db, "users", uid);
			const snap = await getDoc(userRef);
			if (snap.exists()) {
				const badges = snap.data().badges || [];
				if (!badges.includes(badgeId)) await updateDoc(userRef, {
					badges: [...badges, badgeId],
					updatedAt: (/* @__PURE__ */ new Date()).toISOString()
				});
			}
		} catch (err) {
			console.warn("[firebaseRepository] awardBadge failed:", err);
		}
	},
	async getUserStockPurchases(uid) {
		const path = "userStockPurchases";
		try {
			const q = query(collection(db, path), where("uid", "==", uid), limit(200));
			const snap = await getDocs(q);
			const purchases = {};
			snap.forEach((docSnap) => {
				const d = docSnap.data();
				purchases[d.symbol] = d.buyEntries || [];
			});
			return purchases;
		} catch (err) {
			console.warn("Firebase get user stock purchases failed:", err);
			return {};
		}
	},
	async saveUserStockPurchases(uid, symbol, entries) {
		const docId = `${uid}_${symbol}`;
		try {
			await setDoc(doc(db, "userStockPurchases", docId), {
				uid,
				symbol,
				buyEntries: entries,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			}, { merge: true });
		} catch (err) {
			console.warn("Firebase save user stock purchases error:", err);
		}
	},
	async markInitializedWatchlist(uid) {
		try {
			await updateDoc(doc(db, "users", uid), { hasInitializedWatchlist: true });
		} catch (err) {
			console.warn("Firebase markInitializedWatchlist error:", err);
		}
	},
	async hasInitializedWatchlist(uid) {
		try {
			const snap = await getDoc(doc(db, "users", uid));
			return snap.exists() && Boolean(snap.data().hasInitializedWatchlist);
		} catch (err) {
			console.warn("Firebase hasInitializedWatchlist error:", err);
			return false;
		}
	},
	async saveGameHistory(uid, gameType, inputData, resultData) {
		try {
			const col = collection(db, "gameHistory");
			const docRef = doc(col);
			await setDoc(docRef, {
				id: docRef.id,
				uid,
				gameType,
				inputData,
				resultData,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			});
		} catch (err) {
			console.warn("Firebase saveGameHistory failed:", err);
		}
	},
	async getUserGameHistory(uid, gameType) {
		try {
			let q = query(collection(db, "gameHistory"), where("uid", "==", uid), orderBy("createdAt", "desc"), limit(100));
			if (gameType) q = query(q, where("gameType", "==", gameType), limit(100));
			const snap = await getDocs(q);
			const list = [];
			snap.forEach((d) => list.push({
				...d.data(),
				id: d.id
			}));
			return list;
		} catch (err) {
			console.warn("Firebase getUserGameHistory failed:", err);
			return [];
		}
	},
	async updateOfficeGameState(uid, stats, day, status) {
		try {
			await setDoc(doc(db, "officeGameState", uid), {
				uid,
				stats,
				day,
				status,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			}, { merge: true });
		} catch (err) {
			console.warn("Firebase updateOfficeGameState failed:", err);
		}
	},
	async getOfficeGameState(uid) {
		try {
			const snap = await getDoc(doc(db, "officeGameState", uid));
			if (!snap.exists()) return null;
			return snap.data();
		} catch (err) {
			console.warn("Firebase getOfficeGameState failed:", err);
			return null;
		}
	},
	async saveActiveOfficeGame(uid, gameState) {
		try {
			await setDoc(doc(db, "officeGameState", uid), {
				uid,
				...gameState,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			}, { merge: false });
		} catch (err) {
			console.warn("Firebase saveActiveOfficeGame failed:", err);
		}
	},
	async getActiveOfficeGame(uid) {
		try {
			const snap = await getDoc(doc(db, "officeGameState", uid));
			if (!snap.exists()) return null;
			return snap.data();
		} catch (err) {
			console.warn("Firebase getActiveOfficeGame failed:", err);
			return null;
		}
	},
	async clearActiveOfficeGame(uid) {
		try {
			await deleteDoc(doc(db, "officeGameState", uid));
		} catch (err) {
			console.warn("Firebase clearActiveOfficeGame failed:", err);
		}
	},
	async saveOfficeGameRecord(uid, recordData) {
		try {
			const col = collection(db, "gameHistory");
			const docRef = doc(col);
			await setDoc(docRef, {
				id: docRef.id,
				uid,
				gameType: "office",
				resultData: recordData,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			});
		} catch (err) {
			console.warn("Firebase saveOfficeGameRecord failed:", err);
		}
	},
	async getOfficeGameRecords(uid) {
		try {
			const q = query(collection(db, "gameHistory"), where("uid", "==", uid), where("gameType", "==", "office"), orderBy("createdAt", "desc"), limit(50));
			const snap = await getDocs(q);
			const list = [];
			snap.forEach((d) => list.push({
				...d.data(),
				id: d.id
			}));
			return list;
		} catch (err) {
			console.warn("Firebase getOfficeGameRecords failed:", err);
			return [];
		}
	},
	async updateUserStats(uid, rating, win, draw) {
		const userStatsRef = doc(db, "userStats", uid);
		const snap = await getDoc(userStatsRef);
		if (!snap.exists()) await setDoc(userStatsRef, {
			uid,
			rating,
			wins: win ? 1 : 0,
			losses: !win && !draw ? 1 : 0,
			draws: draw ? 1 : 0,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		else {
			const data = snap.data();
			await updateDoc(userStatsRef, {
				rating,
				wins: (data.wins || 0) + (win ? 1 : 0),
				losses: (data.losses || 0) + (!win && !draw ? 1 : 0),
				draws: (data.draws || 0) + (draw ? 1 : 0),
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
		}
	},
	async createGomokuMatch(blackPlayerId) {
		const docRef = doc(collection(db, "gomokuMatches"));
		await setDoc(docRef, {
			id: docRef.id,
			blackPlayerId,
			whitePlayerId: "",
			turn: "black",
			boardState: Array(15).fill(null).map(() => Array(15).fill(null)),
			status: "waiting",
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		return docRef.id;
	},
	async joinGomokuMatch(matchId, whitePlayerId) {
		await updateDoc(doc(db, "gomokuMatches", matchId), {
			whitePlayerId,
			status: "playing",
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
	},
	async updateMatchMove(matchId, boardState, turn, winner) {
		const updateData = {
			boardState,
			turn,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (winner) {
			updateData.status = "finished";
			updateData.winner = winner;
		}
		await updateDoc(doc(db, "gomokuMatches", matchId), updateData);
	},
	subscribeMatch(matchId, callback) {
		return onSnapshot(doc(db, "gomokuMatches", matchId), (snap) => {
			if (snap.exists()) callback(snap.data());
		});
	},
	async createJanggiMatch(choPlayerId) {
		const docRef = doc(collection(db, "janggiMatches"));
		await setDoc(docRef, {
			id: docRef.id,
			choPlayerId,
			hanPlayerId: "",
			turn: "cho",
			boardState: {},
			status: "waiting",
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		return docRef.id;
	},
	async joinJanggiMatch(matchId, hanPlayerId) {
		await updateDoc(doc(db, "janggiMatches", matchId), {
			hanPlayerId,
			status: "playing",
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
	},
	async updateJanggiMatchMove(matchId, boardState, turn, winner) {
		const updateData = {
			boardState,
			turn,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (winner) {
			updateData.status = "finished";
			updateData.winner = winner;
		}
		await updateDoc(doc(db, "janggiMatches", matchId), updateData);
	},
	subscribeJanggiMatch(matchId, callback) {
		return onSnapshot(doc(db, "janggiMatches", matchId), (snap) => {
			if (snap.exists()) callback(snap.data());
		});
	}
};
//#endregion
//#region src/services/mockData.ts
var INITIAL_EXCHANGE_RATE = {
	currency: "USD/KRW",
	baseCurrency: "USD",
	quoteCurrency: "KRW",
	pair: "USD/KRW",
	name: "원/달러 환율",
	rate: 0,
	change: 0,
	changePercent: 0,
	high: 0,
	low: 0,
	sparkline: [],
	status: "unavailable",
	isStale: true,
	lastUpdated: "수신 대기",
	provider: "수신 중"
};
var INITIAL_INDICES = [{
	symbol: "KOSPI",
	name: "코스피",
	value: 2684.52,
	change: 18.42,
	changePercent: .69,
	high: 2692.15,
	low: 2671.3,
	volume: 482910,
	tradingValue: 10.42,
	advanceCount: 542,
	declineCount: 321,
	sparkline: [
		2668,
		2671,
		2675,
		2673,
		2679,
		2682,
		2680,
		2685,
		2684.52
	]
}, {
	symbol: "KOSDAQ",
	name: "코스닥",
	value: 872.1,
	change: -3.25,
	changePercent: -.37,
	high: 879.4,
	low: 869.8,
	volume: 914200,
	tradingValue: 7.85,
	advanceCount: 680,
	declineCount: 840,
	sparkline: [
		876,
		878,
		875,
		873,
		871,
		872,
		870,
		869,
		872.1
	]
}];
function generateCandles(basePrice, volatility = .02, count = 30) {
	const candles = [];
	let price = basePrice * (1 - volatility * (count / 2));
	const now = /* @__PURE__ */ new Date();
	for (let i = count; i >= 0; i--) {
		const d = new Date(now);
		d.setDate(d.getDate() - i);
		const dateStr = d.toISOString().split("T")[0];
		const change = (Math.random() - .48) * volatility * price;
		const open = Math.round(price);
		const close = Math.round(price + change);
		const high = Math.round(Math.max(open, close) + Math.random() * volatility * price * .8);
		const low = Math.round(Math.min(open, close) - Math.random() * volatility * price * .8);
		const volume = Math.round(5e5 + Math.random() * 25e5);
		candles.push({
			time: dateStr,
			open,
			high,
			low,
			close,
			volume
		});
		price = close;
	}
	return candles;
}
var INITIAL_STOCKS = [
	{
		symbol: "005930",
		name: "삼성전자",
		market: "KOSPI",
		sector: "전기전자 / 반도체",
		price: 78500,
		change: 1800,
		changePercent: 2.35,
		volume: 18452090,
		volumeRatio: 142.5,
		tradingValue: 14482,
		high52w: 88800,
		low52w: 55300,
		marketCap: 4686280,
		per: 14.2,
		pbr: 1.25,
		eps: 5528,
		dividendYield: 2.15,
		openPrice: 77200,
		highPrice: 79100,
		lowPrice: 77e3,
		prevClose: 76700,
		foreignNetBuy: 2840,
		instNetBuy: 1490,
		candles: generateCandles(78500, .015),
		sparkline: [
			76500,
			76800,
			77200,
			77500,
			78100,
			77900,
			78500
		]
	},
	{
		symbol: "000660",
		name: "SK하이닉스",
		market: "KOSPI",
		sector: "전기전자 / 반도체",
		price: 194500,
		change: 8500,
		changePercent: 4.57,
		volume: 6420110,
		volumeRatio: 215.3,
		tradingValue: 12480,
		high52w: 248500,
		low52w: 112e3,
		marketCap: 1416e3,
		per: 8.4,
		pbr: 1.95,
		eps: 23150,
		dividendYield: .85,
		openPrice: 188e3,
		highPrice: 196e3,
		lowPrice: 187500,
		prevClose: 186e3,
		foreignNetBuy: 3820,
		instNetBuy: 1910,
		candles: generateCandles(194500, .025),
		sparkline: [
			186e3,
			187500,
			19e4,
			192500,
			191e3,
			193500,
			194500
		]
	},
	{
		symbol: "196170",
		name: "알테오젠",
		market: "KOSPI",
		sector: "바이오 / 제약",
		price: 368e3,
		change: 24e3,
		changePercent: 6.98,
		volume: 1824e3,
		volumeRatio: 380.2,
		tradingValue: 6710,
		high52w: 395e3,
		low52w: 72e3,
		marketCap: 195800,
		per: 45.8,
		pbr: 18.2,
		eps: 8035,
		dividendYield: 0,
		openPrice: 345e3,
		highPrice: 372e3,
		lowPrice: 344e3,
		prevClose: 344e3,
		foreignNetBuy: 1250,
		instNetBuy: 840,
		candles: generateCandles(368e3, .04),
		sparkline: [
			344e3,
			349e3,
			355e3,
			362e3,
			36e4,
			365e3,
			368e3
		]
	},
	{
		symbol: "042700",
		name: "한미반도체",
		market: "KOSPI",
		sector: "반도체 장비 / TC본더",
		price: 114500,
		change: 9500,
		changePercent: 9.05,
		volume: 384e4,
		volumeRatio: 320.4,
		tradingValue: 4390,
		high52w: 187800,
		low52w: 48900,
		marketCap: 111e3,
		per: 32.1,
		pbr: 7.8,
		eps: 3567,
		dividendYield: .45,
		openPrice: 106e3,
		highPrice: 116500,
		lowPrice: 105500,
		prevClose: 105e3,
		foreignNetBuy: 950,
		instNetBuy: 620,
		candles: generateCandles(114500, .035),
		sparkline: [
			105e3,
			107e3,
			11e4,
			112e3,
			111500,
			113e3,
			114500
		]
	},
	{
		symbol: "064350",
		name: "현대로템",
		market: "KOSPI",
		sector: "방위산업 / 철도",
		price: 58400,
		change: 4100,
		changePercent: 7.55,
		volume: 421e4,
		volumeRatio: 280.1,
		tradingValue: 2450,
		high52w: 62300,
		low52w: 24300,
		marketCap: 63740,
		per: 18.5,
		pbr: 2.9,
		eps: 3156,
		dividendYield: .6,
		openPrice: 54600,
		highPrice: 59100,
		lowPrice: 54200,
		prevClose: 54300,
		foreignNetBuy: 540,
		instNetBuy: 780,
		candles: generateCandles(58400, .03),
		sparkline: [
			54300,
			55200,
			56400,
			57100,
			56800,
			58e3,
			58400
		]
	},
	{
		symbol: "034020",
		name: "두산에너빌리티",
		market: "KOSPI",
		sector: "원자력 / 플랜트",
		price: 21850,
		change: 1450,
		changePercent: 7.11,
		volume: 1682e4,
		volumeRatio: 295.6,
		tradingValue: 3670,
		high52w: 24100,
		low52w: 13400,
		marketCap: 139900,
		per: 26.4,
		pbr: 1.45,
		eps: 827,
		dividendYield: 0,
		openPrice: 20500,
		highPrice: 22300,
		lowPrice: 20400,
		prevClose: 20400,
		foreignNetBuy: 1120,
		instNetBuy: 640,
		candles: generateCandles(21850, .03),
		sparkline: [
			20400,
			20800,
			21200,
			21500,
			21300,
			21700,
			21850
		]
	},
	{
		symbol: "373220",
		name: "LG에너지솔루션",
		market: "KOSPI",
		sector: "2차전지 / 배터리",
		price: 382500,
		change: -12500,
		changePercent: -3.16,
		volume: 412e3,
		volumeRatio: 92.4,
		tradingValue: 1575,
		high52w: 52e4,
		low52w: 311e3,
		marketCap: 895e3,
		per: 65.4,
		pbr: 4.12,
		eps: 5848,
		dividendYield: 0,
		openPrice: 393e3,
		highPrice: 394500,
		lowPrice: 381e3,
		prevClose: 395e3,
		foreignNetBuy: -640,
		instNetBuy: -420,
		candles: generateCandles(382500, .025),
		sparkline: [
			395e3,
			393e3,
			39e4,
			386e3,
			388e3,
			384e3,
			382500
		]
	},
	{
		symbol: "247540",
		name: "에코프로비엠",
		market: "KOSDAQ",
		sector: "2차전지 양극재",
		price: 154200,
		change: -8400,
		changePercent: -5.17,
		volume: 125e4,
		volumeRatio: 185,
		tradingValue: 1920,
		high52w: 32e4,
		low52w: 148e3,
		marketCap: 150800,
		per: 85.2,
		pbr: 3.8,
		eps: 1810,
		dividendYield: .28,
		openPrice: 161e3,
		highPrice: 161500,
		lowPrice: 153e3,
		prevClose: 162600,
		foreignNetBuy: -820,
		instNetBuy: -560,
		candles: generateCandles(154200, .04),
		sparkline: [
			162600,
			16e4,
			158e3,
			156500,
			157e3,
			155e3,
			154200
		]
	},
	{
		symbol: "086520",
		name: "에코프로",
		market: "KOSDAQ",
		sector: "지주사 / 2차전지",
		price: 76800,
		change: -4300,
		changePercent: -5.3,
		volume: 241e4,
		volumeRatio: 160.2,
		tradingValue: 1850,
		high52w: 135e3,
		low52w: 74200,
		marketCap: 102200,
		per: 42.1,
		pbr: 2.9,
		eps: 1824,
		dividendYield: .15,
		openPrice: 80500,
		highPrice: 80800,
		lowPrice: 76500,
		prevClose: 81100,
		foreignNetBuy: -680,
		instNetBuy: -390,
		candles: generateCandles(76800, .038),
		sparkline: [
			81100,
			80200,
			79400,
			78200,
			78600,
			77300,
			76800
		]
	},
	{
		symbol: "005380",
		name: "현대차",
		market: "KOSPI",
		sector: "자동차 / 모빌리티",
		price: 248500,
		change: -2500,
		changePercent: -1,
		volume: 89e4,
		volumeRatio: 88,
		tradingValue: 2210,
		high52w: 298e3,
		low52w: 172e3,
		marketCap: 521e3,
		per: 4.8,
		pbr: .62,
		eps: 51770,
		dividendYield: 4.82,
		openPrice: 251e3,
		highPrice: 252500,
		lowPrice: 247e3,
		prevClose: 251e3,
		foreignNetBuy: 140,
		instNetBuy: -280,
		candles: generateCandles(248500, .015),
		sparkline: [
			251e3,
			250500,
			249e3,
			248e3,
			249500,
			248e3,
			248500
		]
	},
	{
		symbol: "000270",
		name: "기아",
		market: "KOSPI",
		sector: "자동차 / 모빌리티",
		price: 102400,
		change: -1100,
		changePercent: -1.06,
		volume: 1204e3,
		volumeRatio: 90.5,
		tradingValue: 1230,
		high52w: 135e3,
		low52w: 78e3,
		marketCap: 408e3,
		per: 4.2,
		pbr: .78,
		eps: 24380,
		dividendYield: 5.46,
		openPrice: 103500,
		highPrice: 104200,
		lowPrice: 101800,
		prevClose: 103500,
		foreignNetBuy: 80,
		instNetBuy: -150,
		candles: generateCandles(102400, .015),
		sparkline: [
			103500,
			103e3,
			102500,
			102e3,
			102800,
			102200,
			102400
		]
	},
	{
		symbol: "035420",
		name: "NAVER",
		market: "KOSPI",
		sector: "IT인터넷 / 플랫폼",
		price: 172500,
		change: 3200,
		changePercent: 1.89,
		volume: 782e3,
		volumeRatio: 125,
		tradingValue: 1350,
		high52w: 226e3,
		low52w: 151100,
		marketCap: 279e3,
		per: 18.2,
		pbr: 1.05,
		eps: 9478,
		dividendYield: .65,
		openPrice: 169500,
		highPrice: 173500,
		lowPrice: 169e3,
		prevClose: 169300,
		foreignNetBuy: 320,
		instNetBuy: 210,
		candles: generateCandles(172500, .02),
		sparkline: [
			169300,
			17e4,
			171200,
			172e3,
			171800,
			172200,
			172500
		]
	},
	{
		symbol: "035720",
		name: "카카오",
		market: "KOSPI",
		sector: "IT인터넷 / 플랫폼",
		price: 38450,
		change: 450,
		changePercent: 1.18,
		volume: 145e4,
		volumeRatio: 108,
		tradingValue: 557,
		high52w: 61900,
		low52w: 33500,
		marketCap: 171e3,
		per: 31.4,
		pbr: 1.12,
		eps: 1224,
		dividendYield: .16,
		openPrice: 38e3,
		highPrice: 38800,
		lowPrice: 37900,
		prevClose: 38e3,
		foreignNetBuy: 110,
		instNetBuy: 90,
		candles: generateCandles(38450, .02),
		sparkline: [
			38e3,
			38100,
			38300,
			38600,
			38400,
			38350,
			38450
		]
	},
	{
		symbol: "068270",
		name: "셀트리온",
		market: "KOSPI",
		sector: "바이오 / 바이오시밀러",
		price: 198200,
		change: 4200,
		changePercent: 2.16,
		volume: 98e4,
		volumeRatio: 130.4,
		tradingValue: 1940,
		high52w: 241e3,
		low52w: 136e3,
		marketCap: 432e3,
		per: 34.2,
		pbr: 2.35,
		eps: 5795,
		dividendYield: .25,
		openPrice: 194500,
		highPrice: 199500,
		lowPrice: 194e3,
		prevClose: 194e3,
		foreignNetBuy: 450,
		instNetBuy: 310,
		candles: generateCandles(198200, .02),
		sparkline: [
			194e3,
			195200,
			196400,
			197500,
			197e3,
			198e3,
			198200
		]
	},
	{
		symbol: "012450",
		name: "한화에어로스페이스",
		market: "KOSPI",
		sector: "방위산업 / 항공우주",
		price: 342e3,
		change: 22e3,
		changePercent: 6.88,
		volume: 812e3,
		volumeRatio: 260.5,
		tradingValue: 2780,
		high52w: 368e3,
		low52w: 97800,
		marketCap: 173e3,
		per: 24.5,
		pbr: 3.4,
		eps: 13959,
		dividendYield: .35,
		openPrice: 323e3,
		highPrice: 345e3,
		lowPrice: 322e3,
		prevClose: 32e4,
		foreignNetBuy: 890,
		instNetBuy: 480,
		candles: generateCandles(342e3, .035),
		sparkline: [
			32e4,
			325e3,
			331e3,
			338e3,
			336e3,
			34e4,
			342e3
		]
	},
	{
		symbol: "000250",
		name: "삼천당제약",
		market: "KOSDAQ",
		sector: "바이오 / 경구용인슐린",
		price: 142e3,
		change: 18500,
		changePercent: 14.98,
		volume: 341e4,
		volumeRatio: 520,
		tradingValue: 4840,
		high52w: 169e3,
		low52w: 52400,
		marketCap: 33400,
		per: 98.4,
		pbr: 14.5,
		eps: 1443,
		dividendYield: 0,
		openPrice: 125e3,
		highPrice: 146e3,
		lowPrice: 124500,
		prevClose: 123500,
		foreignNetBuy: 610,
		instNetBuy: 420,
		candles: generateCandles(142e3, .05),
		sparkline: [
			123500,
			127e3,
			132e3,
			138e3,
			137e3,
			14e4,
			142e3
		]
	},
	{
		symbol: "207940",
		name: "삼성바이오로직스",
		market: "KOSPI",
		sector: "바이오 / CDMO",
		price: 1045e3,
		change: 15e3,
		changePercent: 1.46,
		volume: 68400,
		volumeRatio: 110.2,
		tradingValue: 715,
		high52w: 111e4,
		low52w: 673e3,
		marketCap: 744e3,
		per: 68.2,
		pbr: 6.4,
		eps: 15322,
		dividendYield: 0,
		openPrice: 1032e3,
		highPrice: 1052e3,
		lowPrice: 103e4,
		prevClose: 103e4,
		foreignNetBuy: 240,
		instNetBuy: 180,
		candles: generateCandles(1045e3, .018),
		sparkline: [
			103e4,
			1035e3,
			104e4,
			1048e3,
			1042e3,
			1044e3,
			1045e3
		]
	},
	{
		symbol: "417860",
		name: "삼현",
		market: "KOSDAQ",
		sector: "로봇 / 스마트액추에이터",
		price: 43200,
		change: -3900,
		changePercent: -8.28,
		volume: 182e4,
		volumeRatio: 310,
		tradingValue: 786,
		high52w: 78e3,
		low52w: 39e3,
		marketCap: 4560,
		per: 35,
		pbr: 3.1,
		eps: 1234,
		dividendYield: 0,
		openPrice: 47e3,
		highPrice: 47500,
		lowPrice: 42800,
		prevClose: 47100,
		foreignNetBuy: -180,
		instNetBuy: -220,
		candles: generateCandles(43200, .045),
		sparkline: [
			47100,
			46e3,
			45200,
			44e3,
			44500,
			43600,
			43200
		]
	},
	{
		symbol: "005490",
		name: "POSCO홀딩스",
		market: "KOSPI",
		sector: "철강 / 2차전지소재",
		price: 368e3,
		change: 6500,
		changePercent: 1.8,
		volume: 54e4,
		volumeRatio: 112.5,
		tradingValue: 1980,
		high52w: 538e3,
		low52w: 32e4,
		marketCap: 311e3,
		per: 16.4,
		pbr: .58,
		eps: 22450,
		dividendYield: 2.72,
		openPrice: 362e3,
		highPrice: 371e3,
		lowPrice: 361500,
		prevClose: 361500,
		foreignNetBuy: 410,
		instNetBuy: 220,
		candles: generateCandles(368e3, .02),
		sparkline: [
			361500,
			363e3,
			365e3,
			366e3,
			364e3,
			367e3,
			368e3
		]
	},
	{
		symbol: "105560",
		name: "KB금융",
		market: "KOSPI",
		sector: "금융 / 지주사",
		price: 88500,
		change: 2200,
		changePercent: 2.55,
		volume: 142e4,
		volumeRatio: 135,
		tradingValue: 1250,
		high52w: 94500,
		low52w: 48e3,
		marketCap: 356e3,
		per: 6.8,
		pbr: .52,
		eps: 13014,
		dividendYield: 3.85,
		openPrice: 86500,
		highPrice: 89200,
		lowPrice: 86300,
		prevClose: 86300,
		foreignNetBuy: 850,
		instNetBuy: 540,
		candles: generateCandles(88500, .015),
		sparkline: [
			86300,
			86800,
			87400,
			88e3,
			87800,
			88300,
			88500
		]
	},
	{
		symbol: "055550",
		name: "신한지주",
		market: "KOSPI",
		sector: "금융 / 은행",
		price: 54800,
		change: 1100,
		changePercent: 2.05,
		volume: 189e4,
		volumeRatio: 128,
		tradingValue: 1030,
		high52w: 64500,
		low52w: 35200,
		marketCap: 279e3,
		per: 5.9,
		pbr: .48,
		eps: 9288,
		dividendYield: 4.1,
		openPrice: 53900,
		highPrice: 55200,
		lowPrice: 53700,
		prevClose: 53700,
		foreignNetBuy: 620,
		instNetBuy: 380,
		candles: generateCandles(54800, .015),
		sparkline: [
			53700,
			54e3,
			54400,
			54600,
			54300,
			54700,
			54800
		]
	},
	{
		symbol: "051910",
		name: "LG화학",
		market: "KOSPI",
		sector: "화학 / 첨단소재",
		price: 326e3,
		change: -4500,
		changePercent: -1.36,
		volume: 245e3,
		volumeRatio: 88.5,
		tradingValue: 798,
		high52w: 524e3,
		low52w: 295e3,
		marketCap: 23e4,
		per: 24.2,
		pbr: .82,
		eps: 13471,
		dividendYield: 1.05,
		openPrice: 331e3,
		highPrice: 332e3,
		lowPrice: 324e3,
		prevClose: 330500,
		foreignNetBuy: -140,
		instNetBuy: -80,
		candles: generateCandles(326e3, .02),
		sparkline: [
			330500,
			329e3,
			327e3,
			325500,
			326500,
			325e3,
			326e3
		]
	},
	{
		symbol: "006400",
		name: "삼성SDI",
		market: "KOSPI",
		sector: "2차전지 / 전자재료",
		price: 358e3,
		change: -7e3,
		changePercent: -1.92,
		volume: 31e4,
		volumeRatio: 94,
		tradingValue: 1110,
		high52w: 504e3,
		low52w: 31e4,
		marketCap: 246e3,
		per: 18.5,
		pbr: 1.15,
		eps: 19351,
		dividendYield: .28,
		openPrice: 366e3,
		highPrice: 367e3,
		lowPrice: 356e3,
		prevClose: 365e3,
		foreignNetBuy: -210,
		instNetBuy: -150,
		candles: generateCandles(358e3, .02),
		sparkline: [
			365e3,
			363e3,
			361e3,
			359e3,
			36e4,
			357e3,
			358e3
		]
	},
	{
		symbol: "259960",
		name: "크래프톤",
		market: "KOSPI",
		sector: "게임 / 소프트웨어",
		price: 332e3,
		change: 14e3,
		changePercent: 4.4,
		volume: 42e4,
		volumeRatio: 185,
		tradingValue: 1390,
		high52w: 362e3,
		low52w: 152e3,
		marketCap: 161e3,
		per: 21.5,
		pbr: 2.85,
		eps: 15441,
		dividendYield: 0,
		openPrice: 32e4,
		highPrice: 335e3,
		lowPrice: 319e3,
		prevClose: 318e3,
		foreignNetBuy: 580,
		instNetBuy: 320,
		candles: generateCandles(332e3, .025),
		sparkline: [
			318e3,
			321e3,
			325e3,
			328e3,
			327e3,
			33e4,
			332e3
		]
	},
	{
		symbol: "329180",
		name: "HD현대중공업",
		market: "KOSPI",
		sector: "조선 / 방위산업",
		price: 184500,
		change: 7500,
		changePercent: 4.24,
		volume: 68e4,
		volumeRatio: 190,
		tradingValue: 1250,
		high52w: 206e3,
		low52w: 104e3,
		marketCap: 163e3,
		per: 32,
		pbr: 2.95,
		eps: 5765,
		dividendYield: 0,
		openPrice: 178e3,
		highPrice: 186e3,
		lowPrice: 177500,
		prevClose: 177e3,
		foreignNetBuy: 490,
		instNetBuy: 380,
		candles: generateCandles(184500, .03),
		sparkline: [
			177e3,
			179e3,
			181500,
			183e3,
			182e3,
			184e3,
			184500
		]
	},
	{
		symbol: "042660",
		name: "한화오션",
		market: "KOSPI",
		sector: "조선 / 잠수함방산",
		price: 36200,
		change: 1850,
		changePercent: 5.39,
		volume: 582e4,
		volumeRatio: 260,
		tradingValue: 2100,
		high52w: 42e3,
		low52w: 20800,
		marketCap: 110900,
		per: 45,
		pbr: 2.65,
		eps: 804,
		dividendYield: 0,
		openPrice: 34500,
		highPrice: 36800,
		lowPrice: 34200,
		prevClose: 34350,
		foreignNetBuy: 780,
		instNetBuy: 420,
		candles: generateCandles(36200, .035),
		sparkline: [
			34350,
			34800,
			35300,
			35800,
			35500,
			36e3,
			36200
		]
	},
	{
		symbol: "000100",
		name: "유한양행",
		market: "KOSPI",
		sector: "바이오 / 폐암신약",
		price: 148500,
		change: 8500,
		changePercent: 6.07,
		volume: 312e4,
		volumeRatio: 290,
		tradingValue: 4630,
		high52w: 167e3,
		low52w: 54e3,
		marketCap: 118e3,
		per: 78.5,
		pbr: 4.8,
		eps: 1891,
		dividendYield: .35,
		openPrice: 141e3,
		highPrice: 151e3,
		lowPrice: 140500,
		prevClose: 14e4,
		foreignNetBuy: 920,
		instNetBuy: 610,
		candles: generateCandles(148500, .035),
		sparkline: [
			14e4,
			142500,
			145e3,
			147500,
			146e3,
			148e3,
			148500
		]
	},
	{
		symbol: "352820",
		name: "하이브",
		market: "KOSPI",
		sector: "엔터 / K-POP",
		price: 182e3,
		change: 3500,
		changePercent: 1.96,
		volume: 48e4,
		volumeRatio: 115,
		tradingValue: 873,
		high52w: 258e3,
		low52w: 157500,
		marketCap: 75800,
		per: 38,
		pbr: 2.45,
		eps: 4789,
		dividendYield: .38,
		openPrice: 179500,
		highPrice: 184500,
		lowPrice: 179e3,
		prevClose: 178500,
		foreignNetBuy: 220,
		instNetBuy: 180,
		candles: generateCandles(182e3, .02),
		sparkline: [
			178500,
			18e4,
			181200,
			182500,
			181800,
			181500,
			182e3
		]
	},
	{
		symbol: "066570",
		name: "LG전자",
		market: "KOSPI",
		sector: "가전 / 전장부품",
		price: 98500,
		change: -1200,
		changePercent: -1.2,
		volume: 68e4,
		volumeRatio: 85,
		tradingValue: 670,
		high52w: 117e3,
		low52w: 89e3,
		marketCap: 161e3,
		per: 8.5,
		pbr: .72,
		eps: 11588,
		dividendYield: 1.52,
		openPrice: 99800,
		highPrice: 100500,
		lowPrice: 98100,
		prevClose: 99700,
		foreignNetBuy: -80,
		instNetBuy: -60,
		candles: generateCandles(98500, .015),
		sparkline: [
			99700,
			99400,
			99e3,
			98600,
			98800,
			98300,
			98500
		]
	},
	{
		symbol: "028300",
		name: "HLB",
		market: "KOSDAQ",
		sector: "바이오 / 항암제",
		price: 84200,
		change: 5400,
		changePercent: 6.85,
		volume: 245e4,
		volumeRatio: 310,
		tradingValue: 2060,
		high52w: 129e3,
		low52w: 29800,
		marketCap: 110200,
		per: 99.9,
		pbr: 11.2,
		eps: 842,
		dividendYield: 0,
		openPrice: 79500,
		highPrice: 85900,
		lowPrice: 79200,
		prevClose: 78800,
		foreignNetBuy: 640,
		instNetBuy: 390,
		candles: generateCandles(84200, .04),
		sparkline: [
			78800,
			80200,
			81800,
			83500,
			82900,
			83900,
			84200
		]
	},
	{
		symbol: "348370",
		name: "엔켐",
		market: "KOSDAQ",
		sector: "2차전지 전해액",
		price: 198e3,
		change: 11500,
		changePercent: 6.17,
		volume: 89e4,
		volumeRatio: 240,
		tradingValue: 1760,
		high52w: 358500,
		low52w: 52e3,
		marketCap: 38200,
		per: 52,
		pbr: 7.4,
		eps: 3807,
		dividendYield: 0,
		openPrice: 188e3,
		highPrice: 201e3,
		lowPrice: 187e3,
		prevClose: 186500,
		foreignNetBuy: 340,
		instNetBuy: 210,
		candles: generateCandles(198e3, .035),
		sparkline: [
			186500,
			189e3,
			192e3,
			195500,
			194e3,
			197e3,
			198e3
		]
	},
	{
		symbol: "141080",
		name: "리가켐바이오",
		market: "KOSDAQ",
		sector: "바이오 / ADC항암",
		price: 122e3,
		change: 9800,
		changePercent: 8.73,
		volume: 175e4,
		volumeRatio: 340,
		tradingValue: 2130,
		high52w: 138e3,
		low52w: 39500,
		marketCap: 44200,
		per: 75,
		pbr: 8.9,
		eps: 1626,
		dividendYield: 0,
		openPrice: 113500,
		highPrice: 124500,
		lowPrice: 113e3,
		prevClose: 112200,
		foreignNetBuy: 520,
		instNetBuy: 410,
		candles: generateCandles(122e3, .04),
		sparkline: [
			112200,
			114500,
			117500,
			120500,
			119500,
			121500,
			122e3
		]
	},
	{
		symbol: "277810",
		name: "레인보우로보틱스",
		market: "KOSDAQ",
		sector: "로봇 / 협동로봇",
		price: 138500,
		change: 5500,
		changePercent: 4.14,
		volume: 41e4,
		volumeRatio: 160,
		tradingValue: 567,
		high52w: 242e3,
		low52w: 121e3,
		marketCap: 26800,
		per: 99.9,
		pbr: 12.5,
		eps: 1385,
		dividendYield: 0,
		openPrice: 134e3,
		highPrice: 141e3,
		lowPrice: 133500,
		prevClose: 133e3,
		foreignNetBuy: 180,
		instNetBuy: 90,
		candles: generateCandles(138500, .03),
		sparkline: [
			133e3,
			134500,
			136e3,
			138e3,
			137e3,
			138e3,
			138500
		]
	},
	{
		symbol: "257720",
		name: "실리콘투",
		market: "KOSDAQ",
		sector: "화장품유통 / K뷰티",
		price: 46800,
		change: 3200,
		changePercent: 7.34,
		volume: 389e4,
		volumeRatio: 310,
		tradingValue: 1820,
		high52w: 54600,
		low52w: 7800,
		marketCap: 28500,
		per: 26.5,
		pbr: 6.8,
		eps: 1766,
		dividendYield: .55,
		openPrice: 44e3,
		highPrice: 47800,
		lowPrice: 43800,
		prevClose: 43600,
		foreignNetBuy: 670,
		instNetBuy: 420,
		candles: generateCandles(46800, .038),
		sparkline: [
			43600,
			44500,
			45300,
			46200,
			45800,
			46500,
			46800
		]
	},
	{
		symbol: "BTC",
		name: "비트코인",
		market: "COIN",
		sector: "가상자산",
		price: 945e5,
		change: 12e5,
		changePercent: 1.28,
		volume: 12e3,
		volumeRatio: 110,
		tradingValue: 12e3,
		high52w: 105e6,
		low52w: 45e6,
		marketCap: 18e6,
		per: 0,
		pbr: 0,
		eps: 0,
		dividendYield: 0,
		openPrice: 93e6,
		highPrice: 95e6,
		lowPrice: 92e6,
		prevClose: 933e5,
		foreignNetBuy: 0,
		instNetBuy: 0,
		candles: generateCandles(945e5, .05),
		sparkline: [
			93e6,
			935e5,
			94e6,
			942e5,
			943e5,
			944e5,
			945e5
		]
	},
	{
		symbol: "ETH",
		name: "이더리움",
		market: "COIN",
		sector: "가상자산",
		price: 45e5,
		change: 5e4,
		changePercent: 1.12,
		volume: 5e4,
		volumeRatio: 105,
		tradingValue: 2200,
		high52w: 6e6,
		low52w: 2e6,
		marketCap: 5e6,
		per: 0,
		pbr: 0,
		eps: 0,
		dividendYield: 0,
		openPrice: 44e5,
		highPrice: 455e4,
		lowPrice: 435e4,
		prevClose: 445e4,
		foreignNetBuy: 0,
		instNetBuy: 0,
		candles: generateCandles(45e5, .05),
		sparkline: [
			44e5,
			442e4,
			445e4,
			447e4,
			448e4,
			449e4,
			45e5
		]
	}
];
var INITIAL_NEWS = [
	{
		id: "news-1",
		title: "\"HBM 패권 굳힌다\" SK하이닉스 19만원 돌파... 외인·기관 쌍끌이 매수",
		summary: "엔비디아향 차세대 AI 가속기 메모리 독점 공급 기대감으로 장중 19만6000원까지 치솟으며 52주 신고가 가시권 진입.",
		source: "한국경제",
		time: "25분 전",
		url: "#",
		relatedSymbols: [
			"000660",
			"005930",
			"042700"
		],
		sentiment: "positive"
	},
	{
		id: "news-2",
		title: "코스피, 반도체·방산주 랠리에 2680선 안착... 코스닥은 2차전지 부진에 혼조세",
		summary: "원/달러 환율 안정과 미국 증시 강세 영향으로 코스피 지수가 반등세를 보이고 있는 반면, 코스닥은 2차전지 수급 공백으로 약세.",
		source: "매일경제",
		time: "42분 전",
		url: "#",
		relatedSymbols: [
			"005930",
			"064350",
			"247540"
		],
		sentiment: "neutral"
	},
	{
		id: "news-3",
		title: "알테오젠, 신고가 랠리 계속...\"머크 키트루다SC 상업화 로열티 가시화\"",
		summary: "증권가에서는 알테오젠의 기업가치가 향후 독점적 피하주사 기술력으로 인해 추가 상승 여력이 충분하다고 평가했다.",
		source: "머니투데이",
		time: "1시간 전",
		url: "#",
		relatedSymbols: ["196170", "068270"],
		sentiment: "positive"
	},
	{
		id: "news-4",
		title: "K-방산 체코·폴란드 잭팟 잇따라... 현대로템·한화에어로 52주 최고가 경신 시도",
		summary: "유럽과 중동발 안보 불안 고조로 K2 전차와 K9 자주포의 추가 수주 소식이 임박했다는 소식에 방산 대장주들이 급등세다.",
		source: "연합인포맥스",
		time: "2시간 전",
		url: "#",
		relatedSymbols: ["064350", "012450"],
		sentiment: "positive"
	},
	{
		id: "news-5",
		title: "2차전지 테마주, 유럽 전기차 판매 둔화 소식에 일제히 하락 전환",
		summary: "에코프로비엠, 에코프로 등 주요 양극재 업체들이 단기 실적 반등 지연 우려로 4~5%대 하락세를 기록 중이다.",
		source: "이데일리",
		time: "3시간 전",
		url: "#",
		relatedSymbols: [
			"247540",
			"086520",
			"373220"
		],
		sentiment: "negative"
	}
];
var mockBaseTime = Date.now();
var mockMinutesAgo = (m) => (/* @__PURE__ */ new Date(mockBaseTime - m * 60 * 1e3)).toISOString();
var mockHoursAgo = (h) => (/* @__PURE__ */ new Date(mockBaseTime - h * 3600 * 1e3)).toISOString();
var mockDaysAgo = (d) => (/* @__PURE__ */ new Date(mockBaseTime - d * 86400 * 1e3)).toISOString();
var INITIAL_POSTS = [
	{
		id: "post-1",
		author: {
			id: "user-vip-1",
			name: "여의도단타요정",
			avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
			badge: "수익률 TOP 1%",
			tier: "다이아",
			level: 60,
			title: "단타의신"
		},
		category: "discussion",
		title: "[종목토론] SK하이닉스 20만원 돌파 시나리오와 저항선 체크",
		content: `오늘 외인 수급이 3800억 이상 들어오고 있습니다.
엔비디아향 차세대 HBM 물량 배정이 이미 확정된 상태에서, 185,000원의 전고점 매물대를 아주 깔끔한 거래량 실린 장대양봉으로 돌파했습니다.

단기 1차 목표가는 215,000원 부근으로 보고 있으며, 5일 이동평균선(191,000원) 이탈 전까지는 눌림목마다 분할 매수 관점이 유효하다고 봅니다.

반도체 소부장 대장인 한미반도체와 함께 짝짓기 매매 전략도 강력 추천합니다.

* 투자의 책임은 본인에게 있습니다. 성투하십시오!`,
		symbol: "000660",
		symbolName: "SK하이닉스",
		likes: 142,
		likedBy: [],
		views: 3840,
		commentsCount: 24,
		createdAt: mockMinutesAgo(15),
		isHot: true,
		tags: [
			"SK하이닉스",
			"HBM",
			"기술적분석",
			"단타전략"
		],
		comments: [{
			id: "c-1",
			postId: "post-1",
			author: {
				id: "user-2",
				name: "한강뷰가자",
				avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
				badge: "정회원"
			},
			content: "분석 깔끔하네요! 오늘 193,000원에 불타기 탑승했습니다. 20만닉스 가즈아!",
			createdAt: mockMinutesAgo(10),
			likes: 18
		}, {
			id: "c-2",
			postId: "post-1",
			author: {
				id: "user-3",
				name: "가치투자러",
				avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
				badge: "우수회원"
			},
			content: "외인 매수가 진짜 무섭네요. 삼전 덜어내고 하이닉스로 갈아타길 정말 잘했습니다.",
			createdAt: mockMinutesAgo(7),
			likes: 9
		}]
	},
	{
		id: "post-2",
		author: {
			id: "user-vip-2",
			name: "바이오승부사",
			avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
			badge: "바이오 장인",
			tier: "마스터",
			level: 70,
			title: "바이오지니어스"
		},
		category: "invest",
		title: "[투자정보] 알테오젠 +128% 중간 결산 및 SC 플랫폼 가치 산정 리포트",
		content: `올해 초 16만원대부터 꾸준히 매집해온 알테오젠입니다.
키트루다 피하주사(SC) 독점 공급 계약에 대한 시장의 의구심이 완전히 해소되었고, 이제는 글로벌 기술이전 플랫폼 기업으로 재평가받고 있습니다.

총 평가손익: +128.4% (평가익 8,400만원)
아직 매도할 생각 전혀 없습니다. 머크 승인 나는 내년까지 홀딩합니다.`,
		symbol: "196170",
		symbolName: "알테오젠",
		likes: 215,
		likedBy: [],
		views: 5920,
		commentsCount: 38,
		createdAt: mockHoursAgo(1),
		isHot: true,
		tags: [
			"알테오젠",
			"수익인증",
			"바이오",
			"존버"
		],
		comments: [{
			id: "c-3",
			postId: "post-2",
			author: {
				id: "user-4",
				name: "주린이탈출기",
				avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
				badge: "새싹"
			},
			content: "우와... 멘탈이 대단하십니다. 저런 수익률을 보려면 얼마나 흔들기를 견뎌야 할까요.",
			createdAt: mockMinutesAgo(40),
			likes: 12
		}]
	},
	{
		id: "post-3",
		author: {
			id: "user-5",
			name: "방산의힘",
			avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
			badge: "방산전문",
			tier: "골드",
			level: 40,
			title: "방산전문가"
		},
		category: "market",
		title: "[시장정보] 현대로템 & 한화에어로: 폴란드 2차 실행계약과 루마니아 수주 모멘텀",
		content: `방산 섹터는 단순 테마가 아니라 구조적 실적 성장기입니다.
수주잔고만 수십조 원에 달하고, 납기 준수 능력 면에서 서방 국가들 중 한국을 대체할 수 있는 나라가 없습니다.
오늘 장대양봉은 기관의 포트폴리오 비중 확대 신호탄으로 보입니다.`,
		symbol: "064350",
		symbolName: "현대로템",
		likes: 89,
		likedBy: [],
		views: 2100,
		commentsCount: 15,
		createdAt: mockHoursAgo(2),
		isHot: false,
		tags: [
			"현대로템",
			"방산",
			"한화에어로스페이스",
			"실적주"
		],
		comments: []
	},
	{
		id: "post-4",
		author: {
			id: "admin-1",
			name: "병돌인베스트 운영자",
			avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
			badge: "공식운영자",
			tier: "관리자",
			level: 99,
			title: "운영 총괄"
		},
		category: "notice",
		title: "[공지] 건전한 주식 투자 커뮤니티 이용 규칙 및 허위사실 유포 제재 안내",
		content: `안녕하세요, 병돌 인베스트먼트 회원 여러분.
최근 특정 세력의 종목 리딩, 미공개 정보 사칭, 비방성 허위사실 유포 게시글이 감지되고 있습니다.
적발 시 무통보 영구 이용정지 및 관련 기관 신고 조치될 수 있으니 유의하시기 바랍니다.
실시간 신고 기능을 적극 활용해 주시기 바랍니다.`,
		likes: 350,
		likedBy: [],
		views: 12400,
		commentsCount: 42,
		createdAt: mockDaysAgo(1),
		isNotice: true,
		tags: [
			"공지사항",
			"커뮤니티이용규칙",
			"클린캠페인"
		],
		comments: []
	},
	{
		id: "post-5",
		author: {
			id: "user-6",
			name: "배터리아저씨팬",
			avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
			badge: "열혈회원",
			tier: "실버",
			level: 25,
			title: "성실개미"
		},
		category: "qa",
		title: "[질문/답변] 에코프로비엠 지금 바닥일까요? 물타기 시점 질문드립니다.",
		content: `평단가 24만원인데 지금 15만원선까지 내려왔네요...
매출 역성장이 멈추는 시점이 언제쯤일까요? LFP 배터리 양산 소식 나오면 반등할 수 있을지 고수님들 고견 부탁드립니다.`,
		symbol: "247540",
		symbolName: "에코프로비엠",
		likes: 34,
		likedBy: [],
		views: 1820,
		commentsCount: 29,
		createdAt: mockHoursAgo(3),
		isHot: false,
		tags: [
			"에코프로비엠",
			"물타기",
			"2차전지",
			"고민상담"
		],
		comments: []
	},
	{
		id: "post-6",
		author: {
			id: "user-7",
			name: "여의도카페인",
			avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
			badge: "일반회원",
			tier: "브론즈",
			level: 10,
			title: "초보투자자"
		},
		category: "free",
		title: "[자유게시판] 오늘 장 마감하고 치맥 한잔 하실 분들 계신가요 ㅎㅎ",
		content: `오늘 반도체 급등 덕분에 드디어 빨간불 봤습니다! 다들 오늘 매매 어떠셨나요? 수익 나신 분들 모두 축하드립니다.`,
		likes: 28,
		likedBy: [],
		views: 950,
		commentsCount: 12,
		createdAt: mockHoursAgo(4),
		isHot: false,
		tags: [
			"자유토론",
			"치맥",
			"수익축하"
		],
		comments: []
	}
];
mockMinutesAgo(20), mockBaseTime - 12e5, mockMinutesAgo(18), mockBaseTime - 108e4, mockMinutesAgo(15), mockBaseTime - 9e5, mockMinutesAgo(10), mockBaseTime - 6e5, mockMinutesAgo(5), mockBaseTime - 3e5;
function generateOrderBook(stock) {
	const price = stock.price;
	const isUSD = stock.currency === "USD" || stock.market === "US";
	const tick = isUSD ? price >= 100 ? .1 : price >= 10 ? .05 : .01 : price >= 1e5 ? 500 : price >= 5e4 ? 100 : 50;
	const roundPrice = (p) => isUSD ? Number(Math.max(.01, p).toFixed(2)) : Math.max(1, Math.round(p));
	const prevClose = stock.prevClose || price || 1;
	const asks = [];
	const bids = [];
	let totalAskVolume = 0;
	let totalBidVolume = 0;
	for (let i = 10; i >= 1; i--) {
		const askPrice = roundPrice(price + i * tick);
		const vol = Math.round(1500 + Math.random() * 8e3 * (11 - i));
		totalAskVolume += vol;
		const chg = isUSD ? Number((askPrice - prevClose).toFixed(2)) : Math.round(askPrice - prevClose);
		const chgPct = chg / prevClose * 100;
		asks.push({
			price: askPrice,
			volume: vol,
			change: chg,
			changePercent: chgPct,
			barPercent: 0
		});
	}
	for (let i = 1; i <= 10; i++) {
		const bidPrice = roundPrice(price - (i - 1) * tick);
		const vol = Math.round(2e3 + Math.random() * 9500 * (11 - i));
		totalBidVolume += vol;
		const chg = isUSD ? Number((bidPrice - prevClose).toFixed(2)) : Math.round(bidPrice - prevClose);
		const chgPct = chg / prevClose * 100;
		bids.push({
			price: bidPrice,
			volume: vol,
			change: chg,
			changePercent: chgPct,
			barPercent: 0
		});
	}
	const maxVol = Math.max(...asks.map((a) => a.volume), ...bids.map((b) => b.volume), 1);
	asks.forEach((a) => a.barPercent = Math.min(100, Math.round(a.volume / maxVol * 100)));
	bids.forEach((b) => b.barPercent = Math.min(100, Math.round(b.volume / maxVol * 100)));
	return {
		symbol: stock.symbol,
		currentPrice: price,
		asks,
		bids,
		totalAskVolume,
		totalBidVolume
	};
}
//#endregion
//#region src/services/storageService.ts
var STORAGE_KEYS = {
	WATCHLIST: "bd_stock_watchlist",
	POSTS: "bd_community_posts",
	CHAT: "bd_chat_messages",
	ALERTS: "bd_price_alerts",
	SMART_ALERTS: "bd_smart_stock_alerts",
	USER: "bd_user_profile",
	REPORTS: "bd_admin_reports",
	EVENTS: "bd_market_events",
	THEME: "bd_theme_preference"
};
function loadFromStorage(key, defaultValue) {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return defaultValue;
		return JSON.parse(raw);
	} catch (e) {
		console.warn(`Error loading storage key "${key}":`, e);
		return defaultValue;
	}
}
function saveToStorage(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (e) {
		console.warn(`Error saving storage key "${key}":`, e);
	}
}
var storageService = {
	getUserWatchlist(uid) {
		if (!uid) return [];
		return loadFromStorage(`${STORAGE_KEYS.WATCHLIST}_${uid}`, []);
	},
	saveUserWatchlist(uid, list) {
		if (!uid) return;
		saveToStorage(`${STORAGE_KEYS.WATCHLIST}_${uid}`, list);
	},
	getWatchlist() {
		return loadFromStorage(STORAGE_KEYS.WATCHLIST, []);
	},
	saveWatchlist(list) {
		saveToStorage(STORAGE_KEYS.WATCHLIST, list);
	},
	clearWatchlist(uid) {
		try {
			localStorage.removeItem(STORAGE_KEYS.WATCHLIST);
			if (uid) localStorage.removeItem(`${STORAGE_KEYS.WATCHLIST}_${uid}`);
		} catch {}
	},
	getPosts() {
		return dedupeById(loadFromStorage(STORAGE_KEYS.POSTS, INITIAL_POSTS));
	},
	getPostById(id) {
		return this.getPosts().find((p) => p.id === id);
	},
	createPost(data, overrideId) {
		const posts = this.getPosts();
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		const finalId = overrideId || `post-${Date.now()}`;
		const newPost = {
			...data,
			id: finalId,
			likes: 0,
			likedBy: [],
			views: 1,
			commentsCount: 0,
			createdAt: nowIso,
			updatedAt: nowIso,
			comments: []
		};
		const updated = [newPost, ...posts.filter((p) => p.id !== finalId)];
		saveToStorage(STORAGE_KEYS.POSTS, updated);
		return newPost;
	},
	updatePost(id, updates) {
		const posts = this.getPosts();
		const index = posts.findIndex((p) => p.id === id);
		if (index === -1) return null;
		posts[index] = {
			...posts[index],
			...updates,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		saveToStorage(STORAGE_KEYS.POSTS, posts);
		return posts[index];
	},
	deletePost(id) {
		const posts = this.getPosts();
		const filtered = posts.filter((p) => p.id !== id);
		saveToStorage(STORAGE_KEYS.POSTS, filtered);
		return filtered.length !== posts.length;
	},
	togglePostLike(postId, userId) {
		const posts = this.getPosts();
		const post = posts.find((p) => p.id === postId);
		if (!post) return null;
		post.likedBy = post.likedBy || [];
		if (post.likedBy.includes(userId)) {
			post.likedBy = post.likedBy.filter((uid) => uid !== userId);
			post.likes = Math.max(0, post.likes - 1);
		} else {
			post.likedBy.push(userId);
			post.likes += 1;
		}
		saveToStorage(STORAGE_KEYS.POSTS, posts);
		return post;
	},
	addComment(postId, user, content) {
		const posts = this.getPosts();
		const post = posts.find((p) => p.id === postId);
		if (!post) return null;
		const newComment = {
			id: `c-${Date.now()}`,
			postId,
			author: {
				id: user.id,
				name: user.name,
				avatar: user.avatar,
				badge: user.role === "admin" ? "운영자" : user.tier
			},
			content,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			likes: 0,
			likedBy: []
		};
		post.comments = post.comments || [];
		post.comments.push(newComment);
		post.commentsCount = post.comments.length;
		saveToStorage(STORAGE_KEYS.POSTS, posts);
		return newComment;
	},
	incrementViewCount(postId) {
		const posts = this.getPosts();
		const post = posts.find((p) => p.id === postId);
		if (post) {
			post.views = (post.views || 0) + 1;
			saveToStorage(STORAGE_KEYS.POSTS, posts);
		}
	},
	updateComment(postId, commentId, newContent) {
		const posts = this.getPosts();
		const post = posts.find((p) => p.id === postId);
		if (!post || !post.comments) return null;
		const comment = post.comments.find((c) => c.id === commentId);
		if (!comment) return null;
		comment.content = newContent;
		comment.updatedAt = "방금 전 (수정됨)";
		saveToStorage(STORAGE_KEYS.POSTS, posts);
		return comment;
	},
	deleteComment(postId, commentId) {
		const posts = this.getPosts();
		const post = posts.find((p) => p.id === postId);
		if (!post || !post.comments) return false;
		post.comments = post.comments.filter((c) => c.id !== commentId);
		post.commentsCount = post.comments.length;
		saveToStorage(STORAGE_KEYS.POSTS, posts);
		return true;
	},
	reportItem(report) {
		const reports = loadFromStorage("bd_reports", []);
		const newReport = {
			...report,
			id: `rep-${Date.now()}`,
			createdAt: (/* @__PURE__ */ new Date()).toLocaleDateString("ko-KR") + " " + (/* @__PURE__ */ new Date()).toLocaleTimeString("ko-KR"),
			status: "pending"
		};
		reports.unshift(newReport);
		saveToStorage("bd_reports", reports);
		return newReport;
	},
	getCustomChatRooms() {
		return dedupeById(loadFromStorage("bd_chat_rooms", []));
	},
	createCustomChatRoom(room) {
		saveToStorage("bd_chat_rooms", dedupeById([room, ...this.getCustomChatRooms()]));
		return room;
	},
	getChatMessages(roomId = "all") {
		return dedupeById(loadFromStorage(STORAGE_KEYS.CHAT, [])).filter((m) => m.roomId === roomId);
	},
	sendChatMessage(message) {
		const allMessages = dedupeById(loadFromStorage(STORAGE_KEYS.CHAT, []));
		const now = /* @__PURE__ */ new Date();
		const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
		const finalId = message.id || `chat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
		const newMsg = {
			...message,
			id: finalId,
			timestamp: timeStr,
			createdAt: message.createdAt || now.toISOString(),
			_sortTime: now.getTime(),
			likes: 0,
			status: "sent"
		};
		const updated = [...allMessages.filter((m) => m.id !== finalId), newMsg];
		if (updated.length > 200) updated.splice(0, updated.length - 200);
		saveToStorage(STORAGE_KEYS.CHAT, updated);
		return newMsg;
	},
	getAlerts() {
		return loadFromStorage(STORAGE_KEYS.ALERTS, []);
	},
	addAlert(alert) {
		const alerts = this.getAlerts();
		const newAlert = {
			...alert,
			id: `alert-${Date.now()}`,
			createdAt: (/* @__PURE__ */ new Date()).toLocaleDateString("ko-KR"),
			isTriggered: false
		};
		const updated = [newAlert, ...alerts];
		saveToStorage(STORAGE_KEYS.ALERTS, updated);
		return newAlert;
	},
	deleteAlert(id) {
		const alerts = this.getAlerts();
		saveToStorage(STORAGE_KEYS.ALERTS, alerts.filter((a) => a.id !== id));
	},
	getSmartAlerts() {
		return loadFromStorage(STORAGE_KEYS.SMART_ALERTS, []);
	},
	getSmartAlertForStock(symbol, defaultName) {
		const alerts = this.getSmartAlerts();
		const existing = alerts.find((a) => a.symbol === symbol);
		if (existing) return existing;
		const brandNew = {
			id: `smart-${symbol}`,
			symbol,
			symbolName: defaultName || symbol,
			rise5Percent: true,
			fall5Percent: true,
			volume200Percent: true,
			newsAlert: true,
			aiBriefingAlert: true,
			highLowAlert: true,
			updatedAt: "실시간 감지 활성화"
		};
		alerts.push(brandNew);
		saveToStorage(STORAGE_KEYS.SMART_ALERTS, alerts);
		return brandNew;
	},
	saveSmartAlert(alert) {
		const alerts = this.getSmartAlerts();
		const idx = alerts.findIndex((a) => a.symbol === alert.symbol);
		const updatedAlert = {
			...alert,
			updatedAt: (/* @__PURE__ */ new Date()).toLocaleDateString("ko-KR") + " " + (/* @__PURE__ */ new Date()).toLocaleTimeString("ko-KR", {
				hour: "2-digit",
				minute: "2-digit"
			})
		};
		if (idx >= 0) alerts[idx] = updatedAlert;
		else alerts.unshift(updatedAlert);
		saveToStorage(STORAGE_KEYS.SMART_ALERTS, alerts);
	},
	toggleSmartAlertRule(symbol, rule, symbolName) {
		const current = this.getSmartAlertForStock(symbol, symbolName);
		current[rule] = !current[rule];
		current.updatedAt = "방금 전 설정 변경";
		this.saveSmartAlert(current);
		return current;
	},
	getMarketEvents() {
		return loadFromStorage(STORAGE_KEYS.EVENTS, []);
	},
	broadcastMarketEvent(event) {
		const events = this.getMarketEvents();
		const now = /* @__PURE__ */ new Date();
		const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
		const newEvt = {
			...event,
			id: `evt-${Date.now()}`,
			timestamp: timeStr,
			active: true
		};
		saveToStorage(STORAGE_KEYS.EVENTS, [newEvt, ...events]);
		return newEvt;
	},
	getReports() {
		return loadFromStorage(STORAGE_KEYS.REPORTS, []);
	},
	updateReportStatus(id, status) {
		const reports = this.getReports();
		const item = reports.find((r) => r.id === id);
		if (item) {
			item.status = status;
			saveToStorage(STORAGE_KEYS.REPORTS, reports);
		}
	},
	getUser() {
		return loadFromStorage(STORAGE_KEYS.USER, null);
	},
	updateUser(updates) {
		const user = this.getUser();
		if (!user) return null;
		const updated = {
			...user,
			...updates
		};
		saveToStorage(STORAGE_KEYS.USER, updated);
		return updated;
	},
	savePosts(posts) {
		saveToStorage(STORAGE_KEYS.POSTS, posts);
	},
	saveChatMessages(roomId, messages) {
		const otherRoomMsgs = loadFromStorage(STORAGE_KEYS.CHAT, []).filter((m) => m.roomId !== roomId);
		saveToStorage(STORAGE_KEYS.CHAT, [...otherRoomMsgs, ...messages]);
	},
	addNotification(notif) {
		const notifs = loadFromStorage("bd_user_notifications", []);
		notifs.unshift({
			...notif,
			id: notif.id || `notif-${Date.now()}`,
			createdAt: (/* @__PURE__ */ new Date()).toLocaleTimeString("ko-KR"),
			timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString("ko-KR"),
			read: false
		});
		saveToStorage("bd_user_notifications", notifs);
	}
};
//#endregion
//#region src/utils/hangul.ts
var HANGUL_BASE = 44032;
var HANGUL_END = 55203;
var CHOSUNG_LIST = [
	"ㄱ",
	"ㄲ",
	"ㄴ",
	"ㄷ",
	"ㄸ",
	"ㄹ",
	"ㅁ",
	"ㅂ",
	"ㅃ",
	"ㅅ",
	"ㅆ",
	"ㅇ",
	"ㅈ",
	"ㅉ",
	"ㅊ",
	"ㅋ",
	"ㅌ",
	"ㅍ",
	"ㅎ"
];
var JUNGSUNG_LIST = [
	"ㅏ",
	"ㅐ",
	"ㅑ",
	"ㅒ",
	"ㅓ",
	"ㅔ",
	"ㅕ",
	"ㅖ",
	"ㅗ",
	"ㅘ",
	"ㅙ",
	"ㅚ",
	"ㅛ",
	"ㅜ",
	"ㅝ",
	"ㅞ",
	"ㅟ",
	"ㅠ",
	"ㅡ",
	"ㅢ",
	"ㅣ"
];
var JONGSUNG_LIST = [
	"",
	"ㄱ",
	"ㄲ",
	"ㄳ",
	"ㄴ",
	"ㄵ",
	"ㄶ",
	"ㄷ",
	"ㄹ",
	"ㄺ",
	"ㄻ",
	"ㄼ",
	"ㄽ",
	"ㄾ",
	"ㄿ",
	"ㅀ",
	"ㅁ",
	"ㅂ",
	"ㅄ",
	"ㅅ",
	"ㅆ",
	"ㅇ",
	"ㅈ",
	"ㅊ",
	"ㅋ",
	"ㅌ",
	"ㅍ",
	"ㅎ"
];
var COMPLEX_JONGSUNG_MAP = {
	"ㄳ": "ㄱㅅ",
	"ㄵ": "ㄴㅈ",
	"ㄶ": "ㄴㅎ",
	"ㄺ": "ㄹㄱ",
	"ㄻ": "ㄹㅁ",
	"ㄼ": "ㄹㅂ",
	"ㄽ": "ㄹㅅ",
	"ㄾ": "ㄹㅌ",
	"ㄿ": "ㄹㅍ",
	"ㅀ": "ㄹㅎ",
	"ㅄ": "ㅂㅅ"
};
var COMPLEX_JUNGSUNG_MAP = {
	"ㅘ": "ㅗㅏ",
	"ㅙ": "ㅗㅐ",
	"ㅚ": "ㅗㅣ",
	"ㅝ": "ㅜㅓ",
	"ㅞ": "ㅜㅔ",
	"ㅟ": "ㅜㅣ",
	"ㅢ": "ㅡㅣ"
};
/**
* Extracts Korean initial consonants (초성) from a given string.
* Example: "삼성전자" -> "ㅅㅅㅈㅈ", "SK하이닉스" -> "skㅎㅇㄴㅅ"
*/
function extractChosung(text) {
	if (!text) return "";
	let result = "";
	for (let i = 0; i < text.length; i++) {
		const code = text.charCodeAt(i);
		if (code >= HANGUL_BASE && code <= HANGUL_END) {
			const chosungIndex = Math.floor((code - HANGUL_BASE) / 588);
			result += CHOSUNG_LIST[chosungIndex];
		} else result += text[i].toLowerCase();
	}
	return result;
}
/**
* Decomposes Hangul syllables into individual atomic jamo (초성, 중성, 종성).
* Fully expands complex jamo so partial IME strokes seamlessly match!
* Example:
* "삼성" -> "ㅅㅏㅁㅅㅓㅇ"
* "SK하이닉스" -> "skㅎㅏㅇㅣㄴㅣㄱㅅㅡ"
*/
function decomposeHangul(text) {
	if (!text) return "";
	let result = "";
	for (let i = 0; i < text.length; i++) {
		const code = text.charCodeAt(i);
		if (code >= HANGUL_BASE && code <= HANGUL_END) {
			const offset = code - HANGUL_BASE;
			const cho = CHOSUNG_LIST[Math.floor(offset / 588)];
			const jung = JUNGSUNG_LIST[Math.floor(offset % 588 / 28)];
			const jong = JONGSUNG_LIST[offset % 28];
			result += cho;
			result += COMPLEX_JUNGSUNG_MAP[jung] || jung;
			if (jong) result += COMPLEX_JONGSUNG_MAP[jong] || jong;
		} else if (code >= 12593 && code <= 12643) {
			const ch = text[i];
			if (COMPLEX_JONGSUNG_MAP[ch]) result += COMPLEX_JONGSUNG_MAP[ch];
			else if (COMPLEX_JUNGSUNG_MAP[ch]) result += COMPLEX_JUNGSUNG_MAP[ch];
			else result += ch;
		} else result += text[i].toLowerCase();
	}
	return result;
}
/**
* Checks if a string consists exclusively of Korean consonants (초성) or alphanumeric characters.
*/
function isChosungQuery(query) {
	if (!query) return false;
	const trimmed = query.replace(/\s+/g, "");
	const hasChosungChar = /[ㄱ-ㅎ]/.test(trimmed);
	const hasFullSyllable = /[가-힣]/.test(trimmed);
	return hasChosungChar && !hasFullSyllable;
}
/**
* Matches target string against query supporting:
* 1. Full/Partial name match (case-insensitive, space-insensitive)
* 2. Korean atomic Jamo decomposition search (e.g. '사' -> '삼성전자', '삼ㅅ' -> '삼성전자')
* 3. Pure Chosung search (e.g. 'ㅅㅅ' -> '삼성전자', 'ㅅㅋ' -> 'SK하이닉스')
* 4. Partial stock code match (e.g. '0059' -> '005930')
*/
function matchHangulSearch(target, query) {
	if (!query || !target) return false;
	const rawQuery = query.trim().toLowerCase();
	const rawTarget = target.toLowerCase();
	if (!rawQuery) return false;
	if (rawTarget.includes(rawQuery)) return true;
	const targetNoSpace = rawTarget.replace(/\s+/g, "");
	const queryNoSpace = rawQuery.replace(/\s+/g, "");
	if (targetNoSpace.includes(queryNoSpace)) return true;
	if (isChosungQuery(rawQuery)) {
		if (extractChosung(rawTarget).replace(/\s+/g, "").includes(queryNoSpace)) return true;
	}
	const decomposedTarget = decomposeHangul(rawTarget).replace(/\s+/g, "");
	const decomposedQuery = decomposeHangul(rawQuery).replace(/\s+/g, "");
	if (decomposedTarget.includes(decomposedQuery)) return true;
	return false;
}
//#endregion
//#region src/services/mockStockRepository.ts
var MockStockRepository = class {
	constructor() {
		this.localStocks = [...INITIAL_STOCKS];
		this.localIndices = INITIAL_INDICES.map((idx) => ({ ...idx }));
		this.localExchange = { ...INITIAL_EXCHANGE_RATE };
		this.subscribers = /* @__PURE__ */ new Set();
		this.executionSubscribers = /* @__PURE__ */ new Map();
		this.orderBookSubscribers = /* @__PURE__ */ new Map();
		this.timer = null;
		this.popularSymbols = [
			"005930",
			"000660",
			"005380",
			"035420",
			"035720",
			"373220",
			"247540",
			"196170"
		];
	}
	startSimulationTimer() {
		if (this.timer) return;
		this.timer = setInterval(() => {
			const nowTime = (/* @__PURE__ */ new Date()).toTimeString().slice(0, 8);
			this.localIndices = this.localIndices.map((idx) => {
				const isKospi = idx.symbol === "KOSPI";
				const step = isKospi ? .35 : .22;
				const dir = Math.random() > .49 ? 1 : -1;
				const delta = Number((Math.random() * step * dir).toFixed(2));
				const newValue = Number(Math.max(100, idx.value + delta).toFixed(2));
				const basePrev = isKospi ? 2605.5 : 863;
				const newChange = Number((newValue - basePrev).toFixed(2));
				const newChangePercent = Number((newChange / basePrev * 100).toFixed(2));
				return {
					...idx,
					value: newValue,
					change: newChange,
					changePercent: newChangePercent,
					lastUpdated: `실시간 ${nowTime}`
				};
			});
			const watchedSymbols = /* @__PURE__ */ new Set([...Array.from(this.executionSubscribers.keys()), ...Array.from(this.orderBookSubscribers.keys())]);
			const tickedSymbols = /* @__PURE__ */ new Set();
			this.localStocks = this.localStocks.map((stock) => {
				const isWatched = watchedSymbols.has(stock.symbol);
				const isPopular = this.popularSymbols.includes(stock.symbol);
				if (Math.random() > (isWatched ? .75 : isPopular ? .55 : .3)) return stock;
				tickedSymbols.add(stock.symbol);
				const delta = (stock.price >= 1e5 ? 500 : stock.price >= 5e4 ? 100 : 50) * (Math.random() > .48 ? 1 : -1);
				const newPrice = Math.max(100, stock.price + delta);
				const prevClose = stock.prevClose || stock.price - stock.change;
				const newChange = newPrice - prevClose;
				const newPct = Number((newChange / prevClose * 100).toFixed(2));
				const tradeQty = Math.floor(Math.random() * 250) + 20;
				return {
					...stock,
					price: newPrice,
					change: newChange,
					changePercent: newPct,
					volume: stock.volume + tradeQty,
					highPrice: Math.max(stock.highPrice, newPrice),
					lowPrice: Math.min(stock.lowPrice, newPrice)
				};
			});
			this.subscribers.forEach((cb) => {
				try {
					cb([...this.localStocks]);
				} catch {}
			});
			this.executionSubscribers.forEach((callbacks, sym) => {
				const stock = this.localStocks.find((s) => s.symbol === sym);
				if (!stock) return;
				const tick = {
					symbol: stock.symbol,
					price: stock.price,
					change: stock.change,
					changePercent: stock.changePercent,
					volume: stock.volume,
					open: stock.openPrice,
					high: stock.highPrice,
					low: stock.lowPrice,
					time: nowTime
				};
				callbacks.forEach((cb) => {
					try {
						cb(tick);
					} catch {}
				});
			});
			this.orderBookSubscribers.forEach((callbacks, sym) => {
				const stock = this.localStocks.find((s) => s.symbol === sym);
				if (!stock) return;
				const ob = generateOrderBook(stock);
				callbacks.forEach((cb) => {
					try {
						cb(ob);
					} catch {}
				});
			});
		}, 2e3);
	}
	checkStopSimulationTimer() {
		if (!(this.subscribers.size > 0 || this.executionSubscribers.size > 0 || this.orderBookSubscribers.size > 0) && this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
	}
	getSourceType() {
		return "MOCK";
	}
	async getAllStocks(forceRefresh = false) {
		return [...this.localStocks];
	}
	async getStock(symbol) {
		return this.localStocks.find((s) => s.symbol === symbol);
	}
	async searchStocks(options) {
		const q = options.query.trim().toLowerCase();
		if (!q) return [];
		let filtered = this.localStocks.filter((s) => {
			if (options.market && options.market !== "ALL") {
				if (options.market === "KR") {
					if (s.market !== "KOSPI" && s.market !== "KOSDAQ") return false;
				} else if (s.market !== options.market) return false;
			}
			return s.name.toLowerCase().includes(q) || s.symbol.toLowerCase().includes(q) || s.sector.toLowerCase().includes(q) || matchHangulSearch(s.name, q);
		});
		if (options.limit && options.limit > 0) filtered = filtered.slice(0, options.limit);
		return filtered;
	}
	async getStocksBySymbols(symbols) {
		const all = await this.getAllStocks();
		return symbols.map((sym) => all.find((s) => s.symbol === sym)).filter((s) => Boolean(s));
	}
	async getChartCandles(symbol, period) {
		const stock = await this.getStock(symbol);
		if (!stock || !stock.candles) return [];
		let result = stock.candles;
		if (period === "1D" || period === "day") result = stock.candles.slice(-12);
		else if (period === "1W") result = stock.candles.slice(-7);
		else if (period === "1M") result = stock.candles.slice(-22);
		else if (period === "3M") result = stock.candles.slice(-66);
		else if (period === "6M") result = stock.candles;
		else if (period === "1Y") result = stock.candles;
		return result;
	}
	async getKiwoomChart(symbol, period) {
		const candles = await this.getChartCandles(symbol, period);
		return {
			symbol,
			period,
			periodLabel: period,
			trId: period === "day" ? "ka10081" : "ka10080",
			supported: true,
			candles,
			source: "kiwoom",
			cached: false,
			timestamp: Date.now(),
			error: null
		};
	}
	async getRelatedNews(symbol) {
		const matched = INITIAL_NEWS.filter((n) => n.relatedSymbols?.includes(symbol));
		return matched.length > 0 ? matched : INITIAL_NEWS.slice(0, 3);
	}
	async getVolumeAnalysis(symbol) {
		const stock = await this.getStock(symbol);
		const volumeRatio = stock ? stock.volumeRatio : 120.5;
		const volume = stock ? stock.volume : 5e6;
		const avgVolume20d = Math.round(volume / (Math.max(10, volumeRatio) / 100));
		const avgVolume5d = Math.round(volume * .95);
		const tradingValue = stock ? stock.tradingValue : 2500;
		const executionStrength = stock ? stock.change >= 0 ? 118.5 : 84.2 : 105;
		const turnoverRatio = Number((volume / ((stock?.marketCap || 1e5) * 1e3) * 100).toFixed(2)) || 2.45;
		const foreignNetBuy = stock && stock.foreignNetBuy !== void 0 ? stock.foreignNetBuy : null;
		const instNetBuy = stock && stock.instNetBuy !== void 0 ? stock.instNetBuy : null;
		const investorDataAvailable = Boolean(foreignNetBuy !== null && instNetBuy !== null && stock?.market !== "US");
		return {
			volumeRatio,
			volume,
			avgVolume20d,
			avgVolume5d,
			tradingValue,
			executionStrength,
			turnoverRatio,
			foreignNetBuy,
			instNetBuy,
			individualNetBuy: investorDataAvailable ? -(foreignNetBuy + instNetBuy) : null,
			investorDataSource: "Mock Data",
			investorBaseDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			investorUpdateTime: (/* @__PURE__ */ new Date()).toLocaleTimeString("ko-KR", {
				hour: "2-digit",
				minute: "2-digit"
			}),
			investorDataAvailable
		};
	}
	async getIndices() {
		return [...this.localIndices];
	}
	async getExchangeRate() {
		return { ...this.localExchange };
	}
	subscribeTicks(callback) {
		this.subscribers.add(callback);
		this.startSimulationTimer();
		try {
			callback([...this.localStocks]);
		} catch {}
		return () => {
			this.subscribers.delete(callback);
			this.checkStopSimulationTimer();
		};
	}
	subscribeExecutionTick(symbol, callback) {
		let callbacks = this.executionSubscribers.get(symbol);
		if (!callbacks) {
			callbacks = /* @__PURE__ */ new Set();
			this.executionSubscribers.set(symbol, callbacks);
		}
		callbacks.add(callback);
		this.startSimulationTimer();
		const target = this.localStocks.find((s) => s.symbol === symbol) || INITIAL_STOCKS.find((s) => s.symbol === symbol);
		if (target) try {
			callback({
				symbol: target.symbol,
				price: target.price,
				change: target.change,
				changePercent: target.changePercent,
				volume: target.volume,
				open: target.openPrice,
				high: target.highPrice,
				low: target.lowPrice,
				time: (/* @__PURE__ */ new Date()).toTimeString().slice(0, 8)
			});
		} catch {}
		return () => {
			const set = this.executionSubscribers.get(symbol);
			if (set) {
				set.delete(callback);
				if (set.size === 0) this.executionSubscribers.delete(symbol);
			}
			this.checkStopSimulationTimer();
		};
	}
	async getOrderBook(symbol) {
		const stock = await this.getStock(symbol);
		if (stock) return generateOrderBook(stock);
		return generateOrderBook({
			symbol,
			name: symbol,
			price: 7e4,
			prevClose: 69500,
			change: 500,
			changePercent: .72
		});
	}
	subscribeOrderBook(symbol, callback) {
		let callbacks = this.orderBookSubscribers.get(symbol);
		if (!callbacks) {
			callbacks = /* @__PURE__ */ new Set();
			this.orderBookSubscribers.set(symbol, callbacks);
		}
		callbacks.add(callback);
		this.startSimulationTimer();
		const target = this.localStocks.find((s) => s.symbol === symbol) || INITIAL_STOCKS.find((s) => s.symbol === symbol);
		if (target) try {
			callback(generateOrderBook(target));
		} catch {}
		return () => {
			const set = this.orderBookSubscribers.get(symbol);
			if (set) {
				set.delete(callback);
				if (set.size === 0) this.orderBookSubscribers.delete(symbol);
			}
			this.checkStopSimulationTimer();
		};
	}
};
//#endregion
//#region src/services/stockCache.ts
var StockCacheManager = class {
	constructor() {
		this.memoryCache = /* @__PURE__ */ new Map();
		this.defaultTTL = 5e3;
	}
	/**
	* Set data into L1 Memory Cache & L2 Local Storage
	*/
	set(key, data, ttlMs = this.defaultTTL) {
		const entry = {
			data,
			timestamp: Date.now(),
			ttlMs
		};
		this.memoryCache.set(key, entry);
		try {
			localStorage.setItem(`bd_cache_${key}`, JSON.stringify(entry));
		} catch (e) {}
	}
	/**
	* Get data from L1 Memory or L2 LocalStorage if not expired
	*/
	get(key) {
		const memEntry = this.memoryCache.get(key);
		if (memEntry) {
			if (Date.now() - memEntry.timestamp < memEntry.ttlMs) return memEntry.data;
			this.memoryCache.delete(key);
		}
		try {
			const raw = localStorage.getItem(`bd_cache_${key}`);
			if (raw) {
				const localEntry = JSON.parse(raw);
				if (Date.now() - localEntry.timestamp < localEntry.ttlMs) {
					this.memoryCache.set(key, localEntry);
					return localEntry.data;
				} else localStorage.removeItem(`bd_cache_${key}`);
			}
		} catch {}
		return null;
	}
	/**
	* Invalidate specific key or all cache
	*/
	invalidate(key) {
		if (key) {
			this.memoryCache.delete(key);
			try {
				localStorage.removeItem(`bd_cache_${key}`);
			} catch {}
		} else {
			this.memoryCache.clear();
			try {
				const keysToRemove = [];
				for (let i = 0; i < localStorage.length; i++) {
					const k = localStorage.key(i);
					if (k && k.startsWith("bd_cache_")) keysToRemove.push(k);
				}
				keysToRemove.forEach((k) => localStorage.removeItem(k));
			} catch {}
		}
	}
	/**
	* Check if cache exists and is fresh
	*/
	isFresh(key) {
		const memEntry = this.memoryCache.get(key);
		if (memEntry && Date.now() - memEntry.timestamp < memEntry.ttlMs) return true;
		return false;
	}
	/**
	* Get cache debug stats
	*/
	getStats() {
		return {
			memoryKeysCount: this.memoryCache.size,
			timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString("ko-KR")
		};
	}
};
var stockCache = new StockCacheManager();
//#endregion
//#region src/services/realStockRepository.ts
var RealStockRepository = class {
	constructor() {
		this.subscribers = /* @__PURE__ */ new Set();
		this.pollIntervalId = null;
		this.inFlightSearchRequests = /* @__PURE__ */ new Map();
		this.inFlightAllStocks = null;
		this.inFlightIndices = null;
		this.inFlightExchangeRate = null;
		this.inFlightBatchQuotes = /* @__PURE__ */ new Map();
		this.sharedTickES = null;
		this.tickListeners = /* @__PURE__ */ new Map();
		this.tickReconnectTimer = null;
		this.tickReconnectDelay = 2e3;
		this.sharedObES = null;
		this.obListeners = /* @__PURE__ */ new Map();
		this.obReconnectTimer = null;
		this.obReconnectDelay = 2e3;
		this.obFallbackIntervals = /* @__PURE__ */ new Map();
	}
	getSourceType() {
		return "REAL";
	}
	/**
	* 1. Get All Stocks from Backend
	*/
	async getAllStocks(forceRefresh = false) {
		const cacheKey = "real_stocks_all";
		if (!forceRefresh) {
			const cached = stockCache.get(cacheKey);
			if (cached && cached.length > 0) return cached;
		}
		if (this.inFlightAllStocks) return this.inFlightAllStocks;
		this.inFlightAllStocks = (async () => {
			try {
				const res = await fetch("/api/stocks", { headers: { "Accept": "application/json" } });
				if (!res.ok) throw new Error(`서버 응답 오류 (HTTP ${res.status})`);
				const contentType = res.headers.get("content-type");
				if (contentType && contentType.includes("application/json")) {
					const text = await res.text();
					try {
						const data = JSON.parse(text);
						if (Array.isArray(data) && data.length > 0) {
							stockCache.set(cacheKey, data, 5e3);
							return data;
						}
					} catch {
						console.warn("[RealStockRepository] /api/stocks JSON parse error, using fallback");
					}
				} else console.warn("[RealStockRepository] /api/stocks non-JSON response, using fallback");
			} catch (err) {
				console.warn("[RealStockRepository] /api/stocks fetch failed:", err);
			}
			return stockCache.get(cacheKey) || INITIAL_STOCKS;
		})().finally(() => {
			this.inFlightAllStocks = null;
		});
		return this.inFlightAllStocks;
	}
	/**
	* 2. Get Single Stock Details from Backend
	*/
	async getStock(symbol) {
		const cacheKey = `real_stock_${symbol}`;
		const cached = stockCache.get(cacheKey);
		if (cached && Array.isArray(cached.candles) && cached.candles.length > 0) return cached;
		try {
			const res = await fetch(`/api/stocks/${encodeURIComponent(symbol)}`);
			if (res.ok) {
				const contentType = res.headers.get("content-type");
				if (contentType && contentType.includes("application/json")) {
					const text = await res.text();
					try {
						const data = JSON.parse(text);
						if (data && data.symbol) {
							stockCache.set(cacheKey, data, 5e3);
							return data;
						}
					} catch {}
				}
			}
		} catch (err) {
			console.warn(`[RealStockRepository] /api/stocks/${symbol} failed:`, err);
		}
		if (cached) return cached;
		return (await this.getAllStocks()).find((s) => s.symbol === symbol);
	}
	/**
	* 2-1. Get Multiple Stocks Quotes by Symbols (Kiwoom Real Data)
	*/
	async getStocksBySymbols(symbols) {
		if (!symbols || symbols.length === 0) return [];
		const batchKey = symbols.join(",");
		const existing = this.inFlightBatchQuotes.get(batchKey);
		if (existing) return existing;
		const promise = (async () => {
			try {
				const res = await fetch(`/api/stocks/quotes?symbols=${encodeURIComponent(batchKey)}`);
				if (res.ok) {
					const contentType = res.headers.get("content-type");
					if (contentType && contentType.includes("application/json")) {
						const text = await res.text();
						try {
							const data = JSON.parse(text);
							if (Array.isArray(data) && data.length > 0) {
								for (const s of data) {
									const prev = stockCache.get(`real_stock_${s.symbol}`);
									stockCache.set(`real_stock_${s.symbol}`, prev?.candles?.length && (!s.candles || s.candles.length === 0) ? {
										...s,
										candles: prev.candles
									} : s, 5e3);
								}
								return data;
							}
						} catch {}
					}
				}
			} catch (err) {
				console.warn("[RealStockRepository] /api/stocks/quotes fetch failed:", err);
			}
			const all = await this.getAllStocks();
			return symbols.map((sym) => all.find((s) => s.symbol === sym)).filter((s) => Boolean(s));
		})().finally(() => {
			this.inFlightBatchQuotes.delete(batchKey);
		});
		this.inFlightBatchQuotes.set(batchKey, promise);
		return promise;
	}
	/**
	* 3. Search Stocks (L1 3s TTL cache + in-flight dedup + explicit error propagation)
	*/
	async searchStocks(options) {
		const q = options.query.trim();
		if (!q) return [];
		if (options.signal?.aborted) throw new DOMException("Aborted", "AbortError");
		const marketParam = (options.market || "ALL").toUpperCase();
		const limitParam = options.limit || 12;
		const cacheKey = `search_${q.toLowerCase()}_${marketParam}_${limitParam}`;
		const cached = stockCache.get(cacheKey);
		if (cached) return cached;
		const url = `/api/stocks/search?q=${encodeURIComponent(q)}${marketParam !== "ALL" ? `&market=${encodeURIComponent(marketParam)}` : ""}&limit=${limitParam}`;
		const runFetch = async (signal) => {
			const res = await fetch(url, {
				headers: { Accept: "application/json" },
				signal
			});
			if (!res.ok) {
				let msg = `검색 서버 오류 (HTTP ${res.status})`;
				try {
					const errBody = await res.json();
					if (errBody?.error) msg = errBody.error;
				} catch {}
				throw new Error(msg);
			}
			const results = await res.json();
			if (!Array.isArray(results)) throw new Error("검색 응답 데이터 형식이 올바르지 않습니다.");
			stockCache.set(cacheKey, results, 3e3);
			return results;
		};
		if (options.signal) return runFetch(options.signal);
		const existing = this.inFlightSearchRequests.get(cacheKey);
		if (existing) return existing;
		const pending = runFetch().finally(() => {
			this.inFlightSearchRequests.delete(cacheKey);
		});
		this.inFlightSearchRequests.set(cacheKey, pending);
		return pending;
	}
	/**
	* 4. Get Historical Chart Candles from Backend
	*/
	async getChartCandles(symbol, period) {
		const cacheKey = `real_candles_${symbol}_${period}`;
		const cached = stockCache.get(cacheKey);
		if (cached) return cached;
		try {
			const res = await fetch(`/api/stocks/${symbol}/chart?period=${period}`);
			if (res.ok) {
				const data = await res.json();
				if (data && Array.isArray(data.candles)) {
					stockCache.set(cacheKey, data.candles, 15e3);
					return data.candles;
				}
			}
		} catch (err) {
			console.error(`[RealStockRepository] fetch candles failed:`, err);
		}
		return [];
	}
	/**
	* 4-1. Get Real Chart with Metadata (candleType, date navigation, OHLCV)
	*/
	async getKiwoomChart(symbol, period, options) {
		const params = new URLSearchParams({ period });
		if (options?.candleType) params.set("candleType", options.candleType);
		if (options?.date?.trim()) params.set("date", options.date.trim());
		const res = await fetch(`/api/stocks/${encodeURIComponent(symbol)}/chart?${params.toString()}`, { signal: options?.signal });
		if (!res.ok) {
			const errData = await res.json().catch(() => ({}));
			throw new Error(errData.error || `HTTP ${res.status} 차트 조회 실패`);
		}
		return res.json();
	}
	/**
	* 5. Get Related News (Real News API)
	*/
	async getRelatedNews(symbol) {
		const cacheKey = `real_news_${symbol}`;
		const cached = stockCache.get(cacheKey);
		if (cached) return cached;
		try {
			const res = await fetch(`/api/news/stock/${symbol}?limit=10`);
			if (res.ok) {
				const data = await res.json();
				const newsItems = Array.isArray(data.items) ? data.items : Array.isArray(data) ? data : [];
				if (newsItems.length > 0) {
					stockCache.set(cacheKey, newsItems, 6e4);
					return newsItems;
				}
			}
		} catch (err) {
			console.error(`[RealStockRepository] getRelatedNews failed for ${symbol}:`, err);
		}
		return [];
	}
	/**
	* 6. Get Volume & Investor Breakdown
	*/
	async getVolumeAnalysis(symbol) {
		const cacheKey = `real_vol_${symbol}`;
		const cached = stockCache.get(cacheKey);
		if (cached) return cached;
		const [stock, flow] = await Promise.all([this.getStock(symbol), fetch(`/api/stocks/${encodeURIComponent(symbol)}/investor-flow?unit=both`, { headers: { Accept: "application/json" } }).then(async (res) => res.ok ? res.json() : null).catch(() => null)]);
		const volumeRatio = stock ? stock.volumeRatio : 120.5;
		const volume = stock ? stock.volume : 5e6;
		const avgVolume20d = Math.round(volume / (Math.max(10, volumeRatio) / 100));
		const avgVolume5d = Math.round(volume * .95);
		const tradingValue = stock ? stock.tradingValue : 2500;
		const executionStrength = stock ? stock.change >= 0 ? 118.5 : 84.2 : 105;
		const turnoverRatio = Number((volume / ((stock?.marketCap || 1e5) * 1e3) * 100).toFixed(2)) || 2.45;
		const foreignNetBuy = flow?.foreignNetBuy !== void 0 ? flow.foreignNetBuy : stock?.foreignNetBuy ?? null;
		const instNetBuy = flow?.instNetBuy !== void 0 ? flow.instNetBuy : stock?.instNetBuy ?? null;
		const individualNetBuy = flow?.individualNetBuy !== void 0 ? flow.individualNetBuy : stock?.individualNetBuy ?? null;
		const foreignNetBuyQty = flow?.foreignNetBuyQty ?? stock?.foreignNetBuyQty ?? null;
		const instNetBuyQty = flow?.instNetBuyQty ?? stock?.instNetBuyQty ?? null;
		const individualNetBuyQty = flow?.individualNetBuyQty ?? stock?.individualNetBuyQty ?? null;
		const hasAmountData = foreignNetBuy !== null && instNetBuy !== null;
		const hasQtyData = foreignNetBuyQty !== null && instNetBuyQty !== null;
		const investorDataAvailable = Boolean((flow?.investorDataAvailable ?? stock?.investorDataAvailable) && (hasAmountData || hasQtyData));
		const investorDataSource = flow?.investorDataSource || stock?.investorDataSource || (stock?.market === "US" ? "미국 시장 미지원" : stock?.market === "COIN" ? "가상자산 미지원" : "수급 데이터 미수신");
		const investorBaseDate = flow?.baseDate ?? stock?.investorBaseDate ?? void 0;
		const investorUpdateTime = flow?.updateTime ?? stock?.investorUpdateTime ?? void 0;
		const result = {
			volumeRatio,
			volume,
			avgVolume20d,
			avgVolume5d,
			tradingValue,
			executionStrength,
			turnoverRatio,
			foreignNetBuy,
			instNetBuy,
			individualNetBuy,
			foreignNetBuyAmountMillion: flow?.foreignNetBuyAmountMillion ?? stock?.foreignNetBuyAmountMillion ?? null,
			instNetBuyAmountMillion: flow?.instNetBuyAmountMillion ?? stock?.instNetBuyAmountMillion ?? null,
			individualNetBuyAmountMillion: flow?.individualNetBuyAmountMillion ?? stock?.individualNetBuyAmountMillion ?? null,
			foreignNetBuyQty,
			instNetBuyQty,
			individualNetBuyQty,
			investorUnit: flow?.investorUnit || stock?.investorUnit || "억원",
			investorQtyUnit: flow?.investorQtyUnit || stock?.investorQtyUnit || "주",
			investorDataSource,
			investorBaseDate,
			investorUpdateTime,
			investorDataAvailable,
			isDirectInvestorIndividual: Boolean(flow?.isDirectInvestorIndividual || individualNetBuy !== null || individualNetBuyQty !== null)
		};
		stockCache.set(cacheKey, result, 1e4);
		return result;
	}
	/**
	* 7. Get Indices from Backend
	*/
	async getIndices() {
		const cacheKey = "real_indices";
		const cached = stockCache.get(cacheKey);
		if (cached) return cached;
		if (this.inFlightIndices) return this.inFlightIndices;
		this.inFlightIndices = (async () => {
			try {
				const res = await fetch("/api/indices");
				if (res.ok) {
					const contentType = res.headers.get("content-type");
					if (contentType && contentType.includes("application/json")) {
						const text = await res.text();
						try {
							const data = JSON.parse(text);
							if (Array.isArray(data) && data.length > 0) {
								stockCache.set(cacheKey, data, 5e3);
								return data;
							}
						} catch {
							console.warn("[RealStockRepository] getIndices parse error.");
						}
					} else console.warn("[RealStockRepository] getIndices non-JSON response, using fallback.");
				}
			} catch (err) {
				console.warn("[RealStockRepository] getIndices failed:", err);
			}
			return stockCache.get(cacheKey) || INITIAL_INDICES;
		})().finally(() => {
			this.inFlightIndices = null;
		});
		return this.inFlightIndices;
	}
	/**
	* 8. Get Exchange Rate from Backend
	*/
	async getExchangeRate() {
		const cacheKey = "real_exchange_rate";
		const cached = stockCache.get(cacheKey);
		if (cached && cached.rate > 0 && !cached.isStale && cached.status !== "error") return cached;
		if (this.inFlightExchangeRate) return this.inFlightExchangeRate;
		const pending = (async () => {
			try {
				const res = await fetch("/api/exchange-rate");
				if (res.ok) {
					const contentType = res.headers.get("content-type");
					if (contentType && contentType.includes("application/json")) {
						const text = await res.text();
						try {
							const data = JSON.parse(text);
							if (data && typeof data.rate === "number" && !isNaN(data.rate)) {
								if (data.rate > 0 && !data.isStale && data.status !== "error") stockCache.set(cacheKey, data, 5e3);
								return data;
							}
						} catch {
							console.warn("[RealStockRepository] getExchangeRate parse error.");
						}
					} else console.warn("[RealStockRepository] getExchangeRate non-JSON response.");
				}
			} catch (err) {
				console.warn("[RealStockRepository] getExchangeRate failed:", err);
			}
			if (cached && cached.rate > 0) return {
				...cached,
				status: "stale",
				isStale: true,
				errorMessage: "환율 API 연결 실패로 만료된 최근 값을 유지합니다."
			};
			return {
				...INITIAL_EXCHANGE_RATE,
				status: "error",
				isStale: true,
				errorMessage: "환율 API 연결 실패"
			};
		})().finally(() => {
			this.inFlightExchangeRate = null;
		});
		this.inFlightExchangeRate = pending;
		return pending;
	}
	/**
	* Live Ticks Subscription with Visibility-Aware Polling from Backend
	*/
	subscribeTicks(callback) {
		this.subscribers.add(callback);
		if (!this.pollIntervalId) {
			let isPolling = false;
			this.pollIntervalId = setInterval(async () => {
				if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
				if (isPolling) return;
				isPolling = true;
				try {
					const freshStocks = await this.getAllStocks(true);
					this.subscribers.forEach((cb) => cb(freshStocks));
				} catch {} finally {
					isPolling = false;
				}
			}, 15e3);
		}
		return () => {
			this.subscribers.delete(callback);
			if (this.subscribers.size === 0 && this.pollIntervalId) {
				clearInterval(this.pollIntervalId);
				this.pollIntervalId = null;
			}
		};
	}
	ensureSharedTickSSE() {
		if (this.sharedTickES || this.tickListeners.size === 0 || typeof EventSource === "undefined") return;
		if (this.tickReconnectTimer) {
			clearTimeout(this.tickReconnectTimer);
			this.tickReconnectTimer = null;
		}
		try {
			const es = new EventSource("/api/stocks/ticks/stream");
			this.sharedTickES = es;
			es.onopen = () => {
				this.tickReconnectDelay = 2e3;
			};
			es.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);
					if (!data?.symbol) return;
					const callbacks = this.tickListeners.get(data.symbol);
					if (callbacks) callbacks.forEach((cb) => cb(data));
				} catch {}
			};
			es.onerror = () => {
				if (this.sharedTickES) {
					this.sharedTickES.close();
					this.sharedTickES = null;
				}
				if (this.tickListeners.size > 0 && !this.tickReconnectTimer) {
					const delay = this.tickReconnectDelay;
					this.tickReconnectDelay = Math.min(this.tickReconnectDelay * 1.5, 15e3);
					this.tickReconnectTimer = setTimeout(() => {
						this.tickReconnectTimer = null;
						this.ensureSharedTickSSE();
					}, delay);
				}
			};
		} catch {}
	}
	/**
	* Real-time single stock execution tick stream multiplexed over 1 shared EventSource
	*/
	subscribeExecutionTick(symbol, callback) {
		let set = this.tickListeners.get(symbol);
		const isFirstForSymbol = !set || set.size === 0;
		if (!set) {
			set = /* @__PURE__ */ new Set();
			this.tickListeners.set(symbol, set);
		}
		set.add(callback);
		if (isFirstForSymbol) fetch("/api/stocks/subscribe", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ symbol })
		}).catch(() => {});
		this.ensureSharedTickSSE();
		return () => {
			const callbacks = this.tickListeners.get(symbol);
			if (callbacks) {
				callbacks.delete(callback);
				if (callbacks.size === 0) {
					this.tickListeners.delete(symbol);
					fetch("/api/stocks/unsubscribe", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ symbol })
					}).catch(() => {});
				}
			}
			if (this.tickListeners.size === 0) {
				if (this.tickReconnectTimer) {
					clearTimeout(this.tickReconnectTimer);
					this.tickReconnectTimer = null;
				}
				if (this.sharedTickES) {
					this.sharedTickES.close();
					this.sharedTickES = null;
				}
			}
		};
	}
	/**
	* Fetch 10-level Order Book from Backend / Kiwoom API
	*/
	async getOrderBook(symbol) {
		try {
			const res = await fetch(`/api/stocks/${encodeURIComponent(symbol)}/orderbook`);
			if (res.ok) {
				const data = await res.json();
				if (data) return data;
			}
		} catch {}
		return {
			symbol,
			currentPrice: 0,
			asks: [],
			bids: [],
			totalAskVolume: 0,
			totalBidVolume: 0,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			status: "unavailable",
			dataSource: "unavailable"
		};
	}
	ensureSharedOrderBookSSE() {
		if (this.sharedObES || this.obListeners.size === 0 || typeof EventSource === "undefined") return;
		if (this.obReconnectTimer) {
			clearTimeout(this.obReconnectTimer);
			this.obReconnectTimer = null;
		}
		try {
			const es = new EventSource("/api/stocks/orderbook/stream");
			this.sharedObES = es;
			es.onopen = () => {
				this.obReconnectDelay = 2e3;
				for (const timer of this.obFallbackIntervals.values()) clearInterval(timer);
				this.obFallbackIntervals.clear();
			};
			es.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);
					if (!data?.symbol || !Array.isArray(data.asks) || data.asks.length === 0) return;
					const callbacks = this.obListeners.get(data.symbol);
					if (callbacks) callbacks.forEach((cb) => cb(data));
				} catch {}
			};
			es.onerror = () => {
				if (this.sharedObES) {
					this.sharedObES.close();
					this.sharedObES = null;
				}
				if (this.obListeners.size > 0 && !this.obReconnectTimer) {
					const delay = this.obReconnectDelay;
					this.obReconnectDelay = Math.min(this.obReconnectDelay * 1.5, 15e3);
					this.obReconnectTimer = setTimeout(() => {
						this.obReconnectTimer = null;
						this.ensureSharedOrderBookSSE();
					}, delay);
				}
			};
		} catch {}
	}
	/**
	* Real-time single stock order book stream multiplexed over 1 shared EventSource
	*/
	subscribeOrderBook(symbol, callback) {
		let set = this.obListeners.get(symbol);
		const isFirstForSymbol = !set || set.size === 0;
		if (!set) {
			set = /* @__PURE__ */ new Set();
			this.obListeners.set(symbol, set);
		}
		set.add(callback);
		if (isFirstForSymbol) fetch("/api/stocks/subscribe-orderbook", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ symbol })
		}).catch(() => {});
		this.ensureSharedOrderBookSSE();
		return () => {
			const callbacks = this.obListeners.get(symbol);
			if (callbacks) {
				callbacks.delete(callback);
				if (callbacks.size === 0) {
					this.obListeners.delete(symbol);
					const fallbackTimer = this.obFallbackIntervals.get(symbol);
					if (fallbackTimer) {
						clearInterval(fallbackTimer);
						this.obFallbackIntervals.delete(symbol);
					}
					fetch("/api/stocks/unsubscribe-orderbook", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ symbol })
					}).catch(() => {});
				}
			}
			if (this.obListeners.size === 0) {
				if (this.obReconnectTimer) {
					clearTimeout(this.obReconnectTimer);
					this.obReconnectTimer = null;
				}
				if (this.sharedObES) {
					this.sharedObES.close();
					this.sharedObES = null;
				}
			}
		};
	}
};
//#endregion
//#region src/utils/environment.ts
/**
* Environment detection utility for Google AI Studio Preview & Local development
*/
function isPreviewEnvironment() {
	if (typeof window === "undefined") return false;
	const hostname = window.location.hostname.toLowerCase();
	return hostname.includes("run.app") || hostname.includes("localhost") || hostname.includes("127.0.0.1") || hostname.includes("webcontainer") || hostname.includes("ais-dev-") || hostname.includes("ais-pre-") || hostname === "";
}
//#endregion
//#region src/services/stockRepository.ts
var StockRepositoryDelegator = class {
	constructor() {
		this.mockRepo = new MockStockRepository();
		this.realRepo = new RealStockRepository();
		this.activeSource = "REAL";
		console.log(`[StockRepository] Initialized with source: ${this.activeSource}`);
		try {
			localStorage.setItem("bd_stock_data_source", this.activeSource);
		} catch {}
	}
	isPreview() {
		return isPreviewEnvironment();
	}
	get activeRepo() {
		return this.activeSource === "REAL" ? this.realRepo : this.mockRepo;
	}
	getSourceType() {
		return this.activeSource;
	}
	getCurrentSource() {
		return this.activeSource;
	}
	setSource(source) {
		this.activeSource = source;
		try {
			localStorage.setItem("bd_stock_data_source", source);
		} catch {}
	}
	getAllStocks(forceRefresh) {
		return this.activeRepo.getAllStocks(forceRefresh);
	}
	getStock(symbol) {
		return this.activeRepo.getStock(symbol);
	}
	searchStocks(options) {
		return this.activeRepo.searchStocks(options);
	}
	getStocksBySymbols(symbols) {
		if (this.activeRepo.getStocksBySymbols) return this.activeRepo.getStocksBySymbols(symbols);
		return Promise.resolve([]);
	}
	getChartCandles(symbol, period) {
		return this.activeRepo.getChartCandles(symbol, period);
	}
	getKiwoomChart(symbol, period, options) {
		if (this.activeRepo.getKiwoomChart) return this.activeRepo.getKiwoomChart(symbol, period, options);
		return Promise.resolve({
			symbol,
			period,
			periodLabel: period,
			candleType: options?.candleType,
			trId: period === "day" ? "ka10081" : "ka10080",
			supported: true,
			candles: [],
			source: "kiwoom",
			cached: false,
			timestamp: Date.now(),
			error: null
		});
	}
	getRelatedNews(symbol) {
		return this.activeRepo.getRelatedNews(symbol);
	}
	getVolumeAnalysis(symbol) {
		return this.activeRepo.getVolumeAnalysis(symbol);
	}
	getIndices() {
		return this.activeRepo.getIndices();
	}
	getExchangeRate() {
		return this.activeRepo.getExchangeRate();
	}
	subscribeTicks(callback) {
		return this.activeRepo.subscribeTicks(callback);
	}
	subscribeExecutionTick(symbol, callback) {
		if (this.activeRepo.subscribeExecutionTick) return this.activeRepo.subscribeExecutionTick(symbol, callback);
		return () => {};
	}
	getOrderBook(symbol) {
		if (this.activeRepo.getOrderBook) return this.activeRepo.getOrderBook(symbol);
		return Promise.resolve({
			symbol,
			currentPrice: 7e4,
			asks: [],
			bids: [],
			totalAskVolume: 0,
			totalBidVolume: 0
		});
	}
	subscribeOrderBook(symbol, callback) {
		if (this.activeRepo.subscribeOrderBook) return this.activeRepo.subscribeOrderBook(symbol, callback);
		return () => {};
	}
};
var stockRepository = new StockRepositoryDelegator();
//#endregion
//#region src/services/notificationService.ts
var NotificationService = class {
	async getUserAlertRules(uid) {
		try {
			const targetUid = uid || auth.currentUser?.uid || "demo-user-1";
			const res = await fetch(`/api/user-alerts?uid=${targetUid}`);
			if (res.ok) return await res.json();
		} catch (err) {
			console.warn("[NotificationService] Fetch user alerts failed, checking Firestore:", err);
		}
		try {
			if (auth.currentUser) {
				const q = query(collection(db, "alerts"), where("uid", "==", auth.currentUser.uid));
				const snap = await getDocs(q);
				const rules = [];
				snap.forEach((d) => {
					const data = d.data();
					rules.push({
						id: d.id,
						uid: data.uid,
						symbol: data.symbol,
						symbolName: data.symbolName || data.symbol,
						type: data.type,
						value: data.value,
						condition: data.condition,
						enabled: data.enabled ?? true,
						createdAt: data.createdAt
					});
				});
				if (rules.length > 0) return rules;
			}
		} catch {}
		return [];
	}
	async addUserAlertRule(rule) {
		const targetUid = rule.uid || auth.currentUser?.uid || "demo-user-1";
		const payload = {
			...rule,
			uid: targetUid
		};
		let createdRule = null;
		try {
			const res = await fetch("/api/user-alerts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload)
			});
			if (res.ok) createdRule = await res.json();
		} catch (err) {
			console.warn("[NotificationService] Post user alert rule failed:", err);
		}
		if (!createdRule) createdRule = {
			...payload,
			id: `rule_${Date.now()}`,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		try {
			if (auth.currentUser) {
				const alertDocRef = doc(collection(db, "alerts"), createdRule.id);
				await setDoc(alertDocRef, {
					id: createdRule.id,
					uid: auth.currentUser.uid,
					symbol: createdRule.symbol,
					symbolName: createdRule.symbolName,
					type: createdRule.type,
					value: createdRule.value,
					condition: createdRule.condition || "above",
					enabled: createdRule.enabled,
					createdAt: createdRule.createdAt
				});
			}
		} catch (err) {
			console.warn("[NotificationService] Firestore sync alert failed:", err);
		}
		return createdRule;
	}
	async updateUserAlertRule(id, updates) {
		try {
			const res = await fetch(`/api/user-alerts/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updates)
			});
			if (res.ok) return await res.json();
		} catch (err) {
			console.warn("[NotificationService] Update alert rule failed:", err);
		}
		try {
			if (auth.currentUser) {
				const ref = doc(db, "alerts", id);
				await updateDoc(ref, updates);
			}
		} catch {}
		return null;
	}
	async deleteUserAlertRule(id) {
		try {
			const res = await fetch(`/api/user-alerts/${id}`, { method: "DELETE" });
			if (res.ok) return (await res.json()).success;
		} catch (err) {
			console.warn("[NotificationService] Delete alert rule failed:", err);
		}
		try {
			if (auth.currentUser) {
				await deleteDoc(doc(db, "alerts", id));
				return true;
			}
		} catch {}
		return false;
	}
	async getNotifications(uid) {
		const targetUid = uid || auth.currentUser?.uid || "demo-user-1";
		try {
			const res = await fetch(`/api/notifications?uid=${targetUid}`);
			if (res.ok) return await res.json();
		} catch (err) {
			console.warn("[NotificationService] Fetch notifications failed:", err);
		}
		try {
			if (auth.currentUser) {
				const q = query(collection(db, "notifications"), where("uid", "==", auth.currentUser.uid), orderBy("createdAt", "desc"), limit(40));
				const snap = await getDocs(q);
				const notifs = [];
				snap.forEach((d) => {
					const data = d.data();
					notifs.push({
						id: d.id,
						uid: data.uid,
						alertId: data.alertId,
						type: data.type,
						title: data.title,
						message: data.message,
						stockSymbol: data.stockSymbol,
						stockName: data.stockName,
						targetType: data.targetType || "stock",
						read: data.read ?? false,
						createdAt: data.createdAt,
						timestamp: new Date(data.createdAt).toLocaleTimeString("ko-KR", {
							hour: "2-digit",
							minute: "2-digit"
						})
					});
				});
				if (notifs.length > 0) return notifs;
			}
		} catch {}
		return [];
	}
	async markAsRead(id) {
		try {
			const res = await fetch(`/api/notifications/${id}/read`, { method: "POST" });
			let updated = null;
			if (res.ok) updated = await res.json();
			try {
				const ref = doc(db, "notifications", id);
				await updateDoc(ref, {
					read: true,
					readAt: (/* @__PURE__ */ new Date()).toISOString()
				});
			} catch {}
			return updated;
		} catch (err) {
			console.warn("[NotificationService] Mark read failed:", err);
		}
		return null;
	}
	async markAllAsRead(uid) {
		const targetUid = uid || auth.currentUser?.uid || "demo-user-1";
		let count = 0;
		try {
			const res = await fetch("/api/notifications/read-all", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ uid: targetUid })
			});
			if (res.ok) count = (await res.json()).count || 0;
		} catch (err) {
			console.warn("[NotificationService] Mark all read failed:", err);
		}
		try {
			const q = query(collection(db, "notifications"), where("uid", "==", targetUid), where("read", "==", false));
			const batchPromises = (await getDocs(q)).docs.map((d) => updateDoc(d.ref, {
				read: true,
				readAt: (/* @__PURE__ */ new Date()).toISOString()
			}).catch(() => {}));
			await Promise.all(batchPromises);
		} catch {}
		return count;
	}
	async deleteNotification(id) {
		try {
			const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
			let success = false;
			if (res.ok) success = (await res.json()).success;
			try {
				await deleteDoc(doc(db, "notifications", id));
			} catch {}
			return success;
		} catch (err) {
			console.warn("[NotificationService] Delete notification failed:", err);
		}
		return false;
	}
	async syncWatchlistForMonitoring(uid, watchlist) {
		const targetUid = uid || auth.currentUser?.uid || "demo-user-1";
		if (!watchlist || watchlist.length === 0) return;
		try {
			await fetch("/api/user-alerts/watchlist", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					uid: targetUid,
					watchlist
				})
			});
		} catch (err) {
			console.warn("[NotificationService] Sync watchlist failed:", err);
		}
	}
	async triggerServerCheck(uid, watchlist) {
		const targetUid = uid || auth.currentUser?.uid || "demo-user-1";
		try {
			const res = await fetch("/api/user-alerts/check-now", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					uid: targetUid,
					watchlist
				})
			});
			if (res.ok) return await res.json();
		} catch (err) {
			console.warn("[NotificationService] triggerServerCheck failed:", err);
		}
		return null;
	}
	async createNotification(title, message, type = "SYSTEM", stockSymbol, uid, stockName) {
		const targetUid = uid || auth.currentUser?.uid || "demo-user-1";
		const newNotif = {
			id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
			uid: targetUid,
			type,
			title,
			message,
			stockSymbol,
			stockName,
			targetType: stockSymbol ? "stock" : "general",
			read: false,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString("ko-KR", {
				hour: "2-digit",
				minute: "2-digit"
			})
		};
		try {
			await fetch("/api/notifications", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newNotif)
			});
		} catch {}
		try {
			if (auth.currentUser) {
				const notifDocRef = doc(collection(db, "notifications"), newNotif.id);
				await setDoc(notifDocRef, newNotif);
			}
		} catch (err) {
			console.warn("[NotificationService] Firestore save error:", err);
		}
		return newNotif;
	}
};
var notificationService = new NotificationService();
//#endregion
//#region src/services/fcmPushService.ts
/**
* Client-Side Firebase Cloud Messaging (FCM) & Web Push Notification Service
* 
* Features:
* - PWA Service Worker Registration (/firebase-messaging-sw.js)
* - FCM Token generation & synchronization with backend per UID
* - Master Push ON/OFF Toggle
* - Platform detection (Android PWA, iPhone iOS 16.4+ Home Screen PWA, Web)
* - Invalidation of tokens on logout (prevents previous account push receipt)
* - Real-time foreground message handling
*/
var FcmPushService = class {
	constructor() {
		this.messaging = null;
		this.isInitAttempted = false;
		this.onMessageUnsubscribe = null;
	}
	/**
	* Check if running as installed standalone PWA
	*/
	isPwaStandalone() {
		if (typeof window === "undefined") return false;
		return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true || document.referrer.includes("android-app://");
	}
	/**
	* Detect current device platform
	*/
	getPlatform() {
		if (typeof navigator === "undefined") return "web";
		const ua = navigator.userAgent || "";
		if (/android/i.test(ua)) return "android";
		if (/iphone|ipad|ipod/i.test(ua)) return "ios";
		return "web";
	}
	/**
	* Check if Web Push / Notification is supported in this browser
	*/
	async isSupported() {
		if (typeof window === "undefined" || typeof navigator === "undefined") return false;
		if (!("serviceWorker" in navigator && "PushManager" in window && "Notification" in window)) return false;
		try {
			return await isWindowSupported();
		} catch {
			return false;
		}
	}
	/**
	* Get current push status
	*/
	async getStatus(uid) {
		const supported = await this.isSupported();
		const permission = typeof window !== "undefined" && "Notification" in window ? Notification.permission : "denied";
		const cachedToken = typeof localStorage !== "undefined" ? localStorage.getItem("fcm_token") : null;
		let serverEnabled = typeof localStorage !== "undefined" ? localStorage.getItem("fcm_push_enabled") !== "false" : true;
		if (uid) try {
			const res = await fetch(`/api/fcm/settings?uid=${encodeURIComponent(uid)}`);
			if (res.ok) serverEnabled = (await res.json()).pushEnabled !== false;
		} catch {}
		return {
			supported,
			permission,
			token: cachedToken,
			enabled: serverEnabled && permission === "granted",
			platform: this.getPlatform(),
			isPwa: this.isPwaStandalone()
		};
	}
	/**
	* Initialize messaging instance
	*/
	async getMessagingInstance() {
		if (this.messaging) return this.messaging;
		if (!await this.isSupported()) return null;
		try {
			this.messaging = getMessagingInWindow(app);
			return this.messaging;
		} catch (err) {
			console.warn("[FcmPushService] Failed to getMessaging:", err);
			return null;
		}
	}
	/**
	* Request notification permission and register FCM Web Push token
	*/
	async enablePush(uid) {
		if (!uid) return {
			success: false,
			error: "로그인이 필요한 기능입니다."
		};
		if (!await this.isSupported()) return {
			success: false,
			error: "현재 브라우저 또는 환경에서 웹 푸시가 지원되지 않습니다. (iPhone의 경우 사파리 홈 화면에 추가 후 이용해주세요)"
		};
		try {
			if (await Notification.requestPermission() !== "granted") return {
				success: false,
				error: "알림 권한이 거부되었습니다. 브라우저 설정에서 알림을 허용해주세요."
			};
			let swRegistration;
			if ("serviceWorker" in navigator) try {
				swRegistration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", { scope: "/" });
				await navigator.serviceWorker.ready;
				console.log("[FcmPushService] ServiceWorker registered with scope:", swRegistration.scope);
			} catch (swErr) {
				console.warn("[FcmPushService] ServiceWorker registration warning:", swErr);
			}
			const messaging = await this.getMessagingInstance();
			if (!messaging) return {
				success: false,
				error: "Firebase Messaging 인스턴스를 초기화할 수 없습니다."
			};
			const token = await getToken(messaging, { serviceWorkerRegistration: swRegistration });
			if (!token) return {
				success: false,
				error: "FCM 토큰을 발급받지 못했습니다."
			};
			console.log("[FcmPushService] FCM Token obtained:", token.substring(0, 15) + "...");
			const platform = this.getPlatform();
			const res = await fetch("/api/fcm/token", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					uid,
					token,
					device: platform,
					userAgent: navigator.userAgent
				})
			});
			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				throw new Error(errData.error || "서버 토큰 등록 실패");
			}
			await fetch("/api/fcm/settings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					uid,
					pushEnabled: true
				})
			});
			localStorage.setItem("fcm_token", token);
			localStorage.setItem("fcm_uid", uid);
			localStorage.setItem("fcm_push_enabled", "true");
			this.listenToForegroundMessages();
			return {
				success: true,
				token
			};
		} catch (err) {
			console.error("[FcmPushService] enablePush error:", err);
			return {
				success: false,
				error: err.message || "푸시 등록 중 오류가 발생했습니다."
			};
		}
	}
	/**
	* Disable push notifications for this user (Master toggle OFF)
	*/
	async disablePush(uid) {
		try {
			localStorage.setItem("fcm_push_enabled", "false");
			if (uid) await fetch("/api/fcm/settings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					uid,
					pushEnabled: false
				})
			});
			return { success: true };
		} catch (err) {
			console.warn("[FcmPushService] disablePush error:", err);
			return { success: false };
		}
	}
	/**
	* Invalidate and delete FCM token upon logout
	* Strictly prevents previous account notifications from reaching this device.
	*/
	async invalidateOnLogout(uid) {
		try {
			const cachedToken = localStorage.getItem("fcm_token");
			const targetUid = uid || localStorage.getItem("fcm_uid");
			if (this.messaging) try {
				await deleteToken(this.messaging);
			} catch (e) {
				console.warn("[FcmPushService] deleteToken error:", e);
			}
			if (targetUid) await fetch("/api/fcm/token/invalidate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					uid: targetUid,
					token: cachedToken
				})
			}).catch(() => {});
			localStorage.removeItem("fcm_token");
			localStorage.removeItem("fcm_uid");
			console.log("[FcmPushService] Token invalidated on logout for UID:", targetUid);
		} catch (err) {
			console.warn("[FcmPushService] Error during logout token invalidation:", err);
		}
	}
	/**
	* Trigger a test push notification to verify delivery
	*/
	async triggerTestPush(uid) {
		try {
			const data = await (await fetch("/api/fcm/test-push", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ uid })
			})).json();
			return {
				success: data.success,
				message: data.message || (data.success ? "테스트 푸시가 발송되었습니다." : "푸시 발송 실패")
			};
		} catch (err) {
			return {
				success: false,
				message: err.message || "네트워크 오류"
			};
		}
	}
	/**
	* Setup real-time foreground message receiver
	*/
	listenToForegroundMessages(onReceive) {
		if (this.onMessageUnsubscribe) return;
		this.getMessagingInstance().then((messaging) => {
			if (!messaging) return;
			this.onMessageUnsubscribe = onMessage(messaging, (payload) => {
				console.log("[FcmPushService] Foreground push received:", payload);
				if ("Notification" in window && Notification.permission === "granted") {
					const title = payload.notification?.title || payload.data?.title || "병돌 인베스트먼트";
					const options = {
						body: payload.notification?.body || payload.data?.body || payload.data?.message || "실시간 알림이 도착했습니다.",
						icon: "/icons/icon-192x192.png",
						badge: "/icons/icon-192x192.png",
						tag: payload.data?.stockSymbol || "byeongdol-alert"
					};
					try {
						new Notification(title, options);
					} catch {}
				}
				if (onReceive) onReceive(payload);
			});
		});
	}
};
var fcmPushService = new FcmPushService();
//#endregion
//#region node_modules/@capacitor-firebase/crashlytics/dist/esm/index.js
var FirebaseCrashlytics = registerPlugin("FirebaseCrashlytics", { web: () => __vitePreload(() => import("./web-BarACGmv.js").then((m) => new m.FirebaseCrashlyticsWeb()), __vite__mapDeps([0,1])) });
//#endregion
//#region src/services/crashlyticsService.ts
/**
* Global Error Reporting Service using Firebase Crashlytics
* Monitors and logs runtime exceptions, Promise rejections, and React component crashes
* across production Android and iOS native environments.
*/
var CrashlyticsService = class {
	constructor() {
		this.isInitialized = false;
		this.isNative = false;
		this.isNative = typeof window !== "undefined" && Boolean(Capacitor?.isNativePlatform?.());
	}
	/**
	* Initializes Firebase Crashlytics, enables automatic crash collection on native platforms,
	* sends pending reports, and attaches global unhandled exception listeners.
	*/
	async init() {
		if (this.isInitialized) return;
		this.isInitialized = true;
		try {
			if (this.isNative) {
				await FirebaseCrashlytics.setEnabled({ enabled: true });
				if ((await FirebaseCrashlytics.didCrashOnPreviousExecution()).crashed) {
					console.warn("[Crashlytics] Detected crash on previous execution, uploading unsent reports...");
					await FirebaseCrashlytics.sendUnsentReports();
				}
				await this.setCustomKey("app_name", "byeongdol-investment");
				await this.setCustomKey("app_version", "1.0.0");
				await this.setCustomKey("platform", Capacitor.getPlatform());
				await this.setCustomKey("environment", "production");
				await FirebaseCrashlytics.log({ message: "Firebase Crashlytics initialized successfully" });
			}
		} catch (err) {
			console.warn("[Crashlytics] Native initialization notice:", err);
		}
		this.attachGlobalListeners();
	}
	/**
	* Records a non-fatal exception to Firebase Crashlytics with optional context.
	*/
	async recordException(error, context) {
		const errorMessage = error instanceof Error ? `${error.name}: ${error.message}\n${error.stack || ""}` : typeof error === "string" ? error : JSON.stringify(error);
		if (errorMessage.includes("WebSocket") || errorMessage.includes("24678") || errorMessage.includes("@vite/client") || errorMessage.includes("closed without opened") || errorMessage.includes("ResizeObserver")) return;
		console.error("[GlobalErrorReporter]", errorMessage, context || "");
		if (!this.isNative) return;
		try {
			if (context) for (const [key, val] of Object.entries(context)) await this.setCustomKey(key, val);
			await FirebaseCrashlytics.recordException({ message: errorMessage });
		} catch (err) {
			console.warn("[Crashlytics] Failed to record exception:", err);
		}
	}
	/**
	* Identifies the current logged-in user in Crashlytics reports.
	*/
	async setUserId(userId) {
		if (!this.isNative) return;
		try {
			await FirebaseCrashlytics.setUserId({ userId: userId || "anonymous" });
		} catch (err) {
			console.warn("[Crashlytics] Failed to set user ID:", err);
		}
	}
	/**
	* Sets a diagnostic key-value pair in Crashlytics.
	*/
	async setCustomKey(key, value) {
		if (!this.isNative) return;
		try {
			let type = "string";
			if (typeof value === "boolean") type = "boolean";
			else if (typeof value === "number") type = Number.isInteger(value) ? "int" : "double";
			await FirebaseCrashlytics.setCustomKey({
				key,
				value,
				type
			});
		} catch (err) {
			console.warn(`[Crashlytics] Failed to set custom key "${key}":`, err);
		}
	}
	/**
	* Logs a contextual breadcrumb event leading up to a potential error.
	*/
	async logBreadcrumb(message) {
		if (!this.isNative) return;
		try {
			await FirebaseCrashlytics.log({ message });
		} catch (err) {
			console.warn("[Crashlytics] Failed to log breadcrumb:", err);
		}
	}
	/**
	* Attaches unhandled window and promise error listeners.
	*/
	attachGlobalListeners() {
		if (typeof window === "undefined") return;
		window.addEventListener("error", (event) => {
			const err = event.error || event.message;
			this.recordException(err, {
				filename: event.filename || "unknown",
				lineno: event.lineno || 0,
				colno: event.colno || 0,
				type: "uncaught_window_error"
			});
		});
		window.addEventListener("unhandledrejection", (event) => {
			const reason = event.reason;
			this.recordException(reason || "Unhandled Promise Rejection", { type: "unhandled_promise_rejection" });
		});
	}
};
var crashlyticsService = new CrashlyticsService();
//#endregion
//#region src/context/AppContext.tsx
var import_jsx_runtime = require_jsx_runtime();
var AppContext = (0, import_react.createContext)(void 0);
var AppProvider = ({ children }) => {
	const [isDark, setIsDark] = (0, import_react.useState)(() => {
		try {
			const saved = localStorage.getItem("bd_theme");
			if (saved) return saved === "dark";
			return true;
		} catch {
			return true;
		}
	});
	(0, import_react.useEffect)(() => {
		const root = document.documentElement;
		if (isDark) {
			root.classList.add("dark");
			root.style.backgroundColor = "#171D26";
			localStorage.setItem("bd_theme", "dark");
		} else {
			root.classList.remove("dark");
			root.style.backgroundColor = "#F3F5F7";
			localStorage.setItem("bd_theme", "light");
		}
	}, [isDark]);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined" || !window.matchMedia) return;
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleMediaChange = (e) => {
			if (!localStorage.getItem("bd_theme")) setIsDark(e.matches);
		};
		mediaQuery.addEventListener("change", handleMediaChange);
		return () => mediaQuery.removeEventListener("change", handleMediaChange);
	}, []);
	const toggleTheme = (0, import_react.useCallback)(() => setIsDark((prev) => !prev), []);
	const [activeTab, setActiveTabState] = (0, import_react.useState)("home");
	const [selectedSymbol, setSelectedSymbol] = (0, import_react.useState)(null);
	const [selectedIndexSymbol, setSelectedIndexSymbol] = (0, import_react.useState)(null);
	const [selectedPostId, setSelectedPostId] = (0, import_react.useState)(null);
	const [communityAuthorFilter, setCommunityAuthorFilter] = (0, import_react.useState)(null);
	const [publicRoute, setPublicRoute] = (0, import_react.useState)(null);
	const navigateToStaticPage = (0, import_react.useCallback)((page) => {
		setPublicRoute({
			type: "static",
			staticPage: page
		});
		setSelectedSymbol(null);
		setSelectedIndexSymbol(null);
		setSelectedPostId(null);
		window.history.pushState({ staticPage: page }, "", `/${page}`);
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
		crashlyticsService.logBreadcrumb(`User navigated to static policy: ${page}`);
	}, []);
	const navigateToInsights = (0, import_react.useCallback)((category, articleId) => {
		setPublicRoute({
			type: "insights",
			insightCategory: category,
			insightArticleId: articleId
		});
		setSelectedSymbol(null);
		setSelectedIndexSymbol(null);
		setSelectedPostId(null);
		const path = articleId ? `/insights/${articleId}` : category ? `/insights/${category}` : "/insights";
		window.history.pushState({
			category,
			articleId
		}, "", path);
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
		crashlyticsService.logBreadcrumb(`User navigated to insights: ${path}`);
	}, []);
	const clearPublicRoute = (0, import_react.useCallback)(() => {
		setPublicRoute(null);
		setActiveTabState("home");
		window.history.pushState(null, "", "/");
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}, []);
	const setActiveTab = (0, import_react.useCallback)((tab) => {
		setPublicRoute(null);
		setActiveTabState(tab);
		setSelectedIndexSymbol(null);
		setSelectedSymbol(null);
		if (tab !== "community") setSelectedPostId(null);
		window.history.pushState(null, "", `/${tab === "home" ? "" : tab}`);
		crashlyticsService.setCustomKey("active_tab", tab);
		crashlyticsService.logBreadcrumb(`User navigated to tab: ${tab}`);
	}, []);
	const [activeRoomId, setActiveRoomId] = (0, import_react.useState)("domestic");
	const [chatMessages, setChatMessages] = (0, import_react.useState)([]);
	const [chatMessageLimit, setChatMessageLimit] = (0, import_react.useState)(50);
	const [activeChatConsumers, setActiveChatConsumers] = (0, import_react.useState)(0);
	const registerChatConsumer = (0, import_react.useCallback)(() => {
		setActiveChatConsumers((c) => c + 1);
		return () => setActiveChatConsumers((c) => Math.max(0, c - 1));
	}, []);
	const handleSetActiveRoomId = (0, import_react.useCallback)((roomId) => {
		setActiveRoomId(roomId);
		setChatMessageLimit(50);
	}, []);
	const loadMoreChatMessages = (0, import_react.useCallback)(() => {
		setChatMessageLimit((prev) => prev + 30);
	}, []);
	const navigateToStock = (0, import_react.useCallback)((symbol) => {
		setPublicRoute(null);
		setSelectedSymbol(symbol);
		setSelectedIndexSymbol(null);
		setActiveTabState("stocks");
		window.history.pushState({ symbol }, "", `/stocks/${symbol}`);
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}, []);
	const navigateToIndex = (0, import_react.useCallback)((symbol) => {
		setPublicRoute(null);
		setSelectedIndexSymbol(symbol);
		setSelectedSymbol(null);
		setSelectedPostId(null);
		window.history.pushState({ indexSymbol: symbol }, "", `/indices/${symbol}`);
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}, []);
	const clearSelectedIndex = (0, import_react.useCallback)(() => {
		setSelectedIndexSymbol(null);
		if (window.history.length > 1) window.history.back();
		else setActiveTab("home");
	}, [setActiveTab]);
	const navigateToPostList = (0, import_react.useCallback)(() => {
		setPublicRoute(null);
		setSelectedPostId(null);
		setSelectedIndexSymbol(null);
		setActiveTabState("community");
		window.history.pushState(null, "", "/community");
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}, []);
	const navigateToPost = (0, import_react.useCallback)((postId) => {
		setPublicRoute(null);
		setSelectedPostId(postId);
		setSelectedIndexSymbol(null);
		setActiveTabState("community");
		window.history.pushState({ postId }, "", `/community?post=${postId}`);
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}, []);
	(0, import_react.useEffect)(() => {
		const handleUrlRoute = () => {
			const pathname = window.location.pathname;
			const search = window.location.search;
			const params = new URLSearchParams(search);
			const cleanPath = pathname.replace(/^\//, "").split("/")[0];
			if ([
				"about",
				"privacy",
				"terms",
				"disclaimer",
				"contact"
			].includes(cleanPath)) {
				setPublicRoute({
					type: "static",
					staticPage: cleanPath
				});
				setSelectedSymbol(null);
				setSelectedIndexSymbol(null);
				setSelectedPostId(null);
				return;
			}
			if (cleanPath === "insights") {
				const sub = pathname.split("/").filter(Boolean)[1];
				if (sub && [
					"domestic-market",
					"us-market",
					"economy"
				].includes(sub)) setPublicRoute({
					type: "insights",
					insightCategory: sub
				});
				else if (sub) setPublicRoute({
					type: "insights",
					insightArticleId: sub
				});
				else setPublicRoute({ type: "insights" });
				setSelectedSymbol(null);
				setSelectedIndexSymbol(null);
				setSelectedPostId(null);
				return;
			}
			setPublicRoute(null);
			const indexMatch = pathname.match(/\/indices\/([A-Za-z]+)/i);
			if (indexMatch && (indexMatch[1].toUpperCase() === "KOSPI" || indexMatch[1].toUpperCase() === "KOSDAQ")) {
				setSelectedIndexSymbol(indexMatch[1].toUpperCase());
				setSelectedSymbol(null);
				setSelectedPostId(null);
				return;
			} else setSelectedIndexSymbol(null);
			const stockMatch = pathname.match(/\/stocks\/([0-9A-Za-z.\-_:]+)/);
			if (stockMatch && stockMatch[1]) {
				setSelectedSymbol(stockMatch[1]);
				setActiveTabState("stocks");
				return;
			} else setSelectedSymbol(null);
			const postParam = params.get("post");
			if (pathname.startsWith("/community")) {
				setActiveTabState("community");
				if (postParam) setSelectedPostId(postParam);
				else setSelectedPostId(null);
				return;
			}
			if ([
				"home",
				"stocks",
				"ranking",
				"watchlist",
				"community",
				"chat",
				"alerts",
				"insight",
				"profile",
				"news",
				"admin"
			].includes(cleanPath)) {
				setActiveTabState(cleanPath);
				setSelectedPostId(null);
			} else if (!cleanPath) {
				setActiveTabState("home");
				setSelectedPostId(null);
			}
		};
		handleUrlRoute();
		window.addEventListener("popstate", handleUrlRoute);
		return () => window.removeEventListener("popstate", handleUrlRoute);
	}, []);
	const navigateToMyPosts = () => {
		if (!user) {
			requireAuth("내 게시글 확인");
			return;
		}
		setCommunityAuthorFilter(user.id);
		setActiveTab("community");
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};
	const [stocks, setStocks] = (0, import_react.useState)(INITIAL_STOCKS);
	const [indices, setIndices] = (0, import_react.useState)(INITIAL_INDICES);
	const [exchangeRate, setExchangeRate] = (0, import_react.useState)(INITIAL_EXCHANGE_RATE);
	const [isSimulatingLiveTicks, setIsSimulatingLiveTicks] = (0, import_react.useState)(true);
	const [stockDataSource, setStockDataSource] = (0, import_react.useState)(() => stockRepository.getCurrentSource());
	const [isStockLoading, setIsStockLoading] = (0, import_react.useState)(false);
	const [realtimeStatus, setRealtimeStatus] = (0, import_react.useState)("connecting");
	const checkRealtimeConnection = async () => {
		setRealtimeStatus("connecting");
		isPreviewEnvironment();
		try {
			const res = await fetch("/api/kiwoom/test");
			if (res.ok) {
				const data = await res.json();
				if (data.configured && data.diagnostics?.tokenTest?.success) setRealtimeStatus("connected");
				else setRealtimeStatus("failed");
			} else setRealtimeStatus("failed");
		} catch {
			setRealtimeStatus("failed");
		}
	};
	(0, import_react.useEffect)(() => {
		checkRealtimeConnection();
	}, [stockDataSource]);
	const toggleStockDataSource = async () => {
		if (isPreviewEnvironment() && stockDataSource === "MOCK") {
			showToast("AI 스튜디오 미리보기 환경에서는 키움 고정 IP 검증 실패 방지를 위해 [시뮬레이션 데이터 모드]로 안전하게 유지됩니다.", "info");
			return;
		}
		const nextSource = stockDataSource === "REAL" ? "MOCK" : "REAL";
		setIsStockLoading(true);
		stockRepository.setSource(nextSource);
		setStockDataSource(nextSource);
		try {
			const freshStocks = await stockRepository.getAllStocks(true);
			if (freshStocks && freshStocks.length > 0) setStocks(freshStocks);
			const freshIndices = await stockRepository.getIndices();
			if (freshIndices && freshIndices.length > 0) setIndices(freshIndices);
			const freshExchange = await stockRepository.getExchangeRate();
			if (freshExchange) setExchangeRate(freshExchange);
			showToast(nextSource === "REAL" ? "데이터 공급원이 [실제 주식 API (REAL)]로 전환되었습니다." : "데이터 공급원이 [시뮬레이션 데이터 모드]로 전환되었습니다.", "info");
		} catch {
			showToast("데이터 공급원 전환 중 오류가 발생했습니다.", "error");
		} finally {
			setIsStockLoading(false);
		}
	};
	const [firebaseUser, setFirebaseUser] = (0, import_react.useState)(null);
	const [user, setUser] = (0, import_react.useState)(null);
	const [isAuthLoading, setIsAuthLoading] = (0, import_react.useState)(true);
	const [isAuthModalOpen, setIsAuthModalOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!firebaseUser) {
			setChatMessages([]);
			return;
		}
		if (activeTab !== "chat" && activeChatConsumers === 0) return;
		const unsubscribe = firebaseRepository.subscribeChat(activeRoomId, (messages) => {
			setChatMessages(dedupeById(messages));
		}, chatMessageLimit);
		return () => unsubscribe();
	}, [
		firebaseUser,
		activeRoomId,
		chatMessageLimit,
		activeTab,
		activeChatConsumers
	]);
	(0, import_react.useEffect)(() => {
		if (user?.id) {
			crashlyticsService.setUserId(user.id);
			crashlyticsService.setCustomKey("user_role", user.role || "user");
			crashlyticsService.setCustomKey("user_tier", user.tier || "일반회원");
			crashlyticsService.logBreadcrumb(`User authenticated: ${user.id} (${user.name})`);
		} else {
			crashlyticsService.setUserId(null);
			crashlyticsService.setCustomKey("user_role", "guest");
		}
	}, [user]);
	const [watchlist, setWatchlist] = (0, import_react.useState)([]);
	const [watchlistDetails, setWatchlistDetails] = (0, import_react.useState)([]);
	const watchlistRef = (0, import_react.useRef)(watchlist);
	watchlistRef.current = watchlist;
	const stocksRef = (0, import_react.useRef)(stocks);
	stocksRef.current = stocks;
	const initializedWatchlistCheckedRef = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const fetchWatchlistQuotes = (0, import_react.useCallback)(async (symbolsToFetch) => {
		const targetSymbols = symbolsToFetch || watchlistRef.current;
		if (!targetSymbols || targetSymbols.length === 0) return;
		try {
			const freshQuotes = await stockRepository.getStocksBySymbols(targetSymbols);
			if (freshQuotes && freshQuotes.length > 0) {
				setWatchlistDetails((prev) => {
					const map = new Map(prev.map((s) => [s.symbol, s]));
					for (const q of freshQuotes) {
						const existing = map.get(q.symbol);
						map.set(q.symbol, {
							...existing || {},
							...q
						});
					}
					const fullList = Array.from(/* @__PURE__ */ new Set([...watchlistRef.current, ...symbolsToFetch || []]));
					const ordered = [];
					for (const sym of fullList) {
						const item = map.get(sym);
						if (item) ordered.push(item);
					}
					return ordered;
				});
				setStocks((prev) => {
					const map = new Map(prev.map((s) => [s.symbol, s]));
					for (const s of freshQuotes) {
						const existing = map.get(s.symbol);
						map.set(s.symbol, {
							...existing,
							...s
						});
					}
					return Array.from(map.values());
				});
			}
		} catch (err) {
			console.warn("Failed to fetch watchlist quotes:", err);
		}
	}, []);
	const refreshWatchlistQuotes = (0, import_react.useCallback)(async () => {
		await fetchWatchlistQuotes();
	}, [fetchWatchlistQuotes]);
	(0, import_react.useEffect)(() => {
		if (watchlist.length === 0) return;
		fetchWatchlistQuotes();
		const interval = setInterval(() => {
			if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
			fetchWatchlistQuotes();
		}, 3e4);
		return () => clearInterval(interval);
	}, [watchlist.join(","), fetchWatchlistQuotes]);
	(0, import_react.useEffect)(() => {
		let authTimeout;
		const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
			clearTimeout(authTimeout);
			setIsAuthLoading(true);
			if (fbUser) {
				setFirebaseUser(fbUser);
				try {
					const profile = await firebaseRepository.syncUserProfile(fbUser.uid, fbUser.email || "user@byeongdol.kr", fbUser.displayName || void 0, fbUser.photoURL || void 0);
					setUser(profile);
				} catch (err) {
					console.warn("Failed to load user profile from Firestore:", err);
				}
			} else {
				setFirebaseUser(null);
				setUser(null);
				setWatchlist([]);
				setWatchlistDetails([]);
				storageService.clearWatchlist();
			}
			setIsAuthLoading(false);
		});
		authTimeout = setTimeout(() => {
			console.warn("[AppContext] Firebase Auth timed out, forcing load completion");
			setIsAuthLoading(false);
		}, 1e4);
		return () => {
			unsubscribe();
			clearTimeout(authTimeout);
		};
	}, []);
	const requireAuth = (actionName) => {
		if (!firebaseUser && !user) {
			showToast(actionName ? `${actionName} 기능은 로그인 후 이용 가능합니다.` : "로그인이 필요한 서비스입니다.", "warning");
			setIsAuthModalOpen(true);
			return false;
		}
		return true;
	};
	const logout = async () => {
		try {
			if (user?.id) await fcmPushService.invalidateOnLogout(user.id);
			await signOut(auth);
			setFirebaseUser(null);
			setUser(null);
			setWatchlist([]);
			storageService.clearWatchlist();
			showToast("로그아웃되었습니다.", "info");
			if (activeTab === "admin") setActiveTab("home");
		} catch (err) {
			console.error("Logout error:", err);
			showToast("로그아웃 처리 중 오류가 발생했습니다.", "error");
		}
	};
	const updateUser = (updates) => {
		if (!user) return;
		const updated = {
			...user,
			...updates
		};
		setUser(updated);
		storageService.updateUser(updates);
		showToast("프로필 정보가 수정되었습니다.", "success");
	};
	(0, import_react.useEffect)(() => {
		if (!user?.id) {
			setWatchlist([]);
			return;
		}
		const uid = user.id;
		const unsub = firebaseRepository.subscribeUserWatchlists(uid, async (symbols) => {
			const uniqueSymbols = Array.from(new Set(symbols || []));
			if (uniqueSymbols.length > 0) {
				setWatchlist(uniqueSymbols);
				storageService.saveUserWatchlist(uid, uniqueSymbols);
				fetchWatchlistQuotes(uniqueSymbols);
				notificationService.syncWatchlistForMonitoring(uid, uniqueSymbols);
			} else {
				setWatchlist([]);
				storageService.saveUserWatchlist(uid, []);
				if (!initializedWatchlistCheckedRef.current.has(uid)) {
					initializedWatchlistCheckedRef.current.add(uid);
					try {
						if (!await firebaseRepository.hasInitializedWatchlist(uid)) {
							const defaultSymbols = [
								"KOSPI",
								"KOSDAQ",
								"NDAQ",
								"SPX",
								"USDKRW",
								"US10Y",
								"BTC",
								"ETH"
							];
							for (let i = 0; i < defaultSymbols.length; i++) await firebaseRepository.addWatchlist(uid, defaultSymbols[i], i);
							await firebaseRepository.markInitializedWatchlist(uid);
							setWatchlist(defaultSymbols);
							fetchWatchlistQuotes(defaultSymbols);
						}
					} catch (err) {
						console.warn("Failed to initialize default watchlist:", err);
					}
				}
			}
		});
		return () => unsub();
	}, [user?.id, fetchWatchlistQuotes]);
	const addToWatchlist = async (symbol, itemData) => {
		if (!requireAuth("관심종목 저장")) return;
		if (!user?.id) return;
		if (watchlist.includes(symbol)) {
			showToast("이미 관심종목에 등록되어 있는 종목입니다.", "info");
			return;
		}
		const stock = stocks.find((s) => s.symbol === symbol) || (itemData ? itemData : void 0);
		const market = stock?.market || itemData?.market || "UNKNOWN";
		const resolvedCurrency = inferStockCurrency(symbol, market, itemData?.currency || stock?.currency);
		const resolvedExchange = inferStockExchange(symbol, market, itemData?.exchange || stock?.exchange);
		const isUSD = resolvedCurrency === "USD";
		if (itemData && !watchlistDetails.some((w) => w.symbol === symbol)) {
			const fullStock = {
				symbol,
				name: itemData.name || symbol,
				price: itemData.price || 0,
				change: itemData.change || 0,
				changePercent: itemData.changePercent || 0,
				market,
				sector: itemData.sector || "",
				volume: itemData.volume || 0,
				volumeRatio: itemData.volumeRatio || 100,
				tradingValue: itemData.tradingValue || 0,
				high52w: itemData.high52w || (itemData.price ? isUSD ? Number((itemData.price * 1.3).toFixed(2)) : Math.round(itemData.price * 1.3) : 0),
				low52w: itemData.low52w || (itemData.price ? isUSD ? Number((itemData.price * .7).toFixed(2)) : Math.round(itemData.price * .7) : 0),
				marketCap: itemData.marketCap || 0,
				per: itemData.per || 15,
				pbr: itemData.pbr || 1.2,
				eps: itemData.eps || 0,
				dividendYield: itemData.dividendYield || 0,
				openPrice: itemData.openPrice || itemData.price || 0,
				highPrice: itemData.highPrice || itemData.price || 0,
				lowPrice: itemData.lowPrice || itemData.price || 0,
				prevClose: itemData.prevClose || itemData.price || 0,
				foreignNetBuy: itemData.foreignNetBuy ?? null,
				instNetBuy: itemData.instNetBuy ?? null,
				individualNetBuy: itemData.individualNetBuy ?? null,
				investorDataAvailable: itemData.investorDataAvailable ?? false,
				investorDataSource: itemData.investorDataSource,
				investorBaseDate: itemData.investorBaseDate,
				candles: itemData.candles || [],
				sparkline: itemData.sparkline || [],
				currency: resolvedCurrency,
				exchange: resolvedExchange,
				productType: itemData.productType
			};
			setWatchlistDetails((prev) => [...prev.filter((p) => p.symbol !== symbol), fullStock]);
			setStocks((prev) => prev.some((s) => s.symbol === symbol) ? prev : [...prev, fullStock]);
		}
		const updated = [...watchlist, symbol];
		setWatchlist(updated);
		storageService.saveUserWatchlist(user.id, updated);
		try {
			await firebaseRepository.addWatchlist(user.id, symbol, updated.length, market, stock || itemData);
		} catch (err) {
			console.warn("Firebase add watchlist failed:", err);
		}
		fetchWatchlistQuotes([symbol]);
		const name = stock ? stock.name : itemData?.name || symbol;
		showToast(`'${name}' 관심종목에 추가되었습니다.`, "success");
	};
	const removeFromWatchlist = async (symbol) => {
		if (!user?.id) {
			if (!requireAuth("관심종목 관리")) return;
			return;
		}
		const updated = watchlist.filter((s) => s !== symbol);
		setWatchlist(updated);
		storageService.saveUserWatchlist(user.id, updated);
		const stock = stocks.find((s) => s.symbol === symbol);
		const market = stock?.market || "UNKNOWN";
		try {
			await firebaseRepository.removeWatchlist(user.id, symbol, market);
		} catch (err) {
			console.warn("Firebase remove watchlist failed:", err);
		}
		const name = stock ? stock.name : symbol;
		showToast(`'${name}' 관심종목에서 삭제되었습니다.`, "info");
	};
	const toggleWatchlist = (symbol) => {
		if (watchlist.includes(symbol)) removeFromWatchlist(symbol);
		else addToWatchlist(symbol);
	};
	const reorderWatchlist = (newOrder) => {
		setWatchlist(newOrder);
		setWatchlistDetails((prev) => {
			const map = new Map(prev.map((p) => [p.symbol, p]));
			return newOrder.map((sym) => map.get(sym)).filter((p) => Boolean(p));
		});
		if (user?.id) {
			storageService.saveUserWatchlist(user.id, newOrder);
			const orders = newOrder.map((symbol, idx) => {
				return {
					symbol,
					market: (stocks.find((s) => s.symbol === symbol) || watchlistDetails.find((w) => w.symbol === symbol))?.market || "UNKNOWN",
					orderIndex: idx
				};
			});
			firebaseRepository.updateWatchlistOrder(user.id, orders);
		}
		showToast("관심종목 정렬 순서가 저장되었습니다.", "info");
	};
	const isWatchlisted = (0, import_react.useCallback)((symbol) => watchlistRef.current.includes(symbol), []);
	const getStock = (0, import_react.useCallback)((symbol) => stocksRef.current.find((s) => s.symbol === symbol), []);
	const [marketEvents, setMarketEvents] = (0, import_react.useState)(() => storageService.getMarketEvents());
	const addMarketEvent = (eventData) => {
		const newEvent = storageService.broadcastMarketEvent(eventData);
		setMarketEvents(storageService.getMarketEvents());
		showToast(`시장 긴급 이벤트 발령: ${newEvent.title}`, "warning");
	};
	const [isSearchOpen, setIsSearchOpen] = (0, import_react.useState)(false);
	const [mobileMenuOpen, setMobileMenuOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				setIsSearchOpen((prev) => !prev);
			}
			if (e.key === "Escape") setIsSearchOpen(false);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);
	const [isSideChatOpen, setIsSideChatOpen] = (0, import_react.useState)(() => {
		try {
			const saved = localStorage.getItem("bd_side_chat_open");
			if (saved !== null) return saved === "true";
			return typeof window !== "undefined" ? window.innerWidth >= 1280 : true;
		} catch {
			return true;
		}
	});
	const [unreadChatCount, setUnreadChatCount] = (0, import_react.useState)(0);
	const toggleSideChat = (0, import_react.useCallback)(() => {
		setIsSideChatOpen((prev) => {
			const next = !prev;
			try {
				localStorage.setItem("bd_side_chat_open", String(next));
			} catch {}
			return next;
		});
	}, []);
	const [toasts, setToasts] = (0, import_react.useState)([]);
	const removeToast = (0, import_react.useCallback)((id) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);
	const showToast = (0, import_react.useCallback)((message, type = "info") => {
		const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
		setToasts((prev) => [...prev, {
			id,
			type,
			message
		}]);
		setTimeout(() => {
			removeToast(id);
		}, 3500);
	}, [removeToast]);
	const [priceAlerts, setPriceAlerts] = (0, import_react.useState)([]);
	const triggeredAlertIdsRef = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	(0, import_react.useEffect)(() => {
		const currentUid = firebaseUser?.uid || user?.id;
		if (!currentUid) {
			setPriceAlerts([]);
			triggeredAlertIdsRef.current.clear();
			return;
		}
		const unsubscribe = firebaseRepository.subscribeUserPriceAlerts(currentUid, (alerts) => {
			const uniqueAlerts = dedupeById(alerts);
			setPriceAlerts(uniqueAlerts);
			uniqueAlerts.forEach((a) => {
				if (a.isTriggered) triggeredAlertIdsRef.current.add(a.id);
			});
		});
		return () => unsubscribe();
	}, [firebaseUser?.uid, user?.id]);
	(0, import_react.useEffect)(() => {
		if (!priceAlerts.length || !stocks.length) return;
		priceAlerts.forEach((alert) => {
			if (alert.enabled === false || alert.isTriggered || triggeredAlertIdsRef.current.has(alert.id)) return;
			const currentStock = stocks.find((s) => s.symbol === alert.symbol);
			if (!currentStock || !currentStock.price) return;
			const isAboveCrossed = alert.condition === "above" && currentStock.price >= alert.targetPrice;
			const isBelowCrossed = alert.condition === "below" && currentStock.price <= alert.targetPrice;
			if (isAboveCrossed || isBelowCrossed) {
				triggeredAlertIdsRef.current.add(alert.id);
				const condLabel = alert.condition === "above" ? "목표가 돌파(이상)" : "목표가 하락(이하)";
				const toastType = alert.condition === "above" ? "success" : "warning";
				const alertCurrency = inferStockCurrency(alert.symbol, currentStock.market, currentStock.currency);
				showToast(`🔔 [${alert.symbolName}] ${condLabel} 도달! 설정가: ${formatMoney(alert.targetPrice, alertCurrency)} / 현재가: ${formatMoney(currentStock.price, alertCurrency)}`, toastType);
				firebaseRepository.markAlertTriggered(alert.id, currentStock.price).catch((err) => {
					console.warn("[AppContext] Failed to update alert trigger in Firestore:", err);
				});
				const currentUid = firebaseUser?.uid || user?.id;
				if (currentUid) notificationService.createNotification(`[${alert.symbolName}] 목표가 도달 알림`, `설정하신 목표 가격 ${formatMoney(alert.targetPrice, alertCurrency)}에 도달했습니다. (현재 체결가: ${formatMoney(currentStock.price, alertCurrency)})`, "price_target", alert.symbol, currentUid, alert.symbolName).catch(() => {});
			}
		});
	}, [stocks, priceAlerts]);
	const addPriceAlert = async (alert) => {
		const currentUid = firebaseUser?.uid || user?.id;
		if (!currentUid) {
			showToast("로그인 후 가격 알림을 설정할 수 있습니다.", "warning");
			setIsAuthModalOpen(true);
			return;
		}
		try {
			await firebaseRepository.createAlert(currentUid, alert);
			const stockObj = stocks.find((s) => s.symbol === alert.symbol);
			const alertCurrency = inferStockCurrency(alert.symbol, stockObj?.market, stockObj?.currency);
			showToast(`[${alert.symbolName}] 목표가 ${formatMoney(alert.targetPrice, alertCurrency)} ${alert.condition === "above" ? "이상" : "이하"} 알림이 등록되었습니다.`, "success");
		} catch (err) {
			showToast("가격 알림 등록 중 오류가 발생했습니다.", "error");
			throw err;
		}
	};
	const removePriceAlert = async (alertId) => {
		try {
			await firebaseRepository.deleteAlert(alertId);
			triggeredAlertIdsRef.current.delete(alertId);
			showToast("가격 알림이 삭제되었습니다.", "info");
		} catch {
			showToast("가격 알림 삭제에 실패했습니다.", "error");
		}
	};
	const togglePriceAlert = async (alertId, enabled) => {
		try {
			await firebaseRepository.toggleAlertEnabled(alertId, enabled);
			showToast(enabled ? "가격 알림이 활성화되었습니다." : "가격 알림이 비활성화되었습니다.", "info");
		} catch {
			showToast("알림 상태 변경 실패", "error");
		}
	};
	(0, import_react.useEffect)(() => {
		stockRepository.getAllStocks().then((res) => {
			if (res && res.length > 0) setStocks(res);
		});
		stockRepository.getIndices().then((res) => {
			if (res && res.length > 0) setIndices(res);
		});
		stockRepository.getExchangeRate().then((res) => {
			if (res) setExchangeRate(res);
		});
	}, []);
	(0, import_react.useEffect)(() => {
		if (!isSimulatingLiveTicks) return;
		const unsubTicks = stockRepository.subscribeTicks((freshStocks) => {
			setStocks(freshStocks);
		});
		const syncMarketHeaders = async () => {
			if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
			try {
				const [freshIndices, freshExchange] = await Promise.all([stockRepository.getIndices(), stockRepository.getExchangeRate()]);
				if (freshIndices && freshIndices.length > 0) setIndices((prev) => {
					if (prev.length === freshIndices.length && prev.every((p, idx) => {
						const n = freshIndices[idx];
						return p.symbol === n.symbol && p.value === n.value && p.change === n.change && p.changePercent === n.changePercent;
					})) return prev;
					return freshIndices;
				});
				if (freshExchange) setExchangeRate((prev) => {
					if (prev.rate === freshExchange.rate && prev.change === freshExchange.change && prev.changePercent === freshExchange.changePercent && prev.timestamp === freshExchange.timestamp) return prev;
					return freshExchange;
				});
			} catch {}
		};
		const indexInterval = setInterval(syncMarketHeaders, 15e3);
		const onVisibility = () => {
			if (document.visibilityState === "visible") syncMarketHeaders();
		};
		if (typeof document !== "undefined") document.addEventListener("visibilitychange", onVisibility);
		return () => {
			unsubTicks();
			clearInterval(indexInterval);
			if (typeof document !== "undefined") document.removeEventListener("visibilitychange", onVisibility);
		};
	}, [isSimulatingLiveTicks]);
	const toggleLiveSimulation = (0, import_react.useCallback)(() => {
		setIsSimulatingLiveTicks((prev) => {
			const next = !prev;
			showToast(prev ? "실시간 시세 틱 정지" : "실시간 시세 틱 재개", "info");
			return next;
		});
	}, [showToast]);
	const contextValue = (0, import_react.useMemo)(() => ({
		isDark,
		toggleTheme,
		activeTab,
		setActiveTab,
		selectedSymbol,
		navigateToStock,
		selectedIndexSymbol,
		navigateToIndex,
		clearSelectedIndex,
		selectedPostId,
		setSelectedPostId,
		navigateToPost,
		navigateToPostList,
		communityAuthorFilter,
		setCommunityAuthorFilter,
		navigateToMyPosts,
		publicRoute,
		navigateToStaticPage,
		navigateToInsights,
		clearPublicRoute,
		stocks,
		indices,
		exchangeRate,
		getStock,
		isSimulatingLiveTicks,
		toggleLiveSimulation,
		stockDataSource,
		toggleStockDataSource,
		isStockLoading,
		realtimeStatus,
		checkRealtimeConnection,
		watchlist,
		watchlistDetails,
		addToWatchlist,
		removeFromWatchlist,
		toggleWatchlist,
		reorderWatchlist,
		isWatchlisted,
		refreshWatchlistQuotes,
		marketEvents,
		addMarketEvent,
		firebaseUser,
		isAuthenticated: !!firebaseUser,
		isAuthLoading,
		user,
		isAdmin: !!(user && [
			"admin",
			"superadmin",
			"moderator"
		].includes(user.role || "")),
		updateUser,
		logout,
		requireAuth,
		isAuthModalOpen,
		setIsAuthModalOpen,
		isSearchOpen,
		setIsSearchOpen,
		mobileMenuOpen,
		setMobileMenuOpen,
		isSideChatOpen,
		setIsSideChatOpen,
		toggleSideChat,
		unreadChatCount,
		setUnreadChatCount,
		activeRoomId,
		setActiveRoomId: handleSetActiveRoomId,
		chatMessages,
		setChatMessages,
		loadMoreChatMessages,
		chatMessageLimit,
		registerChatConsumer,
		priceAlerts,
		addPriceAlert,
		removePriceAlert,
		togglePriceAlert,
		toasts,
		showToast,
		removeToast
	}), [
		isDark,
		toggleTheme,
		activeTab,
		setActiveTab,
		selectedSymbol,
		navigateToStock,
		selectedIndexSymbol,
		navigateToIndex,
		clearSelectedIndex,
		selectedPostId,
		navigateToPost,
		navigateToPostList,
		communityAuthorFilter,
		navigateToMyPosts,
		publicRoute,
		navigateToStaticPage,
		navigateToInsights,
		clearPublicRoute,
		stocks,
		indices,
		exchangeRate,
		getStock,
		isSimulatingLiveTicks,
		toggleLiveSimulation,
		stockDataSource,
		toggleStockDataSource,
		isStockLoading,
		realtimeStatus,
		checkRealtimeConnection,
		watchlist,
		watchlistDetails,
		addToWatchlist,
		removeFromWatchlist,
		toggleWatchlist,
		reorderWatchlist,
		isWatchlisted,
		refreshWatchlistQuotes,
		marketEvents,
		addMarketEvent,
		firebaseUser,
		isAuthLoading,
		user,
		updateUser,
		logout,
		requireAuth,
		isAuthModalOpen,
		isSearchOpen,
		mobileMenuOpen,
		isSideChatOpen,
		toggleSideChat,
		unreadChatCount,
		activeRoomId,
		handleSetActiveRoomId,
		chatMessages,
		loadMoreChatMessages,
		chatMessageLimit,
		registerChatConsumer,
		priceAlerts,
		addPriceAlert,
		removePriceAlert,
		togglePriceAlert,
		toasts,
		showToast,
		removeToast
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppContext.Provider, {
		value: contextValue,
		children
	});
};
var useApp = () => {
	const context = (0, import_react.useContext)(AppContext);
	if (!context) throw new Error("useApp must be used within an AppProvider");
	return context;
};
//#endregion
export { formatChatTime as A, inferStockExchange as C, isUSStockSymbol as D, getStockUniqueKey as E, formatPostExactDateTime as F, formatPostListTime as I, getKstDateKey as L, formatKST as M, formatKSTDate as N, formatChatDividerDate as O, formatKSTDateTime as P, getKstParts as R, inferStockCurrency as S, validateExchangeRate as T, formatMarketCapByCurrency as _, notificationService as a, getCurrencySymbol as b, isChosungQuery as c, INITIAL_POSTS as d, firebaseRepository as f, convertToKRW as g, aggregateMultiCurrencyPortfolio as h, fcmPushService as i, formatCommunityTime as j, formatChatExactDateTime as k, matchHangulSearch as l, dedupeByKey as m, useApp as n, stockRepository as o, dedupeById as p, crashlyticsService as r, extractChosung as s, AppProvider as t, storageService as u, formatMoney as v, roundByCurrency as w, inferFiatCurrency as x, formatTradingValueByCurrency as y };
