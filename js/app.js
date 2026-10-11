
const $=s=>document.querySelector(s),TAU=Math.PI*2,rand=(a,b)=>a+Math.random()*(b-a);
const cv=$('#fx'),g=cv.getContext('2d'),mage=$('#mage'),orb=$('#orb'),stage=$('#stage'),runeRing=$('#ringw');
let runeGlowTimer;
function glowRunes(color){runeRing.style.setProperty('--rune-glow',color);runeRing.classList.remove('responding');void runeRing.offsetWidth;runeRing.classList.add('responding');clearTimeout(runeGlowTimer);runeGlowTimer=setTimeout(()=>runeRing.classList.remove('responding'),1400)}
let W,H,D,mx=innerWidth/2,my=innerHeight/2;
function size(){const v=window.visualViewport;D=Math.min(devicePixelRatio||1,2);W=Math.max(1,v? v.width:innerWidth);H=Math.max(1,v? v.height:innerHeight);cv.width=Math.round(W*D);cv.height=Math.round(H*D);g.setTransform(D,0,0,D,0,0)}
addEventListener('resize',size);addEventListener('orientationchange',size);if(window.visualViewport&&window.visualViewport.addEventListener)window.visualViewport.addEventListener('resize',size);size();
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY});
if(!('PointerEvent' in window)){addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});addEventListener('touchmove',e=>{if(e.touches.length){mx=e.touches[0].clientX;my=e.touches[0].clientY}},{passive:true})}
/* wobbly circle, closed polyline */
const wc=(cx,cy,r,sd,n=40)=>Array.from({length:n+1},(_,i)=>{const a=i/n*TAU,w=1+.035*Math.sin(a*3+sd)+.02*Math.sin(a*7+sd*2);return[cx+Math.cos(a)*r*w,cy+Math.sin(a)*r*w]});
const tr=p=>{g.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)g.lineTo(p[i][0],p[i][1])};
const inked=(p,w=3,c='#17120f')=>{g.beginPath();tr(p);g.lineWidth=w;g.strokeStyle=c;g.stroke()};
(()=>{let h='';const R=(r,s)=>'M'+wc(0,0,r,s,48).map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join('L');
 h+=`<path d="${R(106,1)}"/><path d="${R(90,2)}"/><path d="${R(66,3)}"/>`;
 for(let i=0;i<90;i++){const a=i/90*TAU,r=i%5?98+rand(-1,2):92,e=104+rand(-2,2);h+=`<line x1="${Math.cos(a)*r}" y1="${Math.sin(a)*r}" x2="${Math.cos(a)*e}" y2="${Math.sin(a)*e}"/>`}
 for(let i=0;i<14;i++){const a=i/14*TAU;let d='';for(let k=0;k<3;k++)d+=(k?'L':'M')+rand(-4,4).toFixed(1)+' '+rand(-6,6).toFixed(1);h+=`<path d="${d}" transform="translate(${Math.cos(a)*78} ${Math.sin(a)*78}) rotate(${a*57.3+90})"/>`}
 $('#runes').innerHTML=h})();

const K={flame:['#c92f17','#f2a516'],ward:['#1f7a6d','#3fbfa8'],moon:['#27347a','#9db4ff'],eye:['#17120f','#ff4a2b'],rune:['#17120f','#f2a516'],earth:['#6b4a2b','#c98a3c'],wind:['#4a6f7a','#dfeeea'],void:['#17120f','#b79cff'],frost:['#3a6f94','#bfe6f2'],bloom:['#4f7a2a','#f08fa0']};const KS=Object.keys(K); // EDIT: ink and lantern color per spell
const dens=(p,st=.05)=>{const o=[p[0]];for(let i=1;i<p.length;i++){const[x0,y0]=p[i-1],[x1,y1]=p[i],n=Math.max(1,Math.ceil(Math.hypot(x1-x0,y1-y0)/st));for(let j=1;j<=n;j++)o.push([x0+(x1-x0)*j/n,y0+(y1-y0)*j/n])}return o};
const wob=p=>{const s=rand(0,9),a=.022;return p.map(([x,y],i)=>[x+a*(Math.sin(i*.21+s)+.5*Math.sin(i*.6+s*2)),y+a*(Math.cos(i*.19+s)+.5*Math.cos(i*.55+s*3))])};
const P=window.ASHWICK_PRESETS;

const sound=window.ASHWICK_SOUND,sigils=[],parts=[];let drawing,hintTimer;
function spawn(strokes,k,trace){const pts=strokes.flat();let sx=0,sy=0;pts.forEach(p=>{sx+=p[0];sy+=p[1]});const cx=sx/pts.length,cy=sy/pts.length;let r=40;pts.forEach(p=>r=Math.max(r,Math.hypot(p[0]-cx,p[1]-cy)));const custom=trace===0?FX.createCustom(strokes):null;
 const t=performance.now(),st2=strokes.map(p=>p.map(([x,y],i)=>[x+1.8*Math.sin(i*.23+3),y+1.8*Math.cos(i*.2)]));
 sigils.push({st:strokes,st2,pts,k,cx,cy,r,col:custom?custom.ink:K[k][0],lanternColor:custom?custom.light:null,custom,t0:t,tr:trace,arm:t+trace,bolt:t+trace+340,ign:t+trace+600,end:t+trace+3600,a:0,i:0,sd:rand(0,9),stars:Array.from({length:40},()=>[rand(0,TAU),Math.sqrt(Math.random()),rand(0,6.28)])})}
function place(name){const k={Ward:'ward',Flame:'flame',Moon:'moon',Eye:'eye',Earth:'earth',Wind:'wind',Void:'void'}[name]||KS[Math.random()*KS.length|0];
 const r=Math.min(W,H)*rand(.1,.17)*(W<600?1.15:1);let x,y,t=0;
 do{x=rand(r+12,W-r-12);y=rand(r+90,H-r-120)}while(Math.hypot(x-W/2,(y-H/2)*.6)<r+80&&++t<40);
 sound.presetTrace(1100);spawn(P[name]().map(s=>wob(dens(s)).map(([u,v])=>[x+u*r,y+v*r])),k,1100);$('#hint').classList.add('off')}
const presetToggle=$('#preset-toggle'),presetRow=$('#row');
function closePresetMenu(restoreFocus=false){presetToggle.hidden=false;presetRow.hidden=true;presetToggle.setAttribute('aria-expanded','false');if(restoreFocus)presetToggle.focus()}
presetToggle.addEventListener('click',()=>{presetToggle.hidden=true;presetRow.hidden=false;presetToggle.setAttribute('aria-expanded','true');presetRow.querySelector('button').focus()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&presetToggle.hidden)closePresetMenu(true)});
document.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{place(b.dataset.s);closePresetMenu(true)});

drawing=window.ASHWICK_CANVAS(cv,sound,group=>spawn(group,KS[Math.random()*KS.length|0],0),closePresetMenu);

const mageController=window.ASHWICK_MAGE(mage,sound,K);
function emit(k,x,y,sc=1){const o={x,y,l:0,t:'d',sz:rand(1.5,4)*sc,g:0};
 if(k=='flame')Object.assign(o,{t:'f',vx:rand(-30,30)*sc,vy:rand(-130,-40)*sc,m:rand(.5,1),sz:rand(4,9)*sc,g:-40});
 else if(k=='ward')Object.assign(o,{c:'#1f7a6d',vx:rand(-70,70),vy:rand(-70,70),m:rand(.5,1.1)});
 else if(k=='moon')Object.assign(o,{t:'k',c:'#b8860b',vx:rand(-20,20),vy:rand(10,50),m:rand(1,2),sz:rand(3,5.5),g:30});
 else if(k=='earth')Object.assign(o,{t:'r',c:Math.random()<.5?'#8a5e32':'#b07a3a',vx:rand(-90,90),vy:rand(-260,-90),m:rand(.8,1.4),sz:rand(4,9)*sc,g:520,sh:Array.from({length:6},()=>rand(.6,1.1))});
 else if(k=='wind')Object.assign(o,{t:Math.random()<.5?'w':'l',c:'#6a8a3a',vx:rand(-60,60),vy:rand(-40,40),m:rand(.5,1),sz:rand(4,8)});
 else if(k=='void')Object.assign(o,{c:Math.random()<.5?'#17120f':'#c92f17',vx:rand(-30,30),vy:rand(-30,30),m:rand(.6,1.1)});
 else if(k=='frost')Object.assign(o,{t:'k',c:'#3a6f94',vx:rand(-20,20),vy:rand(10,50),m:rand(1,2),sz:rand(3,5.5),g:20});
 else if(k=='bloom')Object.assign(o,{t:'p',c:'#e8788f',vx:rand(-30,30),vy:rand(-50,-10),m:rand(1,2),sz:rand(3,5),g:15});
 else Object.assign(o,{c:Math.random()<.7?'#17120f':'#c92f17',vx:rand(-120,120),vy:rand(-140,20),m:rand(.6,1.3),g:380});
 parts.push(o)}
const path=(p,n)=>{if(n<2)return;g.beginPath();g.moveTo(p[0][0],p[0][1]);for(let i=1;i<n;i++)g.lineTo(p[i][0],p[i][1]);g.stroke()};

const FX=window.ASHWICK_SPELL_EFFECTS({g,TAU,rand,wc,tr,inked,stage,emit,parts,getPointer:()=>({mx,my})});

let last=performance.now();
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;g.clearRect(0,0,W,H);g.lineCap=g.lineJoin='round';g.setLineDash([]);
 if(drawing.draft){g.globalAlpha=1;g.strokeStyle='#17120f';g.lineWidth=3;drawing.draft.forEach(s=>path(s,s.length))}
 for(let k=sigils.length-1;k>=0;k--){const s=sigils[k];
  if(!s.a&&now>=s.arm){s.a=1;mageController.cast(s,W);glowRunes(s.lanternColor||K[s.k][1])}
  if(!s.i&&now>=s.ign){s.i=1;sound.boltLand();sound.spell(s.k);if(s.custom){const hint=$('#hint');hint.textContent=`${s.custom.name}: ${s.custom.action}`;hint.classList.remove('off');clearTimeout(hintTimer);hintTimer=setTimeout(()=>hint.classList.add('off'),3200)}}
  if(now>s.end){sigils.splice(k,1);continue}
  const f=s.tr?Math.min(1,(now-s.t0)/s.tr):1,q=(now-s.ign)/1000,al=s.i?(q<.8?1:Math.max(0,1-(q-.8)/1.2)):.9,n=p=>Math.ceil(p.length*f);
  g.globalAlpha=al;g.lineWidth=3;g.save();g.translate(2.5,2);g.strokeStyle=s.col=='#17120f'?'#c92f17':'#17120f';s.st.forEach(p=>path(p,n(p)));g.restore();
  g.strokeStyle=s.col;s.st.forEach(p=>path(p,n(p)));g.lineWidth=1.1;g.strokeStyle='#17120f';s.st2.forEach(p=>path(p,n(p)));
  g.globalAlpha=1;
  if(now>=s.bolt&&!s.i){if(!s.bs){s.bs=1;sound.boltStart()}const r=orb.getBoundingClientRect(),bx=r.left+r.width/2,by=r.top+r.height/2,t=Math.min(1,(now-s.bolt)/260),x=bx+(s.cx-bx)*t,y=by+(s.cy-by)*t;
   g.fillStyle=s.lanternColor||K[s.k][1];g.strokeStyle='#17120f';g.lineWidth=2.5;g.beginPath();g.arc(x,y,7,0,TAU);g.fill();g.stroke();for(let m=0;m<4;m++)emit(s.k,x,y,.7)}
  if(s.i){(s.custom?FX.custom:FX[s.k])(s,q);g.globalAlpha=1;g.setLineDash([])}
 }
 for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.l+=dt;const u=p.l/p.m;if(u>=1){parts.splice(i,1);continue}
  if(p.o){p.a+=p.sp*dt;p.rad+=p.vr*dt;p.x=p.o[0]+Math.cos(p.a)*p.rad;p.y=p.o[1]+Math.sin(p.a)*p.rad*(p.sq||1)}else{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.g*dt}
  if(p.t=='f'){const z=p.sz*(1-u*.5),tx=p.x+p.vx*.05;g.globalAlpha=u>.8?(1-u)*2:.95;g.fillStyle=u<.25?'#ffd54a':u<.5?'#f08a1a':u<.8?'#c92f17':'#3a2e28';
   g.beginPath();g.moveTo(tx,p.y-z*2);g.quadraticCurveTo(p.x+z*1.3,p.y-z*.2,p.x,p.y+z);g.quadraticCurveTo(p.x-z*1.3,p.y-z*.2,tx,p.y-z*2);g.fill();if(u<.8){g.strokeStyle='#17120f';g.lineWidth=1.1;g.stroke()}}
  else if(p.t=='r'){g.globalAlpha=1-u*u;g.fillStyle=p.c;g.strokeStyle='#17120f';g.lineWidth=1.5;g.beginPath();p.sh.forEach((m,i)=>{const a=i/6*TAU+p.l*3,x=p.x+Math.cos(a)*p.sz*m,y=p.y+Math.sin(a)*p.sz*m;i?g.lineTo(x,y):g.moveTo(x,y)});g.closePath();g.fill();g.stroke()}
  else if(p.t=='w'){g.globalAlpha=1-u;g.strokeStyle='#17120f';g.lineWidth=1.6;const a=(p.a||0)+Math.PI/2;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x+Math.cos(a)*p.sz,p.y+Math.sin(a)*p.sz);g.stroke()}
  else if(p.t=='l'||p.t=='p'){g.globalAlpha=1-u;g.fillStyle=p.c;g.strokeStyle='#17120f';g.lineWidth=1.2;g.beginPath();g.ellipse(p.x,p.y,p.sz*1.5,p.sz*.8,p.l*4+(p.a||0),0,TAU);g.fill();g.stroke()}
  else if(p.t=='k'){const z=p.sz*(1-u*.4);g.globalAlpha=1-u;g.strokeStyle=p.c;g.lineWidth=1.7;g.beginPath();g.moveTo(p.x-z,p.y);g.lineTo(p.x+z,p.y);g.moveTo(p.x,p.y-z);g.lineTo(p.x,p.y+z);g.stroke()}
  else{g.globalAlpha=1-u;g.fillStyle=p.c;g.beginPath();g.arc(p.x,p.y,p.sz*(1-u*.4),0,TAU);g.fill()}}
 g.globalAlpha=1;requestAnimationFrame(frame)}
requestAnimationFrame(frame);
