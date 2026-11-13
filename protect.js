/* защита фото: водяной знак, запрет сохранения, защита от копии сайта */
const CFG={wm:"© Goon-scrolling 2000",maxSide:1600,hosts:["ktotopart-blip.github.io","localhost","127.0.0.1"]};
const vid=()=>{let v=ls("ss_vid",null);if(!v){v=Math.random().toString(36).slice(2,7).toUpperCase();lsSet("ss_vid",v)}return v},WMT=()=>CFG.wm+" · "+vid();
(function(){
  if(window.top!==window.self&&/github\.io$/.test(location.hostname))try{window.top.location.href=location.href}catch(e){document.body.innerHTML=""}
  if(CFG.hosts.length&&/^https?:/.test(location.protocol)&&!CFG.hosts.includes(location.hostname))document.body.innerHTML='<div style="padding:40px 20px;font:16px Arial,sans-serif;color:#222;background:#fff;min-height:100vh">Это неофициальная копия сайта. Оригинал находится по другому адресу.</div>';
  const okT=e=>/INPUT|TEXTAREA/.test((e.target&&e.target.tagName)||""),shield=()=>{const s=h("div",{style:"position:fixed;inset:0;background:#000;z-index:999"});document.body.append(s);setTimeout(()=>s.remove(),1500)};
  document.addEventListener("contextmenu",e=>{if(!okT(e))e.preventDefault()});
  document.addEventListener("dragstart",e=>e.preventDefault());
  document.addEventListener("keydown",e=>{const k=(e.key||"").toLowerCase(),c=e.ctrlKey||e.metaKey;if(e.key==="F12"||(c&&["s","u","p"].includes(k))||(c&&e.shiftKey&&["i","j","c"].includes(k)))e.preventDefault()});
  document.addEventListener("keyup",e=>{if(e.key==="PrintScreen"){try{navigator.clipboard.writeText("")}catch(x){}shield()}});
  const svg=()=>"url(\"data:image/svg+xml,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='300' height='190'><text x='150' y='105' text-anchor='middle' transform='rotate(-28 150 95)' font-family='Arial' font-size='15' font-weight='700' fill='white' fill-opacity='.2' stroke='black' stroke-opacity='.16' stroke-width='.6'>"+WMT().replace(/[&<>"']/g,"")+"</text></svg>")+"\")";
  function inject(){if(document.getElementById("wmst"))return;const st=document.createElement("style");st.id="wmst";st.textContent="#stage::after,.pw::after,#mw::after{content:'';position:absolute;inset:0;z-index:1;background:"+svg()+";pointer-events:auto;-webkit-touch-callout:none}";document.head.append(st)}
  inject();setInterval(inject,2500)})();
function drawWM(x,w,h,t){x.save();const fs=Math.max(12,Math.round(w/34));x.font="700 "+fs+"px Arial,sans-serif";x.textAlign="center";x.fillStyle="rgba(255,255,255,.26)";x.strokeStyle="rgba(0,0,0,.22)";x.lineWidth=Math.max(1,fs/12);x.translate(w/2,h/2);x.rotate(-Math.PI/7);
  const sx=x.measureText(t).width+fs*3,sy=fs*4.2,n=Math.ceil(Math.hypot(w,h)/Math.min(sx,sy));for(let j=-n;j<=n;j++)for(let i=-n;i<=n;i++){const px=i*sx+(j%2?sx/2:0),py=j*sy;x.strokeText(t,px,py);x.fillText(t,px,py)}x.restore()}
function wmBlob(u){return new Promise(res=>{const i=new Image();i.onload=()=>{const k=Math.min(1,CFG.maxSide/Math.max(i.naturalWidth,i.naturalHeight)),c=document.createElement("canvas");c.width=Math.round(i.naturalWidth*k);c.height=Math.round(i.naturalHeight*k);const x=c.getContext("2d");x.drawImage(i,0,0,c.width,c.height);drawWM(x,c.width,c.height,WMT());c.toBlob(b=>res(b),"image/jpeg",.85)};i.onerror=()=>res(null);i.src=u})}
