import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { $t as ChartNoAxesColumn, Bt as Compass, C as Target, D as SquareCheckBig, E as Square, F as ShieldCheck, G as RefreshCw, I as ShieldAlert, L as Share2, O as Sparkles, V as Send, Wt as CircleCheck, _ as TrendingDown, an as Briefcase, bn as require_react, et as Newspaper, g as TrendingUp, gn as ArrowLeft, gt as LoaderCircle, l as Users, ln as Bell, ot as MessageSquare, r as Zap, sn as Bookmark, yn as Activity } from "./vendor-lucide-Dji_Ij8j.js";
import { D as isUSStockSymbol, S as inferStockCurrency, T as validateExchangeRate, _ as formatMarketCapByCurrency, g as convertToKRW, n as useApp, o as stockRepository, u as storageService, v as formatMoney, w as roundByCurrency, y as formatTradingValueByCurrency } from "./AppContext-Butl4QWq.js";
import { _ as getUSMarketStatus, f as MarketBadge, g as getKRXMarketStatus, p as PriceBadge, u as MockTradeModal } from "./index-DLz7vtf6.js";
import { t as SetPriceAlertModal } from "./SetPriceAlertModal-E_j0oHhv.js";
import { n as isSurgeLoss, r as isVolumeSurge, t as isSurgeGain } from "./marketThresholds-D6T0muT1.js";
import { t as marketMonitorClient } from "./marketMonitorClient-BziKZ1BT.js";
import { t as VirtualHoldingModal } from "./VirtualHoldingModal-qItoljeC.js";
import { i as InteractiveStockChart, n as StockNewsSection, r as OrderBookWidget, t as StockCommunitySection } from "./StockCommunitySection-B9XzrTDW.js";
import { t as useStockPurchases } from "./useStockPurchases-Br6d2qyD.js";
//#region src/services/geminiService.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
async function generateStockAiBriefing(stock) {
	try {
		const res = await fetch("/api/ai/stock-report", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ symbol: stock.symbol })
		});
		if (res.ok) {
			const data = await res.json();
			if (data && data.summary) return {
				...data,
				source: "gemini"
			};
		}
	} catch (err) {
		console.warn("[AiService] Server proxy fallback to quantitative engine:", err);
	}
	const isUp = stock.changePercent > 0;
	const isVolSpike = (stock.volumeRatio || 100) > 150;
	const isForeignBuying = (stock.foreignNetBuy || 0) > 0;
	const isInstBuying = (stock.instNetBuy || 0) > 0;
	let sentiment = "hold";
	let sentimentLabel = "중립 / 관망";
	if (isUp && isVolSpike && isForeignBuying) {
		sentiment = "strong_buy";
		sentimentLabel = "적극 매수 (강한 모멘텀)";
	} else if (isUp && (isForeignBuying || isInstBuying)) {
		sentiment = "buy";
		sentimentLabel = "매수 (수급 유입)";
	} else if (!isUp && (stock.foreignNetBuy || 0) < -100 && (stock.instNetBuy || 0) < -100) {
		sentiment = "sell";
		sentimentLabel = "비중 축소 (쌍끌이 매도)";
	}
	const stockCur = inferStockCurrency(stock.symbol, stock.market, stock.currency);
	const currentPrice = stock.price;
	const rawLow = currentPrice * (sentiment === "sell" ? .92 : 1.05);
	const rawHigh = currentPrice * (sentiment === "strong_buy" ? 1.25 : sentiment === "buy" ? 1.15 : 1.08);
	const targetLow = stockCur === "KRW" ? Math.round(rawLow / 100) * 100 : roundByCurrency(rawLow, stockCur);
	const targetHigh = stockCur === "KRW" ? Math.round(rawHigh / 100) * 100 : roundByCurrency(rawHigh, stockCur);
	const catalysts = [];
	if (isVolSpike) catalysts.push(`평균 대비 ${stock.volumeRatio}%의 대량 거래량 폭증 포착`);
	if (isForeignBuying && stockCur === "KRW") catalysts.push(`외국인 투자자 순매수세(+${stock.foreignNetBuy}억 원) 지속`);
	if (isInstBuying && stockCur === "KRW") catalysts.push(`국내 기관 투자자 순매수 유입(+${stock.instNetBuy}억 원)`);
	if (stock.tradingValue > 0) catalysts.push(`거래대금 ${formatTradingValueByCurrency(stock.tradingValue, stockCur)} 유입`);
	if (stock.per && stock.per < 15) catalysts.push(`동종업계 대비 저평가 PER (${stock.per}배) 밸류에이션 매력`);
	if (catalysts.length === 0) catalysts.push(`${stock.sector} 섹터 내 견조한 펀더멘털 유지`);
	const risks = [];
	if (!isForeignBuying && stockCur === "KRW" && (stock.foreignNetBuy || 0) < 0) risks.push(`외국인 차익실현 매물 출회(${stock.foreignNetBuy}억 원) 단기 부담`);
	if (stock.changePercent < -3) risks.push(`단기 지지선 이탈에 따른 변동성 확대 주의`);
	if (risks.length === 0) risks.push(`대외 거시경제(환율 및 금리) 불확실성에 따른 차익 실현 경계`);
	const formattedCurrent = formatMoney(currentPrice, stockCur);
	const formattedLow = formatMoney(targetLow, stockCur);
	const formattedHigh = formatMoney(targetHigh, stockCur);
	const technicalView = isUp ? `현재가(${formattedCurrent})는 5일 및 20일 이동평균선 상단에 위치하여 단기 상승 추세를 지지하고 있으며, 1차 목표가 ${formattedHigh} 안착 여부가 관건입니다.` : `단기 조정 국면으로 20일 이동평균선 지지 여부(${formattedLow})를 확인하며 분할 접근이 권장됩니다.`;
	return {
		summary: `${stock.name}은(는) 현재 전일대비 ${stock.change >= 0 ? "+" : ""}${stock.changePercent}% 변동한 ${formattedCurrent}에 거래 중입니다. ${isVolSpike ? "거래량이 급증하며 시장 관심이 집중되고 있으며, " : ""}${stockCur === "KRW" && (isForeignBuying || isInstBuying) ? "메이저 수급 유입이 확인됩니다." : "거래 추이를 주시할 필요가 있습니다."}`,
		sentiment,
		sentimentLabel,
		targetPriceRange: {
			low: targetLow,
			high: targetHigh
		},
		catalysts,
		risks,
		technicalView,
		source: "heuristic"
	};
}
//#endregion
//#region src/components/stocks/StockAiBriefingWidget.tsx
var import_jsx_runtime = require_jsx_runtime();
var StockAiBriefingWidget = ({ stock }) => {
	const [briefing, setBriefing] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const handleGenerate = async () => {
		setIsLoading(true);
		try {
			const res = await generateStockAiBriefing(stock);
			setBriefing(res);
		} catch (err) {
			console.error("Failed to generate briefing:", err);
		} finally {
			setIsLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-gradient-to-br from-white via-slate-50 to-rose-50/20 dark:from-[#131722] dark:via-[#131722] dark:to-rose-950/20 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-2 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-5 h-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-base text-slate-900 dark:text-white",
						children: "Gemini AI 실시간 종목 브리핑"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20",
						children: "AI 퀀트 모델"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500 dark:text-slate-400",
					children: "최신 재무지표, 실시간 수급, 거래량 급증률 및 차트 패턴 심층 분석"
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: handleGenerate,
				disabled: isLoading,
				className: "flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:bg-slate-400 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all self-start sm:self-auto cursor-pointer",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AI 분석 중..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: briefing ? "브리핑 다시 받기" : "AI 종합 브리핑 분석" })] })
			})]
		}), briefing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 animate-in fade-in duration-200",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-white dark:bg-[#1a1f2e] border border-slate-200 dark:border-slate-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-slate-400 block mb-1",
						children: "AI 투자 의견"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${{
							strong_buy: "bg-rose-500/10 text-rose-500 border-rose-500/30",
							buy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
							hold: "bg-amber-500/10 text-amber-500 border-amber-500/30",
							sell: "bg-blue-500/10 text-blue-500 border-blue-500/30"
						}[briefing.sentiment]}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5" }), briefing.sentimentLabel]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-slate-400 block mb-1",
						children: "예상 적정 주가 밴드"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-mono font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "w-4 h-4 text-rose-500" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(briefing.targetPriceRange.low, inferStockCurrency(stock.symbol, stock.market, stock.currency)) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-400",
								children: "~"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-rose-500",
								children: formatMoney(briefing.targetPriceRange.high, inferStockCurrency(stock.symbol, stock.market, stock.currency))
							})
						]
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3.5 rounded-xl bg-white dark:bg-[#1a1f2e] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-slate-900 dark:text-white block mb-1 font-semibold",
						children: "💡 핵심 요약"
					}), briefing.summary]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 font-bold text-xs text-emerald-600 dark:text-emerald-400 mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3.5 h-3.5" }), "주요 상승 모멘텀 (Catalysts)"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1.5 text-xs text-slate-600 dark:text-slate-300",
							children: briefing.catalysts.map((cat, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-emerald-500 shrink-0",
									children: "•"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cat })]
							}, i))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-xl bg-rose-500/5 border border-rose-500/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 font-bold text-xs text-rose-600 dark:text-rose-400 mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-3.5 h-3.5" }), "하방 리스크 요인 (Risks)"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1.5 text-xs text-slate-600 dark:text-slate-300",
							children: briefing.risks.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-rose-500 shrink-0",
									children: "•"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r })]
							}, i))
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 rounded-xl bg-white dark:bg-[#1a1f2e] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-slate-900 dark:text-white block mb-1 font-semibold",
						children: "📈 기술적 차트 견해"
					}), briefing.technicalView]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-slate-400 text-right",
					children: "* 본 브리핑은 투자 참고용 데이터이며 최종 투자 결정과 책임은 투자자 본인에게 있습니다."
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "py-6 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs sm:text-sm font-medium",
				children: "'AI 종합 브리핑 분석' 버튼을 누르면 Gemini AI 모델이 즉시 심층 분석 리포트를 생성합니다."
			})
		})]
	});
};
//#endregion
//#region src/components/stocks/StockVolumeSection.tsx
var StockVolumeSection = ({ stock }) => {
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(false);
	const [displayMode, setDisplayMode] = (0, import_react.useState)("amount");
	(0, import_react.useEffect)(() => {
		let isSubscribed = true;
		stockRepository.getVolumeAnalysis(stock.symbol).then((res) => {
			if (isSubscribed) {
				if (res) setData(res);
				else setError(true);
			}
		}).catch(() => {
			if (isSubscribed) setError(true);
		});
		return () => {
			isSubscribed = false;
		};
	}, [stock.symbol]);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 text-slate-500 text-xs text-center",
		children: "수급 분석 데이터를 불러올 수 없습니다."
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-5 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 animate-pulse h-48" });
	const isSurge = isVolumeSurge(data.volumeRatio);
	const hasAmountData = data.foreignNetBuy !== null && data.instNetBuy !== null;
	const hasQtyData = (data.foreignNetBuyQty ?? null) !== null && (data.instNetBuyQty ?? null) !== null;
	const canShowInvestor = Boolean(data.investorDataAvailable && (hasAmountData || hasQtyData));
	const activeMode = displayMode === "quantity" && hasQtyData ? "quantity" : hasAmountData ? "amount" : "quantity";
	const foreignValue = activeMode === "quantity" ? data.foreignNetBuyQty ?? null : data.foreignNetBuy;
	const instValue = activeMode === "quantity" ? data.instNetBuyQty ?? null : data.instNetBuy;
	const individualValue = activeMode === "quantity" ? data.individualNetBuyQty ?? null : data.individualNetBuy;
	const activeUnitLabel = activeMode === "quantity" ? data.investorQtyUnit || "주" : "억 원";
	const activeShortUnit = activeMode === "quantity" ? data.investorQtyUnit || "주" : "억";
	const formatSignedInvestorValue = (val) => {
		if (val === null || val === void 0 || !Number.isFinite(val)) return {
			text: "데이터 없음",
			colorClass: "text-slate-400"
		};
		if (val === 0) return {
			text: `0${activeShortUnit}`,
			colorClass: "text-slate-500 dark:text-slate-300"
		};
		return {
			text: `${val > 0 ? "+" : ""}${val.toLocaleString()}${activeShortUnit}`,
			colorClass: val > 0 ? "text-rose-500" : "text-blue-500"
		};
	};
	const foreignFormatted = formatSignedInvestorValue(foreignValue);
	const instFormatted = formatSignedInvestorValue(instValue);
	const individualFormatted = formatSignedInvestorValue(individualValue);
	const individualLabel = data.isDirectInvestorIndividual === false ? "개인 (역산)" : "개인";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-base text-slate-900 dark:text-white flex items-center gap-2",
						children: "거래량 및 수급 분석 정보"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-400",
						children: "당일 거래량 대비 이평선 배율, 거래대금, 외인·기관 투자자별 매매동향"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: isSurge ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center gap-1 animate-pulse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"거래량 급증 (200% 이상: ",
							data.volumeRatio,
							"%)"
						] })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
						children: [
							"거래량 정상 (평균 대비 ",
							data.volumeRatio,
							"%)"
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-400 font-sans text-[11px] block mb-1",
								children: "당일 누적 거래량"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-base font-black text-slate-900 dark:text-white",
								children: [
									data.volume.toLocaleString(),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-sans text-slate-400",
										children: "주"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-slate-400 font-sans block mt-1",
								children: [
									"20일 평균: ",
									data.avgVolume20d.toLocaleString(),
									"주"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-400 font-sans text-[11px] block mb-1",
								children: "당일 거래대금"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base font-black text-slate-900 dark:text-white",
								children: data.tradingValue >= 1e4 ? `${(data.tradingValue / 1e4).toFixed(1)}조 원` : `${data.tradingValue.toLocaleString()}억 원`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-slate-400 font-sans block mt-1",
								children: [
									"시가총액 대비: ",
									(data.tradingValue / (stock.marketCap || 1) * 100).toFixed(1),
									"%"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-400 font-sans text-[11px] block mb-1",
								children: "체결강도 (Execution)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `text-base font-black ${data.executionStrength >= 100 ? "text-rose-500" : "text-blue-500"}`,
								children: [data.executionStrength, "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-slate-400 font-sans block mt-1",
								children: data.executionStrength >= 100 ? "매수 체결 우세" : "매도 체결 우세"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-400 font-sans text-[11px] block mb-1",
								children: "주식 회전율 (Turnover)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-base font-black text-slate-900 dark:text-white",
								children: [data.turnoverRatio, "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-slate-400 font-sans block mt-1",
								children: [
									"5일 평균: ",
									data.avgVolume5d.toLocaleString(),
									"주"
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2 text-xs font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-slate-700 dark:text-slate-300 flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-3.5 h-3.5 text-indigo-500" }),
							"투자자별 당일 순매수 현황 ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-slate-400 font-normal",
								children: [
									"(",
									data.investorDataSource || "수급 데이터 미수신",
									")"
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [canShowInvestor && hasAmountData && hasQtyData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex rounded-lg bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-700 p-0.5 text-[10px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDisplayMode("amount"),
								className: `px-2 py-0.5 rounded-md font-semibold transition-colors ${activeMode === "amount" ? "bg-indigo-600 text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
								children: "금액(억 원)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDisplayMode("quantity"),
								className: `px-2 py-0.5 rounded-md font-semibold transition-colors ${activeMode === "quantity" ? "bg-indigo-600 text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
								children: "수량(주)"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-slate-400 text-[11px] font-mono",
							children: ["단위: ", activeUnitLabel]
						})]
					})]
				}), canShowInvestor ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-lg bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-700/80 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-sans font-medium text-slate-500",
								children: "외국인"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `font-bold ${foreignFormatted.colorClass}`,
								children: foreignFormatted.text
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-lg bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-700/80 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-sans font-medium text-slate-500",
								children: "기관계"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `font-bold ${instFormatted.colorClass}`,
								children: instFormatted.text
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-lg bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-700/80 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-sans font-medium text-slate-500",
								children: individualLabel
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `font-bold ${individualFormatted.colorClass}`,
								children: individualFormatted.text
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"출처: ",
						data.investorDataSource || "공식 API",
						" ",
						data.investorBaseDate ? `(기준일: ${data.investorBaseDate})` : ""
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["갱신: ", data.investorUpdateTime || "미확인"] })]
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-lg bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-700/80 text-center space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-semibold text-slate-600 dark:text-slate-300",
						children: ["데이터 없음 ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] font-normal text-slate-400",
							children: [
								"(",
								data.investorDataSource || "수급 데이터 미수신",
								")"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] text-slate-400",
						children: stock.market === "US" ? "미국 주식 시장은 국내 기관·외국인 수급 집계 대상이 아닙니다." : stock.market === "COIN" ? "가상자산 마켓은 국내 기관·외국인 수급 집계 대상이 아닙니다." : "거래소 공식 수급 데이터가 수신되지 않았거나 장외/미연결 상태입니다. (임의 추정치는 표시되지 않습니다)"
					})]
				})]
			})
		]
	});
};
//#endregion
//#region src/components/stocks/StockSmartAlertWidget.tsx
var StockSmartAlertWidget = ({ stock }) => {
	const { showToast } = useApp();
	const [alertConfig, setAlertConfig] = (0, import_react.useState)(() => storageService.getSmartAlertForStock(stock.symbol, stock.name));
	(0, import_react.useEffect)(() => {
		setAlertConfig(storageService.getSmartAlertForStock(stock.symbol, stock.name));
	}, [stock.symbol, stock.name]);
	const handleToggle = (rule, label) => {
		const updated = storageService.toggleSmartAlertRule(stock.symbol, rule, stock.name);
		setAlertConfig({ ...updated });
		const isNowActive = updated[rule];
		showToast(`${stock.name} [${label}] 알림이 ${isNowActive ? "활성화" : "해제"}되었습니다.`, isNowActive ? "success" : "info");
	};
	const handleTestAlert = async (type, title, desc) => {
		try {
			await marketMonitorClient.triggerTestEvent({
				type: "PRICE_SURGE",
				scope: "STOCK",
				title: `[알림 테스트] ${stock.name} ${title}`,
				description: desc,
				symbol: stock.symbol,
				symbolName: stock.name,
				market: stock.market,
				metrics: {
					currentValue: 5.2,
					threshold: 5,
					unit: "%",
					changePercent: 5.2
				}
			});
			showToast(`${stock.name} 실시간 모니터링 알림이 정상 발송되었습니다.`, "success");
		} catch {
			showToast("테스트 알림 전송 실패", "error");
		}
	};
	const items = [
		{
			key: "rise5Percent",
			label: "+5% 상승",
			detail: "주가 등락률 +5.0% 이상 돌파 시 즉시 감지 알림",
			checked: alertConfig.rise5Percent,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 text-rose-500" }),
			tagColor: "text-rose-500 bg-rose-500/10 border-rose-500/20",
			activeText: "+5% 급등 알림 ON"
		},
		{
			key: "fall5Percent",
			label: "-5% 하락",
			detail: "주가 등락률 -5.0% 이하 급락 시 즉각 리스크 경보",
			checked: alertConfig.fall5Percent,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-4 h-4 text-blue-500" }),
			tagColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
			activeText: "-5% 급락 알림 ON"
		},
		{
			key: "volume200Percent",
			label: "거래량 200%",
			detail: "20일 평균 거래량 대비 200% 이상 폭증 시 수급 집중 포착",
			checked: alertConfig.volume200Percent,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-4 h-4 text-amber-500" }),
			tagColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
			activeText: "거래량 200% 알림 ON"
		},
		{
			key: "highLowAlert",
			label: "신고가/신저가",
			detail: "당일 신고가 또는 신저가 경신 시점 즉시 알림",
			checked: alertConfig.highLowAlert,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-emerald-500" }),
			tagColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
			activeText: "신고가/신저가 알림 ON"
		},
		{
			key: "newsAlert",
			label: "뉴스 발생",
			detail: "한국거래소(KRX) 주요 공시 및 핵심 속보 기사 발생 시 실시간 푸시",
			checked: alertConfig.newsAlert,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, { className: "w-4 h-4 text-indigo-500" }),
			tagColor: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
			activeText: "속보 공시 알림 ON"
		},
		{
			key: "aiBriefingAlert",
			label: "AI 브리핑",
			detail: "Gemini AI 기반 당일 장마감 요약 및 특이동향 심층 브리핑 제공",
			checked: alertConfig.aiBriefingAlert,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 text-purple-500" }),
			tagColor: "text-purple-500 bg-purple-500/10 border-purple-500/20",
			activeText: "AI 브리핑 알림 ON"
		}
	];
	const activeCount = items.filter((i) => i.checked).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-xs space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-5 h-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-bold text-base text-slate-900 dark:text-white flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [stock.name, " 맞춤 감지 알림"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30",
						children: [activeCount, "개 활성"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-400 mt-0.5",
					children: "원하는 시장 조건이 발생했을 때 실시간으로 즉시 알림을 수신합니다."
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => handleTestAlert("급등 알림", "알림 수신 테스트", "설정된 조건에 따라 정상적으로 알림이 발송되었습니다."),
				className: "self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors cursor-pointer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-3.5 h-3.5 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "테스트 발송" })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3",
			children: [items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onClick: () => handleToggle(item.key, item.label),
				className: `p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 select-none ${item.checked ? "bg-slate-50/80 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 shadow-xs" : "bg-white dark:bg-[#131722] border-slate-200 dark:border-slate-800/60 opacity-60 hover:opacity-100"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-slate-900 dark:text-white",
							"aria-label": item.label,
							children: item.checked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "w-5 h-5 text-rose-600 dark:text-rose-500 fill-rose-600/10" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "w-5 h-5 text-slate-400" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [item.icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-sm text-slate-900 dark:text-white",
								children: item.label
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `text-[10px] font-bold px-2 py-0.5 rounded-md border ${item.checked ? item.tagColor : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent"}`,
						children: item.checked ? "ON" : "OFF"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500 dark:text-slate-400 leading-relaxed",
					children: item.detail
				})]
			}, item.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800 flex flex-col justify-center gap-2 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "서버 실시간 감지 연동" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-slate-400 text-[11px] leading-relaxed",
						children: "체크된 모든 조건은 서버 모니터링 엔진에서 4초 주기로 실시간 검증되며, 중복 방지 쿨다운이 적용됩니다."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[10px] font-mono text-slate-400",
						children: ["상태: ", alertConfig.updatedAt]
					})
				]
			})]
		})]
	});
};
//#endregion
//#region src/components/stocks/StockDetailView.tsx
var StockDetailView = ({ symbol }) => {
	const { stocks, watchlist, toggleWatchlist, isWatchlisted, setActiveTab, showToast, requireAuth, user, exchangeRate } = useApp();
	const { purchases } = useStockPurchases(user?.id);
	const safeSymbol = typeof symbol === "string" ? symbol.trim() : "";
	const initialStock = safeSymbol ? stocks.find((s) => s.symbol === safeSymbol) : void 0;
	const [stockDetail, setStockDetail] = (0, import_react.useState)(initialStock || null);
	const [isLoadingDetail, setIsLoadingDetail] = (0, import_react.useState)(!initialStock);
	const [liveTick, setLiveTick] = (0, import_react.useState)(null);
	const isCoin = stockDetail?.market === "COIN" || safeSymbol.includes("-") || safeSymbol.endsWith("USDT");
	const isUS = !isCoin && (stockDetail?.market === "US" || (safeSymbol ? isUSStockSymbol(safeSymbol) : false));
	const [marketStatus, setMarketStatus] = (0, import_react.useState)(() => isUS ? getUSMarketStatus() : getKRXMarketStatus());
	(0, import_react.useEffect)(() => {
		if (isCoin) return;
		const updateMarket = () => setMarketStatus(isUS ? getUSMarketStatus() : getKRXMarketStatus());
		updateMarket();
		const timer = setInterval(updateMarket, 1e4);
		return () => clearInterval(timer);
	}, [isUS, isCoin]);
	const stockDetailRef = (0, import_react.useRef)(stockDetail);
	stockDetailRef.current = stockDetail;
	const stocksRef = (0, import_react.useRef)(stocks);
	stocksRef.current = stocks;
	(0, import_react.useEffect)(() => {
		let isSubscribed = true;
		const existing = stocksRef.current.find((s) => s.symbol === symbol);
		if (existing) setStockDetail(existing);
		else setIsLoadingDetail(true);
		stockRepository.getStock(symbol).then((res) => {
			if (isSubscribed && res) setStockDetail(res);
		}).catch((err) => {
			console.warn(`[StockDetailView] Error loading ${symbol}:`, err);
		}).finally(() => {
			if (isSubscribed) setIsLoadingDetail(false);
		});
		return () => {
			isSubscribed = false;
		};
	}, [symbol]);
	(0, import_react.useEffect)(() => {
		setLiveTick(null);
		const unsub = stockRepository.subscribeExecutionTick?.(symbol, (tick) => {
			const currentDetail = stockDetailRef.current;
			if (currentDetail && currentDetail.price > 0 && tick.price > 0) {
				if (Math.abs(tick.price - currentDetail.price) / currentDetail.price > .1) return;
			}
			setLiveTick({
				price: tick.price,
				change: tick.change,
				changePercent: tick.changePercent,
				volume: tick.volume,
				highPrice: tick.high,
				lowPrice: tick.low
			});
		});
		return () => {
			unsub?.();
		};
	}, [symbol]);
	const baseStock = stockDetail || initialStock || {
		symbol: safeSymbol || "UNKNOWN",
		name: safeSymbol || "미확인 종목",
		market: "KOSPI",
		sector: "기타",
		price: 0,
		change: 0,
		changePercent: 0,
		volume: 0,
		volumeRatio: 100,
		tradingValue: 0,
		openPrice: 0,
		highPrice: 0,
		lowPrice: 0,
		prevClose: 0,
		high52w: 0,
		low52w: 0,
		marketCap: 0,
		per: 0,
		pbr: 0,
		eps: 0,
		dividendYield: 0,
		foreignNetBuy: null,
		instNetBuy: null,
		investorDataAvailable: false,
		candles: [],
		sparkline: []
	};
	const isTickValid = liveTick && liveTick.price && baseStock.price > 0 && Math.abs(liveTick.price - baseStock.price) / baseStock.price <= .1;
	const stock = {
		...baseStock,
		...isTickValid ? {
			price: liveTick.price || baseStock.price,
			change: liveTick.change !== void 0 ? liveTick.change : baseStock.change,
			changePercent: liveTick.changePercent !== void 0 ? liveTick.changePercent : baseStock.changePercent,
			volume: liveTick.volume || baseStock.volume,
			highPrice: liveTick.highPrice || baseStock.highPrice,
			lowPrice: liveTick.lowPrice || baseStock.lowPrice
		} : {}
	};
	const isWatch = isWatchlisted(stock.symbol);
	const [isAlertModalOpen, setIsAlertModalOpen] = (0, import_react.useState)(false);
	const [isTradeModalOpen, setIsTradeModalOpen] = (0, import_react.useState)(false);
	const [isHoldingModalOpen, setIsHoldingModalOpen] = (0, import_react.useState)(false);
	const [isSimulatorOpen, setIsSimulatorOpen] = (0, import_react.useState)(false);
	const [mobileTab, setMobileTab] = (0, import_react.useState)("chart");
	const mobileTabList = [
		"chart",
		"orderbook",
		"metrics",
		"news",
		"community"
	];
	const [touchStartX, setTouchStartX] = (0, import_react.useState)(null);
	const handleTouchStart = (e) => {
		setTouchStartX(e.touches[0].clientX);
	};
	const handleTouchEnd = (e) => {
		if (touchStartX === null) return;
		const touchEndX = e.changedTouches[0].clientX;
		const diff = touchStartX - touchEndX;
		const currentIndex = mobileTabList.indexOf(mobileTab);
		if (diff > 50 && currentIndex < mobileTabList.length - 1) setMobileTab(mobileTabList[currentIndex + 1]);
		else if (diff < -50 && currentIndex > 0) setMobileTab(mobileTabList[currentIndex - 1]);
		setTouchStartX(null);
	};
	const handleShare = () => {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(window.location.href);
			showToast("종목 상세 링크가 클립보드에 복사되었습니다.", "info");
		}
	};
	const isUp = stock.change >= 0;
	const stockCur = inferStockCurrency(stock.symbol, stock.market, stock.currency);
	const fxCheck = validateExchangeRate(exchangeRate);
	const krwApprox = stockCur === "USD" || stockCur === "USDT" ? convertToKRW(stock.price, stockCur === "USDT" ? "USD" : stockCur, exchangeRate) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-24 animate-in fade-in duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						if (window.history.length > 1) window.history.back();
						else setActiveTab("stocks");
					},
					className: "flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors self-start cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "이전 화면으로 돌아가기" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 self-start sm:self-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleShare,
							className: "p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors",
							title: "공유하기",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-4 h-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setIsTradeModalOpen(true),
							className: "flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95",
							title: "실시간 시세 기반 모의 매매",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "모의 매매" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setIsSimulatorOpen(true),
							className: "flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all active:scale-95",
							title: "과거 차트 매매 시뮬레이션 및 시나리오 분석",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "w-4 h-4 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "차트 시뮬레이션" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setIsHoldingModalOpen(true),
							className: "flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors",
							title: "가상 보유 내역 등록",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "w-4 h-4 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "보유 기록" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								if (!requireAuth("알림 생성")) return;
								setIsAlertModalOpen(true);
							},
							className: "flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-4 h-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "가격 알림" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => toggleWatchlist(stock.symbol),
							className: `flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${isWatch ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30" : "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: `w-4 h-4 ${isWatch ? "fill-amber-500 text-amber-500" : "text-white"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isWatch ? "관심종목 등록됨" : "관심종목 추가" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-2xl sm:text-3xl tablet:text-[22px] font-black text-slate-900 dark:text-white truncate",
									children: stock.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-sm tablet:text-[12px] tabular-nums px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700/60",
									children: stock.symbol
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketBadge, {
									market: stock.market,
									exchange: stock.exchange
								}),
								stock.productType && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-[10px] tablet:text-[11px] font-bold px-2 py-0.5 rounded-lg border whitespace-nowrap ${stock.productType === "ETF" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : stock.productType === "ADR" ? "bg-purple-500/10 text-purple-500 border-purple-500/20" : stock.productType === "SPOT" ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"}`,
									children: stock.productType === "ETF" ? "상장지수펀드 (ETF)" : stock.productType === "ADR" ? "글로벌 ADR (미국 주식예탁증서)" : stock.productType === "SPOT" ? "현물 (Spot)" : "보통주"
								}),
								stock.tradingPair && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-xs tablet:text-[11.5px] tabular-nums whitespace-nowrap px-2.5 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-500/20",
									children: ["페어: ", stock.tradingPair]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs tablet:text-[12px] text-slate-400 font-medium whitespace-nowrap",
									children: stock.sector
								}),
								stock.warning && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs tablet:text-[11.5px] whitespace-nowrap px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-500 border border-amber-500/40 animate-pulse",
									children: "⚠️ 투자유의 종목"
								}),
								isSurgeGain(stock.changePercent) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs tablet:text-[11.5px] whitespace-nowrap px-2.5 py-0.5 rounded-full font-bold bg-rose-500/10 text-rose-500 border border-rose-500/30 flex items-center gap-1 font-sans animate-pulse",
									children: "🔥 급등 (+5% 이상)"
								}),
								isSurgeLoss(stock.changePercent) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs tablet:text-[11.5px] whitespace-nowrap px-2.5 py-0.5 rounded-full font-bold bg-blue-500/10 text-blue-500 border border-blue-500/30 flex items-center gap-1 font-sans",
									children: "🔻 급락 (-5% 이하)"
								}),
								isVolumeSurge(stock.volumeRatio) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs tablet:text-[11.5px] whitespace-nowrap px-2.5 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center gap-1 font-sans",
									children: [
										"⚡ 거래량 급증 (200% 이상: ",
										stock.volumeRatio,
										"%)"
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline gap-3.5 mt-3 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl sm:text-4xl tablet:text-[22px] font-black font-mono tabular-nums whitespace-nowrap tracking-tight text-slate-900 dark:text-white",
									children: formatMoney(stock.price, stockCur)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
									children: stockCur
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `text-base sm:text-lg tablet:text-[15px] font-bold font-mono tabular-nums whitespace-nowrap ${isUp ? "text-rose-500" : "text-blue-500"}`,
										children: [
											isUp ? "▲" : "▼",
											" ",
											formatMoney(Math.abs(stock.change), stockCur)
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceBadge, {
										change: stock.change,
										changePercent: stock.changePercent,
										currency: stockCur,
										size: "lg"
									})]
								}),
								(stockCur === "USD" || stockCur === "USDT") && (krwApprox?.valid && krwApprox.valueKRW !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs tablet:text-[11.5px] text-slate-500 dark:text-slate-400 font-mono font-medium tabular-nums whitespace-nowrap",
									children: [
										"≈ ",
										formatMoney(krwApprox.valueKRW, "KRW"),
										" (환율 ₩",
										fxCheck.rate?.toLocaleString(void 0, { maximumFractionDigits: 2 }),
										" · ",
										fxCheck.lastUpdated,
										")"
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs tablet:text-[11.5px] text-amber-600 dark:text-amber-400 font-medium whitespace-nowrap",
									children: [
										"원화 환산 중단 (실시간 환율 ",
										fxCheck.status === "stale" ? "지연/만료" : "미수신",
										")"
									]
								}))
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-center gap-2 text-xs font-mono self-start lg:self-center",
							children: [
								isCoin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-sans font-bold shadow-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
									title: "가상자산 시장 24시간 365일 실시간 거래",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "24시간 실시간 연중무휴" })]
								}) : stock.market === "US" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-sans font-bold shadow-sm ${marketStatus.isOpen ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300/60 dark:border-slate-700"}`,
									title: `미국 뉴욕(EDT/EST) ${marketStatus.timeStringKST} (${marketStatus.detailLabel})`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2 h-2 rounded-full ${marketStatus.isOpen ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"미국장 ",
										marketStatus.statusLabel,
										" ",
										stock.delayLabel ? `(${stock.delayLabel})` : ""
									] })]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-sans font-bold shadow-sm ${marketStatus.isOpen ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300/60 dark:border-slate-700"}`,
									title: `한국 시간(KST) ${marketStatus.timeStringKST} (${marketStatus.detailLabel})`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2 h-2 rounded-full ${marketStatus.isOpen ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: marketStatus.statusLabel })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-sans font-semibold ${isCoin ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" : stock.market === "US" ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" : stock.dataSource === "kiwoom" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-1.5 h-1.5 rounded-full ${isCoin ? "bg-amber-500" : stock.market === "US" ? "bg-purple-500" : stock.dataSource === "kiwoom" ? "bg-blue-500" : "bg-amber-500"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isCoin ? `${stock.exchange === "UPBIT" ? "업비트 공식 실시간 호가" : "바이낸스 공식 Spot API"}` : stock.market === "US" ? "글로벌 공식 시세 (USD · 15분 지연)" : stock.dataSource === "kiwoom" ? "키움 실전 API" : stock.isStale ? "캐시 시세 (수신 지연)" : "Yahoo 대체 시세 (지연)" })]
								}),
								stock.lastUpdated && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-slate-400 font-sans",
									children: [stock.lastUpdated, " 갱신"]
								})
							]
						})]
					}),
					stock.warning && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-semibold flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg",
							children: "⚠️"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"본 가상자산은 거래소 기준 ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "[투자유의 종목]" }),
							"으로 지정되어 있습니다. 급격한 시세 변동 및 거래지원 종료 가능성에 유의하시기 바랍니다."
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 text-xs font-mono",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-400 font-sans text-[11px] block mb-1",
									children: "시가"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-slate-900 dark:text-white text-sm",
									children: stock.openPrice > 0 ? formatMoney(stock.openPrice, stockCur) : "-"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-400 font-sans text-[11px] block mb-1",
									children: "고가"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-rose-500 text-sm",
									children: stock.highPrice > 0 ? formatMoney(stock.highPrice, stockCur) : "-"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-400 font-sans text-[11px] block mb-1",
									children: "저가"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-blue-500 text-sm",
									children: stock.lowPrice > 0 ? formatMoney(stock.lowPrice, stockCur) : "-"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-400 font-sans text-[11px] block mb-1",
									children: "거래량"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-slate-900 dark:text-white text-sm",
									children: [stock.volume.toLocaleString(), isCoin ? ` ${stock.baseCurrency || ""}` : "주"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-400 font-sans text-[11px] block mb-1",
									children: "거래대금"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-slate-900 dark:text-white text-sm",
									children: formatTradingValueByCurrency(stock.tradingValue, stockCur)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-400 font-sans text-[11px] block mb-1",
									children: "52주 최고"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-rose-500 text-sm",
									children: stock.high52w > 0 ? formatMoney(stock.high52w, stockCur) : "-"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-400 font-sans text-[11px] block mb-1",
									children: "52주 최저"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-blue-500 text-sm",
									children: stock.low52w > 0 ? formatMoney(stock.low52w, stockCur) : "-"
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "block md:hidden sticky top-[60px] z-30 bg-white/95 dark:bg-[#0c0f17]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 -mx-2 px-2 py-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1.5 overflow-x-auto no-scrollbar",
					children: [
						{
							id: "chart",
							label: "차트",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3.5 h-3.5" })
						},
						{
							id: "orderbook",
							label: "호가",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { className: "w-3.5 h-3.5" })
						},
						{
							id: "metrics",
							label: "시세·기업",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-3.5 h-3.5" })
						},
						{
							id: "news",
							label: "뉴스·공시",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, { className: "w-3.5 h-3.5" })
						},
						{
							id: "community",
							label: "주주 토론",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-3.5 h-3.5" })
						}
					].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setMobileTab(tab.id),
						className: `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${mobileTab === tab.id ? "bg-rose-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`,
						children: [tab.icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.label })]
					}, tab.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "block md:hidden space-y-4 touch-pan-y",
				onTouchStart: handleTouchStart,
				onTouchEnd: handleTouchEnd,
				children: [
					mobileTab === "chart" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InteractiveStockChart, {
							symbol: stock.symbol,
							candles: stock.candles,
							stockPrice: stock.price,
							prevClose: stock.prevClose,
							currency: stock.currency,
							buyEntries: purchases[symbol] || []
						})
					}),
					mobileTab === "orderbook" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderBookWidget, { stock }),
					mobileTab === "metrics" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockVolumeSection, { stock }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockSmartAlertWidget, { stock }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockAiBriefingWidget, { stock })
						]
					}),
					mobileTab === "news" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockNewsSection, { stock }),
					mobileTab === "community" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockCommunitySection, { stock })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden md:block space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-bold text-base text-slate-900 dark:text-white flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-5 h-5 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isCoin ? "가상자산 실시간 시세 차트" : stock.market === "US" ? "미국 주식 시세 차트" : "실시간 주가 차트" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-slate-400",
									children: isCoin ? `${stock.exchange === "UPBIT" ? "업비트 Open API 공식 OHLCV 캔들" : "바이낸스 공식 Spot 캔들"}` : stock.market === "US" ? "글로벌 공식 일봉 차트 (USD)" : "키움 Open API 실전 차트 (1분·5분·15분·30분·1시간·일봉)"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InteractiveStockChart, {
								symbol: stock.symbol,
								candles: stock.candles,
								stockPrice: stock.price,
								prevClose: stock.prevClose,
								currency: stock.currency,
								buyEntries: purchases[symbol] || []
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderBookWidget, { stock })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-bold text-sm text-slate-900 dark:text-white mb-3",
							children: isCoin ? "가상자산 시장 정보 및 거래 사양" : "기업 가치평가 및 배당 정보"
						}), isCoin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 font-sans text-[11px] block",
										children: "거래 페어"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-cyan-600 dark:text-cyan-400 text-sm",
										children: stock.tradingPair || stock.symbol
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 font-sans text-[11px] block",
										children: "거래소"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-900 dark:text-white text-sm",
										children: stock.exchange === "UPBIT" ? "업비트 (Upbit)" : "바이낸스 (Binance)"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 font-sans text-[11px] block",
										children: "결제 통화"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-900 dark:text-white text-sm",
										children: stock.quoteCurrency || stock.currency
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 font-sans text-[11px] block",
										children: "자산 유형"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-900 dark:text-white text-sm",
										children: "현물 (Spot)"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 font-sans text-[11px] block",
										children: "투자유의 지정"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `font-bold text-sm ${stock.warning ? "text-amber-500" : "text-emerald-500"}`,
										children: stock.warning ? "유의 지정" : "정상 거래"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 font-sans text-[11px] block",
										children: "전일 종가"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-900 dark:text-white text-sm",
										children: stock.prevClose > 0 ? formatMoney(stock.prevClose, stockCur) : "-"
									})]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs font-mono",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 font-sans text-[11px] block",
										children: "시가총액"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-900 dark:text-white text-sm",
										children: formatMarketCapByCurrency(stock.marketCap, stockCur)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 font-sans text-[11px] block",
										children: "PER"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-900 dark:text-white text-sm",
										children: stock.per || "-"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 font-sans text-[11px] block",
										children: "PBR"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-900 dark:text-white text-sm",
										children: stock.pbr || "-"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 font-sans text-[11px] block",
										children: "EPS"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-900 dark:text-white text-sm",
										children: stock.eps ? formatMoney(stock.eps, stockCur) : "-"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 font-sans text-[11px] block",
										children: "배당수익률"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-emerald-500 text-sm",
										children: stock.dividendYield ? `${stock.dividendYield}%` : "-"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 font-sans text-[11px] block",
										children: "전일 종가"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-900 dark:text-white text-sm",
										children: stock.prevClose > 0 ? formatMoney(stock.prevClose, stockCur) : "-"
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockVolumeSection, { stock }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockNewsSection, { stock }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockCommunitySection, { stock }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockSmartAlertWidget, { stock }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockAiBriefingWidget, { stock })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SetPriceAlertModal, {
				isOpen: isAlertModalOpen,
				onClose: () => setIsAlertModalOpen(false),
				symbol: stock.symbol,
				symbolName: stock.name,
				currentPrice: stock.price
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MockTradeModal, {
				isOpen: isTradeModalOpen,
				onClose: () => setIsTradeModalOpen(false),
				symbol: stock.symbol,
				stockName: stock.name,
				defaultPrice: stock.price,
				initialType: "BUY"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VirtualHoldingModal, {
				isOpen: isHoldingModalOpen,
				onClose: () => setIsHoldingModalOpen(false),
				mode: "create",
				defaultSymbol: stock.symbol,
				onSuccess: () => {}
			})
		]
	});
};
//#endregion
export { StockDetailView };
