import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { G as RefreshCw, Gt as CircleAlert, H as Search, O as Sparkles, bn as require_react, bt as Info, i as X, vt as Layers } from "./vendor-lucide-Dji_Ij8j.js";
import { C as inferStockExchange, S as inferStockCurrency, T as validateExchangeRate, _ as formatMarketCapByCurrency, g as convertToKRW, n as useApp, o as stockRepository, v as formatMoney } from "./AppContext-Butl4QWq.js";
import { p as PriceBadge } from "./index-DLz7vtf6.js";
//#region src/components/stocks/StockComparisonView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var STOCK_COLORS = [
	"#f43f5e",
	"#6366f1",
	"#10b981",
	"#f59e0b",
	"#8b5cf6",
	"#06b6d4"
];
var PRESETS = [
	{
		name: "글로벌 반도체",
		symbols: [
			"005930",
			"000660",
			"NVDA",
			"TSM"
		]
	},
	{
		name: "빅테크 매그니피센트",
		symbols: [
			"AAPL",
			"MSFT",
			"GOOGL",
			"TSLA"
		]
	},
	{
		name: "국내 2차전지",
		symbols: [
			"373220",
			"247540",
			"086520",
			"051910"
		]
	},
	{
		name: "주요 가상자산",
		symbols: [
			"KRW-BTC",
			"KRW-ETH",
			"KRW-SOL",
			"KRW-XRP"
		]
	}
];
var StockComparisonView = () => {
	const { navigateToStock, exchangeRate } = useApp();
	const [selectedSymbols, setSelectedSymbols] = (0, import_react.useState)([
		"005930",
		"000660",
		"NVDA",
		"AAPL"
	]);
	const [period, setPeriod] = (0, import_react.useState)("3M");
	const [comparedData, setComparedData] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [isSearching, setIsSearching] = (0, import_react.useState)(false);
	const [searchResults, setSearchResults] = (0, import_react.useState)([]);
	const [showSearchDropdown, setShowSearchDropdown] = (0, import_react.useState)(false);
	const searchRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const handleOutside = (e) => {
			if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearchDropdown(false);
		};
		document.addEventListener("mousedown", handleOutside);
		return () => document.removeEventListener("mousedown", handleOutside);
	}, []);
	(0, import_react.useEffect)(() => {
		const q = searchQuery.trim();
		if (!q) {
			setSearchResults([]);
			setIsSearching(false);
			return;
		}
		setIsSearching(true);
		const timer = setTimeout(async () => {
			try {
				const results = await stockRepository.searchStocks({
					query: q,
					limit: 8
				});
				setSearchResults(results);
				setShowSearchDropdown(true);
			} catch (err) {
				console.warn("[StockComparison] search error:", err);
			} finally {
				setIsSearching(false);
			}
		}, 200);
		return () => clearTimeout(timer);
	}, [searchQuery]);
	const loadComparisonData = async () => {
		if (selectedSymbols.length === 0) {
			setComparedData([]);
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		setError(null);
		try {
			const results = [];
			for (const symbol of selectedSymbols) try {
				const [stock, candles] = await Promise.all([stockRepository.getStock(symbol), stockRepository.getChartCandles(symbol, period)]);
				if (stock && candles && candles.length > 0) {
					const firstClose = candles[0].close || 1;
					const normalized = candles.map((c) => (c.close - firstClose) / firstClose * 100);
					const periodReturn = (candles[candles.length - 1].close - firstClose) / firstClose * 100;
					results.push({
						stock,
						candles,
						normalized,
						periodReturn
					});
				}
			} catch (err) {
				console.warn(`[StockComparison] Failed to load data for ${symbol}:`, err);
			}
			setComparedData(results);
		} catch (e) {
			setError("종목 비교 데이터를 불러오지 못했습니다.");
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadComparisonData();
	}, [selectedSymbols, period]);
	const handleAddStock = (symbol) => {
		if (selectedSymbols.includes(symbol)) return;
		if (selectedSymbols.length >= 6) {
			alert("동시 비교는 최대 6개 종목까지 지원됩니다.");
			return;
		}
		setSelectedSymbols((prev) => [...prev, symbol]);
		setSearchQuery("");
		setShowSearchDropdown(false);
	};
	const handleRemoveStock = (symbol) => {
		setSelectedSymbols((prev) => prev.filter((s) => s !== symbol));
	};
	const handleApplyPreset = (symbols) => {
		setSelectedSymbols(symbols);
	};
	const chartMetrics = (0, import_react.useMemo)(() => {
		if (comparedData.length === 0) return null;
		let minVal = 0;
		let maxVal = 0;
		let maxPoints = 0;
		comparedData.forEach((d) => {
			d.normalized.forEach((v) => {
				if (v < minVal) minVal = v;
				if (v > maxVal) maxVal = v;
			});
			if (d.candles.length > maxPoints) maxPoints = d.candles.length;
		});
		const range = Math.max(Math.abs(maxVal - minVal), 5);
		return {
			yMin: Math.floor(minVal - range * .1),
			yMax: Math.ceil(maxVal + range * .1),
			maxPoints
		};
	}, [comparedData]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-20 animate-in fade-in duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-6 h-6 text-purple-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "종목 다중 비교 (한국 · 미국 · 가상자산)" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5",
					children: "국내 주식, 미국 빅테크, 주요 가상자산의 누적 수익률과 핵심 재무 지표를 실시간 비교하세요."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold self-start sm:self-auto",
					children: [
						"1W",
						"1M",
						"3M",
						"1Y"
					].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setPeriod(p),
						className: `px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${period === p ? "bg-purple-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
						children: p
					}, p))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5 text-amber-500" }), "추천 테마:"]
						}), PRESETS.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => handleApplyPreset(preset.symbols),
							className: "px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 transition-colors shrink-0 cursor-pointer border border-transparent hover:border-purple-300 dark:hover:border-purple-800",
							children: preset.name
						}, preset.name))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-full md:w-80",
						ref: searchRef,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: searchQuery,
									onChange: (e) => setSearchQuery(e.target.value),
									onFocus: () => {
										if (searchResults.length > 0) setShowSearchDropdown(true);
									},
									placeholder: "비교할 종목 추가 (코드, 티커, 코인)",
									className: "w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium"
								}),
								searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setSearchQuery("");
										setSearchResults([]);
									},
									className: "absolute right-2.5 text-slate-400 hover:text-slate-600",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
								})
							]
						}), showSearchDropdown && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-[#1a1f2c] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800",
							children: isSearching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-3 text-center text-xs text-slate-400",
								children: "검색 중..."
							}) : searchResults.length > 0 ? searchResults.map((stock) => {
								const isAdded = selectedSymbols.includes(stock.symbol);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: () => !isAdded && handleAddStock(stock.symbol),
									className: `p-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${isAdded ? "opacity-50 cursor-default" : "cursor-pointer"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-xs text-slate-900 dark:text-white truncate",
												children: stock.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500",
												children: stock.symbol
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-slate-400 mt-0.5",
											children: [
												stock.market,
												" · ",
												stock.sector
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: isAdded,
										className: `px-2 py-0.5 text-[11px] font-bold rounded ${isAdded ? "bg-slate-100 dark:bg-slate-800 text-slate-400" : "bg-purple-600 text-white hover:bg-purple-700"}`,
										children: isAdded ? "추가됨" : "+ 추가"
									})]
								}, stock.symbol);
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-3 text-center text-xs text-slate-400",
								children: "일치하는 종목이 없습니다."
							})
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100 dark:border-slate-800/80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-bold text-slate-400",
						children: [
							"비교 종목 (",
							selectedSymbols.length,
							"/6):"
						]
					}), selectedSymbols.map((sym, idx) => {
						const data = comparedData.find((d) => d.stock.symbol === sym);
						const color = STOCK_COLORS[idx % STOCK_COLORS.length];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-2.5 h-2.5 rounded-full shrink-0",
									style: { backgroundColor: color }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-900 dark:text-white",
									children: data?.stock.name || sym
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-mono text-slate-400",
									children: [
										"(",
										sym,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => handleRemoveStock(sym),
									className: "p-0.5 text-slate-400 hover:text-rose-500 transition-colors ml-1 cursor-pointer",
									title: "종목 제거",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
								})
							]
						}, sym);
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-base font-bold text-slate-900 dark:text-white flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"기간별 상대 수익률 비교 차트 (",
							period,
							")"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 font-mono",
							children: "기준점: 0.00%"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-400 mt-0.5",
						children: "비교 시작일의 종가를 0%로 정규화하여 기간 내 상대적 초과 수익률을 추적합니다."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: loadComparisonData,
						disabled: isLoading,
						className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer self-start sm:self-auto border border-slate-200 dark:border-slate-700",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3.5 h-3.5 ${isLoading ? "animate-spin text-purple-500" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "새로고침" })]
					})]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-72 flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center gap-2 text-xs text-slate-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-8 h-8 border-3 border-purple-500/30 border-t-purple-600 rounded-full animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "차트 및 캔들 정규화 계산 중..." })]
					})
				}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "h-64 flex items-center justify-center text-rose-500 text-xs font-bold gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
				}) : comparedData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64 flex items-center justify-center text-slate-400 text-xs",
					children: "비교할 종목을 상단 검색창에서 추가하세요."
				}) : chartMetrics ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full h-72 sm:h-80 relative select-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							className: "w-full h-full overflow-visible",
							viewBox: "0 0 800 300",
							preserveAspectRatio: "none",
							children: [
								(() => {
									const zeroY = 300 - (0 - chartMetrics.yMin) / (chartMetrics.yMax - chartMetrics.yMin) * 300;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: "0",
										y1: zeroY,
										x2: "800",
										y2: zeroY,
										stroke: "#94a3b8",
										strokeWidth: "1.5",
										strokeDasharray: "4 4",
										opacity: "0.6"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
										x: "8",
										y: zeroY - 6,
										fill: "#94a3b8",
										fontSize: "10",
										fontWeight: "bold",
										children: "0.00% (시작 기준가)"
									})] });
								})(),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: "0",
									y1: "10",
									x2: "800",
									y2: "10",
									stroke: "#64748b",
									strokeWidth: "0.5",
									strokeDasharray: "3 3",
									opacity: "0.2"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: "0",
									y1: "150",
									x2: "800",
									y2: "150",
									stroke: "#64748b",
									strokeWidth: "0.5",
									strokeDasharray: "3 3",
									opacity: "0.2"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: "0",
									y1: "290",
									x2: "800",
									y2: "290",
									stroke: "#64748b",
									strokeWidth: "0.5",
									strokeDasharray: "3 3",
									opacity: "0.2"
								}),
								comparedData.map((d, stockIdx) => {
									const color = STOCK_COLORS[stockIdx % STOCK_COLORS.length];
									const points = d.normalized.map((val, ptIdx) => {
										return `${ptIdx / Math.max(d.normalized.length - 1, 1) * 800},${300 - (val - chartMetrics.yMin) / (chartMetrics.yMax - chartMetrics.yMin) * 300}`;
									}).join(" ");
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
										fill: "none",
										stroke: color,
										strokeWidth: "2.5",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										points
									}, d.stock.symbol);
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-center gap-4 flex-wrap pt-2",
						children: comparedData.map((d, idx) => {
							const color = STOCK_COLORS[idx % STOCK_COLORS.length];
							const isPositive = d.periodReturn >= 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-3 h-3 rounded-full shrink-0",
										style: { backgroundColor: color }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-slate-800 dark:text-slate-200",
										children: [d.stock.name, ":"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `font-mono font-bold ${isPositive ? "text-rose-500" : "text-blue-500"}`,
										children: [
											isPositive ? "+" : "",
											d.periodReturn.toFixed(2),
											"%"
										]
									})
								]
							}, d.stock.symbol);
						})
					})]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "핵심 재무 및 시세 비교 매트릭스" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-slate-400",
							children: "클릭 시 해당 종목 상세 화면으로 이동"
						})]
					}),
					new Set(comparedData.map((d) => inferStockCurrency(d.stock.symbol, d.stock.market, d.stock.currency))).size > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 py-2.5 bg-indigo-500/5 border-b border-indigo-500/20 text-[11px] text-indigo-700 dark:text-indigo-300 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "이종 통화(KRW·USD·USDT) 종목이 함께 비교되고 있습니다. 상단 차트는 원통화 수익률(%)로 정규화되며, 주가와 시가총액은 각 종목의 기준 통화 단위로 분리 표기됩니다." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left text-xs divide-y divide-slate-100 dark:divide-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 min-w-[140px]",
									children: "지표 항목"
								}), comparedData.map((d, idx) => {
									const color = STOCK_COLORS[idx % STOCK_COLORS.length];
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
										className: "py-3 px-4 min-w-[150px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors",
										onClick: () => navigateToStock(d.stock.symbol),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-2.5 h-2.5 rounded-full",
												style: { backgroundColor: color }
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-900 dark:text-white font-black truncate",
												children: d.stock.name
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] font-mono text-slate-400 mt-0.5",
											children: [
												d.stock.symbol,
												" · ",
												inferStockExchange(d.stock.symbol, d.stock.market, d.stock.exchange),
												" · ",
												inferStockCurrency(d.stock.symbol, d.stock.market, d.stock.currency)
											]
										})]
									}, d.stock.symbol);
								})] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
								className: "divide-y divide-slate-100 dark:divide-slate-800/80 font-medium",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-slate-500 font-bold bg-slate-50/50 dark:bg-slate-900/30",
										children: "현재가"
									}), comparedData.map((d) => {
										const cur = inferStockCurrency(d.stock.symbol, d.stock.market, d.stock.currency);
										const conv = cur !== "KRW" && validateExchangeRate(exchangeRate).valid ? convertToKRW(d.stock.price, cur, exchangeRate) : null;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-3 px-4 font-mono font-bold text-slate-900 dark:text-white",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: formatMoney(d.stock.price, cur) }), conv?.valid && conv.valueKRW !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[10px] font-normal text-slate-400",
												children: ["≈ ", formatMoney(conv.valueKRW, "KRW")]
											})]
										}, d.stock.symbol);
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-slate-500 font-bold bg-slate-50/50 dark:bg-slate-900/30",
										children: "일간 등락률"
									}), comparedData.map((d) => {
										const cur = inferStockCurrency(d.stock.symbol, d.stock.market, d.stock.currency);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceBadge, {
												change: d.stock.change,
												changePercent: d.stock.changePercent,
												currency: cur,
												size: "sm"
											})
										}, d.stock.symbol);
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3 px-4 text-slate-500 font-bold bg-slate-50/50 dark:bg-slate-900/30",
										children: [period, " 누적 수익률"]
									}), comparedData.map((d) => {
										const isPos = d.periodReturn >= 0;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: `py-3 px-4 font-mono font-bold ${isPos ? "text-rose-500" : "text-blue-500"}`,
											children: [
												isPos ? "+" : "",
												d.periodReturn.toFixed(2),
												"%"
											]
										}, d.stock.symbol);
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-slate-500 font-bold bg-slate-50/50 dark:bg-slate-900/30",
										children: "시가총액"
									}), comparedData.map((d) => {
										const cur = inferStockCurrency(d.stock.symbol, d.stock.market, d.stock.currency);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4 font-mono text-slate-700 dark:text-slate-300",
											children: formatMarketCapByCurrency(d.stock.marketCap, cur)
										}, d.stock.symbol);
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-slate-500 font-bold bg-slate-50/50 dark:bg-slate-900/30",
										children: "PER (배)"
									}), comparedData.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 font-mono text-slate-700 dark:text-slate-300",
										children: d.stock.per ? `${d.stock.per.toFixed(2)}배` : "-"
									}, d.stock.symbol))] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-slate-500 font-bold bg-slate-50/50 dark:bg-slate-900/30",
										children: "PBR (배)"
									}), comparedData.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 font-mono text-slate-700 dark:text-slate-300",
										children: d.stock.pbr ? `${d.stock.pbr.toFixed(2)}배` : "-"
									}, d.stock.symbol))] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-slate-500 font-bold bg-slate-50/50 dark:bg-slate-900/30",
										children: "52주 최고가"
									}), comparedData.map((d) => {
										const cur = inferStockCurrency(d.stock.symbol, d.stock.market, d.stock.currency);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4 font-mono text-rose-500",
											children: d.stock.high52w ? formatMoney(d.stock.high52w, cur) : "-"
										}, d.stock.symbol);
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-slate-500 font-bold bg-slate-50/50 dark:bg-slate-900/30",
										children: "52주 최저가"
									}), comparedData.map((d) => {
										const cur = inferStockCurrency(d.stock.symbol, d.stock.market, d.stock.currency);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4 font-mono text-blue-500",
											children: d.stock.low52w ? formatMoney(d.stock.low52w, cur) : "-"
										}, d.stock.symbol);
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-slate-500 font-bold bg-slate-50/50 dark:bg-slate-900/30",
										children: "당일 거래량"
									}), comparedData.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 font-mono text-slate-600 dark:text-slate-400",
										children: d.stock.volume ? d.stock.volume.toLocaleString() : "-"
									}, d.stock.symbol))] })
								]
							})]
						})
					})
				]
			})
		]
	});
};
//#endregion
export { StockComparisonView };
