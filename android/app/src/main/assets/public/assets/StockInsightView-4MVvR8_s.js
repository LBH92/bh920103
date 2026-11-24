import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { Et as Globe, F as ShieldCheck, G as RefreshCw, H as Search, Ht as Clock, I as ShieldAlert, It as DollarSign, J as Play, Lt as Database, Mt as FileCheck, O as Sparkles, R as Settings, Ut as CircleQuestionMark, Vt as Coins, X as Percent, bn as require_react, bt as Info, en as ChartColumn, h as TriangleAlert, i as X, in as Building2, on as Bot, pn as ArrowUpRight, qt as ChevronRight, r as Zap, vn as ArrowDownRight, vt as Layers, yn as Activity, yt as Key } from "./vendor-lucide-Dji_Ij8j.js";
import { S as inferStockCurrency, n as useApp, v as formatMoney, y as formatTradingValueByCurrency } from "./AppContext-Butl4QWq.js";
import { m as globalMarketClient, p as PriceBadge } from "./index-DLz7vtf6.js";
import { t as MiniSparkline } from "./MiniSparkline-CbjReGLJ.js";
import { t as marketMonitorClient } from "./marketMonitorClient-BziKZ1BT.js";
import { t as UserAiSettingsModal } from "./UserAiSettingsModal-CGVmO5w6.js";
//#region src/services/aiBriefingClient.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var CACHE_TTL_MS$1 = 6e4;
var requestCache$1 = /* @__PURE__ */ new Map();
var inFlightRequests$1 = /* @__PURE__ */ new Map();
var aiBriefingClient = {
	/**
	* Request full AI Stock Briefing from server
	* Server executes the 5 functions and passes real data to Gemini.
	*/
	async requestBriefing(query, symbol, uid) {
		const cacheKey = JSON.stringify({
			query,
			symbol,
			uid: uid || "anonymous"
		});
		const cached = requestCache$1.get(cacheKey);
		if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS$1) return cached.data;
		if (inFlightRequests$1.has(cacheKey)) return inFlightRequests$1.get(cacheKey);
		const headers = { "Content-Type": "application/json" };
		if (uid) headers["x-user-uid"] = uid;
		const requestPromise = (async () => {
			let retryCount = 0;
			const MAX_RETRIES = 3;
			async function doFetch() {
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 1e4);
				const res = await fetch("/api/ai/stock-briefing", {
					method: "POST",
					headers,
					body: JSON.stringify({
						query,
						symbol,
						uid
					}),
					signal: controller.signal
				});
				clearTimeout(timeoutId);
				if (res.status === 429 && retryCount < MAX_RETRIES) {
					const retryAfter = parseInt(res.headers.get("Retry-After") || "1") * 1e3;
					const jitter = Math.random() * 1e3;
					const delay = Math.max(retryAfter, retryAfter * Math.pow(2, retryCount)) + jitter;
					await new Promise((resolve) => setTimeout(resolve, delay));
					retryCount++;
					return doFetch();
				}
				if (!res.ok) {
					const err = await res.json().catch(() => ({}));
					if (err.error === "AI_NOT_CONNECTED" || err.message?.includes("AI_NOT_CONNECTED")) throw new Error(err.message || "개인 Gemini AI 계정이 연결되지 않았습니다. 프로필 설정에서 본인의 Google AI Studio 키를 연결해주세요.");
					throw new Error(err.error || err.message || "AI 종목 브리핑 생성에 실패했습니다.");
				}
				const data = await res.json();
				requestCache$1.set(cacheKey, {
					data,
					timestamp: Date.now()
				});
				return data;
			}
			try {
				return await doFetch();
			} finally {
				inFlightRequests$1.delete(cacheKey);
			}
		})();
		inFlightRequests$1.set(cacheKey, requestPromise);
		return requestPromise;
	},
	clearCache() {
		requestCache$1.clear();
		inFlightRequests$1.clear();
	},
	async getStockQuote(symbol) {
		const res = await fetch(`/api/ai/stock-data/quote?symbol=${encodeURIComponent(symbol)}`);
		if (!res.ok) return null;
		return await res.json();
	},
	async getStockChart(symbol, period = "1M") {
		const res = await fetch(`/api/ai/stock-data/chart?symbol=${encodeURIComponent(symbol)}&period=${period}`);
		if (!res.ok) return null;
		return await res.json();
	},
	async getStockNews(symbol) {
		const res = await fetch(`/api/ai/stock-data/news?symbol=${encodeURIComponent(symbol)}`);
		if (!res.ok) return null;
		return await res.json();
	},
	async getMarketStatus() {
		const res = await fetch("/api/ai/stock-data/market");
		if (!res.ok) return null;
		return await res.json();
	},
	async getRelatedPosts(symbol) {
		const res = await fetch(`/api/ai/stock-data/posts?symbol=${encodeURIComponent(symbol)}`);
		if (!res.ok) return null;
		return await res.json();
	}
};
//#endregion
//#region src/components/insight/StockInsightAiBriefing.tsx
var import_jsx_runtime = require_jsx_runtime();
var StockInsightAiBriefing = () => {
	const { stocks, navigateToStock, showToast, user, requireAuth } = useApp();
	const [query, setQuery] = (0, import_react.useState)("삼성전자 오늘 왜 오르고 있어?");
	const [selectedSymbol, setSelectedSymbol] = (0, import_react.useState)("005930");
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [isAiModalOpen, setIsAiModalOpen] = (0, import_react.useState)(false);
	const [briefing, setBriefing] = (0, import_react.useState)(null);
	const exampleQuestions = [
		{
			text: "삼성전자 오늘 왜 오르고 있어?",
			symbol: "005930"
		},
		{
			text: "SK하이닉스 수급 및 주요 데이터 브리핑해줘",
			symbol: "000660"
		},
		{
			text: "현대차 거래량 급증 및 뉴스 분석",
			symbol: "005380"
		},
		{
			text: "한미반도체 오늘 주가와 시장 상황 알려줘",
			symbol: "042700"
		}
	];
	const handleRequest = async (targetQuery, targetSymbol) => {
		const q = (targetQuery || query).trim();
		if (!q) {
			showToast("질문을 입력해주세요.", "error");
			return;
		}
		if (!user) {
			requireAuth("AI 종목 브리핑");
			return;
		}
		setIsLoading(true);
		try {
			const res = await aiBriefingClient.requestBriefing(q, targetSymbol || selectedSymbol, user.id);
			setBriefing(res);
			showToast(`${res.symbolName} AI 브리핑이 성공적으로 생성되었습니다.`, "success");
		} catch (err) {
			const msg = err?.message || "브리핑 생성 중 오류가 발생했습니다.";
			showToast(msg, "error");
			if (msg.includes("개인 Gemini AI 계정") || msg.includes("AI_NOT_CONNECTED")) setIsAiModalOpen(true);
		} finally {
			setIsLoading(false);
		}
	};
	const handleSelectExample = (ex) => {
		setQuery(ex.text);
		setSelectedSymbol(ex.symbol);
		handleRequest(ex.text, ex.symbol);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 mt-0.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-5 h-5 animate-pulse" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-black text-lg text-slate-900 dark:text-white",
							children: "Gemini 기반 AI 종목 브리핑"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20 font-mono",
							children: "FACT-CHECKED AI"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400 mt-1",
						children: "Gemini가 임의로 숫자를 창작하지 않으며, 5대 전용 서버 함수로부터 실제 주가·거래량·공시 데이터를 조회한 뒤 구조화된 브리핑을 제공합니다."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setIsAiModalOpen(true),
						className: "flex items-center gap-1.5 px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-400 rounded-xl text-xs font-bold transition-colors cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "개인 AI 연결 설정" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden lg:flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "w-3.5 h-3.5 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "서버 함수 5개 연동" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						handleRequest();
					},
					className: "flex flex-col sm:flex-row gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: selectedSymbol,
							onChange: (e) => setSelectedSymbol(e.target.value),
							className: "sm:w-44 px-3.5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer",
							children: stocks.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: s.symbol,
								children: [
									s.name,
									" (",
									s.symbol,
									")"
								]
							}, s.symbol))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: query,
								onChange: (e) => setQuery(e.target.value),
								placeholder: "예: 삼성전자 오늘 왜 오르고 있어? (자연어로 질문하세요)",
								className: "w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-purple-500"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: isLoading,
							className: "flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 transition-all cursor-pointer shrink-0 disabled:opacity-50",
							children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "데이터 수집 및 분석 중..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AI 브리핑 받기" })] })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 flex-wrap text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-slate-400 font-medium flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "추천 질문:" })]
					}), exampleQuestions.map((ex, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => handleSelectExample(ex),
						className: "px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer text-[11px]",
						children: ex.text
					}, idx))]
				})]
			}),
			briefing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 p-5 sm:p-6 bg-slate-50 dark:bg-[#0c0f17] border border-purple-500/30 rounded-2xl space-y-5 animate-in fade-in duration-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-black text-lg text-slate-900 dark:text-white",
										children: briefing.symbolName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs text-slate-400",
										children: briefing.symbol
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30",
										children: "Gemini 3.8 Flash"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5 text-purple-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["데이터 기준 시간: ", briefing.dataTimestamp] })]
							})] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => navigateToStock(briefing.symbol),
							className: "flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs self-start sm:self-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "종목 상세 차트 보기" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5" })]
						})]
					}),
					briefing.quote && (() => {
						const matchedStock = stocks.find((s) => s.symbol === briefing.symbol);
						const qCur = inferStockCurrency(briefing.symbol, matchedStock?.market || briefing.quote.market, briefing.quote.currency || matchedStock?.currency);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-slate-400 text-[10px] block",
										children: [
											"현재가 (",
											qCur,
											")"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold text-sm text-slate-900 dark:text-white",
										children: formatMoney(briefing.quote.price, qCur)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 text-[10px] block",
										children: "등락률"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `font-mono font-bold text-sm ${briefing.quote.change >= 0 ? "text-rose-500" : "text-blue-500"}`,
										children: [
											briefing.quote.change >= 0 ? "+" : "",
											briefing.quote.changePercent,
											"%"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 text-[10px] block",
										children: "당일 거래량"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono font-bold text-sm text-slate-900 dark:text-white",
										children: [briefing.quote.volume.toLocaleString(), "주"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 text-[10px] block",
										children: "거래대금"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold text-sm text-slate-900 dark:text-white",
										children: formatTradingValueByCurrency(briefing.quote.tradingValue, qCur)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 text-[10px] block",
										children: "시가 / 전일종가"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono font-bold text-xs text-slate-700 dark:text-slate-300",
										children: [
											formatMoney(briefing.quote.openPrice, qCur),
											" / ",
											formatMoney(briefing.quote.prevClose, qCur)
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 text-[10px] block",
										children: "고가 / 저가"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono font-bold text-xs text-slate-700 dark:text-slate-300",
										children: [
											formatMoney(briefing.quote.highPrice, qCur),
											" / ",
											formatMoney(briefing.quote.lowPrice, qCur)
										]
									})]
								})
							]
						});
					})(),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-4 leading-relaxed whitespace-pre-line bg-white dark:bg-[#131722] p-5 rounded-2xl border border-slate-200 dark:border-slate-800",
						children: briefing.content
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-400 flex items-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 shrink-0 text-amber-500 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-0.5 leading-relaxed",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "투자자 유의사항 & AI 윤리 원칙:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "본 브리핑은 서버로부터 전달된 검증된 수치 데이터만을 기반으로 생성되었으며, \"무조건 오른다\", \"반드시 매수해야 한다\"와 같은 단정적인 투자 권유는 포함하지 않습니다. 투자 결정의 최종 책임은 투자자 본인에게 있습니다." })]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAiSettingsModal, {
				isOpen: isAiModalOpen,
				onClose: () => setIsAiModalOpen(false)
			})
		]
	});
};
//#endregion
//#region src/services/aiStockQueryClient.ts
var CACHE_TTL_MS = 6e4;
var requestCache = /* @__PURE__ */ new Map();
var inFlightRequests = /* @__PURE__ */ new Map();
var aiStockQueryClient = {
	/**
	* Submit a natural language question.
	* Server executes the appropriate function, fetches verified data, and passes to Gemini.
	*/
	async submitQuery(query, watchlist, uid) {
		const cacheKey = JSON.stringify({
			query,
			watchlist,
			uid: uid || "anonymous"
		});
		const cached = requestCache.get(cacheKey);
		if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) return cached.data;
		if (inFlightRequests.has(cacheKey)) return inFlightRequests.get(cacheKey);
		const headers = { "Content-Type": "application/json" };
		if (uid) headers["x-user-uid"] = uid;
		const requestPromise = (async () => {
			let retryCount = 0;
			const MAX_RETRIES = 3;
			async function doFetch() {
				const res = await fetch("/api/ai/stock-query", {
					method: "POST",
					headers,
					body: JSON.stringify({
						query,
						watchlist,
						uid
					})
				});
				if (res.status === 429 && retryCount < MAX_RETRIES) {
					const retryAfter = parseInt(res.headers.get("Retry-After") || "1") * 1e3;
					const jitter = Math.random() * 1e3;
					const delay = Math.max(retryAfter, retryAfter * Math.pow(2, retryCount)) + jitter;
					await new Promise((resolve) => setTimeout(resolve, delay));
					retryCount++;
					return doFetch();
				}
				if (!res.ok) {
					const err = await res.json().catch(() => ({}));
					if (err.error === "AI_NOT_CONNECTED" || err.message?.includes("AI_NOT_CONNECTED")) throw new Error(err.message || "개인 Gemini AI 계정이 연결되지 않았습니다. 프로필 설정에서 본인의 Google AI Studio 키를 연결해주세요.");
					throw new Error(err.error || err.message || "AI 주식 데이터 질의 처리에 실패했습니다.");
				}
				const data = await res.json();
				requestCache.set(cacheKey, {
					data,
					timestamp: Date.now()
				});
				return data;
			}
			try {
				return await doFetch();
			} finally {
				inFlightRequests.delete(cacheKey);
			}
		})();
		inFlightRequests.set(cacheKey, requestPromise);
		return requestPromise;
	},
	clearCache() {
		requestCache.clear();
		inFlightRequests.clear();
	},
	async getStockQuote(symbol) {
		const res = await fetch(`/api/ai/stock-data/quote?symbol=${encodeURIComponent(symbol)}`);
		return res.ok ? await res.json() : null;
	},
	async getStockVolume(symbol) {
		const res = await fetch(`/api/ai/functions/stock-volume?symbol=${encodeURIComponent(symbol)}`);
		return res.ok ? await res.json() : null;
	},
	async getWatchlist(symbols) {
		const query = symbols ? `?symbols=${encodeURIComponent(symbols.join(","))}` : "";
		const res = await fetch(`/api/ai/functions/watchlist${query}`);
		return res.ok ? await res.json() : null;
	},
	async getMarketSummary(market) {
		const query = market ? `?market=${encodeURIComponent(market)}` : "";
		const res = await fetch(`/api/ai/functions/market-summary${query}`);
		return res.ok ? await res.json() : null;
	},
	async getTopGainers(limit = 5) {
		const res = await fetch(`/api/ai/functions/top-gainers?limit=${limit}`);
		return res.ok ? await res.json() : null;
	},
	async getTopLosers(limit = 5) {
		const res = await fetch(`/api/ai/functions/top-losers?limit=${limit}`);
		return res.ok ? await res.json() : null;
	},
	async getVolumeSpikes(threshold = 140) {
		const res = await fetch(`/api/ai/functions/volume-spikes?threshold=${threshold}`);
		return res.ok ? await res.json() : null;
	}
};
//#endregion
//#region src/components/insight/StockInsightAiDataQuery.tsx
var StockInsightAiDataQuery = () => {
	const { watchlist, navigateToStock, showToast, user, requireAuth } = useApp();
	const [query, setQuery] = (0, import_react.useState)("삼성전자 현재가 알려줘");
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [isAiModalOpen, setIsAiModalOpen] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const exampleQueries = [
		{
			text: "삼성전자 현재가 알려줘",
			label: "현재가 조회",
			fn: "get_stock_quote"
		},
		{
			text: "삼성전자 오늘 거래량 어때?",
			label: "거래량 조회",
			fn: "get_stock_volume"
		},
		{
			text: "내 관심종목 중 오늘 가장 많이 오른 종목은?",
			label: "관심종목 랭킹",
			fn: "get_watchlist"
		},
		{
			text: "오늘 거래량이 급증한 종목을 보여줘",
			label: "거래량 급증",
			fn: "get_volume_spikes"
		},
		{
			text: "코스닥 시장 상황을 요약해줘",
			label: "시장 상황 요약",
			fn: "get_market_summary"
		},
		{
			text: "오늘 시장에서 가장 많이 오른 종목은?",
			label: "상승률 상위",
			fn: "get_top_gainers"
		}
	];
	const handleExecuteQuery = async (targetQuery) => {
		const q = (targetQuery || query).trim();
		if (!q) {
			showToast("질문을 입력해주세요.", "error");
			return;
		}
		if (!user) {
			requireAuth("AI 주식 데이터 질의");
			return;
		}
		setIsLoading(true);
		try {
			const res = await aiStockQueryClient.submitQuery(q, watchlist, user.id);
			setResult(res);
			showToast(`'${res.functionCalled}' 함수를 통해 데이터를 조회했습니다.`, "success");
		} catch (err) {
			const msg = err?.message || "질의 처리에 실패했습니다.";
			showToast(msg, "error");
			if (msg.includes("개인 Gemini AI 계정") || msg.includes("AI_NOT_CONNECTED")) setIsAiModalOpen(true);
		} finally {
			setIsLoading(false);
		}
	};
	const handleSelectExample = (ex) => {
		setQuery(ex.text);
		handleExecuteQuery(ex.text);
	};
	const getFunctionBadge = (fnName) => {
		switch (fnName) {
			case "get_stock_quote": return {
				label: "get_stock_quote (현재가)",
				color: "bg-rose-500/10 text-rose-500 border-rose-500/30"
			};
			case "get_stock_volume": return {
				label: "get_stock_volume (거래량/수급)",
				color: "bg-amber-500/10 text-amber-500 border-amber-500/30"
			};
			case "get_watchlist": return {
				label: "get_watchlist (관심종목)",
				color: "bg-blue-500/10 text-blue-500 border-blue-500/30"
			};
			case "get_market_summary": return {
				label: "get_market_summary (지수 요약)",
				color: "bg-purple-500/10 text-purple-500 border-purple-500/30"
			};
			case "get_volume_spikes": return {
				label: "get_volume_spikes (거래량 급증)",
				color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
			};
			case "get_top_gainers": return {
				label: "get_top_gainers (상승 상위)",
				color: "bg-rose-600/10 text-rose-600 border-rose-600/30"
			};
			case "get_top_losers": return {
				label: "get_top_losers (하락 상위)",
				color: "bg-blue-600/10 text-blue-600 border-blue-600/30"
			};
			default: return {
				label: fnName,
				color: "bg-slate-100 text-slate-700"
			};
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-0.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "w-5 h-5 animate-pulse" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-black text-lg text-slate-900 dark:text-white",
							children: "AI 실시간 주식 데이터 자연어 질의"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 font-mono",
							children: "FUNCTION CALLING"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400 mt-1",
						children: "자연어 질문을 분석하여 서버 함수(현재가·거래량·관심종목·급증주·시장 요약)를 자동 실행하고 실제 데이터에 근거해 답변합니다."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 self-start sm:self-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setIsAiModalOpen(true),
						className: "flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-400 rounded-xl text-xs font-bold transition-colors cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "개인 AI 연결 설정" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-500",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "w-3.5 h-3.5 text-blue-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "7개 서버 함수 지원" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					handleExecuteQuery();
				},
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "자연어로 질문하세요 (예: 삼성전자 현재가 알려줘, 코스닥 시장 상황을 요약해줘)",
						className: "w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: isLoading,
					className: "flex items-center justify-center gap-1.5 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer shrink-0 disabled:opacity-50",
					children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "함수 실행 중..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "질문하기" })] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 flex-wrap text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-slate-400 font-medium flex items-center gap-1 text-[11px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "w-3.5 h-3.5 text-blue-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "예시 질문:" })]
				}), exampleQueries.map((ex, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => handleSelectExample(ex),
					className: "px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer text-[11px]",
					children: [
						"\"",
						ex.text,
						"\""
					]
				}, idx))]
			}),
			result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5 rounded-2xl bg-slate-50 dark:bg-[#0c0f17] border border-blue-500/30 space-y-5 animate-in fade-in duration-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 flex-wrap text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-slate-800 dark:text-slate-200",
								children: [
									"\"",
									result.query,
									"\""
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `px-2 py-0.5 rounded-md font-mono font-bold text-[11px] border ${getFunctionBadge(result.functionCalled).color}`,
								children: getFunctionBadge(result.functionCalled).label
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5 text-blue-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["데이터 기준 시점: ", result.dataTimestamp] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "w-3.5 h-3.5 text-blue-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "1. 실제 조회된 원천 주가/시장 데이터 (서버 반환 팩트)" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-slate-400 font-mono",
									children: "AI 창작 수치 아님 (검증 완료)"
								})]
							}),
							result.functionCalled === "get_stock_quote" && result.rawData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-black text-base text-slate-900 dark:text-white",
											children: result.rawData.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-xs text-slate-400",
											children: [
												"(",
												result.rawData.symbol,
												") - ",
												result.rawData.market
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => navigateToStock(result.rawData.symbol),
										className: "text-xs font-bold text-rose-500 hover:underline flex items-center gap-0.5 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "차트 보기" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5" })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs",
									children: (() => {
										const qCur = inferStockCurrency(result.rawData.symbol, result.rawData.market, result.rawData.currency);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-slate-400 text-[10px] block",
													children: [
														"현재가 (",
														qCur,
														")"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-bold text-slate-900 dark:text-white text-sm",
													children: formatMoney(result.rawData.price || 0, qCur)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-400 text-[10px] block",
													children: "전일 대비 등락률"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: `font-mono font-bold text-sm ${(result.rawData.change || 0) >= 0 ? "text-rose-500" : "text-blue-500"}`,
													children: [
														formatMoney(result.rawData.change || 0, qCur, { showSign: true }),
														" (",
														(result.rawData.changePercent || 0) >= 0 ? "+" : "",
														result.rawData.changePercent,
														"%)"
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-400 text-[10px] block",
													children: "시가 / 전일종가"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono font-bold text-slate-700 dark:text-slate-300",
													children: [
														formatMoney(result.rawData.openPrice || 0, qCur),
														" / ",
														formatMoney(result.rawData.prevClose || 0, qCur)
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-400 text-[10px] block",
													children: "장중 고가 / 저가"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono font-bold text-slate-700 dark:text-slate-300",
													children: [
														formatMoney(result.rawData.highPrice || 0, qCur),
														" / ",
														formatMoney(result.rawData.lowPrice || 0, qCur)
													]
												})]
											})
										] });
									})()
								})]
							}),
							result.functionCalled === "get_stock_volume" && result.rawData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-black text-base text-slate-900 dark:text-white",
										children: [
											result.rawData.name,
											" (",
											result.rawData.symbol,
											") 거래량 분석"
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-400 text-[10px] block",
												children: "당일 누적 거래량"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono font-bold text-slate-900 dark:text-white text-sm",
												children: [result.rawData.volume?.toLocaleString(), "주"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-400 text-[10px] block",
												children: "20일 평균 대비 비율"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono font-bold text-amber-500 text-sm",
												children: [result.rawData.volumeRatio, "%"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-400 text-[10px] block",
												children: "누적 거래대금"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono font-bold text-slate-900 dark:text-white text-sm",
												children: formatTradingValueByCurrency(result.rawData.tradingValue || 0, inferStockCurrency(result.rawData.symbol, result.rawData.market, result.rawData.currency))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-400 text-[10px] block",
												children: "회전율 (추정)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono font-bold text-slate-700 dark:text-slate-300 text-sm",
												children: result.rawData.turnoverRate
											})]
										})
									]
								})]
							}),
							result.functionCalled === "get_watchlist" && result.rawData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-slate-800 dark:text-slate-200",
										children: [
											"내 관심종목 실시간 랭킹 (총 ",
											result.rawData.totalCount,
											"개)"
										]
									}), result.rawData.topGainer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[11px] font-bold",
										children: [
											"상승 1위: ",
											result.rawData.topGainer.name,
											" (+",
											result.rawData.topGainer.changePercent,
											"%)"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs",
									children: result.rawData.items?.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										onClick: () => navigateToStock(item.symbol),
										className: "p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-slate-900 dark:text-white",
												children: item.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `font-mono font-bold ${item.changePercent >= 0 ? "text-rose-500" : "text-blue-500"}`,
												children: [
													item.changePercent >= 0 ? "+" : "",
													item.changePercent,
													"%"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] font-mono text-slate-400 mt-1",
											children: formatMoney(item.price || 0, inferStockCurrency(item.symbol, item.market, item.currency))
										})]
									}, item.symbol))
								})]
							}),
							result.functionCalled === "get_volume_spikes" && result.rawData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-slate-800 dark:text-slate-200",
										children: [
											"20일 평균 대비 거래량 급증(",
											result.rawData.thresholdPercent,
											"% 이상) 종목 (총 ",
											result.rawData.count,
											"개)"
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs",
									children: result.rawData.spikes?.map((st) => {
										const stCur = inferStockCurrency(st.symbol, st.market, st.currency);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											onClick: () => navigateToStock(st.symbol),
											className: "p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-slate-900 dark:text-white",
													children: st.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono font-bold text-amber-500",
													children: [st.volumeRatio, "% 폭증"]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-[11px] font-mono text-slate-400 mt-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													formatMoney(st.price || 0, stCur),
													" (",
													st.changePercent > 0 ? "+" : "",
													st.changePercent,
													"%)"
												] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTradingValueByCurrency(st.tradingValue || 0, stCur) })]
											})]
										}, st.symbol);
									})
								})]
							}),
							(result.functionCalled === "get_top_gainers" || result.functionCalled === "get_top_losers") && result.rawData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-xs text-slate-800 dark:text-slate-200 block pb-1 border-b border-slate-100 dark:border-slate-800",
									children: result.functionCalled === "get_top_gainers" ? "시장 급등률 상위 순위" : "시장 급락률 상위 순위"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs",
									children: (result.rawData.gainers || result.rawData.losers)?.map((st, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										onClick: () => navigateToStock(st.symbol),
										className: "p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-bold text-slate-900 dark:text-white",
												children: [
													"#",
													idx + 1,
													" ",
													st.name
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `font-mono font-bold ${st.changePercent >= 0 ? "text-rose-500" : "text-blue-500"}`,
												children: [
													st.changePercent >= 0 ? "+" : "",
													st.changePercent,
													"%"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] font-mono text-slate-400 mt-1",
											children: formatMoney(st.price || 0, inferStockCurrency(st.symbol, st.market, st.currency))
										})]
									}, st.symbol))
								})]
							}),
							result.functionCalled === "get_market_summary" && result.rawData && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-4 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-400 text-[10px] block",
													children: "코스피 지수"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-bold text-base text-slate-900 dark:text-white block mt-0.5",
													children: result.rawData.kospi?.value?.toLocaleString()
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: `text-[11px] font-mono font-bold ${(result.rawData.kospi?.change || 0) >= 0 ? "text-rose-500" : "text-blue-500"}`,
													children: [
														(result.rawData.kospi?.change || 0) >= 0 ? "▲" : "▼",
														" ",
														Math.abs(result.rawData.kospi?.change || 0),
														" (",
														(result.rawData.kospi?.changePercent || 0) >= 0 ? "+" : "",
														result.rawData.kospi?.changePercent,
														"%)"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[10px] text-slate-400 mt-1",
													children: ["거래대금 ", result.rawData.kospi?.tradingValue]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-400 text-[10px] block",
													children: "코스닥 지수"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-bold text-base text-slate-900 dark:text-white block mt-0.5",
													children: result.rawData.kosdaq?.value?.toLocaleString()
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: `text-[11px] font-mono font-bold ${(result.rawData.kosdaq?.change || 0) >= 0 ? "text-rose-500" : "text-blue-500"}`,
													children: [
														(result.rawData.kosdaq?.change || 0) >= 0 ? "▲" : "▼",
														" ",
														Math.abs(result.rawData.kosdaq?.change || 0),
														" (",
														(result.rawData.kosdaq?.changePercent || 0) >= 0 ? "+" : "",
														result.rawData.kosdaq?.changePercent,
														"%)"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[10px] text-slate-400 mt-1",
													children: ["거래대금 ", result.rawData.kosdaq?.tradingValue]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-400 text-[10px] block",
													children: "원/달러 환율"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono font-bold text-base text-slate-900 dark:text-white block mt-0.5",
													children: [result.rawData.exchangeRate?.rate?.toLocaleString(), "원"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: `text-[11px] font-mono font-bold ${(result.rawData.exchangeRate?.changePercent || 0) >= 0 ? "text-rose-500" : "text-blue-500"}`,
													children: [
														(result.rawData.exchangeRate?.changePercent || 0) >= 0 ? "+" : "",
														result.rawData.exchangeRate?.changePercent,
														"%"
													]
												})
											]
										})
									]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "w-4 h-4 text-purple-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "2. Gemini AI 데이터 근거 자연어 답변 및 분석" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 rounded-xl bg-white dark:bg-[#131722] border border-purple-500/20 shadow-2xs text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed space-y-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "whitespace-pre-line font-medium",
								children: result.aiExplanation
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-[11px] text-slate-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3.5 h-3.5 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AI는 오직 위 원천 수치 데이터에만 근거하여 답변하며, 임의로 수치를 생성하지 않습니다." })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAiSettingsModal, {
				isOpen: isAiModalOpen,
				onClose: () => setIsAiModalOpen(false)
			})
		]
	});
};
//#endregion
//#region src/components/insight/GlobalFinancialDashboard.tsx
var GlobalFinancialDashboard = ({ onSelectSymbol }) => {
	const [data, setData] = (0, import_react.useState)(null);
	const [providers, setProviders] = (0, import_react.useState)([]);
	const [activeTab, setActiveTab] = (0, import_react.useState)("us");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [showProviderModal, setShowProviderModal] = (0, import_react.useState)(false);
	const [lastRefreshed, setLastRefreshed] = (0, import_react.useState)("");
	const loadData = async (force = false) => {
		setIsLoading(true);
		try {
			const [summary, providerList] = await Promise.all([globalMarketClient.getSummary(force), globalMarketClient.getProviders()]);
			setData(summary);
			setProviders(providerList.length > 0 ? providerList : summary.providers || []);
			setLastRefreshed(summary.fetchedAt);
		} catch (err) {
			console.warn("[GlobalFinancialDashboard] Error fetching data:", err);
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadData();
	}, []);
	const tabList = [
		{
			key: "us",
			label: "미국 증시",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-4 h-4 text-rose-500" }),
			desc: "S&P 500, 나스닥, 다우존스, 러셀 2000"
		},
		{
			key: "asia",
			label: "아시아 증시",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-4 h-4 text-amber-500" }),
			desc: "닛케이 225, 상하이종합, 항셍지수"
		},
		{
			key: "europe",
			label: "유럽 증시",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-4 h-4 text-blue-500" }),
			desc: "유로스톡스 50, 독일 DAX, 프랑스 CAC, 영국 FTSE"
		},
		{
			key: "crypto",
			label: "가상자산",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "w-4 h-4 text-emerald-500" }),
			desc: "비트코인, 이더리움, 솔라나, 리플 (실시간 업비트·바이낸스)"
		},
		{
			key: "commodity",
			label: "국제 원자재",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-4 h-4 text-yellow-500" }),
			desc: "금, 은, WTI 원유, 브렌트유, 구리, 천연가스"
		},
		{
			key: "forex",
			label: "주요 환율",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-4 h-4 text-cyan-500" }),
			desc: "원/달러, 원/엔, 유로, 위안 (ECB 공식 고시환율)"
		},
		{
			key: "rates",
			label: "금리 & 국채",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "w-4 h-4 text-indigo-500" }),
			desc: "한·미·유럽 기준금리, 미국 10년물/2년물 국채수익률"
		},
		{
			key: "macro",
			label: "거시경제 지표",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-4 h-4 text-purple-500" }),
			desc: "세계은행 주요국 GDP 성장률, 인플레이션, 미국 재무부 총부채"
		}
	];
	const filteredItems = (data?.groups?.[activeTab] || []).filter((item) => {
		if (!searchQuery.trim()) return true;
		const q = searchQuery.toLowerCase();
		return item.name.toLowerCase().includes(q) || item.symbol.toLowerCase().includes(q);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-5 h-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl sm:text-2xl font-black tracking-tight",
									children: "글로벌 통합 금융 데이터 허브"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
									children: "비용 0원 원칙 · 공식 공개 데이터"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed",
							children: "키움 증권 API 의존도를 탈피하여 세계은행(World Bank), 미국 재무부(U.S. Treasury), 유럽중앙은행(Frankfurter ECB), 업비트, 바이낸스 등 무료 공식 데이터 공급원을 통합 연동합니다."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setShowProviderModal(true),
							className: "px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "w-4 h-4 text-indigo-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "공급원 및 라이선스 (0원)" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => loadData(true),
							disabled: isLoading,
							className: "p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer disabled:opacity-50",
							title: "데이터 새로고침",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-4 h-4 ${isLoading ? "animate-spin" : ""}` })
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none",
				children: tabList.map((tab) => {
					const isActive = activeTab === tab.key;
					const count = (data?.groups?.[tab.key] || []).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab(tab.key),
						className: `px-3.5 py-2.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${isActive ? "bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/20" : "bg-white dark:bg-[#131722] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"}`,
						children: [
							tab.icon,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.label }),
							count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`,
								children: count
							})
						]
					}, tab.key);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#131722] p-4 rounded-xl border border-slate-200 dark:border-slate-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						placeholder: "항목명 또는 심볼 검색...",
						value: searchQuery,
						onChange: (e) => setSearchQuery(e.target.value),
						className: "w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:border-rose-500 text-slate-900 dark:text-white"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["갱신 시각: ", lastRefreshed ? lastRefreshed.replace(" (KST)", "") : "실시간"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"총 ",
							filteredItems.length,
							"개 항목"
						] })
					]
				})]
			}),
			isLoading && !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-16 text-center space-y-3 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-8 h-8 text-rose-500 animate-spin mx-auto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-slate-600 dark:text-slate-300 font-medium",
					children: "공식 무료 공급원으로부터 글로벌 금융 데이터를 집계 중입니다..."
				})]
			}) : filteredItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-12 text-center space-y-2 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-6 h-6 mx-auto text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs",
					children: "검색 조건에 맞는 데이터 항목이 없습니다."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
				children: filteredItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: () => onSelectSymbol && onSelectSymbol(item.symbol),
					className: "p-4 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs flex flex-col justify-between group cursor-default",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-sm text-slate-900 dark:text-white truncate",
									children: item.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 mt-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
										children: item.symbol
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-400",
										children: item.currency
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 font-mono ${item.delayStatus === "realtime" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : item.delayStatus === "official_notice" || item.delayStatus === "annual" || item.delayStatus === "monthly" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20" : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"}`,
								children: item.delayLabel
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3.5 flex items-baseline justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white",
								children: item.displayValue ? item.displayValue : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [item.value.toLocaleString(void 0, {
									minimumFractionDigits: item.category === "rates" ? 3 : 2,
									maximumFractionDigits: item.category === "rates" ? 3 : 2
								}), item.unit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-normal text-slate-400 ml-1",
									children: item.unit
								})] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 flex items-center gap-1.5",
								children: item.change === 0 && (item.category === "rates" || item.category === "macro") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono",
									children: "변동 없음"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceBadge, {
									change: item.change,
									changePercent: item.changePercent,
									size: "sm"
								})
							})] }), item.sparkline && item.sparkline.length >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "shrink-0 pt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniSparkline, {
									data: item.sparkline,
									isUp: item.change >= 0,
									width: 80,
									height: 28
								})
							})]
						}),
						(item.high !== void 0 || item.low !== void 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["고 ", item.high?.toLocaleString()] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["저 ", item.low?.toLocaleString()] })]
						}),
						item.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-slate-500 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-900/60 p-1.5 rounded border border-slate-100 dark:border-slate-800/60 leading-relaxed",
							children: item.notes
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate font-medium text-slate-500 dark:text-slate-400",
							title: item.provider,
							children: item.provider
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono shrink-0",
							children: item.marketTime ? item.marketTime.replace(" (KST)", "") : item.lastUpdated ? item.lastUpdated.replace(" (KST)", "") : ""
						})]
					})]
				}, item.id))
			}),
			showProviderModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-5 h-5 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-bold text-slate-900 dark:text-white",
									children: "무료 공식 데이터 공급원 & 오픈 라이선스 규정"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowProviderModal(false),
								className: "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold cursor-pointer",
								children: "닫기"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-slate-500 dark:text-slate-400 leading-relaxed",
							children: [
								"본 서비스는 실제 주식 매매를 실행하지 않는 순수 투자 분석 서비스로, ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "비용 0원 원칙" }),
								"에 따라 이용 허가된 공개 API 및 공공 데이터만을 수집·가공하여 표기합니다."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-slate-100 dark:divide-slate-800",
							children: providers.map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-3 space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-3.5 h-3.5 text-indigo-500" }), p.name]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
											children: p.cost
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-slate-600 dark:text-slate-300",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "제공 데이터:" }),
											" ",
											p.assetScope
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-slate-400",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "라이선스:" }),
											" ",
											p.license,
											" · ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "갱신 주기:" }),
											" ",
											p.updateFrequency
										]
									})
								]
							}, idx))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowProviderModal(false),
								className: "px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold cursor-pointer",
								children: "확인 완료"
							})
						})
					]
				})
			})
		]
	});
};
//#endregion
//#region src/components/insight/StockInsightView.tsx
var StockInsightView = () => {
	const { navigateToStock, showToast } = useApp();
	const [events, setEvents] = (0, import_react.useState)([]);
	const [config, setConfig] = (0, import_react.useState)(null);
	const [scopeFilter, setScopeFilter] = (0, import_react.useState)("ALL");
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isConfigOpen, setIsConfigOpen] = (0, import_react.useState)(false);
	const [explainingEventId, setExplainingEventId] = (0, import_react.useState)(null);
	const [editConfig, setEditConfig] = (0, import_react.useState)(null);
	const fetchMonitoringData = async () => {
		try {
			const [fetchedConfig, fetchedEvents] = await Promise.all([marketMonitorClient.getConfig(), marketMonitorClient.getEvents(scopeFilter === "ALL" ? void 0 : scopeFilter)]);
			setConfig(fetchedConfig);
			setEditConfig(fetchedConfig);
			setEvents(fetchedEvents);
		} catch (err) {
			console.warn("[StockInsight] Error loading monitoring data:", err);
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchMonitoringData();
		const intervalId = setInterval(() => {
			marketMonitorClient.getEvents(scopeFilter === "ALL" ? void 0 : scopeFilter).then((res) => setEvents(res)).catch(() => {});
		}, 4e3);
		return () => clearInterval(intervalId);
	}, [scopeFilter]);
	const handleSaveConfig = async (e) => {
		e.preventDefault();
		if (!editConfig) return;
		try {
			const updated = await marketMonitorClient.updateConfig(editConfig);
			setConfig(updated);
			setIsConfigOpen(false);
			showToast("시장 모니터링 감지 설정이 업데이트되었습니다.", "success");
		} catch {
			showToast("설정 저장 중 오류가 발생했습니다.", "error");
		}
	};
	const handleExplainWithGemini = async (eventId) => {
		setExplainingEventId(eventId);
		try {
			const explanation = await marketMonitorClient.explainEvent(eventId);
			setEvents((prev) => prev.map((evt) => evt.id === eventId ? {
				...evt,
				aiExplanation: explanation
			} : evt));
			showToast("Gemini AI 이벤트 분석이 완료되었습니다.", "success");
		} catch (err) {
			showToast("Gemini 분석 생성 실패: " + (err.message || "오류 발생"), "error");
		} finally {
			setExplainingEventId(null);
		}
	};
	const handleTriggerTest = async () => {
		try {
			if ((await marketMonitorClient.triggerTestEvent({
				type: "PRICE_SURGE",
				scope: "STOCK",
				title: "삼성전자 급등 감지 테스트 (+5.80%)",
				description: "서버 실시간 수치 연산에 의한 급등 조건 충족 테스트 이벤트입니다.",
				symbol: "005930",
				symbolName: "삼성전자",
				market: "KOSPI",
				metrics: {
					currentValue: 5.8,
					threshold: config?.PRICE_RISE_ALERT_PERCENT || 5,
					unit: "%",
					changePercent: 5.8
				}
			})).message) showToast("중복 방지 쿨다운 적용 중입니다. 잠시 후 다시 시도하세요.", "warning");
			else {
				showToast("테스트 이벤트가 서버에서 성공적으로 감지되었습니다.", "success");
				fetchMonitoringData();
			}
		} catch {
			showToast("테스트 이벤트 생성 실패", "error");
		}
	};
	const getEventBadge = (type) => {
		switch (type) {
			case "PRICE_SURGE": return {
				label: "급등 감지",
				color: "bg-rose-500/10 text-rose-500 border-rose-500/30",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-3.5 h-3.5" })
			};
			case "PRICE_PLUNGE": return {
				label: "급락 경보",
				color: "bg-blue-500/10 text-blue-500 border-blue-500/30",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "w-3.5 h-3.5" })
			};
			case "VOLUME_SPIKE": return {
				label: "거래량 급증",
				color: "bg-amber-500/10 text-amber-500 border-amber-500/30",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-3.5 h-3.5" })
			};
			case "TRADING_VALUE_SPIKE": return {
				label: "거래대금 폭증",
				color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-3.5 h-3.5" })
			};
			case "MARKET_TURBULENCE": return {
				label: "시장 급변동",
				color: "bg-purple-500/10 text-purple-500 border-purple-500/30",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-3.5 h-3.5" })
			};
			case "SIDECAR": return {
				label: "사이드카 발동",
				color: "bg-orange-500/10 text-orange-500 border-orange-500/30 animate-pulse",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-3.5 h-3.5" })
			};
			case "CIRCUIT_BREAKER": return {
				label: "서킷브레이커",
				color: "bg-rose-600 text-white animate-pulse",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-3.5 h-3.5" })
			};
			default: return {
				label: "시장 알림",
				color: "bg-slate-100 text-slate-700",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-3.5 h-3.5" })
			};
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12 animate-in fade-in duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#131722] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "p-2 rounded-xl bg-rose-500/10 text-rose-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-5 h-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-black text-slate-900 dark:text-white",
							children: "병돌 인베스트먼트 시장 모니터링 시스템"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }), "서버 감지 엔진 가동 중"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5",
					children: "서버가 주식·지수 데이터를 실시간 수치 연산하여 7대 핵심 이벤트를 포착하고 중복 알림 방지(Cooldown)를 적용합니다."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 self-start md:self-center flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleTriggerTest,
							className: "flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer",
							title: "테스트 알림을 서버로 전송하여 쿨다운 및 감지 검증",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-3.5 h-3.5 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "테스트 감지" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setIsConfigOpen(true),
							className: "flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "w-3.5 h-3.5 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "감지 조건 설정" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: fetchMonitoringData,
							className: "p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer",
							title: "새로고침",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-rose-500 font-bold mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-3 h-3" }), " 1. 급등"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-mono",
									children: "STOCK"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-bold text-slate-900 dark:text-white text-sm font-mono",
								children: [
									"+",
									config?.PRICE_RISE_ALERT_PERCENT ?? 5,
									"% 이상"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-slate-400 mt-1",
								children: "등락률 기준"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-blue-500 font-bold mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "w-3 h-3" }), " 2. 급락"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-mono",
									children: "STOCK"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-bold text-slate-900 dark:text-white text-sm font-mono",
								children: [config?.PRICE_FALL_ALERT_PERCENT ?? -5, "% 이하"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-slate-400 mt-1",
								children: "등락률 기준"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-amber-500 font-bold mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-3 h-3" }), " 3. 거래량 급증"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-mono",
									children: "STOCK"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-bold text-slate-900 dark:text-white text-sm font-mono",
								children: [((config?.VOLUME_SPIKE_MULTIPLIER ?? 2) * 100).toFixed(0), "% 이상"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-slate-400 mt-1",
								children: "20일 평균 대비 배수"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-emerald-500 font-bold mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-3 h-3" }), " 4. 거래대금"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-mono",
									children: "STOCK"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-bold text-slate-900 dark:text-white text-sm font-mono",
								children: [(config?.TRADING_VALUE_ALERT_THRESHOLD ?? 3e3).toLocaleString(), "억"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-slate-400 mt-1",
								children: "자금 집중 기준"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-purple-500 font-bold mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-3 h-3" }), " 5. 시장 급변"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-mono",
									children: "MARKET"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-bold text-slate-900 dark:text-white text-sm font-mono",
								children: [
									"지수 ±",
									config?.MARKET_INDEX_ALERT_PERCENT ?? 2,
									"%"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-slate-400 mt-1",
								children: "코스피·코스닥"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-orange-500 font-bold mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-3 h-3" }), " 6. 사이드카"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-mono",
									children: "MARKET"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-bold text-slate-900 dark:text-white text-sm font-mono",
								children: [
									"지수 ±",
									config?.SIDECAR_THRESHOLD_PERCENT ?? 5,
									"%"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-slate-400 mt-1",
								children: "호가 효력정지"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-rose-600 font-bold mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-3 h-3" }), " 7. 서킷브레이커"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-mono",
									children: "MARKET"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-bold text-slate-900 dark:text-white text-sm font-mono",
								children: [
									"지수 ",
									config?.CIRCUIT_BREAKER_LV1_PERCENT ?? -8,
									"%"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-slate-400 mt-1",
								children: "전 종목 매매중단"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockInsightAiDataQuery, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockInsightAiBriefing, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalFinancialDashboard, { onSelectSymbol: navigateToStock }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setScopeFilter("ALL"),
							className: `px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${scopeFilter === "ALL" ? "bg-white dark:bg-[#1a1f2e] text-slate-900 dark:text-white shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
							children: [
								"전체 알림 피드 (",
								events.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setScopeFilter("STOCK"),
							className: `px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${scopeFilter === "STOCK" ? "bg-white dark:bg-[#1a1f2e] text-slate-900 dark:text-white shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
							children: [
								"🏢 개별 종목 이벤트 (",
								events.filter((e) => e.scope === "STOCK").length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setScopeFilter("MARKET"),
							className: `px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${scopeFilter === "MARKET" ? "bg-white dark:bg-[#1a1f2e] text-slate-900 dark:text-white shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
							children: [
								"🏛️ 시장 전체 조치 (",
								events.filter((e) => e.scope === "MARKET").length,
								")"
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"중복 방지 Cooldown: ",
						((config?.ALERT_COOLDOWN_MS ?? 18e4) / 1e3).toFixed(0),
						"초"
					] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3.5",
				children: events.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-12 text-center bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3 animate-pulse" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-slate-700 dark:text-slate-300",
							children: "현재 감지된 시장 이벤트가 없습니다."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400 mt-1",
							children: "설정된 임계값을 초과하는 급등·급락·거래량 폭증 발생 시 서버가 자동으로 감지합니다."
						})
					]
				}) : events.map((event) => {
					const badge = getEventBadge(event.type);
					const isExplaining = explainingEventId === event.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 flex-wrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `px-2.5 py-1 rounded-md text-xs font-bold border flex items-center gap-1 ${badge.color}`,
											children: [badge.icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: badge.label })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
											children: event.scope === "MARKET" ? "시장 전체" : "개별 종목"
										}),
										event.market && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500",
											children: event.market
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs font-mono text-slate-400 flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }), event.timestamp]
										})
									]
								}), event.symbol && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => navigateToStock(event.symbol),
									className: "text-xs font-bold text-rose-500 hover:underline flex items-center gap-1 self-start sm:self-center cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [event.symbolName, " 종목 상세"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-bold text-slate-900 dark:text-white",
								children: event.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed",
								children: event.description
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 font-mono text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-400 font-sans mr-1.5",
											children: "감지 수치:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-slate-900 dark:text-white",
											children: [event.metrics.currentValue, event.metrics.unit]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-400 font-sans mr-1.5",
											children: "설정 임계값:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold",
											children: [event.metrics.threshold, event.metrics.unit]
										})]
									}),
									event.metrics.volumeRatio !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20",
										children: [
											"평균 대비 ",
											event.metrics.volumeRatio,
											"%"
										]
									}),
									event.metrics.tradingValue !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20",
										children: [
											"거래대금 ",
											event.metrics.tradingValue.toLocaleString(),
											"억 원"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-2",
								children: event.aiExplanation ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/20 text-xs text-slate-800 dark:text-slate-200 space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 font-bold text-purple-600 dark:text-purple-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Gemini AI 시황 분석 및 투자 유의사항" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-slate-700 dark:text-slate-300 leading-relaxed font-sans",
										children: event.aiExplanation
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleExplainWithGemini(event.id),
									disabled: isExplaining,
									className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 transition-all cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isExplaining ? "Gemini AI 분석 생성 중..." : "Gemini AI 이벤트 해설 및 요약 받기" })]
								})
							})
						]
					}, event.id);
				})
			}),
			isConfigOpen && editConfig && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "w-5 h-5 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-lg text-slate-900 dark:text-white",
								children: "시장 모니터링 감지 조건 설정"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setIsConfigOpen(false),
							className: "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveConfig,
						className: "space-y-4 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-700 dark:text-amber-400",
								children: "💡 조건은 코드 하드코딩이 아닌 아래 설정값으로 서버에서 실시간 계산·관리됩니다."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold text-slate-700 dark:text-slate-300 block mb-1",
									children: "1. 급등 감지 기준 (PRICE_RISE_ALERT_PERCENT, %)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									step: "0.5",
									value: editConfig.PRICE_RISE_ALERT_PERCENT,
									onChange: (e) => setEditConfig({
										...editConfig,
										PRICE_RISE_ALERT_PERCENT: Number(e.target.value)
									}),
									className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm",
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-slate-400",
									children: "종목 등락률이 이 수치 이상일 때 급등 알림 생성"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold text-slate-700 dark:text-slate-300 block mb-1",
									children: "2. 급락 감지 기준 (PRICE_FALL_ALERT_PERCENT, %)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									step: "0.5",
									value: editConfig.PRICE_FALL_ALERT_PERCENT,
									onChange: (e) => setEditConfig({
										...editConfig,
										PRICE_FALL_ALERT_PERCENT: Number(e.target.value)
									}),
									className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm",
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-slate-400",
									children: "종목 등락률이 이 수치 이하일 때 급락 경보 생성 (음수 입력)"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold text-slate-700 dark:text-slate-300 block mb-1",
									children: "3. 거래량 급증 배수 (VOLUME_SPIKE_MULTIPLIER, 배)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									step: "0.1",
									value: editConfig.VOLUME_SPIKE_MULTIPLIER,
									onChange: (e) => setEditConfig({
										...editConfig,
										VOLUME_SPIKE_MULTIPLIER: Number(e.target.value)
									}),
									className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm",
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-slate-400",
									children: "2.0 = 20일 평균 거래량 대비 200% 이상"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-bold text-slate-700 dark:text-slate-300 block mb-1",
								children: "4. 거래대금 폭증 임계치 (TRADING_VALUE_ALERT_THRESHOLD, 억 원)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								step: "500",
								value: editConfig.TRADING_VALUE_ALERT_THRESHOLD,
								onChange: (e) => setEditConfig({
									...editConfig,
									TRADING_VALUE_ALERT_THRESHOLD: Number(e.target.value)
								}),
								className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold text-slate-700 dark:text-slate-300 block mb-1",
									children: "5. 시장 급변 지수 임계치 (MARKET_INDEX_ALERT_PERCENT, %)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									step: "0.5",
									value: editConfig.MARKET_INDEX_ALERT_PERCENT,
									onChange: (e) => setEditConfig({
										...editConfig,
										MARKET_INDEX_ALERT_PERCENT: Number(e.target.value)
									}),
									className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm",
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-slate-400",
									children: "KOSPI / KOSDAQ 지수 ±변동폭 기준"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold text-slate-700 dark:text-slate-300 block mb-1",
									children: "6. 사이드카 기준 (%)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									step: "0.5",
									value: editConfig.SIDECAR_THRESHOLD_PERCENT,
									onChange: (e) => setEditConfig({
										...editConfig,
										SIDECAR_THRESHOLD_PERCENT: Number(e.target.value)
									}),
									className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm",
									required: true
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold text-slate-700 dark:text-slate-300 block mb-1",
									children: "7. 서킷브레이커 기준 (%)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									step: "0.5",
									value: editConfig.CIRCUIT_BREAKER_LV1_PERCENT,
									onChange: (e) => setEditConfig({
										...editConfig,
										CIRCUIT_BREAKER_LV1_PERCENT: Number(e.target.value)
									}),
									className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm",
									required: true
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold text-slate-700 dark:text-slate-300 block mb-1",
									children: "8. 중복 알림 방지 Cooldown (ALERT_COOLDOWN_MS, 밀리초)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									step: "10000",
									value: editConfig.ALERT_COOLDOWN_MS,
									onChange: (e) => setEditConfig({
										...editConfig,
										ALERT_COOLDOWN_MS: Number(e.target.value)
									}),
									className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm",
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-slate-400",
									children: [(editConfig.ALERT_COOLDOWN_MS / 1e3).toFixed(0), "초 동안 같은 종목의 동일 이벤트는 반복 발생하지 않습니다."]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setIsConfigOpen(false),
									className: "px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
									children: "취소"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "px-5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-sm",
									children: "설정 저장 및 즉시 적용"
								})]
							})
						]
					})]
				})
			})
		]
	});
};
//#endregion
export { StockInsightView };
