import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { $t as ChartNoAxesColumn, Et as Globe, Gt as CircleAlert, H as Search, Jt as ChevronLeft, bn as require_react, et as Newspaper, g as TrendingUp, gt as LoaderCircle, i as X, j as SlidersHorizontal, kt as Flame, mn as ArrowUpDown, ot as MessageSquare, pn as ArrowUpRight, qt as ChevronRight, r as Zap, sn as Bookmark, vn as ArrowDownRight, yn as Activity } from "./vendor-lucide-Dji_Ij8j.js";
import { C as inferStockExchange, D as isUSStockSymbol, E as getStockUniqueKey, S as inferStockCurrency, _ as formatMarketCapByCurrency, l as matchHangulSearch, n as useApp, o as stockRepository, v as formatMoney, y as formatTradingValueByCurrency } from "./AppContext-Butl4QWq.js";
import { f as MarketBadge, p as PriceBadge, u as MockTradeModal } from "./index-DLz7vtf6.js";
import { n as isSurgeLoss, r as isVolumeSurge, t as isSurgeGain } from "./marketThresholds-D6T0muT1.js";
import { t as MarketHeatmap } from "./MarketHeatmap-DFljYyAD.js";
import { i as InteractiveStockChart, n as StockNewsSection, r as OrderBookWidget, t as StockCommunitySection } from "./StockCommunitySection-B9XzrTDW.js";
//#region src/components/stocks/TabletStockTradingView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var TabletStockTradingView = () => {
	const { stocks, watchlist, toggleWatchlist, isWatchlisted, selectedSymbol: globalSelectedSymbol, navigateToStock, requireAuth, exchangeRate } = useApp();
	const [selectedSymbol, setSelectedSymbol] = (0, import_react.useState)(() => {
		return globalSelectedSymbol || (stocks.length > 0 ? stocks[0].symbol : "005930");
	});
	const [marketFilter, setMarketFilter] = (0, import_react.useState)("ALL");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [remoteSearchResults, setRemoteSearchResults] = (0, import_react.useState)([]);
	const [isSearchingRemote, setIsSearchingRemote] = (0, import_react.useState)(false);
	const [remoteSearchError, setRemoteSearchError] = (0, import_react.useState)(null);
	const [remoteSearchRetry, setRemoteSearchRetry] = (0, import_react.useState)(0);
	const [selectedRemoteStock, setSelectedRemoteStock] = (0, import_react.useState)(null);
	const [isLeftCollapsed, setIsLeftCollapsed] = (0, import_react.useState)(false);
	const [activeRightTab, setActiveRightTab] = (0, import_react.useState)("orderbook");
	const [isTradeModalOpen, setIsTradeModalOpen] = (0, import_react.useState)(false);
	const activeStock = (0, import_react.useMemo)(() => {
		const local = stocks.find((s) => s.symbol === selectedSymbol);
		if (local) return local;
		if (selectedRemoteStock && selectedRemoteStock.symbol === selectedSymbol) return selectedRemoteStock;
		return stocks[0] || null;
	}, [
		stocks,
		selectedSymbol,
		selectedRemoteStock
	]);
	(0, import_react.useEffect)(() => {
		if (globalSelectedSymbol && globalSelectedSymbol !== selectedSymbol) {
			setSelectedSymbol(globalSelectedSymbol);
			if (!stocks.some((s) => s.symbol === globalSelectedSymbol)) stockRepository.getStock(globalSelectedSymbol).then((fetched) => {
				if (fetched) setSelectedRemoteStock(fetched);
			}).catch(() => {});
		}
	}, [globalSelectedSymbol]);
	(0, import_react.useEffect)(() => {
		const q = searchQuery.trim();
		if (!q || marketFilter === "WATCHLIST") {
			setRemoteSearchResults([]);
			setIsSearchingRemote(false);
			setRemoteSearchError(null);
			return;
		}
		const controller = new AbortController();
		setIsSearchingRemote(true);
		setRemoteSearchError(null);
		const timer = setTimeout(async () => {
			try {
				const results = await stockRepository.searchStocks({
					query: q,
					limit: 25,
					market: marketFilter !== "ALL" ? marketFilter : void 0,
					signal: controller.signal
				});
				if (!controller.signal.aborted) setRemoteSearchResults(results);
			} catch (err) {
				if (err?.name === "AbortError" || controller.signal.aborted) return;
				setRemoteSearchResults([]);
				setRemoteSearchError(err?.message || "검색 서버 연결 실패");
			} finally {
				if (!controller.signal.aborted) setIsSearchingRemote(false);
			}
		}, 180);
		return () => {
			controller.abort();
			clearTimeout(timer);
		};
	}, [
		searchQuery,
		marketFilter,
		remoteSearchRetry
	]);
	const filteredStocks = (0, import_react.useMemo)(() => {
		const q = searchQuery.trim();
		if (q && marketFilter !== "WATCHLIST") return remoteSearchResults;
		return stocks.filter((stock) => {
			if (q) {
				const matchesName = matchHangulSearch(stock.name, q);
				const matchesNameEn = stock.nameEn ? stock.nameEn.toLowerCase().includes(q.toLowerCase()) : false;
				const matchesSymbol = stock.symbol.toLowerCase().includes(q.toLowerCase());
				const matchesSector = stock.sector.toLowerCase().includes(q.toLowerCase());
				if (!matchesName && !matchesNameEn && !matchesSymbol && !matchesSector) return false;
			}
			if (marketFilter === "WATCHLIST") return isWatchlisted(stock.symbol);
			if (marketFilter === "KOSPI") return stock.market === "KOSPI";
			if (marketFilter === "KOSDAQ") return stock.market === "KOSDAQ";
			if (marketFilter === "US") return stock.market === "US" || isUSStockSymbol(stock.symbol);
			if (marketFilter === "COIN") return stock.market === "COIN" || stock.symbol.includes("-") || stock.symbol.endsWith("USDT");
			return true;
		});
	}, [
		stocks,
		remoteSearchResults,
		searchQuery,
		marketFilter,
		watchlist,
		isWatchlisted
	]);
	const handleSelectListStock = async (stock) => {
		setSelectedSymbol(stock.symbol);
		setSelectedRemoteStock(stock);
		if (!stocks.some((s) => s.symbol === stock.symbol)) try {
			const full = await stockRepository.getStock(stock.symbol);
			if (full) setSelectedRemoteStock(full);
		} catch {}
	};
	(0, import_react.useEffect)(() => {
		if (!searchQuery.trim() && filteredStocks.length > 0 && !filteredStocks.some((s) => s.symbol === selectedSymbol) && !selectedRemoteStock) setSelectedSymbol(filteredStocks[0].symbol);
	}, [
		filteredStocks,
		selectedSymbol,
		searchQuery,
		selectedRemoteStock
	]);
	const activeCur = activeStock ? inferStockCurrency(activeStock.symbol, activeStock.market, activeStock.currency) : "KRW";
	const activeExchange = activeStock ? inferStockExchange(activeStock.symbol, activeStock.market, activeStock.exchange) : "";
	const isWatch = activeStock ? isWatchlisted(activeStock.symbol) : false;
	const isUp = activeStock ? activeStock.change >= 0 : true;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col md:flex-row h-[calc(100vh-120px)] rounded-2xl bg-finance-card border border-finance-border shadow-xs overflow-hidden select-none text-finance-text",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `hidden md:flex flex-col border-r border-finance-border bg-finance-sub-bg/30 transition-all duration-200 shrink-0 ${isLeftCollapsed ? "w-12" : "w-[32%] min-w-[260px] max-w-[360px]"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 border-b border-finance-border flex items-center justify-between gap-2",
						children: [!isLeftCollapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-3.5 h-3.5 absolute left-3 top-2.5 text-finance-sub-text pointer-events-none" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: searchQuery,
									onChange: (e) => setSearchQuery(e.target.value),
									placeholder: "종목명·코드·초성 (ㅅㅅ, aapl)",
									className: "w-full pl-8 pr-7 py-1.5 rounded-xl bg-finance-card border border-finance-border text-xs tablet:text-[13px] text-finance-text placeholder:text-finance-sub-text focus:outline-none focus:ring-1 focus:ring-finance-accent"
								}),
								searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setSearchQuery(""),
									className: "absolute right-2.5 top-2 text-finance-sub-text hover:text-finance-text",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3 h-3" })
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setIsLeftCollapsed(!isLeftCollapsed),
							className: "p-1.5 rounded-lg border border-finance-border hover:bg-finance-sub-bg text-finance-sub-text transition-colors",
							title: isLeftCollapsed ? "종목 목록 펼치기" : "종목 목록 접기",
							children: isLeftCollapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4 h-4" })
						})]
					}),
					!isLeftCollapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-2.5 py-2 border-b border-finance-border bg-finance-sub-bg/50 flex items-center gap-1 overflow-x-auto no-scrollbar",
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
							},
							{
								id: "WATCHLIST",
								label: "관심"
							}
						].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMarketFilter(tab.id),
							className: `px-2.5 py-1 rounded-lg text-[11px] tablet:text-[12px] font-bold shrink-0 transition-all cursor-pointer ${marketFilter === tab.id ? "bg-finance-accent text-white shadow-xs" : "text-finance-sub-text hover:text-finance-text hover:bg-finance-sub-bg"}`,
							children: tab.label
						}, tab.id))
					}),
					!isLeftCollapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-3 py-1.5 bg-finance-sub-bg/70 border-b border-finance-border text-[10px] tablet:text-[11px] text-finance-sub-text font-semibold flex items-center justify-between uppercase",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "종목명 / 코드" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "현재가" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-14 text-right",
								children: "등락률"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60",
						children: isSearchingRemote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "통합 종목 검색 중..." })]
						}) : remoteSearchError && searchQuery.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5 text-center space-y-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-5 h-5 text-amber-500 mx-auto" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-slate-500",
									children: remoteSearchError
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setRemoteSearchRetry((n) => n + 1),
									className: "px-3 py-1 rounded-lg bg-rose-500 text-white font-bold cursor-pointer",
									children: "다시 시도"
								})
							]
						}) : filteredStocks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-6 text-center text-xs text-slate-400",
							children: "일치하는 종목이 없습니다."
						}) : filteredStocks.map((stock) => {
							const isSelected = stock.symbol === selectedSymbol;
							const stockIsUp = stock.change >= 0;
							if (isLeftCollapsed) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleSelectListStock(stock),
								className: `w-full py-3 flex flex-col items-center justify-center transition-colors ${isSelected ? "bg-rose-500/10 border-l-4 border-rose-500 text-rose-600 font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-500"}`,
								title: `${stock.name} (${stock.symbol})`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-mono font-bold uppercase truncate max-w-[40px]",
									children: stock.symbol.slice(0, 4)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `text-[9px] font-mono tabular-nums ${stockIsUp ? "text-rose-500" : "text-blue-500"}`,
									children: [
										stockIsUp ? "+" : "",
										stock.changePercent.toFixed(1),
										"%"
									]
								})]
							}, getStockUniqueKey(stock));
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => handleSelectListStock(stock),
								className: `px-3 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${isSelected ? "bg-finance-accent/15 border-l-4 border-finance-accent text-finance-text font-bold" : "hover:bg-finance-sub-bg/60 text-finance-text"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0 pr-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-xs tablet:text-[14.5px] truncate max-w-[120px] tablet:max-w-[150px] text-finance-text whitespace-nowrap",
											children: stock.name
										}), isWatchlisted(stock.symbol) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-amber-500 text-[10px] tablet:text-[11px]",
											title: "관심종목",
											children: "★"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 mt-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] tablet:text-[11.5px] text-finance-sub-text font-mono tabular-nums",
											children: stock.symbol
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] tablet:text-[10.5px] px-1 py-0.2 rounded bg-finance-sub-bg text-finance-sub-text border border-finance-border/50",
											children: stock.market
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold text-xs tablet:text-[14px] block text-finance-text tabular-nums whitespace-nowrap",
										children: formatMoney(stock.price, inferStockCurrency(stock.symbol, stock.market, stock.currency))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `text-[10px] tablet:text-[11.5px] font-mono font-bold block tabular-nums whitespace-nowrap ${stockIsUp ? "text-finance-up" : "text-finance-down"}`,
										children: [
											stockIsUp ? "+" : "",
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 flex flex-col min-w-0 overflow-y-auto",
				children: activeStock ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:hidden px-4 py-2 bg-finance-sub-bg/80 border-b border-finance-border flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-finance-sub-text font-semibold",
							children: "종목 전환:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: selectedSymbol,
							onChange: (e) => {
								const found = stocks.find((s) => s.symbol === e.target.value);
								if (found) handleSelectListStock(found);
							},
							className: "flex-1 bg-finance-card border border-finance-border rounded-lg px-2.5 py-1 text-xs text-finance-text font-bold focus:outline-none",
							children: stocks.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: s.symbol,
								children: [
									s.name,
									" (",
									s.symbol,
									")"
								]
							}, s.symbol))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 sm:p-5 border-b border-finance-border bg-finance-card flex flex-wrap items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-lg sm:text-xl tablet:text-[21px] font-black text-finance-text truncate whitespace-nowrap",
										children: activeStock.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs tablet:text-[12px] px-2 py-0.5 rounded-md bg-finance-sub-bg font-mono tabular-nums text-finance-sub-text border border-finance-border",
										children: activeStock.symbol
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs tablet:text-[12px] font-semibold px-2 py-0.5 rounded-full bg-finance-accent/15 text-finance-accent border border-finance-accent/30",
										children: [
											activeExchange,
											" · ",
											activeCur
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs tablet:text-[12px] text-finance-sub-text hidden sm:inline",
										children: activeStock.sector
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline gap-3 mt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xl sm:text-2xl tablet:text-[22px] font-black font-mono tabular-nums whitespace-nowrap text-finance-text",
									children: formatMoney(activeStock.price, activeCur)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `text-sm tablet:text-[14px] font-bold font-mono tabular-nums whitespace-nowrap flex items-center gap-0.5 ${isUp ? "text-finance-up" : "text-finance-down"}`,
									children: [
										isUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "w-4 h-4" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											isUp ? "+" : "",
											activeStock.changePercent.toFixed(2),
											"%"
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs tablet:text-[11.5px] font-normal tabular-nums",
											children: [
												"(",
												formatMoney(activeStock.change, activeCur, { showSign: true }),
												")"
											]
										})
									]
								})]
							})] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => toggleWatchlist(activeStock.symbol),
									className: `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs tablet:text-[13px] font-bold transition-all whitespace-nowrap ${isWatch ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30" : "bg-finance-sub-bg hover:bg-finance-card text-finance-text border border-finance-border"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: `w-3.5 h-3.5 ${isWatch ? "fill-amber-500 text-amber-500" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isWatch ? "관심 등록됨" : "관심 등록" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setIsTradeModalOpen(true),
									className: "flex items-center gap-1.5 px-4 py-2 rounded-xl bg-finance-accent hover:opacity-90 text-white text-xs tablet:text-[13px] font-bold transition-all shadow-xs active:scale-95 cursor-pointer whitespace-nowrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "모의 매매" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => navigateToStock(activeStock.symbol),
									className: "p-2 rounded-xl border border-finance-border hover:bg-finance-sub-bg text-finance-sub-text transition-colors",
									title: "전체 상세 화면으로 보기",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-4 h-4" })
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-3 px-5 py-3 bg-finance-sub-bg/30 border-b border-finance-border text-xs text-finance-text",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] tablet:text-[11.5px] text-finance-sub-text block leading-snug",
								children: "당일 고가 / 저가"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono font-bold text-finance-text text-xs tablet:text-[13.5px] tabular-nums whitespace-nowrap",
								children: [
									formatMoney(activeStock.highPrice || activeStock.price, activeCur),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-finance-sub-text font-normal",
										children: " / "
									}),
									formatMoney(activeStock.lowPrice || activeStock.price, activeCur)
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] tablet:text-[11.5px] text-finance-sub-text block leading-snug",
								children: "거래량 (24H)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono font-bold text-finance-text text-xs tablet:text-[13.5px] tabular-nums whitespace-nowrap",
								children: [(activeStock.volume || 0).toLocaleString(), activeStock.market === "COIN" ? "" : "주"]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] tablet:text-[11.5px] text-finance-sub-text block leading-snug",
								children: "시가총액"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono font-bold text-finance-text text-xs tablet:text-[13.5px] tabular-nums whitespace-nowrap",
								children: formatMarketCapByCurrency(activeStock.marketCap, activeCur)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] tablet:text-[11.5px] text-finance-sub-text block leading-snug",
								children: "PER / PBR"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono font-bold text-finance-text text-xs tablet:text-[13.5px] tabular-nums whitespace-nowrap",
								children: [
									activeStock.per ? `${activeStock.per.toFixed(1)}배` : "-",
									" / ",
									activeStock.pbr ? `${activeStock.pbr.toFixed(2)}배` : "-"
								]
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 bg-finance-card border-b border-finance-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InteractiveStockChart, {
							symbol: activeStock.symbol,
							candles: activeStock.candles,
							stockPrice: activeStock.price,
							prevClose: activeStock.prevClose || activeStock.price,
							currency: activeStock.currency
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 sm:p-5 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2 border-b border-finance-border pb-3 overflow-x-auto no-scrollbar",
							children: [
								{
									id: "orderbook",
									label: "실시간 호가 / 체결",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { className: "w-3.5 h-3.5" })
								},
								{
									id: "metrics",
									label: "기업 분석 & 재무비율",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-3.5 h-3.5" })
								},
								{
									id: "news",
									label: "뉴스 & 공시",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, { className: "w-3.5 h-3.5" })
								},
								{
									id: "community",
									label: "주주 토론방",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-3.5 h-3.5" })
								}
							].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveRightTab(tab.id),
								className: `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs tablet:text-[13px] font-bold transition-all cursor-pointer whitespace-nowrap ${activeRightTab === tab.id ? "bg-finance-accent text-white shadow-xs" : "text-finance-sub-text hover:text-finance-text hover:bg-finance-sub-bg"}`,
								children: [tab.icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.label })]
							}, tab.id))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							activeRightTab === "orderbook" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "max-w-xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderBookWidget, { stock: activeStock })
							}),
							activeRightTab === "metrics" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-finance-sub-bg/30 border border-finance-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-finance-card rounded-xl border border-finance-border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-finance-sub-text text-xs tablet:text-[11.5px] block mb-1",
											children: "52주 최고가"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-bold text-sm tablet:text-[14px] text-finance-text tabular-nums whitespace-nowrap",
											children: activeStock.high52w ? formatMoney(activeStock.high52w, activeCur) : "-"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-finance-card rounded-xl border border-finance-border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-finance-sub-text text-xs tablet:text-[11.5px] block mb-1",
											children: "52주 최저가"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-bold text-sm tablet:text-[14px] text-finance-text tabular-nums whitespace-nowrap",
											children: activeStock.low52w ? formatMoney(activeStock.low52w, activeCur) : "-"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-finance-card rounded-xl border border-finance-border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-finance-sub-text text-xs tablet:text-[11.5px] block mb-1",
											children: "주당순이익 (EPS)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-bold text-sm tablet:text-[14px] text-finance-text tabular-nums whitespace-nowrap",
											children: activeStock.eps ? formatMoney(activeStock.eps, activeCur) : "-"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-finance-card rounded-xl border border-finance-border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-finance-sub-text text-xs tablet:text-[11.5px] block mb-1",
											children: "배당수익률"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-bold text-sm tablet:text-[14px] text-finance-accent tabular-nums whitespace-nowrap",
											children: activeStock.dividendYield ? `${activeStock.dividendYield.toFixed(2)}%` : "-"
										})]
									})
								]
							}),
							activeRightTab === "news" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockNewsSection, { stock: activeStock }),
							activeRightTab === "community" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockCommunitySection, { stock: activeStock })
						] })]
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 flex items-center justify-center p-8 text-slate-400 text-xs",
					children: "종목을 선택해주세요."
				})
			}),
			activeStock && isTradeModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MockTradeModal, {
				isOpen: isTradeModalOpen,
				onClose: () => setIsTradeModalOpen(false),
				symbol: activeStock.symbol,
				stockName: activeStock.name,
				initialType: "BUY"
			})
		]
	});
};
//#endregion
//#region src/components/stocks/StockListView.tsx
var StockListView = () => {
	const { stocks, navigateToStock, watchlist, toggleWatchlist, isWatchlisted, setActiveTab } = useApp();
	const [viewMode, setViewMode] = (0, import_react.useState)("trading");
	const [currentMarketTab, setCurrentMarketTab] = (0, import_react.useState)("ALL");
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [searchResults, setSearchResults] = (0, import_react.useState)([]);
	const [isSearching, setIsSearching] = (0, import_react.useState)(false);
	const [searchError, setSearchError] = (0, import_react.useState)(null);
	const [retryNonce, setRetryNonce] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const q = searchTerm.trim();
		if (!q) {
			setSearchResults([]);
			setIsSearching(false);
			setSearchError(null);
			return;
		}
		const controller = new AbortController();
		setIsSearching(true);
		setSearchError(null);
		const handler = setTimeout(async () => {
			try {
				const results = await stockRepository.searchStocks({
					query: q,
					limit: 25,
					market: currentMarketTab !== "ALL" ? currentMarketTab : void 0,
					signal: controller.signal
				});
				if (!controller.signal.aborted) setSearchResults(results);
			} catch (err) {
				if (err?.name === "AbortError" || controller.signal.aborted) return;
				console.error("[StockListView] Search API error:", err);
				setSearchResults([]);
				setSearchError(err?.message || "종목 검색 중 오류가 발생했습니다.");
			} finally {
				if (!controller.signal.aborted) setIsSearching(false);
			}
		}, 180);
		return () => {
			controller.abort();
			clearTimeout(handler);
		};
	}, [
		searchTerm,
		currentMarketTab,
		retryNonce
	]);
	const [sectorFilter, setSectorFilter] = (0, import_react.useState)("ALL");
	const [conditionFilter, setConditionFilter] = (0, import_react.useState)("ALL");
	const [sortField, setSortField] = (0, import_react.useState)("marketCap");
	const [sortOrder, setSortOrder] = (0, import_react.useState)("desc");
	const sectors = [
		"ALL",
		"반도체",
		"바이오",
		"2차전지",
		"방위산업",
		"자동차",
		"IT인터넷"
	];
	const sorted = [...searchTerm.trim().length >= 1 ? searchResults : stocks.filter((stock) => {
		const matchesMarketTab = currentMarketTab === "ALL" || currentMarketTab === "KOSPI" && stock.market === "KOSPI" || currentMarketTab === "KOSDAQ" && stock.market === "KOSDAQ" || currentMarketTab === "US" && stock.market === "US" || currentMarketTab === "COIN" && stock.market === "COIN";
		const matchesSector = sectorFilter === "ALL" || stock.sector.toLowerCase().includes(sectorFilter.toLowerCase());
		const matchesCondition = conditionFilter === "ALL" || conditionFilter === "SURGE" && isSurgeGain(stock.changePercent) || conditionFilter === "PLUNGE" && isSurgeLoss(stock.changePercent) || conditionFilter === "VOLUME" && isVolumeSurge(stock.volumeRatio);
		return matchesMarketTab && matchesSector && matchesCondition;
	})].sort((a, b) => {
		let aVal = a[sortField];
		let bVal = b[sortField];
		if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
		else return aVal < bVal ? 1 : -1;
	});
	const handleSort = (field) => {
		if (sortField === field) setSortOrder((prev) => prev === "desc" ? "asc" : "desc");
		else {
			setSortField(field);
			setSortOrder("desc");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 animate-in fade-in duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2 mb-4 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl w-fit",
				children: [
					"ALL",
					"KOSPI",
					"KOSDAQ",
					"US",
					"COIN"
				].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setCurrentMarketTab(tab),
					className: `px-4 py-1.5 rounded-lg text-sm tablet:text-[13px] font-bold transition-all whitespace-nowrap ${currentMarketTab === tab ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
					children: tab === "ALL" ? "전체" : tab === "KOSPI" ? "코스피" : tab === "KOSDAQ" ? "코스닥" : tab === "US" ? "미국" : "코인"
				}, tab))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl tablet:text-[21px] font-black text-slate-900 dark:text-white truncate",
					children: currentMarketTab === "ALL" ? "종합 시장 시세" : currentMarketTab === "KOSPI" ? "코스피 시장" : currentMarketTab === "KOSDAQ" ? "코스닥 시장" : currentMarketTab === "US" ? "미국 시장" : "가상자산 시장"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs sm:text-sm tablet:text-[13px] text-slate-500 dark:text-slate-400 mt-0.5",
					children: "실시간 시장 시세 및 재무 지표를 탐색하세요."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2.5 w-full md:w-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-xl p-1 border border-slate-200/60 dark:border-slate-700/60 shrink-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setViewMode("trading"),
									className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewMode === "trading" ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
									title: "업비트형 태블릿/PC 2열 거래 화면",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "2열 거래화면" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setViewMode("list"),
									className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewMode === "list" ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "리스트" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setViewMode("heatmap"),
									className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewMode === "heatmap" ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-3.5 h-3.5 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "시장 히트맵" })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveTab("ranking"),
							className: "flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all cursor-pointer shrink-0",
							title: "실시간 상승/하락/거래량/거래대금 TOP 20 보기",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "w-4 h-4 text-amber-500" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "실시간 순위"
								}),
								" TOP 20"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1 md:w-64",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: searchTerm,
									onChange: (e) => setSearchTerm(e.target.value),
									placeholder: "종목명, 코드 검색...",
									className: "w-full pl-9 pr-8 py-2 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
								}),
								searchTerm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setSearchTerm(""),
									className: "absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
								})
							]
						})
					]
				})]
			}),
			viewMode === "trading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabletStockTradingView, {}) : viewMode === "heatmap" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketHeatmap, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-slate-400 mr-1 shrink-0",
							children: "특징주 포착:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setConditionFilter("ALL"),
							className: `px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 ${conditionFilter === "ALL" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`,
							children: "전체 종목"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setConditionFilter("SURGE"),
							className: `px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0 ${conditionFilter === "SURGE" ? "bg-rose-600 text-white shadow-xs" : "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/20"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "급등 (+5% 이상)" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setConditionFilter("PLUNGE"),
							className: `px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0 ${conditionFilter === "PLUNGE" ? "bg-blue-600 text-white shadow-xs" : "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border border-blue-500/20"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "급락 (-5% 이하)" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setConditionFilter("VOLUME"),
							className: `px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0 ${conditionFilter === "VOLUME" ? "bg-amber-600 text-white shadow-xs" : "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/20"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "거래량 급증 (200% 이상)" })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1 overflow-x-auto scrollbar-none py-1",
						children: sectors.map((sec) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSectorFilter(sec),
							className: `px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${sectorFilter === sec ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`,
							children: sec === "ALL" ? "모든 섹터" : sec
						}, sec))
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden",
				children: [
					searchError && searchTerm.trim().length >= 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 bg-rose-500/5 border-b border-rose-500/20 flex items-center justify-between gap-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-rose-500 font-semibold",
							children: searchError
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setRetryNonce((n) => n + 1),
							className: "px-3 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold shrink-0 cursor-pointer",
							children: "다시 시도"
						})]
					}),
					isSearching && searchTerm.trim().length >= 1 && sorted.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-8 text-center text-xs text-slate-400",
						children: "종목 검색 중입니다..."
					}),
					!isSearching && !searchError && sorted.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-8 text-center text-xs text-slate-400",
						children: "일치하는 종목이 없습니다."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-slate-100 dark:divide-slate-800 md:hidden font-sans",
						children: sorted.map((stock) => {
							const isWatch = isWatchlisted(stock.symbol);
							const cur = inferStockCurrency(stock.symbol, stock.market, stock.currency);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => navigateToStock(stock.symbol),
								className: "p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 pr-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-sm text-slate-900 dark:text-white truncate",
											children: stock.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] font-mono px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500",
											children: [
												stock.exchange || stock.market,
												" · ",
												cur
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 flex-wrap",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: stock.symbol
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: stock.sector }),
											isSurgeGain(stock.changePercent) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20",
												children: "급등 (+5%)"
											}),
											isSurgeLoss(stock.changePercent) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20",
												children: "급락 (-5%)"
											}),
											isVolumeSurge(stock.volumeRatio) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20",
												children: [
													"거래량 급증 (",
													stock.volumeRatio,
													"%)"
												]
											})
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-bold font-mono text-sm text-slate-900 dark:text-white",
											children: formatMoney(stock.price, cur)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceBadge, {
											change: stock.change,
											changePercent: stock.changePercent,
											currency: cur,
											size: "sm"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: (e) => {
											e.stopPropagation();
											toggleWatchlist(stock.symbol);
										},
										className: `p-1.5 rounded-lg transition-colors ${isWatch ? "text-amber-500" : "text-slate-300 dark:text-slate-600"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: `w-4 h-4 ${isWatch ? "fill-amber-500" : ""}` })
									})]
								})]
							}, getStockUniqueKey(stock));
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden md:block overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-semibold bg-slate-50/50 dark:bg-slate-800/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4",
										children: "종목정보"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										onClick: () => handleSort("changePercent"),
										className: "py-3 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "inline-flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "현재가 / 등락" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "w-3 h-3" })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										onClick: () => handleSort("volume"),
										className: "py-3 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "inline-flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "거래량 (주)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "w-3 h-3" })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										onClick: () => handleSort("volumeRatio"),
										className: "py-3 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "inline-flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "거래량 급증비" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "w-3 h-3" })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										onClick: () => handleSort("tradingValue"),
										className: "py-3 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "inline-flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "거래대금" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "w-3 h-3" })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										onClick: () => handleSort("marketCap"),
										className: "py-3 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "inline-flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "시가총액" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "w-3 h-3" })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 text-right",
										children: "외인 / 기관"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 text-center",
										children: "관심"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-slate-100 dark:divide-slate-800/60 font-sans",
								children: sorted.map((stock) => {
									const isWatch = isWatchlisted(stock.symbol);
									const cur = inferStockCurrency(stock.symbol, stock.market, stock.currency);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										onClick: () => navigateToStock(stock.symbol),
										className: "hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3.5 px-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex items-center gap-2.5",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-bold text-slate-900 dark:text-white tablet:text-[14.5px] group-hover:text-rose-500 transition-colors whitespace-nowrap",
																children: stock.name
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-xs tablet:text-[11.5px] font-mono tabular-nums text-slate-400",
																children: stock.symbol
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketBadge, {
																market: stock.market,
																exchange: stock.exchange
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: `text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${cur === "USD" || cur === "USDT" ? "bg-indigo-500/10 text-indigo-500" : "bg-emerald-500/10 text-emerald-500"}`,
																children: cur
															}),
															isSurgeGain(stock.changePercent) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "px-1.5 py-0.2 rounded text-[10px] tablet:text-[11px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 whitespace-nowrap",
																children: "급등"
															}),
															isSurgeLoss(stock.changePercent) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "px-1.5 py-0.2 rounded text-[10px] tablet:text-[11px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 whitespace-nowrap",
																children: "급락"
															}),
															isVolumeSurge(stock.volumeRatio) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "px-1.5 py-0.2 rounded text-[10px] tablet:text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 whitespace-nowrap",
																children: "거래급증"
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs tablet:text-[11.5px] text-slate-400 whitespace-nowrap",
														children: stock.sector
													})] })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "py-3.5 px-4 text-right",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-bold font-mono tablet:text-[14px] text-slate-900 dark:text-white tabular-nums whitespace-nowrap",
													children: formatMoney(stock.price, cur)
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceBadge, {
													change: stock.change,
													changePercent: stock.changePercent,
													currency: cur,
													size: "sm"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "py-3.5 px-4 text-right font-mono text-xs tablet:text-[12px] tabular-nums whitespace-nowrap text-slate-700 dark:text-slate-300",
												children: [stock.volume.toLocaleString(), stock.market === "COIN" ? "" : "주"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3.5 px-4 text-right font-mono text-xs tablet:text-[12px] tabular-nums whitespace-nowrap",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: `font-bold ${stock.volumeRatio >= 200 ? "text-amber-500" : "text-slate-400"}`,
													children: [stock.volumeRatio, "%"]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3.5 px-4 text-right font-mono text-xs tablet:text-[12px] tabular-nums whitespace-nowrap text-slate-700 dark:text-slate-300",
												children: formatTradingValueByCurrency(stock.tradingValue, cur)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3.5 px-4 text-right font-mono text-xs tablet:text-[12px] tabular-nums whitespace-nowrap text-slate-700 dark:text-slate-300",
												children: formatMarketCapByCurrency(stock.marketCap, cur)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3.5 px-4 text-right text-xs tablet:text-[11.5px] font-mono tabular-nums whitespace-nowrap",
												children: cur === "KRW" && stock.market !== "COIN" && stock.foreignNetBuy != null && stock.instNetBuy != null && stock.investorDataAvailable ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: stock.foreignNetBuy >= 0 ? "text-rose-500" : "text-blue-500",
													children: [
														"외: ",
														stock.foreignNetBuy > 0 ? "+" : "",
														stock.foreignNetBuy,
														"억"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: stock.instNetBuy >= 0 ? "text-rose-500" : "text-blue-500",
													children: [
														"기: ",
														stock.instNetBuy > 0 ? "+" : "",
														stock.instNetBuy,
														"억"
													]
												})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-400",
													children: "-"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3.5 px-4 text-center",
												onClick: (e) => e.stopPropagation(),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => toggleWatchlist(stock.symbol),
													className: `p-1.5 rounded-lg transition-colors ${isWatch ? "text-amber-500 hover:text-amber-600" : "text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-300"}`,
													title: isWatch ? "관심종목 해제" : "관심종목 추가",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: `w-4 h-4 ${isWatch ? "fill-amber-500" : ""}` })
												})
											})
										]
									}, getStockUniqueKey(stock));
								})
							})]
						})
					})
				]
			})] })
		]
	});
};
//#endregion
export { StockListView };
