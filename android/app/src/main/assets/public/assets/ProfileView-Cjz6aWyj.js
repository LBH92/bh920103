import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { F as ShieldCheck, Z as Pen, bn as require_react, bt as Info, dn as Award, ft as Mail, jt as FileText, mt as LogIn, pt as LogOut, tn as Calendar, u as User, yt as Key } from "./vendor-lucide-Dji_Ij8j.js";
import { n as useApp, p as dedupeById, u as storageService } from "./AppContext-Butl4QWq.js";
import { n as InquiryForm, t as MyInquiries } from "./MyInquiries-cjHqRZ5K.js";
import { t as UserAiSettingsModal } from "./UserAiSettingsModal-CGVmO5w6.js";
//#region src/services/badgeService.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var BADGES = {
	SURVIVOR: {
		id: "survivor",
		name: "국장 생존자",
		condition: "주식 1년 이상 보유"
	},
	CHART_MASTER: {
		id: "chart_master",
		name: "새벽의 차트러",
		condition: "일 10회 이상 차트 조회"
	},
	DIVIDEND: {
		id: "dividend",
		name: "배당금 존버단",
		condition: "배당 종목 3개 이상 보유"
	},
	NEWBIE_ESCAPE: {
		id: "newbie_escape",
		name: "주린이 탈출 중",
		condition: "게시글 10개 작성"
	}
};
//#endregion
//#region src/components/profile/AppInfoView.tsx
var import_jsx_runtime = require_jsx_runtime();
var AppInfoView = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 animate-in fade-in duration-150",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-6 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-8 h-8" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-black text-slate-900 dark:text-white",
					children: "병돌 인베스트먼트"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500 dark:text-slate-400 mt-1",
					children: "Version 1.0.0 (Build 20261025.1)"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-3",
					children: "고객 지원 및 약관"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "#",
					className: "flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold text-slate-700 dark:text-slate-200",
							children: "서비스 이용약관"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "#",
					className: "flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold text-slate-700 dark:text-slate-200",
							children: "개인정보 처리방침"
						})]
					})
				})
			]
		})]
	});
};
//#endregion
//#region src/components/profile/ProfileView.tsx
var ProfileView = () => {
	const { user, updateUser, watchlist, navigateToPost, setActiveTab, setIsAuthModalOpen, showToast, logout } = useApp();
	const [isEditing, setIsEditing] = (0, import_react.useState)(false);
	const [isAiSettingsOpen, setIsAiSettingsOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)(user?.name || "");
	const [bio, setBio] = (0, import_react.useState)(user?.bio || "");
	const [profileTab, setProfileTab] = (0, import_react.useState)("my_posts");
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-20 text-center max-w-md mx-auto space-y-4 animate-in fade-in duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-8 h-8" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-xl font-black text-slate-900 dark:text-white",
				children: "로그인이 필요한 서비스입니다"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed",
				children: "병돌 인베스트먼트에 로그인하고 나만의 프로필 관리, 작성 글 모아보기, 관심종목을 확인하세요."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setIsAuthModalOpen(true),
				className: "px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-rose-600/20 inline-flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "로그인 / 회원가입하기" })]
			})
		]
	});
	const allPosts = dedupeById(storageService.getPosts());
	const myPosts = allPosts.filter((p) => p.author.id === user.id || p.author.name === user.name);
	const myComments = [];
	allPosts.forEach((p) => {
		p.comments?.forEach((c) => {
			if (c.author.id === user.id || c.author.name === user.name) myComments.push({
				postId: p.id,
				postTitle: p.title,
				content: c.content,
				createdAt: c.createdAt
			});
		});
	});
	const handleSaveProfile = (e) => {
		e.preventDefault();
		updateUser({
			name,
			bio
		});
		setIsEditing(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12 max-w-4xl mx-auto animate-in fade-in duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: user.avatar,
							alt: user.name,
							className: "w-16 h-16 rounded-2xl object-cover ring-2 ring-rose-500/40"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-xl font-black text-slate-900 dark:text-white mb-1",
										children: user.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 flex-wrap",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "px-2 py-0.5 rounded-md text-xs font-bold bg-amber-500/10 text-amber-500",
											children: [
												user.tier,
												" (Lv.",
												user.level,
												")"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "px-2 py-0.5 rounded-md text-xs font-bold bg-blue-500/10 text-blue-500",
											children: ["칭호: ", user.title]
										})]
									}),
									user.badges && user.badges.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2 mt-3",
										children: user.badges.map((badgeId) => {
											const badgeInfo = Object.values(BADGES).find((b) => b.id === badgeId);
											return badgeInfo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "px-2 py-1 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-3 h-3" }), badgeInfo.name]
											}, badgeId) : null;
										})
									}),
									user.role === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-2 py-0.5 rounded-md text-xs font-bold bg-rose-500/10 text-rose-500",
											children: "총괄관리자"
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-slate-400 mt-1 flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 font-mono",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-3.5 h-3.5" }), user.email]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3.5 h-3.5" }),
										"가입 ",
										user.joinedDate
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium",
								children: user.bio
							})
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 self-start sm:self-center flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setIsAiSettingsOpen(true),
								className: "px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-purple-600/20 transition-all cursor-pointer",
								title: "개인 AI (Gemini) 연결 및 과금 설정",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AI 계정 연결" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setIsEditing((prev) => !prev),
								className: "px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isEditing ? "취소" : "프로필 편집" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: logout,
								className: "px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-xs font-semibold text-rose-600 flex items-center gap-1.5 transition-colors cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "로그아웃" })]
							})
						]
					})]
				}), isEditing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSaveProfile,
					className: "mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1",
							children: "닉네임 변경"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							required: true,
							value: name,
							onChange: (e) => setName(e.target.value),
							className: "w-full sm:w-80 px-3.5 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1",
							children: "소개글 (바이오)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: bio,
							onChange: (e) => setBio(e.target.value),
							className: "w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold",
							children: "수정사항 저장"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-slate-400 block mb-1",
							children: "작성한 게시글"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xl font-black font-mono text-slate-900 dark:text-white",
							children: [
								myPosts.length,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-sans font-medium text-slate-400",
									children: "개"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-slate-400 block mb-1",
							children: "작성한 댓글"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xl font-black font-mono text-slate-900 dark:text-white",
							children: [
								myComments.length,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-sans font-medium text-slate-400",
									children: "개"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-slate-400 block mb-1",
							children: "등록 관심종목"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xl font-black font-mono text-slate-900 dark:text-white",
							children: [
								watchlist.length,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-sans font-medium text-slate-400",
									children: "개"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-slate-400 block mb-1",
							children: "모의 승률 (추정)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xl font-black font-mono text-rose-500",
							children: [user.winRate || 72.5, "%"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setProfileTab("my_posts"),
						className: `px-4 py-2 text-xs font-bold rounded-xl transition-all ${profileTab === "my_posts" ? "bg-white dark:bg-[#1a1f2e] text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
						children: [
							"내가 쓴 글 (",
							myPosts.length,
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setProfileTab("my_comments"),
						className: `px-4 py-2 text-xs font-bold rounded-xl transition-all ${profileTab === "my_comments" ? "bg-white dark:bg-[#1a1f2e] text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
						children: [
							"내가 쓴 댓글 (",
							myComments.length,
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setProfileTab("inquiries"),
						className: `px-4 py-2 text-xs font-bold rounded-xl transition-all ${profileTab === "inquiries" ? "bg-white dark:bg-[#1a1f2e] text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
						children: "문의 내역"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setProfileTab("info"),
						className: `px-4 py-2 text-xs font-bold rounded-xl transition-all ${profileTab === "info" ? "bg-white dark:bg-[#1a1f2e] text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
						children: "앱 정보"
					})
				]
			}),
			profileTab === "my_posts" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: myPosts.length > 0 ? myPosts.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: () => navigateToPost(post.id),
					className: "p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer group",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-slate-400 font-mono",
								children: post.createdAt
							}), post.symbolName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-semibold text-rose-500",
								children: [
									"[",
									post.symbolName,
									"]"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-bold text-sm text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors",
							children: post.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1",
							children: post.content
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mt-2 text-xs text-slate-400 font-mono",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["추천 ", post.likes] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["댓글 ", post.commentsCount || post.comments?.length || 0] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["조회 ", post.views] })
							]
						})
					]
				}, post.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-12 text-center rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 text-slate-400 text-xs",
					children: "아직 작성한 게시글이 없습니다."
				})
			}),
			profileTab === "my_comments" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: myComments.length > 0 ? myComments.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: () => navigateToPost(c.postId),
					className: "p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer group",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[11px] text-slate-400 font-mono block mb-1",
						children: [
							"원문: ",
							c.postTitle,
							" (",
							c.createdAt,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-800 dark:text-slate-200 font-medium group-hover:text-rose-500 transition-colors",
						children: c.content
					})]
				}, i)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-12 text-center rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 text-slate-400 text-xs",
					children: "아직 작성한 댓글이 없습니다."
				})
			}),
			profileTab === "inquiries" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-sm mb-4",
						children: "새 문의하기"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InquiryForm, {})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-sm mb-4",
						children: "내 문의 내역"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyInquiries, {})]
				})]
			}),
			profileTab === "info" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInfoView, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAiSettingsModal, {
				isOpen: isAiSettingsOpen,
				onClose: () => setIsAiSettingsOpen(false)
			})
		]
	});
};
//#endregion
export { ProfileView };
