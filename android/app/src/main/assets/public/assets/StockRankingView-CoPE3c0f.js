import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { $t as ChartNoAxesColumn, F as ShieldCheck, G as RefreshCw, Ht as Clock, It as DollarSign, _ as TrendingDown, bn as require_react, bt as Info, g as TrendingUp, h as TriangleAlert, m as Trophy, pn as ArrowUpRight, qt as ChevronRight, vn as ArrowDownRight } from "./vendor-lucide-Dji_Ij8j.js";
import { S as inferStockCurrency, n as useApp, v as formatMoney, y as formatTradingValueByCurrency } from "./AppContext-Butl4QWq.js";
import { g as getKRXMarketStatus } from "./index-DLz7vtf6.js";
//#region src/components/stocks/StockRankingView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var StockRankingView = () => {
	const { navigateToStock } = useApp();
	const [market, setMarket] = (0, import_react.useState)("ALL");
	const [sort, setSort] = (0, import_react.useState)("change_rise");
	const [rankingData, setRankingData] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const [errorMessage, setErrorMessage] = (0, import_react.useState)(null);
	const fetchRankings = (0, import_react.useCallback)(async (isSilent = false) => {
		if (!isSilent) setIsLoading(true);
		else setIsRefreshing(true);
		setErrorMessage(null);
		try {
			const res = await fetch(`/api/stocks/ranking?market=${market}&sort=${sort}`);
			if (!res.ok) throw new Error(`서버 응답 오류 (HTTP ${res.status})`);
			const data = await res.json();
			setRankingData(data);
		} catch (err) {
			console.error("[StockRanking] Fetch error:", err);
			setErrorMessage(err.message || "실시간 순위 데이터를 불러오지 못했습니다.");
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}, [market, sort]);
	(0, import_react.useEffect)(() => {
		fetchRankings();
	}, [fetchRankings]);
	(0, import_react.useEffect)(() => {
		const interval = setInterval(() => {
			fetchRankings(true);
		}, 3e4);
		return () => clearInterval(interval);
	}, [fetchRankings]);
	const sortTabs = [
		{
			id: "change_rise",
			label: "상승률 TOP 20",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 text-rose-500" }),
			desc: "당일 주가 급등 및 전일 대비 상승폭 상위 종목",
			trId: "ka10027"
		},
		{
			id: "change_fall",
			label: "하락률 TOP 20",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-4 h-4 text-blue-500" }),
			desc: "당일 주가 급락 및 전일 대비 하락폭 상위 종목",
			trId: "ka10027"
		},
		{
			id: "volume",
			label: "거래량 TOP 20",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { className: "w-4 h-4 text-emerald-500" }),
			desc: "당일 누적 거래량 상위 종목",
			trId: "ka10030"
		},
		{
			id: "trading_value",
			label: "거래대금 TOP 20",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-4 h-4 text-amber-500" }),
			desc: "시장 수급과 매매대금이 집중된 거래대금 상위 종목",
			trId: "ka10032"
		}
	];
	const getRankBadge = (rank) => {
		if (rank === 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-amber-500/20",
			children: "1"
		});
		if (rank === 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "w-7 h-7 rounded-xl bg-gradient-to-br from-slate-300 to-slate-500 text-white font-black text-xs flex items-center justify-center shadow-md shadow-slate-500/20",
			children: "2"
		});
		if (rank === 3) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "w-7 h-7 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white font-black text-xs flex items-center justify-center shadow-md shadow-amber-700/20",
			children: "3"
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs flex items-center justify-center font-mono",
			children: rank
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 animate-in fade-in duration-150 max-w-7xl mx-auto pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#131722] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2.5 rounded-xl bg-rose-500/10 text-rose-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "w-6 h-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "실시간 종목 순위" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs px-2 py-0.5 rounded-full font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 font-mono",
							children: "LIVE RANKING"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1",
						children: "코스피·코스닥 시장별 당일 급등락, 거래량 및 거래대금 실시간 상위 20개 종목 순위"
					})] })]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2.5 self-start md:self-auto",
					children: [rankingData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						(() => {
							const krxStatus = getKRXMarketStatus(/* @__PURE__ */ new Date());
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl border ${krxStatus.isOpen ? "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400" : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2 h-2 rounded-full ${krxStatus.isOpen ? "bg-rose-500 animate-pulse" : "bg-slate-400"}` }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: krxStatus.statusLabel }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] opacity-75 font-normal",
										children: [
											"(",
											krxStatus.detailLabel,
											")"
										]
									})
								]
							});
						})(),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl border ${rankingData.dataSource === "kiwoom" ? "bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300" : "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [rankingData.dataSource === "kiwoom" ? "키움 Open API" : "실시간 거래소 시세", rankingData.trId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[11px] ml-1 opacity-80",
								children: [
									"(",
									rankingData.trId,
									")"
								]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["기준 시각: ", rankingData.lastUpdated] })]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => fetchRankings(false),
						disabled: isLoading || isRefreshing,
						className: "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 font-bold text-xs hover:bg-rose-100 dark:hover:bg-rose-500/25 transition-all cursor-pointer disabled:opacity-50",
						title: "실시간 순위 새로고침",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3.5 h-3.5 ${isLoading || isRefreshing ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "새로고침" })]
					})]
				})]
			}),
			rankingData?.isStale && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"현재 거래소 시세 통신 지연으로 인해 마지막 정상 수신 데이터(갱신 시각: ",
					rankingData.lastUpdated,
					")가 안전하게 표시되고 있습니다."
				] })]
			}),
			rankingData?.kiwoomNotice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2.5 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-4 h-4 shrink-0 text-slate-400 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-slate-700 dark:text-slate-200",
						children: "연동 안내:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-1 text-[11px] text-slate-500 dark:text-slate-400",
						children: rankingData.kiwoomNotice
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 p-1 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 w-fit",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMarket("ALL"),
							className: `px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${market === "ALL" ? "bg-rose-600 text-white shadow-md shadow-rose-600/20" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
							children: "전체 시장"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setMarket("KOSPI"),
							className: `px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${market === "KOSPI" ? "bg-rose-600 text-white shadow-md shadow-rose-600/20" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "코스피" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] opacity-80",
								children: "KOSPI"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setMarket("KOSDAQ"),
							className: `px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${market === "KOSDAQ" ? "bg-rose-600 text-white shadow-md shadow-rose-600/20" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "코스닥" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] opacity-80",
								children: "KOSDAQ"
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 lg:grid-cols-4 gap-2.5",
					children: sortTabs.map((tab) => {
						const isActive = sort === tab.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSort(tab.id),
							className: `p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${isActive ? "bg-white dark:bg-[#131722] border-rose-500 shadow-md ring-1 ring-rose-500/20" : "bg-white/60 dark:bg-[#131722]/60 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-[#131722]"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between w-full mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800",
										children: tab.icon
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-xs sm:text-sm font-black ${isActive ? "text-rose-600 dark:text-rose-400" : "text-slate-800 dark:text-slate-200"}`,
										children: tab.label
									})]
								}), isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-rose-500 animate-pulse" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-[11px] text-slate-400 mt-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "line-clamp-1",
									children: tab.desc
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[9px] opacity-60 ml-1",
									children: tab.trId
								})]
							})]
						}, tab.id);
					})
				})]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/4 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: [...Array(10)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-14 bg-slate-50 dark:bg-slate-800/40 rounded-xl animate-pulse" }, i))
				})]
			}) : errorMessage && !rankingData ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-8 h-8 text-rose-500 mx-auto" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-bold text-slate-800 dark:text-slate-200",
						children: errorMessage
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => fetchRankings(false),
						className: "px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs",
						children: "다시 시도"
					})
				]
			}) : rankingData && rankingData.items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-bold text-slate-700 dark:text-slate-300",
							children: [
								market === "ALL" ? "전체 시장" : market,
								" · ",
								sortTabs.find((t) => t.id === sort)?.label,
								" (총 ",
								rankingData.items.length,
								"개 종목)"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-slate-400 font-mono text-[11px] hidden sm:inline",
							children: "종목 클릭 시 상세 시세 및 10호가·차트로 이동합니다"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden md:block overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left border-collapse",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase bg-slate-50/30 dark:bg-slate-800/10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 w-16 text-center",
										children: "순위"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 min-w-[180px]",
										children: "종목명 / 종목코드"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 text-right",
										children: "현재가"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 text-right min-w-[120px]",
										children: "등락률"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 text-right min-w-[110px]",
										children: "전일대비"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 text-right min-w-[120px]",
										children: "거래량"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 text-right min-w-[110px]",
										children: "거래대금"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 text-center w-20",
										children: "이동"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-slate-100 dark:divide-slate-800 text-xs",
								children: rankingData.items.map((item) => {
									const isUp = item.change > 0;
									const isDown = item.change < 0;
									const changeColor = isUp ? "text-rose-600 dark:text-rose-400" : isDown ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										onClick: () => navigateToStock(item.symbol),
										className: "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3.5 px-4 text-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex justify-center",
													children: getRankBadge(item.rank)
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3.5 px-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex items-center gap-2",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-black text-sm text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors",
														children: item.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-1.5 mt-0.5",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-mono text-[11px] text-slate-400 font-semibold",
																children: item.symbol
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: `text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${item.market === "KOSPI" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`,
																children: item.market
															}),
															item.sector && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-[10px] text-slate-400 truncate max-w-[90px] hidden sm:inline",
																children: item.sector
															})
														]
													})] })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3.5 px-4 text-right font-mono font-bold text-sm text-slate-900 dark:text-white",
												children: formatMoney(item.price, inferStockCurrency(item.symbol, item.market))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3.5 px-4 text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: `inline-flex items-center gap-0.5 font-bold font-mono text-sm px-2 py-0.5 rounded-lg ${isUp ? "bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400" : isDown ? "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`,
													children: [isUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-3.5 h-3.5" }) : isDown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "w-3.5 h-3.5" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [item.changePercent > 0 ? `+${item.changePercent.toFixed(2)}` : item.changePercent.toFixed(2), "%"] })]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: `py-3.5 px-4 text-right font-mono font-semibold text-xs ${changeColor}`,
												children: item.change > 0 ? `▲ ${formatMoney(item.change, inferStockCurrency(item.symbol, item.market), { showSign: true })}` : item.change < 0 ? `▼ ${formatMoney(item.change, inferStockCurrency(item.symbol, item.market))}` : formatMoney(0, inferStockCurrency(item.symbol, item.market))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "py-3.5 px-4 text-right font-mono text-slate-700 dark:text-slate-300 font-medium",
												children: [item.volume.toLocaleString(), "주"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3.5 px-4 text-right font-mono text-slate-900 dark:text-white font-bold",
												children: item.tradingValue ? formatTradingValueByCurrency(item.tradingValue, inferStockCurrency(item.symbol, item.market)) : "-"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3.5 px-4 text-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "p-1.5 rounded-lg text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors inline-block",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4" })
												})
											})
										]
									}, item.symbol);
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "block md:hidden divide-y divide-slate-100 dark:divide-slate-800",
						children: rankingData.items.map((item) => {
							const isUp = item.change > 0;
							const isDown = item.change < 0;
							const changeColor = isUp ? "text-rose-600 dark:text-rose-400" : isDown ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => navigateToStock(item.symbol),
								className: "p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer active:bg-slate-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [getRankBadge(item.rank), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-black text-sm text-slate-900 dark:text-white",
											children: item.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 mt-0.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-[11px] text-slate-400 font-semibold",
													children: item.symbol
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${item.market === "KOSPI" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`,
													children: item.market
												}),
												item.sector && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-slate-400 truncate max-w-[80px]",
													children: item.sector
												})
											]
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono font-black text-sm text-slate-900 dark:text-white",
											children: formatMoney(item.price, inferStockCurrency(item.symbol, item.market))
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `inline-flex items-center gap-0.5 font-bold font-mono text-xs px-1.5 py-0.5 rounded-md ${isUp ? "bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400" : isDown ? "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`,
												children: [isUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-3 h-3" }) : isDown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "w-3 h-3" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [item.changePercent > 0 ? `+${item.changePercent.toFixed(2)}` : item.changePercent.toFixed(2), "%"] })]
											})
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "전일대비: " }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `font-semibold ${changeColor}`,
										children: item.change > 0 ? `▲${formatMoney(item.change, inferStockCurrency(item.symbol, item.market), { showSign: true })}` : item.change < 0 ? `▼${formatMoney(item.change, inferStockCurrency(item.symbol, item.market))}` : formatMoney(0, inferStockCurrency(item.symbol, item.market))
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"거래량: ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-slate-700 dark:text-slate-300",
													children: item.volume.toLocaleString()
												}),
												"주"
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["거래대금: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-slate-700 dark:text-slate-300",
												children: item.tradingValue ? formatTradingValueByCurrency(item.tradingValue, inferStockCurrency(item.symbol, item.market)) : "-"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5 text-slate-400 ml-1" })
										]
									})]
								})]
							}, item.symbol);
						})
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 text-xs",
				children: "조회된 종목 순위 데이터가 없습니다."
			})
		]
	});
};
//#endregion
export { StockRankingView };
