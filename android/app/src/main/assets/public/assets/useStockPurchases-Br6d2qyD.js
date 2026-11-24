import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { bn as require_react } from "./vendor-lucide-Dji_Ij8j.js";
import { f as firebaseRepository } from "./AppContext-Butl4QWq.js";
//#region src/hooks/useStockPurchases.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var useStockPurchases = (uid) => {
	const [purchases, setPurchases] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (uid) {
			setLoading(true);
			firebaseRepository.getUserStockPurchases(uid).then((data) => {
				setPurchases(data);
				setLoading(false);
			});
		}
	}, [uid]);
	const savePurchases = async (symbol, entries) => {
		if (uid) {
			await firebaseRepository.saveUserStockPurchases(uid, symbol, entries);
			setPurchases((prev) => ({
				...prev,
				[symbol]: entries
			}));
		}
	};
	return {
		purchases,
		savePurchases,
		loading
	};
};
//#endregion
export { useStockPurchases as t };
