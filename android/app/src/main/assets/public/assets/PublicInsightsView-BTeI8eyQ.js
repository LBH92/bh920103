import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { Ht as Clock, L as Share2, Xt as Check, bn as require_react, cn as BookOpen, g as TrendingUp, gn as ArrowLeft, h as TriangleAlert, qt as ChevronRight, tn as Calendar, w as Tag } from "./vendor-lucide-Dji_Ij8j.js";
import { t as insightService } from "./insightService-CaAN3h8_.js";
//#region src/components/insights/PublicInsightsView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var PublicInsightsView = ({ initialCategory, initialInsightId, onNavigateHome, onSelectCategory, onSelectArticle }) => {
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)(initialCategory);
	const [activeArticleId, setActiveArticleId] = (0, import_react.useState)(initialInsightId);
	const [articles, setArticles] = (0, import_react.useState)([]);
	const [currentArticle, setCurrentArticle] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [copied, setCopied] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setSelectedCategory(initialCategory);
	}, [initialCategory]);
	(0, import_react.useEffect)(() => {
		setActiveArticleId(initialInsightId);
	}, [initialInsightId]);
	(0, import_react.useEffect)(() => {
		if (activeArticleId) return;
		let isMounted = true;
		setLoading(true);
		insightService.fetchPublicInsights(selectedCategory).then((data) => {
			if (isMounted) {
				setArticles(data);
				setLoading(false);
			}
		}).catch(() => {
			if (isMounted) setLoading(false);
		});
		return () => {
			isMounted = false;
		};
	}, [selectedCategory, activeArticleId]);
	(0, import_react.useEffect)(() => {
		if (!activeArticleId) {
			setCurrentArticle(null);
			return;
		}
		let isMounted = true;
		setLoading(true);
		insightService.fetchPublicInsightById(activeArticleId).then((data) => {
			if (isMounted) {
				setCurrentArticle(data);
				setLoading(false);
			}
		}).catch(() => {
			if (isMounted) setLoading(false);
		});
		return () => {
			isMounted = false;
		};
	}, [activeArticleId]);
	const handleCategoryClick = (cat) => {
		setActiveArticleId(void 0);
		setSelectedCategory(cat);
		onSelectCategory(cat);
	};
	const handleArticleClick = (id) => {
		setActiveArticleId(id);
		onSelectArticle(id);
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};
	const handleShare = () => {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			setTimeout(() => setCopied(false), 2e3);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-4xl mx-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: onNavigateHome,
						className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-4 h-4" }), "증시 메인"]
					}), activeArticleId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => handleCategoryClick(selectedCategory),
						className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs sm:text-sm font-medium transition-colors",
						children: "리포트 목록"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-slate-400 font-mono",
					children: "Byeongdol Investment Research"
				})]
			}), activeArticleId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-24 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "inline-block w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-slate-400 text-sm",
					children: "분석 리포트를 불러오는 중입니다..."
				})]
			}) : currentArticle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 sm:p-10 shadow-xl backdrop-blur-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "border-b border-slate-700/80 pb-6 mb-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20",
										children: currentArticle.categoryLabel || currentArticle.category
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3.5 h-3.5" }), new Date(currentArticle.publishedAt || currentArticle.createdAt).toLocaleDateString("ko-KR")]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5" }),
											"약 ",
											currentArticle.readTimeMinutes || 3,
											"분 소요"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-slate-400",
										children: ["작성: ", currentArticle.authorName || "병돌 리서치팀"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight",
								children: currentArticle.title
							}),
							currentArticle.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-300 text-sm sm:text-base leading-relaxed",
								children: currentArticle.summary
							}),
							currentArticle.marketDataSnapshot && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 p-3 rounded-lg bg-slate-900/40 border border-slate-800 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-rose-400 font-bold flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3.5 h-3.5" }), " 공식 시장 데이터 기준:"]
									}),
									currentArticle.marketDataSnapshot.benchmarkPrice !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"기준가: ",
										currentArticle.marketDataSnapshot.benchmarkPrice.toLocaleString(),
										"원"
									] }),
									currentArticle.marketDataSnapshot.changePercent !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: currentArticle.marketDataSnapshot.changePercent >= 0 ? "text-red-400" : "text-blue-400",
										children: [
											"등락: ",
											currentArticle.marketDataSnapshot.changePercent > 0 ? "+" : "",
											currentArticle.marketDataSnapshot.changePercent,
											"%"
										]
									}),
									currentArticle.marketDataSnapshot.exchangeRate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"환율: ",
										currentArticle.marketDataSnapshot.exchangeRate.toLocaleString(),
										"원"
									] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-center justify-between pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1.5",
									children: currentArticle.tags?.map((tag, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-900/50 px-2.5 py-1 rounded-md",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "w-3 h-3" }),
											"#",
											tag
										]
									}, i))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: handleShare,
									className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition-colors",
									title: "URL 복사",
									children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-3.5 h-3.5" }), copied ? "복사됨!" : "공유하기"]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4 text-slate-200 text-base leading-relaxed whitespace-pre-line",
						children: currentArticle.content
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-12 p-5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs sm:text-sm text-amber-200 leading-relaxed flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-5 h-5 text-amber-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "font-bold block mb-1",
							children: "법적 면책 고지 및 투자 유의사항"
						}), "본 분석 자료는 신뢰할 수 있는 공식 금융 시장 데이터와 공개된 경제 지표를 바탕으로 작성되었으나, 그 완전성이나 정확성을 보증하지 않습니다. 본 자료는 정보 제공만을 목적으로 하며, 특정 증권의 매수 또는 매도를 권유하는 법률상 금융투자 자문이 아닙니다. 모든 투자 판단의 최종 책임은 전적으로 투자자 본인에게 있습니다."] })]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-slate-800/60 border border-slate-700/60 rounded-2xl p-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-10 h-10 text-amber-400 mx-auto mb-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-bold text-white mb-2",
						children: "리포트를 찾을 수 없습니다"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-slate-400 text-sm mb-6",
						children: "요청하신 분석 리포트가 아직 발행 전이거나 존재하지 않습니다."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => handleCategoryClick(),
						className: "px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-bold transition-colors",
						children: "전체 리포트 목록 보기"
					})
				]
			}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 sm:p-8 backdrop-blur-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-2.5 bg-rose-500/10 text-rose-400 rounded-xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-6 h-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl sm:text-3xl font-extrabold text-white",
							children: "투자 인사이트 & 시황 리포트"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-slate-400 mt-0.5",
							children: "실시간 시장 지표와 정밀 데이터 기반의 금융 분석 리서치"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-700/60",
						children: [
							{
								key: void 0,
								label: "전체 리포트"
							},
							{
								key: "domestic-market",
								label: "국내 증시"
							},
							{
								key: "us-market",
								label: "미국 증시"
							},
							{
								key: "economy",
								label: "거시경제"
							}
						].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleCategoryClick(c.key),
							className: `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedCategory === c.key ? "bg-rose-500 text-white font-bold shadow-sm" : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"}`,
							children: c.label
						}, c.label))
					})]
				}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-20 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "inline-block w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-slate-400 text-sm",
						children: "분석 리포트를 불러오는 중입니다..."
					})]
				}) : articles.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: articles.map((article) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => handleArticleClick(article.id),
						className: "group bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-rose-500/50 rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2 mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-md",
									children: article.categoryLabel || article.category
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-slate-400 flex items-center gap-1 font-mono",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3 h-3" }), new Date(article.publishedAt || article.createdAt).toLocaleDateString("ko-KR")]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg sm:text-xl font-bold text-white group-hover:text-rose-300 transition-colors mb-2",
								children: article.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-slate-400 text-sm line-clamp-2 leading-relaxed mb-4",
								children: article.summary
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-700/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["작성: ", article.authorName || "병돌 리서치팀"] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [article.readTimeMinutes || 3, "분 소요"] })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 text-rose-400 font-medium group-hover:translate-x-0.5 transition-transform",
									children: ["자세히 보기 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5" })]
								})]
							})
						]
					}, article.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-slate-800/40 border border-slate-700/60 rounded-2xl p-12 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-10 h-10 text-slate-400 mx-auto mb-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-bold text-white mb-1",
							children: "발행된 리포트가 없습니다"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-slate-400 text-sm",
							children: selectedCategory ? "선택하신 카테고리의 리포트를 준비 중입니다." : "현재 발행 준비 중인 리포트가 곧 업데이트됩니다."
						})
					]
				})]
			})]
		})
	});
};
//#endregion
export { PublicInsightsView };
