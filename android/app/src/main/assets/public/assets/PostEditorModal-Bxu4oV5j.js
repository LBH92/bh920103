import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { V as Send, bn as require_react, i as X, jt as FileText, w as Tag } from "./vendor-lucide-Dji_Ij8j.js";
import { S as inferStockCurrency, f as firebaseRepository, n as useApp, u as storageService, v as formatMoney } from "./AppContext-Butl4QWq.js";
//#region src/components/community/PostEditorModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var PostEditorModal = ({ isOpen, onClose, onSuccess, editPost, defaultSymbol, defaultCategory }) => {
	const { user, stocks, showToast } = useApp();
	const [category, setCategory] = (0, import_react.useState)(editPost?.category || defaultCategory || (defaultSymbol ? "discussion" : "free"));
	const [title, setTitle] = (0, import_react.useState)(editPost?.title || "");
	const [content, setContent] = (0, import_react.useState)(editPost?.content || "");
	const [symbol, setSymbol] = (0, import_react.useState)(editPost?.symbol || defaultSymbol || "");
	const [tagsStr, setTagsStr] = (0, import_react.useState)(editPost?.tags?.join(", ") || "");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	if (!isOpen) return null;
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!title.trim() || !content.trim()) {
			showToast("제목과 내용을 모두 입력해주세요.", "warning");
			return;
		}
		if (!user) {
			showToast("로그인이 필요합니다.", "warning");
			return;
		}
		if (editPost && editPost.author.id !== user.id && user.role !== "admin") {
			showToast("자신이 작성한 게시글만 수정할 수 있습니다.", "error");
			return;
		}
		setIsSubmitting(true);
		const matchedStock = stocks.find((s) => s.symbol === symbol);
		const tags = tagsStr.split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean);
		if (matchedStock && !tags.includes(matchedStock.name)) tags.unshift(matchedStock.name);
		try {
			if (editPost) {
				await firebaseRepository.updatePost(editPost.id, {
					category,
					title,
					content,
					symbol: symbol || void 0,
					symbolName: matchedStock?.name || void 0,
					tags
				});
				const updated = storageService.updatePost(editPost.id, {
					category,
					title,
					content,
					symbol: symbol || void 0,
					symbolName: matchedStock?.name || void 0,
					tags,
					updatedAt: "방금 전 (수정됨)"
				});
				showToast("게시글이 성공적으로 수정되었습니다.", "success");
				if (updated) onSuccess(updated);
			} else {
				const postData = {
					author: {
						id: user.id,
						name: user.name,
						avatar: user.avatar,
						badge: user.badge || "",
						tier: user.tier,
						level: user.level,
						title: user.title
					},
					category,
					title,
					content,
					symbol: symbol || void 0,
					symbolName: matchedStock?.name || void 0,
					tags
				};
				const firebaseDocId = await firebaseRepository.createPost(postData);
				const created = storageService.createPost({ ...postData }, firebaseDocId);
				showToast("게시글이 성공적으로 등록되었습니다!", "success");
				onSuccess(created);
			}
			onClose();
		} catch (err) {
			console.warn("Post save failed:", err);
			showToast("게시글 저장 중 오류가 발생했습니다.", "error");
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-bold text-base text-slate-900 dark:text-white flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-5 h-5 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: editPost ? "게시글 수정" : "새 게시글 작성" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "p-6 space-y-4 overflow-y-auto flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
							children: ["게시판 카테고리 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-rose-500",
								children: "*"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: category,
							onChange: (e) => setCategory(e.target.value),
							className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "free",
									children: "💬 자유게시판"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "discussion",
									children: "📊 종목토론"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "market",
									children: "🌐 시장정보"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "invest",
									children: "💡 투자정보"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "qa",
									children: "❓ 질문/답변"
								}),
								user?.role === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "notice",
									children: "📢 공지사항 (관리자)"
								})
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["관련 종목 선택 ", category === "discussion" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-rose-500 font-semibold",
								children: "(추천)"
							})] }), symbol && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSymbol(""),
								className: "text-[11px] text-slate-400 hover:text-rose-500",
								children: "선택 해제"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: symbol,
							onChange: (e) => setSymbol(e.target.value),
							className: `w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 ${category === "discussion" && !symbol ? "border-amber-400/80 dark:border-amber-500/50" : "border-slate-200 dark:border-slate-700"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "종목 없음 (일반 토론)"
							}), stocks.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: s.symbol,
								children: [
									s.name,
									" (",
									s.symbol,
									") - ",
									s.exchange || s.market,
									" · ",
									formatMoney(s.price, inferStockCurrency(s.symbol, s.market, s.currency))
								]
							}, s.symbol))]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
						children: ["글 제목 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-rose-500",
							children: "*"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						required: true,
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "투자자들의 시선을 사로잡는 명확한 제목을 입력하세요.",
						className: "w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 font-medium"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
						children: ["본문 내용 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-rose-500",
							children: "*"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						required: true,
						rows: 8,
						value: content,
						onChange: (e) => setContent(e.target.value),
						placeholder: "종목 분석 근거, 차트 지지/저항선, 수급 동향, 투자 아이디어를 자유롭고 품격 있게 작성해 주세요. (허위사실 유포 및 광고성 글은 제재 대상이 됩니다)",
						className: "w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 resize-none leading-relaxed"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "w-3.5 h-3.5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "해시태그 (쉼표로 구분)" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: tagsStr,
						onChange: (e) => setTagsStr(e.target.value),
						placeholder: "예: 단타, HBM, 실적발표, 눌림목",
						className: "w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
							children: "취소"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: isSubmitting,
							className: "flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSubmitting ? "저장 중..." : editPost ? "게시글 수정 완료" : "게시글 등록하기" })]
						})]
					})
				]
			})]
		})
	});
};
//#endregion
export { PostEditorModal as t };
