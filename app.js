function ask(msg,yes){const o=h("div",{style:"position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:20;padding:16px"},h("div",{cls:"card",style:"max-width:340px;margin:0"},h("div",{style:"margin-bottom:14px;font-weight:600"},msg),h("div",{cls:"row"},h("button",{on:{click:()=>o.remove()}},T("Отмена")),h("button",{cls:"p",on:{click:()=>{o.remove();yes()}}},T("Удалить")))));document.body.append(o)}
function fb(t){const a=h("textarea",{style:"position:fixed;opacity:0"});a.value=t;document.body.append(a);a.select();let ok=false;try{ok=document.execCommand("copy")}catch(e){}a.remove();toast(ok?"Скопировано, можно отправлять":"Не удалось скопировать")}
function copy(t){if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(t).then(()=>toast("Скопировано, можно отправлять"),()=>fb(t))}else fb(t)}
const bc={};
function blobOf(r){const u=urlOf(r);if(!u)return Promise.resolve(null);return bc[u]||(bc[u]=copyBlob(u))}
async function shareRec(r){
  const u=urlOf(r),site=location.href.split("#")[0],photo=u?new URL(u,location.href).href:"";
  const head="Я кончил за "+fmtMs(r.ms)+" ("+fmtDT(r.ts)+")";
  const full=head+(photo?". Вот на какое фото: "+photo:"")+"\n"+site;
  if(!navigator.share){copy(full);return}
  try{
    const bl=navigator.canShare?await blobOf(r):null;
    if(bl){const nm=decodeURIComponent((u.split("/").pop()||"foto.jpg")),f=new File([bl],nm.replace(/\.[^.]+$/,"")+".jpg",{type:bl.type||"image/jpeg"});
      if(navigator.canShare({files:[f]})){await navigator.share({files:[f],title:"Goon-scrolling 2000",text:head+"\n"+site});return}}
  }catch(e){if(e&&e.name==="AbortError")return}
  try{await navigator.share({title:"Goon-scrolling 2000",text:head+(photo?". Вот на какое фото: "+photo:""),url:site})}catch(e){if(!e||e.name!=="AbortError")copy(full)}}
function openPhoto(u,r){if(!u){toast("Фото недоступно");return}const im=$("#mimg"),cv=$("#mcv");im.onload=()=>paintSplash(cv,im,r);im.src=u;$("#modal").style.display="flex";pushV(view,{m:1});if(im.complete)paintSplash(cv,im,r)}
function hideModal(){$("#modal").style.display="none"}
function closeModal(){const H=hs();if(H&&H.state&&H.state.m)H.back();else hideModal()}
$("#mclose").onclick=closeModal;$("#modal").onclick=e=>{if(e.target.id==="modal")closeModal()};
function leave(){wlOff();exitFs();gameStop();clearTimeout(timer);musicStop();finishing=false}
function go(v){leave();if(v==="home"&&view!=="home"&&hd()>0){hs().back();return}if(v!=="home")pushV(v);view=v;render();window.scrollTo(0,0)}
addEventListener("popstate",e=>{
  if(typeof bossEl!=="undefined"&&bossEl){closeBoss();return}
  const md=$("#modal");if(md&&md.style.display==="flex"){hideModal();return}
  const v=e.state&&e.state.v;leave();view=["calendar","records","stats","ach","settings"].includes(v)?v:"home";render();window.scrollTo(0,0)});

/* ---------- слайд-шоу ---------- */
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
/* «мешок» без повторов: каждый элемент показывается один раз, пока не кончится весь список, затем мешок тасуется заново */
const _bags=new Map();
function pick(a){if(!a||!a.length)return "";if(a.length===1)return a[0];
  const key=a.length+"|"+a[0]+"|"+a[a.length-1];let st=_bags.get(key);
  if(!st||!st.q.length){let q=shuffle(a.map((_,i)=>i));if(st&&q.length>1&&q[q.length-1]===st.last){const t=q[0];q[0]=q[q.length-1];q[q.length-1]=t}st={q,last:st?st.last:-1};_bags.set(key,st)}
  const idx=st.q.pop();st.last=idx;return a[idx]}
function draw(){const ids=photos.filter(p=>!broken.has(p.id)).map(p=>p.id);bag=bag.filter(i=>ids.includes(i));
  if(!bag.length){bag=shuffle(ids.slice());const last=hist[hist.length-1];if(bag.length>1&&bag[bag.length-1]===last){[bag[0],bag[bag.length-1]]=[bag[bag.length-1],bag[0]]}}
  return bag.pop()}
function start(){
  if(!photos.length){toast(dbState==="loading"?"Фото ещё загружаются…":"Пока нет фотографий");return}
  bag=primed||[];primed=null;hist=[];caps=[];pos=-1;shown=0;shownId=null;finishing=false;t0=Date.now();view="show";pushV("show");render();wlOn();musicStart();gameStart();next(true)}
function next(first){
  if(pos<hist.length-1){pos++}else{hist.push(draw());shown++;caps.push(shown%3===0||shown%5===0?pickL(PH().c):"");pos=hist.length-1;gameNew()}
  showCur();}
function prev(){if(finishing)return;if(pos>0){pos--;showCur()}else toast(T("Это первая фотография"))}
let swapTok=0,shownId=null,primed=null;
const depth=()=>{const c=navigator.connection;if(c&&c.saveData)return 1;const q=c&&c.effectiveType;return !q||q==="4g"?3:q==="3g"?2:1};
function prime(){if(!photos.length||(navigator.connection&&navigator.connection.saveData))return;const ids=usable().map(p=>p.id);primed=shuffle(ids.slice());for(let i=1;i<=Math.min(2,ids.length);i++)preload(primed[primed.length-i],i===1?"high":"low")}
function showCur(){
  const id=hist[pos],p=photos.find(p=>p.id===id),img=$("#simg");if(!img)return;
  const tok=++swapTok,N=usable().length;
  $("#cnt").textContent="Фото №"+(pos+1)+" · круг "+Math.min(N,N-bag.length)+"/"+N+(esc()?" · накал "+lvl()+"/3":"");
  clearTimeout(timer);if(!p)return;
  img.onload=()=>img.style.opacity=1;
  img.onerror=()=>{if(!id)return;broken.add(id);toast(T("Фото пропущено, не открывается: ")+decodeURIComponent(id));if(!usable().length){toast(T("Нет рабочих фото"));go("home");return}if(pos===hist.length-1){hist.pop();caps.pop();pos=hist.length-1;shown--}next()};
  const done=()=>{if(tok!==swapTok)return;shownId=id;img.style.opacity=1;img.src=p.url;const sb=$("#sbg");if(sb)sb.style.backgroundImage='url("'+p.url+'")';
    $("#cap").textContent=caps[pos]||"";const dl=gDelay(),bb=$("#bar");if(bb){bb.style.animation="none";void bb.offsetWidth;bb.style.animation="bar "+dl+"s linear forwards"}
    clearTimeout(timer);timer=setTimeout(()=>next(),dl*1000);for(let i=1;i<=depth();i++)preload(bag[bag.length-i],i===1?"high":"low")};
  const im=pre[id]||preload(id,"high");
  if(im&&im.complete&&im.naturalWidth)done();
  else{const w=setTimeout(()=>{if(tok===swapTok)img.style.opacity=.55},450),ok=()=>{clearTimeout(w);done()};(im&&im.decode?im.decode():Promise.reject()).then(ok,ok)}}
let finishing=false,newAch=[];const pre={},broken=new Set(),usable=()=>photos.filter(p=>!broken.has(p.id));
function preload(id,pr){const p=photos.find(x=>x.id===id);if(!p)return null;if(pre[id])return pre[id];const i=new Image();i.decoding="async";if(pr)i.fetchPriority=pr;i.src=p.url;pre[id]=i;if(i.decode)i.decode().catch(()=>{});const k=Object.keys(pre);if(k.length>10)delete pre[k[0]];return i}
function finish(){
  if(finishing||!gameCanFinish())return;finishing=true;gameStop();clearTimeout(timer);musicStop();const ms=Date.now()-t0,p=photos.find(p=>p.id===(shownId||hist[pos]));
  const r={id:String(Date.now()),ts:Date.now(),ms,pid:shownId||hist[pos],url:p?p.url:"",seed:(Math.random()*1e9|0)+1,fx:true};
  r.ph=pickL(PH().f);gameMark(r);const had=ACH.map(x=>x[2](recs()));const all=recs();all.push(r);lsSet(RK,all);newAch=ACH.map((x,i)=>i).filter(i=>!had[i]&&ACH[i][2](all));pending=r;const S=mkSplats(r.seed);
  const st=$("#stage"),im=$("#simg"),cv=h("canvas",{cls:"spl"}),bb=$("#bar");if(bb)bb.style.animation="none";st.append(cv);setTimeout(()=>{if(view==="show")st.append(h("div",{id:"fin"},r.ph))},900);
  splash(cv,im,S,()=>setTimeout(()=>{if(view==="show"){finishing=false;wlOff();exitFs();replV("result");view="result";render()}},RM?1500:1500))}

/* ---------- экраны ---------- */
function render(){if(view==="home"&&!primed)prime();if(view==="show")window.fxOff=true;else if(window.fxGo)fxGo();app.replaceChildren();({home,show,result,calendar,records,stats,ach,settings}[view])()}
function intervalBox(onch){
  const lab=h("b",{cls:"num"},interval+" с");
  const s=h("input",{type:"range",min:1,max:60,step:1,value:interval,"aria-label":"Интервал"});
  s.style.setProperty("--f",(interval-1)/59*100+"%");s.addEventListener("input",()=>{interval=+s.value;s.style.setProperty("--f",(interval-1)/59*100+"%");lab.textContent=interval+" с";lsSet("ss_int",interval);onch&&onch()});
  return h("div",null,h("div",{cls:"row",style:"justify-content:space-between"},h("span",null,T("Интервал смены фото")),lab),s,h("div",{cls:"row mut",style:"justify-content:space-between"},h("span",null,T("1 с")),h("span",{style:"text-align:right"},T("1 мин"))))}
/* ---------- музыка ---------- */
function musicBox(){
  const on=audioOn&&tracks.length>0;
  const sw=h("button",{cls:"sw"+(on?" on":""),role:"switch","aria-checked":String(on),"aria-label":"Стоны",on:{click:()=>{
    if(!tracks.length){toast(dbState==="loading"?"Аудио ещё загружается…":"Аудиофайлов пока нет");return}
    audioOn=!audioOn;lsSet("ss_aud_on",audioOn);render()}}},h("i"));
  return h("div",{cls:"row",style:"justify-content:space-between;flex-wrap:nowrap"},h("div",{style:"flex:1"},h("div",null,"Стоны"),h("div",{cls:"mut"},tracks.length?(on?"Включена · треков: ":"Выключена · треков: ")+tracks.length:dbState==="loading"?"Загрузка…":"Треки не найдены")),sw)}
function playTrack(){audioEl.src=apl[ai];audioEl.play().catch(()=>toast("Браузер не дал включить музыку"))}
function musicStart(){if(!audioOn||!tracks.length)return;apl=shuffle(tracks.slice());ai=0;aerr=0;playTrack()}
function musicStop(){try{audioEl.pause();audioEl.removeAttribute("src");audioEl.load()}catch(e){}apl=[]}
audioEl.addEventListener("ended",()=>{if(!apl.length)return;aerr=0;ai++;if(ai>=apl.length){ai=0;shuffle(apl)}playTrack()});
audioEl.addEventListener("error",()=>{if(!apl.length)return;aerr++;if(aerr>=apl.length){toast("Не удалось воспроизвести аудио");musicStop();return}ai=(ai+1)%apl.length;playTrack()});
function statStrip(){const a=recs(),best=a.length?fmtMs(Math.min(...a.map(x=>x.ms))):"—",ok=ACH.filter(x=>x[2](a)).length,P=(l,v)=>h("div",{cls:"pill"},h("div",{cls:"pv"},String(v)),h("div",{cls:"mut"},l));
  return h("div",{cls:"stats"},P(T("Записей"),a.length),P(T("Лучшее"),best),P(T("Награды"),ok+"/"+ACH.length))}
function home(){
  const n=photos.length;
  app.append(h("h1",{cls:"hero"},"Goon-scrolling",h("br"),"2000"),h("div",{cls:"phr"},fem?"Режим для девушек":""),
    h("div",{cls:"mut"},dbState==="loading"?T("Загружаю фотографии…"):dbState==="none"?T("Не удалось загрузить список фотографий. Обновите страницу."):T("Фотографий в коллекции: ")+n),h("button",{cls:"ib",style:"margin-top:10px",on:{click:diagDialog}},T("Проверить фото")),
    statStrip(),h("div",{cls:"card"},intervalBox(),h("div",{style:"height:14px"}),musicBox(),h("div",{style:"height:14px"}),h("button",{cls:"p big",on:{click:start}},T("Начать")),h("div",{style:"height:10px"}),h("div",{cls:"grid2"},h("button",{on:{click:()=>{calM=new Date();calSel=null;go("calendar")}}},T("Календарь")),h("button",{on:{click:()=>go("records")}},T("Рекорды")),h("button",{on:{click:()=>go("stats")}},T("Статистика")),h("button",{on:{click:()=>go("ach")}},T("Достижения")),h("button",{style:"grid-column:1/-1",on:{click:()=>go("settings")}},T("Настройки")),h("button",{style:"grid-column:1/-1",on:{click:boss}},T("Босс идёт")))),modeBox(),gameBox(),
    h("div",{cls:"log"},
      h("h2",null,T("Последние записи секундомера")),
      (()=>{const r=recs().slice(-5).reverse();return r.length?h("div",null,r.map(x=>h("div",{cls:"rec"},withSplash(x,"",()=>openPhoto(urlOf(x),x),true),h("div",{cls:"t"},fmtDT(x.ts)),h("b",null,fmtMs(x.ms)))) ):h("div",{cls:"mut"},T("Пока пусто — запусти слайд-шоу и нажми «Кончить»."))})()));
  }
let idleT=0,wl=null,sx0=0,sy0=0;
let lastPing=0;
function fsPing(){const sv=$("#sv");if(!sv)return;const n=Date.now();if(n-lastPing<300&&!sv.classList.contains("idle"))return;lastPing=n;sv.classList.remove("idle");clearTimeout(idleT);idleT=setTimeout(()=>{if(sv.classList.contains("fs"))sv.classList.add("idle")},3500)}
async function wlOn(){try{if(navigator.wakeLock&&!wl)wl=await navigator.wakeLock.request("screen")}catch(e){}}
function wlOff(){try{if(wl)wl.release()}catch(e){}wl=null}
const swS=e=>{const t=e.touches&&e.touches[0];if(t){sx0=t.clientX;sy0=t.clientY}},swE=e=>{const t=e.changedTouches&&e.changedTouches[0];if(!t||finishing)return;if(t.clientX-sx0>80&&Math.abs(t.clientY-sy0)<60)prev()};
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&view==="show"&&!wl)wlOn()});
addEventListener("keydown",e=>{if(view!=="show"||/INPUT|TEXTAREA/.test((e.target&&e.target.tagName)||""))return;if(e.key==="ArrowLeft")prev();else if(e.code==="KeyF"&&!e.ctrlKey&&!e.metaKey)toggleFs()});
function exitFs(){const sv=$("#sv");if(sv)sv.classList.remove("fs","idle");document.body.classList.remove("fsm");clearTimeout(idleT);const b=$("#fsb");if(b)b.textContent=T("На весь экран");if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(()=>{})}
function toggleFs(){const sv=$("#sv");if(!sv)return;if(sv.classList.contains("fs")){exitFs();return}
  sv.classList.add("fs");document.body.classList.add("fsm");fsPing();$("#fsb").textContent=T("Свернуть");evInc("fs");const rq=sv.requestFullscreen||sv.webkitRequestFullscreen;if(rq)try{const p=rq.call(sv);if(p&&p.catch)p.catch(()=>{})}catch(e){}}
document.addEventListener("fullscreenchange",()=>{if(!document.fullscreenElement)exitFs()});
function show(){
  app.append(h("div",{id:"sv",on:{pointerdown:fsPing,pointermove:fsPing,touchstart:swS,touchend:swE}},
    h("div",{cls:"sh"},h("span",{id:"cnt",cls:"mut"}),h("div",{cls:"shb"},h("button",{id:"fsb",cls:"ib",on:{click:toggleFs}},T("На весь экран")),h("button",{cls:"ib",on:{click:boss}},T("Босс!")),h("button",{cls:"ib",on:{click:()=>go("home")}},T("Выйти")))),
    h("div",{id:"stage"},h("div",{id:"sbg"}),h("img",{id:"simg",alt:"Фото"}),h("div",{id:"bar"}),h("div",{id:"cmd"})),h("div",{id:"cap"}),
    h("div",{id:"gstat",cls:"mut"}),
    h("div",{cls:"ctl2"},h("button",{on:{click:prev}},T("← Назад")),h("button",{id:"fbtn",cls:"p big",on:{click:finish}},"Кончить"))))}
function result(){
  const r=pending;blobOf(r);if(newAch.length){const m=newAch.map(i=>AN(i)[2]+" "+AN(i)[0]).join(", ");newAch=[];setTimeout(()=>toast("Достижение: "+m),700)}
  app.append(h("h1",null,resTitle(r)),h("div",{cls:"mut"},T("Фото закреплено в календаре")),h("div",{cls:"phr"},r.ph||""),h("div",{cls:"big-t"},fmtMs(r.ms)),
    (()=>{const wp=withSplash(r,"",()=>openPhoto(urlOf(r),r),true);return h("div",{cls:"card"},wp,h("div",{cls:"mut",style:"margin-top:10px"},fmtDT(r.ts)),r.fx&&r.seed?h("button",{style:"width:100%;margin-top:12px",on:{click:()=>wipe(wp.querySelector("canvas"),()=>{const all=recs(),x=all.find(v=>v.id===r.id);if(x){x.fx=false;lsSet(RK,all)}r.fx=false;toast(T("Вытерто"));evInc("wipe");render()})}},T("Вытереться")):null)})(),
    h("button",{cls:"p big",on:{click:()=>shareRec(r)}},T("Поделиться результатом")),h("div",{style:"height:10px"}),h("div",{cls:"row"},h("button",{cls:"p",on:{click:()=>go("home")}},T("На главную")),h("button",{on:{click:()=>{calM=new Date(r.ts);calSel=dkey(new Date(r.ts));go("calendar")}}},T("Открыть календарь"))))}
function page(t,...k){app.append(h("button",{on:{click:()=>go("home")}},T("← На главную")),h("h1",null,t),...k.flat().filter(Boolean))}
function records(){const a=recs(),lst=(t,r)=>h("div",{cls:"log",style:"margin-top:22px"},h("h2",null,t),r.length?r.map((x,i)=>h("div",{cls:"rec"},h("b",{style:"width:22px"},String(i+1)),withSplash(x,"",()=>openPhoto(urlOf(x),x),true),h("div",{cls:"t"},fmtDT(x.ts)),h("b",null,fmtMs(x.ms)))):h("div",{cls:"mut"},T("Пока нет записей")));
  page(T("Рекорды"),lst(T("Самые быстрые"),a.slice().sort((p,q)=>p.ms-q.ms).slice(0,5)),lst(T("Самые долгие"),a.slice().sort((p,q)=>q.ms-p.ms).slice(0,5)))}
function dayCounts(a){const m={};a.forEach(x=>{const k=dkey(new Date(x.ts));m[k]=(m[k]||0)+1});return m}
function streaks(a){const days=[...new Set(a.map(x=>dkey(new Date(x.ts))))].sort();let run=1,best=days.length?1:0;for(let i=1;i<days.length;i++){run=new Date(days[i])-new Date(days[i-1])===864e5?run+1:1;best=Math.max(best,run)}
  let cur=0;if(days.length){const today=dkey(new Date());let d=new Date();if(days.includes(today)||days.includes(dkey(new Date(Date.now()-864e5)))){if(!days.includes(today))d=new Date(Date.now()-864e5);cur=1;while(days.includes(dkey(new Date(d-864e5)))){cur++;d=new Date(d-864e5)}}}
  return{cur,best}}
function heatmap(a){const m=dayCounts(a),W=17,today=new Date();today.setHours(0,0,0,0);const start=new Date(today);start.setDate(start.getDate()-(W*7-1)-((today.getDay()+6)%7));
  const cols=[];for(let w=0;w<W;w++){const col=[];for(let d=0;d<7;d++){const dt=new Date(start);dt.setDate(dt.getDate()+w*7+d);const k=dkey(dt),c=m[k]||0,lvl=c===0?0:c===1?1:c<=3?2:3;col.push(h("div",{cls:"hm l"+lvl,title:k+": "+c}))}cols.push(h("div",{cls:"hmcol"},col))}
  return h("div",{cls:"hmrow"},cols)}
function shareWeek(a){const now=Date.now(),wk=a.filter(x=>x.ts>now-7*864e5),n=wk.length,best=n?Math.min(...wk.map(x=>x.ms)):0,cnt={};wk.forEach(x=>cnt[x.pid]=(cnt[x.pid]||0)+1);
  const fav=Object.entries(cnt).sort((p,q)=>q[1]-p[1])[0],st=streaks(a),c=document.createElement("canvas");c.width=1000;c.height=560;const x=c.getContext("2d"),g=x.createRadialGradient(500,0,0,500,560,900);g.addColorStop(0,fem?"#3a1030":"#241048");g.addColorStop(1,"#0c0a16");x.fillStyle=g;x.fillRect(0,0,1000,560);
  x.fillStyle="#f4f0ff";x.font="700 46px Arial";x.fillText("Goon-scrolling 2000",48,80);x.fillStyle=fem?"#ffb3d9":"#c4b0ff";x.font="600 26px Arial";x.fillText("Итоги недели",48,122);
  const rows=[["Записей за неделю",String(n)],["Лучшее время",n?fmtMs(best):"—"],["Текущая серия дней",String(st.cur)],["Лучшая серия",String(st.best)]];
  x.font="500 30px Arial";rows.forEach((r,i)=>{const y=210+i*68;x.fillStyle="#a398c0";x.fillText(r[0],48,y);x.fillStyle="#fff";x.font="700 34px Arial";x.textAlign="right";x.fillText(r[1],952,y);x.textAlign="left";x.font="500 30px Arial"});
  x.fillStyle="#6a5f88";x.font="22px Arial";x.fillText(new Date().toLocaleDateString("ru-RU"),48,520);
  c.toBlob(async b=>{if(!b)return;const f=new File([b],"week.jpg",{type:"image/jpeg"});if(navigator.share&&navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:"Goon-scrolling 2000"});return}catch(e){if(e&&e.name==="AbortError")return}}dl(b,"goon-week-"+dkey(new Date())+".jpg")},"image/jpeg",.92)}
function stats(){const a=recs(),n=a.length,tot=a.reduce((s,x)=>s+x.ms,0),cnt={};a.forEach(x=>{cnt[x.pid]=(cnt[x.pid]||0)+1});
  const fav=Object.entries(cnt).sort((p,q)=>q[1]-p[1])[0],fr=fav&&a.find(x=>x.pid===fav[0]),on=k=>a.filter(x=>dkey(new Date(x.ts))===k).length,st=streaks(a);
  const tile=(l,v)=>h("div",{cls:"card",style:"margin:0;text-align:center"},h("div",{cls:"num"},String(v)),h("div",{cls:"mut"},l));
  const days=[...Array(7)].map((_,i)=>{const d=new Date(Date.now()-(6-i)*864e5);return{l:d.toLocaleDateString("ru-RU",{weekday:"short"}),c:on(dkey(d))}}),mx=Math.max(1,...days.map(d=>d.c));
  page(T("Статистика"),h("div",{cls:"grid2"},tile(T("Всего"),n),tile(T("Сегодня"),on(dkey(new Date()))),tile(T("За 7 дней"),a.filter(x=>x.ts>Date.now()-7*864e5).length),tile(T("Среднее время"),n?fmtMs(tot/n):"—"),tile(T("Всего времени"),fmtMs(tot)),tile(T("Лучшее время"),n?fmtMs(Math.min(...a.map(x=>x.ms))):"—")),
    h("div",{cls:"card"},h("div",{cls:"grid2"},tile(T("Текущая серия"),st.cur+" "+T("дней")),tile(T("Лучшая серия"),st.best+" "+T("дней")))),
    h("div",{cls:"card"},h("h2",null,T("Активность")),heatmap(a)),
    h("div",{cls:"card"},h("h2",null,T("Последние 7 дней")),h("div",{cls:"bars"},days.map(d=>h("div",{cls:"bc"},h("div",{cls:"bv",style:"height:"+Math.round(d.c/mx*80)+"%"}),h("span",{cls:"mut"},d.l+" "+d.c))))),
    fr?h("div",{cls:"card"},h("h2",null,T("Любимое фото")),h("div",{cls:"rec"},withSplash(fr,"",()=>openPhoto(urlOf(fr),fr),true),h("div",{cls:"t"},T("Выбрано раз: ")+fav[1]))):null,
    h("button",{cls:"p big",style:"margin-top:4px",on:{click:()=>shareWeek(a)}},T("Поделиться итогами недели")))}
function ach(){const a=recs(),ok=ACH.map(x=>x[2](a));page(T("Достижения"),h("div",{cls:"mut"},T("Открыто ")+ok.filter(Boolean).length+T(" из ")+ACH.length),ACH.map((x,i)=>{const n=AN(i);return h("div",{cls:"card ach"+(ok[i]?"":" lock"),style:"margin:10px 0"},h("div",{cls:"medal"},n[2]),h("div",null,h("b",null,(ok[i]?"":"🔒 ")+n[0]),h("div",{cls:"mut"},n[1])))}))}
function modeBox(){const R=fem?[["d","Доминантный"],["s","Послушный"]]:[["n","Обычный"],["d","Доминантная"],["s","Послушная"]],u=location.origin+location.pathname+(fem?"":"?mode=f");
  return h("div",{cls:"card"},h("h2",null,fem?T("Голос: мужчина"):T("Голос: девушка")),h("div",{cls:"mut",style:"margin-bottom:10px"},T("От чьего лица звучат подписи")),
    h("div",{cls:"seg"},R.map(([k,l])=>h("button",{cls:role===k?"p":"",on:{click:()=>{role=k;lsSet("ss_role_"+(fem?"f":"m"),k);render()}}},T(l)))),
    h("div",{style:"height:10px"}),h("button",{cls:fem?"boy":"girl",style:"width:100%",on:{click:()=>{location.href=u}}},fem?T("Перейти в режим для парней"):T("Перейти в режим для девушек")))}
function calendar(){
  const all=recs(),days=new Set(all.map(r=>dkey(new Date(r.ts)))),cm={},y=calM.getFullYear(),m=calM.getMonth();
  all.forEach(r=>{const k=dkey(new Date(r.ts));cm[k]=(cm[k]||0)+1});
  const first=new Date(y,m,1),off=(first.getDay()+6)%7,dim=new Date(y,m+1,0).getDate(),today=dkey(new Date());
  const cells=[T("Пн"),T("Вт"),T("Ср"),T("Чт"),T("Пт"),T("Сб"),T("Вс")].map(d=>h("div",{cls:"dn"},d));
  for(let i=0;i<off;i++)cells.push(h("i"));
  for(let d=1;d<=dim;d++){const k=y+"-"+String(m+1).padStart(2,"0")+"-"+String(d).padStart(2,"0");
    cells.push(h("button",{cls:(days.has(k)?"has ":"")+(k===calSel?"sel ":"")+(k===today?"today ":"")+(((off+d-1)%7)>=5?"we":""),on:{click:()=>{calSel=k;render()}}},String(d),cm[k]?h("span",{cls:"bd"},String(cm[k])):null))}
  const title=first.toLocaleDateString("ru-RU",{month:"long",year:"numeric"});
  const shift=n=>()=>{calM=new Date(y,m+n,1);calSel=null;render()};
  const list=calSel?all.filter(r=>dkey(new Date(r.ts))===calSel).sort((a,b)=>a.ts-b.ts):[];
  app.append(h("button",{on:{click:()=>go("home")}},T("← На главную")),h("h1",null,T("Календарь")),
    h("div",{cls:"card cal-card"},h("div",{cls:"calh"},h("button",{cls:"ar",on:{click:shift(-1)},"aria-label":T("Предыдущий месяц")},"‹"),h("div",{cls:"mt"},title),h("button",{cls:"ar",on:{click:shift(1)},"aria-label":T("Следующий месяц")},"›")),
      h("div",{cls:"cal"},cells),
      h("div",{cls:"legend"},h("span",null,h("i",{cls:"lg a"}),T("есть записи")),h("span",null,h("i",{cls:"lg b"}),T("сегодня")),h("button",{cls:"tdy",on:{click:()=>{calM=new Date();calSel=today;render()}}},T("Сегодня")))),
    h("div",{cls:"card"},h("h2",{style:"margin-top:0"},calSel?T("Записи за ")+calSel.split("-").reverse().join("."):T("Выбери день")),
      calSel&&!list.length?h("div",{cls:"mut"},T("В этот день записей нет.")):null,
      list.map(r=>h("div",{cls:"rec"},withSplash(r,"",()=>openPhoto(urlOf(r),r),true),
        h("div",{cls:"t"},new Date(r.ts).toLocaleTimeString("ru-RU"),h("br"),h("b",null,"⏱ "+fmtMs(r.ms))),
        h("div",{style:"display:flex;align-items:center;gap:8px;flex:none"},h("span",{cls:"mut"},T("Брызги")),h("button",{cls:"sw"+(r.fx&&r.seed?" on":""),role:"switch","aria-checked":String(!!(r.fx&&r.seed)),"aria-label":T("Показывать брызги"),on:{click:()=>toggleFx(r.id)}},h("i"))),h("button",{on:{click:()=>shareRec(r)}},T("Поделиться")),h("button",{on:{click:()=>openPhoto(urlOf(r),r)}},T("Открыть")),
        h("button",{cls:"d",on:{click:()=>ask(T("Удалить эту запись?"),()=>{lsSet(RK,recs().filter(x=>x.id!==r.id));render();toast(T("Запись удалена"))})}},T("Удалить"))))))}

/* ---------- список фото из папки photos репозитория ---------- */
async function listNames(force){
  try{const c=force?null:sessionStorage.getItem("ss_list_"+PD);if(c)return JSON.parse(c)}catch(e){}
  let names=null;
  try{const o=location.hostname.split(".")[0];let rp=location.pathname.split("/")[1]||"";if(!rp||/\.html?$/.test(rp))rp=location.hostname;
    const r=await fetch("https://api.github.com/repos/"+o+"/"+rp+"/contents/"+PD);
    if(r.ok){const j=await r.json(),F=j.filter(f=>f.type==="file");names=F.map(f=>f.name);window.DIRS=j.filter(f=>f.type==="dir").map(f=>f.name);window.SIZES=Object.fromEntries(F.map(f=>[f.name,f.size]))}}catch(e){}
  if(!names){try{const r=await fetch(PD+".json",{cache:"no-cache"});if(r.ok){const j=await r.json();if(Array.isArray(j))names=j}}catch(e){}}
  if(names){window.RAW=names.slice();names=names.filter(n=>/\.(jpe?g|png|webp|gif|avif)$/i.test(n)).sort();try{sessionStorage.setItem("ss_list_"+PD,JSON.stringify(names))}catch(e){}}
  return names}
async function listAudio(){
  try{const c=sessionStorage.getItem("ss_aud_"+AD);if(c)return JSON.parse(c)}catch(e){}
  let names=null;
  try{const o=location.hostname.split(".")[0];let rp=location.pathname.split("/")[1]||"";if(!rp||/\.html?$/.test(rp))rp=location.hostname;
    const r=await fetch("https://api.github.com/repos/"+o+"/"+rp+"/contents/"+AD);
    if(r.ok){const j=await r.json();names=j.filter(f=>f.type==="file").map(f=>f.name)}}catch(e){}
  if(!names){try{const r=await fetch(AD+".json",{cache:"no-cache"});if(r.ok){const j=await r.json();if(Array.isArray(j))names=j}}catch(e){}}
  if(names){names=names.filter(n=>/\.(mp3|m4a|aac|ogg|oga|opus|wav|flac)$/i.test(n)).sort();try{sessionStorage.setItem("ss_aud_"+AD,JSON.stringify(names))}catch(e){}}
  return names||[]}
function ageGate(){if(ls("ss_18",false))return;const o=h("div",{id:"gate"},h("div",{cls:"card",style:"max-width:380px;text-align:center"},h("h1",null,T("18+")),h("p",null,T("Сайт содержит шуточный контент для взрослых. Вам есть 18 лет?")),h("button",{cls:"p big",on:{click:()=>{lsSet("ss_18",true);o.remove()}}},T("Мне есть 18")),h("div",{style:"height:10px"}),h("button",{style:"width:100%",on:{click:()=>{location.href="https://ru.wikipedia.org"}}},T("Мне нет 18"))));document.body.append(o)}
async function init(){
  try{const o=location.hostname.split(".")[0];let rp=location.pathname.split("/")[1]||"";if(!rp||/\.html?$/.test(rp))rp=location.hostname;const td=fem?"thumbs_f":"thumbs",r=await fetch("https://api.github.com/repos/"+o+"/"+rp+"/contents/"+td);if(r.ok){const j=await r.json();window.THUMBS=new Set(j.filter(f=>f.type==="file").map(f=>f.name.replace(/\.[^.]+$/,"")))}}catch(e){}
  {const st=hs()&&history.state;if(st&&["calendar","records","stats","ach","settings"].includes(st.v))view=st.v;else replV("home")}
  ageGate();if("serviceWorker" in navigator&&/^https?:/.test(location.protocol))navigator.serviceWorker.register("sw.js").catch(()=>{});
  render();
  const [names,anames]=await Promise.all([listNames(),listAudio()]);
  tracks=anames.map(n=>AD+"/"+encodeURIComponent(n));
  if(!names){dbState="none"}else{photos=names.map(n=>({id:n,url:PD+"/"+encodeURIComponent(n),ts:0}));dbState="ok"}
  if(view==="home")render()}
init();

