const fem=/[?&]mode=f/.test(location.search),RK=fem?'ss_rec_f':'ss_rec',PD=fem?"photos_f":"photos",AD=fem?"audio_f":"audio";
document.documentElement.dataset.m=fem?"f":"m";if(fem)document.title="Goon-scrolling 2000 · для девушек";
let role=ls("ss_role_"+(fem?"f":"m"),fem?"d":"n");const pick=a=>a[Math.floor(Math.random()*a.length)];
let tracks=[],audioOn=ls("ss_aud_on",false),apl=[],ai=0,aerr=0;const audioEl=new Audio();let photos=[],db=null,assets=null,canEdit=false,dbState="loading";
let view="home",interval=+ls("ss_int",5),bag=[],hist=[],caps=[],pos=-1,shown=0,timer=null,t0=0,calM=new Date(),calSel=null,pending=null;
const $=s=>document.querySelector(s),app=$("#app");
function ls(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
const recs=()=>ls(RK,[]);
function h(tag,props,...kids){const e=document.createElement(tag);for(const k in(props||{})){if(k==="on")for(const ev in props.on)e.addEventListener(ev,props.on[ev]);else if(k==="cls")e.className=props[k];else e.setAttribute(k,props[k])}kids.flat().forEach(c=>{if(c!=null)e.append(c.nodeType?c:document.createTextNode(c))});return e}
const TT=$("#toast");
function toast(m){const t=TT,host=document.fullscreenElement||document.body;if(t.parentNode!==host)host.append(t);t.textContent=m;t.style.display="block";clearTimeout(toast.t);toast.t=setTimeout(()=>t.style.display="none",2200)}
function fmtMs(ms){const s=Math.floor(ms/1000),m=Math.floor(s/60),c=Math.floor(ms%1000/10);return String(m).padStart(2,"0")+":"+String(s%60).padStart(2,"0")+"."+String(c).padStart(2,"0")}
const dkey=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const fmtDT=ts=>new Date(ts).toLocaleString("ru-RU",{day:"2-digit",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"});
const urlOf=r=>{const p=photos.find(p=>p.id===r.pid);return p?p.url:r.url};
const QF=()=>({high:{g:300,d:2,p:1},medium:{g:190,d:1.5,p:.5},low:{g:110,d:1,p:.2}}[ls("ss_q","high")]||{g:300,d:2,p:1});
/* история браузера: кнопка «Назад» */
const hs=()=>typeof history!=="undefined"&&history.pushState?history:null,hd=()=>{const H=hs();return H&&H.state&&H.state.d||0};
function pushV(v,x){const H=hs();if(H)try{H.pushState(Object.assign({v,d:hd()+1},x||{}),"")}catch(e){}}
function replV(v){const H=hs();if(H)try{H.replaceState({v,d:hd()},"")}catch(e){}}
