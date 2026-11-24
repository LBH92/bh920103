import "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { bn as require_react } from "./vendor-lucide-Dji_Ij8j.js";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var MiniSparkline = ({ data, isUp, width = 96, height = 36 }) => {
	if (!data || data.length < 2) return null;
	const min = Math.min(...data);
	const range = Math.max(...data) - min || 1;
	const padding = 3;
	const points = data.map((val, idx) => {
		return `${padding + idx / (data.length - 1) * (width - 6)},${height - padding - (val - min) / range * (height - 6)}`;
	}).join(" ");
	const strokeColor = isUp ? "#f43f5e" : "#3b82f6";
	const firstX = padding;
	const polygonPoints = `${points} ${width - padding},${height} ${firstX},${height}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width,
		height,
		className: "overflow-visible",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
				id: `grad-${isUp ? "up" : "down"}`,
				x1: "0",
				y1: "0",
				x2: "0",
				y2: "1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0%",
					stopColor: strokeColor,
					stopOpacity: .25
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "100%",
					stopColor: strokeColor,
					stopOpacity: 0
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: polygonPoints,
				fill: `url(#grad-${isUp ? "up" : "down"})`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
				fill: "none",
				stroke: strokeColor,
				strokeWidth: "1.75",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				points
			})
		]
	});
};
//#endregion
export { MiniSparkline as t };
