import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { $t as ChartNoAxesColumn, F as ShieldCheck, G as RefreshCw, Ht as Clock, bn as require_react, gn as ArrowLeft, h as TriangleAlert, kt as Flame, qt as ChevronRight } from "./vendor-lucide-Dji_Ij8j.js";
import { n as useApp } from "./AppContext-Butl4QWq.js";
import { p as PriceBadge } from "./index-DLz7vtf6.js";
//#region src/components/indices/InteractiveIndexChart.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var INDEX_PERIODS = [
	{
		id: "1d",
		label: "1일",
		badge: "5분봉",
		description: "당일 장중 5분 단위 실시간 체결 지수"
	},
	{
		id: "1mo",
		label: "1개월",
		badge: "일봉",
		description: "최근 1개월 일별 지수 추이"
	},
	{
		id: "3mo",
		label: "3개월",
		badge: "일봉",
		description: "최근 3개월 일별 지수 추이"
	},
	{
		id: "1y",
		label: "1년",
		badge: "일봉",
		description: "최근 1년 일별 지수 추이"
	},
	{
		id: "3y",
		label: "3년",
		badge: "주봉",
		description: "최근 3년 주간 단위 중장기 지수 추이"
	}
];
var InteractiveIndexChart = ({ symbol, currentValue, prevClose }) => {
	const [selectedPeriod, setSelectedPeriod] = (0, import_react.useState)("3mo");
	const [chartData, setChartData] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const [errorMessage, setErrorMessage] = (0, import_react.useState)(null);
	const [hoveredCandle, setHoveredCandle] = (0, import_react.useState)(null);
	const [hoverIndex, setHoverIndex] = (0, import_react.useState)(null);
	const containerRef = (0, import_react.useRef)(null);
	const [chartWidth, setChartWidth] = (0, import_react.useState)(800);
	(0, import_react.useEffect)(() => {
		const updateWidth = () => {
			if (containerRef.current) setChartWidth(containerRef.current.clientWidth);
		};
		updateWidth();
		window.addEventListener("resize", updateWidth);
		return () => window.removeEventListener("resize", updateWidth);
	}, []);
	const fetchChart = (0, import_react.useCallback)(async (isSilent = false) => {
		if (!isSilent) setIsLoading(true);
		else setIsRefreshing(true);
		setErrorMessage(null);
		try {
			const res = await fetch(`/api/indices/${symbol}/chart?period=${selectedPeriod}`);
			if (!res.ok) throw new Error(`서버 응답 오류 (HTTP ${res.status})`);
			const data = await res.json();
			setChartData(data);
		} catch (err) {
			console.error("[IndexChart] Fetch error:", err);
			setErrorMessage(err.message || "지수 차트 데이터를 불러오지 못했습니다.");
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}, [symbol, selectedPeriod]);
	(0, import_react.useEffect)(() => {
		fetchChart();
	}, [fetchChart]);
	const candles = (0, import_react.useMemo)(() => {
		return chartData?.candles || [];
	}, [chartData]);
	const chartHeight = 360;
	const padding = {
		top: 24,
		right: 65,
		bottom: 50,
		left: 16
	};
	const plotWidth = Math.max(chartWidth - padding.left - padding.right, 200);
	const mainPlotHeight = chartHeight - padding.top - padding.bottom;
	const candleAreaHeight = mainPlotHeight * .75;
	const volumeAreaHeight = mainPlotHeight * .22;
	const volumeAreaTop = padding.top + candleAreaHeight + mainPlotHeight * .03;
	const { minPrice, maxPrice, maxVolume } = (0, import_react.useMemo)(() => {
		if (candles.length === 0) return {
			minPrice: currentValue * .95,
			maxPrice: currentValue * 1.05,
			maxVolume: 1e3
		};
		let minP = Infinity;
		let maxP = -Infinity;
		let maxV = 0;
		for (const c of candles) {
			if (c.low < minP) minP = c.low;
			if (c.high > maxP) maxP = c.high;
			if (c.volume > maxV) maxV = c.volume;
		}
		const priceBuffer = (maxP - minP) * .06 || 10;
		return {
			minPrice: Math.max(0, minP - priceBuffer),
			maxPrice: maxP + priceBuffer,
			maxVolume: maxV || 1
		};
	}, [candles, currentValue]);
	const priceToY = (0, import_react.useCallback)((price) => {
		if (maxPrice === minPrice) return padding.top + candleAreaHeight / 2;
		const ratio = (price - minPrice) / (maxPrice - minPrice);
		return padding.top + candleAreaHeight - ratio * candleAreaHeight;
	}, [
		minPrice,
		maxPrice,
		candleAreaHeight,
		padding.top
	]);
	const volumeToH = (0, import_react.useCallback)((vol) => {
		if (maxVolume <= 0) return 0;
		return vol / maxVolume * volumeAreaHeight;
	}, [maxVolume, volumeAreaHeight]);
	const candleWidth = (0, import_react.useMemo)(() => {
		if (candles.length <= 1) return 16;
		const available = plotWidth / candles.length;
		return Math.max(2, Math.min(22, available * .7));
	}, [plotWidth, candles.length]);
	const indexToX = (0, import_react.useCallback)((idx) => {
		if (candles.length <= 1) return padding.left + plotWidth / 2;
		const step = plotWidth / (candles.length - 1);
		return padding.left + idx * step;
	}, [
		candles.length,
		plotWidth,
		padding.left
	]);
	const ma5 = (0, import_react.useMemo)(() => {
		if (candles.length < 5) return [];
		return candles.map((_, i, arr) => {
			if (i < 4) return null;
			return arr.slice(i - 4, i + 1).reduce((acc, cur) => acc + cur.close, 0) / 5;
		});
	}, [candles]);
	const ma20 = (0, import_react.useMemo)(() => {
		if (candles.length < 20) return [];
		return candles.map((_, i, arr) => {
			if (i < 19) return null;
			return arr.slice(i - 19, i + 1).reduce((acc, cur) => acc + cur.close, 0) / 20;
		});
	}, [candles]);
	const handleMouseMove = (e) => {
		if (!containerRef.current || candles.length === 0) return;
		const rect = containerRef.current.getBoundingClientRect();
		const mouseX = e.clientX - rect.left - padding.left;
		if (mouseX < 0 || mouseX > plotWidth) {
			setHoveredCandle(null);
			setHoverIndex(null);
			return;
		}
		const step = plotWidth / (candles.length - 1 || 1);
		const idx = Math.min(candles.length - 1, Math.max(0, Math.round(mouseX / step)));
		setHoveredCandle(candles[idx]);
		setHoverIndex(idx);
	};
	const handleMouseLeave = () => {
		setHoveredCandle(null);
		setHoverIndex(null);
	};
	const priceGridLines = (0, import_react.useMemo)(() => {
		const ticks = 4;
		const res = [];
		const step = (maxPrice - minPrice) / 3;
		for (let i = 0; i < ticks; i++) {
			const p = minPrice + i * step;
			res.push({
				price: p,
				y: priceToY(p)
			});
		}
		return res;
	}, [
		minPrice,
		maxPrice,
		priceToY
	]);
	const activeCandle = hoveredCandle || (candles.length > 0 ? candles[candles.length - 1] : null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl w-fit",
					children: INDEX_PERIODS.map((p) => {
						const isSelected = selectedPeriod === p.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelectedPeriod(p.id),
							className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${isSelected ? "bg-rose-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-[10px] font-mono opacity-80 ${isSelected ? "text-white" : "text-slate-400"}`,
								children: p.badge
							})]
						}, p.id);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 self-start sm:self-auto",
					children: [chartData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-800/40 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["갱신: ", chartData.lastUpdated] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => fetchChart(false),
						disabled: isLoading || isRefreshing,
						className: "flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50",
						title: "지수 차트 새로고침",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3.5 h-3.5 ${isLoading || isRefreshing ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "새로고침"
						})]
					})]
				})]
			}),
			activeCandle && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 text-xs font-mono",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-slate-400 font-sans font-medium",
						children: "일시:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-slate-900 dark:text-white",
						children: activeCandle.time
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3 sm:gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-slate-400 font-sans font-medium mr-1",
							children: "시가"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-slate-900 dark:text-white",
							children: activeCandle.open.toLocaleString()
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-slate-400 font-sans font-medium mr-1",
							children: "고가"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-rose-500",
							children: activeCandle.high.toLocaleString()
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-slate-400 font-sans font-medium mr-1",
							children: "저가"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-blue-500",
							children: activeCandle.low.toLocaleString()
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-slate-400 font-sans font-medium mr-1",
							children: "종가"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `font-bold ${activeCandle.close >= activeCandle.open ? "text-rose-500" : "text-blue-500"}`,
							children: activeCandle.close.toLocaleString()
						})] }),
						activeCandle.volume > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden sm:block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-400 font-sans font-medium mr-1",
								children: "거래량"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-slate-700 dark:text-slate-300",
								children: activeCandle.volume.toLocaleString()
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: containerRef,
				className: "relative w-full overflow-hidden select-none",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "h-[360px] flex flex-col items-center justify-center space-y-3 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-8 h-8 text-rose-500 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-slate-400 font-medium",
						children: [
							"실시간 ",
							symbol,
							" 지수 캔들 차트를 불러오는 중입니다..."
						]
					})]
				}) : errorMessage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "h-[360px] flex flex-col items-center justify-center space-y-3 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl p-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-8 h-8 text-rose-500" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200",
							children: errorMessage
						}),
						chartData?.lastUpdated && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-slate-400",
							children: ["마지막 정상 수신: ", chartData.lastUpdated]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => fetchChart(false),
							className: "px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors",
							children: "다시 시도"
						})
					]
				}) : candles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "h-[360px] flex flex-col items-center justify-center space-y-2 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { className: "w-8 h-8 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-400",
						children: "선택한 기간의 지수 차트 데이터가 없습니다."
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					width: chartWidth,
					height: chartHeight,
					className: "w-full h-auto cursor-crosshair",
					onMouseMove: handleMouseMove,
					onMouseLeave: handleMouseLeave,
					children: [
						priceGridLines.map((grid, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: padding.left,
							y1: grid.y,
							x2: padding.left + plotWidth,
							y2: grid.y,
							stroke: "currentColor",
							className: "text-slate-100 dark:text-slate-800/80",
							strokeDasharray: "3 3"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: padding.left + plotWidth + 6,
							y: grid.y + 4,
							fill: "currentColor",
							className: "text-[10px] font-mono fill-slate-400",
							children: grid.price.toLocaleString(void 0, {
								minimumFractionDigits: 1,
								maximumFractionDigits: 1
							})
						})] }, idx)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: padding.left,
							y1: volumeAreaTop,
							x2: padding.left + plotWidth,
							y2: volumeAreaTop,
							stroke: "currentColor",
							className: "text-slate-200 dark:text-slate-800"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: padding.left + plotWidth + 6,
							y: volumeAreaTop + 12,
							fill: "currentColor",
							className: "text-[9px] font-mono fill-slate-400",
							children: "거래량"
						}),
						candles.map((c, i) => {
							const x = indexToX(i);
							const h = volumeToH(c.volume);
							const y = volumeAreaTop + volumeAreaHeight - h;
							const isUp = c.close >= c.open;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: x - candleWidth / 2,
								y,
								width: candleWidth,
								height: Math.max(1, h),
								className: isUp ? "fill-rose-500/35" : "fill-blue-500/35"
							}, `vol-${i}`);
						}),
						candles.map((c, i) => {
							const x = indexToX(i);
							const openY = priceToY(c.open);
							const closeY = priceToY(c.close);
							const highY = priceToY(c.high);
							const lowY = priceToY(c.low);
							const isUp = c.close >= c.open;
							const candleTop = Math.min(openY, closeY);
							const candleH = Math.max(1.5, Math.abs(closeY - openY));
							const candleColor = isUp ? "#f43f5e" : "#3b82f6";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: x,
								y1: highY,
								x2: x,
								y2: lowY,
								stroke: candleColor,
								strokeWidth: 1.5
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: x - candleWidth / 2,
								y: candleTop,
								width: candleWidth,
								height: candleH,
								fill: candleColor,
								rx: 1
							})] }, `candle-${i}`);
						}),
						ma5.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: ma5.reduce((acc, val, i) => {
								if (val === null) return acc;
								const x = indexToX(i);
								const y = priceToY(val);
								return acc ? `${acc} L ${x} ${y}` : `M ${x} ${y}`;
							}, ""),
							fill: "none",
							stroke: "#f59e0b",
							strokeWidth: 1.5,
							opacity: .8
						}),
						ma20.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: ma20.reduce((acc, val, i) => {
								if (val === null) return acc;
								const x = indexToX(i);
								const y = priceToY(val);
								return acc ? `${acc} L ${x} ${y}` : `M ${x} ${y}`;
							}, ""),
							fill: "none",
							stroke: "#8b5cf6",
							strokeWidth: 1.5,
							opacity: .8
						}),
						hoverIndex !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: indexToX(hoverIndex),
							y1: padding.top,
							x2: indexToX(hoverIndex),
							y2: chartHeight - padding.bottom,
							stroke: "#94a3b8",
							strokeDasharray: "3 3",
							strokeWidth: 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: indexToX(hoverIndex),
							y: chartHeight - padding.bottom + 16,
							textAnchor: "middle",
							fill: "currentColor",
							className: "text-[10px] font-mono font-bold fill-slate-700 dark:fill-slate-200",
							children: candles[hoverIndex].time
						})] }),
						candles.length > 1 && [
							0,
							Math.floor(candles.length / 4),
							Math.floor(candles.length / 2),
							Math.floor(candles.length * 3 / 4),
							candles.length - 1
						].map((idx) => {
							if (idx < 0 || idx >= candles.length) return null;
							const x = indexToX(idx);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x,
								y: 348,
								textAnchor: "middle",
								fill: "currentColor",
								className: "text-[10px] font-mono fill-slate-400",
								children: candles[idx].time
							}, `time-lbl-${idx}`);
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] text-slate-400 font-mono",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2.5 h-2.5 rounded-sm bg-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "상승 (양봉)" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2.5 h-2.5 rounded-sm bg-blue-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "하락 (음봉)" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 h-0.5 bg-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "5일선" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 h-0.5 bg-purple-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "20일선" })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "실제 거래소 시세 데이터 연동" }) })]
			})
		]
	});
};
//#endregion
//#region src/components/indices/IndexDetailView.tsx
var IndexDetailView = ({ symbol }) => {
	const { indices, clearSelectedIndex, setActiveTab } = useApp();
	const initialIndex = indices.find((i) => i.symbol === symbol);
	const [indexData, setIndexData] = (0, import_react.useState)(initialIndex || null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(!initialIndex);
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const [errorMessage, setErrorMessage] = (0, import_react.useState)(null);
	const fetchIndexDetail = (0, import_react.useCallback)(async (isSilent = false) => {
		if (!isSilent) setIsLoading(true);
		else setIsRefreshing(true);
		setErrorMessage(null);
		try {
			const res = await fetch(`/api/indices/${symbol}`);
			if (!res.ok) throw new Error(`서버 응답 오류 (HTTP ${res.status})`);
			const data = await res.json();
			setIndexData(data);
		} catch (err) {
			console.error("[IndexDetail] Fetch error:", err);
			setErrorMessage(err.message || "지수 상세 정보를 불러오지 못했습니다.");
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}, [symbol]);
	(0, import_react.useEffect)(() => {
		fetchIndexDetail();
	}, [fetchIndexDetail]);
	(0, import_react.useEffect)(() => {
		const timer = setInterval(() => {
			fetchIndexDetail(true);
		}, 15e3);
		return () => clearInterval(timer);
	}, [fetchIndexDetail]);
	const index = indexData || initialIndex;
	index?.change;
	index?.change;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-16 animate-in fade-in duration-200 max-w-7xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: clearSelectedIndex,
					className: "flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors self-start cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "이전 화면으로 돌아가기" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 self-start sm:self-auto",
					children: [index && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl border bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: index.dataSource === "kiwoom" ? "키움 Open API" : "실시간 거래소 시세" })]
					}), index.lastUpdated && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["갱신: ", index.lastUpdated] })]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => fetchIndexDetail(false),
						disabled: isLoading || isRefreshing,
						className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 font-bold text-xs hover:bg-rose-100 dark:hover:bg-rose-500/25 transition-all cursor-pointer disabled:opacity-50",
						title: "실시간 지수 새로고침",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3.5 h-3.5 ${isLoading || isRefreshing ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "새로고침" })]
					})]
				})]
			}),
			index?.isStale && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"현재 거래소 지수 통신 지연으로 인해 마지막 정상 수신 데이터(갱신 시각: ",
					index.lastUpdated,
					")가 안전하게 표시되고 있습니다."
				] })]
			}),
			index && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-[#131722] p-5 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-xs px-2.5 py-0.5 rounded-lg font-bold font-mono tracking-wider uppercase ${symbol === "KOSPI" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"}`,
							children: symbol
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-slate-400 font-medium",
							children: symbol === "KOSPI" ? "유가증권시장 종합주가지수" : "코스닥시장 종합주가지수"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1",
						children: [index.name, " 종합지수"]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:items-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-900 dark:text-white",
							children: index.value.toLocaleString(void 0, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1.5 flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceBadge, {
								change: index.change,
								changePercent: index.changePercent,
								size: "lg"
							})
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs font-mono",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-400 font-sans text-[11px] block mb-1",
								children: "시가"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-slate-900 dark:text-white text-sm",
								children: (index.open || index.value).toLocaleString(void 0, {
									minimumFractionDigits: 1,
									maximumFractionDigits: 1
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-400 font-sans text-[11px] block mb-1",
								children: "고가"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-rose-500 text-sm",
								children: index.high.toLocaleString(void 0, {
									minimumFractionDigits: 1,
									maximumFractionDigits: 1
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-400 font-sans text-[11px] block mb-1",
								children: "저가"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-blue-500 text-sm",
								children: index.low.toLocaleString(void 0, {
									minimumFractionDigits: 1,
									maximumFractionDigits: 1
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-400 font-sans text-[11px] block mb-1",
								children: "전일종가"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-slate-700 dark:text-slate-300 text-sm",
								children: (index.prevClose || index.value - index.change).toLocaleString(void 0, {
									minimumFractionDigits: 1,
									maximumFractionDigits: 1
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-400 font-sans text-[11px] block mb-1",
								children: "거래량"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-slate-900 dark:text-white text-sm",
								children: [index.volume.toLocaleString(), "천주"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-400 font-sans text-[11px] block mb-1",
								children: "거래대금"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-slate-900 dark:text-white text-sm",
								children: [index.tradingValue, "조원"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-400 font-sans text-[11px] block mb-1",
								children: "상승 종목"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-rose-500 text-sm",
								children: [
									"▲ ",
									index.advanceCount,
									"개"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-400 font-sans text-[11px] block mb-1",
								children: "하락 종목"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-blue-500 text-sm",
								children: [
									"▼ ",
									index.declineCount,
									"개"
								]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				"aria-label": `${symbol} 지수 캔들 차트`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InteractiveIndexChart, {
					symbol,
					currentValue: index?.value || 2700,
					prevClose: index?.prevClose || (index ? index.value - index.change : 2700)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2.5 rounded-xl bg-amber-500/10 text-amber-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm font-bold text-slate-900 dark:text-white",
						children: [symbol, " 시장 실시간 종목 순위"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-slate-400 mt-0.5",
						children: [symbol, " 시장의 급등락, 거래량 및 거래대금 TOP 20 종목을 실시간으로 확인하세요"]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						clearSelectedIndex();
						setActiveTab("ranking");
					},
					className: "w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [symbol, " 실시간 순위 보기"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4" })]
				})]
			})
		]
	});
};
//#endregion
export { IndexDetailView };
