/* настройки, экспорт/импорт, сжатие фото */
const KEYS=["ss_rec","ss_rec_f","ss_int","ss_aud_on","ss_role_m","ss_role_f","ss_q","ss_part"],QL=[["high","Высокое"],["medium","Среднее"],["low","Низкое"]];
let dip=null;addEventListener("beforeinstallprompt",e=>{e.preventDefault();dip=e});
function dl(blob,name){const a=h("a",{href:URL.createObjectURL(blob),download:name});document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000)}
function exportData(){const d={app:"goon-scrolling",v:1,t:Date.now(),data:{}};KEYS.forEach(k=>{const v=ls(k,undefined);if(v!==undefined)d.data[k]=v});dl(new Blob([JSON.stringify(d)],{type:"application/json"}),"goon-scrolling-backup-"+dkey(new Date())+".json");toast("Файл сохранён");evInc("exp")}
async function importData(f){if(!f)return;try{const d=JSON.parse(await f.text());if(d.app!=="goon-scrolling"||!d.data)throw 0;let add=0;
  for(const k of KEYS){const v=d.data[k];if(v===undefined)continue;
    if(k.startsWith("ss_rec")){if(!Array.isArray(v))continue;const cur=ls(k,[]),ids=new Set(cur.map(x=>x.id));v.forEach(x=>{if(x&&typeof x.id==="string"&&typeof x.ts==="number"&&typeof x.ms==="number"&&!ids.has(x.id)){cur.push({id:x.id,ts:x.ts,ms:x.ms,pid:String(x.pid||""),url:String(x.url||""),seed:+x.seed||0,fx:!!x.fx,ph:String(x.ph||""),g:String(x.g||""),dur:+x.dur||0,win:!!x.win,lost:!!x.lost});ids.add(x.id);add++}});cur.sort((a,b)=>a.ts-b.ts);lsSet(k,cur)}
    else lsSet(k,v)}
  toast("Импортировано записей: "+add);evInc("imp");if(window.fxResize)fxResize();render()}catch(e){toast("Файл не подходит")}}
function loadZip(){return window.JSZip?Promise.resolve():new Promise((ok,no)=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";s.onload=ok;s.onerror=no;document.head.append(s)})}
function compressCard(){
  let q=85,mx=1920,res=[];const info=h("div",{cls:"mut res"}),list=h("div",{cls:"res"}),acts=h("div",{cls:"row",style:"margin-top:10px"}),inp=h("input",{type:"file",accept:"image/*",multiple:"multiple",style:"display:none"});
  const qs=h("input",{type:"range",min:60,max:95,value:q}),ql=h("b",null,q+"%"),ms=h("input",{type:"range",min:800,max:3000,step:100,value:mx}),ml=h("b",null,mx+" px");
  qs.addEventListener("input",()=>{q=+qs.value;ql.textContent=q+"%"});ms.addEventListener("input",()=>{mx=+ms.value;ml.textContent=mx+" px"});
  const kb=n=>Math.round(n/1024)+" КБ";
  inp.addEventListener("change",async()=>{const fs=[...inp.files];res=[];list.replaceChildren();acts.replaceChildren();
    for(let i=0;i<fs.length;i++){info.textContent="Сжимаю "+(i+1)+" из "+fs.length+"…";
      try{const bm=await createImageBitmap(fs[i],{imageOrientation:"from-image"}).catch(()=>createImageBitmap(fs[i])),k=Math.min(1,mx/Math.max(bm.width,bm.height)),c=document.createElement("canvas");c.width=Math.round(bm.width*k);c.height=Math.round(bm.height*k);c.getContext("2d").drawImage(bm,0,0,c.width,c.height);
        const bl=await new Promise(r=>c.toBlob(r,"image/jpeg",q/100)),nm=(fs[i].name.replace(/\.[^.]+$/,"").replace(/[^A-Za-z0-9_-]+/g,"_")||"photo")+"_"+(i+1)+".jpg";
        res.push({name:nm,blob:bl});list.append(h("div",null,nm+": "+kb(fs[i].size)+" → "+kb(bl.size)))}catch(e){list.append(h("div",null,fs[i].name+": не удалось обработать"))}}
    info.textContent=res.length?"Готово: "+res.length+" фото. Загрузите их в папку фото на GitHub.":"Нет подходящих файлов";
    if(res.length)evInc("cmp");
    if(res.length)acts.append(h("button",{on:{click:async()=>{for(const r of res){dl(r.blob,r.name);await new Promise(o=>setTimeout(o,500))}}}},"Скачать по очереди"),h("button",{on:{click:async()=>{try{await loadZip();const z=new JSZip();res.forEach(r=>z.file(r.name,r.blob));dl(await z.generateAsync({type:"blob"}),"photos.zip")}catch(e){toast("ZIP недоступен, скачайте по очереди")}}}},"Скачать ZIP"))});
  return h("div",{cls:"card"},h("h2",null,"Сжатие фото"),h("div",{cls:"mut",style:"margin-bottom:8px"},"Уменьшает вес фото перед загрузкой на GitHub, чтобы сайт работал быстрее."),
    h("div",{cls:"row",style:"justify-content:space-between"},h("span",null,"Качество"),ql),qs,h("div",{cls:"row",style:"justify-content:space-between"},h("span",null,"Макс. сторона"),ml),ms,
    h("button",{cls:"p",style:"width:100%;margin-top:10px",on:{click:()=>inp.click()}},"Выбрать фото"),inp,info,list,acts)}
function settings(){
  const q=ls("ss_q","high"),pa=ls("ss_part",true),inp=h("input",{type:"file",accept:"application/json,.json",style:"display:none"});
  inp.addEventListener("change",()=>{importData(inp.files[0]);inp.value=""});
  const sw=h("button",{cls:"sw"+(pa?" on":""),role:"switch","aria-checked":String(pa),"aria-label":"Частицы",on:{click:()=>{lsSet("ss_part",!pa);if(window.fxResize)fxResize();render()}}},h("i"));
  page("Настройки",
    h("div",{cls:"card"},h("h2",null,"Качество эффекта"),h("div",{cls:"mut",style:"margin-bottom:10px"},"Влияет на детализацию жидкости и количество частиц. На слабом телефоне выберите «Низкое»."),
      h("div",{cls:"seg"},QL.map(([k,l])=>h("button",{cls:q===k?"p":"",on:{click:()=>{lsSet("ss_q",k);if(window.fxResize)fxResize();render();toast("Качество: "+l);evInc("q")}}},l))),
      h("div",{style:"height:14px"}),h("div",{cls:"row",style:"justify-content:space-between;flex-wrap:nowrap"},h("span",{style:"flex:1"},"Плавающие частицы"),sw)),
    h("div",{cls:"card"},h("h2",null,"Записи"),h("div",{cls:"mut",style:"margin-bottom:10px"},"Сохраните записи, настройки и прогресс в файл или загрузите их на другом устройстве."),h("div",{cls:"row"},h("button",{on:{click:exportData}},"Экспорт"),h("button",{on:{click:()=>inp.click()}},"Импорт"),inp)),
    h("div",{cls:"card"},h("h2",null,"Приложение"),h("div",{cls:"mut",style:"margin-bottom:10px"},"Добавьте сайт на главный экран, чтобы открывать его как приложение."),h("button",{cls:"p",style:"width:100%",on:{click:async()=>{if(dip){dip.prompt();await dip.userChoice;dip=null}else toast("Откройте меню браузера и выберите «Установить» или «Добавить на главный экран»")}}},"Установить приложение")),
    compressCard(),
    h("div",{cls:"card"},h("h2",null,"Возраст"),h("button",{style:"width:100%",on:{click:()=>{lsSet("ss_18",false);toast("Подтверждение сброшено");setTimeout(()=>location.reload(),600)}}},"Сбросить подтверждение 18+")))}
addEventListener("appinstalled",()=>evInc("pwa"));
