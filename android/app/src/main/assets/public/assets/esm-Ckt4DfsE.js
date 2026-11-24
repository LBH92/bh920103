const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/web-BOAOUm6P.js","assets/dist-DItgYJMn.js"])))=>i.map(i=>d[i]);
import { r as registerPlugin } from "./dist-DItgYJMn.js";
import { t as __vitePreload } from "./preload-helper-CWTytNQo.js";
//#region node_modules/@capacitor/app/dist/esm/index.js
var App = registerPlugin("App", { web: () => __vitePreload(() => import("./web-BOAOUm6P.js").then((m) => new m.AppWeb()), __vite__mapDeps([0,1])) });
//#endregion
export { App };
