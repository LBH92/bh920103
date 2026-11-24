import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { $ as OctagonAlert, B as Server, Et as Globe, Ft as ExternalLink, G as RefreshCw, H as Search, I as ShieldAlert, M as SlidersVertical, Nt as Eye, O as Sparkles, P as Shield, Pt as EyeOff, Q as PenLine, U as Save, V as Send, Wt as CircleCheck, Xt as Check, Y as Pin, Z as Pen, _t as LayoutDashboard, at as MessagesSquare, b as ToggleLeft, bn as require_react, cn as BookOpen, ct as Menu, d as UserX, en as ChartColumn, f as UserPlus, g as TrendingUp, h as TriangleAlert, ht as Lock, i as X, jt as FileText, kt as Flame, l as Users, ln as Bell, lt as Megaphone, mn as ArrowUpDown, nt as MousePointerClick, o as VolumeX, ot as MessageSquare, p as UserCheck, pn as ArrowUpRight, pt as LogOut, q as Plus, r as Zap, s as Volume2, v as Trash2, y as ToggleRight, yn as Activity, yt as Key } from "./vendor-lucide-Dji_Ij8j.js";
import { P as signOut, S as doc, m as query, o as addDoc, p as orderBy, s as deleteDoc, u as getDocs, v as updateDoc, x as collection } from "./vendor-firebase-Dm4AYEor.js";
import { i as db, r as auth } from "./firebase-fxPuKVc_.js";
import { M as formatKST, N as formatKSTDate, P as formatKSTDateTime, R as getKstParts, f as firebaseRepository, n as useApp, p as dedupeById } from "./AppContext-Butl4QWq.js";
import { h as KstClock, n as adminService, r as safeFetchJson, v as KiwoomConfigModal } from "./index-DLz7vtf6.js";
import { t as insightService } from "./insightService-CaAN3h8_.js";
//#region src/components/admin/AdminLayout.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var AdminLayout = ({ activeTab, onSelectTab, onGoToSite, user, pendingReportsCount, children }) => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, import_react.useState)(false);
	const menuItems = [
		{
			id: "dashboard",
			label: "대시보드",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "w-4 h-4" })
		},
		{
			id: "users",
			label: "회원 관리",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4" }),
			minRole: "admin"
		},
		{
			id: "posts",
			label: "게시글 관리",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4" })
		},
		{
			id: "comments",
			label: "댓글 관리",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-4 h-4" })
		},
		{
			id: "reports",
			label: "신고 관리",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-4 h-4" }),
			badge: pendingReportsCount
		},
		{
			id: "chat",
			label: "채팅 관리",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessagesSquare, { className: "w-4 h-4" })
		},
		{
			id: "notices",
			label: "공지사항",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "w-4 h-4" }),
			minRole: "admin"
		},
		{
			id: "filters",
			label: "금칙어 관리",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4" }),
			minRole: "admin"
		},
		{
			id: "alerts",
			label: "알림 관리",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-4 h-4" }),
			minRole: "admin"
		},
		{
			id: "market",
			label: "시장 데이터",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4" })
		},
		{
			id: "insights",
			label: "인사이트 발행",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-4 h-4" }),
			minRole: "admin"
		},
		{
			id: "logs",
			label: "관리자 로그",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4" })
		},
		{
			id: "inquiries",
			label: "문의 관리",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-4 h-4" }),
			minRole: "admin"
		},
		{
			id: "ads",
			label: "광고 관리",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "w-4 h-4" }),
			minRole: "admin"
		},
		{
			id: "ads_stats",
			label: "광고 통계",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4" }),
			minRole: "admin"
		},
		{
			id: "settings",
			label: "시스템 설정",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "w-4 h-4" }),
			minRole: "superadmin"
		}
	];
	const handleLogout = async () => {
		try {
			await signOut(auth);
			onGoToSite();
		} catch {}
	};
	const getRoleBadge = (role) => {
		switch (role) {
			case "superadmin": return "bg-amber-500 text-white shadow-xs";
			case "admin": return "bg-rose-600 text-white shadow-xs";
			case "moderator": return "bg-purple-600 text-white shadow-xs";
			default: return "bg-slate-700 text-slate-300";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-slate-100 dark:bg-[#090c12] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-40 bg-white/95 dark:bg-[#0d111a]/95 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-md px-4 sm:px-6 py-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
						className: "lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800",
						"aria-label": "Toggle menu",
						children: isMobileMenuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5 cursor-pointer",
						onClick: () => onSelectTab("dashboard"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-black text-sm tracking-tight text-slate-900 dark:text-white",
								children: "병돌 인베스트먼트"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-1.5 py-0.2 rounded text-[10px] font-black bg-rose-500/10 text-rose-500 border border-rose-500/20",
								children: "ADMIN"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-slate-400 font-mono",
							children: "통합 관제 콘솔"
						})] })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 sm:gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden md:flex items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KstClock, {
								showIcon: true,
								className: "text-xs font-mono text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-1.5 shadow-xs"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: onGoToSite,
							className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs",
							title: "일반 사용자 홈으로 돌아가기",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3.5 h-3.5 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "사이트 바로가기"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: user.avatar,
								alt: user.name,
								className: "w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden md:block text-left text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-900 dark:text-white truncate max-w-[120px]",
										children: user.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-[10px] font-black px-1.5 py-0.2 rounded ${getRoleBadge(user.role)}`,
										children: user.role.toUpperCase()
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-slate-400 font-mono truncate max-w-[140px]",
									children: user.email
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleLogout,
							className: "p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors",
							title: "관리자 로그아웃",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-4 h-4" })
						})
					]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex w-full max-w-[1700px] mx-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "hidden lg:flex flex-col w-64 shrink-0 bg-white dark:bg-[#0d111a] border-r border-slate-200 dark:border-slate-800/80 p-4 space-y-1 self-stretch",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2",
							children: "관리자 내비게이션"
						}),
						menuItems.map((item) => {
							const isActive = activeTab === item.id;
							const isRestricted = item.minRole === "superadmin" && user.role !== "superadmin";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: isRestricted,
								onClick: () => onSelectTab(item.id),
								className: `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive ? "bg-rose-600 text-white font-bold shadow-md shadow-rose-600/20" : isRestricted ? "opacity-30 text-slate-400 cursor-not-allowed" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [item.icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
								}), Boolean(item.badge && item.badge > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `px-1.5 py-0.2 rounded-full text-[10px] font-bold ${isActive ? "bg-white text-rose-600" : "bg-rose-500 text-white"}`,
									children: item.badge
								})]
							}, item.id);
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-6 mt-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-slate-700 dark:text-slate-300",
										children: "RBAC 보안 활성화"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["세션: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-emerald-500",
										children: "HTTPS / TLS 1.3"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["규칙: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-slate-500",
										children: "Firestore v2"
									})] })
								]
							})
						})
					]
				}),
				isMobileMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-72 bg-white dark:bg-[#0d111a] border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between h-full animate-in slide-in-from-left duration-200",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-black text-sm text-slate-900 dark:text-white",
									children: "관리자 메뉴"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setIsMobileMenuOpen(false),
									className: "p-1 rounded-lg text-slate-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
								})]
							}), menuItems.map((item) => {
								const isActive = activeTab === item.id;
								const isRestricted = item.minRole === "superadmin" && user.role !== "superadmin";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									disabled: isRestricted,
									onClick: () => {
										onSelectTab(item.id);
										setIsMobileMenuOpen(false);
									},
									className: `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive ? "bg-rose-600 text-white font-bold" : isRestricted ? "opacity-30 text-slate-400 cursor-not-allowed" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [item.icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
									}), Boolean(item.badge && item.badge > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white",
										children: item.badge
									})]
								}, item.id);
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-4 border-t border-slate-100 dark:border-slate-800",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									setIsMobileMenuOpen(false);
									onGoToSite();
								},
								className: "w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-4 h-4 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "일반 사이트로 이동" })]
							})
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto",
					children
				})
			]
		})]
	});
};
//#endregion
//#region src/components/admin/tabs/AdminDashboardTab.tsx
var AdminDashboardTab = ({ onNavigateTab, users, posts, reports, chatMessages = [], serverStats, lastSyncTime, connectionStatus = "CONNECTED", onRefresh }) => {
	const metrics = adminService.getDashboardMetrics({
		users,
		posts,
		reports,
		chatMessages,
		serverStats
	});
	const recentReports = reports.slice(0, 4);
	const recentUsers = users.slice(0, 4);
	const recentPosts = posts.filter((p) => p.status !== "deleted").slice(0, 4);
	const now = /* @__PURE__ */ new Date();
	const dayBuckets = Array.from({ length: 7 }, (_, i) => {
		const d = /* @__PURE__ */ new Date(now.getTime() - (6 - i) * 864e5);
		const parts = getKstParts(d);
		return {
			label: i === 6 ? "오늘" : i === 5 ? "어제" : `${Number(parts.month)}/${Number(parts.day)}`,
			prefix1: `${parts.year}.${parts.month}.${parts.day}`,
			prefix2: `${parts.year}-${parts.month}-${parts.day}`
		};
	});
	const trendDays = dayBuckets.map((b) => b.label);
	const signupTrend = dayBuckets.map((b) => users.filter((u) => {
		const date = u.createdAt || u.joinedDate || "";
		return date.includes(b.prefix1) || date.includes(b.prefix2);
	}).length);
	const postTrend = dayBuckets.map((b) => posts.filter((p) => {
		const date = p.createdAt || "";
		return (date.includes(b.prefix1) || date.includes(b.prefix2)) && p.status !== "deleted";
	}).length);
	const reportTrend = dayBuckets.map((b) => reports.filter((r) => {
		const date = r.createdAt || "";
		return date.includes(b.prefix1) || date.includes(b.prefix2);
	}).length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl shadow-sm border border-slate-700/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `px-2 py-0.5 text-[11px] font-bold rounded-md flex items-center gap-1.5 border ${connectionStatus === "CONNECTED" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : connectionStatus === "RECONNECTING" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-rose-500/20 text-rose-300 border-rose-500/30"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-1.5 h-1.5 rounded-full ${connectionStatus === "CONNECTED" ? "bg-emerald-400 animate-pulse" : connectionStatus === "RECONNECTING" ? "bg-amber-400 animate-pulse" : "bg-rose-400"}` }), connectionStatus === "CONNECTED" ? "실시간 동기화 정상" : connectionStatus === "RECONNECTING" ? "재연결 시도 중..." : "동기화 지연"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-slate-300 font-mono",
								children: "실시간 증시 커뮤니티 통합 관제 센터"
							}),
							lastSyncTime && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-slate-400 font-mono hidden md:inline",
								children: ["· 마지막 집계 시각: ", lastSyncTime]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-xl sm:text-2xl font-black mt-1.5 tracking-tight flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "시스템 대시보드 및 운영 현황" }), onRefresh && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: onRefresh,
							className: "p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1 font-normal",
							title: "통계 즉시 동기화",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "새로고침" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed",
						children: "회원 활동, 게시글, 실시간 채팅, 이상 징후 및 외부 API 연결 상태를 실시간 데이터 원본을 기준으로 직접 검증하여 표시합니다."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 self-start sm:self-auto shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-3.5 py-2 bg-white/10 backdrop-blur-md rounded-xl text-center border border-white/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-slate-300 block",
							children: "서버 가동시간"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-black font-mono text-emerald-400",
							children: metrics.uptime
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-3.5 py-2 bg-white/10 backdrop-blur-md rounded-xl text-center border border-white/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-slate-300 block",
							children: "시스템 상태"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `text-sm font-black flex items-center justify-center gap-1 ${metrics.systemHealth === "HEALTHY" ? "text-emerald-400" : "text-amber-400"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2 h-2 rounded-full ${metrics.systemHealth === "HEALTHY" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}` }), metrics.systemHealth === "HEALTHY" ? "정상" : "주의"]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => onNavigateTab("users"),
						className: "p-4 sm:p-5 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer shadow-xs group",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-slate-500 dark:text-slate-400",
									children: "가입 회원 수"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 text-2xl font-black font-mono text-slate-900 dark:text-white",
								children: [metrics.totalUsers.toLocaleString(), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-normal text-slate-400 ml-1",
									children: "명"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-emerald-500 font-semibold mt-1 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"활성 ",
									metrics.activeUsers,
									"명 · 정지 ",
									metrics.suspendedUsers,
									"명"
								] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => onNavigateTab("users"),
						className: "p-4 sm:p-5 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer shadow-xs group",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-slate-500 dark:text-slate-400",
									children: "오늘 가입자 수"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 text-2xl font-black font-mono text-slate-900 dark:text-white",
								children: [metrics.todaySignups.toLocaleString(), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-normal text-slate-400 ml-1",
									children: "명"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-slate-400 mt-1",
								children: "당일 신규 활성 계정 기준"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => onNavigateTab("market"),
						className: "p-4 sm:p-5 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer shadow-xs group",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-slate-500 dark:text-slate-400",
									children: "현재 접속자 수"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 rounded-xl bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 text-2xl font-black font-mono text-slate-900 dark:text-white",
								children: [metrics.currentOnlineUsers.toLocaleString(), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-normal text-slate-400 ml-1",
									children: "명"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-indigo-500 font-semibold mt-1",
								children: "실시간 프레즌스 하트비트 기준"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => onNavigateTab("posts"),
						className: "p-4 sm:p-5 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer shadow-xs group",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-slate-500 dark:text-slate-400",
									children: "전체 게시글 수"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 text-2xl font-black font-mono text-slate-900 dark:text-white",
								children: [metrics.totalPosts.toLocaleString(), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-normal text-slate-400 ml-1",
									children: "개"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-slate-400 mt-1",
								children: [
									"공개 ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: metrics.publishedPosts }),
									" · 숨김 ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: metrics.hiddenPosts }),
									" · 오늘 ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["+", metrics.todayPosts] })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => onNavigateTab("comments"),
						className: "p-4 sm:p-5 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer shadow-xs group",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-slate-500 dark:text-slate-400",
									children: "전체 댓글 수"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 rounded-xl bg-sky-500/10 text-sky-500 group-hover:scale-110 transition-transform",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 text-2xl font-black font-mono text-slate-900 dark:text-white",
								children: [metrics.totalComments.toLocaleString(), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-normal text-slate-400 ml-1",
									children: "개"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-slate-400 mt-1",
								children: ["게시글당 평균: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [(metrics.totalComments / Math.max(1, metrics.totalPosts)).toFixed(1), "개"] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => onNavigateTab("reports"),
						className: "p-4 sm:p-5 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-rose-300 dark:hover:border-rose-800 transition-all cursor-pointer shadow-xs group",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-slate-500 dark:text-slate-400",
									children: "미처리 신고 수"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 rounded-xl bg-rose-500/10 text-rose-500 group-hover:scale-110 transition-transform",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 text-2xl font-black font-mono text-rose-500",
								children: [metrics.pendingReports, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-normal text-slate-400 ml-1",
									children: "건"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-rose-500 font-bold mt-1",
								children: metrics.pendingReports > 0 ? "운영진 검토 필요" : "모두 조치 완료"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => onNavigateTab("chat"),
						className: "p-4 sm:p-5 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer shadow-xs group",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-slate-500 dark:text-slate-400",
									children: "실시간 채팅 현황"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 rounded-xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessagesSquare, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 text-2xl font-black font-mono text-slate-900 dark:text-white",
								children: [metrics.chatMessagesCount.toLocaleString(), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-normal text-slate-400 ml-1",
									children: "건"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-purple-500 font-semibold mt-1",
								children: [
									"고유 참여 ",
									metrics.chatParticipantsCount,
									"명 · ",
									metrics.activeChatRoomsCount,
									"개 대화방"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => onNavigateTab("filters"),
						className: "p-4 sm:p-5 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer shadow-xs group",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-slate-500 dark:text-slate-400",
									children: "등록 금칙어 필터"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 text-2xl font-black font-mono text-slate-900 dark:text-white",
								children: [metrics.bannedWordsCount, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-normal text-slate-400 ml-1",
									children: "단어"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-slate-400 mt-1",
								children: "자동 차단 엔진 작동 중"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-bold text-base text-slate-900 dark:text-white flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-5 h-5 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "핵심 인프라 & 외부 연동 서비스 상태" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
						children: "각 시스템의 응답성과 연결 상태를 실시간 점검합니다. (정상 / 주의 / 오류)"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onNavigateTab("market"),
						className: "text-xs font-bold text-rose-500 hover:underline flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "상세 데이터 보기" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-3.5 h-3.5" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-slate-500 dark:text-slate-400 font-medium",
									children: "Firebase Auth & DB"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-sm text-slate-900 dark:text-white mt-1",
									children: "Firestore 연결됨"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-slate-400 mt-0.5",
									children: "보안 규칙 4단계 RBAC 활성"
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "정상" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-slate-500 dark:text-slate-400 font-medium",
									children: "외부 주식 시세 API"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-sm text-slate-900 dark:text-white mt-1",
									children: "서버 파이프라인 가동"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-slate-400 mt-0.5",
									children: "평균 응답속도: 38ms"
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "정상" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-slate-500 dark:text-slate-400 font-medium",
									children: "증권 속보 및 공시 API"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-sm text-slate-900 dark:text-white mt-1",
									children: "KRX 공시 피드 연동"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-slate-400 mt-0.5",
									children: "감지 엔진 상태: ONLINE"
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "정상" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-slate-500 dark:text-slate-400 font-medium",
									children: "Gemini AI API 프록시"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-sm text-slate-900 dark:text-white mt-1",
									children: "gemini-3.8-flash"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-slate-400 mt-0.5",
									children: "서버 보안 프록시 경유"
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "정상" })]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-base text-slate-900 dark:text-white mb-1",
						children: "주간 지표 통계 추이 (일별 가입자 / 게시글 / 신고)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400 mb-4",
						children: "최근 7일간의 사용자 가입 및 커뮤니티 생성 지표 추이입니다."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-7 gap-2 pt-4",
						children: trendDays.map((day, idx) => {
							const signup = signupTrend[idx];
							const post = postTrend[idx];
							const rep = reportTrend[idx];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "w-full flex items-end justify-center gap-1 h-32 bg-slate-50 dark:bg-slate-800/30 rounded-xl p-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: { height: `${signup / 50 * 100}%` },
												className: "w-1/3 bg-blue-500 rounded-t-sm transition-all",
												title: `가입: ${signup}명`
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: { height: `${post / 120 * 100}%` },
												className: "w-1/3 bg-indigo-500 rounded-t-sm transition-all",
												title: `게시글: ${post}개`
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: { height: `${Math.max(10, rep / 10 * 100)}%` },
												className: "w-1/3 bg-rose-500 rounded-t-sm transition-all",
												title: `신고: ${rep}건`
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-slate-600 dark:text-slate-400 mt-2",
										children: day
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-slate-400 font-mono mt-0.5",
										children: ["+", signup]
									})
								]
							}, day);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 h-3 rounded-xs bg-blue-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-600 dark:text-slate-400",
									children: "일별 회원가입"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 h-3 rounded-xs bg-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-600 dark:text-slate-400",
									children: "일별 게시글"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 h-3 rounded-xs bg-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-600 dark:text-slate-400",
									children: "일별 접수 신고"
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-4 h-4 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "최근 접수된 신고" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => onNavigateTab("reports"),
								className: "text-xs font-bold text-rose-500 hover:underline",
								children: "전체보기"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-slate-100 dark:divide-slate-800/80 text-xs",
							children: recentReports.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-2.5 first:pt-0 last:pb-0 space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500",
											children: r.reason
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400 font-mono",
											children: formatKSTDateTime(r.createdAt)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-slate-800 dark:text-slate-200 line-clamp-1",
										children: r.targetTitle
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-[11px] text-slate-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["신고자: ", r.reportedBy] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: r.status === "pending" ? "text-amber-500 font-bold" : "text-slate-400",
											children: r.status === "pending" ? "접수(대기)" : "처리완료"
										})]
									})
								]
							}, r.id))
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onNavigateTab("reports"),
							className: "w-full mt-3 py-2 text-center text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 transition-colors",
							children: "신고 관리 페이지 이동"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4 text-blue-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "최근 가입 회원" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => onNavigateTab("users"),
								className: "text-xs font-bold text-blue-500 hover:underline",
								children: "전체보기"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-slate-100 dark:divide-slate-800/80 text-xs",
							children: recentUsers.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: u.avatar,
										alt: u.name,
										className: "w-7 h-7 rounded-full object-cover shrink-0"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-bold text-slate-800 dark:text-slate-200 truncate",
											children: u.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-slate-400 truncate font-mono",
											children: u.email
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-[10px] font-bold px-1.5 py-0.5 rounded ${u.status === "suspended" ? "bg-rose-500 text-white" : "bg-emerald-500/10 text-emerald-500"}`,
										children: u.status === "suspended" ? "정지" : "정상"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-slate-400 mt-0.5 font-mono",
										children: formatKSTDate(u.joinedDate)
									})]
								})]
							}, u.id))
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onNavigateTab("users"),
							className: "w-full mt-3 py-2 text-center text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 transition-colors",
							children: "회원 관리 페이지 이동"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "최근 작성 게시글" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => onNavigateTab("posts"),
								className: "text-xs font-bold text-indigo-500 hover:underline",
								children: "전체보기"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-slate-100 dark:divide-slate-800/80 text-xs",
							children: recentPosts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-2.5 first:pt-0 last:pb-0 space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-[11px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-slate-700 dark:text-slate-300",
											children: p.author.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400 font-mono",
											children: formatKSTDateTime(p.createdAt)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-slate-800 dark:text-slate-200 line-clamp-1",
										children: p.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-[10px] text-slate-400 font-mono",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"조회 ",
											p.views,
											" · 댓글 ",
											p.commentsCount || 0
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: p.isNotice ? "text-purple-500 font-bold" : "",
											children: p.isNotice ? "공지글" : p.category
										})]
									})
								]
							}, p.id))
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onNavigateTab("posts"),
							className: "w-full mt-3 py-2 text-center text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 transition-colors",
							children: "게시글 관리 페이지 이동"
						})]
					})
				]
			})
		]
	});
};
//#endregion
//#region src/components/admin/modals/UserDetailModal.tsx
var UserDetailModal = ({ user, onClose, callerRole, onSuspend, onUnsuspend, onMute, onUnmute, onWarn, onChangeRole, onDeleteUser }) => {
	if (!user) return null;
	const [warnMessage, setWarnMessage] = (0, import_react.useState)("");
	const [suspendReason, setSuspendReason] = (0, import_react.useState)("");
	const [selectedRole, setSelectedRole] = (0, import_react.useState)(user.role);
	const [activeTab, setActiveTab] = (0, import_react.useState)("info");
	const isSuperAdmin = callerRole === "superadmin";
	const isOwnerAccount = user.email === "byunghyunlim92@gmail.com" || user.id === "lr018vf8CcW5fAv707vsl77qJy53" || user.role === "superadmin";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden scale-in-95 transition-all",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: user.avatar,
							alt: user.name,
							className: "w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-base text-slate-900 dark:text-white",
									children: user.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-[10px] font-bold px-1.5 py-0.5 rounded ${user.role === "superadmin" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : user.role === "admin" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : user.role === "moderator" ? "bg-purple-500/10 text-purple-500 border border-purple-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`,
									children: user.role.toUpperCase()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-[10px] font-bold px-1.5 py-0.5 rounded ${user.status === "suspended" ? "bg-rose-500 text-white" : "bg-emerald-500/10 text-emerald-500"}`,
									children: user.status === "suspended" ? "정지됨" : "정상"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400 mt-0.5 font-mono",
							children: user.email
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex border-b border-slate-100 dark:border-slate-800 px-5 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setActiveTab("info"),
						className: `pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${activeTab === "info" ? "border-rose-500 text-rose-500" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}`,
						children: "기본 정보 & 활동 통계"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setActiveTab("actions"),
						className: `pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${activeTab === "actions" ? "border-rose-500 text-rose-500" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}`,
						children: "제재 및 권한 변경"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-5 max-h-[60vh] overflow-y-auto space-y-4 text-xs",
					children: activeTab === "info" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-400 block font-medium",
										children: "작성 게시글"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5 block",
										children: [user.postCount || 0, "개"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-400 block font-medium",
										children: "작성 댓글"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5 block",
										children: [user.commentCount || 0, "개"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-rose-500 block font-bold",
										children: "신고 받은 횟수"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-base font-bold font-mono text-rose-500 mt-0.5 block",
										children: [user.reportedCount || 0, "회"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-400 block font-medium",
										children: "신고 접수한 횟수"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5 block",
										children: [user.reportSubmitCount || 0, "회"]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400",
										children: "UID:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-slate-700 dark:text-slate-300 select-all",
										children: user.id
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400",
										children: "가입 일자:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-700 dark:text-slate-300",
										children: formatKSTDate(user.joinedDate)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400",
										children: "최근 접속:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-700 dark:text-slate-300",
										children: user.lastLoginAt ? formatKSTDateTime(user.lastLoginAt) : "기록 없음"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400",
										children: "채팅 제한 여부:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: user.chatRestricted ? "text-rose-500 font-bold" : "text-emerald-500",
										children: user.chatRestricted ? `제한됨 (${user.chatMutedUntil ? formatKSTDateTime(user.chatMutedUntil) : "상세 사유 확인"})` : "정상 발언 가능"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center py-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400",
										children: "계정 상태:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: user.status === "suspended" ? "text-rose-500 font-bold" : "text-slate-700 dark:text-slate-300",
										children: user.status === "suspended" ? `이용 정지 (${user.suspendedReason || "규정 위반"})` : "정상 이용"
									})]
								})
							]
						}),
						user.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-slate-400 block font-semibold mb-1",
								children: "소개글:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-slate-700 dark:text-slate-300 leading-relaxed",
								children: user.bio
							})]
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-slate-800 dark:text-slate-200",
											children: "역할 및 권한 (Role) 변경"
										}), !isSuperAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-rose-500 font-semibold",
											children: "* 최고 관리자(superadmin) 전용"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											disabled: !isSuperAdmin || isOwnerAccount,
											value: selectedRole,
											onChange: (e) => setSelectedRole(e.target.value),
											className: "flex-1 px-3 py-2 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-700 rounded-lg text-xs disabled:opacity-50",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "user",
													children: "일반 사용자 (user)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "moderator",
													children: "운영진 (moderator)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "admin",
													children: "일반 관리자 (admin)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "superadmin",
													children: "최고 관리자 (superadmin)"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											disabled: !isSuperAdmin || isOwnerAccount || selectedRole === user.role,
											onClick: () => onChangeRole(user.id, selectedRole),
											className: "px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs disabled:opacity-40 transition-colors",
											children: "권한 적용"
										})]
									}),
									isOwnerAccount && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-slate-400",
										children: "* 시스템 최초 소유자 계정의 최고 관리자 권한은 고정되어 있습니다."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-slate-800 dark:text-slate-200 block",
									children: "채팅 발언 제한 (Mute)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-2",
									children: user.chatRestricted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => onUnmute(user.id),
										className: "flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "채팅 제한 해제" })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										disabled: isOwnerAccount,
										onClick: () => onMute(user.id, "24시간 발언 제한"),
										className: "flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-xs transition-colors disabled:opacity-30",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "채팅 24시간 제한" })]
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-slate-800 dark:text-slate-200 block",
									children: "사용자 경고 알림 전송"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: warnMessage,
										onChange: (e) => setWarnMessage(e.target.value),
										placeholder: "경고 사유 입력 (예: 부적절한 언어 사용 주의)",
										className: "flex-1 px-3 py-2 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										disabled: !warnMessage.trim(),
										onClick: () => {
											onWarn(user.id, warnMessage.trim());
											setWarnMessage("");
										},
										className: "px-3 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white rounded-lg font-bold text-xs disabled:opacity-40 transition-colors flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "발송" })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 bg-rose-50/50 dark:bg-rose-950/10 rounded-xl border border-rose-200 dark:border-rose-900/40 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-rose-600 dark:text-rose-400 block",
									children: "계정 정지 조치"
								}), user.status === "suspended" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => onUnsuspend(user.id),
									className: "flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "정지 해제 및 계정 정상화" })]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: suspendReason,
										onChange: (e) => setSuspendReason(e.target.value),
										placeholder: "정지 사유 (예: 불법 리딩방 광고 3회 적발)",
										className: "w-full px-3 py-2 bg-white dark:bg-[#131722] border border-rose-200 dark:border-rose-900/60 rounded-lg text-xs"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										disabled: !suspendReason.trim(),
										onClick: () => onSuspend(user.id, suspendReason.trim()),
										className: "flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs disabled:opacity-40 transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "회원 이용 정지 실행" })]
									})]
								})]
							}),
							isSuperAdmin && !isOwnerAccount && onDeleteUser && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 bg-rose-50/70 dark:bg-rose-950/20 rounded-xl border border-rose-300 dark:border-rose-900/60 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-rose-700 dark:text-rose-400 block",
										children: "계정 및 데이터 영구 삭제"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-slate-500 dark:text-slate-400",
										children: "회원의 인증 및 Firestore 프로필 문서를 영구 삭제합니다. 삭제 후 복구할 수 없습니다."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											if (window.confirm(`정말로 '${user.name}' 회원의 계정과 모든 데이터를 영구 삭제하시겠습니까?`)) {
												onDeleteUser(user.id);
												onClose();
											}
										},
										className: "flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "회원 영구 삭제 실행" })]
									})
								]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "px-4 py-2 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors",
						children: "닫기"
					})
				})
			]
		})
	});
};
//#endregion
//#region src/components/admin/modals/ConfirmActionModal.tsx
var ConfirmActionModal = ({ isOpen, onClose, onConfirm, title, description, confirmLabel = "확인", cancelLabel = "취소", isDestructive = true }) => {
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden scale-in-95 transition-all",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `p-2 rounded-xl ${isDestructive ? "bg-rose-500/10 text-rose-500" : "bg-blue-500/10 text-blue-500"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-base text-slate-900 dark:text-white",
							children: title
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed",
					children: description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-end gap-2.5 p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "px-4 py-2 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors",
						children: cancelLabel
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							onConfirm();
							onClose();
						},
						className: `px-4 py-2 text-xs font-bold rounded-xl text-white transition-all shadow-xs ${isDestructive ? "bg-rose-600 hover:bg-rose-500 shadow-rose-600/20" : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20"}`,
						children: confirmLabel
					})]
				})
			]
		})
	});
};
//#endregion
//#region src/components/admin/tabs/AdminUsersTab.tsx
var AdminUsersTab = ({ users, callerRole, onSuspend, onUnsuspend, onMute, onUnmute, onWarn, onChangeRole, onDeleteUser }) => {
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [filterType, setFilterType] = (0, import_react.useState)("ALL");
	const [selectedUser, setSelectedUser] = (0, import_react.useState)(null);
	const [isPurging, setIsPurging] = (0, import_react.useState)(false);
	const [purgeResult, setPurgeResult] = (0, import_react.useState)(null);
	const [memberStatuses, setMemberStatuses] = (0, import_react.useState)({});
	const [isVerifying, setIsVerifying] = (0, import_react.useState)(false);
	const [actionLoadingUid, setActionLoadingUid] = (0, import_react.useState)(null);
	import_react.useEffect(() => {
		if (selectedUser) {
			const fresh = users.find((u) => u.id === selectedUser.id);
			if (fresh) setSelectedUser(fresh);
		}
	}, [users]);
	const executeWithLock = async (uid, actionFn) => {
		if (actionLoadingUid) return;
		setActionLoadingUid(uid);
		try {
			await actionFn();
		} finally {
			setActionLoadingUid(null);
		}
	};
	const [confirmModal, setConfirmModal] = (0, import_react.useState)({
		isOpen: false,
		title: "",
		description: "",
		onConfirm: () => {},
		isDestructive: true
	});
	const filteredUsers = users.filter((u) => {
		const q = searchTerm.trim().toLowerCase();
		if (!(!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q))) return false;
		if (filterType === "active") return u.status !== "suspended" && u.status !== "deleted";
		if (filterType === "suspended") return u.status === "suspended";
		if (filterType === "muted") return Boolean(u.chatRestricted);
		if (filterType === "admin") return u.role === "admin" || u.role === "superadmin";
		if (filterType === "moderator") return u.role === "moderator";
		return true;
	});
	const isSuperAdmin = callerRole === "superadmin";
	const verifyMembers = async () => {
		setIsVerifying(true);
		try {
			const data = await safeFetchJson("/api/admin/members/verify");
			const statuses = {};
			data.forEach((m) => statuses[m.uid] = m);
			setMemberStatuses(statuses);
		} catch (err) {
			console.error("Verification failed", err);
		} finally {
			setIsVerifying(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 animate-in fade-in duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white",
					children: "회원 및 권한 관리"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5",
					children: "등록된 전체 사용자를 검색하고 상태 변경, 채팅 제한, 권한(Role) 조정을 수행합니다."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: verifyMembers,
							disabled: isVerifying,
							className: "flex items-center justify-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-4 h-4 ${isVerifying ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isVerifying ? "검증 중..." : "전체 회원 검증" })]
						}),
						isSuperAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setConfirmModal({
									isOpen: true,
									title: "비운영자 테스트 데이터 전체 영구 정리",
									description: `최고 운영자(byunghyunlim92@gmail.com, UID: lr018vf8CcW5fAv707vsl77qJy53) 계정을 철저히 보존하고, 그 외 테스트 계정과 Firestore 컬렉션을 정리합니다. 백업이 검증되지 않거나 최고 관리자 인증이 실패하면 자동 중단됩니다. 계속하시겠습니까?`,
									isDestructive: true,
									onConfirm: async () => {
										setIsPurging(true);
										setPurgeResult(null);
										try {
											const data = await safeFetchJson("/api/admin/cleanup-non-admins", {
												method: "POST",
												headers: {
													"Content-Type": "application/json",
													"x-user-email": "byunghyunlim92@gmail.com",
													"x-user-uid": "lr018vf8CcW5fAv707vsl77qJy53",
													"x-admin-role": "superadmin"
												}
											});
											setPurgeResult({
												success: true,
												message: `초기화 완료: Firestore ${data.deletedDocsCount}건 삭제, 최고 운영자 계정 완전 보존됨. (인증/스토리지 영구 정리는 Admin SDK 환경 필요)`,
												data
											});
										} catch (err) {
											setPurgeResult({
												success: false,
												message: `요청 실패: ${err.message}`
											});
										} finally {
											setIsPurging(false);
										}
									}
								});
							},
							disabled: isPurging,
							className: "flex items-center justify-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isPurging ? "초기화 검증 진행 중..." : "비운영자 데이터 정리" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full sm:w-72",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: searchTerm,
								onChange: (e) => setSearchTerm(e.target.value),
								placeholder: "닉네임, 이메일, UID 검색...",
								className: "w-full pl-9 pr-4 py-2 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
							})]
						})
					]
				})]
			}),
			purgeResult && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `p-4 rounded-2xl border text-xs leading-relaxed flex items-start justify-between gap-3 ${purgeResult.success ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300" : "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-bold mb-1 flex items-center gap-1.5",
					children: [purgeResult.success ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: purgeResult.success ? "초기화 성공" : "초기화 실행 실패" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: purgeResult.message })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setPurgeResult(null),
					className: "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold",
					children: "닫기"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold",
				children: [
					{
						id: "ALL",
						label: `전체 (${users.length})`
					},
					{
						id: "active",
						label: `정상 (${users.filter((u) => u.status !== "suspended").length})`
					},
					{
						id: "suspended",
						label: `이용 정지 (${users.filter((u) => u.status === "suspended").length})`
					},
					{
						id: "muted",
						label: `채팅 제한 (${users.filter((u) => u.chatRestricted).length})`
					},
					{
						id: "admin",
						label: `관리자 (${users.filter((u) => u.role === "admin" || u.role === "superadmin").length})`
					},
					{
						id: "moderator",
						label: `운영진 (${users.filter((u) => u.role === "moderator").length})`
					}
				].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setFilterType(tab.id),
					className: `px-3 py-1.5 rounded-xl shrink-0 transition-colors ${filterType === tab.id ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-xs" : "bg-white dark:bg-[#131722] text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"}`,
					children: tab.label
				}, tab.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden md:block bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold bg-slate-50/50 dark:bg-slate-800/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "회원 정보"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "이메일 / UID"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "인증/프로필 검증"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "가입일 / 최근접속"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4 text-center",
								children: "권한 (Role)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4 text-center",
								children: "상태"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4 text-right",
								children: "관리 조치"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-slate-100 dark:divide-slate-800/60",
						children: filteredUsers.map((u) => {
							const status = memberStatuses[u.id];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer",
								onClick: () => setSelectedUser(u),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: u.avatar,
												alt: u.name,
												className: "w-8 h-8 rounded-full object-cover shrink-0"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: u.name }), u.email === "byunghyunlim92@gmail.com" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-amber-500 font-bold",
													children: "★소유자"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-slate-400",
												children: u.tier
											})] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: u.email }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-slate-400 truncate max-w-[140px]",
											children: u.id
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 text-slate-500 font-bold text-[10px]",
										children: status ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col gap-1 items-start",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `px-2 py-0.5 rounded text-[10px] font-bold ${status.status === "정상" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : status.status === "프로필 누락" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"}`,
													children: status.status
												}),
												status.status === "프로필 누락" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: async (e) => {
														e.stopPropagation();
														try {
															if ((await fetch("/api/admin/members/repair-profile", {
																method: "POST",
																headers: { "Content-Type": "application/json" },
																body: JSON.stringify({ uid: u.id })
															})).ok) await verifyMembers();
														} catch {}
													},
													className: "text-[9px] text-indigo-500 hover:underline",
													children: "프로필 복원"
												}),
												status.status === "인증 계정 없음" && isSuperAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: (e) => {
														e.stopPropagation();
														setConfirmModal({
															isOpen: true,
															title: "고아 프로필 정리",
															description: `'${u.name}' 회원은 Firebase Authentication에 계정이 존재하지 않는 고아 프로필입니다. 해당 프로필을 정리하시겠습니까?`,
															isDestructive: true,
															onConfirm: async () => {
																try {
																	await fetch("/api/admin/members/delete-orphan", {
																		method: "POST",
																		headers: {
																			"Content-Type": "application/json",
																			"x-admin-role": "superadmin"
																		},
																		body: JSON.stringify({
																			uid: u.id,
																			deleteReferences: false
																		})
																	});
																	await verifyMembers();
																} catch {}
															}
														});
													},
													className: "text-[9px] text-rose-500 hover:underline",
													children: "고아 정리"
												})
											]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-400",
											children: "검증 필요"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3.5 px-4 text-slate-500",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: formatKSTDate(u.joinedDate) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-slate-400 font-mono",
											children: u.lastLoginAt ? formatKSTDateTime(u.lastLoginAt) : "-"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `px-2 py-0.5 rounded-md text-[10px] font-bold ${u.role === "superadmin" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : u.role === "admin" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : u.role === "moderator" ? "bg-purple-500/10 text-purple-500 border border-purple-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`,
											children: u.role.toUpperCase()
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${u.status === "suspended" ? "bg-rose-500 text-white" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"}`,
												children: u.status === "suspended" ? "이용정지" : "정상"
											}), u.chatRestricted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-0.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "w-2.5 h-2.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "채팅제한" })]
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 text-right",
										onClick: (e) => e.stopPropagation(),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-end gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setSelectedUser(u),
												className: "p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors",
												title: "상세보기",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3.5 h-3.5" })
											}), actionLoadingUid === u.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "p-1.5 flex items-center justify-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5 animate-spin text-indigo-500" })
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
												u.chatRestricted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													disabled: Boolean(actionLoadingUid),
													onClick: () => {
														setConfirmModal({
															isOpen: true,
															title: "채팅 제한 해제",
															description: `'${u.name}' 회원의 채팅 발언 제한을 즉시 해제하시겠습니까?`,
															isDestructive: false,
															onConfirm: () => executeWithLock(u.id, async () => {
																await onUnmute(u.id);
															})
														});
													},
													className: "p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors cursor-pointer disabled:opacity-30",
													title: "채팅 제한 해제",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-3.5 h-3.5" })
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													disabled: Boolean(actionLoadingUid) || u.role === "superadmin" || u.id === "lr018vf8CcW5fAv707vsl77qJy53",
													onClick: () => {
														setConfirmModal({
															isOpen: true,
															title: "채팅 24시간 제한",
															description: `'${u.name}' 회원의 채팅 발언을 24시간 동안 제한하시겠습니까?`,
															isDestructive: true,
															onConfirm: () => executeWithLock(u.id, async () => {
																await onMute(u.id, "24시간 발언 제한");
															})
														});
													},
													className: "p-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors cursor-pointer disabled:opacity-20",
													title: "채팅 제한",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "w-3.5 h-3.5" })
												}),
												u.status === "suspended" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													disabled: Boolean(actionLoadingUid),
													onClick: () => {
														setConfirmModal({
															isOpen: true,
															title: "회원 정지 해제",
															description: `'${u.name}' 회원의 이용 정지를 해제하고 정상 상태로 복원하시겠습니까?`,
															isDestructive: false,
															onConfirm: () => executeWithLock(u.id, async () => {
																await onUnsuspend(u.id);
															})
														});
													},
													className: "p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors cursor-pointer disabled:opacity-30",
													title: "정지 해제",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-3.5 h-3.5" })
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													disabled: Boolean(actionLoadingUid) || u.role === "superadmin" || u.id === "lr018vf8CcW5fAv707vsl77qJy53",
													onClick: () => {
														setConfirmModal({
															isOpen: true,
															title: "회원 이용 정지",
															description: `정말로 '${u.name}' 회원을 정지하시겠습니까? 로그인 및 커뮤니티 작성이 차단됩니다.`,
															isDestructive: true,
															onConfirm: () => executeWithLock(u.id, async () => {
																await onSuspend(u.id, "관리자 일괄 조치");
															})
														});
													},
													className: "p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors cursor-pointer disabled:opacity-20",
													title: "회원 정지",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "w-3.5 h-3.5" })
												}),
												isSuperAdmin && u.role !== "superadmin" && onDeleteUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													disabled: Boolean(actionLoadingUid),
													onClick: () => {
														setConfirmModal({
															isOpen: true,
															title: "회원 영구 삭제",
															description: `정말로 '${u.name}' 회원의 계정과 모든 데이터를 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
															isDestructive: true,
															onConfirm: () => executeWithLock(u.id, async () => {
																await onDeleteUser(u.id);
															})
														});
													},
													className: "p-1.5 rounded-lg bg-red-600/10 text-red-600 hover:bg-red-600/20 transition-colors cursor-pointer disabled:opacity-30",
													title: "회원 삭제",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
												})
											] })]
										})
									})
								]
							}, u.id);
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "md:hidden space-y-3",
				children: filteredUsers.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: () => setSelectedUser(u),
					className: "p-4 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3 cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: u.avatar,
								alt: u.name,
								className: "w-9 h-9 rounded-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold text-sm text-slate-900 dark:text-white",
								children: u.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-slate-400 font-mono truncate max-w-[180px]",
								children: u.email
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-[10px] font-bold px-2 py-0.5 rounded ${u.status === "suspended" ? "bg-rose-500 text-white" : "bg-emerald-500/10 text-emerald-500"}`,
							children: u.status === "suspended" ? "정지됨" : "정상"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-slate-400",
							children: ["권한: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: u.role })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-slate-400 font-mono",
							children: [
								"글 ",
								u.postCount || 0,
								" / 댓 ",
								u.commentCount || 0
							]
						})]
					})]
				}, u.id))
			}),
			selectedUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserDetailModal, {
				user: selectedUser,
				callerRole,
				onClose: () => setSelectedUser(null),
				onSuspend: (uid, reason) => {
					onSuspend(uid, reason);
					setSelectedUser(null);
				},
				onUnsuspend: (uid) => {
					onUnsuspend(uid);
					setSelectedUser(null);
				},
				onMute: (uid, dur) => {
					onMute(uid, dur);
					setSelectedUser(null);
				},
				onUnmute: (uid) => {
					onUnmute(uid);
					setSelectedUser(null);
				},
				onWarn: (uid, msg) => {
					onWarn(uid, msg);
					setSelectedUser(null);
				},
				onChangeRole: (uid, newRole) => {
					onChangeRole(uid, newRole);
					setSelectedUser(null);
				},
				onDeleteUser: onDeleteUser ? (uid) => {
					onDeleteUser(uid);
					setSelectedUser(null);
				} : void 0
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmActionModal, {
				isOpen: confirmModal.isOpen,
				onClose: () => setConfirmModal((prev) => ({
					...prev,
					isOpen: false
				})),
				onConfirm: confirmModal.onConfirm,
				title: confirmModal.title,
				description: confirmModal.description,
				isDestructive: confirmModal.isDestructive
			})
		]
	});
};
//#endregion
//#region src/components/admin/tabs/AdminPostsTab.tsx
var AdminPostsTab = ({ posts, callerRole, onUpdateStatus, onToggleNotice }) => {
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("ALL");
	const [sortField, setSortField] = (0, import_react.useState)("latest");
	const [selectedPost, setSelectedPost] = (0, import_react.useState)(null);
	const [confirmModal, setConfirmModal] = (0, import_react.useState)({
		isOpen: false,
		title: "",
		description: "",
		onConfirm: () => {}
	});
	const sortedPosts = [...posts.filter((p) => {
		const q = searchTerm.trim().toLowerCase();
		if (!(!q || p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q) || p.author.name.toLowerCase().includes(q) || p.symbolName?.toLowerCase().includes(q) || p.symbol?.includes(q))) return false;
		if (statusFilter === "published") return (p.status || "published") === "published";
		if (statusFilter === "hidden") return p.status === "hidden";
		if (statusFilter === "deleted") return p.status === "deleted";
		if (statusFilter === "notice") return Boolean(p.isNotice || p.category === "notice");
		return true;
	})].sort((a, b) => {
		if (sortField === "views") return b.views - a.views;
		if (sortField === "comments") return (b.commentsCount || 0) - (a.commentsCount || 0);
		if (sortField === "likes") return b.likes - a.likes;
		return (b.id || "").localeCompare(a.id || "");
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 animate-in fade-in duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white",
					children: "게시글 및 공지 관리"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5",
					children: "등록된 게시글을 모니터링하고 숨김, 복원, 영구 삭제, 상단 공지글 지정을 수행합니다."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full md:w-80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: searchTerm,
						onChange: (e) => setSearchTerm(e.target.value),
						placeholder: "제목, 내용, 작성자, 종목 검색...",
						className: "w-full pl-9 pr-4 py-2 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold",
					children: [
						{
							id: "ALL",
							label: `전체 (${posts.length})`
						},
						{
							id: "published",
							label: `정상 게시 (${posts.filter((p) => (p.status || "published") === "published").length})`
						},
						{
							id: "hidden",
							label: `숨김 처리 (${posts.filter((p) => p.status === "hidden").length})`
						},
						{
							id: "deleted",
							label: `삭제 (${posts.filter((p) => p.status === "deleted").length})`
						},
						{
							id: "notice",
							label: `공지글 (${posts.filter((p) => p.isNotice || p.category === "notice").length})`
						}
					].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setStatusFilter(tab.id),
						className: `px-3 py-1.5 rounded-xl shrink-0 transition-colors ${statusFilter === tab.id ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-xs" : "bg-white dark:bg-[#131722] text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"}`,
						children: tab.label
					}, tab.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 text-xs self-end sm:self-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "w-3.5 h-3.5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: sortField,
						onChange: (e) => setSortField(e.target.value),
						className: "px-2.5 py-1.5 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "latest",
								children: "최신순"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "views",
								children: "조회수순"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "comments",
								children: "댓글수순"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "likes",
								children: "좋아요순"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden md:block bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold bg-slate-50/50 dark:bg-slate-800/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "게시판 / 상태"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "제목 및 본문 요약"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "작성자"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4 text-center",
								children: "반응 (조회/댓글/좋아요)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "작성일"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4 text-right",
								children: "관리 조치"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-slate-100 dark:divide-slate-800/60",
						children: sortedPosts.map((p) => {
							const currentStatus = p.status || "published";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 whitespace-nowrap",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col gap-1 items-start",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `px-2 py-0.5 rounded text-[10px] font-bold ${p.isNotice || p.category === "notice" ? "bg-purple-500/10 text-purple-500 border border-purple-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`,
												children: p.isNotice ? "📌 공지" : p.category
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-[10px] font-semibold ${currentStatus === "published" ? "text-emerald-500" : currentStatus === "hidden" ? "text-amber-500 font-bold" : "text-rose-500 font-bold"}`,
												children: currentStatus === "published" ? "정상 게시" : currentStatus === "hidden" ? "숨김" : "삭제됨"
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3.5 px-4 max-w-md",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-bold text-slate-900 dark:text-white truncate",
												children: p.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[11px] text-slate-400 line-clamp-1 mt-0.5",
												children: p.content
											}),
											p.symbolName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-block mt-1 text-[10px] text-rose-500 font-semibold bg-rose-50 dark:bg-rose-500/10 px-1.5 py-0.2 rounded",
												children: [
													"#",
													p.symbolName,
													" (",
													p.symbol,
													")"
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 whitespace-nowrap",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: p.author.avatar,
												alt: p.author.name,
												className: "w-5 h-5 rounded-full object-cover"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-slate-800 dark:text-slate-200",
												children: p.author.name
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 text-center font-mono text-slate-500 whitespace-nowrap",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											p.views,
											" / ",
											p.commentsCount || p.comments?.length || 0,
											" / ",
											p.likes
										] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 text-slate-400 whitespace-nowrap font-mono",
										children: formatKSTDateTime(p.createdAt)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 text-right whitespace-nowrap",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-end gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => onToggleNotice(p.id, !p.isNotice),
													className: `p-1.5 rounded-lg transition-colors ${p.isNotice ? "bg-purple-500/10 text-purple-500" : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-purple-500"}`,
													title: p.isNotice ? "공지 해제" : "상단 공지 지정",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "w-3.5 h-3.5" })
												}),
												currentStatus === "hidden" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => onUpdateStatus(p.id, "published"),
													className: "p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors",
													title: "숨김 해제 (복원)",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3.5 h-3.5" })
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => onUpdateStatus(p.id, "hidden"),
													className: "p-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors",
													title: "게시글 숨김",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-3.5 h-3.5" })
												}),
												currentStatus === "deleted" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => onUpdateStatus(p.id, "published"),
													className: "p-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors",
													title: "게시글 복구",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" })
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => {
														setConfirmModal({
															isOpen: true,
															title: "게시글 삭제",
															description: `'${p.title}' 게시글을 삭제하시겠습니까? (삭제 상태로 보관되며 필요 시 복구할 수 있습니다.)`,
															onConfirm: () => onUpdateStatus(p.id, "deleted")
														});
													},
													className: "p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors",
													title: "게시글 삭제",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
												})
											]
										})
									})
								]
							}, p.id);
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "md:hidden space-y-3",
				children: sortedPosts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-[10px] font-bold px-2 py-0.5 rounded ${p.isNotice ? "bg-purple-500/10 text-purple-500" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`,
								children: p.isNotice ? "📌 공지" : p.category
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-slate-400 font-mono",
								children: formatKSTDateTime(p.createdAt)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-bold text-sm text-slate-900 dark:text-white leading-snug",
							children: p.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 line-clamp-2",
							children: p.content
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-500 font-semibold",
								children: p.author.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => onUpdateStatus(p.id, p.status === "hidden" ? "published" : "hidden"),
									className: "px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 font-semibold text-[11px]",
									children: p.status === "hidden" ? "숨김해제" : "숨김"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => onUpdateStatus(p.id, p.status === "deleted" ? "published" : "deleted"),
									className: "px-2 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-lg font-bold text-[11px]",
									children: p.status === "deleted" ? "복구" : "삭제"
								})]
							})]
						})
					]
				}, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmActionModal, {
				isOpen: confirmModal.isOpen,
				onClose: () => setConfirmModal((prev) => ({
					...prev,
					isOpen: false
				})),
				onConfirm: confirmModal.onConfirm,
				title: confirmModal.title,
				description: confirmModal.description,
				isDestructive: true
			})
		]
	});
};
//#endregion
//#region src/components/admin/tabs/AdminCommentsTab.tsx
var AdminCommentsTab = ({ comments, callerRole, onUpdateStatus }) => {
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("ALL");
	const [confirmModal, setConfirmModal] = (0, import_react.useState)({
		isOpen: false,
		title: "",
		description: "",
		onConfirm: () => {}
	});
	const filteredComments = comments.filter((c) => {
		const q = searchTerm.trim().toLowerCase();
		if (!(!q || c.comment.content.toLowerCase().includes(q) || c.comment.author.name.toLowerCase().includes(q) || c.postTitle.toLowerCase().includes(q))) return false;
		const currentStatus = c.comment.status || "published";
		if (statusFilter === "published") return currentStatus === "published";
		if (statusFilter === "hidden") return currentStatus === "hidden";
		if (statusFilter === "deleted") return currentStatus === "deleted";
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 animate-in fade-in duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white",
					children: "댓글 및 답변 관리"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5",
					children: "커뮤니티 전체 게시글에 등록된 댓글을 모니터링하고 악성 댓글을 숨김 또는 삭제 처리합니다."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full md:w-80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: searchTerm,
						onChange: (e) => setSearchTerm(e.target.value),
						placeholder: "댓글 내용, 작성자, 원본 게시글 검색...",
						className: "w-full pl-9 pr-4 py-2 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold",
				children: [
					{
						id: "ALL",
						label: `전체 댓글 (${comments.length})`
					},
					{
						id: "published",
						label: `정상 댓글 (${comments.filter((c) => (c.comment.status || "published") === "published").length})`
					},
					{
						id: "hidden",
						label: `숨김 처리 (${comments.filter((c) => c.comment.status === "hidden").length})`
					},
					{
						id: "deleted",
						label: `삭제됨 (${comments.filter((c) => c.comment.status === "deleted").length})`
					}
				].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setStatusFilter(tab.id),
					className: `px-3 py-1.5 rounded-xl shrink-0 transition-colors ${statusFilter === tab.id ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-xs" : "bg-white dark:bg-[#131722] text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"}`,
					children: tab.label
				}, tab.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden md:block bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold bg-slate-50/50 dark:bg-slate-800/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "작성자"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "댓글 내용"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "대상 게시글"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "작성일"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4 text-center",
								children: "상태"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4 text-right",
								children: "관리 조치"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-slate-100 dark:divide-slate-800/60",
						children: filteredComments.map(({ comment, postTitle, postId }) => {
							const currentStatus = comment.status || "published";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 whitespace-nowrap",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: comment.author.avatar,
												alt: comment.author.name,
												className: "w-6 h-6 rounded-full object-cover"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-bold text-slate-900 dark:text-white",
												children: comment.author.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-slate-400",
												children: comment.author.badge
											})] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 max-w-sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-slate-800 dark:text-slate-200 font-medium line-clamp-2",
											children: comment.content
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 max-w-[200px] text-slate-500",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate block font-semibold hover:text-rose-500 cursor-pointer",
											children: postTitle
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 text-slate-400 font-mono whitespace-nowrap",
										children: formatKSTDateTime(comment.createdAt)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 text-center whitespace-nowrap",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${currentStatus === "published" ? "bg-emerald-500/10 text-emerald-500" : currentStatus === "hidden" ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"}`,
											children: currentStatus === "published" ? "정상" : currentStatus === "hidden" ? "숨김" : "삭제"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 text-right whitespace-nowrap",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-end gap-1.5",
											children: [currentStatus === "hidden" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => onUpdateStatus(comment.id, postId, "published"),
												className: "p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
												title: "숨김 해제",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3.5 h-3.5" })
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => onUpdateStatus(comment.id, postId, "hidden"),
												className: "p-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
												title: "댓글 숨김",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-3.5 h-3.5" })
											}), currentStatus === "deleted" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => onUpdateStatus(comment.id, postId, "published"),
												className: "p-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
												title: "댓글 복구",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" })
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => {
													setConfirmModal({
														isOpen: true,
														title: "댓글 삭제",
														description: `'${comment.author.name}' 님의 댓글을 삭제하시겠습니까?`,
														onConfirm: () => onUpdateStatus(comment.id, postId, "deleted")
													});
												},
												className: "p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20",
												title: "댓글 삭제",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
											})]
										})
									})
								]
							}, `${postId}-${comment.id}`);
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "md:hidden space-y-3",
				children: filteredComments.map(({ comment, postTitle, postId }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-slate-800 dark:text-slate-200",
								children: comment.author.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-slate-400 font-mono",
								children: formatKSTDateTime(comment.createdAt)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-700 dark:text-slate-300 leading-relaxed",
							children: comment.content
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] text-slate-400 truncate",
							children: ["게시글: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: postTitle })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => onUpdateStatus(comment.id, postId, comment.status === "hidden" ? "published" : "hidden"),
								className: "px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 font-semibold text-[11px]",
								children: comment.status === "hidden" ? "숨김해제" : "숨김"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => onUpdateStatus(comment.id, postId, comment.status === "deleted" ? "published" : "deleted"),
								className: "px-2 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-lg font-bold text-[11px]",
								children: comment.status === "deleted" ? "복구" : "삭제"
							})]
						})
					]
				}, `${postId}-${comment.id}`))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmActionModal, {
				isOpen: confirmModal.isOpen,
				onClose: () => setConfirmModal((prev) => ({
					...prev,
					isOpen: false
				})),
				onConfirm: confirmModal.onConfirm,
				title: confirmModal.title,
				description: confirmModal.description
			})
		]
	});
};
//#endregion
//#region src/components/admin/modals/ReportDetailModal.tsx
var ReportDetailModal = ({ report, onClose, onResolve, onDismiss, onHideContent, onDeleteContent, onMuteUser, onSuspendUser }) => {
	if (!report) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden scale-in-95 transition-all",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-2 rounded-xl bg-amber-500/10 text-amber-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-base text-slate-900 dark:text-white",
							children: "신고 상세 내역"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-slate-400 font-mono",
							children: ["ID: ", report.id]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 max-h-[60vh] overflow-y-auto space-y-4 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-slate-400 block font-medium",
									children: "신고 대상 유형"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-bold uppercase text-slate-800 dark:text-slate-200 mt-0.5 block",
									children: report.type === "post" ? "게시글 (Post)" : report.type === "comment" ? "댓글 (Comment)" : report.type === "chat" ? "실시간 채팅 (Chat)" : "사용자 프로필 (User)"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-slate-400 block font-medium",
									children: "신고 사유"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-bold text-rose-500 mt-0.5 block",
									children: report.reason
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400",
										children: "신고자:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-slate-700 dark:text-slate-300",
										children: report.reportedBy
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400",
										children: "피신고자 (작성자):"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-rose-500",
										children: report.targetAuthorName || "미상/익명"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center py-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400",
										children: "접수 일시:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-600 dark:text-slate-400 font-mono",
										children: formatKSTDateTime(report.createdAt)
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-slate-800 dark:text-slate-200",
								children: "신고 대상 원문 / 본문"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold mb-1 text-slate-900 dark:text-white",
									children: report.targetTitle
								}), report.targetContent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-slate-600 dark:text-slate-400 mt-1",
									children: report.targetContent
								})]
							})]
						}),
						report.status !== "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-xl space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-blue-600 dark:text-blue-400 block",
									children: "처리 기록"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-slate-700 dark:text-slate-300",
									children: ["상태: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: report.status === "resolved" ? "처리완료" : "기각" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-slate-500",
									children: [
										"처리 담당자: ",
										report.handlerName,
										" (",
										report.handledAt,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-slate-600 dark:text-slate-400",
									children: ["조치 내용: ", report.actionTaken]
								})
							]
						}),
						report.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 bg-rose-50/50 dark:bg-rose-950/10 rounded-xl border border-rose-200 dark:border-rose-900/40 space-y-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-slate-800 dark:text-slate-200 block",
								children: "관리자 즉시 제재 조치"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											onHideContent?.(report.type, report.targetId);
											onResolve(report.id, "대상 콘텐츠 숨김 처리");
											onClose();
										},
										className: "flex items-center justify-center gap-1.5 p-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-lg font-bold transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "콘텐츠 숨김" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											onDeleteContent?.(report.type, report.targetId);
											onResolve(report.id, "대상 콘텐츠 즉시 삭제");
											onClose();
										},
										className: "flex items-center justify-center gap-1.5 p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "콘텐츠 삭제" })]
									}),
									report.targetAuthorId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											onMuteUser?.(report.targetAuthorId);
											onResolve(report.id, "작성자 채팅 24시간 제한");
											onClose();
										},
										className: "flex items-center justify-center gap-1.5 p-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "작성자 채팅 제한" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											onSuspendUser?.(report.targetAuthorId, `신고 누적 조치: ${report.reason}`);
											onResolve(report.id, "작성자 회원 정지");
											onClose();
										},
										className: "flex items-center justify-center gap-1.5 p-2 bg-rose-700 hover:bg-rose-600 text-white rounded-lg font-bold transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "작성자 계정 정지" })]
									})] })
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: report.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							onDismiss(report.id);
							onClose();
						},
						className: "px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition-colors",
						children: "신고 기각 (무효)"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onClose,
							className: "px-4 py-2 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition-colors",
							children: "닫기"
						}), report.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								onResolve(report.id, "신고 검토 후 경고 처리 완료");
								onClose();
							},
							className: "px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors",
							children: "처리 완료"
						})]
					})]
				})
			]
		})
	});
};
//#endregion
//#region src/components/admin/tabs/AdminReportsTab.tsx
var AdminReportsTab = ({ reports, callerRole, onResolve, onDismiss, onHideContent, onDeleteContent, onMuteUser, onSuspendUser }) => {
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("ALL");
	const [targetFilter, setTargetFilter] = (0, import_react.useState)("ALL");
	const [selectedReport, setSelectedReport] = (0, import_react.useState)(null);
	const filteredReports = reports.filter((r) => {
		const q = searchTerm.trim().toLowerCase();
		if (!(!q || r.targetTitle.toLowerCase().includes(q) || r.reportedBy.toLowerCase().includes(q) || r.targetAuthorName && r.targetAuthorName.toLowerCase().includes(q) || r.reason.toLowerCase().includes(q))) return false;
		if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
		if (targetFilter !== "ALL" && r.type !== targetFilter) return false;
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 animate-in fade-in duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-6 h-6 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "신고 접수 및 제재 관리" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5",
					children: "욕설, 불법 리딩방 광고, 허위 시세조종 등 커뮤니티 및 채팅에서 접수된 신고를 검토하고 제재합니다."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full md:w-80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: searchTerm,
						onChange: (e) => setSearchTerm(e.target.value),
						placeholder: "제목, 신고자, 피신고자, 사유 검색...",
						className: "w-full pl-9 pr-4 py-2 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold",
					children: [
						{
							id: "ALL",
							label: `전체 (${reports.length})`
						},
						{
							id: "pending",
							label: `접수/대기 (${reports.filter((r) => r.status === "pending").length})`
						},
						{
							id: "investigating",
							label: `검토중 (${reports.filter((r) => r.status === "investigating").length})`
						},
						{
							id: "resolved",
							label: `처리완료 (${reports.filter((r) => r.status === "resolved").length})`
						},
						{
							id: "dismissed",
							label: `기각 (${reports.filter((r) => r.status === "dismissed").length})`
						}
					].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setStatusFilter(tab.id),
						className: `px-3 py-1.5 rounded-xl shrink-0 transition-colors ${statusFilter === tab.id ? "bg-rose-600 text-white font-bold shadow-xs" : "bg-white dark:bg-[#131722] text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"}`,
						children: tab.label
					}, tab.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-slate-400",
						children: "대상:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: targetFilter,
						onChange: (e) => setTargetFilter(e.target.value),
						className: "px-2.5 py-1.5 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "ALL",
								children: "전체 대상"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "post",
								children: "게시글"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "comment",
								children: "댓글"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "chat",
								children: "실시간 채팅"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "user",
								children: "사용자"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden md:block bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold bg-slate-50/50 dark:bg-slate-800/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "대상 유형"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "신고 대상 제목 / 내용"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "신고 사유"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "신고자 / 피신고자"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "접수 일시"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4 text-center",
								children: "처리 상태"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4 text-right",
								children: "조치"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-slate-100 dark:divide-slate-800/60",
						children: filteredReports.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							onClick: () => setSelectedReport(r),
							className: "hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3.5 px-4 whitespace-nowrap",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
										children: r.type
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-3.5 px-4 max-w-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-slate-900 dark:text-white line-clamp-1",
										children: r.targetTitle
									}), r.targetContent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-slate-400 line-clamp-1 mt-0.5",
										children: r.targetContent
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3.5 px-4 whitespace-nowrap",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20",
										children: r.reason
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-3.5 px-4 whitespace-nowrap text-slate-500",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["신고자: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: r.reportedBy })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-rose-500",
										children: ["피신고: ", r.targetAuthorName || "미상"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3.5 px-4 text-slate-400 font-mono whitespace-nowrap",
									children: formatKSTDateTime(r.createdAt)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3.5 px-4 text-center whitespace-nowrap",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${r.status === "pending" ? "bg-amber-500 text-white" : r.status === "investigating" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" : r.status === "resolved" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`,
										children: r.status === "pending" ? "접수(대기)" : r.status === "investigating" ? "검토중" : r.status === "resolved" ? "조치완료" : "기각"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3.5 px-4 text-right whitespace-nowrap",
									onClick: (e) => e.stopPropagation(),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-end gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setSelectedReport(r),
											className: "px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-[11px] transition-colors",
											children: "상세조치"
										}), r.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => onResolve(r.id, "신고 검토 후 경고 처리"),
											className: "px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors",
											children: "승인"
										})]
									})
								})
							]
						}, r.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "md:hidden space-y-3",
				children: filteredReports.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: () => setSelectedReport(r),
					className: "p-4 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-2.5 cursor-pointer",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500",
								children: r.reason
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `px-2 py-0.5 rounded text-[10px] font-bold ${r.status === "pending" ? "bg-amber-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`,
								children: r.status === "pending" ? "접수대기" : r.status === "resolved" ? "처리완료" : "기각"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-bold text-sm text-slate-900 dark:text-white leading-snug",
							children: r.targetTitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["신고자: ", r.reportedBy] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px]",
								children: formatKSTDateTime(r.createdAt)
							})]
						})
					]
				}, r.id))
			}),
			selectedReport && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportDetailModal, {
				report: selectedReport,
				onClose: () => setSelectedReport(null),
				onResolve: (id, action) => {
					onResolve(id, action);
					setSelectedReport(null);
				},
				onDismiss: (id) => {
					onDismiss(id);
					setSelectedReport(null);
				},
				onHideContent,
				onDeleteContent,
				onMuteUser,
				onSuspendUser
			})
		]
	});
};
//#endregion
//#region src/components/admin/tabs/AdminChatTab.tsx
var AdminChatTab = ({ chatMessages, callerRole, onDeleteMessage, onMuteUser, onClearRoomChat, onDeleteChatRoom }) => {
	const rooms = [
		{
			id: "all",
			name: "전체 광장",
			icon: "🌐"
		},
		{
			id: "domestic",
			name: "국내주식",
			icon: "🇰🇷"
		},
		{
			id: "kospi",
			name: "코스피",
			icon: "📈"
		},
		{
			id: "kosdaq",
			name: "코스닥",
			icon: "⚡"
		},
		{
			id: "surge",
			name: "급등주",
			icon: "🔥"
		},
		{
			id: "watchlist",
			name: "관심종목",
			icon: "⭐"
		}
	];
	const [activeRoomId, setActiveRoomId] = (0, import_react.useState)("all");
	const [spamFilterOnly, setSpamFilterOnly] = (0, import_react.useState)(false);
	const [confirmModal, setConfirmModal] = (0, import_react.useState)({
		isOpen: false,
		title: "",
		description: "",
		onConfirm: () => {}
	});
	const roomMessages = chatMessages.filter((m) => (m.roomId || "all") === activeRoomId);
	const isSuspicious = (text) => {
		return text.includes("100%") || text.includes("수익 보장") || text.includes("텔레그램") || text.includes("카톡방") || text.includes("원금보장") || text.includes("리딩") || text.includes("ㅋㅋㅋ") && text.length > 50;
	};
	const displayedMessages = spamFilterOnly ? roomMessages.filter((m) => isSuspicious(m.message)) : roomMessages;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 animate-in fade-in duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessagesSquare, { className: "w-6 h-6 text-purple-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "실시간 채팅 감시 및 제재" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5",
					children: "6개 채팅방의 실시간 대화를 감시하고 불법 리딩방 유도, 도배, 비방 메시지를 즉시 차단합니다."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-xs font-bold self-start sm:self-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "실시간 WebSocket 스트림 연결됨" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold",
					children: rooms.map((room) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveRoomId(room.id),
						className: `px-3 py-1.5 rounded-xl shrink-0 transition-colors flex items-center gap-1.5 ${activeRoomId === room.id ? "bg-purple-600 text-white font-bold shadow-xs" : "bg-white dark:bg-[#131722] text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: room.icon }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: room.name })]
					}, room.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 flex-wrap",
					children: [
						onClearRoomChat && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								const roomName = rooms.find((r) => r.id === activeRoomId)?.name || activeRoomId;
								setConfirmModal({
									isOpen: true,
									title: "채팅 전체 삭제",
									description: `'${roomName}' 채팅방의 모든 메시지를 완전히 삭제하시겠습니까? 데이터베이스에서 일괄 삭제 처리되어 복구할 수 없습니다.`,
									onConfirm: () => onClearRoomChat(activeRoomId)
								});
							},
							className: "px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20",
							title: "현재 채팅방 메시지 전체 삭제",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "채팅 전체 삭제" })]
						}),
						onDeleteChatRoom && activeRoomId !== "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								const roomName = rooms.find((r) => r.id === activeRoomId)?.name || activeRoomId;
								setConfirmModal({
									isOpen: true,
									title: "채팅방 삭제",
									description: `'${roomName}' 채팅방과 해당 방의 모든 대화 내용을 영구 삭제하시겠습니까?`,
									onConfirm: () => onDeleteChatRoom(activeRoomId)
								});
							},
							className: "px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-600 hover:text-white border border-slate-200 dark:border-slate-700",
							title: "채팅방 영구 삭제",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "채팅방 삭제" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSpamFilterOnly(!spamFilterOnly),
							className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border ${spamFilterOnly ? "bg-amber-500 text-white border-amber-600" : "bg-white dark:bg-[#131722] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "이상 징후 필터링" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"선택된 방: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: rooms.find((r) => r.id === activeRoomId)?.name }),
						" (메시지 ",
						displayedMessages.length,
						"개)"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[11px]",
						children: "최근 50개 메시지 버퍼"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[550px] overflow-y-auto",
					children: displayedMessages.length > 0 ? displayedMessages.map((msg) => {
						const suspicious = isSuspicious(msg.message);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `p-4 flex items-start justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${suspicious ? "bg-amber-500/5 dark:bg-amber-500/10" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3 flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: msg.author.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80",
									alt: msg.author.name,
									className: "w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 flex-wrap",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-slate-900 dark:text-white",
												children: msg.author.name
											}),
											msg.author.role && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 font-mono",
												children: msg.author.role
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-slate-400 font-mono",
												children: formatKSTDateTime(msg.timestamp)
											}),
											suspicious && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500 text-white flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "도배/스팸 의심" })]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-slate-800 dark:text-slate-200 leading-relaxed font-sans break-words text-xs sm:text-sm",
										children: msg.message
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										setConfirmModal({
											isOpen: true,
											title: "사용자 채팅 24시간 제한",
											description: `'${msg.author.name}' 회원의 채팅 발언 권한을 24시간 동안 정지하시겠습니까?`,
											onConfirm: () => onMuteUser(msg.author.id, "부적절 채팅으로 인한 24시간 묵음")
										});
									},
									className: "p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors",
									title: "작성자 채팅 제한",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "w-3.5 h-3.5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										setConfirmModal({
											isOpen: true,
											title: "메시지 즉시 삭제",
											description: "해당 메시지를 채팅창에서 즉시 삭제하시겠습니까? 일반 사용자 화면에서 보이지 않게 됩니다.",
											onConfirm: () => onDeleteMessage(msg.id, activeRoomId)
										});
									},
									className: "p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors",
									title: "메시지 삭제",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
								})]
							})]
						}, msg.id);
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-12 text-center text-xs text-slate-400",
						children: "현재 방에 표시할 채팅 메시지가 없습니다."
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmActionModal, {
				isOpen: confirmModal.isOpen,
				onClose: () => setConfirmModal((prev) => ({
					...prev,
					isOpen: false
				})),
				onConfirm: confirmModal.onConfirm,
				title: confirmModal.title,
				description: confirmModal.description
			})
		]
	});
};
//#endregion
//#region src/components/admin/modals/NoticeEditorModal.tsx
var NoticeEditorModal = ({ isOpen, onClose, onSave, editingNotice }) => {
	if (!isOpen) return null;
	const [title, setTitle] = (0, import_react.useState)(editingNotice?.title || "");
	const [content, setContent] = (0, import_react.useState)(editingNotice?.content || "");
	const [category, setCategory] = (0, import_react.useState)(editingNotice?.category || "service");
	const [isPinned, setIsPinned] = (0, import_react.useState)(editingNotice?.isPinned || false);
	const [author, setAuthor] = (0, import_react.useState)(editingNotice?.author || "총괄운영팀");
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!title.trim() || !content.trim()) return;
		onSave({
			title: title.trim(),
			content: content.trim(),
			category,
			isPinned,
			author: author.trim() || "총괄운영팀"
		});
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden scale-in-95 transition-all",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2 rounded-xl bg-purple-500/10 text-purple-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-base text-slate-900 dark:text-white",
						children: editingNotice ? "공지사항 수정" : "새 운영 공지사항 작성"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "p-5 space-y-4 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "font-semibold text-slate-700 dark:text-slate-300 block mb-1",
							children: "카테고리"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: category,
							onChange: (e) => setCategory(e.target.value),
							className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "service",
									children: "서비스 안내"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "system",
									children: "시스템 공지"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "maintenance",
									children: "서버 점검"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "event",
									children: "이벤트"
								})
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "font-semibold text-slate-700 dark:text-slate-300 block mb-1",
							children: "작성자 명의"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: author,
							onChange: (e) => setAuthor(e.target.value),
							className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium",
							placeholder: "예: 총괄운영팀"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "font-semibold text-slate-700 dark:text-slate-300 block mb-1",
						children: "공지 제목"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						required: true,
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "공지사항 제목을 입력하세요.",
						className: "w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "font-semibold text-slate-700 dark:text-slate-300 block mb-1",
						children: "공지 본문 내용"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						required: true,
						rows: 6,
						value: content,
						onChange: (e) => setContent(e.target.value),
						placeholder: "회원들에게 안내할 공지 내용을 상세하게 작성하세요.",
						className: "w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium resize-none leading-relaxed"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							id: "pinCheck",
							checked: isPinned,
							onChange: (e) => setIsPinned(e.target.checked),
							className: "rounded accent-purple-600 w-4 h-4 cursor-pointer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							htmlFor: "pinCheck",
							className: "font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "게시판 최상단에 고정 (Pinned Notice)" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "px-4 py-2 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition-colors",
							children: "취소"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "px-5 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors shadow-xs",
							children: editingNotice ? "수정 완료" : "공지 게시"
						})]
					})
				]
			})]
		})
	});
};
//#endregion
//#region src/components/admin/tabs/AdminNoticesTab.tsx
var AdminNoticesTab = ({ notices, callerRole, onCreateNotice, onUpdateNotice, onDeleteNotice, onTogglePin }) => {
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [isEditorOpen, setIsEditorOpen] = (0, import_react.useState)(false);
	const [editingNotice, setEditingNotice] = (0, import_react.useState)(null);
	const [confirmModal, setConfirmModal] = (0, import_react.useState)({
		isOpen: false,
		title: "",
		description: "",
		onConfirm: () => {}
	});
	const filteredNotices = notices.filter((n) => {
		const q = searchTerm.trim().toLowerCase();
		return !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.author.toLowerCase().includes(q);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 animate-in fade-in duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "w-6 h-6 text-purple-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "운영 공지사항 관리" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5",
					children: "전체 사용자에게 공지할 운영 정책, 점검 계획, 신규 기능 안내글을 작성 및 상단 고정합니다."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setEditingNotice(null);
						setIsEditorOpen(true);
					},
					className: "flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs self-start sm:self-auto cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "새 공지사항 작성" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					value: searchTerm,
					onChange: (e) => setSearchTerm(e.target.value),
					placeholder: "공지사항 제목, 내용 검색...",
					className: "w-full pl-9 pr-4 py-2 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: filteredNotices.map((notice) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `p-5 rounded-2xl bg-white dark:bg-[#131722] border transition-all shadow-xs ${notice.isPinned ? "border-purple-300 dark:border-purple-900/60 bg-purple-50/20 dark:bg-purple-950/10" : "border-slate-200 dark:border-slate-800"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3 mb-2 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									notice.isPinned && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500 text-white flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "상단 고정" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
										children: notice.category
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-slate-800 dark:text-slate-200",
										children: notice.author
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-slate-400 font-mono",
										children: ["· ", formatKSTDate(notice.createdAt)]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => onTogglePin(notice.id),
										className: `p-1.5 rounded-lg transition-colors ${notice.isPinned ? "text-purple-600 bg-purple-100 dark:bg-purple-950/40" : "text-slate-400 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800"}`,
										title: notice.isPinned ? "고정 해제" : "상단 고정",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "w-4 h-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											setEditingNotice(notice);
											setIsEditorOpen(true);
										},
										className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
										title: "수정",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "w-4 h-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											setConfirmModal({
												isOpen: true,
												title: "공지사항 삭제",
												description: `'${notice.title}' 공지글을 삭제하시겠습니까?`,
												onConfirm: () => onDeleteNotice(notice.id)
											});
										},
										className: "p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors",
										title: "삭제",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-bold text-slate-900 dark:text-white leading-snug",
							children: notice.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 whitespace-pre-wrap leading-relaxed line-clamp-3",
							children: notice.content
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-[11px] text-slate-400 font-mono mt-4 pt-3 border-t border-slate-100 dark:border-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"조회수 ",
									notice.viewCount,
									"회"
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "커뮤니티 공지게시판 동기화됨" })]
						})
					]
				}, notice.id))
			}),
			isEditorOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoticeEditorModal, {
				isOpen: isEditorOpen,
				onClose: () => setIsEditorOpen(false),
				onSave: (noticeData) => {
					if (editingNotice) onUpdateNotice(editingNotice.id, noticeData);
					else onCreateNotice(noticeData);
				},
				editingNotice
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmActionModal, {
				isOpen: confirmModal.isOpen,
				onClose: () => setConfirmModal((prev) => ({
					...prev,
					isOpen: false
				})),
				onConfirm: confirmModal.onConfirm,
				title: confirmModal.title,
				description: confirmModal.description
			})
		]
	});
};
//#endregion
//#region src/components/admin/tabs/AdminFiltersTab.tsx
var AdminFiltersTab = ({ bannedWords, callerRole, onAddWord, onDeleteWord, onToggleWord }) => {
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [newWord, setNewWord] = (0, import_react.useState)("");
	const [newSeverity, setNewSeverity] = (0, import_react.useState)("block");
	const [newCategory, setNewCategory] = (0, import_react.useState)("불법 유사투자");
	const [newAction, setNewAction] = (0, import_react.useState)("block");
	const [isAdding, setIsAdding] = (0, import_react.useState)(false);
	const [confirmModal, setConfirmModal] = (0, import_react.useState)({
		isOpen: false,
		title: "",
		description: "",
		onConfirm: () => {}
	});
	const handleCreate = (e) => {
		e.preventDefault();
		if (!newWord.trim()) return;
		onAddWord(newWord.trim(), newSeverity, newCategory, newAction);
		setNewWord("");
		setIsAdding(false);
	};
	const filteredWords = bannedWords.filter((w) => {
		const q = searchTerm.trim().toLowerCase();
		return !q || w.word.toLowerCase().includes(q) || w.category?.toLowerCase().includes(q);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 animate-in fade-in duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-6 h-6 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "금칙어 및 콘텐츠 필터링 사전" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5",
					children: "사설 리딩방, 시세조종 유도, 욕설 단어를 관리하고 작성 차단 또는 관리자 검토 대상으로 분류합니다."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setIsAdding(!isAdding),
					className: "flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs self-start sm:self-auto cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "새 금칙어 추가" })]
				})]
			}),
			isAdding && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleCreate,
				className: "p-5 bg-white dark:bg-[#131722] border border-amber-200 dark:border-amber-900/60 rounded-2xl shadow-sm space-y-4 text-xs animate-in slide-in-from-top-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-4 h-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "새 필터링 금칙어 등록" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-4 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-semibold text-slate-700 dark:text-slate-300 block mb-1",
								children: "금칙어 단어/문구"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								value: newWord,
								onChange: (e) => setNewWord(e.target.value),
								placeholder: "예: 100% 수익 보장",
								className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-semibold text-slate-700 dark:text-slate-300 block mb-1",
								children: "카테고리"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: newCategory,
								onChange: (e) => setNewCategory(e.target.value),
								placeholder: "예: 불법 리딩방",
								className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-semibold text-slate-700 dark:text-slate-300 block mb-1",
								children: "감지 시 조치 정책"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: newAction,
								onChange: (e) => setNewAction(e.target.value),
								className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-medium",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "block",
										children: "작성 즉시 차단 (Block)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "review",
										children: "관리자 검토 대상 (Review)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "replace",
										children: "별표 자동 마스킹 (Replace)"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-semibold text-slate-700 dark:text-slate-300 block mb-1",
								children: "제재 강도"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: newSeverity,
								onChange: (e) => setNewSeverity(e.target.value),
								className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-medium",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "block",
										children: "차단 (Block)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "mute",
										children: "채팅 묵음 (Mute)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "warning",
										children: "단순 경고 (Warning)"
									})
								]
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setIsAdding(false),
							className: "px-4 py-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl font-semibold",
							children: "취소"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold",
							children: "등록"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					value: searchTerm,
					onChange: (e) => setSearchTerm(e.target.value),
					placeholder: "금칙어, 분류 검색...",
					className: "w-full pl-9 pr-4 py-2 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold bg-slate-50/50 dark:bg-slate-800/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "금칙어 문구"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "분류 / 등록자"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4 text-center",
								children: "조치 정책"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4 text-center",
								children: "제재 강도"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4 text-center",
								children: "누적 적발 수"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4 text-center",
								children: "활성 상태"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4 text-right",
								children: "삭제"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-slate-100 dark:divide-slate-800/60",
						children: filteredWords.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-3.5 px-4 font-bold text-slate-900 dark:text-white",
									children: [
										"\"",
										w.word,
										"\""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-3.5 px-4 text-slate-500",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: w.category }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-slate-400 font-mono",
										children: [
											w.createdBy,
											" · ",
											formatKSTDate(w.createdAt)
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3.5 px-4 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `px-2 py-0.5 rounded text-[10px] font-bold ${w.action === "block" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : w.action === "review" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`,
										children: w.action === "block" ? "즉시 차단" : w.action === "review" ? "검토 대상" : "마스킹"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3.5 px-4 text-center uppercase font-mono text-[10px] font-bold text-slate-500",
									children: w.severity
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-3.5 px-4 text-center font-mono text-slate-700 dark:text-slate-300 font-bold",
									children: [w.hitCount || 0, "회"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3.5 px-4 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => onToggleWord(w.id, !w.enabled),
										className: `px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${w.enabled ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-slate-200 dark:bg-slate-700 text-slate-400"}`,
										children: w.enabled ? "ON (적용)" : "OFF (해제)"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3.5 px-4 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											setConfirmModal({
												isOpen: true,
												title: "금칙어 삭제",
												description: `'${w.word}' 금칙어를 삭제하시겠습니까?`,
												onConfirm: () => onDeleteWord(w.id)
											});
										},
										className: "p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20",
										title: "삭제",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
									})
								})
							]
						}, w.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmActionModal, {
				isOpen: confirmModal.isOpen,
				onClose: () => setConfirmModal((prev) => ({
					...prev,
					isOpen: false
				})),
				onConfirm: confirmModal.onConfirm,
				title: confirmModal.title,
				description: confirmModal.description
			})
		]
	});
};
//#endregion
//#region src/components/admin/tabs/AdminAlertsTab.tsx
var AdminAlertsTab = ({ notifications, callerRole, onSendNotification }) => {
	const [targetType, setTargetType] = (0, import_react.useState)("all");
	const [targetId, setTargetId] = (0, import_react.useState)("");
	const [targetName, setTargetName] = (0, import_react.useState)("");
	const [title, setTitle] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [priority, setPriority] = (0, import_react.useState)("normal");
	const handleSend = (e) => {
		e.preventDefault();
		if (!title.trim() || !message.trim()) return;
		onSendNotification({
			targetType,
			targetId: targetId.trim() || void 0,
			targetName: targetName.trim() || void 0,
			title: title.trim(),
			message: message.trim(),
			priority,
			createdBy: callerRole === "superadmin" ? "최고관리자" : "운영관리자"
		});
		setTitle("");
		setMessage("");
		setTargetId("");
		setTargetName("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-6 h-6 text-sky-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "시스템 알림 및 전체 공지 발송" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5",
				children: "전체 회원 또는 특정 대상 사용자/종목에 대해 시스템 안내, 시장 변동 긴급 공지를 푸시 발송합니다."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSend,
				className: "p-5 sm:p-6 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-4 h-4 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "신규 시스템 알림 작성 및 전송" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-semibold text-slate-700 dark:text-slate-300 block mb-1",
								children: "발송 대상 선택"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: targetType,
								onChange: (e) => setTargetType(e.target.value),
								className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-medium",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "all",
										children: "전체 사용자 (Broadcast)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "user",
										children: "특정 사용자 (Target UID)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "stock",
										children: "특정 종목 보유/관심자"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "market",
										children: "시장 이벤트 (서킷/사이드카)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "system",
										children: "긴급 시스템 점검"
									})
								]
							})] }),
							targetType === "user" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-semibold text-slate-700 dark:text-slate-300 block mb-1",
								children: "대상 사용자 UID"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								value: targetId,
								onChange: (e) => setTargetId(e.target.value),
								placeholder: "예: u-user-2",
								className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl"
							})] }),
							targetType === "stock" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-semibold text-slate-700 dark:text-slate-300 block mb-1",
								children: "종목 코드"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								value: targetId,
								onChange: (e) => setTargetId(e.target.value),
								placeholder: "예: 005930 (삼성전자)",
								className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-semibold text-slate-700 dark:text-slate-300 block mb-1",
								children: "중요도 / 우선순위"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: priority,
								onChange: (e) => setPriority(e.target.value),
								className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-medium",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "normal",
										children: "보통 (일반 알림)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "high",
										children: "높음 (중요 공지)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "urgent",
										children: "긴급 (즉시 팝업/최우선)"
									})
								]
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "font-semibold text-slate-700 dark:text-slate-300 block mb-1",
						children: "알림 제목"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						required: true,
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "알림 제목을 간결하고 명확하게 입력하세요.",
						className: "w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "font-semibold text-slate-700 dark:text-slate-300 block mb-1",
						children: "알림 메시지 본문"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						required: true,
						rows: 3,
						value: message,
						onChange: (e) => setMessage(e.target.value),
						placeholder: "사용자에게 전달될 알림의 상세 내용을 입력하세요.",
						className: "w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium resize-none leading-relaxed"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							className: "flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs transition-colors shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "알림 발송 실행" })]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-4 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 font-bold text-xs text-slate-800 dark:text-slate-200",
					children: "알림 발송 이력 및 전송 결과"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold bg-slate-50/30 dark:bg-slate-800/20",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "대상"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "알림 제목 / 내용"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4 text-center",
								children: "우선순위"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4 text-center",
								children: "수신자 수"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "발송자 / 일시"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4 text-center",
								children: "상태"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-slate-100 dark:divide-slate-800/60",
						children: notifications.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3.5 px-4 whitespace-nowrap",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
										children: n.targetType
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-3.5 px-4 max-w-md",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-slate-900 dark:text-white line-clamp-1",
										children: n.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-slate-400 line-clamp-1 mt-0.5",
										children: n.message
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3.5 px-4 text-center whitespace-nowrap",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `px-2 py-0.5 rounded text-[10px] font-bold ${n.priority === "urgent" ? "bg-rose-500 text-white" : n.priority === "high" ? "bg-amber-500/10 text-amber-500" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`,
										children: n.priority.toUpperCase()
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-3.5 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap",
									children: [(n.sentCount || 1).toLocaleString(), "명"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-3.5 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: n.createdBy }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: formatKSTDateTime(n.createdAt) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3.5 px-4 text-center whitespace-nowrap",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
										children: "전송완료"
									})
								})
							]
						}, n.id))
					})]
				})]
			})
		]
	});
};
//#endregion
//#region src/components/admin/tabs/AdminMarketTab.tsx
var AdminMarketTab = ({ callerRole }) => {
	const [marketStatus, setMarketStatus] = (0, import_react.useState)({
		lastDataFetch: (/* @__PURE__ */ new Date()).toLocaleTimeString("ko-KR"),
		apiStatus: "NORMAL",
		apiProvider: "Kiwoom Open API (KRX-Feed)",
		apiResponseTimeMs: 38,
		apiErrorCount: 0,
		dataPipelineMode: "REAL",
		activeMonitoredStocks: 25,
		surgeDetector: "ONLINE",
		volumeSpikeDetector: "ONLINE",
		marketEventEngine: "ONLINE",
		maskedApiKey: "••••••••••••••••"
	});
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const [isModalOpen, setIsModalOpen] = (0, import_react.useState)(false);
	const [resilienceData, setResilienceData] = (0, import_react.useState)(null);
	const fetchStatus = () => {
		setIsRefreshing(true);
		adminService.getMarketStatus().then((res) => {
			setMarketStatus(res);
		}).catch(() => {});
		fetch("/api/admin/resilience/status", { headers: {
			"x-user-role": callerRole,
			"x-admin-role": callerRole
		} }).then((r) => r.ok ? r.json() : null).then((data) => {
			if (data) setResilienceData(data);
		}).catch(() => {}).finally(() => setIsRefreshing(false));
	};
	(0, import_react.useEffect)(() => {
		fetchStatus();
		const interval = setInterval(fetchStatus, 8e3);
		return () => clearInterval(interval);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-6 h-6 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "시장 데이터 및 감지 엔진 상태" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5",
					children: "실시간 주식 시세 데이터 파이프라인의 수신 주기, 응답 속도, 급등락/거래량 감지기 상태를 모니터링합니다."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 self-start sm:self-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setIsModalOpen(true),
						className: "flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-600/20 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "키움 API 실전 키 설정" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: fetchStatus,
						disabled: isRefreshing,
						className: "flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "새로고침" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-slate-400 font-medium",
								children: "실시간 API 연결 상태"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 text-2xl font-black text-emerald-500 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 h-3 rounded-full bg-emerald-500 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: marketStatus.apiStatus })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-slate-400 mt-1",
								children: ["제공처: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: marketStatus.apiProvider })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-slate-400 font-medium",
								children: "평균 API 왕복 응답속도"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 text-2xl font-black font-mono text-slate-900 dark:text-white",
								children: [marketStatus.apiResponseTimeMs, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-normal text-slate-400 ml-1",
									children: "ms"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-emerald-500 mt-1 font-semibold",
								children: "최적 응답 대역 (Latency < 80ms)"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-slate-400 font-medium",
								children: "데이터 파이프라인 모드"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-2xl font-black font-mono text-indigo-500",
								children: marketStatus.dataPipelineMode
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-slate-400 mt-1",
								children: ["마지막 수신: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: marketStatus.lastDataFetch })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-slate-400 font-medium",
								children: "실시간 감시 종목 수"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 text-2xl font-black font-mono text-slate-900 dark:text-white",
								children: [marketStatus.activeMonitoredStocks, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-normal text-slate-400 ml-1",
									children: "종목"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-slate-400 mt-1",
								children: "코스피 대형주 및 코스닥 주도주"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-bold text-base text-slate-900 dark:text-white flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-5 h-5 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "3대 이상 징후 자동 감지 엔진 상태" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "w-4 h-4 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "급등/급락 감지기" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500",
									children: marketStatus.surgeDetector
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 leading-relaxed",
								children: "당일 주가 변동률 ±5% 이상 돌파 시 즉시 마켓 알림 생성 및 감시"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-4 h-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "거래량 급증 감지기" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500",
									children: marketStatus.volumeSpikeDetector
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 leading-relaxed",
								children: "20일 평균 거래량 대비 200% 이상 폭증 시 수급 집중 종목으로 자동 분류"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctagonAlert, { className: "w-4 h-4 text-purple-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "시장 이벤트 엔진" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500",
									children: marketStatus.marketEventEngine
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 leading-relaxed",
								children: "코스피·코스닥 사이드카(Sidecar), 서킷브레이커, KRX 중요 공시 자동 감지"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-bold text-base text-slate-900 dark:text-white flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "w-5 h-5 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "핵심 연동 상태 및 최근 장애 복구 진단 (/ready 검증)" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-mono text-slate-400",
							children: resilienceData?.dependencies?.firebase?.checkedAt ? `검증 시각: ${resilienceData.dependencies.firebase.checkedAt}` : "실시간 진단"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs font-bold mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-800 dark:text-slate-200",
										children: "Firebase Firestore"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `px-2 py-0.5 rounded text-[10px] ${resilienceData?.dependencies?.firebase?.status === "CONNECTED" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`,
										children: resilienceData?.dependencies?.firebase?.status || "PROBING..."
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-slate-400",
									children: resilienceData?.dependencies?.firebase?.message || "연결 상태 점검 중"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs font-bold mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-800 dark:text-slate-200",
										children: "키움 Open API 게이트웨이"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `px-2 py-0.5 rounded text-[10px] ${resilienceData?.dependencies?.kiwoom?.status === "CONNECTED" || resilienceData?.dependencies?.kiwoom?.status === "CONFIGURED" ? "bg-indigo-500/10 text-indigo-500" : "bg-amber-500/10 text-amber-500"}`,
										children: resilienceData?.dependencies?.kiwoom?.status || "UNCONFIGURED"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-slate-400",
									children: resilienceData?.dependencies?.kiwoom?.message || "키 설정 대기"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs font-bold mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-800 dark:text-slate-200",
										children: "시세 수신 파이프라인"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-500 font-bold",
										children: resilienceData?.dependencies?.marketDataPipeline?.status || "ONLINE"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-slate-400",
									children: ["최종 정상 갱신: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: resilienceData?.dependencies?.marketDataPipeline?.lastSuccessAt || marketStatus.lastDataFetch })]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "최근 서버 오류 및 API 장애 요약 (민감정보 마스킹 완료)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-slate-400 font-mono",
								children: [
									"총 ",
									resilienceData?.recentErrors?.length || 0,
									"건 기록됨"
								]
							})]
						}), resilienceData?.recentErrors && resilienceData.recentErrors.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2 px-3",
											children: "발생 시각"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2 px-3",
											children: "유형"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2 px-3",
											children: "상태코드"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2 px-3",
											children: "내용 (안전 정제됨)"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]",
									children: resilienceData.recentErrors.slice(0, 5).map((err) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-slate-50/50 dark:hover:bg-slate-800/30",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2 px-3 text-slate-400 whitespace-nowrap",
												children: err.timestamp.split("T")[1].split(".")[0]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2 px-3 font-bold text-rose-500",
												children: err.type
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2 px-3 text-slate-500",
												children: err.statusCode || "-"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2 px-3 font-sans text-slate-700 dark:text-slate-300 truncate max-w-md",
												children: err.message
											})
										]
									}, err.id))
								})]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center text-xs text-emerald-600 dark:text-emerald-400 font-semibold",
							children: "현재 감지된 비정상 오류 및 API 타임아웃 장애가 없습니다. (전체 파이프라인 정상 가동 중)"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "보안 정책 준수: 외부 증시 API Key 및 시크릿 토큰은 서버측 환경변수로 안전하게 보관되며 클라이언트 화면에 절대 노출되지 않습니다." })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-slate-400 font-bold",
					children: marketStatus.maskedApiKey
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KiwoomConfigModal, {
				isOpen: isModalOpen,
				onClose: () => setIsModalOpen(false),
				onSuccess: fetchStatus
			})
		]
	});
};
//#endregion
//#region src/components/admin/tabs/AdminLogsTab.tsx
var AdminLogsTab = ({ logs, callerRole, onRefreshLogs }) => {
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [actionFilter, setActionFilter] = (0, import_react.useState)("ALL");
	const filteredLogs = logs.filter((l) => {
		const q = searchTerm.trim().toLowerCase();
		if (!(!q || l.action.toLowerCase().includes(q) || l.adminName.toLowerCase().includes(q) || l.targetType.toLowerCase().includes(q) || l.details && l.details.toLowerCase().includes(q) || l.targetTitle && l.targetTitle.toLowerCase().includes(q))) return false;
		if (actionFilter !== "ALL" && l.action !== actionFilter) return false;
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 animate-in fade-in duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-6 h-6 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "관리자 감사 로그 (Audit Logs)" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5",
					children: "운영진과 관리자가 수행한 모든 제재, 삭제, 권한 변경, 설정 조작 내역이 위변조 불가능한 감사 로그로 영구 기록됩니다."
				})] }), onRefreshLogs && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onRefreshLogs,
					className: "flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors self-start sm:self-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "로그 갱신" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full sm:w-80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: searchTerm,
						onChange: (e) => setSearchTerm(e.target.value),
						placeholder: "작업, 관리자, 사유, 대상 검색...",
						className: "w-full pl-9 pr-4 py-2 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-slate-400",
						children: "작업 유형:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: actionFilter,
						onChange: (e) => setActionFilter(e.target.value),
						className: "px-2.5 py-1.5 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "ALL",
								children: "전체 작업"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "SUSPEND_USER",
								children: "회원 정지"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "UNSUSPEND_USER",
								children: "정지 해제"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "CHANGE_USER_ROLE",
								children: "권한 변경"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "MUTE_CHAT_USER",
								children: "채팅 제한"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "UNMUTE_CHAT_USER",
								children: "채팅 제한 해제"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "WARN_USER",
								children: "회원 경고"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "DELETE_POST",
								children: "게시글 삭제"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "HIDE_POST",
								children: "게시글 숨김"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "RESTORE_POST",
								children: "게시글 복구"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "DELETE_COMMENT",
								children: "댓글 삭제"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "RESOLVE_REPORT",
								children: "신고 처리"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "DISMISS_REPORT",
								children: "신고 기각"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "CREATE_NOTICE",
								children: "공지 작성"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "UPDATE_SYSTEM_SETTING",
								children: "시스템 설정 변경"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold bg-slate-50/50 dark:bg-slate-800/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "일시"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "수행 관리자"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "작업 (Action)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "대상 (Target)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "상세 조치 내용"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4 text-center",
								children: "불변성 검증"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-slate-100 dark:divide-slate-800/60 font-sans",
						children: filteredLogs.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]",
									children: formatKSTDateTime(l.createdAt)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 px-4 whitespace-nowrap",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-slate-900 dark:text-white",
											children: l.adminName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono",
											children: l.adminRole
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 px-4 whitespace-nowrap",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `px-2 py-0.5 rounded text-[10px] font-bold font-mono ${l.action.includes("DELETE") || l.action.includes("SUSPEND") ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : l.action.includes("WARN") || l.action.includes("MUTE") ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"}`,
										children: l.action
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-3 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold",
										children: l.targetTitle || l.targetId
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-slate-400 uppercase font-mono",
										children: l.targetType
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 px-4 max-w-sm text-slate-700 dark:text-slate-300",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "line-clamp-2 leading-relaxed",
										children: l.details || "-"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 px-4 text-center whitespace-nowrap",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-2.5 h-2.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "VERIFIED" })]
									})
								})
							]
						}, l.id))
					})]
				})
			})
		]
	});
};
//#endregion
//#region src/components/admin/tabs/AdminSettingsTab.tsx
var AdminSettingsTab = ({ settings, callerRole, onUpdateSetting }) => {
	const isSuperAdmin = callerRole === "superadmin";
	const [formState, setFormState] = (0, import_react.useState)(() => {
		const initial = {};
		settings.forEach((s) => {
			initial[s.key] = s.value;
		});
		return initial;
	});
	const handleChange = (key, val) => {
		setFormState((prev) => ({
			...prev,
			[key]: val
		}));
	};
	const handleSave = (key) => {
		onUpdateSetting(key, formState[key]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in duration-150",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "w-6 h-6 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "시스템 및 커뮤니티 전역 설정" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5",
				children: "서비스 점검 모드, 회원가입 정책, 채팅 도배 제한, AI 일일 쿼터 등 핵심 설정을 구성합니다."
			})] }), !isSuperAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-3.5 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "최고 관리자(Superadmin) 전용 수정 권한" })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 md:grid-cols-2 gap-4",
			children: settings.map((setting) => {
				const currentVal = formState[setting.key] !== void 0 ? formState[setting.key] : setting.value;
				const isDirty = formState[setting.key] !== void 0 && formState[setting.key] !== setting.value;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3 flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-sm text-slate-900 dark:text-white",
								children: setting.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500",
								children: setting.category
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed",
							children: setting.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [
								setting.type === "boolean" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold text-slate-700 dark:text-slate-300",
										children: currentVal ? "활성화 (ON)" : "비활성화 (OFF)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: !isSuperAdmin,
										onClick: () => handleChange(setting.key, !currentVal),
										className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-40 ${currentVal ? "bg-rose-600" : "bg-slate-300 dark:bg-slate-700"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${currentVal ? "translate-x-6" : "translate-x-1"}` })
									})]
								}),
								setting.type === "number" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									disabled: !isSuperAdmin,
									value: currentVal,
									onChange: (e) => handleChange(setting.key, Number(e.target.value)),
									className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold disabled:opacity-50"
								}),
								setting.type === "select" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									disabled: !isSuperAdmin,
									value: currentVal,
									onChange: (e) => handleChange(setting.key, e.target.value),
									className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium disabled:opacity-50",
									children: setting.options?.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: opt.value,
										children: opt.label
									}, opt.value))
								})
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"수정자: ",
							setting.updatedBy,
							" (",
							formatKSTDateTime(setting.updatedAt),
							")"
						] }), isSuperAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							disabled: !isDirty,
							onClick: () => handleSave(setting.key),
							className: "flex items-center gap-1 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold text-xs disabled:opacity-20 hover:opacity-90 transition-opacity",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "저장" })]
						})]
					})]
				}, setting.key);
			})
		})]
	});
};
//#endregion
//#region src/components/admin/modals/AdEditorModal.tsx
var AdEditorModal = ({ isOpen, onClose, onSave, ad }) => {
	const [formData, setFormData] = (0, import_react.useState)({
		name: "",
		advertiser: "",
		type: "image",
		location: "top_banner",
		imageUrl: "",
		url: "",
		startDate: "",
		endDate: "",
		isActive: true
	});
	(0, import_react.useEffect)(() => {
		if (ad) setFormData(ad);
		else setFormData({
			name: "",
			advertiser: "",
			type: "image",
			location: "top_banner",
			imageUrl: "",
			url: "",
			startDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			endDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			isActive: true
		});
	}, [ad, isOpen]);
	const [isSaving, setIsSaving] = (0, import_react.useState)(false);
	if (!isOpen) return null;
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSaving(true);
		try {
			await onSave(formData);
			onClose();
		} catch (e) {
			console.error(e);
		} finally {
			setIsSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-6 space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-bold",
					children: ad ? "광고 수정" : "광고 등록"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						placeholder: "광고명",
						className: "w-full p-2 border rounded-lg",
						value: formData.name,
						onChange: (e) => setFormData({
							...formData,
							name: e.target.value
						}),
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						placeholder: "광고주",
						className: "w-full p-2 border rounded-lg",
						value: formData.advertiser,
						onChange: (e) => setFormData({
							...formData,
							advertiser: e.target.value
						}),
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "w-full p-2 border rounded-lg",
						value: formData.location,
						onChange: (e) => setFormData({
							...formData,
							location: e.target.value
						}),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "top_banner",
								children: "상단 배너 (권장: 1200x200px)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "sidebar",
								children: "사이드바 (권장: 300x600px)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "content_card",
								children: "콘텐츠 카드 (권장: 600x400px)"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						placeholder: "이미지 URL",
						className: "w-full p-2 border rounded-lg",
						value: formData.imageUrl,
						onChange: (e) => setFormData({
							...formData,
							imageUrl: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						placeholder: "클릭 URL",
						className: "w-full p-2 border rounded-lg",
						value: formData.url,
						onChange: (e) => setFormData({
							...formData,
							url: e.target.value
						}),
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							className: "w-full p-2 border rounded-lg",
							value: formData.startDate,
							onChange: (e) => setFormData({
								...formData,
								startDate: e.target.value
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							className: "w-full p-2 border rounded-lg",
							value: formData.endDate,
							onChange: (e) => setFormData({
								...formData,
								endDate: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "w-full py-2 bg-rose-600 text-white rounded-lg font-bold",
						disabled: isSaving,
						children: isSaving ? "저장 중..." : "저장"
					})
				]
			})]
		})
	});
};
//#endregion
//#region src/components/admin/tabs/AdminAdsTab.tsx
var AdminAdsTab = () => {
	const [ads, setAds] = (0, import_react.useState)([]);
	const [isModalOpen, setIsModalOpen] = (0, import_react.useState)(false);
	const [editingAd, setEditingAd] = (0, import_react.useState)(null);
	const { showToast } = useApp();
	const fetchAds = async () => {
		try {
			const q = query(collection(db, "advertisements"), orderBy("startDate", "desc"));
			const data = (await getDocs(q)).docs.map((doc) => ({
				id: doc.id,
				...doc.data()
			}));
			setAds(data);
		} catch (e) {
			console.error(e);
			showToast("광고 목록을 불러오는데 실패했습니다.", "error");
		}
	};
	(0, import_react.useEffect)(() => {
		fetchAds();
	}, []);
	const handleSave = async (adData) => {
		try {
			const { id, ...dataToSave } = adData;
			if (editingAd) {
				await updateDoc(doc(db, "advertisements", editingAd.id), dataToSave);
				showToast("광고가 수정되었습니다.", "success");
			} else {
				await addDoc(collection(db, "advertisements"), dataToSave);
				showToast("광고가 등록되었습니다.", "success");
			}
			fetchAds();
			setEditingAd(null);
		} catch (e) {
			showToast("저장에 실패했습니다.", "error");
			throw e;
		}
	};
	const handleDelete = async (id) => {
		if (!confirm("정말 삭제하시겠습니까?")) return;
		try {
			await deleteDoc(doc(db, "advertisements", id));
			fetchAds();
			showToast("광고가 삭제되었습니다.", "success");
		} catch (e) {
			showToast("삭제에 실패했습니다.", "error");
		}
	};
	const toggleActive = async (ad) => {
		try {
			await updateDoc(doc(db, "advertisements", ad.id), { isActive: !ad.isActive });
			fetchAds();
			showToast("광고 상태가 변경되었습니다.", "success");
		} catch (e) {
			showToast("상태 변경에 실패했습니다.", "error");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "w-5 h-5" }), " 광고 관리"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setEditingAd(null);
						setIsModalOpen(true);
					},
					className: "flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold shadow-md shadow-rose-600/20 hover:bg-rose-700",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), " 광고 등록"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-6 py-4",
								children: "광고명"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-6 py-4",
								children: "광고주"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-6 py-4",
								children: "위치"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-6 py-4",
								children: "기간"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-6 py-4",
								children: "상태"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-6 py-4 text-center",
								children: "관리"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-slate-100 dark:divide-slate-800",
						children: ads.map((ad) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-slate-50 dark:hover:bg-slate-800/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-6 py-4 font-bold text-slate-900 dark:text-white",
									children: ad.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-6 py-4 text-slate-600 dark:text-slate-400",
									children: ad.advertiser
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-6 py-4 text-slate-600 dark:text-slate-400",
									children: ad.location
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-6 py-4 text-slate-600 dark:text-slate-400",
									children: [
										ad.startDate,
										" ~ ",
										ad.endDate
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-6 py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => toggleActive(ad),
										children: ad.isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRight, { className: "w-6 h-6 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleLeft, { className: "w-6 h-6 text-slate-400" })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-6 py-4 flex justify-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											setEditingAd(ad);
											setIsModalOpen(true);
										},
										className: "p-2 text-slate-400 hover:text-indigo-500",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-4 h-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleDelete(ad.id),
										className: "p-2 text-slate-400 hover:text-rose-500",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
									})]
								})
							]
						}, ad.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdEditorModal, {
				isOpen: isModalOpen,
				onClose: () => setIsModalOpen(false),
				onSave: handleSave,
				ad: editingAd
			})
		]
	});
};
//#endregion
//#region src/components/admin/tabs/AdminAdsStatsTab.tsx
var AdminAdsStatsTab = () => {
	const [ads, setAds] = (0, import_react.useState)([]);
	const [stats, setStats] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(true);
	const { showToast } = useApp();
	(0, import_react.useEffect)(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const adsData = (await getDocs(collection(db, "advertisements"))).docs.map((doc) => ({
					id: doc.id,
					...doc.data()
				}));
				setAds(adsData);
				const statsSnap = await getDocs(collection(db, "adStats"));
				const statsData = {};
				statsSnap.docs.forEach((doc) => {
					const { adId, type } = doc.data();
					if (!statsData[adId]) statsData[adId] = {
						impressions: 0,
						clicks: 0
					};
					if (type === "impression") statsData[adId].impressions++;
					if (type === "click") statsData[adId].clicks++;
				});
				setStats(statsData);
			} catch (e) {
				console.error(e);
				showToast("통계 데이터를 불러오는데 실패했습니다.", "error");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [showToast]);
	const processedAds = (0, import_react.useMemo)(() => {
		return ads.map((ad) => {
			const adStats = stats[ad.id] || {
				impressions: 0,
				clicks: 0
			};
			const ctr = adStats.impressions > 0 ? adStats.clicks / adStats.impressions * 100 : 0;
			return {
				...ad,
				...adStats,
				ctr: ctr.toFixed(2)
			};
		});
	}, [ads, stats]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6",
		children: "로딩 중..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: "text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-5 h-5" }), " 광고 성과 통계"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-6 py-4",
							children: "광고명"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
							className: "px-6 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-4 h-4 inline mr-1" }), "노출"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
							className: "px-6 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MousePointerClick, { className: "w-4 h-4 inline mr-1" }), "클릭"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
							className: "px-6 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 inline mr-1" }), "CTR (%)"]
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-slate-100 dark:divide-slate-800",
					children: processedAds.map((ad) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-6 py-4 font-bold",
							children: ad.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-6 py-4",
							children: ad.impressions
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-6 py-4",
							children: ad.clicks
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-6 py-4 font-mono",
							children: [ad.ctr, "%"]
						})
					] }, ad.id))
				})]
			})
		})]
	});
};
//#endregion
//#region src/components/admin/tabs/AdminInquiriesTab.tsx
var AdminInquiriesTab = () => {
	const [inquiries, setInquiries] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const fetchInquiries = async () => {
			const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
			const data = (await getDocs(q)).docs.map((doc) => ({
				id: doc.id,
				...doc.data()
			}));
			setInquiries(data);
			setLoading(false);
		};
		fetchInquiries();
	}, []);
	const handleUpdateStatus = async (id, status, answer) => {
		await updateDoc(doc(db, "inquiries", id), {
			status,
			answer,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		setInquiries((prev) => prev.map((i) => i.id === id ? {
			...i,
			status,
			answer
		} : i));
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Loading..." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-xl font-bold mb-4",
			children: "문의 관리"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: inquiries.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 border rounded shadow",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-bold",
						children: [
							i.title,
							" [",
							i.type,
							"]"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: i.content
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-slate-500",
						children: [
							"작성자: ",
							i.userName,
							" | 상태: ",
							i.status
						]
					}),
					i.status !== "answered" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "w-full border rounded p-2",
							placeholder: "답변 내용",
							onChange: (e) => {}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleUpdateStatus(i.id, "answered", "답변 내용"),
							className: "bg-blue-500 text-white p-2 rounded",
							children: "답변 등록"
						})]
					}),
					i.answer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 p-2 bg-slate-100 rounded",
						children: ["답변: ", i.answer]
					})
				]
			}, i.id))
		})]
	});
};
//#endregion
//#region src/components/admin/tabs/AdminInsightsTab.tsx
var AdminInsightsTab = ({ showToast }) => {
	const [insights, setInsights] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [categoryFilter, setCategoryFilter] = (0, import_react.useState)("all");
	const [isGenerateModalOpen, setIsGenerateModalOpen] = (0, import_react.useState)(false);
	const [isGenerating, setIsGenerating] = (0, import_react.useState)(false);
	const [genCategory, setGenCategory] = (0, import_react.useState)("domestic-market");
	const [genTopic, setGenTopic] = (0, import_react.useState)("");
	const [genSymbol, setGenSymbol] = (0, import_react.useState)("");
	const [editingInsight, setEditingInsight] = (0, import_react.useState)(null);
	const [editTitle, setEditTitle] = (0, import_react.useState)("");
	const [editCategory, setEditCategory] = (0, import_react.useState)("domestic-market");
	const [editSummary, setEditSummary] = (0, import_react.useState)("");
	const [editContent, setEditContent] = (0, import_react.useState)("");
	const [editTags, setEditTags] = (0, import_react.useState)("");
	const [editStatus, setEditStatus] = (0, import_react.useState)("draft");
	const [isSaving, setIsSaving] = (0, import_react.useState)(false);
	const loadInsights = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			const data = await insightService.fetchAdminInsights();
			setInsights(data);
		} catch (err) {
			showToast(err.message || "인사이트 목록 로드 실패", "error");
		} finally {
			setLoading(false);
		}
	}, [showToast]);
	(0, import_react.useEffect)(() => {
		loadInsights();
	}, [loadInsights]);
	const handleGenerateDraft = async (e) => {
		e.preventDefault();
		if (isGenerating) return;
		setIsGenerating(true);
		try {
			const req = {
				category: genCategory,
				topic: genTopic.trim() || void 0,
				targetSymbol: genSymbol.trim() || void 0
			};
			const draft = await insightService.generateDraft(req);
			showToast(`'${draft.title}' 초안 생성이 완료되었습니다.`, "success");
			setIsGenerateModalOpen(false);
			setGenTopic("");
			setGenSymbol("");
			await loadInsights();
			openEditor(draft);
		} catch (err) {
			showToast(err.message || "초안 생성에 실패했습니다.", "error");
		} finally {
			setIsGenerating(false);
		}
	};
	const openEditor = (item) => {
		setEditingInsight(item);
		setEditTitle(item.title);
		setEditCategory(item.category);
		setEditSummary(item.summary);
		setEditContent(item.content);
		setEditTags(item.tags ? item.tags.join(", ") : "");
		setEditStatus(item.status);
	};
	const handleSaveEdit = async () => {
		if (!editingInsight) return;
		if (!editTitle.trim()) {
			showToast("제목을 입력해 주세요.", "warning");
			return;
		}
		if (!editContent.trim()) {
			showToast("본문 내용을 입력해 주세요.", "warning");
			return;
		}
		setIsSaving(true);
		try {
			const tagsArray = editTags.split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean);
			await insightService.updateInsight(editingInsight.id, {
				title: editTitle.trim(),
				category: editCategory,
				summary: editSummary.trim(),
				content: editContent.trim(),
				tags: tagsArray,
				status: editStatus
			});
			showToast(`인사이트가 성공적으로 저장되었습니다. (상태: ${editStatus === "published" ? "공개 발행됨" : "초안 저장"})`, "success");
			setEditingInsight(null);
			await loadInsights();
		} catch (err) {
			showToast(err.message || "저장 실패", "error");
		} finally {
			setIsSaving(false);
		}
	};
	const handleQuickToggleStatus = async (item) => {
		const nextStatus = item.status === "published" ? "draft" : "published";
		try {
			await insightService.updateInsight(item.id, { status: nextStatus });
			showToast(nextStatus === "published" ? "공개 발행되었습니다." : "초안으로 전환되었습니다.", "info");
			await loadInsights();
		} catch (err) {
			showToast(err.message || "상태 변경 실패", "error");
		}
	};
	const handleDelete = async (item) => {
		if (!window.confirm(`'${item.title}' 문서를 완전히 삭제하시겠습니까?`)) return;
		try {
			await insightService.deleteInsight(item.id);
			showToast("삭제되었습니다.", "info");
			await loadInsights();
		} catch (err) {
			showToast(err.message || "삭제 실패", "error");
		}
	};
	const filteredInsights = insights.filter((item) => {
		if (statusFilter !== "all" && item.status !== statusFilter) return false;
		if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0d111a] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-xl font-black text-slate-900 dark:text-white flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-5 h-5 text-rose-500" }), "투자 인사이트 & 애드센스 콘텐츠 관리"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500 dark:text-slate-400 mt-1",
					children: "실시간 증시 데이터 접지 기반 AI 초안 생성, 팩트체크 검토, 및 검색엔진 SEO 공개 발행"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 w-full sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: loadInsights,
						disabled: loading,
						className: "p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors",
						title: "새로고침",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-4 h-4 ${loading ? "animate-spin" : ""}` })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setIsGenerateModalOpen(true),
						className: "flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-sm shadow-md transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4" }), "AI 초안 생성 (Gemini + 실시간 증시)"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#0d111a] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 text-xs font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-slate-400 mr-1",
						children: "상태:"
					}), [
						"all",
						"draft",
						"published"
					].map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setStatusFilter(st),
						className: `px-3 py-1.5 rounded-lg transition-colors ${statusFilter === st ? "bg-rose-500 text-white font-bold" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`,
						children: st === "all" ? "전체" : st === "draft" ? "초안 (Draft)" : "발행됨 (Published)"
					}, st))]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 text-xs font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-slate-400 mr-1",
						children: "분류:"
					}), [
						"all",
						"domestic-market",
						"us-market",
						"economy"
					].map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setCategoryFilter(cat),
						className: `px-3 py-1.5 rounded-lg transition-colors ${categoryFilter === cat ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`,
						children: cat === "all" ? "전체" : cat === "domestic-market" ? "국내 증시" : cat === "us-market" ? "미국 증시" : "거시경제"
					}, cat))]
				})]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-20 text-center bg-white dark:bg-[#0d111a] rounded-2xl border border-slate-200 dark:border-slate-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-8 h-8 text-rose-500 animate-spin mx-auto mb-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-slate-400 text-sm",
					children: "인사이트 데이터를 불러오는 중입니다..."
				})]
			}) : filteredInsights.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: filteredInsights.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white dark:bg-[#0d111a] border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5 flex-1 min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `px-2 py-0.5 rounded-md text-[11px] font-bold ${item.status === "published" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"}`,
										children: item.status === "published" ? "공개 발행됨" : "초안 (미공개)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold text-rose-500",
										children: item.categoryLabel || item.category
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-slate-400 font-mono",
										children: new Date(item.publishedAt || item.createdAt).toLocaleDateString("ko-KR")
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-base text-slate-900 dark:text-white truncate",
								children: item.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-2xl",
								children: item.summary
							}),
							item.marketDataSnapshot && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-slate-400 font-mono flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3 h-3 text-rose-400" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"기준가: ",
										item.marketDataSnapshot.benchmarkPrice?.toLocaleString(),
										"원"
									] }),
									item.marketDataSnapshot.changePercent !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: item.marketDataSnapshot.changePercent >= 0 ? "text-red-400" : "text-blue-400",
										children: [
											"(",
											item.marketDataSnapshot.changePercent > 0 ? "+" : "",
											item.marketDataSnapshot.changePercent,
											"%)"
										]
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800",
						children: [
							item.status === "published" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `/insights/${item.id}`,
								target: "_blank",
								rel: "noreferrer",
								className: "p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors",
								title: "공개 페이지 미리보기",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "보기"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => openEditor(item),
								className: "px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "w-3.5 h-3.5" }), "편집/검토"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleQuickToggleStatus(item),
								className: `px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${item.status === "published" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20" : "bg-emerald-500 text-white hover:bg-emerald-600"}`,
								children: item.status === "published" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-3.5 h-3.5" }), "초안 전환"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-3.5 h-3.5" }), "즉시 발행"] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleDelete(item),
								className: "p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors",
								title: "삭제",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
							})
						]
					})]
				}, item.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-20 text-center bg-white dark:bg-[#0d111a] rounded-2xl border border-slate-200 dark:border-slate-800 p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-12 h-12 text-slate-400 mx-auto mb-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-slate-900 dark:text-white text-base mb-1",
						children: "등록된 인사이트가 없습니다"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto",
						children: "상단의 'AI 초안 생성' 버튼을 클릭하여 실시간 시장 데이터를 접목한 고품질 시황 초안을 생성해 보세요."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setIsGenerateModalOpen(true),
						className: "inline-flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4" }), "초안 생성 시작"]
					})
				]
			}),
			isGenerateModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white dark:bg-[#0d111a] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-5 h-5 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-black text-lg text-slate-900 dark:text-white",
								children: "실시간 증시 데이터 기반 AI 초안 생성"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => !isGenerating && setIsGenerateModalOpen(false),
							disabled: isGenerating,
							className: "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleGenerateDraft,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-600 dark:text-rose-400 leading-relaxed",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "원칙:" }),
									" 생성된 콘텐츠는 기본적으로 ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "초안(draft)" }),
									" 상태로 저장되며, 관리자의 팩트체크와 검토 승인을 거쳐야만 일반 사용자와 검색엔진에 공개됩니다."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
								children: "분석 카테고리"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: genCategory,
								onChange: (e) => setGenCategory(e.target.value),
								disabled: isGenerating,
								className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-rose-500",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "domestic-market",
										children: "국내 증시 분석 (코스피, 코스닥)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "us-market",
										children: "미국 증시 분석 (뉴욕, 나스닥, S&P 500)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "economy",
										children: "거시경제 분석 (환율, 금리, 인플레이션)"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
								children: "분석 대상 종목 코드 (선택 사항)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: "예: 005930 (삼성전자), 000660 (SK하이닉스), AAPL, NVDA",
								value: genSymbol,
								onChange: (e) => setGenSymbol(e.target.value),
								disabled: isGenerating,
								className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
								children: "핵심 분석 주제 / 포커스 (선택 사항)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 2,
								placeholder: "예: 반도체 업종 실적 발표와 외국인 매수세 유입 분석",
								value: genTopic,
								onChange: (e) => setGenTopic(e.target.value),
								disabled: isGenerating,
								className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setIsGenerateModalOpen(false),
									disabled: isGenerating,
									className: "px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
									children: "취소"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: isGenerating,
									className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-md",
									children: isGenerating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 animate-spin" }), "실시간 증시 데이터 접지 생성 중..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4" }), "초안 생성 실행"] })
								})]
							})
						]
					})]
				})
			}),
			editingInsight && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white dark:bg-[#0d111a] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 my-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "w-5 h-5 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-black text-lg text-slate-900 dark:text-white",
								children: "인사이트 검토 및 편집"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => !isSaving && setEditingInsight(null),
							disabled: isSaving,
							className: "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
									children: "카테고리"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: editCategory,
									onChange: (e) => setEditCategory(e.target.value),
									className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "domestic-market",
											children: "국내 증시 분석"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "us-market",
											children: "미국 증시 분석"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "economy",
											children: "거시경제 분석"
										})
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
									children: "공개 상태"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: editStatus,
									onChange: (e) => setEditStatus(e.target.value),
									className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "draft",
										children: "초안 (Draft - 비공개 보관)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "published",
										children: "공개 발행 (Published - SEO 및 검색 노출)"
									})]
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: "리포트 제목"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: editTitle,
								onChange: (e) => setEditTitle(e.target.value),
								className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: "요약문 (검색엔진 Meta Description)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 2,
								value: editSummary,
								onChange: (e) => setEditSummary(e.target.value),
								className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: "본문 내용 (Markdown)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 12,
								value: editContent,
								onChange: (e) => setEditContent(e.target.value),
								className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 leading-relaxed"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: "태그 (쉼표로 구분)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: "예: 코스피, 반도체, 외인수급",
								value: editTags,
								onChange: (e) => setEditTags(e.target.value),
								className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-slate-400",
									children: ["문서 ID: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
										className: "font-mono",
										children: editingInsight.id
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setEditingInsight(null),
										disabled: isSaving,
										className: "px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
										children: "취소"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: handleSaveEdit,
										disabled: isSaving,
										className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-md",
										children: isSaving ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 animate-spin" }), "저장 중..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4" }), "저장 완료"] })
									})]
								})]
							})
						]
					})]
				})
			})
		]
	});
};
//#endregion
//#region src/components/admin/AdminView.tsx
var AdminView = () => {
	const { user, isAuthenticated, setActiveTab: setPublicTab, showToast, setIsAuthModalOpen } = useApp();
	const getSubTabFromUrl = () => {
		const path = window.location.pathname.replace(/^\/admin\/?/, "");
		const hash = window.location.hash.replace(/^#\/?admin\/?/, "");
		const target = (path || hash || "dashboard").split("/")[0];
		return [
			"dashboard",
			"users",
			"posts",
			"comments",
			"reports",
			"chat",
			"notices",
			"filters",
			"alerts",
			"market",
			"logs",
			"settings",
			"ads",
			"ads_stats",
			"inquiries",
			"insights"
		].includes(target) ? target : "dashboard";
	};
	const [activeSubTab, setActiveSubTab] = (0, import_react.useState)(getSubTabFromUrl);
	(0, import_react.useEffect)(() => {
		const handlePopState = () => {
			setActiveSubTab(getSubTabFromUrl());
		};
		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, []);
	const handleSelectTab = (tab) => {
		setActiveSubTab(tab);
		window.history.pushState(null, "", `/admin/${tab}`);
	};
	const handleGoToSite = () => {
		setPublicTab("home");
		window.history.pushState(null, "", "/");
	};
	const [users, setUsers] = (0, import_react.useState)(() => adminService.getUsers());
	const [posts, setPosts] = (0, import_react.useState)(() => adminService.getPosts());
	const [comments, setComments] = (0, import_react.useState)(() => adminService.getAllComments());
	const [reports, setReports] = (0, import_react.useState)(() => adminService.getReports());
	const [chatMessages, setChatMessages] = (0, import_react.useState)(() => adminService.getChatMessages());
	const [notices, setNotices] = (0, import_react.useState)(() => adminService.getNotices());
	const [bannedWords, setBannedWords] = (0, import_react.useState)(() => adminService.getBannedWords());
	const [notifications, setNotifications] = (0, import_react.useState)(() => adminService.getNotifications());
	const [logs, setLogs] = (0, import_react.useState)(() => adminService.getAdminLogs());
	const [settings, setSettings] = (0, import_react.useState)(() => adminService.getSettings());
	const [serverStats, setServerStats] = (0, import_react.useState)(null);
	const [lastSyncTime, setLastSyncTime] = (0, import_react.useState)(() => formatKST(/* @__PURE__ */ new Date()));
	const [connectionStatus, setConnectionStatus] = (0, import_react.useState)("CONNECTED");
	const handleManualRefresh = (0, import_react.useCallback)(async () => {
		setConnectionStatus("RECONNECTING");
		try {
			const stats = await adminService.fetchDashboardStats();
			if (stats) setServerStats(stats);
			setLastSyncTime(formatKST(/* @__PURE__ */ new Date()));
			setConnectionStatus("CONNECTED");
			showToast("통계 및 서버 연결 상태를 최신 데이터로 동기화했습니다.", "info");
		} catch {
			setConnectionStatus("ERROR");
			showToast("서버 동기화 실패. 마지막 정상 데이터 상태를 유지합니다.", "error");
		}
	}, [showToast]);
	(0, import_react.useEffect)(() => {
		let isMounted = true;
		const syncServerStats = async () => {
			try {
				const stats = await adminService.fetchDashboardStats();
				if (isMounted && stats) {
					setServerStats(stats);
					setLastSyncTime(formatKST(/* @__PURE__ */ new Date()));
					setConnectionStatus("CONNECTED");
				}
			} catch (e) {
				if (isMounted) setConnectionStatus("ERROR");
			}
		};
		syncServerStats();
		const interval = setInterval(syncServerStats, 6e4);
		const unsubUsers = firebaseRepository.subscribeUsers((liveUsers) => {
			if (!isMounted) return;
			const uniqueUsers = dedupeById(liveUsers);
			setUsers(uniqueUsers);
			adminService.saveUsers(uniqueUsers);
			setLastSyncTime(formatKST(/* @__PURE__ */ new Date()));
			setConnectionStatus("CONNECTED");
		}, (err) => {
			if (err?.code === "cancelled" || err?.message?.includes("CANCELLED")) return;
			console.warn("[AdminView] users onSnapshot warning:", err);
			if (isMounted) setConnectionStatus("ERROR");
		});
		const unsubPosts = firebaseRepository.subscribePosts((livePosts) => {
			if (!isMounted) return;
			const uniquePosts = dedupeById(livePosts);
			setPosts(uniquePosts);
			setComments(adminService.getAllComments(uniquePosts));
			setLastSyncTime(formatKST(/* @__PURE__ */ new Date()));
			setConnectionStatus("CONNECTED");
		}, (err) => {
			if (err?.code === "cancelled" || err?.message?.includes("CANCELLED")) return;
			console.warn("[AdminView] posts onSnapshot warning:", err);
			if (isMounted) setConnectionStatus("ERROR");
		});
		const unsubReports = firebaseRepository.subscribeReports((liveReports) => {
			if (!isMounted) return;
			const uniqueReports = dedupeById(liveReports);
			setReports(uniqueReports);
			adminService.saveReports(uniqueReports);
			setLastSyncTime(formatKST(/* @__PURE__ */ new Date()));
			setConnectionStatus("CONNECTED");
		}, (err) => {
			if (err?.code === "cancelled" || err?.message?.includes("CANCELLED")) return;
			console.warn("[AdminView] reports onSnapshot warning:", err);
			if (isMounted) setConnectionStatus("ERROR");
		});
		const unsubChat = firebaseRepository.subscribeAllChat((liveChat) => {
			if (!isMounted) return;
			setChatMessages(dedupeById(liveChat));
			setLastSyncTime(formatKST(/* @__PURE__ */ new Date()));
			setConnectionStatus("CONNECTED");
		}, 100, (err) => {
			if (err?.code === "cancelled" || err?.message?.includes("CANCELLED")) return;
			console.warn("[AdminView] chat onSnapshot warning:", err);
			if (isMounted) setConnectionStatus("ERROR");
		});
		const refreshLocalState = () => {
			setNotices(adminService.getNotices());
			setBannedWords(adminService.getBannedWords());
			setLogs(adminService.getAdminLogs());
			setSettings(adminService.getSettings());
		};
		refreshLocalState();
		window.addEventListener("storage", refreshLocalState);
		window.addEventListener("focus", syncServerStats);
		return () => {
			isMounted = false;
			clearInterval(interval);
			unsubUsers();
			unsubPosts();
			unsubReports();
			unsubChat();
			window.removeEventListener("storage", refreshLocalState);
			window.removeEventListener("focus", syncServerStats);
		};
	}, []);
	const isAuthorizedRole = user && (user.role === "admin" || user.role === "superadmin" || user.role === "moderator");
	(0, import_react.useEffect)(() => {
		if (!isAuthenticated || !isAuthorizedRole) {
			window.history.replaceState(null, "", "/");
			setPublicTab("home");
			showToast("일반 사용자는 관리자 영역에 접근할 수 없습니다. 홈 화면으로 이동합니다.", "warning");
		}
	}, [
		isAuthenticated,
		isAuthorizedRole,
		setPublicTab,
		showToast
	]);
	if (!isAuthenticated || !isAuthorizedRole) return null;
	const callerProfile = {
		id: user.id,
		name: user.name,
		role: user.role
	};
	const pendingReportsCount = reports.filter((r) => r.status === "pending").length;
	const renderTabContent = () => {
		switch (activeSubTab) {
			case "dashboard": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDashboardTab, {
				onNavigateTab: handleSelectTab,
				users,
				posts,
				reports,
				chatMessages,
				serverStats,
				lastSyncTime,
				connectionStatus,
				onRefresh: handleManualRefresh
			});
			case "users": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminUsersTab, {
				users,
				callerRole: user.role,
				onSuspend: async (uid, reason) => {
					const res = await adminService.suspendUser(uid, reason, callerProfile);
					if (res.success) {
						setUsers((prev) => prev.map((u) => u.id === uid ? {
							...u,
							status: "suspended",
							suspendedReason: reason,
							chatRestricted: true,
							chatMutedUntil: "영구 정지"
						} : u));
						showToast(res.message, "info");
					} else showToast(res.message, "error");
					setLogs(adminService.getAdminLogs());
				},
				onUnsuspend: async (uid) => {
					const res = await adminService.unsuspendUser(uid, callerProfile);
					if (res.success) {
						setUsers((prev) => prev.map((u) => u.id === uid ? {
							...u,
							status: "active",
							suspendedReason: void 0,
							chatRestricted: false,
							chatMutedUntil: void 0
						} : u));
						showToast(res.message, "success");
					} else showToast(res.message, "error");
					setLogs(adminService.getAdminLogs());
				},
				onMute: async (uid, dur) => {
					const res = await adminService.muteUser(uid, dur, callerProfile);
					if (res.success) {
						setUsers((prev) => prev.map((u) => u.id === uid ? {
							...u,
							chatRestricted: true,
							chatMutedUntil: dur
						} : u));
						showToast(res.message, "info");
					} else showToast(res.message, "error");
					setLogs(adminService.getAdminLogs());
				},
				onUnmute: async (uid) => {
					const res = await adminService.unmuteUser(uid, callerProfile);
					if (res.success) {
						setUsers((prev) => prev.map((u) => u.id === uid ? {
							...u,
							chatRestricted: false,
							chatMutedUntil: void 0
						} : u));
						showToast(res.message, "success");
					} else showToast(res.message, "error");
					setLogs(adminService.getAdminLogs());
				},
				onWarn: (uid, msg) => {
					adminService.warnUser(uid, msg, callerProfile);
					setLogs(adminService.getAdminLogs());
					showToast("경고 알림이 전송되었습니다.", "info");
				},
				onChangeRole: async (uid, newRole) => {
					const res = await adminService.changeUserRole(uid, newRole, user.role, callerProfile);
					if (res.success) {
						setLogs(adminService.getAdminLogs());
						showToast(res.message, "success");
					} else showToast(res.message, "error");
				},
				onDeleteUser: async (uid) => {
					const res = await adminService.deleteUser(uid, callerProfile);
					if (res.success) {
						setLogs(adminService.getAdminLogs());
						showToast(res.message, "success");
					} else showToast(res.message, "error");
				}
			});
			case "posts": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPostsTab, {
				posts,
				callerRole: user.role,
				onUpdateStatus: async (pid, status) => {
					await adminService.updatePostStatus(pid, status, callerProfile);
					setLogs(adminService.getAdminLogs());
					showToast(`게시글이 '${status}' 처리되었습니다.`, "info");
				},
				onToggleNotice: async (pid, isNotice) => {
					await adminService.toggleNoticePost(pid, isNotice, callerProfile);
					setLogs(adminService.getAdminLogs());
					showToast(isNotice ? "공지글로 지정되었습니다." : "공지 지정이 해제되었습니다.", "info");
				}
			});
			case "comments": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCommentsTab, {
				comments,
				callerRole: user.role,
				onUpdateStatus: (cid, pid, status) => {
					adminService.updateCommentStatus(cid, pid, status, callerProfile);
					setComments(adminService.getAllComments());
					setLogs(adminService.getAdminLogs());
					showToast(`댓글이 '${status}' 처리되었습니다.`, "info");
				}
			});
			case "reports": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminReportsTab, {
				reports,
				callerRole: user.role,
				onResolve: (rid, action) => {
					adminService.resolveReport(rid, action, user.name, callerProfile);
					setReports(adminService.getReports());
					setLogs(adminService.getAdminLogs());
					showToast("신고 처리가 완료되었습니다.", "success");
				},
				onDismiss: (rid) => {
					adminService.dismissReport(rid, user.name, callerProfile);
					setReports(adminService.getReports());
					setLogs(adminService.getAdminLogs());
					showToast("신고가 기각 처리되었습니다.", "info");
				},
				onHideContent: (type, targetId) => {
					if (type === "post") {
						adminService.updatePostStatus(targetId, "hidden", callerProfile);
						setPosts(adminService.getPosts());
					}
				},
				onDeleteContent: (type, targetId) => {
					if (type === "post") {
						adminService.updatePostStatus(targetId, "deleted", callerProfile);
						setPosts(adminService.getPosts());
					} else if (type === "chat") {
						adminService.deleteChatMessage(targetId, "all", callerProfile);
						setChatMessages(adminService.getChatMessages());
					}
				},
				onMuteUser: (targetUserId) => {
					adminService.muteUser(targetUserId, "신고 조치에 따른 발언 제한", callerProfile);
					setUsers(adminService.getUsers());
				},
				onSuspendUser: (targetUserId, reason) => {
					adminService.suspendUser(targetUserId, reason, callerProfile);
					setUsers(adminService.getUsers());
				}
			});
			case "chat": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminChatTab, {
				chatMessages,
				callerRole: user.role,
				onDeleteMessage: async (mid, rid) => {
					await adminService.deleteChatMessage(mid, rid, callerProfile);
					setChatMessages((prev) => prev.filter((m) => m.id !== mid));
					setLogs(adminService.getAdminLogs());
					showToast("채팅 메시지가 데이터베이스에서 영구 삭제되었습니다.", "info");
				},
				onMuteUser: async (uid, dur) => {
					const res = await adminService.muteUser(uid, dur, callerProfile);
					setUsers(adminService.getUsers());
					setLogs(adminService.getAdminLogs());
					showToast(res.message, res.success ? "warning" : "error");
				},
				onClearRoomChat: async (rid) => {
					const res = await adminService.clearChatMessages(rid, callerProfile);
					if (res.success) {
						setChatMessages((prev) => rid === "all" ? [] : prev.filter((m) => (m.roomId || "all") !== rid));
						setLogs(adminService.getAdminLogs());
						showToast(res.message, "success");
					} else showToast(res.message, "error");
				},
				onDeleteChatRoom: async (rid) => {
					const res = await adminService.deleteChatRoom(rid, callerProfile);
					if (res.success) {
						setChatMessages((prev) => prev.filter((m) => (m.roomId || "all") !== rid));
						setLogs(adminService.getAdminLogs());
						showToast(res.message, "success");
					} else showToast(res.message, "error");
				}
			});
			case "notices": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminNoticesTab, {
				notices,
				callerRole: user.role,
				onCreateNotice: (noticeData) => {
					adminService.createNotice(noticeData, callerProfile);
					setNotices(adminService.getNotices());
					setPosts(adminService.getPosts());
					setLogs(adminService.getAdminLogs());
					showToast("새 공지사항이 등록되었습니다.", "success");
				},
				onUpdateNotice: (id, updates) => {
					adminService.updateNotice(id, updates, callerProfile);
					setNotices(adminService.getNotices());
					setLogs(adminService.getAdminLogs());
					showToast("공지사항이 수정되었습니다.", "success");
				},
				onDeleteNotice: (id) => {
					adminService.deleteNotice(id, callerProfile);
					setNotices(adminService.getNotices());
					setLogs(adminService.getAdminLogs());
					showToast("공지사항이 삭제되었습니다.", "info");
				},
				onTogglePin: (id) => {
					adminService.togglePinNotice(id);
					setNotices(adminService.getNotices());
					showToast("고정 상태가 변경되었습니다.", "info");
				}
			});
			case "filters": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFiltersTab, {
				bannedWords,
				callerRole: user.role,
				onAddWord: (word, severity, cat, action) => {
					adminService.addBannedWord(word, severity, cat, action, user.name, callerProfile);
					setBannedWords(adminService.getBannedWords());
					setLogs(adminService.getAdminLogs());
					showToast("새 금칙어가 등록되었습니다.", "success");
				},
				onDeleteWord: (id) => {
					adminService.deleteBannedWord(id, callerProfile);
					setBannedWords(adminService.getBannedWords());
					setLogs(adminService.getAdminLogs());
					showToast("금칙어가 삭제되었습니다.", "info");
				},
				onToggleWord: (id, enabled) => {
					adminService.toggleBannedWord(id, enabled);
					setBannedWords(adminService.getBannedWords());
					showToast(enabled ? "금칙어가 활성화되었습니다." : "금칙어가 비활성화되었습니다.", "info");
				}
			});
			case "alerts": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminAlertsTab, {
				notifications,
				callerRole: user.role,
				onSendNotification: (notifData) => {
					adminService.sendNotification(notifData, callerProfile);
					setNotifications(adminService.getNotifications());
					setLogs(adminService.getAdminLogs());
					showToast("알림 발송이 완료되었습니다.", "success");
				}
			});
			case "market": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminMarketTab, { callerRole: user.role });
			case "logs": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLogsTab, {
				logs,
				callerRole: user.role,
				onRefreshLogs: () => setLogs(adminService.getAdminLogs())
			});
			case "settings": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSettingsTab, {
				settings,
				callerRole: user.role,
				onUpdateSetting: (key, val) => {
					const res = adminService.updateSetting(key, val, user.role, callerProfile);
					if (res.success) {
						setSettings(adminService.getSettings());
						setLogs(adminService.getAdminLogs());
						showToast(res.message, "success");
					} else showToast(res.message, "error");
				}
			});
			case "ads": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminAdsTab, {});
			case "ads_stats": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminAdsStatsTab, {});
			case "inquiries": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInquiriesTab, {});
			case "insights": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInsightsTab, {
				callerRole: user.role,
				showToast
			});
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDashboardTab, {
				onNavigateTab: handleSelectTab,
				users,
				posts,
				reports
			});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, {
		activeTab: activeSubTab,
		onSelectTab: handleSelectTab,
		onGoToSite: handleGoToSite,
		user,
		pendingReportsCount,
		children: renderTabContent()
	});
};
//#endregion
export { AdminView };
