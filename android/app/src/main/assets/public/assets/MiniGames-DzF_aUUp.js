import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { Bt as Compass, C as Target, Ct as History, Dt as Gamepad2, Ft as ExternalLink, G as RefreshCw, Gt as CircleAlert, H as Search, It as DollarSign, J as Play, Jt as ChevronLeft, L as Share2, N as Shuffle, Nt as Eye, O as Sparkles, Ot as Funnel, P as Shield, Pt as EyeOff, St as House, Tt as Grid3x3, Ut as CircleQuestionMark, Vt as Coins, W as RotateCcw, Wt as CircleCheck, an as Briefcase, bn as require_react, c as Utensils, dn as Award, dt as MapPin, g as TrendingUp, h as TriangleAlert, ht as Lock, i as X, in as Building2, l as Users, pn as ArrowUpRight, q as Plus, qt as ChevronRight, r as Zap, tn as Calendar, un as BadgeAlert, v as Trash2, vt as Layers, wt as Heart, z as Settings2 } from "./vendor-lucide-Dji_Ij8j.js";
import { f as firebaseRepository, n as useApp } from "./AppContext-Butl4QWq.js";
//#region src/components/games/LadderGame.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_PARTICIPANTS = [
	"참가자 1",
	"참가자 2",
	"참가자 3",
	"참가자 4"
];
var DEFAULT_RESULTS = [
	"당첨",
	"꽝",
	"꽝",
	"꽝"
];
var COL_WIDTH = 90;
var TOP_MARGIN = 40;
var LadderGame = () => {
	const { user } = useApp();
	const [participants, setParticipants] = (0, import_react.useState)(DEFAULT_PARTICIPANTS);
	const [results, setResults] = (0, import_react.useState)(DEFAULT_RESULTS);
	const [horizontalLines, setHorizontalLines] = (0, import_react.useState)([]);
	const [pathResults, setPathResults] = (0, import_react.useState)(null);
	const [isGenerated, setIsGenerated] = (0, import_react.useState)(false);
	const [isBlindMode, setIsBlindMode] = (0, import_react.useState)(true);
	const [selectedParticipantIdx, setSelectedParticipantIdx] = (0, import_react.useState)(null);
	const [revealedResults, setRevealedResults] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [isProcessing, setIsProcessing] = (0, import_react.useState)(false);
	const [copyFeedback, setCopyFeedback] = (0, import_react.useState)(false);
	const isMountedRef = (0, import_react.useRef)(true);
	const copyTimeoutRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
			if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
		};
	}, []);
	const [showPresets, setShowPresets] = (0, import_react.useState)(false);
	const [winCount, setWinCount] = (0, import_react.useState)(1);
	const [loseCount, setLoseCount] = (0, import_react.useState)(1);
	const scrollContainerRef = (0, import_react.useRef)(null);
	const numCols = participants.length;
	const svgWidth = Math.max(480, numCols * COL_WIDTH + 80);
	const svgHeight = 460;
	const handleAddParticipant = () => {
		if (participants.length >= 24) {
			alert("최대 24명까지 참여 가능합니다.");
			return;
		}
		const nextIdx = participants.length + 1;
		setParticipants((prev) => [...prev, `참가자 ${nextIdx}`]);
		setResults((prev) => [...prev, "꽝"]);
		resetLadder();
	};
	const handleRemoveParticipant = (index) => {
		if (participants.length <= 2) {
			alert("사다리타기는 최소 2명 이상 필요합니다.");
			return;
		}
		setParticipants((prev) => prev.filter((_, i) => i !== index));
		setResults((prev) => prev.filter((_, i) => i !== index));
		resetLadder();
	};
	const handleParticipantChange = (index, val) => {
		const updated = [...participants];
		updated[index] = val;
		setParticipants(updated);
		if (isGenerated) resetLadder();
	};
	const handleResultChange = (index, val) => {
		const updated = [...results];
		updated[index] = val;
		setResults(updated);
		if (isGenerated) resetLadder();
	};
	const resetLadder = () => {
		setIsGenerated(false);
		setHorizontalLines([]);
		setPathResults(null);
		setSelectedParticipantIdx(null);
		setRevealedResults(/* @__PURE__ */ new Set());
	};
	const applyPreset = (type) => {
		const count = participants.length;
		let newRes = [];
		if (type === "win1") {
			newRes = Array(count).fill("꽝");
			newRes[0] = "🎉 당첨";
		} else if (type === "lose1") {
			newRes = Array(count).fill("통과");
			newRes[0] = "💣 벌칙/커피";
		} else if (type === "custom_win") {
			const safeWins = Math.max(1, Math.min(count - 1, winCount));
			newRes = [...Array(safeWins).fill("🎉 당첨"), ...Array(count - safeWins).fill("꽝")];
		} else if (type === "custom_lose") {
			const safeLoses = Math.max(1, Math.min(count - 1, loseCount));
			newRes = [...Array(safeLoses).fill("💣 벌칙"), ...Array(count - safeLoses).fill("통과")];
		} else if (type === "ranks") newRes = participants.map((_, i) => `${i + 1}등`);
		for (let i = newRes.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[newRes[i], newRes[j]] = [newRes[j], newRes[i]];
		}
		setResults(newRes);
		setShowPresets(false);
		resetLadder();
	};
	const generateLadder = () => {
		if (participants.length !== results.length) {
			alert("참가자 수와 결과 수가 일치해야 합니다.");
			return;
		}
		const n = participants.length;
		const lines = [];
		const numLevels = Math.max(12, n * 3);
		const levelHeight = 320 / numLevels;
		for (let lvl = 0; lvl < numLevels; lvl++) {
			const y = 70 + lvl * levelHeight + (Math.random() * 8 - 4);
			const availableCols = Array.from({ length: n - 1 }, (_, i) => i);
			for (let i = availableCols.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[availableCols[i], availableCols[j]] = [availableCols[j], availableCols[i]];
			}
			const occupied = /* @__PURE__ */ new Set();
			for (const col of availableCols) if (!occupied.has(col - 1) && !occupied.has(col) && !occupied.has(col + 1)) {
				if (Math.random() < .55) {
					lines.push({
						id: `line_${lvl}_${col}`,
						x: col,
						y
					});
					occupied.add(col);
				}
			}
		}
		for (let col = 0; col < n - 1; col++) if (!lines.some((l) => l.x === col)) {
			const y = 80 + Math.random() * 300;
			lines.push({
				id: `line_extra_${col}`,
				x: col,
				y
			});
		}
		lines.sort((a, b) => a.y - b.y);
		const computedPaths = participants.map((p, startCol) => {
			let currentCol = startCol;
			const waypoints = [{
				x: currentCol,
				y: TOP_MARGIN
			}];
			for (const line of lines) if (line.x === currentCol) {
				waypoints.push({
					x: currentCol,
					y: line.y
				});
				currentCol = currentCol + 1;
				waypoints.push({
					x: currentCol,
					y: line.y
				});
			} else if (line.x + 1 === currentCol) {
				waypoints.push({
					x: currentCol,
					y: line.y
				});
				currentCol = currentCol - 1;
				waypoints.push({
					x: currentCol,
					y: line.y
				});
			}
			waypoints.push({
				x: currentCol,
				y: 420
			});
			return {
				participantIndex: startCol,
				participant: p,
				finalCol: currentCol,
				result: results[currentCol],
				waypoints
			};
		});
		setHorizontalLines(lines);
		setPathResults(computedPaths);
		setIsGenerated(true);
		setSelectedParticipantIdx(null);
		setRevealedResults(/* @__PURE__ */ new Set());
		if (user?.id) {
			setIsProcessing(true);
			firebaseRepository.saveGameHistory(user.id, "ladder", {
				participants,
				results
			}, computedPaths.map((cp) => ({
				participant: cp.participant,
				result: cp.result
			}))).catch(console.warn).finally(() => {
				if (isMountedRef.current) setIsProcessing(false);
			});
		}
	};
	const handleSelectParticipant = (idx) => {
		setSelectedParticipantIdx(idx);
		setRevealedResults((prev) => /* @__PURE__ */ new Set([...prev, idx]));
	};
	const handleRevealAll = () => {
		setIsBlindMode(false);
		if (pathResults) setRevealedResults(new Set(participants.map((_, i) => i)));
	};
	const handleCopyResults = () => {
		if (!pathResults) return;
		const lines = [
			"🎯 [병돌 인베스트먼트 사다리타기 결과]",
			"--------------------------------",
			...pathResults.map((p) => `• ${p.participant} ➔ ${p.result}`),
			"--------------------------------",
			"병돌 인베스트먼트에서 진행되었습니다."
		];
		navigator.clipboard.writeText(lines.join("\n"));
		if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
		setCopyFeedback(true);
		copyTimeoutRef.current = setTimeout(() => {
			if (isMountedRef.current) setCopyFeedback(false);
		}, 2500);
	};
	const getColX = (colIdx) => 50 + colIdx * COL_WIDTH;
	const activePathD = (0, import_react.useMemo)(() => {
		if (selectedParticipantIdx === null || !pathResults) return null;
		const pResult = pathResults.find((pr) => pr.participantIndex === selectedParticipantIdx);
		if (!pResult) return null;
		return pResult.waypoints.map((wp, i) => `${i === 0 ? "M" : "L"} ${getColX(wp.x)} ${wp.y}`).join(" ");
	}, [selectedParticipantIdx, pathResults]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-3.5 h-3.5" }), "다인원 실시간 추첨"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-black text-slate-900 dark:text-white",
							children: "사다리타기 (2~24명 지원)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 dark:text-slate-400 mt-1",
							children: "정확한 아미다쿠지 경로 계산과 블라인드 긴장감 추첨. 결과는 자동으로 개인 기록에 보관됩니다."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setShowPresets(!showPresets),
							className: "px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "w-3.5 h-3.5 text-rose-500" }), "결과 프리셋 설정"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: resetLadder,
							className: "p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500",
							title: "사다리 초기화",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-4 h-4" })
						})]
					})]
				}), showPresets && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-3 animate-in fade-in",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 text-amber-500" }), "빠른 결과 프리셋 선택"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => applyPreset("win1"),
								className: "p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-500 font-semibold text-slate-800 dark:text-slate-200 text-left",
								children: "당첨 1명 / 나머지 꽝"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => applyPreset("lose1"),
								className: "p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-500 font-semibold text-slate-800 dark:text-slate-200 text-left",
								children: "커피 쏘기 (벌칙 1명)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => applyPreset("ranks"),
								className: "p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-500 font-semibold text-slate-800 dark:text-slate-200 text-left",
								children: [
									"1등부터 ",
									participants.length,
									"등 순위"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-slate-500",
										children: "당첨 N명:"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										min: 1,
										max: participants.length - 1,
										value: winCount,
										onChange: (e) => setWinCount(Number(e.target.value)),
										className: "w-10 px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-center font-bold"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => applyPreset("custom_win"),
										className: "px-2 py-1 rounded bg-rose-500 text-white font-bold text-[10px]",
										children: "적용"
									})
								]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4 text-indigo-500" }),
								"참가자 & 결과 입력 (",
								participants.length,
								"명)"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleAddParticipant,
							className: "px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-semibold text-xs flex items-center gap-1 hover:bg-indigo-100 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), " 참가자 추가"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2 min-w-max",
							children: participants.map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-28 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-2 shrink-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-[11px] text-slate-400 font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["#", idx + 1] }), participants.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleRemoveParticipant(idx),
											className: "text-slate-400 hover:text-rose-500 p-0.5",
											title: "삭제",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3 h-3" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: p,
										onChange: (e) => handleParticipantChange(idx, e.target.value),
										placeholder: "참가자",
										className: "w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-slate-400 text-center font-medium",
										children: "⬇ 도달할 결과"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: results[idx] || "",
										onChange: (e) => handleResultChange(idx, e.target.value),
										placeholder: "결과",
										className: `w-full px-2 py-1 rounded-lg border text-xs font-bold text-center focus:outline-none focus:border-rose-500 ${results[idx]?.includes("당첨") || results[idx]?.includes("1등") ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800" : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700"}`
									})
								]
							}, idx))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col sm:flex-row items-center gap-3 pt-2",
						children: !isGenerated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: generateLadder,
							disabled: isProcessing,
							className: "w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { className: "w-4 h-4" }), "사다리 생성 및 게임 시작"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setIsBlindMode(!isBlindMode),
									className: "flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors",
									children: [isBlindMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-4 h-4 text-blue-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-4 h-4 text-slate-400" }), isBlindMode ? "사다리 선 전체 보기" : "블라인드 가리기"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: handleRevealAll,
									className: "flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-500" }), "모든 결과 즉시 공개"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: generateLadder,
									className: "py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3.5 h-3.5" }), "다시 타기"]
								})
							]
						})
					})
				]
			}),
			isGenerated && pathResults && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-slate-500 dark:text-slate-400",
							children: [
								"💡 ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-slate-900 dark:text-white",
									children: "참가자 버튼"
								}),
								"을 클릭하면 경로를 따라 내려가 결과가 공개됩니다."
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-slate-400",
								children: [
									"공개됨: ",
									revealedResults.size,
									" / ",
									participants.length
								]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: scrollContainerRef,
						className: "w-full overflow-x-auto rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: { minWidth: `${svgWidth}px` },
							className: "relative mx-auto",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-between relative z-10 px-[50px] mb-2",
									style: { width: `${svgWidth}px` },
									children: participants.map((p, idx) => {
										const isSelected = selectedParticipantIdx === idx;
										const isRevealed = revealedResults.has(idx);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleSelectParticipant(idx),
											style: {
												position: "absolute",
												left: `${getColX(idx)}px`,
												transform: "translateX(-50%)"
											},
											className: `px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${isSelected ? "bg-rose-600 text-white scale-110 ring-4 ring-rose-500/20 z-20" : isRevealed ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-rose-500"}`,
											children: p
										}, idx);
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									width: svgWidth,
									height: svgHeight,
									className: "block select-none mt-6",
									children: [
										participants.map((_, colIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
											x1: getColX(colIdx),
											y1: TOP_MARGIN,
											x2: getColX(colIdx),
											y2: 420,
											stroke: "#94a3b8",
											strokeWidth: "3",
											strokeLinecap: "round",
											className: "dark:stroke-slate-700"
										}, `rail_${colIdx}`)),
										horizontalLines.map((line) => {
											const x1 = getColX(line.x);
											const x2 = getColX(line.x + 1);
											if (isBlindMode) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
												x1,
												y1: line.y,
												x2,
												y2: line.y,
												stroke: "#cbd5e1",
												strokeWidth: "2",
												strokeDasharray: "4 4",
												className: "dark:stroke-slate-800/80"
											}) }, line.id);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
												x1,
												y1: line.y,
												x2,
												y2: line.y,
												stroke: "#64748b",
												strokeWidth: "3",
												strokeLinecap: "round",
												className: "dark:stroke-slate-500"
											}, line.id);
										}),
										activePathD && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											d: activePathD,
											fill: "none",
											stroke: "#e11d48",
											strokeWidth: "5",
											strokeLinecap: "round",
											strokeLinejoin: "round",
											className: "animate-in fade-in"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-between relative z-10 px-[50px] mt-2",
									style: { width: `${svgWidth}px` },
									children: results.map((res, colIdx) => {
										const landingParticipant = pathResults.find((pr) => pr.finalCol === colIdx);
										const isDestinationRevealed = !isBlindMode || landingParticipant && revealedResults.has(landingParticipant.participantIndex);
										const isWinning = res.includes("당첨") || res.includes("1등") || res.includes("통과");
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												position: "absolute",
												left: `${getColX(colIdx)}px`,
												transform: "translateX(-50%)"
											},
											className: "text-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `px-3 py-1.5 rounded-xl text-xs font-black transition-all ${!isDestinationRevealed ? "bg-slate-200 dark:bg-slate-800 text-slate-400 border border-dashed border-slate-300 dark:border-slate-700" : isWinning ? "bg-rose-500 text-white shadow-md shadow-rose-500/20 scale-105" : "bg-slate-700 text-white"}`,
												children: isDestinationRevealed ? res : "???"
											}), isDestinationRevealed && landingParticipant && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1",
												children: landingParticipant.participant
											})]
										}, colIdx);
									})
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-4 h-4 text-amber-500" }), "추첨 결과 요약 표"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleCopyResults,
								className: "px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-3.5 h-3.5 text-indigo-500" }), copyFeedback ? "결과 복사 완료!" : "결과 복사하기"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2",
							children: pathResults.map((pr, idx) => {
								const isRevealed = !isBlindMode || revealedResults.has(pr.participantIndex);
								const isWin = pr.result.includes("당첨") || pr.result.includes("1등") || pr.result.includes("통과");
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: () => handleSelectParticipant(pr.participantIndex),
									className: `p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${selectedParticipantIdx === pr.participantIndex ? "border-rose-500 bg-rose-500/10" : "border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50 dark:bg-slate-900/40"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-900 dark:text-white truncate",
										children: pr.participant
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `font-black text-xs px-2 py-0.5 rounded-md shrink-0 ${!isRevealed ? "bg-slate-200 dark:bg-slate-800 text-slate-400" : isWin ? "bg-rose-500 text-white" : "bg-slate-600 text-white"}`,
										children: isRevealed ? pr.result : "?"
									})]
								}, idx);
							})
						})]
					})
				]
			})
		]
	});
};
//#endregion
//#region src/components/games/LunchSelector.tsx
var LUNCH_MENU_POOL = [
	{
		id: "k1",
		name: "김치찌개",
		category: "한식",
		avgPrice: 9e3,
		spiciness: "spicy",
		description: "칼칼하고 든든한 돼지고기 김치찌개",
		tags: ["국물", "스테디셀러"]
	},
	{
		id: "k2",
		name: "차돌 된장찌개",
		category: "한식",
		avgPrice: 9500,
		spiciness: "mild",
		description: "구수하고 진한 차돌박이 된장찌개",
		tags: ["국물", "밥도둑"]
	},
	{
		id: "k3",
		name: "제육볶음 정식",
		category: "한식",
		avgPrice: 1e4,
		spiciness: "spicy",
		description: "매콤달콤 불향 가득한 직장인 소울푸드",
		tags: ["고기", "인기"]
	},
	{
		id: "k4",
		name: "전주 돌솥비빔밥",
		category: "한식",
		avgPrice: 1e4,
		spiciness: "mild",
		description: "신선한 나물과 고소한 누룽지의 조화",
		tags: ["나물", "건강"]
	},
	{
		id: "k5",
		name: "순두부찌개",
		category: "한식",
		avgPrice: 9e3,
		spiciness: "spicy",
		description: "몽글몽글 부드러운 해물 순두부",
		tags: ["얼큰", "뚝배기"]
	},
	{
		id: "k6",
		name: "뚝배기 불고기",
		category: "한식",
		avgPrice: 11e3,
		spiciness: "none",
		description: "달콤 짭조름한 당면 듬뿍 불고기",
		tags: ["달콤", "남녀노소"]
	},
	{
		id: "k7",
		name: "설렁탕 / 곰탕",
		category: "한식",
		avgPrice: 12e3,
		spiciness: "none",
		description: "진하고 뽀얀 사골 육수에 소면 한 그릇",
		tags: ["보양", "담백"]
	},
	{
		id: "k8",
		name: "뼈해장국",
		category: "한식",
		avgPrice: 1e4,
		spiciness: "spicy",
		description: "살코기 듬뿍 얼큰한 뼈해장국",
		tags: ["해장", "든든"]
	},
	{
		id: "c1",
		name: "간짜장",
		category: "중식",
		avgPrice: 8500,
		spiciness: "none",
		description: "갓 볶아낸 아삭한 양파와 진한 춘장의 맛",
		tags: ["면요리", "불향"]
	},
	{
		id: "c2",
		name: "해물 짬뽕",
		category: "중식",
		avgPrice: 9500,
		spiciness: "hot",
		description: "각종 해산물과 불맛 가득한 얼큰 국물",
		tags: ["해장", "얼큰"]
	},
	{
		id: "c3",
		name: "마파두부 덮밥",
		category: "중식",
		avgPrice: 9e3,
		spiciness: "spicy",
		description: "알싸한 마라 향과 부드러운 두부",
		tags: ["매콤", "마라"]
	},
	{
		id: "c4",
		name: "잡채밥",
		category: "중식",
		avgPrice: 1e4,
		spiciness: "mild",
		description: "불향 가득 볶음 잡채와 짜장 소스",
		tags: ["밥류", "푸짐"]
	},
	{
		id: "c5",
		name: "꿔바로우 & 볶음밥",
		category: "중식",
		avgPrice: 13e3,
		spiciness: "none",
		description: "바삭 쫀득 탕수육과 고슬고슬 계란볶음밥",
		tags: ["세트", "별미"]
	},
	{
		id: "j1",
		name: "수제 모듬초밥",
		category: "일식",
		avgPrice: 16e3,
		spiciness: "none",
		description: "신선한 제철 생선 10피스 스시 세트",
		tags: ["신선", "고급"]
	},
	{
		id: "j2",
		name: "바삭 안심 돈카츠",
		category: "일식",
		avgPrice: 12e3,
		spiciness: "none",
		description: "두툼하고 촉촉한 육즙의 일식 돈카츠",
		tags: ["튀김", "바삭"]
	},
	{
		id: "j3",
		name: "가츠동 (돈까스 덮밥)",
		category: "일식",
		avgPrice: 9500,
		spiciness: "none",
		description: "부드러운 계란과 달콤 짭조름한 쯔유 소스",
		tags: ["덮밥", "인기"]
	},
	{
		id: "j4",
		name: "돈코츠 라멘",
		category: "일식",
		avgPrice: 1e4,
		spiciness: "mild",
		description: "진한 돼지 뼈 육수에 차슈와 반숙란",
		tags: ["면요리", "진한국물"]
	},
	{
		id: "j5",
		name: "사케동 (생연어 덮밥)",
		category: "일식",
		avgPrice: 14e3,
		spiciness: "none",
		description: "입안에서 사르르 녹는 생연어 덮밥",
		tags: ["연어", "깔끔"]
	},
	{
		id: "w1",
		name: "베이컨 까르보나라",
		category: "양식",
		avgPrice: 13e3,
		spiciness: "none",
		description: "고소하고 진한 크림 파스타",
		tags: ["파스타", "크림"]
	},
	{
		id: "w2",
		name: "매콤 아라비아따",
		category: "양식",
		avgPrice: 13e3,
		spiciness: "spicy",
		description: "페페론치노를 넣은 깔끔한 토마토 파스타",
		tags: ["파스타", "매콤"]
	},
	{
		id: "w3",
		name: "수제 치즈버거 세트",
		category: "양식",
		avgPrice: 11e3,
		spiciness: "none",
		description: "육즙 가득 소고기 패티와 멜팅 치즈",
		tags: ["버거", "수제"]
	},
	{
		id: "w4",
		name: "마르게리따 피자 (1인)",
		category: "양식",
		avgPrice: 14e3,
		spiciness: "none",
		description: "바질과 모짜렐라가 올라간 화덕 피자",
		tags: ["피자", "치즈"]
	},
	{
		id: "b1",
		name: "떡튀순 (떡볶이·튀김·순대)",
		category: "분식",
		avgPrice: 8e3,
		spiciness: "spicy",
		description: "매콤달콤 쌀떡볶이와 바삭한 모듬 튀김",
		tags: ["가성비", "분식세트"]
	},
	{
		id: "b2",
		name: "참치마요 김밥 & 라면",
		category: "분식",
		avgPrice: 7500,
		spiciness: "mild",
		description: "든든한 꿀조합 분식 클래식",
		tags: ["가성비", "스피드"]
	},
	{
		id: "b3",
		name: "얼큰 칼국수 & 왕만두",
		category: "분식",
		avgPrice: 9e3,
		spiciness: "spicy",
		description: "손칼국수와 육즙 꽉 찬 왕만두 세트",
		tags: ["면요리", "따뜻함"]
	},
	{
		id: "m1",
		name: "삼겹살 구이 백반",
		category: "고기/구이",
		avgPrice: 12e3,
		spiciness: "none",
		description: "노릇노릇 구워 나오는 삼겹살과 쌈채소",
		tags: ["고기", "푸짐"]
	},
	{
		id: "m2",
		name: "차돌박이 숙주볶음",
		category: "고기/구이",
		avgPrice: 11e3,
		spiciness: "none",
		description: "아삭한 숙주와 고소한 차돌박이의 조화",
		tags: ["고기", "별미"]
	},
	{
		id: "m3",
		name: "소고기 국밥",
		category: "고기/구이",
		avgPrice: 1e4,
		spiciness: "mild",
		description: "푸짐한 소고기와 얼큰 시원한 무 육수",
		tags: ["국밥", "든든"]
	},
	{
		id: "s1",
		name: "활어 회덮밥",
		category: "해산물",
		avgPrice: 11e3,
		spiciness: "mild",
		description: "신선한 활어회와 초고추장, 채소 듬뿍",
		tags: ["신선", "새콤달콤"]
	},
	{
		id: "s2",
		name: "꼬막 비빔밥",
		category: "해산물",
		avgPrice: 12e3,
		spiciness: "spicy",
		description: "통통한 벌교 꼬막과 매콤한 양념장",
		tags: ["별미", "인기"]
	},
	{
		id: "s3",
		name: "동태탕 / 대구탕",
		category: "해산물",
		avgPrice: 1e4,
		spiciness: "spicy",
		description: "시원하고 칼칼한 생선 맑은탕/매운탕",
		tags: ["해장", "국물"]
	},
	{
		id: "f1",
		name: "싸이버거 세트",
		category: "패스트푸드",
		avgPrice: 7500,
		spiciness: "mild",
		description: "바삭하고 두툼한 닭다리살 치킨버거",
		tags: ["가성비", "치킨버거"]
	},
	{
		id: "f2",
		name: "서브웨이 이탈리안 BMT",
		category: "패스트푸드",
		avgPrice: 8500,
		spiciness: "none",
		description: "취향대로 고르는 신선한 샌드위치",
		tags: ["간편", "야채듬뿍"]
	},
	{
		id: "h1",
		name: "닭가슴살 아보카도 샐러드",
		category: "건강식",
		avgPrice: 11e3,
		spiciness: "none",
		description: "부드러운 닭가슴살과 슈퍼푸드 샐러드 볼",
		tags: ["다이어트", "클린"]
	},
	{
		id: "h2",
		name: "연어 포케 (Poke)",
		category: "건강식",
		avgPrice: 13e3,
		spiciness: "none",
		description: "하와이안 현미밥과 신선한 생연어 큐브",
		tags: ["포케", "단백질"]
	},
	{
		id: "h3",
		name: "월남쌈 & 쌀국수 세트",
		category: "건강식",
		avgPrice: 12e3,
		spiciness: "none",
		description: "각종 채소 쌈과 맑고 깊은 양지 쌀국수",
		tags: ["베트남", "소화잘됨"]
	}
];
var CATEGORIES = [
	"전체",
	"한식",
	"중식",
	"일식",
	"양식",
	"분식",
	"고기/구이",
	"해산물",
	"패스트푸드",
	"건강식"
];
var LunchSelector = () => {
	const { user } = useApp();
	const [budget, setBudget] = (0, import_react.useState)(15e3);
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)("전체");
	const [spicinessFilter, setSpicinessFilter] = (0, import_react.useState)("all");
	const [excludedTagInput, setExcludedTagInput] = (0, import_react.useState)("");
	const [excludedMenus, setExcludedMenus] = (0, import_react.useState)([]);
	const [avoidRecent, setAvoidRecent] = (0, import_react.useState)(true);
	const [selectedDish, setSelectedDish] = (0, import_react.useState)(null);
	const [isSpinning, setIsSpinning] = (0, import_react.useState)(false);
	const [recentPicks, setRecentPicks] = (0, import_react.useState)(() => {
		try {
			const cached = localStorage.getItem("recent_lunch_picks");
			return cached ? JSON.parse(cached) : [];
		} catch {
			return [];
		}
	});
	const [locationMode, setLocationMode] = (0, import_react.useState)("none");
	const [showLocationBanner, setShowLocationBanner] = (0, import_react.useState)(true);
	const [customAddress, setCustomAddress] = (0, import_react.useState)("");
	const [detectedAddress, setDetectedAddress] = (0, import_react.useState)("");
	const [geoError, setGeoError] = (0, import_react.useState)(null);
	const isMountedRef = (0, import_react.useRef)(true);
	const spinIntervalRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
			if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
		};
	}, []);
	const filteredDishes = (0, import_react.useMemo)(() => {
		return LUNCH_MENU_POOL.filter((dish) => {
			if (selectedCategory !== "전체" && dish.category !== selectedCategory) return false;
			if (dish.avgPrice > budget) return false;
			if (spicinessFilter === "none" && dish.spiciness !== "none") return false;
			if (spicinessFilter === "mild" && dish.spiciness !== "mild" && dish.spiciness !== "none") return false;
			if (spicinessFilter === "spicy_hot" && dish.spiciness === "none") return false;
			if (excludedMenus.includes(dish.name)) return false;
			if (avoidRecent && recentPicks.slice(-3).includes(dish.name)) return false;
			return true;
		});
	}, [
		selectedCategory,
		budget,
		spicinessFilter,
		excludedMenus,
		avoidRecent,
		recentPicks
	]);
	const handleRequestCurrentLocation = () => {
		if (!navigator.geolocation) {
			if (isMountedRef.current) {
				setGeoError("브라우저에서 위치 서비스를 지원하지 않습니다.");
				setLocationMode("none");
				setShowLocationBanner(false);
			}
			return;
		}
		navigator.geolocation.getCurrentPosition((pos) => {
			if (!isMountedRef.current) return;
			const { latitude, longitude } = pos.coords;
			setDetectedAddress(`현재 위치 (위도 ${latitude.toFixed(3)}, 경도 ${longitude.toFixed(3)})`);
			setLocationMode("current");
			setShowLocationBanner(false);
			setGeoError(null);
		}, (err) => {
			if (!isMountedRef.current) return;
			console.warn("Geolocation permission denied or error:", err.message);
			setGeoError("위치 권한이 거부되었거나 위치를 가져올 수 없습니다. 수동 입력 또는 위치 없이 메뉴 추천을 이용하세요.");
			setLocationMode("none");
		}, { timeout: 7e3 });
	};
	const handleSetCustomLocation = (addr) => {
		if (!addr.trim() || !isMountedRef.current) return;
		setDetectedAddress(addr.trim());
		setLocationMode("custom");
		setShowLocationBanner(false);
		setGeoError(null);
	};
	const handleAddExcludedMenu = () => {
		const trimmed = excludedTagInput.trim();
		if (trimmed && !excludedMenus.includes(trimmed)) {
			setExcludedMenus([...excludedMenus, trimmed]);
			setExcludedTagInput("");
		}
	};
	const handleRemoveExcludedMenu = (menuName) => {
		setExcludedMenus(excludedMenus.filter((m) => m !== menuName));
	};
	const spinRoulette = async () => {
		if (isSpinning) return;
		if (filteredDishes.length === 0) {
			alert("조건에 맞는 메뉴 후보가 없습니다. 예산 또는 필터 조건을 완화해 보세요.");
			return;
		}
		if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
		setIsSpinning(true);
		setSelectedDish(null);
		let count = 0;
		const maxSteps = 24;
		spinIntervalRef.current = setInterval(() => {
			if (!isMountedRef.current) {
				if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
				return;
			}
			const randomCandidate = filteredDishes[Math.floor(Math.random() * filteredDishes.length)];
			setSelectedDish(randomCandidate);
			count++;
			if (count >= maxSteps) {
				if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
				spinIntervalRef.current = null;
				const finalDish = filteredDishes[Math.floor(Math.random() * filteredDishes.length)];
				if (isMountedRef.current) {
					setSelectedDish(finalDish);
					setIsSpinning(false);
					const updatedRecent = [...recentPicks, finalDish.name].slice(-10);
					setRecentPicks(updatedRecent);
					try {
						localStorage.setItem("recent_lunch_picks", JSON.stringify(updatedRecent));
					} catch {}
				}
				if (user?.id) firebaseRepository.saveGameHistory(user.id, "lunch", {
					budget,
					category: selectedCategory,
					spiciness: spicinessFilter,
					location: detectedAddress || "미사용"
				}, {
					selectedDish: finalDish.name,
					category: finalDish.category,
					price: finalDish.avgPrice
				}).catch(console.warn);
			}
		}, 80);
	};
	const mapSearchQuery = (0, import_react.useMemo)(() => {
		if (!selectedDish) return "";
		const locKeyword = locationMode === "custom" && detectedAddress ? detectedAddress : locationMode === "current" ? "내 주변" : "";
		return locKeyword ? `${locKeyword} ${selectedDish.name} 맛집` : `${selectedDish.name} 맛집`;
	}, [
		selectedDish,
		locationMode,
		detectedAddress
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, { className: "w-3.5 h-3.5" }), "스마트 런치 셀렉터"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-black text-slate-900 dark:text-white",
								children: "오늘의 점심 메뉴 고르기"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 dark:text-slate-400 mt-1",
								children: "예산·카테고리·맵기 필터와 어제 먹은 메뉴 제외. 실제 지도 검색 연동까지 완벽 지원합니다."
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									setSelectedCategory("전체");
									setBudget(15e3);
									setSpicinessFilter("all");
									setExcludedMenus([]);
								},
								className: "px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3.5 h-3.5 text-amber-500" }), "필터 초기화"]
							})
						})]
					}),
					showLocationBanner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 p-4 rounded-xl bg-indigo-50/80 dark:bg-slate-900/80 border border-indigo-200 dark:border-slate-800 text-xs space-y-3 animate-in fade-in",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-4 h-4 text-indigo-500 shrink-0" }), "주변 실제 음식점 연동을 위한 위치 선택"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]",
										children: "추첨된 메뉴를 바탕으로 실제 카카오맵/네이버지도 검색을 연결해 드립니다. 원하시는 위치 방식을 선택해 주세요. (위치를 사용하지 않아도 룰렛은 100% 정상 작동합니다)"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setShowLocationBanner(false),
									className: "text-slate-400 hover:text-slate-600 p-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2 pt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: handleRequestCurrentLocation,
										className: "px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "w-3.5 h-3.5" }), "현재 GPS 위치 사용"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											placeholder: "예: 여의도역, 강남역, 판교",
											value: customAddress,
											onChange: (e) => setCustomAddress(e.target.value),
											onKeyDown: (e) => e.key === "Enter" && handleSetCustomLocation(customAddress),
											className: "px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold w-40 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleSetCustomLocation(customAddress),
											className: "px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs",
											children: "입력"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											setLocationMode("none");
											setShowLocationBanner(false);
										},
										className: "px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 font-semibold text-xs hover:bg-white dark:hover:bg-slate-800",
										children: "위치 없이 메뉴만 추천"
									})
								]
							}),
							geoError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-rose-500 font-semibold flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-3.5 h-3.5" }),
									" ",
									geoError
								]
							})
						]
					}),
					!showLocationBanner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-3.5 h-3.5 text-amber-500" }),
								"위치 설정: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-slate-800 dark:text-slate-200",
									children: detectedAddress || "위치 미사용 (전국 메뉴)"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowLocationBanner(true),
							className: "text-[11px] text-indigo-500 font-semibold hover:underline",
							children: "위치 변경"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "w-4 h-4 text-amber-500" }),
								"맞춤 조건 설정 (",
								filteredDishes.length,
								"개 메뉴 후보)"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-slate-400",
							children: ["예산 한도: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
								className: "text-amber-500 font-bold",
								children: [budget.toLocaleString(), "원 이하"]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-semibold text-slate-400 uppercase tracking-wider block",
							children: "음식 종류"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedCategory(cat),
								className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat ? "bg-amber-500 text-white shadow-sm shadow-amber-500/20" : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"}`,
								children: cat
							}, cat))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500 font-medium",
										children: "1인 예산 한도"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-slate-900 dark:text-white",
										children: [budget.toLocaleString(), "원"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 7e3,
									max: 25e3,
									step: 1e3,
									value: budget,
									onChange: (e) => setBudget(Number(e.target.value)),
									className: "w-full accent-amber-500 cursor-pointer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-[10px] text-slate-400",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "7,000원 (가성비)" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "15,000원 (보통)" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "25,000원 (특식)" })
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-500 font-medium text-xs block",
								children: "맵기 선호도"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-4 gap-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setSpicinessFilter("all"),
										className: `py-1.5 rounded-lg font-bold ${spicinessFilter === "all" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "bg-white dark:bg-slate-800 text-slate-500"}`,
										children: "상관없음"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setSpicinessFilter("none"),
										className: `py-1.5 rounded-lg font-bold ${spicinessFilter === "none" ? "bg-emerald-500 text-white" : "bg-white dark:bg-slate-800 text-slate-500"}`,
										children: "순한맛"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setSpicinessFilter("mild"),
										className: `py-1.5 rounded-lg font-bold ${spicinessFilter === "mild" ? "bg-amber-500 text-white" : "bg-white dark:bg-slate-800 text-slate-500"}`,
										children: "보통"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setSpicinessFilter("spicy_hot"),
										className: `py-1.5 rounded-lg font-bold ${spicinessFilter === "spicy_hot" ? "bg-rose-500 text-white" : "bg-white dark:bg-slate-800 text-slate-500"}`,
										children: "매콤/얼큰"
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-slate-500",
									children: "제외할 메뉴 (어제 먹은 것 등)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: avoidRecent,
										onChange: (e) => setAvoidRecent(e.target.checked),
										className: "accent-amber-500"
									}), "최근 3회 당첨 메뉴 자동 제외"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "제외할 메뉴 입력 후 추가 (예: 김치찌개)",
									value: excludedTagInput,
									onChange: (e) => setExcludedTagInput(e.target.value),
									onKeyDown: (e) => e.key === "Enter" && handleAddExcludedMenu(),
									className: "flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleAddExcludedMenu,
									className: "px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs",
									children: "추가"
								})]
							}),
							excludedMenus.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5 pt-1",
								children: excludedMenus.map((m, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-[11px] font-bold flex items-center gap-1",
									children: [m, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleRemoveExcludedMenu(m),
										className: "hover:text-rose-800",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3 h-3" })
									})]
								}, idx))
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm text-center space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-md mx-auto space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-slate-400 tracking-widest uppercase block",
							children: "TODAY'S LUNCH PICK"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `min-h-[140px] flex flex-col items-center justify-center p-6 rounded-3xl border transition-all ${selectedDish ? "bg-amber-500/10 border-amber-500/30" : "bg-slate-50 dark:bg-slate-900 border-dashed border-slate-200 dark:border-slate-800"}`,
							children: selectedDish ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 animate-in zoom-in-95 duration-100",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-white",
										children: [
											selectedDish.category,
											" · 평균 ",
											selectedDish.avgPrice.toLocaleString(),
											"원"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-3xl sm:text-4xl font-black text-slate-900 dark:text-white",
										children: selectedDish.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-600 dark:text-slate-300 pt-1",
										children: selectedDish.description
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-slate-400 space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, { className: "w-10 h-10 mx-auto opacity-40 mb-2" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-bold text-slate-600 dark:text-slate-400",
										children: "룰렛을 돌려 오늘 점심을 결정하세요!"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-slate-400",
										children: [
											"현재 ",
											filteredDishes.length,
											"개의 메뉴가 대기 중입니다."
										]
									})
								]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: spinRoulette,
						disabled: isSpinning || filteredDishes.length === 0,
						className: "w-full sm:w-auto px-10 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-black text-lg shadow-lg shadow-amber-500/25 transition-all inline-flex items-center justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-5 h-5" }), isSpinning ? "메뉴 추첨 중..." : "오늘 점심 룰렛 돌리기!"]
					}) }),
					selectedDish && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80 max-w-lg mx-auto text-left space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-3.5 h-3.5 text-indigo-500" }),
									"실제 주변 ",
									selectedDish.name,
									" 식당 검색"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-slate-400",
								children: "포털 실시간 지도"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `https://map.kakao.com/link/search/${encodeURIComponent(mapSearchQuery)}`,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "p-3 rounded-xl bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/30 text-yellow-800 dark:text-yellow-300 font-bold text-xs flex items-center justify-between transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"카카오맵에서 \"",
									selectedDish.name,
									"\" 찾기"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3.5 h-3.5" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `https://map.naver.com/v5/search/${encodeURIComponent(mapSearchQuery)}`,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-between transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"네이버지도에서 \"",
									selectedDish.name,
									"\" 찾기"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3.5 h-3.5" })]
							})]
						})]
					})
				]
			}),
			recentPicks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-3.5 h-3.5 text-slate-400" }), "최근 선택한 점심 메뉴 이력"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[11px] text-slate-400",
						children: [
							"최근 ",
							recentPicks.length,
							"개"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5 pt-1",
					children: recentPicks.slice(-6).reverse().map((pick, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300",
						children: pick
					}, i))
				})]
			})
		]
	});
};
//#endregion
//#region src/components/games/workLifeData.ts
var JOB_LEVEL_LIST = [
	"신입",
	"사원",
	"대리",
	"과장",
	"차장",
	"부장",
	"임원"
];
var JOB_LEVEL_SALARY_MULTIPLIER = {
	신입: 1,
	사원: 1.15,
	대리: 1.35,
	과장: 1.65,
	차장: 2,
	부장: 2.4,
	임원: 3.5
};
var COMPANY_POOL = [
	{
		id: "c1",
		name: "삼전전자",
		tier: "대기업",
		category: "반도체/전자",
		baseSalary: 5400,
		stability: 5,
		welfare: 5,
		stressLevel: 4,
		growthPotential: 4,
		badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
		description: "대한민국 1등 대기업. 최고 수준의 초봉과 PS(성과급), 든든한 복지와 치열한 승진 경쟁."
	},
	{
		id: "c2",
		name: "현대모빌리티",
		tier: "대기업",
		category: "완성차/모빌리티",
		baseSalary: 5200,
		stability: 5,
		welfare: 5,
		stressLevel: 3,
		growthPotential: 4,
		badgeColor: "bg-sky-500/10 text-sky-500 border-sky-500/20",
		description: "글로벌 모빌리티 선도 대기업. 높은 고용 안정성과 강력한 노조, 안정적인 연봉 상승."
	},
	{
		id: "c3",
		name: "토스파이낸스",
		tier: "스타트업",
		category: "핀테크 유니콘",
		baseSalary: 4800,
		stability: 3,
		welfare: 4,
		stressLevel: 5,
		growthPotential: 5,
		badgeColor: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
		description: "금융 혁신 유니콘 스타트업. 파격적인 스톡옵션과 빠른 승진, 극강의 업무 몰입도."
	},
	{
		id: "c4",
		name: "당근랩스",
		tier: "스타트업",
		category: "지역 커뮤니티 플랫폼",
		baseSalary: 4500,
		stability: 3,
		welfare: 4,
		stressLevel: 4,
		growthPotential: 5,
		badgeColor: "bg-orange-500/10 text-orange-500 border-orange-500/20",
		description: "국민 플랫폼 스타트업. 자율적인 근무 문화와 수평적인 조직, 개인 성장 극대화."
	},
	{
		id: "c5",
		name: "한국전력에너지",
		tier: "공기업",
		category: "에너지/공공",
		baseSalary: 4100,
		stability: 5,
		welfare: 5,
		stressLevel: 2,
		growthPotential: 2,
		badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
		description: "정년 60세가 철저히 보장되는 신의 직장. 야근 없는 워라밸과 평화로운 근무 환경."
	},
	{
		id: "c6",
		name: "인천국제공항공사",
		tier: "공기업",
		category: "교통/항공",
		baseSalary: 4400,
		stability: 5,
		welfare: 5,
		stressLevel: 2,
		growthPotential: 3,
		badgeColor: "bg-teal-500/10 text-teal-500 border-teal-500/20",
		description: "취준생 선호도 1위 공기업. 영종도의 쾌적한 캠퍼스와 든든한 연금 혜택."
	},
	{
		id: "c7",
		name: "오뚜기식품",
		tier: "중견기업",
		category: "식품/소비재",
		baseSalary: 3800,
		stability: 4,
		welfare: 4,
		stressLevel: 3,
		growthPotential: 3,
		badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
		description: "국민의 사랑을 받는 갓뚜기. 비정규직 없는 탄탄한 기업 윤리와 따뜻한 기업 문화."
	},
	{
		id: "c8",
		name: "한샘리빙테크",
		tier: "중견기업",
		category: "가구/인테리어",
		baseSalary: 3700,
		stability: 4,
		welfare: 3,
		stressLevel: 4,
		growthPotential: 3,
		badgeColor: "bg-rose-500/10 text-rose-500 border-rose-500/20",
		description: "인테리어 선도 중견기업. 영업과 현장 중심의 실행력과 실적 기반 보상."
	},
	{
		id: "c9",
		name: "가온소프트",
		tier: "중소기업",
		category: "SI/솔루션 개발",
		baseSalary: 3200,
		stability: 3,
		welfare: 2,
		stressLevel: 4,
		growthPotential: 4,
		badgeColor: "bg-slate-500/10 text-slate-500 border-slate-500/20",
		description: "실무를 빠르게 배우는 IT 중소기업. 기획부터 배포까지 풀사이클 경험, 빠른 이직 발판."
	},
	{
		id: "c10",
		name: "구글코리아",
		tier: "외국계",
		category: "글로벌 테크",
		baseSalary: 5500,
		stability: 4,
		welfare: 5,
		stressLevel: 3,
		growthPotential: 5,
		badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
		description: "꿈의 직장 글로벌 빅테크 지사. 세 끼 무료 뷔페, 수평적 호칭 문화와 글로벌 이동 기회."
	},
	{
		id: "c11",
		name: "부모님 치킨 프랜차이즈",
		tier: "자영업",
		category: "외식업",
		baseSalary: 3e3,
		stability: 2,
		welfare: 1,
		stressLevel: 4,
		growthPotential: 4,
		badgeColor: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
		description: "가업을 이어받은 자영업의 길. 출퇴근 시간은 내 마음이지만 하루 12시간 튀김기와의 사투."
	}
];
var JOB_ROLES = [
	{
		id: "j1",
		name: "풀스택 개발자",
		category: "개발/IT",
		bonusSkill: "skill",
		description: "코드 한 줄로 서비스를 살리고 죽이는 핵심 엔지니어. 야근과 기술 스터디가 일상."
	},
	{
		id: "j2",
		name: "서비스 기획자 (PM)",
		category: "기획/마케팅",
		bonusSkill: "colleagueRelation",
		description: "개발자와 비즈니스 사이를 조율하는 조율사. 회의와 문서 작성이 주특기."
	},
	{
		id: "j3",
		name: "B2B 영업/사업개발",
		category: "영업/사업",
		bonusSkill: "reputation",
		description: "실적으로 말하는 최전방 공격수. 술자리 접대와 협상 테이블의 지배자."
	},
	{
		id: "j4",
		name: "재무/회계 매니저",
		category: "재무/경영",
		bonusSkill: "bossTrust",
		description: "회사의 곳간을 지키는 깐깐한 살림꾼. 단 1원의 오차도 용납하지 않는 꼼꼼함."
	},
	{
		id: "j5",
		name: "R&D 연구원",
		category: "엔지니어/기술",
		bonusSkill: "skill",
		description: "미래 기술 특허를 개발하는 브레인. 논문과 실험실이 익숙한 연구형 인재."
	},
	{
		id: "j6",
		name: "UI/UX 디자이너",
		category: "디자인",
		bonusSkill: "skill",
		description: "사용자 경험과 심미성을 극대화하는 비주얼 마스터. 픽셀 단위의 집착."
	},
	{
		id: "j7",
		name: "공정/품질관리 기사",
		category: "생산/품질",
		bonusSkill: "bossTrust",
		description: "현장의 불량률 제로를 책임지는 현장 사령관. 안전과 표준이 최우선."
	}
];
var EDUCATION_LIST = [
	{
		name: "고등학교 졸업",
		weight: 1,
		startAge: 24,
		initialCash: 800,
		initialDebt: 0,
		skillBonus: 10,
		repBonus: -5
	},
	{
		name: "전문대학 졸업",
		weight: 2,
		startAge: 25,
		initialCash: 400,
		initialDebt: 1200,
		skillBonus: 5,
		repBonus: 0
	},
	{
		name: "지방 4년제 대학교",
		weight: 4,
		startAge: 26,
		initialCash: 300,
		initialDebt: 2400,
		skillBonus: 0,
		repBonus: 0
	},
	{
		name: "수도권 주요 대학교",
		weight: 4,
		startAge: 26,
		initialCash: 400,
		initialDebt: 2800,
		skillBonus: 5,
		repBonus: 10
	},
	{
		name: "SKY 명문 대학교",
		weight: 2,
		startAge: 27,
		initialCash: 600,
		initialDebt: 3200,
		skillBonus: 15,
		repBonus: 20
	},
	{
		name: "해외 명문 대학교",
		weight: 1,
		startAge: 27,
		initialCash: 1200,
		initialDebt: 4500,
		skillBonus: 15,
		repBonus: 25
	}
];
var MAJOR_LIST = [
	"컴퓨터공학과",
	"경영학부",
	"전자전기공학과",
	"기계공학부",
	"시각디자인학과",
	"경제학과",
	"신소재공학과",
	"국어국문학과",
	"산업공학과",
	"화학공학과"
];
var KOREAN_FIRST_NAMES = [
	"김",
	"이",
	"박",
	"최",
	"정",
	"강",
	"조",
	"윤",
	"장",
	"임",
	"한",
	"오",
	"서",
	"신",
	"권"
];
var KOREAN_GIVEN_NAMES = [
	"도현",
	"민준",
	"서연",
	"지훈",
	"수아",
	"현우",
	"예은",
	"준서",
	"하은",
	"재원",
	"소율",
	"시우",
	"지아",
	"태윤",
	"유진"
];
function generateRandomCharacter() {
	const familyName = KOREAN_FIRST_NAMES[Math.floor(Math.random() * KOREAN_FIRST_NAMES.length)];
	const givenName = KOREAN_GIVEN_NAMES[Math.floor(Math.random() * KOREAN_GIVEN_NAMES.length)];
	const edu = EDUCATION_LIST[Math.floor(Math.random() * EDUCATION_LIST.length)];
	const major = MAJOR_LIST[Math.floor(Math.random() * MAJOR_LIST.length)];
	const specialties = [
		"빠른 업무 습득력",
		"뛰어난 사내 친화력",
		"강철 멘탈 & 인내심",
		"날카로운 숫자 감각",
		"창의적인 기획력",
		"끈기 있는 야근 체력"
	];
	return {
		name: `${familyName}${givenName}`,
		age: edu.startAge,
		education: edu.name,
		major,
		initialDebt: edu.initialDebt,
		initialCash: edu.initialCash,
		specialty: specialties[Math.floor(Math.random() * specialties.length)]
	};
}
function assignInitialCompany(eduName) {
	let weights;
	if (eduName.includes("SKY") || eduName.includes("해외")) weights = [
		35,
		25,
		20,
		10,
		5,
		2,
		3,
		3,
		2,
		20,
		1
	];
	else if (eduName.includes("수도권")) weights = [
		20,
		20,
		25,
		15,
		10,
		8,
		10,
		8,
		8,
		8,
		2
	];
	else if (eduName.includes("지방 4년제")) weights = [
		8,
		10,
		15,
		15,
		15,
		10,
		15,
		12,
		18,
		2,
		4
	];
	else weights = [
		3,
		4,
		10,
		12,
		8,
		5,
		15,
		15,
		25,
		1,
		8
	];
	const totalWeight = weights.reduce((a, b) => a + b, 0);
	let randomVal = Math.random() * totalWeight;
	let chosenCompany = COMPANY_POOL[0];
	for (let i = 0; i < COMPANY_POOL.length; i++) {
		if (randomVal < weights[i]) {
			chosenCompany = COMPANY_POOL[i];
			break;
		}
		randomVal -= weights[i];
	}
	const chosenRole = JOB_ROLES[Math.floor(Math.random() * JOB_ROLES.length)];
	return {
		company: chosenCompany,
		role: chosenRole
	};
}
var LIFE_EVENTS = [
	{
		id: "ev_crisis_server",
		category: "career",
		title: "새벽 2시 대규모 서비스 장애",
		situation: "핵심 배포 이후 메인 시스템이 다운되어 난리가 났다. 당직도 아닌데 단체 카톡방에 불이 났다.",
		options: [{
			text: "택시 타고 즉시 본사로 달려가 밤샘 트러블슈팅",
			description: "체력과 스트레스를 깎고, 상사 신뢰와 평판을 극대화한다.",
			effect: {
				statChanges: {
					stress: 15,
					health: -10,
					bossTrust: 20,
					reputation: 15,
					skill: 5
				},
				cashChange: 15
			},
			probabilitySuccess: .85,
			successResultText: "원인을 찾아 새벽 5시에 정상 복구 완료! 본부장의 극찬을 받았다.",
			failResultText: "원인 파악에 실패해 외주 업체를 불렀다. 피곤하기만 했다."
		}, {
			text: "카톡 알림을 무음으로 해두고 푹 잔다",
			description: "건강을 지키고 스트레스를 피하지만 사내 평판이 하락할 수 있다.",
			effect: { statChanges: {
				stress: -5,
				health: 5,
				bossTrust: -15,
				reputation: -10
			} },
			probabilitySuccess: 1,
			successResultText: "다음 날 아침 이미 상황은 수습되었다. 다만 팀장의 눈총이 따갑다."
		}]
	},
	{
		id: "ev_headhunter",
		category: "career",
		title: "링크드인으로 찾아온 비밀 헤드헌터 제안",
		situation: "경쟁사에서 현재 받는 연봉보다 20% 인상과 직급 승진을 제시하며 은밀한 이직 면접을 제안했다.",
		options: [{
			text: "휴가를 내고 비밀 면접에 응시한다",
			description: "성공 시 연봉이 대폭 오르고 승진하지만, 실패 시 현재 회사에서 소문이 날 수 있다.",
			effect: {
				statChanges: {
					stress: 10,
					reputation: 5
				},
				salaryChange: 1200
			},
			probabilitySuccess: .7,
			successResultText: "면접 합격! 파격적인 조건으로 연봉이 1,200만 원 인상되었다.",
			failResultText: "최종 면접에서 아쉽게 탈락했다. 비밀 면접 본 게 팀장 귀에 들어가 관계가 어색해졌다.",
			failEffect: { statChanges: {
				bossTrust: -15,
				stress: 10
			} }
		}, {
			text: "현재 회사에서의 성장에 집중하며 정중히 거절한다",
			description: "조직에 대한 충성도를 높이고 동료들과의 유대를 다진다.",
			effect: { statChanges: {
				bossTrust: 10,
				colleagueRelation: 10,
				stress: -5
			} },
			probabilitySuccess: 1,
			successResultText: "회사에 충성을 다하기로 했다. 상사가 나의 의리를 높게 평가했다."
		}]
	},
	{
		id: "ev_housing_lottery",
		category: "economic",
		title: "수도권 신도시 특별공급 청약 기회",
		situation: "경쟁률 40:1의 유망 신도시 신축 아파트 청약 접수일이다. 계약금 및 대출을 감당할지 결정해야 한다.",
		options: [{
			text: "영끌 대출을 각오하고 청약에 과감히 도전한다",
			description: "당첨 시 순자산이 퀀텀 점프하지만, 막대한 부채가 생긴다.",
			effect: {
				debtChange: 25e3,
				statChanges: { stress: 20 }
			},
			probabilitySuccess: .55,
			successResultText: "기적처럼 청약 당첨! 입주권 프리미엄이 붙으며 수도권 자가 보유자가 되었다.",
			failResultText: "아쉽게 청약에서 떨어졌다. 청약 통장 점수만 날렸다.",
			failEffect: { statChanges: { stress: 5 } }
		}, {
			text: "무리한 대출은 위험하다. 지금은 현금을 모은다",
			description: "안전하게 자산을 지키며 스트레스를 받지 않는다.",
			effect: {
				statChanges: {
					stress: -5,
					health: 5
				},
				cashChange: 200
			},
			probabilitySuccess: 1,
			successResultText: "현금 비중을 유지하며 시장 상황을 더 지켜보기로 했다."
		}]
	},
	{
		id: "ev_crypto_surge",
		category: "economic",
		title: "가상자산 광풍과 직장 동료들의 코인 단톡방",
		situation: "동료가 어떤 코인으로 3억을 벌어 퇴사한다는 소문이 돌며 온 사무실이 코인 이야기로 시끄럽다.",
		options: [{
			text: "나도 질 수 없다! 비상금 1,000만 원 풀매수",
			description: "대박 아니면 쪽박. 엄청난 변동성에 노출된다.",
			effect: {
				cashChange: -1e3,
				investmentsChange: 2500,
				statChanges: { stress: 15 }
			},
			probabilitySuccess: .45,
			successResultText: "상승장 탑승 성공! 원금이 2.5배로 불어나며 큰 수익을 거두었다.",
			failResultText: "매수하자마자 하락장 폭락! 원금의 60%가 증발했다.",
			failEffect: {
				cashChange: -1e3,
				investmentsChange: 400,
				statChanges: { stress: 25 }
			}
		}, {
			text: "변동성에 휘둘리지 않고 본업과 주식 분산투자에 집중한다",
			description: "멘탈을 지키며 업무에 전념한다.",
			effect: { statChanges: {
				skill: 5,
				reputation: 5,
				stress: -5
			} },
			probabilitySuccess: 1,
			successResultText: "코인 시장이 곧 폭락했다. 물리지 않고 본업을 지킨 현명한 선택이었다."
		}]
	},
	{
		id: "ev_burnout_holiday",
		category: "personal",
		title: "극심한 번아웃과 2주간의 안식 휴가 찬스",
		situation: "매일 아침 눈뜰 때마다 가슴이 답답하다. 이번 프로젝트가 끝나고 장기 연차를 쓸 기회가 생겼다.",
		options: [{
			text: "눈치 보지 않고 2주 동안 해외여행을 떠난다",
			description: "경비가 들지만 건강과 스트레스가 완전히 리셋된다.",
			effect: {
				cashChange: -400,
				statChanges: {
					stress: -35,
					health: 25,
					colleagueRelation: -5
				}
			},
			probabilitySuccess: 1,
			successResultText: "발리 해변에서 푹 쉬며 잃어버렸던 삶의 활력을 되찾았다!"
		}, {
			text: "연차를 아끼고 보너스로 환급받는다",
			description: "돈은 모이지만 피로가 계속 누적된다.",
			effect: {
				cashChange: 150,
				statChanges: {
					stress: 15,
					health: -10
				}
			},
			probabilitySuccess: 1,
			successResultText: "연차 수당은 들어왔지만 만성 피로가 어깨를 짓누른다."
		}]
	},
	{
		id: "ev_boss_dinner",
		category: "career",
		title: "임원 주관 금요일 밤 3차 회식 강요",
		situation: "금요일 밤 10시, 2차가 끝났는데 본부장이 \"오늘 밤 새자\"며 3차 노래방을 외친다.",
		options: [{
			text: "마이크를 잡고 탬버린을 흔들며 분위기 메이커를 자처한다",
			description: "다음 날 간 건강은 포기하지만, 임원의 확실한 눈도장을 찍는다.",
			effect: { statChanges: {
				bossTrust: 25,
				health: -15,
				stress: 10,
				reputation: 5
			} },
			probabilitySuccess: .9,
			successResultText: "임원의 애창곡 듀엣 성공! 다음 주부터 인사 평가에서 특혜를 약속받았다.",
			failResultText: "과음으로 다음 날 출근 지각 사고를 쳤다.",
			failEffect: { statChanges: {
				reputation: -10,
				health: -20
			} }
		}, {
			text: "가족 핑계를 대고 정중하게 도망친다",
			description: "건강과 주말을 지키지만 상사의 서운함을 감수해야 한다.",
			effect: { statChanges: {
				health: 10,
				stress: -10,
				bossTrust: -10
			} },
			probabilitySuccess: 1,
			successResultText: "지하철 막차를 타고 귀가해 주말을 온전히 휴식으로 보냈다."
		}]
	},
	{
		id: "ev_startup_founding",
		category: "career",
		title: "대학 동기의 초기 스타트업 공동창업 제안",
		situation: "실리콘밸리 엑셀러레이터 출신 친구가 AI 플랫폼 창업을 함께하자며 스톡옵션 15%와 초기 이사직을 제안했다.",
		options: [{
			text: "과감하게 사표를 던지고 스타트업에 합류한다",
			description: "안정적인 직장을 떠나 유니콘 창업의 길로 뛰어든다. (리스크 극상)",
			effect: { statChanges: {
				skill: 20,
				stress: 25
			} },
			probabilitySuccess: .4,
			successResultText: "시리즈 A 100억 투자 유치 성공! 기업가치가 폭등하며 스톡옵션 대박이 터졌다.",
			failResultText: "1년 만에 시드 머니가 바닥났다. 월급도 밀려 다시 구직 시장으로 나왔다.",
			failEffect: {
				cashChange: -1500,
				statChanges: {
					stress: 30,
					health: -15
				}
			}
		}, {
			text: "친구는 응원하되, 나는 안정적인 직장을 유지한다",
			description: "현재의 커리어 트랙을 지키며 리스크를 회피한다.",
			effect: { statChanges: {
				stress: -5,
				colleagueRelation: 5
			} },
			probabilitySuccess: 1,
			successResultText: "직장에서의 안정적인 성장을 택했다. 마음 편히 매달 월급을 받는다."
		}]
	},
	{
		id: "ev_patent_award",
		category: "career",
		title: "사내 직무발명 특허 출원과 직무 포상금",
		situation: "지난 반년간 연구개발한 독자적인 비즈니스 로직이 사내 우수 발명으로 선정되었다.",
		options: [{
			text: "회사 명의로 특허 등록하고 포상금과 인사 가점을 받는다",
			description: "확실한 연봉 인상과 사내 평판 급상승.",
			effect: {
				cashChange: 500,
				statChanges: {
					reputation: 25,
					skill: 15,
					bossTrust: 15
				},
				salaryChange: 400
			},
			probabilitySuccess: 1,
			successResultText: "사내 기술대상 수상! 전사 공지에 내 이름이 대문짝만하게 실렸다."
		}]
	},
	{
		id: "ev_colleague_conflict",
		category: "career",
		title: "내 성과를 가로채려는 얌체 선배와의 갈등",
		situation: "내가 밤새워 작성한 제안서에 자기 이름을 1저자로 올려 임원 보고를 하려는 선배가 있다.",
		options: [{
			text: "모든 수정 히스토리와 메일을 첨부해 임원에게 직접 소명한다",
			description: "정의를 구현하지만 선배와의 사내 관계는 파탄 난다.",
			effect: { statChanges: {
				reputation: 15,
				colleagueRelation: -20,
				stress: 15
			} },
			probabilitySuccess: .8,
			successResultText: "임원이 진실을 확인하고 나를 단독 PM으로 임명했다. 선배는 좌천되었다.",
			failResultText: "임원이 \"사내에서 분란 일으키지 말라\"며 양비론으로 넘겼다.",
			failEffect: { statChanges: {
				reputation: -10,
				bossTrust: -15
			} }
		}, {
			text: "이번엔 양보하고, 다음엔 선배 몰래 독자 채널을 뚫는다",
			description: "갈등을 피하고 조용히 다음 기회를 노린다.",
			effect: { statChanges: {
				stress: 15,
				colleagueRelation: 5
			} },
			probabilitySuccess: 1,
			successResultText: "속은 쓰리지만 다음 프로젝트에서는 완벽한 보안을 유지하기로 했다."
		}]
	},
	{
		id: "ev_marriage_talk",
		category: "personal",
		title: "인생의 중대사, 결혼과 신혼집 마련 고민",
		situation: "연인과 진지하게 결혼을 논의 중이다. 양가 인사와 예식, 신혼집 전세 자금을 마련해야 한다.",
		options: [{
			text: "스몰 웨딩과 실속 있는 전세로 알뜰하게 시작한다",
			description: "지출을 최소화하고 스트레스를 낮춘다.",
			effect: {
				cashChange: -3e3,
				statChanges: {
					health: 10,
					stress: -10,
					reputation: 10
				}
			},
			probabilitySuccess: 1,
			successResultText: "마음 맞는 반려자와 함께 평온하고 안정된 가정을 꾸렸다."
		}, {
			text: "호텔 예식과 무리한 대출로 강남권 신혼집을 계약한다",
			description: "화려함과 사회적 체면을 얻지만 큰 빚을 진다.",
			effect: {
				cashChange: -6e3,
				debtChange: 15e3,
				statChanges: {
					reputation: 25,
					stress: 25
				}
			},
			probabilitySuccess: 1,
			successResultText: "주변의 엄청난 부러움을 샀지만, 매달 대출 원리금 갚느라 허리가 휜다."
		}]
	},
	{
		id: "ev_restructuring_crisis",
		category: "crisis",
		title: "전사적 구조조정과 희망퇴직 권고",
		situation: "글로벌 경기 침체로 본사에서 대규모 인력 감축을 선언했다. 연봉 2년 치 위로금을 제시하며 희망퇴직 신청을 받는다.",
		options: [{
			text: "위로금을 챙겨 명예퇴직하고 재취업/창업을 모색한다",
			description: "일시불 목돈을 확보하지만 당분간 무직 상태가 된다.",
			effect: {
				cashChange: 8e3,
				statChanges: {
					stress: -20,
					health: 15,
					bossTrust: -20
				}
			},
			probabilitySuccess: .8,
			successResultText: "위로금 8,000만 원을 수령하고 퇴사! 그동안 지쳤던 몸과 마음을 추스른다.",
			failResultText: "퇴직금 정산 과정에서 갈등이 있었지만 무사히 수령했다."
		}, {
			text: "절대 나갈 수 없다! 악착같이 버텨 사내에 잔류한다",
			description: "자리는 지키지만 남은 동료들의 몫까지 격무를 감당해야 한다.",
			effect: { statChanges: {
				stress: 25,
				health: -10,
				bossTrust: 15,
				skill: 10
			} },
			probabilitySuccess: 1,
			successResultText: "살아남았다! 인원 감축 후 팀의 핵심 기둥으로 자리 잡았다."
		}]
	},
	{
		id: "ev_overseas_expat",
		category: "career",
		title: "미국 실리콘밸리 지사 주재원 파견 기회",
		situation: "해외 법인 확장 프로젝트로 2년간 미국 주재원으로 나갈 직원을 선발한다. 체재비 지원과 연봉 30% 할증이 붙는다.",
		options: [{
			text: "주재원에 전격 지원해 글로벌 커리어를 쌓는다",
			description: "영어를 극복해야 하지만 커리어 퀀텀 점프의 기회.",
			effect: {
				salaryChange: 1800,
				statChanges: {
					skill: 25,
					reputation: 20,
					stress: 15
				}
			},
			probabilitySuccess: .75,
			successResultText: "주재원 최종 합격! 캘리포니아 법인에서 글로벌 프로젝트를 리드하게 되었다.",
			failResultText: "아쉽게 영어 인터뷰에서 밀려 고배를 마셨다.",
			failEffect: { statChanges: { stress: 5 } }
		}, {
			text: "한국에 남아 가족과 현재 생활에 집중한다",
			description: "익숙하고 편안한 국내 본사에서 안정적으로 일한다.",
			effect: { statChanges: {
				stress: -10,
				colleagueRelation: 10
			} },
			probabilitySuccess: 1,
			successResultText: "국내 본사에서 든든하게 중심을 지키며 가족과 화목한 시간을 보냈다."
		}]
	},
	{
		id: "ev_side_hustle",
		category: "economic",
		title: "퇴근 후 시작한 IT 부업과 유튜브 강의 대박",
		situation: "주말과 퇴근 후 틈틈이 운영한 직무 팁 블로그와 유튜브 채널이 알고리즘을 타고 폭발적인 인기를 끌기 시작했다.",
		options: [{
			text: "부업에 본격적인 투자와 유료 클래스를 개설한다",
			description: "야근 피로는 늘어나지만 제2의 현금 파이프라인이 열린다.",
			effect: {
				cashChange: 2500,
				investmentsChange: 1500,
				statChanges: {
					stress: 15,
					health: -10,
					skill: 10
				}
			},
			probabilitySuccess: .85,
			successResultText: "월 부수입 500만 원 돌파! 회사 월급 이상의 현금 파이프라인을 구축했다.",
			failResultText: "강의 플랫폼 수수료와 악플로 스트레스만 받았다.",
			failEffect: {
				cashChange: 500,
				statChanges: { stress: 15 }
			}
		}, {
			text: "겸업 금지 조항이 신경 쓰인다. 취미 수준으로만 즐긴다",
			description: "위험을 피하고 마음 편히 지낸다.",
			effect: { statChanges: {
				stress: -5,
				reputation: 5
			} },
			probabilitySuccess: 1,
			successResultText: "소소한 취미로 남겨두어 직장 생활에 아무런 지장을 주지 않았다."
		}]
	},
	{
		id: "ev_ethics_whistleblower",
		category: "crisis",
		title: "팀장의 납품 업체 리베이트 횡령 발견",
		situation: "예산 결산 검토 중 직속 팀장이 특정 협력업체로부터 수천만 원 상당의 뇌물을 받아온 명백한 증거를 발견했다.",
		options: [{
			text: "사내 감사팀에 증거를 제출하고 내부 고발한다",
			description: "정의롭지만 사내 정치적 후폭풍에 노출될 수 있다.",
			effect: { statChanges: {
				reputation: 30,
				bossTrust: -30,
				stress: 20
			} },
			probabilitySuccess: .9,
			successResultText: "감사 결과 팀장이 해임되고 준법 표창을 받았다! 사내 영웅으로 떠올랐다.",
			failResultText: "팀장이 감사팀 윗선과 친분이 있어 오히려 보복성 인사이동을 당할 뻔했다.",
			failEffect: { statChanges: {
				reputation: -15,
				stress: 25
			} }
		}, {
			text: "못 본 척 눈감고 조용히 내 업무만 한다",
			description: "위험을 피하지만 양심의 가책을 느낀다.",
			effect: { statChanges: {
				stress: 10,
				colleagueRelation: -5
			} },
			probabilitySuccess: 1,
			successResultText: "아무 일 없었다는 듯 조용히 넘어갔다. 뒷맛은 씁쓸하다."
		}]
	}
];
var ENDINGS_POOL = [
	{
		id: "end_ceo",
		title: "대기업 대표이사(CEO) 등극",
		subtitle: "신입사원에서 시작해 재계의 정점에 선 전설적인 샐러리맨 신화",
		category: "legend",
		icon: "Crown",
		description: "탁월한 역량과 불굴의 생존력으로 임원을 넘어 그룹 대표이사에 올랐습니다. 당신의 자서전이 베스트셀러에 오르고 수많은 직장인들의 롤모델이 되었습니다.",
		shareMessage: "신입사원에서 대기업 대표이사(CEO)까지 등극! 직장인 인생 시뮬레이션 클리어!"
	},
	{
		id: "end_fire",
		title: "조기 은퇴 파이어(FIRE)족 달성",
		subtitle: "순자산 20억 달성! 40대에 명예롭게 은퇴한 금융의 승리자",
		category: "wealth",
		icon: "Palmtree",
		description: "철저한 절약과 영리한 투자로 40대에 경제적 자유를 완성했습니다. 월요일 아침 알람 없이 눈을 뜨며 세계 일주를 즐기는 진정한 인생의 승리자입니다.",
		shareMessage: "순자산 20억 돌파로 40대 파이어(FIRE)족 조기 은퇴 달성!"
	},
	{
		id: "end_retirement",
		title: "명예로운 60세 정년퇴직",
		subtitle: "30여 년간 비바람을 견뎌내고 당당하게 완주한 참된 직장인",
		category: "peaceful",
		icon: "Award",
		description: "수많은 위기와 구조조정 속에서도 흔들림 없이 가정을 지키고 정년을 맞이했습니다. 든든한 국민연금과 퇴직금, 그리고 존경하는 동료들의 박수 속에 은퇴합니다.",
		shareMessage: "30년 근속! 명예로운 60세 정년퇴직으로 당당히 완주했습니다."
	},
	{
		id: "end_unicorn",
		title: "유니콘 스타트업 창업 성공 신화",
		subtitle: "사표 던지고 창업한 회사가 기업가치 1조 원 유니콘으로!",
		category: "legend",
		icon: "Rocket",
		description: "남들이 가지 않은 험난한 길을 걸어 유니콘 기업을 일궈냈습니다. 나스닥 상장과 대규모 엑시트로 수백억 자산가가 되었습니다.",
		shareMessage: "유니콘 스타트업 창업 성공! 수백억 자산가 등극!"
	},
	{
		id: "end_super_ant",
		title: "여의도 슈퍼개미 등극",
		subtitle: "월급은 거들 뿐! 주식과 투자로 순자산 30억 돌파",
		category: "wealth",
		icon: "TrendingUp",
		description: "회사는 4대 보험과 신용대출을 위한 수단이었을 뿐. 철저한 종목 분석과 복리의 마법으로 여의도 증권가에서도 주목하는 슈퍼개미가 되었습니다.",
		shareMessage: "월급쟁이에서 여의도 슈퍼개미 등극! 투자 순자산 30억 돌파!"
	},
	{
		id: "end_burnout",
		title: "만성 번아웃 중도 퇴사",
		subtitle: "몸과 마음의 한계에 도달해 회사를 떠난 휴식의 시간",
		category: "crisis",
		icon: "ZapOff",
		description: "끊임없는 야근과 실적 압박으로 스트레스 수치 100%에 도달했습니다. 비록 커리어는 멈췄지만, 생명과 영혼을 지키기 위한 용기 있는 멈춤이었습니다.",
		shareMessage: "만성 번아웃으로 퇴사했습니다. 이제는 푹 쉴 시간입니다."
	},
	{
		id: "end_health_crisis",
		title: "건강 악화 강제 요양",
		subtitle: "일만 하다가 몸을 망친 현대인의 안타까운 자화상",
		category: "crisis",
		icon: "HeartCrack",
		description: "연봉과 승진에 매달리다 건강을 잃었습니다. 병원 침대에 누워 \"건강을 잃으면 모든 것을 잃는다\"는 진리를 뼈저리게 깨닫고 요양을 시작합니다.",
		shareMessage: "건강 악화로 강제 은퇴... 돈보다 건강이 먼저입니다."
	},
	{
		id: "end_bankruptcy",
		title: "영끌 투자 실패 파산",
		subtitle: "무리한 레버리지와 투자 실패로 빚더미에 앉은 비운의 결말",
		category: "crisis",
		icon: "AlertTriangle",
		description: "한 방을 노린 무리한 대출과 투자 실패로 부채가 자산을 압도했습니다. 월급의 전부가 이자로 빠져나가는 신용회복위원회의 길을 걷게 되었습니다.",
		shareMessage: "무리한 영끌 투자로 파산... 분산투자의 중요성을 배웠습니다."
	},
	{
		id: "end_chicken",
		title: "자영업 치킨집 사장님",
		subtitle: "퇴직금으로 오픈한 동네 1등 치킨집! 기름 냄새 속 소소한 행복",
		category: "peaceful",
		icon: "Store",
		description: "직장 생활을 정리하고 치킨 프랜차이즈를 오픈했습니다. 상사 잔소리 없이 내 가게를 운영하며 배달의민족 맛집 랭킹 1위를 차지했습니다.",
		shareMessage: "회사 탈출 후 치킨집 사장님으로 제2의 인생 시작!"
	},
	{
		id: "end_job_hopper",
		title: "연봉 퀀텀 점프 글로벌 프로 이직러",
		subtitle: "5번의 이직 끝에 실리콘밸리 본사로! 커리어 패스의 승리자",
		category: "wealth",
		icon: "Compass",
		description: "한 회사에 얽매이지 않고 실력 하나로 몸값을 올렸습니다. 국내외 유수 기업을 거치며 독보적인 전문성과 높은 연봉을 거머쥐었습니다.",
		shareMessage: "5번의 이직 끝에 글로벌 테크 본사 입성! 프로 이직러의 승리!"
	},
	{
		id: "end_peaceful_worker",
		title: "평온한 만년 과장의 지혜",
		subtitle: "승진 경쟁은 사양합니다! 워라밸과 가정을 지킨 현명한 삶",
		category: "peaceful",
		icon: "Coffee",
		description: "부장, 임원 승진을 위해 영혼을 갈아넣는 대신 정시 퇴근과 취미 생활을 택했습니다. 큰 부자는 아니지만 가장 행복한 가정을 꾸렸습니다.",
		shareMessage: "워라밸 100%! 스트레스 없이 행복한 직장 생활을 완주했습니다."
	},
	{
		id: "end_civil_god",
		title: "공기업 철밥통 종신",
		subtitle: "칼퇴와 안정성의 끝판왕! 호봉제 연봉과 평온한 노후",
		category: "peaceful",
		icon: "ShieldCheck",
		description: "사기업 동기들이 구조조정에 떨 때, 호봉이 매년 따박따박 오르는 공기업에서 무사고로 완주했습니다. 대한민국 최고의 철밥통입니다.",
		shareMessage: "공기업 무사고 30년 완주! 철밥통 신화를 달성했습니다."
	}
];
function determineEnding(stats, assets, level, age, company, jobHopCount) {
	const netWorth = assets.cash + assets.investments + assets.realEstate - assets.debt;
	if (stats.stress >= 100) return ENDINGS_POOL.find((e) => e.id === "end_burnout");
	if (stats.health <= 10) return ENDINGS_POOL.find((e) => e.id === "end_health_crisis");
	if (netWorth < -1e4) return ENDINGS_POOL.find((e) => e.id === "end_bankruptcy");
	if (age <= 48 && netWorth >= 2e5) return ENDINGS_POOL.find((e) => e.id === "end_fire");
	if (assets.investments >= 3e5) return ENDINGS_POOL.find((e) => e.id === "end_super_ant");
	if (level === "임원" && stats.reputation >= 85 && stats.skill >= 80) return ENDINGS_POOL.find((e) => e.id === "end_ceo");
	if (company.tier === "스타트업" && netWorth >= 1e5 && stats.skill >= 80) return ENDINGS_POOL.find((e) => e.id === "end_unicorn");
	if (jobHopCount >= 4 && netWorth >= 8e4) return ENDINGS_POOL.find((e) => e.id === "end_job_hopper");
	if (company.tier === "공기업" && age >= 58) return ENDINGS_POOL.find((e) => e.id === "end_civil_god");
	if (age >= 60) {
		if (netWorth >= 1e5) return ENDINGS_POOL.find((e) => e.id === "end_retirement");
		return ENDINGS_POOL.find((e) => e.id === "end_peaceful_worker");
	}
	if (company.tier === "자영업" || netWorth < 1e4) return ENDINGS_POOL.find((e) => e.id === "end_chicken");
	return ENDINGS_POOL.find((e) => e.id === "end_peaceful_worker");
}
//#endregion
//#region src/components/games/WorkLifeSimulation.tsx
var LOCAL_STORAGE_KEY = "stock_insight_worklife_active_game";
var WorkLifeSimulation = () => {
	const { user } = useApp();
	const [step, setStep] = (0, import_react.useState)("LOBBY");
	const [activeGame, setActiveGame] = (0, import_react.useState)(null);
	const [candidateCharacter, setCandidateCharacter] = (0, import_react.useState)(null);
	const [candidateOffer, setCandidateOffer] = (0, import_react.useState)(null);
	const [pastRecords, setPastRecords] = (0, import_react.useState)([]);
	const [viewingPastRecords, setViewingPastRecords] = (0, import_react.useState)(false);
	const [isProcessing, setIsProcessing] = (0, import_react.useState)(false);
	const [copyFeedback, setCopyFeedback] = (0, import_react.useState)(false);
	const [activeActionModal, setActiveActionModal] = (0, import_react.useState)(null);
	const [actionMessage, setActionMessage] = (0, import_react.useState)(null);
	const isMountedRef = (0, import_react.useRef)(true);
	const messageTimeoutRef = (0, import_react.useRef)(null);
	const copyTimeoutRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
			if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
			if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
		};
	}, []);
	const showActionMessage = (0, import_react.useCallback)((msg, durationMs = 3e3) => {
		if (!isMountedRef.current) return;
		if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
		setActionMessage(msg);
		messageTimeoutRef.current = setTimeout(() => {
			if (isMountedRef.current) setActionMessage(null);
		}, durationMs);
	}, []);
	(0, import_react.useEffect)(() => {
		const loadInitialData = async () => {
			let loadedActive = null;
			if (user?.id) try {
				const remoteState = await firebaseRepository.getActiveOfficeGame(user.id);
				if (remoteState && remoteState.character && remoteState.company) loadedActive = remoteState;
				const records = await firebaseRepository.getOfficeGameRecords(user.id);
				if (isMountedRef.current) setPastRecords(records);
			} catch (err) {
				console.warn("[WorkLifeSimulation] Error loading remote game:", err);
			}
			if (!loadedActive) try {
				const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
				if (cached) loadedActive = JSON.parse(cached);
			} catch (e) {
				console.warn("Local storage parse error:", e);
			}
			if (isMountedRef.current && loadedActive) setActiveGame(loadedActive);
		};
		loadInitialData();
	}, [user?.id]);
	const persistActiveGame = (0, import_react.useCallback)(async (state) => {
		if (!state) {
			localStorage.removeItem(LOCAL_STORAGE_KEY);
			if (user?.id) await firebaseRepository.clearActiveOfficeGame(user.id).catch(() => {});
			return;
		}
		try {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
		} catch (e) {
			console.warn("Failed to save to localStorage:", e);
		}
		if (user?.id) try {
			await firebaseRepository.saveActiveOfficeGame(user.id, state);
		} catch (e) {
			console.warn("Failed to save active game to Firebase:", e);
		}
	}, [user?.id]);
	const handleInitiateNewGame = () => {
		const char = generateRandomCharacter();
		const offer = assignInitialCompany(char.education);
		setCandidateCharacter(char);
		setCandidateOffer(offer);
		setStep("OFFER_REVEAL");
	};
	const handleAcceptOffer = () => {
		if (!candidateCharacter || !candidateOffer) return;
		const { company, role } = candidateOffer;
		const initialSalary = Math.round(company.baseSalary * JOB_LEVEL_SALARY_MULTIPLIER["신입"]);
		const initialStats = {
			skill: 45 + (role.bonusSkill === "skill" ? 15 : 0),
			reputation: 50 + (role.bonusSkill === "reputation" ? 15 : 0),
			health: 85,
			stress: 20 + company.stressLevel * 4,
			bossTrust: 50 + (role.bonusSkill === "bossTrust" ? 15 : 0),
			colleagueRelation: 50 + (role.bonusSkill === "colleagueRelation" ? 15 : 0)
		};
		const initialAssets = {
			cash: candidateCharacter.initialCash,
			investments: 0,
			realEstate: 0,
			debt: candidateCharacter.initialDebt,
			housingTier: "월세 원룸",
			investmentStrategy: "stock_portfolio"
		};
		const initialTimeline = [{
			year: 1,
			age: candidateCharacter.age,
			level: "신입",
			companyName: company.name,
			title: `${company.name} 입사`,
			description: `${candidateCharacter.education} / ${candidateCharacter.major} 졸업 후 ${company.name} ${role.name}(신입)으로 입사! (초봉 ${initialSalary.toLocaleString()}만 원)`,
			badge: "랜덤 입사",
			netWorth: initialAssets.cash - initialAssets.debt
		}];
		const firstEvent = LIFE_EVENTS[Math.floor(Math.random() * LIFE_EVENTS.length)];
		const newGame = {
			character: candidateCharacter,
			company,
			role,
			level: "신입",
			currentSalary: initialSalary,
			totalEarnings: initialSalary,
			age: candidateCharacter.age,
			year: 1,
			stats: initialStats,
			assets: initialAssets,
			jobHopCount: 0,
			timeline: initialTimeline,
			currentEvent: firstEvent,
			lastEventResult: null,
			annualSettlement: null
		};
		setActiveGame(newGame);
		persistActiveGame(newGame);
		setStep("PLAYING");
	};
	const handleSelectEventOption = (optionIndex) => {
		if (!activeGame || !activeGame.currentEvent || isProcessing) return;
		setIsProcessing(true);
		const event = activeGame.currentEvent;
		const option = event.options[optionIndex];
		if (!option) {
			setIsProcessing(false);
			return;
		}
		const isSuccess = Math.random() < (option.probabilitySuccess ?? 1);
		const appliedEffect = isSuccess ? option.effect : option.failEffect || option.effect;
		const resultText = isSuccess ? option.successResultText : option.failResultText || option.successResultText;
		const updatedStats = {
			skill: Math.max(0, Math.min(100, activeGame.stats.skill + (appliedEffect.statChanges?.skill ?? 0))),
			reputation: Math.max(0, Math.min(100, activeGame.stats.reputation + (appliedEffect.statChanges?.reputation ?? 0))),
			health: Math.max(0, Math.min(100, activeGame.stats.health + (appliedEffect.statChanges?.health ?? 0))),
			stress: Math.max(0, Math.min(100, activeGame.stats.stress + (appliedEffect.statChanges?.stress ?? 0))),
			bossTrust: Math.max(0, Math.min(100, activeGame.stats.bossTrust + (appliedEffect.statChanges?.bossTrust ?? 0))),
			colleagueRelation: Math.max(0, Math.min(100, activeGame.stats.colleagueRelation + (appliedEffect.statChanges?.colleagueRelation ?? 0)))
		};
		const updatedAssets = {
			...activeGame.assets,
			cash: Math.max(0, activeGame.assets.cash + (appliedEffect.cashChange ?? 0)),
			investments: Math.max(0, activeGame.assets.investments + (appliedEffect.investmentsChange ?? 0)),
			debt: Math.max(0, activeGame.assets.debt + (appliedEffect.debtChange ?? 0))
		};
		const updatedSalary = Math.max(2400, activeGame.currentSalary + (appliedEffect.salaryChange ?? 0));
		const diffs = [];
		if (appliedEffect.cashChange) diffs.push(`현금 ${appliedEffect.cashChange > 0 ? "+" : ""}${appliedEffect.cashChange}만`);
		if (appliedEffect.salaryChange) diffs.push(`연봉 ${appliedEffect.salaryChange > 0 ? "+" : ""}${appliedEffect.salaryChange}만`);
		if (appliedEffect.statChanges?.stress) diffs.push(`스트레스 ${appliedEffect.statChanges.stress > 0 ? "+" : ""}${appliedEffect.statChanges.stress}%`);
		if (appliedEffect.statChanges?.health) diffs.push(`건강 ${appliedEffect.statChanges.health > 0 ? "+" : ""}${appliedEffect.statChanges.health}%`);
		if (appliedEffect.statChanges?.reputation) diffs.push(`평판 ${appliedEffect.statChanges.reputation > 0 ? "+" : ""}${appliedEffect.statChanges.reputation}%`);
		const updatedTimeline = [...activeGame.timeline, {
			year: activeGame.year,
			age: activeGame.age,
			level: activeGame.level,
			companyName: activeGame.company.name,
			title: event.title,
			description: `${option.text} 선택 → ${resultText}`,
			netWorth: updatedAssets.cash + updatedAssets.investments + updatedAssets.realEstate - updatedAssets.debt
		}];
		const nextState = {
			...activeGame,
			stats: updatedStats,
			assets: updatedAssets,
			currentSalary: updatedSalary,
			currentEvent: null,
			lastEventResult: {
				text: resultText,
				success: isSuccess,
				changesText: diffs.join(" | ")
			},
			timeline: updatedTimeline
		};
		const immediateEnding = checkGameOverCondition(nextState);
		if (immediateEnding) {
			handleTriggerEnding(nextState, immediateEnding);
			setIsProcessing(false);
			return;
		}
		setActiveGame(nextState);
		persistActiveGame(nextState);
		setIsProcessing(false);
	};
	const handleAdvanceYear = () => {
		if (!activeGame || isProcessing) return;
		if ((activeGame.timeline[activeGame.timeline.length - 1]?.year || 0) >= activeGame.year) return;
		setIsProcessing(true);
		const nextAge = activeGame.age + 1;
		const nextYear = activeGame.year + 1;
		const grossSalary = activeGame.currentSalary;
		const taxes = Math.round(grossSalary * .15);
		const netSalary = grossSalary - taxes;
		let livingCost = 1600;
		if (activeGame.assets.housingTier === "월세 원룸") livingCost += 800;
		else if (activeGame.assets.housingTier === "전세 오피스텔") livingCost += 300;
		else livingCost += 500;
		let debtPayment = 0;
		let newDebt = activeGame.assets.debt;
		if (newDebt > 0) {
			const interest = Math.round(newDebt * .05);
			const principalPay = Math.min(newDebt, 1e3);
			debtPayment = interest + principalPay;
			newDebt -= principalPay;
		}
		let investmentProfit = 0;
		let newInvestments = activeGame.assets.investments;
		if (newInvestments > 0) {
			let returnRate = .03;
			if (activeGame.assets.investmentStrategy === "stock_portfolio") returnRate = (Math.floor(Math.random() * 46) - 15) / 100;
			else if (activeGame.assets.investmentStrategy === "crypto_growth") returnRate = (Math.floor(Math.random() * 96) - 35) / 100;
			else if (activeGame.assets.investmentStrategy === "real_estate_focus") returnRate = (Math.floor(Math.random() * 11) + 5) / 100;
			investmentProfit = Math.round(newInvestments * returnRate);
			newInvestments = Math.max(0, newInvestments + investmentProfit);
		}
		const netSavings = netSalary - livingCost - debtPayment;
		let newCash = Math.max(0, activeGame.assets.cash + netSavings);
		if (activeGame.assets.cash + netSavings < 0) {
			newDebt += Math.abs(activeGame.assets.cash + netSavings);
			newCash = 0;
		}
		if (newCash > 2e3) {
			const autoInvest = Math.round((newCash - 1500) * .4);
			newInvestments += autoInvest;
			newCash -= autoInvest;
		}
		const updatedAssets = {
			...activeGame.assets,
			cash: newCash,
			investments: newInvestments,
			debt: newDebt
		};
		let newLevel = activeGame.level;
		let salaryIncrease = Math.round(activeGame.currentSalary * .05);
		let promotionOccurred = false;
		const currentLevelIndex = JOB_LEVEL_LIST.indexOf(activeGame.level);
		if (currentLevelIndex < JOB_LEVEL_LIST.length - 1 && activeGame.stats.skill >= 60 + currentLevelIndex * 5 && activeGame.stats.bossTrust >= 60 && activeGame.stats.reputation >= 60 && Math.random() < .65) {
			newLevel = JOB_LEVEL_LIST[currentLevelIndex + 1];
			promotionOccurred = true;
			salaryIncrease += 800 + currentLevelIndex * 300;
		}
		const updatedSalary = activeGame.currentSalary + salaryIncrease;
		const nextEvent = LIFE_EVENTS[Math.floor(Math.random() * LIFE_EVENTS.length)];
		const updatedTimeline = [...activeGame.timeline, {
			year: nextYear,
			age: nextAge,
			level: newLevel,
			companyName: activeGame.company.name,
			title: promotionOccurred ? `🎉 ${newLevel} 승진!` : `${nextYear}년차 연말 결산`,
			description: promotionOccurred ? `${activeGame.company.name}에서 ${newLevel}으로 승진! 연봉이 ${updatedSalary.toLocaleString()}만 원으로 인상되었습니다.` : `1년 근속 완료. (연간 소득: +${grossSalary.toLocaleString()}만 / 지출: -${livingCost.toLocaleString()}만 / 투자손익: ${investmentProfit >= 0 ? "+" : ""}${investmentProfit.toLocaleString()}만)`,
			badge: promotionOccurred ? "승진" : void 0,
			netWorth: updatedAssets.cash + updatedAssets.investments + updatedAssets.realEstate - updatedAssets.debt
		}];
		const nextState = {
			...activeGame,
			age: nextAge,
			year: nextYear,
			level: newLevel,
			currentSalary: updatedSalary,
			totalEarnings: activeGame.totalEarnings + grossSalary,
			assets: updatedAssets,
			timeline: updatedTimeline,
			currentEvent: nextEvent,
			lastEventResult: null,
			annualSettlement: {
				salaryEarned: grossSalary,
				taxes,
				livingExpenses: livingCost,
				investmentProfit,
				debtPaid: debtPayment,
				netSavings
			}
		};
		const ending = checkGameOverCondition(nextState);
		if (ending) {
			handleTriggerEnding(nextState, ending);
			setIsProcessing(false);
			return;
		}
		setActiveGame(nextState);
		persistActiveGame(nextState);
		setIsProcessing(false);
	};
	const handleUpdateInvestmentStrategy = (strategy) => {
		if (!activeGame) return;
		const updated = {
			...activeGame,
			assets: {
				...activeGame.assets,
				investmentStrategy: strategy
			}
		};
		setActiveGame(updated);
		persistActiveGame(updated);
		setActiveActionModal(null);
		showActionMessage("투자 전략이 성공적으로 변경되었습니다.");
	};
	const handleUpgradeHousing = (tier) => {
		if (!activeGame) return;
		let requiredCash = 0;
		let addedDebt = 0;
		let addedRealEstate = 0;
		if (tier === "전세 오피스텔") {
			requiredCash = 8e3;
			if (activeGame.assets.cash < requiredCash) {
				alert(`보증금 8,000만 원이 필요합니다. (현재 현금: ${activeGame.assets.cash.toLocaleString()}만)`);
				return;
			}
		} else if (tier === "수도권 아파트") {
			requiredCash = 2e4;
			addedDebt = 35e3;
			addedRealEstate = 55e3;
			if (activeGame.assets.cash < requiredCash) {
				alert(`자기자본 2억 원이 필요합니다. (현재 현금: ${activeGame.assets.cash.toLocaleString()}만)`);
				return;
			}
		} else if (tier === "상급지 아파트") {
			requiredCash = 5e4;
			addedDebt = 7e4;
			addedRealEstate = 12e4;
			if (activeGame.assets.cash < requiredCash) {
				alert(`자기자본 5억 원이 필요합니다. (현재 현금: ${activeGame.assets.cash.toLocaleString()}만)`);
				return;
			}
		}
		const updatedAssets = {
			...activeGame.assets,
			cash: activeGame.assets.cash - requiredCash,
			debt: activeGame.assets.debt + addedDebt,
			realEstate: activeGame.assets.realEstate + addedRealEstate,
			housingTier: tier
		};
		const updatedTimeline = [...activeGame.timeline, {
			year: activeGame.year,
			age: activeGame.age,
			level: activeGame.level,
			companyName: activeGame.company.name,
			title: `🏠 ${tier} 입주 성공!`,
			description: `내 집 마련 테크트리 달성! 주거 환경이 ${tier}(으)로 업그레이드되었습니다.`,
			badge: "주거 업그레이드",
			netWorth: updatedAssets.cash + updatedAssets.investments + updatedAssets.realEstate - updatedAssets.debt
		}];
		const nextState = {
			...activeGame,
			assets: updatedAssets,
			timeline: updatedTimeline,
			stats: {
				...activeGame.stats,
				reputation: Math.min(100, activeGame.stats.reputation + 15),
				stress: Math.max(0, activeGame.stats.stress - 15)
			}
		};
		setActiveGame(nextState);
		persistActiveGame(nextState);
		setActiveActionModal(null);
		showActionMessage(`축하합니다! ${tier}(으)로 이사했습니다.`);
	};
	const handleAttemptJobHop = () => {
		if (!activeGame || isProcessing) return;
		setIsProcessing(true);
		const otherCompanies = COMPANY_POOL.filter((c) => c.name !== activeGame.company.name);
		const targetCompany = otherCompanies[Math.floor(Math.random() * otherCompanies.length)];
		const successChance = (activeGame.stats.skill * .5 + activeGame.stats.reputation * .5) / 100;
		if (Math.random() < successChance) {
			const salaryBump = Math.round(activeGame.currentSalary * .2);
			const newSalary = activeGame.currentSalary + salaryBump;
			const updatedTimeline = [...activeGame.timeline, {
				year: activeGame.year,
				age: activeGame.age,
				level: activeGame.level,
				companyName: targetCompany.name,
				title: `🚀 ${targetCompany.name} 경력 이직 성공`,
				description: `${activeGame.company.name}에서 ${targetCompany.name}(으)로 이직! 연봉이 ${salaryBump.toLocaleString()}만 원 인상되었습니다.`,
				badge: "경력 이직",
				netWorth: activeGame.assets.cash + activeGame.assets.investments + activeGame.assets.realEstate - activeGame.assets.debt
			}];
			const nextState = {
				...activeGame,
				company: targetCompany,
				currentSalary: newSalary,
				jobHopCount: activeGame.jobHopCount + 1,
				stats: {
					...activeGame.stats,
					stress: Math.max(0, activeGame.stats.stress - 10),
					reputation: Math.min(100, activeGame.stats.reputation + 10),
					bossTrust: 50
				},
				timeline: updatedTimeline
			};
			setActiveGame(nextState);
			persistActiveGame(nextState);
			setActiveActionModal(null);
			showActionMessage(`이직 성공! ${targetCompany.name}에 합류했습니다. (연봉 +${salaryBump.toLocaleString()}만)`);
		} else {
			const nextState = {
				...activeGame,
				stats: {
					...activeGame.stats,
					stress: Math.min(100, activeGame.stats.stress + 10),
					bossTrust: Math.max(0, activeGame.stats.bossTrust - 10)
				}
			};
			setActiveGame(nextState);
			persistActiveGame(nextState);
			setActiveActionModal(null);
			showActionMessage("이직 면접에서 탈락했습니다. 회사에 소문이 살짝 돌아 스트레스가 올랐습니다.", 3500);
		}
		if (isMountedRef.current) setIsProcessing(false);
	};
	const checkGameOverCondition = (state) => {
		const netWorth = state.assets.cash + state.assets.investments + state.assets.realEstate - state.assets.debt;
		if (state.stats.stress >= 100) return determineEnding(state.stats, state.assets, state.level, state.age, state.company, state.jobHopCount);
		if (state.stats.health <= 10) return determineEnding(state.stats, state.assets, state.level, state.age, state.company, state.jobHopCount);
		if (netWorth < -15e3) return determineEnding(state.stats, state.assets, state.level, state.age, state.company, state.jobHopCount);
		if (state.age >= 60) return determineEnding(state.stats, state.assets, state.level, state.age, state.company, state.jobHopCount);
		if (state.age <= 48 && netWorth >= 2e5) return determineEnding(state.stats, state.assets, state.level, state.age, state.company, state.jobHopCount);
		return null;
	};
	const handleTriggerEnding = async (finalState, ending) => {
		setStep("ENDING");
		const netWorth = finalState.assets.cash + finalState.assets.investments + finalState.assets.realEstate - finalState.assets.debt;
		const archiveRecord = {
			characterName: finalState.character.name,
			education: finalState.character.education,
			finalAge: finalState.age,
			yearsPlayed: finalState.year,
			finalCompany: finalState.company.name,
			finalRole: finalState.role.name,
			finalLevel: finalState.level,
			finalSalary: finalState.currentSalary,
			finalNetWorth: netWorth,
			totalEarnings: finalState.totalEarnings,
			endingTitle: ending.title,
			endingSubtitle: ending.subtitle,
			endingCategory: ending.category,
			timeline: finalState.timeline,
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (user?.id) {
			await firebaseRepository.saveOfficeGameRecord(user.id, archiveRecord).catch(console.warn);
			await firebaseRepository.clearActiveOfficeGame(user.id).catch(console.warn);
			const updatedList = await firebaseRepository.getOfficeGameRecords(user.id).catch(() => []);
			setPastRecords(updatedList);
		}
		localStorage.removeItem(LOCAL_STORAGE_KEY);
	};
	const handleBackToLobby = () => {
		setStep("LOBBY");
	};
	const handleShareResult = () => {
		if (!activeGame) return;
		const netWorth = activeGame.assets.cash + activeGame.assets.investments + activeGame.assets.realEstate - activeGame.assets.debt;
		const shareText = `[병돌 인베스트먼트 직장인 인생 시뮬레이션]\n\n🏆 결과: ${determineEnding(activeGame.stats, activeGame.assets, activeGame.level, activeGame.age, activeGame.company, activeGame.jobHopCount).title}\n👤 캐릭터: ${activeGame.character.name} (${activeGame.character.education})\n💼 마지막 직장: ${activeGame.company.name} (${activeGame.level})\n🎂 최종 나이: ${activeGame.age}세 (${activeGame.year}년차)\n💰 최종 순자산: ${(netWorth / 1e4).toFixed(2)}억 원\n💵 최종 연봉: ${activeGame.currentSalary.toLocaleString()}만 원\n\n지금 바로 플레이해보세요!`;
		navigator.clipboard.writeText(shareText);
		if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
		setCopyFeedback(true);
		copyTimeoutRef.current = setTimeout(() => {
			if (isMountedRef.current) setCopyFeedback(false);
		}, 2500);
	};
	const currentNetWorth = (0, import_react.useMemo)(() => {
		if (!activeGame) return 0;
		return activeGame.assets.cash + activeGame.assets.investments + activeGame.assets.realEstate - activeGame.assets.debt;
	}, [activeGame]);
	if (step === "LOBBY") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5" }), "장기 커리어 & 자산 시뮬레이터"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight",
						children: "랜덤입사 인생 시뮬레이션"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-slate-500 dark:text-slate-400 text-sm mt-1.5",
						children: "첫 직장 무작위 배정부터 연도별 커리어, 자산 투자, 부동산, 이직, 그리고 은퇴까지."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setViewingPastRecords(!viewingPastRecords),
						className: "px-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-3.5 h-3.5" }), viewingPastRecords ? "게임으로" : `명예의 전당 (${pastRecords.length})`]
					})
				})]
			}), viewingPastRecords ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-base font-bold text-slate-900 dark:text-white flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-4 h-4 text-amber-500" }), "완료된 인생 기록 보관소"]
				}), pastRecords.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center py-12 text-slate-400 text-sm border border-dashed border-slate-200 dark:border-slate-800 rounded-xl",
					children: "아직 완료된 인생 시뮬레이션 기록이 없습니다. 새로운 인생을 시작해보세요!"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-4",
					children: pastRecords.map((rec, idx) => {
						const data = rec.resultData || rec;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-sm text-slate-900 dark:text-white",
										children: data.endingTitle || "인생 마감"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400",
										children: data.timestamp ? new Date(data.timestamp).toLocaleDateString() : ""
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-slate-500 dark:text-slate-400",
									children: [
										data.characterName,
										" (",
										data.education,
										") | ",
										data.finalCompany,
										" (",
										data.finalLevel,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 pt-1 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"최종 나이: ",
											data.finalAge,
											"세"
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"순자산: ",
											((data.finalNetWorth || 0) / 1e4).toFixed(1),
											"억 원"
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"최종 연봉: ",
											(data.finalSalary || 0).toLocaleString(),
											"만"
										] })
									]
								})
							]
						}, idx);
					})
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid grid-cols-1 md:grid-cols-2 gap-6",
				children: [activeGame && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/40 rounded-2xl p-6 flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500 text-white",
								children: "진행 중인 인생"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-slate-400",
								children: [
									activeGame.year,
									"년차 (",
									activeGame.age,
									"세)"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-lg font-bold text-slate-900 dark:text-white mt-2",
							children: [
								activeGame.character.name,
								" (",
								activeGame.company.name,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-slate-500 dark:text-slate-400 mt-1",
							children: [
								activeGame.role.name,
								" / 직급: ",
								activeGame.level,
								" | 연봉: ",
								activeGame.currentSalary.toLocaleString(),
								"만 원"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 pt-3 border-t border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-500",
								children: "순자산"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-slate-900 dark:text-white",
								children: [
									(currentNetWorth / 1e4).toFixed(2),
									"억 원 (",
									currentNetWorth.toLocaleString(),
									"만 원)"
								]
							})]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setStep("PLAYING"),
						className: "mt-6 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-4 h-4 fill-white" }), "이어서 진행하기"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "w-5 h-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-bold text-slate-900 dark:text-white",
							children: "새로운 인생 시작하기"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed",
							children: "랜덤으로 캐릭터 스펙(이름, 학력, 전공, 초기 자산/부채)이 주어지고, 대기업/스타트업/공기업/중견기업 중 한 곳에 첫 입사합니다."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleInitiateNewGame,
						className: "mt-6 w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4" }), "새 인생 시작 (랜덤 주사위 굴리기)"]
					})]
				})]
			})]
		})
	});
	if (step === "OFFER_REVEAL" && candidateCharacter && candidateOffer) {
		const { company, role } = candidateOffer;
		const startSalary = Math.round(company.baseSalary * JOB_LEVEL_SALARY_MULTIPLIER["신입"]);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border-2 border-indigo-500/30 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute top-4 right-4 sm:top-8 sm:right-8 opacity-15 pointer-events-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-32 h-32 text-indigo-500" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center space-y-2 border-b border-slate-100 dark:border-slate-800 pb-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-3.5 h-3.5" }), "최종 합격 통지서 (OFFER LETTER)"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl sm:text-3xl font-black text-slate-900 dark:text-white",
								children: "축하합니다! 합격을 알립니다"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 dark:text-slate-400",
								children: "치열한 채용 전형을 거쳐 귀하를 신입사원으로 정식 채용합니다."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-bold text-slate-400 uppercase tracking-wider",
								children: "지원자 프로필"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 block text-[11px]",
										children: "이름 (수정 가능)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: candidateCharacter.name,
										onChange: (e) => setCandidateCharacter({
											...candidateCharacter,
											name: e.target.value
										}),
										className: "font-bold text-slate-900 dark:text-white text-sm bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 focus:outline-none focus:border-indigo-500 w-24"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 block text-[11px]",
										children: "나이"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold text-slate-800 dark:text-slate-200",
										children: [candidateCharacter.age, "세"]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 block text-[11px]",
										children: "최종 학력"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-slate-800 dark:text-slate-200",
										children: candidateCharacter.education
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 block text-[11px]",
										children: "전공"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-slate-800 dark:text-slate-200",
										children: candidateCharacter.major
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-500",
									children: "초기 보유 자산"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-slate-800 dark:text-slate-200",
									children: [
										"현금 ",
										candidateCharacter.initialCash,
										"만 원 / 학자금 부채 ",
										candidateCharacter.initialDebt,
										"만 원"
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${company.badgeColor}`,
									children: [
										company.tier,
										" · ",
										company.category
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-2xl font-black text-slate-900 dark:text-white mt-1.5",
									children: company.name
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-slate-400 block",
										children: "계약 초봉"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400",
										children: [startSalary.toLocaleString(), "만 원"]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-600 dark:text-slate-300 bg-indigo-50/40 dark:bg-indigo-950/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/30",
								children: company.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-slate-400 block",
											children: "배정 직무"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-slate-900 dark:text-white",
											children: role.name
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-slate-400 block",
											children: "고용 안정성"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-emerald-500",
											children: "★".repeat(company.stability)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-slate-400 block",
											children: "사내 복지"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-amber-500",
											children: "★".repeat(company.welfare)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-slate-400 block",
											children: "야근/스트레스"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-rose-500",
											children: "★".repeat(company.stressLevel)
										})]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col sm:flex-row gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleInitiateNewGame,
							className: "py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3.5 h-3.5" }), "다른 조건으로 다시 뽑기"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleAcceptOffer,
							className: "flex-1 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4" }), "입사 승락하고 첫 출근하기!"]
						})]
					})
				]
			})
		});
	}
	if (step === "PLAYING" && activeGame) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			actionMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 rounded-2xl bg-indigo-600 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg animate-in slide-in-from-top-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: actionMessage })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black text-xl shrink-0",
							children: activeGame.character.name.slice(0, 1)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl font-black text-slate-900 dark:text-white",
									children: activeGame.character.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold",
									children: [
										activeGame.age,
										"세 (",
										activeGame.year,
										"년차)"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `text-[11px] px-2 py-0.5 rounded-md font-semibold border ${activeGame.company.badgeColor}`,
									children: [
										activeGame.company.name,
										" · ",
										activeGame.company.tier
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
							children: [
								"직무: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-slate-700 dark:text-slate-300",
									children: activeGame.role.name
								}),
								" | 직급:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-indigo-600 dark:text-indigo-400",
									children: activeGame.level
								})
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-400 block text-[11px]",
								children: "계약 연봉"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-black text-sm text-slate-900 dark:text-white",
								children: [activeGame.currentSalary.toLocaleString(), "만"]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-px h-6 bg-slate-200 dark:bg-slate-800" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-400 block text-[11px]",
								children: "월 예상 수령"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-slate-700 dark:text-slate-300",
								children: [
									"약 ",
									Math.round(activeGame.currentSalary * .85 / 12).toLocaleString(),
									"만"
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-px h-6 bg-slate-200 dark:bg-slate-800" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-400 block text-[11px]",
								children: "누적 총수입"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-emerald-600 dark:text-emerald-400",
								children: [activeGame.totalEarnings.toLocaleString(), "만"]
							})] })
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-xs mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-slate-500 flex items-center gap-1 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "w-3.5 h-3.5 text-blue-500" }), " 업무역량"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-slate-900 dark:text-white",
									children: [activeGame.stats.skill, "%"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-blue-500 h-full rounded-full transition-all",
									style: { width: `${activeGame.stats.skill}%` }
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-xs mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-slate-500 flex items-center gap-1 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-3.5 h-3.5 text-amber-500" }), " 사내평판"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-slate-900 dark:text-white",
									children: [activeGame.stats.reputation, "%"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-amber-500 h-full rounded-full transition-all",
									style: { width: `${activeGame.stats.reputation}%` }
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-xs mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-slate-500 flex items-center gap-1 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "w-3.5 h-3.5 text-rose-500" }), " 건강"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-slate-900 dark:text-white",
									children: [activeGame.stats.health, "%"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `h-full rounded-full transition-all ${activeGame.stats.health < 30 ? "bg-rose-600 animate-pulse" : "bg-rose-500"}`,
									style: { width: `${activeGame.stats.health}%` }
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-xs mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-slate-500 flex items-center gap-1 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-3.5 h-3.5 text-orange-500" }), " 스트레스"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-slate-900 dark:text-white",
									children: [activeGame.stats.stress, "%"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `h-full rounded-full transition-all ${activeGame.stats.stress > 70 ? "bg-orange-600 animate-pulse" : "bg-orange-500"}`,
									style: { width: `${activeGame.stats.stress}%` }
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-xs mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-slate-500 flex items-center gap-1 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-3.5 h-3.5 text-indigo-500" }), " 상사신뢰"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-slate-900 dark:text-white",
									children: [activeGame.stats.bossTrust, "%"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-indigo-500 h-full rounded-full transition-all",
									style: { width: `${activeGame.stats.bossTrust}%` }
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-xs mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-slate-500 flex items-center gap-1 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-3.5 h-3.5 text-emerald-500" }), " 동료관계"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-slate-900 dark:text-white",
									children: [activeGame.stats.colleagueRelation, "%"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-emerald-500 h-full rounded-full transition-all",
									style: { width: `${activeGame.stats.colleagueRelation}%` }
								})
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-5 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm col-span-2 sm:col-span-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-slate-400 font-medium block",
								children: "순자산 (Net Worth)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-lg font-black text-indigo-600 dark:text-indigo-400 mt-1",
								children: [(currentNetWorth / 1e4).toFixed(2), "억"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-slate-400 block mt-0.5",
								children: [currentNetWorth.toLocaleString(), "만 원"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] text-slate-400 font-medium flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "w-3.5 h-3.5 text-amber-500" }), " 보유 현금"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-base font-bold text-slate-900 dark:text-white mt-1",
							children: [activeGame.assets.cash.toLocaleString(), "만"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] text-slate-400 font-medium flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3.5 h-3.5 text-blue-500" }), " 투자 자산"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-base font-bold text-slate-900 dark:text-white mt-1",
							children: [activeGame.assets.investments.toLocaleString(), "만"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-slate-400 font-medium flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "w-3.5 h-3.5 text-emerald-500" }), " 부동산/주거"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-bold text-slate-900 dark:text-white mt-1 truncate",
								children: activeGame.assets.housingTier
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-slate-400",
								children: activeGame.assets.realEstate > 0 ? `${(activeGame.assets.realEstate / 1e4).toFixed(1)}억` : "자가 없음"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] text-slate-400 font-medium flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeAlert, { className: "w-3.5 h-3.5 text-rose-500" }), " 총 부채"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-base font-bold text-rose-500 mt-1",
							children: [activeGame.assets.debt.toLocaleString(), "만"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 overflow-x-auto pb-1 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveActionModal("INVEST"),
						className: "px-3.5 py-2 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3.5 h-3.5 text-blue-500" }),
							"투자 전략 (",
							activeGame.assets.investmentStrategy === "safe_savings" ? "안전예금" : activeGame.assets.investmentStrategy === "stock_portfolio" ? "우량주" : activeGame.assets.investmentStrategy === "crypto_growth" ? "하이리스크코인" : "부동산집중",
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveActionModal("HOUSING"),
						className: "px-3.5 py-2 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "w-3.5 h-3.5 text-emerald-500" }), "주거 업그레이드"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveActionModal("JOB_HOP"),
						className: "px-3.5 py-2 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "w-3.5 h-3.5 text-amber-500" }), "이직 시장 탐색"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveActionModal("REST"),
						className: "px-3.5 py-2 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "w-3.5 h-3.5 text-rose-500" }), "휴식 & 재충전 (-150만)"]
					})
				]
			}),
			activeActionModal === "INVEST" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 text-blue-500" }), "가상 투자 전략 설정"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveActionModal(null),
							className: "text-xs text-slate-400 hover:text-slate-600",
							children: "닫기"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400",
						children: "매년 결산 시 투자 자산에 적용될 포트폴리오를 선택하세요."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleUpdateInvestmentStrategy("safe_savings"),
								className: `p-3 rounded-xl border text-left text-xs transition-all ${activeGame.assets.investmentStrategy === "safe_savings" ? "border-blue-500 bg-blue-500/10" : "border-slate-200 dark:border-slate-800 hover:border-slate-300"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-slate-900 dark:text-white",
									children: "안전 예적금 올인"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-slate-500 mt-1",
									children: "원금 보장, 연 3% 안정적인 확정 금리. 원금 손실 0%."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleUpdateInvestmentStrategy("stock_portfolio"),
								className: `p-3 rounded-xl border text-left text-xs transition-all ${activeGame.assets.investmentStrategy === "stock_portfolio" ? "border-indigo-500 bg-indigo-500/10" : "border-slate-200 dark:border-slate-800 hover:border-slate-300"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-slate-900 dark:text-white",
									children: "국내외 우량주 분산투자 (추천)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-slate-500 mt-1",
									children: "연간 수익률 -15% ~ +30%. 적절한 리스크와 복리 성장."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleUpdateInvestmentStrategy("crypto_growth"),
								className: `p-3 rounded-xl border text-left text-xs transition-all ${activeGame.assets.investmentStrategy === "crypto_growth" ? "border-orange-500 bg-orange-500/10" : "border-slate-200 dark:border-slate-800 hover:border-slate-300"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-slate-900 dark:text-white",
									children: "하이리스크 코인 & 성장주"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-slate-500 mt-1",
									children: "연간 수익률 -35% ~ +60%. 대박 아니면 쪽박의 롤러코스터."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleUpdateInvestmentStrategy("real_estate_focus"),
								className: `p-3 rounded-xl border text-left text-xs transition-all ${activeGame.assets.investmentStrategy === "real_estate_focus" ? "border-emerald-500 bg-emerald-500/10" : "border-slate-200 dark:border-slate-800 hover:border-slate-300"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-slate-900 dark:text-white",
									children: "부동산 펀드 및 리츠"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-slate-500 mt-1",
									children: "연간 5% ~ 15% 꾸준한 배당과 완만한 시세 차익."
								})]
							})
						]
					})
				]
			}),
			activeActionModal === "HOUSING" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "w-4 h-4 text-emerald-500" }), "주거 업그레이드 (내 집 마련)"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveActionModal(null),
							className: "text-xs text-slate-400 hover:text-slate-600",
							children: "닫기"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400",
						children: [
							"현재 주거: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-slate-900 dark:text-white",
								children: activeGame.assets.housingTier
							}),
							" | 보유 현금:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-indigo-600",
								children: [activeGame.assets.cash.toLocaleString(), "만 원"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleUpgradeHousing("전세 오피스텔"),
								className: "p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left text-xs space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-slate-900 dark:text-white",
										children: "전세 오피스텔 이사"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-emerald-500 font-semibold",
										children: "필요 현금: 8,000만 원"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-slate-400 text-[11px]",
										children: "월세 지출을 대폭 줄이고 쾌적한 1인 주거 환경."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleUpgradeHousing("수도권 아파트"),
								className: "p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left text-xs space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-slate-900 dark:text-white",
										children: "수도권 25평 신축 아파트"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-emerald-500 font-semibold",
										children: "자기자본 2억 / 대출 3.5억"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-slate-400 text-[11px]",
										children: "자가 보유 뱃지 획득! 평판 +15, 스트레스 -15."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleUpgradeHousing("상급지 아파트"),
								className: "p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left text-xs space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-slate-900 dark:text-white",
										children: "강남/마용성 랜드마크 아파트"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-emerald-500 font-semibold",
										children: "자기자본 5억 / 대출 7억"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-slate-400 text-[11px]",
										children: "대한민국 최고 부촌 입성. 엄청난 자산 가치 상승."
									})
								]
							})
						]
					})
				]
			}),
			activeActionModal === "JOB_HOP" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "w-4 h-4 text-amber-500" }), "경력직 이직 시장 도전"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveActionModal(null),
							className: "text-xs text-slate-400 hover:text-slate-600",
							children: "닫기"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400 leading-relaxed",
						children: [
							"현재 스펙(업무역량 ",
							activeGame.stats.skill,
							"%, 평판 ",
							activeGame.stats.reputation,
							"%)을 기반으로 다른 회사로의 경력 이직을 시도합니다. 성공 시 연봉이 20% 인상되며 새로운 커리어가 열립니다."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-2 flex gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleAttemptJobHop,
							disabled: isProcessing,
							className: "px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-4 h-4" }), "이직 면접 응시하기"]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white dark:bg-[#131722] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm",
				children: activeGame.currentEvent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 animate-in fade-in duration-150",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60",
								children: [
									activeGame.year,
									"년차 (",
									activeGame.age,
									"세) 주요 사건"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-slate-400 flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3.5 h-3.5" }),
									activeGame.company.name,
									" 사내 뉴스"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white",
							children: activeGame.currentEvent.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 leading-relaxed",
							children: activeGame.currentEvent.situation
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3 pt-2",
							children: activeGame.currentEvent.options.map((opt, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: isProcessing,
								onClick: () => handleSelectEventOption(idx),
								className: "w-full text-left p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-900/60 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/40 hover:border-indigo-500/50 transition-all group flex items-start justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
										children: opt.text
									}), opt.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-slate-500 dark:text-slate-400",
										children: opt.description
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-5 h-5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" })]
							}, idx))
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 text-center py-4",
					children: [
						activeGame.lastEventResult && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `p-6 rounded-2xl border text-left space-y-2 ${activeGame.lastEventResult.success ? "bg-emerald-500/10 border-emerald-500/30" : "bg-rose-500/10 border-rose-500/30"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [activeGame.lastEventResult.success ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-5 h-5 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-5 h-5 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-sm text-slate-900 dark:text-white",
										children: ["선택 결과: ", activeGame.lastEventResult.success ? "성공" : "예기치 못한 결과"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-slate-700 dark:text-slate-200",
									children: activeGame.lastEventResult.text
								}),
								activeGame.lastEventResult.changesText && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs font-semibold text-slate-500 dark:text-slate-400 pt-1",
									children: ["변동: ", activeGame.lastEventResult.changesText]
								})
							]
						}),
						activeGame.annualSettlement && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-left text-xs space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-4 h-4 text-emerald-500" }), "연간 경제 결산 보고서"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 block text-[11px]",
										children: "연봉 수령"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-emerald-500",
										children: [
											"+",
											activeGame.annualSettlement.salaryEarned.toLocaleString(),
											"만"
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 block text-[11px]",
										children: "생활비 & 세금"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-rose-500",
										children: [
											"-",
											(activeGame.annualSettlement.livingExpenses + activeGame.annualSettlement.taxes).toLocaleString(),
											"만"
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 block text-[11px]",
										children: "투자 손익"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `font-bold ${activeGame.annualSettlement.investmentProfit >= 0 ? "text-blue-500" : "text-rose-500"}`,
										children: [
											activeGame.annualSettlement.investmentProfit >= 0 ? "+" : "",
											activeGame.annualSettlement.investmentProfit.toLocaleString(),
											"만"
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 block text-[11px]",
										children: "순 저축/잉여금"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-slate-900 dark:text-white",
										children: [
											activeGame.annualSettlement.netSavings >= 0 ? "+" : "",
											activeGame.annualSettlement.netSavings.toLocaleString(),
											"만"
										]
									})] })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleAdvanceYear,
								disabled: isProcessing,
								className: "w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base shadow-lg shadow-indigo-600/20 inline-flex items-center justify-center gap-2 transition-all",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-5 h-5" }),
									"다음 해로 넘어가기 (",
									activeGame.age + 1,
									"세, ",
									activeGame.year + 1,
									"년차)"
								]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-4 h-4 text-indigo-500" }), "인생 연표 (타임라인)"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-slate-400",
						children: [activeGame.timeline.length, "개의 주요 기록"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3 max-h-64 overflow-y-auto pr-1",
					children: activeGame.timeline.slice().reverse().map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 text-xs flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-indigo-600 dark:text-indigo-400",
										children: [
											item.age,
											"세 (",
											item.year,
											"년차)"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-slate-900 dark:text-white",
										children: item.title
									}),
									item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20",
										children: item.badge
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-slate-500 dark:text-slate-400",
								children: item.description
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] font-bold text-slate-400 shrink-0",
							children: [(item.netWorth / 1e4).toFixed(1), "억"]
						})]
					}, idx))
				})]
			})
		]
	});
	if (step === "ENDING" && activeGame) {
		const ending = determineEnding(activeGame.stats, activeGame.assets, activeGame.level, activeGame.age, activeGame.company, activeGame.jobHopCount);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center space-y-3 border-b border-slate-100 dark:border-slate-800 pb-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-16 h-16 rounded-3xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto shadow-inner",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-8 h-8 text-amber-500" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold tracking-widest text-slate-400 uppercase",
										children: "LIFE SIMULATION ENDING"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight",
										children: ending.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold text-indigo-600 dark:text-indigo-400",
										children: ending.subtitle
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed pt-2",
								children: ending.description
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-slate-400 block",
										children: "최종 나이"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-lg font-black text-slate-900 dark:text-white",
										children: [activeGame.age, "세"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-slate-400 block mt-0.5",
										children: [activeGame.year, "년 완주"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-slate-400 block",
										children: "최종 순자산"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-lg font-black text-emerald-500",
										children: [(currentNetWorth / 1e4).toFixed(2), "억"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-slate-400 block mt-0.5",
										children: [currentNetWorth.toLocaleString(), "만 원"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-slate-400 block",
										children: "최종 직급"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-lg font-black text-indigo-500",
										children: activeGame.level
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-400 block mt-0.5",
										children: activeGame.company.name
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-slate-400 block",
										children: "누적 총소득"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-lg font-black text-slate-900 dark:text-white",
										children: [(activeGame.totalEarnings / 1e4).toFixed(1), "억"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-400 block mt-0.5",
										children: "평생 번 월급"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-xs font-bold text-slate-400 uppercase tracking-wider",
							children: "주요 인생 사건 연표"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2 max-h-52 overflow-y-auto pr-1",
							children: activeGame.timeline.map((entry, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-xs flex justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-indigo-600 dark:text-indigo-400 mr-2",
									children: [entry.age, "세"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-slate-800 dark:text-slate-200",
									children: entry.title
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-slate-400 text-[11px]",
									children: [(entry.netWorth / 1e4).toFixed(1), "억"]
								})]
							}, idx))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleShareResult,
								className: "py-3 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-4 h-4 text-indigo-500" }), copyFeedback ? "결과 복사 완료!" : "결과 카드 텍스트 복사"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleInitiateNewGame,
								className: "flex-1 py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4" }), "새로운 인생 시작하기"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleBackToLobby,
								className: "py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800",
								children: "로비로"
							})
						]
					})
				]
			})
		});
	}
	return null;
};
var createBoard$1 = () => Array(15).fill(null).map(() => Array(15).fill(null));
var checkWin = (board, row, col, player) => {
	for (const [dr, dc] of [
		[0, 1],
		[1, 0],
		[1, 1],
		[1, -1]
	]) {
		let count = 1;
		for (let i = 1; i < 5; i++) {
			const r = row + dr * i;
			const c = col + dc * i;
			if (r >= 0 && r < 15 && c >= 0 && c < 15 && board[r][c] === player) count++;
			else break;
		}
		for (let i = 1; i < 5; i++) {
			const r = row - dr * i;
			const c = col - dc * i;
			if (r >= 0 && r < 15 && c >= 0 && c < 15 && board[r][c] === player) count++;
			else break;
		}
		if (count >= 5) return true;
	}
	return false;
};
var evaluateBoard = (board) => {
	let score = 0;
	for (let r = 0; r < 15; r++) for (let c = 0; c < 15; c++) if (board[r][c] === "black") score += 7 - Math.abs(r - 7) + (7 - Math.abs(c - 7));
	else if (board[r][c] === "white") score -= 7 - Math.abs(r - 7) + (7 - Math.abs(c - 7));
	return score;
};
var getAvailableMoves = (board) => {
	const moves = [];
	for (let r = 0; r < 15; r++) for (let c = 0; c < 15; c++) if (!board[r][c]) moves.push({
		r,
		c
	});
	return moves;
};
var minimax = (board, depth, alpha, beta, isMaximizing) => {
	if (depth === 0) return evaluateBoard(board);
	const moves = getAvailableMoves(board);
	if (isMaximizing) {
		let maxEval = -Infinity;
		for (const move of moves) {
			board[move.r][move.c] = "black";
			const ev = minimax(board, depth - 1, alpha, beta, false);
			board[move.r][move.c] = null;
			maxEval = Math.max(maxEval, ev);
			alpha = Math.max(alpha, ev);
			if (beta <= alpha) break;
		}
		return maxEval;
	} else {
		let minEval = Infinity;
		for (const move of moves) {
			board[move.r][move.c] = "white";
			const ev = minimax(board, depth - 1, alpha, beta, true);
			board[move.r][move.c] = null;
			minEval = Math.min(minEval, ev);
			beta = Math.min(beta, ev);
			if (beta <= alpha) break;
		}
		return minEval;
	}
};
var getBestMove = (board, aiPlayer, difficulty) => {
	const depth = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : difficulty === "hard" ? 3 : 4;
	const moves = getAvailableMoves(board);
	let bestMove = moves[0];
	let bestEval = aiPlayer === "black" ? -Infinity : Infinity;
	for (const move of moves) {
		board[move.r][move.c] = aiPlayer;
		const ev = minimax(board, depth - 1, -Infinity, Infinity, aiPlayer === "white");
		board[move.r][move.c] = null;
		if (aiPlayer === "black" ? ev > bestEval : ev < bestEval) {
			bestEval = ev;
			bestMove = move;
		}
	}
	return bestMove;
};
//#endregion
//#region src/components/games/GomokuGame.tsx
var GomokuGame = () => {
	const { user } = useApp();
	const [board, setBoard] = (0, import_react.useState)(createBoard$1());
	const [turn, setTurn] = (0, import_react.useState)("black");
	const [winner, setWinner] = (0, import_react.useState)(null);
	const [gameMode, setGameMode] = (0, import_react.useState)("pva");
	const [aiDifficulty, setAiDifficulty] = (0, import_react.useState)("medium");
	const [playerColor, setPlayerColor] = (0, import_react.useState)("black");
	const [isAiThinking, setIsAiThinking] = (0, import_react.useState)(false);
	const [onlineMatchId, setOnlineMatchId] = (0, import_react.useState)(null);
	const [matchData, setMatchData] = (0, import_react.useState)(null);
	const makeMove = (0, import_react.useCallback)(async (r, c) => {
		if (board[r][c] || winner || isAiThinking) return;
		if (gameMode === "online" && matchData) {
			if (matchData.status !== "playing" || turn !== (user?.id === matchData.blackPlayerId ? "black" : "white")) return;
		}
		const newBoard = board.map((row) => [...row]);
		newBoard[r][c] = turn;
		const nextTurn = turn === "black" ? "white" : "black";
		const isWin = checkWin(newBoard, r, c, turn);
		const winResult = isWin ? turn : getBestMove(newBoard, "black", "easy") === null ? "draw" : null;
		if (gameMode === "online" && onlineMatchId) {
			await firebaseRepository.updateMatchMove(onlineMatchId, newBoard, nextTurn, winResult);
			if (isWin) await firebaseRepository.updateUserStats(user.id, 1500, true, false);
		} else {
			setBoard(newBoard);
			if (isWin) setWinner(turn);
			else setTurn(nextTurn);
		}
	}, [
		board,
		turn,
		winner,
		isAiThinking,
		gameMode,
		onlineMatchId,
		matchData,
		user
	]);
	(0, import_react.useEffect)(() => {
		if (gameMode === "online" && onlineMatchId) return firebaseRepository.subscribeMatch(onlineMatchId, (data) => {
			setMatchData(data);
			setBoard(data.boardState);
			setTurn(data.turn);
			setWinner(data.winner || null);
		});
	}, [gameMode, onlineMatchId]);
	(0, import_react.useEffect)(() => {
		if (gameMode === "pva" && turn !== playerColor && !winner) {
			setIsAiThinking(true);
			setTimeout(() => {
				const move = getBestMove(board, turn, aiDifficulty);
				makeMove(move.r, move.c);
				setIsAiThinking(false);
			}, 500);
		}
	}, [
		gameMode,
		turn,
		playerColor,
		winner,
		board,
		aiDifficulty,
		makeMove
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center space-y-6 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 w-full max-w-md bg-white dark:bg-[#131722] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-bold text-slate-800 dark:text-slate-200",
				children: winner ? winner === "draw" ? "무승부!" : `${winner === "black" ? "흑" : "백"} 승리!` : isAiThinking ? "AI가 수를 계산 중입니다..." : `${turn === "black" ? "흑" : "백"}의 차례`
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 w-full",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "flex-1 text-sm p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800",
					value: gameMode,
					onChange: (e) => setGameMode(e.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "pvp",
							children: "사람 vs 사람"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "pva",
							children: "사람 vs AI"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "online",
							children: "온라인 매칭"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg text-sm hover:bg-indigo-700 transition",
					onClick: () => {
						setBoard(createBoard$1());
						setTurn("black");
						setWinner(null);
					},
					children: "재시작"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-0 border-2 border-slate-900 bg-amber-100 shadow-xl",
			style: { gridTemplateColumns: `repeat(15, minmax(0, 1fr))` },
			children: board.map((row, r) => row.map((cell, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "w-8 h-8 sm:w-10 sm:h-10 border border-slate-400 flex items-center justify-center relative",
				onClick: () => makeMove(r, c),
				disabled: isAiThinking || gameMode === "pva" && turn !== playerColor || gameMode === "online" && (matchData?.status !== "playing" || turn !== (user?.id === matchData?.blackPlayerId ? "black" : "white")),
				children: [cell === "black" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black shadow-md z-10" }), cell === "white" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-slate-600 shadow-md z-10" })]
			}, `${r}-${c}`)))
		})]
	});
};
//#endregion
//#region src/components/games/engines/janggi/engine.ts
var createBoard = () => {
	const board = Array(10).fill(null).map(() => Array(9).fill(null));
	board[0][0] = {
		type: "cha",
		player: "han"
	};
	board[0][8] = {
		type: "cha",
		player: "han"
	};
	board[0][1] = {
		type: "ma",
		player: "han"
	};
	board[0][7] = {
		type: "ma",
		player: "han"
	};
	board[0][2] = {
		type: "sang",
		player: "han"
	};
	board[0][6] = {
		type: "sang",
		player: "han"
	};
	board[0][3] = {
		type: "sa",
		player: "han"
	};
	board[0][5] = {
		type: "sa",
		player: "han"
	};
	board[1][4] = {
		type: "gung",
		player: "han"
	};
	board[2][1] = {
		type: "po",
		player: "han"
	};
	board[2][7] = {
		type: "po",
		player: "han"
	};
	board[3][0] = {
		type: "jol",
		player: "han"
	};
	board[3][2] = {
		type: "jol",
		player: "han"
	};
	board[3][4] = {
		type: "jol",
		player: "han"
	};
	board[3][6] = {
		type: "jol",
		player: "han"
	};
	board[3][8] = {
		type: "jol",
		player: "han"
	};
	board[9][0] = {
		type: "cha",
		player: "cho"
	};
	board[9][8] = {
		type: "cha",
		player: "cho"
	};
	board[9][1] = {
		type: "ma",
		player: "cho"
	};
	board[9][7] = {
		type: "ma",
		player: "cho"
	};
	board[9][2] = {
		type: "sang",
		player: "cho"
	};
	board[9][6] = {
		type: "sang",
		player: "cho"
	};
	board[9][3] = {
		type: "sa",
		player: "cho"
	};
	board[9][5] = {
		type: "sa",
		player: "cho"
	};
	board[8][4] = {
		type: "gung",
		player: "cho"
	};
	board[7][1] = {
		type: "po",
		player: "cho"
	};
	board[7][7] = {
		type: "po",
		player: "cho"
	};
	board[6][0] = {
		type: "jol",
		player: "cho"
	};
	board[6][2] = {
		type: "jol",
		player: "cho"
	};
	board[6][4] = {
		type: "jol",
		player: "cho"
	};
	board[6][6] = {
		type: "jol",
		player: "cho"
	};
	board[6][8] = {
		type: "jol",
		player: "cho"
	};
	return board;
};
var isInsidePalace = (r, c, player) => {
	if (player === "han") return r >= 0 && r <= 2 && c >= 3 && c <= 5;
	return r >= 7 && r <= 9 && c >= 3 && c <= 5;
};
var getPath = (from, to) => {
	const path = [];
	const dr = Math.sign(to.r - from.r);
	const dc = Math.sign(to.c - from.c);
	let r = from.r + dr, c = from.c + dc;
	while (r !== to.r || c !== to.c) {
		path.push({
			r,
			c
		});
		r += dr;
		c += dc;
	}
	return path;
};
var isValidMove = (board, from, to, player) => {
	const piece = board[from.r][from.c];
	if (!piece || piece.player !== player) return false;
	const target = board[to.r][to.c];
	if (target && target.player === player) return false;
	const dr = to.r - from.r, dc = to.c - from.c;
	const absDr = Math.abs(dr), absDc = Math.abs(dc);
	switch (piece.type) {
		case "cha":
			if (dr !== 0 && dc !== 0 && !(isInsidePalace(from.r, from.c, player) && isInsidePalace(to.r, to.c, player))) return false;
			return getPath(from, to).every((p) => !board[p.r][p.c]);
		case "po":
			if (dr !== 0 && dc !== 0) return false;
			const piecesInPath = getPath(from, to).filter((p) => board[p.r][p.c]);
			if (piecesInPath.length !== 1) return false;
			return piecesInPath[0].r === to.r && piecesInPath[0].c === to.c && board[piecesInPath[0].r][piecesInPath[0].c]?.type !== "po";
		case "ma":
			const leg = {
				r: from.r + Math.sign(dr),
				c: from.c + Math.sign(dc)
			};
			if (absDr === 2 && absDc === 1 || absDr === 1 && absDc === 2) return !board[leg.r][leg.c];
			return false;
		case "sang":
			const leg1 = {
				r: from.r + Math.sign(dr),
				c: from.c + Math.sign(dc)
			};
			const leg2 = {
				r: from.r + Math.sign(dr) * 2,
				c: from.c + Math.sign(dc) * 2
			};
			if (absDr === 3 && absDc === 2 || absDr === 2 && absDc === 3) return !board[leg1.r][leg1.c] && !board[leg2.r][leg2.c];
			return false;
		case "gung":
		case "sa": return isInsidePalace(to.r, to.c, player) && absDr <= 1 && absDc <= 1;
		case "jol": return dr === (player === "cho" ? -1 : 1) && dc === 0 || dr === 0 && absDc === 1;
		default: return false;
	}
};
//#endregion
//#region src/components/games/JanggiGame.tsx
var JanggiGame = () => {
	const [board, setBoard] = (0, import_react.useState)(createBoard());
	const [turn, setTurn] = (0, import_react.useState)("cho");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const pieceName = (piece) => {
		if (!piece) return "";
		return {
			gung: "宮",
			sa: "士",
			cha: "車",
			po: "包",
			ma: "馬",
			sang: "象",
			jol: "卒"
		}[piece.type] || piece.type;
	};
	const handleCellClick = (0, import_react.useCallback)((r, c) => {
		if (selected) {
			if (isValidMove(board, selected, {
				r,
				c
			}, turn)) {
				const newBoard = board.map((row) => [...row]);
				newBoard[r][c] = newBoard[selected.r][selected.c];
				newBoard[selected.r][selected.c] = null;
				setBoard(newBoard);
				setTurn(turn === "cho" ? "han" : "cho");
				setSelected(null);
			} else if (board[r][c]?.player === turn) setSelected({
				r,
				c
			});
			else setSelected(null);
		} else if (board[r][c] && board[r][c]?.player === turn) setSelected({
			r,
			c
		});
	}, [
		board,
		selected,
		turn
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center space-y-6 p-4 text-slate-900 dark:text-white",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 w-full max-w-sm bg-white dark:bg-[#131722] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-sm font-bold",
				children: [turn === "cho" ? "초(Cho)" : "한(Han)", "의 차례"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg text-sm hover:bg-indigo-700 transition",
				onClick: () => {
					setBoard(createBoard());
					setTurn("cho");
					setSelected(null);
				},
				children: "재시작"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-9 border-2 border-slate-900 bg-amber-100 shadow-xl",
			style: {
				width: "450px",
				height: "500px"
			},
			children: board.map((row, r) => row.map((cell, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: `border border-slate-400 w-[50px] h-[50px] flex items-center justify-center ${selected?.r === r && selected?.c === c ? "bg-indigo-300" : ""}`,
				onClick: () => handleCellClick(r, c),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `text-lg font-bold ${cell?.player === "cho" ? "text-red-700" : "text-blue-700"}`,
					children: pieceName(cell)
				})
			}, `${r}-${c}`)))
		})]
	});
};
//#endregion
//#region src/components/games/engines/holdem/engine.ts
var createDeck = () => {
	const deck = [];
	for (const s of [
		"S",
		"H",
		"D",
		"C"
	]) for (let r = 2; r <= 14; r++) deck.push({
		suit: s,
		rank: r
	});
	return deck.sort(() => Math.random() - .5);
};
var getCombinations = (arr, k) => {
	if (k === 0) return [[]];
	if (arr.length === 0) return [];
	const [head, ...tail] = arr;
	return [...getCombinations(tail, k - 1).map((c) => [head, ...c]), ...getCombinations(tail, k)];
};
var evaluateHand = (cards) => {
	const combinations = getCombinations(cards, 5);
	let best = {
		rank: "HighCard",
		value: 0,
		score: -1
	};
	const rankScores = {
		RoyalFlush: 10,
		StraightFlush: 9,
		FourKind: 8,
		FullHouse: 7,
		Flush: 6,
		Straight: 5,
		ThreeKind: 4,
		TwoPair: 3,
		OnePair: 2,
		HighCard: 1
	};
	combinations.forEach((combo) => {
		const ranks = combo.map((c) => c.rank).sort((a, b) => b - a);
		const suits = combo.map((c) => c.suit);
		const isFlush = suits.every((s) => s === suits[0]);
		let isStraight = false;
		if (ranks[0] - ranks[4] === 4) isStraight = true;
		if (ranks[0] === 14 && ranks[1] === 5 && ranks[2] === 4 && ranks[3] === 3 && ranks[4] === 2) isStraight = true;
		const freq = {};
		ranks.forEach((r) => freq[r] = (freq[r] || 0) + 1);
		const counts = Object.values(freq).sort((a, b) => b - a);
		let rank = "HighCard";
		if (isFlush && isStraight && ranks[0] === 14 && ranks[4] === 10) rank = "RoyalFlush";
		else if (isFlush && isStraight) rank = "StraightFlush";
		else if (counts[0] === 4) rank = "FourKind";
		else if (counts[0] === 3 && counts[1] === 2) rank = "FullHouse";
		else if (isFlush) rank = "Flush";
		else if (isStraight) rank = "Straight";
		else if (counts[0] === 3) rank = "ThreeKind";
		else if (counts[0] === 2 && counts[1] === 2) rank = "TwoPair";
		else if (counts[0] === 2) rank = "OnePair";
		const score = rankScores[rank] * 1e6 + ranks.reduce((acc, r, i) => acc + r * Math.pow(15, 4 - i), 0);
		if (score > best.score) best = {
			rank,
			value: ranks[0],
			score
		};
	});
	return {
		rank: best.rank,
		value: best.value
	};
};
//#endregion
//#region src/components/games/HoldemGame.tsx
var HoldemGame = () => {
	const [deck, setDeck] = (0, import_react.useState)(createDeck());
	const [communityCards, setCommunityCards] = (0, import_react.useState)([]);
	const [players, setPlayers] = (0, import_react.useState)([{
		id: 0,
		cards: [],
		chips: 1e3,
		bet: 0,
		folded: false,
		isAi: false
	}, {
		id: 1,
		cards: [],
		chips: 1e3,
		bet: 0,
		folded: true,
		isAi: true
	}]);
	const [pot, setPot] = (0, import_react.useState)(0);
	const [phase, setPhase] = (0, import_react.useState)("preflop");
	const [turn, setTurn] = (0, import_react.useState)(0);
	const [winner, setWinner] = (0, import_react.useState)(null);
	const deal = (0, import_react.useCallback)(() => {
		const newDeck = createDeck();
		setPlayers((prev) => prev.map((p) => ({
			...p,
			cards: [newDeck.pop(), newDeck.pop()],
			bet: 0,
			folded: false,
			chips: p.chips - 10
		})));
		setCommunityCards([]);
		setPot(20);
		setPhase("preflop");
		setTurn(0);
		setWinner(null);
		setDeck(newDeck);
	}, []);
	const handleAction = (action, amount = 0) => {
		if (players[turn].folded) return;
		let newPlayers = [...players];
		if (action === "fold") newPlayers[turn].folded = true;
		else {
			const betAmount = action === "call" ? 10 : amount;
			newPlayers[turn].chips -= betAmount;
			newPlayers[turn].bet += betAmount;
			setPot((prev) => prev + betAmount);
		}
		setPlayers(newPlayers);
		const activePlayers = newPlayers.filter((p) => !p.folded);
		if (activePlayers.every((p) => p.bet === activePlayers[0].bet) && phase !== "showdown") nextPhase();
		else setTurn((prev) => (prev + 1) % players.length);
	};
	const nextPhase = (0, import_react.useCallback)(() => {
		if (phase === "preflop") {
			setCommunityCards(deck.splice(0, 3));
			setPhase("flop");
		} else if (phase === "flop") {
			setCommunityCards([...communityCards, deck.pop()]);
			setPhase("turn");
		} else if (phase === "turn") {
			setCommunityCards([...communityCards, deck.pop()]);
			setPhase("river");
		} else if (phase === "river") {
			const winnerData = players.map((p) => ({
				...p,
				hand: evaluateHand([...p.cards, ...communityCards])
			}));
			const winner = winnerData.reduce((best, p) => {
				if (p.folded) return best;
				if (!best || p.hand.rank > best.hand.rank) return p;
				return best;
			}, winnerData[0]);
			setWinner(`Player ${winner.id} wins with ${winner.hand.rank}!`);
			setPhase("showdown");
		}
		setTurn(0);
	}, [
		phase,
		deck,
		communityCards,
		players
	]);
	(0, import_react.useEffect)(() => {
		if (players[turn].isAi && phase !== "showdown") setTimeout(() => handleAction("call"), 1e3);
	}, [
		turn,
		players,
		phase
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center space-y-4 p-4 text-slate-900 dark:text-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-bold",
				children: "텍사스 홀덤"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-sm",
				children: [
					"단계: ",
					phase,
					" | 팟: ",
					pot,
					" | 차례: Player ",
					turn
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2",
				children: communityCards.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-12 h-16 bg-white border border-slate-300 rounded flex items-center justify-center text-sm",
					children: [c.rank, c.suit]
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-4",
				children: players.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border p-2 rounded",
					children: [
						"P",
						p.id,
						" ",
						p.folded ? "(Folded)" : "",
						": ",
						p.cards.map((c) => `${c.rank}${c.suit}`).join(", "),
						" | 칩: ",
						p.chips,
						" | 베팅: ",
						p.bet
					]
				}, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => handleAction("fold"),
						className: "px-4 py-2 bg-red-600 text-white rounded",
						children: "폴드"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => handleAction("call"),
						className: "px-4 py-2 bg-blue-600 text-white rounded",
						children: "콜"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: deal,
						className: "px-4 py-2 bg-slate-900 text-white rounded",
						children: "새 판 시작"
					})
				]
			}),
			winner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-lg font-bold text-green-600",
				children: winner
			})
		]
	});
};
//#endregion
//#region src/components/games/MiniGames.tsx
var GAME_CATALOG = [
	{
		id: "work",
		title: "랜덤입사 인생 시뮬레이션",
		badge: "메인 시뮬레이터",
		badgeColor: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "w-6 h-6" }),
		shortDesc: "랜덤 캐릭터로 첫 직장에 입사해 60세 정년 또는 40대 파이어족 은퇴까지의 긴 여정을 플레이합니다.",
		rules: [
			"학력·전공에 따른 가중치로 첫 직장(대기업·스타트업·공기업 등)이 무작위 배정됩니다.",
			"매년 발생하는 직장·투자·인생 사건에서 최선의 선택을 내려 능력치와 자산을 키우세요.",
			"연봉 실수령액에서 생활비·세금이 자동 결산되며, 남은 자금으로 주식·부동산 투자를 할 수 있습니다.",
			"스트레스 100% 도달 시 번아웃 퇴사, 순자산 20억+ 달성 시 조기 은퇴 등 15종 이상의 결말이 기다립니다."
		]
	},
	{
		id: "ladder",
		title: "사다리타기",
		badge: "다인원 추첨",
		badgeColor: "bg-rose-500/10 text-rose-500 border-rose-500/20",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-6 h-6" }),
		shortDesc: "2명부터 24명까지 정확한 아미다쿠지 경로 계산과 블라인드 긴장감 추첨을 지원합니다.",
		rules: [
			"참가자와 도착 결과를 원하는 인원수만큼 자유롭게 추가하고 편집할 수 있습니다.",
			"빠른 프리셋(당첨 1명, 커피 쏘기 1명, 당첨 N명 지정 등)을 즉시 적용할 수 있습니다.",
			"시작 전에는 사다리 가로선이 가려지는 블라인드 모드로 진행되며, 참가자 클릭 시 경로를 따라 결과가 공개됩니다.",
			"추첨 결과는 1:1로 고유 매핑되며, 요약 표를 클릭 한 번으로 복사하여 공유할 수 있습니다."
		]
	},
	{
		id: "lunch",
		title: "점심 메뉴 고르기",
		badge: "스마트 룰렛",
		badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, { className: "w-6 h-6" }),
		shortDesc: "예산·카테고리·맵기 필터와 어제 먹은 메뉴 제외. 실제 지도 검색 연동까지 완벽 지원합니다.",
		rules: [
			"한식, 중식, 일식, 양식, 분식, 건강식 등 45가지 이상의 다채로운 직장인 점심 메뉴 풀이 제공됩니다.",
			"1인 예산 한도와 맵기 선호도를 조절하고, 제외할 메뉴를 직접 태그로 추가할 수 있습니다.",
			"최근 선택한 메뉴 3회 반복 방지 옵션으로 매일 새로운 메뉴를 추천받을 수 있습니다.",
			"현재 GPS 위치 또는 주변 동네/역명을 입력하면 카카오맵/네이버지도 실제 맛집 검색으로 즉시 연결됩니다."
		]
	},
	{
		id: "gomoku",
		title: "실시간 1:1 오목",
		badge: "정식 대전",
		badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid3x3, { className: "w-6 h-6" }),
		shortDesc: "정석 규칙의 15x15 오목. AI 4단계 난이도와 친구 대전을 지원합니다.",
		rules: ["흑백 돌을 번갈아 놓아 가로·세로·대각선 5개를 먼저 연결하면 승리합니다.", "AI 난이도별 실력을 테스트하고, 친구와 방을 만들어 실시간으로 대전하세요."]
	},
	{
		id: "janggi",
		title: "전통 장기 (Janggi)",
		badge: "정식 대전",
		badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid3x3, { className: "w-6 h-6" }),
		shortDesc: "전통 규칙의 9x10 장기. 전술 수싸움의 진수를 경험하세요.",
		rules: ["차, 포, 마, 상, 사, 졸, 궁을 이용해 상대 궁을 먼저 장군(외통수) 치면 승리합니다.", "AI 난이도별 실력을 테스트하고, 친구와 방을 만들어 실시간으로 대전하세요."]
	},
	{
		id: "holdem",
		title: "텍사스 홀덤",
		badge: "정식 대전",
		badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid3x3, { className: "w-6 h-6" }),
		shortDesc: "전략과 심리전의 정수, 텍사스 홀덤.",
		rules: ["52장 카드로 진행되는 포커 게임입니다.", "자신의 카드와 공유 카드를 조합하여 가장 높은 족보를 만드세요."]
	}
];
var MiniGames = () => {
	const { user } = useApp();
	const [activeGame, setActiveGame] = (0, import_react.useState)("main");
	const [showRulesFor, setShowRulesFor] = (0, import_react.useState)(null);
	const [stats, setStats] = (0, import_react.useState)({
		ladderCount: 0,
		lunchCount: 0,
		officeActive: false,
		officeYears: 0,
		officeEndingCount: 0
	});
	(0, import_react.useEffect)(() => {
		if (!user?.id || activeGame !== "main") return;
		let isMounted = true;
		const loadStats = async () => {
			try {
				const [ladderHist, lunchHist, officeRecords, activeOffice] = await Promise.all([
					firebaseRepository.getUserGameHistory(user.id, "ladder").catch(() => []),
					firebaseRepository.getUserGameHistory(user.id, "lunch").catch(() => []),
					firebaseRepository.getOfficeGameRecords(user.id).catch(() => []),
					firebaseRepository.getActiveOfficeGame(user.id).catch(() => null)
				]);
				if (isMounted) setStats({
					ladderCount: ladderHist.length,
					lunchCount: lunchHist.length,
					officeActive: Boolean(activeOffice),
					officeYears: activeOffice?.year || 0,
					officeEndingCount: officeRecords.length
				});
			} catch (e) {
				console.warn("Failed to load arcade stats:", e);
			}
		};
		loadStats();
		return () => {
			isMounted = false;
		};
	}, [user?.id, activeGame]);
	const handleSelectGame = (gameId) => {
		setShowRulesFor(null);
		setActiveGame(gameId);
	};
	const currentMeta = GAME_CATALOG.find((g) => g.id === activeGame);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-24 animate-in fade-in duration-150",
		children: [
			activeGame !== "main" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveGame("main"),
							className: "p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 text-xs font-semibold transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4 h-4" }), "아케이드 홈"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-px bg-slate-200 dark:border-slate-800" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-slate-900 dark:text-white text-base",
								children: currentMeta?.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-[11px] font-bold px-2 py-0.5 rounded-md border ${currentMeta?.badgeColor}`,
								children: currentMeta?.badge
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setShowRulesFor(showRulesFor === activeGame ? null : activeGame),
						className: "px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "w-3.5 h-3.5 text-amber-500" }), showRulesFor === activeGame ? "규칙 닫기" : "이용 방법 & 규칙"]
					})
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gamepad2, { className: "w-3.5 h-3.5" }), "STOCK INSIGHT ARCADE"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight",
								children: "직장인 힐링 미니게임 라운지"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed",
								children: "바쁜 증시 분석과 업무 속에서 잠시 쉬어가는 시간. 사다리 추첨, 점심 룰렛, 그리고 인생 역전 시뮬레이션까지 모든 플레이 기록은 안전하게 보관됩니다."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shrink-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-3 py-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-slate-400 block font-medium",
									children: "사다리 추첨"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-base font-black text-rose-500",
									children: [stats.ladderCount, "회"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-3 py-1 border-x border-slate-200 dark:border-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-slate-400 block font-medium",
									children: "점심 픽"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-base font-black text-amber-500",
									children: [stats.lunchCount, "회"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-3 py-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-slate-400 block font-medium",
									children: "인생 엔딩"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-base font-black text-indigo-500",
									children: [stats.officeEndingCount, "회"]
								})]
							})
						]
					})]
				})
			}),
			showRulesFor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-indigo-50/80 dark:bg-slate-900/90 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl p-5 text-xs space-y-3 animate-in fade-in",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 text-amber-500" }),
							GAME_CATALOG.find((g) => g.id === showRulesFor)?.title,
							" 가이드 & 규칙"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setShowRulesFor(null),
						className: "text-slate-400 hover:text-slate-600",
						children: "닫기"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1.5 text-slate-600 dark:text-slate-300 list-disc list-inside leading-relaxed",
					children: GAME_CATALOG.find((g) => g.id === showRulesFor)?.rules.map((rule, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: rule }, idx))
				})]
			}),
			activeGame === "main" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-6",
					children: GAME_CATALOG.map((game) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:border-slate-400/50 dark:hover:border-slate-700 transition-all flex flex-col justify-between group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white group-hover:scale-105 transition-transform",
									children: game.icon
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${game.badgeColor}`,
									children: game.badge
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors",
								children: game.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-slate-500 dark:text-slate-400 mt-2 text-xs leading-relaxed",
								children: game.shortDesc
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleSelectGame(game.id),
								className: "w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5",
								children: "시작하기"
							})
						})]
					}, game.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-slate-50/60 dark:bg-slate-900/30 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid3x3, { className: "w-4 h-4" }), "확장 게임 라인업 (출시 준비 중)"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-slate-400",
							children: "2인 보드게임 엔진 준비 중"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 gap-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between opacity-70",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-3.5 h-3.5 text-slate-400" }), "전통 장기 (Janggi)"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-slate-400",
									children: "두뇌 회전과 전술 수싸움의 진수"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500",
								children: "오픈 예정"
							})]
						})
					})]
				})]
			}),
			activeGame === "ladder" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LadderGame, {}, "ladder"),
			activeGame === "lunch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LunchSelector, {}, "lunch"),
			activeGame === "work" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkLifeSimulation, {}, "work"),
			activeGame === "gomoku" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GomokuGame, {}, "gomoku"),
			activeGame === "janggi" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JanggiGame, {}, "janggi"),
			activeGame === "holdem" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldemGame, {}, "holdem")
		]
	});
};
//#endregion
export { MiniGames, MiniGames as default };
