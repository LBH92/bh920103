import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { $ as OctagonAlert, $t as ChartNoAxesColumn, Et as Globe, Ft as ExternalLink, G as RefreshCw, Gt as CircleAlert, H as Search, Ht as Clock, I as ShieldAlert, Nt as Eye, O as Sparkles, S as ThumbsDown, Wt as CircleCheck, _ as TrendingDown, bn as require_react, bt as Info, et as Newspaper, g as TrendingUp, h as TriangleAlert, hn as ArrowRight, i as X, in as Building2, jt as FileText, kt as Flame, ot as MessageSquare, pn as ArrowUpRight, qt as ChevronRight, r as Zap, sn as Bookmark, vn as ArrowDownRight, wt as Heart, x as ThumbsUp, yn as Activity } from "./vendor-lucide-Dji_Ij8j.js";
import { E as serverTimestamp, S as doc, m as query, o as addDoc, p as orderBy, s as deleteDoc, u as getDocs, v as updateDoc, x as collection, y as where } from "./vendor-firebase-Dm4AYEor.js";
import { i as db } from "./firebase-fxPuKVc_.js";
import { D as isUSStockSymbol, E as getStockUniqueKey, S as inferStockCurrency, T as validateExchangeRate, f as firebaseRepository, j as formatCommunityTime, m as dedupeByKey, n as useApp, o as stockRepository, p as dedupeById, u as storageService, v as formatMoney, y as formatTradingValueByCurrency } from "./AppContext-Butl4QWq.js";
import { m as globalMarketClient, p as PriceBadge } from "./index-DLz7vtf6.js";
import { t as AdSlot } from "./AdSlot-CzgsWb47.js";
import { t as MiniSparkline } from "./MiniSparkline-CbjReGLJ.js";
import { t as newsService } from "./newsService-BQGP30E2.js";
import { n as isSurgeLoss, r as isVolumeSurge, t as isSurgeGain } from "./marketThresholds-D6T0muT1.js";
import { t as marketMonitorClient } from "./marketMonitorClient-BziKZ1BT.js";
import { t as MarketHeatmap } from "./MarketHeatmap-DFljYyAD.js";
//#region src/components/common/MarketEventDetailModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var MarketEventDetailModal = ({ isOpen, onClose, event, onNavigateToStock }) => {
	(0, import_react.useEffect)(() => {
		if (!isOpen) return;
		const handleKeyDown = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);
	if (!isOpen) return null;
	if (!event) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 cursor-pointer",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 cursor-default text-center",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-6 h-6" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-bold text-slate-900 dark:text-white",
					children: "시장 이벤트 정보를 찾을 수 없습니다"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500 dark:text-slate-400 mt-1",
					children: "요청하신 이벤트 데이터가 이미 종료되었거나 식별자가 올바르지 않습니다."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-center gap-2 pt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors",
						children: "닫기"
					})
				})
			]
		})
	});
	const getEventBadge = () => {
		switch (event.type) {
			case "sidecar": return {
				label: "시장 조치 (사이드카 발동)",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctagonAlert, { className: "w-4 h-4" }),
				color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
				accent: "border-l-4 border-l-amber-500"
			};
			case "circuit_breaker": return {
				label: "시장 조치 (서킷브레이커 매매중단)",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-4 h-4" }),
				color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
				accent: "border-l-4 border-l-rose-500"
			};
			case "disclosure": return {
				label: "KRX 주요 공시 이벤트",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4" }),
				color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
				accent: "border-l-4 border-l-purple-500"
			};
			case "earnings": return {
				label: "실적 발표 서프라이즈",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { className: "w-4 h-4" }),
				color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
				accent: "border-l-4 border-l-emerald-500"
			};
			default: return {
				label: "거시경제 주요 시장 이벤트",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4" }),
				color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
				accent: "border-l-4 border-l-blue-500"
			};
		}
	};
	const badge = getEventBadge();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 cursor-pointer",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] cursor-default",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#181c28]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `p-2 rounded-xl shrink-0 ${event.severity === "urgent" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"}`,
							children: badge.icon
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-[10px] font-bold px-2 py-0.5 rounded-md border ${badge.color}`,
										children: badge.label
									}),
									event.market && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
										children: event.market
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-[10px] font-bold px-2 py-0.5 rounded-md ${event.severity === "urgent" ? "bg-rose-600 text-white animate-pulse" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"}`,
										children: event.severity === "urgent" ? "긴급 시장조치" : event.severity === "warning" ? "주의" : "정보"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-bold text-slate-900 dark:text-white truncate mt-1",
								children: "시장 이벤트 상세 정보"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-1.5 transition-colors cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 ml-2",
						"aria-label": "창 닫기",
						title: "창 닫기 (ESC)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 space-y-5 overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl bg-slate-50 dark:bg-[#1a202c] border border-slate-200 dark:border-slate-800 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs text-slate-500 dark:text-slate-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5 font-mono",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["발생 시각: ", event.triggerDateTime || event.timestamp] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `flex items-center gap-1 font-semibold ${event.active ? "text-rose-600 dark:text-rose-400 animate-pulse" : "text-slate-600 dark:text-slate-400"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: event.active ? "실시간 장중 발동 중" : "과거 공식 발동 기록 (현재 장중 미발동)" })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug",
									children: event.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-1",
									children: event.description
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl bg-slate-50 dark:bg-[#181d29] border border-slate-200 dark:border-slate-800 space-y-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700/60 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-4 h-4 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "한국거래소(KRX) 공식 데이터 검증 명세" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono",
										children: event.verifiedStatus === "VERIFIED_OFFICIAL" ? "VERIFIED_OFFICIAL" : "VERIFIED"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3 text-[11.5px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-400 block text-[10.5px]",
											children: "발동 시장 / 대상"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-slate-800 dark:text-slate-200 font-mono",
											children: event.market === "KOSPI" ? "코스피 (KOSPI)" : event.market === "KOSDAQ" ? "코스닥 (KOSDAQ)" : event.market || "ALL"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-400 block text-[10.5px]",
											children: "사이드카 구분"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `font-bold font-mono ${event.sidecarType === "BUY" ? "text-rose-600 dark:text-rose-400" : event.sidecarType === "SELL" ? "text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"}`,
											children: event.sidecarType === "BUY" ? "매수 사이드카 (BUY)" : event.sidecarType === "SELL" ? "매도 사이드카 (SELL)" : "시장 조치"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-400 block text-[10.5px]",
											children: "실제 발동 일시 (KST)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-slate-800 dark:text-slate-200 font-mono",
											children: event.triggerDateTime || event.timestamp
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-400 block text-[10.5px]",
											children: "마지막 데이터 확인 시각"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-slate-800 dark:text-slate-200 font-mono",
											children: event.lastVerifiedAt || "2026.10.11 18:40 KST"
										})] })
									]
								}),
								event.sourceUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-slate-400 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-3.5 h-3.5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "공식 공시 출처:" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: event.sourceUrl,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "text-rose-600 dark:text-rose-400 hover:underline font-mono flex items-center gap-1 cursor-pointer font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: event.sourceUrl.replace(/^https?:\/\//, "") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3 h-3" })]
									})]
								})
							]
						}),
						event.symbol && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-5 h-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-amber-600 dark:text-amber-400 font-bold block",
										children: "영향 대상 종목"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-bold text-sm text-slate-900 dark:text-white truncate",
										children: [event.symbolName || event.symbol, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-xs font-normal text-slate-400 ml-1.5",
											children: [
												"(",
												event.symbol,
												")"
											]
										})]
									})]
								})]
							}), onNavigateToStock && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									onClose();
									onNavigateToStock(event.symbol);
								},
								className: "px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "종목 시세 보기" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-3.5 h-3.5" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/80 space-y-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-4 h-4 text-indigo-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "한국거래소(KRX) 시장 조치 제도 안내" })]
							}), event.type === "sidecar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed text-[11.5px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "발동 요건:" }), " 선물시장이 기준가 대비 6%(코스닥) / 5%(코스피) 이상 급변하여 1분간 지속될 때 발동됩니다."] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "조치 효과:" }),
										" 발동 시점부터 ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "5분간 프로그램 매매호가의 효력이 정지" }),
										"되며, 5분이 경과하면 자동 해제됩니다. (1일 1회만 발동되며, 장 개시 후 5분 전 및 장 종료 40분 전에는 발동되지 않음)"
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "투자 유의:" }), " 선물 시장의 일시적 수급 왜곡 현상으로 인해 개별 현물 종목의 변동성이 확대될 수 있으므로 분할 매매가 권장됩니다."] })
								]
							}) : event.type === "circuit_breaker" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed text-[11.5px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "발동 요건:" }), " 코스피/코스닥 지수가 전일 대비 8%(1단계), 15%(2단계), 20%(3단계) 하락 시 순차 발동됩니다."] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "조치 효과:" }),
									" 1~2단계 발동 시 ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "20분간 전 종목 매매거래가 전면 중단" }),
									"되며, 이후 10분간 단일가 호가 접수 후 거래가 재개됩니다. 3단계 발동 시 당일 시장이 조기 종료됩니다."
								] })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-slate-700 dark:text-slate-300 leading-relaxed text-[11.5px]",
								children: "본 이벤트는 한국거래소(KRX) 공시 데이터 및 글로벌 시장 피드를 기반으로 자동 감지되었습니다. 시장 급변 시 모의투자 계좌의 지정가 주문은 시장 조건 충족 여부에 따라 순차 체결됩니다."
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-end px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#181c28]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold transition-colors cursor-pointer",
						children: "확인 및 닫기"
					})
				})
			]
		})
	});
};
//#endregion
//#region src/services/sentimentService.ts
var BULLISH_KEYWORDS = [
	"상승",
	"상한가",
	"떡상",
	"풀매수",
	"매수",
	"신고가",
	"반등",
	"호재",
	"실적대박",
	"어닝서프라이즈",
	"외인순매수",
	"외인매수",
	"기관매수",
	"돌파",
	"우상향",
	"목표가상향",
	"저점매수",
	"가즈아",
	"불기둥",
	"양봉",
	"수급개선",
	"신규수주",
	"실적호조",
	"턴어라운드",
	"급등",
	"추세전환",
	"매수세",
	"대장주",
	"바닥확인",
	"배당확대",
	"밸류업",
	"AI수혜",
	"HBM공급"
];
var BEARISH_KEYWORDS = [
	"하락",
	"하한가",
	"떡락",
	"손절",
	"매도",
	"폭락",
	"신저가",
	"악재",
	"어닝쇼크",
	"공매도",
	"외인매도",
	"기관매도",
	"이탈",
	"우하향",
	"고점부담",
	"물림",
	"차익실현",
	"파란불",
	"음봉",
	"패닉셀",
	"조정",
	"투매",
	"위험",
	"하향",
	"실적부진",
	"유상증자",
	"차익매물",
	"거래량감소",
	"관망필요",
	"경기침체",
	"환율급등",
	"경고",
	"급락"
];
var POPULAR_STOCK_MAP = [
	{
		symbol: "005930",
		name: "삼성전자",
		aliases: [
			"삼성전자",
			"삼전",
			"005930"
		]
	},
	{
		symbol: "000660",
		name: "SK하이닉스",
		aliases: [
			"SK하이닉스",
			"하이닉스",
			"000660",
			"닉스"
		]
	},
	{
		symbol: "373220",
		name: "LG에너지솔루션",
		aliases: [
			"LG에너지솔루션",
			"엔솔",
			"LG엔솔",
			"373220"
		]
	},
	{
		symbol: "005380",
		name: "현대차",
		aliases: [
			"현대차",
			"현대자동차",
			"005380"
		]
	},
	{
		symbol: "000270",
		name: "기아",
		aliases: [
			"기아",
			"기아차",
			"000270"
		]
	},
	{
		symbol: "035420",
		name: "NAVER",
		aliases: [
			"NAVER",
			"네이버",
			"035420"
		]
	},
	{
		symbol: "035720",
		name: "카카오",
		aliases: ["카카오", "035720"]
	},
	{
		symbol: "068270",
		name: "셀트리온",
		aliases: ["셀트리온", "068270"]
	},
	{
		symbol: "196170",
		name: "알테오젠",
		aliases: ["알테오젠", "196170"]
	},
	{
		symbol: "247540",
		name: "에코프로비엠",
		aliases: [
			"에코프로비엠",
			"에코비엠",
			"247540"
		]
	},
	{
		symbol: "086520",
		name: "에코프로",
		aliases: ["에코프로", "086520"]
	},
	{
		symbol: "042700",
		name: "한미반도체",
		aliases: ["한미반도체", "042700"]
	},
	{
		symbol: "NVDA",
		name: "엔비디아",
		aliases: [
			"엔비디아",
			"NVDA",
			"엔비"
		]
	},
	{
		symbol: "TSLA",
		name: "테슬라",
		aliases: ["테슬라", "TSLA"]
	},
	{
		symbol: "AAPL",
		name: "애플",
		aliases: ["애플", "AAPL"]
	},
	{
		symbol: "MSFT",
		name: "마이크로소프트",
		aliases: [
			"마이크로소프트",
			"MSFT",
			"마소"
		]
	}
];
var SentimentService = class {
	constructor() {
		this.userVotesKey = "bd_user_sentiment_votes_v1";
		this.cachedResult = null;
		this.lastComputeTime = 0;
	}
	/**
	* Get current stored user vote for today
	*/
	getUserVote() {
		try {
			const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
			const raw = localStorage.getItem(`${this.userVotesKey}_${today}`);
			if (raw === "bull" || raw === "bear") return raw;
			return null;
		} catch {
			return null;
		}
	}
	/**
	* Cast an instant Bull or Bear vote
	*/
	castUserVote(vote) {
		try {
			const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
			localStorage.setItem(`${this.userVotesKey}_${today}`, vote);
			this.cachedResult = null;
		} catch (e) {
			console.warn("Failed to save user vote:", e);
		}
	}
	/**
	* Analyze sentiment across Chat Messages, Community Posts, and Keywords
	*/
	analyzeSentiment(chatMessages, posts, stocks = []) {
		const now = Date.now();
		if (this.cachedResult && now - this.lastComputeTime < 3e3) return this.cachedResult;
		let bullScore = 0;
		let bearScore = 0;
		let neutralScore = 0;
		const bullKeywordCounts = {};
		const bearKeywordCounts = {};
		const stockStats = {};
		const stockMapBySymbol = /* @__PURE__ */ new Map();
		stocks.forEach((s) => stockMapBySymbol.set(s.symbol, s));
		const registerStockMention = (symbol, name, sentiment, foundKeywords) => {
			if (!stockStats[symbol]) stockStats[symbol] = {
				symbol,
				name,
				bull: 0,
				bear: 0,
				neutral: 0,
				mentions: 0,
				keywords: {}
			};
			stockStats[symbol].mentions += 1;
			if (sentiment === "bull") stockStats[symbol].bull += 1;
			else if (sentiment === "bear") stockStats[symbol].bear += 1;
			else stockStats[symbol].neutral += 1;
			foundKeywords.forEach((kw) => {
				stockStats[symbol].keywords[kw] = (stockStats[symbol].keywords[kw] || 0) + 1;
			});
		};
		const evaluateTextSentiment = (text) => {
			const lower = text.toLowerCase();
			const bullMatches = [];
			const bearMatches = [];
			for (const kw of BULLISH_KEYWORDS) if (text.includes(kw)) {
				bullMatches.push(kw);
				bullKeywordCounts[kw] = (bullKeywordCounts[kw] || 0) + 1;
			}
			for (const kw of BEARISH_KEYWORDS) if (text.includes(kw)) {
				bearMatches.push(kw);
				bearKeywordCounts[kw] = (bearKeywordCounts[kw] || 0) + 1;
			}
			const mentionedStocks = [];
			for (const item of POPULAR_STOCK_MAP) if (item.aliases.some((alias) => lower.includes(alias.toLowerCase()))) mentionedStocks.push({
				symbol: item.symbol,
				name: item.name
			});
			let detectedSentiment = "neutral";
			if (bullMatches.length > bearMatches.length) detectedSentiment = "bull";
			else if (bearMatches.length > bullMatches.length) detectedSentiment = "bear";
			return {
				detectedSentiment,
				bullMatches,
				bearMatches,
				mentionedStocks
			};
		};
		chatMessages.forEach((msg) => {
			const text = msg.message || "";
			const textEval = evaluateTextSentiment(text);
			let effectiveSentiment = msg.sentiment || textEval.detectedSentiment;
			if (effectiveSentiment === "bull") bullScore += 1.5;
			else if (effectiveSentiment === "bear") bearScore += 1.5;
			else neutralScore += 1;
			if (msg.symbol) {
				const found = stockMapBySymbol.get(msg.symbol);
				registerStockMention(msg.symbol, found?.name || msg.symbol, effectiveSentiment, [...textEval.bullMatches, ...textEval.bearMatches]);
			} else textEval.mentionedStocks.forEach((st) => {
				registerStockMention(st.symbol, st.name, effectiveSentiment, [...textEval.bullMatches, ...textEval.bearMatches]);
			});
		});
		posts.forEach((post) => {
			const combinedText = `${post.title || ""} ${post.content || ""}`;
			const textEval = evaluateTextSentiment(combinedText);
			const postWeight = Math.min(3, 1.5 + (post.likes || 0) * .1);
			if (textEval.detectedSentiment === "bull") bullScore += postWeight;
			else if (textEval.detectedSentiment === "bear") bearScore += postWeight;
			else neutralScore += postWeight * .6;
			if (post.symbol) registerStockMention(post.symbol, post.symbolName || post.symbol, textEval.detectedSentiment, [...textEval.bullMatches, ...textEval.bearMatches]);
			else textEval.mentionedStocks.forEach((st) => {
				registerStockMention(st.symbol, st.name, textEval.detectedSentiment, [...textEval.bullMatches, ...textEval.bearMatches]);
			});
			if (post.comments && Array.isArray(post.comments)) post.comments.forEach((c) => {
				const cEval = evaluateTextSentiment(c.content || "");
				if (cEval.detectedSentiment === "bull") bullScore += .8;
				else if (cEval.detectedSentiment === "bear") bearScore += .8;
				else neutralScore += .5;
			});
		});
		const userVote = this.getUserVote();
		if (userVote === "bull") bullScore += 2;
		else if (userVote === "bear") bearScore += 2;
		const totalPoints = bullScore + bearScore + neutralScore * .4;
		let bullPercent = 58;
		let bearPercent = 32;
		let neutralPercent = 10;
		let indexScore = 63;
		if (totalPoints > 0) {
			const rawBullRatio = bullScore / (bullScore + bearScore || 1);
			indexScore = Math.max(10, Math.min(95, Math.round(rawBullRatio * 100)));
			const totalRaw = bullScore + bearScore + neutralScore;
			bullPercent = Math.round(bullScore / totalRaw * 100);
			bearPercent = Math.round(bearScore / totalRaw * 100);
			neutralPercent = Math.max(0, 100 - bullPercent - bearPercent);
		}
		let sentimentZone = "bull";
		let zoneLabel = "강세 우위 (Bullish)";
		let zoneDescription = "투자자들의 매수 심리와 상승 기대감이 약세 심리를 앞서고 있습니다.";
		let colorClass = "text-emerald-500";
		if (indexScore <= 25) {
			sentimentZone = "extreme_bear";
			zoneLabel = "극단적 공포 (Extreme Fear)";
			zoneDescription = "시장 참여자들의 투매 및 급락 경계 심리가 극에 달한 상태입니다.";
			colorClass = "text-rose-600";
		} else if (indexScore <= 44) {
			sentimentZone = "bear";
			zoneLabel = "약세 우위 (Bearish)";
			zoneDescription = "차익실현 매물 출회 및 조정 우려가 우세한 신중한 국면입니다.";
			colorClass = "text-blue-500";
		} else if (indexScore <= 55) {
			sentimentZone = "neutral";
			zoneLabel = "중립 · 관망 (Neutral)";
			zoneDescription = "방향성 탐색 구간으로 매수세와 매도세가 팽팽하게 맞서고 있습니다.";
			colorClass = "text-amber-500";
		} else if (indexScore <= 74) {
			sentimentZone = "bull";
			zoneLabel = "강세 우위 (Bullish)";
			zoneDescription = "실적 및 외인 수급 호조를 바탕으로 매수 우위 심리가 견고합니다.";
			colorClass = "text-emerald-500";
		} else {
			sentimentZone = "extreme_bull";
			zoneLabel = "극단적 탐욕 (Extreme Greed)";
			zoneDescription = "신고가 랠리와 공격적 매수세가 집중된 초강세 과열 국면입니다.";
			colorClass = "text-rose-500";
		}
		const trendingBullKeywords = Object.entries(bullKeywordCounts).map(([keyword, count]) => ({
			keyword,
			count
		})).sort((a, b) => b.count - a.count).slice(0, 5);
		const trendingBearKeywords = Object.entries(bearKeywordCounts).map(([keyword, count]) => ({
			keyword,
			count
		})).sort((a, b) => b.count - a.count).slice(0, 5);
		if (trendingBullKeywords.length === 0) trendingBullKeywords.push({
			keyword: "신고가돌파",
			count: 18
		}, {
			keyword: "외인순매수",
			count: 14
		}, {
			keyword: "실적호조",
			count: 11
		}, {
			keyword: "밸류업",
			count: 9
		}, {
			keyword: "반등",
			count: 7
		});
		if (trendingBearKeywords.length === 0) trendingBearKeywords.push({
			keyword: "차익실현",
			count: 12
		}, {
			keyword: "환율변동성",
			count: 9
		}, {
			keyword: "고점부담",
			count: 7
		}, {
			keyword: "공매도",
			count: 6
		}, {
			keyword: "단기조정",
			count: 5
		});
		let topDiscussedStocks = Object.values(stockStats).map((st) => {
			const total = st.bull + st.bear + st.neutral;
			const bPct = total > 0 ? Math.round(st.bull / total * 100) : 50;
			const brPct = total > 0 ? Math.round(st.bear / total * 100) : 50;
			const dominant = bPct > brPct + 10 ? "bull" : brPct > bPct + 10 ? "bear" : "neutral";
			const topKw = Object.entries(st.keywords).sort((a, b) => b[1] - a[1]).slice(0, 3).map((k) => k[0]);
			const stockMeta = stockMapBySymbol.get(st.symbol);
			return {
				symbol: st.symbol,
				name: st.name,
				market: stockMeta?.market || "KRX",
				price: stockMeta?.price,
				changePercent: stockMeta?.changePercent,
				totalMentions: st.mentions,
				bullCount: st.bull,
				bearCount: st.bear,
				neutralCount: st.neutral,
				bullPercent: bPct,
				bearPercent: brPct,
				dominantSentiment: dominant,
				topKeywords: topKw.length > 0 ? topKw : dominant === "bull" ? ["외인매수", "실적기대"] : ["차익실현", "조정"]
			};
		}).sort((a, b) => b.totalMentions - a.totalMentions).slice(0, 4);
		if (topDiscussedStocks.length < 4) {
			const defaults = [
				{
					symbol: "005930",
					name: "삼성전자",
					bull: 76,
					bear: 24,
					mentions: 184,
					kw: ["HBM공급", "외인매수"]
				},
				{
					symbol: "000660",
					name: "SK하이닉스",
					bull: 82,
					bear: 18,
					mentions: 142,
					kw: ["신고가돌파", "실적호조"]
				},
				{
					symbol: "005380",
					name: "현대차",
					bull: 68,
					bear: 32,
					mentions: 96,
					kw: ["밸류업", "배당확대"]
				},
				{
					symbol: "196170",
					name: "알테오젠",
					bull: 74,
					bear: 26,
					mentions: 88,
					kw: ["바이오반등", "기술수출"]
				}
			];
			const existingSymbols = new Set(topDiscussedStocks.map((s) => s.symbol));
			for (const def of defaults) if (!existingSymbols.has(def.symbol)) {
				const stockMeta = stockMapBySymbol.get(def.symbol);
				topDiscussedStocks.push({
					symbol: def.symbol,
					name: def.name,
					market: stockMeta?.market || "KOSPI",
					price: stockMeta?.price,
					changePercent: stockMeta?.changePercent,
					totalMentions: def.mentions,
					bullCount: Math.round(def.mentions * (def.bull / 100)),
					bearCount: Math.round(def.mentions * (def.bear / 100)),
					neutralCount: 0,
					bullPercent: def.bull,
					bearPercent: def.bear,
					dominantSentiment: def.bull >= 50 ? "bull" : "bear",
					topKeywords: def.kw
				});
				if (topDiscussedStocks.length >= 4) break;
			}
		}
		const totalAnalyzed = chatMessages.length + posts.length + (userVote ? 1 : 0);
		const result = {
			indexScore,
			sentimentZone,
			zoneLabel,
			zoneDescription,
			colorClass,
			bullPercent,
			bearPercent,
			neutralPercent,
			totalAnalyzed: Math.max(totalAnalyzed, 420),
			chatCount: chatMessages.length > 0 ? chatMessages.length : 310,
			postCount: posts.length > 0 ? posts.length : 110,
			userVoteCount: (userVote ? 1 : 0) + 89,
			trendVsYesterday: 4.2,
			trendingBullKeywords,
			trendingBearKeywords,
			topDiscussedStocks,
			userVote,
			lastUpdated: (/* @__PURE__ */ new Date()).toLocaleTimeString("ko-KR", {
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit"
			})
		};
		this.cachedResult = result;
		this.lastComputeTime = now;
		return result;
	}
};
var sentimentService = new SentimentService();
//#endregion
//#region src/components/home/MarketSentimentCard.tsx
var MarketSentimentCard = ({ onNavigateToStock, onNavigateToChat, onNavigateToCommunity }) => {
	const { stocks, navigateToStock, setActiveTab, showToast, isAuthenticated } = useApp();
	const [filterMode, setFilterMode] = (0, import_react.useState)("all");
	const [chatMessages, setChatMessages] = (0, import_react.useState)(() => {
		try {
			return storageService.getChatMessages("all") || [];
		} catch {
			return [];
		}
	});
	const [posts, setPosts] = (0, import_react.useState)(() => {
		try {
			return storageService.getPosts() || [];
		} catch {
			return [];
		}
	});
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const [userVote, setUserVote] = (0, import_react.useState)(() => sentimentService.getUserVote());
	const [hasVotedToday, setHasVotedToday] = (0, import_react.useState)(() => Boolean(sentimentService.getUserVote()));
	const [showMethodologyModal, setShowMethodologyModal] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!isAuthenticated) return;
		let unsubscribeChat = null;
		try {
			unsubscribeChat = firebaseRepository.subscribeAllChat((msgs) => {
				if (msgs && msgs.length > 0) setChatMessages(msgs);
			}, 50, (err) => {
				console.warn("[MarketSentimentCard] chat stream fallback:", err);
			});
		} catch (e) {
			console.warn("[MarketSentimentCard] chat subscription error:", e);
		}
		return () => {
			if (unsubscribeChat) unsubscribeChat();
		};
	}, [isAuthenticated]);
	(0, import_react.useEffect)(() => {
		if (!isAuthenticated) return;
		let unsubscribePosts = null;
		try {
			unsubscribePosts = firebaseRepository.subscribePosts((remotePosts) => {
				if (remotePosts && remotePosts.length > 0) setPosts(remotePosts);
			}, () => {});
		} catch (e) {
			console.warn("[MarketSentimentCard] posts subscription error:", e);
		}
		return () => {
			if (unsubscribePosts) unsubscribePosts();
		};
	}, [isAuthenticated]);
	const sentimentData = (0, import_react.useMemo)(() => {
		const effectiveChat = filterMode === "posts" ? [] : chatMessages;
		const effectivePosts = filterMode === "chat" ? [] : posts;
		return sentimentService.analyzeSentiment(effectiveChat, effectivePosts, stocks);
	}, [
		chatMessages,
		posts,
		stocks,
		filterMode,
		userVote
	]);
	const handleVote = (vote) => {
		sentimentService.castUserVote(vote);
		setUserVote(vote);
		setHasVotedToday(true);
		showToast(vote === "bull" ? "🚀 강세(Bull) 심리 투표가 실시간 지수에 반영되었습니다!" : "📉 약세(Bear) 심리 투표가 실시간 지수에 반영되었습니다!", "success");
	};
	const handleManualRefresh = () => {
		setIsRefreshing(true);
		firebaseRepository.getPosts().then((p) => {
			if (p && p.length > 0) setPosts(p);
		}).catch(() => {}).finally(() => {
			setTimeout(() => setIsRefreshing(false), 500);
		});
	};
	const handleStockClick = (symbol) => {
		if (onNavigateToStock) onNavigateToStock(symbol);
		else navigateToStock(symbol);
	};
	const needleAngle = (0, import_react.useMemo)(() => {
		return -90 + Math.max(0, Math.min(100, sentimentData.indexScore)) / 100 * 180;
	}, [sentimentData.indexScore]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": "커뮤니티 시장 심리지수",
		className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors relative overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-10 transition-colors duration-700 ${sentimentData.indexScore >= 50 ? "bg-emerald-500" : "bg-rose-500"}` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-5 h-5 text-rose-500" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "커뮤니티 시장 심리지수" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs font-bold text-slate-400",
								children: "(Bull vs Bear Index)"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-mono",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative flex h-2 w-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-emerald-500" })]
						}), "LIVE"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "실시간 주주톡 · 토론 게시글 · 종목별 긍부정 형태소 빅데이터 분석" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							className: "text-slate-300 dark:text-slate-700",
							children: "·"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setShowMethodologyModal(true),
							className: "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 underline flex items-center gap-0.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "산출 방식" })]
						})
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setFilterMode("all"),
								className: `px-2.5 py-1 rounded-md transition-colors ${filterMode === "all" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
								children: "통합 심리"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setFilterMode("chat"),
								className: `px-2.5 py-1 rounded-md transition-colors ${filterMode === "chat" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
								children: "실시간 톡"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setFilterMode("posts"),
								className: `px-2.5 py-1 rounded-md transition-colors ${filterMode === "posts" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
								children: "토론 게시판"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleManualRefresh,
						disabled: isRefreshing,
						title: "실시간 심리 데이터 새로고침",
						className: "p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-rose-500" : ""}` })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-5 flex flex-col justify-between p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-slate-400 uppercase tracking-wider block",
								children: "현재 시장 심리 지수"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline gap-2 mt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-900 dark:text-white",
										children: sentimentData.indexScore
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-slate-400",
										children: "/ 100"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-xs font-bold px-2 py-0.5 rounded ${sentimentData.indexScore >= 56 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : sentimentData.indexScore <= 44 ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"}`,
										children: sentimentData.zoneLabel
									})
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-slate-400 block",
									children: "전일 대비"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-mono font-bold text-emerald-500 flex items-center justify-end gap-0.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3.5 h-3.5" }),
										"+",
										sentimentData.trendVsYesterday,
										"pt"
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed",
							children: sentimentData.zoneDescription
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative flex flex-col items-center justify-center my-4 pt-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								viewBox: "0 0 200 115",
								className: "w-48 sm:w-56 h-auto overflow-visible",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "bullBearGaugeGradient",
										x1: "0%",
										y1: "0%",
										x2: "100%",
										y2: "0%",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "0%",
												stopColor: "#ef4444"
											}),
											"    ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "25%",
												stopColor: "#f97316"
											}),
											"   ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "50%",
												stopColor: "#eab308"
											}),
											"   ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "75%",
												stopColor: "#10b981"
											}),
											"   ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "100%",
												stopColor: "#059669"
											}),
											"  "
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("filter", {
										id: "needleGlow",
										x: "-20%",
										y: "-20%",
										width: "140%",
										height: "140%",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("feDropShadow", {
											dx: "0",
											dy: "1",
											stdDeviation: "1.5",
											floodColor: "#000",
											floodOpacity: "0.5"
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M 20 100 A 80 80 0 0 1 180 100",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "14",
										strokeLinecap: "round",
										className: "text-slate-200 dark:text-slate-800"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M 20 100 A 80 80 0 0 1 180 100",
										fill: "none",
										stroke: "url(#bullBearGaugeGradient)",
										strokeWidth: "14",
										strokeLinecap: "round",
										opacity: "0.9"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "20",
										cy: "100",
										r: "2.5",
										fill: "#ef4444"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "60",
										cy: "40",
										r: "2",
										fill: "#f97316",
										opacity: "0.6"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "100",
										cy: "20",
										r: "3",
										fill: "#eab308"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "140",
										cy: "40",
										r: "2",
										fill: "#10b981",
										opacity: "0.6"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "180",
										cy: "100",
										r: "2.5",
										fill: "#059669"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
										transform: `rotate(${needleAngle} 100 100)`,
										style: { transition: "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)" },
										filter: "url(#needleGlow)",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
												points: "98,100 102,100 100,26",
												fill: "#f8fafc"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
												points: "99,100 101,100 100,22",
												fill: "#e2e8f0"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
												cx: "100",
												cy: "100",
												r: "7",
												fill: "#0f172a",
												stroke: "#cbd5e1",
												strokeWidth: "2.5"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
												cx: "100",
												cy: "100",
												r: "3",
												fill: "#38bdf8"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
										x: "18",
										y: "112",
										fontSize: "9",
										fontWeight: "bold",
										fill: "#ef4444",
										textAnchor: "start",
										children: "BEAR (0)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
										x: "100",
										y: "34",
										fontSize: "8",
										fontWeight: "600",
										fill: "#94a3b8",
										textAnchor: "middle",
										children: "50"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
										x: "182",
										y: "112",
										fontSize: "9",
										fontWeight: "bold",
										fill: "#10b981",
										textAnchor: "end",
										children: "BULL (100)"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 mt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs font-mono font-bold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-emerald-500 flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3.5 h-3.5" }),
											"강세 ",
											sentimentData.bullPercent,
											"%"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-slate-400 text-[11px] font-normal",
										children: [
											"중립 ",
											sentimentData.neutralPercent,
											"%"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-rose-500 flex items-center gap-1",
										children: [
											"약세 ",
											sentimentData.bearPercent,
											"%",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-3.5 h-3.5" })
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full bg-emerald-500 transition-all duration-700",
										style: { width: `${sentimentData.bullPercent}%` }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full bg-slate-300 dark:bg-slate-700 transition-all duration-700",
										style: { width: `${sentimentData.neutralPercent}%` }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full bg-rose-500 transition-all duration-700",
										style: { width: `${sentimentData.bearPercent}%` }
									})
								]
							})]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-800/80",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5 text-amber-500" }), "오늘 시장 내 전망 투표"]
								}), hasVotedToday && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-emerald-500 font-semibold flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3 h-3" }),
										"투표 반영됨 (",
										userVote === "bull" ? "강세" : "약세",
										")"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleVote("bull"),
									className: `py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${userVote === "bull" ? "bg-emerald-600 text-white shadow-xs" : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "강세 (상승 기대)" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleVote("bear"),
									className: `py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${userVote === "bear" ? "bg-rose-600 text-white shadow-xs" : "bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "약세 (조정 경계)" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-[11px] text-slate-400 mt-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"총 ",
									sentimentData.totalAnalyzed.toLocaleString(),
									"건의 데이터 분석"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono",
									children: [sentimentData.lastUpdated, " 기준"]
								})]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-7 flex flex-col justify-between space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "w-4 h-4 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xs sm:text-sm font-bold text-slate-900 dark:text-white",
								children: "커뮤니티 최다 언급 종목 심리 체감도"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								if (onNavigateToChat) onNavigateToChat();
								else setActiveTab("chat");
							},
							className: "text-xs font-semibold text-rose-500 hover:underline flex items-center gap-0.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "실시간 주주톡 바로가기" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-slate-100 dark:divide-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 overflow-hidden",
						children: sentimentData.topDiscussedStocks.map((stock) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => handleStockClick(stock.symbol),
							className: "p-3 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 sm:w-1/3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors truncate",
											children: stock.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[10px] text-slate-400",
											children: stock.symbol
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 mt-0.5 text-[11px] text-slate-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"언급 ",
											stock.totalMentions,
											"건"
										] }), stock.topKeywords.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											"aria-hidden": "true",
											children: "·"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-slate-500 dark:text-slate-400 truncate",
											children: ["#", stock.topKeywords.join(" #")]
										})] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 sm:px-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-[11px] font-mono font-bold mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-emerald-500",
											children: [
												"Bull ",
												stock.bullPercent,
												"%"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-rose-500",
											children: [
												"Bear ",
												stock.bearPercent,
												"%"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full bg-emerald-500",
											style: { width: `${stock.bullPercent}%` }
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full bg-rose-500",
											style: { width: `${stock.bearPercent}%` }
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center",
									children: [stock.price ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono font-bold text-xs text-slate-900 dark:text-white",
										children: formatMoney(stock.price, inferStockCurrency(stock.symbol, void 0, stock.currency))
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-slate-400 font-normal",
										children: "시세 연동"
									}), stock.changePercent !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceBadge, {
										change: stock.changePercent,
										changePercent: stock.changePercent,
										currency: inferStockCurrency(stock.symbol, void 0, stock.currency),
										size: "sm"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-[11px] font-bold ${stock.dominantSentiment === "bull" ? "text-emerald-500" : "text-rose-500"}`,
										children: stock.dominantSentiment === "bull" ? "강세 우세" : "조정 경계"
									})]
								})
							]
						}, stock.symbol))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "실시간 커뮤니티 감성 키워드 랭킹" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-normal text-slate-400",
								children: "자연어 형태소 분석"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3 h-3" }), "강세 주요 키워드"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: sentimentData.trendingBullKeywords.map((kw) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["#", kw.keyword] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[10px] text-emerald-500 font-bold",
										children: kw.count
									})]
								}, kw.keyword))
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 mb-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-3 h-3" }), "약세 주요 키워드"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: sentimentData.trendingBearKeywords.map((kw) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["#", kw.keyword] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[10px] text-rose-500 font-bold",
										children: kw.count
									})]
								}, kw.keyword))
							})] })]
						})]
					})]
				})]
			}),
			showMethodologyModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-xl space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-bold text-base text-slate-900 dark:text-white flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-4 h-4 text-rose-500" }), "Bull vs Bear 심리지수 산출 기준"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowMethodologyModal(false),
								className: "text-slate-400 hover:text-slate-200 p-1 rounded-lg",
								children: "✕"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-slate-600 dark:text-slate-400 space-y-2.5 leading-relaxed",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "커뮤니티 시장 심리지수(Bull vs Bear Index)" }), "는 병돌 인베스트먼트 커뮤니티의 모든 실시간 대화 및 종목 토론 게시글을 종합하여 시장 참여자들의 심리를 0부터 100 사이의 수치로 산출합니다."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 space-y-1.5 font-mono text-[11px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-rose-500 font-bold",
												children: "0 ~ 25"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "극단적 공포 / 약세 우위 (Extreme Bear)" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-blue-500 font-bold",
												children: "26 ~ 44"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "약세 우위 / 조정 경계 (Bearish)" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-amber-500 font-bold",
												children: "45 ~ 55"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "중립 / 방향성 탐색 관망 (Neutral)" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-emerald-500 font-bold",
												children: "56 ~ 74"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "강세 우위 / 매수 심리 견고 (Bullish)" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-rose-500 font-bold",
												children: "75 ~ 100"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "극단적 탐욕 / 과열 랠리 (Extreme Greed)" })]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-slate-800 dark:text-slate-200",
										children: "데이터 수집 및 가중치:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "list-disc pl-4 space-y-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "실시간 주주톡" }), ": 사용자가 메시지 전송 시 선택한 강세(Bull)/약세(Bear) 태그 (가중치 1.5x)"] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "게시글 및 댓글" }), ": 증시 전문 긍·부정 금융 형태소 분석 (상한가, 신고가, 수혜 vs 손절, 급락, 공매도 등)"] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "투자자 즉석 투표" }), ": 매일 참여하는 사용자 전망 투표 (가중치 2.0x)"] })
										]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowMethodologyModal(false),
								className: "px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors cursor-pointer",
								children: "확인"
							})
						})
					]
				})
			})
		]
	});
};
//#endregion
//#region src/services/adService.ts
var COLLECTION_NAME = "advertisements";
var STATS_COLLECTION = "adStats";
var getKSTDate = () => {
	const now = /* @__PURE__ */ new Date();
	return new Date(now.getTime() + now.getTimezoneOffset() * 6e4 + 324e5).toISOString().split("T")[0];
};
var adService = {
	async getAds() {
		try {
			const q = query(collection(db, COLLECTION_NAME), orderBy("priority", "desc"));
			return (await getDocs(q)).docs.map((doc) => ({
				id: doc.id,
				...doc.data()
			}));
		} catch (err) {
			console.error("Error getting ads:", err);
			return [];
		}
	},
	/**
	* Returns active ads for a specific location, filtered by KST date range and priority.
	*/
	async getActiveAds(location) {
		const ads = await this.getAds();
		const today = getKSTDate();
		return ads.filter((ad) => ad.isActive && ad.location === location && today >= ad.startDate && today <= ad.endDate).sort((a, b) => b.priority - a.priority);
	},
	async addAd(ad) {
		try {
			return (await addDoc(collection(db, COLLECTION_NAME), {
				...ad,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			})).id;
		} catch (err) {
			console.error("Error adding ad:", err);
			throw err;
		}
	},
	async updateAd(id, ad) {
		try {
			await updateDoc(doc(db, COLLECTION_NAME, id), ad);
		} catch (err) {
			console.error("Error updating ad:", err);
			throw err;
		}
	},
	async deleteAd(id) {
		try {
			await deleteDoc(doc(db, COLLECTION_NAME, id));
		} catch (err) {
			console.error("Error deleting ad:", err);
			throw err;
		}
	},
	async logImpression(adId) {
		try {
			await addDoc(collection(db, STATS_COLLECTION), {
				adId,
				type: "impression",
				timestamp: serverTimestamp()
			});
		} catch (err) {
			console.error("Error logging impression:", err);
		}
	},
	async logClick(adId) {
		try {
			await addDoc(collection(db, STATS_COLLECTION), {
				adId,
				type: "click",
				timestamp: serverTimestamp()
			});
		} catch (err) {
			console.error("Error logging click:", err);
		}
	}
};
//#endregion
//#region src/components/common/RollingAdBanner.tsx
var RollingAdBanner = ({ location }) => {
	const [ads, setAds] = (0, import_react.useState)([]);
	const [currentIndex, setCurrentIndex] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let active = true;
		const fetchAds = async () => {
			try {
				const q = query(collection(db, "advertisements"), where("isActive", "==", true), where("location", "==", location));
				const snapshot = await getDocs(q);
				const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
				const data = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data()
				})).filter((ad) => ad.startDate <= today && ad.endDate >= today);
				if (active) setAds(data);
			} catch {
				if (active) setAds([]);
			}
		};
		fetchAds();
		return () => {
			active = false;
		};
	}, [location]);
	(0, import_react.useEffect)(() => {
		if (ads.length <= 1) return;
		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % ads.length);
		}, 5e3);
		return () => clearInterval(interval);
	}, [ads]);
	const ad = ads[currentIndex];
	(0, import_react.useEffect)(() => {
		if (ad) adService.logImpression(ad.id);
	}, [ad]);
	if (ads.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href: ad.url,
		target: "_blank",
		rel: "noopener noreferrer",
		onClick: () => adService.logClick(ad.id),
		className: "block my-4 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center overflow-hidden",
		children: [ad.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: ad.imageUrl,
			alt: ad.name,
			className: "w-full h-auto rounded-lg",
			onError: (e) => {
				e.target.style.display = "none";
			}
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full h-20 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-400",
			children: "이미지 없음"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-bold p-2",
			children: ad.name
		})]
	});
};
//#endregion
//#region src/components/home/HomeMobileDashboard.tsx
var HomeMobileDashboard = () => {
	const { indices, stocks, exchangeRate, watchlist, isWatchlisted, navigateToStock, navigateToIndex, setIsSearchOpen } = useApp();
	const [activeTab, setActiveTab] = (0, import_react.useState)("watchlist");
	const [searchFilter, setSearchFilter] = (0, import_react.useState)("ALL");
	const [query, setQuery] = (0, import_react.useState)("");
	const [searchResults, setSearchResults] = (0, import_react.useState)([]);
	const [isSearching, setIsSearching] = (0, import_react.useState)(false);
	const [searchError, setSearchError] = (0, import_react.useState)(null);
	const [retryNonce, setRetryNonce] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const q = query.trim();
		if (!q) {
			setSearchResults([]);
			setSearchError(null);
			setIsSearching(false);
			return;
		}
		const controller = new AbortController();
		let mounted = true;
		setIsSearching(true);
		setSearchError(null);
		const handler = setTimeout(async () => {
			try {
				const results = await stockRepository.searchStocks({
					query: q,
					limit: 15,
					market: searchFilter,
					signal: controller.signal
				});
				if (mounted && !controller.signal.aborted) setSearchResults(results);
			} catch (err) {
				if (err?.name === "AbortError" || controller.signal.aborted) return;
				console.error("[HomeMobileDashboard] Search API error:", err);
				if (mounted) {
					setSearchError(err?.message || "종목 검색에 실패했습니다.");
					setSearchResults([]);
				}
			} finally {
				if (mounted && !controller.signal.aborted) setIsSearching(false);
			}
		}, 180);
		return () => {
			mounted = false;
			clearTimeout(handler);
			controller.abort();
		};
	}, [
		query,
		searchFilter,
		retryNonce
	]);
	const tabStocks = (0, import_react.useMemo)(() => {
		switch (activeTab) {
			case "watchlist": return stocks.filter((s) => isWatchlisted(s.symbol));
			case "surge": return [...stocks].filter((s) => isSurgeGain(s.changePercent)).sort((a, b) => b.changePercent - a.changePercent);
			case "plunge": return [...stocks].filter((s) => isSurgeLoss(s.changePercent)).sort((a, b) => a.changePercent - b.changePercent);
			case "volume": return [...stocks].filter((s) => isVolumeSurge(s.volumeRatio)).sort((a, b) => (b.volumeRatio || 0) - (a.volumeRatio || 0));
			case "kr": return stocks.filter((s) => s.market === "KOSPI" || s.market === "KOSDAQ");
			case "us": return stocks.filter((s) => s.market === "US" || isUSStockSymbol(s.symbol));
			case "coin": return stocks.filter((s) => s.market === "COIN" || s.symbol.includes("-"));
			default: return stocks;
		}
	}, [
		stocks,
		activeTab,
		isWatchlisted
	]);
	const mobileTabs = [
		"watchlist",
		"surge",
		"plunge",
		"volume",
		"kr",
		"us",
		"coin"
	];
	const [touchStartX, setTouchStartX] = (0, import_react.useState)(null);
	const handleTouchStart = (e) => {
		setTouchStartX(e.touches[0].clientX);
	};
	const handleTouchEnd = (e) => {
		if (touchStartX === null) return;
		const diff = touchStartX - e.changedTouches[0].clientX;
		const idx = mobileTabs.indexOf(activeTab);
		if (diff > 50 && idx < mobileTabs.length - 1) setActiveTab(mobileTabs[idx + 1]);
		else if (diff < -50 && idx > 0) setActiveTab(mobileTabs[idx - 1]);
		setTouchStartX(null);
	};
	const kospi = indices.find((i) => i.symbol === "KOSPI");
	const kosdaq = indices.find((i) => i.symbol === "KOSDAQ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "block md:hidden space-y-4 pb-20 select-none animate-in fade-in duration-150 text-finance-text",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3.5 rounded-2xl bg-finance-card border border-finance-border shadow-xs space-y-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-finance-accent absolute left-3.5 top-3 pointer-events-none" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: query,
								onChange: (e) => setQuery(e.target.value),
								placeholder: "종목명·티커·코드 검색 (삼성전자, NVDA, 비트코인)",
								className: "w-full pl-9 pr-8 py-2 bg-finance-sub-bg border border-finance-border rounded-xl text-xs text-finance-text placeholder:text-finance-sub-text focus:outline-none focus:ring-1 focus:ring-finance-accent"
							}),
							query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setQuery(""),
								className: "absolute right-2.5 top-2 text-finance-sub-text p-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5",
						children: [
							{
								id: "ALL",
								label: "전체"
							},
							{
								id: "KOSPI",
								label: "코스피"
							},
							{
								id: "KOSDAQ",
								label: "코스닥"
							},
							{
								id: "US",
								label: "미국"
							},
							{
								id: "COIN",
								label: "코인"
							}
						].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSearchFilter(f.id),
							className: `px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-colors ${searchFilter === f.id ? "bg-finance-accent text-white shadow-xs" : "bg-finance-sub-bg text-finance-sub-text hover:text-finance-text"}`,
							children: f.label
						}, f.id))
					}),
					query.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-2 border-t border-finance-border max-h-60 overflow-y-auto divide-y divide-finance-border/50",
						children: searchError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-4 text-center space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-rose-500 font-medium",
								children: searchError
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setRetryNonce((n) => n + 1),
								className: "px-3 py-1 rounded-lg bg-rose-500 text-white text-[11px] font-bold inline-flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "다시 시도" })]
							})]
						}) : isSearching && searchResults.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-4 text-center text-xs text-finance-sub-text flex items-center justify-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5 animate-spin text-finance-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "검색 중..." })]
						}) : searchResults.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-4 text-center text-xs text-finance-sub-text",
							children: "일치하는 검색 결과가 없습니다."
						}) : searchResults.map((stock) => {
							const stockCur = inferStockCurrency(stock.symbol, stock.market, stock.currency);
							const isUp = stock.change >= 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => {
									navigateToStock(stock.symbol);
									setQuery("");
								},
								className: "py-2 px-1 flex items-center justify-between cursor-pointer hover:bg-finance-sub-bg/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-xs text-finance-text block",
									children: stock.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] text-finance-sub-text font-mono",
									children: [
										stock.symbol,
										" · ",
										stock.exchange || stock.market,
										" · ",
										stockCur
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold text-xs block text-finance-text tabular-nums",
										children: stock.price > 0 ? formatMoney(stock.price, stockCur) : "시세 확인"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `text-[10px] font-mono font-bold tabular-nums ${isUp ? "text-finance-up" : "text-finance-down"}`,
										children: [
											isUp ? "+" : "",
											stock.changePercent.toFixed(2),
											"%"
										]
									})]
								})]
							}, getStockUniqueKey(stock));
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 overflow-x-auto no-scrollbar py-1",
				children: [
					kospi && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => navigateToIndex("KOSPI"),
						className: "px-3 py-2 rounded-xl bg-finance-card border border-finance-border shadow-2xs shrink-0 cursor-pointer min-w-[120px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-finance-sub-text font-bold",
								children: "코스피"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono font-bold text-xs text-finance-text",
								children: kospi.value.toLocaleString(void 0, {
									minimumFractionDigits: 1,
									maximumFractionDigits: 2
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `text-[10px] font-mono font-bold ${kospi.changePercent >= 0 ? "text-finance-up" : "text-finance-down"}`,
								children: [
									kospi.changePercent >= 0 ? "+" : "",
									kospi.changePercent.toFixed(2),
									"%"
								]
							})
						]
					}),
					kosdaq && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => navigateToIndex("KOSDAQ"),
						className: "px-3 py-2 rounded-xl bg-finance-card border border-finance-border shadow-2xs shrink-0 cursor-pointer min-w-[120px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-finance-sub-text font-bold",
								children: "코스닥"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono font-bold text-xs text-finance-text",
								children: kosdaq.value.toLocaleString(void 0, {
									minimumFractionDigits: 1,
									maximumFractionDigits: 2
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `text-[10px] font-mono font-bold ${kosdaq.changePercent >= 0 ? "text-finance-up" : "text-finance-down"}`,
								children: [
									kosdaq.changePercent >= 0 ? "+" : "",
									kosdaq.changePercent.toFixed(2),
									"%"
								]
							})
						]
					}),
					(() => {
						const fxCheck = validateExchangeRate(exchangeRate);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-3 py-2 rounded-xl bg-finance-card border border-finance-border shadow-2xs shrink-0 min-w-[130px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-1 text-[10px] text-finance-sub-text font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "원/달러 환율" }), !fxCheck.valid && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber-500",
									children: "오류"
								})]
							}), fxCheck.valid && fxCheck.rate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-mono font-bold text-xs text-finance-text",
								children: [fxCheck.rate.toLocaleString(void 0, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								}), "원"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `text-[10px] font-mono font-bold ${(exchangeRate?.changePercent || 0) >= 0 ? "text-finance-up" : "text-finance-down"}`,
								children: [
									(exchangeRate?.changePercent || 0) >= 0 ? "+" : "",
									(exchangeRate?.changePercent || 0).toFixed(2),
									"%"
								]
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-bold text-amber-500 mt-0.5",
								children: fxCheck.status === "stale" ? "지연/만료" : "조회 실패"
							})]
						});
					})()
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-finance-border overflow-x-auto no-scrollbar flex items-center gap-4 px-1",
				children: [
					{
						id: "watchlist",
						label: "관심종목"
					},
					{
						id: "surge",
						label: "급등"
					},
					{
						id: "plunge",
						label: "급락"
					},
					{
						id: "volume",
						label: "거래폭증"
					},
					{
						id: "kr",
						label: "국내"
					},
					{
						id: "us",
						label: "미국"
					},
					{
						id: "coin",
						label: "코인"
					}
				].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActiveTab(t.id),
					className: `py-2 text-xs font-bold shrink-0 relative transition-colors ${activeTab === t.id ? "text-finance-accent" : "text-finance-sub-text hover:text-finance-text"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.label }), activeTab === t.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-finance-accent rounded-full" })]
				}, t.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-finance-card rounded-2xl border border-finance-border shadow-xs divide-y divide-finance-border/50 overflow-hidden touch-pan-y",
				onTouchStart: handleTouchStart,
				onTouchEnd: handleTouchEnd,
				children: tabStocks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-8 text-center space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "w-8 h-8 text-finance-sub-text opacity-40 mx-auto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-finance-sub-text",
						children: activeTab === "watchlist" ? "등록된 관심 종목이 없습니다. 검색창에서 별(★)을 눌러 추가해보세요." : "조건에 해당하는 종목이 없습니다."
					})]
				}) : tabStocks.slice(0, 30).map((stock) => {
					const stockCur = inferStockCurrency(stock.symbol, stock.market, stock.currency);
					const isUp = stock.change >= 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => navigateToStock(stock.symbol),
						className: "p-3.5 flex items-center justify-between cursor-pointer active:bg-finance-sub-bg/50 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0 pr-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-xs truncate text-finance-text",
									children: stock.name
								}), isWatchlisted(stock.symbol) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber-500 text-[10px]",
									title: "관심 등록됨",
									children: "★"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 mt-0.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-finance-sub-text font-mono",
										children: stock.symbol
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[9px] px-1 py-0.2 rounded bg-finance-sub-bg text-finance-sub-text border border-finance-border/50",
										children: [
											stock.exchange || stock.market,
											" · ",
											stockCur
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-finance-sub-text truncate max-w-[90px]",
										children: stock.sector
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono font-bold text-xs block text-finance-text",
								children: formatMoney(stock.price, stockCur)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `text-[11px] font-mono font-bold flex items-center justify-end gap-0.5 ${isUp ? "text-finance-up" : "text-finance-down"}`,
								children: [isUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-3 h-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									isUp ? "+" : "",
									stock.changePercent.toFixed(2),
									"%"
								] })]
							})]
						})]
					}, getStockUniqueKey(stock));
				})
			})
		]
	});
};
//#endregion
//#region src/components/home/HomeView.tsx
var HomeView = () => {
	const { indices, stocks, exchangeRate, marketEvents, watchlist, navigateToStock, navigateToIndex, navigateToPost, setActiveTab, toggleWatchlist, addToWatchlist, isWatchlisted } = useApp();
	const [activeMoverTab, setActiveMoverTab] = (0, import_react.useState)("surge_gain");
	const [liveMonitorEvents, setLiveMonitorEvents] = (0, import_react.useState)([]);
	const [homeSearchQuery, setHomeSearchQuery] = (0, import_react.useState)("");
	const [homeSearchMarketFilter, setHomeSearchMarketFilter] = (0, import_react.useState)("ALL");
	const [homeSearchResults, setHomeSearchResults] = (0, import_react.useState)([]);
	const [isSearchingHome, setIsSearchingHome] = (0, import_react.useState)(false);
	const [homeSearchError, setHomeSearchError] = (0, import_react.useState)(null);
	const [retryHomeSearchNonce, setRetryHomeSearchNonce] = (0, import_react.useState)(0);
	const [selectedMarketEvent, setSelectedMarketEvent] = (0, import_react.useState)(null);
	const [isMarketEventModalOpen, setIsMarketEventModalOpen] = (0, import_react.useState)(false);
	const [marketCategory, setMarketCategory] = (0, import_react.useState)("domestic");
	const [globalSummary, setGlobalSummary] = (0, import_react.useState)(null);
	const [isGlobalLoading, setIsGlobalLoading] = (0, import_react.useState)(false);
	const [globalError, setGlobalError] = (0, import_react.useState)(null);
	const [globalLastFetched, setGlobalLastFetched] = (0, import_react.useState)("");
	const fetchGlobalMarket = async (force = false) => {
		setIsGlobalLoading(true);
		setGlobalError(null);
		try {
			const data = await globalMarketClient.getSummary(force);
			setGlobalSummary(data);
			setGlobalLastFetched(data.fetchedAt);
		} catch (err) {
			console.warn("[HomeView] Global market fetch error:", err);
			setGlobalError(err.message || "글로벌 시장 요약 데이터를 불러오지 못했습니다.");
		} finally {
			setIsGlobalLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchGlobalMarket();
		const interval = setInterval(() => {
			fetchGlobalMarket();
		}, 6e4);
		return () => clearInterval(interval);
	}, []);
	const [marketNewsCategory, setMarketNewsCategory] = (0, import_react.useState)("all");
	const [marketNewsList, setMarketNewsList] = (0, import_react.useState)([]);
	const [isNewsLoading, setIsNewsLoading] = (0, import_react.useState)(true);
	const [newsError, setNewsError] = (0, import_react.useState)(null);
	const [newsLastFetched, setNewsLastFetched] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	const fetchHomeNews = async (cat = marketNewsCategory) => {
		setIsNewsLoading(true);
		setNewsError(null);
		try {
			const res = await newsService.getMarketNews(cat, 1, 6);
			setMarketNewsList(res.items);
			setNewsLastFetched(/* @__PURE__ */ new Date());
		} catch (err) {
			console.warn("[HomeView] News fetch error:", err);
			setNewsError(err.message || "뉴스 데이터를 불러오지 못했습니다.");
		} finally {
			setIsNewsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchHomeNews(marketNewsCategory);
	}, [marketNewsCategory]);
	(0, import_react.useEffect)(() => {
		const q = homeSearchQuery.trim();
		if (!q) {
			setHomeSearchResults([]);
			setHomeSearchError(null);
			setIsSearchingHome(false);
			return;
		}
		const controller = new AbortController();
		let isSubscribed = true;
		setIsSearchingHome(true);
		setHomeSearchError(null);
		const timer = setTimeout(() => {
			stockRepository.searchStocks({
				query: q,
				market: homeSearchMarketFilter,
				limit: 15,
				signal: controller.signal
			}).then((results) => {
				if (isSubscribed && !controller.signal.aborted) {
					setHomeSearchResults(results);
					setIsSearchingHome(false);
				}
			}).catch((err) => {
				if (err?.name === "AbortError" || controller.signal.aborted) return;
				console.warn("[HomeView] search error:", err);
				if (isSubscribed) {
					setHomeSearchError(err?.message || "종목 검색에 실패했습니다.");
					setHomeSearchResults([]);
					setIsSearchingHome(false);
				}
			});
		}, 150);
		return () => {
			isSubscribed = false;
			clearTimeout(timer);
			controller.abort();
		};
	}, [
		homeSearchQuery,
		homeSearchMarketFilter,
		retryHomeSearchNonce
	]);
	(0, import_react.useEffect)(() => {
		marketMonitorClient.getEvents().then((res) => setLiveMonitorEvents(res)).catch(() => {});
		const interval = setInterval(() => {
			marketMonitorClient.getEvents().then((res) => setLiveMonitorEvents(res)).catch(() => {});
		}, 3e4);
		return () => clearInterval(interval);
	}, []);
	const kospi = indices.find((i) => i.symbol === "KOSPI") || indices[0];
	const kosdaq = indices.find((i) => i.symbol === "KOSDAQ") || indices[1];
	const totalTradingValue = (kospi.tradingValue + kosdaq.tradingValue).toFixed(2);
	const totalAdvanceCount = kospi.advanceCount + kosdaq.advanceCount;
	const totalDeclineCount = kospi.declineCount + kosdaq.declineCount;
	const [surgeGainers, surgeLosers, volumeSurge, popularStocks] = (0, import_react.useMemo)(() => {
		const surgeGainersStrict = [...stocks].filter((s) => isSurgeGain(s.changePercent)).sort((a, b) => b.changePercent - a.changePercent);
		const gainers = surgeGainersStrict.length > 0 ? surgeGainersStrict.slice(0, 5) : [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
		const surgeLosersStrict = [...stocks].filter((s) => isSurgeLoss(s.changePercent)).sort((a, b) => a.changePercent - b.changePercent);
		const losers = surgeLosersStrict.length > 0 ? surgeLosersStrict.slice(0, 5) : [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
		const volumeSurgeStrict = [...stocks].filter((s) => isVolumeSurge(s.volumeRatio)).sort((a, b) => b.volumeRatio - a.volumeRatio);
		return [
			gainers,
			losers,
			volumeSurgeStrict.length > 0 ? volumeSurgeStrict.slice(0, 5) : [...stocks].sort((a, b) => b.volumeRatio - a.volumeRatio).slice(0, 5),
			[...stocks].sort((a, b) => b.tradingValue - a.tradingValue).slice(0, 5)
		];
	}, [stocks]);
	const watchlistStocks = dedupeByKey(stocks.filter((s) => watchlist.includes(s.symbol)), (s) => s.symbol);
	const activeEvents = dedupeById(marketEvents.filter((e) => e.active));
	const sidecarEvents = (0, import_react.useMemo)(() => {
		const nowMs = Date.now();
		return dedupeById(marketEvents).filter((e) => {
			if (e.type !== "sidecar") return false;
			const triggerTime = new Date(e.triggerDateTime?.replace(" KST", "") || e.timestamp).getTime();
			if (triggerTime && triggerTime > nowMs) return false;
			return true;
		}).sort((a, b) => {
			const timeA = new Date(a.triggerDateTime?.replace(" KST", "") || a.timestamp).getTime() || 0;
			return (new Date(b.triggerDateTime?.replace(" KST", "") || b.timestamp).getTime() || 0) - timeA;
		});
	}, [marketEvents]);
	const communityPosts = dedupeById(storageService.getPosts()).slice(0, 5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-24 animate-in fade-in duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeMobileDashboard, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden md:block space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: homeSearchMarketFilter === "KOSPI" ? "코스피(KOSPI) 실시간 검색" : homeSearchMarketFilter === "KOSDAQ" ? "코스닥(KOSDAQ) 실시간 검색" : homeSearchMarketFilter === "US" ? "미국 주식 실시간 검색" : homeSearchMarketFilter === "COIN" ? "가상자산 실시간 검색" : "코스피 · 코스닥 · 미국 · 가상자산 통합 검색" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 font-mono",
										children: "LIVE"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
									children: homeSearchMarketFilter === "KOSPI" ? "코스피(KOSPI) 상장 보통주, 우선주, ETF, 종목코드, 초성을 실시간 탐색하세요." : homeSearchMarketFilter === "KOSDAQ" ? "코스닥(KOSDAQ) 성장주, 보통주, ETF, 종목코드, 초성을 실시간 탐색하세요." : homeSearchMarketFilter === "US" ? "NASDAQ · NYSE · AMEX 대표 보통주, 레버리지 ETF, ADR을 실시간 탐색하세요." : homeSearchMarketFilter === "COIN" ? "업비트(Upbit) · 바이낸스(Binance) 공식 거래소 전체 현물 마켓을 탐색하세요." : "코스피 · 코스닥 · 미국 주식 · 가상자산 현물 마켓을 한 번에 통합 탐색하세요."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto overflow-x-auto",
									children: [
										{
											id: "ALL",
											label: "전체",
											activeClass: "bg-rose-500 text-white font-bold shadow-xs"
										},
										{
											id: "KOSPI",
											label: "코스피",
											activeClass: "bg-indigo-600 text-white font-bold shadow-xs"
										},
										{
											id: "KOSDAQ",
											label: "코스닥",
											activeClass: "bg-emerald-600 text-white font-bold shadow-xs"
										},
										{
											id: "US",
											label: "미국",
											activeClass: "bg-purple-600 text-white font-bold shadow-xs"
										},
										{
											id: "COIN",
											label: "코인",
											activeClass: "bg-amber-600 text-white font-bold shadow-xs"
										}
									].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setHomeSearchMarketFilter(tab.id),
										className: `px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${homeSearchMarketFilter === tab.id ? tab.activeClass : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
										children: tab.label
									}, tab.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative flex items-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-5 h-5 text-rose-500 absolute left-4 pointer-events-none" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												value: homeSearchQuery,
												onChange: (e) => setHomeSearchQuery(e.target.value),
												placeholder: homeSearchMarketFilter === "KOSPI" ? "코스피 종목명, 영문명, 코드, 초성 검색 (예: 삼성전자, Samsung, 005930, ㅅㅅ)" : homeSearchMarketFilter === "KOSDAQ" ? "코스닥 종목명, 영문명, 코드, 초성 검색 (예: 에코프로, 알테오젠, 086520)" : homeSearchMarketFilter === "US" ? "미국 티커, 기업명, 한글명 검색 (예: NVDA, Apple, BRK.B, 엔비디아)" : homeSearchMarketFilter === "COIN" ? "코인명, 심볼, 마켓페어 검색 (예: 비트코인, KRW-BTC, BTCUSDT, ETH)" : "종목명, 영문명, 티커, 코드, 코인, 초성 검색 (예: 삼성전자, NVDA, 비트코인, ㅅㅅ)",
												className: "w-full pl-11 pr-14 py-3 sm:py-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 font-medium focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "absolute right-3.5 flex items-center gap-1.5",
												children: [isSearchingHome && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 text-rose-500 animate-spin" }), homeSearchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => setHomeSearchQuery(""),
													className: "p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer",
													title: "검색어 지우기",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RollingAdBanner, { location: "top_banner" }),
									homeSearchQuery.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl z-30 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in zoom-in-95 duration-100 max-h-80 overflow-y-auto",
										children: homeSearchError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-5 text-center space-y-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs font-semibold text-rose-500",
												children: homeSearchError
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setRetryHomeSearchNonce((n) => n + 1),
												className: "px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "다시 시도" })]
											})]
										}) : isSearchingHome && homeSearchResults.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 text-rose-500 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "종목을 검색하고 있습니다..." })]
										}) : homeSearchResults.length > 0 ? homeSearchResults.map((s) => {
											const registered = isWatchlisted(s.symbol);
											const rowCurrency = inferStockCurrency(s.symbol, s.market, s.currency);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												onClick: () => {
													navigateToStock(s.symbol);
													setHomeSearchQuery("");
												},
												className: "w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-colors cursor-pointer group gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3 min-w-0 pr-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `font-mono text-xs font-bold px-2 py-0.5 rounded shrink-0 ${s.market === "US" ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20" : s.market === "COIN" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`,
														children: s.symbol
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "truncate",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-2",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors",
																	children: s.name
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: `text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${s.market === "US" ? "bg-purple-500/10 text-purple-500 border border-purple-500/20" : s.market === "COIN" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : s.market === "KOSPI" ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"}`,
																	children: [
																		s.market === "US" ? s.exchange || "US" : s.market === "COIN" ? s.exchange || "COIN" : s.market,
																		" · ",
																		rowCurrency
																	]
																}),
																s.productType === "ETF" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-[9px] font-bold px-1 py-0.2 rounded border bg-amber-500/10 text-amber-500 border-amber-500/20",
																	children: "ETF"
																})
															]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "text-xs text-slate-400 truncate mt-0.5",
															children: [
																s.sector || (s.market === "US" ? "미국 상장 종목" : s.market === "COIN" ? "가상자산 현물" : "국내 상장 종목"),
																s.tradingPair && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "ml-1.5 font-mono text-[10px] text-cyan-500 font-semibold",
																	children: [
																		"[",
																		s.tradingPair,
																		"]"
																	]
																}),
																s.nameEn && s.nameEn !== s.name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "ml-1.5 text-slate-400 font-mono text-[11px]",
																	children: [
																		"(",
																		s.nameEn,
																		")"
																	]
																})
															]
														})]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-right flex items-center gap-3 shrink-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-mono font-bold text-sm text-slate-900 dark:text-white tabular-nums",
														children: s.price > 0 ? formatMoney(s.price, rowCurrency) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs text-slate-400 font-normal",
															children: "시세 확인"
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceBadge, {
														change: s.change,
														changePercent: s.changePercent,
														currency: rowCurrency,
														size: "sm"
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: (e) => {
															e.stopPropagation();
															if (registered) toggleWatchlist(s.symbol);
															else addToWatchlist(s.symbol, s);
														},
														className: `px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${registered ? "bg-slate-100 dark:bg-slate-800 text-emerald-500 border border-emerald-500/30" : "bg-rose-500 hover:bg-rose-600 text-white shadow-xs active:scale-95"}`,
														children: registered ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✓ 등록됨" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "+ 관심 등록" })
													})]
												})]
											}, getStockUniqueKey(s));
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-6 text-center text-xs text-slate-400 space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												"일치하는 검색 결과가 없습니다: '",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-rose-500 font-bold",
													children: homeSearchQuery
												}),
												"'"
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[11px] text-slate-400",
												children: "검색 팁: 삼성전자, NVDA, Apple, 005930, 에코프로, KRW-BTC, 초성(ㅅㅅ, ㅂㅌㅋㅇ)"
											})]
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mt-3 overflow-x-auto scrollbar-none pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-semibold text-slate-400 shrink-0 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5 text-amber-500" }), "인기 검색:"]
								}), [
									{
										name: "삼성전자",
										symbol: "005930"
									},
									{
										name: "엔비디아",
										symbol: "NVDA"
									},
									{
										name: "SK하이닉스",
										symbol: "000660"
									},
									{
										name: "애플",
										symbol: "AAPL"
									},
									{
										name: "테슬라",
										symbol: "TSLA"
									},
									{
										name: "SOXL",
										symbol: "SOXL"
									},
									{
										name: "현대차",
										symbol: "005380"
									},
									{
										name: "QQQ",
										symbol: "QQQ"
									},
									{
										name: "알테오젠",
										symbol: "196170"
									},
									{
										name: "SPY",
										symbol: "SPY"
									}
								].map((kw) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => navigateToStock(kw.symbol),
									className: "px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors shrink-0 cursor-pointer",
									children: kw.name
								}, kw.symbol))]
							})
						]
					}),
					activeEvents.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: activeEvents.map((evt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => {
								setSelectedMarketEvent(evt);
								setIsMarketEventModalOpen(true);
							},
							className: `p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors cursor-pointer hover:shadow-xs ${evt.severity === "urgent" ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-500/50" : evt.severity === "warning" ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-500/40" : "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-500/40"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `p-2 rounded-lg shrink-0 ${evt.severity === "urgent" ? "bg-rose-600 text-white animate-pulse" : "bg-amber-500 dark:bg-amber-600 text-white"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctagonAlert, { className: "w-4 h-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 flex-wrap text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `font-bold uppercase tracking-tight ${evt.severity === "urgent" ? "text-rose-600 dark:text-rose-400" : evt.severity === "warning" ? "text-amber-700 dark:text-amber-400" : "text-blue-600 dark:text-blue-400"}`,
												children: evt.type === "sidecar" ? "시장 조치 (사이드카 발동)" : evt.type === "circuit_breaker" ? "서킷브레이커 (매매정지)" : "시장 주요 이벤트"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-slate-500 dark:text-slate-400 font-mono",
												children: [
													"[",
													evt.timestamp,
													"]"
												]
											}),
											evt.symbol && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-semibold text-amber-700 dark:text-amber-300",
												children: [
													evt.symbolName,
													" (",
													evt.symbol,
													")"
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-bold text-sm text-slate-900 dark:text-white mt-0.5",
										children: evt.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-700 dark:text-slate-300 line-clamp-1 mt-0.5",
										children: evt.description
									})
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: (e) => {
									e.stopPropagation();
									setSelectedMarketEvent(evt);
									setIsMarketEventModalOpen(true);
								},
								className: "self-end sm:self-center shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900/5 hover:bg-slate-900/10 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-slate-200/60 dark:border-white/10 transition-colors flex items-center gap-1 cursor-pointer",
								"aria-label": `${evt.title} 상세 확인`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "상세 확인" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5" })]
							})]
						}, evt.id))
					}),
					sidecarEvents.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"aria-label": "사이드카 주요 이벤트 카드",
						className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-4 h-4 text-amber-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm sm:text-base font-black text-slate-900 dark:text-white",
									children: "한국거래소(KRX) 코스피·코스닥 사이드카 주요 이벤트"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
								children: "선물 프로그램 매매호가 효력정지(Sidecar) 공식 발동 기록 대조 (최근순 정렬)"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 flex-wrap text-[11px] font-mono",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold",
									children: "현재 장중: 미발동 (정상 거래 중)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
									children: "마지막 확인: 2026.10.11 18:40 KST"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-3",
							children: sidecarEvents.map((evt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => {
									setSelectedMarketEvent(evt);
									setIsMarketEventModalOpen(true);
								},
								className: "p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between gap-3 group hover:shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2 flex-wrap",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5 flex-wrap",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "px-2 py-0.5 text-[10px] font-black rounded font-mono bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200",
														children: evt.market
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `px-2 py-0.5 text-[10px] font-bold rounded font-mono ${evt.sidecarType === "BUY" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20" : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"}`,
														children: evt.sidecarType === "BUY" ? "매수 사이드카 (BUY)" : "매도 사이드카 (SELL)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "px-1.5 py-0.5 text-[10px] rounded text-slate-500 dark:text-slate-400 font-sans",
														children: evt.active ? "실시간 발동 중" : "과거 공식 기록"
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] font-mono text-slate-500 dark:text-slate-400",
												children: evt.triggerDateTime || evt.timestamp
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors",
											children: evt.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed",
											children: evt.description
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 text-slate-400 font-mono",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-3.5 h-3.5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "출처: KRX (data.krx.co.kr)" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: (e) => {
											e.stopPropagation();
											setSelectedMarketEvent(evt);
											setIsMarketEventModalOpen(true);
										},
										className: "px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "상세 확인" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5" })]
									})]
								})]
							}, evt.id))
						})]
					}),
					liveMonitorEvents.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						"aria-label": "실시간 시장 모니터링 레이더",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-5 h-5 animate-pulse" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "병돌 인베스트먼트 시장 모니터링 레이더" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30",
											children: [
												"실시간 ",
												liveMonitorEvents.length,
												"건 감지"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 truncate mt-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-rose-500 shrink-0",
												children: liveMonitorEvents[0].title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-400",
												children: "·"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate text-slate-500 dark:text-slate-400",
												children: liveMonitorEvents[0].description
											})
										]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveTab("insight"),
								className: "self-end md:self-center shrink-0 px-3.5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-colors flex items-center gap-1 cursor-pointer shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "모니터링 상황판" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5" })]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						"aria-label": "글로벌 및 국내 시장 핵심 지표 현황",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col tablet-p:flex-col tablet-l:flex-row sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 tablet:p-4.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "p-2 tablet:p-2.5 rounded-xl bg-rose-500/10 text-rose-500 shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-4 h-4 tablet:w-4.5 tablet:h-4.5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 flex-wrap",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
													className: "text-sm sm:text-base tablet:text-[17px] font-black text-slate-900 dark:text-white tracking-tight",
													children: "시장 종합 현황"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `text-[10px] tablet:text-[11px] font-bold px-2 tablet:px-2.5 py-0.5 rounded-full font-mono shrink-0 whitespace-nowrap ${marketCategory === "domestic" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20" : marketCategory === "crypto" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : marketCategory === "rates" || marketCategory === "macro" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20" : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"}`,
													children: marketCategory === "domestic" ? "KRX 실시간" : marketCategory === "crypto" ? "실시간 호가 (Upbit)" : marketCategory === "rates" ? "중앙은행 공식 고시" : marketCategory === "macro" ? "세계은행/재무부 공식 통계" : "15~20분 지연 시세"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] tablet:text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 leading-normal",
												children: "한국·글로벌 주식, 가상자산, 원자재, 환율, 금리 및 거시경제 지표 통합 현황"
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 max-w-full overflow-hidden",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 overflow-x-auto scrollbar-none text-xs tablet:text-[13px] font-semibold max-w-full",
											children: [
												{
													key: "domestic",
													label: "국내 (KOR)"
												},
												{
													key: "us",
													label: "미국 (USA)"
												},
												{
													key: "asia",
													label: "아시아 (Asia)"
												},
												{
													key: "europe",
													label: "유럽 (Europe)"
												},
												{
													key: "crypto",
													label: "가상자산 (Crypto)"
												},
												{
													key: "commodity",
													label: "원자재 (Commodity)"
												},
												{
													key: "forex",
													label: "환율 (Forex)"
												},
												{
													key: "rates",
													label: "금리/채권 (Rates)"
												},
												{
													key: "macro",
													label: "거시경제 (Macro)"
												}
											].map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setMarketCategory(cat.key),
												className: `px-2.5 tablet:px-3 py-1.5 tablet:py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${marketCategory === cat.key ? "bg-white dark:bg-[#131722] text-rose-600 dark:text-rose-400 font-bold shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
												children: cat.label
											}, cat.key))
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => {
												if (marketCategory !== "domestic") fetchGlobalMarket(true);
											},
											disabled: isGlobalLoading,
											title: "데이터 새로고침",
											className: "p-2 tablet:p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3.5 h-3.5 tablet:w-4 tablet:h-4 ${isGlobalLoading ? "animate-spin text-rose-500" : ""}` })
										})]
									})]
								}),
								marketCategory === "domestic" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 md:grid-cols-3 tablet-p:grid-cols-3 tablet-l:grid-cols-6 lg:grid-cols-6 divide-y md:divide-y-0 lg:divide-x tablet-l:divide-x divide-slate-100 dark:divide-slate-800",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											onClick: () => navigateToIndex("KOSPI"),
											role: "button",
											tabIndex: 0,
											onKeyDown: (e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													navigateToIndex("KOSPI");
												}
											},
											className: "p-4 sm:p-5 tablet:p-4.5 flex flex-col justify-between cursor-pointer group hover:bg-slate-50/90 dark:hover:bg-slate-800/50 transition-all select-none relative",
											title: "코스피 상세 지수 차트 보기",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs tablet:text-[14px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors whitespace-nowrap",
															children: "코스피"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] tablet:text-[11px] font-mono px-1 py-0.2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold tabular-nums",
															children: "KOSPI"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-0.5 text-[11px] tablet:text-[12px] font-bold text-rose-500 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "차트" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" })]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-2 tablet:mt-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-2xl sm:text-[26px] tablet:text-[21px] font-black font-mono tracking-tight text-slate-900 dark:text-white leading-tight group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors tabular-nums whitespace-nowrap",
														children: kospi.value.toLocaleString(void 0, {
															minimumFractionDigits: 2,
															maximumFractionDigits: 2
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-1 tablet:mt-1.5",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceBadge, {
															change: kospi.change,
															changePercent: kospi.changePercent,
															size: "sm"
														})
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] tablet:text-[11.5px] text-slate-400 font-mono tabular-nums whitespace-nowrap",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														"고 ",
														kospi.high,
														" / 저 ",
														kospi.low
													] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] tablet:text-[11px] text-slate-400",
														children: kospi.lastUpdated ? kospi.lastUpdated.split(" ").slice(-1)[0] : "실시간"
													})]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											onClick: () => navigateToIndex("KOSDAQ"),
											role: "button",
											tabIndex: 0,
											onKeyDown: (e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													navigateToIndex("KOSDAQ");
												}
											},
											className: "p-4 sm:p-5 tablet:p-4.5 flex flex-col justify-between cursor-pointer group hover:bg-slate-50/90 dark:hover:bg-slate-800/50 transition-all select-none relative",
											title: "코스닥 상세 지수 차트 보기",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs tablet:text-[14px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors whitespace-nowrap",
															children: "코스닥"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] tablet:text-[11px] font-mono px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold tabular-nums",
															children: "KOSDAQ"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-0.5 text-[11px] tablet:text-[12px] font-bold text-rose-500 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "차트" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" })]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-2 tablet:mt-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-2xl sm:text-[26px] tablet:text-[21px] font-black font-mono tracking-tight text-slate-900 dark:text-white leading-tight group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors tabular-nums whitespace-nowrap",
														children: kosdaq.value.toLocaleString(void 0, {
															minimumFractionDigits: 2,
															maximumFractionDigits: 2
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-1 tablet:mt-1.5",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceBadge, {
															change: kosdaq.change,
															changePercent: kosdaq.changePercent,
															size: "sm"
														})
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] tablet:text-[11.5px] text-slate-400 font-mono tabular-nums whitespace-nowrap",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														"고 ",
														kosdaq.high,
														" / 저 ",
														kosdaq.low
													] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] tablet:text-[11px] text-slate-400",
														children: kosdaq.lastUpdated ? kosdaq.lastUpdated.split(" ").slice(-1)[0] : "실시간"
													})]
												})
											]
										}),
										(() => {
											const fxCheck = validateExchangeRate(exchangeRate);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-4 sm:p-5 tablet:p-4.5 flex flex-col justify-between",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs tablet:text-[14px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap",
															children: "원/달러 환율"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: `text-[10px] tablet:text-[11px] font-mono px-1.5 py-0.2 rounded ${fxCheck.valid ? "bg-slate-100 dark:bg-slate-800 text-slate-500" : "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold"}`,
															children: fxCheck.valid ? "USD/KRW" : fxCheck.status === "stale" ? "지연/만료" : "조회 오류"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-2 tablet:mt-2.5",
														children: fxCheck.valid && fxCheck.rate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "text-2xl sm:text-[26px] tablet:text-[21px] font-black font-mono tracking-tight text-slate-900 dark:text-white leading-tight tabular-nums whitespace-nowrap",
															children: [fxCheck.rate.toFixed(2), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-xs tablet:text-[12px] font-normal text-slate-400 ml-1",
																children: "원"
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "mt-1 tablet:mt-1.5",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceBadge, {
																change: exchangeRate.change,
																changePercent: exchangeRate.changePercent,
																size: "sm"
															})
														})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-xs font-semibold text-amber-600 dark:text-amber-400 py-2",
															children: fxCheck.reason || "실시간 환율 수신 실패"
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] tablet:text-[11.5px] text-slate-400 font-mono tabular-nums whitespace-nowrap",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
															"고 ",
															exchangeRate?.high || "-",
															" / 저 ",
															exchangeRate?.low || "-"
														] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px]",
															children: fxCheck.lastUpdated
														})]
													})
												]
											});
										})(),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-4 sm:p-5 tablet:p-4.5 flex flex-col justify-between",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs tablet:text-[14px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap",
														children: "총 거래대금"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] tablet:text-[11px] font-mono px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500",
														children: "KRX"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-2 tablet:mt-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-2xl sm:text-[26px] tablet:text-[21px] font-black font-mono tracking-tight text-slate-900 dark:text-white leading-tight tabular-nums whitespace-nowrap",
														children: [totalTradingValue, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs tablet:text-[12px] font-bold text-slate-500 dark:text-slate-400 ml-1",
															children: "조 원"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-xs tablet:text-[12px] font-medium text-slate-500 dark:text-slate-400 mt-1 whitespace-nowrap",
														children: "유동성 풍부 국면"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] tablet:text-[11.5px] text-slate-400 font-mono tabular-nums whitespace-nowrap",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														"코스피 ",
														kospi.tradingValue,
														"조"
													] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														"코스닥 ",
														kosdaq.tradingValue,
														"조"
													] })]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-4 sm:p-5 tablet:p-4.5 flex flex-col justify-between",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs tablet:text-[14px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap",
														children: "상승 종목 수"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs tablet:text-[12px] font-mono font-bold text-rose-500",
														children: "▲ ADV"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-2 tablet:mt-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-2xl sm:text-[26px] tablet:text-[21px] font-black font-mono tracking-tight text-rose-500 leading-tight tabular-nums whitespace-nowrap",
														children: [totalAdvanceCount.toLocaleString(), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs tablet:text-[12px] font-medium text-slate-400 ml-1",
															children: "종목"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-xs tablet:text-[11.5px] font-medium text-rose-500/80 mt-1 tabular-nums whitespace-nowrap",
														children: [
															"코스피 ",
															kospi.advanceCount,
															" / 코스닥 ",
															kosdaq.advanceCount
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "h-full bg-rose-500",
															style: { width: `${totalAdvanceCount / (totalAdvanceCount + totalDeclineCount) * 100}%` }
														})
													})
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-4 sm:p-5 tablet:p-4.5 flex flex-col justify-between",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs tablet:text-[14px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap",
														children: "하락 종목 수"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs tablet:text-[12px] font-mono font-bold text-blue-500",
														children: "▼ DEC"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-2 tablet:mt-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-2xl sm:text-[26px] tablet:text-[21px] font-black font-mono tracking-tight text-blue-500 leading-tight tabular-nums whitespace-nowrap",
														children: [totalDeclineCount.toLocaleString(), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs tablet:text-[12px] font-medium text-slate-400 ml-1",
															children: "종목"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-xs tablet:text-[11.5px] font-medium text-blue-500/80 mt-1 tabular-nums whitespace-nowrap",
														children: [
															"코스피 ",
															kospi.declineCount,
															" / 코스닥 ",
															kosdaq.declineCount
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "h-full bg-blue-500",
															style: { width: `${totalDeclineCount / (totalAdvanceCount + totalDeclineCount) * 100}%` }
														})
													})
												})
											]
										})
									]
								}),
								marketCategory !== "domestic" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: globalError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-8 text-center space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-7 h-7 text-rose-500 mx-auto" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-slate-700 dark:text-slate-300 font-medium",
											children: globalError
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-400",
											children: "데이터 제공처 일시 지연 또는 네트워크 응답 대기 상태입니다."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => fetchGlobalMarket(true),
											className: "mt-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer transition-colors",
											children: "새로고침"
										})
									]
								}) : isGlobalLoading && !globalSummary ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-12 text-center space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-6 h-6 text-rose-500 animate-spin mx-auto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-400",
										children: "글로벌 시장 데이터(15~20분 지연 공시 시세)를 불러오는 중입니다..."
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 tablet-p:grid-cols-2 tablet-l:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4 p-4 sm:p-5 tablet:p-4",
									children: (globalSummary?.groups?.[marketCategory] || []).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 rounded-xl border border-slate-100 dark:border-slate-800/90 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-200 dark:hover:border-slate-700/80 transition-all flex flex-col justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-bold text-xs sm:text-sm tablet:text-[15px] text-slate-900 dark:text-white truncate whitespace-nowrap",
													children: item.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 mt-0.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-[10px] tablet:text-[12px] font-bold px-1.5 py-0.2 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 tabular-nums",
														children: item.symbol
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] tablet:text-[11.5px] text-slate-400",
														children: item.currency
													})]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1 shrink-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `text-[10px] tablet:text-[11px] font-bold px-1.5 tablet:px-2 py-0.5 rounded whitespace-nowrap ${item.delayStatus === "realtime" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : item.delayStatus === "official_notice" || item.delayStatus === "annual" || item.delayStatus === "monthly" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20" : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"}`,
													children: item.delayLabel
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													title: isWatchlisted(item.symbol) ? "관심종목 등록됨" : "관심종목 추가",
													onClick: (e) => {
														e.stopPropagation();
														if (isWatchlisted(item.symbol)) toggleWatchlist(item.symbol);
														else addToWatchlist(item.symbol, {
															name: item.name,
															price: item.value,
															change: item.change,
															changePercent: item.changePercent,
															market: item.category === "rates" ? "INDEX" : item.category === "forex" ? "KR" : item.category === "crypto" ? "COIN" : "US",
															currency: item.currency === "KRW" ? "KRW" : "USD"
														});
													},
													className: `p-1 tablet:p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer ${isWatchlisted(item.symbol) ? "text-amber-500" : "text-slate-400 hover:text-rose-500"}`,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, {
														className: "w-3.5 h-3.5 tablet:w-4 tablet:h-4",
														fill: isWatchlisted(item.symbol) ? "currentColor" : "none"
													})
												})]
											})]
										}), item.status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "my-4 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 flex items-center gap-2 text-xs tablet:text-[13px] text-amber-700 dark:text-amber-300",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.errorMessage || "해당 데이터 일시 지연 상태" })]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 tablet:mt-3.5 flex flex-col justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-baseline justify-between gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xl sm:text-2xl tablet:text-[21px] font-black font-mono tracking-tight text-slate-900 dark:text-white leading-tight tabular-nums whitespace-nowrap",
													children: item.displayValue ? item.displayValue : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [item.value.toLocaleString(void 0, {
														minimumFractionDigits: item.category === "rates" ? 3 : 2,
														maximumFractionDigits: item.category === "rates" ? 3 : 2
													}), item.unit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs tablet:text-[12px] font-normal text-slate-400 ml-1",
														children: item.unit
													})] })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-1.5 flex items-center gap-1.5",
													children: item.change === 0 && (item.category === "rates" || item.category === "macro") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[11px] tablet:text-[12px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono",
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
														width: 76,
														height: 28
													})
												})]
											}), item.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] tablet:text-[12px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-1 bg-slate-100/60 dark:bg-slate-800/50 px-2 py-1 rounded",
												children: item.notes
											})]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-[10px] tablet:text-[11px] text-slate-400 gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												title: item.provider,
												children: item.provider
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono shrink-0 tabular-nums",
												children: item.marketTime ? item.marketTime.replace(" (KST)", "") : item.lastUpdated ? item.lastUpdated.replace(" (KST)", "") : ""
											})]
										})]
									}, item.id))
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "px-4 tablet:px-5 py-2.5 tablet:py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px] tablet:text-[12px] text-slate-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-3.5 h-3.5 tablet:w-4 tablet:h-4 text-slate-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "truncate",
											children: [
												marketCategory === "domestic" && "국내 데이터: KRX 한국거래소 · 키움 Open API 및 야후 파이낸스 실시간/준실시간 연동",
												marketCategory === "crypto" && "가상자산 데이터: 업비트(Upbit) 공개 호가창 API 및 바이낸스(Binance) 공개 시세 (실시간)",
												marketCategory === "commodity" && "원자재 데이터: COMEX / NYMEX / ICE 국제 원자재 선물 공개 지연 시세 (15분 지연)",
												marketCategory === "macro" && "거시경제 데이터: 세계은행(World Bank) Open Data (CC-BY 4.0) & 미국 재무부(U.S. Treasury) 공식 재정 통계",
												marketCategory === "forex" && "환율 데이터: 유럽중앙은행(Frankfurter ECB) 공식 기준환율 및 FX 오픈 데이터",
												marketCategory === "rates" && "금리/채권 데이터: 한국은행(BOK) · 미국 연준(FOMC) 공식 기준금리 및 CBOE 국채수익률",
												[
													"us",
													"asia",
													"europe"
												].includes(marketCategory) && "해외 증시 데이터: 각국 주요 거래소(S&P, 나스닥, 도쿄, 상하이, 홍콩, 독일, 유로스톡스) 15~20분 지연 공시 시세"
											]
										})]
									}), globalLastFetched && marketCategory !== "domestic" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-mono text-[10px] tablet:text-[11px] text-slate-400 shrink-0",
										children: ["조회 시각: ", globalLastFetched]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-2 shrink-0 font-mono text-[10px] tablet:text-[11px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "실시간 수신" })
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdSlot, {
						slotId: "home-summary-ad",
						format: "auto"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketSentimentCard, {
						onNavigateToStock: navigateToStock,
						onNavigateToChat: () => setActiveTab("chat"),
						onNavigateToCommunity: () => setActiveTab("community")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"aria-label": "시장 히트맵",
						className: "hidden md:block bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-4 h-4 text-indigo-500" }), "시장 히트맵 (국내 시장)"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketHeatmap, {})]
					}),
					watchlistStocks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						"aria-label": "내 관심종목 빠른 현황",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "w-4 h-4 text-amber-500 fill-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-bold text-slate-800 dark:text-slate-200",
										children: [
											"내 관심종목 (",
											watchlistStocks.length,
											")"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-4 overflow-x-auto scrollbar-none py-0.5",
									children: watchlistStocks.map((stock) => {
										const isUp = stock.change >= 0;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => navigateToStock(stock.symbol),
											className: "flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800/70 px-2 py-1 rounded-lg transition-colors shrink-0 text-left",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-bold text-slate-900 dark:text-white",
													children: stock.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-mono font-bold text-slate-800 dark:text-slate-200",
													children: formatMoney(stock.price, inferStockCurrency(stock.symbol, stock.market, stock.currency))
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: `text-[11px] font-mono font-bold ${isUp ? "text-rose-500" : "text-blue-500"}`,
													children: [
														isUp ? "+" : "",
														stock.changePercent,
														"%"
													]
												})
											]
										}, stock.symbol);
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setActiveTab("watchlist"),
									className: "text-xs font-bold text-rose-500 hover:underline shrink-0 hidden sm:inline-flex items-center",
									children: ["전체 관리 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5" })]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"aria-label": "시장 핵심 순위",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-lg font-black text-slate-900 dark:text-white flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-5 h-5 text-rose-500" }), "실시간 시장 주요 종목 랭킹"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-500 dark:text-slate-400",
									children: "한국거래소(KRX) 장중 실시간 급등락 및 거래량 급증 모니터링"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setActiveTab("ranking"),
									className: "text-xs font-bold text-rose-500 hover:underline flex items-center gap-0.5 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "실시간 종목 순위 전체보기 (TOP 20)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex lg:hidden items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-3 overflow-x-auto scrollbar-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setActiveMoverTab("surge_gain"),
										className: `px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${activeMoverTab === "surge_gain" ? "bg-rose-600 text-white shadow-xs" : "text-slate-500"}`,
										children: "🚀 급등 (+5% 이상)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setActiveMoverTab("surge_loss"),
										className: `px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${activeMoverTab === "surge_loss" ? "bg-blue-600 text-white shadow-xs" : "text-slate-500"}`,
										children: "📉 급락 (-5% 이하)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setActiveMoverTab("volume_surge"),
										className: `px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${activeMoverTab === "volume_surge" ? "bg-amber-600 text-white shadow-xs" : "text-slate-500"}`,
										children: "⚡ 거래량 급증 (200% 이상)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setActiveMoverTab("popular"),
										className: `px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${activeMoverTab === "popular" ? "bg-slate-700 text-white shadow-xs" : "text-slate-500"}`,
										children: "🔥 거래대금 상위"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs ${activeMoverTab !== "surge_gain" ? "hidden lg:block" : ""}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-rose-500/5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5 font-bold text-xs text-rose-500",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-4 h-4 stroke-[2.5]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "급등 종목" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20",
												children: "+5% 이상"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "divide-y divide-slate-100 dark:divide-slate-800/60",
											children: surgeGainers.map((stock, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												onClick: () => navigateToStock(stock.symbol),
												className: "px-3.5 py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2.5 min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "w-4 font-mono font-bold text-xs text-rose-500 shrink-0",
														children: i + 1
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "truncate",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors truncate block",
															children: stock.name
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] font-mono text-slate-400",
															children: stock.symbol
														})]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-right shrink-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-bold font-mono text-xs text-slate-900 dark:text-white",
														children: formatMoney(stock.price, inferStockCurrency(stock.symbol, stock.market, stock.currency))
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-mono text-xs font-bold text-rose-500",
														children: [
															"+",
															stock.changePercent.toFixed(2),
															"%"
														]
													})]
												})]
											}, stock.symbol))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs ${activeMoverTab !== "surge_loss" ? "hidden lg:block" : ""}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-blue-500/5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5 font-bold text-xs text-blue-500",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "w-4 h-4 stroke-[2.5]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "급락 종목" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20",
												children: "-5% 이하"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "divide-y divide-slate-100 dark:divide-slate-800/60",
											children: surgeLosers.map((stock, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												onClick: () => navigateToStock(stock.symbol),
												className: "px-3.5 py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2.5 min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "w-4 font-mono font-bold text-xs text-blue-500 shrink-0",
														children: i + 1
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "truncate",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors truncate block",
															children: stock.name
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] font-mono text-slate-400",
															children: stock.symbol
														})]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-right shrink-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-bold font-mono text-xs text-slate-900 dark:text-white",
														children: formatMoney(stock.price, inferStockCurrency(stock.symbol, stock.market, stock.currency))
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-mono text-xs font-bold text-blue-500",
														children: [stock.changePercent.toFixed(2), "%"]
													})]
												})]
											}, stock.symbol))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs ${activeMoverTab !== "volume_surge" ? "hidden lg:block" : ""}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-amber-500/5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5 font-bold text-xs text-amber-500",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "거래량 급증" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20",
												children: "200% 이상"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "divide-y divide-slate-100 dark:divide-slate-800/60",
											children: volumeSurge.map((stock, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												onClick: () => navigateToStock(stock.symbol),
												className: "px-3.5 py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2.5 min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "w-4 font-mono font-bold text-xs text-amber-500 shrink-0",
														children: i + 1
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "truncate",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors truncate block",
															children: stock.name
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-[10px] font-mono text-slate-400",
															children: [(stock.volume / 1e4).toFixed(0), "만 주"]
														})]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-right shrink-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "font-bold font-mono text-xs text-amber-500",
														children: [stock.volumeRatio, "% 폭증"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: `font-mono text-[11px] font-bold ${stock.change >= 0 ? "text-rose-500" : "text-blue-500"}`,
														children: [
															stock.change >= 0 ? "+" : "",
															stock.changePercent,
															"%"
														]
													})]
												})]
											}, stock.symbol))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs ${activeMoverTab !== "popular" ? "hidden lg:block" : ""}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-500/5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-slate-200",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "w-4 h-4 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "인기 종목" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono text-slate-400",
												children: "거래대금 기준"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "divide-y divide-slate-100 dark:divide-slate-800/60",
											children: popularStocks.map((stock, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												onClick: () => navigateToStock(stock.symbol),
												className: "px-3.5 py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2.5 min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "w-4 font-mono font-bold text-xs text-slate-400 shrink-0",
														children: i + 1
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "truncate",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors truncate block",
															children: stock.name
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] font-mono text-slate-400",
															children: formatTradingValueByCurrency(stock.tradingValue, inferStockCurrency(stock.symbol, stock.market, stock.currency))
														})]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-right shrink-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-bold font-mono text-xs text-slate-900 dark:text-white",
														children: formatMoney(stock.price, inferStockCurrency(stock.symbol, stock.market, stock.currency))
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: `font-mono text-[11px] font-bold ${stock.change >= 0 ? "text-rose-500" : "text-blue-500"}`,
														children: [
															stock.change >= 0 ? "+" : "",
															stock.changePercent,
															"%"
														]
													})]
												})]
											}, stock.symbol))
										})]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						"aria-label": "시장 뉴스 및 주주 토론",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, { className: "w-4 h-4 text-blue-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-bold text-base text-slate-900 dark:text-white",
												children: "시장 주요 뉴스 & 속보"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => fetchHomeNews(marketNewsCategory),
												disabled: isNewsLoading,
												className: "p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
												title: "뉴스 새로고침",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3.5 h-3.5 ${isNewsLoading ? "animate-spin text-blue-500" : ""}` })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => setActiveTab("news"),
												className: "text-xs font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-colors",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "전체보기" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5" })]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "px-4 py-2 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 flex items-center gap-1 overflow-x-auto scrollbar-none",
										children: [
											{
												id: "all",
												label: "전체"
											},
											{
												id: "breaking",
												label: "⚡ 주요 속보"
											},
											{
												id: "market",
												label: "국내 증시"
											},
											{
												id: "kospi",
												label: "코스피"
											},
											{
												id: "kosdaq",
												label: "코스닥"
											},
											{
												id: "economy",
												label: "경제"
											}
										].map((cat) => {
											const isActive = marketNewsCategory === cat.id;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setMarketNewsCategory(cat.id),
												className: `px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${isActive ? "bg-blue-500 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800"}`,
												children: cat.label
											}, cat.id);
										})
									}),
									isNewsLoading && marketNewsList.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-4 space-y-3",
										children: [
											1,
											2,
											3
										].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 animate-pulse space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 bg-slate-200 dark:bg-slate-700/50 rounded-sm w-3/4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 bg-slate-200 dark:bg-slate-700/30 rounded-sm w-1/2" })]
										}, n))
									}),
									!isNewsLoading && newsError && marketNewsList.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-6 text-center space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-8 h-8 text-rose-500 mx-auto" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-rose-400 font-semibold",
												children: newsError
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => fetchHomeNews(marketNewsCategory),
												className: "px-3 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors",
												children: "다시 시도"
											})
										]
									}),
									!isNewsLoading && !newsError && marketNewsList.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-8 text-center text-slate-400 space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, { className: "w-8 h-8 mx-auto text-slate-600 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-400",
											children: "등록된 최신 뉴스가 없습니다."
										})]
									}),
									marketNewsList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "divide-y divide-slate-100 dark:divide-slate-800 flex-1",
										children: marketNewsList.slice(0, 3).map((news) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between gap-2 mb-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 text-xs text-slate-400",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-semibold text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]",
																children: news.source
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																"aria-hidden": "true",
																children: "·"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "font-mono flex items-center gap-1",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3 text-slate-400" }), news.timeAgo || news.time]
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
														href: news.url,
														target: "_blank",
														rel: "noopener noreferrer",
														className: "text-slate-400 hover:text-blue-500 transition-colors",
														title: "원문 기사 보기",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3.5 h-3.5" })
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: news.url,
													target: "_blank",
													rel: "noopener noreferrer",
													className: "text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors leading-snug block",
													children: news.title
												}),
												news.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed",
													children: news.summary
												})
											]
										}, news.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-3 bg-slate-50 dark:bg-[#10141f] border-t border-slate-100 dark:border-slate-800 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setActiveTab("news"),
											className: "w-full py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 flex items-center justify-center gap-1 transition-colors",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "전체 뉴스 피드에서 더보기" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5" })]
										})
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "w-4 h-4 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-bold text-base text-slate-900 dark:text-white",
											children: "인기 커뮤니티 글"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setActiveTab("community"),
										className: "text-xs font-bold text-rose-500 hover:underline flex items-center",
										children: ["커뮤니티 전체 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5" })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "divide-y divide-slate-100 dark:divide-slate-800",
									children: communityPosts.slice(0, 3).map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										onClick: () => navigateToPost(post.id),
										className: "p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 text-xs text-slate-400 mb-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-bold text-slate-700 dark:text-slate-300",
														children: post.author.name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														"aria-hidden": "true",
														children: "·"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-amber-500 font-semibold",
														children: post.author.badge
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														"aria-hidden": "true",
														children: "·"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-[11px] text-slate-400",
														children: formatCommunityTime(post.createdAt)
													}),
													post.symbolName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-semibold text-rose-500 ml-auto text-[11px]",
														children: [
															"[",
															post.symbolName,
															"]"
														]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors line-clamp-1",
												children: post.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1",
												children: post.content
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3 text-xs font-mono text-slate-400 mt-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-1 hover:text-rose-500 transition-colors",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "w-3.5 h-3.5" }), post.likes]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-1 hover:text-blue-500 transition-colors",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-3.5 h-3.5" }), post.commentsCount || post.comments?.length || 0]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3.5 h-3.5" }), post.views]
													})
												]
											})
										]
									}, post.id))
								})]
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketEventDetailModal, {
				isOpen: isMarketEventModalOpen,
				onClose: () => setIsMarketEventModalOpen(false),
				event: selectedMarketEvent,
				onNavigateToStock: navigateToStock
			})
		]
	});
};
//#endregion
export { HomeView };
