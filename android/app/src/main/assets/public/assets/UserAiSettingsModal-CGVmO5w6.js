import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { F as ShieldCheck, Ft as ExternalLink, G as RefreshCw, Gt as CircleAlert, Nt as Eye, O as Sparkles, Pt as EyeOff, Wt as CircleCheck, bn as require_react, bt as Info, ht as Lock, v as Trash2, yt as Key } from "./vendor-lucide-Dji_Ij8j.js";
import { n as useApp } from "./AppContext-Butl4QWq.js";
//#region src/services/userAiConnectionClient.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var userAiConnectionClient = {
	/**
	* Get user AI connection status
	*/
	async getConnectionStatus(uid) {
		if (!uid) return {
			connected: false,
			provider: "gemini",
			model: "gemini-3.8-flash",
			verified: false,
			officialBillingNotice: "로그인 후 개인 Google AI Studio API 키를 연결할 수 있습니다."
		};
		const res = await fetch(`/api/ai/connection/status?uid=${encodeURIComponent(uid)}`, { headers: { "x-user-uid": uid } });
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			throw new Error(err.error || "AI 연결 상태를 조회하지 못했습니다.");
		}
		return await res.json();
	},
	/**
	* Connect personal Gemini API key
	*/
	async connectKey(uid, apiKey, model = "gemini-3.8-flash") {
		const res = await fetch("/api/ai/connection/connect", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-user-uid": uid
			},
			body: JSON.stringify({
				uid,
				apiKey,
				model
			})
		});
		const data = await res.json();
		if (!res.ok) throw new Error(data.error || "개인 AI 계정 연결 및 검증에 실패했습니다.");
		return data.status;
	},
	/**
	* Disconnect personal AI key
	*/
	async disconnectKey(uid) {
		const res = await fetch("/api/ai/connection/disconnect", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-user-uid": uid
			},
			body: JSON.stringify({ uid })
		});
		const data = await res.json();
		if (!res.ok) throw new Error(data.error || "AI 연결 해제에 실패했습니다.");
		return data.status;
	}
};
//#endregion
//#region src/components/profile/UserAiSettingsModal.tsx
var import_jsx_runtime = require_jsx_runtime();
var UserAiSettingsModal = ({ isOpen, onClose }) => {
	const { user, requireAuth, showToast } = useApp();
	const [connectionStatus, setConnectionStatus] = (0, import_react.useState)(null);
	const [apiKeyInput, setApiKeyInput] = (0, import_react.useState)("");
	const [selectedModel, setSelectedModel] = (0, import_react.useState)("gemini-3.8-flash");
	const [showKeyText, setShowKeyText] = (0, import_react.useState)(false);
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [isVerifying, setIsVerifying] = (0, import_react.useState)(false);
	const [errorMsg, setErrorMsg] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (isOpen && user?.id) loadStatus();
	}, [isOpen, user?.id]);
	const loadStatus = async () => {
		if (!user?.id) return;
		setIsLoading(true);
		setErrorMsg(null);
		try {
			const status = await userAiConnectionClient.getConnectionStatus(user.id);
			setConnectionStatus(status);
			if (status.model) setSelectedModel(status.model);
		} catch (err) {
			console.warn("Failed to load AI status:", err);
			setErrorMsg(err.message || "AI 연결 상태를 불러오지 못했습니다.");
		} finally {
			setIsLoading(false);
		}
	};
	const handleConnect = async (e) => {
		e.preventDefault();
		if (!user?.id) {
			requireAuth("개인 AI 계정 연결");
			return;
		}
		const trimmed = apiKeyInput.trim();
		if (!trimmed) {
			setErrorMsg("Google Gemini API 키를 입력해주세요.");
			return;
		}
		setIsVerifying(true);
		setErrorMsg(null);
		try {
			const newStatus = await userAiConnectionClient.connectKey(user.id, trimmed, selectedModel);
			setConnectionStatus(newStatus);
			setApiKeyInput("");
			showToast("개인 Gemini AI 계정이 성공적으로 검증 및 연결되었습니다!", "success");
		} catch (err) {
			setErrorMsg(err.message || "API 키 검증에 실패했습니다. 키 권한과 활성화 상태를 확인해주세요.");
		} finally {
			setIsVerifying(false);
		}
	};
	const handleDisconnect = async () => {
		if (!user?.id) return;
		if (!window.confirm("개인 AI 연결을 해제하시겠습니까? 해제 시 서버 보안 금고에서 자격 증명이 즉시 완전 삭제되며, AI 종목 브리핑 이용이 중단됩니다.")) return;
		setIsLoading(true);
		setErrorMsg(null);
		try {
			const newStatus = await userAiConnectionClient.disconnectKey(user.id);
			setConnectionStatus(newStatus);
			showToast("개인 AI 연결이 안전하게 해제되었습니다.", "info");
		} catch (err) {
			setErrorMsg(err.message || "연결 해제 중 오류가 발생했습니다.");
		} finally {
			setIsLoading(false);
		}
	};
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2",
							children: "개인 AI 계정 연결 설정"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
							children: "개인 Google AI Studio 계정 연동 및 과금 체계 기반 AI 이용"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors",
						children: "✕"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 text-xs text-indigo-900 dark:text-indigo-200 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-bold text-indigo-700 dark:text-indigo-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-indigo-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "운영자 비용 차단 및 개인 계정 과금 정책" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] leading-relaxed text-indigo-800/90 dark:text-indigo-300/90",
						children: [
							"본 플랫폼은 투명한 AI 이용을 위해 ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "운영자 공용 API 비용을 철저히 차단" }),
							"하고, 사용자가 소유한 ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "공식 Google AI Studio 개인 계정의 쿼터 및 과금 체계" }),
							"로만 AI 브리핑을 실행합니다. 키는 서버 내 ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "AES-256-GCM 보안 금고" }),
							"에 암호화되어 보호되며 외부에 절대 노출되지 않습니다."
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-slate-500 dark:text-slate-400",
							children: "현재 연결 상태"
						}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-slate-400 flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3 h-3 animate-spin" }), " 확인 중..."]
						}) : connectionStatus?.connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5" }), "정상 연결됨 (개인 계정 과금)"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-3.5 h-3.5" }), "미연결 (AI 호출 차단 상태)"]
						})]
					}), connectionStatus?.connected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1.5 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-slate-600 dark:text-slate-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-400",
									children: "제공업체 / 모델"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono font-bold text-slate-900 dark:text-white",
									children: [
										"Google Gemini (",
										connectionStatus.model,
										")"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-slate-600 dark:text-slate-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-400",
									children: "마스킹된 키"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-bold text-purple-600 dark:text-purple-400",
									children: connectionStatus.keyMasked
								})]
							}),
							connectionStatus.connectedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-slate-600 dark:text-slate-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-400",
									children: "연결 일시"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] text-slate-500",
									children: new Date(connectionStatus.connectedAt).toLocaleString("ko-KR")
								})]
							}),
							connectionStatus.callCount !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-slate-600 dark:text-slate-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-400",
									children: "개인 계정 호출 횟수"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono font-bold text-slate-900 dark:text-white",
									children: [connectionStatus.callCount, " 회"]
								})]
							})
						]
					})]
				}),
				errorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "leading-relaxed",
						children: errorMsg
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleConnect,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
								children: "Google Gemini API 키 입력"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: showKeyText ? "text" : "password",
									value: apiKeyInput,
									onChange: (e) => setApiKeyInput(e.target.value),
									placeholder: "AIzaSy... (Google AI Studio 발급 키)",
									disabled: isVerifying,
									className: "w-full pl-3.5 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-purple-500 disabled:opacity-50"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowKeyText((prev) => !prev),
									className: "absolute right-3 top-3 text-slate-400 hover:text-slate-600",
									children: showKeyText ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-slate-400 mt-1.5 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-3 h-3 text-emerald-500 inline" }), "키는 브라우저나 Firestore에 평문 저장되지 않으며 서버 메모리 금고에만 암호화됩니다."]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
							children: "사용 모델 선택"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: selectedModel,
							onChange: (e) => setSelectedModel(e.target.value),
							className: "w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "gemini-3.8-flash",
								children: "gemini-3.8-flash (권장: 고속 종목 시황 분석)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "gemini-3.1-flash-lite",
								children: "gemini-3.1-flash-lite (초경량 초고속)"
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: isVerifying || !apiKeyInput.trim(),
								className: "flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer",
								children: isVerifying ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "공식 API 실시간 검증 중..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: connectionStatus?.connected ? "새 API 키로 교체 및 재연결" : "개인 계정 검증 및 연결" })] })
							}), connectionStatus?.connected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleDisconnect,
								disabled: isLoading || isVerifying,
								className: "py-3 px-4 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "연결 해제" })]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between font-bold text-slate-700 dark:text-slate-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-3.5 h-3.5 text-blue-500" }), "API 키 발급 방법 (Google AI Studio)"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "https://aistudio.google.com/app/apikey",
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-purple-600 hover:underline flex items-center gap-1 font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "키 발급 페이지 바로가기" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3 h-3" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "list-decimal list-inside space-y-1 text-slate-500 dark:text-slate-400 pl-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Google AI Studio에 본인의 Google 계정으로 로그인합니다." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Get API key" }), " 메뉴에서 새 프로젝트를 선택하고 API Key를 발급받습니다."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "발급된 키(AIzaSy...)를 위 입력창에 붙여넣고 검증 버튼을 누르면 연동이 완료됩니다." })
						]
					})]
				})
			]
		})
	});
};
//#endregion
export { UserAiSettingsModal as t };
