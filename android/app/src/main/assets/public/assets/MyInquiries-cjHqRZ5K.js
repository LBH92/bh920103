import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { n as require_jsx_runtime } from "./vendor-react-C0yHVa2Y.js";
import { bn as require_react } from "./vendor-lucide-Dji_Ij8j.js";
import { m as query, o as addDoc, p as orderBy, u as getDocs, x as collection, y as where } from "./vendor-firebase-Dm4AYEor.js";
import { i as db } from "./firebase-fxPuKVc_.js";
import { n as useApp } from "./AppContext-Butl4QWq.js";
//#region src/components/user/InquiryForm.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var InquiryForm = () => {
	const { user, showToast } = useApp();
	const [title, setTitle] = (0, import_react.useState)("");
	const [content, setContent] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("other");
	const [contact, setContact] = (0, import_react.useState)("");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!user) return;
		setSubmitting(true);
		try {
			await addDoc(collection(db, "inquiries"), {
				userId: user.id,
				userName: user.name,
				type,
				title,
				content,
				contact,
				status: "pending",
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			});
			showToast("문의가 접수되었습니다.", "success");
			setTitle("");
			setContent("");
			setContact("");
		} catch (e) {
			showToast("문의 접수에 실패했습니다.", "error");
		}
		setSubmitting(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "space-y-4 p-4 border rounded shadow",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value: type,
				onChange: (e) => setType(e.target.value),
				className: "w-full border p-2 rounded",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "other",
						children: "기타"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "account",
						children: "계정 문의"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "technical",
						children: "기술 문의"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "market",
						children: "시장 데이터 문의"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "text",
				placeholder: "제목",
				value: title,
				onChange: (e) => setTitle(e.target.value),
				required: true,
				className: "w-full border p-2 rounded"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				placeholder: "내용",
				value: content,
				onChange: (e) => setContent(e.target.value),
				required: true,
				className: "w-full border p-2 rounded",
				rows: 4
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "text",
				placeholder: "연락처 (선택)",
				value: contact,
				onChange: (e) => setContact(e.target.value),
				className: "w-full border p-2 rounded"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				disabled: submitting,
				className: "bg-rose-600 text-white p-2 rounded w-full",
				children: "제출하기"
			})
		]
	});
};
//#endregion
//#region src/components/user/MyInquiries.tsx
var MyInquiries = () => {
	const { user } = useApp();
	const [inquiries, setInquiries] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		const fetchInquiries = async () => {
			const q = query(collection(db, "inquiries"), where("userId", "==", user.id), orderBy("createdAt", "desc"));
			const snapshot = await getDocs(q);
			setInquiries(snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data()
			})));
		};
		fetchInquiries();
	}, [user]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-4",
		children: inquiries.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-4 border rounded shadow",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-bold",
					children: [
						i.title,
						" [",
						i.status,
						"]"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: i.content
				}),
				i.answer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 p-2 bg-slate-100 rounded text-sm",
					children: ["답변: ", i.answer]
				})
			]
		}, i.id))
	});
};
//#endregion
export { InquiryForm as n, MyInquiries as t };
