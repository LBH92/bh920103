import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { Xt as Check, _ as TrendingDown, bn as require_react, g as TrendingUp, i as X, ln as Bell } from "./vendor-lucide-Dji_Ij8j.js";
import { S as inferStockCurrency, b as getCurrencySymbol, n as useApp, v as formatMoney, w as roundByCurrency } from "./AppContext-Butl4QWq.js";
//#region src/components/stocks/SetPriceAlertModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var SetPriceAlertModal = ({ isOpen, onClose, symbol, symbolName, currentPrice }) => {
	const { addPriceAlert, requireAuth, stocks } = useApp();
	const targetStockObj = stocks.find((s) => s.symbol === symbol);
	const stockCur = inferStockCurrency(symbol, targetStockObj?.market, targetStockObj?.currency);
	const currencyLabel = stockCur === "KRW" ? "원" : getCurrencySymbol(stockCur);
	const priceStep = stockCur === "KRW" ? 1 : stockCur === "BTC" ? 1e-8 : .01;
	const minPrice = stockCur === "KRW" ? 1 : stockCur === "BTC" ? 1e-8 : .01;
	const [targetPrice, setTargetPrice] = (0, import_react.useState)(currentPrice);
	const [condition, setCondition] = (0, import_react.useState)("above");
	const [note, setNote] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (isOpen) {
			setTargetPrice(currentPrice);
			setCondition("above");
			setNote("");
		}
	}, [isOpen, currentPrice]);
	if (!isOpen) return null;
	const handleQuickPercent = (pct) => {
		const calculated = roundByCurrency(currentPrice * (1 + pct / 100), stockCur);
		setTargetPrice(calculated);
		setCondition(pct >= 0 ? "above" : "below");
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!requireAuth("가격 알림 설정")) return;
		if (!targetPrice || targetPrice <= 0) return;
		setIsSubmitting(true);
		try {
			await addPriceAlert({
				symbol,
				symbolName,
				targetPrice,
				condition,
				note: note.trim() || void 0
			});
			onClose();
		} catch {} finally {
			setIsSubmitting(false);
		}
	};
	const diffPercent = currentPrice > 0 ? (targetPrice - currentPrice) / currentPrice * 100 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-bold text-base text-slate-900 dark:text-white flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "p-1.5 rounded-lg bg-amber-500/10 text-amber-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-4 h-4" })
					}), "목표가 알림 설정"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-slate-400",
								children: "대상 종목"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm font-black text-slate-900 dark:text-white",
								children: [
									symbolName,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-mono text-slate-500 dark:text-slate-400 font-normal",
										children: [
											"(",
											symbol,
											")"
										]
									})
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-semibold text-slate-400",
									children: [
										"현재가 (",
										stockCur,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-black font-mono text-slate-900 dark:text-white",
									children: formatMoney(currentPrice, stockCur)
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5",
						children: "도달 조건"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setCondition("above"),
							className: `flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${condition === "above" ? "bg-rose-500 text-white shadow-sm shadow-rose-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "상승 돌파 (이상)" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setCondition("below"),
							className: `flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${condition === "below" ? "bg-blue-500 text-white shadow-sm shadow-blue-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "하락 도달 (이하)" })]
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs font-semibold text-slate-500 dark:text-slate-400",
							children: [
								"목표 가격 (",
								stockCur,
								")"
							]
						}), diffPercent !== 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-[11px] font-bold font-mono ${diffPercent > 0 ? "text-rose-500" : "text-blue-500"}`,
							children: diffPercent > 0 ? `+${diffPercent.toFixed(1)}%` : `${diffPercent.toFixed(1)}%`
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: minPrice,
							step: priceStep,
							value: targetPrice || "",
							onChange: (e) => setTargetPrice(Math.max(0, parseFloat(e.target.value) || 0)),
							className: "w-full px-3.5 py-2.5 pr-14 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50",
							placeholder: "목표 가격을 입력하세요",
							required: true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none",
							children: currencyLabel
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-[11px] font-semibold text-slate-400 mb-1.5",
						children: "현재가 대비 빠른 설정"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-4 gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => handleQuickPercent(3),
								className: "py-1 px-2 rounded-lg text-[11px] font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 transition-colors",
								children: "+3%"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => handleQuickPercent(5),
								className: "py-1 px-2 rounded-lg text-[11px] font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 transition-colors",
								children: "+5%"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => handleQuickPercent(-3),
								className: "py-1 px-2 rounded-lg text-[11px] font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20 transition-colors",
								children: "-3%"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => handleQuickPercent(-5),
								className: "py-1 px-2 rounded-lg text-[11px] font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20 transition-colors",
								children: "-5%"
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5",
						children: ["메모 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-slate-400 font-normal",
							children: "(선택)"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						maxLength: 40,
						value: note,
						onChange: (e) => setNote(e.target.value),
						placeholder: "예: 1차 익절 라인, 손절 기준가",
						className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: isSubmitting || targetPrice <= 0,
							className: "w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSubmitting ? "Firestore 저장 중..." : "목표가 알림 등록" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-center text-slate-400 mt-2",
							children: "실시간 시세가 목표 가격에 도달하면 즉시 화면 상단 토스트 알림이 발생합니다."
						})]
					})
				]
			})]
		})
	});
};
//#endregion
export { SetPriceAlertModal as t };
