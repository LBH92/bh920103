import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { H as Search, Nt as Eye, bn as require_react, g as TrendingUp, h as TriangleAlert, i as X, ot as MessageSquare, p as UserCheck, q as Plus, vt as Layers, wt as Heart } from "./vendor-lucide-Dji_Ij8j.js";
import { F as formatPostExactDateTime, I as formatPostListTime, d as INITIAL_POSTS, f as firebaseRepository, l as matchHangulSearch, n as useApp, p as dedupeById, u as storageService } from "./AppContext-Butl4QWq.js";
import { l as ErrorBoundary } from "./index-DLz7vtf6.js";
import { t as AdSlot } from "./AdSlot-CzgsWb47.js";
import { t as PostEditorModal } from "./PostEditorModal-Bxu4oV5j.js";
import { PostDetailView } from "./PostDetailView-x4AhyEP0.js";
//#region src/components/community/CommunityView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80";
var CommunityView = () => {
	const { selectedPostId, navigateToPost, navigateToStock, requireAuth, isAuthenticated, communityAuthorFilter, setCommunityAuthorFilter, user, setIsAuthModalOpen } = useApp();
	const [posts, setPosts] = (0, import_react.useState)(() => {
		try {
			const stored = storageService.getPosts();
			return dedupeById(stored && stored.length > 0 ? stored : INITIAL_POSTS);
		} catch {
			return dedupeById(INITIAL_POSTS);
		}
	});
	const [activeCategory, setActiveCategory] = (0, import_react.useState)("all");
	const [sortField, setSortField] = (0, import_react.useState)("latest");
	const [searchTarget, setSearchTarget] = (0, import_react.useState)("all");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [isEditorOpen, setIsEditorOpen] = (0, import_react.useState)(false);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [errorType, setErrorType] = (0, import_react.useState)(null);
	const [errorMessage, setErrorMessage] = (0, import_react.useState)(null);
	const PAGE_SIZE = 10;
	const [displayLimit, setDisplayLimit] = (0, import_react.useState)(PAGE_SIZE);
	(0, import_react.useEffect)(() => {
		setDisplayLimit(PAGE_SIZE);
	}, [
		activeCategory,
		searchQuery,
		searchTarget,
		sortField,
		communityAuthorFilter
	]);
	(0, import_react.useEffect)(() => {
		if (!isAuthenticated) {
			setIsLoading(false);
			return;
		}
		let isMounted = true;
		const mergePosts = (prev, remotePosts) => {
			const map = /* @__PURE__ */ new Map();
			for (const p of prev) if (p && p.id && (p.category === "notice" || p.isNotice)) map.set(p.id, p);
			for (const rp of remotePosts) if (rp && rp.id) map.set(rp.id, rp);
			return Array.from(map.values());
		};
		firebaseRepository.getPosts().then((remotePosts) => {
			if (!isMounted) return;
			if (remotePosts && Array.isArray(remotePosts) && remotePosts.length > 0) setPosts((prev) => mergePosts(prev, remotePosts));
			setIsLoading(false);
			setErrorType(null);
		}).catch((err) => {
			if (!isMounted) return;
			console.warn("[Community] getPosts error, falling back to cached storage:", err);
			setIsLoading(false);
			if (err?.message?.includes("permission") || err?.code === "permission-denied") {
				setErrorType("PERMISSION_DENIED");
				setErrorMessage("게시글 조회 권한이 제한되었습니다. 로그인 상태를 확인해 주세요.");
			} else {
				setErrorType("NETWORK_ERROR");
				setErrorMessage("원격 데이터 연결 지연 중입니다. 로컬 캐시를 표시합니다.");
			}
		});
		const unsubscribe = firebaseRepository.subscribePosts((remotePosts) => {
			if (!isMounted) return;
			if (remotePosts && Array.isArray(remotePosts) && remotePosts.length > 0) setPosts((prev) => mergePosts(prev, remotePosts));
			setIsLoading(false);
			setErrorType(null);
		}, (err) => {
			if (!isMounted) return;
			console.warn("[Community] subscribePosts notice:", err);
			setIsLoading(false);
			if (err?.message?.includes("permission") || err?.code === "permission-denied") {
				setErrorType("PERMISSION_DENIED");
				setErrorMessage("게시글 실시간 구독 권한이 제한되었습니다.");
			}
		});
		return () => {
			isMounted = false;
			try {
				unsubscribe();
			} catch (e) {
				console.warn("[Community] unsubscribe error:", e);
			}
		};
	}, [isAuthenticated]);
	if (selectedPostId) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostDetailView, { postId: selectedPostId });
	const categories = [
		{
			id: "all",
			label: "전체 글"
		},
		{
			id: "free",
			label: "💬 자유게시판"
		},
		{
			id: "discussion",
			label: "📊 종목토론"
		},
		{
			id: "market",
			label: "🌐 시장정보"
		},
		{
			id: "invest",
			label: "💡 투자정보"
		},
		{
			id: "qa",
			label: "❓ 질문/답변"
		},
		{
			id: "notice",
			label: "📢 공지사항"
		}
	];
	const getSafeAuthor = (post) => {
		return {
			id: post.author?.id || "anon",
			name: post.author?.name || "투자자",
			avatar: post.author?.avatar || DEFAULT_AVATAR,
			badge: post.author?.badge || "정회원",
			tier: post.author?.tier || "일반회원",
			level: post.author?.level || 1,
			title: post.author?.title || "주린이"
		};
	};
	const sortedPosts = [...posts.filter((post) => {
		if (!post) return false;
		const author = getSafeAuthor(post);
		if (communityAuthorFilter && author.id !== communityAuthorFilter) return false;
		if (activeCategory !== "all" && post.category !== activeCategory) return false;
		const q = searchQuery.trim().toLowerCase();
		if (!q) return true;
		const title = post.title || "";
		const content = post.content || "";
		const authorName = author.name;
		const symbolName = post.symbolName || "";
		const symbol = post.symbol || "";
		if (searchTarget === "title") return title.toLowerCase().includes(q) || matchHangulSearch(title, q);
		if (searchTarget === "content") return content.toLowerCase().includes(q);
		if (searchTarget === "author") return authorName.toLowerCase().includes(q) || matchHangulSearch(authorName, q);
		if (searchTarget === "stock") return symbolName && (symbolName.toLowerCase().includes(q) || matchHangulSearch(symbolName, q)) || symbol && symbol.toLowerCase().includes(q);
		const matchesTitle = title.toLowerCase().includes(q) || matchHangulSearch(title, q);
		const matchesContent = content.toLowerCase().includes(q);
		const matchesAuthor = authorName.toLowerCase().includes(q) || matchHangulSearch(authorName, q);
		const matchesStock = symbolName && (symbolName.toLowerCase().includes(q) || matchHangulSearch(symbolName, q)) || symbol && symbol.toLowerCase().includes(q) || post.tags && post.tags.some((t) => t && (t.toLowerCase().includes(q) || matchHangulSearch(t, q)));
		return matchesTitle || matchesContent || matchesAuthor || matchesStock;
	})].sort((a, b) => {
		if (a.category === "notice" && b.category !== "notice") return -1;
		if (b.category === "notice" && a.category !== "notice") return 1;
		switch (sortField) {
			case "views": return (b.views || 0) - (a.views || 0);
			case "comments": return (b.commentsCount || b.comments?.length || 0) - (a.commentsCount || a.comments?.length || 0);
			case "likes": return (b.likes || 0) - (a.likes || 0);
			default: return (b.id || "").localeCompare(a.id || "");
		}
	});
	const paginatedPosts = sortedPosts.slice(0, displayLimit);
	const hasMore = sortedPosts.length > displayLimit;
	const handleOpenWriteModal = () => {
		if (!requireAuth("게시글 작성")) return;
		setIsEditorOpen(true);
	};
	const getCategoryBadge = (cat) => {
		switch (cat) {
			case "discussion": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
			case "market": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
			case "invest": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
			case "qa": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
			case "notice": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
			default: return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700";
		}
	};
	const getCategoryLabel = (cat) => {
		const item = categories.find((c) => c.id === cat);
		return item ? item.label.replace(/^[^\s]+\s*/, "") : "자유";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBoundary, {
		fallbackTitle: "커뮤니티 화면을 불러오는 중 문제가 발생했습니다.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5 pb-16 animate-in fade-in duration-150",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-6 h-6 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "주주 커뮤니티 & 투자 토론" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5",
						children: "자유게시판, 종목토론, 시장·투자 정보, Q&A 및 공지사항을 실시간으로 확인하세요."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleOpenWriteModal,
						className: "flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-600/20 transition-all self-start sm:self-auto cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "새 글 작성하기" })]
					})]
				}),
				errorType === "PERMISSION_DENIED" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-800 dark:text-amber-300",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errorMessage || "로그인 후 정회원 게시글 및 실시간 토론에 참여하실 수 있습니다." })]
					}), !isAuthenticated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setIsAuthModalOpen(true),
						className: "px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-xs shrink-0 cursor-pointer transition-colors",
						children: "로그인하기"
					})]
				}),
				communityAuthorFilter && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs text-rose-600 dark:text-rose-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "내 게시글 모아보기 필터가 적용되어 있습니다." })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setCommunityAuthorFilter(null),
						className: "flex items-center gap-1 font-semibold hover:underline cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "전체 글 보기" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-2 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none",
					children: categories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setActiveCategory(cat.id),
						className: `px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${activeCategory === cat.id ? "bg-rose-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"}`,
						children: cat.label
					}, cat.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3.5 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 flex-1 max-w-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: searchTarget,
							onChange: (e) => setSearchTarget(e.target.value),
							className: "px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-rose-500",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "전체 검색"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "title",
									children: "제목"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "content",
									children: "내용"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "author",
									children: "작성자"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "stock",
									children: "종목"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute left-3 top-2.5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: searchQuery,
									onChange: (e) => setSearchQuery(e.target.value),
									placeholder: "검색어를 입력하세요 (예: 삼성전자, 초성 ㅅㅅ, 배당)",
									className: "w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 font-medium"
								}),
								searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setSearchQuery(""),
									className: "absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-bold self-end md:self-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSortField("latest"),
								className: `px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${sortField === "latest" ? "bg-white dark:bg-slate-700 text-rose-500 shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
								children: "최신순"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSortField("views"),
								className: `px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${sortField === "views" ? "bg-white dark:bg-slate-700 text-rose-500 shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
								children: "조회순"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSortField("comments"),
								className: `px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${sortField === "comments" ? "bg-white dark:bg-slate-700 text-rose-500 shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
								children: "댓글순"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSortField("likes"),
								className: `px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${sortField === "likes" ? "bg-white dark:bg-slate-700 text-rose-500 shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
								children: "좋아요순"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: isLoading && posts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: [
							1,
							2,
							3
						].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 animate-pulse space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-12 h-4 rounded bg-slate-200 dark:bg-slate-800" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-20 h-4 rounded bg-slate-200 dark:bg-slate-800" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-3/4 h-5 rounded bg-slate-200 dark:bg-slate-800" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1/2 h-4 rounded bg-slate-100 dark:bg-slate-800/60" })
							]
						}, i))
					}) : paginatedPosts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [paginatedPosts.map((post, idx) => {
						const isNotice = post.category === "notice";
						const author = getSafeAuthor(post);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [idx === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdSlot, {
								slotId: "community-mid-ad",
								format: "auto"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => navigateToPost(post.id),
								className: `p-5 rounded-2xl bg-white dark:bg-[#131722] border transition-all cursor-pointer shadow-xs group ${isNotice ? "border-purple-200 dark:border-purple-900/50 bg-purple-50/20 dark:bg-purple-950/10" : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2 mb-2 flex-wrap",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 flex-wrap",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `text-[11px] font-bold px-2 py-0.5 rounded-md border ${getCategoryBadge(post.category)}`,
													children: getCategoryLabel(post.category)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
															src: author.avatar,
															alt: author.name,
															className: "w-5 h-5 rounded-full object-cover",
															onError: (e) => {
																e.target.src = DEFAULT_AVATAR;
															}
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-xs text-slate-800 dark:text-slate-200",
															children: author.name
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 font-bold",
															children: author.badge
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-500 font-bold",
															children: author.title
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[11px] text-slate-400 font-mono",
													title: `작성일시: ${formatPostExactDateTime(post.createdAt, true)}${post.updatedAt && post.updatedAt !== post.createdAt ? `\n수정일시: ${formatPostExactDateTime(post.updatedAt, true)}` : ""}`,
													children: [
														"· ",
														formatPostListTime(post.createdAt),
														post.updatedAt && post.updatedAt !== post.createdAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "ml-1 text-[10px] text-slate-400/80 font-sans",
															children: "(수정됨)"
														})
													]
												})
											]
										}), post.symbolName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: (e) => {
												e.stopPropagation();
												if (post.symbol) navigateToStock(post.symbol);
											},
											className: "text-xs font-bold text-rose-500 hover:underline flex items-center gap-1 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-500/20 cursor-pointer",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3 h-3" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: post.symbolName }),
												post.symbol && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono text-[10px] text-slate-400",
													children: [
														"(",
														post.symbol,
														")"
													]
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-base text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors leading-snug",
										children: post.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed",
										children: post.content
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center gap-1.5 flex-wrap",
											children: post.tags?.map((t, tagIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium",
												children: ["#", t]
											}, `${t}-${tagIdx}`))
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-4 text-xs font-mono text-slate-400",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1 hover:text-rose-500 transition-colors",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: post.likes || 0 })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1 hover:text-blue-500 transition-colors",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: post.commentsCount || post.comments?.length || 0 })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: post.views || 0 })]
												})
											]
										})]
									})
								]
							})]
						}, post.id);
					}), hasMore && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-2 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setDisplayLimit((prev) => prev + PAGE_SIZE),
							className: "px-5 py-2.5 rounded-xl bg-white dark:bg-[#131722] hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors shadow-xs cursor-pointer",
							children: [
								"게시글 더보기 (",
								paginatedPosts.length,
								" / ",
								sortedPosts.length,
								")"
							]
						})
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-16 text-center rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-6 h-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-slate-700 dark:text-slate-300",
								children: "조건에 맞는 게시글이 없습니다."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-400",
								children: "새로운 주제로 첫 번째 토론 글을 작성해 보세요."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleOpenWriteModal,
								className: "mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "새 글 작성하기" })]
							})
						]
					})
				}),
				isEditorOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostEditorModal, {
					isOpen: isEditorOpen,
					onClose: () => setIsEditorOpen(false),
					onSuccess: (newPost) => {
						setPosts((prev) => dedupeById([newPost, ...prev]));
						setIsEditorOpen(false);
					},
					defaultCategory: activeCategory !== "all" ? activeCategory : void 0
				})
			]
		})
	});
};
//#endregion
export { CommunityView };
