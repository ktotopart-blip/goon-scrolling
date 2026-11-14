/* защита фото: запрет сохранения, защита от копии сайта (без водяных знаков) */
const CFG={maxSide:1600,hosts:["ktotopart-blip.github.io","localhost","127.0.0.1"]};
(function(){
  if(window.top!==window.self&&/github\.io$/.test(location.hostname))try{window.top.location.href=location.href}catch(e){document.body.innerHTML=""}
  if(CFG.hosts.length&&/^https?:/.test(location.protocol)&&!CFG.hosts.includes(location.hostname))document.body.innerHTML='<div style="padding:40px 20px;font:16px Arial,sans-serif;color:#222;background:#fff;min-height:100vh">Это неофициальная копия сайта. Оригинал находится по другому адресу.</div>';
  const okT=e=>/INPUT|TEXTAREA/.test((e.target&&e.target.tagName)||""),shield=()=>{const s=h("div",{style:"position:fixed;inset:0;background:#000;z-index:999"});document.body.append(s);setTimeout(()=>s.remove(),1500)};
  document.addEventListener("contextmenu",e=>{if(!okT(e))e.preventDefault()});
  document.addEventListener("dragstart",e=>e.preventDefault());
  document.addEventListener("keydown",e=>{const k=(e.key||"").toLowerCase(),c=e.ctrlKey||e.metaKey;if(e.key==="F12"||(c&&["s","u","p"].includes(k))||(c&&e.shiftKey&&["i","j","c"].includes(k)))e.preventDefault()});
  document.addEventListener("keyup",e=>{if(e.key==="PrintScreen"){try{navigator.clipboard.writeText("")}catch(x){}shield()}});
  /* прозрачный слой поверх фото: блокирует долгое нажатие и «сохранить как» */
  function inject(){if(document.getElementById("wmst"))return;const st=document.createElement("style");st.id="wmst";st.textContent="#stage::after,.pw::after,#mw::after{content:'';position:absolute;inset:0;z-index:1;pointer-events:auto;-webkit-touch-callout:none}";document.head.append(st)}
  inject();setInterval(inject,2500)})();
/* копия фото для «Поделиться»: уменьшенная, без данных съёмки */
function copyBlob(u){return new Promise(res=>{const i=new Image();i.onload=()=>{const k=Math.min(1,CFG.maxSide/Math.max(i.naturalWidth,i.naturalHeight)),c=document.createElement("canvas");c.width=Math.round(i.naturalWidth*k);c.height=Math.round(i.naturalHeight*k);c.getContext("2d").drawImage(i,0,0,c.width,c.height);c.toBlob(b=>res(b),"image/jpeg",.88)};i.onerror=()=>res(null);i.src=u})}
