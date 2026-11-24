import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { F as ShieldCheck, G as RefreshCw, H as Search, Ht as Clock, _n as ArrowDown, bn as require_react, fn as ArrowUp, h as TriangleAlert, ln as Bell, mt as LogIn, q as Plus, r as Zap, sn as Bookmark, v as Trash2 } from "./vendor-lucide-Dji_Ij8j.js";
import { C as inferStockExchange, S as inferStockCurrency, T as validateExchangeRate, g as convertToKRW, n as useApp, v as formatMoney, w as roundByCurrency, x as inferFiatCurrency, y as formatTradingValueByCurrency } from "./AppContext-Butl4QWq.js";
import { p as PriceBadge, u as MockTradeModal } from "./index-DLz7vtf6.js";
import { t as WatchlistNotificationSettingsModal } from "./WatchlistNotificationSettingsModal-pcQ4Mu3a.js";
import { t as useStockPurchases } from "./useStockPurchases-Br6d2qyD.js";
//#region src/components/watchlist/WatchlistView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var WatchlistView = () => {
	const { stocks, watchlist, watchlistDetails, toggleWatchlist, reorderWatchlist, navigateToStock, setActiveTab, setIsSearchOpen, isAuthenticated, setIsAuthModalOpen, user, isSimulatingLiveTicks, refreshWatchlistQuotes, exchangeRate } = useApp();
	const { purchases } = useStockPurchases(user?.id);
	const getPurchasesStats = (entries, currentPrice, currency) => {
		const totalQty = entries.reduce((acc, cur) => acc + cur.quantity, 0);
		const totalCost = entries.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
		const avgPrice = totalQty > 0 ? roundByCurrency(totalCost / totalQty, currency) : 0;
		const evaluationAmount = roundByCurrency(totalQty * currentPrice, currency);
		const profit = roundByCurrency(evaluationAmount - totalCost, currency);
		return {
			totalQty,
			avgPrice,
			totalCost,
			evaluationAmount,
			profit,
			profitRate: totalCost > 0 ? profit / totalCost * 100 : 0
		};
	};
	const [lastUpdateTime, setLastUpdateTime] = (0, import_react.useState)(() => (/* @__PURE__ */ new Date()).toLocaleTimeString("ko-KR"));
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const [selectedTradeStock, setSelectedTradeStock] = (0, import_react.useState)(null);
	const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (watchlist.length > 0) refreshWatchlistQuotes();
	}, [watchlist.join(",")]);
	const handleManualRefresh = async () => {
		setIsRefreshing(true);
		try {
			await refreshWatchlistQuotes();
			setLastUpdateTime((/* @__PURE__ */ new Date()).toLocaleTimeString("ko-KR"));
		} finally {
			setTimeout(() => setIsRefreshing(false), 400);
		}
	};
	(0, import_react.useEffect)(() => {
		const timer = setInterval(() => {
			setLastUpdateTime((/* @__PURE__ */ new Date()).toLocaleTimeString("ko-KR"));
		}, 4e3);
		return () => clearInterval(timer);
	}, []);
	const watchlistStocks = watchlistDetails;
	const fxCheck = validateExchangeRate(exchangeRate);
	const krwWatchStocks = watchlistStocks.filter((s) => inferFiatCurrency(s.symbol, s.market, s.currency) === "KRW");
	const usdWatchStocks = watchlistStocks.filter((s) => inferFiatCurrency(s.symbol, s.market, s.currency) === "USD");
	const krwTotalValue = Math.round(krwWatchStocks.reduce((acc, cur) => acc + cur.price * 10, 0));
	const krwTotalChange = Math.round(krwWatchStocks.reduce((acc, cur) => acc + cur.change * 10, 0));
	const krwTotalChangePct = krwTotalValue - krwTotalChange > 0 ? krwTotalChange / (krwTotalValue - krwTotalChange) * 100 : 0;
	const usdTotalValue = Number(usdWatchStocks.reduce((acc, cur) => acc + cur.price * 10, 0).toFixed(2));
	const usdTotalChange = Number(usdWatchStocks.reduce((acc, cur) => acc + cur.change * 10, 0).toFixed(2));
	const usdTotalChangePct = usdTotalValue - usdTotalChange > 0 ? usdTotalChange / (usdTotalValue - usdTotalChange) * 100 : 0;
	const hasUsdWatchlist = usdWatchStocks.length > 0;
	const convertedTotalValueKRW = !hasUsdWatchlist ? krwTotalValue : fxCheck.valid && fxCheck.rate !== null ? Math.round(krwTotalValue + usdTotalValue * fxCheck.rate) : null;
	const convertedTotalChangeKRW = !hasUsdWatchlist ? krwTotalChange : fxCheck.valid && fxCheck.rate !== null ? Math.round(krwTotalChange + usdTotalChange * fxCheck.rate) : null;
	const handleMoveUp = (e, index) => {
		e.stopPropagation();
		if (index <= 0) return;
		const newOrder = [...watchlist];
		const temp = newOrder[index - 1];
		newOrder[index - 1] = newOrder[index];
		newOrder[index] = temp;
		reorderWatchlist(newOrder);
	};
	const handleMoveDown = (e, index) => {
		e.stopPropagation();
		if (index >= watchlist.length - 1) return;
		const newOrder = [...watchlist];
		const temp = newOrder[index + 1];
		newOrder[index + 1] = newOrder[index];
		newOrder[index] = temp;
		reorderWatchlist(newOrder);
	};
	if (!isAuthenticated) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-20 text-center max-w-md mx-auto space-y-4 animate-in fade-in duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "w-8 h-8" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-xl font-black text-slate-900 dark:text-white",
				children: "나만의 관심종목을 관리하세요"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed",
				children: "로그인하시면 클라우드 Firestore에 관심종목이 안전하게 연동되며, 모든 기기에서 실시간 시세와 변동률을 확인할 수 있습니다."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setIsAuthModalOpen(true),
				className: "px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-rose-600/20 inline-flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "로그인 / 회원가입하기" })]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12 animate-in fade-in duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "w-6 h-6 text-rose-500 fill-rose-500" }), "내 관심종목 포트폴리오"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Firebase 동기화됨" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 font-mono",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "KR · US · COIN 통합 시세" })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5",
					children: [user?.name, "님의 관심종목 실시간 시세, 거래대금 및 통화별(KRW/USD) 변동 현황입니다."]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 self-start sm:self-auto flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setIsNotificationSettingsOpen(true),
							className: "flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs",
							title: "관심종목 급변 브라우저 알림 설정 (Firestore 저장)",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-3.5 h-3.5 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "급변 알림 설정" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleManualRefresh,
							disabled: isRefreshing,
							className: "flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs transition-all cursor-pointer disabled:opacity-50",
							title: "실시간 시세 새로고침",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-rose-500" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isRefreshing ? "조회중..." : "시세 새로고침" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setIsSearchOpen(true),
							className: "flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "관심종목 추가" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-slate-400 block mb-1",
								children: "관심 종목 수"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-2xl font-black text-slate-900 dark:text-white font-mono",
								children: [
									watchlistStocks.length,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-sans font-medium text-slate-400",
										children: "개"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-slate-400 block mt-1",
								children: [
									"국내/원화 ",
									krwWatchStocks.length,
									" · 해외/달러 ",
									usdWatchStocks.length
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-slate-400 block mb-1",
								children: "10주 균등 매수 시뮬레이션 (통화별)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [
									krwWatchStocks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-lg font-black text-slate-900 dark:text-white font-mono",
										children: ["KRW ", formatMoney(krwTotalValue, "KRW")]
									}),
									usdWatchStocks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono",
										children: ["USD ", formatMoney(usdTotalValue, "USD")]
									}),
									watchlistStocks.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-black text-slate-400 font-mono",
										children: "-"
									})
								]
							}),
							hasUsdWatchlist && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-slate-400 block mt-1 font-mono",
								children: convertedTotalValueKRW !== null && fxCheck.rate ? `통합 환산 ≈ ${formatMoney(convertedTotalValueKRW, "KRW")} (₩${fxCheck.rate.toLocaleString()}/$)` : "⚠️ 환율 확인 불가로 KRW 통합 환산 중단"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-slate-400 block mb-1",
								children: "당일 평가 손익 (통화별 분리)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [
									krwWatchStocks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-baseline gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-lg font-black font-mono ${krwTotalChange >= 0 ? "text-rose-500" : "text-blue-500"}`,
											children: formatMoney(krwTotalChange, "KRW", { showSign: true })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceBadge, {
											change: krwTotalChange,
											changePercent: krwTotalChangePct,
											currency: "KRW",
											size: "sm",
											showIcon: false
										})]
									}),
									usdWatchStocks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-baseline gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-lg font-black font-mono ${usdTotalChange >= 0 ? "text-rose-500" : "text-blue-500"}`,
											children: formatMoney(usdTotalChange, "USD", { showSign: true })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceBadge, {
											change: usdTotalChange,
											changePercent: usdTotalChangePct,
											currency: "USD",
											size: "sm",
											showIcon: false
										})]
									}),
									convertedTotalChangeKRW !== null && hasUsdWatchlist && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] font-mono text-slate-400",
										children: ["통합 환산 ≈ ", formatMoney(convertedTotalChangeKRW, "KRW", { showSign: true })]
									}),
									hasUsdWatchlist && convertedTotalChangeKRW === null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-amber-500 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "환율 오류/지연으로 KRW 통합 손익 미산출" })]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-slate-400 block mt-1 flex items-center gap-1 font-mono",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3 text-slate-400" }),
									"최근 갱신: ",
									lastUpdateTime
								]
							})
						]
					})
				]
			}),
			watchlistStocks.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 bg-slate-50/50 dark:bg-slate-800/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "항목을 클릭하면 종목 상세 화면으로 이동합니다." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-mono",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2 h-2 rounded-full ${isSimulatingLiveTicks ? "bg-rose-500 animate-ping" : "bg-slate-400"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["마지막 시세 갱신: ", lastUpdateTime] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden md:block overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-semibold bg-slate-50/50 dark:bg-slate-800/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3.5 px-4 text-center w-16",
										children: "순서"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3.5 px-4",
										children: "종목명 / 종목코드"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3.5 px-4 text-right",
										children: "현재가"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3.5 px-4 text-right",
										children: "등락률"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3.5 px-4 text-right",
										children: "거래량"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3.5 px-4 text-right",
										children: "거래대금"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3.5 px-4 text-right",
										children: "평가손익 / 수익률"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3.5 px-4 text-right",
										children: "오늘의 변동 (고/저)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3.5 px-4 text-right",
										children: "마지막 업데이트"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3.5 px-4 text-center w-20",
										children: "삭제"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-slate-100 dark:divide-slate-800/60 font-sans",
								children: watchlistStocks.map((stock, idx) => {
									const isUp = stock.change >= 0;
									const cur = inferStockCurrency(stock.symbol, stock.market, stock.currency);
									const exchangeLabel = inferStockExchange(stock.symbol, stock.market, stock.exchange);
									const stats = getPurchasesStats(purchases[stock.symbol] || [], stock.price, cur);
									const krwConv = cur !== "KRW" ? convertToKRW(stock.price, cur, exchangeRate) : null;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										onClick: () => navigateToStock(stock.symbol),
										className: "hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-4 px-2 text-center",
												onClick: (e) => e.stopPropagation(),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-center gap-0.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: (e) => handleMoveUp(e, idx),
														disabled: idx === 0,
														className: "p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-20 text-slate-500",
														title: "위로 이동",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "w-3.5 h-3.5" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: (e) => handleMoveDown(e, idx),
														disabled: idx === watchlistStocks.length - 1,
														className: "p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-20 text-slate-500",
														title: "아래로 이동",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "w-3.5 h-3.5" })
													})]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "py-4 px-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 flex-wrap",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors",
															children: stock.name
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold",
															children: stock.symbol
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500",
															children: exchangeLabel
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: `text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${cur === "USD" || cur === "USDT" ? "bg-indigo-500/10 text-indigo-500" : "bg-emerald-500/10 text-emerald-500"}`,
															children: cur
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-slate-400 mt-0.5 block",
													children: stock.sector
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "py-4 px-4 text-right font-mono font-bold text-slate-900 dark:text-white",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: formatMoney(stock.price, cur) }), krwConv?.valid && krwConv.valueKRW !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[10px] font-normal text-slate-400",
													children: ["≈ ", formatMoney(krwConv.valueKRW, "KRW")]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-4 px-4 text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceBadge, {
													change: stock.change,
													changePercent: stock.changePercent,
													currency: cur,
													size: "sm"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "py-4 px-4 text-right font-mono text-xs text-slate-700 dark:text-slate-300",
												children: [stock.volume.toLocaleString(), stock.market === "COIN" ? "" : "주"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-4 px-4 text-right font-mono text-xs font-bold text-slate-900 dark:text-white",
												children: formatTradingValueByCurrency(stock.tradingValue, cur)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-4 px-4 text-right font-mono text-xs",
												children: stats.totalQty > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: stats.profit >= 0 ? "text-rose-500 font-bold" : "text-blue-500 font-bold",
													children: formatMoney(stats.profit, cur, { showSign: true })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: stats.profitRate >= 0 ? "text-rose-500" : "text-blue-500",
													children: [
														stats.profitRate >= 0 ? "+" : "",
														stats.profitRate.toFixed(2),
														"%"
													]
												})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-400",
													children: "-"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "py-4 px-4 text-right font-mono text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: isUp ? "text-rose-500 font-bold" : "text-blue-500 font-bold",
													children: formatMoney(stock.change, cur, { showSign: true })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[10px] text-slate-400 mt-0.5",
													children: [
														formatMoney(stock.highPrice, cur),
														" / ",
														formatMoney(stock.lowPrice, cur)
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-4 px-4 text-right font-mono text-xs text-slate-400",
												children: lastUpdateTime
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-4 px-4 text-center",
												onClick: (e) => e.stopPropagation(),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-center gap-1.5 font-sans",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => setSelectedTradeStock(stock),
														className: "px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold transition-colors",
														title: "모의 매매 바로가기",
														children: "모의매매"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => toggleWatchlist(stock.symbol),
														className: "p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors",
														title: "관심종목에서 삭제",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
													})]
												})
											})
										]
									}, stock.symbol);
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-slate-100 dark:divide-slate-800 md:hidden font-sans",
						children: watchlistStocks.map((stock, idx) => {
							const cur = inferStockCurrency(stock.symbol, stock.market, stock.currency);
							const exchangeLabel = inferStockExchange(stock.symbol, stock.market, stock.exchange);
							const krwConv = cur !== "KRW" ? convertToKRW(stock.price, cur, exchangeRate) : null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => navigateToStock(stock.symbol),
								className: "p-4 space-y-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 min-w-0",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-sm text-slate-900 dark:text-white truncate",
													children: stock.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-mono text-slate-400",
													children: stock.symbol
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] font-mono px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500",
													children: [
														exchangeLabel,
														" · ",
														cur
													]
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1",
											onClick: (e) => e.stopPropagation(),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: (e) => handleMoveUp(e, idx),
													disabled: idx === 0,
													className: "p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-20",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "w-3.5 h-3.5" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: (e) => handleMoveDown(e, idx),
													disabled: idx === watchlistStocks.length - 1,
													className: "p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-20",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "w-3.5 h-3.5" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: (e) => {
														e.stopPropagation();
														setSelectedTradeStock(stock);
													},
													className: "px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]",
													children: "모의매매"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => toggleWatchlist(stock.symbol),
													className: "p-1 text-slate-400 hover:text-rose-500 ml-1",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-baseline justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-bold font-mono text-base text-slate-900 dark:text-white",
											children: formatMoney(stock.price, cur)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] font-mono text-slate-400 mt-0.5",
											children: [
												"변동: ",
												formatMoney(stock.change, cur, { showSign: true }),
												krwConv?.valid && krwConv.valueKRW !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "ml-2",
													children: ["· ≈ ", formatMoney(krwConv.valueKRW, "KRW")]
												})
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceBadge, {
											change: stock.change,
											changePercent: stock.changePercent,
											currency: cur,
											size: "sm"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-500",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-400 block text-[10px]",
												children: "거래량"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [(stock.volume / 1e3).toFixed(0), "k"] })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-400 block text-[10px]",
												children: "거래대금"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTradingValueByCurrency(stock.tradingValue, cur) })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-right",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-400 block text-[10px]",
													children: "갱신시간"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lastUpdateTime })]
											})
										]
									})
								]
							}, stock.symbol);
						})
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-12 text-center bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-lg text-slate-800 dark:text-slate-200",
						children: "아직 관심종목이 비어 있습니다"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs sm:text-sm text-slate-400 max-w-sm mx-auto",
						children: "종목 상세 페이지에서 오른쪽 상단의 '관심종목 추가' 버튼을 누르거나 검색창을 통해 종목을 등록하세요."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setIsSearchOpen(true),
							className: "px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 inline-flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "종목 검색하고 추가하기" })]
						})
					})
				]
			}),
			selectedTradeStock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MockTradeModal, {
				isOpen: Boolean(selectedTradeStock),
				onClose: () => setSelectedTradeStock(null),
				symbol: selectedTradeStock.symbol,
				stockName: selectedTradeStock.name,
				defaultPrice: selectedTradeStock.price,
				initialType: "BUY"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WatchlistNotificationSettingsModal, {
				isOpen: isNotificationSettingsOpen,
				onClose: () => setIsNotificationSettingsOpen(false)
			})
		]
	});
};
//#endregion
export { WatchlistView };
