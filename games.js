/* игровые режимы и «Босс идёт» */
const GL=[["n","Обычный","Без ограничений."],["c","Не кончи","Продержись до конца таймера. Нажмёшь «Кончить» раньше, проиграешь."],["p","Терпение","Кнопка «Кончить» заблокирована на случайное время."],["k","Команды","Приказы на экране: замри, быстрее, медленнее."]];
let gm=ls("ss_game","n"),gdur=+ls("ss_gdur",3),gs={mode:"",n:0,freeze:0},gInt=null,gEnd=0,lockEnd=0,bossT=0,bossEl=null,bossTitle="";
const TEASE=["Рано, терпи.","Кнопка ещё не готова.","Ну куда ты спешишь?","Нет-нет-нет, ещё рано.","Ты слишком торопишься.","Потерпи, сначала заслужи.","Не так быстро, нетерпеливый."],
WINM=["Железные нервы. Уважаю.","Дотерпел! Сам удивился?","Ты победил себя. Почти святой.","Выдержал. Теперь можно расслабиться.","Награда за терпение: гордость собой."],
WINF=["Железные нервы. Уважаю.","Дотерпела! Сама удивилась?","Ты победила себя. Почти святая.","Выдержала. Теперь можно расслабиться.","Награда за терпение: гордость собой."],
CMDS={mn:{freeze:["Замри на 10 секунд. Смотри и терпи.","Стоп. Руки убрал, смотри."],fast:["Быстрее! Не тормози!","Давай, ускоряйся!"],slow:["Медленнее. Растягивай удовольствие.","Не спеши, смакуй каждый кадр."]},
md:{freeze:["Замри. Я не разрешала двигаться.","Стоять! Ждёшь моей команды."],fast:["Быстрее, я сказала!","Живее, не заставляй меня ждать."],slow:["Медленно. Я хочу, чтобы ты помучился.","Не смей спешить."]},
ms:{freeze:["Давай замрём на секундочку, мне так нравится смотреть.","Остановись, я хочу рассмотреть тебя."],fast:["Быстрее, пожалуйста, я так хочу!","Ускорься, прошу тебя."],slow:["Помедленнее, мне так хорошо.","Не спеши, прошу, я хочу растянуть."]},
fd:{freeze:["Замри. Жди моего слова.","Стоять, умница. Не двигайся."],fast:["Быстрее, я жду.","Не отставай, давай."],slow:["Медленнее. Я никуда не тороплюсь.","Тише, моя сладкая, не спеши."]},
fs:{freeze:["Замри, госпожа велит ждать.","Стою, как прикажешь, госпожа."],fast:["Как прикажешь, ускоряюсь, госпожа.","Быстрее, госпожа желает."],slow:["Как скажешь, госпожа, помедленнее.","Не буду спешить, госпожа."]}};
ACH.push(["Железная воля","Выиграть режим «Не кончи»",a=>a.some(x=>x.win)],["Монах","Выиграть «Не кончи» на 5 минут",a=>a.some(x=>x.win&&x.dur>=5)],["Слабак","Проиграть «Не кончи» быстрее 10 секунд",a=>a.some(x=>x.lost&&x.ms<1e4)]);
ICON["Железная воля"]="💪";ICON["Монах"]="🧘";ICON["Слабак"]="🥀";
ACHF.push(["Сила воли","Выиграть режим «Не кончи»","💪"],["Монахиня","Выиграть «Не кончи» на 5 минут","🧘"],["Не удержалась","Проиграть «Не кончи» быстрее 10 секунд","🥀"]);
const mmss=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")};
function gameBox(){const cur=GL.find(x=>x[0]===gm)||GL[0];
  return h("div",{cls:"card"},h("h2",null,"Режим игры"),h("div",{cls:"row"},GL.map(([k,l])=>h("button",{cls:gm===k?"p":"",on:{click:()=>{gm=k;lsSet("ss_game",k);render()}}},l))),
    h("div",{cls:"mut",style:"margin:10px 0"},cur[2]),
    gm==="c"?h("div",{cls:"row"},[1,3,5].map(m=>h("button",{cls:gdur===m?"p":"",on:{click:()=>{gdur=m;lsSet("ss_gdur",m);render()}}},m+" мин"))):null)}
function gameStart(){gameStop();gs={mode:"",n:0,freeze:0};if(gm==="c")gEnd=Date.now()+gdur*6e4;if(gm==="p")lockEnd=Date.now()+(20+Math.random()*70)*1e3;if(gm==="c"||gm==="p")gInt=setInterval(gTick,250);gTick()}
function gameStop(){clearInterval(gInt);gInt=null}
function gTick(){if(view!=="show"||bossT)return;const g=$("#gstat"),b=$("#fbtn");if(!g||!b)return;
  if(gm==="c"){const left=gEnd-Date.now();if(left<=0){winChallenge();return}g.textContent="Не кончи! Осталось "+mmss(left)}
  else if(gm==="p"){const left=lockEnd-Date.now();if(left>0){b.textContent="Рано, терпи… "+mmss(left);b.classList.add("lockd")}else{b.textContent="Кончить";b.classList.remove("lockd")}}}
function gameCanFinish(){if(gm==="p"&&Date.now()<lockEnd){toast(pick(TEASE));const b=$("#fbtn");if(b){b.classList.remove("shake");void b.offsetWidth;b.classList.add("shake")}return false}return true}
function gameMark(r){if(gm==="c"){r.g="c";r.dur=gdur;r.lost=true}else if(gm==="p")r.g="p"}
const resTitle=r=>r.win?(fem?"Выдержала!":"Выдержал!"):r.lost?(fem?"Не выдержала":"Не выдержал"):"Готово";
function winChallenge(){if(finishing||view!=="show")return;gameStop();clearTimeout(timer);musicStop();const p=photos.find(p=>p.id===hist[pos]),r={id:String(Date.now()),ts:Date.now(),ms:Date.now()-t0,pid:hist[pos],url:p?p.url:"",seed:0,fx:false,g:"c",dur:gdur,win:true,ph:pick(fem?WINF:WINM)};
  const had=ACH.map(x=>x[2](recs())),all=recs();all.push(r);lsSet(RK,all);newAch=ACH.map((x,i)=>i).filter(i=>!had[i]&&ACH[i][2](all));pending=r;exitFs();replV("result");view="result";render()}
function cmdShow(t){const e=$("#cmd");if(!e)return;e.textContent=t;e.classList.remove("on");void e.offsetWidth;e.classList.add("on")}
function gameNew(){if(gm!=="k")return;
  if(gs.n>0){gs.n--;if(!gs.n)gs.mode="";return}
  if(shown>=3&&shown%4===0){const T=pick(["freeze","fast","slow"]);if(T==="freeze")gs.freeze=10;else{gs.mode=T;gs.n=T==="fast"?5:3}cmdShow(pick(CMDS[(fem?"f":"m")+role][T]))}}
function gDelay(){if(gs.freeze){const f=gs.freeze;gs.freeze=0;return f}if(gs.n>0)return gs.mode==="fast"?1:Math.min(60,interval*2);return interval}
function boss(){if(bossEl){unboss();return}
  exitFs();if(view==="show"&&!finishing){clearTimeout(timer);try{audioEl.pause()}catch(e){}bossT=Date.now()}
  bossTitle=document.title;document.title="Квартальный отчёт 2026.xlsx";
  const cols=["A","B","C","D","E","F","G"],names=["Продажи","Закупки","Логистика","Аренда","Маркетинг","Налоги"],rows=[];
  for(let r=1;r<=26;r++)rows.push(h("tr",null,h("th",null,String(r)),...cols.map((c,i)=>h("td",null,i===0?names[r%6]:String(1000+(r*37+i*91)%9000)))));
  bossEl=h("div",{id:"boss"},h("div",{cls:"t",on:{dblclick:unboss}},"Квартальный отчёт 2026.xlsx — Таблицы"),h("div",{cls:"tb"},"Файл   Правка   Вид   Вставка   Формат   Данные   Инструменты"),
    h("table",null,h("tr",null,h("th"),...cols.map(c=>h("th",null,c))),...rows),h("button",{cls:"x",on:{click:unboss}},"↩ Вернуться"));
  document.body.append(bossEl);pushV(view,{boss:1})}
function unboss(){if(!bossEl)return;const H=hs();if(H&&H.state&&H.state.boss){H.back();return}closeBoss()}
function closeBoss(){if(!bossEl)return;bossEl.remove();bossEl=null;document.title=bossTitle;
  if(bossT){const d=Date.now()-bossT;bossT=0;t0+=d;gEnd+=d;lockEnd+=d;if(view==="show"&&!finishing){showCur();if(apl.length)audioEl.play().catch(()=>{})}}}
addEventListener("keydown",e=>{if(e.code==="KeyB"&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!/INPUT|TEXTAREA/.test((e.target&&e.target.tagName)||""))boss()});
