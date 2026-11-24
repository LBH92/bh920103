import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { bn as require_react } from "./vendor-lucide-Dji_Ij8j.js";
import "./AppContext-Butl4QWq.js";
//#region src/components/common/AdSlot.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var AdSlot = ({ slotId = "default-slot", format = "auto", className = "" }) => {
	const [isLoaded, setIsLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {}, [void 0, slotId]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `my-4 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#131722]/50 text-center ${className}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] font-bold text-slate-500 dark:text-400",
			children: "광고 문의"
		})
	});
};
//#endregion
export { AdSlot as t };
