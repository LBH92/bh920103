import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { Ft as ExternalLink, Ht as Clock, I as ShieldAlert, Nt as Eye, Q as PenLine, V as Send, bn as require_react, g as TrendingUp, gn as ArrowLeft, mt as LogIn, ot as MessageSquare, v as Trash2, wt as Heart } from "./vendor-lucide-Dji_Ij8j.js";
import { F as formatPostExactDateTime, I as formatPostListTime, S as inferStockCurrency, f as firebaseRepository, j as formatCommunityTime, n as useApp, p as dedupeById, u as storageService, v as formatMoney } from "./AppContext-Butl4QWq.js";
import { p as PriceBadge, t as ReportModal } from "./index-DLz7vtf6.js";
import { t as PostEditorModal } from "./PostEditorModal-Bxu4oV5j.js";
//#region src/utils/firestoreError.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var getErrorMessage = (errorJson) => {
	try {
		const code = JSON.parse(errorJson).error || "";
		if (code.includes("permission-denied")) return "접근 권한이 없습니다. 관리자에게 문의하세요.";
		if (code.includes("unauthenticated")) return "로그인이 필요합니다. 다시 로그인해주세요.";
		if (code.includes("not-found")) return "요청한 데이터를 찾을 수 없습니다.";
		if (code.includes("unavailable")) return "현재 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
		if (code.includes("resource-exhausted")) return "서비스 이용 한도를 초과했습니다. 잠시 후 다시 시도해주세요.";
		return "요청 처리 중 오류가 발생했습니다.";
	} catch {
		return "알 수 없는 오류가 발생했습니다.";
	}
};
//#endregion
//#region src/components/community/PostDetailView.tsx
var import_jsx_runtime = require_jsx_runtime();
var PostDetailView = ({ postId }) => {
	const { user, stocks, navigateToStock, navigateToPostList, setActiveTab, showToast, requireAuth, isAuthenticated, setIsAuthModalOpen } = useApp();
	const [post, setPost] = (0, import_react.useState)(() => storageService.getPostById(postId));
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [commentText, setCommentText] = (0, import_react.useState)("");
	const [isEditModalOpen, setIsEditModalOpen] = (0, import_react.useState)(false);
	const [editingCommentId, setEditingCommentId] = (0, import_react.useState)(null);
	const [editingCommentText, setEditingCommentText] = (0, import_react.useState)("");
	const [reportTarget, setReportTarget] = (0, import_react.useState)(null);
	const [isProcessing, setIsProcessing] = (0, import_react.useState)(false);
	const [commentLimit, setCommentLimit] = (0, import_react.useState)(15);
	const uniqueComments = dedupeById(post?.comments || []);
	const visibleComments = uniqueComments.slice(0, commentLimit);
	const hasMoreComments = uniqueComments.length > commentLimit;
	(0, import_react.useEffect)(() => {
		let isSubscribed = true;
		setIsLoading(true);
		firebaseRepository.getPostById(postId).then((remotePost) => {
			if (isSubscribed) {
				if (remotePost) setPost({
					...remotePost,
					comments: dedupeById(remotePost.comments || [])
				});
				setIsLoading(false);
			}
		});
		firebaseRepository.incrementPostView(postId);
		storageService.incrementViewCount(postId);
		return () => {
			isSubscribed = false;
		};
	}, [postId]);
	const handleBack = () => {
		if (window.history.length > 1) window.history.back();
		else navigateToPostList();
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-20 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-8 h-8 border-4 border-rose-500/30 border-t-rose-600 rounded-full animate-spin mx-auto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-slate-400 mt-4",
			children: "게시글을 불러오는 중..."
		})]
	});
	if (!post) {
		if (isLoading) return null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "py-20 text-center space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-slate-400",
				children: "게시글을 찾을 수 없거나 이미 삭제되었습니다."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: handleBack,
				className: "px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors",
				children: "이전 화면으로 돌아가기"
			})]
		});
	}
	const isAuthor = Boolean(user && (user.id === post.author.id || user.role === "admin" || user.role === "superadmin"));
	const isLiked = Boolean(user && post.likedBy?.includes(user.id));
	const matchedStock = post.symbol ? stocks.find((s) => s.symbol === post.symbol) : null;
	const handleToggleLike = async () => {
		if (isProcessing) return;
		if (!requireAuth("게시글 추천")) return;
		if (!user) return;
		setIsProcessing(true);
		const prevPost = { ...post };
		try {
			const updated = storageService.togglePostLike(post.id, user.id);
			if (updated) setPost({ ...updated });
			await firebaseRepository.togglePostLike(post.id, user.id);
		} catch (err) {
			showToast(getErrorMessage(err.message), "error");
			setPost(prevPost);
		} finally {
			setIsProcessing(false);
		}
	};
	const handleDeletePost = async () => {
		if (isProcessing) return;
		if (!isAuthor) {
			showToast("삭제 권한이 없습니다.", "error");
			return;
		}
		if (window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
			setIsProcessing(true);
			try {
				await firebaseRepository.deletePost(post.id);
				storageService.deletePost(post.id);
				showToast("게시글이 삭제되었습니다.", "info");
				navigateToPostList();
			} catch (err) {
				showToast(getErrorMessage(err.message), "error");
				setIsProcessing(false);
			}
		}
	};
	const handleAddComment = async (e) => {
		e.preventDefault();
		if (isProcessing) return;
		if (!requireAuth("댓글 작성")) return;
		if (!user) return;
		if (!commentText.trim()) return;
		setIsProcessing(true);
		const prevPost = { ...post };
		const newCommentItem = {
			id: `c-${Date.now()}`,
			postId: post.id,
			author: {
				id: user.id,
				name: user.name,
				avatar: user.avatar,
				badge: user.role === "admin" ? "운영자" : user.tier
			},
			content: commentText.trim(),
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			likes: 0,
			likedBy: []
		};
		storageService.addComment(post.id, user, commentText.trim());
		setPost((prev) => prev ? {
			...prev,
			comments: dedupeById([...prev.comments || [], newCommentItem])
		} : prev);
		try {
			await firebaseRepository.addComment(post.id, newCommentItem);
			setCommentText("");
			showToast("댓글이 등록되었습니다.", "success");
		} catch (err) {
			setPost(prevPost);
			showToast(getErrorMessage(err.message), "error");
		} finally {
			setIsProcessing(false);
		}
	};
	const handleStartCommentEdit = (c) => {
		setEditingCommentId(c.id);
		setEditingCommentText(c.content);
	};
	const handleSaveCommentEdit = async (commentId) => {
		if (!editingCommentText.trim()) return;
		storageService.updateComment(post.id, commentId, editingCommentText.trim());
		await firebaseRepository.updateComment(post.id, commentId, editingCommentText.trim());
		const refreshed = storageService.getPostById(post.id);
		if (refreshed) setPost({
			...refreshed,
			comments: dedupeById(refreshed.comments || [])
		});
		setEditingCommentId(null);
		setEditingCommentText("");
		showToast("댓글이 수정되었습니다.", "success");
	};
	const handleDeleteComment = async (commentId, commentAuthorId) => {
		if (isProcessing) return;
		if (!Boolean(user && (user.id === commentAuthorId || user.role === "admin"))) {
			showToast("댓글 삭제 권한이 없습니다.", "error");
			return;
		}
		if (window.confirm("댓글을 삭제하시겠습니까?")) {
			setIsProcessing(true);
			const prevPost = { ...post };
			setPost((prev) => prev ? {
				...prev,
				comments: (prev.comments || []).filter((c) => c.id !== commentId)
			} : prev);
			try {
				await firebaseRepository.deleteComment(post.id, commentId);
				storageService.deleteComment(post.id, commentId);
				showToast("댓글이 삭제되었습니다.", "info");
			} catch (err) {
				showToast(getErrorMessage(err.message), "error");
				setPost(prevPost);
			} finally {
				setIsProcessing(false);
			}
		}
	};
	const getCategoryLabel = (cat) => {
		switch (cat) {
			case "free": return "💬 자유게시판";
			case "discussion": return "📊 종목토론";
			case "market": return "🌐 시장정보";
			case "invest": return "💡 투자정보";
			case "qa": return "❓ 질문/답변";
			case "notice": return "📢 공지사항";
			default: return "💬 일반";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-16 max-w-4xl mx-auto animate-in fade-in duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleBack,
					className: "flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "이전 화면으로 돌아가기" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						user && user.id === post.author.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setIsEditModalOpen(true),
							className: "flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "수정" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleDeletePost,
							className: "flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/40 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "삭제" })]
						})] }),
						user && (user.role === "admin" || user.role === "superadmin") && user.id !== post.author.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleDeletePost,
							className: "flex items-center gap-1 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900/40 text-xs font-semibold text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "관리자 삭제" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setReportTarget({
								type: "post",
								targetId: post.id,
								content: post.title + "\n" + post.content,
								authorName: post.author.name
							}),
							className: "flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer",
							title: "게시글 신고",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-3.5 h-3.5 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "신고" })]
						})
					]
				})]
			}),
			matchedStock && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onClick: () => navigateToStock(matchedStock.symbol),
				className: "p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-50/70 via-white to-slate-50/80 dark:from-rose-950/20 dark:via-[#131722] dark:to-slate-900/40 border border-rose-200/80 dark:border-rose-900/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group hover:border-rose-400 transition-all",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-12 h-12 rounded-2xl bg-white dark:bg-[#131722] border border-rose-200 dark:border-rose-800/60 flex items-center justify-center text-rose-500 shrink-0 shadow-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-6 h-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs px-2 py-0.5 rounded font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-mono",
							children: matchedStock.market
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-mono font-bold text-slate-400",
							children: matchedStock.symbol
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-black text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors",
						children: matchedStock.name
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white",
							children: formatMoney(matchedStock.price, inferStockCurrency(matchedStock.symbol, matchedStock.market, matchedStock.currency))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceBadge, {
							change: matchedStock.change,
							changePercent: matchedStock.changePercent,
							currency: inferStockCurrency(matchedStock.symbol, matchedStock.market, matchedStock.currency),
							size: "sm"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition-transform",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "종목 상세 보기" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3.5 h-3.5" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2 flex-wrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
									children: getCategoryLabel(post.category)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 text-xs text-slate-400 font-mono flex-wrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											title: `작성 시각: ${formatPostExactDateTime(post.createdAt, true)}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatCommunityTime(post.createdAt) })]
										}),
										post.updatedAt && post.updatedAt !== post.createdAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex items-center gap-1 text-slate-400/90",
											title: `최종 수정 시각: ${formatPostExactDateTime(post.updatedAt, true)}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["수정: ", formatPostExactDateTime(post.updatedAt, false)] })
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3.5 h-3.5" }), post.views]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug",
								children: post.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: post.author.avatar,
									alt: post.author.name,
									className: "w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-sm text-slate-900 dark:text-white",
											children: post.author.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500",
											children: post.author.badge
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-bold px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-500",
											children: post.author.title
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-slate-400",
									children: ["Lv.", post.author.level]
								})] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line py-4 border-y border-slate-100 dark:border-slate-800/80",
						children: post.content
					}),
					post.tags && post.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2 flex-wrap pt-1",
						children: post.tags.map((t, tagIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-medium",
							children: ["#", t]
						}, `${t}-${tagIdx}`))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleToggleLike,
								className: `flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isLiked ? "bg-rose-500 text-white shadow-md shadow-rose-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `w-4 h-4 ${isLiked ? "fill-white" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"좋아요 (",
									post.likes,
									")"
								] })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-slate-400 font-mono",
							children: [
								"댓글 ",
								post.comments?.length || post.commentsCount || 0,
								"개"
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-bold text-base text-slate-900 dark:text-white flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-5 h-5 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"댓글 (",
							post.comments?.length || post.commentsCount || 0,
							")"
						] })]
					}),
					!isAuthenticated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🔒 댓글을 작성하려면 로그인이 필요합니다." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setIsAuthModalOpen(true),
							className: "px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold flex items-center gap-1 self-start sm:self-auto cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "로그인하기" })]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleAddComment,
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							required: true,
							value: commentText,
							onChange: (e) => setCommentText(e.target.value),
							placeholder: "동료 투자자들에게 따뜻하고 건설적인 댓글을 남겨주세요.",
							className: "flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 font-medium"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							className: "px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-md shadow-rose-600/20 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "등록" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-slate-100 dark:divide-slate-800/80 pt-2",
						children: visibleComments.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [visibleComments.map((c) => {
							const isCommentAuthor = Boolean(user && (user.id === c.author.id || user.role === "admin" || user.role === "superadmin"));
							const isEditingThis = editingCommentId === c.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-4 first:pt-0 last:pb-0 group space-y-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3 flex-1 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: c.author.avatar,
											alt: c.author.name,
											className: "w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 flex-wrap",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-bold text-xs text-slate-900 dark:text-white",
														children: c.author.name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold",
														children: c.author.badge
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] text-slate-400 font-mono",
														title: `작성: ${formatPostExactDateTime(c.createdAt, true)}`,
														children: formatPostListTime(c.createdAt)
													}),
													c.updatedAt && c.updatedAt !== c.createdAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] text-slate-400/80 italic font-mono",
														title: `수정: ${formatPostExactDateTime(c.updatedAt, true)}`,
														children: "(수정됨)"
													})
												]
											}), isEditingThis ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2 space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
													rows: 2,
													value: editingCommentText,
													onChange: (e) => setEditingCommentText(e.target.value),
													className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 resize-none font-medium"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => handleSaveCommentEdit(c.id),
														className: "px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold cursor-pointer",
														children: "저장"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => setEditingCommentId(null),
														className: "px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold cursor-pointer",
														children: "취소"
													})]
												})]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed break-words",
												children: c.content
											})]
										})]
									}), !isEditingThis && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity shrink-0",
										children: [isCommentAuthor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleStartCommentEdit(c),
											className: "p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors",
											title: "댓글 수정",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "w-3.5 h-3.5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleDeleteComment(c.id, c.author.id),
											className: "p-1 text-slate-400 hover:text-rose-500 rounded transition-colors",
											title: "댓글 삭제",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setReportTarget({
												type: "comment",
												targetId: c.id,
												content: c.content,
												authorName: c.author.name
											}),
											className: "p-1 text-slate-400 hover:text-amber-500 rounded transition-colors",
											title: "댓글 신고",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-3.5 h-3.5" })
										})]
									})]
								})
							}, c.id);
						}), hasMoreComments && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-3 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setCommentLimit((prev) => prev + 15),
								className: "px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer",
								children: [
									"이전 댓글 더보기 (",
									visibleComments.length,
									" / ",
									(post.comments || []).length,
									")"
								]
							})
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-8 text-center text-slate-400 text-xs",
							children: "첫 번째 댓글의 주인공이 되어보세요!"
						})
					})
				]
			}),
			isEditModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostEditorModal, {
				isOpen: isEditModalOpen,
				onClose: () => setIsEditModalOpen(false),
				onSuccess: (updated) => {
					setPost(updated);
					setIsEditModalOpen(false);
				},
				editPost: post
			}),
			reportTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportModal, {
				isOpen: Boolean(reportTarget),
				onClose: () => setReportTarget(null),
				targetType: reportTarget.type,
				targetId: reportTarget.targetId,
				postId: post.id,
				targetContent: reportTarget.content,
				targetAuthorName: reportTarget.authorName
			})
		]
	});
};
//#endregion
export { PostDetailView };
