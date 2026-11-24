import "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { bn as require_react } from "./vendor-lucide-Dji_Ij8j.js";
import { n as useApp } from "./AppContext-Butl4QWq.js";
import { n as InquiryForm, t as MyInquiries } from "./MyInquiries-cjHqRZ5K.js";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var InquiryPage = () => {
	const { user, requireAuth } = useApp();
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-20 text-center max-w-md mx-auto space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-xl font-bold",
			children: "로그인이 필요합니다"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => requireAuth("문의하기"),
			className: "bg-rose-600 text-white p-3 rounded-xl w-full font-bold",
			children: "로그인 후 문의하기"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 space-y-8 max-w-2xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-black",
				children: "고객센터"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-slate-500",
				children: "서비스 이용 중 궁금한 점이나 불편 사항을 문의해 주세요."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 bg-white dark:bg-[#131722] border rounded-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold text-lg mb-4",
					children: "문의 작성"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InquiryForm, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 bg-white dark:bg-[#131722] border rounded-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold text-lg mb-4",
					children: "내 문의 내역"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyInquiries, {})]
			})
		]
	});
};
//#endregion
export { InquiryPage };
