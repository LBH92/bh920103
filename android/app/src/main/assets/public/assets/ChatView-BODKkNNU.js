import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { I as ShieldAlert, K as Radio, V as Send, W as RotateCcw, Xt as Check, _n as ArrowDown, bn as require_react, d as UserX, gn as ArrowLeft, gt as LoaderCircle, h as TriangleAlert, ht as Lock, i as X, k as Smile, l as Users, mt as LogIn, o as VolumeX, ot as MessageSquare, q as Plus, qt as ChevronRight, s as Volume2, st as MessageSquarePlus, v as Trash2, xt as Image } from "./vendor-lucide-Dji_Ij8j.js";
import { d as limit, f as onSnapshot, m as query, p as orderBy, x as collection } from "./vendor-firebase-Dm4AYEor.js";
import { i as db } from "./firebase-fxPuKVc_.js";
import { A as formatChatTime, L as getKstDateKey, O as formatChatDividerDate, f as firebaseRepository, k as formatChatExactDateTime, n as useApp, p as dedupeById, u as storageService } from "./AppContext-Butl4QWq.js";
import { a as filterProfanity, i as checkSpamViolation, n as adminService, t as ReportModal } from "./index-DLz7vtf6.js";
//#region src/components/chat/CreateChatRoomModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	{
		id: "stock",
		label: "종목 주주방",
		icon: "📈"
	},
	{
		id: "theme",
		label: "테마/업종",
		icon: "⚡"
	},
	{
		id: "surge",
		label: "급등/수급",
		icon: "🔥"
	},
	{
		id: "free",
		label: "자유 토론",
		icon: "💬"
	}
];
var ICONS = [
	"📈",
	"⚡",
	"🔥",
	"🇰🇷",
	"💎",
	"🚀",
	"⭐",
	"💰",
	"🤖",
	"💬",
	"🏛️",
	"📊"
];
var CreateChatRoomModal = ({ isOpen, onClose, onCreated, availableStocks }) => {
	const { user, showToast } = useApp();
	const [name, setName] = (0, import_react.useState)("");
	const [desc, setDesc] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("stock");
	const [selectedIcon, setSelectedIcon] = (0, import_react.useState)("📈");
	const [selectedSymbol, setSelectedSymbol] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	if (!isOpen) return null;
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!name.trim()) {
			showToast("채팅방 이름을 입력해주세요.", "warning");
			return;
		}
		if (!desc.trim()) {
			showToast("채팅방 소개를 입력해주세요.", "warning");
			return;
		}
		setIsSubmitting(true);
		const matchedStock = availableStocks.find((s) => s.symbol === selectedSymbol);
		const finalName = name.trim();
		const finalDesc = desc.trim();
		const roomData = {
			id: `room-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
			name: finalName,
			desc: finalDesc,
			icon: selectedIcon,
			count: 1,
			category,
			creatorId: user?.id || "guest",
			creatorName: user?.name || "익명",
			symbol: matchedStock?.symbol,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		try {
			await firebaseRepository.createChatRoom(roomData);
			storageService.createCustomChatRoom(roomData);
			showToast(`'${finalName}' 채팅방이 개설되었습니다! 바로 입장합니다.`, "success");
			onCreated(roomData);
			onClose();
		} catch (err) {
			console.warn("Chat room creation failed:", err);
			showToast("채팅방 개설 중 오류가 발생했습니다.", "error");
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2 rounded-xl bg-rose-500/10 text-rose-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquarePlus, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-base text-slate-900 dark:text-white",
						children: "새 채팅방 만들기"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-400",
						children: "관심 종목이나 투자 주제로 실시간 주주 토론방을 개설하세요."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
						children: "채팅방 카테고리"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
						children: CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setCategory(cat.id);
								setSelectedIcon(cat.icon);
							},
							className: `flex items-center gap-1.5 p-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${category === cat.id ? "border-rose-500 bg-rose-50/60 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400" : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cat.icon }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: cat.label
							})]
						}, cat.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
						children: "대표 아이콘 선택"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1.5 flex-wrap",
						children: ICONS.map((ic) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setSelectedIcon(ic),
							className: `w-9 h-9 rounded-xl flex items-center justify-center text-lg border cursor-pointer transition-all ${selectedIcon === ic ? "border-rose-500 bg-rose-50 dark:bg-rose-500/20 shadow-xs scale-105" : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"}`,
							children: ic
						}, ic))
					})] }),
					category === "stock" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
						children: "연결 종목 선택 (선택 사항)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: selectedSymbol,
						onChange: (e) => {
							setSelectedSymbol(e.target.value);
							const s = availableStocks.find((st) => st.symbol === e.target.value);
							if (s && !name) {
								setName(`${s.name} 주주 토론방`);
								setDesc(`${s.name}(${s.symbol}) 실시간 호가 및 수급 정보 토론`);
							}
						},
						className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-rose-500",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "종목 연결 안 함 (일반 방)"
						}), availableStocks.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: s.symbol,
							children: [
								s.name,
								" (",
								s.symbol,
								") - ",
								s.market
							]
						}, s.symbol))]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
						children: "채팅방 이름 *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						required: true,
						maxLength: 40,
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "예: 삼성전자 주주 소통방, 2차전지 반등 토론",
						className: "w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 font-medium"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
						children: "채팅방 소개 및 대화 규칙 *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						required: true,
						rows: 2,
						maxLength: 120,
						value: desc,
						onChange: (e) => setDesc(e.target.value),
						placeholder: "방 참여자들에게 안내할 소개말과 대화 주제를 입력하세요.",
						className: "w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 font-medium resize-none"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							disabled: isSubmitting,
							className: "px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer",
							children: "취소"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: isSubmitting,
							className: "px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/20 cursor-pointer transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSubmitting ? "개설 중..." : "채팅방 만들기 및 입장" })]
						})]
					})
				]
			})]
		})
	});
};
//#endregion
//#region src/components/chat/ChatToolbar.tsx
var CHAT_EMOJI_CATEGORIES = [
	{
		name: "📈 투자/상승",
		emojis: [
			"🚀",
			"📈",
			"🔥",
			"💰",
			"💎🙌",
			"🐂",
			"🔥상한가",
			"💸수익",
			"🎉",
			"💯"
		]
	},
	{
		name: "📉 하락/위기",
		emojis: [
			"📉",
			"🐻",
			"🥶",
			"😱",
			"💧",
			"😭",
			"💀",
			"📉폭락",
			"⚠️",
			"🚨"
		]
	},
	{
		name: "☕ 일상/반응",
		emojis: [
			"☕",
			"👀",
			"👍",
			"🙏",
			"👏",
			"🤔",
			"😎",
			"🤣",
			"😴",
			"✨"
		]
	}
];
var ChatToolbar = ({ onInsertText, onImageUploaded, disabled = false }) => {
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
			onImageUploaded(data.url, {
				fileType: data.meta.fileType,
				fileSize: data.meta.fileSize,
				fileName: data.meta.fileName
			});
		} catch (err) {
			console.warn("[ChatToolbar] Upload error:", err);
			alert(err.message || "이미지 업로드 중 오류가 발생했습니다.");
		} finally {
			setIsUploading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex items-center gap-1.5 py-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						if (!disabled) setIsOpen(!isOpen);
					},
					disabled,
					className: "p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-40",
					title: "이모티콘 & 주식 짤 선택",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smile, { className: "w-4 h-4 text-amber-500" })
				}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute bottom-full left-0 mb-2 w-72 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-3 z-50 space-y-3 animate-in fade-in zoom-in-95 duration-150",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💬 증시 이모티콘 & 밈 팩" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setIsOpen(false),
							className: "p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2.5 max-h-56 overflow-y-auto pr-1",
						children: CHAT_EMOJI_CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-bold text-slate-400",
								children: cat.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-5 gap-1.5",
								children: cat.emojis.map((emo) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										onInsertText(emo);
										setIsOpen(false);
									},
									className: "p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-500/20 text-sm sm:text-base text-center transition-colors cursor-pointer flex items-center justify-center",
									title: emo,
									children: emo
								}, emo))
							})]
						}, cat.name))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => {
					if (!disabled && fileInputRef.current) fileInputRef.current.click();
				},
				disabled: disabled || isUploading,
				className: "p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-40 flex items-center gap-1",
				title: "이미지 또는 짤(GIF/PNG/JPG) 업로드",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: `w-4 h-4 text-indigo-500 ${isUploading ? "animate-bounce" : ""}` }), isUploading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] text-indigo-500 font-mono",
					children: "업로드중..."
				})]
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
//#region src/components/chat/AdminChatControl.tsx
var AdminChatControl = ({ roomId, roomName, count, adminUid, onClearHistory, onDeleteRoom }) => {
	const [isLoading, setIsLoading] = import_react.useState(false);
	const [showLogs, setShowLogs] = import_react.useState(false);
	const [showRestrictions, setShowRestrictions] = import_react.useState(false);
	const handleClearHistory = async () => {
		if (count === 0) {
			alert("삭제할 메시지가 없습니다.");
			return;
		}
		if (window.confirm(`'${roomName}' 채널의 모든 채팅 메시지 ${count}건을 삭제하시겠습니까?`)) {
			setIsLoading(true);
			try {
				await firebaseRepository.clearRoomChatHistory(roomId, adminUid);
				await firebaseRepository.logAdminAction(adminUid, "관리자", "채팅 삭제", `'${roomName}' 채널 메시지 ${count}건 삭제`);
				onClearHistory();
				alert("채팅 기록이 삭제되었습니다.");
			} catch (err) {
				alert(err.message || "삭제에 실패했습니다.");
			} finally {
				setIsLoading(false);
			}
		}
	};
	const handleDeleteRoom = async () => {
		if (window.confirm(`정말 '${roomName}' 채널을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
			setIsLoading(true);
			try {
				await firebaseRepository.deleteChatRoom(roomId, adminUid);
				await firebaseRepository.logAdminAction(adminUid, "관리자", "채팅방 삭제", `'${roomName}' 채널 삭제`);
				alert("채팅방이 삭제되었습니다.");
				onDeleteRoom();
			} catch (err) {
				alert(err.message || "채팅방 삭제에 실패했습니다.");
			} finally {
				setIsLoading(false);
			}
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2 p-2 rounded-xl bg-amber-500/5 border border-amber-500/20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-3 h-3" }), " 관리 기능"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleClearHistory,
						disabled: isLoading || count === 0,
						className: "px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold flex items-center gap-1 transition-colors disabled:opacity-50",
						title: "채팅방 기록 초기화",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3 h-3" }),
							" ",
							isLoading ? "처리중..." : `전체삭제 (${count})`
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleDeleteRoom,
						disabled: isLoading,
						className: "px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold flex items-center gap-1 transition-colors disabled:opacity-50",
						title: "채팅방 삭제",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3 h-3" }), " 삭제"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setShowLogs(!showLogs),
						className: "px-2 py-1 rounded-lg bg-slate-500/10 hover:bg-slate-500/20 text-slate-600 dark:text-slate-400 text-[10px] font-bold transition-colors",
						children: showLogs ? "로그 닫기" : "관리 로그"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setShowRestrictions(!showRestrictions),
						className: "px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-bold transition-colors",
						children: showRestrictions ? "제한 닫기" : "채팅 제한 관리"
					})
				]
			}),
			showLogs && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLogView, {}),
			showRestrictions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminRestrictionView, { adminUid })
		]
	});
};
var AdminLogView = () => {
	const [logs, setLogs] = import_react.useState([]);
	import_react.useEffect(() => {
		const q = query(collection(db, "adminLogs"), orderBy("timestamp", "desc"), limit(10));
		return onSnapshot(q, (snap) => {
			const data = [];
			snap.forEach((d) => data.push({
				id: d.id,
				...d.data()
			}));
			setLogs(data);
		}, (err) => {
			if (err.code !== "cancelled") console.warn("[AdminLogView] logs onSnapshot error:", err);
		});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-[10px] max-h-40 overflow-y-auto bg-white dark:bg-[#131722] p-2 rounded-lg border border-slate-200 dark:border-slate-700",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-bold text-slate-500 mb-1",
			children: "최근 관리 로그"
		}), logs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-b border-slate-100 dark:border-slate-800 py-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-bold text-slate-700 dark:text-slate-300",
					children: log.action
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-slate-500 mx-1",
					children: ["by ", log.adminName]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-slate-400",
					children: log.details
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-slate-300",
					children: new Date(log.timestamp).toLocaleString()
				})
			]
		}, log.id))]
	});
};
var AdminRestrictionView = ({ adminUid }) => {
	const [restrictedUids, setRestrictedUids] = import_react.useState([]);
	import_react.useEffect(() => {
		return firebaseRepository.subscribeChatRestrictions(setRestrictedUids);
	}, []);
	const handleUnrestrict = async (uid) => {
		if (window.confirm(`사용자 ${uid}의 채팅 제한을 해제하시겠습니까?`)) try {
			await firebaseRepository.unrestrictChatUser(uid);
			await firebaseRepository.logAdminAction(adminUid, "관리자", "채팅 제한 해제", `사용자 ${uid} 제한 해제`);
			alert("제한이 해제되었습니다.");
		} catch (err) {
			alert("해제 실패: " + err.message);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-[10px] max-h-40 overflow-y-auto bg-white dark:bg-[#131722] p-2 rounded-lg border border-slate-200 dark:border-slate-700",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-bold text-slate-500 mb-1",
				children: "채팅 제한된 사용자"
			}),
			restrictedUids.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-slate-400",
				children: "제한된 사용자가 없습니다."
			}),
			restrictedUids.map((uid) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-slate-100 dark:border-slate-800 py-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-slate-700 dark:text-slate-300 truncate",
					title: uid,
					children: uid
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => handleUnrestrict(uid),
					className: "px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 font-bold",
					children: "해제"
				})]
			}, uid))
		]
	});
};
//#endregion
//#region src/components/chat/ChatView.tsx
var ChatView = () => {
	const officialRooms = [
		{
			id: "all",
			name: "전체 채팅",
			desc: "모든 투자자가 모여 대화하는 자유 광장",
			icon: "🌐",
			count: 1840
		},
		{
			id: "domestic",
			name: "국내주식",
			desc: "한국 주식시장 종합 장중 시황 & 토론",
			icon: "🇰🇷",
			count: 960
		},
		{
			id: "kospi",
			name: "코스피",
			desc: "코스피 대형주 및 외인·기관 수급 동향",
			icon: "📈",
			count: 520
		},
		{
			id: "kosdaq",
			name: "코스닥",
			desc: "바이오·IT·2차전지 테마 성장주 토론",
			icon: "⚡",
			count: 480
		},
		{
			id: "surge",
			name: "급등주",
			desc: "당일 거래량 급증 및 상한가 급등 종목 포착",
			icon: "🔥",
			count: 830
		},
		{
			id: "watchlist",
			name: "관심종목",
			desc: "나의 관심종목 실시간 시황 및 주주 토론",
			icon: "⭐",
			count: 310
		}
	];
	const [customRooms, setCustomRooms] = (0, import_react.useState)(() => storageService.getCustomChatRooms());
	const { user, stocks, watchlist, showToast, requireAuth, isAuthenticated, setIsAuthModalOpen, activeRoomId, setActiveRoomId, chatMessages: messages, setChatMessages: setMessages, loadMoreChatMessages, chatMessageLimit } = useApp();
	const [inputText, setInputText] = (0, import_react.useState)("");
	const [sentiment, setSentiment] = (0, import_react.useState)("bull");
	const [failedMessagePayloads, setFailedMessagePayloads] = (0, import_react.useState)({});
	const [isNearBottom, setIsNearBottom] = (0, import_react.useState)(true);
	const [newUnseenCount, setNewUnseenCount] = (0, import_react.useState)(0);
	const [isFetchingOlder, setIsFetchingOlder] = (0, import_react.useState)(false);
	const scrollContainerRef = (0, import_react.useRef)(null);
	const prevScrollHeightRef = (0, import_react.useRef)(0);
	const [onlineCount, setOnlineCount] = (0, import_react.useState)(2450);
	const [roomOnlineCounts, setRoomOnlineCounts] = (0, import_react.useState)({});
	const [mobileView, setMobileView] = (0, import_react.useState)("chat");
	const [isCreateModalOpen, setIsCreateModalOpen] = (0, import_react.useState)(false);
	const [clientId] = (0, import_react.useState)(() => {
		try {
			const stored = sessionStorage.getItem("bd_presence_client_id");
			if (stored) return stored;
			const gen = `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
			sessionStorage.setItem("bd_presence_client_id", gen);
			return gen;
		} catch {
			return `c_${Date.now()}`;
		}
	});
	const [blockedUsers, setBlockedUsers] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("bd_blocked_users") || "[]");
		} catch {
			return [];
		}
	});
	const [mutedUsers, setMutedUsers] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("bd_muted_users") || "[]");
		} catch {
			return [];
		}
	});
	const [restrictedUsers, setRestrictedUsers] = (0, import_react.useState)([]);
	const [reportTarget, setReportTarget] = (0, import_react.useState)(null);
	const [revealedMessages, setRevealedMessages] = (0, import_react.useState)({});
	const messagesEndRef = (0, import_react.useRef)(null);
	const isAdmin = user?.role === "admin" || user?.role === "superadmin";
	const allRooms = dedupeById([...officialRooms, ...customRooms]);
	const activeRoom = allRooms.find((r) => r.id === activeRoomId) || officialRooms[0];
	const isTestPlaceholder = (msg) => {
		const content = (msg.message || "").trim();
		return content === "ㄴㅁㅇㄹ" || content === "asdf" || msg.id === "QrPLPsnM48LWrtdnF8gU";
	};
	const displayMessages = messages.filter((msg) => {
		if (isTestPlaceholder(msg)) return isAdmin;
		return true;
	});
	(0, import_react.useEffect)(() => {
		if (!isAuthenticated) return;
		const unsub = firebaseRepository.subscribeChatRooms((remoteRooms) => {
			if (remoteRooms && remoteRooms.length > 0) setCustomRooms((prev) => {
				const map = /* @__PURE__ */ new Map();
				prev.forEach((r) => map.set(r.id, r));
				remoteRooms.forEach((r) => map.set(r.id, r));
				return Array.from(map.values());
			});
		});
		return () => unsub();
	}, [isAuthenticated]);
	(0, import_react.useEffect)(() => {
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
			} catch (e) {}
		};
		sendHeartbeat();
		const interval = setInterval(sendHeartbeat, 1e4);
		return () => clearInterval(interval);
	}, [
		clientId,
		user?.id,
		activeRoomId
	]);
	(0, import_react.useEffect)(() => {
		if (!isAuthenticated) return;
		const unsub = firebaseRepository.subscribeChatRestrictions((uids) => {
			setRestrictedUsers(uids);
		});
		return () => unsub();
	}, [isAuthenticated]);
	(0, import_react.useEffect)(() => {
		let bc = null;
		try {
			bc = new BroadcastChannel("bd_live_chat_channel");
			bc.onmessage = (event) => {
				if (event.data?.roomId === activeRoomId && event.data?.message) {
					const newMsg = event.data.message;
					setMessages((prev) => {
						if (prev.some((m) => m.id === newMsg.id)) return prev;
						return [...prev, newMsg];
					});
				}
			};
		} catch {}
		const handleStorage = (e) => {
			if (e.key === "bd_chat_messages") {
				const fresh = storageService.getChatMessages(activeRoomId);
				setMessages(dedupeById(fresh));
			}
		};
		window.addEventListener("storage", handleStorage);
		return () => {
			bc?.close();
			window.removeEventListener("storage", handleStorage);
		};
	}, [activeRoomId]);
	const handleScroll = () => {
		const el = scrollContainerRef.current;
		if (!el) return;
		const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
		setIsNearBottom(atBottom);
		if (atBottom) setNewUnseenCount(0);
	};
	const scrollToBottom = (smooth = true) => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTo({
				top: scrollContainerRef.current.scrollHeight,
				behavior: smooth ? "smooth" : "auto"
			});
			setIsNearBottom(true);
			setNewUnseenCount(0);
		}
	};
	(0, import_react.useEffect)(() => {
		if (prevScrollHeightRef.current > 0 && scrollContainerRef.current && isFetchingOlder) {
			const diff = scrollContainerRef.current.scrollHeight - prevScrollHeightRef.current;
			scrollContainerRef.current.scrollTop += diff;
			prevScrollHeightRef.current = 0;
			setIsFetchingOlder(false);
			return;
		}
		if (isNearBottom) scrollToBottom(false);
		else setNewUnseenCount((prev) => prev + 1);
	}, [messages]);
	const handleLoadMore = () => {
		if (scrollContainerRef.current) prevScrollHeightRef.current = scrollContainerRef.current.scrollHeight;
		setIsFetchingOlder(true);
		loadMoreChatMessages();
	};
	(0, import_react.useEffect)(() => {
		localStorage.setItem("bd_blocked_users", JSON.stringify(blockedUsers));
	}, [blockedUsers]);
	(0, import_react.useEffect)(() => {
		localStorage.setItem("bd_muted_users", JSON.stringify(mutedUsers));
	}, [mutedUsers]);
	const handleEnterRoom = (room) => {
		if (room.id === activeRoomId) {
			setMobileView("chat");
			return;
		}
		setActiveRoomId(room.id);
		setMobileView("chat");
		showToast(`'${room.name}' 채널에 입장하였습니다.`, "info");
	};
	const handleOpenCreateModal = () => {
		if (!requireAuth("채팅방 개설")) return;
		setIsCreateModalOpen(true);
	};
	const handleRoomCreated = (newRoom) => {
		setCustomRooms((prev) => dedupeById([newRoom, ...prev]));
		setActiveRoomId(newRoom.id);
		setMobileView("chat");
	};
	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!requireAuth("실시간 채팅")) return;
		if (!user) return;
		const rawText = inputText.trim();
		if (!rawText) return;
		const isSuperAdminAccount = user.id === "lr018vf8CcW5fAv707vsl77qJy53" || user.email === "byunghyunlim92@gmail.com" || user.role === "superadmin";
		if (Boolean(!isSuperAdminAccount && (user.chatRestricted || restrictedUsers.includes(user.id)))) {
			showToast("현재 계정은 관리자 조치에 의해 채팅 이용이 제한되어 발언할 수 없습니다.", "error");
			return;
		}
		const spamCheck = checkSpamViolation(user.id, rawText);
		if (spamCheck.isSpam) {
			if (spamCheck.reason === "duplicate") showToast("동일한 메시지를 반복해서 전송할 수 없습니다. (도배 방지)", "warning");
			else showToast("메시지를 너무 빠르게 전송하고 있습니다. 잠시 후 다시 시도해 주세요.", "warning");
			return;
		}
		const { cleanText, hasProfanity } = filterProfanity(rawText);
		if (hasProfanity) showToast("부적절한 단어나 시세조종 관련 금칙어가 감지되어 마스킹 처리되었습니다.", "info");
		const now = /* @__PURE__ */ new Date();
		const nowIso = now.toISOString();
		const timeStr = formatChatTime(now);
		const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
		const tempId = `temp-${messageId}`;
		const newMsgPayload = {
			id: messageId,
			tempId,
			roomId: activeRoomId,
			author: {
				id: user.id,
				name: user.name,
				avatar: user.avatar,
				role: user.role === "admin" ? "총괄운영자" : user.tier
			},
			message: cleanText,
			timestamp: timeStr,
			createdAt: nowIso,
			sentiment,
			status: "sending"
		};
		const sent = storageService.sendChatMessage(newMsgPayload);
		setMessages((prev) => {
			if (prev.some((m) => m.id === sent.id)) return prev;
			return [...prev, sent];
		});
		setInputText("");
		try {
			const bc = new BroadcastChannel("bd_live_chat_channel");
			bc.postMessage({
				roomId: activeRoomId,
				message: sent
			});
			bc.close();
		} catch {}
		try {
			await firebaseRepository.sendChatMessage(newMsgPayload, messageId, tempId);
			setMessages((prev) => prev.map((m) => m.id === messageId ? {
				...m,
				status: "sent"
			} : m));
		} catch (err) {
			console.warn("Firebase chat send error:", err);
			setMessages((prev) => prev.map((m) => m.id === messageId ? {
				...m,
				status: "failed"
			} : m));
			setFailedMessagePayloads((prev) => ({
				...prev,
				[messageId]: {
					payload: newMsgPayload,
					messageId
				}
			}));
			showToast("메시지 전송에 실패했습니다. 재전송 버튼을 눌러 다시 시도하세요.", "error");
		}
	};
	const handleRetryMessage = async (msgId) => {
		const entry = failedMessagePayloads[msgId];
		if (!entry) return;
		const { payload, messageId } = entry;
		setMessages((prev) => prev.map((m) => m.id === msgId ? {
			...m,
			status: "sending"
		} : m));
		try {
			await firebaseRepository.sendChatMessage(payload, messageId, payload.tempId);
			setMessages((prev) => prev.map((m) => m.id === msgId ? {
				...m,
				status: "sent"
			} : m));
			setFailedMessagePayloads((prev) => {
				const copy = { ...prev };
				delete copy[msgId];
				return copy;
			});
			showToast("메시지가 성공적으로 재전송되었습니다.", "success");
		} catch (err) {
			console.warn("Retry send error:", err);
			setMessages((prev) => prev.map((m) => m.id === msgId ? {
				...m,
				status: "failed"
			} : m));
			showToast("재전송에 실패했습니다. 네트워크 상태를 확인해주세요.", "error");
		}
	};
	const handleBlockUser = (targetUserId, targetUserName) => {
		if (targetUserId === user?.id) return;
		if (blockedUsers.includes(targetUserId)) {
			setBlockedUsers((prev) => prev.filter((id) => id !== targetUserId));
			showToast(`'${targetUserName}' 님의 차단이 해제되었습니다.`, "info");
		} else {
			setBlockedUsers((prev) => [...prev, targetUserId]);
			showToast(`'${targetUserName}' 님을 차단했습니다. 해당 사용자의 메시지는 숨겨집니다.`, "warning");
		}
	};
	const handleMuteUser = (targetUserId, targetUserName) => {
		if (targetUserId === user?.id) return;
		if (mutedUsers.includes(targetUserId)) {
			setMutedUsers((prev) => prev.filter((id) => id !== targetUserId));
			showToast(`'${targetUserName}' 님의 음소거가 해제되었습니다.`, "info");
		} else {
			setMutedUsers((prev) => [...prev, targetUserId]);
			showToast(`'${targetUserName}' 님을 뮤트(음소거)했습니다.`, "info");
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
			showToast(`메시지 삭제 실패: ${err.message}`, "error");
		}
	};
	const handleRestrictUser = async (targetUserId, targetUserName) => {
		if (!isAdmin || !user) return;
		try {
			const res = await adminService.muteUser(targetUserId, "커뮤니티 및 채팅 이용 규정 위반", {
				id: user.id,
				name: user.name,
				role: user.role
			});
			showToast(res.message, res.success ? "warning" : "error");
		} catch (err) {
			showToast(`채팅 이용 제한 실패: ${err.message}`, "error");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 pb-16 animate-in fade-in duration-150 max-w-7xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-6 h-6 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "실시간 주주 라이브 톡" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5",
					children: "국내주식, 코스피, 코스닥, 급등주 및 주주 개설 채널에서 실시간 호가와 수급을 토론하세요."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleOpenCreateModal,
							className: "flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "채팅방 만들기" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-500",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "relative flex h-2 w-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-rose-500" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-3.5 h-3.5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"접속자 ",
									onlineCount.toLocaleString(),
									"명"
								] })
							]
						}),
						isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminChatControl, {
							roomId: activeRoomId,
							roomName: activeRoom.name,
							count: displayMessages.length,
							adminUid: user?.id || "",
							onClearHistory: () => setMessages([]),
							onDeleteRoom: () => {
								setCustomRooms((prev) => prev.filter((r) => r.id !== activeRoomId));
								setActiveRoomId("all");
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2.5 py-1 rounded-xl text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30",
							children: "관리자 모드 활성"
						})] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-4 gap-4 h-[650px] sm:h-[700px] max-h-[85vh]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `lg:col-span-1 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-col gap-2 overflow-y-auto shadow-sm ${mobileView === "chat" ? "hidden lg:flex" : "flex"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg:hidden flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-slate-500 dark:text-slate-400",
								children: ["현재 참여: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-slate-900 dark:text-white",
									children: activeRoom.name
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setMobileView("chat"),
								className: "px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs",
								children: "대화방으로 복귀"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-2 py-1 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-bold text-slate-400 uppercase tracking-wider",
								children: [
									"채팅 채널 (",
									allRooms.length,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: handleOpenCreateModal,
									className: "text-[11px] font-bold text-rose-500 hover:underline flex items-center gap-0.5 cursor-pointer",
									title: "새 채팅방 만들기",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "방 개설" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] text-emerald-500 font-mono flex items-center gap-1 font-bold ml-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "w-3 h-3 animate-pulse" }), "LIVE"]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1.5 flex-1 overflow-y-auto pr-0.5",
							children: allRooms.map((room) => {
								const isActive = room.id === activeRoomId;
								const liveCount = roomOnlineCounts[room.id] !== void 0 ? roomOnlineCounts[room.id] : room.count || 1;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleEnterRoom(room),
									className: `w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer group ${isActive ? "bg-rose-50 dark:bg-rose-500/15 border border-rose-300 dark:border-rose-500/40 shadow-xs" : "hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 pr-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-base shrink-0",
													children: room.icon
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `text-xs font-black truncate ${isActive ? "text-rose-600 dark:text-rose-400" : "text-slate-800 dark:text-slate-200"}`,
													children: room.name
												}),
												isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[9px] px-1.5 py-0.2 rounded font-bold bg-rose-500 text-white shrink-0",
													children: "참여 중"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-slate-400 truncate mt-0.5 ml-6",
											children: room.desc
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] font-mono text-slate-400",
											children: [liveCount, "명"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: `w-3 h-3 text-slate-300 transition-transform ${isActive ? "text-rose-500 translate-x-0.5" : "group-hover:translate-x-0.5"}` })]
									})]
								}, room.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-auto p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-3.5 h-3.5 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "클린 채팅 가이드" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "leading-relaxed",
								children: "시세조종, 허위사실 유포, 욕설은 자동 필터링 및 관리자 제재 대상이 됩니다."
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `lg:col-span-3 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-sm ${mobileView === "list" ? "hidden lg:flex" : "flex"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setMobileView("list"),
										className: "lg:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
										title: "채널 목록으로 돌아가기",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-4 h-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xl shrink-0",
										children: activeRoom.icon
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "min-w-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 truncate",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: activeRoom.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] font-normal text-slate-400 hidden sm:inline",
												children: [
													"(",
													activeRoom.desc,
													")"
												]
											})]
										})
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs font-semibold text-emerald-500 font-mono shrink-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "실시간 소켓 연결됨"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sm:hidden",
										children: "LIVE"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							ref: scrollContainerRef,
							onScroll: handleScroll,
							className: "flex-1 p-4 overflow-y-auto space-y-3.5 font-sans relative",
							children: [
								displayMessages.length >= 30 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-center pb-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: handleLoadMore,
										disabled: isFetchingOlder,
										className: "px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs",
										children: isFetchingOlder ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3 h-3 animate-spin text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "이전 대화 불러오는 중..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "이전 대화 더 불러오기" }) })
									})
								}),
								displayMessages.length > 0 ? (() => {
									const uniqueMessages = dedupeById(displayMessages);
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
										className: "space-y-3.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-center my-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-slate-200 dark:bg-slate-800 flex-1" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "px-3 py-0.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 rounded-full border border-slate-200/80 dark:border-slate-700/60 shadow-2xs",
													children: group.dividerLabel
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-slate-200 dark:bg-slate-800 flex-1" })
											]
										}), group.items.map((msg) => {
											const isMe = Boolean(user && msg.author?.id === user.id);
											const authorId = msg.author?.id || "unknown";
											const authorName = msg.author?.name || "익명 투자자";
											const isBlocked = blockedUsers.includes(authorId);
											const isMuted = mutedUsers.includes(authorId);
											const isRestrictedAuthor = restrictedUsers.includes(authorId);
											const isRevealed = revealedMessages[msg.id];
											const isTest = isTestPlaceholder(msg);
											const msgTime = formatChatTime(msg.createdAt || msg.timestamp);
											const exactTimeTooltip = formatChatExactDateTime(msg.createdAt || msg.timestamp);
											if (isBlocked && !isRevealed) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2 rounded-xl bg-slate-100 dark:bg-slate-800/40 text-xs text-slate-400 flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														"차단된 사용자(",
														authorName,
														")의 메시지입니다."
													] })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => setRevealedMessages((prev) => ({
														...prev,
														[msg.id]: true
													})),
													className: "text-rose-500 font-semibold hover:underline text-[11px] cursor-pointer",
													children: "내용 보기"
												})]
											}, msg.id);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: `flex items-start gap-2.5 group ${isMe ? "flex-row-reverse" : ""}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: msg.author?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
													alt: authorName,
													className: "w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: `max-w-[80%] sm:max-w-[75%] space-y-1 ${isMe ? "text-right" : ""}`,
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: `flex items-center gap-1.5 text-[11px] ${isMe ? "justify-end" : ""}`,
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-bold text-slate-700 dark:text-slate-300",
																	children: authorName
																}),
																msg.author?.role && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: `px-1.5 py-0.2 rounded text-[10px] font-bold ${msg.author.role.includes("운영자") || msg.author.role.includes("관리자") ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`,
																	children: msg.author.role
																}),
																isTest && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30",
																	children: "초기화 대상 (테스트)"
																}),
																isRestrictedAuthor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-[10px] px-1 rounded bg-rose-500/10 text-rose-500 font-bold",
																	children: "채팅제한됨"
																}),
																msg.sentiment === "bull" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-rose-500 font-bold text-[10px]",
																	children: "▲ 매수"
																}),
																msg.sentiment === "bear" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-blue-500 font-bold text-[10px]",
																	children: "▼ 매도"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-slate-400 font-mono text-[10px] cursor-help",
																	title: exactTimeTooltip,
																	children: msgTime
																}),
																isMe && msg.status === "sending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	title: "전송 중...",
																	className: "inline-flex items-center",
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3 h-3 text-slate-400 animate-spin" })
																}),
																isMe && msg.status === "failed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "inline-flex items-center gap-1 text-[10px] text-rose-500 font-bold",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "전송실패" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																		type: "button",
																		onClick: () => handleRetryMessage(msg.id),
																		className: "underline hover:text-rose-600 cursor-pointer inline-flex items-center gap-0.5",
																		title: "다시 보내기",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-2.5 h-2.5" }), " 재전송"]
																	})]
																})
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: `inline-block px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm text-left leading-relaxed break-words shadow-xs ${isMe ? msg.status === "failed" ? "bg-rose-500/80 text-white rounded-tr-xs border border-rose-300" : "bg-rose-600 text-white rounded-tr-xs" : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs"}`,
															children: [msg.message, msg.imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "mt-2",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
																	src: msg.imageUrl,
																	alt: "채팅 업로드 이미지",
																	onError: (e) => {
																		e.currentTarget.style.display = "none";
																	},
																	className: "max-w-[240px] max-h-[200px] rounded-xl object-cover border border-white/20 shadow-sm"
																})
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: `flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] ${isMe ? "justify-end" : "justify-start"}`,
															children: [!isMe && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																	onClick: () => setReportTarget({
																		targetId: msg.id,
																		content: msg.message,
																		authorName
																	}),
																	className: "text-slate-400 hover:text-rose-500 p-1 rounded cursor-pointer transition-colors",
																	title: "메시지 신고",
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-3.5 h-3.5" })
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																	onClick: () => handleBlockUser(authorId, authorName),
																	className: `p-1 rounded cursor-pointer transition-colors ${isBlocked ? "text-rose-500" : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`,
																	title: isBlocked ? "차단 해제" : "사용자 차단",
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "w-3.5 h-3.5" })
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																	onClick: () => handleMuteUser(authorId, authorName),
																	className: `p-1 rounded cursor-pointer transition-colors ${isMuted ? "text-amber-500" : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`,
																	title: isMuted ? "음소거 해제" : "사용자 뮤트",
																	children: isMuted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-3.5 h-3.5" })
																})
															] }), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																onClick: () => handleDeleteMessage(msg.id),
																className: "text-slate-400 hover:text-rose-600 p-1 rounded cursor-pointer transition-colors",
																title: "관리자 권한: 메시지 삭제",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5 text-rose-500" })
															}), !isMe && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																onClick: () => handleRestrictUser(authorId, authorName),
																className: "text-amber-500 hover:text-amber-600 p-1 rounded font-bold text-[10px] cursor-pointer",
																title: "관리자 권한: 사용자 채팅 이용제한",
																children: "제한"
															})] })]
														})
													]
												})]
											}, msg.id);
										})]
									}, group.dateKey));
								})() : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "py-20 text-center text-slate-400 text-xs space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										"'",
										activeRoom.name,
										"' 채널에 아직 전송된 메시지가 없습니다."
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "첫 번째 메시지를 남겨 실시간 대화를 시작해보세요!" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: messagesEndRef }),
								!isNearBottom && newUnseenCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "sticky bottom-2 inset-x-0 flex justify-center z-20 pointer-events-none",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => scrollToBottom(true),
										className: "pointer-events-auto px-4 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all transform hover:scale-105 cursor-pointer animate-bounce",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"새 메시지 ",
											newUnseenCount,
											"건 도착"
										] })]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30",
							children: !isAuthenticated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-600 dark:text-slate-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "실시간 채팅에 참여하려면 로그인이 필요합니다." })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setIsAuthModalOpen(true),
									className: "px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "로그인 / 회원가입" })]
								})]
							}) : !isAdmin && user && (user.chatRestricted || restrictedUsers.includes(user.id)) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "현재 계정은 관리자에 의해 채팅 이용이 제한된 상태입니다." })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSendMessage,
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs px-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] text-slate-400 mr-1",
												children: "투자 심리:"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setSentiment("bull"),
												className: `px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${sentiment === "bull" ? "bg-rose-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`,
												children: "▲ 매수/상승"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setSentiment("bear"),
												className: `px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${sentiment === "bear" ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`,
												children: "▼ 매도/하락"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setSentiment("neutral"),
												className: `px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${sentiment === "neutral" ? "bg-slate-700 text-white dark:bg-slate-600" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`,
												children: "중립"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatToolbar, {
										onInsertText: (emoji) => setInputText((prev) => prev + emoji),
										onImageUploaded: (url) => {
											if (!user) return;
											const imageMsgPayload = {
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
											firebaseRepository.sendChatMessage(imageMsgPayload, sent.id).catch(() => {});
										}
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: inputText,
										onChange: (e) => setInputText(e.target.value),
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
														const imageMsgPayload = {
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
														firebaseRepository.sendChatMessage(imageMsgPayload, sent.id).catch(() => {});
													}
												}
											}
										},
										placeholder: `${activeRoom.name} 채널에 메시지, 짤, 이모티콘 입력 (Ctrl+V 이미지 붙여넣기 지원)`,
										className: "flex-1 px-4 py-2.5 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 font-medium"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "submit",
										className: "px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "전송" })]
									})]
								})]
							})
						})
					]
				})]
			}),
			reportTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportModal, {
				isOpen: Boolean(reportTarget),
				onClose: () => setReportTarget(null),
				targetType: "chat",
				targetId: reportTarget.targetId,
				targetTitle: `[라이브톡 메시지] ${reportTarget.authorName}`,
				targetContent: reportTarget.content,
				targetAuthorName: reportTarget.authorName
			}),
			isCreateModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateChatRoomModal, {
				isOpen: isCreateModalOpen,
				onClose: () => setIsCreateModalOpen(false),
				onCreated: handleRoomCreated,
				availableStocks: stocks
			})
		]
	});
};
//#endregion
export { ChatView };
