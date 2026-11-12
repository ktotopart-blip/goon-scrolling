function ask(msg,yes){const o=h("div",{style:"position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:20;padding:16px"},h("div",{cls:"card",style:"max-width:340px;margin:0"},h("div",{style:"margin-bottom:14px;font-weight:600"},msg),h("div",{cls:"row"},h("button",{on:{click:()=>o.remove()}},"Отмена"),h("button",{cls:"p",on:{click:()=>{o.remove();yes()}}},"Удалить"))));document.body.append(o)}
function fb(t){const a=h("textarea",{style:"position:fixed;opacity:0"});a.value=t;document.body.append(a);a.select();let ok=false;try{ok=document.execCommand("copy")}catch(e){}a.remove();toast(ok?"Скопировано, можно отправлять":"Не удалось скопировать")}
function copy(t){if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(t).then(()=>toast("Скопировано, можно отправлять"),()=>fb(t))}else fb(t)}
const bc={};
function blobOf(r){const u=urlOf(r);if(!u)return Promise.resolve(null);return bc[u]||(bc[u]=fetch(u).then(x=>x.ok?x.blob():null).catch(()=>null))}
async function shareRec(r){
  const u=urlOf(r),site=location.href.split("#")[0],photo=u?new URL(u,location.href).href:"";
  const head="Я кончил за "+fmtMs(r.ms)+" ("+fmtDT(r.ts)+")";
  const full=head+(photo?". Вот на какое фото: "+photo:"")+"\n"+site;
  if(!navigator.share){copy(full);return}
  try{
    const bl=navigator.canShare?await blobOf(r):null;
    if(bl){const nm=decodeURIComponent((u.split("/").pop()||"foto.jpg")),f=new File([bl],nm,{type:bl.type||"image/jpeg"});
      if(navigator.canShare({files:[f]})){await navigator.share({files:[f],title:"Goon-scrolling 2000",text:head+"\n"+site});return}}
  }catch(e){if(e&&e.name==="AbortError")return}
  try{await navigator.share({title:"Goon-scrolling 2000",text:head+(photo?". Вот на какое фото: "+photo:""),url:site})}catch(e){if(!e||e.name!=="AbortError")copy(full)}}
function openPhoto(u,r){if(!u){toast("Фото недоступно");return}const im=$("#mimg"),cv=$("#mcv");im.onload=()=>paintSplash(cv,im,r);im.src=u;$("#modal").style.display="flex";pushV(view,{m:1});if(im.complete)paintSplash(cv,im,r)}
function hideModal(){$("#modal").style.display="none"}
function closeModal(){const H=hs();if(H&&H.state&&H.state.m)H.back();else hideModal()}
$("#mclose").onclick=closeModal;$("#modal").onclick=e=>{if(e.target.id==="modal")closeModal()};
function leave(){exitFs();gameStop();clearTimeout(timer);musicStop();finishing=false}
function go(v){leave();if(v==="home"&&view!=="home"&&hd()>0){hs().back();return}if(v!=="home")pushV(v);view=v;render();window.scrollTo(0,0)}
addEventListener("popstate",e=>{
  if(typeof bossEl!=="undefined"&&bossEl){closeBoss();return}
  const md=$("#modal");if(md&&md.style.display==="flex"){hideModal();return}
  const v=e.state&&e.state.v;leave();view=["calendar","records","stats","ach","settings"].includes(v)?v:"home";render();window.scrollTo(0,0)});

/* ---------- слайд-шоу ---------- */
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function draw(){const ids=photos.map(p=>p.id);bag=bag.filter(i=>ids.includes(i));
  if(!bag.length){bag=shuffle(ids.slice());const last=hist[hist.length-1];if(bag.length>1&&bag[bag.length-1]===last){[bag[0],bag[bag.length-1]]=[bag[bag.length-1],bag[0]]}}
  return bag.pop()}
function start(){
  if(!photos.length){toast(dbState==="loading"?"Фото ещё загружаются…":"Пока нет фотографий");return}
  bag=[];hist=[];caps=[];pos=-1;shown=0;finishing=false;t0=Date.now();view="show";pushV("show");render();musicStart();gameStart();next(true)}
function next(first){
  if(pos<hist.length-1){pos++}else{hist.push(draw());shown++;caps.push(shown%3===0||shown%5===0?pick(PH().c):"");pos=hist.length-1;gameNew()}
  showCur();}
function prev(){if(finishing)return;if(pos>0){pos--;showCur()}else toast("Это первая фотография")}
function showCur(){
  const p=photos.find(p=>p.id===hist[pos]);const img=$("#simg");if(!img)return;
  img.style.opacity=.2;img.onload=()=>img.style.opacity=1;img.src=p?p.url:"";
  $("#cap").textContent=caps[pos]||"";preload(bag[bag.length-1]);preload(bag[bag.length-2]);const dl=gDelay(),bb=$("#bar");if(bb){bb.style.animation="none";void bb.offsetWidth;bb.style.animation="bar "+dl+"s linear forwards"}$("#cnt").textContent="Фото №"+(pos+1);
  clearTimeout(timer);timer=setTimeout(()=>next(),dl*1000)}
let finishing=false,newAch=[];const pre={};
function preload(id){const p=photos.find(x=>x.id===id);if(!p||pre[id])return;const i=new Image();i.decoding="async";i.src=p.url;pre[id]=i;if(i.decode)i.decode().catch(()=>{});const k=Object.keys(pre);if(k.length>8)delete pre[k[0]]}
function finish(){
  if(finishing||!gameCanFinish())return;finishing=true;gameStop();clearTimeout(timer);musicStop();const ms=Date.now()-t0,p=photos.find(p=>p.id===hist[pos]);
  const r={id:String(Date.now()),ts:Date.now(),ms,pid:hist[pos],url:p?p.url:"",seed:(Math.random()*1e9|0)+1,fx:true};
  r.ph=pick(PH().f);gameMark(r);const had=ACH.map(x=>x[2](recs()));const all=recs();all.push(r);lsSet(RK,all);newAch=ACH.map((x,i)=>i).filter(i=>!had[i]&&ACH[i][2](all));pending=r;const S=mkSplats(r.seed);
  const st=$("#stage"),im=$("#simg"),cv=h("canvas",{cls:"spl"}),bb=$("#bar");if(bb)bb.style.animation="none";st.append(cv);setTimeout(()=>{if(view==="show")st.append(h("div",{id:"fin"},r.ph))},900);
  splash(cv,im,S,()=>setTimeout(()=>{if(view==="show"){finishing=false;exitFs();replV("result");view="result";render()}},RM?1500:1500))}

/* ---------- экраны ---------- */
function render(){app.replaceChildren();({home,show,result,calendar,records,stats,ach,settings}[view])()}
function intervalBox(onch){
  const lab=h("b",{cls:"num"},interval+" с");
  const s=h("input",{type:"range",min:1,max:60,step:1,value:interval,"aria-label":"Интервал"});
  s.style.setProperty("--f",(interval-1)/59*100+"%");s.addEventListener("input",()=>{interval=+s.value;s.style.setProperty("--f",(interval-1)/59*100+"%");lab.textContent=interval+" с";lsSet("ss_int",interval);onch&&onch()});
  return h("div",null,h("div",{cls:"row",style:"justify-content:space-between"},h("span",null,"Интервал смены фото"),lab),s,h("div",{cls:"row mut",style:"justify-content:space-between"},h("span",null,"1 с"),h("span",{style:"text-align:right"},"1 мин")))}
/* ---------- музыка ---------- */
function musicBox(){
  const on=audioOn&&tracks.length>0;
  const sw=h("button",{cls:"sw"+(on?" on":""),role:"switch","aria-checked":String(on),"aria-label":"Музыка во время слайдшоу",on:{click:()=>{
    if(!tracks.length){toast(dbState==="loading"?"Аудио ещё загружается…":"Аудиофайлов пока нет");return}
    audioOn=!audioOn;lsSet("ss_aud_on",audioOn);render()}}},h("i"));
  return h("div",{cls:"row",style:"justify-content:space-between;flex-wrap:nowrap"},h("div",{style:"flex:1"},h("div",null,"🎵 Музыка во время слайдшоу"),h("div",{cls:"mut"},tracks.length?(on?"Включена · треков: ":"Выключена · треков: ")+tracks.length:dbState==="loading"?"Загрузка…":"Треки не найдены")),sw)}
function playTrack(){audioEl.src=apl[ai];audioEl.play().catch(()=>toast("Браузер не дал включить музыку"))}
function musicStart(){if(!audioOn||!tracks.length)return;apl=shuffle(tracks.slice());ai=0;aerr=0;playTrack()}
function musicStop(){try{audioEl.pause();audioEl.removeAttribute("src");audioEl.load()}catch(e){}apl=[]}
audioEl.addEventListener("ended",()=>{if(!apl.length)return;aerr=0;ai++;if(ai>=apl.length){ai=0;shuffle(apl)}playTrack()});
audioEl.addEventListener("error",()=>{if(!apl.length)return;aerr++;if(aerr>=apl.length){toast("Не удалось воспроизвести аудио");musicStop();return}ai=(ai+1)%apl.length;playTrack()});
function home(){
  const n=photos.length;
  app.append(h("h1",{cls:"hero"},"Goon-scrolling",h("br"),"2000"),h("div",{cls:"phr"},fem?"Режим для девушек":""),
    h("div",{cls:"mut"},dbState==="loading"?"Загружаю фотографии…":dbState==="none"?"Не удалось загрузить список фотографий. Обновите страницу.":"Фотографий в коллекции: "+n),
    h("div",{cls:"card"},intervalBox(),h("div",{style:"height:14px"}),musicBox(),h("div",{style:"height:14px"}),h("button",{cls:"p big",on:{click:start}},"Начать"),h("div",{style:"height:10px"}),h("div",{cls:"grid2"},h("button",{on:{click:()=>{calM=new Date();calSel=null;go("calendar")}}},"Календарь"),h("button",{on:{click:()=>go("records")}},"Рекорды"),h("button",{on:{click:()=>go("stats")}},"Статистика"),h("button",{on:{click:()=>go("ach")}},"Достижения"),h("button",{style:"grid-column:1/-1",on:{click:()=>go("settings")}},"Настройки"),h("button",{style:"grid-column:1/-1",on:{click:boss}},"Босс идёт"))),modeBox(),gameBox(),
    h("div",{cls:"log"},
      h("h2",null,"Последние записи секундомера"),
      (()=>{const r=recs().slice(-5).reverse();return r.length?h("div",null,r.map(x=>h("div",{cls:"rec"},withSplash(x,"",()=>openPhoto(urlOf(x),x)),h("div",{cls:"t"},fmtDT(x.ts)),h("b",null,fmtMs(x.ms)))) ):h("div",{cls:"mut"},"Пока пусто — запусти слайд-шоу и нажми «Кончить».")})()));
  }
function exitFs(){const sv=$("#sv");if(sv)sv.classList.remove("fs");const b=$("#fsb");if(b)b.textContent="На весь экран";if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(()=>{})}
function toggleFs(){const sv=$("#sv");if(!sv)return;if(sv.classList.contains("fs")){exitFs();return}
  sv.classList.add("fs");$("#fsb").textContent="Свернуть";const rq=sv.requestFullscreen||sv.webkitRequestFullscreen;if(rq)try{const p=rq.call(sv);if(p&&p.catch)p.catch(()=>{})}catch(e){}}
document.addEventListener("fullscreenchange",()=>{if(!document.fullscreenElement)exitFs()});
function show(){
  app.append(h("div",{id:"sv"},h("div",{cls:"row",style:"justify-content:space-between;flex:none"},h("span",{id:"cnt",cls:"mut"}),h("button",{id:"fsb",style:"flex:none",on:{click:toggleFs}},"На весь экран"),h("button",{style:"flex:none",on:{click:boss}},"Босс!"),h("button",{style:"flex:none",on:{click:()=>go("home")}},"Выйти")),
    h("div",{id:"stage"},h("img",{id:"simg",alt:"Фото"}),h("div",{id:"bar"}),h("div",{id:"cmd"})),h("div",{id:"cap"}),h("div",{id:"gstat",cls:"mut",style:"text-align:center;min-height:22px"}),
    h("button",{on:{click:prev},style:"width:100%"},"← Назад"),
    h("div",{style:"height:10px"}),h("button",{id:"fbtn",cls:"p big",on:{click:finish}},"Кончить")))}
function result(){
  const r=pending;blobOf(r);if(newAch.length){const m=newAch.map(i=>AN(i)[2]+" "+AN(i)[0]).join(", ");newAch=[];setTimeout(()=>toast("Достижение: "+m),700)}
  app.append(h("h1",null,resTitle(r)),h("div",{cls:"mut"},"Фото закреплено в календаре"),h("div",{cls:"phr"},r.ph||""),h("div",{cls:"big-t"},fmtMs(r.ms)),
    (()=>{const wp=withSplash(r,"",()=>openPhoto(urlOf(r),r));return h("div",{cls:"card"},wp,h("div",{cls:"mut",style:"margin-top:10px"},fmtDT(r.ts)),r.fx&&r.seed?h("button",{style:"width:100%;margin-top:12px",on:{click:()=>wipe(wp.querySelector("canvas"),()=>{const all=recs(),x=all.find(v=>v.id===r.id);if(x){x.fx=false;lsSet(RK,all)}r.fx=false;toast("Вытерто");render()})}},"Вытереться"):null)})(),
    h("button",{cls:"p big",on:{click:()=>shareRec(r)}},"Поделиться результатом"),h("div",{style:"height:10px"}),h("div",{cls:"row"},h("button",{cls:"p",on:{click:()=>go("home")}},"На главную"),h("button",{on:{click:()=>{calM=new Date(r.ts);calSel=dkey(new Date(r.ts));go("calendar")}}},"Открыть календарь")))}
function page(t,...k){app.append(h("button",{on:{click:()=>go("home")}},"← На главную"),h("h1",null,t),...k.flat().filter(Boolean))}
function records(){const a=recs(),lst=(t,r)=>h("div",{cls:"log",style:"margin-top:22px"},h("h2",null,t),r.length?r.map((x,i)=>h("div",{cls:"rec"},h("b",{style:"width:22px"},String(i+1)),withSplash(x,"",()=>openPhoto(urlOf(x),x)),h("div",{cls:"t"},fmtDT(x.ts)),h("b",null,fmtMs(x.ms)))):h("div",{cls:"mut"},"Пока нет записей"));
  page("Рекорды",lst("Самые быстрые",a.slice().sort((p,q)=>p.ms-q.ms).slice(0,5)),lst("Самые долгие",a.slice().sort((p,q)=>q.ms-p.ms).slice(0,5)))}
function stats(){const a=recs(),n=a.length,tot=a.reduce((s,x)=>s+x.ms,0),cnt={};a.forEach(x=>{cnt[x.pid]=(cnt[x.pid]||0)+1});
  const fav=Object.entries(cnt).sort((p,q)=>q[1]-p[1])[0],fr=fav&&a.find(x=>x.pid===fav[0]),on=k=>a.filter(x=>dkey(new Date(x.ts))===k).length;
  const tile=(l,v)=>h("div",{cls:"card",style:"margin:0;text-align:center"},h("div",{cls:"num"},String(v)),h("div",{cls:"mut"},l));
  const days=[...Array(7)].map((_,i)=>{const d=new Date(Date.now()-(6-i)*864e5);return{l:d.toLocaleDateString("ru-RU",{weekday:"short"}),c:on(dkey(d))}}),mx=Math.max(1,...days.map(d=>d.c));
  page("Статистика",h("div",{cls:"grid2"},tile("Всего",n),tile("Сегодня",on(dkey(new Date()))),tile("За 7 дней",a.filter(x=>x.ts>Date.now()-7*864e5).length),tile("Среднее время",n?fmtMs(tot/n):"—"),tile("Всего времени",fmtMs(tot)),tile("Лучшее время",n?fmtMs(Math.min(...a.map(x=>x.ms))):"—")),
    h("div",{cls:"card"},h("h2",null,"Последние 7 дней"),h("div",{cls:"bars"},days.map(d=>h("div",{cls:"bc"},h("div",{cls:"bv",style:"height:"+Math.round(d.c/mx*80)+"%"}),h("span",{cls:"mut"},d.l+" "+d.c))))),
    fr?h("div",{cls:"card"},h("h2",null,"Любимое фото"),h("div",{cls:"rec"},withSplash(fr,"",()=>openPhoto(urlOf(fr),fr)),h("div",{cls:"t"},"Выбрано раз: "+fav[1]))):null)}
function ach(){const a=recs(),ok=ACH.map(x=>x[2](a));page("Достижения",h("div",{cls:"mut"},"Открыто "+ok.filter(Boolean).length+" из "+ACH.length),ACH.map((x,i)=>{const n=AN(i);return h("div",{cls:"card ach"+(ok[i]?"":" lock"),style:"margin:10px 0"},h("div",{cls:"medal"},n[2]),h("div",null,h("b",null,(ok[i]?"":"🔒 ")+n[0]),h("div",{cls:"mut"},n[1])))}))}
function modeBox(){const R=fem?[["d","Доминантный"],["s","Послушный"]]:[["n","Обычный"],["d","Доминантная"],["s","Послушная"]],u=location.origin+location.pathname+(fem?"":"?mode=f");
  return h("div",{cls:"card"},h("h2",null,fem?"Голос: мужчина":"Голос: девушка"),h("div",{cls:"mut",style:"margin-bottom:10px"},"От чьего лица звучат подписи"),
    h("div",{cls:"row"},R.map(([k,l])=>h("button",{cls:role===k?"p":"",on:{click:()=>{role=k;lsSet("ss_role_"+(fem?"f":"m"),k);render()}}},l))),
    h("div",{style:"height:10px"}),h("button",{style:"width:100%",on:{click:()=>{location.href=u}}},fem?"Перейти в режим для парней":"Перейти в режим для девушек"))}
function calendar(){
  const all=recs(),days=new Set(all.map(r=>dkey(new Date(r.ts)))),y=calM.getFullYear(),m=calM.getMonth();
  const first=new Date(y,m,1),off=(first.getDay()+6)%7,dim=new Date(y,m+1,0).getDate(),today=dkey(new Date());
  const cells=["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map(d=>h("div",{cls:"dn"},d));
  for(let i=0;i<off;i++)cells.push(h("i"));
  for(let d=1;d<=dim;d++){const k=y+"-"+String(m+1).padStart(2,"0")+"-"+String(d).padStart(2,"0");
    cells.push(h("button",{cls:(days.has(k)?"has ":"")+(k===calSel?"sel ":"")+(k===today?"today":""),on:{click:()=>{calSel=k;render()}}},String(d)))}
  const title=first.toLocaleDateString("ru-RU",{month:"long",year:"numeric"});
  const shift=n=>()=>{calM=new Date(y,m+n,1);calSel=null;render()};
  const list=calSel?all.filter(r=>dkey(new Date(r.ts))===calSel).sort((a,b)=>a.ts-b.ts):[];
  app.append(h("button",{on:{click:()=>go("home")}},"← На главную"),h("h1",null,"Календарь"),
    h("div",{cls:"card"},h("div",{cls:"row",style:"justify-content:space-between;margin-bottom:12px"},h("button",{style:"flex:none",on:{click:shift(-1)},"aria-label":"Предыдущий месяц"},"‹"),h("b",{style:"text-transform:capitalize;text-align:center"},title),h("button",{style:"flex:none",on:{click:shift(1)},"aria-label":"Следующий месяц"},"›")),
      h("div",{cls:"cal"},cells),h("div",{cls:"mut",style:"margin-top:10px"},"Фиолетовым отмечены дни с записями.")),
    h("div",{cls:"card"},h("h2",{style:"margin-top:0"},calSel?"Записи за "+calSel.split("-").reverse().join("."):"Выбери день"),
      calSel&&!list.length?h("div",{cls:"mut"},"В этот день записей нет."):null,
      list.map(r=>h("div",{cls:"rec"},withSplash(r,"",()=>openPhoto(urlOf(r),r)),
        h("div",{cls:"t"},new Date(r.ts).toLocaleTimeString("ru-RU"),h("br"),h("b",null,"⏱ "+fmtMs(r.ms))),
        h("div",{style:"display:flex;align-items:center;gap:8px;flex:none"},h("span",{cls:"mut"},"Брызги"),h("button",{cls:"sw"+(r.fx&&r.seed?" on":""),role:"switch","aria-checked":String(!!(r.fx&&r.seed)),"aria-label":"Показывать брызги",on:{click:()=>toggleFx(r.id)}},h("i"))),h("button",{on:{click:()=>shareRec(r)}},"Поделиться"),h("button",{on:{click:()=>openPhoto(urlOf(r),r)}},"Открыть"),
        h("button",{cls:"d",on:{click:()=>ask("Удалить эту запись?",()=>{lsSet(RK,recs().filter(x=>x.id!==r.id));render();toast("Запись удалена")})}},"Удалить")))))}

/* ---------- список фото из папки photos репозитория ---------- */
async function listNames(){
  try{const c=sessionStorage.getItem("ss_list_"+PD);if(c)return JSON.parse(c)}catch(e){}
  let names=null;
  try{const o=location.hostname.split(".")[0];let rp=location.pathname.split("/")[1]||"";if(!rp||/\.html?$/.test(rp))rp=location.hostname;
    const r=await fetch("https://api.github.com/repos/"+o+"/"+rp+"/contents/"+PD);
    if(r.ok){const j=await r.json();names=j.filter(f=>f.type==="file").map(f=>f.name)}}catch(e){}
  if(!names){try{const r=await fetch(PD+".json",{cache:"no-cache"});if(r.ok){const j=await r.json();if(Array.isArray(j))names=j}}catch(e){}}
  if(names){names=names.filter(n=>/\.(jpe?g|png|webp|gif|avif)$/i.test(n)).sort();try{sessionStorage.setItem("ss_list_"+PD,JSON.stringify(names))}catch(e){}}
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
function ageGate(){if(ls("ss_18",false))return;const o=h("div",{id:"gate"},h("div",{cls:"card",style:"max-width:380px;text-align:center"},h("h1",null,"18+"),h("p",null,"Сайт содержит шуточный контент для взрослых. Вам есть 18 лет?"),h("button",{cls:"p big",on:{click:()=>{lsSet("ss_18",true);o.remove()}}},"Мне есть 18"),h("div",{style:"height:10px"}),h("button",{style:"width:100%",on:{click:()=>{location.href="https://ru.wikipedia.org"}}},"Мне нет 18")));document.body.append(o)}
async function init(){
  {const st=hs()&&history.state;if(st&&["calendar","records","stats","ach","settings"].includes(st.v))view=st.v;else replV("home")}
  ageGate();if("serviceWorker" in navigator&&/^https?:/.test(location.protocol))navigator.serviceWorker.register("sw.js").catch(()=>{});
  render();
  const [names,anames]=await Promise.all([listNames(),listAudio()]);
  tracks=anames.map(n=>AD+"/"+encodeURIComponent(n));
  if(!names){dbState="none"}else{photos=names.map(n=>({id:n,url:PD+"/"+encodeURIComponent(n),ts:0}));dbState="ok"}
  if(view==="home")render()}
init();

