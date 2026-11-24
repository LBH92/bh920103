import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { Ft as ExternalLink, G as RefreshCw, Gt as CircleAlert, H as Search, Ht as Clock, It as DollarSign, bn as require_react, et as Newspaper, g as TrendingUp, i as X, r as Zap } from "./vendor-lucide-Dji_Ij8j.js";
import { t as newsService } from "./newsService-BQGP30E2.js";
//#region src/components/news/NewsView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	{
		id: "all",
		label: "전체 뉴스"
	},
	{
		id: "breaking",
		label: "⚡ 주요 속보",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-3.5 h-3.5 text-amber-500" })
	},
	{
		id: "market",
		label: "국내 증시",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3.5 h-3.5 text-rose-500" })
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
		label: "경제",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-3.5 h-3.5 text-emerald-500" })
	}
];
var NewsView = () => {
	const [activeCategory, setActiveCategory] = (0, import_react.useState)("all");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [activeSearch, setActiveSearch] = (0, import_react.useState)("");
	const [newsList, setNewsList] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [page, setPage] = (0, import_react.useState)(1);
	const [hasMore, setHasMore] = (0, import_react.useState)(false);
	const [totalCount, setTotalCount] = (0, import_react.useState)(0);
	const [lastRefreshedAt, setLastRefreshedAt] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	const fetchNews = (0, import_react.useCallback)(async (cat, q, targetPage = 1, append = false) => {
		setIsLoading(true);
		setError(null);
		try {
			let res;
			if (q.trim()) res = await newsService.searchNews(q.trim(), targetPage, 15);
			else res = await newsService.getMarketNews(cat, targetPage, 15);
			if (append) setNewsList((prev) => [...prev, ...res.items]);
			else setNewsList(res.items);
			setHasMore(res.hasMore);
			setTotalCount(res.total);
			setPage(targetPage);
			setLastRefreshedAt(/* @__PURE__ */ new Date());
		} catch (err) {
			console.warn("[NewsView] Error fetching news:", err);
			setError(err.message || "뉴스 데이터를 불러오는 중 오류가 발생했습니다.");
		} finally {
			setIsLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		fetchNews(activeCategory, activeSearch, 1, false);
	}, [
		activeCategory,
		activeSearch,
		fetchNews
	]);
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		setActiveSearch(searchQuery.trim());
		setPage(1);
	};
	const handleClearSearch = () => {
		setSearchQuery("");
		setActiveSearch("");
		setPage(1);
	};
	const handleRefresh = () => {
		fetchNews(activeCategory, activeSearch, 1, false);
	};
	const handleLoadMore = () => {
		if (!isLoading && hasMore) fetchNews(activeCategory, activeSearch, page + 1, true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#131722] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 mb-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight",
						children: "실시간 증시 뉴스 & 속보"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400",
					children: "주요 경제 언론사의 실시간 보도 및 코스피·코스닥 시장 핵심 이슈"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 self-end sm:self-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[11px] font-mono text-slate-400",
						children: ["기준: ", lastRefreshedAt.toLocaleTimeString("ko-KR", {
							hour: "2-digit",
							minute: "2-digit",
							second: "2-digit"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleRefresh,
						disabled: isLoading,
						className: "flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-500" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "새로고침" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1.5 overflow-x-auto scrollbar-none p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-800",
					children: CATEGORIES.map((cat) => {
						const isActive = activeCategory === cat.id && !activeSearch;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setActiveCategory(cat.id);
								setActiveSearch("");
								setSearchQuery("");
							},
							className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${isActive ? "bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-xs font-bold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
							children: [cat.icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cat.label })]
						}, cat.id);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSearchSubmit,
					className: "relative w-full md:w-80",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							placeholder: "뉴스 키워드 검색 (예: 금리, 반도체)",
							className: "w-full pl-9 pr-8 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 transition-colors"
						}),
						searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleClearSearch,
							className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
						})
					]
				})]
			}),
			activeSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-xs font-semibold text-slate-400",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "검색어:" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold",
						children: [
							"\"",
							activeSearch,
							"\""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleClearSearch,
						className: "text-slate-400 hover:text-rose-400 text-[11px] underline ml-1",
						children: "검색 초기화"
					})
				]
			}),
			isLoading && newsList.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: [
					1,
					2,
					3,
					4,
					5
				].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 animate-pulse space-y-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 bg-slate-200 dark:bg-slate-700/50 rounded-sm w-2/3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 bg-slate-200 dark:bg-slate-700/30 rounded-sm w-full" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 bg-slate-200 dark:bg-slate-700/20 rounded-sm w-1/4" })
					]
				}, n))
			}),
			!isLoading && error && newsList.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-8 rounded-2xl bg-white dark:bg-[#131722] border border-rose-500/20 text-center space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-10 h-10 text-rose-500 mx-auto" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-bold text-slate-900 dark:text-white",
						children: "뉴스를 불러오지 못했습니다"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-400 max-w-md mx-auto",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleRefresh,
						className: "px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "다시 시도" })]
					})
				]
			}),
			!isLoading && !error && newsList.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-12 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 text-center space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, { className: "w-12 h-12 text-slate-600 mx-auto opacity-50" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-bold text-slate-300",
						children: "등록된 뉴스가 없습니다"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500",
						children: "해당 조건의 기사를 찾지 못했습니다. 다른 카테고리나 검색어로 확인해 보세요."
					})
				]
			}),
			newsList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: newsList.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-5 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs group",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 flex-1 min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 flex-wrap text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
										children: item.source
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-slate-400 font-mono flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3 text-slate-400" }), item.timeAgo || item.time]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: item.url,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors block leading-snug tracking-tight",
									children: item.title
								}),
								item.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed",
									children: item.summary
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: item.url,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-500/10 hover:text-blue-500 text-slate-400 transition-colors shrink-0 group-hover:bg-blue-500/10 group-hover:text-blue-500",
							title: "원문 기사 보기 (새 창)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-4 h-4" })
						})]
					})
				}, item.id))
			}),
			hasMore && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pt-4 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleLoadMore,
					disabled: isLoading,
					className: "px-6 py-2.5 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-200 transition-all inline-flex items-center gap-2 shadow-xs hover:shadow-sm",
					children: [isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5 animate-spin text-blue-500" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "뉴스 더보기 (다음 페이지)" })]
				})
			})
		]
	});
};
//#endregion
export { NewsView };
