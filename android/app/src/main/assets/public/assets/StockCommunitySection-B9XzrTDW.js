import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { $t as ChartNoAxesColumn, Bt as Compass, Ft as ExternalLink, G as RefreshCw, Gt as CircleAlert, Ht as Clock, Jt as ChevronLeft, K as Radio, M as SlidersVertical, Q as PenLine, W as RotateCcw, Xt as Check, Yt as ChevronDown, bn as require_react, et as Newspaper, h as TriangleAlert, hn as ArrowRight, i as X, n as ZoomIn, ot as MessageSquare, q as Plus, qt as ChevronRight, t as ZoomOut, tn as Calendar, v as Trash2, vt as Layers, wt as Heart, yn as Activity } from "./vendor-lucide-Dji_Ij8j.js";
import { S as inferStockCurrency, n as useApp, o as stockRepository, p as dedupeById, u as storageService, v as formatMoney } from "./AppContext-Butl4QWq.js";
import { t as AdSlot } from "./AdSlot-CzgsWb47.js";
import { t as PostEditorModal } from "./PostEditorModal-Bxu4oV5j.js";
import { t as newsService } from "./newsService-BQGP30E2.js";
//#region src/utils/chartSanitizer.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* Parses candle time strings into a numeric timestamp for chronological ordering.
* Supports:
* - "YYYY-MM-DD" / "YYYY.MM.DD"
* - "YYYY-MM-DD HH:mm" / "YYYY.MM.DD HH:mm"
* - "MM/DD HH:mm" / "HH:mm" (resolved cleanly in array order if yearless)
*/
function parseCandleTimestamp(time) {
	if (!time || typeof time !== "string") return null;
	const trimmed = time.trim();
	const fullMatch = trimmed.match(/^(\d{4})[-./](\d{1,2})[-./](\d{1,2})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
	if (fullMatch) {
		const year = Number(fullMatch[1]);
		const month = Number(fullMatch[2]) - 1;
		const day = Number(fullMatch[3]);
		const hour = fullMatch[4] ? Number(fullMatch[4]) : 0;
		const min = fullMatch[5] ? Number(fullMatch[5]) : 0;
		const sec = fullMatch[6] ? Number(fullMatch[6]) : 0;
		const ts = Date.UTC(year, month, day, hour, min, sec);
		return Number.isFinite(ts) ? ts : null;
	}
	if (/^\d{4}-\d{2}-\d{2}T/.test(trimmed)) {
		const ts = Date.parse(trimmed);
		return Number.isFinite(ts) ? ts : null;
	}
	return null;
}
/**
* Validates and sanitizes OHLCV candle bars without fabricating missing bars:
* 1. Finite positive numbers (> 0) for open, high, low, close
* 2. Finite non-negative volume (>= 0)
* 3. Strict OHLC bounds: high >= max(open, close) and low <= min(open, close)
* 4. Deduplicates identical `time` keys (retaining latest valid sample for the same bucket)
* 5. Enforces chronological ascending order when timestamps include full dates
*/
function sanitizeAndValidateCandles(candles) {
	if (!Array.isArray(candles) || candles.length === 0) return [];
	const dedupedByTime = /* @__PURE__ */ new Map();
	for (let i = 0; i < candles.length; i++) {
		const c = candles[i];
		if (!c || typeof c.time !== "string" || !c.time.trim()) continue;
		const open = Number(c.open);
		const high = Number(c.high);
		const low = Number(c.low);
		const close = Number(c.close);
		const volume = Number.isFinite(Number(c.volume)) && Number(c.volume) >= 0 ? Number(c.volume) : 0;
		if (!Number.isFinite(open) || open <= 0 || !Number.isFinite(high) || high <= 0 || !Number.isFinite(low) || low <= 0 || !Number.isFinite(close) || close <= 0) continue;
		if (high < Math.max(open, close) || low > Math.min(open, close) || high < low) continue;
		const timeKey = c.time.trim();
		const ts = parseCandleTimestamp(timeKey);
		const existing = dedupedByTime.get(timeKey);
		dedupedByTime.set(timeKey, {
			candle: {
				time: timeKey,
				open,
				high,
				low,
				close,
				volume
			},
			ts,
			order: existing ? existing.order : i
		});
	}
	const entries = Array.from(dedupedByTime.values());
	if (entries.length > 1 && entries.every((e) => e.ts !== null)) entries.sort((a, b) => a.ts - b.ts);
	else entries.sort((a, b) => a.order - b.order);
	return entries.map((e) => e.candle);
}
//#endregion
//#region src/utils/chartIndicators.ts
var DEFAULT_INDICATOR_SETTINGS = {
	ma: {
		enabled: true,
		ma5: true,
		ma20: true,
		ma60: true,
		ma120: false,
		period5: 5,
		period20: 20,
		period60: 60,
		period120: 120
	},
	ema: {
		enabled: false,
		period: 20
	},
	bollinger: {
		enabled: false,
		period: 20,
		stdDev: 2
	},
	vwap: { enabled: false },
	rsi: {
		enabled: false,
		period: 14
	},
	macd: {
		enabled: false,
		fastPeriod: 12,
		slowPeriod: 26,
		signalPeriod: 9
	},
	stochastic: {
		enabled: false,
		kPeriod: 14,
		dPeriod: 3
	},
	volume: { enabled: true }
};
/**
* Calculate Simple Moving Average (SMA)
*/
function calculateSMA(candles, period) {
	const result = [];
	let sum = 0;
	for (let i = 0; i < candles.length; i++) {
		sum += candles[i].close;
		if (i >= period) sum -= candles[i - period].close;
		if (i >= period - 1) result.push(sum / period);
		else result.push(null);
	}
	return result;
}
/**
* Calculate Exponential Moving Average (EMA)
*/
function calculateEMA(candles, period) {
	const result = [];
	if (candles.length === 0 || period <= 0) return result;
	const k = 2 / (period + 1);
	let ema = null;
	for (let i = 0; i < candles.length; i++) {
		const close = candles[i].close;
		if (i < period - 1) result.push(null);
		else if (i === period - 1) {
			let sum = 0;
			for (let j = 0; j < period; j++) sum += candles[j].close;
			ema = sum / period;
			result.push(ema);
		} else if (ema !== null) {
			ema = close * k + ema * (1 - k);
			result.push(ema);
		} else result.push(null);
	}
	return result;
}
function calculateBollingerBands(candles, period = 20, stdDevMultiplier = 2) {
	const upper = [];
	const middle = [];
	const lower = [];
	for (let i = 0; i < candles.length; i++) if (i < period - 1) {
		upper.push(null);
		middle.push(null);
		lower.push(null);
	} else {
		const slice = candles.slice(i - period + 1, i + 1);
		const mean = slice.reduce((acc, c) => acc + c.close, 0) / period;
		const variance = slice.reduce((acc, c) => acc + Math.pow(c.close - mean, 2), 0) / period;
		const stdDev = Math.sqrt(variance);
		middle.push(mean);
		upper.push(mean + stdDevMultiplier * stdDev);
		lower.push(mean - stdDevMultiplier * stdDev);
	}
	return {
		upper,
		middle,
		lower
	};
}
/**
* Calculate VWAP (Volume Weighted Average Price)
*/
function calculateVWAP(candles) {
	const result = [];
	let cumulativeTypicalVolume = 0;
	let cumulativeVolume = 0;
	for (let i = 0; i < candles.length; i++) {
		const c = candles[i];
		const typicalPrice = (c.high + c.low + c.close) / 3;
		cumulativeTypicalVolume += typicalPrice * c.volume;
		cumulativeVolume += c.volume;
		if (cumulativeVolume > 0) result.push(cumulativeTypicalVolume / cumulativeVolume);
		else result.push(null);
	}
	return result;
}
/**
* Calculate RSI (Relative Strength Index)
*/
function calculateRSI(candles, period = 14) {
	const result = [];
	if (candles.length <= period) return candles.map(() => null);
	let gains = 0;
	let losses = 0;
	for (let i = 1; i <= period; i++) {
		const diff = candles[i].close - candles[i - 1].close;
		if (diff >= 0) gains += diff;
		else losses += Math.abs(diff);
	}
	let avgGain = gains / period;
	let avgLoss = losses / period;
	for (let i = 0; i < period; i++) result.push(null);
	let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
	let firstRsi = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);
	result.push(firstRsi);
	for (let i = period + 1; i < candles.length; i++) {
		const diff = candles[i].close - candles[i - 1].close;
		const currentGain = diff >= 0 ? diff : 0;
		const currentLoss = diff < 0 ? Math.abs(diff) : 0;
		avgGain = (avgGain * (period - 1) + currentGain) / period;
		avgLoss = (avgLoss * (period - 1) + currentLoss) / period;
		if (avgLoss === 0) result.push(100);
		else {
			rs = avgGain / avgLoss;
			result.push(100 - 100 / (1 + rs));
		}
	}
	return result;
}
function calculateMACD(candles, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
	const fastEMA = calculateEMA(candles, fastPeriod);
	const slowEMA = calculateEMA(candles, slowPeriod);
	const macdLine = [];
	for (let i = 0; i < candles.length; i++) {
		const f = fastEMA[i];
		const s = slowEMA[i];
		if (f !== null && s !== null) macdLine.push(f - s);
		else macdLine.push(null);
	}
	const signalLine = [];
	const validMacdValues = [];
	macdLine.forEach((val, idx) => {
		if (val !== null) validMacdValues.push({
			index: idx,
			val
		});
	});
	if (validMacdValues.length >= signalPeriod) {
		const k = 2 / (signalPeriod + 1);
		let ema = null;
		let validCount = 0;
		for (let i = 0; i < candles.length; i++) {
			const val = macdLine[i];
			if (val === null) signalLine.push(null);
			else {
				validCount++;
				if (validCount < signalPeriod) signalLine.push(null);
				else if (validCount === signalPeriod) {
					ema = validMacdValues.slice(0, signalPeriod).reduce((acc, v) => acc + v.val, 0) / signalPeriod;
					signalLine.push(ema);
				} else if (ema !== null) {
					ema = val * k + ema * (1 - k);
					signalLine.push(ema);
				} else signalLine.push(null);
			}
		}
	} else for (let i = 0; i < candles.length; i++) signalLine.push(null);
	const histogram = [];
	for (let i = 0; i < candles.length; i++) {
		const m = macdLine[i];
		const s = signalLine[i];
		if (m !== null && s !== null) histogram.push(m - s);
		else histogram.push(null);
	}
	return {
		macdLine,
		signalLine,
		histogram
	};
}
function calculateStochastic(candles, kPeriod = 14, dPeriod = 3) {
	const kLine = [];
	const dLine = [];
	for (let i = 0; i < candles.length; i++) if (i < kPeriod - 1) kLine.push(null);
	else {
		const slice = candles.slice(i - kPeriod + 1, i + 1);
		const lowestLow = Math.min(...slice.map((c) => c.low));
		const highestHigh = Math.max(...slice.map((c) => c.high));
		const currentClose = candles[i].close;
		const range = highestHigh - lowestLow;
		if (range === 0) kLine.push(50);
		else {
			const k = (currentClose - lowestLow) / range * 100;
			kLine.push(k);
		}
	}
	for (let i = 0; i < candles.length; i++) if (i < kPeriod - 1 + dPeriod - 1) dLine.push(null);
	else {
		const slice = kLine.slice(i - dPeriod + 1, i + 1);
		if (slice.some((v) => v === null)) dLine.push(null);
		else {
			const sum = slice.reduce((acc, v) => acc + v, 0);
			dLine.push(sum / dPeriod);
		}
	}
	return {
		kLine,
		dLine
	};
}
//#endregion
//#region src/types/chartDrawings.ts
var FIBONACCI_LEVELS = [
	{
		level: 0,
		label: "0.0%",
		color: "#94a3b8"
	},
	{
		level: .236,
		label: "23.6%",
		color: "#38bdf8"
	},
	{
		level: .382,
		label: "38.2%",
		color: "#34d399"
	},
	{
		level: .5,
		label: "50.0%",
		color: "#fbbf24"
	},
	{
		level: .618,
		label: "61.8%",
		color: "#f87171"
	},
	{
		level: .786,
		label: "78.6%",
		color: "#c084fc"
	},
	{
		level: 1,
		label: "100.0%",
		color: "#94a3b8"
	}
];
//#endregion
//#region src/components/stocks/IndicatorSettingsModal.tsx
var import_jsx_runtime = require_jsx_runtime();
var IndicatorSettingsModal = ({ isOpen, onClose, settings, onChange }) => {
	if (!isOpen) return null;
	const updateMA = (key, value) => {
		onChange({
			...settings,
			ma: {
				...settings.ma,
				[key]: value
			}
		});
	};
	const updateEMA = (key, value) => {
		onChange({
			...settings,
			ema: {
				...settings.ema,
				[key]: value
			}
		});
	};
	const updateBollinger = (key, value) => {
		onChange({
			...settings,
			bollinger: {
				...settings.bollinger,
				[key]: value
			}
		});
	};
	const updateRSI = (key, value) => {
		onChange({
			...settings,
			rsi: {
				...settings.rsi,
				[key]: value
			}
		});
	};
	const updateMACD = (key, value) => {
		onChange({
			...settings,
			macd: {
				...settings.macd,
				[key]: value
			}
		});
	};
	const updateStochastic = (key, value) => {
		onChange({
			...settings,
			stochastic: {
				...settings.stochastic,
				[key]: value
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-base text-slate-900 dark:text-white",
						children: "차트 보조지표 및 파라미터 설정"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 space-y-5 overflow-y-auto font-sans text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-sm text-slate-800 dark:text-slate-200",
									children: "이동평균선 (MA)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "relative inline-flex items-center cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: settings.ma.enabled,
										onChange: (e) => updateMA("enabled", e.target.checked),
										className: "sr-only peer"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500" })]
								})]
							}), settings.ma.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2.5 pt-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: settings.ma.ma5,
												onChange: (e) => updateMA("ma5", e.target.checked),
												className: "accent-amber-500"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-amber-500 font-mono",
												children: "MA1"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: "1",
												max: "500",
												value: settings.ma.period5,
												onChange: (e) => updateMA("period5", Math.max(1, parseInt(e.target.value) || 5)),
												className: "w-14 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 font-mono text-center dark:bg-slate-900 text-slate-900 dark:text-white"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: settings.ma.ma20,
												onChange: (e) => updateMA("ma20", e.target.checked),
												className: "accent-purple-500"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-purple-500 font-mono",
												children: "MA2"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: "1",
												max: "500",
												value: settings.ma.period20,
												onChange: (e) => updateMA("period20", Math.max(1, parseInt(e.target.value) || 20)),
												className: "w-14 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 font-mono text-center dark:bg-slate-900 text-slate-900 dark:text-white"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: settings.ma.ma60,
												onChange: (e) => updateMA("ma60", e.target.checked),
												className: "accent-emerald-500"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-emerald-500 font-mono",
												children: "MA3"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: "1",
												max: "500",
												value: settings.ma.period60,
												onChange: (e) => updateMA("period60", Math.max(1, parseInt(e.target.value) || 60)),
												className: "w-14 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 font-mono text-center dark:bg-slate-900 text-slate-900 dark:text-white"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: settings.ma.ma120,
												onChange: (e) => updateMA("ma120", e.target.checked),
												className: "accent-cyan-500"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-cyan-500 font-mono",
												children: "MA4"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: "1",
												max: "500",
												value: settings.ma.period120,
												onChange: (e) => updateMA("period120", Math.max(1, parseInt(e.target.value) || 120)),
												className: "w-14 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 font-mono text-center dark:bg-slate-900 text-slate-900 dark:text-white"
											})
										]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-sm text-slate-800 dark:text-slate-200 block",
									children: "지수이동평균 (EMA)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-slate-400",
									children: "최근 주가에 가중치를 둔 지수 이동평균"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "relative inline-flex items-center cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: settings.ema.enabled,
										onChange: (e) => updateEMA("enabled", e.target.checked),
										className: "sr-only peer"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500" })]
								})]
							}), settings.ema.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-600 dark:text-slate-300",
									children: "기간 (Period):"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: "2",
									max: "200",
									value: settings.ema.period,
									onChange: (e) => updateEMA("period", Math.max(2, parseInt(e.target.value) || 20)),
									className: "w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 font-mono text-center dark:bg-slate-800 text-slate-900 dark:text-white"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-sm text-slate-800 dark:text-slate-200 block",
									children: "볼린저 밴드 (Bollinger Bands)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-slate-400",
									children: "상한/중심/하한선 변동성 밴드"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "relative inline-flex items-center cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: settings.bollinger.enabled,
										onChange: (e) => updateBollinger("enabled", e.target.checked),
										className: "sr-only peer"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500" })]
								})]
							}), settings.bollinger.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4 pt-1 flex-wrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-600 dark:text-slate-300",
										children: "기간:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										min: "5",
										max: "100",
										value: settings.bollinger.period,
										onChange: (e) => updateBollinger("period", Math.max(5, parseInt(e.target.value) || 20)),
										className: "w-14 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 font-mono text-center dark:bg-slate-800 text-slate-900 dark:text-white"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-600 dark:text-slate-300",
										children: "표준편차 (k):"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										step: "0.1",
										min: "1",
										max: "4",
										value: settings.bollinger.stdDev,
										onChange: (e) => updateBollinger("stdDev", parseFloat(e.target.value) || 2),
										className: "w-14 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 font-mono text-center dark:bg-slate-800 text-slate-900 dark:text-white"
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-sm text-slate-800 dark:text-slate-200 block",
								children: "거래량가중평균가 (VWAP)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-slate-400",
								children: "기관/외인 매매 주요 벤치마크 지표"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "relative inline-flex items-center cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: settings.vwap.enabled,
									onChange: (e) => onChange({
										...settings,
										vwap: { enabled: e.target.checked }
									}),
									className: "sr-only peer"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-sm text-slate-800 dark:text-slate-200 block",
									children: "RSI (상대강도지수)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-slate-400",
									children: "과매수(70) / 과매도(30) 모멘텀 지표"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "relative inline-flex items-center cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: settings.rsi.enabled,
										onChange: (e) => updateRSI("enabled", e.target.checked),
										className: "sr-only peer"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500" })]
								})]
							}), settings.rsi.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-600 dark:text-slate-300",
									children: "기간 (Period):"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: "2",
									max: "100",
									value: settings.rsi.period,
									onChange: (e) => updateRSI("period", Math.max(2, parseInt(e.target.value) || 14)),
									className: "w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 font-mono text-center dark:bg-slate-800 text-slate-900 dark:text-white"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-sm text-slate-800 dark:text-slate-200 block",
									children: "MACD (이동평균 수렴확산)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-slate-400",
									children: "MACD선, 시그널선, 오실레이터 히스토그램"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "relative inline-flex items-center cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: settings.macd.enabled,
										onChange: (e) => updateMACD("enabled", e.target.checked),
										className: "sr-only peer"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500" })]
								})]
							}), settings.macd.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-2 pt-1 font-mono",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-slate-400 block mb-0.5",
										children: "단기(Fast)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										min: "2",
										max: "50",
										value: settings.macd.fastPeriod,
										onChange: (e) => updateMACD("fastPeriod", Math.max(2, parseInt(e.target.value) || 12)),
										className: "w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-600 text-center dark:bg-slate-800 text-slate-900 dark:text-white"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-slate-400 block mb-0.5",
										children: "장기(Slow)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										min: "5",
										max: "100",
										value: settings.macd.slowPeriod,
										onChange: (e) => updateMACD("slowPeriod", Math.max(5, parseInt(e.target.value) || 26)),
										className: "w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-600 text-center dark:bg-slate-800 text-slate-900 dark:text-white"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-slate-400 block mb-0.5",
										children: "시그널"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										min: "2",
										max: "50",
										value: settings.macd.signalPeriod,
										onChange: (e) => updateMACD("signalPeriod", Math.max(2, parseInt(e.target.value) || 9)),
										className: "w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-600 text-center dark:bg-slate-800 text-slate-900 dark:text-white"
									})] })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-sm text-slate-800 dark:text-slate-200 block",
									children: "스토캐스틱 (Stochastic)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-slate-400",
									children: "%K 및 %D 오실레이터"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "relative inline-flex items-center cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: settings.stochastic.enabled,
										onChange: (e) => updateStochastic("enabled", e.target.checked),
										className: "sr-only peer"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500" })]
								})]
							}), settings.stochastic.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-600 dark:text-slate-300 font-mono",
										children: "%K:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										min: "2",
										max: "50",
										value: settings.stochastic.kPeriod,
										onChange: (e) => updateStochastic("kPeriod", Math.max(2, parseInt(e.target.value) || 14)),
										className: "w-14 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 font-mono text-center dark:bg-slate-800 text-slate-900 dark:text-white"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-600 dark:text-slate-300 font-mono",
										children: "%D:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										min: "1",
										max: "20",
										value: settings.stochastic.dPeriod,
										onChange: (e) => updateStochastic("dPeriod", Math.max(1, parseInt(e.target.value) || 3)),
										className: "w-14 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 font-mono text-center dark:bg-slate-800 text-slate-900 dark:text-white"
									})]
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: onClose,
						className: "px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "설정 적용 완료" })]
					})
				})
			]
		})
	});
};
//#endregion
//#region src/components/stocks/InteractiveStockChart.tsx
var PRIMARY_PERIODS = [
	{
		id: "1d",
		label: "1일",
		trId: "REAL_1D",
		defaultCandleType: "minute",
		description: "당일 분봉",
		category: "primary"
	},
	{
		id: "1w",
		label: "1주",
		trId: "REAL_1W",
		defaultCandleType: "minute",
		description: "최근 1주일",
		category: "primary"
	},
	{
		id: "1mo",
		label: "1개월",
		trId: "REAL_1M",
		defaultCandleType: "day",
		description: "최근 1개월",
		category: "primary"
	},
	{
		id: "3mo",
		label: "3개월",
		trId: "REAL_3M",
		defaultCandleType: "day",
		description: "최근 3개월",
		category: "primary"
	},
	{
		id: "6mo",
		label: "6개월",
		trId: "REAL_6M",
		defaultCandleType: "day",
		description: "최근 6개월",
		category: "primary"
	},
	{
		id: "1y",
		label: "1년",
		trId: "REAL_1Y",
		defaultCandleType: "day",
		description: "최근 1년",
		category: "primary"
	},
	{
		id: "3y",
		label: "3년",
		trId: "REAL_3Y",
		defaultCandleType: "week",
		description: "최근 3년",
		category: "primary"
	},
	{
		id: "all",
		label: "전체",
		trId: "REAL_ALL",
		defaultCandleType: "month",
		description: "전체 기간",
		category: "primary"
	}
];
var MINUTE_PERIODS = [
	{
		id: "1m",
		label: "1분",
		trId: "ka10080",
		defaultCandleType: "minute",
		ticScope: "1",
		description: "1분봉",
		category: "minute"
	},
	{
		id: "5m",
		label: "5분",
		trId: "ka10080",
		defaultCandleType: "minute",
		ticScope: "5",
		description: "5분봉",
		category: "minute"
	},
	{
		id: "15m",
		label: "15분",
		trId: "ka10080",
		defaultCandleType: "minute",
		ticScope: "15",
		description: "15분봉",
		category: "minute"
	},
	{
		id: "30m",
		label: "30분",
		trId: "ka10080",
		defaultCandleType: "minute",
		ticScope: "30",
		description: "30분봉",
		category: "minute"
	},
	{
		id: "1h",
		label: "60분",
		trId: "ka10080",
		defaultCandleType: "minute",
		ticScope: "60",
		description: "60분봉",
		category: "minute"
	}
];
var ALL_CHART_PERIODS = [...PRIMARY_PERIODS, ...MINUTE_PERIODS];
function getStepDaysForPeriod(p) {
	switch (p) {
		case "1w": return 7;
		case "1mo": return 30;
		case "3mo": return 90;
		case "6mo": return 180;
		case "1y": return 365;
		case "3y":
		case "5y":
		case "all": return 365;
		default: return 1;
	}
}
function getSourceLabel(source) {
	switch (source) {
		case "kiwoom": return "키움 Open API";
		case "yahoo": return "Yahoo Finance";
		case "upbit": return "Upbit API";
		case "binance": return "Binance API";
		default: return "실시간 시세";
	}
}
var InteractiveStockChart = ({ symbol, candles: initialCandles = [], stockPrice, prevClose, currency = "KRW", buyEntries = [] }) => {
	const { isDark } = useApp();
	const upColor = isDark ? "#F0787D" : "#D94B50";
	const downColor = isDark ? "#72A9E8" : "#3478C8";
	const gridColor = isDark ? "#263040" : "#E5E9F0";
	const axisTextColor = isDark ? "#94A3B8" : "#64748B";
	const activeCurrency = currency || "KRW";
	const formatPrice = (0, import_react.useCallback)((val) => {
		if (!Number.isFinite(val)) return "-";
		const targetCur = activeCurrency;
		if (targetCur === "USD") return `$${val.toLocaleString(void 0, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		})}`;
		if (targetCur === "USDT") {
			const decimals = val < .01 ? 6 : val < 1 ? 4 : 2;
			return `${val.toLocaleString(void 0, {
				minimumFractionDigits: decimals,
				maximumFractionDigits: decimals
			})} USDT`;
		}
		if (targetCur === "BTC") return `${val.toFixed(8)} BTC`;
		return formatMoney(val, "KRW");
	}, [activeCurrency]);
	const formatAxisPrice = (0, import_react.useCallback)((val) => {
		if (!Number.isFinite(val)) return "";
		if (activeCurrency === "USD") return `$${val.toLocaleString(void 0, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		})}`;
		if (activeCurrency === "USDT") {
			const decimals = val < .01 ? 5 : val < 1 ? 4 : 2;
			return val.toLocaleString(void 0, {
				minimumFractionDigits: decimals,
				maximumFractionDigits: decimals
			});
		}
		if (activeCurrency === "BTC") return val.toFixed(6);
		return Math.round(val).toLocaleString();
	}, [activeCurrency]);
	const [period, setPeriod] = (0, import_react.useState)("1d");
	const [candleType, setCandleType] = (0, import_react.useState)("minute");
	const [chartType, setChartType] = (0, import_react.useState)("candle");
	const [isMinuteMenuOpen, setIsMinuteMenuOpen] = (0, import_react.useState)(false);
	const [targetDate, setTargetDate] = (0, import_react.useState)("");
	const [isHistoricalView, setIsHistoricalView] = (0, import_react.useState)(false);
	const [selectedDateClose, setSelectedDateClose] = (0, import_react.useState)(null);
	const [selectedDateString, setSelectedDateString] = (0, import_react.useState)(null);
	const reqSeqRef = (0, import_react.useRef)(0);
	const abortControllerRef = (0, import_react.useRef)(null);
	const stockPriceRef = (0, import_react.useRef)(stockPrice);
	stockPriceRef.current = stockPrice;
	const [rawCandles, setRawCandles] = (0, import_react.useState)(() => sanitizeAndValidateCandles(initialCandles));
	const [chartMeta, setChartMeta] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [apiError, setApiError] = (0, import_react.useState)(null);
	const [serverIp, setServerIp] = (0, import_react.useState)(null);
	const chartContainerRef = (0, import_react.useRef)(null);
	const [containerWidth, setContainerWidth] = (0, import_react.useState)(900);
	(0, import_react.useEffect)(() => {
		const el = chartContainerRef.current;
		if (!el || typeof ResizeObserver === "undefined") return;
		const updateWidth = () => {
			const nextW = Math.round(el.getBoundingClientRect().width);
			if (nextW > 100) setContainerWidth(Math.max(360, Math.min(1150, nextW)));
		};
		updateWidth();
		const observer = new ResizeObserver(updateWidth);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	const [viewCount, setViewCount] = (0, import_react.useState)(60);
	const [viewOffset, setViewOffset] = (0, import_react.useState)(0);
	const [yScale, setYScale] = (0, import_react.useState)(1);
	const dragModeRef = (0, import_react.useRef)("none");
	const [isDraggingUI, setIsDraggingUI] = (0, import_react.useState)(false);
	const panStartRef = (0, import_react.useRef)(null);
	const touchStartDistRef = (0, import_react.useRef)(null);
	const rAFPendingRef = (0, import_react.useRef)(null);
	const [hoverIndex, setHoverIndex] = (0, import_react.useState)(null);
	const [hoverPrice, setHoverPrice] = (0, import_react.useState)(null);
	const svgRef = (0, import_react.useRef)(null);
	const [indicators, setIndicators] = (0, import_react.useState)(DEFAULT_INDICATOR_SETTINGS);
	const [isSettingsModalOpen, setIsSettingsModalOpen] = (0, import_react.useState)(false);
	const [isIndicatorMenuOpen, setIsIndicatorMenuOpen] = (0, import_react.useState)(false);
	const [activeTool, setActiveTool] = (0, import_react.useState)("none");
	const [shapes, setShapes] = (0, import_react.useState)([]);
	const [selectedShapeId, setSelectedShapeId] = (0, import_react.useState)(null);
	const [drawingShape, setDrawingShape] = (0, import_react.useState)(null);
	const [isDrawingMenuOpen, setIsDrawingMenuOpen] = (0, import_react.useState)(false);
	const currentPeriodConfig = (0, import_react.useMemo)(() => {
		return ALL_CHART_PERIODS.find((p) => p.id === period) || PRIMARY_PERIODS[0];
	}, [period]);
	const minViewCount = (0, import_react.useMemo)(() => {
		if (rawCandles.length === 0) return 1;
		return Math.min(rawCandles.length, 10);
	}, [rawCandles.length]);
	(0, import_react.useEffect)(() => {
		abortControllerRef.current?.abort();
		abortControllerRef.current = null;
		reqSeqRef.current += 1;
		setRawCandles([]);
		setChartMeta(null);
		setApiError(null);
		setHoverIndex(null);
		setHoverPrice(null);
		setTargetDate("");
		setIsHistoricalView(false);
		setSelectedDateClose(null);
		setSelectedDateString(null);
		setViewOffset(0);
		setYScale(1);
		setShapes([]);
		setSelectedShapeId(null);
		setDrawingShape(null);
		setActiveTool("none");
	}, [symbol]);
	const loadChartData = (0, import_react.useCallback)(async (targetPeriod, customDate, customCandleType) => {
		if (!symbol) return;
		abortControllerRef.current?.abort();
		const controller = new AbortController();
		abortControllerRef.current = controller;
		const currentSeq = ++reqSeqRef.current;
		const effectiveCandleType = customCandleType || candleType;
		const queryDate = customDate !== void 0 ? customDate : targetDate;
		setIsLoading(true);
		setApiError(null);
		try {
			const data = await stockRepository.getKiwoomChart(symbol, targetPeriod, {
				candleType: effectiveCandleType,
				date: queryDate.trim() || void 0,
				signal: controller.signal
			});
			if (reqSeqRef.current !== currentSeq || controller.signal.aborted) return;
			setChartMeta(data);
			if (data.serverIp) setServerIp(data.serverIp);
			if (data.error) {
				setApiError(data.error);
				setRawCandles([]);
			} else if (Array.isArray(data.candles)) {
				let candles = sanitizeAndValidateCandles(data.candles);
				const livePrice = stockPriceRef.current;
				if (!data.isHistoricalView && livePrice > 0 && candles.length > 0) {
					const lastIndex = candles.length - 1;
					const last = { ...candles[lastIndex] };
					last.close = livePrice;
					last.high = Math.max(last.high, livePrice);
					last.low = Math.min(last.low, livePrice);
					candles[lastIndex] = last;
					candles = sanitizeAndValidateCandles(candles);
				}
				setRawCandles(candles);
				setIsHistoricalView(Boolean(data.isHistoricalView));
				setSelectedDateClose(data.selectedDateClose ?? null);
				setSelectedDateString(data.selectedDate ?? null);
				setViewOffset(0);
				setYScale(1);
				setViewCount(candles.length > 0 ? Math.min(candles.length, Math.max(24, Math.min(72, candles.length))) : 60);
			} else setRawCandles([]);
		} catch (err) {
			if (err?.name === "AbortError" || controller.signal.aborted) return;
			if (reqSeqRef.current === currentSeq) {
				console.warn("[InteractiveStockChart] Fetch error:", err);
				setApiError(err?.message || "차트 데이터를 불러오지 못했습니다.");
				setRawCandles([]);
			}
		} finally {
			if (reqSeqRef.current === currentSeq && !controller.signal.aborted) setIsLoading(false);
		}
	}, [
		symbol,
		targetDate,
		candleType
	]);
	(0, import_react.useEffect)(() => {
		loadChartData(period, targetDate, candleType);
		return () => {
			abortControllerRef.current?.abort();
		};
	}, [
		symbol,
		period,
		candleType
	]);
	(0, import_react.useEffect)(() => {
		if (isHistoricalView || !stockPrice || stockPrice <= 0) return;
		setRawCandles((prev) => {
			if (!prev || prev.length === 0) return prev;
			const last = prev[prev.length - 1];
			if (last.close === stockPrice) return prev;
			const updatedLast = {
				...last,
				close: stockPrice,
				high: Math.max(last.high, stockPrice),
				low: Math.min(last.low, stockPrice)
			};
			return sanitizeAndValidateCandles([...prev.slice(0, -1), updatedLast]);
		});
	}, [stockPrice, isHistoricalView]);
	(0, import_react.useEffect)(() => {
		if (!symbol) return;
		const unsubscribe = stockRepository.subscribeExecutionTick?.(symbol, (tick) => {
			if (isHistoricalView) return;
			const currentLivePrice = stockPriceRef.current;
			if (currentLivePrice > 0 && tick.price > 0 && Math.abs(tick.price - currentLivePrice) / currentLivePrice > .25) return;
			if (!Number.isFinite(tick.price) || tick.price <= 0) return;
			setRawCandles((prev) => {
				if (!prev || prev.length === 0) return prev;
				const last = prev[prev.length - 1];
				const updatedLast = {
					...last,
					close: tick.price,
					high: Math.max(last.high, tick.price),
					low: Math.min(last.low, tick.price),
					volume: last.volume + (tick.volume > 0 ? Math.round(tick.volume / 100) : 0)
				};
				return sanitizeAndValidateCandles([...prev.slice(0, -1), updatedLast]);
			});
		});
		return () => {
			unsubscribe?.();
		};
	}, [symbol, isHistoricalView]);
	const handlePrevDay = () => {
		const baseDate = targetDate ? /* @__PURE__ */ new Date(`${targetDate}T00:00:00Z`) : /* @__PURE__ */ new Date();
		baseDate.setUTCDate(baseDate.getUTCDate() - getStepDaysForPeriod(period));
		const newDateStr = baseDate.toISOString().slice(0, 10);
		setTargetDate(newDateStr);
		loadChartData(period, newDateStr, candleType);
	};
	const handleNextDay = () => {
		if (!targetDate) return;
		const baseDate = /* @__PURE__ */ new Date(`${targetDate}T00:00:00Z`);
		baseDate.setUTCDate(baseDate.getUTCDate() + getStepDaysForPeriod(period));
		const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		const nextStr = baseDate.toISOString().slice(0, 10);
		if (nextStr >= todayStr) handleResetToLive();
		else {
			setTargetDate(nextStr);
			loadChartData(period, nextStr, candleType);
		}
	};
	const handleDateChange = (newDateStr) => {
		setTargetDate(newDateStr);
		loadChartData(period, newDateStr, candleType);
	};
	const handleResetToLive = () => {
		setTargetDate("");
		setIsHistoricalView(false);
		setSelectedDateClose(null);
		setSelectedDateString(null);
		loadChartData(period, "", candleType);
	};
	const visibleWindow = (0, import_react.useMemo)(() => {
		if (rawCandles.length === 0) return {
			slice: [],
			startIndex: 0,
			endIndex: 0
		};
		const count = Math.max(minViewCount, Math.min(rawCandles.length, viewCount));
		const maxOffset = Math.max(0, rawCandles.length - count);
		const clampedOffset = Math.max(0, Math.min(maxOffset, viewOffset));
		const startIndex = Math.max(0, rawCandles.length - count - clampedOffset);
		const endIndex = rawCandles.length - clampedOffset;
		return {
			slice: rawCandles.slice(startIndex, endIndex),
			startIndex,
			endIndex
		};
	}, [
		rawCandles,
		viewCount,
		viewOffset,
		minViewCount
	]);
	const visibleCandles = visibleWindow.slice;
	const width = containerWidth;
	const isNarrow = width < 540;
	const paddingLeft = isNarrow ? 10 : 16;
	const paddingRight = isNarrow ? 74 : 88;
	const innerWidth = Math.max(180, width - paddingLeft - paddingRight);
	const hasSubChartRsi = indicators.rsi.enabled;
	const hasSubChartMacd = indicators.macd.enabled;
	const hasSubChartStoch = indicators.stochastic.enabled;
	const subChartCount = (hasSubChartRsi ? 1 : 0) + (hasSubChartMacd ? 1 : 0) + (hasSubChartStoch ? 1 : 0);
	const mainPriceHeight = isNarrow ? 225 : 280;
	const volumeHeight = indicators.volume.enabled ? isNarrow ? 56 : 68 : 0;
	const subChartHeight = isNarrow ? 64 : 74;
	const bottomTimePadding = 28;
	const paddingTop = 22;
	const totalHeight = paddingTop + mainPriceHeight + volumeHeight + subChartCount * subChartHeight + bottomTimePadding;
	const { minPrice, maxPrice, priceRange } = (0, import_react.useMemo)(() => {
		if (visibleCandles.length === 0) return {
			minPrice: 0,
			maxPrice: 1,
			priceRange: 1
		};
		const rawMin = Math.min(...visibleCandles.map((c) => c.low));
		const rawMax = Math.max(...visibleCandles.map((c) => c.high));
		const center = (rawMax + rawMin) / 2;
		const rawHalf = (rawMax - rawMin) / 2;
		const paddedHalf = (rawHalf > 0 ? rawHalf : Math.max(center * .005, 1e-6)) * 1.08 / Math.max(.3, Math.min(5, yScale));
		const minP = Math.max(1e-8, center - paddedHalf);
		const maxP = center + paddedHalf;
		return {
			minPrice: minP,
			maxPrice: maxP,
			priceRange: Math.max(maxP - minP, 1e-8)
		};
	}, [visibleCandles, yScale]);
	const maxVolume = (0, import_react.useMemo)(() => {
		if (visibleCandles.length === 0) return 1;
		return Math.max(...visibleCandles.map((c) => c.volume)) || 1;
	}, [visibleCandles]);
	const getPriceY = (0, import_react.useCallback)((price) => {
		return paddingTop + mainPriceHeight - (price - minPrice) / priceRange * mainPriceHeight;
	}, [
		minPrice,
		priceRange,
		mainPriceHeight,
		paddingTop
	]);
	const getPriceFromY = (0, import_react.useCallback)((y) => {
		const ratio = (paddingTop + mainPriceHeight - y) / mainPriceHeight;
		return minPrice + ratio * priceRange;
	}, [
		minPrice,
		priceRange,
		mainPriceHeight,
		paddingTop
	]);
	const getCandleX = (0, import_react.useCallback)((indexInVisible) => {
		if (visibleCandles.length <= 1) return paddingLeft + innerWidth / 2;
		return paddingLeft + indexInVisible * (innerWidth / (visibleCandles.length - 1));
	}, [
		paddingLeft,
		innerWidth,
		visibleCandles.length
	]);
	const candleWidth = (0, import_react.useMemo)(() => {
		if (visibleCandles.length === 0) return 5;
		return Math.max(2, Math.min(20, innerWidth / Math.max(1, visibleCandles.length) * .68));
	}, [visibleCandles.length, innerWidth]);
	const allIndicatorSeries = (0, import_react.useMemo)(() => {
		if (rawCandles.length === 0) return null;
		return {
			sma5All: indicators.ma.enabled && indicators.ma.ma5 ? calculateSMA(rawCandles, indicators.ma.period5) : [],
			sma20All: indicators.ma.enabled && indicators.ma.ma20 ? calculateSMA(rawCandles, indicators.ma.period20) : [],
			sma60All: indicators.ma.enabled && indicators.ma.ma60 ? calculateSMA(rawCandles, indicators.ma.period60) : [],
			sma120All: indicators.ma.enabled && indicators.ma.ma120 ? calculateSMA(rawCandles, indicators.ma.period120) : [],
			emaAll: indicators.ema.enabled ? calculateEMA(rawCandles, indicators.ema.period) : [],
			bbAll: indicators.bollinger.enabled ? calculateBollingerBands(rawCandles, indicators.bollinger.period, indicators.bollinger.stdDev) : {
				upper: [],
				middle: [],
				lower: []
			},
			vwapAll: indicators.vwap.enabled ? calculateVWAP(rawCandles) : [],
			rsiAll: indicators.rsi.enabled ? calculateRSI(rawCandles, indicators.rsi.period) : [],
			macdAll: indicators.macd.enabled ? calculateMACD(rawCandles, indicators.macd.fastPeriod, indicators.macd.slowPeriod, indicators.macd.signalPeriod) : {
				macdLine: [],
				signalLine: [],
				histogram: []
			},
			stochAll: indicators.stochastic.enabled ? calculateStochastic(rawCandles, indicators.stochastic.kPeriod, indicators.stochastic.dPeriod) : {
				kLine: [],
				dLine: []
			}
		};
	}, [rawCandles, indicators]);
	const { sma5Slice, sma20Slice, sma60Slice, sma120Slice, emaSlice, bollingerSlice, vwapSlice, rsiSlice, macdSlice, stochSlice } = (0, import_react.useMemo)(() => {
		if (!allIndicatorSeries) return {
			sma5Slice: [],
			sma20Slice: [],
			sma60Slice: [],
			sma120Slice: [],
			emaSlice: [],
			bollingerSlice: {
				upper: [],
				middle: [],
				lower: []
			},
			vwapSlice: [],
			rsiSlice: [],
			macdSlice: {
				macdLine: [],
				signalLine: [],
				histogram: []
			},
			stochSlice: {
				kLine: [],
				dLine: []
			}
		};
		const { startIndex, endIndex } = visibleWindow;
		const { sma5All, sma20All, sma60All, sma120All, emaAll, bbAll, vwapAll, rsiAll, macdAll, stochAll } = allIndicatorSeries;
		return {
			sma5Slice: sma5All.slice(startIndex, endIndex),
			sma20Slice: sma20All.slice(startIndex, endIndex),
			sma60Slice: sma60All.slice(startIndex, endIndex),
			sma120Slice: sma120All.slice(startIndex, endIndex),
			emaSlice: emaAll.slice(startIndex, endIndex),
			bollingerSlice: {
				upper: bbAll.upper.slice(startIndex, endIndex),
				middle: bbAll.middle.slice(startIndex, endIndex),
				lower: bbAll.lower.slice(startIndex, endIndex)
			},
			vwapSlice: vwapAll.slice(startIndex, endIndex),
			rsiSlice: rsiAll.slice(startIndex, endIndex),
			macdSlice: {
				macdLine: macdAll.macdLine.slice(startIndex, endIndex),
				signalLine: macdAll.signalLine.slice(startIndex, endIndex),
				histogram: macdAll.histogram.slice(startIndex, endIndex)
			},
			stochSlice: {
				kLine: stochAll.kLine.slice(startIndex, endIndex),
				dLine: stochAll.dLine.slice(startIndex, endIndex)
			}
		};
	}, [allIndicatorSeries, visibleWindow]);
	const generateSeriesPath = (0, import_react.useCallback)((series) => {
		const points = [];
		for (let i = 0; i < series.length; i++) {
			const val = series[i];
			if (val !== null && val !== void 0 && Number.isFinite(val)) {
				const x = getCandleX(i);
				const y = getPriceY(val);
				points.push(`${points.length === 0 ? "M" : "L"} ${x.toFixed(1)},${y.toFixed(1)}`);
			}
		}
		return points.join(" ");
	}, [getCandleX, getPriceY]);
	const activeSliceIndex = (0, import_react.useMemo)(() => {
		if (hoverIndex !== null && visibleCandles[hoverIndex]) return hoverIndex;
		return visibleCandles.length > 0 ? visibleCandles.length - 1 : -1;
	}, [hoverIndex, visibleCandles]);
	const display = activeSliceIndex >= 0 ? visibleCandles[activeSliceIndex] : null;
	const isDisplayUp = display ? display.close >= display.open : true;
	const candleChange = display ? display.close - display.open : 0;
	const candleChangePercent = display && display.open > 0 ? (candleChange / display.open * 100).toFixed(2) : "0.00";
	const volumeStartY = paddingTop + mainPriceHeight;
	let currentSubY = volumeStartY + volumeHeight;
	const rsiStartY = hasSubChartRsi ? (currentSubY += subChartHeight, currentSubY - subChartHeight) : 0;
	const macdStartY = hasSubChartMacd ? (currentSubY += subChartHeight, currentSubY - subChartHeight) : 0;
	const stochStartY = hasSubChartStoch ? (currentSubY += subChartHeight, currentSubY - subChartHeight) : 0;
	const wheelHandlerRef = (0, import_react.useRef)(() => {});
	wheelHandlerRef.current = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (rawCandles.length === 0 || !svgRef.current) return;
		const rect = svgRef.current.getBoundingClientRect();
		const svgX = (e.clientX - rect.left) / rect.width * width;
		const zoomFactor = e.deltaY > 0 ? 1.15 : .85;
		const relativeMouseX = Math.max(0, Math.min(1, (svgX - paddingLeft) / innerWidth));
		const prevCount = viewCount;
		const nextCount = Math.max(minViewCount, Math.min(rawCandles.length, Math.round(prevCount * zoomFactor)));
		if (nextCount === prevCount && rawCandles.length > minViewCount) {
			const nudged = e.deltaY > 0 ? Math.min(rawCandles.length, prevCount + 2) : Math.max(minViewCount, prevCount - 2);
			const maxOffset = Math.max(0, rawCandles.length - nudged);
			const newOffset = Math.max(0, Math.min(maxOffset, Math.round(viewOffset + (prevCount - nudged) * relativeMouseX)));
			if (rAFPendingRef.current) cancelAnimationFrame(rAFPendingRef.current);
			rAFPendingRef.current = requestAnimationFrame(() => {
				setViewCount(nudged);
				setViewOffset(newOffset);
			});
			return;
		}
		const maxOffset = Math.max(0, rawCandles.length - nextCount);
		const newOffset = Math.max(0, Math.min(maxOffset, Math.round(viewOffset + (prevCount - nextCount) * relativeMouseX)));
		if (rAFPendingRef.current) cancelAnimationFrame(rAFPendingRef.current);
		rAFPendingRef.current = requestAnimationFrame(() => {
			setViewCount(nextCount);
			setViewOffset(newOffset);
		});
	};
	const touchMoveHandlerRef = (0, import_react.useRef)(() => {});
	touchMoveHandlerRef.current = (e) => {
		if (!svgRef.current || rawCandles.length === 0) return;
		e.preventDefault();
		e.stopPropagation();
		if (e.touches.length === 1 && dragModeRef.current === "pan" && panStartRef.current) {
			const touch = e.touches[0];
			const rect = svgRef.current.getBoundingClientRect();
			const svgDeltaX = (touch.clientX - panStartRef.current.x) / rect.width * width;
			const candlePixelWidth = innerWidth / Math.max(1, visibleCandles.length);
			const candleDelta = Math.round(svgDeltaX / Math.max(1, candlePixelWidth));
			const maxOffset = Math.max(0, rawCandles.length - viewCount);
			const newOffset = Math.max(0, Math.min(maxOffset, panStartRef.current.offset + candleDelta));
			const svgX = (touch.clientX - rect.left) / rect.width * width;
			const index = Math.round((svgX - paddingLeft) / innerWidth * Math.max(1, visibleCandles.length - 1));
			const clampedIndex = Math.max(0, Math.min(visibleCandles.length - 1, index));
			if (rAFPendingRef.current) cancelAnimationFrame(rAFPendingRef.current);
			rAFPendingRef.current = requestAnimationFrame(() => {
				setViewOffset(newOffset);
				setHoverIndex(clampedIndex);
			});
		} else if (e.touches.length === 2 && touchStartDistRef.current) {
			const t1 = e.touches[0];
			const t2 = e.touches[1];
			const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
			if (dist <= 0) return;
			const ratio = touchStartDistRef.current / dist;
			if (Math.abs(ratio - 1) > .03) {
				const rect = svgRef.current.getBoundingClientRect();
				const centerSvgX = ((t1.clientX + t2.clientX) / 2 - rect.left) / rect.width * width;
				const relativeCenterX = Math.max(0, Math.min(1, (centerSvgX - paddingLeft) / innerWidth));
				const prevCount = viewCount;
				const nextCount = Math.max(minViewCount, Math.min(rawCandles.length, Math.round(prevCount * ratio)));
				const maxOffset = Math.max(0, rawCandles.length - nextCount);
				const newOffset = Math.max(0, Math.min(maxOffset, Math.round(viewOffset + (prevCount - nextCount) * relativeCenterX)));
				touchStartDistRef.current = dist;
				if (rAFPendingRef.current) cancelAnimationFrame(rAFPendingRef.current);
				rAFPendingRef.current = requestAnimationFrame(() => {
					setViewCount(nextCount);
					setViewOffset(newOffset);
				});
			}
		}
	};
	(0, import_react.useEffect)(() => {
		const svgEl = svgRef.current;
		if (!svgEl) return;
		const onWheelNative = (e) => wheelHandlerRef.current(e);
		const onTouchMoveNative = (e) => touchMoveHandlerRef.current(e);
		svgEl.addEventListener("wheel", onWheelNative, { passive: false });
		svgEl.addEventListener("touchmove", onTouchMoveNative, { passive: false });
		return () => {
			svgEl.removeEventListener("wheel", onWheelNative);
			svgEl.removeEventListener("touchmove", onTouchMoveNative);
			if (rAFPendingRef.current) cancelAnimationFrame(rAFPendingRef.current);
		};
	}, [
		rawCandles.length,
		isLoading,
		apiError
	]);
	const zoomIn = () => {
		setViewCount((prev) => Math.max(minViewCount, Math.round(prev * .8)));
	};
	const zoomOut = () => {
		setViewCount((prev) => Math.min(rawCandles.length || 60, Math.round(prev * 1.25)));
	};
	const resetView = () => {
		setViewOffset(0);
		setYScale(1);
		setViewCount(rawCandles.length > 0 ? Math.min(rawCandles.length, 60) : 60);
	};
	const viewAllData = () => {
		setViewOffset(0);
		setYScale(1);
		setViewCount(Math.max(1, rawCandles.length));
	};
	const handleMouseDown = (e) => {
		if (!svgRef.current || visibleCandles.length === 0) return;
		const rect = svgRef.current.getBoundingClientRect();
		const clientX = e.clientX - rect.left;
		const clientY = e.clientY - rect.top;
		const svgX = clientX / rect.width * width;
		const svgY = clientY / rect.height * totalHeight;
		if (activeTool !== "none") {
			const candleIndex = Math.max(0, Math.min(visibleCandles.length - 1, Math.round((svgX - paddingLeft) / innerWidth * Math.max(1, visibleCandles.length - 1))));
			const newPoint = {
				x: svgX,
				y: getPriceFromY(svgY),
				candleIndex
			};
			if (activeTool === "horizontal" || activeTool === "vertical") {
				const newShape = {
					id: `draw_${Date.now()}`,
					type: activeTool,
					color: "#f43f5e",
					lineWidth: 1.5,
					startPoint: newPoint
				};
				setShapes((prev) => [...prev, newShape]);
				setActiveTool("none");
			} else setDrawingShape({
				id: `draw_${Date.now()}`,
				type: activeTool,
				color: activeTool === "fibonacci" ? "#fbbf24" : "#38bdf8",
				lineWidth: 1.5,
				startPoint: newPoint
			});
			return;
		}
		if (svgX >= width - paddingRight) {
			dragModeRef.current = "priceAxis";
			setIsDraggingUI(true);
			panStartRef.current = {
				x: e.clientX,
				y: e.clientY,
				offset: viewOffset,
				count: viewCount,
				yScale
			};
			return;
		}
		if (svgY >= totalHeight - bottomTimePadding) {
			dragModeRef.current = "timeAxis";
			setIsDraggingUI(true);
			panStartRef.current = {
				x: e.clientX,
				y: e.clientY,
				offset: viewOffset,
				count: viewCount,
				yScale
			};
			return;
		}
		dragModeRef.current = "pan";
		setIsDraggingUI(true);
		panStartRef.current = {
			x: e.clientX,
			y: e.clientY,
			offset: viewOffset,
			count: viewCount,
			yScale
		};
	};
	const handleMouseMove = (e) => {
		if (!svgRef.current || visibleCandles.length === 0) return;
		const rect = svgRef.current.getBoundingClientRect();
		const clientX = e.clientX - rect.left;
		const clientY = e.clientY - rect.top;
		const svgX = clientX / rect.width * width;
		const svgY = clientY / rect.height * totalHeight;
		const index = Math.round((svgX - paddingLeft) / innerWidth * Math.max(1, visibleCandles.length - 1));
		const clampedIndex = Math.max(0, Math.min(visibleCandles.length - 1, index));
		const mode = dragModeRef.current;
		const start = panStartRef.current;
		if (rAFPendingRef.current) cancelAnimationFrame(rAFPendingRef.current);
		rAFPendingRef.current = requestAnimationFrame(() => {
			setHoverIndex(clampedIndex);
			setHoverPrice(getPriceFromY(svgY));
			if (mode === "pan" && start) {
				const svgDeltaX = (e.clientX - start.x) / rect.width * width;
				const candlePixelWidth = innerWidth / Math.max(1, visibleCandles.length);
				const candleDelta = Math.round(svgDeltaX / Math.max(1, candlePixelWidth));
				const maxOffset = Math.max(0, rawCandles.length - viewCount);
				setViewOffset(Math.max(0, Math.min(maxOffset, start.offset + candleDelta)));
			} else if (mode === "priceAxis" && start) {
				const deltaY = start.y - e.clientY;
				const nextScale = Math.max(.3, Math.min(5, start.yScale * Math.exp(deltaY * .006)));
				setYScale(Number(nextScale.toFixed(3)));
			} else if (mode === "timeAxis" && start) {
				const deltaX = e.clientX - start.x;
				const nextCount = Math.max(minViewCount, Math.min(rawCandles.length, Math.round(start.count * Math.exp(deltaX * .005))));
				const maxOffset = Math.max(0, rawCandles.length - nextCount);
				setViewCount(nextCount);
				setViewOffset((prev) => Math.min(maxOffset, prev));
			}
			if (drawingShape && drawingShape.startPoint) {
				const candleIdx = Math.max(0, Math.min(visibleCandles.length - 1, Math.round((svgX - paddingLeft) / innerWidth * Math.max(1, visibleCandles.length - 1))));
				setDrawingShape((prev) => ({
					...prev,
					endPoint: {
						x: svgX,
						y: getPriceFromY(svgY),
						candleIndex: candleIdx
					}
				}));
			}
		});
	};
	const handleMouseUp = () => {
		if (dragModeRef.current !== "none") {
			dragModeRef.current = "none";
			setIsDraggingUI(false);
			panStartRef.current = null;
		}
		if (drawingShape && drawingShape.startPoint && drawingShape.endPoint) {
			setShapes((prev) => [...prev, drawingShape]);
			setDrawingShape(null);
			setActiveTool("none");
		}
	};
	const handleMouseLeave = () => {
		dragModeRef.current = "none";
		setIsDraggingUI(false);
		panStartRef.current = null;
		setHoverIndex(null);
		setHoverPrice(null);
		if (drawingShape) {
			setDrawingShape(null);
			setActiveTool("none");
		}
	};
	const handleTouchStart = (e) => {
		e.stopPropagation();
		if (e.touches.length === 1) {
			const touch = e.touches[0];
			dragModeRef.current = "pan";
			setIsDraggingUI(true);
			panStartRef.current = {
				x: touch.clientX,
				y: touch.clientY,
				offset: viewOffset,
				count: viewCount,
				yScale
			};
		} else if (e.touches.length === 2) {
			dragModeRef.current = "none";
			const t1 = e.touches[0];
			const t2 = e.touches[1];
			touchStartDistRef.current = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
		}
	};
	const handleTouchEnd = (e) => {
		e.stopPropagation();
		dragModeRef.current = "none";
		setIsDraggingUI(false);
		panStartRef.current = null;
		touchStartDistRef.current = null;
	};
	const deleteSelectedShape = (0, import_react.useCallback)(() => {
		if (selectedShapeId) {
			setShapes((prev) => prev.filter((s) => s.id !== selectedShapeId));
			setSelectedShapeId(null);
		}
	}, [selectedShapeId]);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if ((e.key === "Delete" || e.key === "Backspace") && selectedShapeId) deleteSelectedShape();
			else if (e.key === "Escape" && activeTool !== "none") {
				setActiveTool("none");
				setDrawingShape(null);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		selectedShapeId,
		activeTool,
		deleteSelectedShape
	]);
	const clearAllShapes = () => {
		setShapes([]);
		setSelectedShapeId(null);
		setDrawingShape(null);
		setActiveTool("none");
	};
	const handleSelectCandleType = (nextType) => {
		setCandleType(nextType);
		setIsMinuteMenuOpen(false);
		if (nextType === "minute") {
			if (!MINUTE_PERIODS.some((mp) => mp.id === period) && period !== "1d" && period !== "1w") setPeriod("1d");
		} else if (nextType === "day") {
			if (period === "1d" || MINUTE_PERIODS.some((mp) => mp.id === period)) setPeriod("3mo");
		} else if (nextType === "week") {
			if (period === "1d" || period === "1w" || MINUTE_PERIODS.some((mp) => mp.id === period)) setPeriod("1y");
		} else if (nextType === "month") {
			if (period === "1d" || period === "1w" || period === "1mo" || MINUTE_PERIODS.some((mp) => mp.id === period)) setPeriod("3y");
		}
	};
	const activeIndicatorCount = [
		indicators.ma.enabled,
		indicators.ema.enabled,
		indicators.bollinger.enabled,
		indicators.vwap.enabled,
		indicators.rsi.enabled,
		indicators.macd.enabled,
		indicators.stochastic.enabled
	].filter(Boolean).length;
	const hoverMa5 = activeSliceIndex >= 0 ? sma5Slice[activeSliceIndex] : null;
	const hoverMa20 = activeSliceIndex >= 0 ? sma20Slice[activeSliceIndex] : null;
	const hoverMa60 = activeSliceIndex >= 0 ? sma60Slice[activeSliceIndex] : null;
	const hoverEma = activeSliceIndex >= 0 ? emaSlice[activeSliceIndex] : null;
	const hoverRsi = activeSliceIndex >= 0 ? rsiSlice[activeSliceIndex] : null;
	const isStale = Boolean(chartMeta?.isStale);
	const priceTagWidth = isNarrow ? 70 : 82;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: chartContainerRef,
		className: "space-y-2.5 font-sans",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 bg-finance-card p-2.5 rounded-2xl border border-finance-border shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-finance-accent/10 text-finance-accent border border-finance-accent/25 text-[11px] font-bold font-mono",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-finance-accent animate-pulse" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: getSourceLabel(chartMeta?.source) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "opacity-70",
									children: ["· ", chartMeta?.currency || activeCurrency]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex p-0.5 bg-finance-sub-bg rounded-xl text-xs font-semibold overflow-x-auto scrollbar-none border border-finance-border",
							children: PRIMARY_PERIODS.map((p) => {
								const isActive = period === p.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setPeriod(p.id);
										setCandleType(p.defaultCandleType);
										setIsMinuteMenuOpen(false);
									},
									disabled: isLoading && period === p.id,
									className: `px-2 sm:px-2.5 py-1 rounded-lg transition-all shrink-0 font-mono text-xs cursor-pointer ${isActive ? "bg-finance-accent text-white font-bold shadow-xs" : "text-finance-sub-text hover:text-finance-text"}`,
									title: p.description,
									children: p.label
								}, p.id);
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center p-0.5 bg-finance-sub-bg rounded-xl text-xs font-semibold border border-finance-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setIsMinuteMenuOpen((o) => !o),
									className: `flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all text-xs font-mono cursor-pointer ${candleType === "minute" ? "bg-rose-500 text-white font-bold shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
									title: "분봉 선택 (1분, 5분, 15분, 30분, 60분)",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: MINUTE_PERIODS.find((mp) => mp.id === period)?.label || "분봉" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-3 h-3" })]
								}), isMinuteMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute left-0 mt-1.5 w-28 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl p-1.5 z-40 text-xs space-y-0.5",
									children: MINUTE_PERIODS.map((mp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											setPeriod(mp.id);
											setCandleType("minute");
											setIsMinuteMenuOpen(false);
										},
										className: `w-full text-left px-2 py-1 rounded-lg font-mono cursor-pointer ${period === mp.id && candleType === "minute" ? "bg-rose-500 text-white font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"}`,
										children: [mp.label, "봉"]
									}, mp.id))
								})]
							}), [
								{
									id: "day",
									label: "일봉"
								},
								{
									id: "week",
									label: "주봉"
								},
								{
									id: "month",
									label: "월봉"
								}
							].map((ct) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => handleSelectCandleType(ct.id),
								className: `px-2 sm:px-2.5 py-1 rounded-lg transition-all text-xs font-mono cursor-pointer ${candleType === ct.id ? "bg-rose-500 text-white font-bold shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
								children: ct.label
							}, ct.id))]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex p-0.5 bg-slate-200/60 dark:bg-slate-800 rounded-xl text-xs font-semibold shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setChartType("candle"),
								className: `px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${chartType === "candle" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
								children: "봉"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setChartType("line"),
								className: `px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${chartType === "line" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
								children: "선"
							})]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-finance-border/60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handlePrevDay,
								disabled: isLoading,
								className: "p-1.5 rounded-lg bg-finance-sub-bg border border-finance-border text-finance-sub-text hover:text-finance-text transition-colors cursor-pointer",
								title: "이전 날짜 구간으로 이동",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-3.5 h-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "relative flex items-center gap-1.5 px-2 py-1 rounded-lg bg-finance-sub-bg border border-finance-border text-[11px] font-mono text-finance-text",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3 h-3 text-slate-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: targetDate,
									max: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
									onChange: (e) => handleDateChange(e.target.value),
									className: "bg-transparent focus:outline-none text-[11px] font-mono w-[108px] cursor-pointer",
									"aria-label": "조회 기준일"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleNextDay,
								disabled: isLoading || !targetDate,
								className: "p-1.5 rounded-lg bg-finance-sub-bg border border-finance-border text-finance-sub-text hover:text-finance-text disabled:opacity-40 transition-colors cursor-pointer",
								title: "다음 날짜 구간으로 이동",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5" })
							}),
							(isHistoricalView || targetDate) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleResetToLive,
								className: "flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/25 text-[11px] font-bold hover:bg-rose-500/20 transition-colors cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "실시간 복귀" })]
							}),
							isHistoricalView && selectedDateString && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] font-mono text-slate-400 px-1.5",
								children: [
									"기준일 ",
									selectedDateString,
									selectedDateClose ? ` (종가 ${formatPrice(selectedDateClose)})` : ""
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setIsIndicatorMenuOpen((o) => !o);
										setIsDrawingMenuOpen(false);
									},
									className: "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors cursor-pointer",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-3.5 h-3.5 text-rose-500" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"지표 (",
											activeIndicatorCount,
											")"
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-3 h-3 text-slate-400" })
									]
								}), isIndicatorMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute right-0 mt-1.5 w-56 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl p-2 z-40 text-xs space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider",
											children: "보조지표 빠른 ON/OFF"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setIndicators((prev) => ({
												...prev,
												ma: {
													...prev.ma,
													enabled: !prev.ma.enabled
												}
											})),
											className: "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-left font-medium cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-amber-500" }), "이동평균 (MA 5/20/60/120)"]
											}), indicators.ma.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-rose-500" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setIndicators((prev) => ({
												...prev,
												ema: {
													...prev.ema,
													enabled: !prev.ema.enabled
												}
											})),
											className: "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-left font-medium cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-pink-500" }),
													"지수이동평균 (EMA ",
													indicators.ema.period,
													")"
												]
											}), indicators.ema.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-rose-500" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setIndicators((prev) => ({
												...prev,
												bollinger: {
													...prev.bollinger,
													enabled: !prev.bollinger.enabled
												}
											})),
											className: "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-left font-medium cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-indigo-500" }),
													"볼린저 밴드 (BB ",
													indicators.bollinger.period,
													", ",
													indicators.bollinger.stdDev,
													")"
												]
											}), indicators.bollinger.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-rose-500" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setIndicators((prev) => ({
												...prev,
												vwap: { enabled: !prev.vwap.enabled }
											})),
											className: "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-left font-medium cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-emerald-500" }), "VWAP (거래량가중평균가)"]
											}), indicators.vwap.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-rose-500" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setIndicators((prev) => ({
												...prev,
												rsi: {
													...prev.rsi,
													enabled: !prev.rsi.enabled
												}
											})),
											className: "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-left font-medium cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-cyan-500" }),
													"RSI (",
													indicators.rsi.period,
													")"
												]
											}), indicators.rsi.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-rose-500" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setIndicators((prev) => ({
												...prev,
												macd: {
													...prev.macd,
													enabled: !prev.macd.enabled
												}
											})),
											className: "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-left font-medium cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-rose-500" }),
													"MACD (",
													indicators.macd.fastPeriod,
													",",
													indicators.macd.slowPeriod,
													",",
													indicators.macd.signalPeriod,
													")"
												]
											}), indicators.macd.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-rose-500" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setIndicators((prev) => ({
												...prev,
												stochastic: {
													...prev.stochastic,
													enabled: !prev.stochastic.enabled
												}
											})),
											className: "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-left font-medium cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-purple-500" }),
													"스토캐스틱 (",
													indicators.stochastic.kPeriod,
													",",
													indicators.stochastic.dPeriod,
													")"
												]
											}), indicators.stochastic.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-rose-500" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "pt-1.5 border-t border-slate-100 dark:border-slate-700",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													setIsIndicatorMenuOpen(false);
													setIsSettingsModalOpen(true);
												},
												className: "w-full text-center py-1.5 font-bold text-rose-500 hover:text-rose-600 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer",
												children: "기간값 및 상세 설정 열기"
											})
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setIsDrawingMenuOpen((o) => !o);
										setIsIndicatorMenuOpen(false);
									},
									className: `flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${activeTool !== "none" ? "bg-rose-500 text-white border-rose-600 shadow-xs" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "w-3.5 h-3.5" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: activeTool === "none" ? `그리기 (${shapes.length})` : activeTool === "trendline" ? "추세선" : activeTool === "horizontal" ? "수평선" : activeTool === "vertical" ? "수직선" : activeTool === "rectangle" ? "사각형" : "피보나치" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-3 h-3 text-slate-400" })
									]
								}), isDrawingMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute right-0 mt-1.5 w-48 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl p-2 z-40 text-xs space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												setActiveTool("trendline");
												setIsDrawingMenuOpen(false);
											},
											className: `w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left cursor-pointer ${activeTool === "trendline" ? "bg-rose-500/10 text-rose-500 font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-700"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2.5 h-0.5 bg-sky-400 rotate-45 inline-block" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "추세선 (Trendline)" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												setActiveTool("horizontal");
												setIsDrawingMenuOpen(false);
											},
											className: `w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left cursor-pointer ${activeTool === "horizontal" ? "bg-rose-500/10 text-rose-500 font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-700"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 h-0.5 bg-rose-500 inline-block" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "수평선 (지지/저항선)" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												setActiveTool("vertical");
												setIsDrawingMenuOpen(false);
											},
											className: `w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left cursor-pointer ${activeTool === "vertical" ? "bg-rose-500/10 text-rose-500 font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-700"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-0.5 h-3 bg-indigo-500 inline-block" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "수직선 (시간선)" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												setActiveTool("rectangle");
												setIsDrawingMenuOpen(false);
											},
											className: `w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left cursor-pointer ${activeTool === "rectangle" ? "bg-rose-500/10 text-rose-500 font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-700"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 h-2.5 border border-emerald-400 inline-block" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "사각형 영역" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												setActiveTool("fibonacci");
												setIsDrawingMenuOpen(false);
											},
											className: `w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left cursor-pointer ${activeTool === "fibonacci" ? "bg-rose-500/10 text-rose-500 font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-700"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "w-3.5 h-3.5 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "피보나치 되돌림" })]
										}),
										shapes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pt-1.5 border-t border-slate-100 dark:border-slate-700 flex items-center gap-1",
											children: [selectedShapeId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													deleteSelectedShape();
													setIsDrawingMenuOpen(false);
												},
												className: "flex-1 py-1 text-center rounded-lg bg-slate-100 dark:bg-slate-700 text-rose-500 font-semibold cursor-pointer",
												children: "선택 삭제"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => {
													clearAllShapes();
													setIsDrawingMenuOpen(false);
												},
												className: "flex-1 py-1 text-center rounded-lg bg-rose-500/10 text-rose-500 font-semibold flex items-center justify-center gap-1 cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "전체 지우기" })]
											})]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsSettingsModalOpen(true),
								className: "p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer",
								title: "보조지표 기간값 상세설정",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "w-4 h-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-0.5 bg-slate-200/50 dark:bg-slate-800/80 p-0.5 rounded-xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: zoomIn,
										className: "p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer",
										title: "확대 (줌 인)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { className: "w-3.5 h-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: zoomOut,
										className: "p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer",
										title: "축소 (줌 아웃)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomOut, { className: "w-3.5 h-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: viewAllData,
										className: "px-2 py-0.5 rounded-lg text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer",
										title: "전체 구간 보기",
										children: "전체"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: resetView,
										className: "p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer",
										title: "초기 뷰 복원 (더블클릭)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3.5 h-3.5" })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => loadChartData(period, targetDate, candleType),
								disabled: isLoading,
								className: "p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer",
								title: "차트 데이터 새로고침",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3.5 h-3.5 ${isLoading ? "animate-spin text-rose-500" : ""}` })
							})
						]
					})]
				})]
			}),
			isStale && !isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "현재 표시 중인 시세는 지연 또는 최근 정상 보존된 차트 데이터입니다." })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => loadChartData(period, targetDate, candleType),
					className: "text-[11px] font-bold underline cursor-pointer shrink-0",
					children: "갱신"
				})]
			}),
			display && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-3 py-2 rounded-xl bg-finance-sub-bg/80 border border-finance-border text-[11px] font-mono tabular-nums",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-x-3 gap-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-finance-text",
							children: display.time
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-slate-400",
							children: ["시 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-finance-text font-semibold",
								children: formatPrice(display.open)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-slate-400",
							children: ["고 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-rose-500 font-semibold",
								children: formatPrice(display.high)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-slate-400",
							children: ["저 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-blue-500 font-semibold",
								children: formatPrice(display.low)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-slate-400",
							children: [
								"종",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: isDisplayUp ? "text-rose-500 font-bold" : "text-blue-500 font-bold",
									children: formatPrice(display.close)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `font-bold ${isDisplayUp ? "text-rose-500" : "text-blue-500"}`,
							children: [
								candleChange >= 0 ? "+" : "",
								formatPrice(candleChange),
								" (",
								candleChange >= 0 ? "+" : "",
								candleChangePercent,
								"%)"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-slate-400",
							children: ["거래량 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-finance-text font-semibold",
								children: display.volume.toLocaleString()
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10px]",
					children: [
						hoverPrice !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-slate-400",
							children: ["커서 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-finance-text",
								children: formatPrice(hoverPrice)
							})]
						}),
						indicators.ma.enabled && hoverMa5 !== null && hoverMa5 !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-amber-500",
							children: [
								"MA",
								indicators.ma.period5,
								" ",
								formatAxisPrice(hoverMa5)
							]
						}),
						indicators.ma.enabled && hoverMa20 !== null && hoverMa20 !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-purple-500",
							children: [
								"MA",
								indicators.ma.period20,
								" ",
								formatAxisPrice(hoverMa20)
							]
						}),
						indicators.ma.enabled && hoverMa60 !== null && hoverMa60 !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-emerald-500",
							children: [
								"MA",
								indicators.ma.period60,
								" ",
								formatAxisPrice(hoverMa60)
							]
						}),
						indicators.ema.enabled && hoverEma !== null && hoverEma !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-pink-500",
							children: [
								"EMA",
								indicators.ema.period,
								" ",
								formatAxisPrice(hoverEma)
							]
						}),
						indicators.rsi.enabled && hoverRsi !== null && hoverRsi !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-cyan-500",
							children: ["RSI ", hoverRsi.toFixed(1)]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full rounded-2xl bg-finance-card border border-finance-border p-2 sm:p-3 overflow-hidden min-h-[380px] sm:min-h-[420px] flex items-center justify-center select-none shadow-xs",
				children: [
					isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/80 dark:bg-[#0c0f17]/90 backdrop-blur-xs transition-opacity",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-10 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mb-3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold text-slate-800 dark:text-slate-200",
								children: "실시간 차트 데이터 조회 중..."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-slate-400 font-mono mt-1",
								children: [
									currentPeriodConfig.label,
									" · ",
									candleType === "minute" ? "분봉" : candleType === "day" ? "일봉" : candleType === "week" ? "주봉" : "월봉"
								]
							})
						]
					}),
					!isLoading && apiError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full max-w-lg p-5 my-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-center space-y-3 z-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-12 h-12 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-6 h-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-base font-bold text-rose-500",
								children: "차트 데이터 조회 안내"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed whitespace-pre-line",
								children: apiError
							})] }),
							apiError.includes("8050") && serverIp && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-3 bg-slate-900 rounded-xl border border-slate-800 text-left font-mono text-xs space-y-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-slate-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "현재 서버 공인 IP:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-emerald-400 font-bold",
										children: serverIp
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => loadChartData(period, targetDate, candleType),
								className: "px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-colors inline-flex items-center gap-1.5 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "차트 다시 시도" })]
							})
						]
					}),
					!isLoading && !apiError && rawCandles.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center py-12 space-y-2.5 text-slate-400",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { className: "w-10 h-10 mx-auto text-slate-500 opacity-60" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-slate-600 dark:text-slate-300",
								children: "선택한 조건의 차트 데이터가 없습니다."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500",
								children: "장 개시 전이거나 해당 날짜에 체결 이력이 없습니다. 임의의 데이터를 생성하지 않습니다."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-center gap-2 pt-1",
								children: [targetDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: handleResetToLive,
									className: "px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-bold cursor-pointer",
									children: "실시간 최근 구간 보기"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => loadChartData(period, targetDate, candleType),
									className: "px-3 py-1.5 rounded-lg border border-finance-border text-xs font-semibold hover:bg-finance-sub-bg cursor-pointer",
									children: "새로고침"
								})]
							})
						]
					}),
					activeTool !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold shadow-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["도형 그리기: ", activeTool] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setActiveTool("none");
								setDrawingShape(null);
							},
							className: "text-white hover:text-rose-200 underline text-[11px] cursor-pointer",
							children: "취소 (ESC)"
						})]
					}),
					!isLoading && !apiError && visibleCandles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						ref: svgRef,
						viewBox: `0 0 ${width} ${totalHeight}`,
						className: `w-full h-auto select-none touch-none ${isDraggingUI ? "cursor-grabbing" : activeTool !== "none" ? "cursor-crosshair" : "cursor-crosshair"}`,
						onMouseDown: handleMouseDown,
						onMouseMove: handleMouseMove,
						onMouseUp: handleMouseUp,
						onMouseLeave: handleMouseLeave,
						onDoubleClick: resetView,
						onTouchStart: handleTouchStart,
						onTouchEnd: handleTouchEnd,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: paddingLeft,
								y1: paddingTop,
								x2: width - paddingRight,
								y2: paddingTop,
								stroke: gridColor,
								strokeDasharray: "3 3"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: paddingLeft,
								y1: paddingTop + mainPriceHeight * .25,
								x2: width - paddingRight,
								y2: paddingTop + mainPriceHeight * .25,
								stroke: gridColor,
								strokeDasharray: "3 3"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: paddingLeft,
								y1: paddingTop + mainPriceHeight * .5,
								x2: width - paddingRight,
								y2: paddingTop + mainPriceHeight * .5,
								stroke: gridColor,
								strokeDasharray: "3 3"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: paddingLeft,
								y1: paddingTop + mainPriceHeight * .75,
								x2: width - paddingRight,
								y2: paddingTop + mainPriceHeight * .75,
								stroke: gridColor,
								strokeDasharray: "3 3"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: paddingLeft,
								y1: paddingTop + mainPriceHeight,
								x2: width - paddingRight,
								y2: paddingTop + mainPriceHeight,
								stroke: gridColor
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: width - paddingRight,
								y: paddingTop,
								width: paddingRight,
								height: mainPriceHeight,
								fill: "transparent",
								className: "cursor-ns-resize",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: "위아래 드래그로 가격축 확대/축소 · 더블클릭으로 초기화" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: width - 8,
								y: 33,
								fill: axisTextColor,
								className: "text-[10px] font-mono tabular-nums",
								textAnchor: "end",
								children: formatAxisPrice(maxPrice)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: width - 8,
								y: paddingTop + mainPriceHeight * .25 + 3,
								fill: axisTextColor,
								className: "text-[10px] font-mono tabular-nums",
								textAnchor: "end",
								children: formatAxisPrice(minPrice + priceRange * .75)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: width - 8,
								y: paddingTop + mainPriceHeight * .5 + 3,
								fill: axisTextColor,
								className: "text-[10px] font-mono tabular-nums",
								textAnchor: "end",
								children: formatAxisPrice((maxPrice + minPrice) / 2)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: width - 8,
								y: paddingTop + mainPriceHeight * .75 + 3,
								fill: axisTextColor,
								className: "text-[10px] font-mono tabular-nums",
								textAnchor: "end",
								children: formatAxisPrice(minPrice + priceRange * .25)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: width - 8,
								y: paddingTop + mainPriceHeight - 4,
								fill: axisTextColor,
								className: "text-[10px] font-mono tabular-nums",
								textAnchor: "end",
								children: formatAxisPrice(minPrice)
							}),
							prevClose > 0 && prevClose >= minPrice && prevClose <= maxPrice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
								className: "pointer-events-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: paddingLeft,
										y1: getPriceY(prevClose),
										x2: width - paddingRight,
										y2: getPriceY(prevClose),
										stroke: "#94a3b8",
										strokeDasharray: "4 4",
										strokeWidth: "1",
										opacity: "0.7"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										x: paddingLeft + 4,
										y: getPriceY(prevClose) - 14,
										width: "82",
										height: "13",
										rx: "3",
										fill: isDark ? "#1e293b" : "#f1f5f9",
										opacity: "0.88"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
										x: paddingLeft + 8,
										y: getPriceY(prevClose) - 5,
										fill: axisTextColor,
										className: "text-[9px] font-mono font-semibold",
										children: ["전일종가 ", formatAxisPrice(prevClose)]
									})
								]
							}),
							buyEntries && buyEntries.length > 0 && buyEntries.map((entry, i) => {
								if (!entry || entry.price <= 0 || entry.price < minPrice || entry.price > maxPrice) return null;
								const entryY = getPriceY(entry.price);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
									className: "pointer-events-none",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
											x1: paddingLeft,
											y1: entryY,
											x2: width - paddingRight,
											y2: entryY,
											stroke: "#10b981",
											strokeDasharray: "3 2",
											strokeWidth: "1.2",
											opacity: "0.85"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
											x: paddingLeft + 6,
											y: entryY - 9,
											width: isNarrow ? 86 : 112,
											height: "16",
											rx: "4",
											fill: "#10b981"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
											x: paddingLeft + 11,
											y: entryY + 2,
											fill: "#ffffff",
											className: "text-[9px] font-mono font-bold tabular-nums",
											children: `매수 ${entry.quantity} · ${formatAxisPrice(entry.price)}`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: `매수가: ${formatPrice(entry.price)}, 수량: ${entry.quantity}, 날짜: ${entry.date}` })
									]
								}, entry.id || `buy-${i}`);
							}),
							indicators.bollinger.enabled && bollingerSlice.upper.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: generateSeriesPath(bollingerSlice.upper),
									fill: "none",
									stroke: "#6366f1",
									strokeWidth: "1.2",
									strokeDasharray: "2 2",
									opacity: "0.75"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: generateSeriesPath(bollingerSlice.middle),
									fill: "none",
									stroke: "#818cf8",
									strokeWidth: "1",
									opacity: "0.8"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: generateSeriesPath(bollingerSlice.lower),
									fill: "none",
									stroke: "#6366f1",
									strokeWidth: "1.2",
									strokeDasharray: "2 2",
									opacity: "0.75"
								})
							] }),
							indicators.vwap.enabled && vwapSlice.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: generateSeriesPath(vwapSlice),
								fill: "none",
								stroke: "#10b981",
								strokeWidth: "1.5",
								opacity: "0.9"
							}),
							indicators.ema.enabled && emaSlice.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: generateSeriesPath(emaSlice),
								fill: "none",
								stroke: "#ec4899",
								strokeWidth: "1.4",
								opacity: "0.9"
							}),
							indicators.ma.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
								indicators.ma.ma5 && sma5Slice.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: generateSeriesPath(sma5Slice),
									fill: "none",
									stroke: "#f59e0b",
									strokeWidth: "1.4",
									opacity: "0.85"
								}),
								indicators.ma.ma20 && sma20Slice.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: generateSeriesPath(sma20Slice),
									fill: "none",
									stroke: "#a855f7",
									strokeWidth: "1.4",
									opacity: "0.85"
								}),
								indicators.ma.ma60 && sma60Slice.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: generateSeriesPath(sma60Slice),
									fill: "none",
									stroke: "#10b981",
									strokeWidth: "1.4",
									opacity: "0.85"
								}),
								indicators.ma.ma120 && sma120Slice.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: generateSeriesPath(sma120Slice),
									fill: "none",
									stroke: "#06b6d4",
									strokeWidth: "1.4",
									opacity: "0.85"
								})
							] }),
							chartType === "line" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: generateSeriesPath(visibleCandles.map((c) => c.close)),
								fill: "none",
								stroke: "#f43f5e",
								strokeWidth: "2",
								strokeLinecap: "round",
								strokeLinejoin: "round"
							}),
							chartType === "candle" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", { children: visibleCandles.map((c, i) => {
								const x = getCandleX(i);
								const yHigh = getPriceY(c.high);
								const yLow = getPriceY(c.low);
								const yOpen = getPriceY(c.open);
								const yClose = getPriceY(c.close);
								const candleColor = c.close >= c.open ? upColor : downColor;
								const bodyTop = Math.min(yOpen, yClose);
								const bodyHeight = Math.max(1.5, Math.abs(yOpen - yClose));
								const isHovered = hoverIndex === i;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: x,
									y1: yHigh,
									x2: x,
									y2: yLow,
									stroke: candleColor,
									strokeWidth: "1.2"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									x: x - candleWidth / 2,
									y: bodyTop,
									width: candleWidth,
									height: bodyHeight,
									fill: candleColor,
									rx: "0.5",
									stroke: isHovered ? isDark ? "#ffffff" : "#0f172a" : candleColor,
									strokeWidth: isHovered ? 1.8 : .6
								})] }, `${c.time}-${i}`);
							}) }),
							!isHistoricalView && stockPrice > 0 && stockPrice >= minPrice && stockPrice <= maxPrice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
								className: "pointer-events-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: paddingLeft,
										y1: getPriceY(stockPrice),
										x2: width - paddingRight,
										y2: getPriceY(stockPrice),
										stroke: "#ef4444",
										strokeDasharray: "2 2",
										strokeWidth: "1.1",
										opacity: "0.75"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										x: width - paddingRight + 3,
										y: getPriceY(stockPrice) - 8,
										width: priceTagWidth,
										height: "16",
										fill: "#ef4444",
										rx: "3"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
										x: width - 8,
										y: getPriceY(stockPrice) + 3,
										fill: "#ffffff",
										className: "text-[9px] font-mono font-bold tabular-nums",
										textAnchor: "end",
										children: formatAxisPrice(stockPrice)
									})
								]
							}),
							shapes.map((shape) => {
								const isSelected = selectedShapeId === shape.id;
								const y1 = getPriceY(shape.startPoint.y);
								const x1 = shape.startPoint.x;
								if (shape.type === "horizontal") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
									onClick: () => setSelectedShapeId(shape.id),
									className: "cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: paddingLeft,
										y1,
										x2: width - paddingRight,
										y2: y1,
										stroke: shape.color,
										strokeWidth: isSelected ? 2.5 : 1.5,
										strokeDasharray: isSelected ? "4 2" : void 0
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
										x: width - paddingRight - 5,
										y: y1 - 4,
										fill: shape.color,
										className: "text-[9px] font-mono font-bold",
										textAnchor: "end",
										children: formatPrice(shape.startPoint.y)
									})]
								}, shape.id);
								if (shape.type === "vertical") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
									onClick: () => setSelectedShapeId(shape.id),
									className: "cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1,
										y1: paddingTop,
										x2: x1,
										y2: paddingTop + mainPriceHeight,
										stroke: shape.color,
										strokeWidth: isSelected ? 2.5 : 1.5
									})
								}, shape.id);
								if (shape.endPoint) {
									const x2 = shape.endPoint.x;
									const y2 = getPriceY(shape.endPoint.y);
									if (shape.type === "trendline") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
										onClick: () => setSelectedShapeId(shape.id),
										className: "cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
											x1,
											y1,
											x2,
											y2,
											stroke: shape.color,
											strokeWidth: isSelected ? 2.5 : 1.5
										})
									}, shape.id);
									if (shape.type === "rectangle") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
										onClick: () => setSelectedShapeId(shape.id),
										className: "cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
											x: Math.min(x1, x2),
											y: Math.min(y1, y2),
											width: Math.abs(x2 - x1),
											height: Math.abs(y2 - y1),
											fill: shape.color,
											fillOpacity: "0.12",
											stroke: shape.color,
											strokeWidth: isSelected ? 2 : 1
										})
									}, shape.id);
									if (shape.type === "fibonacci") {
										const diffY = y2 - y1;
										const startP = shape.startPoint.y;
										const diffP = shape.endPoint.y - startP;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
											onClick: () => setSelectedShapeId(shape.id),
											className: "cursor-pointer",
											children: FIBONACCI_LEVELS.map((f) => {
												const levelY = y1 + diffY * f.level;
												const levelPrice = startP + diffP * f.level;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: Math.min(x1, x2),
													y1: levelY,
													x2: Math.min(width - paddingRight, Math.max(x1, x2) + 60),
													y2: levelY,
													stroke: f.color,
													strokeWidth: "1",
													strokeDasharray: "2 2"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
													x: Math.min(width - paddingRight - 4, Math.max(x1, x2) + 64),
													y: levelY + 3,
													fill: f.color,
													className: "text-[9px] font-mono",
													children: [
														f.label,
														" (",
														formatAxisPrice(levelPrice),
														")"
													]
												})] }, f.level);
											})
										}, shape.id);
									}
								}
								return null;
							}),
							drawingShape && drawingShape.startPoint && drawingShape.endPoint && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
								className: "pointer-events-none opacity-80",
								children: [
									drawingShape.type === "trendline" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: drawingShape.startPoint.x,
										y1: getPriceY(drawingShape.startPoint.y),
										x2: drawingShape.endPoint.x,
										y2: getPriceY(drawingShape.endPoint.y),
										stroke: drawingShape.color || "#38bdf8",
										strokeWidth: "1.5",
										strokeDasharray: "3 3"
									}),
									drawingShape.type === "rectangle" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										x: Math.min(drawingShape.startPoint.x, drawingShape.endPoint.x),
										y: Math.min(getPriceY(drawingShape.startPoint.y), getPriceY(drawingShape.endPoint.y)),
										width: Math.abs(drawingShape.endPoint.x - drawingShape.startPoint.x),
										height: Math.abs(getPriceY(drawingShape.endPoint.y) - getPriceY(drawingShape.startPoint.y)),
										fill: "#38bdf8",
										fillOpacity: "0.15",
										stroke: "#38bdf8",
										strokeWidth: "1.5",
										strokeDasharray: "3 3"
									}),
									drawingShape.type === "fibonacci" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: drawingShape.startPoint.x,
										y1: getPriceY(drawingShape.startPoint.y),
										x2: drawingShape.endPoint.x,
										y2: getPriceY(drawingShape.endPoint.y),
										stroke: "#fbbf24",
										strokeWidth: "1.5"
									})
								]
							}),
							hoverIndex !== null && visibleCandles[hoverIndex] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
								className: "pointer-events-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: getCandleX(hoverIndex),
										y1: paddingTop,
										x2: getCandleX(hoverIndex),
										y2: totalHeight - bottomTimePadding,
										stroke: "#94a3b8",
										strokeDasharray: "2 2",
										strokeWidth: "1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: paddingLeft,
										y1: getPriceY(visibleCandles[hoverIndex].close),
										x2: width - paddingRight,
										y2: getPriceY(visibleCandles[hoverIndex].close),
										stroke: "#94a3b8",
										strokeDasharray: "2 2",
										strokeWidth: "1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										x: width - paddingRight + 3,
										y: getPriceY(visibleCandles[hoverIndex].close) - 8,
										width: priceTagWidth,
										height: "16",
										fill: "#475569",
										rx: "3"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
										x: width - 8,
										y: getPriceY(visibleCandles[hoverIndex].close) + 3,
										fill: "#ffffff",
										className: "text-[9px] font-mono font-bold tabular-nums",
										textAnchor: "end",
										children: formatAxisPrice(visibleCandles[hoverIndex].close)
									})
								]
							}),
							indicators.volume.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: paddingLeft,
									y1: volumeStartY,
									x2: width - paddingRight,
									y2: volumeStartY,
									stroke: gridColor
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: paddingLeft + 4,
									y: volumeStartY + 12,
									fill: axisTextColor,
									className: "text-[10px] font-mono",
									children: "거래량"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: width - 8,
									y: volumeStartY + 12,
									fill: axisTextColor,
									className: "text-[10px] font-mono tabular-nums",
									textAnchor: "end",
									children: maxVolume.toLocaleString()
								}),
								visibleCandles.map((c, i) => {
									const x = getCandleX(i);
									const barH = Math.max(1, c.volume / maxVolume * (volumeHeight - 16));
									const y = volumeStartY + volumeHeight - barH;
									const barColor = c.close >= c.open ? upColor : downColor;
									const isHovered = hoverIndex === i;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										x: x - candleWidth / 2,
										y,
										width: candleWidth,
										height: barH,
										fill: barColor,
										opacity: isHovered ? "0.9" : "0.45"
									}, `vol-${c.time}-${i}`);
								})
							] }),
							hasSubChartRsi && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: paddingLeft,
									y1: rsiStartY,
									x2: width - paddingRight,
									y2: rsiStartY,
									stroke: gridColor
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
									x: paddingLeft + 4,
									y: rsiStartY + 12,
									fill: axisTextColor,
									className: "text-[10px] font-mono",
									children: [
										"RSI (",
										indicators.rsi.period,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: paddingLeft,
									y1: rsiStartY + subChartHeight * .3,
									x2: width - paddingRight,
									y2: rsiStartY + subChartHeight * .3,
									stroke: "#ef4444",
									strokeDasharray: "2 2",
									opacity: "0.4"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: width - 8,
									y: rsiStartY + subChartHeight * .3 + 3,
									fill: "#ef4444",
									className: "text-[8px] font-mono",
									textAnchor: "end",
									children: "70"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: paddingLeft,
									y1: rsiStartY + subChartHeight * .7,
									x2: width - paddingRight,
									y2: rsiStartY + subChartHeight * .7,
									stroke: "#3b82f6",
									strokeDasharray: "2 2",
									opacity: "0.4"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: width - 8,
									y: rsiStartY + subChartHeight * .7 + 3,
									fill: "#3b82f6",
									className: "text-[8px] font-mono",
									textAnchor: "end",
									children: "30"
								}),
								(() => {
									const points = [];
									for (let i = 0; i < rsiSlice.length; i++) {
										const val = rsiSlice[i];
										if (val !== null) {
											const x = getCandleX(i);
											const y = rsiStartY + subChartHeight - val / 100 * subChartHeight;
											points.push(`${points.length === 0 ? "M" : "L"} ${x.toFixed(1)},${y.toFixed(1)}`);
										}
									}
									return points.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: points.join(" "),
										fill: "none",
										stroke: "#06b6d4",
										strokeWidth: "1.5"
									}) : null;
								})()
							] }),
							hasSubChartMacd && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: paddingLeft,
									y1: macdStartY,
									x2: width - paddingRight,
									y2: macdStartY,
									stroke: gridColor
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
									x: paddingLeft + 4,
									y: macdStartY + 12,
									fill: axisTextColor,
									className: "text-[10px] font-mono",
									children: [
										"MACD (",
										indicators.macd.fastPeriod,
										", ",
										indicators.macd.slowPeriod,
										", ",
										indicators.macd.signalPeriod,
										")"
									]
								}),
								(() => {
									const validHist = macdSlice.histogram.filter((v) => v !== null);
									const maxH = Math.max(...validHist.map(Math.abs), 1e-6);
									const midY = macdStartY + subChartHeight / 2;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
											x1: paddingLeft,
											y1: midY,
											x2: width - paddingRight,
											y2: midY,
											stroke: gridColor,
											strokeDasharray: "2 2"
										}),
										macdSlice.histogram.map((val, i) => {
											if (val === null) return null;
											const x = getCandleX(i);
											const h = Math.abs(val) / maxH * (subChartHeight / 2 - 4);
											const y = val >= 0 ? midY - h : midY;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
												x: x - candleWidth / 2,
												y,
												width: candleWidth,
												height: Math.max(1, h),
												fill: val >= 0 ? "#ef4444" : "#3b82f6",
												opacity: "0.6"
											}, `hist-${i}`);
										}),
										(() => {
											const points = [];
											for (let i = 0; i < macdSlice.macdLine.length; i++) {
												const val = macdSlice.macdLine[i];
												if (val !== null) {
													const x = getCandleX(i);
													const y = midY - val / maxH * (subChartHeight / 2 - 6);
													points.push(`${points.length === 0 ? "M" : "L"} ${x.toFixed(1)},${y.toFixed(1)}`);
												}
											}
											return points.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
												d: points.join(" "),
												fill: "none",
												stroke: "#f43f5e",
												strokeWidth: "1.3"
											}) : null;
										})(),
										(() => {
											const points = [];
											for (let i = 0; i < macdSlice.signalLine.length; i++) {
												const val = macdSlice.signalLine[i];
												if (val !== null) {
													const x = getCandleX(i);
													const y = midY - val / maxH * (subChartHeight / 2 - 6);
													points.push(`${points.length === 0 ? "M" : "L"} ${x.toFixed(1)},${y.toFixed(1)}`);
												}
											}
											return points.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
												d: points.join(" "),
												fill: "none",
												stroke: "#38bdf8",
												strokeWidth: "1.3"
											}) : null;
										})()
									] });
								})()
							] }),
							hasSubChartStoch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: paddingLeft,
									y1: stochStartY,
									x2: width - paddingRight,
									y2: stochStartY,
									stroke: gridColor
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
									x: paddingLeft + 4,
									y: stochStartY + 12,
									fill: axisTextColor,
									className: "text-[10px] font-mono",
									children: [
										"스토캐스틱 (",
										indicators.stochastic.kPeriod,
										", ",
										indicators.stochastic.dPeriod,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: paddingLeft,
									y1: stochStartY + subChartHeight * .2,
									x2: width - paddingRight,
									y2: stochStartY + subChartHeight * .2,
									stroke: "#ef4444",
									strokeDasharray: "2 2",
									opacity: "0.4"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: paddingLeft,
									y1: stochStartY + subChartHeight * .8,
									x2: width - paddingRight,
									y2: stochStartY + subChartHeight * .8,
									stroke: "#3b82f6",
									strokeDasharray: "2 2",
									opacity: "0.4"
								}),
								(() => {
									const points = [];
									for (let i = 0; i < stochSlice.kLine.length; i++) {
										const val = stochSlice.kLine[i];
										if (val !== null) {
											const x = getCandleX(i);
											const y = stochStartY + subChartHeight - val / 100 * subChartHeight;
											points.push(`${points.length === 0 ? "M" : "L"} ${x.toFixed(1)},${y.toFixed(1)}`);
										}
									}
									return points.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: points.join(" "),
										fill: "none",
										stroke: "#a855f7",
										strokeWidth: "1.4"
									}) : null;
								})(),
								(() => {
									const points = [];
									for (let i = 0; i < stochSlice.dLine.length; i++) {
										const val = stochSlice.dLine[i];
										if (val !== null) {
											const x = getCandleX(i);
											const y = stochStartY + subChartHeight - val / 100 * subChartHeight;
											points.push(`${points.length === 0 ? "M" : "L"} ${x.toFixed(1)},${y.toFixed(1)}`);
										}
									}
									return points.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: points.join(" "),
										fill: "none",
										stroke: "#f59e0b",
										strokeWidth: "1.2",
										strokeDasharray: "3 2"
									}) : null;
								})()
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: paddingLeft,
								y: totalHeight - bottomTimePadding,
								width: innerWidth,
								height: bottomTimePadding,
								fill: "transparent",
								className: "cursor-ew-resize",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: "좌우 드래그로 시간 구간 확대/축소" })
							}),
							(() => {
								const tickCount = isNarrow ? 3 : 5;
								const step = Math.max(1, Math.floor(visibleCandles.length / tickCount));
								return visibleCandles.map((c, idx) => ({
									c,
									idx
								})).filter(({ idx }) => idx % step === 0 || idx === visibleCandles.length - 1).map(({ c, idx }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: getCandleX(idx),
									y: totalHeight - 9,
									fill: axisTextColor,
									className: "text-[10px] font-mono tabular-nums",
									textAnchor: "middle",
									children: c.time
								}, `time-${c.time}-${idx}`));
							})()
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-3 py-1.5 text-xs text-slate-400 font-mono",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "상승" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2.5 h-2.5 rounded-xs bg-blue-500 inline-block" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "하락" })]
						}),
						indicators.ma.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							indicators.ma.ma5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-amber-500 font-semibold",
								children: ["MA", indicators.ma.period5]
							}),
							indicators.ma.ma20 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-purple-400 font-semibold",
								children: ["MA", indicators.ma.period20]
							}),
							indicators.ma.ma60 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-emerald-400 font-semibold",
								children: ["MA", indicators.ma.period60]
							}),
							indicators.ma.ma120 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-cyan-400 font-semibold",
								children: ["MA", indicators.ma.period120]
							})
						] }),
						indicators.ema.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-pink-400 font-semibold",
							children: ["EMA", indicators.ema.period]
						}),
						indicators.bollinger.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-indigo-400 font-semibold",
							children: [
								"BB(",
								indicators.bollinger.period,
								")"
							]
						}),
						indicators.vwap.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-emerald-400 font-semibold",
							children: "VWAP"
						}),
						indicators.rsi.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-cyan-400 font-semibold",
							children: [
								"RSI(",
								indicators.rsi.period,
								")"
							]
						}),
						indicators.macd.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-rose-400 font-semibold",
							children: "MACD"
						}),
						indicators.stochastic.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-purple-400 font-semibold",
							children: "STOCH"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-[11px] text-slate-400 tabular-nums",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden md:inline",
							children: "휠/축 드래그(확대/축소) · 드래그(이동) · 더블클릭(초기화)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "md:hidden",
							children: "핀치(확대) · 드래그(이동)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							visibleCandles.length,
							"/",
							rawCandles.length,
							"개"
						] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndicatorSettingsModal, {
				isOpen: isSettingsModalOpen,
				onClose: () => setIsSettingsModalOpen(false),
				settings: indicators,
				onChange: setIndicators
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdSlot, {
				slotId: "stock-chart-ad",
				format: "auto"
			})
		]
	}) });
};
//#endregion
//#region src/components/stocks/OrderBookWidget.tsx
var OrderBookWidget = import_react.memo(({ stock }) => {
	const [orderBook, setOrderBook] = (0, import_react.useState)(null);
	const [currentPrice, setCurrentPrice] = (0, import_react.useState)(stock.price);
	const [change, setChange] = (0, import_react.useState)(stock.change);
	const [changePercent, setChangePercent] = (0, import_react.useState)(stock.changePercent);
	const [volume, setVolume] = (0, import_react.useState)(stock.volume);
	const [isRealtime, setIsRealtime] = (0, import_react.useState)(false);
	const [lastUpdated, setLastUpdated] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	const [viewMode, setViewMode] = (0, import_react.useState)("10");
	const formatDefensiveNumber = (val, options) => {
		if (val === null || val === void 0 || isNaN(val)) return "-";
		return val.toLocaleString(void 0, options);
	};
	const formatPercentage = (val) => {
		if (val === null || val === void 0 || isNaN(val)) return "-";
		return `${val > 0 ? "+" : ""}${val.toFixed(2)}%`;
	};
	const stockCur = inferStockCurrency(stock.symbol, stock.market, stock.currency);
	const formatPrice = (p) => {
		if (p === null || p === void 0 || p <= 0 || isNaN(p)) return "-";
		return formatMoney(p, stockCur);
	};
	(0, import_react.useEffect)(() => {
		setCurrentPrice(stock.price);
		setChange(stock.change);
		setChangePercent(stock.changePercent);
		setVolume(stock.volume);
		setLastUpdated(/* @__PURE__ */ new Date());
	}, [
		stock.symbol,
		stock.price,
		stock.change,
		stock.changePercent,
		stock.volume
	]);
	(0, import_react.useEffect)(() => {
		let isSubscribed = true;
		setOrderBook(null);
		setIsRealtime(false);
		stockRepository.getOrderBook(stock.symbol).then((data) => {
			if (!isSubscribed || !data) return;
			if (Array.isArray(data.asks) && data.asks.length > 0) {
				setOrderBook(data);
				setLastUpdated(/* @__PURE__ */ new Date());
			} else setOrderBook(data);
			if (data.currentPrice && data.currentPrice > 0) setCurrentPrice(data.currentPrice);
		}).catch((err) => {
			console.warn("[OrderBookWidget] Initial order book fetch error, using fallback:", err);
		});
		const unsubOrderBook = stockRepository.subscribeOrderBook?.(stock.symbol, (realtimeOrderBook) => {
			if (!isSubscribed) return;
			if (realtimeOrderBook && realtimeOrderBook.symbol === stock.symbol && Array.isArray(realtimeOrderBook.asks) && realtimeOrderBook.asks.length > 0) {
				const samplePrice = realtimeOrderBook.asks?.[0]?.price || realtimeOrderBook.bids?.[0]?.price;
				if (stock.price > 0 && samplePrice && Math.abs(samplePrice - stock.price) / stock.price > .1) return;
				setOrderBook(realtimeOrderBook);
				setIsRealtime(true);
			}
		});
		const unsubExecution = stockRepository.subscribeExecutionTick?.(stock.symbol, (tick) => {
			if (tick?.source === "SIMULATED") return;
			if (stock.price > 0 && tick.price > 0 && Math.abs(tick.price - stock.price) / stock.price > .1) return;
			if (!isSubscribed) return;
			if (tick && tick.symbol === stock.symbol) {
				setCurrentPrice(tick.price);
				setChange(tick.change);
				setChangePercent(tick.changePercent);
				if (tick.volume > 0) setVolume((prev) => Math.max(prev, tick.volume));
				setLastUpdated(/* @__PURE__ */ new Date());
				setIsRealtime(true);
			}
		});
		return () => {
			isSubscribed = false;
			unsubOrderBook?.();
			unsubExecution?.();
		};
	}, [stock.symbol]);
	const { hasRealDepth, displayedAsks, displayedBids, total, askRatio, bidRatio } = (0, import_react.useMemo)(() => {
		const hasRealDepth = Boolean(orderBook && Array.isArray(orderBook.asks) && orderBook.asks.length > 0);
		const displayedAsks = hasRealDepth && orderBook ? viewMode === "5" ? orderBook.asks.slice(-5) : orderBook.asks : [];
		const displayedBids = hasRealDepth && orderBook ? viewMode === "5" ? orderBook.bids.slice(0, 5) : orderBook.bids : [];
		const total = hasRealDepth && orderBook ? orderBook.totalAskVolume + orderBook.totalBidVolume || 1 : 1;
		const askRatio = hasRealDepth && orderBook ? Math.round(orderBook.totalAskVolume / total * 100) : 50;
		return {
			hasRealDepth,
			displayedAsks,
			displayedBids,
			total,
			askRatio,
			bidRatio: 100 - askRatio
		};
	}, [orderBook, viewMode]);
	const assetUnit = stock.market === "COIN" ? stock.baseCurrency || "코인" : "주";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-finance-card border border-finance-border rounded-2xl p-4 shadow-xs text-finance-text",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-bold text-sm tablet:text-[15px] text-finance-text",
							children: "실시간 10단계 호가창"
						}),
						stock.market === "COIN" && hasRealDepth || stock.market !== "COIN" && stock.market !== "US" && isRealtime && hasRealDepth ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] tablet:text-[11px] font-bold bg-finance-accent/15 text-finance-accent border border-finance-accent/30 whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-finance-accent animate-pulse" }), stock.market === "COIN" ? `${stock.exchange === "UPBIT" ? "업비트 실시간" : "바이낸스 실시간"}` : "키움 실시간"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] tablet:text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 whitespace-nowrap",
							children: stock.market === "COIN" ? "호가 연결 중" : stock.market === "US" ? "해외 단일가 (호가 미제공)" : hasRealDepth ? "키움 REST 호가" : "키움 호가 미연결"
						}),
						isRealtime && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] tablet:text-[11px] text-finance-sub-text font-mono tabular-nums",
							children: lastUpdated.toLocaleTimeString("ko-KR", {
								hour: "2-digit",
								minute: "2-digit",
								second: "2-digit"
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex bg-finance-sub-bg rounded-lg p-0.5 text-[11px] tablet:text-[12px] font-medium border border-finance-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setViewMode("10"),
							className: `px-2 tablet:px-2.5 py-0.5 rounded-md transition-colors whitespace-nowrap ${viewMode === "10" ? "bg-finance-card text-finance-text font-bold shadow-xs" : "text-finance-sub-text hover:text-finance-text"}`,
							children: "10호가"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setViewMode("5"),
							className: `px-2 tablet:px-2.5 py-0.5 rounded-md transition-colors whitespace-nowrap ${viewMode === "5" ? "bg-finance-card text-finance-text font-bold shadow-xs" : "text-finance-sub-text hover:text-finance-text"}`,
							children: "5호가"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[11px] tablet:text-[11.5px] font-mono text-finance-sub-text tabular-nums whitespace-nowrap",
						children: ["단위: ", assetUnit]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border border-finance-border rounded-xl overflow-hidden font-mono text-xs",
				children: hasRealDepth ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-finance-border/50 bg-finance-down/5 max-h-[260px] overflow-y-auto",
						children: displayedAsks.map((ask, i) => {
							const isCurrent = ask.price === currentPrice;
							const askLevel = viewMode === "5" ? 5 - i : (orderBook?.asks.length || 10) - i;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `relative flex items-center justify-between py-1.5 px-3 transition-colors ${isCurrent ? "ring-1 ring-finance-up font-bold bg-finance-up/10" : "hover:bg-finance-down/10"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute right-0 top-0 bottom-0 bg-finance-down/15 pointer-events-none transition-all duration-300",
										style: { width: `${ask.barPercent}%` }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative z-10 flex items-center gap-1.5 text-finance-sub-text text-[11px] tablet:text-[11.5px] tabular-nums whitespace-nowrap",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] tablet:text-[10.5px] text-finance-sub-text font-sans opacity-80",
											children: [askLevel, "호가"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDefensiveNumber(ask.volume) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "relative z-10 font-bold text-finance-down tablet:text-[13px] tabular-nums whitespace-nowrap",
										children: formatPrice(ask.price)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "relative z-10 text-[10px] tablet:text-[11px] text-finance-down tabular-nums whitespace-nowrap",
										children: formatPercentage(ask.changePercent)
									})
								]
							}, `ask-${ask.price}-${i}`);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-2 px-3 bg-finance-sub-bg font-bold flex items-center justify-between text-finance-text border-y border-finance-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs tablet:text-[13px] font-sans whitespace-nowrap",
									children: "현재가"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] tablet:text-[11.5px] font-mono text-finance-sub-text font-normal tabular-nums whitespace-nowrap",
									children: [
										"누적 ",
										formatDefensiveNumber(volume),
										assetUnit
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm tablet:text-[19px] font-black text-finance-up tabular-nums whitespace-nowrap",
								children: formatPrice(currentPrice)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `text-xs tablet:text-[13px] tabular-nums whitespace-nowrap ${change !== null && change !== void 0 && change >= 0 ? "text-finance-up" : "text-finance-down"}`,
								children: [
									change !== null && change !== void 0 ? formatMoney(change, stockCur, { showSign: true }) : "-",
									" (",
									formatPercentage(changePercent),
									")"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-finance-border/50 bg-finance-up/5 max-h-[260px] overflow-y-auto",
						children: displayedBids.map((bid, i) => {
							const isCurrent = bid.price === currentPrice;
							const bidLevel = i + 1;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `relative flex items-center justify-between py-1.5 px-3 transition-colors ${isCurrent ? "ring-1 ring-finance-up font-bold bg-finance-up/10" : "hover:bg-finance-up/10"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute left-0 top-0 bottom-0 bg-finance-up/15 pointer-events-none transition-all duration-300",
										style: { width: `${bid.barPercent || 0}%` }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "relative z-10 text-[10px] tablet:text-[11px] text-finance-up tabular-nums whitespace-nowrap",
										children: formatPercentage(bid.changePercent)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "relative z-10 font-bold text-finance-up tablet:text-[13px] tabular-nums whitespace-nowrap",
										children: formatPrice(bid.price)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative z-10 flex items-center gap-1.5 text-finance-sub-text text-[11px] tablet:text-[11.5px] tabular-nums whitespace-nowrap",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDefensiveNumber(bid.volume) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] tablet:text-[10.5px] text-finance-sub-text font-sans opacity-80",
											children: [bidLevel, "호가"]
										})]
									})
								]
							}, `bid-${bid.price}-${i}`);
						})
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 text-center space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-2 px-3 bg-finance-sub-bg font-bold flex items-center justify-between text-finance-text border border-finance-border rounded-lg",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs tablet:text-[13px] font-sans whitespace-nowrap",
								children: "실시간 현재가"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm tablet:text-[19px] font-black text-finance-up tabular-nums whitespace-nowrap",
								children: formatPrice(currentPrice)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `text-xs tablet:text-[13px] tabular-nums whitespace-nowrap ${change !== null && change !== void 0 && change >= 0 ? "text-finance-up" : "text-finance-down"}`,
								children: [
									change !== null && change !== void 0 ? formatMoney(change, stockCur, { showSign: true }) : "-",
									" (",
									changePercent !== null && changePercent !== void 0 ? `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%` : "-",
									")"
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-2 text-xs tablet:text-[13px] text-finance-sub-text bg-finance-sub-bg/70 border border-finance-border rounded-xl p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0 text-finance-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: stock.market === "US" ? "미국 주식 시장은 10단계 호가창을 제공하지 않으며 단일 체결가 기준으로 거래됩니다." : stock.market === "COIN" ? "가상자산 거래소 호가 데이터를 연결 중입니다." : "실시간 10단계 호가 잔량은 증권사(키움증권 Open API) 연동 후 제공됩니다." })]
					})]
				})
			}),
			hasRealDepth && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between text-[11px] tablet:text-[11.5px] font-mono tabular-nums whitespace-nowrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-finance-down font-bold",
						children: [
							"매도잔량: ",
							(orderBook?.totalAskVolume || 0).toLocaleString(),
							" (",
							askRatio,
							"%)"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-finance-up font-bold",
						children: [
							"매수잔량: ",
							(orderBook?.totalBidVolume || 0).toLocaleString(),
							" (",
							bidRatio,
							"%)"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "h-2 w-full bg-finance-sub-bg rounded-full overflow-hidden flex border border-finance-border/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-finance-down transition-all duration-300",
						style: { width: `${askRatio}%` }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-finance-up transition-all duration-300",
						style: { width: `${bidRatio}%` }
					})]
				})]
			})
		]
	});
});
//#endregion
//#region src/components/stocks/StockNewsSection.tsx
var StockNewsSection = ({ stock }) => {
	const [newsList, setNewsList] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [page, setPage] = (0, import_react.useState)(1);
	const [hasMore, setHasMore] = (0, import_react.useState)(false);
	const [totalCount, setTotalCount] = (0, import_react.useState)(0);
	const fetchNews = (0, import_react.useCallback)(async (targetPage = 1, append = false) => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await newsService.getStockNews(stock.symbol, targetPage, 8);
			if (append) setNewsList((prev) => [...prev, ...data.items]);
			else setNewsList(data.items);
			setHasMore(data.hasMore);
			setTotalCount(data.total);
			setPage(targetPage);
		} catch (err) {
			console.warn(`[StockNewsSection] News fetch failed for ${stock.symbol}:`, err);
			setError(err.message || "관련 뉴스를 불러오지 못했습니다.");
		} finally {
			setIsLoading(false);
		}
	}, [stock.symbol]);
	(0, import_react.useEffect)(() => {
		fetchNews(1, false);
	}, [fetchNews]);
	const handleLoadMore = () => {
		if (!isLoading && hasMore) fetchNews(page + 1, true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, { className: "w-4 h-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-base text-slate-900 dark:text-white flex items-center gap-2",
						children: "관련 뉴스 & 공시"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-slate-400",
						children: [
							"'",
							stock.name,
							"(",
							stock.symbol,
							")' 언론 보도 및 최신 이슈"
						]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [totalCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
						children: [
							"총 ",
							totalCount,
							"건"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => fetchNews(1, false),
						disabled: isLoading,
						className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
						title: "뉴스 새로고침",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-500" : ""}` })
					})]
				})]
			}),
			isLoading && newsList.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: [
					1,
					2,
					3
				].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 animate-pulse space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 bg-slate-200 dark:bg-slate-700/50 rounded-sm w-3/4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 bg-slate-200 dark:bg-slate-700/30 rounded-sm w-1/2" })]
				}, n))
			}),
			!isLoading && error && newsList.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-6 h-6 text-rose-500 mx-auto" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-rose-400 font-semibold",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => fetchNews(1, false),
						className: "px-3 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors",
						children: "다시 시도"
					})
				]
			}),
			!isLoading && !error && newsList.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center py-8 text-slate-400 space-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, { className: "w-8 h-8 mx-auto text-slate-600 opacity-50" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-semibold text-slate-300",
						children: [
							"'",
							stock.name,
							"' 관련 최신 뉴스가 없습니다."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500",
						children: "실시간 뉴스 피드에 등록된 기사가 없는 상태입니다."
					})
				]
			}),
			newsList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-slate-100 dark:divide-slate-800/80",
				children: newsList.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-3.5 first:pt-1 last:pb-1 group",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 flex-1 min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 flex-wrap text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-slate-600 dark:text-slate-300",
										children: item.source
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-slate-400 font-mono flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3 text-slate-400" }), item.timeAgo || item.time]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: item.url,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors block leading-snug",
									children: item.title
								}),
								item.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed",
									children: item.summary
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: item.url,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "p-2 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 transition-colors shrink-0",
							title: "언론사 원문 보기",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-4 h-4" })
						})]
					})
				}, item.id))
			}),
			hasMore && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pt-2 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleLoadMore,
					disabled: isLoading,
					className: "px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors inline-flex items-center gap-1.5",
					children: [isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5 animate-spin" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "뉴스 더보기" })]
				})
			})
		]
	});
};
//#endregion
//#region src/components/stocks/StockCommunitySection.tsx
var StockCommunitySection = ({ stock }) => {
	const { navigateToPost, requireAuth } = useApp();
	const [isEditorOpen, setIsEditorOpen] = (0, import_react.useState)(false);
	const [posts, setPosts] = (0, import_react.useState)(() => {
		return dedupeById(storageService.getPosts()).filter((p) => p.symbol === stock.symbol || p.tags?.some((t) => t.includes(stock.name)));
	});
	const handleOpenWrite = () => {
		if (!requireAuth("게시글 작성")) return;
		setIsEditorOpen(true);
	};
	const handlePostSaved = () => {
		const all = dedupeById(storageService.getPosts());
		setPosts(all.filter((p) => p.symbol === stock.symbol || p.tags?.some((t) => t.includes(stock.name))));
		setIsEditorOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-4 h-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-base text-slate-900 dark:text-white flex items-center gap-2",
						children: "주주 커뮤니티 토론글"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-slate-400",
						children: [
							"'",
							stock.name,
							"' 주주들의 실시간 매매 일지 및 차트 토론"
						]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleOpenWrite,
					className: "flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-rose-600/20 self-start sm:self-auto cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "이 종목에 글쓰기" })]
				})]
			}),
			posts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-slate-100 dark:divide-slate-800/80",
				children: posts.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: () => navigateToPost(post.id),
					className: "py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl px-2 transition-colors cursor-pointer group",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs mb-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-slate-700 dark:text-slate-300",
										children: post.author.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 font-bold",
										children: post.author.badge
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 font-mono text-[11px]",
										children: post.createdAt
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-bold text-sm text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors truncate",
								children: post.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5",
								children: post.content
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 text-xs font-mono text-slate-400 shrink-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "w-3.5 h-3.5 text-rose-500" }), post.likes]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-3.5 h-3.5 text-blue-500" }), post.commentsCount || post.comments?.length || 0]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" })
						]
					})]
				}, post.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-10 text-center text-slate-400 text-xs space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"아직 '",
					stock.name,
					"'에 등록된 커뮤니티 글이 없습니다."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: handleOpenWrite,
					className: "text-rose-500 font-semibold hover:underline",
					children: "첫 번째 분석 글을 남겨보세요!"
				})]
			}),
			isEditorOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostEditorModal, {
				isOpen: isEditorOpen,
				onClose: () => setIsEditorOpen(false),
				onSuccess: handlePostSaved,
				defaultSymbol: stock.symbol
			})
		]
	});
};
//#endregion
export { InteractiveStockChart as i, StockNewsSection as n, OrderBookWidget as r, StockCommunitySection as t };
