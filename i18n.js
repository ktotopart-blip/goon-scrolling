/* Текстовые подписи остаются только на русском; T() ничего не меняет и оставлен
   ради совместимости со старыми вызовами по всему коду. */
function T(s){return s}
/* акцентный цвет */
const ACCENTS={purple:["#8b5cf6","#c4b0ff","196,176,255"],pink:["#ec4899","#ffb3d9","255,179,217"],red:["#ef4444","#ffb3b3","255,179,179"],blue:["#3b82f6","#b3d4ff","179,212,255"]};
function applyAccent(){if(fem)return;const a=ACCENTS[ls("ss_accent","purple")]||ACCENTS.purple,r=document.documentElement.style;r.setProperty("--pur",a[0]);r.setProperty("--lil",a[1]);r.setProperty("--pt",a[2])}
applyAccent();
