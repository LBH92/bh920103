import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { Gt as CircleAlert, H as Search, Xt as Check, bn as require_react, i as X } from "./vendor-lucide-Dji_Ij8j.js";
import { C as inferStockExchange, T as validateExchangeRate, n as useApp, o as stockRepository, v as formatMoney, w as roundByCurrency, x as inferFiatCurrency } from "./AppContext-Butl4QWq.js";
import { d as portfolioService } from "./index-DLz7vtf6.js";
//#region src/components/portfolio/VirtualHoldingModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var VirtualHoldingModal = ({ isOpen, onClose, mode, holding, onSuccess, uid, defaultSymbol }) => {
	const { exchangeRate } = useApp();
	const fxCheck = validateExchangeRate(exchangeRate);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [searchResults, setSearchResults] = (0, import_react.useState)([]);
	const [selectedStock, setSelectedStock] = (0, import_react.useState)(null);
	const [price, setPrice] = (0, import_react.useState)("");
	const [quantity, setQuantity] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [memo, setMemo] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [errorMsg, setErrorMsg] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (isOpen) {
			setErrorMsg("");
			setIsSubmitting(false);
			if (holding) {
				const cur = inferFiatCurrency(holding.symbol, holding.market, holding.currency);
				const exchange = inferStockExchange(holding.symbol, holding.market, holding.exchange);
				setSelectedStock({
					symbol: holding.symbol,
					name: holding.name,
					market: holding.market,
					exchange,
					currency: cur,
					price: holding.avgBuyPrice
				});
				if (mode === "edit") {
					setPrice(String(holding.avgBuyPrice));
					setQuantity(String(holding.quantity));
					setDate(holding.buyDate || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
					setMemo(holding.memo || "");
				} else if (mode === "add_buy") {
					setPrice(String(holding.avgBuyPrice));
					setQuantity("");
					setDate((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
					setMemo("");
				} else if (mode === "sell") {
					setPrice(String(holding.avgBuyPrice));
					setQuantity(String(holding.quantity));
					setDate((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
					setMemo("");
				}
			} else if (defaultSymbol) {
				stockRepository.getStock(defaultSymbol).then((s) => {
					if (s) {
						const cur = inferFiatCurrency(s.symbol, s.market, s.currency);
						const exchange = inferStockExchange(s.symbol, s.market, s.exchange);
						setSelectedStock({
							symbol: s.symbol,
							name: s.name,
							market: s.market,
							exchange,
							currency: cur,
							price: s.price
						});
						setPrice(String(s.price));
					}
				});
				setQuantity("");
				setDate((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
				setMemo("");
			} else {
				setSelectedStock(null);
				setPrice("");
				setQuantity("");
				setDate((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
				setMemo("");
			}
		}
	}, [
		isOpen,
		mode,
		holding,
		defaultSymbol
	]);
	(0, import_react.useEffect)(() => {
		if (!searchQuery.trim() || mode !== "create" || selectedStock) {
			setSearchResults([]);
			return;
		}
		const timer = setTimeout(() => {
			stockRepository.searchStocks({
				query: searchQuery,
				limit: 6
			}).then((res) => {
				setSearchResults(res);
			});
		}, 150);
		return () => clearTimeout(timer);
	}, [
		searchQuery,
		mode,
		selectedStock
	]);
	if (!isOpen) return null;
	const activeCurrency = selectedStock?.currency || inferFiatCurrency(holding?.symbol, holding?.market, holding?.currency);
	const isUSD = activeCurrency === "USD";
	const validFxRate = fxCheck.valid && fxCheck.rate ? fxCheck.rate : void 0;
	const numPrice = parseFloat(price) || 0;
	const numQty = parseInt(quantity, 10) || 0;
	let addBuyPreview = null;
	if (mode === "add_buy" && holding && numQty > 0 && numPrice > 0) {
		const newQty = holding.quantity + numQty;
		const rawNewAvg = (holding.quantity * holding.avgBuyPrice + numQty * numPrice) / newQty;
		const newAvg = roundByCurrency(rawNewAvg, activeCurrency);
		addBuyPreview = {
			newQty,
			newAvg,
			diffAvg: roundByCurrency(newAvg - holding.avgBuyPrice, activeCurrency),
			totalAmount: roundByCurrency(numQty * numPrice, activeCurrency)
		};
	}
	let sellPreview = null;
	if (mode === "sell" && holding && numQty > 0 && numPrice > 0) {
		const grossSell = roundByCurrency(numQty * numPrice, activeCurrency);
		const costBasis = roundByCurrency(numQty * holding.avgBuyPrice, activeCurrency);
		sellPreview = {
			grossSell,
			profit: roundByCurrency(grossSell - costBasis, activeCurrency),
			rate: holding.avgBuyPrice > 0 ? (numPrice - holding.avgBuyPrice) / holding.avgBuyPrice * 100 : 0,
			remainingQty: holding.quantity - numQty
		};
	}
	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMsg("");
		if (!selectedStock) {
			setErrorMsg("종목을 선택해주세요.");
			return;
		}
		if (numPrice <= 0) {
			setErrorMsg("매매 단가는 0보다 커야 합니다.");
			return;
		}
		if (numQty <= 0) {
			setErrorMsg("수량은 1주 이상이어야 합니다.");
			return;
		}
		setIsSubmitting(true);
		try {
			if (mode === "create") await portfolioService.saveVirtualHolding(uid, {
				symbol: selectedStock.symbol,
				name: selectedStock.name,
				market: selectedStock.market,
				exchange: selectedStock.exchange,
				currency: selectedStock.currency,
				avgBuyPrice: roundByCurrency(numPrice, selectedStock.currency),
				quantity: numQty,
				buyDate: date,
				entryExchangeRate: selectedStock.currency === "USD" ? validFxRate : void 0,
				memo
			});
			else if (mode === "add_buy" && holding) await portfolioService.addBuyVirtualHolding(uid, holding.id, numQty, roundByCurrency(numPrice, activeCurrency), date, memo, validFxRate);
			else if (mode === "sell" && holding) {
				if (numQty > holding.quantity) throw new Error(`보유 수량(${holding.quantity}주)을 초과하여 매도할 수 없습니다.`);
				await portfolioService.sellVirtualHolding(uid, holding.id, numQty, roundByCurrency(numPrice, activeCurrency), date, 0, 0, memo, validFxRate);
			} else if (mode === "edit" && holding) await portfolioService.saveVirtualHolding(uid, {
				symbol: holding.symbol,
				name: holding.name,
				market: holding.market,
				exchange: selectedStock.exchange,
				currency: activeCurrency,
				avgBuyPrice: roundByCurrency(numPrice, activeCurrency),
				quantity: numQty,
				buyDate: date,
				entryExchangeRate: holding.entryExchangeRate ?? (isUSD ? validFxRate : void 0),
				memo
			}, holding.id);
			onSuccess();
			onClose();
		} catch (err) {
			setErrorMsg(err.message || "저장 중 오류가 발생했습니다.");
		} finally {
			setIsSubmitting(false);
		}
	};
	const getTitle = () => {
		switch (mode) {
			case "create": return "가상 보유 종목 등록";
			case "add_buy": return `'${holding?.name}' 추가 매수 기록`;
			case "sell": return `'${holding?.name}' 매도 및 실현손익 기록`;
			case "edit": return `'${holding?.name}' 보유 내역 수정`;
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-bold text-base text-slate-900 dark:text-white flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: getTitle() })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
					children: "실제 증권 계좌와 무관한 사용자 수기 입력 가상 포트폴리오입니다."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "p-5 space-y-4 overflow-y-auto flex-1",
				children: [
					errorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-500 font-semibold flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errorMsg })]
					}),
					mode === "create" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
						children: "종목 검색 및 선택"
					}), selectedStock ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-sm text-slate-900 dark:text-white",
									children: selectedStock.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold",
									children: selectedStock.symbol
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] px-1.5 py-0.5 rounded font-mono font-bold bg-rose-500/10 text-rose-500",
									children: [
										selectedStock.exchange,
										" · ",
										selectedStock.currency
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setSelectedStock(null);
								setPrice("");
							},
							className: "text-xs text-slate-400 hover:text-rose-500 font-semibold",
							children: "변경"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 absolute left-3.5 top-3 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value),
								placeholder: "종목명 또는 심볼 입력 (예: 삼성전자, 005930, AAPL)",
								className: "w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
							})]
						}), searchResults.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-h-40 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1f2c] shadow-lg",
							children: searchResults.map((stock) => {
								const sCur = inferFiatCurrency(stock.symbol, stock.market, stock.currency);
								const sExchange = inferStockExchange(stock.symbol, stock.market, stock.exchange);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setSelectedStock({
											symbol: stock.symbol,
											name: stock.name,
											market: stock.market,
											exchange: sExchange,
											currency: sCur,
											price: stock.price
										});
										setPrice(String(stock.price));
										setSearchQuery("");
										setSearchResults([]);
									},
									className: "w-full p-2.5 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-xs text-slate-900 dark:text-white",
											children: stock.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[11px] font-mono text-slate-400",
											children: [
												stock.symbol,
												" · ",
												sExchange
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs font-bold text-slate-900 dark:text-white",
										children: formatMoney(stock.price, sCur)
									})]
								}, stock.symbol);
							})
						})]
					})] }),
					holding && (mode === "add_buy" || mode === "sell") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 grid grid-cols-3 gap-2 text-center text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-slate-400 block",
								children: "현재 보유수량"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold font-mono text-slate-900 dark:text-white",
								children: [holding.quantity.toLocaleString(), "주"]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-slate-400 block",
								children: "평균 매입단가"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold font-mono text-slate-900 dark:text-white",
								children: formatMoney(holding.avgBuyPrice, activeCurrency)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-slate-400 block",
								children: "총 매입금액"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold font-mono text-slate-900 dark:text-white",
								children: formatMoney(holding.quantity * holding.avgBuyPrice, activeCurrency)
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
							children: mode === "sell" ? `매도 단가 (${isUSD ? "USD $" : "KRW ₩"})` : mode === "add_buy" ? `추가 매수가 (${isUSD ? "USD $" : "KRW ₩"})` : `매수 단가 (${isUSD ? "USD $" : "KRW ₩"})`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: "0.01",
							step: "any",
							value: price,
							onChange: (e) => setPrice(e.target.value),
							placeholder: isUSD ? "예: 225.50" : "예: 75000",
							className: "w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500",
							required: true
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold text-slate-700 dark:text-slate-300",
								children: mode === "sell" ? "매도 수량 (주)" : mode === "add_buy" ? "추가 매수 수량 (주)" : "보유 수량 (주)"
							}), mode === "sell" && holding && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-1",
								children: [
									.25,
									.5,
									1
								].map((ratio) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setQuantity(String(Math.floor(holding.quantity * ratio))),
									className: "px-1.5 py-0.5 text-[10px] rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300",
									children: ratio === 1 ? "전량" : `${ratio * 100}%`
								}, ratio))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: "1",
							max: mode === "sell" && holding ? holding.quantity : void 0,
							step: "1",
							value: quantity,
							onChange: (e) => setQuantity(e.target.value),
							placeholder: "예: 10",
							className: "w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500",
							required: true
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
						children: mode === "sell" ? "매도 일자" : "매수 일자"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: date,
						onChange: (e) => setDate(e.target.value),
						className: "w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500",
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
						children: "투자 메모 / 매매 사유 (선택)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: memo,
						onChange: (e) => setMemo(e.target.value),
						placeholder: "예: 분할 매수 2차 진입, 실적 발표 모멘텀",
						className: "w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
					})] }),
					addBuyPreview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-emerald-600 dark:text-emerald-400 block",
								children: "📊 추가 매수 후 평균단가 변동 시뮬레이션"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between font-mono",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-600 dark:text-slate-300",
									children: "새 총 보유수량:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-slate-900 dark:text-white",
									children: [addBuyPreview.newQty.toLocaleString(), "주"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between font-mono",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-600 dark:text-slate-300",
									children: "새 평균 매입가:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-emerald-600 dark:text-emerald-400",
									children: [formatMoney(addBuyPreview.newAvg, activeCurrency), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] ml-1 text-slate-400",
										children: [
											"(",
											formatMoney(addBuyPreview.diffAvg, activeCurrency, { showSign: true }),
											")"
										]
									})]
								})]
							})
						]
					}),
					sellPreview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-1 font-mono",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-blue-600 dark:text-blue-400 block font-sans",
								children: "💰 매도 시 실현손익 계산 시뮬레이션"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-600 dark:text-slate-300",
									children: "매도 총액:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-slate-900 dark:text-white",
									children: formatMoney(sellPreview.grossSell, activeCurrency)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-600 dark:text-slate-300",
									children: "실현손익:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `font-bold ${sellPreview.profit >= 0 ? "text-rose-500" : "text-blue-500"}`,
									children: [
										formatMoney(sellPreview.profit, activeCurrency, { showSign: true }),
										" (",
										sellPreview.profit >= 0 ? "+" : "",
										sellPreview.rate.toFixed(2),
										"%)"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-[11px] text-slate-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "매도 후 잔여 수량:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									sellPreview.remainingQty,
									"주 ",
									sellPreview.remainingQty === 0 ? "(전량 매도)" : ""
								] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							disabled: isSubmitting,
							className: "px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
							children: "취소"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: isSubmitting,
							className: `flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md active:scale-95 ${mode === "sell" ? "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20" : "bg-rose-600 hover:bg-rose-500 shadow-rose-600/20"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSubmitting ? "처리 중..." : mode === "sell" ? "매도 기록 저장" : "저장하기" })]
						})]
					})
				]
			})]
		})
	});
};
//#endregion
export { VirtualHoldingModal as t };
