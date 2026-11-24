import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { Ht as Clock, Jt as ChevronLeft, O as Sparkles, bn as require_react, g as TrendingUp, i as X, ln as Bell, qt as ChevronRight, sn as Bookmark, tn as Calendar } from "./vendor-lucide-Dji_Ij8j.js";
import { a as notificationService, n as useApp } from "./AppContext-Butl4QWq.js";
//#region src/services/calendarService.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var DEFAULT_CLIENT_CALENDAR_SETTINGS = {
	enabled: true,
	timings: [
		"1d",
		"1h",
		"15m"
	],
	types: [
		"HOLIDAY",
		"ECONOMIC",
		"EARNINGS",
		"DIVIDEND"
	],
	markets: ["KR", "US"],
	watchlistOnly: false,
	browserPushEnabled: false,
	updatedAt: (/* @__PURE__ */ new Date()).toISOString()
};
var STORAGE_KEY_CALENDAR_SETTINGS = "bd_calendar_alert_settings";
var CalendarService = class {
	/**
	* Fetch calendar events with optional filters
	*/
	async getEvents(options = {}) {
		const params = new URLSearchParams();
		if (options.year) params.append("year", options.year.toString());
		if (options.month) params.append("month", options.month.toString());
		if (options.market && options.market !== "ALL") params.append("market", options.market);
		if (options.type) params.append("type", options.type);
		if (options.symbol) params.append("symbol", options.symbol);
		try {
			const res = await fetch(`/api/calendar/events?${params.toString()}`);
			if (res.ok) return await res.json();
		} catch (err) {
			console.warn("[CalendarService] Fetch events error:", err);
		}
		return {
			events: [],
			total: 0,
			source: "API 미연결"
		};
	}
	/**
	* Fetch summary (today, week highlights, counts)
	*/
	async getSummary() {
		try {
			const res = await fetch("/api/calendar/summary");
			if (res.ok) return await res.json();
		} catch (err) {
			console.warn("[CalendarService] Fetch summary error:", err);
		}
		return {
			todayEvents: [],
			weekEvents: [],
			upcomingHighImpact: [],
			counts: {
				totalThisMonth: 0,
				holidays: 0,
				economic: 0,
				earnings: 0,
				dividends: 0
			},
			serverTime: (/* @__PURE__ */ new Date()).toISOString()
		};
	}
	/**
	* Get single event
	*/
	async getEvent(id) {
		try {
			const res = await fetch(`/api/calendar/events/${id}`);
			if (res.ok) return await res.json();
		} catch (err) {
			console.warn("[CalendarService] Fetch event error:", err);
		}
		return null;
	}
	/**
	* Get calendar alert settings (syncs with localStorage & server)
	*/
	async getAlertSettings(uid) {
		try {
			const cached = localStorage.getItem(STORAGE_KEY_CALENDAR_SETTINGS);
			if (cached) return JSON.parse(cached);
		} catch {}
		try {
			const res = await fetch(`/api/calendar/alerts/settings?uid=${encodeURIComponent(uid || "local-user")}`);
			if (res.ok) {
				const settings = await res.json();
				localStorage.setItem(STORAGE_KEY_CALENDAR_SETTINGS, JSON.stringify(settings));
				return settings;
			}
		} catch {}
		return { ...DEFAULT_CLIENT_CALENDAR_SETTINGS };
	}
	/**
	* Save calendar alert settings
	*/
	async saveAlertSettings(settings, uid) {
		const updated = {
			...settings,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		try {
			localStorage.setItem(STORAGE_KEY_CALENDAR_SETTINGS, JSON.stringify(updated));
		} catch {}
		try {
			await fetch("/api/calendar/alerts/settings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					uid: uid || "local-user",
					settings: updated
				})
			});
		} catch (err) {
			console.warn("[CalendarService] Save settings error:", err);
		}
		return updated;
	}
	/**
	* Check upcoming advance alerts
	*/
	async checkAdvanceAlerts(watchlist = [], uid) {
		try {
			const res = await fetch("/api/calendar/alerts/check", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					uid: uid || "local-user",
					watchlist
				})
			});
			if (res.ok) return (await res.json()).notifications || [];
		} catch (err) {
			console.warn("[CalendarService] Check alerts error:", err);
		}
		return [];
	}
};
var calendarService = new CalendarService();
//#endregion
//#region src/components/calendar/CalendarView.tsx
var import_jsx_runtime = require_jsx_runtime();
var CalendarView = () => {
	const { user, watchlist, navigateToStock, showToast } = useApp();
	const [currentDate, setCurrentDate] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	const [viewMode, setViewMode] = (0, import_react.useState)("MONTH");
	const [marketFilter, setMarketFilter] = (0, import_react.useState)("ALL");
	const [typeFilter, setTypeFilter] = (0, import_react.useState)("ALL");
	const [events, setEvents] = (0, import_react.useState)([]);
	const [summary, setSummary] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [selectedEvent, setSelectedEvent] = (0, import_react.useState)(null);
	const [isAlertModalOpen, setIsAlertModalOpen] = (0, import_react.useState)(false);
	const [alertSettings, setAlertSettings] = (0, import_react.useState)(DEFAULT_CLIENT_CALENDAR_SETTINGS);
	const [isSavingSettings, setIsSavingSettings] = (0, import_react.useState)(false);
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth() + 1;
	(0, import_react.useEffect)(() => {
		calendarService.getSummary().then((res) => setSummary(res));
		calendarService.getAlertSettings(user?.id).then((res) => setAlertSettings(res));
	}, [user?.id]);
	const loadEvents = async () => {
		setIsLoading(true);
		try {
			const res = await calendarService.getEvents({
				year: currentYear,
				month: currentMonth,
				market: marketFilter !== "ALL" ? marketFilter : void 0,
				type: typeFilter !== "ALL" ? typeFilter : void 0
			});
			setEvents(res.events || []);
		} catch (err) {
			console.warn("[CalendarView] load events failed:", err);
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadEvents();
	}, [
		currentYear,
		currentMonth,
		marketFilter,
		typeFilter
	]);
	(0, import_react.useEffect)(() => {
		calendarService.checkAdvanceAlerts(watchlist, user?.id).then((notifs) => {
			if (notifs && notifs.length > 0) notifs.forEach((n) => {
				notificationService.createNotification(n.title, n.message, "SYSTEM", void 0, user?.id);
			});
		});
	}, [watchlist, user?.id]);
	const handlePrev = () => {
		if (viewMode === "MONTH") setCurrentDate(new Date(currentYear, currentMonth - 2, 1));
		else if (viewMode === "WEEK") {
			const prevWeek = new Date(currentDate);
			prevWeek.setDate(prevWeek.getDate() - 7);
			setCurrentDate(prevWeek);
		} else {
			const prevDay = new Date(currentDate);
			prevDay.setDate(prevDay.getDate() - 1);
			setCurrentDate(prevDay);
		}
	};
	const handleNext = () => {
		if (viewMode === "MONTH") setCurrentDate(new Date(currentYear, currentMonth, 1));
		else if (viewMode === "WEEK") {
			const nextWeek = new Date(currentDate);
			nextWeek.setDate(nextWeek.getDate() + 7);
			setCurrentDate(nextWeek);
		} else {
			const nextDay = new Date(currentDate);
			nextDay.setDate(nextDay.getDate() + 1);
			setCurrentDate(nextDay);
		}
	};
	const handleToday = () => {
		setCurrentDate(/* @__PURE__ */ new Date());
	};
	const handleSaveAlertSettings = async () => {
		setIsSavingSettings(true);
		try {
			const updated = await calendarService.saveAlertSettings(alertSettings, user?.id);
			setAlertSettings(updated);
			showToast("증시 캘린더 사전 알림 설정이 저장되었습니다.", "success");
			setIsAlertModalOpen(false);
		} catch {
			showToast("알림 설정을 저장하는 중 오류가 발생했습니다.", "error");
		} finally {
			setIsSavingSettings(false);
		}
	};
	const handleRequestPushPermission = async () => {
		if ("Notification" in window) {
			if (await Notification.requestPermission() === "granted") {
				setAlertSettings((prev) => ({
					...prev,
					browserPushEnabled: true
				}));
				showToast("브라우저 푸시 알림이 활성화되었습니다.", "success");
			} else showToast("브라우저 알림 권한이 거부되었습니다.", "warning");
		} else showToast("현재 브라우저에서는 웹 푸시를 지원하지 않습니다.", "info");
	};
	const getTypeBadge = (type) => {
		switch (type) {
			case "HOLIDAY": return {
				label: "휴장일",
				bg: "bg-rose-500/10 text-rose-500 border-rose-500/20"
			};
			case "ECONOMIC": return {
				label: "경제지표",
				bg: "bg-blue-500/10 text-blue-500 border-blue-500/20"
			};
			case "EARNINGS": return {
				label: "기업실적",
				bg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
			};
			case "DIVIDEND": return {
				label: "배당",
				bg: "bg-amber-500/10 text-amber-500 border-amber-500/20"
			};
		}
	};
	const monthDays = (0, import_react.useMemo)(() => {
		const firstDay = new Date(currentYear, currentMonth - 1, 1);
		const lastDay = new Date(currentYear, currentMonth, 0);
		const startDayOfWeek = firstDay.getDay();
		const totalDays = lastDay.getDate();
		const days = [];
		const prevMonthLastDay = new Date(currentYear, currentMonth - 1, 0).getDate();
		for (let i = startDayOfWeek - 1; i >= 0; i--) {
			const d = prevMonthLastDay - i;
			const m = currentMonth - 1 <= 0 ? 12 : currentMonth - 1;
			const dateStr = `${currentMonth - 1 <= 0 ? currentYear - 1 : currentYear}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
			days.push({
				dateStr,
				dayNum: d,
				isCurrentMonth: false,
				events: events.filter((e) => e.date === dateStr)
			});
		}
		for (let d = 1; d <= totalDays; d++) {
			const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
			days.push({
				dateStr,
				dayNum: d,
				isCurrentMonth: true,
				events: events.filter((e) => e.date === dateStr)
			});
		}
		const remaining = (7 - days.length % 7) % 7;
		for (let d = 1; d <= remaining; d++) {
			const m = currentMonth + 1 > 12 ? 1 : currentMonth + 1;
			const dateStr = `${currentMonth + 1 > 12 ? currentYear + 1 : currentYear}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
			days.push({
				dateStr,
				dayNum: d,
				isCurrentMonth: false,
				events: events.filter((e) => e.date === dateStr)
			});
		}
		return days;
	}, [
		currentYear,
		currentMonth,
		events
	]);
	const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-16 animate-in fade-in duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "증시 캘린더" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 font-mono",
							children: "KR · US LIVE"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
						children: "한국거래소 · 미국 NYSE/NASDAQ 휴장일, 경제지표, 기업 실적, 배당 일정을 공식 캘린더로 확인하세요."
					})] })]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setViewMode("MONTH"),
								className: `px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === "MONTH" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
								children: "월간"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setViewMode("WEEK"),
								className: `px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === "WEEK" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
								children: "주간"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setViewMode("DAY"),
								className: `px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === "DAY" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
								children: "일간"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setIsAlertModalOpen(true),
						className: "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer",
						title: "증시 일정 사전 알림 설정 (1일 전, 1시간 전, 15분 전)",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-3.5 h-3.5 text-rose-500" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "사전 알림 설정" }),
							alertSettings.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" })
						]
					})]
				})]
			}),
			summary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs font-bold text-slate-400 mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5 text-rose-500",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5" }),
									"오늘의 일정 (",
									summary.todayEvents.length,
									"건)"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: todayStr
							})]
						}), summary.todayEvents.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1.5",
							children: summary.todayEvents.slice(0, 2).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => setSelectedEvent(e),
								className: "p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-xs text-slate-900 dark:text-white truncate",
									children: e.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-slate-400 font-mono mt-0.5",
									children: [
										e.timeKST,
										" · ",
										e.market
									]
								})]
							}, e.id))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400 py-3",
							children: "오늘 예정된 주요 이벤트가 없습니다."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-xs md:col-span-1 lg:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs font-bold text-slate-400 mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5 text-amber-500",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5" }),
									"이번 주 핵심 이벤트 (",
									summary.weekEvents.length,
									"건)"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-slate-400",
								children: "D-7일 이내"
							})]
						}), summary.weekEvents.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
							children: summary.weekEvents.slice(0, 4).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => setSelectedEvent(e),
								className: "p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-500/10 cursor-pointer transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-mono px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold shrink-0",
										children: e.date.slice(5)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-xs text-slate-900 dark:text-white truncate",
										children: e.title
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-slate-400 font-mono mt-0.5 pl-0.5 truncate",
									children: [
										e.timeKST,
										" ",
										e.localTime ? `(${e.localTime})` : ""
									]
								})]
							}, e.id))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400 py-3",
							children: "이번 주 예정된 주요 경제/기업 이벤트가 없습니다."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs font-bold text-slate-400 mb-2 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [currentMonth, "월 캘린더 통계"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-rose-500 font-bold",
								children: [summary.counts.totalThisMonth, "건"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2 rounded-lg bg-rose-500/5 border border-rose-500/15",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-400 block",
										children: "휴장일"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono font-bold text-rose-600 dark:text-rose-400",
										children: [summary.counts.holidays, "일"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2 rounded-lg bg-blue-500/5 border border-blue-500/15",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-400 block",
										children: "경제지표"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono font-bold text-blue-600 dark:text-blue-400",
										children: [summary.counts.economic, "건"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-400 block",
										children: "기업실적"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono font-bold text-emerald-600 dark:text-emerald-400",
										children: [summary.counts.earnings, "건"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2 rounded-lg bg-amber-500/5 border border-amber-500/15",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-400 block",
										children: "배당일정"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono font-bold text-amber-600 dark:text-amber-400",
										children: [summary.counts.dividends, "건"]
									})]
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handlePrev,
							className: "p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer",
							title: "이전 기간",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4 h-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-black text-base sm:text-lg text-slate-900 dark:text-white font-mono px-2",
							children: [
								currentYear,
								"년 ",
								currentMonth,
								"월"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleNext,
							className: "p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer",
							title: "다음 기간",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleToday,
							className: "px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-bold transition-colors cursor-pointer ml-1",
							children: "오늘"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl font-medium",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setMarketFilter("ALL"),
								className: `px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${marketFilter === "ALL" ? "bg-rose-500 text-white font-bold shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
								children: "전체 시장"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setMarketFilter("KR"),
								className: `px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${marketFilter === "KR" ? "bg-indigo-600 text-white font-bold shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
								children: "🇰🇷 한국"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setMarketFilter("US"),
								className: `px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${marketFilter === "US" ? "bg-purple-600 text-white font-bold shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
								children: "🇺🇸 미국"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl font-medium",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setTypeFilter("ALL"),
								className: `px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${typeFilter === "ALL" ? "bg-slate-900 dark:bg-slate-700 text-white font-bold shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
								children: "전체"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setTypeFilter("HOLIDAY"),
								className: `px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${typeFilter === "HOLIDAY" ? "bg-rose-600 text-white font-bold shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
								children: "휴장일"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setTypeFilter("ECONOMIC"),
								className: `px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${typeFilter === "ECONOMIC" ? "bg-blue-600 text-white font-bold shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
								children: "경제지표"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setTypeFilter("EARNINGS"),
								className: `px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${typeFilter === "EARNINGS" ? "bg-emerald-600 text-white font-bold shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
								children: "실적"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setTypeFilter("DIVIDEND"),
								className: `px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${typeFilter === "DIVIDEND" ? "bg-amber-600 text-white font-bold shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
								children: "배당"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden",
				children: [viewMode === "MONTH" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 text-center text-xs font-bold py-3 bg-slate-50/50 dark:bg-slate-800/30",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-rose-500",
							children: "일"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "월" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "화" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "수" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "목" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "금" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-blue-500",
							children: "토"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800/80",
					children: monthDays.map((cell, idx) => {
						const isToday = cell.dateStr === todayStr;
						const isSun = idx % 7 === 0;
						const isSat = idx % 7 === 6;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `min-h-[110px] sm:min-h-[130px] p-1.5 sm:p-2 transition-colors flex flex-col justify-between ${!cell.isCurrentMonth ? "bg-slate-50/40 dark:bg-slate-900/30 opacity-40" : isToday ? "bg-rose-500/5 dark:bg-rose-500/10" : "hover:bg-slate-50/80 dark:hover:bg-slate-800/30"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-xs font-mono font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-rose-500 text-white font-black" : isSun ? "text-rose-500" : isSat ? "text-blue-500" : "text-slate-800 dark:text-slate-200"}`,
									children: cell.dayNum
								}), cell.events.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-mono text-slate-400 font-bold hidden sm:inline",
									children: [cell.events.length, "건"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 overflow-y-auto max-h-[85px] scrollbar-none flex-1",
								children: [cell.events.slice(0, 3).map((e) => {
									const badge = getTypeBadge(e.type);
									const isWatch = e.symbol && watchlist.includes(e.symbol);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										onClick: () => setSelectedEvent(e),
										className: `px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-medium border truncate cursor-pointer transition-transform hover:scale-[1.02] flex items-center gap-1 ${badge.bg}`,
										title: `${e.title} (${e.timeKST})`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold shrink-0",
												children: e.market === "US" ? "US" : "KR"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: e.title
											}),
											isWatch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "w-2.5 h-2.5 fill-amber-500 text-amber-500 shrink-0 ml-auto" })
										]
									}, e.id);
								}), cell.events.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: () => {
										setCurrentDate(new Date(cell.dateStr));
										setViewMode("DAY");
									},
									className: "text-[10px] text-slate-400 font-bold text-center hover:text-rose-500 cursor-pointer pt-0.5",
									children: [
										"+",
										cell.events.length - 3,
										"건 더보기"
									]
								})]
							})]
						}, cell.dateStr);
					})
				})] }), (viewMode === "WEEK" || viewMode === "DAY") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 sm:p-6 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: viewMode === "WEEK" ? "주간 일정 타임라인" : `${currentDate.toISOString().slice(0, 10)} 일간 세부 일정` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"총 ",
							events.length,
							"개 일정 등록됨"
						] })]
					}), events.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-slate-100 dark:divide-slate-800",
						children: events.map((e) => {
							const badge = getTypeBadge(e.type);
							const isWatch = e.symbol && watchlist.includes(e.symbol);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => setSelectedEvent(e),
								className: "py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 px-3 rounded-xl transition-colors cursor-pointer group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start sm:items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-center font-mono shrink-0 w-14",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-rose-500 block",
											children: e.date.slice(5)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-slate-400 block",
											children: e.timeKST
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 flex-wrap",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-[10px] font-bold px-1.5 py-0.2 rounded border font-mono ${badge.bg}`,
												children: badge.label
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
												children: e.market
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors",
												children: e.title
											}),
											e.status === "CONFIRMED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
												children: "확정"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
												children: "예정"
											}),
											isWatch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 flex items-center gap-0.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "w-2.5 h-2.5 fill-amber-500" }), "관심종목"]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-400 mt-1 line-clamp-1",
										children: e.description || e.source
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right text-xs font-mono shrink-0 self-end sm:self-center",
									children: [
										e.forecast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-slate-500 dark:text-slate-400",
											children: ["예상치: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-slate-800 dark:text-slate-200",
												children: e.forecast
											})]
										}),
										e.dividendAmount && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-amber-600 font-bold",
											children: ["배당금: ", e.dividendAmount]
										}),
										e.localTime && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-slate-400",
											children: ["현지: ", e.localTime]
										})
									]
								})]
							}, e.id);
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-16 text-center text-xs text-slate-400",
						children: "선택한 기간과 필터에 해당하는 일정이 없습니다."
					})]
				})]
			}),
			selectedEvent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150",
				onClick: () => setSelectedEvent(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-lg bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-100",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mb-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-[10px] font-bold px-2 py-0.5 rounded border ${getTypeBadge(selectedEvent.type).bg}`,
										children: getTypeBadge(selectedEvent.type).label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
										children: selectedEvent.market
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-bold text-slate-400",
										children: ["중요도: ", selectedEvent.importance]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-black text-slate-900 dark:text-white",
								children: selectedEvent.title
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedEvent(null),
								className: "p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs font-mono",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-400 block text-[11px]",
									children: "일정 날짜 (KST)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-slate-900 dark:text-white text-sm",
									children: selectedEvent.date
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-400 block text-[11px]",
									children: "발표 시각"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-slate-900 dark:text-white text-sm",
									children: selectedEvent.timeKST
								})] }),
								selectedEvent.localTime && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 block text-[11px]",
										children: "미국 현지 시간 (서머타임 자동 계산)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-700 dark:text-slate-300",
										children: selectedEvent.localTime
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs space-y-2 text-slate-600 dark:text-slate-300",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "leading-relaxed bg-slate-50/50 dark:bg-slate-800/20 p-3 rounded-xl border border-slate-100 dark:border-slate-800",
									children: selectedEvent.description || "공식 세부 설명이 제공되지 않는 일정입니다."
								}),
								(selectedEvent.forecast || selectedEvent.previous || selectedEvent.actual) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl font-mono text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400 block",
											children: "이전치"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold",
											children: selectedEvent.previous || "-"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400 block",
											children: "시장 예상치"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-blue-500",
											children: selectedEvent.forecast || "-"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400 block",
											children: "실제 발표치"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-rose-500",
											children: selectedEvent.actual || "대기 중"
										})] })
									]
								}),
								selectedEvent.dividendAmount && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-700 dark:text-amber-400 font-mono",
									children: [
										"주당 배당금: ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selectedEvent.dividendAmount }),
										" (예상 수익률: ",
										selectedEvent.dividendYield || "-",
										")"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 space-y-1 bg-slate-50/50 dark:bg-slate-800/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "데이터 출처" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-slate-700 dark:text-slate-300",
									children: selectedEvent.source
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "일정 상태" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `font-bold ${selectedEvent.status === "CONFIRMED" ? "text-emerald-500" : "text-amber-500"}`,
									children: selectedEvent.status === "CONFIRMED" ? "공식 확정 일정" : "예정 일정 (변경 가능)"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pt-2",
							children: [selectedEvent.symbol ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									navigateToStock(selectedEvent.symbol);
									setSelectedEvent(null);
								},
								className: "flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3.5 h-3.5 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [selectedEvent.symbolName || selectedEvent.symbol, " 종목 상세 보기"] })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedEvent(null),
								className: "px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer",
								children: "닫기"
							})]
						})
					]
				})
			}),
			isAlertModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150",
				onClick: () => setIsAlertModalOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-100",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-5 h-5 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-black text-slate-900 dark:text-white",
									children: "증시 캘린더 사전 알림 설정"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setIsAlertModalOpen(false),
								className: "p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-sm text-slate-900 dark:text-white block",
								children: "캘린더 사전 알림 켜기"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-slate-400",
								children: "주요 경제 지표 및 실적 발표 전 미리 알림 수신"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: alertSettings.enabled,
								onChange: (e) => setAlertSettings((prev) => ({
									...prev,
									enabled: e.target.checked
								})),
								className: "w-5 h-5 accent-rose-600 rounded cursor-pointer"
							})]
						}),
						alertSettings.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-slate-700 dark:text-slate-300 block mb-2",
									children: "⏰ 알림 발송 시점 선택"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-3 gap-2",
									children: [
										"1d",
										"1h",
										"15m"
									].map((timing) => {
										const isSelected = alertSettings.timings.includes(timing);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												setAlertSettings((prev) => ({
													...prev,
													timings: isSelected ? prev.timings.filter((t) => t !== timing) : [...prev.timings, timing]
												}));
											},
											className: `p-2.5 rounded-xl border font-bold transition-all cursor-pointer text-center ${isSelected ? "bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400" : "border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`,
											children: {
												"1d": "1일 전 (24h)",
												"1h": "1시간 전",
												"15m": "15분 전"
											}[timing]
										}, timing);
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-slate-700 dark:text-slate-300 block mb-2",
									children: "📌 수신할 이벤트 유형"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [
										{
											id: "HOLIDAY",
											label: "휴장일"
										},
										{
											id: "ECONOMIC",
											label: "경제지표 (FOMC/CPI)"
										},
										{
											id: "EARNINGS",
											label: "기업 실적 발표"
										},
										{
											id: "DIVIDEND",
											label: "배당락 / 배당일"
										}
									].map((t) => {
										const isChecked = alertSettings.types.includes(t.id);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: isChecked,
												onChange: () => {
													setAlertSettings((prev) => ({
														...prev,
														types: isChecked ? prev.types.filter((item) => item !== t.id) : [...prev.types, t.id]
													}));
												},
												className: "w-4 h-4 accent-rose-600 rounded"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-slate-700 dark:text-slate-300",
												children: t.label
											})]
										}, t.id);
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-900 dark:text-white block",
										children: "⭐ 관심종목 실적/배당 우선 알림"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-slate-400",
										children: "등록한 관심종목의 일정만 선별하여 알림 발송"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: alertSettings.watchlistOnly,
										onChange: (e) => setAlertSettings((prev) => ({
											...prev,
											watchlistOnly: e.target.checked
										})),
										className: "w-4 h-4 accent-amber-500 rounded cursor-pointer"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-900 dark:text-white block",
										children: "웹 브라우저 푸시 알림"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-slate-400",
										children: "앱을 닫은 상태에서도 브라우저 푸시 수신"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: handleRequestPushPermission,
										className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${alertSettings.browserPushEnabled ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-rose-500 hover:text-white"}`,
										children: alertSettings.browserPushEnabled ? "권한 허용됨" : "권한 요청"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsAlertModalOpen(false),
								className: "px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
								children: "취소"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleSaveAlertSettings,
								disabled: isSavingSettings,
								className: "px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20 cursor-pointer disabled:opacity-50",
								children: isSavingSettings ? "저장 중..." : "설정 저장"
							})]
						})
					]
				})
			})
		]
	});
};
//#endregion
export { CalendarView };
