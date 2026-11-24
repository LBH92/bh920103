import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { $t as ChartNoAxesColumn, Ct as History, G as RefreshCw, Gt as CircleAlert, I as ShieldAlert, M as SlidersVertical, Qt as ChartPie, Vt as Coins, W as RotateCcw, Wt as CircleCheck, Xt as Check, Z as Pen, _ as TrendingDown, a as Wallet, an as Briefcase, bn as require_react, bt as Info, g as TrendingUp, h as TriangleAlert, i as X, nn as Calculator, pn as ArrowUpRight, q as Plus, v as Trash2, vn as ArrowDownRight, vt as Layers } from "./vendor-lucide-Dji_Ij8j.js";
import { C as inferStockExchange, T as validateExchangeRate, g as convertToKRW, h as aggregateMultiCurrencyPortfolio, n as useApp, o as stockRepository, v as formatMoney, w as roundByCurrency, x as inferFiatCurrency } from "./AppContext-Butl4QWq.js";
import { d as portfolioService, u as MockTradeModal } from "./index-DLz7vtf6.js";
import { t as VirtualHoldingModal } from "./VirtualHoldingModal-qItoljeC.js";
import { a as Bar, c as Cell, d as ResponsiveContainer, i as XAxis, l as Tooltip, n as BarChart, o as CartesianGrid, r as YAxis, s as Pie, t as PieChart, u as Legend } from "./vendor-recharts-Bm5JVR1s.js";
//#region src/components/portfolio/FeeSettingsModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var FeeSettingsModal = ({ isOpen, onClose, currentCommissionPercent, currentTaxPercent, onSave }) => {
	const [commission, setCommission] = (0, import_react.useState)(String(currentCommissionPercent));
	const [tax, setTax] = (0, import_react.useState)(String(currentTaxPercent));
	if (!isOpen) return null;
	const handleResetToDefault = () => {
		setCommission("0.015");
		setTax("0.18");
	};
	const handleSave = (e) => {
		e.preventDefault();
		const commNum = parseFloat(commission);
		const taxNum = parseFloat(tax);
		if (isNaN(commNum) || commNum < 0 || isNaN(taxNum) || taxNum < 0) {
			alert("유효한 수수료율과 세율을 입력해주세요.");
			return;
		}
		onSave(commNum, taxNum);
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2 rounded-xl bg-rose-500/10 text-rose-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-base text-slate-900 dark:text-white",
						children: "모의투자 수수료 및 거래세 설정"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400",
						children: "증권사별 조건에 맞게 수수료율과 세금을 사용자 지정합니다."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSave,
				className: "p-5 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-600 dark:text-blue-400 flex items-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-4 h-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "수수료와 거래세는 임의 확정되지 않으며, 사용자가 언제든지 변경할 수 있습니다. (수수료: 매수/매도 시 적용, 거래세: 매도 시 적용)" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold text-slate-700 dark:text-slate-300",
								children: "매매 수수료율 (%)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-slate-400",
								children: "국내 일반: 0.015% ~ 0.05%"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								step: "0.001",
								min: "0",
								max: "5",
								value: commission,
								onChange: (e) => setCommission(e.target.value),
								className: "w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500",
								placeholder: "0.015",
								required: true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute right-3.5 top-2.5 text-xs font-bold text-slate-400",
								children: "%"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2 mt-2",
							children: [
								0,
								.01,
								.015,
								.05
							].map((rate) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setCommission(String(rate)),
								className: "px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors",
								children: rate === 0 ? "무료(0%)" : `${rate}%`
							}, rate))
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold text-slate-700 dark:text-slate-300",
								children: "매도 증권거래세율 (%)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-slate-400",
								children: "KRX 기준: 0.18% (2024~2026년)"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								step: "0.01",
								min: "0",
								max: "5",
								value: tax,
								onChange: (e) => setTax(e.target.value),
								className: "w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500",
								placeholder: "0.18",
								required: true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute right-3.5 top-2.5 text-xs font-bold text-slate-400",
								children: "%"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2 mt-2",
							children: [
								0,
								.15,
								.18,
								.2
							].map((rate) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setTax(String(rate)),
								className: "px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors",
								children: rate === 0 ? "비과세(0%)" : `${rate}%`
							}, rate))
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleResetToDefault,
							className: "flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "기본값 초기화" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onClose,
								className: "px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
								children: "취소"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								className: "flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all active:scale-95",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "설정 적용" })]
							})]
						})]
					})
				]
			})]
		})
	});
};
//#endregion
//#region src/components/portfolio/PortfolioCharts.tsx
var PALETTE = [
	"#f43f5e",
	"#3b82f6",
	"#10b981",
	"#f59e0b",
	"#8b5cf6",
	"#06b6d4",
	"#ec4899",
	"#64748b"
];
var PortfolioCharts = ({ holdings, quotesMap, exchangeRate, onSelectStock }) => {
	const fxCheck = validateExchangeRate(exchangeRate);
	if (holdings.some((h) => inferFiatCurrency(h.symbol, h.market, h.currency) === "USD") && !fxCheck.valid) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 shadow-sm text-center space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-10 h-10 rounded-xl bg-rose-500/15 text-rose-500 mx-auto flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-5 h-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "font-bold text-sm text-rose-700 dark:text-rose-300",
				children: "환율 정보 지연/오류로 통화 혼합 포트폴리오 차트 환산을 일시 중단했습니다"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-rose-600/90 dark:text-rose-400",
				children: fxCheck.reason || "실시간 USD/KRW 환율이 정상 수신되면 KRW 및 USD 자산을 기준통화로 환산해 차트를 표시합니다."
			})
		]
	});
	const rate = fxCheck.rate ?? 1;
	const chartData = holdings.map((h) => {
		const quote = quotesMap.get(h.symbol);
		const cur = inferFiatCurrency(h.symbol, h.market, h.currency);
		const isUSD = cur === "USD";
		const nativeValuation = (quote?.price || 0) * h.quantity;
		const nativeCost = h.totalBuyAmount;
		const nativeProfit = nativeValuation - nativeCost;
		const valuationKRW = isUSD ? nativeValuation * rate : nativeValuation;
		const costKRW = isUSD ? nativeCost * rate : nativeCost;
		const profitKRW = valuationKRW - costKRW;
		const profitRate = nativeCost > 0 ? nativeProfit / nativeCost * 100 : 0;
		return {
			symbol: h.symbol,
			name: h.name || h.symbol,
			valuation: Math.max(0, Math.round(valuationKRW)),
			profit: Math.round(profitKRW),
			cost: Math.round(costKRW),
			nativeValuation,
			nativeCost,
			nativeProfit,
			profitRate: Number(profitRate.toFixed(2)),
			quantity: h.quantity,
			currency: cur
		};
	}).filter((d) => d.valuation > 0 || Math.abs(d.profit) > 0);
	const totalValuation = chartData.reduce((sum, d) => sum + d.valuation, 0);
	if (chartData.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "w-6 h-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "font-bold text-sm text-slate-800 dark:text-slate-200",
				children: "차트를 표시할 보유 자산 데이터가 없습니다."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-slate-500 mt-1",
				children: "종목을 등록하시면 자산 비중과 평가손익 차트가 실시간으로 시각화됩니다."
			})
		]
	});
	const handleItemClick = (sym) => {
		if (sym && typeof sym === "string" && onSelectStock) onSelectStock(sym);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 lg:grid-cols-2 gap-6 select-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-6 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm outline-none focus:outline-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "w-4 h-4 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-sm sm:text-base text-slate-900 dark:text-white",
						children: "자산 비중 (KRW 환산 기준)"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[11px] text-slate-400 font-mono",
					children: ["총 평가액 ", formatMoney(totalValuation, "KRW")]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				tabIndex: -1,
				style: { outline: "none" },
				className: "w-full h-[300px] outline-none focus:outline-none focus:ring-0 [&_*]:outline-none [&_*:focus]:outline-none [&_.recharts-surface]:outline-none [&_.recharts-pie]:outline-none [&_path]:outline-none cursor-pointer",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, {
						style: { outline: "none" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: chartData,
								dataKey: "valuation",
								nameKey: "name",
								cx: "50%",
								cy: "50%",
								outerRadius: 95,
								innerRadius: 45,
								paddingAngle: 3,
								isAnimationActive: false,
								onClick: (entry) => handleItemClick(entry?.symbol),
								children: chartData.map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
									fill: PALETTE[index % PALETTE.length],
									style: {
										outline: "none",
										cursor: "pointer"
									}
								}, `cell-pie-${index}`))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active, payload }) => {
								if (active && payload && payload.length) {
									const data = payload[0].payload;
									const weight = totalValuation > 0 ? (data.valuation / totalValuation * 100).toFixed(1) : "0";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-white dark:bg-[#1c2333] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl text-xs space-y-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-1.5 font-bold",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-900 dark:text-white",
													children: data.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] text-slate-400 font-mono",
													children: [
														data.symbol,
														" · ",
														data.currency
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-4 pt-1 text-slate-600 dark:text-slate-300",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "평가금액:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono font-bold text-slate-900 dark:text-white",
													children: [formatMoney(data.nativeValuation, data.currency), data.currency === "USD" && ` (≈ ${formatMoney(data.valuation, "KRW")})`]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-4 text-slate-600 dark:text-slate-300",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "비중:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono font-bold text-rose-500",
													children: [weight, "%"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-slate-400 pt-1 text-center",
												children: "클릭 시 종목 상세 이동"
											})
										]
									});
								}
								return null;
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { formatter: (value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium text-slate-600 dark:text-slate-300 mr-2",
								children: value
							}) })
						]
					})
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-6 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm outline-none focus:outline-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { className: "w-4 h-4 text-blue-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-sm sm:text-base text-slate-900 dark:text-white",
						children: "종목별 평가손익 (KRW 환산 기준)"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] text-slate-400 font-sans",
					children: "손익(₩) / 클릭 시 종목 이동"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				tabIndex: -1,
				style: { outline: "none" },
				className: "w-full h-[300px] outline-none focus:outline-none focus:ring-0 [&_*]:outline-none [&_*:focus]:outline-none [&_.recharts-surface]:outline-none [&_path]:outline-none cursor-pointer",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: chartData,
						style: { outline: "none" },
						onClick: (state) => {
							const sym = state?.activePayload?.[0]?.payload?.symbol || state?.symbol;
							handleItemClick(sym);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								stroke: "#334155",
								opacity: .25
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "name",
								tick: {
									fill: "#94a3b8",
									fontSize: 11
								},
								stroke: "#64748b"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: {
									fill: "#94a3b8",
									fontSize: 10
								},
								stroke: "#64748b",
								tickFormatter: (val) => {
									if (Math.abs(val) >= 1e7) return `${(val / 1e8).toFixed(1)}억`;
									if (Math.abs(val) >= 1e4) return `${(val / 1e4).toFixed(0)}만`;
									return `${val}`;
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active, payload }) => {
								if (active && payload && payload.length) {
									const data = payload[0].payload;
									const isProfit = data.nativeProfit >= 0;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-white dark:bg-[#1c2333] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl text-xs space-y-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-1.5 font-bold",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-900 dark:text-white",
													children: data.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] text-slate-400 font-mono",
													children: [
														data.symbol,
														" · ",
														data.currency
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-4 pt-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-600 dark:text-slate-300",
													children: "원화환산 손익:"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: `font-mono font-bold ${data.profit >= 0 ? "text-rose-500" : "text-blue-500"}`,
													children: [
														formatMoney(data.profit, "KRW", { showSign: true }),
														" (",
														isProfit ? "+" : "",
														data.profitRate,
														"%)"
													]
												})]
											}),
											data.currency === "USD" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-4 text-slate-600 dark:text-slate-300",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "원화 외 종목손익:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `font-mono font-bold ${isProfit ? "text-rose-500" : "text-blue-500"}`,
													children: formatMoney(data.nativeProfit, "USD", { showSign: true })
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-4 text-slate-600 dark:text-slate-300",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "투자원금:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono",
													children: formatMoney(data.nativeCost, data.currency)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-4 text-slate-600 dark:text-slate-300",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "현재평가액:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono",
													children: formatMoney(data.nativeValuation, data.currency)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-slate-400 pt-1 text-center",
												children: "클릭 시 종목 상세 이동"
											})
										]
									});
								}
								return null;
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "profit",
								radius: [
									4,
									4,
									0,
									0
								],
								isAnimationActive: false,
								style: { cursor: "pointer" },
								children: chartData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
									fill: entry.profit >= 0 ? "#f43f5e" : "#3b82f6",
									style: {
										outline: "none",
										cursor: "pointer"
									}
								}, `cell-bar-${index}`))
							})
						]
					})
				})
			})]
		})]
	});
};
//#endregion
//#region src/services/portfolioAnalyzerService.ts
var portfolioAnalyzerService = { async getPortfolioSummary(uid, exchangeRate) {
	const [holdings, trades, account, fx] = await Promise.all([
		portfolioService.getVirtualHoldings(uid),
		portfolioService.getVirtualHoldingTrades(uid),
		portfolioService.getMockAccount(uid),
		exchangeRate ? Promise.resolve(exchangeRate) : stockRepository.getExchangeRate().catch(() => null)
	]);
	const portfolioHoldings = [];
	const aggregatablePositions = [];
	for (const h of holdings) {
		const stock = await stockRepository.getStock(h.symbol);
		const currency = inferFiatCurrency(h.symbol, h.market, h.currency);
		const exchange = inferStockExchange(h.symbol, h.market, h.exchange);
		const currentPrice = stock?.price && stock.price > 0 ? stock.price : h.avgBuyPrice;
		const marketValue = roundByCurrency(currentPrice * h.quantity, currency);
		const cost = roundByCurrency(h.avgBuyPrice * h.quantity, currency);
		const pnl = roundByCurrency(marketValue - cost, currency);
		aggregatablePositions.push({
			symbol: h.symbol,
			currency,
			market: h.market,
			quantity: h.quantity,
			avgBuyPrice: h.avgBuyPrice,
			totalCost: h.totalBuyAmount || cost,
			currentPrice,
			entryExchangeRate: h.entryExchangeRate
		});
		portfolioHoldings.push({
			id: h.id,
			symbol: h.symbol,
			name: h.name,
			quantity: h.quantity,
			avgBuyPrice: h.avgBuyPrice,
			currentPrice,
			marketValue,
			unrealizedPnL: pnl,
			unrealizedPnLRate: cost > 0 ? Number((pnl / cost * 100).toFixed(2)) : 0,
			weight: 0,
			sector: stock?.sector || "기타",
			market: h.market || (currency === "USD" ? "US" : "KOSPI"),
			exchange,
			currency
		});
	}
	const aggregated = aggregateMultiCurrencyPortfolio({
		positions: aggregatablePositions,
		realizedTrades: trades,
		cashKRW: account.currentCash,
		initialCashKRW: account.initialBalance,
		cashUSD: account.currentCashUsd ?? 0,
		initialCashUSD: account.initialBalanceUsd ?? 0,
		fx,
		fallbackValuationToCost: true
	});
	const krwEvalTotal = aggregated.convertedKRW ? aggregated.convertedKRW.evaluationAmount : aggregated.krw.evaluationAmount;
	portfolioHoldings.forEach((h) => {
		if (aggregated.usd.holdingsCount === 0) h.weight = krwEvalTotal > 0 ? Number((h.marketValue / krwEvalTotal * 100).toFixed(1)) : 0;
		else if (aggregated.fx.valid && krwEvalTotal > 0) {
			const conv = convertToKRW(h.marketValue, h.currency, fx);
			h.weight = conv.valid && conv.valueKRW !== null ? Number((conv.valueKRW / krwEvalTotal * 100).toFixed(1)) : 0;
		} else h.weight = 0;
	});
	const conv = aggregated.convertedKRW;
	return {
		totalAssets: conv ? conv.totalAssets : aggregated.krw.totalAssets,
		totalCash: conv ? conv.totalCash : aggregated.krw.cash,
		totalInvested: conv ? conv.investedCost : aggregated.krw.investedCost,
		evaluationAmount: conv ? conv.evaluationAmount : aggregated.krw.evaluationAmount,
		unrealizedPnL: conv ? conv.unrealizedPnL : aggregated.krw.unrealizedPnL,
		realizedPnL: conv ? conv.realizedPnL : aggregated.krw.realizedPnL,
		totalPnL: conv ? conv.totalPnL : aggregated.krw.totalPnL,
		roi: conv ? conv.returnRatePercent : aggregated.krw.returnRatePercent,
		currency: "KRW",
		krw: {
			currency: "KRW",
			totalAssets: aggregated.krw.totalAssets,
			totalCash: aggregated.krw.cash,
			totalInvested: aggregated.krw.investedCost,
			evaluationAmount: aggregated.krw.evaluationAmount,
			unrealizedPnL: aggregated.krw.unrealizedPnL,
			realizedPnL: aggregated.krw.realizedPnL,
			totalPnL: aggregated.krw.totalPnL,
			roi: aggregated.krw.returnRatePercent,
			holdingsCount: aggregated.krw.holdingsCount
		},
		usd: {
			currency: "USD",
			totalAssets: aggregated.usd.totalAssets,
			totalCash: aggregated.usd.cash,
			totalInvested: aggregated.usd.investedCost,
			evaluationAmount: aggregated.usd.evaluationAmount,
			unrealizedPnL: aggregated.usd.unrealizedPnL,
			realizedPnL: aggregated.usd.realizedPnL,
			totalPnL: aggregated.usd.totalPnL,
			roi: aggregated.usd.returnRatePercent,
			holdingsCount: aggregated.usd.holdingsCount
		},
		fxRate: aggregated.fx.rate,
		fxTimestamp: aggregated.fx.lastUpdated,
		fxValid: aggregated.fx.valid,
		fxStatus: aggregated.fx.status,
		stockPnLKRW: conv ? conv.stockPnLKRW : null,
		fxPnLKRW: conv ? conv.fxPnLKRW : null,
		hasEntryFxData: conv ? conv.hasEntryFxData : false,
		holdings: portfolioHoldings,
		sectorAllocations: [],
		marketAllocations: [],
		lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
	};
} };
//#endregion
//#region src/components/portfolio/AverageBuyPriceSimulator.tsx
var AverageBuyPriceSimulator = ({ uid, holdingId, symbol, name, currency = "KRW", currentQty, currentAvgPrice, currentPrice, commissionRate = 15e-5, taxRate = .0018, onBuySuccess, onClose }) => {
	const { showToast, exchangeRate } = useApp();
	const fxCheck = validateExchangeRate(exchangeRate);
	const validFxRate = fxCheck.valid && fxCheck.rate ? fxCheck.rate : void 0;
	const isUSD = currency === "USD";
	const defaultPrice = currentPrice && currentPrice > 0 ? currentPrice : currentAvgPrice;
	const [addQty, setAddQty] = (0, import_react.useState)("10");
	const [addPrice, setAddPrice] = (0, import_react.useState)(defaultPrice.toString());
	const [targetROI, setTargetROI] = (0, import_react.useState)("10");
	const [memo, setMemo] = (0, import_react.useState)("분할 매수 (물타기)");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [errorMsg, setErrorMsg] = (0, import_react.useState)(null);
	const numAddQty = Math.max(0, parseFloat(addQty) || 0);
	const numAddPrice = Math.max(0, parseFloat(addPrice) || 0);
	const numTargetROI = parseFloat(targetROI) || 0;
	const totalQty = currentQty + numAddQty;
	const prevTotalCost = currentQty * currentAvgPrice;
	const addTotalCost = numAddQty * numAddPrice;
	const newTotalAmount = prevTotalCost + addTotalCost;
	const newAvgPrice = totalQty > 0 ? newTotalAmount / totalQty : currentAvgPrice;
	const avgPriceDiff = newAvgPrice - currentAvgPrice;
	const avgPriceDiffPercent = currentAvgPrice > 0 ? avgPriceDiff / currentAvgPrice * 100 : 0;
	const addCommission = addTotalCost * commissionRate;
	const breakEvenPrice = totalQty > 0 ? newAvgPrice * (1 + commissionRate) / Math.max(.001, 1 - commissionRate - taxRate) : newAvgPrice;
	const targetPrice = newAvgPrice * (1 + numTargetROI / 100);
	const expectedGrossProfit = targetPrice * totalQty - newTotalAmount;
	const estimatedSellFeeAndTax = targetPrice * totalQty * (commissionRate + taxRate);
	const expectedNetProfit = expectedGrossProfit - newTotalAmount * commissionRate - estimatedSellFeeAndTax;
	const handleExecuteBuy = async () => {
		if (numAddQty <= 0) {
			setErrorMsg("추가 매수 수량은 1 이상이어야 합니다.");
			return;
		}
		if (numAddPrice <= 0) {
			setErrorMsg("추가 매수 가격을 0보다 크게 입력해주세요.");
			return;
		}
		setErrorMsg(null);
		setIsSubmitting(true);
		try {
			let targetHoldingId = holdingId;
			if (!targetHoldingId) {
				const match = (await portfolioService.getVirtualHoldings(uid)).find((h) => h.symbol === symbol);
				if (match) targetHoldingId = match.id;
				else targetHoldingId = (await portfolioService.saveVirtualHolding(uid, {
					symbol,
					name: name || symbol,
					market: isUSD ? "US" : "KOSPI",
					currency,
					quantity: numAddQty,
					avgBuyPrice: numAddPrice,
					buyDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
					entryExchangeRate: isUSD ? validFxRate : void 0,
					memo: memo || "최초 매수"
				})).id;
			}
			if (targetHoldingId && holdingId) await portfolioService.addBuyVirtualHolding(uid, targetHoldingId, numAddQty, numAddPrice, (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), memo || `물타기 추가매수 (${numAddQty}주 @ ${formatMoney(numAddPrice, currency)})`, isUSD ? validFxRate : void 0);
			showToast(`${name || symbol} ${numAddQty.toLocaleString()}주 물타기(추가 매수)가 반영되었습니다.`, "success");
			onBuySuccess?.();
			onClose?.();
		} catch (err) {
			console.error("[AverageBuyPriceSimulator] Execute buy failed:", err);
			setErrorMsg(err?.message || "추가 매수 처리에 실패했습니다. 다시 시도해주세요.");
			showToast("추가 매수 처리 중 오류가 발생했습니다.", "error");
		} finally {
			setIsSubmitting(false);
		}
	};
	const formatMoney$1 = (val) => formatMoney(val, currency);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-5 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-5 animate-in fade-in duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: name || symbol }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono",
								children: symbol
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-normal text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full",
								children: "물타기 평단가 계산기"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-slate-400",
						children: [
							"현재 보유: ",
							currentQty.toLocaleString(),
							"주 · 평균단가 ",
							formatMoney$1(currentAvgPrice)
						]
					})] })]
				}), onClose && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1",
					children: "닫기 ✕"
				})]
			}),
			errorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errorMsg })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5",
						children: "추가 매수 수량 (주)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: "1",
							value: addQty,
							onChange: (e) => setAddQty(e.target.value),
							className: "w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500",
							placeholder: "예: 10"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none",
							children: "주"
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5",
						children: [
							"추가 매수 단가 (",
							isUSD ? "USD $" : "원",
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							step: isUSD ? "0.01" : "1",
							min: "0",
							value: addPrice,
							onChange: (e) => setAddPrice(e.target.value),
							className: "w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500",
							placeholder: isUSD ? "예: 150.00" : "예: 70000"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none",
							children: isUSD ? "$" : "원"
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5",
						children: "목표 수익률 (%)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							step: "0.5",
							value: targetROI,
							onChange: (e) => setTargetROI(e.target.value),
							className: "w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500",
							placeholder: "예: 10"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none",
							children: "%"
						})]
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5",
				children: "매매 메모 / 사유"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "text",
				value: memo,
				onChange: (e) => setMemo(e.target.value),
				className: "w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500",
				placeholder: "예: 지지선 도달 분할 매수"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
						className: "text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-3.5 h-3.5 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "물타기 후 예상 포트폴리오 변화" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-slate-400 font-normal",
							children: "가중평균 공식: ((기존금액 + 추가금액) / 총수량)"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-lg bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-slate-500 dark:text-slate-400 block mb-1",
										children: "새로운 평균 매입단가"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm sm:text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 block",
										children: formatMoney$1(newAvgPrice)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-[10px] font-mono flex items-center gap-0.5 mt-0.5 ${avgPriceDiff < 0 ? "text-blue-500" : avgPriceDiff > 0 ? "text-rose-500" : "text-slate-400"}`,
										children: avgPriceDiff < 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"단가 ",
											formatMoney$1(Math.abs(avgPriceDiff)),
											" 인하 (",
											avgPriceDiffPercent.toFixed(2),
											"%)"
										] })] }) : avgPriceDiff > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"단가 ",
											formatMoney$1(avgPriceDiff),
											" 상승 (+",
											avgPriceDiffPercent.toFixed(2),
											"%)"
										] })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "변동 없음" })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-lg bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-slate-500 dark:text-slate-400 block mb-1",
										children: "합산 총 보유 수량"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white block",
										children: [totalQty.toLocaleString(), "주"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-slate-400 font-mono block mt-0.5",
										children: [
											"기존 ",
											currentQty,
											"주 + 추가 ",
											numAddQty,
											"주"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-lg bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-slate-500 dark:text-slate-400 block mb-1",
										children: "손익분기점 (수수료·세금 포함)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white block",
										children: formatMoney$1(breakEvenPrice)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-slate-400 block mt-0.5",
										children: [
											"수수료 ",
											(commissionRate * 100).toFixed(3),
											"% · 세금 ",
											(taxRate * 100).toFixed(2),
											"%"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-lg bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] text-slate-500 dark:text-slate-400 block mb-1",
										children: [
											"목표(",
											numTargetROI,
											"%) 순익"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `text-sm sm:text-base font-bold font-mono block ${expectedNetProfit >= 0 ? "text-rose-500" : "text-blue-500"}`,
										children: [expectedNetProfit >= 0 ? "+" : "", formatMoney$1(expectedNetProfit)]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-slate-400 font-mono block mt-0.5",
										children: ["목표가 ", formatMoney$1(targetPrice)]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["이번 추가 매수 필요 금액: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "font-mono text-slate-700 dark:text-slate-300",
							children: formatMoney$1(addTotalCost)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["예상 수수료: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "font-mono text-slate-700 dark:text-slate-300",
							children: formatMoney$1(addCommission)
						})] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-end gap-3 pt-2",
				children: [onClose && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors",
					children: "취소"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: isSubmitting || numAddQty <= 0 || numAddPrice <= 0,
					onClick: handleExecuteBuy,
					className: "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20",
					children: isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "물타기 자산 반영 중..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "물타기(추가 매수) 실행 및 자산 반영" })] })
				})]
			})
		]
	});
};
//#endregion
//#region src/components/portfolio/PortfolioAnalyzer.tsx
var PortfolioAnalyzer = ({ uid, onUpdated, onSelectStock }) => {
	const { exchangeRate } = useApp();
	const [summary, setSummary] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [refreshing, setRefreshing] = (0, import_react.useState)(false);
	const [selectedHolding, setSelectedHolding] = (0, import_react.useState)(null);
	const fetchData = (0, import_react.useCallback)(async (isSilent = false) => {
		if (!isSilent) setLoading(true);
		else setRefreshing(true);
		try {
			const data = await portfolioAnalyzerService.getPortfolioSummary(uid, exchangeRate);
			setSummary(data);
		} catch (err) {
			console.warn("[PortfolioAnalyzer] fetchData error:", err);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, [uid, exchangeRate]);
	(0, import_react.useEffect)(() => {
		fetchData();
	}, [fetchData]);
	const handleHoldingUpdate = () => {
		fetchData(true);
		onUpdated?.();
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center gap-3 text-slate-500 text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 animate-spin text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "포트폴리오 자산 분석 데이터를 불러오는 중..." })]
	});
	if (!summary) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-6 h-6 text-amber-500 mx-auto" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-bold text-slate-800 dark:text-slate-200",
				children: "포트폴리오 자산 데이터를 불러오지 못했습니다."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => fetchData(),
				className: "px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold",
				children: "다시 시도"
			})
		]
	});
	const isProfit = summary.totalPnL >= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-5 sm:p-6 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2.5 rounded-xl bg-rose-500/10 text-rose-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base sm:text-lg font-bold text-slate-900 dark:text-white",
						children: "포트폴리오 자산 분석 요약"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-400",
						children: "가상 보유 자산과 모의투자 잔고를 종합 분석한 실시간 포트폴리오 지표입니다."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => fetchData(true),
					disabled: refreshing,
					className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors self-start sm:self-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3.5 h-3.5 ${refreshing ? "animate-spin text-rose-500" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "새로고침" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "기준통화(KRW) 환산 총자산" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-4 h-4 text-slate-400" })]
						}), summary.fxValid ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white",
							children: formatMoney(summary.totalAssets, "KRW")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] text-slate-400 font-mono block",
							children: [
								"현금 ",
								formatMoney(summary.totalCash, "KRW"),
								" · 환율 ₩",
								summary.fxRate?.toLocaleString("ko-KR", { maximumFractionDigits: 2 }),
								" (",
								summary.fxTimestamp,
								")"
							]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-bold text-rose-500",
							children: "환율 미확인 (원화 환산 보류)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] text-slate-400 font-mono block mt-1",
							children: [
								"KRW ",
								formatMoney(summary.krw?.totalAssets ?? 0, "KRW"),
								" / USD ",
								formatMoney(summary.usd?.totalAssets ?? 0, "USD")
							]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "통합 손익 (종목 / 환차익)" }), isProfit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 text-rose-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-4 h-4 text-blue-500" })]
						}), summary.fxValid ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `text-lg sm:text-xl font-black font-mono ${isProfit ? "text-rose-500" : "text-blue-500"}`,
							children: formatMoney(summary.totalPnL, "KRW", { showSign: true })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] font-mono text-slate-500 block",
							children: [
								"종목 ",
								formatMoney(summary.stockPnLKRW ?? 0, "KRW", { showSign: true }),
								" · 환율 ",
								formatMoney(summary.fxPnLKRW ?? 0, "KRW", { showSign: true }),
								" (",
								isProfit ? "+" : "",
								summary.roi.toFixed(2),
								"%)"
							]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-bold text-rose-500",
							children: "환율 오류로 통합 손익 계산 보류"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-slate-500 dark:text-slate-400 text-xs block mb-1",
								children: [
									"국내(KRW) 자산 (",
									summary.krw?.holdingsCount ?? 0,
									"종목)"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white",
								children: formatMoney(summary.krw?.evaluationAmount ?? 0, "KRW")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-slate-400 font-mono block",
								children: [
									"현금 ",
									formatMoney(summary.krw?.totalCash ?? 0, "KRW"),
									" · 손익 ",
									formatMoney(summary.krw?.unrealizedPnL ?? 0, "KRW", { showSign: true })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-slate-500 dark:text-slate-400 text-xs block mb-1",
								children: [
									"해외(USD) 자산 (",
									summary.usd?.holdingsCount ?? 0,
									"종목)"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white",
								children: formatMoney(summary.usd?.evaluationAmount ?? 0, "USD")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-slate-400 font-mono block",
								children: [
									"현금 ",
									formatMoney(summary.usd?.totalCash ?? 0, "USD"),
									" · 손익 ",
									formatMoney(summary.usd?.unrealizedPnL ?? 0, "USD", { showSign: true })
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "보유 종목 현황" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono",
						children: [
							"총 ",
							summary.holdings.length,
							"종목"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] text-slate-400",
					children: "물타기(추가 매수) 버튼을 클릭하여 단가를 재계산하고 즉시 반영하세요."
				})]
			}), summary.holdings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-12 text-center rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-400",
					children: "등록된 보유 종목이 없습니다."
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-xs border-collapse",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-[11px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "종목코드 / 종목명"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-3 text-right",
								children: "보유 수량"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-3 text-right",
								children: "평균 매입단가"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-3 text-right",
								children: "현재가"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-3 text-right",
								children: "현재 평가금액"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-3 text-right",
								children: "평가손익 (수익률)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-3 text-right",
								children: "자산 비중"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4 text-center",
								children: "관리 / 물타기"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-slate-100 dark:divide-slate-800/60 font-mono",
						children: summary.holdings.map((h) => {
							const isHoldingProfit = h.unrealizedPnL >= 0;
							const isSelected = selectedHolding?.symbol === h.symbol;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: `hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors ${isSelected ? "bg-emerald-500/5 dark:bg-emerald-500/10" : ""}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3 px-4 font-sans",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => onSelectStock?.(h.symbol),
											className: "font-bold text-slate-900 dark:text-white hover:text-rose-500 flex items-center gap-1 group text-left",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: h.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-3 h-3 opacity-0 group-hover:opacity-100 text-rose-500" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 mt-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-slate-400 font-mono",
												children: h.symbol
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold",
												children: [
													inferStockExchange(h.symbol, h.market, h.exchange),
													" · ",
													h.currency
												]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3 px-3 text-right font-bold text-slate-900 dark:text-white",
										children: [h.quantity.toLocaleString(), "주"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-3 text-right text-slate-700 dark:text-slate-300",
										children: formatMoney(h.avgBuyPrice, h.currency)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-3 text-right font-bold text-slate-900 dark:text-white",
										children: formatMoney(h.currentPrice, h.currency)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-3 text-right font-bold text-slate-900 dark:text-white",
										children: formatMoney(h.marketValue, h.currency)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: isHoldingProfit ? "text-rose-500 font-bold" : "text-blue-500 font-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(h.unrealizedPnL, h.currency, { showSign: true }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] block",
												children: [
													"(",
													isHoldingProfit ? "+" : "",
													h.unrealizedPnLRate.toFixed(2),
													"%)"
												]
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-3 text-right font-bold text-slate-600 dark:text-slate-300",
										children: summary.fxValid || (summary.usd?.holdingsCount ?? 0) === 0 ? `${h.weight.toFixed(1)}%` : "-"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setSelectedHolding(isSelected ? null : h),
											className: `px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${isSelected ? "bg-emerald-600 text-white shadow-sm" : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"}`,
											title: "물타기 시뮬레이션 및 추가 매수 실행",
											children: isSelected ? "닫기" : "물타기 (추가 매수)"
										})
									})
								]
							}, h.symbol);
						})
					})]
				})
			})] }),
			selectedHolding && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pt-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AverageBuyPriceSimulator, {
					uid,
					holdingId: selectedHolding.id,
					symbol: selectedHolding.symbol,
					name: selectedHolding.name,
					currency: selectedHolding.currency,
					currentQty: selectedHolding.quantity,
					currentAvgPrice: selectedHolding.avgBuyPrice,
					currentPrice: selectedHolding.currentPrice,
					commissionRate: 15e-5,
					taxRate: .0018,
					onBuySuccess: handleHoldingUpdate,
					onClose: () => setSelectedHolding(null)
				})
			})
		]
	});
};
//#endregion
//#region src/services/dividendService.ts
var MASTER_DIVIDEND_RECORDS = {
	"005930": {
		name: "삼성전자",
		market: "KR",
		currency: "KRW",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "QUARTERLY",
		frequencyLabel: "분기배당 (연 4회)",
		annualDPS: 1444,
		lastDPS: 361,
		fiscalYear: "2025/2026 회계연도",
		exDividendDate: "2026-03-30",
		recordDate: "2026-03-31",
		payDate: "2026-05-18",
		source: "한국예탁결제원(SEIBro) 및 금융감독원 DART 공시",
		sourceUrl: "https://dart.fss.or.kr",
		dividendYield: 2.1,
		asOf: "2026-10-15",
		notes: "보통주 1주당 분기 361원 정기 배당금 확정 지급"
	},
	"005935": {
		name: "삼성전자우",
		market: "KR",
		currency: "KRW",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "QUARTERLY",
		frequencyLabel: "분기배당 (연 4회)",
		annualDPS: 1445,
		lastDPS: 361.5,
		fiscalYear: "2025/2026 회계연도",
		exDividendDate: "2026-03-30",
		recordDate: "2026-03-31",
		payDate: "2026-05-18",
		source: "한국예탁결제원(SEIBro)",
		sourceUrl: "https://www.seibro.or.kr",
		dividendYield: 2.5,
		asOf: "2026-10-15",
		notes: "우선주 1원 추가 배당 정관 반영"
	},
	"000660": {
		name: "SK하이닉스",
		market: "KR",
		currency: "KRW",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "ANNUAL",
		frequencyLabel: "결산배당 (연 1회)",
		annualDPS: 1200,
		lastDPS: 1200,
		fiscalYear: "2025 회계연도 결산",
		exDividendDate: "2026-12-29",
		recordDate: "2026-12-31",
		payDate: "2026-04-10",
		source: "금융감독원 DART 정기공시",
		sourceUrl: "https://dart.fss.or.kr",
		dividendYield: .65,
		asOf: "2026-10-15",
		notes: "주당 1,200원 현금배당 주주총회 결의"
	},
	"005380": {
		name: "현대차",
		market: "KR",
		currency: "KRW",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "QUARTERLY",
		frequencyLabel: "분기배당 (연 4회)",
		annualDPS: 12e3,
		lastDPS: 2e3,
		fiscalYear: "2025/2026 회계연도",
		exDividendDate: "2026-09-29",
		recordDate: "2026-09-30",
		payDate: "2026-11-14",
		source: "현대자동차 IR 뉴스룸 및 DART",
		sourceUrl: "https://dart.fss.or.kr",
		dividendYield: 5.1,
		asOf: "2026-10-15",
		notes: "분기당 2,000원 + 결산 6,000원 등 주주환원율 확대"
	},
	"000270": {
		name: "기아",
		market: "KR",
		currency: "KRW",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "ANNUAL",
		frequencyLabel: "결산배당 (연 1회)",
		annualDPS: 5600,
		lastDPS: 5600,
		fiscalYear: "2025 회계연도 결산",
		exDividendDate: "2026-12-29",
		payDate: "2026-04-15",
		source: "금융감독원 DART",
		dividendYield: 5.7,
		asOf: "2026-10-15"
	},
	"105560": {
		name: "KB금융",
		market: "KR",
		currency: "KRW",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "QUARTERLY",
		frequencyLabel: "분기배당 (연 4회)",
		annualDPS: 3060,
		lastDPS: 765,
		fiscalYear: "2025/2026 회계연도",
		exDividendDate: "2026-09-29",
		payDate: "2026-11-20",
		source: "한국예탁결제원(SEIBro)",
		dividendYield: 3.6,
		asOf: "2026-10-15"
	},
	"055550": {
		name: "신한지주",
		market: "KR",
		currency: "KRW",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "QUARTERLY",
		frequencyLabel: "분기배당 (연 4회)",
		annualDPS: 2160,
		lastDPS: 540,
		fiscalYear: "2025/2026 회계연도",
		exDividendDate: "2026-09-29",
		payDate: "2026-11-18",
		source: "금융감독원 DART",
		dividendYield: 4.1,
		asOf: "2026-10-15"
	},
	"086790": {
		name: "하나금융지주",
		market: "KR",
		currency: "KRW",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "QUARTERLY",
		frequencyLabel: "분기배당 (연 4회)",
		annualDPS: 3400,
		lastDPS: 600,
		fiscalYear: "2025/2026 회계연도",
		exDividendDate: "2026-09-29",
		payDate: "2026-11-15",
		source: "금융감독원 DART",
		dividendYield: 5.4,
		asOf: "2026-10-15"
	},
	"005490": {
		name: "POSCO홀딩스",
		market: "KR",
		currency: "KRW",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "QUARTERLY",
		frequencyLabel: "분기배당 (연 4회)",
		annualDPS: 1e4,
		lastDPS: 2500,
		fiscalYear: "2025/2026 회계연도",
		exDividendDate: "2026-09-29",
		payDate: "2026-11-25",
		source: "금융감독원 DART",
		dividendYield: 2.9,
		asOf: "2026-10-15"
	},
	"088980": {
		name: "맥쿼리인프라",
		market: "KR",
		currency: "KRW",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "SEMI_ANNUAL",
		frequencyLabel: "반기배당 (연 2회)",
		annualDPS: 780,
		lastDPS: 390,
		fiscalYear: "2025/2026 회계연도",
		exDividendDate: "2026-06-29",
		payDate: "2026-08-28",
		source: "맥쿼리인프라 공식 IR",
		dividendYield: 6.4,
		asOf: "2026-10-15",
		notes: "인프라펀드 대표 고배당주, 6월/12월 반기 분배"
	},
	"033780": {
		name: "KT&G",
		market: "KR",
		currency: "KRW",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "SEMI_ANNUAL",
		frequencyLabel: "반기배당 (연 2회)",
		annualDPS: 5200,
		lastDPS: 1200,
		fiscalYear: "2025/2026 회계연도",
		exDividendDate: "2026-06-29",
		payDate: "2026-08-20",
		source: "금융감독원 DART",
		dividendYield: 5.2,
		asOf: "2026-10-15"
	},
	"035420": {
		name: "NAVER",
		market: "KR",
		currency: "KRW",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "ANNUAL",
		frequencyLabel: "결산배당 (연 1회)",
		annualDPS: 1190,
		lastDPS: 1190,
		fiscalYear: "2025 회계연도 결산",
		exDividendDate: "2026-12-29",
		payDate: "2026-04-12",
		source: "금융감독원 DART",
		dividendYield: .7,
		asOf: "2026-10-15"
	},
	"035720": {
		name: "카카오",
		market: "KR",
		currency: "KRW",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "ANNUAL",
		frequencyLabel: "결산배당 (연 1회)",
		annualDPS: 61,
		lastDPS: 61,
		fiscalYear: "2025 회계연도 결산",
		exDividendDate: "2026-12-29",
		payDate: "2026-04-18",
		source: "금융감독원 DART",
		dividendYield: .15,
		asOf: "2026-10-15"
	},
	"458730": {
		name: "TIGER 미국배당다우존스",
		market: "KR",
		currency: "KRW",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "MONTHLY",
		frequencyLabel: "월배당 (연 12회)",
		annualDPS: 420,
		lastDPS: 35,
		fiscalYear: "2026 연간 분배금",
		exDividendDate: "2026-10-29",
		payDate: "2026-11-04",
		source: "미래에셋자산운용 TIGER ETF 공식",
		dividendYield: 3.8,
		asOf: "2026-10-15"
	},
	"446720": {
		name: "SOL 미국배당다우존스",
		market: "KR",
		currency: "KRW",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "MONTHLY",
		frequencyLabel: "월배당 (연 12회)",
		annualDPS: 410,
		lastDPS: 34,
		fiscalYear: "2026 연간 분배금",
		exDividendDate: "2026-10-29",
		payDate: "2026-11-03",
		source: "신한자산운용 SOL ETF 공식",
		dividendYield: 3.75,
		asOf: "2026-10-15"
	},
	"196170": {
		name: "알테오젠",
		market: "KR",
		currency: "KRW",
		hasDividend: false,
		status: "NONE",
		statusLabel: "배당 미지급",
		frequency: "NONE",
		frequencyLabel: "미지급",
		annualDPS: 0,
		lastDPS: 0,
		fiscalYear: "2025/2026",
		source: "한국거래소(KRX) 상장 공시 (무배당 성장주)",
		asOf: "2026-10-15",
		notes: "R&D 재투자 정책으로 인한 무배당"
	},
	"AAPL": {
		name: "애플 (Apple Inc.)",
		market: "US",
		currency: "USD",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "QUARTERLY",
		frequencyLabel: "분기배당 (연 4회)",
		annualDPS: 1,
		lastDPS: .25,
		fiscalYear: "2025/2026 회계연도",
		exDividendDate: "2026-11-08",
		recordDate: "2026-11-10",
		payDate: "2026-11-14",
		source: "Apple Investor Relations SEC Form 8-K",
		sourceUrl: "https://investor.apple.com",
		dividendYield: .45,
		asOf: "2026-10-15",
		notes: "분기당 주당 $0.25 현금배당 이사회 승인"
	},
	"MSFT": {
		name: "마이크로소프트 (Microsoft)",
		market: "US",
		currency: "USD",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "QUARTERLY",
		frequencyLabel: "분기배당 (연 4회)",
		annualDPS: 3.32,
		lastDPS: .83,
		fiscalYear: "2025/2026 회계연도",
		exDividendDate: "2026-11-20",
		recordDate: "2026-11-21",
		payDate: "2026-12-11",
		source: "Microsoft Investor Relations SEC Form 8-K",
		sourceUrl: "https://www.microsoft.com/investor",
		dividendYield: .78,
		asOf: "2026-10-15",
		notes: "분기당 $0.83로 10% 배당금 인상 결정"
	},
	"NVDA": {
		name: "엔비디아 (NVIDIA)",
		market: "US",
		currency: "USD",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "QUARTERLY",
		frequencyLabel: "분기배당 (연 4회)",
		annualDPS: .04,
		lastDPS: .01,
		fiscalYear: "2025/2026 회계연도",
		exDividendDate: "2026-09-11",
		payDate: "2026-10-03",
		source: "NVIDIA Investor Relations (10:1 액면분할 반영)",
		sourceUrl: "https://investor.nvidia.com",
		dividendYield: .03,
		asOf: "2026-10-15",
		notes: "액면분할 후 분기당 주당 $0.01 정기 지급"
	},
	"GOOGL": {
		name: "알파벳 Class A (Google)",
		market: "US",
		currency: "USD",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "QUARTERLY",
		frequencyLabel: "분기배당 (연 4회)",
		annualDPS: .8,
		lastDPS: .2,
		fiscalYear: "2025/2026 회계연도",
		exDividendDate: "2026-09-08",
		payDate: "2026-09-15",
		source: "Alphabet Investor Relations",
		dividendYield: .48,
		asOf: "2026-10-15",
		notes: "2024년 최초 분기배당 도입 이후 지속 지급"
	},
	"GOOG": {
		name: "알파벳 Class C (Google)",
		market: "US",
		currency: "USD",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "QUARTERLY",
		frequencyLabel: "분기배당 (연 4회)",
		annualDPS: .8,
		lastDPS: .2,
		fiscalYear: "2025/2026 회계연도",
		exDividendDate: "2026-09-08",
		payDate: "2026-09-15",
		source: "Alphabet Investor Relations",
		dividendYield: .48,
		asOf: "2026-10-15"
	},
	"META": {
		name: "메타 플랫폼스 (Meta)",
		market: "US",
		currency: "USD",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "QUARTERLY",
		frequencyLabel: "분기배당 (연 4회)",
		annualDPS: 2,
		lastDPS: .5,
		fiscalYear: "2025/2026 회계연도",
		exDividendDate: "2026-09-15",
		payDate: "2026-09-26",
		source: "Meta Investor Relations",
		dividendYield: .35,
		asOf: "2026-10-15"
	},
	"TSLA": {
		name: "테슬라 (Tesla)",
		market: "US",
		currency: "USD",
		hasDividend: false,
		status: "NONE",
		statusLabel: "배당 미지급",
		frequency: "NONE",
		frequencyLabel: "미지급",
		annualDPS: 0,
		lastDPS: 0,
		fiscalYear: "2025/2026",
		source: "SEC Form 10-K 연례보고서 (무배당 성장 방침)",
		asOf: "2026-10-15",
		notes: "전기차·AI 인프라 전액 재투자 방침으로 배당을 지급하지 않습니다."
	},
	"AMZN": {
		name: "아마존닷컴 (Amazon)",
		market: "US",
		currency: "USD",
		hasDividend: false,
		status: "NONE",
		statusLabel: "배당 미지급",
		frequency: "NONE",
		frequencyLabel: "미지급",
		annualDPS: 0,
		lastDPS: 0,
		fiscalYear: "2025/2026",
		source: "SEC Form 10-K (무배당 기업)",
		asOf: "2026-10-15",
		notes: "클라우드/AI 인프라 재투자 방침으로 무배당 유지"
	},
	"KO": {
		name: "코카콜라 (Coca-Cola)",
		market: "US",
		currency: "USD",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "QUARTERLY",
		frequencyLabel: "분기배당 (연 4회)",
		annualDPS: 1.94,
		lastDPS: .485,
		fiscalYear: "2025/2026 회계연도",
		exDividendDate: "2026-11-28",
		payDate: "2026-12-15",
		source: "The Coca-Cola Company IR",
		dividendYield: 3.1,
		asOf: "2026-10-15",
		notes: "62년 연속 배당 인상 (배당킹 종목)"
	},
	"O": {
		name: "리얼티인컴 (Realty Income)",
		market: "US",
		currency: "USD",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "MONTHLY",
		frequencyLabel: "월배당 (연 12회)",
		annualDPS: 3.16,
		lastDPS: .2635,
		fiscalYear: "2025/2026 회계연도",
		exDividendDate: "2026-10-31",
		payDate: "2026-11-14",
		source: "Realty Income Investor Relations (NYSE: O)",
		dividendYield: 5.6,
		asOf: "2026-10-15",
		notes: "대표 상업용 부동산 리츠, 매월 현금배당 지급"
	},
	"SCHD": {
		name: "Schwab US Dividend Equity ETF",
		market: "US",
		currency: "USD",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "QUARTERLY",
		frequencyLabel: "분기배당 (연 4회)",
		annualDPS: 2.75,
		lastDPS: .68,
		fiscalYear: "2025/2026 분배금",
		exDividendDate: "2026-09-24",
		payDate: "2026-09-30",
		source: "Charles Schwab Asset Management Official",
		dividendYield: 3.45,
		asOf: "2026-10-15",
		notes: "미국 우량 고배당주 100종목 지수 추종 ETF"
	},
	"JEPI": {
		name: "JPMorgan Equity Premium Income ETF",
		market: "US",
		currency: "USD",
		hasDividend: true,
		status: "ESTIMATED",
		statusLabel: "시장 예상치",
		frequency: "MONTHLY",
		frequencyLabel: "월배당 (연 12회)",
		annualDPS: 4.6,
		lastDPS: .38,
		fiscalYear: "2025/2026 분배금",
		exDividendDate: "2026-11-01",
		payDate: "2026-11-06",
		source: "J.P. Morgan Asset Management (커버드콜 옵션 변동성)",
		dividendYield: 7.9,
		asOf: "2026-10-15",
		notes: "옵션 프리미엄 분배금에 따라 매월 분배액 변동"
	},
	"SPY": {
		name: "SPDR S&P 500 ETF Trust",
		market: "US",
		currency: "USD",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "QUARTERLY",
		frequencyLabel: "분기배당 (연 4회)",
		annualDPS: 7.1,
		lastDPS: 1.77,
		fiscalYear: "2025/2026 분배금",
		exDividendDate: "2026-09-19",
		payDate: "2026-10-31",
		source: "State Street Global Advisors (SSGA)",
		dividendYield: 1.25,
		asOf: "2026-10-15"
	},
	"QQQ": {
		name: "Invesco QQQ Trust",
		market: "US",
		currency: "USD",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "QUARTERLY",
		frequencyLabel: "분기배당 (연 4회)",
		annualDPS: 2.95,
		lastDPS: .73,
		fiscalYear: "2025/2026 분배금",
		exDividendDate: "2026-09-22",
		payDate: "2026-10-31",
		source: "Invesco Official",
		dividendYield: .6,
		asOf: "2026-10-15"
	},
	"SOXL": {
		name: "Direxion Daily Semiconductor Bull 3X",
		market: "US",
		currency: "USD",
		hasDividend: true,
		status: "ESTIMATED",
		statusLabel: "시장 예상치",
		frequency: "QUARTERLY",
		frequencyLabel: "분기배당 (연 4회)",
		annualDPS: .48,
		lastDPS: .12,
		fiscalYear: "2025/2026 분배금",
		exDividendDate: "2026-09-24",
		payDate: "2026-10-01",
		source: "Direxion Funds Official",
		dividendYield: 1.1,
		asOf: "2026-10-15",
		notes: "레버리지 ETF로 보유 파생자산 결산에 따라 변동"
	},
	"JNJ": {
		name: "존슨앤드존슨 (Johnson & Johnson)",
		market: "US",
		currency: "USD",
		hasDividend: true,
		status: "CONFIRMED",
		statusLabel: "공식 확정",
		frequency: "QUARTERLY",
		frequencyLabel: "분기배당 (연 4회)",
		annualDPS: 4.96,
		lastDPS: 1.24,
		fiscalYear: "2025/2026 회계연도",
		exDividendDate: "2026-11-18",
		payDate: "2026-12-09",
		source: "Johnson & Johnson Investor Relations",
		dividendYield: 3.1,
		asOf: "2026-10-15"
	}
};
var dividendService = {
	/**
	* Get authoritative dividend specification for a given stock symbol
	*/
	getDividendInfo(symbol, fallbackName, fallbackCurrency) {
		const sym = (symbol || "").toUpperCase().trim();
		if (sym.startsWith("KRW-") || sym.endsWith("USDT") || sym === "BTC" || sym === "ETH") return {
			symbol: sym,
			name: fallbackName || sym,
			market: "COIN",
			currency: sym.startsWith("KRW-") ? "KRW" : "USD",
			hasDividend: false,
			status: "NONE",
			statusLabel: "배당 미지급 (가상자산)",
			frequency: "NONE",
			frequencyLabel: "미지급",
			annualDPS: 0,
			lastDPS: 0,
			fiscalYear: "-",
			source: "가상자산은 법정 배당금 지급 대상이 아닙니다.",
			asOf: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			notes: "암호화폐/토큰은 주식 배당 대상에서 제외됩니다."
		};
		const matched = MASTER_DIVIDEND_RECORDS[sym];
		if (matched) return {
			symbol: sym,
			...matched,
			name: matched.name || fallbackName || sym
		};
		const isUS = /^[A-Z]{1,5}$/.test(sym) && !/^\d{6}$/.test(sym);
		return {
			symbol: sym,
			name: fallbackName || sym,
			market: isUS ? "US" : "KR",
			currency: fallbackCurrency || (isUS ? "USD" : "KRW"),
			hasDividend: false,
			status: "UNAVAILABLE",
			statusLabel: "배당 정보 미확정 (공시 없음)",
			frequency: "NONE",
			frequencyLabel: "확인 불가",
			annualDPS: 0,
			lastDPS: 0,
			fiscalYear: "2025/2026",
			source: isUS ? "미국 SEC EDGAR 공시 확인 중" : "한국거래소(KRX) 상장공시시스템 확인 중",
			asOf: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			notes: "최근 공식 배당 공시 내역이 없거나 무배당 종목입니다."
		};
	},
	/**
	* Calculate detailed pre-tax and post-tax dividend income for a holding
	* Applies Korea standard 15.4% withholding tax (배당소득세 14% + 지방소득세 1.4%)
	*/
	calculateDividend(symbol, quantity, name, currency, exchangeRate = null) {
		const info = this.getDividendInfo(symbol, name, currency);
		const safeQty = Math.max(0, quantity);
		const annualPreTax = info.hasDividend ? info.annualDPS * safeQty : 0;
		const taxRate = .154;
		const taxAmount = annualPreTax * taxRate;
		const annualPostTax = annualPreTax - taxAmount;
		const monthlyAveragePreTax = annualPreTax / 12;
		const monthlyAveragePostTax = annualPostTax / 12;
		const isUSD = info.currency === "USD";
		const hasValidFx = typeof exchangeRate === "number" && Number.isFinite(exchangeRate) && exchangeRate > 0;
		const fxApplied = !isUSD || hasValidFx;
		const annualPreTaxKRW = isUSD ? hasValidFx ? Math.round(annualPreTax * exchangeRate) : null : Math.round(annualPreTax);
		const annualPostTaxKRW = isUSD ? hasValidFx ? Math.round(annualPostTax * exchangeRate) : null : Math.round(annualPostTax);
		return {
			symbol: info.symbol,
			name: info.name,
			quantity: safeQty,
			currency: info.currency,
			market: info.market,
			status: info.status,
			statusLabel: info.statusLabel,
			frequencyLabel: info.frequencyLabel,
			annualDPS: info.annualDPS,
			annualPreTaxDividend: annualPreTax,
			annualPostTaxDividend: annualPostTax,
			monthlyAveragePreTax,
			monthlyAveragePostTax,
			taxRate,
			taxAmount,
			annualPreTaxKRW,
			annualPostTaxKRW,
			fxApplied,
			exDividendDate: info.exDividendDate,
			payDate: info.payDate,
			fiscalYear: info.fiscalYear,
			source: info.source,
			asOf: info.asOf,
			hasDividend: info.hasDividend
		};
	}
};
//#endregion
//#region src/components/portfolio/DividendCalculator.tsx
var DividendCalculator = ({ uid }) => {
	const { exchangeRate, navigateToStock } = useApp();
	const fxCheck = validateExchangeRate(exchangeRate);
	const validFxRate = fxCheck.valid ? fxCheck.rate : null;
	const [dividendResults, setDividendResults] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [refreshing, setRefreshing] = (0, import_react.useState)(false);
	const loadData = async (isSilent = false) => {
		if (!isSilent) setLoading(true);
		else setRefreshing(true);
		try {
			const results = (await portfolioService.getVirtualHoldings(uid)).map((h) => {
				const cur = inferFiatCurrency(h.symbol, h.market, h.currency);
				return dividendService.calculateDividend(h.symbol, h.quantity, h.name, cur, validFxRate);
			});
			setDividendResults(results);
		} catch (err) {
			console.warn("[DividendCalculator] Load data error:", err);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadData();
	}, [uid, validFxRate]);
	const canAggregateKRW = !dividendResults.some((item) => item.currency === "USD" && item.hasDividend) || fxCheck.valid && validFxRate !== null;
	const totals = dividendResults.reduce((acc, item) => {
		if (item.currency === "USD") {
			acc.preTaxUSD += item.annualPreTaxDividend;
			acc.postTaxUSD += item.annualPostTaxDividend;
		} else {
			acc.preTaxNativeKRW += item.annualPreTaxDividend;
			acc.postTaxNativeKRW += item.annualPostTaxDividend;
		}
		if (canAggregateKRW && item.annualPreTaxKRW !== null && item.annualPostTaxKRW !== null) {
			acc.preTaxKRW += item.annualPreTaxKRW;
			acc.postTaxKRW += item.annualPostTaxKRW;
			acc.taxKRW += item.annualPreTaxKRW - item.annualPostTaxKRW;
		}
		if (item.hasDividend) acc.dividendStockCount += 1;
		return acc;
	}, {
		preTaxNativeKRW: 0,
		postTaxNativeKRW: 0,
		preTaxUSD: 0,
		postTaxUSD: 0,
		preTaxKRW: 0,
		postTaxKRW: 0,
		taxKRW: 0,
		dividendStockCount: 0
	});
	const monthlyAveragePostTaxKRW = canAggregateKRW ? Math.round(totals.postTaxKRW / 12) : null;
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center gap-3 text-slate-500 text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 animate-spin text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "실제 공시 기반 배당 수익 데이터를 분석하는 중..." })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-5 sm:p-6 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2.5 rounded-xl bg-amber-500/10 text-amber-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base sm:text-lg font-bold text-slate-900 dark:text-white",
							children: "배당 수익 계산기 (실제 공시 연동)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400",
							children: "15.4% 원천징수 반영"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-400",
						children: "한국예탁결제원(SEIBro) 및 미국 SEC 공식 공시 주당배당금(DPS)을 보유 수량에 연동한 실수령액 분석입니다."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => loadData(true),
					disabled: refreshing,
					className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors self-start sm:self-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3.5 h-3.5 ${refreshing ? "animate-spin text-amber-500" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "새로고침" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-500 dark:text-slate-400 text-xs block mb-1",
								children: "연간 총 배당금 (세전)"
							}),
							canAggregateKRW ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white",
								children: formatMoney(totals.preTaxKRW, "KRW")
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold text-rose-500",
								children: "환율 미확인 (원화 환산 보류)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-slate-400 font-mono block",
								children: [
									"KRW ",
									formatMoney(totals.preTaxNativeKRW, "KRW"),
									" / USD ",
									formatMoney(totals.preTaxUSD, "USD")
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-slate-500 dark:text-slate-400 text-xs block mb-1",
							children: "연간 실수령 배당금 (세후)"
						}), canAggregateKRW ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg sm:text-xl font-black font-mono text-emerald-600 dark:text-emerald-400",
							children: formatMoney(totals.postTaxKRW, "KRW")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] text-slate-400 font-mono block",
							children: [
								"원천징수세액 -",
								formatMoney(totals.taxKRW, "KRW"),
								" (15.4%)"
							]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-bold text-rose-500",
							children: "환율 미확인"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] text-slate-400 font-mono block",
							children: [
								"KRW ",
								formatMoney(totals.postTaxNativeKRW, "KRW"),
								" / USD ",
								formatMoney(totals.postTaxUSD, "USD")
							]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "월평균 실수령액" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-4 h-4 text-emerald-500" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white",
								children: monthlyAveragePostTaxKRW !== null ? `${formatMoney(monthlyAveragePostTaxKRW, "KRW")} / 월` : "환산 보류"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-slate-400",
								children: "매월 연금형 현금 흐름 환산치"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-500 dark:text-slate-400 text-xs block mb-1",
								children: "배당 지급 종목"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white",
								children: [
									totals.dividendStockCount,
									" / ",
									dividendResults.length,
									"종목"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-[10px] font-mono ${fxCheck.valid ? "text-slate-400" : "text-rose-500"}`,
								children: fxCheck.valid && validFxRate ? `기준 환율 ₩${validFxRate.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}/USD (${fxCheck.lastUpdated})` : "환율 확인 불가 — 원화 환산 중단"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "종목별 공시 배당 상세" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono",
						children: [
							"총 ",
							dividendResults.length,
							"종목"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] text-slate-400",
					children: "기준 사업연도 및 공식 공시 출처 표기"
				})]
			}), dividendResults.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-12 text-center rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-400",
					children: "등록된 보유 종목이 없습니다."
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-xs border-collapse",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-[11px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "종목명 / 심볼"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-3 text-right",
								children: "보유수량"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-3 text-right",
								children: "주당 배당금 (DPS)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-3 text-center",
								children: "지급 주기"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-3 text-center",
								children: "공시 상태"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-3 text-right",
								children: "연간 배당금 (세전)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-3 text-right",
								children: "연간 실수령 (세후 15.4%)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-3 text-center",
								children: "배당락일 / 지급일"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "공식 출처"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-slate-100 dark:divide-slate-800/60 font-mono",
						children: dividendResults.map((item) => {
							const isUSD = item.currency === "USD";
							const isConfirmed = item.status === "CONFIRMED";
							const isEstimated = item.status === "ESTIMATED";
							const isNone = item.status === "NONE";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3 px-4 font-sans",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => navigateToStock?.(item.symbol),
											className: "font-bold text-slate-900 dark:text-white hover:text-rose-500 flex items-center gap-1 group text-left",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-3 h-3 opacity-0 group-hover:opacity-100 text-rose-500" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 mt-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-slate-400 font-mono",
												children: item.symbol
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold",
												children: item.market
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3 px-3 text-right font-bold text-slate-900 dark:text-white",
										children: [item.quantity.toLocaleString(), "주"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-3 text-right",
										children: item.hasDividend ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-slate-900 dark:text-white",
											children: formatMoney(item.annualDPS, item.currency)
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-400 font-sans text-[11px]",
											children: "-"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-3 text-center font-sans",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
											children: item.frequencyLabel
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-3 text-center font-sans",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${isConfirmed ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : isEstimated ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : isNone ? "bg-slate-100 dark:bg-slate-800 text-slate-500" : "bg-rose-500/10 text-rose-500"}`,
											children: item.statusLabel
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-3 text-right",
										children: item.hasDividend ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-slate-900 dark:text-white block",
											children: formatMoney(item.annualPreTaxDividend, item.currency)
										}), isUSD && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400 block",
											children: item.fxApplied && item.annualPreTaxKRW !== null ? `≈ ${formatMoney(item.annualPreTaxKRW, "KRW")}` : "원화 환산 보류"
										})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-400 font-sans text-[11px]",
											children: "무배당"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-3 text-right",
										children: item.hasDividend ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-emerald-600 dark:text-emerald-400 block",
											children: formatMoney(item.annualPostTaxDividend, item.currency)
										}), isUSD && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400 block",
											children: item.fxApplied && item.annualPostTaxKRW !== null ? `≈ ${formatMoney(item.annualPostTaxKRW, "KRW")}` : "원화 환산 보류"
										})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-400 font-sans text-[11px]",
											children: "-"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-3 text-center text-[10px] text-slate-500 dark:text-slate-400",
										children: item.exDividendDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block",
											children: ["락일: ", item.exDividendDate]
										}), item.payDate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block text-slate-400",
											children: ["지급: ", item.payDate]
										})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "-" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 font-sans text-[10px] text-slate-500 dark:text-slate-400 max-w-[200px] truncate",
										title: item.source,
										children: item.source
									})
								]
							}, item.symbol);
						})
					})]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1.5 font-sans",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-4 h-4 text-amber-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "배당소득 원천징수세율 및 데이터 기준 안내" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "list-disc list-inside space-y-1 pl-1 text-[11px] leading-relaxed",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "세율 적용:" }),
							" 국내 주식 배당 시 일반 배당소득세율 ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "15.4%" }),
							"(배당소득세 14% + 지방소득세 1.4%)가 원천징수됩니다."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "미국 주식:" }), " 한미 조세조약에 따라 미국 현지에서 15%가 원천징수되며, 국내 추가 원천징수는 면제됩니다. (본 계산기는 15.4% 기준 보수적 계산)"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "출처 기준:" }),
							" 한국 주식은 ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "한국예탁결제원(SEIBro)" }),
							" 및 금융감독원 DART 공시, 미국 주식은 ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "SEC Form 8-K/10-K" }),
							" 및 각 기업 공식 IR 데이터를 기반으로 연동됩니다."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"배당을 지급하지 않는 성장주(예: TSLA, AMZN 등) 및 가상자산은 자동으로 ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "'배당 미지급'" }),
							"으로 분류하여 왜곡 없는 정확한 자산 분석을 제공합니다."
						] })
					]
				})]
			})
		]
	});
};
//#endregion
//#region src/components/portfolio/PortfolioView.tsx
var PortfolioView = () => {
	const { user, isAuthenticated, showToast, exchangeRate, stocks, navigateToStock, setActiveTab } = useApp();
	const [mainTab, setMainTab] = (0, import_react.useState)("virtual");
	const [virtualHoldings, setVirtualHoldings] = (0, import_react.useState)([]);
	const [virtualTrades, setVirtualTrades] = (0, import_react.useState)([]);
	const [holdingModalOpen, setHoldingModalOpen] = (0, import_react.useState)(false);
	const [holdingModalMode, setHoldingModalMode] = (0, import_react.useState)("create");
	const [activeHolding, setActiveHolding] = (0, import_react.useState)(null);
	const [mockAccount, setMockAccount] = (0, import_react.useState)(null);
	const [mockPositions, setMockPositions] = (0, import_react.useState)([]);
	const [mockOrders, setMockOrders] = (0, import_react.useState)([]);
	const [feeModalOpen, setFeeModalOpen] = (0, import_react.useState)(false);
	const [tradeModalOpen, setTradeModalOpen] = (0, import_react.useState)(false);
	const [tradeModalSymbol, setTradeModalSymbol] = (0, import_react.useState)("005930");
	const [tradeModalType, setTradeModalType] = (0, import_react.useState)("BUY");
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const [quotesMap, setQuotesMap] = (0, import_react.useState)(/* @__PURE__ */ new Map());
	const loadData = async () => {
		try {
			const [vHoldings, vTrades, mAccount, mPositions, mOrders] = await Promise.all([
				portfolioService.getVirtualHoldings(user?.id),
				portfolioService.getVirtualHoldingTrades(user?.id),
				portfolioService.getMockAccount(user?.id),
				portfolioService.getMockPositions(user?.id),
				portfolioService.getMockOrders(user?.id)
			]);
			setVirtualHoldings(vHoldings);
			setVirtualTrades(vTrades);
			setMockAccount(mAccount);
			setMockPositions(mPositions);
			setMockOrders(mOrders);
			const allSymbols = Array.from(/* @__PURE__ */ new Set([...vHoldings.map((h) => h.symbol), ...mPositions.map((p) => p.symbol)]));
			if (allSymbols.length > 0) {
				const newMap = /* @__PURE__ */ new Map();
				await Promise.all(allSymbols.map(async (sym) => {
					const q = await portfolioService.resolveQuote(sym);
					if (q) newMap.set(sym, q);
				}));
				setQuotesMap(newMap);
			}
		} catch (err) {
			console.warn("[PortfolioView] loadData error:", err);
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadData();
	}, [user?.id]);
	const handleManualRefresh = async () => {
		setIsRefreshing(true);
		await loadData();
		showToast("보유 종목 시세 및 자산 현황을 갱신했습니다.", "info");
	};
	const fxCheck = (0, import_react.useMemo)(() => validateExchangeRate(exchangeRate), [exchangeRate]);
	const virtualAgg = (0, import_react.useMemo)(() => {
		return aggregateMultiCurrencyPortfolio({
			positions: virtualHoldings.map((h) => ({
				symbol: h.symbol,
				currency: inferFiatCurrency(h.symbol, h.market, h.currency),
				market: h.market,
				quantity: h.quantity,
				avgBuyPrice: h.avgBuyPrice,
				totalCost: h.totalBuyAmount,
				currentPrice: quotesMap.get(h.symbol)?.price ?? null,
				entryExchangeRate: h.entryExchangeRate
			})),
			realizedTrades: virtualTrades.filter((t) => t.tradeType === "SELL" && t.realizedProfit !== void 0).map((t) => ({
				symbol: t.symbol,
				currency: inferFiatCurrency(t.symbol, void 0, t.currency ?? quotesMap.get(t.symbol)?.currency),
				realizedProfit: t.realizedProfit,
				exchangeRate: t.exchangeRate
			})),
			fx: exchangeRate,
			fallbackValuationToCost: false
		});
	}, [
		virtualHoldings,
		virtualTrades,
		quotesMap,
		exchangeRate
	]);
	const mockAgg = (0, import_react.useMemo)(() => {
		return aggregateMultiCurrencyPortfolio({
			positions: mockPositions.map((p) => ({
				symbol: p.symbol,
				currency: inferFiatCurrency(p.symbol, p.market, p.currency),
				market: p.market,
				quantity: p.quantity,
				avgBuyPrice: p.avgBuyPrice,
				totalCost: p.totalInvested,
				currentPrice: quotesMap.get(p.symbol)?.price ?? null,
				entryExchangeRate: p.entryExchangeRate
			})),
			realizedTrades: mockOrders.filter((o) => o.orderType === "SELL" && o.status !== "PENDING" && o.status !== "CANCELLED" && o.realizedProfit !== void 0).map((o) => ({
				symbol: o.symbol,
				currency: inferFiatCurrency(o.symbol, void 0, o.currency ?? quotesMap.get(o.symbol)?.currency),
				realizedProfit: o.realizedProfit,
				exchangeRate: o.exchangeRate
			})),
			cashKRW: mockAccount?.currentCash ?? 1e8,
			initialCashKRW: mockAccount?.initialBalance ?? 1e8,
			cashUSD: mockAccount?.currentCashUsd ?? 1e5,
			initialCashUSD: mockAccount?.initialBalanceUsd ?? 1e5,
			fx: exchangeRate,
			fallbackValuationToCost: true
		});
	}, [
		mockAccount,
		mockPositions,
		mockOrders,
		quotesMap,
		exchangeRate
	]);
	const handleResetMockAccount = async () => {
		if (!window.confirm("가상 모의투자 계좌를 초기 자금(₩100,000,000 / $100,000.00)으로 리셋하시겠습니까?\n모든 보유 종목과 주문 내역이 초기화됩니다.")) return;
		try {
			const newAcc = await portfolioService.resetMockAccount(user?.id);
			setMockAccount(newAcc);
			setMockPositions([]);
			setMockOrders([]);
			showToast("모의투자 계좌가 KRW ₩100,000,000 / USD $100,000.00으로 초기화되었습니다.", "info");
		} catch (err) {
			showToast("계좌 초기화 중 오류가 발생했습니다.", "error");
		}
	};
	const handleDeleteVirtualHolding = async (holdingId, name) => {
		if (!window.confirm(`'${name}' 가상 보유 기록을 삭제하시겠습니까?`)) return;
		try {
			await portfolioService.deleteVirtualHolding(user?.id, holdingId);
			setVirtualHoldings((prev) => prev.filter((h) => h.id !== holdingId));
			showToast(`'${name}' 보유 기록이 삭제되었습니다.`, "info");
		} catch (err) {
			showToast("삭제 처리 중 오류가 발생했습니다.", "error");
		}
	};
	const handleOpenTradeForStock = (symbol, type = "BUY") => {
		setTradeModalSymbol(symbol);
		setTradeModalType(type);
		setTradeModalOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-20 animate-in fade-in duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3 rounded-2xl bg-rose-500/10 text-rose-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "w-6 h-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white",
								children: "가상 보유 관리 & 모의투자"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-500/10 text-rose-500",
								children: "SIMULATOR"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
							children: "직접 입력 가상 포트폴리오 관리와 실시간 시세 기반 모의 트레이딩을 안전하게 진행하세요."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 self-start sm:self-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleManualRefresh,
							disabled: isRefreshing,
							className: "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors",
							title: "시세 갱신",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-rose-500" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "시세 갱신"
							})]
						}), mainTab === "mock" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setFeeModalOpen(true),
							className: "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "w-3.5 h-3.5 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "수수료·세금 설정" })]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mt-5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setMainTab("virtual"),
						className: `flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${mainTab === "virtual" ? "bg-white dark:bg-[#131722] text-rose-600 dark:text-rose-400 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "w-4 h-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "가상 보유 내역 기록" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-1.5 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-500 font-mono",
								children: virtualHoldings.length
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setMainTab("mock"),
						className: `flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${mainTab === "mock" ? "bg-white dark:bg-[#131722] text-rose-600 dark:text-rose-400 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "실전 모의 투자 (가상 자금)" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-1.5 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-500 font-mono",
								children: mockPositions.length
							})
						]
					})]
				})]
			}),
			mainTab === "virtual" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-5 h-5 text-amber-500 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-sm block",
								children: "⚠️ [가상 보유 내역 안내 및 구분 고지]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "leading-relaxed",
								children: [
									"본 화면은 ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "실제 증권사 실계좌와 연결되지 않은 사용자 직접 입력 가상 포트폴리오" }),
									"입니다. 보유 종목, 매수가, 수량을 직접 기록하여 현재가 연동 평가손익과 추가 매수 평균단가, 매도 시 실현손익을 분석하는 목적입니다."
								]
							})]
						})]
					}),
					!fxCheck.valid && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-4 h-4 text-rose-500 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold block",
							children: "실시간 USD/KRW 환율 검증 불가 — 원화 통합 환산 중단"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] opacity-90",
							children: fxCheck.reason || "환율 정보를 확인할 수 없어 임의 환산 없이 KRW와 USD 자산을 각각 분리 표기합니다."
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-bold text-slate-500 dark:text-slate-400",
											children: "국내 주식 (KRW 기준)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-bold",
											children: [virtualAgg.krw.holdingsCount, "종목"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white block",
										children: formatMoney(virtualAgg.krw.evaluationAmount, "KRW")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] text-slate-400 font-mono",
										children: ["매입 ", formatMoney(virtualAgg.krw.investedCost, "KRW")]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: virtualAgg.krw.unrealizedPnL >= 0 ? "text-rose-500 font-bold" : "text-blue-500 font-bold",
											children: [
												formatMoney(virtualAgg.krw.unrealizedPnL, "KRW", { showSign: true }),
												" (",
												virtualAgg.krw.returnRatePercent >= 0 ? "+" : "",
												virtualAgg.krw.returnRatePercent.toFixed(2),
												"%)"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-slate-400",
											children: ["실현 ", formatMoney(virtualAgg.krw.realizedPnL, "KRW", { showSign: true })]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-bold text-slate-500 dark:text-slate-400",
											children: "미국 주식 (USD 기준)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 font-mono font-bold",
											children: [virtualAgg.usd.holdingsCount, "종목"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white block",
										children: formatMoney(virtualAgg.usd.evaluationAmount, "USD")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] text-slate-400 font-mono",
										children: ["매입 ", formatMoney(virtualAgg.usd.investedCost, "USD")]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: virtualAgg.usd.unrealizedPnL >= 0 ? "text-rose-500 font-bold" : "text-blue-500 font-bold",
											children: [
												formatMoney(virtualAgg.usd.unrealizedPnL, "USD", { showSign: true }),
												" (",
												virtualAgg.usd.returnRatePercent >= 0 ? "+" : "",
												virtualAgg.usd.returnRatePercent.toFixed(2),
												"%)"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-slate-400",
											children: ["실현 ", formatMoney(virtualAgg.usd.realizedPnL, "USD", { showSign: true })]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-bold text-slate-500 dark:text-slate-400",
										children: "기준통화(KRW) 환산 통합"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${fxCheck.valid ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-500"}`,
										children: fxCheck.valid && fxCheck.rate ? `₩${fxCheck.rate.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}` : "환율 오류"
									})]
								}), virtualAgg.convertedKRW ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white block",
									children: formatMoney(virtualAgg.convertedKRW.evaluationAmount, "KRW")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-slate-400 font-mono",
									children: [
										"총손익 ",
										formatMoney(virtualAgg.convertedKRW.totalPnL, "KRW", { showSign: true }),
										" (",
										virtualAgg.convertedKRW.returnRatePercent >= 0 ? "+" : "",
										virtualAgg.convertedKRW.returnRatePercent.toFixed(2),
										"%)"
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["종목손익 ", formatMoney(virtualAgg.convertedKRW.stockPnLKRW, "KRW", { showSign: true })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["환차익 ", formatMoney(virtualAgg.convertedKRW.fxPnLKRW, "KRW", { showSign: true })] })]
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "py-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-rose-500 block",
										children: "환산 보류 (유효 환율 없음)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] text-slate-400 block mt-0.5",
										children: [
											"KRW ",
											formatMoney(virtualAgg.krw.evaluationAmount, "KRW"),
											" / USD ",
											formatMoney(virtualAgg.usd.evaluationAmount, "USD")
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between lg:flex-col lg:items-start lg:justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-slate-400 font-sans block mb-1",
										children: "보유 종목 수"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white",
										children: [virtualHoldings.length, "개 종목"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-slate-400 block mt-0.5 font-mono",
										children: ["환율 시각: ", fxCheck.lastUpdated]
									}),
									virtualAgg.missingQuoteCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-amber-500 font-bold block mt-0.5",
										children: [
											"(",
											virtualAgg.missingQuoteCount,
											"개 시세 미확인)"
										]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										setActiveHolding(null);
										setHoldingModalMode("create");
										setHoldingModalOpen(true);
									},
									className: "flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-600/20 active:scale-95 lg:w-full lg:justify-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "종목 추가 등록" })]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortfolioCharts, {
						holdings: virtualHoldings,
						quotesMap,
						exchangeRate: exchangeRate ?? void 0,
						onSelectStock: navigateToStock
					}),
					user?.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortfolioAnalyzer, {
						uid: user.id,
						onUpdated: loadData,
						onSelectStock: navigateToStock
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DividendCalculator, { uid: user.id })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "w-4 h-4 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-sm sm:text-base text-slate-900 dark:text-white",
									children: "가상 보유 종목 목록"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-xs font-mono ${fxCheck.valid ? "text-slate-400" : "text-rose-500 font-semibold"}`,
								children: fxCheck.valid && fxCheck.rate ? `적용 환율: $1 = ₩${fxCheck.rate.toLocaleString("ko-KR", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})} (${fxCheck.lastUpdated})` : "적용 환율: 수신 오류/지연 — 원화 환산 보류"
							})]
						}), virtualHoldings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-16 text-center space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "w-6 h-6" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-bold text-sm text-slate-800 dark:text-slate-200",
									children: "등록된 가상 보유 종목이 없습니다."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-500 max-w-sm mx-auto",
									children: "실제 보유 중인 국내/해외 주식을 등록하여 실시간 손익과 분할 매수 평단가를 체계적으로 계산해보세요."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										setActiveHolding(null);
										setHoldingModalMode("create");
										setHoldingModalOpen(true);
									},
									className: "px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 inline-flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "첫 종목 등록하기" })]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left border-collapse text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 text-[11px] text-slate-500 dark:text-slate-400 uppercase",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 px-4 font-semibold",
											children: "종목명 / 코드"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 px-3 font-semibold text-right",
											children: "보유수량"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 px-3 font-semibold text-right",
											children: "평균 매입단가"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 px-3 font-semibold text-right",
											children: "현재가 (시세상태)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 px-3 font-semibold text-right",
											children: "평가금액"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 px-3 font-semibold text-right",
											children: "평가손익 (수익률)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 px-4 font-semibold text-center",
											children: "관리 액션"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-slate-100 dark:divide-slate-800/60 font-mono",
									children: virtualHoldings.map((h) => {
										const quote = quotesMap.get(h.symbol);
										const cur = inferFiatCurrency(h.symbol, h.market, h.currency);
										const isUSD = cur === "USD";
										const exchangeLabel = inferStockExchange(h.symbol, h.market, h.exchange);
										const curPrice = quote?.price ?? 0;
										const hasQuote = curPrice > 0;
										const valuation = hasQuote ? curPrice * h.quantity : h.totalBuyAmount;
										const profit = hasQuote ? (curPrice - h.avgBuyPrice) * h.quantity : 0;
										const returnPct = h.avgBuyPrice > 0 && hasQuote ? (curPrice - h.avgBuyPrice) / h.avgBuyPrice * 100 : 0;
										const convVal = isUSD ? convertToKRW(valuation, "USD", exchangeRate) : null;
										const convBuy = isUSD ? convertToKRW(h.avgBuyPrice, "USD", exchangeRate) : null;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "py-3.5 px-4 font-sans",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 flex-wrap",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																onClick: () => navigateToStock(h.symbol),
																className: "font-bold text-slate-900 dark:text-white hover:text-rose-500 text-left transition-colors flex items-center gap-1 group",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: h.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-rose-500" })]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono",
																children: h.symbol
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: `text-[10px] px-1.5 py-0.5 rounded font-bold font-mono ${isUSD ? "bg-blue-500/10 text-blue-500" : "bg-rose-500/10 text-rose-500"}`,
																children: [
																	exchangeLabel,
																	" · ",
																	cur
																]
															})
														]
													}), h.memo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[11px] text-slate-400 block mt-0.5 line-clamp-1",
														children: ["💬 ", h.memo]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "py-3.5 px-3 text-right font-bold text-slate-900 dark:text-white",
													children: [h.quantity.toLocaleString(), "주"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "py-3.5 px-3 text-right",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-slate-900 dark:text-white font-semibold",
														children: formatMoney(h.avgBuyPrice, cur)
													}), isUSD && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] text-slate-400 block",
														children: convBuy?.valid && convBuy.valueKRW !== null ? `≈ ${formatMoney(convBuy.valueKRW, "KRW")}` : "환율 미확인"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-3.5 px-3 text-right",
													children: quote && quote.price > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-bold text-slate-900 dark:text-white block",
														children: formatMoney(curPrice, cur)
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: `text-[10px] block ${quote.delayLabel.includes("실시간") ? "text-emerald-500" : "text-slate-400"}`,
														children: [
															quote.delayLabel,
															" (",
															quote.asOf,
															")"
														]
													})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[11px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded font-sans",
														children: "시세 확인 중"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "py-3.5 px-3 text-right font-bold text-slate-900 dark:text-white",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(valuation, cur) }), isUSD && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] text-slate-400 block font-normal",
														children: convVal?.valid && convVal.valueKRW !== null ? `≈ ${formatMoney(convVal.valueKRW, "KRW")}` : "원화 환산 보류"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-3.5 px-3 text-right",
													children: hasQuote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: profit >= 0 ? "text-rose-500 font-bold" : "text-blue-500 font-bold",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(profit, cur, { showSign: true }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-[11px] block",
															children: [
																"(",
																profit >= 0 ? "+" : "",
																returnPct.toFixed(2),
																"%)"
															]
														})]
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-slate-400",
														children: "-"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-3.5 px-4 text-center",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-center gap-1.5 font-sans",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																onClick: () => {
																	setActiveHolding(h);
																	setHoldingModalMode("add_buy");
																	setHoldingModalOpen(true);
																},
																className: "px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold transition-colors",
																title: "추가 매수 기록 및 평단가 재계산",
																children: "+추가매수"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																onClick: () => {
																	setActiveHolding(h);
																	setHoldingModalMode("sell");
																	setHoldingModalOpen(true);
																},
																className: "px-2 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[11px] font-bold transition-colors",
																title: "매도 기록 및 실현손익 확정",
																children: "매도기록"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																onClick: () => {
																	setActiveHolding(h);
																	setHoldingModalMode("edit");
																	setHoldingModalOpen(true);
																},
																className: "p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white",
																title: "수정",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-3.5 h-3.5" })
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																onClick: () => handleDeleteVirtualHolding(h.id, h.name),
																className: "p-1 rounded-lg text-slate-400 hover:text-rose-500",
																title: "삭제",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
															})
														]
													})
												})
											]
										}, h.id);
									})
								})]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-4 h-4 text-blue-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-sm text-slate-900 dark:text-white",
									children: "가상 포트폴리오 거래 및 매도 실현 내역"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-slate-400 font-mono",
								children: [
									"총 ",
									virtualTrades.length,
									"건"
								]
							})]
						}), virtualTrades.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-8 text-center text-xs text-slate-400",
							children: "기록된 거래 내역이 없습니다."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto max-h-80 overflow-y-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-xs border-collapse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-[11px] text-slate-500 uppercase",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 px-4 font-semibold",
											children: "거래일자"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 px-3 font-semibold",
											children: "구분"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 px-3 font-semibold",
											children: "종목명"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 px-3 font-semibold text-right",
											children: "체결단가"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 px-3 font-semibold text-right",
											children: "수량"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 px-3 font-semibold text-right",
											children: "거래총액"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 px-3 font-semibold text-right",
											children: "실현손익"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 px-4 font-semibold",
											children: "메모 / 사유"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-slate-100 dark:divide-slate-800/60 font-mono",
									children: virtualTrades.map((t) => {
										const isSell = t.tradeType === "SELL";
										const isAdd = t.tradeType === "ADD_BUY";
										const tCur = inferFiatCurrency(t.symbol, void 0, t.currency ?? quotesMap.get(t.symbol)?.currency);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-slate-50/60 dark:hover:bg-slate-800/20",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-2.5 px-4 text-slate-500 text-[11px]",
													children: t.tradeDate
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-2.5 px-3",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `px-2 py-0.5 rounded text-[10px] font-bold ${isSell ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : isAdd ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-500"}`,
														children: isSell ? "매도" : isAdd ? "추가매수" : "최초매수"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "py-2.5 px-3 font-sans font-bold text-slate-900 dark:text-white",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "ml-1.5 text-[10px] font-mono text-slate-400",
														children: tCur
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-2.5 px-3 text-right",
													children: formatMoney(t.price, tCur)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "py-2.5 px-3 text-right font-bold",
													children: [t.quantity.toLocaleString(), "주"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-2.5 px-3 text-right",
													children: formatMoney(t.totalAmount, tCur)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-2.5 px-3 text-right",
													children: isSell && t.realizedProfit !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: t.realizedProfit >= 0 ? "text-rose-500 font-bold" : "text-blue-500 font-bold",
														children: [formatMoney(t.realizedProfit, tCur, { showSign: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-[10px] block",
															children: [
																"(",
																t.realizedProfitRate && t.realizedProfitRate >= 0 ? "+" : "",
																t.realizedProfitRate?.toFixed(2),
																"%)"
															]
														})]
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-slate-400",
														children: "-"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-2.5 px-4 font-sans text-slate-500 text-[11px] truncate max-w-xs",
													children: t.memo || "-"
												})
											]
										}, t.id);
									})
								})]
							})
						})]
					})
				]
			}),
			mainTab === "mock" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3 text-xs text-blue-800 dark:text-blue-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-5 h-5 text-blue-500 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-sm block",
								children: "🎮 [실시간 가상 자금 모의 트레이딩 시뮬레이터 — KRW / USD 계좌 분리]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "leading-relaxed",
								children: [
									"실제 증권 거래나 금융 비용 청구 없이, ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "원화 가상 자금 ₩100,000,000" }),
									"과 ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "외화 가상 자금 $100,000.00" }),
									"으로 통화별 분리 체결 및 수익률 검증을 진행합니다."
								]
							})]
						})]
					}),
					!fxCheck.valid && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-4 h-4 text-rose-500 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold block",
							children: "USD/KRW 환율 수신 지연·오류 — 기준통화(KRW) 통합 환산 보류"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] opacity-90",
							children: fxCheck.reason || "KRW와 USD 자산은 각 통화 단위로만 정확히 집계됩니다."
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-bold text-slate-500 dark:text-slate-400",
											children: "KRW 원화 모의 계좌"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-600 dark:text-slate-300",
											children: "KRW"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white block",
										children: formatMoney(mockAgg.krw.totalAssets, "KRW")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] font-mono text-emerald-600 dark:text-emerald-400",
										children: [
											"현금 ",
											formatMoney(mockAgg.krw.cash, "KRW"),
											" · 주식 ",
											formatMoney(mockAgg.krw.evaluationAmount, "KRW")
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: mockAgg.krw.unrealizedPnL >= 0 ? "text-rose-500 font-bold" : "text-blue-500 font-bold",
											children: ["평가 ", formatMoney(mockAgg.krw.unrealizedPnL, "KRW", { showSign: true })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: mockAgg.krw.returnRatePercent >= 0 ? "text-rose-500 font-bold" : "text-blue-500 font-bold",
											children: [
												mockAgg.krw.returnRatePercent >= 0 ? "+" : "",
												mockAgg.krw.returnRatePercent.toFixed(2),
												"%"
											]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-bold text-slate-500 dark:text-slate-400",
											children: "USD 달러 모의 계좌"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 font-mono font-bold text-blue-500",
											children: "USD"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white block",
										children: formatMoney(mockAgg.usd.totalAssets, "USD")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] font-mono text-emerald-600 dark:text-emerald-400",
										children: [
											"현금 ",
											formatMoney(mockAgg.usd.cash, "USD"),
											" · 주식 ",
											formatMoney(mockAgg.usd.evaluationAmount, "USD")
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: mockAgg.usd.unrealizedPnL >= 0 ? "text-rose-500 font-bold" : "text-blue-500 font-bold",
											children: ["평가 ", formatMoney(mockAgg.usd.unrealizedPnL, "USD", { showSign: true })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: mockAgg.usd.returnRatePercent >= 0 ? "text-rose-500 font-bold" : "text-blue-500 font-bold",
											children: [
												mockAgg.usd.returnRatePercent >= 0 ? "+" : "",
												mockAgg.usd.returnRatePercent.toFixed(2),
												"%"
											]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-bold text-slate-500 dark:text-slate-400",
										children: "원화 환산 총자산"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${fxCheck.valid ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-500"}`,
										children: fxCheck.valid && fxCheck.rate ? `₩${fxCheck.rate.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}` : "환산 보류"
									})]
								}), mockAgg.convertedKRW ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white block",
									children: formatMoney(mockAgg.convertedKRW.totalAssets, "KRW")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-slate-400 font-mono",
									children: [
										"총수익 ",
										formatMoney(mockAgg.convertedKRW.totalPnL, "KRW", { showSign: true }),
										" (",
										mockAgg.convertedKRW.returnRatePercent >= 0 ? "+" : "",
										mockAgg.convertedKRW.returnRatePercent.toFixed(2),
										"%)"
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["종목손익 ", formatMoney(mockAgg.convertedKRW.stockPnLKRW, "KRW", { showSign: true })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["환차익 ", formatMoney(mockAgg.convertedKRW.fxPnLKRW, "KRW", { showSign: true })] })]
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "py-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-rose-500 block",
										children: "환율 미확인으로 합산 보류"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] text-slate-400 block mt-0.5",
										children: ["시각: ", fxCheck.lastUpdated]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between lg:flex-col lg:justify-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleOpenTradeForStock("005930", "BUY"),
									className: "w-full py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 active:scale-95",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "새 모의 주문" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: handleResetMockAccount,
									className: "w-full py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center justify-center gap-1",
									title: "원화 1억원 / 달러 $100,000 초기화",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "계좌 초기화" })]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-sm sm:text-base text-slate-900 dark:text-white",
									children: "모의투자 보유 종목 포지션"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-slate-400 font-mono",
								children: [
									"수수료: ",
									((mockAccount?.commissionRate ?? 15e-5) * 100).toFixed(3),
									"% | 거래세: ",
									((mockAccount?.taxRate ?? .0018) * 100).toFixed(2),
									"%"
								]
							})]
						}), mockPositions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-16 text-center space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 mx-auto flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-6 h-6" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-bold text-sm text-slate-800 dark:text-slate-200",
									children: "현재 체결된 모의 보유 종목이 없습니다."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-500 max-w-sm mx-auto",
									children: "종목 상세, 관심종목, 검색창에서 즉시 가상 매수를 실행해보세요."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleOpenTradeForStock("005930", "BUY"),
									className: "px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 inline-flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "삼성전자 모의 매수해보기" })]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left border-collapse text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 text-[11px] text-slate-500 uppercase",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 px-4 font-semibold",
											children: "종목명 / 코드"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 px-3 font-semibold text-right",
											children: "보유수량"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 px-3 font-semibold text-right",
											children: "평균 매입단가"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 px-3 font-semibold text-right",
											children: "현재가 (시세상태)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 px-3 font-semibold text-right",
											children: "평가금액"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 px-3 font-semibold text-right",
											children: "평가손익 (수익률)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 px-4 font-semibold text-center",
											children: "주문 실행"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-slate-100 dark:divide-slate-800/60 font-mono",
									children: mockPositions.map((p) => {
										const quote = quotesMap.get(p.symbol);
										const pCur = inferFiatCurrency(p.symbol, p.market, p.currency);
										const isUSD = pCur === "USD";
										const exchangeLabel = inferStockExchange(p.symbol, p.market, p.exchange);
										const curPrice = quote?.price ?? 0;
										const hasQuote = curPrice > 0;
										const valuation = hasQuote ? curPrice * p.quantity : p.totalInvested;
										const profit = hasQuote ? (curPrice - p.avgBuyPrice) * p.quantity : 0;
										const returnPct = p.avgBuyPrice > 0 && hasQuote ? (curPrice - p.avgBuyPrice) / p.avgBuyPrice * 100 : 0;
										const convVal = isUSD ? convertToKRW(valuation, "USD", exchangeRate) : null;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-3.5 px-4 font-sans",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 flex-wrap",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																onClick: () => navigateToStock(p.symbol),
																className: "font-bold text-slate-900 dark:text-white hover:text-rose-500 text-left transition-colors flex items-center gap-1 group",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-rose-500" })]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono",
																children: p.symbol
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: `text-[10px] px-1.5 py-0.5 rounded font-bold font-mono ${isUSD ? "bg-blue-500/10 text-blue-500" : "bg-rose-500/10 text-rose-500"}`,
																children: [
																	exchangeLabel,
																	" · ",
																	pCur
																]
															})
														]
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "py-3.5 px-3 text-right font-bold text-slate-900 dark:text-white",
													children: [p.quantity.toLocaleString(), "주"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-3.5 px-3 text-right font-semibold text-slate-900 dark:text-white",
													children: formatMoney(p.avgBuyPrice, pCur)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-3.5 px-3 text-right",
													children: quote && quote.price > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-bold text-slate-900 dark:text-white block",
														children: formatMoney(curPrice, pCur)
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] text-slate-400 block",
														children: quote.delayLabel
													})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-amber-500 text-[11px]",
														children: "확인 중"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "py-3.5 px-3 text-right font-bold text-slate-900 dark:text-white",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(valuation, pCur) }), isUSD && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] text-slate-400 block font-normal",
														children: convVal?.valid && convVal.valueKRW !== null ? `≈ ${formatMoney(convVal.valueKRW, "KRW")}` : "원화 환산 보류"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-3.5 px-3 text-right",
													children: hasQuote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: profit >= 0 ? "text-rose-500 font-bold" : "text-blue-500 font-bold",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(profit, pCur, { showSign: true }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-[11px] block",
															children: [
																"(",
																profit >= 0 ? "+" : "",
																returnPct.toFixed(2),
																"%)"
															]
														})]
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-slate-400",
														children: "-"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-3.5 px-4 text-center font-sans",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-center gap-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => handleOpenTradeForStock(p.symbol, "BUY"),
															className: "px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[11px] font-bold transition-colors",
															children: "추가 매수"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => handleOpenTradeForStock(p.symbol, "SELL"),
															className: "px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-colors shadow-sm",
															children: "가상 매도"
														})]
													})
												})
											]
										}, p.id);
									})
								})]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-4 h-4 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-sm text-slate-900 dark:text-white",
									children: "모의 주문 체결 내역"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-slate-400 font-mono",
								children: [
									"총 ",
									mockOrders.length,
									"건"
								]
							})]
						}), mockOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-8 text-center text-xs text-slate-400",
							children: "체결된 모의 주문 내역이 없습니다."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto max-h-80 overflow-y-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-xs border-collapse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-[11px] text-slate-500 uppercase",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 px-4 font-semibold",
											children: "주문/체결일시"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 px-3 font-semibold",
											children: "구분"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 px-3 font-semibold",
											children: "상태"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 px-3 font-semibold",
											children: "종목명"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 px-3 font-semibold text-right",
											children: "체결단가"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 px-3 font-semibold text-right",
											children: "체결/주문수량"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 px-3 font-semibold text-right",
											children: "정산금액"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 px-3 font-semibold text-right",
											children: "실현손익"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 px-4 font-semibold",
											children: "매매 전략/사유"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-slate-100 dark:divide-slate-800/60 font-mono",
									children: mockOrders.map((o) => {
										const isSell = o.orderType === "SELL";
										const oCur = inferFiatCurrency(o.symbol, void 0, o.currency ?? quotesMap.get(o.symbol)?.currency);
										const status = o.status || "FILLED";
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-slate-50/60 dark:hover:bg-slate-800/20",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-2.5 px-4 text-slate-500 text-[11px]",
													children: new Date(o.executedAt).toLocaleString("ko-KR")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-2.5 px-3",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `px-2 py-0.5 rounded text-[10px] font-bold ${isSell ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-rose-500/10 text-rose-500"}`,
														children: isSell ? "가상 매도" : "가상 매수"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-2.5 px-3",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `px-2 py-0.5 rounded text-[10px] font-bold ${status === "FILLED" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : status === "PARTIALLY_FILLED" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : status === "CANCELLED" ? "bg-slate-500/10 text-slate-500" : "bg-indigo-500/10 text-indigo-500"}`,
														children: status === "FILLED" ? "체결완료" : status === "PARTIALLY_FILLED" ? `부분체결 (${o.filledQuantity ?? o.quantity}/${o.requestedQuantity ?? o.quantity})` : status === "CANCELLED" ? "주문취소" : "대기(미체결)"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "py-2.5 px-3 font-sans font-bold text-slate-900 dark:text-white",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: o.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "ml-1.5 text-[10px] font-mono text-slate-400",
														children: oCur
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-2.5 px-3 text-right",
													children: status === "PENDING" && (o.filledQuantity ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-slate-400 text-[11px]",
														children: "미체결 대기"
													}) : formatMoney(o.price, oCur)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-2.5 px-3 text-right font-bold",
													children: status === "PARTIALLY_FILLED" ? `${(o.filledQuantity ?? 0).toLocaleString()}주 / ${(o.requestedQuantity ?? o.quantity).toLocaleString()}주` : `${o.quantity.toLocaleString()}주`
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-2.5 px-3 text-right",
													children: status === "PENDING" && (o.filledQuantity ?? 0) === 0 ? "-" : formatMoney(o.settledAmount, oCur)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-2.5 px-3 text-right",
													children: isSell && o.realizedProfit !== void 0 && status !== "PENDING" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: o.realizedProfit >= 0 ? "text-rose-500 font-bold" : "text-blue-500 font-bold",
														children: [formatMoney(o.realizedProfit, oCur, { showSign: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-[10px] block",
															children: [
																"(",
																o.realizedProfitRate && o.realizedProfitRate >= 0 ? "+" : "",
																o.realizedProfitRate?.toFixed(2),
																"%)"
															]
														})]
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-slate-400",
														children: "-"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-2.5 px-4 font-sans text-slate-500 text-[11px] truncate max-w-xs",
													children: o.reason || "-"
												})
											]
										}, o.id);
									})
								})]
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VirtualHoldingModal, {
				isOpen: holdingModalOpen,
				onClose: () => setHoldingModalOpen(false),
				mode: holdingModalMode,
				holding: activeHolding,
				onSuccess: loadData,
				uid: user?.id
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MockTradeModal, {
				isOpen: tradeModalOpen,
				onClose: () => setTradeModalOpen(false),
				symbol: tradeModalSymbol,
				initialType: tradeModalType,
				onTradeSuccess: loadData
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeeSettingsModal, {
				isOpen: feeModalOpen,
				onClose: () => setFeeModalOpen(false),
				currentCommissionPercent: (mockAccount?.commissionRate ?? 15e-5) * 100,
				currentTaxPercent: (mockAccount?.taxRate ?? .0018) * 100,
				onSave: async (c, t) => {
					const updated = await portfolioService.updateFeeSettings(user?.id, c, t);
					setMockAccount(updated);
					showToast(`수수료율(${c}%)과 거래세율(${t}%)이 적용되었습니다.`, "success");
				}
			})
		]
	});
};
//#endregion
export { PortfolioView };
