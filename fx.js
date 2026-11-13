/* ---------- частицы ---------- */
const RM=matchMedia("(prefers-reduced-motion:reduce)").matches;
(function(){const cv=document.createElement("canvas");cv.id="fx";document.body.prepend(cv);const x=cv.getContext("2d");let W,H,P=[],c="196,176,255";
  const mk=r=>({x:Math.random()*W,y:r?Math.random()*H:H+10,r:Math.random()*1.8+.6,v:Math.random()*.25+.08,a:Math.random()*.5+.25,s:Math.random()*6.28,w:Math.random()*.6+.2});
  function sz(){W=cv.width=innerWidth;H=cv.height=innerHeight;c=getComputedStyle(document.documentElement).getPropertyValue("--pt").trim()||c;P=Array.from({length:Math.round(Math.min(70,Math.round(W*H/22000))*(ls("ss_part",true)?QF().p:0))},()=>mk(true))}
  function tick(){x.clearRect(0,0,W,H);for(const p of P){p.y-=p.v;p.s+=.01;p.x+=Math.sin(p.s)*p.w*.4;if(p.y<-10)Object.assign(p,mk(false));
    const g=x.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);g.addColorStop(0,"rgba("+c+","+p.a+")");g.addColorStop(1,"rgba("+c+",0)");x.fillStyle=g;x.beginPath();x.arc(p.x,p.y,p.r*4,0,6.283);x.fill()}
    if(!RM)requestAnimationFrame(tick)}
  addEventListener("resize",sz);window.fxResize=sz;sz();tick()})();
/* ---------- эффект брызг ---------- */
function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function mkSplats(seed){const R=rng(seed||1),P=3+(R()*3|0);return Array.from({length:18},(_,i)=>({x:Math.max(.06,Math.min(.94,.5+(R()-.5)*(.5+R()*.6))),y:.1+R()*.75,r:i<4?.06+R()*.05:.015+R()*.04,d:.02+(i%P)*(.36/P)+R()*.05,ox:.5+(R()-.5)*.05,oy:1.06,arch:.05+R()*.3,L:.4+R()*2.6,bd:(R()-.5)*1.6,am:.2+R(),
  w:Array.from({length:7},()=>R()),sat:Array.from({length:2+(R()*8|0)},()=>({o:(R()-.5)*2.2,d:1.4+R()*2.6,r:.08+R()*.2,s:R()<.5})),dr:Array.from({length:R()*3|0},()=>({dx:(R()-.5)*1.3,l:.05+R()*.18}))}))}
const cl=v=>Math.max(0,Math.min(1,v)),sm=(a,b,x)=>{x=cl((x-a)/(b-a));return x*x*(3-2*x)};
function prim(s,t,w,h,o){const X=s.x*w,Y=s.y*h,R=s.r*w,OX=s.ox*w,OY=s.oy*h;let dx=X-OX,dy=Y-OY;const dl=Math.hypot(dx,dy)||1;dx/=dl;dy/=dl;const an=Math.atan2(dy,dx);
  const f=cl((t-s.d)/.07),g=cl((t-s.d-.07)/.06),st=cl((t-s.d-.13)/.3);if(f<=0)return;
  if(g===0){for(let i=0;i<9;i++){const q=f-i*.05;if(q<0)break;o.push(OX+(X-OX)*q,OY+(Y-OY)*q-4*s.arch*h*q*(1-q),R*(.34-i*.032))}return}
  const e=1-Math.pow(1-g,3),n=7;
  for(let i=0;i<n;i++){const u=i/(n-1);o.push(X+Math.cos(an+s.bd*u)*u*s.L*R*e,Y+Math.sin(an+s.bd*u)*u*s.L*R*e,R*e*(1-.5*u)*(1+.12*st)*(1+(s.w[i]-.5)*s.am))}
  o.push(X,Y,R*e*(1+.1*st));const e2=1-Math.pow(1-g,2);
  for(const a of s.sat){const D=a.d*R*e2,px=X+Math.cos(an+a.o)*D,py=Y+Math.sin(an+a.o)*D+R*.5*st*st;o.push(px,py,a.r*R*(1.1-.2*st));
    if(a.s&&st<1)for(let k=1;k<3;k++)o.push(X+(px-X)*k/3,Y+(py-Y)*k/3,a.r*R*.55*(1-st))}
  for(const d of s.dr){const pr=cl((t-s.d-.16)/.55),len=d.l*h*Math.pow(pr,1.5),x2=X+d.dx*R,y0=Y+R*.35;
    for(let y=y0;y<=y0+len;y+=R*.16)o.push(x2,y,R*.17);o.push(x2,y0+len,R*.26*Math.min(1,pr*3))}}
const SP=(()=>{const c=document.createElement("canvas");c.width=c.height=64;const x=c.getContext("2d"),g=x.createRadialGradient(32,32,0,32,32,32);[[0,1],[.25,.88],[.5,.56],[.75,.19],[1,0]].forEach(a=>g.addColorStop(a[0],"rgba(255,255,255,"+a[1]+")"));x.fillStyle=g;x.fillRect(0,0,64,64);return c})();
let FC;const EK={T:(x,y,g)=>(y*g+x)*2,B:(x,y,g)=>((y+1)*g+x)*2,L:(x,y,g)=>(y*g+x)*2+1,R:(x,y,g)=>(y*g+x+1)*2+1};
const SEG=[[],[["L","B"]],[["B","R"]],[["L","R"]],[["T","R"]],[["T","R"],["L","B"]],[["T","B"]],[["T","L"]],[["T","L"]],[["T","B"]],[["T","L"],["B","R"]],[["T","R"]],[["L","R"]],[["B","R"]],[["L","B"]],[]];
function contour(F,gw,gh,t,sx,sy){const pt=new Map(),adj=new Map(),P=new Path2D(),link=(a,b)=>{(adj.get(a)||adj.set(a,[]).get(a)).push(b)};
  for(let y=0;y<gh-1;y++)for(let x=0;x<gw-1;x++){const i=y*gw+x,tl=F[i],tr=F[i+1],bl=F[i+gw],br=F[i+gw+1],c=(tl>t?8:0)|(tr>t?4:0)|(br>t?2:0)|(bl>t?1:0);if(!c||c===15)continue;
    const pos={T:[x+(t-tl)/(tr-tl),y],B:[x+(t-bl)/(br-bl),y+1],L:[x,y+(t-tl)/(bl-tl)],R:[x+1,y+(t-tr)/(br-tr)]};
    for(const[a,b]of SEG[c]){const ka=EK[a](x,y,gw),kb=EK[b](x,y,gw);pt.set(ka,pos[a]);pt.set(kb,pos[b]);link(ka,kb);link(kb,ka)}}
  const seen=new Set();
  for(const k0 of adj.keys()){if(seen.has(k0))continue;const L=[];let k=k0;while(k!==undefined&&!seen.has(k)){seen.add(k);const p=pt.get(k);L.push([(p[0]-.5)*sx,(p[1]-.5)*sy]);k=adj.get(k).find(n=>!seen.has(n))}
    const n=L.length;if(n>2){P.moveTo((L[0][0]+L[n-1][0])/2,(L[0][1]+L[n-1][1])/2);for(let i=0;i<n;i++){const A=L[i],B=L[(i+1)%n];P.quadraticCurveTo(A[0],A[1],(A[0]+B[0])/2,(A[1]+B[1])/2)}P.closePath()}}
  return P}
function drawSplats(c,w,h,S,t){
  const g0=Math.min(QF().g,Math.round(w)),h0=Math.max(8,Math.round(g0*h/w)),k=g0/w,sx=w/g0,sy=h/h0,gw=g0+2,gh=h0+2;
  FC=FC||document.createElement("canvas");FC.width=g0;FC.height=h0;
  const fx=FC.getContext("2d",{willReadFrequently:true});fx.globalCompositeOperation="lighter";
  const o=[];for(const s of S)prim(s,t,w,h,o);
  for(let i=0;i<o.length;i+=3){const r=o[i+2]*k*1.6;if(r>0)fx.drawImage(SP,o[i]*k-r,o[i+1]*k-r,2*r,2*r)}
  const d=fx.getImageData(0,0,g0,h0).data,F=new Float32Array(gw*gh);
  for(let y=0;y<h0;y++)for(let x=0;x<g0;x++)F[(y+1)*gw+x+1]=d[(y*g0+x)*4+3]/255;
  const P=[.42,.58,.74,.9].map(l=>contour(F,gw,gh,l,sx,sy));
  c.clearRect(0,0,w,h);c.save();c.shadowColor=fem?"rgba(10,60,120,.4)":"rgba(0,0,0,.45)";c.shadowBlur=w/60;c.shadowOffsetY=w/170;c.fillStyle=fem?"rgba(120,185,240,.4)":"rgba(206,215,236,.95)";c.fill(P[0],"evenodd");c.restore();
  c.save();c.clip(P[0],"evenodd");
  (fem?[["rgba(170,215,250,.4)",1],["rgba(215,238,255,.45)",2],["rgba(255,255,255,.75)",3]]:[["#e4eaf6",1],["#f3f5fb",2],["#ffffff",3]]).forEach(([col,i])=>{c.save();c.translate(-i*w/600,-i*w/480);c.shadowColor=col;c.shadowBlur=w/120*i;c.fillStyle=col;c.fill(P[i],"evenodd");c.restore()});
  c.restore();if(fem){c.strokeStyle="rgba(255,255,255,.8)";c.lineWidth=Math.max(1,w/380);c.stroke(P[0])}}
function paintSplash(cv,im,r){const on=r&&r.fx&&r.seed&&im.clientWidth;cv.style.display=on?"block":"none";if(!on)return;sizeOver(cv,im);drawSplats(cv.getContext("2d"),cv.width,cv.height,mkSplats(r.seed),1.1)}
function withSplash(r,cls,click){const im=h("img",{src:urlOf(r),alt:"",loading:"lazy",decoding:"async"}),cv=h("canvas",{cls:"spl"}),p=()=>paintSplash(cv,im,r);im.addEventListener("load",p);if(window.ResizeObserver)new ResizeObserver(p).observe(im);return h("div",{cls:"pw "+cls,on:{click}},im,cv)}
function wipe(cv,done){const c=cv&&cv.getContext("2d"),w=cv?cv.width:0,hh=cv?cv.height:0;if(!w){done();return}
  c.globalCompositeOperation="destination-out";const T=RM?1:1400,t0=performance.now();let px=0;
  (function f(now){const p=Math.min(1,(now-t0)/T);for(let q=px;q<=p;q+=.004){c.beginPath();c.arc(q*w*1.2-.1*w,hh*(.5+.5*Math.sin(q*16)),hh*.4,0,6.283);c.fill()}px=p;if(p<1)requestAnimationFrame(f);else{c.globalCompositeOperation="source-over";done()}})(t0)}
function toggleFx(id){const all=recs(),x=all.find(v=>v.id===id);if(!x)return;if(!x.seed)x.seed=(Math.random()*1e9|0)+1;x.fx=!x.fx;lsSet(RK,all);render()}
function sizeOver(cv,im){const w=im.clientWidth,h=im.clientHeight;const dp=Math.min(QF().d,window.devicePixelRatio||1);cv.width=Math.round(w*dp);cv.height=Math.round(h*dp);cv.style.cssText="left:"+im.offsetLeft+"px;top:"+im.offsetTop+"px;width:"+w+"px;height:"+h+"px"}
function splash(cv,im,S,done){sizeOver(cv,im);const c=cv.getContext("2d"),w=cv.width,h=cv.height;
  if(RM){drawSplats(c,w,h,S,1.1);done();return}
  const T=4800,t0=performance.now();(function f(now){const t=Math.min(1,(now-t0)/T);c.clearRect(0,0,w,h);drawSplats(c,w,h,S,t*1.1);if(t<1)requestAnimationFrame(f);else done()})(t0)}
