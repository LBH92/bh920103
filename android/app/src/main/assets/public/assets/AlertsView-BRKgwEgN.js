import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { A as Smartphone, C as Target, G as RefreshCw, Gt as CircleAlert, Ht as Clock, It as DollarSign, K as Radio, M as SlidersVertical, V as Send, Wt as CircleCheck, Xt as Check, Z as Pen, Zt as CheckCheck, _ as TrendingDown, bn as require_react, et as Newspaper, g as TrendingUp, ln as Bell, q as Plus, qt as ChevronRight, r as Zap, s as Volume2, v as Trash2, yn as Activity } from "./vendor-lucide-Dji_Ij8j.js";
import { S as inferStockCurrency, a as notificationService, i as fcmPushService, n as useApp, p as dedupeById, v as formatMoney } from "./AppContext-Butl4QWq.js";
import { t as SetPriceAlertModal } from "./SetPriceAlertModal-E_j0oHhv.js";
import { t as WatchlistNotificationSettingsModal } from "./WatchlistNotificationSettingsModal-pcQ4Mu3a.js";
//#region src/components/alerts/AlertsView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var AlertsView = () => {
	const { stocks, watchlist, navigateToStock, setActiveTab, showToast, user, priceAlerts, addPriceAlert, removePriceAlert, togglePriceAlert } = useApp();
	const [activeMainTab, setActiveMainTab] = (0, import_react.useState)("price_alerts");
	const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = (0, import_react.useState)(false);
	const [modalStock, setModalStock] = (0, import_react.useState)(null);
	const [isWatchlistSettingsOpen, setIsWatchlistSettingsOpen] = (0, import_react.useState)(false);
	const [pushStatus, setPushStatus] = (0, import_react.useState)(null);
	const [isTogglingPush, setIsTogglingPush] = (0, import_react.useState)(false);
	const [isSendingTestPush, setIsSendingTestPush] = (0, import_react.useState)(false);
	const [notifications, setNotifications] = (0, import_react.useState)([]);
	const [readFilter, setReadFilter] = (0, import_react.useState)("all");
	const [isLoadingNotifs, setIsLoadingNotifs] = (0, import_react.useState)(true);
	const [rules, setRules] = (0, import_react.useState)([]);
	const [isRuleModalOpen, setIsRuleModalOpen] = (0, import_react.useState)(false);
	const [editingRule, setEditingRule] = (0, import_react.useState)(null);
	const [editValue, setEditValue] = (0, import_react.useState)(5);
	const [editEnabled, setEditEnabled] = (0, import_react.useState)(true);
	const [ruleSymbol, setRuleSymbol] = (0, import_react.useState)(stocks[0]?.symbol || "005930");
	const [ruleType, setRuleType] = (0, import_react.useState)("price_rise");
	const [ruleValue, setRuleValue] = (0, import_react.useState)(5);
	const loadData = async () => {
		setIsLoadingNotifs(true);
		try {
			const [notifsData, rulesData] = await Promise.all([notificationService.getNotifications(user?.id), notificationService.getUserAlertRules(user?.id)]);
			setNotifications(dedupeById(notifsData));
			setRules(dedupeById(rulesData));
		} catch (err) {
			console.warn("[AlertsView] loadData error:", err);
		} finally {
			setIsLoadingNotifs(false);
		}
	};
	const loadPushStatus = async () => {
		try {
			const status = await fcmPushService.getStatus(user?.id);
			setPushStatus(status);
		} catch (err) {
			console.warn("[AlertsView] loadPushStatus error:", err);
		}
	};
	const handleTogglePush = async () => {
		if (!user?.id) {
			showToast("로그인 후 푸시 알림을 설정할 수 있습니다.", "warning");
			return;
		}
		setIsTogglingPush(true);
		try {
			if (pushStatus?.enabled) {
				await fcmPushService.disablePush(user.id);
				showToast("전체 푸시 알림이 비활성화되었습니다.", "info");
			} else {
				const res = await fcmPushService.enablePush(user.id);
				if (res.success) showToast("전체 푸시 알림(FCM Web Push)이 성공적으로 활성화되었습니다!", "success");
				else showToast(res.error || "푸시 알림 활성화에 실패했습니다.", "error");
			}
			await loadPushStatus();
		} catch (err) {
			showToast(err.message || "푸시 알림 상태 변경 실패", "error");
		} finally {
			setIsTogglingPush(false);
		}
	};
	const handleSendTestPush = async () => {
		if (!user?.id) {
			showToast("로그인이 필요합니다.", "warning");
			return;
		}
		if (!pushStatus?.enabled) {
			showToast("먼저 전체 푸시 알림을 켜주세요.", "warning");
			return;
		}
		setIsSendingTestPush(true);
		try {
			const res = await fcmPushService.triggerTestPush(user.id);
			if (res.success) showToast(res.message || "테스트 푸시가 성공적으로 전송되었습니다!", "success");
			else showToast(res.message || "테스트 푸시 전송 실패", "error");
		} catch {
			showToast("테스트 푸시 요청 중 오류가 발생했습니다.", "error");
		} finally {
			setIsSendingTestPush(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadData();
		loadPushStatus();
		const interval = setInterval(() => {
			notificationService.getNotifications(user?.id).then((res) => setNotifications(dedupeById(res))).catch(() => {});
		}, 5e3);
		return () => clearInterval(interval);
	}, [user?.id]);
	const handleTypeChange = (newType) => {
		setRuleType(newType);
		switch (newType) {
			case "price_rise":
				setRuleValue(5);
				break;
			case "price_fall":
				setRuleValue(3);
				break;
			case "volume_spike":
				setRuleValue(200);
				break;
			case "trading_value_spike":
				setRuleValue(3e3);
				break;
			case "related_news":
				setRuleValue(1);
				break;
			case "market_event": setRuleValue(2);
		}
	};
	const handleCreateRule = async (e) => {
		e.preventDefault();
		const st = stocks.find((s) => s.symbol === ruleSymbol);
		const isMarket = ruleType === "market_event" || ruleSymbol === "MARKET";
		try {
			const newRule = await notificationService.addUserAlertRule({
				uid: user?.id || "demo-user-1",
				symbol: isMarket ? "MARKET" : st?.symbol || ruleSymbol,
				symbolName: isMarket ? "국내 증시 전체" : st?.name || ruleSymbol,
				type: ruleType,
				value: Number(ruleValue),
				condition: ruleType === "price_fall" ? "below" : "above",
				enabled: true
			});
			setRules((prev) => dedupeById([newRule, ...prev]));
			setIsRuleModalOpen(false);
			showToast(`${newRule.symbolName} [${getAlertTypeName(ruleType)}] 알림 조건(${ruleValue}${getAlertUnit(ruleType)})이 등록되었습니다.`, "success");
		} catch {
			showToast("알림 조건 등록에 실패했습니다.", "error");
		}
	};
	const handleOpenEditRule = (rule) => {
		setEditingRule(rule);
		setEditValue(rule.value);
		setEditEnabled(rule.enabled);
	};
	const handleUpdateRule = async (e) => {
		e.preventDefault();
		if (!editingRule) return;
		try {
			await notificationService.updateUserAlertRule(editingRule.id, {
				value: Number(editValue),
				enabled: editEnabled
			});
			setRules((prev) => prev.map((r) => r.id === editingRule.id ? {
				...r,
				value: Number(editValue),
				enabled: editEnabled
			} : r));
			setEditingRule(null);
			showToast(`${editingRule.symbolName} [${getAlertTypeName(editingRule.type)}] 기준값(${editValue}${getAlertUnit(editingRule.type)})이 성공적으로 수정되었습니다.`, "success");
		} catch {
			showToast("알림 조건 수정에 실패했습니다.", "error");
		}
	};
	(0, import_react.useEffect)(() => {
		if (watchlist && watchlist.length > 0) notificationService.syncWatchlistForMonitoring(user?.id, watchlist);
	}, [user?.id, watchlist]);
	const handleToggleRule = async (ruleId, currentEnabled) => {
		try {
			await notificationService.updateUserAlertRule(ruleId, { enabled: !currentEnabled });
			setRules((prev) => prev.map((r) => r.id === ruleId ? {
				...r,
				enabled: !currentEnabled
			} : r));
			showToast(`알림 규칙이 ${!currentEnabled ? "활성화" : "일시정지"}되었습니다.`, "info");
		} catch {
			showToast("규칙 상태 변경 실패", "error");
		}
	};
	const handleDeleteRule = async (ruleId) => {
		try {
			await notificationService.deleteUserAlertRule(ruleId);
			setRules((prev) => prev.filter((r) => r.id !== ruleId));
			showToast("알림 규칙이 삭제되었습니다.", "info");
		} catch {
			showToast("규칙 삭제 실패", "error");
		}
	};
	const handleMarkAsRead = async (e, id) => {
		e.stopPropagation();
		await notificationService.markAsRead(id);
		setNotifications((prev) => prev.map((n) => n.id === id ? {
			...n,
			read: true
		} : n));
	};
	const handleMarkAllRead = async () => {
		await notificationService.markAllAsRead(user?.id);
		setNotifications((prev) => prev.map((n) => ({
			...n,
			read: true
		})));
		showToast("모든 알림을 읽음 처리했습니다.", "success");
	};
	const handleDeleteNotification = async (e, id) => {
		e.stopPropagation();
		await notificationService.deleteNotification(id);
		setNotifications((prev) => prev.filter((n) => n.id !== id));
		showToast("알림이 삭제되었습니다.", "info");
	};
	const handleNotificationClick = (notif) => {
		if (!notif.read) {
			notificationService.markAsRead(notif.id);
			setNotifications((prev) => prev.map((n) => n.id === notif.id ? {
				...n,
				read: true
			} : n));
		}
		if (notif.targetType === "market") setActiveTab("insight");
		else if (notif.stockSymbol) navigateToStock(notif.stockSymbol);
	};
	const handleCheckNow = async () => {
		showToast("키움 실시간 API 기반으로 이상 움직임을 검증 중입니다...", "info");
		const res = await notificationService.triggerServerCheck(user?.id, watchlist);
		if (res && res.generatedCount > 0) showToast(`${res.generatedCount}건의 새로운 시장 이상 알림이 포착되었습니다!`, "success");
		else showToast("현재 새로운 이상 변동이 발생하지 않았습니다.", "info");
		loadData();
	};
	const getAlertTypeName = (type) => {
		switch (type) {
			case "price_rise": return "가격 상승";
			case "price_fall": return "가격 하락";
			case "volume_spike": return "거래량 급증";
			case "trading_value_spike": return "거래대금 급증";
			case "related_news": return "관련 뉴스";
			case "market_event": return "시장 이벤트";
			default: return "알림";
		}
	};
	const getAlertUnit = (type) => {
		switch (type) {
			case "price_rise":
			case "price_fall": return "%";
			case "volume_spike": return "%";
			case "trading_value_spike": return "억 원";
			case "related_news": return "";
			case "market_event": return "%";
			default: return "";
		}
	};
	const getAlertBadge = (type) => {
		switch (type) {
			case "price_rise": return {
				label: "가격 상승",
				color: "bg-rose-500/10 text-rose-500 border-rose-500/30",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3.5 h-3.5" })
			};
			case "price_fall": return {
				label: "가격 하락",
				color: "bg-blue-500/10 text-blue-500 border-blue-500/30",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-3.5 h-3.5" })
			};
			case "volume_spike": return {
				label: "거래량 급증",
				color: "bg-amber-500/10 text-amber-500 border-amber-500/30",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-3.5 h-3.5" })
			};
			case "trading_value_spike": return {
				label: "거래대금 폭증",
				color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-3.5 h-3.5" })
			};
			case "related_news": return {
				label: "관련 뉴스",
				color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/30",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, { className: "w-3.5 h-3.5" })
			};
			case "market_event": return {
				label: "시장 이벤트",
				color: "bg-purple-500/10 text-purple-500 border-purple-500/30",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-3.5 h-3.5" })
			};
			default: return {
				label: "시스템",
				color: "bg-slate-100 dark:bg-slate-800 text-slate-600",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-3.5 h-3.5" })
			};
		}
	};
	const unreadCount = notifications.filter((n) => !n.read).length;
	const filteredNotifications = notifications.filter((n) => {
		if (readFilter === "unread") return !n.read;
		if (readFilter === "read") return n.read;
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12 animate-in fade-in duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#131722] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "p-2 rounded-xl bg-amber-500/10 text-amber-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-5 h-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-black text-slate-900 dark:text-white",
							children: "알림 및 감지 센터"
						}),
						unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white animate-pulse",
							children: [unreadCount, "건 읽지 않음"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1",
					children: "관심종목별 알림 조건(가격 상승·하락, 거래량·거래대금 급증, 뉴스, 시장 이벤트)을 직접 설정하고 서버에서 실시간 수신합니다."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 self-start sm:self-center flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setIsWatchlistSettingsOpen(true),
							className: "flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 transition-colors cursor-pointer",
							title: "관심 종목 등락률 급변 브라우저 알림 설정",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-3.5 h-3.5 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "관심종목 급변 알림" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleCheckNow,
							className: "flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer",
							title: "서버에서 알림 조건을 즉시 검증",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "서버 알림 점검" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setIsRuleModalOpen(true),
							className: "flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "새 알림 조건 설정" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#131722] to-slate-900 border border-slate-700/60 shadow-lg text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `p-2.5 rounded-xl shrink-0 ${pushStatus?.enabled ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-slate-800 text-slate-400 border border-slate-700"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-black text-sm text-white",
									children: "실시간 휴대폰 푸시 알림 (FCM Web Push)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `px-2 py-0.5 rounded-full text-[11px] font-bold ${pushStatus?.enabled ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-800 text-slate-400 border border-slate-700"}`,
									children: pushStatus?.enabled ? "● 푸시 수신 중 (ON)" : "○ 푸시 꺼짐 (OFF)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700",
									children: [pushStatus?.platform === "android" ? "🤖 Android" : pushStatus?.platform === "ios" ? "🍎 iPhone" : "💻 Web", pushStatus?.isPwa ? " (PWA 홈 화면)" : ""]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400 mt-1",
							children: "관심종목 급등·급락, 거래량/거래대금 폭증, VI, 사이드카 감지 시 앱이 꺼져 있어도(백그라운드/PWA 종료) 스마트폰으로 즉시 전송됩니다."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5 self-end md:self-center shrink-0",
						children: [pushStatus?.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleSendTestPush,
							disabled: isSendingTestPush,
							className: "flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer disabled:opacity-50",
							title: "등록된 기기로 테스트 푸시 즉시 전송",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-3.5 h-3.5 text-rose-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSendingTestPush ? "발송 중..." : "테스트 푸시 발송" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleTogglePush,
							disabled: isTogglingPush,
							className: `flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-sm ${pushStatus?.enabled ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30" : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: `w-3.5 h-3.5 ${pushStatus?.enabled ? "animate-pulse text-white" : "text-slate-400"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isTogglingPush ? "처리 중..." : pushStatus?.enabled ? "전체 푸시 알림 ON" : "전체 푸시 알림 켜기" })]
						})]
					})]
				}), pushStatus?.platform === "ios" && !pushStatus.isPwa && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 pt-3 border-t border-slate-800 text-[11px] text-amber-300/90 flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"iPhone(iOS 16.4+) 안내: Safari 하단 공유 버튼 [공유] > ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "[홈 화면에 추가]" }),
						" 후 해당 앱을 실행하여 알림을 허용해야 백그라운드 푸시가 정상 수신됩니다."
					] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit flex-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveMainTab("notifications"),
						className: `flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeMainTab === "notifications" ? "bg-white dark:bg-[#1a1f2e] text-slate-900 dark:text-white shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-4 h-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "수신 알림 피드" }),
							unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold",
								children: unreadCount
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveMainTab("price_alerts"),
						className: `flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeMainTab === "price_alerts" ? "bg-white dark:bg-[#1a1f2e] text-slate-900 dark:text-white shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "w-4 h-4 text-amber-500" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "실시간 목표가 알림" }),
							priceAlerts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold",
								children: [priceAlerts.filter((a) => !a.isTriggered && a.enabled !== false).length, "개 감시 중"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveMainTab("rules"),
						className: `flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeMainTab === "rules" ? "bg-white dark:bg-[#1a1f2e] text-slate-900 dark:text-white shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"관심종목 알림 조건 (",
							rules.length,
							"개)"
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveMainTab("push_settings"),
						className: `flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeMainTab === "push_settings" ? "bg-white dark:bg-[#1a1f2e] text-slate-900 dark:text-white shadow-xs" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-4 h-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "푸시 알림 설정" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2 h-2 rounded-full ${pushStatus?.enabled ? "bg-emerald-500" : "bg-slate-400"}` })
						]
					})
				]
			}),
			activeMainTab === "notifications" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setReadFilter("all"),
								className: `px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${readFilter === "all" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`,
								children: [
									"전체 알림 (",
									notifications.length,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setReadFilter("unread"),
								className: `px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${readFilter === "unread" ? "bg-rose-600 text-white" : "text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-rose-500 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"읽지 않음 (",
									unreadCount,
									")"
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setReadFilter("read"),
								className: `px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${readFilter === "read" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`,
								children: [
									"읽음 완료 (",
									notifications.length - unreadCount,
									")"
								]
							})
						]
					}), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleMarkAllRead,
						className: "flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors cursor-pointer self-start sm:self-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "w-3.5 h-3.5 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "모두 읽음 처리" })]
					})]
				}), filteredNotifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-12 text-center bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-slate-700 dark:text-slate-300",
							children: readFilter === "unread" ? "읽지 않은 새로운 알림이 없습니다." : "수신된 알림이 없습니다."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400 mt-1",
							children: "관심종목 알림 조건을 설정하면 서버에서 조건 충족 시 즉각 알림이 등록됩니다."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: filteredNotifications.map((notif) => {
						const badge = getAlertBadge(notif.type);
						const isUnread = !notif.read;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => handleNotificationClick(notif),
							className: `p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isUnread ? "bg-rose-50/20 dark:bg-rose-950/10 border-rose-300 dark:border-rose-900/50 shadow-xs hover:border-rose-400" : "bg-white dark:bg-[#131722] border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 opacity-80 hover:opacity-100"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3.5 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative shrink-0 mt-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `p-2.5 rounded-xl border ${badge.color}`,
										children: badge.icon
									}), isUnread && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white dark:border-[#131722]" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 flex-wrap text-xs",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `px-2 py-0.5 rounded-md font-bold text-[11px] border ${badge.color}`,
													children: badge.label
												}),
												notif.stockName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-bold text-slate-800 dark:text-slate-200",
													children: [notif.stockName, notif.stockSymbol && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-mono text-slate-400 ml-1",
														children: [
															"(",
															notif.stockSymbol,
															")"
														]
													})]
												}),
												notif.metrics?.sidecarStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "px-2 py-0.5 rounded-md font-bold text-[11px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30",
													children: ["사이드카: ", notif.metrics.sidecarStatus]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[11px] font-mono text-slate-400 flex items-center gap-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }),
														"발생: ",
														notif.timestamp
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `px-1.5 py-0.2 rounded text-[10px] font-bold ${isUnread ? "bg-rose-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`,
													children: isUnread ? "읽지 않음" : "읽음"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: `text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors ${isUnread ? "font-black" : ""}`,
											children: notif.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed",
											children: [notif.message, notif.metrics?.price !== void 0 && (() => {
												const matched = notif.stockSymbol ? stocks.find((s) => s.symbol === notif.stockSymbol) : void 0;
												const cur = inferStockCurrency(notif.stockSymbol, matched?.market, matched?.currency);
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "ml-1 font-bold text-slate-900 dark:text-white",
													children: [
														"(당시가: ",
														formatMoney(notif.metrics.price, cur),
														")"
													]
												});
											})()]
										}),
										notif.reason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold bg-rose-500/10 px-2.5 py-1 rounded-lg w-fit mt-1.5 border border-rose-500/20",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold",
												children: "감지 사유:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: notif.reason })]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 shrink-0 self-end sm:self-center",
								children: [
									isUnread && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: (e) => handleMarkAsRead(e, notif.id),
										className: "p-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors cursor-pointer",
										title: "읽음으로 표시",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: (e) => handleDeleteNotification(e, notif.id),
										className: "p-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer",
										title: "알림 삭제",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center text-xs font-bold text-rose-500 group-hover:translate-x-0.5 transition-transform pl-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "상세보기" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4" })]
									})
								]
							})]
						}, notif.id);
					})
				})]
			}),
			activeMainTab === "price_alerts" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-bold text-base text-slate-900 dark:text-white flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "w-4 h-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "종목별 목표가 실시간 알림 (Firestore 동기화)" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400 mt-1",
							children: "원하는 종목의 목표 가격을 설정하면, 실시간 체결 시세가 해당 가격을 돌파하는 순간 화면 상단에 즉각 토스트 알림을 띄웁니다."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								const targetStock = stocks[0] || null;
								setModalStock(targetStock);
								setIsPriceAlertModalOpen(true);
							},
							className: "flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "새 목표가 알림 등록" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-slate-500 dark:text-slate-400",
									children: "총 등록 알림"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xl font-black font-mono text-slate-900 dark:text-white mt-1",
									children: [priceAlerts.length, "건"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-slate-500 dark:text-slate-400",
									children: "실시간 감시 중"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xl font-black font-mono text-amber-500 mt-1 flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-amber-500 animate-pulse" }),
										priceAlerts.filter((a) => !a.isTriggered && a.enabled !== false).length,
										"건"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-slate-500 dark:text-slate-400",
									children: "목표가 도달 완료"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xl font-black font-mono text-emerald-500 mt-1 flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4" }),
										priceAlerts.filter((a) => a.isTriggered).length,
										"건"
									]
								})]
							})
						]
					}),
					priceAlerts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-12 text-center bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "w-6 h-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-bold text-base text-slate-900 dark:text-white",
								children: "등록된 목표가 알림이 없습니다."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto",
								children: "종목 상세 화면 또는 상단 버튼을 통해 목표 가격을 설정해보세요. 실시간 시세가 해당 가격에 도달하면 즉각 토스트 알림을 전송합니다."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									const targetStock = stocks[0] || null;
									setModalStock(targetStock);
									setIsPriceAlertModalOpen(true);
								},
								className: "inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "첫 목표가 알림 설정하기" })]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-3.5",
						children: dedupeById(priceAlerts).map((alert) => {
							const currentStock = stocks.find((s) => s.symbol === alert.symbol);
							const currentPrice = currentStock?.price || 0;
							const diffPct = currentPrice > 0 ? (alert.targetPrice - currentPrice) / currentPrice * 100 : 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `p-4 rounded-2xl border transition-all ${alert.isTriggered ? "bg-emerald-500/5 dark:bg-emerald-950/10 border-emerald-500/30" : alert.enabled === false ? "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60" : "bg-white dark:bg-[#131722] border-slate-200 dark:border-slate-800 hover:border-amber-500/40 shadow-xs"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-3 mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												onClick: () => navigateToStock(alert.symbol),
												className: "font-bold text-base text-slate-900 dark:text-white hover:text-rose-500 cursor-pointer transition-colors",
												children: alert.symbolName
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-mono text-slate-400",
												children: alert.symbol
											})]
										}), alert.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-slate-500 dark:text-slate-400 mt-0.5",
											children: ["메모: ", alert.note]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => togglePriceAlert(alert.id, !alert.enabled),
												className: `px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${alert.enabled !== false ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`,
												title: alert.enabled !== false ? "알림 비활성화" : "알림 활성화",
												children: alert.enabled !== false ? "ON" : "OFF"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => removePriceAlert(alert.id),
												className: "p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer",
												title: "알림 삭제",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/80 mb-3 space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-500 dark:text-slate-400 font-medium",
													children: "알림 조건:"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `px-2 py-0.5 rounded-md font-bold text-[11px] flex items-center gap-1 ${alert.condition === "above" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : "bg-blue-500/10 text-blue-500 border border-blue-500/20"}`,
													children: alert.condition === "above" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "상승 돌파 (이상)" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "하락 도달 (이하)" })] })
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-500 dark:text-slate-400 font-medium",
													children: "설정 목표가:"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-black text-sm text-slate-900 dark:text-white",
													children: formatMoney(alert.targetPrice, inferStockCurrency(alert.symbol, currentStock?.market, currentStock?.currency))
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-500 dark:text-slate-400 font-medium",
													children: "실시간 현재가:"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono font-bold text-xs text-slate-700 dark:text-slate-300",
													children: [currentPrice > 0 ? formatMoney(currentPrice, inferStockCurrency(alert.symbol, currentStock?.market, currentStock?.currency)) : "-", diffPct !== 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: `ml-1.5 text-[11px] ${diffPct > 0 ? "text-rose-500" : "text-blue-500"}`,
														children: [
															"(",
															diffPct > 0 ? `+${diffPct.toFixed(1)}%` : `${diffPct.toFixed(1)}%`,
															")"
														]
													})]
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: alert.isTriggered ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "목표가 도달 완료" }),
												alert.triggeredPrice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono text-slate-400",
													children: [
														"(",
														formatMoney(alert.triggeredPrice, inferStockCurrency(alert.symbol, currentStock?.market, currentStock?.currency)),
														")"
													]
												})
											]
										}) : alert.enabled === false ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-400",
											children: "일시 정지됨"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5 font-bold text-amber-500",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "실시간 호가 감시 중" })]
										}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-400 font-mono text-[10px]",
											children: alert.createdAt
										})]
									})
								]
							}, alert.id);
						})
					})
				]
			}),
			activeMainTab === "rules" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-bold text-base text-slate-900 dark:text-white flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "w-4 h-4 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"관심종목 맞춤 알림 조건 규칙 (",
							rules.length,
							"개 설정됨)"
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-400 mt-1",
						children: "서버가 주식 데이터를 4초 주기로 실시간 검증하며, 직접 입력한 기준치 충족 시 notifications 컬렉션에 자동 저장됩니다."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setIsRuleModalOpen(true),
						className: "flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer self-start sm:self-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "새 조건 추가하기" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
					children: rules.map((rule) => {
						const badge = getAlertBadge(rule.type);
						const currentStock = stocks.find((s) => s.symbol === rule.symbol);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `p-5 rounded-2xl bg-white dark:bg-[#131722] border transition-all space-y-4 ${rule.enabled ? "border-slate-200 dark:border-slate-800 shadow-xs" : "border-slate-200 dark:border-slate-800/60 opacity-60"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `p-2 rounded-xl border ${badge.color}`,
											children: badge.icon
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											onClick: () => rule.symbol !== "MARKET" && navigateToStock(rule.symbol),
											className: `font-bold text-base text-slate-900 dark:text-white ${rule.symbol !== "MARKET" ? "hover:text-rose-500 cursor-pointer" : ""}`,
											children: rule.symbolName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-mono text-slate-400",
											children: rule.symbol
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleOpenEditRule(rule),
											className: "p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer",
											title: "알림 기준값 수정",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-4 h-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleDeleteRule(rule.id),
											className: "p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer",
											title: "규칙 삭제",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-500 dark:text-slate-400 font-medium",
												children: "감지 유형:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `px-2 py-0.5 rounded-md font-bold text-[11px] border ${badge.color}`,
												children: badge.label
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-500 dark:text-slate-400 font-medium",
												children: "설정 기준값:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono font-bold text-slate-900 dark:text-white text-sm",
												children: [
													rule.type === "price_rise" && `+${rule.value}% 이상 상승`,
													rule.type === "price_fall" && `-${Math.abs(rule.value)}% 이하 하락`,
													rule.type === "volume_spike" && `평균 대비 ${rule.value}% 폭증`,
													rule.type === "trading_value_spike" && `${rule.value.toLocaleString()}억 원 이상`,
													rule.type === "related_news" && `공시·속보 발생 시`,
													rule.type === "market_event" && `지수 변동 ±${rule.value}%`
												]
											})]
										}),
										currentStock && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-400",
												children: "현재가:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono font-bold text-slate-700 dark:text-slate-300",
												children: [
													formatMoney(currentStock.price, inferStockCurrency(currentStock.symbol, currentStock.market, currentStock.currency)),
													" (",
													currentStock.changePercent > 0 ? "+" : "",
													currentStock.changePercent,
													"%)"
												]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2 flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-slate-400 font-mono",
										children: "중복 방지 3분 쿨다운"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleToggleRule(rule.id, rule.enabled),
										className: `px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${rule.enabled ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`,
										children: rule.enabled ? "감시 활성 (ON)" : "일시정지 (OFF)"
									})]
								})
							]
						}, rule.id);
					})
				})]
			}),
			activeMainTab === "push_settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-6 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `p-3 rounded-2xl ${pushStatus?.enabled ? "bg-rose-500/10 text-rose-500" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-8 h-8" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg font-black text-slate-900 dark:text-white",
										children: "전체 푸시 알림 (FCM Web Push)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-500 dark:text-slate-400 mt-1",
										children: "휴대폰(Android/iPhone PWA) 및 PC 브라우저로 실시간 주가 급등락, 거래량 폭증, VI, 사이드카 알림을 수신합니다."
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: handleTogglePush,
										disabled: isTogglingPush,
										className: `px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-2 ${pushStatus?.enabled ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30" : "bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white dark:text-slate-200"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: `w-3.5 h-3.5 ${pushStatus?.enabled ? "animate-pulse text-white" : "text-slate-400"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isTogglingPush ? "처리 중..." : pushStatus?.enabled ? "전체 푸시 활성화됨 (ON)" : "전체 푸시 알림 켜기" })]
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-400 block text-[11px] mb-1",
											children: "브라우저 알림 권한"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `font-bold text-sm ${pushStatus?.permission === "granted" ? "text-emerald-500" : "text-amber-500"}`,
											children: pushStatus?.permission === "granted" ? "✓ 허용됨 (Active)" : pushStatus?.permission === "denied" ? "✕ 차단됨" : "! 요청 대기"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-400 block text-[11px] mb-1",
											children: "접속 기기 환경"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-sm text-slate-800 dark:text-slate-200",
											children: [pushStatus?.platform === "android" ? "🤖 Android" : pushStatus?.platform === "ios" ? "🍎 iPhone" : "💻 데스크톱/웹", pushStatus?.isPwa ? " (PWA 홈 화면)" : ""]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-400 block text-[11px] mb-1",
											children: "FCM 토큰 발급 상태"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `font-bold text-sm ${pushStatus?.token ? "text-emerald-500" : "text-slate-400"}`,
											children: pushStatus?.token ? "✓ 발급 및 서버 등록 완료" : "미등록 (알림 켜기 필요)"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-400 block text-[11px] mb-1",
											children: "백그라운드 / 앱 종료 수신"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `font-bold text-sm ${pushStatus?.supported ? "text-emerald-500" : "text-amber-500"}`,
											children: pushStatus?.supported ? "✓ Service Worker 대기" : "미지원"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-bold text-slate-900 dark:text-white text-xs",
									children: "실제 기기 푸시 수신 테스트"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-slate-500 dark:text-slate-400 mt-0.5",
									children: "현재 등록된 기기로 서버에서 실제 FCM 테스트 푸시 알림을 즉시 발송합니다."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: handleSendTestPush,
									disabled: isSendingTestPush || !pushStatus?.enabled,
									className: "px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-40 shrink-0 flex items-center gap-1.5 shadow-sm shadow-rose-600/20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSendingTestPush ? "전송 중..." : "테스트 푸시 발송" })]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-6 rounded-2xl bg-white dark:bg-[#131722] border border-amber-500/30 dark:border-amber-500/20 shadow-xs space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "p-2.5 rounded-xl bg-amber-500/10 text-amber-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-5 h-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base font-bold text-slate-900 dark:text-white",
										children: "관심 종목 등락률 급변 브라우저 알림 (Notification API)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
										children: "Firestore 동기화"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-500 dark:text-slate-400 mt-1",
									children: "등록된 관심종목의 실시간 주가 급등(+3% 등) 및 급락(-3% 등), 거래량 폭증 발생 시 OS 네이티브 알림과 부드러운 웹 신디사이저 효과음을 전송합니다."
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setIsWatchlistSettingsOpen(true),
								className: "px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all cursor-pointer shadow-sm flex items-center gap-1.5 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "관심종목 알림 상세 설정" })]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-base",
									children: "🤖"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-bold text-slate-900 dark:text-white",
									children: "Android PWA 설치 및 수신 안내"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "text-slate-500 dark:text-slate-400 space-y-1.5 list-disc list-inside text-[11px] leading-relaxed",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Chrome 또는 삼성 인터넷에서 우측 상단 메뉴 > ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "[홈 화면에 추가]" }),
										" 또는 ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "[앱 설치]" }),
										"를 탭합니다."
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "홈 화면의 병돌 인베스트먼트 아이콘으로 실행하면 완벽한 네이티브 앱 환경으로 동작합니다." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "앱이 종료되어 있거나 백그라운드 상태여도 키움 시장 이상 알림이 즉각 팝업 푸시로 수신됩니다." })
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-base",
									children: "🍎"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-bold text-slate-900 dark:text-white",
									children: "iPhone(iOS 16.4+) PWA Web Push 안내"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "text-slate-500 dark:text-slate-400 space-y-1.5 list-disc list-inside text-[11px] leading-relaxed",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Apple iOS 정책상 Safari 하단 공유 버튼(네모+화살표) > ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "[홈 화면에 추가]" }),
										"를 진행해야 웹 푸시가 활성화됩니다."
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "홈 화면에 생성된 '병돌 인베스트먼트' 앱을 실행한 후 [전체 푸시 알림 켜기]를 눌러 알림 권한을 허용해주세요." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "화면이 꺼져 있거나 잠금 상태에서도 iOS 알림 센터와 배너로 푸시가 정상 전달됩니다." })
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
							className: "font-bold text-slate-700 dark:text-slate-300",
							children: "🔒 보안 및 중복 수신 방지 원칙"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-3 gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-800 dark:text-slate-200 block mb-0.5",
										children: "서버 보안 비밀키 격리"
									}), "FCM 서버 키는 백엔드 메모리에만 보관되며 클라이언트 번들에 절대 노출되지 않습니다."]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-800 dark:text-slate-200 block mb-0.5",
										children: "로그아웃 시 토큰 무효화"
									}), "계정 로그아웃 시 기존 UID의 FCM 토큰이 즉시 삭제되어 타인 계정 알림 수신이 완벽 차단됩니다."]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-800 dark:text-slate-200 block mb-0.5",
										children: "3~5분 쿨다운 중복 방지"
									}), "동일 종목 동일 이상 변동에 대해 5분 쿨다운을 적용하여 알림 폭탄 및 배터리 소모를 방지합니다."]
								})
							]
						})]
					})
				]
			}),
			isRuleModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "w-5 h-5 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-base text-slate-900 dark:text-white",
								children: "관심종목 알림 조건 등록"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setIsRuleModalOpen(false),
							className: "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer",
							children: "✕"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreateRule,
						className: "space-y-4 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-bold text-slate-700 dark:text-slate-300 block mb-1",
								children: "대상 종목 선택"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: ruleSymbol,
								onChange: (e) => setRuleSymbol(e.target.value),
								className: "w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
										label: "관심 종목",
										children: stocks.filter((s) => watchlist.includes(s.symbol)).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: s.symbol,
											children: [
												"★ ",
												s.name,
												" (",
												s.symbol,
												") - ",
												s.market
											]
										}, s.symbol))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
										label: "전체 종목",
										children: stocks.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: s.symbol,
											children: [
												s.name,
												" (",
												s.symbol,
												") - ",
												s.market
											]
										}, s.symbol))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
										label: "시장 전체",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "MARKET",
											children: "🏛️ 국내 증시 전체 (KOSPI/KOSDAQ)"
										})
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-bold text-slate-700 dark:text-slate-300 block mb-1.5",
								children: "알림 종류 선택 (6가지)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => handleTypeChange("price_rise"),
										className: `p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${ruleType === "price_rise" ? "bg-rose-500/10 border-rose-500 text-rose-500 shadow-2xs" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "가격 상승" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => handleTypeChange("price_fall"),
										className: `p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${ruleType === "price_fall" ? "bg-blue-500/10 border-blue-500 text-blue-500 shadow-2xs" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "가격 하락" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => handleTypeChange("volume_spike"),
										className: `p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${ruleType === "volume_spike" ? "bg-amber-500/10 border-amber-500 text-amber-500 shadow-2xs" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "거래량 급증" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => handleTypeChange("trading_value_spike"),
										className: `p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${ruleType === "trading_value_spike" ? "bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-2xs" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "거래대금 급증" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => handleTypeChange("related_news"),
										className: `p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${ruleType === "related_news" ? "bg-indigo-500/10 border-indigo-500 text-indigo-500 shadow-2xs" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "관련 뉴스" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => handleTypeChange("market_event"),
										className: `p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${ruleType === "market_event" ? "bg-purple-500/10 border-purple-500 text-purple-500 shadow-2xs" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "시장 이벤트" })]
									})
								]
							})] }),
							ruleType !== "related_news" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "font-bold text-slate-700 dark:text-slate-300 block mb-1",
									children: [
										"사용자 직접 기준값 입력 (",
										getAlertUnit(ruleType),
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										step: ruleType === "trading_value_spike" ? "500" : "0.5",
										value: ruleValue,
										onChange: (e) => setRuleValue(Number(e.target.value)),
										className: "w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm font-bold text-slate-900 dark:text-white",
										placeholder: "기준값을 입력하세요",
										required: true
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute right-3.5 top-2.5 text-xs font-bold text-slate-400 font-mono",
										children: getAlertUnit(ruleType)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-slate-400 mt-1",
									children: [
										ruleType === "price_rise" && `예: 5 입력 시 등락률 +5.0% 이상 돌파할 때 알림`,
										ruleType === "price_fall" && `예: 3 입력 시 등락률 -3.0% 이하 급락할 때 알림`,
										ruleType === "volume_spike" && `예: 200 입력 시 20일 평균 거래량 대비 200% 이상일 때 알림`,
										ruleType === "trading_value_spike" && `예: 3000 입력 시 거래대금 3,000억 원 이상일 때 알림`,
										ruleType === "market_event" && `예: 2 입력 시 지수 변동폭 ±2.0% 이상일 때 알림`
									]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] leading-relaxed",
								children: [
									"🛡️ ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "중복 알림 방지 적용:" }),
									" 동일 종목의 동일 이벤트는 3분 동안 중복 발생하지 않도록 서버에서 제어합니다."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setIsRuleModalOpen(false),
									className: "px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer",
									children: "취소"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "px-5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-sm cursor-pointer",
									children: "알림 조건 저장"
								})]
							})
						]
					})]
				})
			}),
			editingRule && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-5 h-5 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-base text-slate-900 dark:text-white",
								children: "알림 기준값 수정"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setEditingRule(null),
							className: "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer",
							children: "✕"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleUpdateRule,
						className: "space-y-4 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-900 dark:text-white text-sm",
										children: editingRule.symbolName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs text-slate-400",
										children: editingRule.symbol
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500",
										children: "감지 유형:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-800 dark:text-slate-200",
										children: getAlertTypeName(editingRule.type)
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "font-bold text-slate-700 dark:text-slate-300 block mb-1",
									children: [
										"새로운 기준값 입력 (",
										getAlertUnit(editingRule.type),
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										step: editingRule.type === "trading_value_spike" ? "500" : "0.5",
										value: editValue,
										onChange: (e) => setEditValue(Number(e.target.value)),
										className: "w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm font-bold text-slate-900 dark:text-white",
										placeholder: "새로운 기준값을 입력하세요",
										required: true
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute right-3.5 top-2.5 text-xs font-bold text-slate-400 font-mono",
										children: getAlertUnit(editingRule.type)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-slate-400 mt-1",
									children: [
										editingRule.type === "price_rise" && `예: 7 입력 시 전일 대비 +7.0% 이상 돌파할 때 알림`,
										editingRule.type === "price_fall" && `예: 4 입력 시 전일 대비 -4.0% 이하 급락할 때 알림`,
										editingRule.type === "volume_spike" && `예: 250 입력 시 20일 평균 거래량 대비 250% 이상일 때 알림`,
										editingRule.type === "trading_value_spike" && `예: 5000 입력 시 거래대금 5,000억 원 이상일 때 알림`,
										editingRule.type === "market_event" && `예: 3 입력 시 지수 변동폭 ±3.0% 이상일 때 알림`
									]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-slate-700 dark:text-slate-300",
									children: "알림 감시 활성화 여부"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setEditEnabled(!editEnabled),
									className: `px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${editEnabled ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`,
									children: editEnabled ? "활성 (ON)" : "일시정지 (OFF)"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setEditingRule(null),
									className: "px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer",
									children: "취소"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm cursor-pointer",
									children: "수정 내용 저장"
								})]
							})
						]
					})]
				})
			}),
			modalStock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SetPriceAlertModal, {
				isOpen: isPriceAlertModalOpen,
				onClose: () => {
					setIsPriceAlertModalOpen(false);
					setModalStock(null);
				},
				symbol: modalStock.symbol,
				symbolName: modalStock.name,
				currentPrice: modalStock.price
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WatchlistNotificationSettingsModal, {
				isOpen: isWatchlistSettingsOpen,
				onClose: () => setIsWatchlistSettingsOpen(false)
			})
		]
	});
};
//#endregion
export { AlertsView };
