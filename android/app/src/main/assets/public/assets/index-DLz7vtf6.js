const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/StockDetailView-D1ln9Gey.js","assets/rolldown-runtime-DC62tzP2.js","assets/vendor-react-C0yHVa2Y.js","assets/vendor-lucide-Dji_Ij8j.js","assets/AppContext-Butl4QWq.js","assets/vendor-firebase-Dm4AYEor.js","assets/firebase-fxPuKVc_.js","assets/dist-DItgYJMn.js","assets/preload-helper-CWTytNQo.js","assets/SetPriceAlertModal-E_j0oHhv.js","assets/marketThresholds-D6T0muT1.js","assets/marketMonitorClient-BziKZ1BT.js","assets/VirtualHoldingModal-qItoljeC.js","assets/StockCommunitySection-B9XzrTDW.js","assets/AdSlot-CzgsWb47.js","assets/PostEditorModal-Bxu4oV5j.js","assets/newsService-BQGP30E2.js","assets/useStockPurchases-Br6d2qyD.js","assets/HomeView-Wmkk40V9.js","assets/MiniSparkline-CbjReGLJ.js","assets/MarketHeatmap-DFljYyAD.js","assets/StockListView-DMCXclfE.js","assets/WatchlistView-M-timspJ.js","assets/WatchlistNotificationSettingsModal-pcQ4Mu3a.js","assets/CommunityView-BI9DxwYb.js","assets/PostDetailView-x4AhyEP0.js","assets/ChatView-BODKkNNU.js","assets/AlertsView-BRKgwEgN.js","assets/StockInsightView-4MVvR8_s.js","assets/UserAiSettingsModal-CGVmO5w6.js","assets/ProfileView-Cjz6aWyj.js","assets/MyInquiries-cjHqRZ5K.js","assets/AdminView-COJtbT4u.js","assets/insightService-CaAN3h8_.js","assets/NewsView-D1ftdGGg.js","assets/StockRankingView-CoPE3c0f.js","assets/IndexDetailView-B4n8pc4u.js","assets/PortfolioView-Byc0P3GE.js","assets/vendor-recharts-Bm5JVR1s.js","assets/StockComparisonView-CexNNUyq.js","assets/CalendarView-CKU4TIIN.js","assets/InquiryPage-Ce1f9xdM.js","assets/MiniGames-DzF_aUUp.js","assets/StaticPageView-UVQhun44.js","assets/PublicInsightsView-BTeI8eyQ.js","assets/esm-Ckt4DfsE.js","assets/adMobService-B3mU9wZJ.js","assets/web-DZCmOce9.js"])))=>i.map(i=>d[i]);
import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime, r as require_client } from "./vendor-react-C0yHVa2Y.js";
import { $t as ChartNoAxesColumn, At as Flag, B as Server, Dt as Gamepad2, Et as Globe, F as ShieldCheck, G as RefreshCw, Gt as CircleAlert, H as Search, Ht as Clock, I as ShieldAlert, It as DollarSign, Jt as ChevronLeft, Kt as ChevronUp, Nt as Eye, P as Shield, Pt as EyeOff, Rt as CornerDownLeft, St as House, T as Sun, Ut as CircleQuestionMark, V as Send, Vt as Coins, Wt as CircleCheck, Xt as Check, Yt as ChevronDown, _ as TrendingDown, _n as ArrowDown, an as Briefcase, bn as require_react, bt as Info, cn as BookOpen, ct as Menu, ft as Mail, g as TrendingUp, gt as LoaderCircle, h as TriangleAlert, ht as Lock, i as X, it as Minus, jt as FileText, k as Smile, kt as Flame, ln as Bell, mt as LogIn, o as VolumeX, ot as MessageSquare, pn as ArrowUpRight, pt as LogOut, q as Plus, qt as ChevronRight, rt as Moon, sn as Bookmark, tn as Calendar, tt as Network, u as User, ut as Maximize2, v as Trash2, vn as ArrowDownRight, vt as Layers, xt as Image, yn as Activity, yt as Key, zt as Copy } from "./vendor-lucide-Dji_Ij8j.js";
import { F as updateProfile, M as signInWithEmailAndPassword, N as signInWithPopup, S as doc, c as getDoc, g as setDoc, h as runTransaction, k as createUserWithEmailAndPassword, m as query, s as deleteDoc, u as getDocs, x as collection, y as where } from "./vendor-firebase-Dm4AYEor.js";
import { a as googleProvider, i as db, r as auth } from "./firebase-fxPuKVc_.js";
import { A as formatChatTime, C as inferStockExchange, E as getStockUniqueKey, L as getKstDateKey, M as formatKST, O as formatChatDividerDate, S as inferStockCurrency, T as validateExchangeRate, a as notificationService, c as isChosungQuery, f as firebaseRepository, k as formatChatExactDateTime, n as useApp, o as stockRepository, p as dedupeById, r as crashlyticsService, s as extractChosung, t as AppProvider, u as storageService, v as formatMoney, w as roundByCurrency, x as inferFiatCurrency } from "./AppContext-Butl4QWq.js";
import { r as registerPlugin, t as Capacitor } from "./dist-DItgYJMn.js";
import { t as __vitePreload } from "./preload-helper-CWTytNQo.js";
//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region src/context/TimeContext.tsx
var import_client = require_client();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var TimeContext = (0, import_react.createContext)(null);
var TimeProvider = ({ children }) => {
	const [now, setNow] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	(0, import_react.useEffect)(() => {
		const timer = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
		return () => clearInterval(timer);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeContext.Provider, {
		value: {
			now,
			formatted: formatKST(now)
		},
		children
	});
};
var useTime = () => {
	const context = (0, import_react.useContext)(TimeContext);
	if (!context) throw new Error("useTime must be used within TimeProvider");
	return context;
};
//#endregion
//#region src/components/common/KiwoomConfigModal.tsx
var KiwoomConfigModal = ({ isOpen, onClose, onSuccess }) => {
	const [appKey, setAppKey] = (0, import_react.useState)("");
	const [appSecret, setAppSecret] = (0, import_react.useState)("");
	const [isMock, setIsMock] = (0, import_react.useState)(false);
	const [showSecret, setShowSecret] = (0, import_react.useState)(false);
	const [registeredIpInput, setRegisteredIpInput] = (0, import_react.useState)("");
	const [copiedIp, setCopiedIp] = (0, import_react.useState)(false);
	const [showCloudNatGuide, setShowCloudNatGuide] = (0, import_react.useState)(false);
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [isFetchingStatus, setIsFetchingStatus] = (0, import_react.useState)(false);
	const [statusData, setStatusData] = (0, import_react.useState)(null);
	const [errorMessage, setErrorMessage] = (0, import_react.useState)(null);
	const [successMessage, setSuccessMessage] = (0, import_react.useState)(null);
	const loadStatus = async (inputIp) => {
		setIsFetchingStatus(true);
		try {
			const targetIp = inputIp !== void 0 ? inputIp : registeredIpInput;
			const url = targetIp.trim() ? `/api/kiwoom/test?registeredIp=${encodeURIComponent(targetIp.trim())}` : "/api/kiwoom/test";
			const res = await fetch(url);
			if (res.ok) {
				const data = await res.json();
				setStatusData(data);
			}
		} catch (err) {
			console.log("Error fetching kiwoom status:", err.message);
		} finally {
			setIsFetchingStatus(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (isOpen) {
			loadStatus();
			setErrorMessage(null);
			setSuccessMessage(null);
		}
	}, [isOpen]);
	(0, import_react.useEffect)(() => {
		if (!isOpen) return;
		const handleKeyDown = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);
	if (!isOpen) return null;
	const currentOutboundIp = statusData?.diagnostics?.ipDiagnosis?.currentOutboundIp || "34.34.244.106";
	const isFixedIp = statusData?.diagnostics?.ipDiagnosis?.isFixedIp ?? false;
	const ipDiagnosis = statusData?.diagnostics?.ipDiagnosis;
	const tokenTest = statusData?.diagnostics?.tokenTest;
	const sampleStock = statusData?.diagnostics?.sampleStockTest;
	const sampleUS = statusData?.diagnostics?.sampleUSTest;
	const parseValidation = statusData?.diagnostics?.parseValidationTest;
	const connectionStatus = statusData?.diagnostics?.connectionStatus;
	const connectionMessage = statusData?.diagnostics?.connectionStatusMessage;
	const handleCopyIp = () => {
		if (currentOutboundIp) {
			navigator.clipboard.writeText(currentOutboundIp);
			setCopiedIp(true);
			setTimeout(() => setCopiedIp(false), 2e3);
		}
	};
	const handleCheckRegisteredIp = () => {
		loadStatus(registeredIpInput);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!appKey.trim() || !appSecret.trim()) {
			setErrorMessage("App Key와 App Secret을 모두 입력해 주세요.");
			return;
		}
		setIsLoading(true);
		setErrorMessage(null);
		setSuccessMessage(null);
		try {
			const res = await fetch("/api/kiwoom/config", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					appKey: appKey.trim(),
					appSecret: appSecret.trim(),
					isMock,
					registeredIp: registeredIpInput.trim() || void 0
				})
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "설정 저장에 실패했습니다.");
			setStatusData(data);
			setAppSecret("");
			if (data.diagnostics?.tokenTest?.success) {
				setSuccessMessage("키움 실전 OAuth 인증 및 토큰 발급에 성공했습니다!");
				onSuccess?.();
			} else if (data.diagnostics?.tokenTest?.error) setErrorMessage(data.diagnostics.tokenTest.error);
			else setSuccessMessage("환경설정이 저장되었습니다.");
		} catch (err) {
			setErrorMessage(err.message || "서버 통신 중 오류가 발생했습니다.");
		} finally {
			setIsLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 cursor-pointer",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] cursor-default",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#181c28]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-base font-bold text-slate-900 dark:text-white flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "키움증권 Open API 실전 연동 & IP 진단" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20",
							children: "REAL API"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400",
						children: "서버 아웃바운드 IP 검증, OAuth 토큰 발급 및 실전 시세 조회를 진단합니다."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-1.5 transition-colors cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
					"aria-label": "창 닫기",
					title: "창 닫기 (ESC)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 space-y-5 overflow-y-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-xl bg-slate-50 dark:bg-[#1a202c] border border-slate-200 dark:border-slate-800 space-y-3.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-4 h-4 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-slate-800 dark:text-slate-200",
										children: "1. 서버 아웃바운드 공인 IP 검증 결과"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${isFixedIp ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"}`,
									children: isFixedIp ? "고정 IP (Cloud NAT)" : "동적 IP 풀 (Cloud Run)"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-700/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-400 block font-medium",
										children: "검증된 서버 공인 아웃바운드 IP"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-base font-black font-mono tracking-tight text-slate-900 dark:text-white",
										children: currentOutboundIp
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-slate-400 block mt-0.5",
										children: ["검증 시각: ", ipDiagnosis?.verifiedAt ? new Date(ipDiagnosis.verifiedAt).toLocaleTimeString("ko-KR") : "방금 전 검증됨"]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleCopyIp,
									className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors",
									title: "IP 복사",
									children: [copiedIp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copiedIp ? "복사됨!" : "IP 복사" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "키움 포털 등록 IP 일치 여부 확인" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400",
											children: "키움 REST API 사용신청 페이지에 등록한 IP"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: registeredIpInput,
											onChange: (e) => setRegisteredIpInput(e.target.value),
											placeholder: "예: 34.34.244.106",
											className: "flex-1 px-3 py-2 text-xs font-mono rounded-lg bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: handleCheckRegisteredIp,
											disabled: isFetchingStatus,
											className: "px-3 py-2 text-xs font-bold rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors shrink-0",
											children: "일치 확인"
										})]
									}),
									registeredIpInput.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `p-2.5 rounded-lg text-xs flex items-start gap-2 ${registeredIpInput.trim() === currentOutboundIp ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"}`,
										children: [registeredIpInput.trim() === currentOutboundIp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 shrink-0 mt-0.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-bold",
											children: registeredIpInput.trim() === currentOutboundIp ? "IP 일치: 등록 IP와 서버 아웃바운드 IP가 정확히 일치합니다." : "IP 불일치: 포털 등록 IP와 현재 서버 IP가 다릅니다!"
										}), registeredIpInput.trim() !== currentOutboundIp && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] mt-0.5 text-rose-500/90 font-mono",
											children: [
												"키움 REST API 홈페이지에서 IP를 '",
												currentOutboundIp,
												"'로 수정해 주세요."
											]
										})] })]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-slate-200 dark:border-slate-700/60 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setShowCloudNatGuide(!showCloudNatGuide),
									className: "w-full flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { className: "w-3.5 h-3.5 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "고정 아웃바운드 IP(Cloud NAT) 구성 방법 및 예상 비용 안내" })]
									}), showCloudNatGuide ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-3.5 h-3.5" })]
								}), showCloudNatGuide && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2.5 p-3 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/80 text-[11px] space-y-2 text-indigo-950 dark:text-indigo-200",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-bold flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "왜 고정 IP(Cloud NAT)가 필요한가요?" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "leading-relaxed text-slate-700 dark:text-slate-300",
											children: "Cloud Run은 기본적으로 구글 클라우드의 공유 동적 IP 풀을 사용합니다. 키움증권은 등록된 IP(오류 8050 방지)에서만 요청을 승인하므로, 컨테이너 재시작 시에도 영구적인 동일 IP를 유지하려면 Cloud NAT 고정 외부 IP 구성이 필요합니다."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1 font-mono text-[10.5px] bg-white/70 dark:bg-black/30 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-900",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-bold text-indigo-600 dark:text-indigo-400 mb-1 font-sans",
													children: "구글 클라우드 콘솔 설정 단계:"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "1. VPC 네트워크(또는 기본 default VPC) 확인" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "2. Serverless VPC Access 커넥터 생성 (최소 인스턴스 2)" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "3. Cloud Router 및 Cloud NAT 게이트웨이 생성 후 고정 외부 IP 예약" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "4. Cloud Run 연결(Networking) 탭에서 VPC 커넥터 연결 및 모든 아웃바운드 라우팅 설정" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "5. 예약된 고정 외부 IP를 키움 REST API 사용신청에 등록" })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "예상 인프라 비용:" }),
												" VPC Access 커넥터(약 $15~$25/월) + Cloud NAT 게이트웨이 및 정적 IP 유지비(약 $7~$10/월) => ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "합계 약 $25~$35/월" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] text-slate-500 dark:text-slate-400 mt-0.5",
													children: "* 사용자 승인 없이 인프라를 변경하지 않으며, 현재 기본 배포 구조를 유지합니다."
												})
											]
										})
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-xl bg-slate-50 dark:bg-[#1a202c] border border-slate-200 dark:border-slate-800 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "w-4 h-4 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "2. 키움 OAuth 토큰 및 종목 시세 조회 진단" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => loadStatus(),
									disabled: isFetchingStatus,
									className: "text-[11px] font-semibold text-rose-500 hover:text-rose-400 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3 h-3 ${isFetchingStatus ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "진단 새로고침" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `p-3 rounded-xl border flex items-start gap-2.5 text-xs ${connectionStatus === "DOMESTIC_CONNECTED" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30" : connectionStatus === "TOKEN_OK_QUOTE_FAILED" ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30" : "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30"}`,
								children: [connectionStatus === "DOMESTIC_CONNECTED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-5 h-5 shrink-0 text-emerald-500 mt-0.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-5 h-5 shrink-0 text-rose-500 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-bold flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: connectionStatus === "DOMESTIC_CONNECTED" ? "키움 실전 연결 성공 (토큰 및 005930 시세 정상)" : connectionStatus === "TOKEN_OK_QUOTE_FAILED" ? "인증 성공 / 시세 미연결 (추가 확인 필요)" : "키움 연결 실패: 키움 포털 IP 등록 필요 [코드 8050]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] px-2 py-0.2 rounded font-mono font-bold bg-white/60 dark:bg-black/30",
											children: connectionStatus || "NOT_CONFIGURED"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] leading-relaxed opacity-90",
										children: connectionMessage || tokenTest?.error || "진단 실행 대기 중"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 space-y-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-slate-400 block font-bold",
												children: "① OAuth 토큰 발급"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2 h-2 rounded-full ${tokenTest?.success ? "bg-emerald-500" : "bg-rose-500"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `font-bold ${tokenTest?.success ? "text-emerald-500" : "text-rose-500"}`,
													children: tokenTest?.success ? "토큰 발급 성공" : `실패 [코드 ${tokenTest?.returnCode ?? "3"}]`
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2",
												children: tokenTest?.returnMsg || tokenTest?.error || (tokenTest?.success ? "유효 토큰 보유" : "미인증")
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 space-y-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-slate-400 block font-bold",
												children: "② 국내 삼성전자 (005930)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2 h-2 rounded-full ${sampleStock?.success ? "bg-emerald-500" : "bg-amber-500"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `font-bold ${sampleStock?.success ? "text-emerald-500" : "text-slate-500"}`,
													children: sampleStock?.success ? `${sampleStock.price?.toLocaleString()}원` : "실전 조회 대기"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2",
												children: sampleStock?.statusMessage || (sampleStock?.success ? "키움 실전 시세 수신" : "토큰 인증 후 실행")
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 space-y-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-slate-400 block font-bold",
												children: "③ 미국 애플 (AAPL)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2 h-2 rounded-full ${sampleUS?.success ? "bg-indigo-500" : "bg-slate-400"}` }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-bold text-indigo-600 dark:text-indigo-400 font-mono",
														children: sampleUS?.price ? `$${sampleUS.price}` : "시세 대기"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[9px] px-1 rounded bg-indigo-500/10 text-indigo-500 font-bold",
														children: "15분 지연"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2",
												children: sampleUS?.statusMessage || "Yahoo Finance 공식 시세 (USD)"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 space-y-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-slate-400 block font-bold",
												children: "④ 시세 필드 파싱 검증"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2 h-2 rounded-full ${parseValidation?.success ? "bg-emerald-500" : "bg-amber-500"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `font-bold ${parseValidation?.success ? "text-emerald-500" : "text-amber-500"}`,
													children: parseValidation?.success ? `4/4 검증 통과` : "파싱 점검 중"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2",
												children: parseValidation?.success ? "콤마/음수/종가대체 방어 검증 완료" : "규격 파싱 로직 가동 중"
											})
										]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
								children: "실전투자 App Key"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: appKey,
								onChange: (e) => setAppKey(e.target.value),
								placeholder: "키움증권 발급 실전 App Key 입력",
								className: "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a202c] border border-slate-200 dark:border-slate-700/80 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/40"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-slate-700 dark:text-slate-300",
										children: "실전투자 App Secret"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setShowSecret(!showSecret),
										className: "text-[11px] text-slate-400 hover:text-slate-300 flex items-center gap-1",
										children: [showSecret ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: showSecret ? "비밀번호 숨기기" : "표시" })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: showSecret ? "text" : "password",
										value: appSecret,
										onChange: (e) => setAppSecret(e.target.value),
										placeholder: "키움증권 발급 실전 App Secret 입력",
										className: "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a202c] border border-slate-200 dark:border-slate-700/80 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/40"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-slate-400 mt-1 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-3 h-3 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "입력된 Secret은 서버측 .env에만 안전 저장되며 프론트엔드 및 로그에 절대 노출되지 않습니다." })]
								})
							] }),
							errorMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex-1 leading-relaxed",
									children: errorMessage
								})]
							}),
							successMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: successMessage })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: onClose,
									disabled: isLoading,
									className: "px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors cursor-pointer shrink-0",
									children: "닫기 / 취소"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: isLoading,
									className: "flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 cursor-pointer",
									children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "키움 OAuth 토큰 발급 및 진단 테스트 중..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "설정 저장 및 연동 진단 실행" })] })
								})]
							})
						]
					})
				]
			})]
		})
	});
};
//#endregion
//#region src/utils/marketHours.ts
/**
* 한국 주식시장(KRX) 운영 시간 판정
* 
* - 평일(월~금) 09:00:00 ~ 15:30:00: "정규장 · 실시간"
* - 그 외 시간: "장마감 · 종가기준"
* - 주말(토, 일) 및 공휴일: "장마감 · 종가기준"
*/
var KRX_MULTI_YEAR_HOLIDAYS = /* @__PURE__ */ new Set([
	"2025-01-01",
	"2025-01-27",
	"2025-01-28",
	"2025-01-29",
	"2025-01-30",
	"2025-03-01",
	"2025-03-03",
	"2025-05-01",
	"2025-05-05",
	"2025-05-06",
	"2025-06-06",
	"2025-08-15",
	"2025-10-03",
	"2025-10-05",
	"2025-10-06",
	"2025-10-07",
	"2025-10-08",
	"2025-10-09",
	"2025-12-25",
	"2025-12-31",
	"2026-01-01",
	"2026-02-16",
	"2026-02-17",
	"2026-02-18",
	"2026-03-01",
	"2026-03-02",
	"2026-05-01",
	"2026-05-05",
	"2026-05-24",
	"2026-05-25",
	"2026-06-06",
	"2026-08-15",
	"2026-08-17",
	"2026-09-24",
	"2026-09-25",
	"2026-09-26",
	"2026-10-03",
	"2026-10-05",
	"2026-10-09",
	"2026-12-25",
	"2026-12-31",
	"2027-01-01",
	"2027-02-05",
	"2027-02-06",
	"2027-02-07",
	"2027-02-08",
	"2027-03-01",
	"2027-05-01",
	"2027-05-05",
	"2027-05-13",
	"2027-06-06",
	"2027-06-07",
	"2027-08-15",
	"2027-08-16",
	"2027-09-14",
	"2027-09-15",
	"2027-09-16",
	"2027-10-03",
	"2027-10-04",
	"2027-10-09",
	"2027-10-11",
	"2027-12-25",
	"2027-12-31"
]);
function isKRXHoliday(dateKey, year) {
	if (KRX_MULTI_YEAR_HOLIDAYS.has(dateKey)) return true;
	const md = dateKey.slice(5);
	if ([
		"01-01",
		"05-01",
		"05-05",
		"06-06",
		"08-15",
		"10-03",
		"10-09",
		"12-25",
		"12-31"
	].includes(md)) return true;
	return false;
}
function getKSTDate(date = /* @__PURE__ */ new Date()) {
	const utc = date.getTime() + date.getTimezoneOffset() * 6e4;
	return new Date(utc + 324e5);
}
function getKRXMarketStatus(baseDate = /* @__PURE__ */ new Date()) {
	const kst = getKSTDate(baseDate);
	const year = kst.getFullYear();
	const dateKey = `${year}-${String(kst.getMonth() + 1).padStart(2, "0")}-${String(kst.getDate()).padStart(2, "0")}`;
	const dayOfWeek = kst.getDay();
	const hours = kst.getHours();
	const minutes = kst.getMinutes();
	const seconds = kst.getSeconds();
	const totalSeconds = hours * 3600 + minutes * 60 + seconds;
	const marketOpenSeconds = 32400;
	const marketCloseSeconds = 55800;
	const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
	const isHoliday = isKRXHoliday(dateKey, year);
	const timeStringKST = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
	if (isWeekend) return {
		isOpen: false,
		statusLabel: "장마감 · 종가기준",
		detailLabel: dayOfWeek === 6 ? "주말 휴장 (토요일)" : "주말 휴장 (일요일)",
		isHoliday: false,
		isWeekend: true,
		timeStringKST
	};
	if (isHoliday) return {
		isOpen: false,
		statusLabel: "장마감 · 종가기준",
		detailLabel: "공휴일/증시 휴장일",
		isHoliday: true,
		isWeekend: false,
		timeStringKST
	};
	if (totalSeconds >= marketOpenSeconds && totalSeconds < marketCloseSeconds) return {
		isOpen: true,
		statusLabel: "정규장 · 실시간",
		detailLabel: "정규 거래 시간 (09:00 ~ 15:30)",
		isHoliday: false,
		isWeekend: false,
		timeStringKST
	};
	return {
		isOpen: false,
		statusLabel: "장마감 · 종가기준",
		detailLabel: totalSeconds >= 30600 && totalSeconds < marketOpenSeconds ? "장 시작 전 (시간외/동시호가)" : totalSeconds >= marketCloseSeconds && totalSeconds < 64800 ? "장후 시간외 거래" : totalSeconds < marketOpenSeconds ? "장 시작 전" : "정규장 마감",
		isHoliday: false,
		isWeekend: false,
		timeStringKST
	};
}
/**
* 미국 주식시장(NYSE/NASDAQ) 공휴일 및 조기폐장일 동적 산출 함수
* 
* 특정 연도에 국한되지 않고 매년 연방 공휴일 규칙(Observed Day 포함)과 부활절(Good Friday) 알고리즘으로 동적 계산.
*/
function getUSMarketHolidays(year) {
	const holidays = /* @__PURE__ */ new Set();
	const earlyClose = /* @__PURE__ */ new Set();
	const ny = new Date(Date.UTC(year, 0, 1));
	if (ny.getUTCDay() === 0) holidays.add(`${year}-01-02`);
	else if (ny.getUTCDay() === 6) holidays.add(`${year - 1}-12-31`);
	else holidays.add(`${year}-01-01`);
	function getNthDayOfWeek(y, m, targetDay, n) {
		return 1 + (targetDay - new Date(Date.UTC(y, m, 1)).getUTCDay() + 7) % 7 + (n - 1) * 7;
	}
	holidays.add(`${year}-01-${String(getNthDayOfWeek(year, 0, 1, 3)).padStart(2, "0")}`);
	holidays.add(`${year}-02-${String(getNthDayOfWeek(year, 1, 1, 3)).padStart(2, "0")}`);
	const a = year % 19;
	const b = Math.floor(year / 100);
	const c = year % 100;
	const d = Math.floor(b / 4);
	const e = b % 4;
	const f = Math.floor((b + 8) / 25);
	const g = Math.floor((b - f + 1) / 3);
	const h = (19 * a + b - d - g + 15) % 30;
	const i = Math.floor(c / 4);
	const k = c % 4;
	const l = (32 + 2 * e + 2 * i - h - k) % 7;
	const m = Math.floor((a + 11 * h + 22 * l) / 451);
	const easterMonth = Math.floor((h + l - 7 * m + 114) / 31) - 1;
	const easterDay = (h + l - 7 * m + 114) % 31 + 1;
	const gf = new Date(Date.UTC(year, easterMonth, easterDay - 2));
	holidays.add(`${year}-${String(gf.getUTCMonth() + 1).padStart(2, "0")}-${String(gf.getUTCDate()).padStart(2, "0")}`);
	const mayMon = 31 - (new Date(Date.UTC(year, 4, 31)).getUTCDay() + 6) % 7;
	holidays.add(`${year}-05-${String(mayMon).padStart(2, "0")}`);
	const jt = new Date(Date.UTC(year, 5, 19));
	if (jt.getUTCDay() === 0) holidays.add(`${year}-06-20`);
	else if (jt.getUTCDay() === 6) holidays.add(`${year}-06-18`);
	else holidays.add(`${year}-06-19`);
	const ind = new Date(Date.UTC(year, 6, 4));
	if (ind.getUTCDay() === 0) holidays.add(`${year}-07-05`);
	else if (ind.getUTCDay() === 6) holidays.add(`${year}-07-03`);
	else holidays.add(`${year}-07-04`);
	holidays.add(`${year}-09-${String(getNthDayOfWeek(year, 8, 1, 1)).padStart(2, "0")}`);
	const thDay = getNthDayOfWeek(year, 10, 4, 4);
	holidays.add(`${year}-11-${String(thDay).padStart(2, "0")}`);
	const xm = new Date(Date.UTC(year, 11, 25));
	if (xm.getUTCDay() === 0) holidays.add(`${year}-12-26`);
	else if (xm.getUTCDay() === 6) holidays.add(`${year}-12-24`);
	else holidays.add(`${year}-12-25`);
	earlyClose.add(`${year}-11-${String(thDay + 1).padStart(2, "0")}`);
	if (xm.getUTCDay() !== 0 && xm.getUTCDay() !== 1 && xm.getUTCDay() !== 6) earlyClose.add(`${year}-12-24`);
	if (ind.getUTCDay() >= 2 && ind.getUTCDay() <= 5) earlyClose.add(`${year}-07-03`);
	return {
		holidays,
		earlyClose
	};
}
/**
* 미국 동부 표준시 (America/New_York IANA 타임존) 기준 시간 객체 파싱
* 서버 로컬 타임존 환경에 독립적으로 동작하며 서머타임(EDT/EST)을 완벽하게 자동 처리.
*/
function getUSDate(date = /* @__PURE__ */ new Date()) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: "America/New_York",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		weekday: "short",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false
	}).formatToParts(date);
	let year = 2026;
	let month = 1;
	let day = 1;
	let hours = 0;
	let minutes = 0;
	let seconds = 0;
	let weekdayStr = "Sun";
	for (const part of parts) if (part.type === "year") year = parseInt(part.value, 10);
	else if (part.type === "month") month = parseInt(part.value, 10);
	else if (part.type === "day") day = parseInt(part.value, 10);
	else if (part.type === "hour") hours = parseInt(part.value, 10);
	else if (part.type === "minute") minutes = parseInt(part.value, 10);
	else if (part.type === "second") seconds = parseInt(part.value, 10);
	else if (part.type === "weekday") weekdayStr = part.value;
	if (hours === 24) hours = 0;
	const dayOfWeek = {
		Sun: 0,
		Mon: 1,
		Tue: 2,
		Wed: 3,
		Thu: 4,
		Fri: 5,
		Sat: 6
	}[weekdayStr] ?? 0;
	const monthStr = String(month).padStart(2, "0");
	const dayStr = String(day).padStart(2, "0");
	const dateKey = `${year}-${monthStr}-${dayStr}`;
	const timeStringUS = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
	const totalSeconds = hours * 3600 + minutes * 60 + seconds;
	return {
		year,
		month,
		day,
		dayOfWeek,
		hours,
		minutes,
		seconds,
		dateKey,
		timeStringUS,
		totalSeconds
	};
}
function getUSMarketStatus(baseDate = /* @__PURE__ */ new Date()) {
	const us = getUSDate(baseDate);
	const { holidays, earlyClose } = getUSMarketHolidays(us.year);
	const preMarketOpen = 14400;
	const marketOpen = 34200;
	const isEarlyCloseDay = earlyClose.has(us.dateKey);
	const marketClose = isEarlyCloseDay ? 46800 : 57600;
	const afterMarketClose = isEarlyCloseDay ? 61200 : 72e3;
	const isWeekend = us.dayOfWeek === 0 || us.dayOfWeek === 6;
	const isHoliday = holidays.has(us.dateKey);
	if (isWeekend) return {
		isOpen: false,
		statusLabel: "미국장 휴장",
		detailLabel: us.dayOfWeek === 6 ? "주말 휴장 (토요일)" : "주말 휴장 (일요일)",
		isHoliday: false,
		isWeekend: true,
		timeStringKST: us.timeStringUS,
		session: "CLOSED"
	};
	if (isHoliday) return {
		isOpen: false,
		statusLabel: "미국장 휴장",
		detailLabel: "미국 공휴일 휴장 (NYSE/NASDAQ)",
		isHoliday: true,
		isWeekend: false,
		timeStringKST: us.timeStringUS,
		session: "CLOSED"
	};
	if (us.totalSeconds >= marketOpen && us.totalSeconds < marketClose) return {
		isOpen: true,
		statusLabel: isEarlyCloseDay ? "정규장 (조기폐장일)" : "정규장 · 실시간",
		detailLabel: isEarlyCloseDay ? "미국 정규 거래시간 (조기폐장: 09:30 ~ 13:00 EST/EDT)" : "미국 정규 거래시간 (09:30 ~ 16:00 EST/EDT)",
		isHoliday: false,
		isWeekend: false,
		timeStringKST: us.timeStringUS,
		session: "REGULAR",
		isEarlyClose: isEarlyCloseDay
	};
	if (us.totalSeconds >= preMarketOpen && us.totalSeconds < marketOpen) return {
		isOpen: false,
		statusLabel: "프리마켓",
		detailLabel: "미국 프리마켓 (04:00 ~ 09:30 EST/EDT)",
		isHoliday: false,
		isWeekend: false,
		timeStringKST: us.timeStringUS,
		session: "PRE_MARKET",
		isEarlyClose: isEarlyCloseDay
	};
	if (us.totalSeconds >= marketClose && us.totalSeconds < afterMarketClose) return {
		isOpen: false,
		statusLabel: "애프터마켓",
		detailLabel: isEarlyCloseDay ? "미국 애프터마켓 (조기마감: 13:00 ~ 17:00 EST/EDT)" : "미국 애프터마켓 (16:00 ~ 20:00 EST/EDT)",
		isHoliday: false,
		isWeekend: false,
		timeStringKST: us.timeStringUS,
		session: "AFTER_MARKET",
		isEarlyClose: isEarlyCloseDay
	};
	return {
		isOpen: false,
		statusLabel: "장마감",
		detailLabel: isEarlyCloseDay ? "미국 증시 조기마감" : "미국 증시 마감",
		isHoliday: false,
		isWeekend: false,
		timeStringKST: us.timeStringUS,
		session: "CLOSED",
		isEarlyClose: isEarlyCloseDay
	};
}
/**
* 거래시간 검증: KRX(09:00~15:30), US(09:30~16:00 EST/EDT) 정규장 및 프리/애프터마켓, 휴장일 판별.
* 불가 시간대 주문은 거절하거나 허용된 주문 유형(지정가)에 한해 대기(PENDING) 처리.
*/
function validateMarketTradingHours(market = "KRX", orderKind = "MARKET") {
	if (market.toUpperCase() === "US" || market.toUpperCase() === "NASDAQ" || market.toUpperCase() === "NYSE" || market.toUpperCase() === "GLOBAL") {
		const usStatus = getUSMarketStatus();
		if (usStatus.isOpen && usStatus.session === "REGULAR") return {
			canExecuteNow: true,
			canQueuePending: true,
			session: "REGULAR",
			message: "미국 정규 거래시간 (즉시 체결 가능)",
			market: "US"
		};
		if (orderKind === "MARKET") return {
			canExecuteNow: false,
			canQueuePending: false,
			session: usStatus.session,
			message: `미국 정규장 마감 상태(${usStatus.detailLabel})에서는 시장가 주문이 불가합니다. 지정가 주문으로 접수 시 대기(PENDING) 등록됩니다.`,
			market: "US"
		};
		return {
			canExecuteNow: false,
			canQueuePending: true,
			session: usStatus.session,
			message: `정규장 외 시간(${usStatus.detailLabel})으로 지정가 주문이 대기(PENDING) 상태로 예약 접수됩니다.`,
			market: "US"
		};
	}
	const krxStatus = getKRXMarketStatus();
	if (krxStatus.isOpen) return {
		canExecuteNow: true,
		canQueuePending: true,
		session: "REGULAR",
		message: "국내 정규 거래시간 (09:00~15:30, 즉시 체결 가능)",
		market: "KRX"
	};
	if (orderKind === "MARKET") return {
		canExecuteNow: false,
		canQueuePending: false,
		session: "CLOSED",
		message: `정규 거래시간 외(${krxStatus.detailLabel})에는 시장가 주문이 거절됩니다. 지정가 주문으로 접수 시 정규장 대기(PENDING) 처리됩니다.`,
		market: "KRX"
	};
	return {
		canExecuteNow: false,
		canQueuePending: true,
		session: "CLOSED",
		message: `정규 거래시간 외(${krxStatus.detailLabel})로 지정가 주문이 대기(PENDING) 상태로 안전하게 접수됩니다.`,
		market: "KRX"
	};
}
//#endregion
//#region src/components/common/KstClock.tsx
var KstClock = ({ className = "text-[10px] sm:text-xs font-mono text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/50 flex items-center gap-1.5 whitespace-nowrap", showIcon = false }) => {
	const { formatted } = useTime();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		title: "한국 표준시 (KST, Asia/Seoul)",
		children: [showIcon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatted })]
	});
};
//#endregion
//#region src/components/layout/MobileDrawer.tsx
var MobileDrawer = ({ isOpen, onClose }) => {
	const { activeTab, setActiveTab, user, isAuthenticated, logout, setIsAuthModalOpen, isDark, toggleTheme, unreadChatCount } = useApp();
	if (!isOpen) return null;
	const handleNav = (tab, extraAction) => {
		setActiveTab(tab);
		extraAction?.();
		onClose();
	};
	const isAdmin = user && (user.role === "admin" || user.role === "superadmin");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex justify-end md:hidden animate-in fade-in duration-200",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity",
			onClick: onClose,
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-[85%] max-w-sm h-full bg-finance-card border-l border-finance-border shadow-2xl flex flex-col z-10 overflow-hidden pt-safe pb-safe animate-in slide-in-from-right duration-250 text-finance-text",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-b border-finance-border flex items-center justify-between bg-finance-sub-bg/70",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-8 h-8 rounded-xl bg-gradient-to-tr from-finance-accent to-finance-up flex items-center justify-center text-white font-black text-sm shadow-xs",
							children: "SI"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-black text-sm text-finance-text tracking-tight block",
							children: "병돌 인베스트먼트"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-finance-sub-text font-mono",
							children: "전체 서비스 메뉴"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: toggleTheme,
							className: "p-2 rounded-xl text-finance-sub-text hover:text-finance-text hover:bg-finance-sub-bg transition-colors",
							title: "다크/라이트 모드",
							"aria-label": "화면 모드 전환",
							children: isDark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "w-4 h-4 text-amber-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "w-4 h-4 text-finance-accent" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onClose,
							className: "p-2 rounded-xl text-finance-sub-text hover:text-finance-text hover:bg-finance-sub-bg transition-colors",
							"aria-label": "메뉴 닫기",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-4 py-3 bg-finance-sub-bg/50 border-b border-finance-border flex items-center justify-between text-xs",
					children: isAuthenticated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-7 h-7 rounded-full bg-rose-500/10 text-rose-500 font-bold flex items-center justify-center text-xs",
								children: user?.name?.[0] || "U"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-slate-900 dark:text-white block leading-tight",
								children: user?.name || "사용자"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-slate-400",
								children: user?.email
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								logout();
								onClose();
							},
							className: "text-[11px] font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "로그아웃" })]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-slate-500 text-xs",
							children: "로그인이 필요합니다"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								onClose();
								setIsAuthModalOpen(true);
							},
							className: "px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "로그인 / 회원가입" })]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto p-4 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2",
								children: "시장 (Markets)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleNav("stocks"),
										className: `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${activeTab === "stocks" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { className: "w-4 h-4 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "국내 시장 (KOSPI · KOSDAQ)" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5 text-slate-400" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleNav("stocks"),
										className: `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${activeTab === "stocks" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-4 h-4 text-blue-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "미국 시장 (NYSE · NASDAQ)" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5 text-slate-400" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleNav("stocks"),
										className: `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${activeTab === "stocks" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "w-4 h-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "가상자산 (Upbit · Binance)" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5 text-slate-400" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleNav("insight"),
										className: `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${activeTab === "insight" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4 text-purple-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "시장 히트맵 & 실시간 레이더" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-500 font-bold",
											children: "LIVE"
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2",
								children: "투자 (Investments)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleNav("watchlist"),
										className: `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${activeTab === "watchlist" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "w-4 h-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "관심종목 센터 (4대 시장)" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5 text-slate-400" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleNav("compare"),
										className: `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${activeTab === "compare" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-4 h-4 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "종목 비교 분석기" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5 text-slate-400" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleNav("portfolio"),
										className: `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${activeTab === "portfolio" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "w-4 h-4 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "가상 보유 관리 & 물타기 계산" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5 text-slate-400" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleNav("portfolio"),
										className: `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${activeTab === "portfolio" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "모의투자 시스템 (가상 1억)" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5 text-slate-400" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleNav("portfolio"),
										className: `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${activeTab === "portfolio" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-4 h-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "배당 수익 계산기 (공식 공시 연동)" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold",
											children: "15.4%"
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2",
								children: "정보 (Information)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleNav("calendar"),
										className: `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${activeTab === "calendar" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "증시 캘린더 (휴장·실적·FOMC)" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5 text-slate-400" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleNav("ranking"),
										className: `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${activeTab === "ranking" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "w-4 h-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "경제 지표 & 실시간 순위" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold",
											children: "TOP"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleNav("stocks"),
										className: `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${activeTab === "stocks" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-teal-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "종목 정밀 분석 & 재무비율" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5 text-slate-400" })]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2",
								children: "커뮤니티 (Community)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleNav("community"),
									className: `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${activeTab === "community" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-4 h-4 text-blue-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "주주 게시판 & 토론방" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5 text-slate-400" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleNav("chat"),
									className: `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${activeTab === "chat" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-4 h-4 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "실시간 라이브 채팅" })]
									}), unreadChatCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold",
										children: unreadChatCount
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 font-bold",
										children: "LIVE"
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2",
								children: "계정 (Account)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleNav("profile"),
									className: `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${activeTab === "profile" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-4 h-4 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "내 프로필 & 설정" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5 text-slate-400" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleNav("alerts"),
									className: `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${activeTab === "alerts" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-4 h-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "가격 알림 센터" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5 text-slate-400" })]
								})]
							})]
						}),
						isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-[11px] font-bold text-amber-500 uppercase tracking-wider px-2 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "관리자 시스템 (Admin)" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleNav("admin"),
								className: `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${activeTab === "admin" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-4 h-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "시스템 통합 관리 콘솔" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5 text-amber-500" })]
							})]
						})
					]
				})
			]
		})]
	});
};
//#endregion
//#region src/services/globalMarketClient.ts
var GlobalMarketClient = class {
	constructor() {
		this.cache = null;
		this.lastFetched = 0;
		this.TTL_MS = 15e3;
	}
	async getSummary(forceRefresh = false) {
		const now = Date.now();
		if (!forceRefresh && this.cache && now - this.lastFetched < this.TTL_MS) return this.cache;
		const res = await fetch(`/api/market/global-summary${forceRefresh ? "?force=true" : ""}`, { headers: { "Accept": "application/json" } });
		if (!res.ok) throw new Error(`글로벌 시장 데이터 조회 실패 (HTTP ${res.status})`);
		const data = await res.json();
		this.cache = data;
		this.lastFetched = now;
		return data;
	}
	async getCategoryItems(category, forceRefresh = false) {
		const res = await fetch(`/api/financial/hub?category=${encodeURIComponent(category)}${forceRefresh ? "&force=true" : ""}`, { headers: { "Accept": "application/json" } });
		if (!res.ok) throw new Error(`카테고리(${category}) 데이터 조회 실패`);
		return (await res.json()).items || [];
	}
	async getProviders() {
		try {
			const res = await fetch("/api/financial/providers");
			if (!res.ok) return [];
			return (await res.json()).providers || [];
		} catch {
			return [];
		}
	}
};
var globalMarketClient = new GlobalMarketClient();
//#endregion
//#region src/components/common/MobileRollingTicker.tsx
var MobileRollingTicker = () => {
	const { indices, exchangeRate, stocks } = useApp();
	const [globalSummary, setGlobalSummary] = (0, import_react.useState)(null);
	const [isPaused, setIsPaused] = (0, import_react.useState)(false);
	const [currentDateTime, setCurrentDateTime] = (0, import_react.useState)("");
	const containerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		globalMarketClient.getSummary().then((res) => setGlobalSummary(res)).catch(() => {});
		const updateTime = () => {
			const now = /* @__PURE__ */ new Date();
			const yyyy = now.getFullYear();
			const mm = String(now.getMonth() + 1).padStart(2, "0");
			const dd = String(now.getDate()).padStart(2, "0");
			const hh = String(now.getHours()).padStart(2, "0");
			const min = String(now.getMinutes()).padStart(2, "0");
			setCurrentDateTime(`${yyyy}.${mm}.${dd} ${hh}:${min}`);
		};
		updateTime();
		const timer = setInterval(updateTime, 1e4);
		return () => clearInterval(timer);
	}, []);
	const kospi = indices.find((i) => i.symbol === "KOSPI");
	const kosdaq = indices.find((i) => i.symbol === "KOSDAQ");
	const usGroup = globalSummary?.groups?.us || [];
	const nasdaq = usGroup.find((i) => i.symbol === "NASDAQ" || i.name.includes("나스닥"));
	const sp500 = usGroup.find((i) => i.symbol === "S&P500" || i.name.includes("S&P"));
	const dow = usGroup.find((i) => i.symbol === "DOW" || i.name.includes("다우"));
	const fxCheck = validateExchangeRate(exchangeRate);
	const btc = stocks.find((s) => s.symbol === "KRW-BTC" || s.symbol === "BTC" || s.symbol === "BTC-USD");
	const eth = stocks.find((s) => s.symbol === "KRW-ETH" || s.symbol === "ETH" || s.symbol === "ETH-USD");
	const tickerItems = [
		kospi && {
			label: "KOSPI",
			val: kospi.value.toLocaleString(void 0, { maximumFractionDigits: 2 }),
			change: kospi.changePercent
		},
		kosdaq && {
			label: "KOSDAQ",
			val: kosdaq.value.toLocaleString(void 0, { maximumFractionDigits: 2 }),
			change: kosdaq.changePercent
		},
		nasdaq && {
			label: "NASDAQ",
			val: Number(nasdaq.value || 0).toLocaleString(void 0, { maximumFractionDigits: 2 }),
			change: nasdaq.changePercent || 0
		},
		sp500 && {
			label: "S&P 500",
			val: Number(sp500.value || 0).toLocaleString(void 0, { maximumFractionDigits: 2 }),
			change: sp500.changePercent || 0
		},
		dow && {
			label: "DOW",
			val: Number(dow.value || 0).toLocaleString(void 0, { maximumFractionDigits: 2 }),
			change: dow.changePercent || 0
		},
		fxCheck.valid && fxCheck.rate && {
			label: "USD/KRW",
			val: fxCheck.rate.toLocaleString(void 0, { maximumFractionDigits: 2 }),
			change: exchangeRate?.changePercent || 0
		},
		btc && {
			label: "BTC",
			val: btc.price.toLocaleString(),
			change: btc.changePercent
		},
		eth && {
			label: "ETH",
			val: eth.price.toLocaleString(),
			change: eth.changePercent
		}
	].filter(Boolean);
	if (tickerItems.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "md:hidden h-[26px] bg-finance-sub-bg/95 border-b border-finance-border overflow-hidden relative flex items-center select-none text-[10.5px] font-mono",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "shrink-0 px-2.5 bg-finance-card border-r border-finance-border text-finance-sub-text font-bold z-10 flex items-center tracking-tighter",
			children: currentDateTime || "2026.11.18 05:00"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 overflow-hidden relative flex items-center",
			onMouseEnter: () => setIsPaused(true),
			onMouseLeave: () => setIsPaused(false),
			onTouchStart: () => setIsPaused(true),
			onTouchEnd: () => setIsPaused(false),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: containerRef,
				className: `flex items-center gap-6 whitespace-nowrap animate-marquee px-4 ${isPaused ? "[animation-play-state:paused]" : ""}`,
				style: {
					animationDuration: "25s",
					animationTimingFunction: "linear",
					animationIterationCount: "infinite"
				},
				children: [...tickerItems, ...tickerItems].map((item, idx) => {
					const isUp = item.change >= 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-1.5 shrink-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-finance-sub-text",
								children: item.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-finance-text",
								children: item.val
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `font-bold tabular-nums ${isUp ? "text-finance-up" : "text-finance-down"}`,
								children: [
									isUp ? "+" : "",
									item.change.toFixed(2),
									"%"
								]
							})
						]
					}, `${item.label}-${idx}`);
				})
			})
		})]
	});
};
//#endregion
//#region src/components/layout/Navbar.tsx
var Navbar = () => {
	const { isDark, toggleTheme, activeTab, setActiveTab, indices, exchangeRate, stocks, navigateToStock, setIsSearchOpen, isSimulatingLiveTicks, toggleLiveSimulation, stockDataSource, toggleStockDataSource, isStockLoading, realtimeStatus, checkRealtimeConnection, user, isAuthenticated, logout, setIsAuthModalOpen, navigateToMyPosts, isSideChatOpen, toggleSideChat, unreadChatCount, mobileMenuOpen, setMobileMenuOpen } = useApp();
	const [profileDropdownOpen, setProfileDropdownOpen] = (0, import_react.useState)(false);
	const [unreadNotifCount, setUnreadNotifCount] = (0, import_react.useState)(0);
	const [isKiwoomModalOpen, setIsKiwoomModalOpen] = (0, import_react.useState)(false);
	const [marketStatus, setMarketStatus] = (0, import_react.useState)(() => getKRXMarketStatus());
	const profileMenuRef = (0, import_react.useRef)(null);
	const mobileMenuRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setMobileMenuOpen(false);
		setProfileDropdownOpen(false);
	}, [activeTab]);
	(0, import_react.useEffect)(() => {
		const handleOutsideClick = (e) => {
			const target = e.target;
			if (profileDropdownOpen && profileMenuRef.current && !profileMenuRef.current.contains(target)) setProfileDropdownOpen(false);
			if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
				if (!target.closest?.("[data-mobile-toggle=\"true\"]")) setMobileMenuOpen(false);
			}
		};
		const handleKeyDown = (e) => {
			if (e.key === "Escape") {
				setProfileDropdownOpen(false);
				setMobileMenuOpen(false);
			}
		};
		const handleResize = () => {
			if (window.innerWidth >= 768) setMobileMenuOpen(false);
		};
		document.addEventListener("mousedown", handleOutsideClick);
		document.addEventListener("touchstart", handleOutsideClick, { passive: true });
		document.addEventListener("keydown", handleKeyDown);
		window.addEventListener("resize", handleResize);
		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
			document.removeEventListener("touchstart", handleOutsideClick);
			document.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("resize", handleResize);
		};
	}, [profileDropdownOpen, mobileMenuOpen]);
	(0, import_react.useEffect)(() => {
		const updateMarket = () => setMarketStatus(getKRXMarketStatus());
		updateMarket();
		const timer = setInterval(updateMarket, 1e4);
		return () => clearInterval(timer);
	}, []);
	(0, import_react.useEffect)(() => {
		notificationService.getNotifications(user?.id).then((res) => setUnreadNotifCount(res.filter((n) => !n.read).length)).catch(() => {});
		const interval = setInterval(() => {
			notificationService.getNotifications(user?.id).then((res) => setUnreadNotifCount(res.filter((n) => !n.read).length)).catch(() => {});
		}, 5e3);
		return () => clearInterval(interval);
	}, [user?.id]);
	const mainNavItems = [
		{
			tab: "home",
			label: "홈",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "w-3.5 h-3.5 shrink-0" })
		},
		{
			tab: "stocks",
			label: "종목",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { className: "w-3.5 h-3.5 shrink-0" })
		},
		{
			tab: "compare",
			label: "비교",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-3.5 h-3.5 shrink-0" })
		},
		{
			tab: "ranking",
			label: "실시간 순위",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "w-3.5 h-3.5 text-amber-500 shrink-0" }),
			badge: "TOP"
		},
		{
			tab: "insight",
			label: "시장 인사이트",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-3.5 h-3.5 text-rose-500 shrink-0" }),
			badge: "LIVE"
		},
		{
			tab: "portfolio",
			label: "모의투자",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "w-3.5 h-3.5 text-emerald-500 shrink-0" })
		},
		{
			tab: "watchlist",
			label: "관심종목",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "w-3.5 h-3.5 shrink-0" })
		},
		{
			tab: "calendar",
			label: "증시 캘린더",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3.5 h-3.5 text-indigo-500 shrink-0" })
		},
		{
			tab: "community",
			label: "커뮤니티",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-3.5 h-3.5 shrink-0" })
		},
		{
			tab: "chat",
			label: "실시간 톡",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-3.5 h-3.5 text-rose-500 shrink-0" }),
			badge: "LIVE"
		},
		{
			tab: "games",
			label: "미니게임",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gamepad2, { className: "w-3.5 h-3.5 shrink-0" })
		},
		...user?.role === "admin" || user?.role === "superadmin" ? [{
			tab: "admin",
			label: "관리자",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-3.5 h-3.5 shrink-0" })
		}] : []
	];
	[
		...mainNavItems,
		unreadNotifCount > 0 && `${unreadNotifCount}`,
		...user?.role === "admin" || user?.role === "superadmin" ? [{
			tab: "admin",
			label: "관리자",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-4 h-4 text-indigo-500 shrink-0" })
		}] : []
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "sticky top-0 z-40 w-full border-b border-finance-border bg-finance-card/95 backdrop-blur-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileRollingTicker, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden sm:flex items-center justify-between px-4 py-1.5 text-xs tablet:text-[11.5px] text-finance-sub-text border-b border-finance-border bg-finance-sub-bg/60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: marketStatus.statusLabel
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KstClock, {})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-4 font-mono font-medium tabular-nums",
						children: indices.map((idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "whitespace-nowrap",
							children: [
								idx.symbol,
								": ",
								idx.value.toLocaleString(),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: idx.changePercent >= 0 ? "text-finance-up" : "text-finance-down",
									children: [
										"(",
										idx.changePercent >= 0 ? "+" : "",
										idx.changePercent,
										"%)"
									]
								})
							]
						}, idx.symbol))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "max-w-[95rem] mx-auto px-4 py-2 md:py-3 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-6 tablet:gap-3 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveTab("home"),
							className: "brand-logo text-xl tablet:text-[20px] font-black text-finance-text tracking-tight hover:opacity-90 transition-opacity shrink-0 whitespace-nowrap",
							children: "병돌 인베스트먼트"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden md:flex gap-1.5 tablet:gap-1 items-center nav-items-wrapper overflow-x-auto no-scrollbar",
							children: mainNavItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveTab(item.tab),
								className: `nav-item-btn flex items-center gap-1.5 tablet:gap-1 px-3 py-1.5 tablet:px-2 tablet:py-1 rounded-lg text-sm tablet:text-[13px] font-medium transition-colors shrink-0 whitespace-nowrap ${activeTab === item.tab ? "bg-finance-accent/15 text-finance-accent font-bold" : "text-finance-sub-text hover:text-finance-text hover:bg-finance-sub-bg"}`,
								children: [item.icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
							}, item.tab))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 tablet:gap-1.5 shrink-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setIsSearchOpen(true),
								className: "p-2 tablet:p-1.5 rounded-xl text-finance-sub-text hover:text-finance-text hover:bg-finance-sub-bg transition-colors",
								title: "종목 및 기능 검색",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: toggleTheme,
								className: "p-2 tablet:p-1.5 rounded-xl text-finance-sub-text hover:text-finance-text hover:bg-finance-sub-bg transition-colors",
								title: "화면 모드 전환",
								children: isDark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "w-4 h-4 text-amber-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "w-4 h-4 text-finance-accent" })
							}),
							isAuthenticated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setProfileDropdownOpen(!profileDropdownOpen),
								className: "p-2 tablet:p-1.5 rounded-xl text-finance-sub-text hover:text-finance-text hover:bg-finance-sub-bg transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-4 h-4" })
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setIsAuthModalOpen(true),
								className: "px-3.5 py-1.5 tablet:px-3 tablet:py-1 rounded-lg bg-finance-accent text-white text-xs tablet:text-[12px] font-bold hover:opacity-90 shadow-xs transition-opacity whitespace-nowrap",
								children: "로그인"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"data-mobile-toggle": "true",
								className: "md:hidden p-2 rounded-xl text-finance-text hover:bg-finance-sub-bg transition-colors",
								onClick: () => setMobileMenuOpen(!mobileMenuOpen),
								"aria-label": "전체 메뉴 열기",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "w-5 h-5" })
							})
						]
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileDrawer, {
			isOpen: mobileMenuOpen,
			onClose: () => setMobileMenuOpen(false)
		}),
		profileDropdownOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: profileMenuRef,
			className: "absolute right-4 top-16 z-50 w-48 bg-finance-card rounded-xl shadow-lg border border-finance-border p-2 animate-in fade-in zoom-in-95 duration-100",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => {
					setActiveTab("profile");
					setProfileDropdownOpen(false);
				},
				className: "w-full flex items-center gap-2 p-2 text-finance-text hover:bg-finance-sub-bg rounded-lg text-xs font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-4 h-4 text-finance-sub-text" }), " 내 프로필"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: logout,
				className: "w-full flex items-center gap-2 p-2 hover:bg-finance-sub-bg rounded-lg text-finance-up text-xs font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-4 h-4" }), " 로그아웃"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KiwoomConfigModal, {
			isOpen: isKiwoomModalOpen,
			onClose: () => setIsKiwoomModalOpen(false)
		})
	] });
};
//#endregion
//#region src/components/layout/MobileNav.tsx
var MobileNav = () => {
	const { activeTab, setActiveTab, setMobileMenuOpen } = useApp();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0c0f17]/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-lg pb-safe shadow-lg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-around h-[50px] px-1 max-w-md mx-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActiveTab("home"),
					className: `flex flex-col items-center justify-center flex-1 py-0.5 transition-all active:scale-95 ${activeTab === "home" ? "text-rose-500 font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
					"aria-label": "홈",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `text-[9.5px] mt-0.5 tracking-tight ${activeTab === "home" ? "font-bold text-rose-500" : "font-medium"}`,
						children: "홈"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActiveTab("stocks"),
					className: `flex flex-col items-center justify-center flex-1 py-0.5 transition-all active:scale-95 ${activeTab === "stocks" ? "text-rose-500 font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
					"aria-label": "종목",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `text-[9.5px] mt-0.5 tracking-tight ${activeTab === "stocks" ? "font-bold text-rose-500" : "font-medium"}`,
						children: "종목"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActiveTab("calendar"),
					className: `flex flex-col items-center justify-center flex-1 py-0.5 transition-all active:scale-95 ${activeTab === "calendar" ? "text-indigo-500 font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
					"aria-label": "캘린더",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `text-[9.5px] mt-0.5 tracking-tight ${activeTab === "calendar" ? "font-bold text-indigo-500" : "font-medium"}`,
						children: "캘린더"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActiveTab("community"),
					className: `flex flex-col items-center justify-center flex-1 py-0.5 transition-all active:scale-95 ${activeTab === "community" ? "text-rose-500 font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
					"aria-label": "커뮤니티",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `text-[9.5px] mt-0.5 tracking-tight ${activeTab === "community" ? "font-bold text-rose-500" : "font-medium"}`,
						children: "커뮤니티"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setMobileMenuOpen(true),
					className: "flex flex-col items-center justify-center flex-1 py-0.5 transition-all active:scale-95 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
					"aria-label": "전체 메뉴",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[9.5px] mt-0.5 tracking-tight font-medium",
						children: "전체"
					})]
				})
			]
		})
	});
};
//#endregion
//#region src/components/common/PriceBadge.tsx
var PriceBadge = ({ change, changePercent, price, currency, size = "md", showPrice = false, showIcon = true, showSign = true, pill = false }) => {
	const isUp = change > 0;
	const isDown = change < 0;
	const textColor = isUp ? "text-finance-up" : isDown ? "text-finance-down" : "text-finance-sub-text";
	const bgColor = isUp ? "bg-finance-up/10 text-finance-up border-finance-up/25" : isDown ? "bg-finance-down/10 text-finance-down border-finance-down/25" : "bg-finance-sub-bg text-finance-sub-text border-finance-border";
	const sizeClasses = {
		sm: "text-xs tablet:text-[11.5px]",
		md: "text-sm tablet:text-[13px] font-semibold",
		lg: "text-base tablet:text-[15px] font-bold",
		xl: "text-xl tablet:text-[18px] font-bold"
	}[size];
	const sign = isUp ? "+" : "";
	const formattedPrice = price !== void 0 ? currency ? formatMoney(price, currency) : `${price.toLocaleString()}원` : "";
	const formattedChange = currency ? formatMoney(change, currency, { showSign }) : `${showSign ? sign : ""}${change.toLocaleString()}`;
	const content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1 font-mono tracking-tight tabular-nums whitespace-nowrap ${textColor} ${sizeClasses}`,
		children: [
			showIcon && (isUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-3.5 h-3.5 shrink-0 stroke-[2.5]" }) : isDown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "w-3.5 h-3.5 shrink-0 stroke-[2.5]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "w-3 h-3 shrink-0" })),
			showPrice && price !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold text-finance-text mr-1.5 font-sans",
				children: formattedPrice
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				showSign ? sign : "",
				changePercent.toFixed(2),
				"%"
			] }),
			change !== 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-[0.8em] opacity-80 ml-0.5 tabular-nums",
				children: [
					"(",
					formattedChange,
					")"
				]
			})
		]
	});
	if (pill) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex items-center px-2 py-0.5 rounded border text-xs font-semibold tabular-nums whitespace-nowrap ${bgColor}`,
		children: content
	});
	return content;
};
//#endregion
//#region src/components/common/MarketBadge.tsx
var MarketBadge = ({ market, exchange, className = "" }) => {
	const getBadgeStyles = () => {
		if (market === "US") {
			if (exchange === "NASDAQ") return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20";
			if (exchange === "NYSE") return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20";
			if (exchange === "AMEX") return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
			return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20";
		}
		if (market === "KOSPI") return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20";
		if (market === "KOSDAQ") return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
		if (market === "COIN") return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
		return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20";
	};
	const label = exchange || market;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `px-1.5 py-0.5 rounded text-[10px] font-bold ${getBadgeStyles()} ${className}`,
		children: label
	});
};
//#endregion
//#region src/services/portfolioService.ts
/**
* Portfolio & Mock Trading Service
* 
* Strict Data Principles & Requirements:
* 1. Virtual Holdings (가상 보유 내역):
*    - User directly records holdings, buys, additional buys, and sells.
*    - Accurate weighted average price calculation on additional buy:
*      ((prevQty * prevAvgPrice) + (addQty * addPrice)) / (prevQty + addQty)
*    - Realized P&L and trade history tracking on partial or full sell.
*    - Clearly distinguishes from real brokerage accounts.
* 
* 2. Mock Trading (가상 모의투자):
*    - Virtual cash balance (default 100,000,000 KRW, resetable).
*    - Customizable trading fee and securities tax rates.
*    - Safe order execution with duplicate prevention and validation:
*      rejects insufficient cash on buy and excessive quantity on sell.
*    - ACID Firestore transactions ensuring atomic balance, holding, and order consistency.
*    - User-isolated storage in Firestore (per uid) with offline/guest fallback.
*/
var STORAGE_KEYS = {
	VIRTUAL_HOLDINGS: "bd_virtual_holdings",
	VIRTUAL_TRADES: "bd_virtual_trades",
	MOCK_ACCOUNT: "bd_mock_account",
	MOCK_POSITIONS: "bd_mock_positions",
	MOCK_ORDERS: "bd_mock_orders"
};
var DEFAULT_INITIAL_CASH = 1e8;
var DEFAULT_INITIAL_CASH_USD = 1e5;
var DEFAULT_COMMISSION_RATE = 15e-5;
var DEFAULT_TAX_RATE = .0018;
var idempotencyCache = /* @__PURE__ */ new Map();
function loadLocal(key, defaultValue) {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return defaultValue;
		return JSON.parse(raw);
	} catch {
		return defaultValue;
	}
}
function saveLocal(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (e) {
		console.warn(`[portfolioService] saveLocal error:`, e);
	}
}
var portfolioService = {
	async getVirtualHoldings(uid) {
		const normalizeHolding = (h) => {
			const currency = inferFiatCurrency(h.symbol, h.market, h.currency);
			const exchange = inferStockExchange(h.symbol, h.market, h.exchange);
			return {
				...h,
				currency,
				exchange
			};
		};
		if (!uid) return loadLocal(STORAGE_KEYS.VIRTUAL_HOLDINGS, []).map(normalizeHolding);
		try {
			const q = query(collection(db, "virtualHoldings"), where("uid", "==", uid));
			const snap = await getDocs(q);
			const list = [];
			snap.forEach((d) => {
				list.push(normalizeHolding({
					id: d.id,
					...d.data()
				}));
			});
			list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
			return list;
		} catch (err) {
			console.warn("[portfolioService] getVirtualHoldings Firestore error, using local:", err);
			return loadLocal(`${STORAGE_KEYS.VIRTUAL_HOLDINGS}_${uid}`, []).map(normalizeHolding);
		}
	},
	async saveVirtualHolding(uid, data, existingId) {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const id = existingId || (uid ? `${uid}_${data.symbol}` : `holding_${Date.now()}`);
		const currency = inferFiatCurrency(data.symbol, data.market, data.currency);
		const exchange = inferStockExchange(data.symbol, data.market, data.exchange);
		const cleanAvgPrice = roundByCurrency(data.avgBuyPrice, currency);
		const totalBuyAmount = roundByCurrency(data.quantity * cleanAvgPrice, currency);
		const validEntryFx = currency === "USD" && typeof data.entryExchangeRate === "number" && data.entryExchangeRate > 0 ? data.entryExchangeRate : void 0;
		const holding = {
			id,
			uid: uid || "guest",
			symbol: data.symbol,
			name: data.name,
			market: data.market,
			exchange,
			currency,
			quantity: data.quantity,
			avgBuyPrice: cleanAvgPrice,
			totalBuyAmount,
			buyDate: data.buyDate || now.slice(0, 10),
			...validEntryFx ? { entryExchangeRate: validEntryFx } : {},
			memo: data.memo || "",
			createdAt: now,
			updatedAt: now
		};
		if (uid) {
			try {
				await setDoc(doc(db, "virtualHoldings", id), holding, { merge: true });
				if (!existingId) {
					const tradeId = `vtrade_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
					const trade = {
						id: tradeId,
						uid,
						holdingId: id,
						symbol: data.symbol,
						name: data.name,
						currency,
						...validEntryFx ? { exchangeRate: validEntryFx } : {},
						tradeType: "BUY",
						price: cleanAvgPrice,
						quantity: data.quantity,
						totalAmount: totalBuyAmount,
						tradeDate: data.buyDate || now.slice(0, 10),
						memo: data.memo || "최초 보유 등록",
						createdAt: now
					};
					await setDoc(doc(db, "virtualHoldingHistory", tradeId), trade);
				}
			} catch (err) {
				console.warn("[portfolioService] saveVirtualHolding Firestore error, saving local:", err);
			}
			const localKey = `${STORAGE_KEYS.VIRTUAL_HOLDINGS}_${uid}`;
			saveLocal(localKey, [holding, ...loadLocal(localKey, []).filter((h) => h.id !== id)]);
		} else {
			const updatedList = [holding, ...loadLocal(STORAGE_KEYS.VIRTUAL_HOLDINGS, []).filter((h) => h.id !== id)];
			saveLocal(STORAGE_KEYS.VIRTUAL_HOLDINGS, updatedList);
			if (!existingId) {
				const trade = {
					id: `vtrade_${Date.now()}`,
					uid: "guest",
					holdingId: id,
					symbol: data.symbol,
					name: data.name,
					currency,
					...validEntryFx ? { exchangeRate: validEntryFx } : {},
					tradeType: "BUY",
					price: cleanAvgPrice,
					quantity: data.quantity,
					totalAmount: totalBuyAmount,
					tradeDate: data.buyDate || now.slice(0, 10),
					memo: data.memo || "최초 보유 등록",
					createdAt: now
				};
				const trades = loadLocal(STORAGE_KEYS.VIRTUAL_TRADES, []);
				saveLocal(STORAGE_KEYS.VIRTUAL_TRADES, [trade, ...trades]);
			}
		}
		return holding;
	},
	async addBuyVirtualHolding(uid, holdingId, addQty, addPrice, tradeDate, memo, exchangeRate) {
		if (addQty <= 0 || addPrice <= 0) throw new Error("추가 매수 수량과 매수가는 0보다 커야 합니다.");
		const target = (await this.getVirtualHoldings(uid)).find((h) => h.id === holdingId);
		if (!target) throw new Error("해당 보유 종목을 찾을 수 없습니다.");
		const currency = inferFiatCurrency(target.symbol, target.market, target.currency);
		const cleanAddPrice = roundByCurrency(addPrice, currency);
		const prevQty = target.quantity;
		const prevAvgPrice = target.avgBuyPrice;
		const newQty = prevQty + addQty;
		const newAvgPrice = roundByCurrency((prevQty * prevAvgPrice + addQty * cleanAddPrice) / newQty, currency);
		const newTotalBuyAmount = roundByCurrency(newQty * newAvgPrice, currency);
		const addTotalAmount = roundByCurrency(addQty * cleanAddPrice, currency);
		const validFx = currency === "USD" && typeof exchangeRate === "number" && exchangeRate > 0 ? exchangeRate : void 0;
		let updatedEntryFx = target.entryExchangeRate;
		if (currency === "USD" && validFx) {
			if (target.entryExchangeRate && target.entryExchangeRate > 0 && newTotalBuyAmount > 0) {
				const prevCost = prevQty * prevAvgPrice;
				updatedEntryFx = Number(((prevCost * target.entryExchangeRate + addTotalAmount * validFx) / (prevCost + addTotalAmount)).toFixed(2));
			} else updatedEntryFx = validFx;
		}
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const updatedHolding = {
			...target,
			currency,
			quantity: newQty,
			avgBuyPrice: newAvgPrice,
			totalBuyAmount: newTotalBuyAmount,
			...updatedEntryFx ? { entryExchangeRate: updatedEntryFx } : {},
			updatedAt: now
		};
		const tradeId = `vtrade_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
		const trade = {
			id: tradeId,
			uid: uid || "guest",
			holdingId,
			symbol: target.symbol,
			name: target.name,
			currency,
			...validFx ? { exchangeRate: validFx } : {},
			tradeType: "ADD_BUY",
			price: cleanAddPrice,
			quantity: addQty,
			totalAmount: addTotalAmount,
			tradeDate: tradeDate || now.slice(0, 10),
			memo: memo || `추가 매수 (${addQty}주 @ ${formatMoney(cleanAddPrice, currency)})`,
			createdAt: now
		};
		if (uid) {
			try {
				await setDoc(doc(db, "virtualHoldings", holdingId), updatedHolding, { merge: true });
				await setDoc(doc(db, "virtualHoldingHistory", tradeId), trade);
			} catch (err) {
				console.warn("[portfolioService] addBuyVirtualHolding Firestore error:", err);
			}
			const localKey = `${STORAGE_KEYS.VIRTUAL_HOLDINGS}_${uid}`;
			saveLocal(localKey, [updatedHolding, ...loadLocal(localKey, []).filter((h) => h.id !== holdingId)]);
			const tradeKey = `${STORAGE_KEYS.VIRTUAL_TRADES}_${uid}`;
			saveLocal(tradeKey, [trade, ...loadLocal(tradeKey, [])]);
		} else {
			const existingList = loadLocal(STORAGE_KEYS.VIRTUAL_HOLDINGS, []);
			saveLocal(STORAGE_KEYS.VIRTUAL_HOLDINGS, [updatedHolding, ...existingList.filter((h) => h.id !== holdingId)]);
			const trades = loadLocal(STORAGE_KEYS.VIRTUAL_TRADES, []);
			saveLocal(STORAGE_KEYS.VIRTUAL_TRADES, [trade, ...trades]);
		}
		return updatedHolding;
	},
	async sellVirtualHolding(uid, holdingId, sellQty, sellPrice, tradeDate, fee = 0, tax = 0, memo, exchangeRate) {
		if (sellQty <= 0 || sellPrice <= 0) throw new Error("매도 수량과 매도가는 0보다 커야 합니다.");
		const target = (await this.getVirtualHoldings(uid)).find((h) => h.id === holdingId);
		if (!target) throw new Error("해당 보유 종목을 찾을 수 없습니다.");
		if (sellQty > target.quantity) throw new Error(`보유 수량(${target.quantity}주)을 초과하여 매도할 수 없습니다.`);
		const currency = inferFiatCurrency(target.symbol, target.market, target.currency);
		const cleanSellPrice = roundByCurrency(sellPrice, currency);
		const remainingQty = target.quantity - sellQty;
		const grossSellAmount = roundByCurrency(sellQty * cleanSellPrice, currency);
		const grossCostBasis = roundByCurrency(sellQty * target.avgBuyPrice, currency);
		const realizedProfit = roundByCurrency(grossSellAmount - grossCostBasis - fee - tax, currency);
		const realizedProfitRate = target.avgBuyPrice > 0 ? Number(((cleanSellPrice - target.avgBuyPrice) / target.avgBuyPrice * 100).toFixed(2)) : 0;
		const validFx = currency === "USD" && typeof exchangeRate === "number" && exchangeRate > 0 ? exchangeRate : void 0;
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const tradeId = `vtrade_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
		const trade = {
			id: tradeId,
			uid: uid || "guest",
			holdingId,
			symbol: target.symbol,
			name: target.name,
			currency,
			...validFx ? { exchangeRate: validFx } : {},
			tradeType: "SELL",
			price: cleanSellPrice,
			quantity: sellQty,
			totalAmount: grossSellAmount,
			tradeDate: tradeDate || now.slice(0, 10),
			realizedProfit,
			realizedProfitRate,
			fee,
			tax,
			memo: memo || `매도 실행 (${sellQty}주, 실현손익: ${formatMoney(realizedProfit, currency, { showSign: true })})`,
			createdAt: now
		};
		if (remainingQty === 0) await this.deleteVirtualHolding(uid, holdingId);
		else {
			const updatedHolding = {
				...target,
				currency,
				quantity: remainingQty,
				totalBuyAmount: roundByCurrency(remainingQty * target.avgBuyPrice, currency),
				updatedAt: now
			};
			if (uid) {
				try {
					await setDoc(doc(db, "virtualHoldings", holdingId), updatedHolding, { merge: true });
				} catch (err) {
					console.warn("[portfolioService] update holding on sell error:", err);
				}
				const localKey = `${STORAGE_KEYS.VIRTUAL_HOLDINGS}_${uid}`;
				saveLocal(localKey, [updatedHolding, ...loadLocal(localKey, []).filter((h) => h.id !== holdingId)]);
			} else {
				const existingList = loadLocal(STORAGE_KEYS.VIRTUAL_HOLDINGS, []);
				saveLocal(STORAGE_KEYS.VIRTUAL_HOLDINGS, [updatedHolding, ...existingList.filter((h) => h.id !== holdingId)]);
			}
		}
		if (uid) {
			try {
				await setDoc(doc(db, "virtualHoldingHistory", tradeId), trade);
			} catch (err) {
				console.warn("[portfolioService] save sell trade record error:", err);
			}
			const tradeKey = `${STORAGE_KEYS.VIRTUAL_TRADES}_${uid}`;
			saveLocal(tradeKey, [trade, ...loadLocal(tradeKey, [])]);
		} else {
			const trades = loadLocal(STORAGE_KEYS.VIRTUAL_TRADES, []);
			saveLocal(STORAGE_KEYS.VIRTUAL_TRADES, [trade, ...trades]);
		}
		return {
			remainingQty,
			realizedProfit,
			realizedProfitRate
		};
	},
	async deleteVirtualHolding(uid, holdingId) {
		if (uid) {
			try {
				await deleteDoc(doc(db, "virtualHoldings", holdingId));
			} catch (err) {
				console.warn("[portfolioService] deleteVirtualHolding Firestore error:", err);
			}
			const localKey = `${STORAGE_KEYS.VIRTUAL_HOLDINGS}_${uid}`;
			saveLocal(localKey, loadLocal(localKey, []).filter((h) => h.id !== holdingId));
		} else {
			const existingList = loadLocal(STORAGE_KEYS.VIRTUAL_HOLDINGS, []);
			saveLocal(STORAGE_KEYS.VIRTUAL_HOLDINGS, existingList.filter((h) => h.id !== holdingId));
		}
	},
	async getVirtualHoldingTrades(uid) {
		const normalizeTrade = (t) => ({
			...t,
			currency: inferFiatCurrency(t.symbol, void 0, t.currency)
		});
		if (!uid) return loadLocal(STORAGE_KEYS.VIRTUAL_TRADES, []).map(normalizeTrade);
		try {
			const q = query(collection(db, "virtualHoldingHistory"), where("uid", "==", uid));
			const snap = await getDocs(q);
			const list = [];
			snap.forEach((d) => {
				list.push(normalizeTrade({
					id: d.id,
					...d.data()
				}));
			});
			list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
			return list;
		} catch (err) {
			console.warn("[portfolioService] getVirtualHoldingTrades Firestore error, using local:", err);
			return loadLocal(`${STORAGE_KEYS.VIRTUAL_TRADES}_${uid}`, []).map(normalizeTrade);
		}
	},
	async getMockAccount(uid) {
		const defaultAcc = {
			uid: uid || "guest",
			initialBalance: DEFAULT_INITIAL_CASH,
			currentCash: DEFAULT_INITIAL_CASH,
			initialBalanceUsd: DEFAULT_INITIAL_CASH_USD,
			currentCashUsd: DEFAULT_INITIAL_CASH_USD,
			commissionRate: DEFAULT_COMMISSION_RATE,
			taxRate: DEFAULT_TAX_RATE,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (!uid) {
			const local = loadLocal(STORAGE_KEYS.MOCK_ACCOUNT, defaultAcc);
			return {
				...defaultAcc,
				...local,
				currentCashUsd: local.currentCashUsd ?? DEFAULT_INITIAL_CASH_USD,
				initialBalanceUsd: local.initialBalanceUsd ?? DEFAULT_INITIAL_CASH_USD
			};
		}
		try {
			const ref = doc(db, "mockAccounts", uid);
			const snap = await getDoc(ref);
			if (snap.exists()) {
				const data = snap.data();
				return {
					...defaultAcc,
					...data,
					currentCashUsd: data.currentCashUsd ?? DEFAULT_INITIAL_CASH_USD,
					initialBalanceUsd: data.initialBalanceUsd ?? DEFAULT_INITIAL_CASH_USD
				};
			}
			await setDoc(ref, defaultAcc);
			return defaultAcc;
		} catch (err) {
			console.warn("[portfolioService] getMockAccount error, using local fallback:", err);
			const local = loadLocal(`${STORAGE_KEYS.MOCK_ACCOUNT}_${uid}`, defaultAcc);
			return {
				...defaultAcc,
				...local,
				currentCashUsd: local.currentCashUsd ?? DEFAULT_INITIAL_CASH_USD,
				initialBalanceUsd: local.initialBalanceUsd ?? DEFAULT_INITIAL_CASH_USD
			};
		}
	},
	async updateFeeSettings(uid, commissionRatePercent, taxRatePercent) {
		const updated = {
			...await this.getMockAccount(uid),
			commissionRate: commissionRatePercent / 100,
			taxRate: taxRatePercent / 100,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (uid) {
			try {
				await setDoc(doc(db, "mockAccounts", uid), updated, { merge: true });
			} catch (err) {
				console.warn("[portfolioService] updateFeeSettings Firestore error:", err);
			}
			saveLocal(`${STORAGE_KEYS.MOCK_ACCOUNT}_${uid}`, updated);
		} else saveLocal(STORAGE_KEYS.MOCK_ACCOUNT, updated);
		return updated;
	},
	async resetMockAccount(uid) {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const defaultAcc = {
			uid: uid || "guest",
			initialBalance: DEFAULT_INITIAL_CASH,
			currentCash: DEFAULT_INITIAL_CASH,
			initialBalanceUsd: DEFAULT_INITIAL_CASH_USD,
			currentCashUsd: DEFAULT_INITIAL_CASH_USD,
			commissionRate: DEFAULT_COMMISSION_RATE,
			taxRate: DEFAULT_TAX_RATE,
			createdAt: now,
			updatedAt: now
		};
		if (uid) {
			try {
				await setDoc(doc(db, "mockAccounts", uid), defaultAcc);
				const holdingsSnap = await getDocs(query(collection(db, "mockHoldings"), where("uid", "==", uid)));
				for (const docSnap of holdingsSnap.docs) await deleteDoc(docSnap.ref);
				const ordersSnap = await getDocs(query(collection(db, "mockOrders"), where("uid", "==", uid)));
				for (const docSnap of ordersSnap.docs) await deleteDoc(docSnap.ref);
			} catch (err) {
				console.warn("[portfolioService] resetMockAccount Firestore error:", err);
			}
			saveLocal(`${STORAGE_KEYS.MOCK_ACCOUNT}_${uid}`, defaultAcc);
			saveLocal(`${STORAGE_KEYS.MOCK_POSITIONS}_${uid}`, []);
			saveLocal(`${STORAGE_KEYS.MOCK_ORDERS}_${uid}`, []);
		} else {
			saveLocal(STORAGE_KEYS.MOCK_ACCOUNT, defaultAcc);
			saveLocal(STORAGE_KEYS.MOCK_POSITIONS, []);
			saveLocal(STORAGE_KEYS.MOCK_ORDERS, []);
		}
		return defaultAcc;
	},
	async getMockPositions(uid) {
		const normalizePos = (p) => ({
			...p,
			currency: inferFiatCurrency(p.symbol, p.market, p.currency),
			exchange: inferStockExchange(p.symbol, p.market, p.exchange)
		});
		if (!uid) return loadLocal(STORAGE_KEYS.MOCK_POSITIONS, []).map(normalizePos);
		try {
			const q = query(collection(db, "mockHoldings"), where("uid", "==", uid));
			const snap = await getDocs(q);
			const list = [];
			snap.forEach((d) => {
				list.push(normalizePos({
					id: d.id,
					...d.data()
				}));
			});
			list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
			return list;
		} catch (err) {
			console.warn("[portfolioService] getMockPositions Firestore error:", err);
			return loadLocal(`${STORAGE_KEYS.MOCK_POSITIONS}_${uid}`, []).map(normalizePos);
		}
	},
	async getMockOrders(uid) {
		const normalizeOrder = (o) => ({
			...o,
			currency: inferFiatCurrency(o.symbol, void 0, o.currency)
		});
		if (!uid) return loadLocal(STORAGE_KEYS.MOCK_ORDERS, []).map(normalizeOrder);
		try {
			const q = query(collection(db, "mockOrders"), where("uid", "==", uid));
			const snap = await getDocs(q);
			const list = [];
			snap.forEach((d) => {
				list.push(normalizeOrder({
					id: d.id,
					...d.data()
				}));
			});
			list.sort((a, b) => b.executedAt.localeCompare(a.executedAt));
			return list;
		} catch (err) {
			console.warn("[portfolioService] getMockOrders Firestore error:", err);
			return loadLocal(`${STORAGE_KEYS.MOCK_ORDERS}_${uid}`, []).map(normalizeOrder);
		}
	},
	async executeMockBuyOrder(uid, params) {
		const { symbol, name, market, price, quantity, reason, orderKind = "LIMIT", idempotencyKey, quoteTimestamp } = params;
		const currency = inferFiatCurrency(symbol, market, params.currency);
		inferStockExchange(symbol, market);
		const isUSD = currency === "USD";
		if (idempotencyKey && idempotencyCache.has(idempotencyKey)) {
			const cached = idempotencyCache.get(idempotencyKey);
			if (Date.now() - cached.timestamp < 1e4) return cached.order;
		}
		if (price <= 0 || !Number.isFinite(price)) throw new Error("유효한 주문 가격을 입력해주세요.");
		if (quantity <= 0 || !Number.isInteger(quantity)) throw new Error("주문 수량은 1주 이상의 정수여야 합니다.");
		if (quoteTimestamp) {
			const quoteTime = typeof quoteTimestamp === "number" ? quoteTimestamp : new Date(quoteTimestamp).getTime();
			if (!isNaN(quoteTime)) {
				const ageMs = Date.now() - quoteTime;
				if (ageMs > 6e4) throw new Error(`시세 데이터가 1분 이상 지연되어 체결할 수 없습니다. (${Math.round(ageMs / 1e3)}초 전 시세). 실시간 시세를 새로고침해주세요.`);
			}
		}
		const tradingHours = validateMarketTradingHours(market, orderKind);
		if (!tradingHours.canExecuteNow && !tradingHours.canQueuePending) throw new Error(tradingHours.message);
		const isPendingOrder = !tradingHours.canExecuteNow;
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const orderId = `morder_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
		const positionDocId = uid ? `${uid}_${symbol}` : `pos_${symbol}`;
		let orderBook = null;
		try {
			orderBook = await stockRepository.getOrderBook(symbol);
		} catch {
			orderBook = null;
		}
		const sortedAsks = [...(orderBook?.asks || []).filter((a) => a.price > 0)].sort((a, b) => a.price - b.price);
		const bestAskPrice = sortedAsks[0]?.price || orderBook?.bestAskPrice || price;
		let fills = [];
		let filledQty = 0;
		let unfilledQty = quantity;
		let totalExecutedAmount = 0;
		let executionStatus = "PENDING";
		if (isPendingOrder) {
			executionStatus = "PENDING";
			filledQty = 0;
			unfilledQty = quantity;
		} else if (orderKind === "LIMIT" && price < bestAskPrice) {
			executionStatus = "PENDING";
			filledQty = 0;
			unfilledQty = quantity;
		} else {
			if (sortedAsks.length > 0) for (let i = 0; i < sortedAsks.length; i++) {
				const ask = sortedAsks[i];
				if (orderKind === "LIMIT" && ask.price > price) break;
				if (ask.volume <= 0) continue;
				const availableVol = ask.volume;
				const takeQty = Math.min(unfilledQty, availableVol);
				if (takeQty > 0) {
					fills.push({
						price: ask.price,
						quantity: takeQty,
						amount: takeQty * ask.price,
						level: i + 1,
						executedAt: now
					});
					totalExecutedAmount += takeQty * ask.price;
					filledQty += takeQty;
					unfilledQty -= takeQty;
				}
				if (unfilledQty === 0) break;
			}
			else if (isUSD && Number(orderBook?.currentPrice) > 0) {
				const usRefPrice = Number(Number(orderBook.currentPrice).toFixed(2));
				if (orderKind === "LIMIT" && price < usRefPrice) {
					executionStatus = "PENDING";
					filledQty = 0;
					unfilledQty = quantity;
				} else {
					fills.push({
						price: usRefPrice,
						quantity,
						amount: Number((quantity * usRefPrice).toFixed(2)),
						level: 1,
						executedAt: now
					});
					totalExecutedAmount = Number((quantity * usRefPrice).toFixed(2));
					filledQty = quantity;
					unfilledQty = 0;
					executionStatus = "FILLED";
				}
			} else {
				if (orderKind === "MARKET") throw new Error("실시간 매도 호가 잔량을 확인할 수 없어 시장가 주문이 거절되었습니다. 호가창을 새로고침해주세요.");
				executionStatus = "PENDING";
				filledQty = 0;
				unfilledQty = quantity;
			}
			if (sortedAsks.length > 0) executionStatus = unfilledQty === 0 ? "FILLED" : filledQty > 0 ? "PARTIALLY_FILLED" : "PENDING";
		}
		const avgFilledPrice = filledQty > 0 ? isUSD ? Number((totalExecutedAmount / filledQty).toFixed(2)) : Math.round(totalExecutedAmount / filledQty) : price;
		const executedGross = totalExecutedAmount;
		if (uid) {
			let executedOrder = null;
			try {
				await runTransaction(db, async (tx) => {
					if (idempotencyKey) {
						const idKeyRef = doc(db, "idempotencyKeys", idempotencyKey);
						if ((await tx.get(idKeyRef)).exists()) throw new Error("이미 처리된 주문입니다.");
						tx.set(idKeyRef, {
							uid,
							createdAt: now
						});
					}
					const accRef = doc(db, "mockAccounts", uid);
					const accSnap = await tx.get(accRef);
					let accountData;
					if (!accSnap.exists()) accountData = {
						uid,
						initialBalance: DEFAULT_INITIAL_CASH,
						currentCash: DEFAULT_INITIAL_CASH,
						initialBalanceUsd: DEFAULT_INITIAL_CASH_USD,
						currentCashUsd: DEFAULT_INITIAL_CASH_USD,
						commissionRate: DEFAULT_COMMISSION_RATE,
						taxRate: DEFAULT_TAX_RATE,
						createdAt: now,
						updatedAt: now
					};
					else accountData = accSnap.data();
					const availableCash = isUSD ? accountData.currentCashUsd ?? DEFAULT_INITIAL_CASH_USD : accountData.currentCash;
					const fee = isUSD ? Number((executedGross * accountData.commissionRate).toFixed(2)) : Math.round(executedGross * accountData.commissionRate);
					const requiredCash = isUSD ? Number((executedGross + fee).toFixed(2)) : executedGross + fee;
					if (filledQty > 0 && requiredCash > availableCash) throw new Error(`가상 현금이 부족합니다. (필요: ${isUSD ? "$" + requiredCash.toLocaleString() : requiredCash.toLocaleString() + "원"}, 보유: ${isUSD ? "$" + availableCash.toLocaleString() : availableCash.toLocaleString() + "원"})`);
					const posRef = doc(db, "mockHoldings", positionDocId);
					const posSnap = await tx.get(posRef);
					if (filledQty > 0) {
						if (posSnap.exists()) {
							const currentPos = posSnap.data();
							const newQty = currentPos.quantity + filledQty;
							const newAvgPrice = isUSD ? Number(((currentPos.quantity * currentPos.avgBuyPrice + executedGross) / newQty).toFixed(2)) : Math.round((currentPos.quantity * currentPos.avgBuyPrice + executedGross) / newQty);
							tx.update(posRef, {
								quantity: newQty,
								avgBuyPrice: newAvgPrice,
								totalInvested: isUSD ? Number((newQty * newAvgPrice).toFixed(2)) : Math.round(newQty * newAvgPrice),
								updatedAt: now
							});
						} else {
							const newPos = {
								id: positionDocId,
								uid,
								symbol,
								name,
								market,
								currency,
								quantity: filledQty,
								avgBuyPrice: avgFilledPrice,
								totalInvested: executedGross,
								updatedAt: now
							};
							tx.set(posRef, newPos);
						}
					}
					if (filledQty > 0) {
						const updatedAccount = {
							...accountData,
							currentCash: isUSD ? accountData.currentCash : accountData.currentCash - requiredCash,
							currentCashUsd: isUSD ? Number(((accountData.currentCashUsd ?? DEFAULT_INITIAL_CASH_USD) - requiredCash).toFixed(2)) : accountData.currentCashUsd ?? DEFAULT_INITIAL_CASH_USD,
							updatedAt: now
						};
						tx.set(accRef, updatedAccount, { merge: true });
					}
					executedOrder = {
						id: orderId,
						uid,
						symbol,
						name,
						orderType: "BUY",
						orderKind,
						status: executionStatus,
						price: avgFilledPrice,
						quantity: filledQty > 0 ? filledQty : quantity,
						requestedQuantity: quantity,
						filledQuantity: filledQty,
						unfilledQuantity: unfilledQty,
						totalAmount: executedGross,
						fee: filledQty > 0 ? fee : 0,
						tax: 0,
						settledAmount: filledQty > 0 ? requiredCash : 0,
						reason: reason || (executionStatus === "FILLED" ? "전략 매수 체결" : executionStatus === "PARTIALLY_FILLED" ? `호가 잔량 순차 체결 (${filledQty}/${quantity}주)` : "정규장 대기 접수"),
						executedAt: now,
						currency,
						exchangeRate: params.exchangeRate,
						idempotencyKey,
						quoteSource: isUSD ? "Yahoo Finance API" : "키움증권 실전 API",
						quoteTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
						isDelayedQuote: false,
						fills
					};
					const orderRef = doc(db, "mockOrders", orderId);
					tx.set(orderRef, executedOrder);
				});
				if (executedOrder) {
					if (idempotencyKey) idempotencyCache.set(idempotencyKey, {
						order: executedOrder,
						timestamp: Date.now()
					});
					return executedOrder;
				}
			} catch (err) {
				console.warn("[portfolioService] executeMockBuyOrder Firestore transaction failed:", err);
				throw new Error(err.message || "매수 주문 처리 중 오류가 발생했습니다.");
			}
		}
		const acc = await this.getMockAccount(uid);
		const availableCash = isUSD ? acc.currentCashUsd ?? DEFAULT_INITIAL_CASH_USD : acc.currentCash;
		const fee = isUSD ? Number((executedGross * acc.commissionRate).toFixed(2)) : Math.round(executedGross * acc.commissionRate);
		const requiredCash = isUSD ? Number((executedGross + fee).toFixed(2)) : executedGross + fee;
		if (filledQty > 0 && requiredCash > availableCash) throw new Error(`가상 현금이 부족합니다. (필요: ${isUSD ? "$" + requiredCash.toLocaleString() : requiredCash.toLocaleString() + "원"}, 보유: ${isUSD ? "$" + availableCash.toLocaleString() : availableCash.toLocaleString() + "원"})`);
		const positions = await this.getMockPositions(uid);
		const existing = positions.find((p) => p.symbol === symbol);
		let updatedPositions;
		if (filledQty > 0) {
			if (existing) {
				const newQty = existing.quantity + filledQty;
				const newAvgPrice = isUSD ? Number(((existing.quantity * existing.avgBuyPrice + executedGross) / newQty).toFixed(2)) : Math.round((existing.quantity * existing.avgBuyPrice + executedGross) / newQty);
				const updatedItem = {
					...existing,
					quantity: newQty,
					avgBuyPrice: newAvgPrice,
					totalInvested: isUSD ? Number((newQty * newAvgPrice).toFixed(2)) : Math.round(newQty * newAvgPrice),
					updatedAt: now
				};
				updatedPositions = positions.map((p) => p.symbol === symbol ? updatedItem : p);
			} else updatedPositions = [{
				id: positionDocId,
				uid: "guest",
				symbol,
				name,
				market,
				currency,
				quantity: filledQty,
				avgBuyPrice: avgFilledPrice,
				totalInvested: executedGross,
				updatedAt: now
			}, ...positions];
		} else updatedPositions = positions;
		const updatedAccount = {
			...acc,
			currentCash: isUSD ? acc.currentCash : acc.currentCash - (filledQty > 0 ? requiredCash : 0),
			currentCashUsd: isUSD ? Number(((acc.currentCashUsd ?? DEFAULT_INITIAL_CASH_USD) - (filledQty > 0 ? requiredCash : 0)).toFixed(2)) : acc.currentCashUsd,
			updatedAt: now
		};
		const order = {
			id: orderId,
			uid: uid || "guest",
			symbol,
			name,
			orderType: "BUY",
			orderKind,
			status: executionStatus,
			price: avgFilledPrice,
			quantity: filledQty > 0 ? filledQty : quantity,
			requestedQuantity: quantity,
			filledQuantity: filledQty,
			unfilledQuantity: unfilledQty,
			totalAmount: executedGross,
			fee: filledQty > 0 ? fee : 0,
			tax: 0,
			settledAmount: filledQty > 0 ? requiredCash : 0,
			reason: reason || (executionStatus === "FILLED" ? "전략 매수 체결" : executionStatus === "PARTIALLY_FILLED" ? `호가 잔량 순차 체결 (${filledQty}/${quantity}주)` : "정규장 대기 접수"),
			executedAt: now,
			currency,
			exchangeRate: params.exchangeRate,
			idempotencyKey,
			quoteSource: isUSD ? "Yahoo Finance API" : "키움증권 실전 API",
			quoteTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
			isDelayedQuote: false,
			fills
		};
		saveLocal(STORAGE_KEYS.MOCK_ACCOUNT, updatedAccount);
		saveLocal(STORAGE_KEYS.MOCK_POSITIONS, updatedPositions);
		const prevOrders = loadLocal(STORAGE_KEYS.MOCK_ORDERS, []);
		saveLocal(STORAGE_KEYS.MOCK_ORDERS, [order, ...prevOrders]);
		if (idempotencyKey) idempotencyCache.set(idempotencyKey, {
			order,
			timestamp: Date.now()
		});
		return order;
	},
	async executeMockSellOrder(uid, params) {
		const { symbol, price, quantity, reason, orderKind = "LIMIT", idempotencyKey, quoteTimestamp } = params;
		if (idempotencyKey && idempotencyCache.has(idempotencyKey)) {
			const cached = idempotencyCache.get(idempotencyKey);
			if (Date.now() - cached.timestamp < 1e4) return cached.order;
		}
		if (price <= 0 || !Number.isFinite(price)) throw new Error("유효한 매도 가격을 입력해주세요.");
		if (quantity <= 0 || !Number.isInteger(quantity)) throw new Error("매도 수량은 1주 이상의 정수여야 합니다.");
		if (quoteTimestamp) {
			const quoteTime = typeof quoteTimestamp === "number" ? quoteTimestamp : new Date(quoteTimestamp).getTime();
			if (!isNaN(quoteTime)) {
				const ageMs = Date.now() - quoteTime;
				if (ageMs > 6e4) throw new Error(`시세 데이터가 1분 이상 지연되어 체결할 수 없습니다. (${Math.round(ageMs / 1e3)}초 전 시세). 실시간 시세를 새로고침해주세요.`);
			}
		}
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const orderId = `morder_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
		const positionDocId = uid ? `${uid}_${symbol}` : `pos_${symbol}`;
		if (uid) {
			let executedOrder = null;
			try {
				await runTransaction(db, async (tx) => {
					const accRef = doc(db, "mockAccounts", uid);
					const accSnap = await tx.get(accRef);
					if (!accSnap.exists()) throw new Error("모의투자 계좌를 찾을 수 없습니다.");
					const accountData = accSnap.data();
					const posRef = doc(db, "mockHoldings", positionDocId);
					const posSnap = await tx.get(posRef);
					if (!posSnap.exists()) throw new Error("매도할 보유 종목이 존재하지 않습니다.");
					const currentPos = posSnap.data();
					if (quantity > currentPos.quantity) throw new Error(`보유 수량을 초과하여 매도할 수 없습니다. (보유 수량: ${currentPos.quantity}주, 매도 요청: ${quantity}주)`);
					const currency = inferFiatCurrency(currentPos.symbol, currentPos.market, currentPos.currency);
					const isUSD = currency === "USD";
					const tradingHours = validateMarketTradingHours(params.market || currentPos.market || (isUSD ? "US" : "KRX"), orderKind);
					if (!tradingHours.canExecuteNow && !tradingHours.canQueuePending) throw new Error(tradingHours.message);
					const isPendingOrder = !tradingHours.canExecuteNow;
					let orderBook = null;
					try {
						orderBook = await stockRepository.getOrderBook(symbol);
					} catch {
						orderBook = null;
					}
					const sortedBids = [...(orderBook?.bids || []).filter((b) => b.price > 0)].sort((a, b) => b.price - a.price);
					const bestBidPrice = sortedBids[0]?.price || orderBook?.bestBidPrice || price;
					let fills = [];
					let filledQty = 0;
					let unfilledQty = quantity;
					let totalExecutedAmount = 0;
					let executionStatus = "PENDING";
					if (isPendingOrder) {
						executionStatus = "PENDING";
						filledQty = 0;
						unfilledQty = quantity;
					} else if (orderKind === "LIMIT" && price > bestBidPrice) {
						executionStatus = "PENDING";
						filledQty = 0;
						unfilledQty = quantity;
					} else {
						if (sortedBids.length > 0) for (let i = 0; i < sortedBids.length; i++) {
							const bid = sortedBids[i];
							if (orderKind === "LIMIT" && bid.price < price) break;
							if (bid.volume <= 0) continue;
							const availableVol = bid.volume;
							const takeQty = Math.min(unfilledQty, availableVol);
							if (takeQty > 0) {
								fills.push({
									price: bid.price,
									quantity: takeQty,
									amount: takeQty * bid.price,
									level: i + 1,
									executedAt: now
								});
								totalExecutedAmount += takeQty * bid.price;
								filledQty += takeQty;
								unfilledQty -= takeQty;
							}
							if (unfilledQty === 0) break;
						}
						else if (isUSD && Number(orderBook?.currentPrice) > 0) {
							const usRefPrice = Number(Number(orderBook.currentPrice).toFixed(2));
							if (orderKind === "LIMIT" && price > usRefPrice) {
								executionStatus = "PENDING";
								filledQty = 0;
								unfilledQty = quantity;
							} else {
								fills.push({
									price: usRefPrice,
									quantity,
									amount: Number((quantity * usRefPrice).toFixed(2)),
									level: 1,
									executedAt: now
								});
								totalExecutedAmount = Number((quantity * usRefPrice).toFixed(2));
								filledQty = quantity;
								unfilledQty = 0;
								executionStatus = "FILLED";
							}
						} else {
							if (orderKind === "MARKET") throw new Error("실시간 매수 호가 잔량을 확인할 수 없어 시장가 매도 주문이 거절되었습니다. 호가창을 새로고침해주세요.");
							executionStatus = "PENDING";
							filledQty = 0;
							unfilledQty = quantity;
						}
						if (sortedBids.length > 0) executionStatus = unfilledQty === 0 ? "FILLED" : filledQty > 0 ? "PARTIALLY_FILLED" : "PENDING";
					}
					const avgFilledPrice = filledQty > 0 ? isUSD ? Number((totalExecutedAmount / filledQty).toFixed(2)) : Math.round(totalExecutedAmount / filledQty) : price;
					const grossAmount = totalExecutedAmount;
					const fee = isUSD ? Number((grossAmount * accountData.commissionRate).toFixed(2)) : Math.round(grossAmount * accountData.commissionRate);
					const tax = isUSD ? 0 : Math.round(grossAmount * accountData.taxRate);
					const netProceeds = isUSD ? Number((grossAmount - fee - tax).toFixed(2)) : grossAmount - fee - tax;
					const costBasis = isUSD ? Number((filledQty * currentPos.avgBuyPrice).toFixed(2)) : Math.round(filledQty * currentPos.avgBuyPrice);
					const realizedProfit = filledQty > 0 ? isUSD ? Number((grossAmount - costBasis - fee - tax).toFixed(2)) : grossAmount - costBasis - fee - tax : 0;
					const realizedProfitRate = currentPos.avgBuyPrice > 0 && filledQty > 0 ? Number(((avgFilledPrice - currentPos.avgBuyPrice) / currentPos.avgBuyPrice * 100).toFixed(2)) : 0;
					if (filledQty > 0) {
						const remainingQty = currentPos.quantity - filledQty;
						if (remainingQty === 0) tx.delete(posRef);
						else tx.update(posRef, {
							quantity: remainingQty,
							totalInvested: isUSD ? Number((remainingQty * currentPos.avgBuyPrice).toFixed(2)) : Math.round(remainingQty * currentPos.avgBuyPrice),
							updatedAt: now
						});
						tx.update(accRef, {
							currentCash: isUSD ? accountData.currentCash : accountData.currentCash + netProceeds,
							currentCashUsd: isUSD ? Number(((accountData.currentCashUsd ?? DEFAULT_INITIAL_CASH_USD) + netProceeds).toFixed(2)) : accountData.currentCashUsd,
							updatedAt: now
						});
					}
					executedOrder = {
						id: orderId,
						uid,
						symbol,
						name: currentPos.name,
						orderType: "SELL",
						orderKind,
						status: executionStatus,
						price: avgFilledPrice,
						quantity: filledQty > 0 ? filledQty : quantity,
						requestedQuantity: quantity,
						filledQuantity: filledQty,
						unfilledQuantity: unfilledQty,
						totalAmount: grossAmount,
						fee: filledQty > 0 ? fee : 0,
						tax: filledQty > 0 ? tax : 0,
						settledAmount: filledQty > 0 ? netProceeds : 0,
						realizedProfit: filledQty > 0 ? realizedProfit : 0,
						realizedProfitRate: filledQty > 0 ? realizedProfitRate : 0,
						reason: reason || (executionStatus === "FILLED" ? "목표 달성 및 차익 실현 매도" : executionStatus === "PARTIALLY_FILLED" ? `호가 잔량 순차 체결 (${filledQty}/${quantity}주)` : "정규장 대기 접수"),
						executedAt: now,
						currency,
						exchangeRate: params.exchangeRate,
						idempotencyKey,
						quoteSource: isUSD ? "Yahoo Finance API" : "키움증권 실전 API",
						quoteTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
						isDelayedQuote: false,
						fills
					};
					const orderRef = doc(db, "mockOrders", orderId);
					tx.set(orderRef, executedOrder);
				});
				if (executedOrder) {
					if (idempotencyKey) idempotencyCache.set(idempotencyKey, {
						order: executedOrder,
						timestamp: Date.now()
					});
					return executedOrder;
				}
			} catch (err) {
				console.warn("[portfolioService] executeMockSellOrder Firestore transaction failed:", err);
				throw new Error(err.message || "매도 주문 처리 중 오류가 발생했습니다.");
			}
		}
		const acc = await this.getMockAccount(uid);
		const positions = await this.getMockPositions(uid);
		const currentPos = positions.find((p) => p.symbol === symbol);
		if (!currentPos) throw new Error("매도할 보유 종목이 존재하지 않습니다.");
		if (quantity > currentPos.quantity) throw new Error(`보유 수량을 초과하여 매도할 수 없습니다. (보유 수량: ${currentPos.quantity}주, 매도 요청: ${quantity}주)`);
		const currency = inferFiatCurrency(currentPos.symbol, currentPos.market, currentPos.currency);
		const isUSD = currency === "USD";
		const grossAmount = isUSD ? Number((price * quantity).toFixed(2)) : Math.round(price * quantity);
		const fee = isUSD ? Number((grossAmount * acc.commissionRate).toFixed(2)) : Math.round(grossAmount * acc.commissionRate);
		const tax = isUSD ? 0 : Math.round(grossAmount * acc.taxRate);
		const netProceeds = isUSD ? Number((grossAmount - fee - tax).toFixed(2)) : grossAmount - fee - tax;
		const costBasis = isUSD ? Number((quantity * currentPos.avgBuyPrice).toFixed(2)) : Math.round(quantity * currentPos.avgBuyPrice);
		const realizedProfit = isUSD ? Number((grossAmount - costBasis - fee - tax).toFixed(2)) : grossAmount - costBasis - fee - tax;
		const realizedProfitRate = currentPos.avgBuyPrice > 0 ? Number(((price - currentPos.avgBuyPrice) / currentPos.avgBuyPrice * 100).toFixed(2)) : 0;
		const remainingQty = currentPos.quantity - quantity;
		let updatedPositions;
		if (remainingQty === 0) updatedPositions = positions.filter((p) => p.symbol !== symbol);
		else updatedPositions = positions.map((p) => p.symbol === symbol ? {
			...p,
			quantity: remainingQty,
			totalInvested: isUSD ? Number((remainingQty * p.avgBuyPrice).toFixed(2)) : Math.round(remainingQty * p.avgBuyPrice),
			updatedAt: now
		} : p);
		const updatedAccount = {
			...acc,
			currentCash: isUSD ? acc.currentCash : acc.currentCash + netProceeds,
			currentCashUsd: isUSD ? Number(((acc.currentCashUsd ?? DEFAULT_INITIAL_CASH_USD) + netProceeds).toFixed(2)) : acc.currentCashUsd,
			updatedAt: now
		};
		const order = {
			id: orderId,
			uid: uid || "guest",
			symbol,
			name: currentPos.name,
			orderType: "SELL",
			orderKind,
			status: "FILLED",
			price,
			quantity,
			requestedQuantity: quantity,
			filledQuantity: quantity,
			unfilledQuantity: 0,
			totalAmount: grossAmount,
			fee,
			tax,
			settledAmount: netProceeds,
			realizedProfit,
			realizedProfitRate,
			reason: reason || "목표 달성 및 차익 실현 매도",
			executedAt: now,
			currency,
			exchangeRate: params.exchangeRate,
			idempotencyKey,
			quoteSource: isUSD ? "Yahoo Finance API" : "키움증권 실전 API",
			quoteTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
			isDelayedQuote: false
		};
		saveLocal(STORAGE_KEYS.MOCK_ACCOUNT, updatedAccount);
		saveLocal(STORAGE_KEYS.MOCK_POSITIONS, updatedPositions);
		const prevOrders = loadLocal(STORAGE_KEYS.MOCK_ORDERS, []);
		saveLocal(STORAGE_KEYS.MOCK_ORDERS, [order, ...prevOrders]);
		if (idempotencyKey) idempotencyCache.set(idempotencyKey, {
			order,
			timestamp: Date.now()
		});
		return order;
	},
	async resolveQuote(symbol) {
		try {
			const stock = await stockRepository.getStock(symbol);
			if (stock && stock.price > 0) {
				let bestAskPrice = stock.price;
				let bestBidPrice = stock.price;
				try {
					const ob = await stockRepository.getOrderBook(symbol);
					if (ob) {
						bestAskPrice = ob.bestAskPrice || (ob.asks?.length ? ob.asks[ob.asks.length - 1].price : stock.price);
						bestBidPrice = ob.bestBidPrice || (ob.bids?.length ? ob.bids[0].price : stock.price);
					}
				} catch {}
				const resolvedCurrency = inferFiatCurrency(stock.symbol, stock.market, stock.currency);
				const resolvedExchange = inferStockExchange(stock.symbol, stock.market, stock.exchange);
				const isUS = resolvedCurrency === "USD";
				const isLiveExchange = stock.dataSource === "kiwoom" || stock.dataSource === "upbit" || stock.dataSource === "binance";
				const resolvedProvider = stock.dataSource === "yahoo" ? "Yahoo Finance API" : stock.dataSource === "upbit" ? "Upbit API" : stock.dataSource === "binance" ? "Binance API" : isUS ? "Yahoo Finance API" : "키움증권 실전 API";
				return {
					symbol: stock.symbol,
					name: stock.name,
					price: stock.price,
					change: stock.change,
					changePercent: stock.changePercent,
					currency: resolvedCurrency,
					market: stock.market,
					exchange: resolvedExchange,
					delayLabel: stock.delayLabel || (isUS ? "15분 지연 시세" : stock.dataSource === "yahoo" ? "대체 시세 (지연)" : "실시간 체결가"),
					isRealtime: !isUS && isLiveExchange,
					provider: resolvedProvider,
					status: stock.isStale || stock.dataSource === "yahoo" ? "delayed" : "ok",
					asOf: stock.lastUpdated || (/* @__PURE__ */ new Date()).toLocaleTimeString("ko-KR"),
					quoteTimestamp: Date.now(),
					bestAskPrice,
					bestBidPrice
				};
			}
			const globalSummary = await globalMarketClient.getSummary();
			const foundGlobal = [
				...globalSummary.groups.us,
				...globalSummary.groups.asia,
				...globalSummary.groups.europe
			].find((g) => g.symbol.toUpperCase() === symbol.toUpperCase() || g.id.toLowerCase() === symbol.toLowerCase());
			if (foundGlobal && foundGlobal.value > 0) return {
				symbol: foundGlobal.symbol,
				name: foundGlobal.name,
				price: foundGlobal.value,
				change: foundGlobal.change,
				changePercent: foundGlobal.changePercent,
				currency: foundGlobal.currency || "USD",
				market: foundGlobal.category.toUpperCase(),
				delayLabel: foundGlobal.delayLabel || "15분 지연",
				isRealtime: false,
				provider: foundGlobal.provider || "Yahoo Finance Public API",
				status: foundGlobal.status || "ok",
				asOf: foundGlobal.lastUpdated || (/* @__PURE__ */ new Date()).toLocaleTimeString("ko-KR"),
				quoteTimestamp: Date.now(),
				bestAskPrice: foundGlobal.value,
				bestBidPrice: foundGlobal.value
			};
			return null;
		} catch (err) {
			console.warn(`[portfolioService] resolveQuote failed for ${symbol}:`, err);
			return null;
		}
	}
};
//#endregion
//#region src/components/portfolio/MockTradeModal.tsx
var MockTradeModal = ({ isOpen, onClose, symbol, stockName, defaultPrice, initialType = "BUY", onTradeSuccess }) => {
	const { user, showToast, exchangeRate } = useApp();
	const [orderType, setOrderType] = (0, import_react.useState)(initialType);
	const [orderKind, setOrderKind] = (0, import_react.useState)("LIMIT");
	const [account, setAccount] = (0, import_react.useState)(null);
	const [positions, setPositions] = (0, import_react.useState)([]);
	const [currentHolding, setCurrentHolding] = (0, import_react.useState)(null);
	const [quote, setQuote] = (0, import_react.useState)(null);
	const [inputPrice, setInputPrice] = (0, import_react.useState)("");
	const [quantity, setQuantity] = (0, import_react.useState)("1");
	const [reason, setReason] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [errorMsg, setErrorMsg] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (isOpen && symbol) {
			setErrorMsg("");
			setIsSubmitting(false);
			setOrderType(initialType);
			setOrderKind("LIMIT");
			setQuantity("1");
			setReason("");
			portfolioService.getMockAccount(user?.id).then(setAccount);
			portfolioService.getMockPositions(user?.id).then((pos) => {
				setPositions(pos);
				const match = pos.find((p) => p.symbol === symbol);
				setCurrentHolding(match || null);
			});
			portfolioService.resolveQuote(symbol).then((q) => {
				if (q) {
					setQuote(q);
					setInputPrice(String(q.price));
				} else if (defaultPrice) {
					const fallbackCurrency = inferFiatCurrency(symbol);
					setQuote({
						price: defaultPrice,
						name: stockName || symbol,
						currency: fallbackCurrency,
						delayLabel: "조회 시세 (지연 가능)",
						isRealtime: false,
						provider: fallbackCurrency === "USD" ? "글로벌 시세 데이터" : "대체 시세 데이터",
						status: "ok",
						asOf: (/* @__PURE__ */ new Date()).toLocaleTimeString("ko-KR"),
						quoteTimestamp: Date.now(),
						bestAskPrice: defaultPrice,
						bestBidPrice: defaultPrice
					});
					setInputPrice(String(defaultPrice));
				}
			});
		}
	}, [
		isOpen,
		symbol,
		initialType,
		defaultPrice,
		stockName,
		user?.id
	]);
	if (!isOpen) return null;
	const tradeCurrency = inferFiatCurrency(symbol, void 0, quote?.currency);
	const isUSD = tradeCurrency === "USD";
	const currencySymbol = isUSD ? "$" : "₩";
	const fxCheck = validateExchangeRate(exchangeRate);
	const bestAsk = quote?.bestAskPrice || quote?.price || defaultPrice || 0;
	const bestBid = quote?.bestBidPrice || quote?.price || defaultPrice || 0;
	const numPrice = orderKind === "MARKET" ? orderType === "BUY" ? bestAsk : bestBid : parseFloat(inputPrice) || 0;
	const numQty = parseInt(quantity, 10) || 0;
	const grossAmount = isUSD ? Number((numPrice * numQty).toFixed(2)) : Math.round(numPrice * numQty);
	const commissionRate = account?.commissionRate ?? 15e-5;
	const taxRate = account?.taxRate ?? .0018;
	const fee = isUSD ? Number((grossAmount * commissionRate).toFixed(2)) : Math.round(grossAmount * commissionRate);
	const tax = orderType === "SELL" ? isUSD ? 0 : Math.round(grossAmount * taxRate) : 0;
	const totalSettled = orderType === "BUY" ? isUSD ? Number((grossAmount + fee).toFixed(2)) : grossAmount + fee : isUSD ? Number((grossAmount - fee - tax).toFixed(2)) : grossAmount - fee - tax;
	const availableCash = isUSD ? account?.currentCashUsd ?? 1e5 : account?.currentCash ?? 0;
	const holdingQty = currentHolding?.quantity ?? 0;
	const maxBuyQty = numPrice > 0 ? Math.floor(availableCash / (numPrice * (1 + commissionRate))) : 0;
	const handleExecuteTrade = async (e) => {
		e.preventDefault();
		setErrorMsg("");
		if (numPrice <= 0) {
			setErrorMsg("유효한 주문 가격을 입력해주세요.");
			return;
		}
		if (numQty <= 0) {
			setErrorMsg("주문 수량은 1주 이상이어야 합니다.");
			return;
		}
		if (orderType === "BUY" && totalSettled > availableCash) {
			setErrorMsg(`가상 ${isUSD ? "외화(USD)" : "원화(KRW)"} 잔고가 부족합니다. (필요: ${formatMoney(totalSettled, tradeCurrency)}, 보유: ${formatMoney(availableCash, tradeCurrency)})`);
			return;
		}
		if (orderType === "SELL" && numQty > holdingQty) {
			setErrorMsg(`보유 수량(${holdingQty}주)을 초과하여 매도할 수 없습니다.`);
			return;
		}
		setIsSubmitting(true);
		const idempotencyKey = `mock_ord_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
		try {
			if (orderType === "BUY") {
				const order = await portfolioService.executeMockBuyOrder(user?.id, {
					symbol,
					name: quote?.name || stockName || symbol,
					market: isUSD ? "US" : "KOSPI",
					currency: tradeCurrency,
					orderKind,
					price: numPrice,
					quantity: numQty,
					reason,
					exchangeRate: fxCheck.valid && fxCheck.rate ? fxCheck.rate : void 0,
					idempotencyKey,
					quoteTimestamp: quote?.quoteTimestamp
				});
				if (order.status === "FILLED") showToast(`'${quote?.name || symbol}' ${order.quantity}주 전량 매수 체결되었습니다. (${formatMoney(order.price, tradeCurrency)})`, "success");
				else if (order.status === "PARTIALLY_FILLED") showToast(`'${quote?.name || symbol}' ${order.filledQuantity}주 부분 체결, ${order.unfilledQuantity}주 미체결 잔량 대기.`, "info");
				else showToast(`'${quote?.name || symbol}' ${numQty}주 매수 주문이 대기(PENDING) 상태로 안전하게 접수되었습니다.`, "info");
			} else {
				const order = await portfolioService.executeMockSellOrder(user?.id, {
					symbol,
					market: isUSD ? "US" : "KOSPI",
					orderKind,
					price: numPrice,
					quantity: numQty,
					reason,
					exchangeRate: fxCheck.valid && fxCheck.rate ? fxCheck.rate : void 0,
					idempotencyKey,
					quoteTimestamp: quote?.quoteTimestamp
				});
				if (order.status === "FILLED") showToast(`'${quote?.name || symbol}' ${order.quantity}주 전량 매도 체결되었습니다. (${formatMoney(order.price, tradeCurrency)})`, "info");
				else if (order.status === "PARTIALLY_FILLED") showToast(`'${quote?.name || symbol}' ${order.filledQuantity}주 부분 매도 체결되었습니다.`, "info");
				else showToast(`'${quote?.name || symbol}' ${numQty}주 매도 주문이 대기(PENDING) 상태로 안전하게 접수되었습니다.`, "info");
			}
			onTradeSuccess?.();
			onClose();
		} catch (err) {
			setErrorMsg(err.message || "모의 주문 체결 중 오류가 발생했습니다.");
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-base text-slate-900 dark:text-white",
							children: quote?.name || stockName || symbol
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold",
							children: symbol
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mt-1 text-[11px] text-slate-500",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-emerald-600 dark:text-emerald-400 font-bold",
								children: quote?.provider || "키움 실전 API"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: quote?.delayLabel || "실시간"
							})
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 m-4 mb-2 rounded-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setOrderType("BUY");
							setErrorMsg("");
						},
						className: `py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${orderType === "BUY" ? "bg-rose-500 text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "가상 매수" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setOrderType("SELL");
							setErrorMsg("");
						},
						className: `py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${orderType === "SELL" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "가상 매도" })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-4 py-1 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-slate-600 dark:text-slate-400",
						children: "주문 유형"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setOrderKind("LIMIT"),
							className: `px-3 py-1 rounded-md font-bold transition-colors ${orderKind === "LIMIT" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`,
							children: "지정가"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setOrderKind("MARKET");
								setInputPrice(String(orderType === "BUY" ? bestAsk : bestBid));
							},
							className: `px-3 py-1 rounded-md font-bold transition-colors ${orderKind === "MARKET" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`,
							children: "시장가 (호가 체결)"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleExecuteTrade,
					className: "p-4 space-y-3.5",
					children: [
						errorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-500 font-semibold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errorMsg })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-slate-400 block font-sans",
								children: orderType === "BUY" ? `주문 가능 현금 (${isUSD ? "USD" : "KRW"})` : "현재 보유 수량"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-slate-900 dark:text-white text-sm",
								children: orderType === "BUY" ? formatMoney(availableCash, tradeCurrency) : `${holdingQty.toLocaleString()}주`
							})] }), orderType === "BUY" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-slate-400 block font-sans",
									children: "최대 매수 가능"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-rose-500 text-sm",
									children: [maxBuyQty.toLocaleString(), "주"]
								})]
							}) : currentHolding && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-slate-400 block font-sans",
									children: "평균 매입단가"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-slate-900 dark:text-white text-sm",
									children: formatMoney(currentHolding.avgBuyPrice, tradeCurrency)
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-bold text-slate-700 dark:text-slate-300",
									children: orderKind === "MARKET" ? `체결 기준가 (${currencySymbol})` : `주문 희망가 (${currencySymbol})`
								}), quote?.price && orderKind === "LIMIT" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setInputPrice(String(quote.price)),
									className: "text-[10px] text-rose-500 hover:underline font-bold",
									children: "현재가 적용"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: "0.01",
								step: "any",
								value: orderKind === "MARKET" ? orderType === "BUY" ? bestAsk : bestBid : inputPrice,
								onChange: (e) => setInputPrice(e.target.value),
								disabled: orderKind === "MARKET",
								className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-75 disabled:cursor-not-allowed",
								required: true
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-bold text-slate-700 dark:text-slate-300",
										children: "주문 수량 (주)"
									}),
									orderType === "BUY" && maxBuyQty > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setQuantity(String(maxBuyQty)),
										className: "text-[10px] text-rose-500 hover:underline font-bold",
										children: [
											"최대 ",
											maxBuyQty,
											"주"
										]
									}),
									orderType === "SELL" && holdingQty > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setQuantity(String(holdingQty)),
										className: "text-[10px] text-blue-500 hover:underline font-bold",
										children: [
											"전량 ",
											holdingQty,
											"주"
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: "1",
								max: orderType === "SELL" ? holdingQty : maxBuyQty,
								step: "1",
								value: quantity,
								onChange: (e) => setQuantity(e.target.value),
								className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500",
								required: true
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
							children: "매매 전략 사유 / 기록 노트"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: reason,
							onChange: (e) => setReason(e.target.value),
							placeholder: "예: 20일선 지지 반등 매수, 저항선 도달 분할 매도",
							className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs font-mono space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-slate-600 dark:text-slate-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-sans",
										children: [
											"주문 총액 (",
											tradeCurrency,
											"):"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(grossAmount, tradeCurrency) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-slate-500 text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-sans",
										children: [
											"수수료 (",
											(commissionRate * 100).toFixed(3),
											"%):"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(fee, tradeCurrency) })]
								}),
								orderType === "SELL" && !isUSD && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-slate-500 text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-sans",
										children: [
											"증권거래세 (",
											(taxRate * 100).toFixed(2),
											"%):"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(tax, tradeCurrency) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-1.5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-sans text-slate-900 dark:text-white",
										children: orderType === "BUY" ? "최종 필요 현금:" : "예상 입금 현금:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: orderType === "BUY" ? "text-rose-500" : "text-blue-500",
										children: formatMoney(totalSettled, tradeCurrency)
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-600 dark:text-amber-400 flex items-start gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-3.5 h-3.5 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "실제 증권 계좌 주문이 아니며, 가상 자금으로 체결되는 모의 트레이딩입니다." })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onClose,
								disabled: isSubmitting,
								className: "px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
								children: "취소"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: isSubmitting,
								className: `flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md active:scale-95 ${orderType === "BUY" ? "bg-rose-600 hover:bg-rose-500 shadow-rose-600/20" : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSubmitting ? "주문 체결 중..." : orderType === "BUY" ? "가상 매수 주문 실행" : "가상 매도 주문 실행" })]
							})]
						})
					]
				})
			]
		})
	});
};
//#endregion
//#region src/components/layout/SearchModal.tsx
var RECENT_SEARCHES_KEY = "bd_recent_stock_searches";
var SearchModal = () => {
	const { isSearchOpen, setIsSearchOpen, navigateToStock, isWatchlisted, addToWatchlist, removeFromWatchlist, toggleWatchlist, exchangeRate } = useApp();
	const [query, setQuery] = (0, import_react.useState)("");
	const [marketFilter, setMarketFilter] = (0, import_react.useState)("ALL");
	const [searchResults, setSearchResults] = (0, import_react.useState)([]);
	const [isSearching, setIsSearching] = (0, import_react.useState)(false);
	const [searchError, setSearchError] = (0, import_react.useState)(null);
	const [retryNonce, setRetryNonce] = (0, import_react.useState)(0);
	const [selectedIndex, setSelectedIndex] = (0, import_react.useState)(0);
	const [selectedTradeStock, setSelectedTradeStock] = (0, import_react.useState)(null);
	const [recentSearches, setRecentSearches] = (0, import_react.useState)(() => {
		try {
			const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
			return saved ? JSON.parse(saved) : [
				"삼성전자",
				"NVDA",
				"SK하이닉스",
				"AAPL",
				"005930",
				"TSLA"
			];
		} catch {
			return [
				"삼성전자",
				"NVDA",
				"AAPL"
			];
		}
	});
	const inputRef = (0, import_react.useRef)(null);
	const listRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (isSearchOpen) {
			setTimeout(() => inputRef.current?.focus(), 50);
			setSelectedIndex(0);
		} else {
			setQuery("");
			setSearchResults([]);
			setIsSearching(false);
			setSearchError(null);
		}
	}, [isSearchOpen]);
	(0, import_react.useEffect)(() => {
		const trimmed = query.trim();
		if (!trimmed) {
			setSearchResults([]);
			setIsSearching(false);
			setSearchError(null);
			setSelectedIndex(0);
			return;
		}
		const controller = new AbortController();
		let isSubscribed = true;
		setIsSearching(true);
		setSearchError(null);
		const handler = setTimeout(async () => {
			try {
				const results = await stockRepository.searchStocks({
					query: trimmed,
					market: marketFilter,
					limit: 16,
					signal: controller.signal
				});
				if (isSubscribed && !controller.signal.aborted) {
					setSearchResults(results);
					setSelectedIndex(0);
				}
			} catch (err) {
				if (err?.name === "AbortError" || controller.signal.aborted) return;
				if (isSubscribed) {
					setSearchResults([]);
					setSearchError(err?.message || "시세 공급자 연결 오류가 발생했습니다.");
				}
			} finally {
				if (isSubscribed && !controller.signal.aborted) setIsSearching(false);
			}
		}, 200);
		return () => {
			isSubscribed = false;
			controller.abort();
			clearTimeout(handler);
		};
	}, [
		query,
		marketFilter,
		retryNonce
	]);
	const saveRecentSearch = (term) => {
		try {
			const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 8);
			setRecentSearches(updated);
			localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
		} catch {}
	};
	const removeRecentSearch = (e, term) => {
		e.stopPropagation();
		const updated = recentSearches.filter((s) => s !== term);
		setRecentSearches(updated);
		try {
			localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
		} catch {}
	};
	const handleSelectStock = (stock) => {
		saveRecentSearch(stock.name);
		navigateToStock(stock.symbol);
		setIsSearchOpen(false);
	};
	const handleKeyDown = (e) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			if (searchResults.length > 0) setSelectedIndex((prev) => (prev + 1) % searchResults.length);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			if (searchResults.length > 0) setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
		} else if (e.key === "Enter") {
			e.preventDefault();
			if (searchResults.length > 0 && searchResults[selectedIndex]) handleSelectStock(searchResults[selectedIndex]);
		} else if (e.key === "Escape") setIsSearchOpen(false);
	};
	const popularKeywords = [
		{
			text: "삼성전자",
			symbol: "005930"
		},
		{
			text: "비트코인",
			symbol: "KRW-BTC"
		},
		{
			text: "이더리움",
			symbol: "KRW-ETH"
		},
		{
			text: "엔비디아",
			symbol: "NVDA"
		},
		{
			text: "TSMC ADR",
			symbol: "TSM"
		},
		{
			text: "SK하이닉스",
			symbol: "000660"
		},
		{
			text: "테슬라",
			symbol: "TSLA"
		},
		{
			text: "QQQ ETF",
			symbol: "QQQ"
		},
		{
			text: "SOXL (3X)",
			symbol: "SOXL"
		},
		{
			text: "BTC/USDT",
			symbol: "BTCUSDT"
		}
	];
	if (!isSearchOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150",
		onClick: () => setIsSearchOpen(false),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-100",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3 bg-slate-50/50 dark:bg-slate-800/30",
					children: [
						isSearching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-5 h-5 text-rose-500 animate-spin shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-5 h-5 text-rose-500 shrink-0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: inputRef,
							type: "text",
							value: query,
							onChange: (e) => setQuery(e.target.value),
							onKeyDown: handleKeyDown,
							placeholder: "종목명, 티커, 코드, 코인명, 초성 입력 (예: 삼성, NVDA, 비트코인, KRW-BTC, TSM)",
							className: "w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none font-medium"
						}),
						query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setQuery(""),
							className: "p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md",
							title: "검색어 지우기",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono font-medium text-slate-400 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700",
							children: "ESC"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1.5 px-4 py-2 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-900/40 text-xs font-medium overflow-x-auto no-scrollbar",
					children: [
						{
							id: "ALL",
							label: "전체",
							activeClass: "bg-rose-500 text-white shadow-xs"
						},
						{
							id: "KOSPI",
							label: "코스피",
							activeClass: "bg-indigo-600 text-white shadow-xs"
						},
						{
							id: "KOSDAQ",
							label: "코스닥",
							activeClass: "bg-emerald-600 text-white shadow-xs"
						},
						{
							id: "US",
							label: "미국",
							activeClass: "bg-purple-600 text-white shadow-xs"
						},
						{
							id: "COIN",
							label: "코인",
							activeClass: "bg-amber-600 text-white shadow-xs"
						}
					].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setMarketFilter(tab.id),
						className: `px-3 py-1 rounded-lg transition-colors font-bold cursor-pointer shrink-0 ${marketFilter === tab.id ? tab.activeClass : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800"}`,
						children: tab.label
					}, tab.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: listRef,
					className: "flex-1 overflow-y-auto p-3",
					children: query.trim() ? searchResults.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-3 py-1.5 flex items-center justify-between text-xs font-semibold text-slate-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"검색 결과 (",
									searchResults.length,
									"건)"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-500 font-bold border border-rose-500/20",
									children: "KOSPI · KOSDAQ · US · COIN"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline text-[11px] text-slate-400",
								children: "방향키(↑↓)로 이동 후 Enter로 선택"
							})]
						}), searchResults.map((stock, idx) => {
							const isSelected = idx === selectedIndex;
							const chosung = extractChosung(stock.name);
							const isChosungSearch = isChosungQuery(query);
							inferStockCurrency(stock.symbol, stock.market, stock.currency);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleSelectStock(stock),
								onMouseEnter: () => setSelectedIndex(idx),
								className: `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors text-left group cursor-pointer ${isSelected ? "bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30" : "hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 min-w-0 pr-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-xs font-mono px-1.5 py-0.5 rounded font-bold ${isSelected ? "bg-rose-500/20 text-rose-600 dark:text-rose-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`,
										children: stock.symbol
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "truncate",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `font-bold text-sm sm:text-base transition-colors ${isSelected ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}`,
													children: stock.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketBadge, {
													market: stock.market,
													exchange: stock.exchange
												}),
												stock.productType && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `text-[9px] font-bold px-1.5 py-0.5 rounded border ${stock.productType === "ETF" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : stock.productType === "ADR" ? "bg-purple-500/10 text-purple-500 border-purple-500/20" : stock.productType === "SPOT" ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"}`,
													children: stock.productType === "ETF" ? "ETF" : stock.productType === "ADR" ? "ADR" : stock.productType === "SPOT" ? "현물" : "보통주"
												}),
												stock.warning && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/40",
													children: "⚠️ 유의"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 text-xs text-slate-400 mt-0.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: stock.sector }),
												stock.tradingPair && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold",
													children: [
														"[",
														stock.tradingPair,
														"]"
													]
												}),
												stock.nameEn && stock.nameEn !== stock.name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono text-[10px] text-slate-400 truncate max-w-[150px]",
													children: [
														"(",
														stock.nameEn,
														")"
													]
												}),
												isChosungSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono text-rose-500 dark:text-rose-400 text-[11px]",
													children: ["· 초성: ", chosung]
												})
											]
										})]
									})]
								}), (() => {
									const stockCur = inferStockCurrency(stock.symbol, stock.market, stock.currency);
									const fxCheck = validateExchangeRate(exchangeRate);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5 shrink-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-right",
												children: stock.price > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-sm font-bold font-mono text-slate-900 dark:text-white",
														children: formatMoney(stock.price, stockCur)
													}),
													(stockCur === "USD" || stockCur === "USDT") && fxCheck.valid && fxCheck.rate !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-[10px] text-slate-400 font-mono",
														children: ["≈ ", formatMoney(stock.price * fxCheck.rate, "KRW")]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceBadge, {
														change: stock.change,
														changePercent: stock.changePercent,
														currency: stockCur,
														size: "sm"
													})
												] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[11px] font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20",
													children: stock.market === "COIN" ? "가상자산 시세 조회" : stock.market === "US" ? "미국 주식 조회" : "키움 실시간 조회"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												role: "button",
												tabIndex: 0,
												onClick: (e) => {
													e.stopPropagation();
													setSelectedTradeStock(stock);
												},
												className: "px-2 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors cursor-pointer",
												title: "모의 매매 바로가기",
												children: "모의매매"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												role: "button",
												tabIndex: 0,
												onClick: (e) => {
													e.stopPropagation();
													if (isWatchlisted(stock.symbol)) removeFromWatchlist(stock.symbol);
													else addToWatchlist(stock.symbol, stock);
												},
												onKeyDown: (e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.stopPropagation();
														if (isWatchlisted(stock.symbol)) removeFromWatchlist(stock.symbol);
														else addToWatchlist(stock.symbol, stock);
													}
												},
												className: `p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${isWatchlisted(stock.symbol) ? "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20" : "text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`,
												title: isWatchlisted(stock.symbol) ? "관심종목에서 삭제" : "관심종목에 추가",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: `w-4 h-4 ${isWatchlisted(stock.symbol) ? "fill-amber-500" : ""}` })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `p-1 rounded-lg ${isSelected ? "text-rose-500" : "text-slate-300 dark:text-slate-600"}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerDownLeft, { className: "w-4 h-4" })
											})
										]
									});
								})()]
							}, getStockUniqueKey(stock));
						})]
					}) : isSearching ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-14 text-center px-4 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-6 h-6 animate-spin" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-bold text-base text-slate-800 dark:text-slate-200",
							children: "종목 및 가상자산 시세 검색 중..."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 dark:text-slate-400 mt-1",
							children: "국내 주식 · 미국 주식(ADR/ETF) · 코인(Upbit/Binance) 공식 데이터를 조회하고 있습니다."
						})] })]
					}) : searchError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-14 text-center px-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-6 h-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-bold text-base text-slate-800 dark:text-slate-200",
								children: "시세 공급자 연결 실패"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1",
								children: searchError
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setRetryNonce((prev) => prev + 1),
								className: "px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors cursor-pointer",
								children: "다시 시도"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-14 text-center px-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-6 h-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-bold text-base text-slate-800 dark:text-slate-200",
								children: marketFilter === "US" ? "미국 주식 검색 결과 없음" : marketFilter === "COIN" ? "코인 검색 결과 없음" : marketFilter === "KOSPI" ? "코스피 검색 결과 없음" : marketFilter === "KOSDAQ" ? "코스닥 검색 결과 없음" : "일치하는 종목을 찾을 수 없습니다"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1",
								children: [
									"'",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-rose-500 font-semibold",
										children: query
									}),
									"'에 해당하는 ",
									marketFilter !== "ALL" ? marketFilter + " 시장 " : "",
									"검색 결과가 없습니다."
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 max-w-md mx-auto text-left text-xs space-y-1.5 text-slate-500 dark:text-slate-400",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-700 dark:text-slate-300 block",
										children: "통합 종목 검색 팁"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										"• ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "코스피/코스닥:" }),
										" 삼성전자, Samsung Electronics, 005930, 에코프로, 초성(ㅅㅅ)"
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										"• ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "미국 주식:" }),
										" NVDA, AAPL, TSLA, MSFT, 엔비디아, 테슬라, 애플"
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										"• ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "코인:" }),
										" 비트코인, 이더리움, KRW-BTC, BTCUSDT, XRP, 초성(ㅂㅌㅋㅇ)"
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										"• ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "시장 필터:" }),
										" 상단 [전체 / 코스피 / 코스닥 / 미국 / 코인] 탭으로 시장 필터링"
									] })
								]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-2 space-y-5",
						children: [recentSearches.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs font-semibold text-slate-400 mb-2 px-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5" }), "최근 검색어"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setRecentSearches([]);
									localStorage.removeItem(RECENT_SEARCHES_KEY);
								},
								className: "text-[11px] text-slate-400 hover:text-rose-500",
								children: "전체 삭제"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: recentSearches.map((term) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => setQuery(term),
								className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: term }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: (e) => removeRecentSearch(e, term),
									className: "text-slate-400 hover:text-slate-600 dark:hover:text-white",
									title: "삭제",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3 h-3" })
								})]
							}, term))
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2 px-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3.5 h-3.5 text-rose-500" }), "실시간 인기 종목 검색어"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-1.5",
							children: popularKeywords.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									navigateToStock(item.symbol);
									saveRecentSearch(item.text);
									setIsSearchOpen(false);
								},
								className: "flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors text-left text-xs group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-4 font-mono font-bold text-rose-500",
										children: i + 1
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-slate-800 dark:text-slate-200 group-hover:text-rose-500",
										children: item.text
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] text-slate-400",
									children: item.symbol
								})]
							}, item.symbol))
						})] })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] text-slate-400 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"초성 검색 가능 (예: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-rose-500",
								children: "ㅅㅅㅈㅈ"
							}),
							", ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-rose-500",
								children: "ㅅㅋ"
							}),
							")"
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden sm:flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "선택: Enter" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "닫기: ESC" })
						]
					})]
				})
			]
		}), selectedTradeStock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MockTradeModal, {
			isOpen: Boolean(selectedTradeStock),
			onClose: () => setSelectedTradeStock(null),
			symbol: selectedTradeStock.symbol,
			stockName: selectedTradeStock.name,
			defaultPrice: selectedTradeStock.price,
			initialType: "BUY"
		})]
	});
};
//#endregion
//#region src/components/layout/AuthModal.tsx
var AuthModal = () => {
	const { isAuthModalOpen, setIsAuthModalOpen, showToast } = useApp();
	const [mode, setMode] = (0, import_react.useState)("login");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [authError, setAuthError] = (0, import_react.useState)(null);
	if (!isAuthModalOpen) return null;
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setAuthError(null);
		try {
			if (mode === "login") {
				const fbUser = (await signInWithEmailAndPassword(auth, email, password)).user;
				console.log("[Firebase Auth] Login successful. UID:", fbUser.uid, "Email:", fbUser.email);
				await firebaseRepository.syncUserProfile(fbUser.uid, fbUser.email || email, fbUser.displayName || void 0);
				showToast("성공적으로 로그인되었습니다.", "success");
			} else {
				const fbUser = (await createUserWithEmailAndPassword(auth, email, password)).user;
				console.log("[Firebase Auth] User created. UID:", fbUser.uid, "Email:", fbUser.email);
				if (name) await updateProfile(fbUser, { displayName: name });
				await firebaseRepository.syncUserProfile(fbUser.uid, fbUser.email || email, name || void 0);
				showToast("회원가입이 완료되었습니다!", "success");
			}
			setIsAuthModalOpen(false);
		} catch (err) {
			console.error("[Firebase Auth Error]", err.code, err.message);
			let tip = "";
			if (err.code === "auth/operation-not-allowed") tip = "Firebase 콘솔의 Authentication > Sign-in method에서 [이메일/비밀번호] 제공업체가 활성화되어 있지 않습니다. 아래의 Google 계정 로그인을 이용하시거나 Firebase 콘솔에서 공급자를 활성화해주세요.";
			else if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") tip = "이메일 또는 비밀번호가 올바르지 않습니다. 다시 확인해주세요.";
			else if (err.code === "auth/email-already-in-use") tip = "이미 가입된 이메일 주소입니다. 로그인 탭에서 로그인해주세요.";
			else if (err.code === "auth/weak-password") tip = "비밀번호는 최소 6자 이상이어야 합니다.";
			else if (err.code === "auth/configuration-not-found") tip = "Firebase 프로젝트에 Authentication이 구성되지 않았습니다.";
			else if (err.code === "auth/network-request-failed") tip = "네트워크 연결 상태를 확인해주세요.";
			setAuthError({
				code: err.code || "auth/unknown-error",
				message: err.message || "인증 처리 중 오류가 발생했습니다.",
				tip
			});
			showToast(`인증 실패: ${err.code || "오류"}`, "error");
		} finally {
			setLoading(false);
		}
	};
	const handleGoogleLogin = async () => {
		setLoading(true);
		setAuthError(null);
		try {
			const fbUser = (await signInWithPopup(auth, googleProvider)).user;
			console.log("[Firebase Google Auth] Success. UID:", fbUser.uid, "Email:", fbUser.email);
			await firebaseRepository.syncUserProfile(fbUser.uid, fbUser.email || "user@google.com", fbUser.displayName || void 0, fbUser.photoURL || void 0);
			showToast("Google 계정으로 로그인되었습니다.", "success");
			setIsAuthModalOpen(false);
		} catch (err) {
			console.error("[Firebase Google Auth Error]", err.code, err.message);
			let tip = "";
			if (err.code === "auth/popup-blocked") tip = "브라우저 팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.";
			else if (err.code === "auth/popup-closed-by-user") tip = "로그인 창이 닫혔습니다.";
			else if (err.code === "auth/operation-not-allowed") tip = "Firebase 콘솔에서 Google 로그인 공급자가 활성화되어 있는지 확인해주세요.";
			setAuthError({
				code: err.code || "auth/google-sign-in-failed",
				message: err.message || "Google 로그인에 실패했습니다.",
				tip
			});
			showToast(`Google 로그인 실패: ${err.code || "오류"}`, "error");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center font-black",
						children: "BD"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-lg text-slate-900 dark:text-white",
						children: mode === "login" ? "로그인" : "회원가입"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setIsAuthModalOpen(false),
					className: "p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setMode("login");
								setAuthError(null);
							},
							className: `flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === "login" ? "bg-white dark:bg-[#1a1f2e] text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
							children: "로그인"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setMode("register");
								setAuthError(null);
							},
							className: `flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === "register" ? "bg-white dark:bg-[#1a1f2e] text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
							children: "회원가입"
						})]
					}),
					authError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-left space-y-1.5 animate-in fade-in duration-100",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 text-rose-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400",
									children: authError.code
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-rose-700 dark:text-rose-300",
								children: authError.message
							}),
							authError.tip && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg border border-rose-200 dark:border-rose-900/40",
								children: ["💡 ", authError.tip]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleGoogleLogin,
						disabled: loading,
						className: "w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors mb-4 disabled:opacity-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							className: "w-4 h-4",
							viewBox: "0 0 24 24",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#4285F4",
									d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#34A853",
									d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#FBBC05",
									d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#EA4335",
									d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
								})
							]
						}), "Google 계정으로 계속하기"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 my-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-px bg-slate-200 dark:bg-slate-800" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-slate-400",
								children: "또는 이메일로"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-px bg-slate-200 dark:bg-slate-800" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "space-y-3.5",
						children: [
							mode === "register" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1",
								children: "닉네임"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-4 h-4 text-slate-400 absolute left-3 top-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									value: name,
									onChange: (e) => setName(e.target.value),
									placeholder: "여의도스윙러",
									className: "w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1",
								children: "이메일"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-4 h-4 text-slate-400 absolute left-3 top-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									required: true,
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "investor@example.com",
									className: "w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1",
								children: "비밀번호"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 text-slate-400 absolute left-3 top-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									required: true,
									value: password,
									onChange: (e) => setPassword(e.target.value),
									placeholder: "••••••••",
									className: "w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: loading,
								className: "w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-sm transition-colors mt-2 shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 disabled:opacity-50",
								children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "처리 중..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: mode === "login" ? "로그인" : "회원가입 완료" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-emerald-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Firebase Authentication 및 Cloud Firestore와 안전하게 연결되었습니다." })]
					})
				]
			})]
		})
	});
};
//#endregion
//#region src/components/common/ToastContainer.tsx
var ToastContainer = () => {
	const { toasts, removeToast } = useApp();
	if (toasts.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none",
		children: toasts.map((toast) => {
			const icons = {
				success: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-5 h-5 text-emerald-500 shrink-0" }),
				warning: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-5 h-5 text-amber-500 shrink-0" }),
				error: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-5 h-5 text-rose-500 shrink-0" }),
				info: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-5 h-5 text-blue-500 shrink-0" })
			};
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-[#1a1f2e] border ${{
					success: "border-emerald-500/30",
					warning: "border-amber-500/30",
					error: "border-rose-500/30",
					info: "border-blue-500/30"
				}[toast.type]} shadow-xl text-slate-800 dark:text-slate-100 text-sm animate-in slide-in-from-bottom-2 duration-200`,
				children: [
					icons[toast.type],
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "flex-1 font-medium leading-snug",
						children: toast.message
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => removeToast(toast.id),
						className: "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
					})
				]
			}, toast.id);
		})
	});
};
//#endregion
//#region src/components/layout/Footer.tsx
var Footer = () => {
	const { setActiveTab, navigateToStaticPage, navigateToInsights } = useApp();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "mt-16 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0c0f17] text-slate-500 dark:text-slate-400 text-xs",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-4 gap-8 mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 md:col-span-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white font-black text-sm",
								children: "BD"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-black text-base text-slate-900 dark:text-white",
								children: "병돌 인베스트먼트"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs leading-relaxed text-slate-500 dark:text-slate-400",
							children: "한국 주식 투자자를 위한 실시간 주식 커뮤니티 및 금융 인텔리전스 플랫폼. 코스피·코스닥 실시간 지수, 급등락 종목 감지, 호가창 분석, AI 투자 인사이트를 제공합니다."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-bold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider",
						children: "주요 서비스"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveTab("stocks"),
								className: "hover:text-rose-500 transition-colors",
								children: "국내 주식 실시간 시세"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => navigateToInsights(),
								className: "hover:text-rose-500 transition-colors flex items-center gap-1 text-rose-400 font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-3.5 h-3.5" }), "투자 인사이트 리포트"]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveTab("watchlist"),
								className: "hover:text-rose-500 transition-colors",
								children: "내 관심종목 포트폴리오"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveTab("community"),
								className: "hover:text-rose-500 transition-colors",
								children: "주주 토론 커뮤니티"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveTab("chat"),
								className: "hover:text-rose-500 transition-colors",
								children: "실시간 증시 라이브 톡"
							}) })
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-bold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider",
						children: "약관 및 정책 안내"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => navigateToStaticPage("about"),
								className: "hover:text-rose-500 transition-colors flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-3.5 h-3.5 text-rose-400" }), "회사 및 서비스 소개"]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => navigateToStaticPage("privacy"),
								className: "hover:text-rose-500 transition-colors flex items-center gap-1.5 font-medium text-slate-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3.5 h-3.5 text-emerald-400" }), "개인정보처리방침"]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => navigateToStaticPage("terms"),
								className: "hover:text-rose-500 transition-colors flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3.5 h-3.5 text-slate-400" }), "서비스 이용약관"]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => navigateToStaticPage("disclaimer"),
								className: "hover:text-rose-500 transition-colors flex items-center gap-1.5 text-amber-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-3.5 h-3.5" }), "투자유의사항 및 면책고지"]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => navigateToStaticPage("contact"),
								className: "hover:text-rose-500 transition-colors flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-3.5 h-3.5 text-purple-400" }), "고객지원 및 제휴 문의"]
							}) })
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-bold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider",
						children: "고객지원 & 보안"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveTab("inquiry"),
								className: "hover:text-rose-500 transition-colors",
								children: "1:1 고객센터 문의"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveTab("admin"),
								className: "hover:text-rose-500 transition-colors",
								children: "관리자 콘솔"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5 text-emerald-500 font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3.5 h-3.5" }), "SSL 보안 암호화 적용"]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-[11px] text-slate-400 pt-2",
								children: "대표 문의: byunghyunlim92@gmail.com"
							})
						]
					})] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-6 border-t border-slate-100 dark:border-slate-800/80 text-[11px] leading-relaxed text-slate-400 space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "※ 병돌 인베스트먼트에서 제공하는 모든 시세 정보 및 AI 분석 리포트는 투자 참고용 데이터이며, 투자 결과에 대한 최종 법적 책임은 투자자 본인에게 있습니다." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "© 2026 병돌 인베스트먼트 (Byeongdol Investment Inc.). All rights reserved." })]
			})]
		})
	});
};
//#endregion
//#region src/components/common/ErrorBoundary.tsx
var ErrorBoundary = class extends import_react.Component {
	constructor(..._args) {
		super(..._args);
		this.state = {
			hasError: false,
			error: null
		};
		this.handleReload = () => {
			this.setState({
				hasError: false,
				error: null
			});
			if (this.props.onReset) this.props.onReset();
			else window.location.reload();
		};
		this.handleGoHome = () => {
			this.setState({
				hasError: false,
				error: null
			});
			window.location.href = "/";
		};
	}
	static getDerivedStateFromError(error) {
		return {
			hasError: true,
			error
		};
	}
	componentDidCatch(error, errorInfo) {
		console.error("[ErrorBoundary caught error]:", error, errorInfo);
		crashlyticsService.recordException(error, {
			type: "react_error_boundary",
			component_stack: (errorInfo.componentStack || "").slice(0, 500),
			fallback_title: this.props.fallbackTitle || "Default Error"
		});
	}
	render() {
		if (this.state.hasError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-[400px] flex items-center justify-center p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-md w-full bg-white dark:bg-[#131722] border border-rose-200 dark:border-rose-900/50 rounded-2xl p-6 shadow-xl text-center space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-6 h-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-bold text-slate-900 dark:text-white",
							children: this.props.fallbackTitle || "화면을 표시하는 중 문제가 발생했습니다."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 dark:text-slate-400 leading-relaxed",
							children: "일시적인 렌더링 지연 또는 데이터 불일치일 수 있습니다. 화면을 새로고침하거나 홈으로 이동해 주세요."
						})]
					}),
					this.state.error?.message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-[11px] font-mono text-slate-600 dark:text-slate-400 text-left overflow-x-auto max-h-24",
						children: this.state.error.message
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: this.handleReload,
							className: "flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "새로고침" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: this.handleGoHome,
							className: "flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "홈으로 이동" })]
						})]
					})
				]
			})
		});
		return this.props.children;
	}
};
//#endregion
//#region src/components/admin/AdminGuard.tsx
var AdminGuard = ({ children }) => {
	const { isAuthLoading, showToast, setActiveTab, activeTab, isAdmin } = useApp();
	(0, import_react.useEffect)(() => {
		if (isAuthLoading) return;
		if (activeTab === "admin" && !isAdmin) {
			setActiveTab("home");
			showToast("관리자 전용 영역입니다. 인가된 관리자 계정만 접근할 수 있습니다.", "warning");
		}
	}, [
		isAuthLoading,
		isAdmin,
		activeTab,
		setActiveTab,
		showToast
	]);
	if (isAuthLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0c0f17]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-10 border-4 border-purple-500/30 border-t-purple-600 rounded-full animate-spin" })
	});
	if (!isAdmin) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
};
//#endregion
//#region src/components/layout/LeftSidebar.tsx
var LeftSidebar = () => {
	const { activeTab, setActiveTab, indices, exchangeRate, navigateToIndex, user } = useApp();
	const kospi = indices.find((i) => i.symbol === "KOSPI");
	const kosdaq = indices.find((i) => i.symbol === "KOSDAQ");
	const navItems = [
		{
			tab: "home",
			label: "대시보드 홈",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "w-4 h-4" })
		},
		{
			tab: "stocks",
			label: "전종목 시세",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { className: "w-4 h-4" })
		},
		{
			tab: "compare",
			label: "종목 비교",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-4 h-4 text-purple-500" })
		},
		{
			tab: "ranking",
			label: "실시간 순위",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "w-4 h-4 text-amber-500" }),
			badge: "TOP"
		},
		{
			tab: "insight",
			label: "시장 인사이트",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4 text-rose-500" }),
			badge: "LIVE"
		},
		{
			tab: "portfolio",
			label: "가상 모의투자",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "w-4 h-4 text-emerald-500" })
		},
		{
			tab: "watchlist",
			label: "관심종목 센터",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "w-4 h-4 text-cyan-500" })
		},
		{
			tab: "calendar",
			label: "금융 캘린더",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4 text-indigo-500" })
		},
		{
			tab: "community",
			label: "주주 커뮤니티",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-4 h-4 text-slate-400" })
		},
		...user?.role === "admin" || user?.role === "superadmin" ? [{
			tab: "admin",
			label: "시스템 관리자",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-4 h-4 text-amber-500" })
		}] : []
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "w-64 hidden md:flex flex-col h-full border-r border-finance-border bg-finance-card select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3 border-b border-finance-border space-y-2 bg-finance-sub-bg/50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-[11px] font-bold text-finance-sub-text uppercase tracking-wider px-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "주요 시장 지수" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] text-finance-accent font-mono flex items-center gap-1 font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-finance-accent animate-pulse" }), "LIVE"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-1.5",
						children: [kospi && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => navigateToIndex("KOSPI"),
							className: "p-2 rounded-xl bg-finance-card border border-finance-border cursor-pointer hover:border-finance-accent transition-colors shadow-2xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] font-bold text-finance-sub-text",
									children: "코스피"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono font-bold text-xs text-finance-text mt-0.5",
									children: kospi.value.toLocaleString(void 0, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `text-[10px] font-mono font-bold mt-0.5 ${kospi.changePercent >= 0 ? "text-finance-up" : "text-finance-down"}`,
									children: [
										kospi.changePercent >= 0 ? "+" : "",
										kospi.changePercent.toFixed(2),
										"%"
									]
								})
							]
						}), kosdaq && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => navigateToIndex("KOSDAQ"),
							className: "p-2 rounded-xl bg-finance-card border border-finance-border cursor-pointer hover:border-finance-accent transition-colors shadow-2xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] font-bold text-finance-sub-text",
									children: "코스닥"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono font-bold text-xs text-finance-text mt-0.5",
									children: kosdaq.value.toLocaleString(void 0, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `text-[10px] font-mono font-bold mt-0.5 ${kosdaq.changePercent >= 0 ? "text-finance-up" : "text-finance-down"}`,
									children: [
										kosdaq.changePercent >= 0 ? "+" : "",
										kosdaq.changePercent.toFixed(2),
										"%"
									]
								})
							]
						})]
					}),
					(() => {
						const fxCheck = validateExchangeRate(exchangeRate);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-2.5 py-2 rounded-xl bg-finance-card border border-finance-border space-y-1 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-finance-sub-text text-[11px]",
									children: "원/달러 환율"
								}), fxCheck.valid && fxCheck.rate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono font-bold text-finance-text text-xs",
										children: [fxCheck.rate.toLocaleString(void 0, {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2
										}), "원"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `text-[10px] font-mono font-bold ${(exchangeRate?.changePercent || 0) >= 0 ? "text-finance-up" : "text-finance-down"}`,
										children: [
											(exchangeRate?.changePercent || 0) >= 0 ? "+" : "",
											(exchangeRate?.changePercent || 0).toFixed(2),
											"%"
										]
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold text-amber-500",
									children: fxCheck.status === "stale" ? "지연/만료" : "조회 오류"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-[10px] text-finance-sub-text font-mono",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "USD/KRW" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fxCheck.lastUpdated })]
							})]
						});
					})()
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto p-2 space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-3 pt-2 pb-1 text-[10px] font-black uppercase text-finance-sub-text tracking-wider",
					children: "주요 메뉴"
				}), navItems.map((item) => {
					const isActive = activeTab === item.tab;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setActiveTab(item.tab),
						className: `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive ? "bg-finance-accent text-white shadow-xs" : "text-finance-sub-text hover:bg-finance-sub-bg hover:text-finance-text"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: isActive ? "text-white" : "",
								children: item.icon
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
						}), item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${isActive ? "bg-white/20 text-white" : "bg-finance-accent/15 text-finance-accent border border-finance-accent/30"}`,
							children: item.badge
						})]
					}, item.tab);
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3 border-t border-finance-border text-[10px] text-finance-sub-text font-mono flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "병돌 인베스트먼트" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-finance-accent flex items-center gap-1 font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-3 h-3" }), "글로벌 연동"]
				})]
			})
		]
	});
};
//#endregion
//#region src/services/userNotificationSettingsService.ts
/**
* User Notification Settings Service (Firestore Persistent Storage)
* 
* Manages user preferences for:
* - Browser Notification API push toggle
* - Watchlist rapid surge / plunge thresholds (e.g. +3%, -3%, +5%, -5%)
* - Volume surge threshold
* - Duplicate alert cooldown duration
* - Notification sound & quiet hours
*/
var DEFAULT_NOTIFICATION_SETTINGS = {
	uid: "",
	browserPushEnabled: true,
	surgeGainEnabled: true,
	surgeGainThreshold: 3,
	surgeLossEnabled: true,
	surgeLossThreshold: -3,
	volumeSurgeEnabled: true,
	volumeSurgeThreshold: 200,
	cooldownMinutes: 10,
	soundEnabled: true,
	quietHoursEnabled: false,
	quietHoursStart: "22:00",
	quietHoursEnd: "08:00",
	updatedAt: (/* @__PURE__ */ new Date()).toISOString()
};
var LOCAL_STORAGE_KEY = "byeongdol_user_notification_settings";
var UserNotificationSettingsService = class {
	/**
	* Load user settings from Firestore with localStorage fallback
	*/
	async getSettings(uid) {
		const targetUid = uid || auth.currentUser?.uid;
		if (targetUid) try {
			const ref = doc(db, "userNotificationSettings", targetUid);
			const snap = await getDoc(ref);
			if (snap.exists()) {
				const data = snap.data();
				this.saveToLocal(data);
				return {
					...DEFAULT_NOTIFICATION_SETTINGS,
					...data,
					uid: targetUid
				};
			}
		} catch (err) {
			console.warn("[UserNotificationSettingsService] Firestore load error, using local fallback:", err);
		}
		const local = this.loadFromLocal();
		if (local) return {
			...DEFAULT_NOTIFICATION_SETTINGS,
			...local,
			uid: targetUid || "guest"
		};
		return {
			...DEFAULT_NOTIFICATION_SETTINGS,
			uid: targetUid || "guest"
		};
	}
	/**
	* Save user settings to Firestore and localStorage
	*/
	async saveSettings(settings, uid) {
		const targetUid = uid || auth.currentUser?.uid || settings.uid || "guest";
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const updated = {
			...await this.getSettings(targetUid),
			...settings,
			uid: targetUid,
			updatedAt: now
		};
		this.saveToLocal(updated);
		if (targetUid && targetUid !== "guest" && auth.currentUser) try {
			const ref = doc(db, "userNotificationSettings", targetUid);
			await setDoc(ref, updated, { merge: true });
			console.log("[UserNotificationSettingsService] Settings saved to Firestore for UID:", targetUid);
		} catch (err) {
			console.error("[UserNotificationSettingsService] Failed to save settings to Firestore:", err);
			throw err;
		}
		return updated;
	}
	saveToLocal(settings) {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
		} catch {}
	}
	loadFromLocal() {
		if (typeof window === "undefined") return null;
		try {
			const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
			if (raw) return JSON.parse(raw);
		} catch {}
		return null;
	}
};
var userNotificationSettingsService = new UserNotificationSettingsService();
//#endregion
//#region src/services/browserPushNotificationService.ts
var BrowserPushNotificationService = class {
	constructor() {
		this.cooldownMap = /* @__PURE__ */ new Map();
		this.audioContext = null;
	}
	/**
	* Check if Notification API is supported by the current browser
	*/
	isSupported() {
		return typeof window !== "undefined" && "Notification" in window;
	}
	/**
	* Get current Notification API permission state
	*/
	getPermission() {
		if (!this.isSupported()) return "denied";
		return Notification.permission;
	}
	/**
	* Request browser notification permission
	*/
	async requestPermission() {
		if (!this.isSupported()) return "denied";
		try {
			return await Notification.requestPermission();
		} catch (err) {
			console.warn("[BrowserPushNotificationService] Permission request failed:", err);
			return "denied";
		}
	}
	/**
	* Clear cooldown map (for testing or reset)
	*/
	clearCooldowns() {
		this.cooldownMap.clear();
	}
	/**
	* Check if current time falls within user-specified quiet hours
	*/
	isQuietHours(settings) {
		if (!settings.quietHoursEnabled) return false;
		try {
			const now = /* @__PURE__ */ new Date();
			const currentMinutes = now.getHours() * 60 + now.getMinutes();
			const [startH, startM] = (settings.quietHoursStart || "22:00").split(":").map(Number);
			const [endH, endM] = (settings.quietHoursEnd || "08:00").split(":").map(Number);
			const startMinutes = startH * 60 + startM;
			const endMinutes = endH * 60 + endM;
			if (startMinutes <= endMinutes) return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
			else return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
		} catch {
			return false;
		}
	}
	/**
	* Play subtle financial chime sound via Web Audio API
	*/
	playChime(type = "neutral") {
		if (typeof window === "undefined") return;
		try {
			const AudioCtx = window.AudioContext || window.webkitAudioContext;
			if (!AudioCtx) return;
			if (!this.audioContext || this.audioContext.state === "closed") this.audioContext = new AudioCtx();
			if (this.audioContext.state === "suspended") this.audioContext.resume();
			const ctx = this.audioContext;
			const now = ctx.currentTime;
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = "sine";
			if (type === "gain") {
				osc.frequency.setValueAtTime(587.33, now);
				osc.frequency.exponentialRampToValueAtTime(880, now + .12);
			} else if (type === "loss") {
				osc.frequency.setValueAtTime(659.25, now);
				osc.frequency.exponentialRampToValueAtTime(440, now + .14);
			} else osc.frequency.setValueAtTime(783.99, now);
			gain.gain.setValueAtTime(1e-4, now);
			gain.gain.exponentialRampToValueAtTime(.15, now + .02);
			gain.gain.exponentialRampToValueAtTime(1e-4, now + .35);
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start(now);
			osc.stop(now + .36);
		} catch {}
	}
	/**
	* Dispatch a browser push notification for watchlist sudden change
	*/
	async sendWatchlistAlert(payload, settings, uid) {
		if (!settings.browserPushEnabled) return false;
		if (this.isQuietHours(settings)) {
			console.log(`[BrowserPushNotificationService] Suppressed due to quiet hours (${settings.quietHoursStart} ~ ${settings.quietHoursEnd})`);
			return false;
		}
		const cooldownMs = (settings.cooldownMinutes || 10) * 60 * 1e3;
		const cooldownKey = `${payload.symbol}_${payload.type}`;
		const lastTrigger = this.cooldownMap.get(cooldownKey) || 0;
		const now = Date.now();
		if (now - lastTrigger < cooldownMs) {
			console.log(`[BrowserPushNotificationService] Suppressed by cooldown: ${cooldownKey} (remaining: ${Math.round((cooldownMs - (now - lastTrigger)) / 1e3)}s)`);
			return false;
		}
		let title = "";
		let body = "";
		const formattedPrice = formatMoney(payload.currentPrice, inferStockCurrency(payload.symbol, void 0, payload.currency));
		if (payload.type === "surge_gain") {
			title = `🚀 [관심종목 급등] ${payload.stockName} +${payload.changePercent.toFixed(2)}%`;
			body = `현재가 ${formattedPrice} | 전일 대비 +${payload.changePercent.toFixed(2)}% 급등 중입니다. 터치하여 호가 및 차트를 확인하세요.`;
		} else if (payload.type === "surge_loss") {
			title = `📉 [관심종목 급락] ${payload.stockName} ${payload.changePercent.toFixed(2)}%`;
			body = `현재가 ${formattedPrice} | 전일 대비 ${payload.changePercent.toFixed(2)}% 급락세입니다. 리스크 관리가 필요합니다.`;
		} else {
			title = `⚡ [관심종목 수급 폭증] ${payload.stockName}`;
			body = `현재가 ${formattedPrice} | 거래량이 평소 대비 급증하고 있습니다.`;
		}
		this.cooldownMap.set(cooldownKey, now);
		if (settings.soundEnabled) this.playChime(payload.type === "surge_gain" ? "gain" : payload.type === "surge_loss" ? "loss" : "neutral");
		let dispatched = false;
		if (this.isSupported() && Notification.permission === "granted") try {
			const notif = new Notification(title, {
				body,
				icon: "/icons/icon-192x192.png",
				badge: "/icons/icon-192x192.png",
				tag: `byeongdol-${payload.symbol}-${payload.type}-${now}`
			});
			notif.onclick = () => {
				try {
					window.focus();
					window.dispatchEvent(new CustomEvent("app:navigate-stock", { detail: { symbol: payload.symbol } }));
					notif.close();
				} catch {}
			};
			dispatched = true;
		} catch (err) {
			console.warn("[BrowserPushNotificationService] Native Notification construction failed:", err);
		}
		try {
			await notificationService.createNotification(title, body, payload.type === "surge_gain" ? "price_rise" : payload.type === "surge_loss" ? "price_fall" : "volume_spike", payload.symbol, uid, payload.stockName);
		} catch {}
		return dispatched;
	}
	/**
	* Dispatch a test push notification to verify browser & sound functionality
	*/
	async sendTestAlert(settings) {
		if (!this.isSupported()) return {
			success: false,
			message: "이 브라우저는 웹 Notification API를 지원하지 않습니다."
		};
		let perm = Notification.permission;
		if (perm !== "granted") {
			perm = await this.requestPermission();
			if (perm !== "granted") return {
				success: false,
				message: "브라우저 알림 권한이 허용되지 않았습니다. 브라우저 설정에서 알림을 허용해주세요."
			};
		}
		if (settings.soundEnabled) this.playChime("gain");
		try {
			const testNotif = new Notification("🔔 [병돌 인베스트먼트] 브라우저 푸시 알림 테스트", {
				body: "관심 종목 급등락 알림이 성공적으로 설정되었습니다! 시세 급변 시 알림을 받으실 수 있습니다.",
				icon: "/icons/icon-192x192.png",
				badge: "/icons/icon-192x192.png",
				tag: `byeongdol-test-${Date.now()}`
			});
			testNotif.onclick = () => {
				window.focus();
				testNotif.close();
			};
			return {
				success: true,
				message: "테스트 알림이 성공적으로 발송되었습니다."
			};
		} catch (err) {
			return {
				success: false,
				message: err.message || "알림 발송 중 오류가 발생했습니다."
			};
		}
	}
};
var browserPushNotificationService = new BrowserPushNotificationService();
//#endregion
//#region src/hooks/useWatchlistPriceMonitor.ts
/**
* Hook for Active Watchlist Price Fluctuation Monitoring & Browser Push Trigger
* 
* Actively monitors the user's registered watchlist stocks against:
* 1. Sudden Price Surges (+% threshold)
* 2. Sudden Price Plunges (-% threshold)
* 3. Volume Spikes
* 
* Automatically reads user settings from Firestore and fires native browser Notification API.
*/
function useWatchlistPriceMonitor({ watchlist, stocks, userId, onNavigateStock }) {
	const [settings, setSettings] = (0, import_react.useState)(DEFAULT_NOTIFICATION_SETTINGS);
	const [isLoadingSettings, setIsLoadingSettings] = (0, import_react.useState)(true);
	const prevChangeMap = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const refreshSettings = (0, import_react.useCallback)(async () => {
		try {
			const data = await userNotificationSettingsService.getSettings(userId);
			setSettings(data);
		} catch (err) {
			console.warn("[useWatchlistPriceMonitor] Failed to load settings:", err);
		} finally {
			setIsLoadingSettings(false);
		}
	}, [userId]);
	(0, import_react.useEffect)(() => {
		refreshSettings();
	}, [refreshSettings]);
	(0, import_react.useEffect)(() => {
		const handleCustomNavigate = (e) => {
			const customEvent = e;
			if (customEvent.detail?.symbol && onNavigateStock) onNavigateStock(customEvent.detail.symbol);
		};
		window.addEventListener("app:navigate-stock", handleCustomNavigate);
		return () => {
			window.removeEventListener("app:navigate-stock", handleCustomNavigate);
		};
	}, [onNavigateStock]);
	(0, import_react.useEffect)(() => {
		if (!settings.browserPushEnabled || watchlist.length === 0 || stocks.length === 0) return;
		const currentMap = prevChangeMap.current;
		for (const symbol of watchlist) {
			const stock = stocks.find((s) => s.symbol === symbol);
			if (!stock || stock.price <= 0 || isNaN(stock.price)) continue;
			const currentChange = stock.changePercent;
			const prevChange = currentMap.get(symbol);
			currentMap.set(symbol, currentChange);
			if (settings.surgeGainEnabled && currentChange >= settings.surgeGainThreshold) {
				if (prevChange === void 0 || Math.abs(currentChange - prevChange) >= .5 || currentChange >= settings.surgeGainThreshold) browserPushNotificationService.sendWatchlistAlert({
					symbol: stock.symbol,
					stockName: stock.name,
					type: "surge_gain",
					currentPrice: stock.price,
					changePercent: stock.changePercent,
					change: stock.change,
					volume: stock.volume,
					currency: stock.currency,
					reason: `전일 대비 +${stock.changePercent.toFixed(2)}% 급등 포착 (설정 기준: +${settings.surgeGainThreshold}%)`
				}, settings, userId);
			}
			if (settings.surgeLossEnabled && currentChange <= settings.surgeLossThreshold) {
				if (prevChange === void 0 || Math.abs(currentChange - prevChange) >= .5 || currentChange <= settings.surgeLossThreshold) browserPushNotificationService.sendWatchlistAlert({
					symbol: stock.symbol,
					stockName: stock.name,
					type: "surge_loss",
					currentPrice: stock.price,
					changePercent: stock.changePercent,
					change: stock.change,
					volume: stock.volume,
					currency: stock.currency,
					reason: `전일 대비 ${stock.changePercent.toFixed(2)}% 급락 포착 (설정 기준: ${settings.surgeLossThreshold}%)`
				}, settings, userId);
			}
			if (settings.volumeSurgeEnabled && (stock.volumeRatio || 0) >= (settings.volumeSurgeThreshold || 200)) browserPushNotificationService.sendWatchlistAlert({
				symbol: stock.symbol,
				stockName: stock.name,
				type: "volume_spike",
				currentPrice: stock.price,
				changePercent: stock.changePercent,
				change: stock.change,
				volume: stock.volume,
				currency: stock.currency,
				reason: `20일 평균 대비 거래량 ${stock.volumeRatio}% 폭증 포착`
			}, settings, userId);
		}
	}, [
		watchlist,
		stocks,
		settings,
		userId
	]);
	return {
		settings,
		isLoadingSettings,
		refreshSettings,
		updateSettings: async (newSettings) => {
			const updated = await userNotificationSettingsService.saveSettings(newSettings, userId);
			setSettings(updated);
			return updated;
		}
	};
}
//#endregion
//#region src/components/watchlist/SidebarStockList.tsx
var SidebarStockList = () => {
	const { watchlist, watchlistDetails, addToWatchlist, removeFromWatchlist, reorderWatchlist, navigateToStock, navigateToIndex, isWatchlisted } = useApp();
	const [activeTab, setActiveTab] = (0, import_react.useState)("OVERALL");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [isSearching, setIsSearching] = (0, import_react.useState)(false);
	const [searchResults, setSearchResults] = (0, import_react.useState)([]);
	const [searchError, setSearchError] = (0, import_react.useState)(null);
	const [retryNonce, setRetryNonce] = (0, import_react.useState)(0);
	const [showSearchResults, setShowSearchResults] = (0, import_react.useState)(false);
	const searchContainerRef = (0, import_react.useRef)(null);
	const getSearchMarketParam = (tab) => {
		switch (tab) {
			case "KOSPI": return "KOSPI";
			case "KOSDAQ": return "KOSDAQ";
			case "US": return "US";
			case "CRYPTO": return "COIN";
			default: return "ALL";
		}
	};
	const getFilteredWatchlist = () => {
		switch (activeTab) {
			case "KOSPI": return watchlistDetails.filter((s) => s.market === "KOSPI" || s.exchange === "KOSPI");
			case "KOSDAQ": return watchlistDetails.filter((s) => s.market === "KOSDAQ" || s.exchange === "KOSDAQ");
			case "US": return watchlistDetails.filter((s) => {
				const m = s.market;
				return m === "US" || m === "INDEX" || m === "NASDAQ" || m === "NYSE" || m === "AMEX" || s.symbol.startsWith("^");
			});
			case "CRYPTO": return watchlistDetails.filter((s) => {
				const m = s.market;
				return m === "COIN" || m === "CRYPTO" || s.symbol.includes("-") || s.symbol.endsWith("USDT");
			});
			default: return watchlistDetails;
		}
	};
	const displayStocks = getFilteredWatchlist();
	(0, import_react.useEffect)(() => {
		const query = searchQuery.trim();
		if (!query) {
			setSearchResults([]);
			setSearchError(null);
			setIsSearching(false);
			return;
		}
		const controller = new AbortController();
		let mounted = true;
		setIsSearching(true);
		setSearchError(null);
		const timer = setTimeout(async () => {
			try {
				const marketParam = getSearchMarketParam(activeTab);
				const data = await stockRepository.searchStocks({
					query,
					market: marketParam,
					limit: 12,
					signal: controller.signal
				});
				if (mounted && !controller.signal.aborted) {
					setSearchResults(data);
					setShowSearchResults(true);
				}
			} catch (err) {
				if (err?.name === "AbortError" || controller.signal.aborted) return;
				console.warn("[SidebarSearch] Search error:", err);
				if (mounted) {
					setSearchError(err?.message || "종목 검색에 실패했습니다.");
					setSearchResults([]);
					setShowSearchResults(true);
				}
			} finally {
				if (mounted && !controller.signal.aborted) setIsSearching(false);
			}
		}, 180);
		return () => {
			mounted = false;
			clearTimeout(timer);
			controller.abort();
		};
	}, [
		searchQuery,
		activeTab,
		retryNonce
	]);
	(0, import_react.useEffect)(() => {
		const handleClickOutside = (e) => {
			if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) setShowSearchResults(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	const handleRegister = async (e, item) => {
		e.stopPropagation();
		if (isWatchlisted(item.symbol)) return;
		await addToWatchlist(item.symbol, {
			name: item.name,
			market: item.market,
			exchange: inferStockExchange(item.symbol, item.market, item.exchange),
			currency: inferStockCurrency(item.symbol, item.market, item.currency),
			productType: item.productType,
			price: item.price || 0,
			change: item.change || 0,
			changePercent: item.changePercent || 0
		});
	};
	const handleItemClick = (stock) => {
		if (stock.symbol === "KOSPI" || stock.symbol === "KOSDAQ") navigateToIndex(stock.symbol);
		else navigateToStock(stock.symbol);
	};
	const handleMoveUp = (e, symbol) => {
		e.stopPropagation();
		const idx = watchlist.indexOf(symbol);
		if (idx <= 0) return;
		const newOrder = [...watchlist];
		const temp = newOrder[idx - 1];
		newOrder[idx - 1] = newOrder[idx];
		newOrder[idx] = temp;
		reorderWatchlist(newOrder);
	};
	const handleMoveDown = (e, symbol) => {
		e.stopPropagation();
		const idx = watchlist.indexOf(symbol);
		if (idx < 0 || idx >= watchlist.length - 1) return;
		const newOrder = [...watchlist];
		const temp = newOrder[idx + 1];
		newOrder[idx + 1] = newOrder[idx];
		newOrder[idx] = temp;
		reorderWatchlist(newOrder);
	};
	const tabs = [
		{
			id: "OVERALL",
			label: "전체"
		},
		{
			id: "KOSPI",
			label: "코스피"
		},
		{
			id: "KOSDAQ",
			label: "코스닥"
		},
		{
			id: "US",
			label: "미국"
		},
		{
			id: "CRYPTO",
			label: "코인"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col h-full bg-white dark:bg-[#131722] select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex border-b border-slate-200 dark:border-slate-800 shrink-0",
				children: tabs.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						setActiveTab(tab.id);
						setSearchQuery("");
						setShowSearchResults(false);
					},
					className: `flex-1 py-2 text-[11px] font-bold cursor-pointer transition-colors ${activeTab === tab.id ? "text-rose-600 dark:text-rose-400 border-b-2 border-rose-600 dark:border-rose-400 bg-rose-50/20 dark:bg-rose-950/20" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"}`,
					children: tab.label
				}, tab.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-2 border-b border-slate-200 dark:border-slate-800 relative shrink-0",
				ref: searchContainerRef,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							onFocus: () => {
								if (searchResults.length > 0) setShowSearchResults(true);
							},
							placeholder: `${tabs.find((t) => t.id === activeTab)?.label} 종목 검색 및 관심 등록`,
							className: "w-full pl-8 pr-7 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
						}),
						searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setSearchQuery("");
								setSearchResults([]);
								setShowSearchResults(false);
							},
							className: "absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
						})
					]
				}), showSearchResults && searchQuery.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute left-2 right-2 top-full mt-1 bg-white dark:bg-[#1c2130] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto",
					children: searchError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 text-center space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-rose-500 font-medium",
							children: searchError
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setRetryNonce((n) => n + 1),
							className: "px-2.5 py-1 rounded bg-rose-500 text-white text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "다시 시도" })]
						})]
					}) : isSearching ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "검색 중..." })]
					}) : searchResults.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-1 divide-y divide-slate-100 dark:divide-slate-800",
						children: searchResults.map((item) => {
							const registered = isWatchlisted(item.symbol);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-3 py-2 flex items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1 cursor-pointer",
									onClick: () => {
										setShowSearchResults(false);
										navigateToStock(item.symbol);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-xs text-slate-900 dark:text-white truncate",
											children: item.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-mono px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0",
											children: item.exchange || item.market
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 mt-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400 font-mono",
											children: item.symbol
										}), item.price !== void 0 && item.price > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-mono font-medium text-slate-600 dark:text-slate-300",
											children: formatMoney(item.price, inferStockCurrency(item.symbol, item.market, item.currency))
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: (e) => handleRegister(e, item),
									disabled: registered,
									className: `shrink-0 px-2.5 py-1 text-[11px] font-bold rounded-md flex items-center gap-1 transition-all ${registered ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default" : "bg-rose-500 hover:bg-rose-600 text-white cursor-pointer shadow-xs active:scale-95"}`,
									children: registered ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3 h-3 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "등록됨" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "관심 등록" })] })
								})]
							}, getStockUniqueKey(item));
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 text-center text-xs text-slate-400",
						children: "일치하는 종목이 없습니다."
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-12 px-3 py-1.5 text-[10px] font-bold text-slate-400 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 shrink-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-span-5",
						children: "종목명"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-span-3 text-right",
						children: "현재가"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-span-2 text-right",
						children: "등락%"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-span-2 text-center",
						children: "관리"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto",
				children: [displayStocks.map((stock) => {
					const isUp = stock.change >= 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => handleItemClick(stock),
						className: "group grid grid-cols-12 px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer border-b border-slate-100 dark:border-slate-800/50 transition-colors items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-5 truncate pr-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-slate-900 dark:text-white truncate text-[11px] leading-tight",
									children: stock.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-slate-400 font-mono truncate leading-tight",
									children: [
										stock.symbol,
										" · ",
										inferStockCurrency(stock.symbol, stock.market, stock.currency)
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-span-3 text-right font-mono font-medium text-slate-700 dark:text-slate-300 text-[11px]",
								children: stock.price ? formatMoney(stock.price, inferStockCurrency(stock.symbol, stock.market, stock.currency)) : "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-span-2 text-right font-mono font-bold text-[11px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: isUp ? "text-rose-500" : "text-blue-500",
									children: [
										stock.changePercent > 0 ? "+" : "",
										stock.changePercent?.toFixed(2) || "0.00",
										"%"
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-2 flex items-center justify-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										title: "위로 이동",
										onClick: (e) => handleMoveUp(e, stock.symbol),
										className: "p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "w-2.5 h-2.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										title: "아래로 이동",
										onClick: (e) => handleMoveDown(e, stock.symbol),
										className: "p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-2.5 h-2.5" })
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									title: "관심종목 해제",
									onClick: (e) => {
										e.stopPropagation();
										removeFromWatchlist(stock.symbol);
									},
									className: "p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 cursor-pointer rounded",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3 h-3" })
								})]
							})
						]
					}, getStockUniqueKey(stock));
				}), displayStocks.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-8 text-center text-xs text-slate-400 space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "등록된 관심종목이 없습니다."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-slate-500",
						children: "상단 검색창에서 종목을 검색하여 등록해 보세요."
					})]
				})]
			})
		]
	});
};
//#endregion
//#region src/utils/chatModerator.ts
/**
* Chat Moderation Utility for 병돌 인베스트먼트
* Includes bad words filter, anti-spam, and rate-limiting
*/
var PROHIBITED_KEYWORDS = [
	"시세조종",
	"주가조작",
	"작전주",
	"선행매매",
	"불법리딩",
	"유료리딩",
	"리딩방",
	"단톡방초대",
	"텔레그램방",
	"원금보장",
	"100%수익",
	"대포통장",
	"자전거래",
	"통정매매",
	"개새끼",
	"개새",
	"씨발",
	"시발",
	"병신",
	"지랄",
	"좆",
	"존나",
	"새끼",
	"미친놈",
	"미친년",
	"닥쳐",
	"꺼져"
];
/**
* Filters prohibited words and replaces them with asterisks
*/
function filterProfanity(text) {
	let cleanText = text;
	let hasProfanity = false;
	const matchedWords = [];
	for (const word of PROHIBITED_KEYWORDS) {
		const regex = new RegExp(word, "gi");
		if (regex.test(cleanText)) {
			hasProfanity = true;
			if (!matchedWords.includes(word)) matchedWords.push(word);
			cleanText = cleanText.replace(regex, "*".repeat(word.length));
		}
	}
	return {
		cleanText,
		hasProfanity,
		matchedWords
	};
}
var userSpamMap = /* @__PURE__ */ new Map();
function checkSpamViolation(userId, message) {
	const now = Date.now();
	const trimmed = message.trim().toLowerCase();
	const state = userSpamMap.get(userId);
	if (!state) {
		userSpamMap.set(userId, {
			lastMessage: trimmed,
			lastMessageTime: now
		});
		return { isSpam: false };
	}
	if (now - state.lastMessageTime < 1200) return {
		isSpam: true,
		reason: "cooldown"
	};
	if (state.lastMessage === trimmed && now - state.lastMessageTime < 7e3) return {
		isSpam: true,
		reason: "duplicate"
	};
	userSpamMap.set(userId, {
		lastMessage: trimmed,
		lastMessageTime: now
	});
	return { isSpam: false };
}
//#endregion
//#region src/utils/api.ts
/**
* Returns full API URL for a given path.
* In native Capacitor container or when VITE_API_BASE_URL is set,
* prepends the HTTPS backend base URL.
*/
var getApiUrl = (path) => {
	if (typeof window !== "undefined" && Capacitor?.isNativePlatform?.()) return `${"https://ais-dev-kocqdv6eyo4m676x7o5jyl-674682744139.asia-east1.run.app".replace(/\/+$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
	return path;
};
/**
* Installs fetch interceptor for native mobile containers (Android APK / iOS)
* to automatically route relative '/api/' calls to the production backend.
* In web / iframe preview environments, this is safely skipped to avoid touching read-only window properties.
*/
/**
* Safe fetch wrapper that validates content-type before parsing JSON.
*/
var safeFetchJson = async (input, init) => {
	const response = await fetch(input, init);
	if (!response.ok) {
		const errorBody = await response.text().catch(() => "");
		throw new Error(`API Error: ${response.status} for ${input} - ${errorBody.substring(0, 100)}`);
	}
	const contentType = response.headers.get("content-type");
	if (!contentType || !contentType.includes("application/json")) {
		const body = await response.text().catch(() => "");
		console.error(`[API] Expected JSON for ${input} but got ${contentType} (Status: ${response.status}): ${body.substring(0, 100)}`);
		throw new Error(`API Error: Expected JSON response for ${input} but received ${contentType} (Status: ${response.status})`);
	}
	return await response.json();
};
var setupApiInterceptor = () => {
	if (typeof window === "undefined") return;
	try {
		if (!Capacitor?.isNativePlatform?.()) return;
	} catch {
		return;
	}
	try {
		const originalFetch = window.fetch.bind(window);
		const customFetch = async (input, init) => {
			const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
			const isSearchApi = url.includes("/api/stocks/search");
			if (isSearchApi) console.log(`[Diagnostic] Outgoing Search Request: ${url}`, init);
			const response = await (async () => {
				if (typeof input === "string" && input.startsWith("/api/")) return originalFetch(getApiUrl(input), init);
				if (input instanceof URL && input.pathname.startsWith("/api/")) return originalFetch(getApiUrl(input.pathname + input.search), init);
				return originalFetch(input, init);
			})();
			if (isSearchApi) response.clone().json().then((data) => {
				console.log(`[Diagnostic] Incoming Search Response: ${url}`, {
					status: response.status,
					data
				});
			}).catch((err) => {
				console.log(`[Diagnostic] Incoming Search Response Parse Error: ${url}`, {
					status: response.status,
					err
				});
			});
			return response;
		};
		try {
			window.fetch = customFetch;
		} catch {
			try {
				Object.defineProperty(window, "fetch", {
					value: customFetch,
					writable: true,
					configurable: true
				});
			} catch {}
		}
	} catch (err) {
		console.warn("[api] Failed to setup native API interceptor:", err);
	}
};
//#endregion
//#region src/services/adminService.ts
async function getAdminHeaders() {
	const token = await auth.currentUser?.getIdToken().catch(() => null);
	const headers = { "Content-Type": "application/json" };
	if (token) headers["Authorization"] = `Bearer ${token}`;
	if (auth.currentUser?.email) headers["x-user-email"] = auth.currentUser.email;
	if (auth.currentUser?.uid) headers["x-user-uid"] = auth.currentUser.uid;
	return headers;
}
var USERS_STORAGE_KEY = "bd_admin_users";
var NOTICES_STORAGE_KEY = "bd_admin_notices";
var BANNED_WORDS_STORAGE_KEY = "bd_admin_banned_words";
var ADMIN_LOGS_STORAGE_KEY = "bd_admin_audit_logs";
var ADMIN_SETTINGS_STORAGE_KEY = "bd_admin_system_settings";
var ADMIN_NOTIFICATIONS_STORAGE_KEY = "bd_admin_notifications";
var INITIAL_ADMIN_USERS = [{
	id: "lr018vf8CcW5fAv707vsl77qJy53",
	name: "총괄관리자 (임병현)",
	email: "byunghyunlim92@gmail.com",
	avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
	role: "superadmin",
	tier: "최고 관리자",
	joinedDate: "2026.01.01",
	bio: "병돌 인베스트먼트 총괄 시스템 관리자",
	postCount: 0,
	commentCount: 0,
	status: "active",
	chatRestricted: false,
	lastLoginAt: "2026.10.12 18:00",
	reportedCount: 0,
	reportSubmitCount: 0,
	level: 99,
	title: "시스템 총괄",
	badge: "최고 관리자",
	badges: ["superadmin"]
}, {
	id: "u-mod-1",
	name: "커뮤니티운영자",
	email: "moderator@byeongdol.com",
	avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
	role: "moderator",
	tier: "운영진 (Moderator)",
	joinedDate: "2026.02.01",
	bio: "게시글 및 채팅 모니터링 담당 운영진",
	postCount: 0,
	commentCount: 0,
	status: "active",
	chatRestricted: false,
	lastLoginAt: "2026.10.12 17:30",
	reportedCount: 0,
	reportSubmitCount: 0,
	level: 50,
	title: "커뮤니티 관리",
	badge: "운영진",
	badges: ["moderator"]
}];
var DEFAULT_BANNED_WORDS = [
	{
		id: "bw-1",
		word: "100% 수익 보장",
		category: "불법 유사투자",
		enabled: true,
		action: "block",
		severity: "block",
		hitCount: 14,
		createdBy: "총괄관리자",
		createdAt: "2026.01.10"
	},
	{
		id: "bw-2",
		word: "원금보장",
		category: "사기/과장광고",
		enabled: true,
		action: "block",
		severity: "block",
		hitCount: 9,
		createdBy: "총괄관리자",
		createdAt: "2026.01.10"
	},
	{
		id: "bw-3",
		word: "텔레그램 리딩방",
		category: "사설 리딩방",
		enabled: true,
		action: "block",
		severity: "mute",
		hitCount: 32,
		createdBy: "총괄관리자",
		createdAt: "2026.01.12"
	},
	{
		id: "bw-4",
		word: "카톡방 입장",
		category: "사설 리딩방",
		enabled: true,
		action: "review",
		severity: "mute",
		hitCount: 18,
		createdBy: "총괄관리자",
		createdAt: "2026.02.01"
	},
	{
		id: "bw-5",
		word: "무조건 상한가",
		category: "시세조종 유도",
		enabled: true,
		action: "review",
		severity: "warning",
		hitCount: 6,
		createdBy: "총괄관리자",
		createdAt: "2026.02.15"
	},
	{
		id: "bw-6",
		word: "작전주 정보",
		category: "불공정 거래",
		enabled: true,
		action: "block",
		severity: "block",
		hitCount: 21,
		createdBy: "총괄관리자",
		createdAt: "2026.03.01"
	}
];
var DEFAULT_NOTICES = [
	{
		id: "notice-1",
		title: "[중요] 병돌 인베스트먼트 실시간 AI 종목 브리핑 & 모니터링 엔진 정식 가동 안내",
		content: `안녕하세요, 병돌 인베스트먼트 총괄 운영팀입니다.\n\nKRX 실시간 체결 데이터 연동과 더불어 Gemini 3.8 기반의 팩트 체크 종목 브리핑 서비스가 정식 오픈되었습니다.\n\n[주요 업데이트 내역]\n1. 5대 전용 서버 함수 연동을 통한 주가·거래량·공시 정확도 보장\n2. 7대 시장 급변/사이드카/서킷브레이커 실시간 감지\n3. 사용자 맞춤형 알림 조건 설정\n\n회원 여러분의 안전하고 스마트한 투자를 지원하겠습니다. 감사합니다.`,
		author: "총괄운영팀",
		isPinned: true,
		category: "service",
		viewCount: 1420,
		createdAt: "2026.10.01 10:00"
	},
	{
		id: "notice-2",
		title: "[안내] 불법 유사투자자문 및 리딩방 홍보 게시글 즉시 제재 강화 방침",
		content: `최근 커뮤니티 및 종목 토론방에 '100% 수익 보장', '원금 보장', '사설 텔레그램 리딩방' 링크를 유포하는 악성 유저에 대한 모니터링이 강화됩니다.\n\n적발 시 사전 경고 없이 즉시 이용 정지 및 채팅 영구 차단 조치가 취해지며, 관계 당국에 신고 조치될 수 있으니 유의하시기 바랍니다.`,
		author: "컴플라이언스팀",
		isPinned: true,
		category: "system",
		viewCount: 980,
		createdAt: "2026.09.28 14:30"
	},
	{
		id: "notice-3",
		title: "[점검] 데이터베이스 및 실시간 소켓 서버 정기 점검 안내 (10/05 02:00~04:00)",
		content: `보다 안정적인 증시 데이터 스트리밍 서비스 제공을 위하여 정기 서버 인프라 최적화 작업이 진행됩니다.\n\n점검 시간 동안에는 실시간 시세 조회가 일시적으로 중단될 수 있습니다.`,
		author: "인프라팀",
		isPinned: false,
		category: "maintenance",
		viewCount: 450,
		createdAt: "2026.09.25 18:00"
	}
];
var adminService = {
	isToday(dateStr) {
		if (!dateStr) return false;
		const today = /* @__PURE__ */ new Date();
		const y = today.getFullYear();
		const m = String(today.getMonth() + 1).padStart(2, "0");
		const d = String(today.getDate()).padStart(2, "0");
		const t1 = `${y}.${m}.${d}`;
		const t2 = `${y}-${m}-${d}`;
		return dateStr.includes(t1) || dateStr.includes(t2) || dateStr.includes("방금") || dateStr.includes("오늘");
	},
	formatUptime(seconds) {
		if (!seconds || seconds <= 0) return "가동 중";
		const days = Math.floor(seconds / 86400);
		const hours = Math.floor(seconds % 86400 / 3600);
		const minutes = Math.floor(seconds % 3600 / 60);
		if (days > 0) return `${days}일 ${hours}시간`;
		if (hours > 0) return `${hours}시간 ${minutes}분`;
		return `${minutes}분 ${seconds % 60}초`;
	},
	getDashboardMetrics(params) {
		const users = params?.users || this.getUsers();
		const posts = params?.posts || storageService.getPosts();
		const reports = params?.reports || this.getReports();
		const chatMessages = params?.chatMessages || this.getChatMessages();
		const serverStats = params?.serverStats;
		const bannedWords = this.getBannedWords();
		const activeUsers = users.filter((u) => u.status !== "suspended" && u.status !== "deleted").length;
		const suspendedUsers = users.filter((u) => u.status === "suspended").length;
		const pendingReports = reports.filter((r) => r.status === "pending").length;
		const resolvedReports = reports.filter((r) => r.status === "resolved").length;
		const dismissedReports = reports.filter((r) => r.status === "dismissed").length;
		const todaySignups = users.filter((u) => this.isToday(u.createdAt || u.joinedDate)).length;
		const publishedPosts = posts.filter((p) => p.status !== "hidden" && p.status !== "deleted").length;
		const hiddenPosts = posts.filter((p) => p.status === "hidden").length;
		const deletedPosts = posts.filter((p) => p.status === "deleted").length;
		const todayPosts = posts.filter((p) => p.status !== "deleted" && this.isToday(p.createdAt)).length;
		let totalComments = 0;
		posts.forEach((p) => {
			if (p.status !== "deleted") totalComments += p.comments ? p.comments.length : p.commentsCount || 0;
		});
		const uniqueChatParticipants = new Set(chatMessages.map((m) => m.author?.id).filter(Boolean)).size;
		const currentOnline = serverStats?.presence?.totalOnline ?? params?.serverStats?.activeClients ?? 1;
		return {
			totalUsers: users.filter((u) => u.status !== "deleted").length,
			todaySignups,
			activeUsers,
			suspendedUsers,
			totalPosts: posts.filter((p) => p.status !== "deleted").length,
			publishedPosts,
			hiddenPosts,
			deletedPosts,
			todayPosts,
			totalComments,
			pendingReports,
			resolvedReports,
			dismissedReports,
			totalReports: reports.length,
			currentOnlineUsers: currentOnline,
			chatUsersCount: currentOnline,
			chatMessagesCount: chatMessages.length,
			chatParticipantsCount: uniqueChatParticipants,
			activeChatRoomsCount: Object.keys(serverStats?.presence?.roomCounts || {}).filter((k) => k !== "all").length || 3,
			bannedWordsCount: bannedWords.length,
			noticesCount: posts.filter((p) => p.isNotice || p.category === "notice").length,
			systemHealth: serverStats?.server?.status === "HEALTHY" ? "HEALTHY" : "NORMAL",
			firebaseStatus: serverStats?.dependencies?.firebase?.status === "CONNECTED" ? "NORMAL" : "DEGRADED",
			stockApiStatus: serverStats?.dependencies?.kiwoom?.status === "CONFIGURED" ? "NORMAL" : "DEGRADED",
			newsApiStatus: "NORMAL",
			geminiApiStatus: "NORMAL",
			cpuUsage: serverStats?.server?.cpuUsage ?? 14.2,
			memoryUsage: serverStats?.server?.memoryMB ?? 38.6,
			uptime: serverStats?.server?.uptimeSeconds ? this.formatUptime(serverStats.server.uptimeSeconds) : "가동 중",
			recentErrorsCount: serverStats?.resilience?.recentErrorsCount ?? 0
		};
	},
	async fetchDashboardStats() {
		try {
			return await safeFetchJson("/api/admin/dashboard-stats", { headers: await getAdminHeaders() });
		} catch (e) {
			console.warn("[adminService] fetchDashboardStats error:", e.message);
		}
		return null;
	},
	getUsers() {
		const raw = localStorage.getItem(USERS_STORAGE_KEY);
		const filterPurged = (list) => {
			return list.filter((u) => u.id !== "GvKuwpjwhZN6YyKWcjCdWcvN6cJ2" && u.email !== "user_db_1791121415110@invest.kr");
		};
		if (!raw) {
			const filtered = filterPurged([...INITIAL_ADMIN_USERS]);
			localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));
			return filtered;
		}
		try {
			const parsed = JSON.parse(raw);
			const filtered = filterPurged(parsed);
			if (filtered.length !== parsed.length) localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));
			return filtered;
		} catch {
			return filterPurged([...INITIAL_ADMIN_USERS]);
		}
	},
	saveUsers(users) {
		localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
	},
	addUser(profile) {
		const users = this.getUsers();
		const existingIndex = users.findIndex((u) => u.id === profile.id || u.email === profile.email);
		if (existingIndex >= 0) users[existingIndex] = {
			...users[existingIndex],
			...profile
		};
		else users.unshift(profile);
		this.saveUsers(users);
	},
	async suspendUser(userId, reason, adminProfile) {
		const users = this.getUsers();
		const target = users.find((u) => u.id === userId);
		if (!target) return {
			success: false,
			message: "사용자를 찾을 수 없습니다."
		};
		if (target.role === "superadmin" || target.id === "lr018vf8CcW5fAv707vsl77qJy53" || target.email === "byunghyunlim92@gmail.com") return {
			success: false,
			message: "최고 운영자 계정은 이용 정지할 수 없습니다."
		};
		try {
			const headers = await getAdminHeaders();
			headers["x-admin-name"] = adminProfile?.name || "운영관리자";
			await safeFetchJson(`/api/admin/users/${encodeURIComponent(userId)}/status`, {
				method: "POST",
				headers,
				body: JSON.stringify({
					status: "suspended",
					reason
				})
			});
		} catch (e) {
			console.warn("[adminService] suspendUser server notice:", e.message);
			return {
				success: false,
				message: e.message || "회원 정지 요청이 서버에서 거부되었습니다."
			};
		}
		try {
			await firebaseRepository.updateUserStatus(userId, "suspended", reason);
			await firebaseRepository.restrictChatUser(userId, reason, adminProfile?.id || "admin");
		} catch (fsErr) {
			console.error("[adminService] Firestore suspend error:", fsErr);
			return {
				success: false,
				message: `Firestore 저장 실패: ${fsErr.message || "권한 부족 또는 네트워크 오류"}`
			};
		}
		target.status = "suspended";
		target.suspendedReason = reason;
		target.chatRestricted = true;
		target.chatMutedUntil = "영구 정지";
		this.saveUsers(users);
		this.logAction({
			adminId: adminProfile?.id || "admin",
			adminName: adminProfile?.name || "운영관리자",
			adminRole: adminProfile?.role || "admin",
			action: "SUSPEND_USER",
			targetType: "user",
			targetId: userId,
			targetTitle: target.name,
			details: `회원 정지 처리 사유: ${reason}`,
			afterData: {
				status: "suspended",
				reason
			}
		});
		return {
			success: true,
			message: `'${target.name}' 회원이 정지 처리되었습니다.`
		};
	},
	async unsuspendUser(userId, adminProfile) {
		const users = this.getUsers();
		const target = users.find((u) => u.id === userId);
		if (!target) return {
			success: false,
			message: "사용자를 찾을 수 없습니다."
		};
		try {
			const headers = await getAdminHeaders();
			headers["x-admin-name"] = adminProfile?.name || "운영관리자";
			await safeFetchJson(`/api/admin/users/${encodeURIComponent(userId)}/status`, {
				method: "POST",
				headers,
				body: JSON.stringify({ status: "active" })
			});
		} catch (e) {
			console.warn("[adminService] unsuspendUser server notice:", e.message);
			return {
				success: false,
				message: e.message || "정지 해제 요청이 서버에서 거부되었습니다."
			};
		}
		try {
			await firebaseRepository.updateUserStatus(userId, "active");
			await firebaseRepository.unrestrictChatUser(userId);
		} catch (fsErr) {
			console.error("[adminService] Firestore unsuspend error:", fsErr);
			return {
				success: false,
				message: `Firestore 저장 실패: ${fsErr.message || "권한 부족 또는 네트워크 오류"}`
			};
		}
		target.status = "active";
		target.suspendedReason = void 0;
		target.chatRestricted = false;
		target.chatMutedUntil = void 0;
		this.saveUsers(users);
		this.logAction({
			adminId: adminProfile?.id || "admin",
			adminName: adminProfile?.name || "운영관리자",
			adminRole: adminProfile?.role || "admin",
			action: "UNSUSPEND_USER",
			targetType: "user",
			targetId: userId,
			targetTitle: target.name,
			details: "회원 정지 및 채팅 제한 해제 (정상 계정 전환)"
		});
		return {
			success: true,
			message: `'${target.name}' 회원의 정지가 해제되었습니다.`
		};
	},
	async muteUser(userId, durationDesc, adminProfile) {
		const users = this.getUsers();
		const target = users.find((u) => u.id === userId);
		if (userId === "lr018vf8CcW5fAv707vsl77qJy53" || target?.role === "superadmin" || target?.email === "byunghyunlim92@gmail.com") return {
			success: false,
			message: "최고 운영자 계정은 채팅을 제한할 수 없습니다."
		};
		try {
			const headers = await getAdminHeaders();
			headers["x-admin-name"] = adminProfile?.name || "운영관리자";
			const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/mute`, {
				method: "POST",
				headers,
				body: JSON.stringify({
					chatRestricted: true,
					duration: durationDesc
				})
			});
			if (!res.ok) return {
				success: false,
				message: (await res.json().catch(() => ({}))).error || "채팅 제한 요청이 서버에서 거부되었습니다."
			};
		} catch (e) {
			console.warn("[adminService] muteUser server notice:", e.message);
		}
		try {
			await firebaseRepository.restrictChatUser(userId, durationDesc, adminProfile?.id || "admin");
			await firebaseRepository.updateUserChatRestricted(userId, true, durationDesc);
		} catch (fsErr) {
			console.error("[adminService] Firestore mute error:", fsErr);
			return {
				success: false,
				message: `Firestore 저장 실패: ${fsErr.message || "권한 부족 또는 네트워크 오류"}`
			};
		}
		if (target) {
			target.chatRestricted = true;
			target.chatMutedUntil = durationDesc;
			this.saveUsers(users);
		}
		const userName = target?.name || "사용자";
		this.logAction({
			adminId: adminProfile?.id || "admin",
			adminName: adminProfile?.name || "운영관리자",
			adminRole: adminProfile?.role || "admin",
			action: "MUTE_CHAT_USER",
			targetType: "user",
			targetId: userId,
			targetTitle: userName,
			details: `채팅 발언 제한 적용: ${durationDesc}`
		});
		return {
			success: true,
			message: `'${userName}' 회원의 채팅이 ${durationDesc} 동안 제한되었습니다.`
		};
	},
	async unmuteUser(userId, adminProfile) {
		const users = this.getUsers();
		const target = users.find((u) => u.id === userId);
		try {
			const headers = await getAdminHeaders();
			headers["x-admin-name"] = adminProfile?.name || "운영관리자";
			const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/mute`, {
				method: "POST",
				headers,
				body: JSON.stringify({ chatRestricted: false })
			});
			if (!res.ok) return {
				success: false,
				message: (await res.json().catch(() => ({}))).error || "채팅 제한 해제 요청이 서버에서 거부되었습니다."
			};
		} catch (e) {
			console.warn("[adminService] unmuteUser server notice:", e.message);
		}
		try {
			await firebaseRepository.unrestrictChatUser(userId);
			await firebaseRepository.updateUserChatRestricted(userId, false);
		} catch (fsErr) {
			console.error("[adminService] Firestore unmute error:", fsErr);
			return {
				success: false,
				message: `Firestore 저장 실패: ${fsErr.message || "권한 부족 또는 네트워크 오류"}`
			};
		}
		if (target) {
			target.chatRestricted = false;
			target.chatMutedUntil = void 0;
			this.saveUsers(users);
		}
		const userName = target?.name || (userId === "lr018vf8CcW5fAv707vsl77qJy53" ? "총괄관리자(임병현)" : "사용자");
		this.logAction({
			adminId: adminProfile?.id || "admin",
			adminName: adminProfile?.name || "운영관리자",
			adminRole: adminProfile?.role || "admin",
			action: "UNMUTE_CHAT_USER",
			targetType: "user",
			targetId: userId,
			targetTitle: userName,
			details: "채팅 발언 제한 해제"
		});
		return {
			success: true,
			message: `'${userName}' 회원의 채팅 제한이 해제되었습니다.`
		};
	},
	warnUser(userId, message, adminProfile) {
		const users = this.getUsers();
		const target = users.find((u) => u.id === userId);
		if (!target) return false;
		target.reportedCount = (target.reportedCount || 0) + 1;
		this.saveUsers(users);
		storageService.addNotification({
			uid: userId,
			type: "system",
			title: "⚠️ 커뮤니티 운영진 공식 경고 알림",
			message: message || "회원님의 활동 중 이용약관 및 커뮤니티 가이드라인 위반 사항이 접수되었습니다.",
			targetType: "general"
		});
		this.logAction({
			adminId: adminProfile?.id || "admin",
			adminName: adminProfile?.name || "운영관리자",
			adminRole: adminProfile?.role || "admin",
			action: "WARN_USER",
			targetType: "user",
			targetId: userId,
			targetTitle: target.name,
			details: `회원 경고 조치 및 알림 발송: ${message}`
		});
		return true;
	},
	async changeUserRole(userId, newRole, callerRole, callerProfile) {
		if (callerRole !== "superadmin") return {
			success: false,
			message: "오직 최고 관리자(superadmin)만 회원 권한(Role)을 변경할 수 있습니다."
		};
		const users = this.getUsers();
		const target = users.find((u) => u.id === userId);
		if (!target) return {
			success: false,
			message: "사용자를 찾을 수 없습니다."
		};
		if ((target.email === "byunghyunlim92@gmail.com" || target.id === "lr018vf8CcW5fAv707vsl77qJy53") && newRole !== "superadmin") return {
			success: false,
			message: "시스템 최초 최고 관리자의 권한은 박탈할 수 없습니다."
		};
		try {
			const headers = await getAdminHeaders();
			headers["x-admin-name"] = callerProfile?.name || "총괄관리자(임병현)";
			headers["x-admin-role"] = "superadmin";
			const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/role`, {
				method: "POST",
				headers,
				body: JSON.stringify({ role: newRole })
			});
			if (!res.ok) return {
				success: false,
				message: (await res.json().catch(() => ({}))).error || "권한 변경 요청 실패"
			};
		} catch (e) {
			console.warn("[adminService] changeUserRole server notice:", e.message);
		}
		await firebaseRepository.updateUserRole(userId, newRole);
		const oldRole = target.role;
		target.role = newRole;
		if (newRole === "superadmin") target.tier = "최고 관리자";
		else if (newRole === "admin") target.tier = "시스템 관리자";
		else if (newRole === "moderator") target.tier = "운영진 (Moderator)";
		else target.tier = "일반회원";
		this.saveUsers(users);
		this.logAction({
			adminId: callerProfile?.id || "superadmin",
			adminName: callerProfile?.name || "최고관리자",
			adminRole: "superadmin",
			action: "CHANGE_USER_ROLE",
			targetType: "user",
			targetId: userId,
			targetTitle: target.name,
			details: `회원 권한 변경: [${oldRole}] -> [${newRole}]`,
			beforeData: oldRole,
			afterData: newRole
		});
		return {
			success: true,
			message: `'${target.name}'님의 권한이 '${newRole}'(으)로 변경되었습니다.`
		};
	},
	async deleteUser(userId, adminProfile) {
		if (userId === "lr018vf8CcW5fAv707vsl77qJy53") return {
			success: false,
			message: "최고 운영자 계정은 삭제할 수 없습니다."
		};
		try {
			const headers = await getAdminHeaders();
			headers["x-admin-name"] = adminProfile?.name || "총괄관리자(임병현)";
			headers["x-admin-role"] = "superadmin";
			const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}`, {
				method: "DELETE",
				headers
			});
			if (!res.ok) return {
				success: false,
				message: (await res.json().catch(() => ({}))).error || "회원 삭제 요청 실패"
			};
		} catch (e) {
			console.warn("[adminService] deleteUser server notice:", e.message);
		}
		await firebaseRepository.deleteUser(userId);
		const users = this.getUsers().filter((u) => u.id !== userId);
		this.saveUsers(users);
		this.logAction({
			adminId: adminProfile?.id || "superadmin",
			adminName: adminProfile?.name || "총괄관리자",
			adminRole: "superadmin",
			action: "DELETE_USER",
			targetType: "user",
			targetId: userId,
			details: "회원 계정 및 관련 참조 데이터 영구 삭제"
		});
		return {
			success: true,
			message: "회원 계정이 삭제되었습니다."
		};
	},
	async purgeNonAdminUsers(adminProfile) {
		try {
			const headers = await getAdminHeaders();
			headers["x-admin-name"] = adminProfile?.name || "총괄관리자(임병현)";
			headers["x-admin-role"] = "superadmin";
			headers["x-admin-uid"] = "lr018vf8CcW5fAv707vsl77qJy53";
			headers["x-user-email"] = "byunghyunlim92@gmail.com";
			const res = await fetch("/api/admin/cleanup-non-admins", {
				method: "POST",
				headers
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "초기화 요청 처리 실패");
			this.saveUsers(INITIAL_ADMIN_USERS);
			return data;
		} catch (err) {
			console.error("[adminService] purgeNonAdminUsers failed:", err);
			return {
				success: false,
				deletedUsersCount: 0,
				deletedDocsCount: 0,
				authUsersDeletedCount: 0,
				storageFilesDeletedCount: 0,
				protectedAdmins: ["byunghyunlim92@gmail.com"],
				protectedAdminUids: ["lr018vf8CcW5fAv707vsl77qJy53"],
				unprocessedScopeNotes: ["서버 통신 실패 또는 권한 부족으로 초기화가 중단되었습니다."],
				errors: [err.message || "초기화 실행 실패"],
				error: err.message || "초기화 실행 실패"
			};
		}
	},
	getPosts() {
		return storageService.getPosts();
	},
	async updatePostStatus(postId, status, adminProfile) {
		const posts = storageService.getPosts();
		const post = posts.find((p) => p.id === postId);
		if (!post) return false;
		const oldStatus = post.status || "published";
		post.status = status;
		storageService.savePosts(posts);
		await firebaseRepository.updatePostStatus(postId, status);
		try {
			const headers = await getAdminHeaders();
			headers["x-admin-name"] = adminProfile?.name || "운영관리자";
			await fetch(`/api/admin/posts/${encodeURIComponent(postId)}/status`, {
				method: "POST",
				headers,
				body: JSON.stringify({ status })
			});
		} catch (e) {
			console.warn("[adminService] updatePostStatus server error:", e.message);
		}
		this.logAction({
			adminId: adminProfile?.id || "admin",
			adminName: adminProfile?.name || "운영관리자",
			adminRole: adminProfile?.role || "admin",
			action: status === "deleted" ? "DELETE_POST" : status === "hidden" ? "HIDE_POST" : "RESTORE_POST",
			targetType: "post",
			targetId: postId,
			targetTitle: post.title,
			details: `게시글 상태 변경: ${oldStatus} -> ${status}`
		});
		return true;
	},
	async deletePost(postId, adminProfile) {
		await firebaseRepository.deletePost(postId);
		storageService.deletePost(postId);
		try {
			const headers = await getAdminHeaders();
			headers["x-admin-name"] = adminProfile?.name || "운영관리자";
			await fetch(`/api/admin/posts/${encodeURIComponent(postId)}`, {
				method: "DELETE",
				headers
			});
		} catch (e) {
			console.warn("[adminService] deletePost server error:", e.message);
		}
		this.logAction({
			adminId: adminProfile?.id || "admin",
			adminName: adminProfile?.name || "운영관리자",
			adminRole: adminProfile?.role || "admin",
			action: "DELETE_POST",
			targetType: "post",
			targetId: postId,
			details: "게시글 영구 삭제 처리"
		});
		return true;
	},
	toggleNoticePost(postId, isNotice, adminProfile) {
		const posts = storageService.getPosts();
		const post = posts.find((p) => p.id === postId);
		if (!post) return false;
		post.isNotice = isNotice;
		if (isNotice) post.category = "notice";
		storageService.savePosts(posts);
		this.logAction({
			adminId: adminProfile?.id || "admin",
			adminName: adminProfile?.name || "운영관리자",
			adminRole: adminProfile?.role || "admin",
			action: isNotice ? "PIN_NOTICE_POST" : "UNPIN_NOTICE_POST",
			targetType: "post",
			targetId: postId,
			targetTitle: post.title,
			details: isNotice ? "게시글을 상단 공지글로 지정" : "게시글 상단 공지 지정 해제"
		});
		return true;
	},
	getAllComments(postsList) {
		const posts = postsList || storageService.getPosts();
		const allComments = [];
		posts.forEach((p) => {
			if (p.comments && p.comments.length > 0) p.comments.forEach((c) => {
				allComments.push({
					comment: c,
					postTitle: p.title,
					postId: p.id
				});
			});
		});
		return allComments;
	},
	updateCommentStatus(commentId, postId, status, adminProfile) {
		const posts = storageService.getPosts();
		const post = posts.find((p) => p.id === postId);
		if (!post || !post.comments) return false;
		const comment = post.comments.find((c) => c.id === commentId);
		if (!comment) return false;
		comment.status = status;
		storageService.savePosts(posts);
		this.logAction({
			adminId: adminProfile?.id || "admin",
			adminName: adminProfile?.name || "운영관리자",
			adminRole: adminProfile?.role || "admin",
			action: status === "deleted" ? "DELETE_COMMENT" : status === "hidden" ? "HIDE_COMMENT" : "RESTORE_COMMENT",
			targetType: "comment",
			targetId: commentId,
			targetTitle: `게시글 [${post.title}] 내 댓글`,
			details: `댓글 상태 변경: ${status}`
		});
		return true;
	},
	getReports() {
		const raw = localStorage.getItem("bd_admin_reports");
		let adminReports = [];
		if (!raw) {
			adminReports = [];
			localStorage.setItem("bd_admin_reports", JSON.stringify([]));
		} else try {
			adminReports = JSON.parse(raw);
		} catch {
			adminReports = [];
		}
		adminReports = adminReports.filter((r) => r.id !== "rep-1" && r.id !== "rep-2" && r.id !== "rep-3" && r.targetId !== "spam-post-99" && r.targetId !== "comment-88" && r.targetId !== "rumor-77" && r.targetId !== "p-101" && r.targetId !== "c-msg-55" && r.targetId !== "c-cmt-12");
		try {
			const userReportsRaw = localStorage.getItem("bd_reports");
			if (userReportsRaw) {
				const userReports = JSON.parse(userReportsRaw);
				if (Array.isArray(userReports)) {
					let hasNew = false;
					userReports.forEach((ur) => {
						if (!adminReports.some((ar) => ar.id === ur.id || ar.targetId === ur.targetId && ar.reportedBy === ur.reporterName && ar.reason === ur.reason)) {
							adminReports.unshift({
								id: ur.id || `rep-${Date.now()}`,
								type: ur.targetType || "post",
								targetId: ur.targetId,
								targetTitle: ur.targetTitle || (ur.targetContent ? ur.targetContent.slice(0, 30) : "신고 대상"),
								targetContent: ur.targetContent,
								targetAuthorName: ur.targetAuthorName,
								reportedBy: ur.reporterName || "회원",
								reporterId: ur.reporterId,
								reason: ur.reason,
								status: ur.status || "pending",
								createdAt: ur.createdAt || (/* @__PURE__ */ new Date()).toLocaleString("ko-KR")
							});
							hasNew = true;
						}
					});
					if (hasNew) localStorage.setItem("bd_admin_reports", JSON.stringify(adminReports));
				}
			}
		} catch {}
		return adminReports;
	},
	createReport(data) {
		const reports = this.getReports();
		const newReport = {
			id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
			type: data.type,
			targetId: data.targetId,
			targetTitle: data.targetTitle || (data.targetContent ? data.targetContent.slice(0, 35) : "신고 항목"),
			targetContent: data.targetContent,
			targetAuthorId: data.targetAuthorId,
			targetAuthorName: data.targetAuthorName,
			reportedBy: data.reportedBy,
			reporterId: data.reporterId,
			reason: data.reason,
			status: "pending",
			createdAt: (/* @__PURE__ */ new Date()).toLocaleDateString("ko-KR") + " " + (/* @__PURE__ */ new Date()).toLocaleTimeString("ko-KR")
		};
		reports.unshift(newReport);
		this.saveReports(reports);
		return newReport;
	},
	saveReports(reports) {
		localStorage.setItem("bd_admin_reports", JSON.stringify(reports));
	},
	async clearAllReports(adminProfile) {
		localStorage.removeItem("bd_admin_reports");
		localStorage.removeItem("bd_reports");
		localStorage.setItem("bd_admin_reports", JSON.stringify([]));
		localStorage.setItem("bd_reports", JSON.stringify([]));
		try {
			const headers = await getAdminHeaders();
			headers["x-admin-name"] = adminProfile?.name || "총괄관리자(임병현)";
			await fetch("/api/admin/reports", {
				method: "DELETE",
				headers
			});
		} catch (e) {
			console.warn("[adminService] clearAllReports server warning:", e.message);
		}
		await firebaseRepository.clearAllReports();
		await firebaseRepository.clearAllSanctions();
		return true;
	},
	async resolveReport(reportId, actionTaken, handlerName, adminProfile) {
		const reports = this.getReports();
		const report = reports.find((r) => r.id === reportId);
		if (!report) return false;
		report.status = "resolved";
		report.handlerName = handlerName;
		report.handledAt = (/* @__PURE__ */ new Date()).toLocaleString("ko-KR");
		report.actionTaken = actionTaken;
		this.saveReports(reports);
		await firebaseRepository.resolveReport(reportId, "resolved", actionTaken, handlerName);
		try {
			const headers = await getAdminHeaders();
			headers["x-admin-name"] = handlerName;
			await fetch(`/api/admin/reports/${encodeURIComponent(reportId)}/resolve`, {
				method: "POST",
				headers,
				body: JSON.stringify({
					status: "resolved",
					actionTaken
				})
			});
		} catch (e) {
			console.warn("[adminService] resolveReport server error:", e.message);
		}
		this.logAction({
			adminId: adminProfile?.id || "admin",
			adminName: handlerName,
			adminRole: adminProfile?.role || "admin",
			action: "RESOLVE_REPORT",
			targetType: report.type,
			targetId: report.targetId,
			targetTitle: report.targetTitle,
			details: `신고 처리 완료 (조치내용: ${actionTaken})`
		});
		return true;
	},
	async dismissReport(reportId, handlerName, adminProfile) {
		const reports = this.getReports();
		const report = reports.find((r) => r.id === reportId);
		if (!report) return false;
		report.status = "dismissed";
		report.handlerName = handlerName;
		report.handledAt = (/* @__PURE__ */ new Date()).toLocaleString("ko-KR");
		report.actionTaken = "허위/무효 신고로 판정되어 기각";
		this.saveReports(reports);
		await firebaseRepository.resolveReport(reportId, "dismissed", "기각 처리", handlerName);
		try {
			const headers = await getAdminHeaders();
			headers["x-admin-name"] = handlerName;
			await fetch(`/api/admin/reports/${encodeURIComponent(reportId)}/resolve`, {
				method: "POST",
				headers,
				body: JSON.stringify({
					status: "dismissed",
					actionTaken: "기각 처리"
				})
			});
		} catch (e) {
			console.warn("[adminService] dismissReport server error:", e.message);
		}
		this.logAction({
			adminId: adminProfile?.id || "admin",
			adminName: handlerName,
			adminRole: adminProfile?.role || "admin",
			action: "DISMISS_REPORT",
			targetType: report.type,
			targetId: report.targetId,
			targetTitle: report.targetTitle,
			details: "신고 기각 처리 (정상적인 발언/게시글 확인)"
		});
		return true;
	},
	getChatMessages(roomId = "all") {
		return storageService.getChatMessages(roomId);
	},
	async deleteChatMessage(messageId, roomId = "all", adminProfile) {
		await firebaseRepository.deleteChatMessage(messageId);
		try {
			const headers = await getAdminHeaders();
			headers["x-admin-name"] = adminProfile?.name || "운영관리자";
			const res = await fetch(`/api/admin/chat/messages/${encodeURIComponent(messageId)}?roomId=${encodeURIComponent(roomId)}`, {
				method: "DELETE",
				headers
			});
			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				console.warn("[adminService] deleteChatMessage server warning:", errData);
			}
		} catch (e) {
			console.warn("[adminService] deleteChatMessage server error:", e.message);
		}
		const updated = storageService.getChatMessages(roomId).filter((m) => m.id !== messageId);
		storageService.saveChatMessages(roomId, updated);
		this.logAction({
			adminId: adminProfile?.id || "admin",
			adminName: adminProfile?.name || "운영관리자",
			adminRole: adminProfile?.role || "admin",
			action: "DELETE_CHAT_MESSAGE",
			targetType: "chat",
			targetId: messageId,
			details: `채팅방 [${roomId}] 부적절 메시지 즉시 삭제`
		});
		return { success: true };
	},
	async clearChatMessages(roomId = "all", adminProfile) {
		try {
			const headers = await getAdminHeaders();
			headers["x-admin-name"] = adminProfile?.name || "운영관리자";
			const res = await fetch(`/api/admin/chat/rooms/${encodeURIComponent(roomId)}/clear`, {
				method: "POST",
				headers
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) return {
				success: false,
				message: data.error || "채팅 전체 삭제 실패"
			};
			storageService.saveChatMessages(roomId, []);
			this.logAction({
				adminId: adminProfile?.id || "admin",
				adminName: adminProfile?.name || "운영관리자",
				adminRole: adminProfile?.role || "admin",
				action: "CLEAR_CHAT_ROOM",
				targetType: "chat",
				targetId: roomId,
				details: `채팅방 [${roomId}] 대화 내용 전체 삭제 (${data.deletedCount || 0}건)`
			});
			return {
				success: true,
				message: `채팅방 [${roomId}]의 모든 메시지가 성공적으로 삭제되었습니다.`,
				deletedCount: data.deletedCount
			};
		} catch (e) {
			return {
				success: false,
				message: e.message || "채팅 전체 삭제 처리 중 오류"
			};
		}
	},
	async deleteChatRoom(roomId, adminProfile) {
		try {
			const headers = await getAdminHeaders();
			headers["x-admin-name"] = adminProfile?.name || "운영관리자";
			const res = await fetch(`/api/admin/chat/rooms/${encodeURIComponent(roomId)}`, {
				method: "DELETE",
				headers
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) return {
				success: false,
				message: data.error || "채팅방 삭제 실패"
			};
			await firebaseRepository.deleteChatRoom(roomId, adminProfile?.id || "admin").catch(() => {});
			storageService.saveChatMessages(roomId, []);
			this.logAction({
				adminId: adminProfile?.id || "admin",
				adminName: adminProfile?.name || "운영관리자",
				adminRole: adminProfile?.role || "admin",
				action: "DELETE_CHAT_ROOM",
				targetType: "chat",
				targetId: roomId,
				details: `채팅방 [${roomId}] 영구 삭제`
			});
			return {
				success: true,
				message: `채팅방이 성공적으로 삭제되었습니다.`
			};
		} catch (e) {
			return {
				success: false,
				message: e.message || "채팅방 삭제 중 오류 발생"
			};
		}
	},
	getBannedWords() {
		const raw = localStorage.getItem(BANNED_WORDS_STORAGE_KEY);
		if (!raw) {
			localStorage.setItem(BANNED_WORDS_STORAGE_KEY, JSON.stringify(DEFAULT_BANNED_WORDS));
			return [...DEFAULT_BANNED_WORDS];
		}
		try {
			return JSON.parse(raw);
		} catch {
			return [...DEFAULT_BANNED_WORDS];
		}
	},
	saveBannedWords(words) {
		localStorage.setItem(BANNED_WORDS_STORAGE_KEY, JSON.stringify(words));
	},
	addBannedWord(word, severity, category, action, addedBy, adminProfile) {
		const words = this.getBannedWords();
		const newWord = {
			id: `bw-${Date.now()}`,
			word: word.trim(),
			severity,
			category: category || "일반 금칙어",
			action: action || "block",
			enabled: true,
			hitCount: 0,
			createdBy: addedBy,
			createdAt: (/* @__PURE__ */ new Date()).toLocaleDateString("ko-KR")
		};
		words.unshift(newWord);
		this.saveBannedWords(words);
		this.logAction({
			adminId: adminProfile?.id || "admin",
			adminName: addedBy,
			adminRole: adminProfile?.role || "admin",
			action: "ADD_BANNED_WORD",
			targetType: "filter",
			targetId: newWord.id,
			targetTitle: word,
			details: `새 금칙어 등록: "${word}" [${severity}] -> ${action}`
		});
		return newWord;
	},
	deleteBannedWord(id, adminProfile) {
		const words = this.getBannedWords();
		const target = words.find((w) => w.id === id);
		const filtered = words.filter((w) => w.id !== id);
		this.saveBannedWords(filtered);
		this.logAction({
			adminId: adminProfile?.id || "admin",
			adminName: adminProfile?.name || "운영관리자",
			adminRole: adminProfile?.role || "admin",
			action: "DELETE_BANNED_WORD",
			targetType: "filter",
			targetId: id,
			targetTitle: target?.word || id,
			details: `금칙어 사전 항목 삭제: "${target?.word}"`
		});
		return true;
	},
	toggleBannedWord(id, enabled) {
		const words = this.getBannedWords();
		const word = words.find((w) => w.id === id);
		if (!word) return false;
		word.enabled = enabled;
		this.saveBannedWords(words);
		return true;
	},
	getNotices() {
		const raw = localStorage.getItem(NOTICES_STORAGE_KEY);
		if (!raw) {
			localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(DEFAULT_NOTICES));
			return [...DEFAULT_NOTICES];
		}
		try {
			return JSON.parse(raw);
		} catch {
			return [...DEFAULT_NOTICES];
		}
	},
	saveNotices(notices) {
		localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(notices));
	},
	createNotice(notice, adminProfile) {
		const notices = this.getNotices();
		const newNotice = {
			...notice,
			id: `notice-${Date.now()}`,
			viewCount: 0,
			createdAt: (/* @__PURE__ */ new Date()).toLocaleString("ko-KR")
		};
		notices.unshift(newNotice);
		this.saveNotices(notices);
		const posts = storageService.getPosts();
		posts.unshift({
			id: `post-notice-${newNotice.id}`,
			author: {
				id: adminProfile?.id || "admin",
				name: newNotice.author || "총괄운영팀",
				avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
				badge: "공식 공지",
				tier: "운영팀",
				level: 99,
				title: "관리자"
			},
			category: "notice",
			title: newNotice.title,
			content: newNotice.content,
			likes: 0,
			views: 1,
			commentsCount: 0,
			createdAt: "방금 전",
			isNotice: true,
			tags: ["공지사항", newNotice.category]
		});
		storageService.savePosts(posts);
		this.logAction({
			adminId: adminProfile?.id || "admin",
			adminName: newNotice.author,
			adminRole: adminProfile?.role || "admin",
			action: "CREATE_NOTICE",
			targetType: "notice",
			targetId: newNotice.id,
			targetTitle: newNotice.title,
			details: `운영 공지사항 작성 및 커뮤니티 공지 연동: "${newNotice.title}"`
		});
		return newNotice;
	},
	updateNotice(id, updates, adminProfile) {
		const notices = this.getNotices();
		const target = notices.find((n) => n.id === id);
		if (!target) return false;
		Object.assign(target, updates);
		this.saveNotices(notices);
		this.logAction({
			adminId: adminProfile?.id || "admin",
			adminName: adminProfile?.name || "운영관리자",
			adminRole: adminProfile?.role || "admin",
			action: "UPDATE_NOTICE",
			targetType: "notice",
			targetId: id,
			targetTitle: target.title,
			details: `공지사항 수정: "${target.title}"`
		});
		return true;
	},
	deleteNotice(id, adminProfile) {
		const notices = this.getNotices();
		const target = notices.find((n) => n.id === id);
		const filtered = notices.filter((n) => n.id !== id);
		this.saveNotices(filtered);
		this.logAction({
			adminId: adminProfile?.id || "admin",
			adminName: adminProfile?.name || "운영관리자",
			adminRole: adminProfile?.role || "admin",
			action: "DELETE_NOTICE",
			targetType: "notice",
			targetId: id,
			targetTitle: target?.title || id,
			details: `공지사항 삭제: "${target?.title}"`
		});
		return true;
	},
	togglePinNotice(id) {
		const notices = this.getNotices();
		const target = notices.find((n) => n.id === id);
		if (!target) return false;
		target.isPinned = !target.isPinned;
		this.saveNotices(notices);
		return true;
	},
	getNotifications() {
		const raw = localStorage.getItem(ADMIN_NOTIFICATIONS_STORAGE_KEY);
		if (!raw) {
			const initial = [{
				id: "b-1",
				targetType: "all",
				title: "🚨 긴급 코스피 사이드카 발동 안내",
				message: "선물 지수 5% 급락에 따른 5분간 프로그램 매도 호가 효력 정지",
				priority: "urgent",
				createdBy: "총괄관리자",
				createdAt: "2026.10.02 11:20",
				sentCount: 1420,
				status: "sent"
			}, {
				id: "b-2",
				targetType: "all",
				title: "📢 실시간 AI 종목 팩트체크 엔진 오픈",
				message: "종목 상세화면에서 최신 수급과 테마 요약을 1초만에 확인하세요.",
				priority: "normal",
				createdBy: "총괄운영팀",
				createdAt: "2026.10.01 09:00",
				sentCount: 2300,
				status: "sent"
			}];
			localStorage.setItem(ADMIN_NOTIFICATIONS_STORAGE_KEY, JSON.stringify(initial));
			return initial;
		}
		try {
			return JSON.parse(raw);
		} catch {
			return [];
		}
	},
	saveNotifications(list) {
		localStorage.setItem(ADMIN_NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list));
	},
	sendNotification(item, adminProfile) {
		const list = this.getNotifications();
		const newItem = {
			...item,
			id: `notif-${Date.now()}`,
			createdAt: (/* @__PURE__ */ new Date()).toLocaleString("ko-KR"),
			sentCount: item.targetType === "all" ? 2450 : 1,
			status: "sent"
		};
		list.unshift(newItem);
		this.saveNotifications(list);
		if (item.targetType === "user" && item.targetId) storageService.addNotification({
			uid: item.targetId,
			type: "system",
			title: item.title,
			message: item.message,
			targetType: "general"
		});
		this.logAction({
			adminId: adminProfile?.id || "admin",
			adminName: item.createdBy,
			adminRole: adminProfile?.role || "admin",
			action: "BROADCAST_NOTIFICATION",
			targetType: "alert",
			targetId: newItem.id,
			targetTitle: item.title,
			details: `[${item.targetType.toUpperCase()}] 알림 발송: "${item.title}"`
		});
		return newItem;
	},
	async getMarketStatus() {
		try {
			const res = await fetch("/api/admin/market-status", { headers: {
				"x-admin-role": "admin",
				"x-user-email": "byunghyunlim92@gmail.com"
			} });
			if (res.ok) return await res.json();
		} catch {}
		return {
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
		};
	},
	getAdminLogs() {
		const raw = localStorage.getItem(ADMIN_LOGS_STORAGE_KEY);
		if (!raw) {
			localStorage.setItem(ADMIN_LOGS_STORAGE_KEY, JSON.stringify([]));
			return [];
		}
		try {
			const parsed = JSON.parse(raw);
			const cleaned = parsed.filter((l) => l.id !== "log-boot-1" && l.id !== "log-rule-1");
			if (cleaned.length !== parsed.length) localStorage.setItem(ADMIN_LOGS_STORAGE_KEY, JSON.stringify(cleaned));
			return cleaned;
		} catch {
			return [];
		}
	},
	async clearAllAdminLogs(adminProfile) {
		localStorage.removeItem(ADMIN_LOGS_STORAGE_KEY);
		localStorage.setItem(ADMIN_LOGS_STORAGE_KEY, JSON.stringify([]));
		try {
			const headers = await getAdminHeaders();
			headers["x-admin-name"] = adminProfile?.name || "총괄관리자(임병현)";
			await fetch("/api/admin/logs", {
				method: "DELETE",
				headers
			});
		} catch (e) {
			console.warn("[adminService] clearAllAdminLogs server warning:", e.message);
		}
		await firebaseRepository.clearAllAdminLogs();
		return true;
	},
	logAction(log) {
		const logs = this.getAdminLogs();
		const newLog = {
			...log,
			id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
			createdAt: (/* @__PURE__ */ new Date()).toLocaleString("ko-KR"),
			timestamp: Date.now()
		};
		logs.unshift(newLog);
		if (logs.length > 500) logs.pop();
		localStorage.setItem(ADMIN_LOGS_STORAGE_KEY, JSON.stringify(logs));
		fetch("/api/admin/logs", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-admin-role": log.adminRole || "admin",
				"x-admin-name": log.adminName || "운영관리자",
				"x-admin-uid": log.adminId || "admin",
				"x-user-email": "byunghyunlim92@gmail.com"
			},
			body: JSON.stringify(newLog)
		}).catch(() => {});
		return newLog;
	},
	getSettings() {
		const raw = localStorage.getItem(ADMIN_SETTINGS_STORAGE_KEY);
		if (!raw) {
			const defaultSettings = [
				{
					key: "maintenance_mode",
					label: "서비스 점검 모드",
					value: false,
					type: "boolean",
					description: "활성화 시 일반 사용자 접속 차단 및 점검 모달 표시",
					category: "system",
					updatedBy: "총괄관리자",
					updatedAt: "2026.10.04"
				},
				{
					key: "allow_new_registrations",
					label: "신규 회원가입 허용",
					value: true,
					type: "boolean",
					description: "비활성화 시 신규 회원의 회원가입이 일시 중지됩니다.",
					category: "system",
					updatedBy: "총괄관리자",
					updatedAt: "2026.10.04"
				},
				{
					key: "profanity_action",
					label: "금칙어 감지 시 조치 정책",
					value: "block",
					type: "select",
					options: [
						{
							label: "작성 즉시 차단 (Block)",
							value: "block"
						},
						{
							label: "관리자 검토 대상으로 분류 (Review)",
							value: "review"
						},
						{
							label: "별표(***) 자동 마스킹 (Replace)",
							value: "replace"
						}
					],
					description: "게시글 및 채팅에서 등록된 금칙어 검출 시 처리 정책",
					category: "community",
					updatedBy: "총괄관리자",
					updatedAt: "2026.10.04"
				},
				{
					key: "chat_spam_threshold_msg",
					label: "채팅 도배 감지 임계치 (초당 메시지)",
					value: 3,
					type: "number",
					description: "3초 이내에 연속 발송 가능한 최대 메시지 수",
					category: "chat",
					updatedBy: "총괄관리자",
					updatedAt: "2026.10.04"
				},
				{
					key: "ai_query_daily_quota",
					label: "회원당 일일 Gemini AI 브리핑 한도",
					value: 20,
					type: "number",
					description: "일반 회원이 하루 동안 요청 가능한 AI 종목 분석 횟수",
					category: "ai",
					updatedBy: "총괄관리자",
					updatedAt: "2026.10.04"
				},
				{
					key: "default_market_source",
					label: "기본 증시 데이터 소스",
					value: "REAL",
					type: "select",
					options: [{
						label: "운영 실시간 API (REAL)",
						value: "REAL"
					}, {
						label: "개발 시뮬레이션 (MOCK)",
						value: "MOCK"
					}],
					description: "서버 시세 수신 파이프라인의 기본 데이터 소스 모드",
					category: "market",
					updatedBy: "총괄관리자",
					updatedAt: "2026.10.04"
				}
			];
			localStorage.setItem(ADMIN_SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
			return defaultSettings;
		}
		try {
			return JSON.parse(raw);
		} catch {
			return [];
		}
	},
	updateSetting(key, value, callerRole, adminProfile) {
		if (callerRole !== "superadmin") return {
			success: false,
			message: "오직 최고 관리자(superadmin)만 시스템 설정을 변경할 수 있습니다."
		};
		const settings = this.getSettings();
		const setting = settings.find((s) => s.key === key);
		if (!setting) return {
			success: false,
			message: "설정 항목을 찾을 수 없습니다."
		};
		const beforeVal = setting.value;
		setting.value = value;
		setting.updatedBy = adminProfile?.name || "최고관리자";
		setting.updatedAt = (/* @__PURE__ */ new Date()).toLocaleDateString("ko-KR");
		localStorage.setItem(ADMIN_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
		getAdminHeaders().then((headers) => {
			headers["x-admin-name"] = adminProfile?.name || "총괄관리자(임병현)";
			headers["x-admin-role"] = "superadmin";
			return fetch("/api/admin/settings", {
				method: "POST",
				headers,
				body: JSON.stringify({
					key,
					value
				})
			});
		}).catch((e) => console.warn("[adminService] updateSetting server sync notice:", e));
		this.logAction({
			adminId: adminProfile?.id || "superadmin",
			adminName: adminProfile?.name || "최고관리자",
			adminRole: "superadmin",
			action: "UPDATE_SYSTEM_SETTING",
			targetType: "setting",
			targetId: key,
			targetTitle: setting.label,
			details: `${setting.label} 변경: ${beforeVal} -> ${value}`,
			beforeData: beforeVal,
			afterData: value
		});
		return {
			success: true,
			message: `'${setting.label}' 설정이 저장되었습니다.`
		};
	}
};
//#endregion
//#region src/components/community/ReportModal.tsx
var REPORT_REASONS = [
	"스팸, 홍보성 게시글 및 불법 리딩방 광고",
	"허위사실 유포 및 시세조종·선행매매 의심",
	"욕설, 비방 및 인신공격성 발언",
	"개인정보 노출 및 사생활 침해",
	"음란물 또는 부적절한 콘텐츠",
	"기타 서비스 이용 규정 위반"
];
var ReportModal = ({ isOpen, onClose, targetType, targetId, postId, targetTitle, targetContent, targetAuthorName }) => {
	const { user, showToast } = useApp();
	const [selectedReason, setSelectedReason] = (0, import_react.useState)(REPORT_REASONS[0]);
	const [customDetail, setCustomDetail] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	if (!isOpen) return null;
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!user) {
			showToast("로그인 후 신고 접수가 가능합니다.", "warning");
			return;
		}
		setIsSubmitting(true);
		const finalReason = customDetail.trim() ? `[${selectedReason}] ${customDetail.trim()}` : selectedReason;
		try {
			const reportPayload = {
				reporterId: user.id,
				reporterName: user.name,
				targetType,
				targetId,
				postId: postId || (targetType === "post" ? targetId : ""),
				targetTitle: targetTitle || (targetType === "chat" ? "채팅 메시지" : targetType === "post" ? "게시글" : "댓글"),
				targetContent: targetContent.slice(0, 300),
				targetAuthorName,
				reason: finalReason
			};
			adminService.createReport({
				type: targetType,
				targetId,
				targetTitle: targetTitle || (targetContent ? targetContent.slice(0, 30) : "신고 항목"),
				targetContent: targetContent.slice(0, 300),
				targetAuthorName,
				reportedBy: user.name,
				reporterId: user.id,
				reason: finalReason
			});
			await firebaseRepository.createReport(reportPayload);
			storageService.reportItem(reportPayload);
			showToast("신고가 정상 접수되었습니다. 관리자 검토 후 신속히 조치하겠습니다.", "info");
			onClose();
		} catch (err) {
			console.warn("Report submit error:", err);
			showToast("신고 접수 중 문제가 발생했습니다.", "error");
		} finally {
			setIsSubmitting(false);
		}
	};
	const getReportTitle = () => {
		switch (targetType) {
			case "post": return "게시글 신고";
			case "comment": return "댓글 신고";
			case "chat": return "채팅 메시지 신고";
			case "user": return "사용자 신고";
			default: return "신고 접수";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-2 rounded-xl bg-rose-500/10 text-rose-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-base text-slate-900 dark:text-white",
							children: getReportTitle()
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-slate-400",
							children: ["작성자: ", targetAuthorName]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 italic line-clamp-2",
					children: [
						"\"",
						targetContent,
						"\""
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2",
							children: "신고 사유 선택"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1.5 max-h-48 overflow-y-auto pr-1",
							children: REPORT_REASONS.map((reason) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: `flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${selectedReason === reason ? "border-rose-500/50 bg-rose-50/50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold" : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "radio",
									name: "reportReason",
									value: reason,
									checked: selectedReason === reason,
									onChange: () => setSelectedReason(reason),
									className: "text-rose-600 focus:ring-rose-500"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: reason })]
							}, reason))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
							children: "추가 설명 (선택)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 2,
							value: customDetail,
							onChange: (e) => setCustomDetail(e.target.value),
							placeholder: "구체적인 위반 사항이나 증거가 있다면 적어주세요.",
							className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 resize-none"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onClose,
								className: "flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
								children: "취소"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: isSubmitting,
								className: "flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50",
								children: isSubmitting ? "접수 중..." : "신고 접수하기"
							})]
						})
					]
				})
			]
		})
	});
};
//#endregion
//#region src/components/chat/SideChatToolbar.tsx
var EMOJI_PACK = [
	"🚀",
	"📈",
	"🔥",
	"💰",
	"💎🙌",
	"🐂",
	"🔥상한가",
	"💸수익",
	"📉",
	"🐻",
	"🥶",
	"😱",
	"☕",
	"👀",
	"👍",
	"🙏",
	"🎉"
];
var SideChatToolbar = ({ onInsertText, onImageUploaded, disabled = false }) => {
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [isUploading, setIsUploading] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	const handleFileChange = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 20971520) {
			alert("이미지 용량은 20MB 이하만 업로드 가능합니다.");
			return;
		}
		await uploadImageFile(file);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};
	const uploadImageFile = async (file) => {
		setIsUploading(true);
		try {
			const formData = new FormData();
			formData.append("image", file);
			const uid = sessionStorage.getItem("bd_user_uid") || "anonymous";
			formData.append("uid", uid);
			const res = await fetch("/api/chat/upload", {
				method: "POST",
				body: formData
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "이미지 업로드에 실패했습니다.");
			onImageUploaded(data.url);
		} catch (err) {
			console.warn("[SideChatToolbar] Upload error:", err);
			alert(err.message || "이미지 업로드 중 오류가 발생했습니다.");
		} finally {
			setIsUploading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex items-center gap-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						if (!disabled) setIsOpen(!isOpen);
					},
					disabled,
					className: "p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-30",
					title: "이모티콘 & 주식 짤 선택",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smile, { className: "w-4 h-4 text-amber-500" })
				}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute bottom-full right-0 mb-2 w-64 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-3 z-50 space-y-2 animate-in fade-in zoom-in-95 duration-150",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-bold text-slate-900 dark:text-white",
							children: "증시 이모티콘 팩"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setIsOpen(false),
							className: "p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3 h-3" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-4 gap-1.5 max-h-40 overflow-y-auto",
						children: EMOJI_PACK.map((emo) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								onInsertText(emo);
								setIsOpen(false);
							},
							className: "p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-500/20 text-xs sm:text-sm text-center transition-colors cursor-pointer",
							children: emo
						}, emo))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					if (!disabled && fileInputRef.current) fileInputRef.current.click();
				},
				disabled: disabled || isUploading,
				className: "p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-30 flex items-center gap-1",
				title: "이미지 또는 짤 업로드",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: `w-4 h-4 text-indigo-500 ${isUploading ? "animate-bounce" : ""}` })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileInputRef,
				type: "file",
				accept: "image/png, image/jpeg, image/gif, image/webp",
				onChange: handleFileChange,
				className: "hidden"
			})
		]
	});
};
//#endregion
//#region src/components/chat/SideChatPanel.tsx
var SideChatPanel = ({ onOpenFullChat, embedded = false }) => {
	const { user, isAuthenticated, requireAuth, showToast, isSideChatOpen, setIsSideChatOpen, toggleSideChat, unreadChatCount, setUnreadChatCount, activeTab, setActiveTab, activeRoomId, setActiveRoomId, chatMessages: messages, setChatMessages: setMessages, registerChatConsumer } = useApp();
	(0, import_react.useEffect)(() => registerChatConsumer(), [registerChatConsumer]);
	const [inputText, setInputText] = (0, import_react.useState)("");
	const [sentiment, setSentiment] = (0, import_react.useState)("neutral");
	const [isSending, setIsSending] = (0, import_react.useState)(false);
	const [sendError, setSendError] = (0, import_react.useState)(null);
	const [onlineCount, setOnlineCount] = (0, import_react.useState)(0);
	const [roomOnlineCounts, setRoomOnlineCounts] = (0, import_react.useState)({});
	const [pageLimit, setPageLimit] = (0, import_react.useState)(40);
	const [isLoadingMore, setIsLoadingMore] = (0, import_react.useState)(false);
	const [restrictedUsers, setRestrictedUsers] = (0, import_react.useState)([]);
	const [reportTarget, setReportTarget] = (0, import_react.useState)(null);
	const [showScrollBottomBtn, setShowScrollBottomBtn] = (0, import_react.useState)(false);
	const [isMobileOpen, setIsMobileOpen] = (0, import_react.useState)(false);
	const [connectionStatus, setConnectionStatus] = (0, import_react.useState)("CONNECTED");
	const [lastReceivedTime, setLastReceivedTime] = (0, import_react.useState)("");
	const messagesContainerRef = (0, import_react.useRef)(null);
	const isUserScrolledUpRef = (0, import_react.useRef)(false);
	const lastMessageCountRef = (0, import_react.useRef)(0);
	const textareaRef = (0, import_react.useRef)(null);
	const isAdmin = user?.role === "admin" || user?.role === "superadmin" || user?.role === "moderator";
	const isSuperAdminAccount = user?.id === "lr018vf8CcW5fAv707vsl77qJy53" || user?.email === "byunghyunlim92@gmail.com" || user?.role === "superadmin";
	const isUserRestricted = Boolean(user && !isSuperAdminAccount && (user.chatRestricted || restrictedUsers.includes(user.id)));
	const rooms = [
		{
			id: "domestic",
			name: "국내주식",
			desc: "코스피/코스닥 실시간 장중 토론",
			icon: "🇰🇷"
		},
		{
			id: "us",
			name: "미국주식",
			desc: "뉴욕/나스닥 실시간 시황",
			icon: "🇺🇸"
		},
		{
			id: "general",
			name: "자유토론",
			desc: "실시간 투자 잡담",
			icon: "💬"
		}
	];
	const currentRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];
	(0, import_react.useEffect)(() => {
		let clientId = "";
		try {
			clientId = sessionStorage.getItem("bd_presence_client_id") || `c-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
			sessionStorage.setItem("bd_presence_client_id", clientId);
		} catch {
			clientId = `c-${Date.now()}`;
		}
		const sendHeartbeat = async () => {
			try {
				const res = await fetch("/api/presence/heartbeat", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						clientId,
						uid: user?.id,
						roomId: activeRoomId
					})
				});
				if (res.ok) {
					const data = await res.json();
					if (typeof data.totalOnline === "number") setOnlineCount(data.totalOnline);
					if (data.roomCounts) setRoomOnlineCounts(data.roomCounts);
				}
			} catch {}
		};
		sendHeartbeat();
		const timer = setInterval(sendHeartbeat, 1e4);
		return () => clearInterval(timer);
	}, [user?.id, activeRoomId]);
	(0, import_react.useEffect)(() => {
		if (!isAuthenticated) return;
		const unsub = firebaseRepository.subscribeChatRestrictions((uids) => {
			setRestrictedUsers(uids);
		});
		return () => unsub();
	}, [isAuthenticated]);
	(0, import_react.useEffect)(() => {
		if (!isSideChatOpen && activeTab !== "chat") {
			if (messages.length > lastMessageCountRef.current) {
				const diff = messages.length - lastMessageCountRef.current;
				setUnreadChatCount((prev) => prev + diff);
			}
		} else setUnreadChatCount(0);
		lastMessageCountRef.current = messages.length;
		if (!isUserScrolledUpRef.current) setTimeout(() => {
			if (messagesContainerRef.current) messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
		}, 60);
	}, [
		messages,
		isSideChatOpen,
		activeTab,
		setUnreadChatCount
	]);
	(0, import_react.useEffect)(() => {
		if (isSideChatOpen) setUnreadChatCount(0);
	}, [isSideChatOpen, setUnreadChatCount]);
	const handleScroll = () => {
		const el = messagesContainerRef.current;
		if (!el) return;
		const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 70;
		isUserScrolledUpRef.current = !isNearBottom;
		setShowScrollBottomBtn(!isNearBottom);
		if (el.scrollTop === 0 && messages.length >= pageLimit && !isLoadingMore) {
			setIsLoadingMore(true);
			setPageLimit((prev) => prev + 30);
			setTimeout(() => setIsLoadingMore(false), 500);
		}
	};
	const scrollToBottom = () => {
		if (messagesContainerRef.current) {
			messagesContainerRef.current.scrollTo({
				top: messagesContainerRef.current.scrollHeight,
				behavior: "smooth"
			});
			isUserScrolledUpRef.current = false;
			setShowScrollBottomBtn(false);
		}
	};
	const handleSendMessage = async () => {
		const rawText = inputText.trim();
		if (!rawText) return;
		if (!user) {
			requireAuth("채팅 참여");
			return;
		}
		if (rawText.length > 500) {
			showToast("메시지는 최대 500자까지 작성할 수 있습니다.", "warning");
			return;
		}
		if (isUserRestricted) {
			showToast("현재 계정은 관리자 조치에 의해 채팅 이용이 제한되어 발언할 수 없습니다.", "error");
			return;
		}
		const spamCheck = checkSpamViolation(user.id, rawText);
		if (spamCheck.isSpam) {
			if (spamCheck.reason === "duplicate") showToast("동일한 메시지를 반복 전송할 수 없습니다. (도배 방지)", "warning");
			else showToast("메시지를 너무 빠르게 전송하고 있습니다. 잠시 후 다시 시도해 주세요.", "warning");
			return;
		}
		const { cleanText, hasProfanity } = filterProfanity(rawText);
		if (hasProfanity) showToast("금칙어 또는 시세조종 관련 단어가 감지되어 필터링되었습니다.", "info");
		setIsSending(true);
		setSendError(null);
		const now = /* @__PURE__ */ new Date();
		const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
		const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
		const newMsgPayload = {
			id: messageId,
			roomId: activeRoomId,
			author: {
				id: user.id,
				name: user.name,
				avatar: user.avatar,
				role: user.role === "admin" || user.role === "superadmin" ? "총괄운영자" : user.tier
			},
			message: cleanText,
			timestamp: timeStr,
			sentiment
		};
		try {
			const sent = storageService.sendChatMessage(newMsgPayload);
			setMessages((prev) => {
				if (prev.some((m) => m.id === sent.id)) return prev;
				return [...prev, sent];
			});
			setInputText("");
			isUserScrolledUpRef.current = false;
			scrollToBottom();
			await firebaseRepository.sendChatMessage(newMsgPayload, messageId);
		} catch (err) {
			console.error("Failed to send chat message:", err);
			setSendError("메시지 전송에 실패했습니다. 다시 시도해 주세요.");
			showToast("채팅 메시지 전송 실패. 네트워크 연결을 확인하세요.", "error");
		} finally {
			setIsSending(false);
		}
	};
	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};
	const handleDeleteMessage = async (msgId) => {
		if (!isAdmin) return;
		try {
			await adminService.deleteChatMessage(msgId, activeRoomId, user ? {
				id: user.id,
				name: user.name,
				role: user.role
			} : void 0);
			setMessages((prev) => prev.filter((m) => m.id !== msgId));
			showToast("관리자 권한으로 메시지를 완전히 삭제했습니다.", "info");
		} catch (err) {
			showToast(`삭제 실패: ${err.message}`, "error");
		}
	};
	const handleRestrictUser = async (targetUserId, targetUserName) => {
		if (!isAdmin) return;
		try {
			const res = await adminService.muteUser(targetUserId, "운영자 실시간 조치", user ? {
				id: user.id,
				name: user.name,
				role: user.role
			} : void 0);
			showToast(res.message, res.success ? "warning" : "error");
		} catch (err) {
			showToast(`채팅 제한 실패: ${err.message}`, "error");
		}
	};
	const getRoleBadge = (role) => {
		if (role === "총괄운영자" || role === "admin" || role === "superadmin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[9px] font-bold px-1 py-0.2 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20",
			children: "운영자"
		});
		return null;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			"aria-label": "실시간 채팅 사이드바",
			className: `${embedded ? "w-full h-full" : "hidden lg:flex flex-col fixed top-[88px] right-0 bottom-0 z-30 w-[340px] xl:w-[360px]"} bg-white dark:bg-[#131722] border-l border-slate-200 dark:border-slate-800 transition-all duration-200 ease-in-out shadow-lg ${!embedded && !isSideChatOpen ? "w-12" : ""}`,
			children: [!isSideChatOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex flex-col items-center justify-between py-4 select-none",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: toggleSideChat,
						className: "p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer relative",
						title: "실시간 채팅 펼치기",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-5 h-5 text-rose-500" }), unreadChatCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center animate-pulse",
							children: unreadChatCount > 99 ? "99+" : unreadChatCount
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: toggleSideChat,
						className: "cursor-pointer py-6 flex flex-col items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-500 transition-colors",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-4 h-4 text-rose-500" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "[writing-mode:vertical-lr] tracking-widest text-[11px] font-black",
								children: "실시간 채팅"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] font-mono text-emerald-500",
								children: [onlineCount, "명"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: toggleSideChat,
						className: "p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
						title: "실시간 채팅 펼치기",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4 h-4" })
					})
				]
			}), isSideChatOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex flex-col h-full overflow-hidden min-h-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/60 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-1.5 rounded-lg bg-rose-500/10 text-rose-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-4 h-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-xs sm:text-sm text-slate-900 dark:text-white",
										children: "실시간 채팅"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }), onlineCount > 0 ? `${onlineCount}명 접속` : "연결 중"]
									}),
									connectionStatus === "RECONNECTING" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] font-bold px-1 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse",
										children: "재연결 중..."
									}) : lastReceivedTime ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] font-mono text-slate-400 hidden xl:inline",
										title: "마지막 정상 수신 시각",
										children: lastReceivedTime
									}) : null
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] text-slate-400 truncate max-w-[170px]",
								children: [
									currentRoom.name,
									" · ",
									currentRoom.desc
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [onOpenFullChat ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: onOpenFullChat,
								className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
								title: "전체 화면 채팅으로 이동",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "w-3.5 h-3.5" })
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveTab("chat"),
								className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
								title: "채팅 전용 화면",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "w-3.5 h-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: toggleSideChat,
								className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
								title: "패널 접기",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4 text-slate-400" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center px-3 py-1.5 bg-white dark:bg-[#131722] border-b border-slate-100 dark:border-slate-800/80 gap-1 overflow-x-auto scrollbar-none text-[11px] font-bold shrink-0",
						children: rooms.map((room) => {
							const isActive = room.id === activeRoomId;
							const rCount = roomOnlineCounts[room.id] || 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveRoomId(room.id),
								className: `px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer ${isActive ? "bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: room.icon }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: room.name }),
									rCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] font-mono opacity-70",
										children: rCount
									})
								]
							}, room.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: messagesContainerRef,
						onScroll: handleScroll,
						className: "flex-1 min-h-0 overflow-y-auto p-3 space-y-3 text-xs divide-y divide-slate-100/60 dark:divide-slate-800/40 relative",
						children: [isLoadingMore && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center py-1 text-[11px] text-slate-400 flex items-center justify-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3 h-3 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "이전 대화 불러오는 중..." })]
						}), messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-8 h-8 text-slate-300 dark:text-slate-600" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-xs text-slate-500 dark:text-slate-400",
									children: "아직 등록된 메시지가 없습니다."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-slate-400 leading-relaxed",
									children: "첫 번째 메시지를 남겨 다른 주주들과 실시간 토론을 시작해 보세요!"
								})
							]
						}) : (() => {
							const uniqueMessages = dedupeById(messages);
							const groupMap = /* @__PURE__ */ new Map();
							uniqueMessages.forEach((msg) => {
								const rawTime = msg.createdAt || msg.timestamp;
								const dateKey = getKstDateKey(rawTime);
								const dividerLabel = formatChatDividerDate(rawTime);
								const existingGroup = groupMap.get(dateKey);
								if (!existingGroup) groupMap.set(dateKey, {
									dateKey,
									dividerLabel,
									items: [msg]
								});
								else existingGroup.items.push(msg);
							});
							return Array.from(groupMap.values()).map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-center my-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-slate-200 dark:bg-slate-800 flex-1" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-2.5 py-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200/80 dark:border-slate-700/60 shadow-2xs",
											children: group.dividerLabel
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-slate-200 dark:bg-slate-800 flex-1" })
									]
								}), group.items.map((msg, idx) => {
									const isMine = user && msg.author?.id === user.id;
									const isRestricted = restrictedUsers.includes(msg.author?.id);
									const msgTime = formatChatTime(msg.createdAt || msg.timestamp);
									const exactTooltip = formatChatExactDateTime(msg.createdAt || msg.timestamp);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2 first:pt-0 group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 -mx-2 px-2 rounded-xl transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5 min-w-0",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: msg.author?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
														alt: msg.author?.name || "User",
														className: "w-5 h-5 rounded-full object-cover shrink-0"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `font-bold truncate text-[11px] ${isMine ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-slate-200"}`,
														children: msg.author?.name || "익명 투자자"
													}),
													getRoleBadge(msg.author?.role),
													msg.sentiment === "bull" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center text-[9px] text-rose-500 font-bold px-1 rounded bg-rose-500/10",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-2.5 h-2.5 mr-0.5" }), " 상승"]
													}),
													msg.sentiment === "bear" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center text-[9px] text-blue-500 font-bold px-1 rounded bg-blue-500/10",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-2.5 h-2.5 mr-0.5" }), " 하락"]
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1 shrink-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[9px] font-mono text-slate-400 cursor-help",
													title: exactTooltip,
													children: msgTime
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "hidden group-hover:flex items-center gap-0.5",
													children: [isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => handleDeleteMessage(msg.id),
														className: "p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors",
														title: "메시지 삭제",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3 h-3" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => handleRestrictUser(msg.author.id, msg.author.name),
														className: "p-1 rounded text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 transition-colors",
														title: "작성자 채팅 제한",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "w-3 h-3" })
													})] }), !isMine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => setReportTarget({
															id: msg.id,
															content: msg.message,
															authorName: msg.author.name
														}),
														className: "p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
														title: "신고",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "w-3 h-3" })
													})]
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 pl-6",
											children: isRestricted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[11px] text-slate-400 italic bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-lg",
												children: "운영 정책에 따라 차단된 회원의 메시지입니다."
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[12px] text-slate-800 dark:text-slate-200 leading-relaxed break-words whitespace-pre-wrap",
													children: msg.message
												}), msg.imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: msg.imageUrl,
													alt: "채팅 이미지",
													onError: (e) => {
														e.currentTarget.style.display = "none";
													},
													className: "max-w-[200px] max-h-[160px] rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
												})]
											})
										})]
									}, msg.id || idx);
								})]
							}, group.dateKey));
						})()]
					}),
					showScrollBottomBtn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: scrollToBottom,
						className: "absolute bottom-36 right-4 z-20 p-2 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md hover:scale-105 transition-all text-xs flex items-center gap-1 cursor-pointer",
						title: "최신 메시지로 이동",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-bold",
							children: "최신"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 shrink-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-1.5 text-[10px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-400 font-semibold",
											children: "의견:"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setSentiment((s) => s === "bull" ? "neutral" : "bull"),
											className: `px-1.5 py-0.5 rounded font-bold transition-colors cursor-pointer ${sentiment === "bull" ? "bg-rose-500 text-white shadow-xs" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`,
											children: "📈 상승"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setSentiment((s) => s === "bear" ? "neutral" : "bear"),
											className: `px-1.5 py-0.5 rounded font-bold transition-colors cursor-pointer ${sentiment === "bear" ? "bg-blue-500 text-white shadow-xs" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`,
											children: "📉 하락"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideChatToolbar, {
									onInsertText: (emoji) => setInputText((prev) => prev + emoji),
									onImageUploaded: (url) => {
										if (!user) return;
										const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
										const imageMsgPayload = {
											id: messageId,
											roomId: activeRoomId,
											author: {
												id: user.id,
												name: user.name,
												avatar: user.avatar,
												role: user.role === "admin" ? "총괄운영자" : user.tier
											},
											message: "",
											imageUrl: url,
											timestamp: (/* @__PURE__ */ new Date()).toTimeString().slice(0, 8),
											sentiment
										};
										const sent = storageService.sendChatMessage(imageMsgPayload);
										setMessages((prev) => dedupeById([...prev, sent]));
										firebaseRepository.sendChatMessage(imageMsgPayload, messageId).catch(() => {});
									}
								})]
							}),
							user ? !isAdmin && !isSuperAdminAccount && (user.chatRestricted || restrictedUsers.includes(user.id)) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center flex items-center justify-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "w-4 h-4 text-amber-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-bold text-amber-600 dark:text-amber-400",
									children: "현재 계정은 관리자에 의해 채팅 발언이 제한된 상태입니다."
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									ref: textareaRef,
									rows: 2,
									value: inputText,
									onChange: (e) => setInputText(e.target.value),
									onKeyDown: handleKeyDown,
									onPaste: async (e) => {
										if (!user) return;
										const items = e.clipboardData?.items;
										if (!items) return;
										for (let i = 0; i < items.length; i++) if (items[i].type.indexOf("image") !== -1) {
											const file = items[i].getAsFile();
											if (file) {
												e.preventDefault();
												const formData = new FormData();
												formData.append("image", file);
												formData.append("uid", user.id);
												const res = await fetch("/api/chat/upload", {
													method: "POST",
													body: formData
												});
												const data = await res.json();
												if (res.ok && data.url) {
													const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
													const imageMsgPayload = {
														id: messageId,
														roomId: activeRoomId,
														author: {
															id: user.id,
															name: user.name,
															avatar: user.avatar,
															role: user.role === "admin" ? "총괄운영자" : user.tier
														},
														message: "",
														imageUrl: data.url,
														timestamp: (/* @__PURE__ */ new Date()).toTimeString().slice(0, 8),
														sentiment
													};
													const sent = storageService.sendChatMessage(imageMsgPayload);
													setMessages((prev) => dedupeById([...prev, sent]));
													firebaseRepository.sendChatMessage(imageMsgPayload, messageId).catch(() => {});
												}
											}
										}
									},
									disabled: isSending,
									placeholder: "실시간 증시 의견, 짤, 이모티콘 입력 (Ctrl+V 이미지 붙여넣기 지원)",
									className: "w-full pl-3 pr-10 py-2 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 resize-none"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: handleSendMessage,
									disabled: !inputText.trim() || isSending,
									className: "absolute right-2 bottom-2.5 p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer",
									title: "전송",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-3.5 h-3.5" })
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => requireAuth("채팅 메시지 작성"),
								className: "p-3 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-xl text-center cursor-pointer hover:border-rose-500 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "로그인 후 실시간 채팅에 참여하세요" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-slate-400 mt-0.5",
									children: "비로그인 상태에서는 실시간 채팅 읽기만 가능합니다"
								})]
							}),
							sendError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1.5 flex items-center justify-between text-[10px] text-rose-500 font-bold bg-rose-500/10 px-2 py-1 rounded-lg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: sendError }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleSendMessage,
									className: "underline hover:text-rose-600 ml-1 cursor-pointer",
									children: "재시도"
								})]
							})
						]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:hidden",
			children: [!isMobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setIsMobileOpen(true),
				className: "fixed right-4 bottom-20 z-40 p-3 rounded-full bg-rose-600 text-white shadow-xl hover:bg-rose-500 active:scale-95 transition-all flex items-center justify-center cursor-pointer",
				"aria-label": "실시간 채팅 열기",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-5 h-5" }), unreadChatCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white dark:border-slate-900",
					children: unreadChatCount > 99 ? "99+" : unreadChatCount
				})]
			}), isMobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 flex flex-col bg-white dark:bg-[#0c0f17] animate-in slide-in-from-bottom duration-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-5 h-5 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-black text-sm text-slate-900 dark:text-white flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "실시간 채팅" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-mono font-bold text-emerald-500 px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20",
									children: [onlineCount, "명 접속"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[10px] text-slate-400",
								children: [currentRoom.name, " 토론"]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setIsMobileOpen(false);
									setActiveTab("chat");
								},
								className: "px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
								children: "전체화면"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setIsMobileOpen(false),
								className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center px-4 py-2 bg-slate-100 dark:bg-[#131722] gap-1.5 overflow-x-auto text-xs font-bold",
						children: rooms.map((room) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveRoomId(room.id),
							className: `px-3 py-1.5 rounded-xl shrink-0 transition-colors ${room.id === activeRoomId ? "bg-rose-600 text-white font-bold" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`,
							children: [
								room.icon,
								" ",
								room.name
							]
						}, room.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 overflow-y-auto p-4 space-y-3",
						children: dedupeById(messages).map((msg, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-[11px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-900 dark:text-white",
										children: msg.author?.name || "익명"
									}), getRoleBadge(msg.author?.role)]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-slate-400 font-mono",
									children: msg.timestamp
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl break-words",
								children: msg.message
							})]
						}, msg.id || idx))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900",
						children: user ? !isAdmin && !isSuperAdminAccount && (user.chatRestricted || restrictedUsers.includes(user.id)) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-2.5 px-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center flex items-center justify-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "채팅 이용이 제한된 계정입니다." })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: inputText,
								onChange: (e) => setInputText(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter") handleSendMessage();
								},
								placeholder: "실시간 메시지 입력...",
								className: "flex-1 px-3 py-2 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleSendMessage,
								disabled: !inputText.trim() || isSending,
								className: "px-3 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold disabled:opacity-40",
								children: "전송"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setIsMobileOpen(false);
								requireAuth("채팅 참여");
							},
							className: "w-full py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold text-center",
							children: "로그인하고 채팅 참여하기"
						})
					})
				]
			})]
		}),
		reportTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportModal, {
			isOpen: true,
			targetId: reportTarget.id,
			targetType: "chat",
			targetTitle: "실시간 채팅 메시지",
			targetContent: reportTarget.content,
			targetAuthorName: reportTarget.authorName,
			onClose: () => setReportTarget(null)
		})
	] });
};
//#endregion
//#region src/components/layout/RightSidebar.tsx
var RightSidebar = ({ onOpenFullChat }) => {
	const { unreadChatCount, setActiveTab } = useApp();
	const [rightPanelTab, setRightPanelTab] = (0, import_react.useState)("WATCHLIST");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col h-full bg-finance-card text-finance-text overflow-hidden select-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-finance-border bg-finance-sub-bg/50 px-2 py-1.5 shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setRightPanelTab("WATCHLIST"),
					className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${rightPanelTab === "WATCHLIST" ? "bg-finance-card text-finance-accent shadow-xs border border-finance-border" : "text-finance-sub-text hover:text-finance-text"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "w-3.5 h-3.5 text-finance-accent fill-finance-accent/20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "관심종목" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setRightPanelTab("CHAT"),
					className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${rightPanelTab === "CHAT" ? "bg-finance-card text-finance-accent shadow-xs border border-finance-border" : "text-finance-sub-text hover:text-finance-text"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-3.5 h-3.5 text-finance-accent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "실시간 톡" }),
						unreadChatCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-finance-up absolute -top-0.5 -right-0.5 animate-pulse" })
					]
				})]
			}), rightPanelTab === "CHAT" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onOpenFullChat ? onOpenFullChat() : setActiveTab("chat"),
				className: "p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer",
				title: "전체 채팅 화면으로 이동",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "w-3.5 h-3.5" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 overflow-hidden",
			children: rightPanelTab === "WATCHLIST" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarStockList, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideChatPanel, {
				embedded: true,
				onOpenFullChat: onOpenFullChat || (() => setActiveTab("chat"))
			})
		})]
	});
};
//#endregion
//#region src/App.tsx
var lazyWithRetry = (factory) => (0, import_react.lazy)(async () => {
	try {
		return await factory();
	} catch (err) {
		console.warn("[LazyLoader] Dynamic import failed, retrying after short backoff...", err);
		await new Promise((res) => setTimeout(res, 400));
		return await factory();
	}
});
var StockDetailView = lazyWithRetry(() => __vitePreload(() => import("./StockDetailView-D1ln9Gey.js").then((m) => ({ default: m.StockDetailView })), __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17])));
var HomeView = lazyWithRetry(() => __vitePreload(() => import("./HomeView-Wmkk40V9.js").then((m) => ({ default: m.HomeView })), __vite__mapDeps([18,1,2,3,5,6,4,7,8,14,19,16,10,11,20])));
var StockListView = lazyWithRetry(() => __vitePreload(() => import("./StockListView-DMCXclfE.js").then((m) => ({ default: m.StockListView })), __vite__mapDeps([21,1,2,3,4,5,6,7,8,10,20,13,14,15,16])));
var WatchlistView = lazyWithRetry(() => __vitePreload(() => import("./WatchlistView-M-timspJ.js").then((m) => ({ default: m.WatchlistView })), __vite__mapDeps([22,1,2,3,4,5,6,7,8,23,17])));
var CommunityView = lazyWithRetry(() => __vitePreload(() => import("./CommunityView-BI9DxwYb.js").then((m) => ({ default: m.CommunityView })), __vite__mapDeps([24,1,2,3,4,5,6,7,8,14,15,25])));
var PostDetailView = lazyWithRetry(() => __vitePreload(() => import("./PostDetailView-x4AhyEP0.js").then((m) => ({ default: m.PostDetailView })), __vite__mapDeps([25,1,2,3,4,5,6,7,8,15])));
var ChatView = lazyWithRetry(() => __vitePreload(() => import("./ChatView-BODKkNNU.js").then((m) => ({ default: m.ChatView })), __vite__mapDeps([26,1,2,3,5,6,4,7,8])));
var AlertsView = lazyWithRetry(() => __vitePreload(() => import("./AlertsView-BRKgwEgN.js").then((m) => ({ default: m.AlertsView })), __vite__mapDeps([27,1,2,3,4,5,6,7,8,9,23])));
var StockInsightView = lazyWithRetry(() => __vitePreload(() => import("./StockInsightView-4MVvR8_s.js").then((m) => ({ default: m.StockInsightView })), __vite__mapDeps([28,1,2,3,4,5,6,7,8,19,11,29])));
var ProfileView = lazyWithRetry(() => __vitePreload(() => import("./ProfileView-Cjz6aWyj.js").then((m) => ({ default: m.ProfileView })), __vite__mapDeps([30,1,2,3,4,5,6,7,8,31,29])));
var AdminView = lazyWithRetry(() => __vitePreload(() => import("./AdminView-COJtbT4u.js").then((m) => ({ default: m.AdminView })), __vite__mapDeps([32,1,2,3,5,6,4,7,8,33])));
var NewsView = lazyWithRetry(() => __vitePreload(() => import("./NewsView-D1ftdGGg.js").then((m) => ({ default: m.NewsView })), __vite__mapDeps([34,1,2,3,16])));
var StockRankingView = lazyWithRetry(() => __vitePreload(() => import("./StockRankingView-CoPE3c0f.js").then((m) => ({ default: m.StockRankingView })), __vite__mapDeps([35,1,2,3,4,5,6,7,8])));
var IndexDetailView = lazyWithRetry(() => __vitePreload(() => import("./IndexDetailView-B4n8pc4u.js").then((m) => ({ default: m.IndexDetailView })), __vite__mapDeps([36,1,2,3,4,5,6,7,8])));
var PortfolioView = lazyWithRetry(() => __vitePreload(() => import("./PortfolioView-Byc0P3GE.js").then((m) => ({ default: m.PortfolioView })), __vite__mapDeps([37,1,2,3,4,5,6,7,8,12,38])));
var StockComparisonView = lazyWithRetry(() => __vitePreload(() => import("./StockComparisonView-CexNNUyq.js").then((m) => ({ default: m.StockComparisonView })), __vite__mapDeps([39,1,2,3,4,5,6,7,8])));
var CalendarView = lazyWithRetry(() => __vitePreload(() => import("./CalendarView-CKU4TIIN.js").then((m) => ({ default: m.CalendarView })), __vite__mapDeps([40,1,2,3,4,5,6,7,8])));
var InquiryPage = lazyWithRetry(() => __vitePreload(() => import("./InquiryPage-Ce1f9xdM.js").then((m) => ({ default: m.InquiryPage })), __vite__mapDeps([41,1,2,3,4,5,6,7,8,31])));
var MiniGames = lazyWithRetry(() => __vitePreload(() => import("./MiniGames-DzF_aUUp.js").then((m) => ({ default: m.MiniGames || m.default })), __vite__mapDeps([42,1,2,3,4,5,6,7,8])));
var StaticPageView = lazyWithRetry(() => __vitePreload(() => import("./StaticPageView-UVQhun44.js").then((m) => ({ default: m.StaticPageView })), __vite__mapDeps([43,1,2,3])));
var PublicInsightsView = lazyWithRetry(() => __vitePreload(() => import("./PublicInsightsView-BTeI8eyQ.js").then((m) => ({ default: m.PublicInsightsView })), __vite__mapDeps([44,1,2,3,33,6,5])));
var ViewLoader = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "min-h-[400px] flex items-center justify-center",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-8 h-8 border-4 border-rose-500/30 border-t-rose-600 rounded-full animate-spin" })
});
var LoggedView = ({ Component, props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, { ...props });
var MainLayout = () => {
	const { activeTab, selectedSymbol, selectedIndexSymbol, selectedPostId, setActiveTab, user, isAuthenticated, showToast, isSideChatOpen, isAuthLoading, stocks, watchlist, navigateToStock, publicRoute, navigateToStaticPage, navigateToInsights, clearPublicRoute } = useApp();
	useWatchlistPriceMonitor({
		watchlist,
		stocks,
		userId: user?.id,
		onNavigateStock: navigateToStock
	});
	(0, import_react.useEffect)(() => {
		__vitePreload(async () => {
			const { App } = await import("./esm-Ckt4DfsE.js");
			return { App };
		}, __vite__mapDeps([45,7,8])).then(({ App }) => {
			App.addListener("backButton", ({ canGoBack }) => {
				if (!canGoBack) App.exitApp();
				else window.history.back();
			});
		});
		__vitePreload(async () => {
			const { adMobService } = await import("./adMobService-B3mU9wZJ.js");
			return { adMobService };
		}, __vite__mapDeps([46,7,8])).then(({ adMobService }) => {
			adMobService.initialize().then(() => {
				adMobService.showBanner(60);
			}).catch((err) => console.warn("[AdMob] Init warning:", err));
		});
		return () => {
			__vitePreload(async () => {
				const { adMobService } = await import("./adMobService-B3mU9wZJ.js");
				return { adMobService };
			}, __vite__mapDeps([46,7,8])).then(({ adMobService }) => {
				adMobService.hideBanner();
			});
		};
	}, []);
	(0, import_react.useEffect)(() => {
		__vitePreload(async () => {
			const { adMobService } = await import("./adMobService-B3mU9wZJ.js");
			return { adMobService };
		}, __vite__mapDeps([46,7,8])).then(({ adMobService }) => {
			if (activeTab === "home" || activeTab === "stocks") adMobService.showBanner(60);
			else adMobService.hideBanner();
		});
	}, [activeTab, selectedSymbol]);
	(0, import_react.useEffect)(() => {
		if (isSideChatOpen) {
			__vitePreload(() => import("./StockDetailView-D1ln9Gey.js"), __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]));
			__vitePreload(() => import("./CommunityView-BI9DxwYb.js"), __vite__mapDeps([24,1,2,3,4,5,6,7,8,14,15,25]));
			__vitePreload(() => import("./StockListView-DMCXclfE.js"), __vite__mapDeps([21,1,2,3,4,5,6,7,8,10,20,13,14,15,16]));
		}
	}, [isSideChatOpen]);
	if (isAuthLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0c0f17]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-10 border-4 border-purple-500/30 border-t-purple-600 rounded-full animate-spin" })
	});
	if (activeTab === "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminGuard, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminView, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchModal, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthModal, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastContainer, {})
	] });
	const renderActiveView = () => {
		if (publicRoute?.type === "static") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewLoader, {}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaticPageView, {
				page: publicRoute.staticPage || "about",
				onNavigateHome: clearPublicRoute,
				onNavigatePage: navigateToStaticPage
			})
		});
		if (publicRoute?.type === "insights") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewLoader, {}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicInsightsView, {
				initialCategory: publicRoute.insightCategory,
				initialInsightId: publicRoute.insightArticleId,
				onNavigateHome: clearPublicRoute,
				onSelectCategory: (cat) => navigateToInsights(cat),
				onSelectArticle: (id) => navigateToInsights(publicRoute.insightCategory, id)
			})
		});
		let Component;
		let componentKey = "home";
		if (selectedIndexSymbol) {
			Component = IndexDetailView;
			componentKey = "IndexDetailView";
		} else if (activeTab === "stocks" && selectedSymbol) {
			Component = StockDetailView;
			componentKey = "StockDetailView";
		} else if (activeTab === "community" && selectedPostId) {
			Component = PostDetailView;
			componentKey = "PostDetailView";
		} else {
			Component = {
				home: HomeView,
				stocks: StockListView,
				compare: StockComparisonView,
				ranking: StockRankingView,
				insight: StockInsightView,
				watchlist: WatchlistView,
				calendar: CalendarView,
				portfolio: PortfolioView,
				community: CommunityView,
				chat: ChatView,
				alerts: AlertsView,
				inquiry: InquiryPage,
				news: NewsView,
				profile: ProfileView,
				games: MiniGames
			}[activeTab] || HomeView;
			componentKey = activeTab || "home";
		}
		const getProps = () => {
			if (selectedIndexSymbol) return { symbol: selectedIndexSymbol };
			if (activeTab === "stocks" && selectedSymbol) return { symbol: selectedSymbol };
			if (activeTab === "community" && selectedPostId) return { postId: selectedPostId };
			return {};
		};
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewLoader, {}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoggedView, {
				Component,
				name: componentKey,
				props: getProps()
			})
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "h-[100dvh] flex flex-col bg-finance-bg text-finance-text font-sans transition-colors duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex overflow-hidden pt-[64px] md:pt-[60px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden xl:flex flex-col w-64 border-r border-finance-border bg-finance-card overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeftSidebar, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
						className: "flex-1 flex flex-col min-w-0 overflow-y-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 p-2 sm:p-4 lg:p-6 pb-24 md:pb-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBoundary, {
								fallbackTitle: "화면을 불러오는 중 문제가 발생했습니다.",
								children: renderActiveView()
							}, `${publicRoute ? JSON.stringify(publicRoute) : activeTab}-${selectedSymbol || ""}-${selectedIndexSymbol || ""}-${selectedPostId || ""}`)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden 2xl:flex flex-col w-[320px] xl:w-[360px] border-l border-finance-border bg-finance-card overflow-hidden",
						children: activeTab !== "chat" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RightSidebar, { onOpenFullChat: () => setActiveTab("chat") })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileNav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchModal, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthModal, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastContainer, {})
		]
	});
};
function App() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBoundary, {
		fallbackTitle: "서비스를 초기화하는 중 문제가 발생했습니다.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MainLayout, {}) }) })
	});
}
//#endregion
//#region node_modules/@capacitor/splash-screen/dist/esm/index.js
var SplashScreen = registerPlugin("SplashScreen", { web: () => __vitePreload(() => import("./web-DZCmOce9.js").then((m) => new m.SplashScreenWeb()), __vite__mapDeps([47,7])) });
//#endregion
//#region src/main.tsx
setupApiInterceptor();
crashlyticsService.init();
SplashScreen.hide();
console.log("App starting...");
(0, import_client.createRoot)(document.getElementById("root")).render(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {}));
//#endregion
export { getUSMarketStatus as _, filterProfanity as a, userNotificationSettingsService as c, portfolioService as d, MarketBadge as f, getKRXMarketStatus as g, KstClock as h, checkSpamViolation as i, ErrorBoundary as l, globalMarketClient as m, adminService as n, browserPushNotificationService as o, PriceBadge as p, safeFetchJson as r, DEFAULT_NOTIFICATION_SETTINGS as s, ReportModal as t, MockTradeModal as u, KiwoomConfigModal as v };
