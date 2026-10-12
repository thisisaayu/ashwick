window.ASHWICK_SPELL_EFFECTS = ({g,TAU,rand,wc,tr,inked,stage,emit,parts,getPointer}) => { let {mx,my}=getPointer();
const customKinds=[
 {name:'firebolt',action:'A fire spirit bursts from the drawn mark',hue:12},
 {name:'lightning',action:'Forked lightning leaps from the sigil',hue:258},
 {name:'frost',action:'A crystal bloom grows through the air',hue:193},
 {name:'vine',action:'Thorned vines unfurl and reach outward',hue:104},
 {name:'rift',action:'A doorway opens into a turning void',hue:281},
 {name:'meteor',action:'A shower of falling stars strikes the mark',hue:25},
 {name:'tide',action:'A curling wave sweeps through the sigil',hue:187},
 {name:'familiar',action:'A little star familiar awakens and circles',hue:252},
 {name:'sunburst',action:'A small sun opens and throws out golden rays',hue:43},
 {name:'mirror',action:'Bright mirror shards turn around the sigil',hue:211},
 {name:'moths',action:'A swarm of luminous moths rises and circles',hue:326},
 {name:'gravity',action:'Loose stones lift and spiral into a dark well',hue:229},
 {name:'echo',action:'A ringing pulse rolls out through the air',hue:174}
];
const nameWords=['Wandering','Elder','Singing','Wild','Hollow','Dawnlit','Wayward','Whispering','Bright','Thornbound','Farseeing','Stormworn'];
let spellBag=[],lastFamily;
const spellFamily=spell=>({flame:'fire',firebolt:'fire',frost:'frost',rift:'void',void:'void'}[spell.key]||spell.key);
const shuffledSpells=presetKinds=>{
 const spells=[...presetKinds.map(key=>({type:'preset',key})),...customKinds.map(kind=>({type:'custom',key:kind.name}))];
 for(let i=spells.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[spells[i],spells[j]]=[spells[j],spells[i]]}
 return spells;
};
const nextFreehandSpell=presetKinds=>{
 if(!spellBag.length)spellBag=shuffledSpells(presetKinds);
 let index=spellBag.length-1;
 if(spellFamily(spellBag[index])===lastFamily){index=spellBag.findIndex(spell=>spellFamily(spell)!==lastFamily);if(index<0)index=spellBag.length-1}
 const [spell]=spellBag.splice(index,1);lastFamily=spellFamily(spell);return spell;
};
const rememberSpell=(type,key)=>{
 const family=spellFamily({type,key});lastFamily=family;
 spellBag=spellBag.filter(spell=>spellFamily(spell)!==family);
};
const createCustom=(strokes,kindName)=>{
 const points=strokes.flat();
 const bounds=points.reduce((b,[x,y])=>({minX:Math.min(b.minX,x),maxX:Math.max(b.maxX,x),minY:Math.min(b.minY,y),maxY:Math.max(b.maxY,y),sumX:b.sumX+x,sumY:b.sumY+y}),{minX:Infinity,maxX:-Infinity,minY:Infinity,maxY:-Infinity,sumX:0,sumY:0});
 const cx=bounds.sumX/points.length,cy=bounds.sumY/points.length,aspect=(bounds.maxY-bounds.minY)/(bounds.maxX-bounds.minX||1),start=points[0];
 const kind=customKinds.find(item=>item.name===kindName)||customKinds[Math.random()*customKinds.length|0],hue=(kind.hue+rand(-32,32)+360)%360;
 return{kind:kind.name,action:kind.action,name:`${nameWords[Math.random()*nameWords.length|0]} ${kind.name[0].toUpperCase()+kind.name.slice(1)}`,ink:`hsl(${hue} 48% 23%)`,light:`hsl(${hue+18} 72% 57%)`,spark:`hsl(${hue+38} 96% 82%)`,branches:4+((strokes.length+Math.random()*7|0)%7),petals:4+((Math.floor(points.length/10)+Math.random()*7|0)%7),turns:2+(Math.random()*5|0),phase:Math.atan2(start[1]-cy,start[0]-cx)+rand(-1,1),twist:rand(-2.8,2.8),spin:rand(-1.8,1.8),flatten:Math.max(.55,Math.min(1.3,aspect*.55+rand(.25,.75))),seed:rand(0,TAU),reach:rand(1.1,2.2),variant:Math.random()};
};
return {createCustom,nextFreehandSpell,rememberSpell,custom(s,q){
 const c=s.custom;if(!c)return;const grow=1-Math.pow(1-Math.min(1,q/.62),3),fade=q>2.25?Math.max(0,1-(q-2.25)/.78):1;if(fade<=0||grow<=0)return;
 const{cx,cy,r}=s,R=r*(.65+.8*grow),phase=c.phase+q*c.spin;
 const point=(a,d,flat=c.flatten)=>[cx+Math.cos(a)*d,cy+Math.sin(a)*d*flat];
 const line=(ps,color,width)=>{g.beginPath();tr(ps);g.strokeStyle=color;g.lineWidth=width;g.stroke()};
 const flame=(x,y,size,a)=>{g.save();g.translate(x,y);g.rotate(a);g.beginPath();g.moveTo(0,size);g.bezierCurveTo(-size*.8,size*.4,-size*.55,-size*.2,0,-size);g.bezierCurveTo(size*.55,-size*.25,size*.85,size*.35,0,size);g.closePath();g.fillStyle=c.ink;g.fill();g.beginPath();g.moveTo(0,size*.55);g.quadraticCurveTo(-size*.35,0,0,-size*.55);g.quadraticCurveTo(size*.4,0,0,size*.55);g.fillStyle=c.spark;g.fill();g.restore()};
 g.save();g.globalAlpha=fade;g.lineCap='round';g.lineJoin='round';
 if(c.kind==='firebolt'){
  const flare=R*(.36+.07*Math.sin(q*11+c.seed));g.globalAlpha=fade*(.72+.22*Math.sin(q*8));g.beginPath();g.arc(cx,cy,flare,0,TAU);g.fillStyle=c.ink;g.fill();g.beginPath();g.arc(cx,cy,flare*.58,0,TAU);g.fillStyle=c.light;g.fill();
  for(let i=0;i<c.petals;i++){const a=i/c.petals*TAU+phase,d=R*(.35+.32*Math.sin(q*4+i+c.seed));flame(cx+Math.cos(a)*d,cy+Math.sin(a)*d,d*.68,a-Math.PI/2)}
  for(let i=0;i<4;i++){const a=i*TAU/4+phase,ps=Array.from({length:18},(_,j)=>point(a+(j/17-.5)*.55,R*(.35+j/17*1.05)*(1+.08*Math.sin(j*2+c.seed))));line(ps,i%2?c.spark:c.light,2.5)}
 }else if(c.kind==='lightning'){
  const flash=.65+.35*Math.sin(q*24+c.seed);g.globalAlpha=fade*flash;
  for(let b=0;b<c.branches;b++){const a=b/c.branches*TAU+phase,len=R*(.72+.72*((b*7%11)/11)),steps=9,ps=[];
   for(let j=0;j<=steps;j++){const d=len*j/steps,side=j===0||j===steps?0:Math.sin(j*91+c.seed+b*7)*R*.085;ps.push([cx+Math.cos(a)*d-Math.sin(a)*side,cy+(Math.sin(a)*d+Math.cos(a)*side)*c.flatten])}
   line(ps,c.ink,5);line(ps,c.spark,2);
   if(b%2===0&&b<c.branches-1){const from=ps[4],ba=a+Math.sin(c.seed+b*7)*.48,branch=[];for(let j=0;j<5;j++){const d=j*len*.09;branch.push([from[0]+Math.cos(ba)*d+Math.sin(ba)*Math.sin(j*8+c.seed)*8,from[1]+Math.sin(ba)*d*c.flatten])}line(branch,c.light,1.7)}
  }
  g.beginPath();g.arc(cx,cy,R*.2,0,TAU);g.fillStyle=c.spark;g.fill();
 }else if(c.kind==='frost'){
  const reach=R*grow*c.reach;
  for(let b=0;b<c.branches;b++){const a=b/c.branches*TAU+phase,len=reach*(.72+.28*Math.sin(b*9+c.seed)),end=point(a,len);
   line([[cx,cy],end],c.ink,4);line([[cx,cy],end],c.spark,1.5);
   for(const t of[.38,.61,.8]){const base=point(a,len*t),side=len*.2*(1-t*.35);for(const sign of[-1,1]){const tip=[base[0]+Math.cos(a+sign*.82)*side,base[1]+Math.sin(a+sign*.82)*side*c.flatten];line([[base[0],base[1]],tip],c.light,2.3);line([[tip[0],tip[1]],[tip[0]+Math.cos(a+sign*.82)*side*.2,tip[1]+Math.sin(a+sign*.82)*side*.2]],c.spark,1.2)}}
  }
  g.beginPath();g.arc(cx,cy,R*.14*grow,0,TAU);g.fillStyle=c.light;g.fill();
 }else if(c.kind==='vine'){
  const reach=R*grow*c.reach;
  for(let b=0;b<c.branches;b++){const a=b/c.branches*TAU+phase,ps=[];
   for(let j=0;j<=70;j++){const t=j/70,d=reach*t,turn=a+c.twist*t*2+Math.sin(t*9+c.seed+b)*.12;ps.push([cx+Math.cos(turn)*d,cy+Math.sin(turn)*d*c.flatten])}
   line(ps,c.ink,5);line(ps,c.light,2.3);
   for(let j=2;j<7;j+=2){const t=j/8,base=ps[Math.floor(t*70)],side=(j%3?1:-1),leafA=a+c.twist*t*2+side*.9,size=R*.12*(1-t*.45),tip=point(leafA,size,1);g.beginPath();g.ellipse(base[0]+tip[0]-cx,base[1]+tip[1]-cy,size,size*.42,leafA,0,TAU);g.fillStyle=c.light;g.fill();g.strokeStyle=c.ink;g.lineWidth=1.5;g.stroke()}
  }
 }else if(c.kind==='rift'){
  const rx=R*(.35+grow*.62),ry=rx*c.flatten;
  g.beginPath();g.ellipse(cx,cy,rx,ry,phase*.15,0,TAU);g.fillStyle='rgba(8,4,22,.76)';g.fill();
  for(let j=0;j<4;j++){g.beginPath();g.ellipse(cx,cy,rx*(.52+j*.18),ry*(.52+j*.18),phase*(j%2?-1:1)+j*.4,0,TAU);g.strokeStyle=j%2?c.light:c.ink;g.lineWidth=j===0?4:1.8;g.setLineDash(j%2?[5,8]:[]);g.lineDashOffset=-q*32*(j%2?-1:1);g.stroke()}
  g.setLineDash([]);
  for(let i=0;i<12;i++){const a=i/12*TAU+phase*2,d=rx*(.65+.16*Math.sin(i*7+c.seed)),p1=point(a,d),p2=point(a+.15,d+8);line([p1,p2],c.spark,2.2)}
  for(let i=0;i<9;i++){const a=i/9*TAU-phase*2,d=rx*(.8-i*.065),p=point(a,d);g.beginPath();g.arc(p[0],p[1],2+i%3,0,TAU);g.fillStyle=c.spark;g.fill()}
 }else if(c.kind==='meteor'){
  for(let i=0;i<4;i++){const a=phase+i/4*TAU,offset=R*(.8+.4*((i*5%7)/7)),x=cx+Math.cos(a)*offset,y=cy+Math.sin(a)*offset*c.flatten,fall=Math.min(1,Math.max(0,(q-i*.12)/.9)),tx=cx+(x-cx)*(1-fall),ty=cy+(y-cy)*(1-fall);
   const tail=[[tx-Math.cos(a)*R*.35,ty-Math.sin(a)*R*.35],[tx,ty]];line(tail,c.ink,8);line(tail,c.spark,3);g.beginPath();g.arc(tx,ty,5+fall*8,0,TAU);g.fillStyle=c.light;g.fill();
  }
  for(let i=0;i<18;i++){const a=i/18*TAU+c.seed,d=R*(.2+grow*.95)*(1+.09*Math.sin(i*8+c.seed));line([[cx,cy],point(a,d)],i%2?c.light:c.ink,i%3?1.8:3.5)}
  g.beginPath();g.ellipse(cx,cy,R*.31*grow,R*.12*grow,0,0,TAU);g.fillStyle=c.ink;g.fill();g.strokeStyle=c.spark;g.lineWidth=2;g.stroke();
 }else if(c.kind==='tide'){
  const span=R*(.8+grow*.85),height=R*.45*grow;
  for(let band=0;band<4;band++){const ps=[];for(let i=0;i<=70;i++){const t=i/70,x=cx-span+2*span*t,y=cy+(band-1.5)*height*.34+Math.sin(t*c.turns*TAU+q*4+c.seed+band*.9)*height*.48;ps.push([x,y])}line(ps,band%2?c.light:c.ink,band===0?4:2.4)}
  for(let i=0;i<c.petals;i++){const x=cx-span+(i+.5)/c.petals*span*2,y=cy+Math.sin((i+.5)/c.petals*c.turns*TAU+q*4+c.seed)*height*.48;g.beginPath();g.arc(x,y,2.5+2*Math.sin(q*8+i),0,TAU);g.fillStyle=c.spark;g.fill()}
 }else if(c.kind==='sunburst'){
  const rays=c.branches*2,reach=R*(.72+.28*grow);
  for(let i=0;i<rays;i++){const a=i/rays*TAU+phase,inner=R*(.28+.04*Math.sin(i*5+c.seed)),outer=reach*(.72+.28*Math.sin(i*8+c.seed));line([point(a,inner),point(a,outer)],i%2?c.light:c.spark,i%3?2.2:4)}
  g.beginPath();g.arc(cx,cy,R*.34,0,TAU);g.fillStyle=c.ink;g.fill();g.strokeStyle=c.spark;g.lineWidth=3;g.stroke();
  g.beginPath();g.arc(cx,cy,R*.25,0,TAU);g.fillStyle=c.light;g.fill();
  for(let i=0;i<c.petals;i++){const a=i/c.petals*TAU+phase,d=R*.18;g.beginPath();g.arc(cx+Math.cos(a)*d,cy+Math.sin(a)*d,d*.14,0,TAU);g.fillStyle=c.spark;g.fill()}
 }else if(c.kind==='mirror'){
  const shards=c.petals+2;
  for(let i=0;i<shards;i++){const a=i/shards*TAU+phase+q*.12,inner=R*.16,outer=R*(.72+.24*Math.sin(i*7+c.seed))*grow,left=a-.16,right=a+.16;
   g.beginPath();g.moveTo(...point(left,inner));g.lineTo(...point(a,outer));g.lineTo(...point(right,inner));g.lineTo(...point(a,inner*.45));g.closePath();g.fillStyle=i%2?c.light:c.ink;g.fill();g.strokeStyle=c.spark;g.lineWidth=1.8;g.stroke();
   line([point(left,inner),point(a,outer*.78)],c.spark,1.3)
  }
  g.beginPath();g.arc(cx,cy,R*.14,0,TAU);g.fillStyle=c.spark;g.fill();
 }else if(c.kind==='moths'){
  const count=c.petals+2;
  for(let i=0;i<count;i++){const a=i/count*TAU+phase+q*(.35+(i%3)*.1),orbit=R*(.35+.42*((i*5%9)/9))*grow,x=cx+Math.cos(a)*orbit,y=cy+Math.sin(a)*orbit*c.flatten,size=R*(.09+.025*(i%3)),flap=Math.sin(q*15+i+c.seed)*.48;
   g.save();g.translate(x,y);g.rotate(a+Math.PI/2);
   g.beginPath();g.ellipse(-size*.62,0,size*.64,size*.34,-flap,0,TAU);g.ellipse(size*.62,0,size*.64,size*.34,flap,0,TAU);g.fillStyle=i%2?c.light:c.spark;g.fill();g.strokeStyle=c.ink;g.lineWidth=1.5;g.stroke();
   g.beginPath();g.moveTo(0,-size*.38);g.lineTo(0,size*.45);g.strokeStyle=c.ink;g.lineWidth=2;g.stroke();
   g.beginPath();g.moveTo(-size*.08,-size*.3);g.quadraticCurveTo(-size*.35,-size*.8,-size*.48,-size*.68);g.moveTo(size*.08,-size*.3);g.quadraticCurveTo(size*.35,-size*.8,size*.48,-size*.68);g.stroke();g.restore()
  }
 }else if(c.kind==='gravity'){
  const rocks=c.branches+2;
  for(let orbit=0;orbit<3;orbit++){g.beginPath();g.ellipse(cx,cy,R*(.38+orbit*.2),R*(.24+orbit*.13)*c.flatten,phase+orbit*.5,0,TAU);g.setLineDash([4,8]);g.lineDashOffset=-q*16*(orbit%2?-1:1);g.strokeStyle=c.light;g.lineWidth=1.3;g.stroke()}
  g.setLineDash([]);
  for(let i=0;i<rocks;i++){const a=i/rocks*TAU+phase+q*(1.1+i%3*.25),fall=(q*.27+i/rocks*.5)%1,orbit=R*(1.05-fall*.72),x=cx+Math.cos(a)*orbit,y=cy+Math.sin(a)*orbit*c.flatten,z=R*(.055+.025*(i%3));
   g.beginPath();for(let j=0;j<7;j++){const aa=j/7*TAU+phase,rad=z*(.76+.24*Math.sin(j*11+i+c.seed));const px=x+Math.cos(aa)*rad,py=y+Math.sin(aa)*rad;if(j)g.lineTo(px,py);else g.moveTo(px,py)}g.closePath();g.fillStyle=i%2?c.ink:c.light;g.fill();g.strokeStyle=c.spark;g.lineWidth=1.7;g.stroke();
   line([[x-z*.3,y-z*.2],[x+z*.25,y+z*.18]],c.spark,1.2)
  }
  g.beginPath();g.arc(cx,cy,R*(.12+.04*Math.sin(q*9)),0,TAU);g.fillStyle=c.ink;g.fill();g.strokeStyle=c.spark;g.lineWidth=2;g.stroke();
 }else if(c.kind==='echo'){
  const waves=5;
  for(let band=0;band<waves;band++){const phaseWave=(q*.42+band/waves)%1,rad=R*(.12+phaseWave*1.25),alpha=fade*(1-phaseWave*.48),ps=[];
   for(let i=0;i<=96;i++){const a=i/96*TAU,warp=1+.045*Math.sin(a*c.turns+q*5+band)*Math.sin(a*3+c.seed);ps.push(point(a,rad*warp))}
   g.globalAlpha=alpha;line(ps,band%2?c.light:c.spark,band===0?3.5:1.8)
  }
  g.globalAlpha=fade;
  for(let i=0;i<c.branches;i++){const a=i/c.branches*TAU+phase,d=R*(.35+.52*((i*7%11)/11)),p=point(a,d);g.beginPath();g.arc(p[0],p[1],2.5+1.5*Math.sin(q*8+i),0,TAU);g.fillStyle=c.spark;g.fill()}
 }else if(c.kind==='familiar'){
  const orbit=R*(.42+.28*grow),a=phase+q*c.spin,x=cx+Math.cos(a)*orbit,y=cy+Math.sin(a)*orbit*c.flatten,size=R*.2;
  g.beginPath();g.ellipse(x-size*.65,y,size*.7,size*.34,Math.sin(q*13)*.5,0,TAU);g.ellipse(x+size*.65,y,size*.7,size*.34,-Math.sin(q*13)*.5,0,TAU);g.fillStyle=c.light;g.fill();g.strokeStyle=c.ink;g.lineWidth=2;g.stroke();
  g.beginPath();g.arc(x,y,size,0,TAU);g.fillStyle=c.spark;g.fill();g.strokeStyle=c.ink;g.lineWidth=3;g.stroke();
  g.fillStyle=c.ink;g.beginPath();g.arc(x-size*.3,y-size*.08,2.8,0,TAU);g.arc(x+size*.3,y-size*.08,2.8,0,TAU);g.fill();
  const tail=[];for(let i=0;i<30;i++){const t=i/29,aa=a+Math.PI+t*1.4;tail.push([x+Math.cos(aa)*size*(.7+t*1.2),y+Math.sin(aa)*size*(.7+t*1.2)])}line(tail,c.light,2.2);
  for(let i=0;i<7;i++){const sa=c.seed+i/7*TAU+q*.5,p=point(sa,R*(.8+.35*Math.sin(i*3+c.seed)));g.beginPath();g.arc(p[0],p[1],1.5+i%3,0,TAU);g.fillStyle=c.spark;g.fill()}
 }
 g.restore();
},
flame(s,q){if(q<2.2)for(let n=0,c=Math.ceil(14*(1-q/2.2));n<c;n++){const p=s.pts[Math.random()*s.pts.length|0];emit('flame',p[0],p[1],s.r/70)}},
ward(s,q){const b=stage.getBoundingClientRect(),cx=b.left+b.width/2,cy=b.top+b.height/2,R=Math.hypot(b.width,b.height)*.52,gr=Math.min(1,q/.45),r=R*(1-(1-gr)**3),fd=q>2?Math.max(0,1-(q-2)/.9):1;if(fd<=0)return;
 g.save();g.globalAlpha=fd;const rim=wc(cx,cy,r,s.sd);g.beginPath();tr(rim);g.fillStyle='rgba(31,122,109,.15)';g.fill();
 g.lineCap='round';inked(rim,3.2,'#1f7a6d');inked(wc(cx,cy,r+3,s.sd+2),1.1);
 g.strokeStyle='#1f7a6d';g.lineWidth=1.7;for(let j=1;j<4;j++){const rr=r*(.35+.17*j),n=Math.round(rr/8);g.beginPath();for(let i=0;i<n;i++){const a=i/n*TAU+(j%2)*TAU/(2*n)+q*(j%2?.15:-.15),x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr;g.moveTo(x+Math.cos(a-1.2)*7,y+Math.sin(a-1.2)*7);g.arc(x,y,7,a-1.2,a+1.2)}g.stroke()}
 const ang=Math.atan2(s.cy-cy,s.cx-cx),w=Math.max(0,q-.45)*1.1;
 if(w>0&&w<1.3){g.beginPath();for(let i=0;i<=24;i++){const aa=ang-w+2*w*i/24,rr=r+Math.sin(i*1.7+q*20)*4;g.lineTo(cx+Math.cos(aa)*rr,cy+Math.sin(aa)*rr)}g.strokeStyle='#d99a12';g.lineWidth=6*(1-w/1.3);g.stroke()}
 g.restore();if(q<.7)emit('ward',cx+Math.cos(ang)*r,cy+Math.sin(ang)*r)},
moon(s,q){const R=s.r*1.7,gr=Math.min(1,q/.6),r=R*(1-(1-gr)**3),fd=q>2.2?Math.max(0,1-(q-2.2)/.8):1;if(fd<=0)return;const{cx,cy,sd}=s,rim=wc(cx,cy,r,sd);
 g.save();g.globalAlpha=fd;g.beginPath();tr(rim);g.clip();g.fillStyle='#27347a';g.fillRect(cx-r,cy-r,2*r,2*r);
 g.strokeStyle='#0f1642';g.lineWidth=1.4;g.beginPath();for(let i=-r;i<r;i+=r*.13){const j=Math.sin(i*.9)*3;g.moveTo(cx+i-r,cy+r+j);g.lineTo(cx+i+r,cy-r+j*1.5)}g.stroke();
 g.lineWidth=1;g.beginPath();for(let i=-r;i<r;i+=r*.17){g.moveTo(cx+i-r*.5,cy+r*.1+Math.sin(i)*2);g.lineTo(cx+i+r*.5,cy+r*1.2)}g.stroke();
 g.strokeStyle=g.fillStyle='#f3e6b0';g.lineWidth=1.5;s.stars.forEach(([a,d,ph],i)=>{const x=cx+Math.cos(a)*d*r,y=cy+Math.sin(a)*d*r;
  if(i<12){const z=(3+ph%4)*(.7+.3*Math.sin(q*5+ph));g.beginPath();g.moveTo(x-z,y);g.lineTo(x+z,y);g.moveTo(x,y-z);g.lineTo(x,y+z);g.stroke()}else{g.beginPath();g.arc(x,y,.9+ph%1.2,0,TAU);g.fill()}});
 const o=wc(cx,cy,r*.4,2,36),b=wc(cx+r*.17,cy-r*.07,r*.33,5,36);g.beginPath();tr(o);tr(b);g.fillStyle='#efe3c4';g.fill('evenodd');g.strokeStyle='#17120f';g.lineWidth=2.5;g.stroke();
 g.beginPath();g.arc(cx-r*.27,cy+r*.02,r*.05,.15*Math.PI,.85*Math.PI);g.lineWidth=2;g.stroke();g.fillStyle='#c92f17';g.beginPath();g.arc(cx-r*.3,cy+r*.13,r*.035,0,TAU);g.fill();
 g.restore();g.save();g.globalAlpha=fd;inked(rim,3.2);inked(wc(cx,cy,r+3,sd+1),1.2);g.setLineDash([2,7]);g.lineCap='round';inked(wc(cx,cy,r+10,3),1.8,'#27347a');g.restore();
 if(q<2.2)for(let i=0;i<2;i++){const a=rand(0,TAU),d=Math.sqrt(Math.random())*r;emit('moon',cx+Math.cos(a)*d,cy+Math.sin(a)*d)}},
eye(s,q){({mx,my}=getPointer());const R=s.r*1.5;let o=q<.4?q/.4:q>2.1?Math.max(0,1-(q-2.1)/.3):1;if(q>1.3&&q<1.5)o*=Math.abs(q-1.4)/.1;if(o<=.02)return;const{cx,cy,sd}=s,h=R*o,N=20,up=[],lo=[];
 for(let i=0;i<=N;i++){const t=i/N,x=cx-R+2*R*t,y=2.4*h*.8*t*(1-t),j=Math.sin(i*2.1+sd)*R*.018;up.push([x,cy-y+j]);lo.push([x,cy+y*.9-j])}
 const lid=[...up,...lo.slice().reverse()],lidp=()=>{g.beginPath();tr(lid)};
 g.save();lidp();g.fillStyle='#efe3c4';g.fill();g.clip();
 const a=Math.atan2(my-cy,mx-cx),d=Math.min(R*.28,Math.hypot(mx-cx,my-cy)/5),ix=cx+Math.cos(a)*d,iy=cy+Math.sin(a)*d,ir=wc(ix,iy,R*.44,sd,24);
 g.beginPath();tr(ir);g.fillStyle='#c92f17';g.fill();g.strokeStyle='#17120f';g.lineWidth=3;g.stroke();
 g.strokeStyle='#7a1a0c';g.lineWidth=1.3;g.beginPath();for(let i=0;i<26;i++){const t=i/26*TAU,e=R*(.2+.04*Math.sin(i*5));g.moveTo(ix+Math.cos(t)*e,iy+Math.sin(t)*e);g.lineTo(ix+Math.cos(t)*R*.4,iy+Math.sin(t)*R*.4)}g.stroke();
 g.fillStyle='#17120f';g.beginPath();g.ellipse(ix,iy,R*.1,R*.28,0,0,TAU);g.fill();g.fillStyle='#efe3c4';g.beginPath();g.arc(ix-R*.15,iy-R*.16,R*.06,0,TAU);g.fill();g.restore();
 g.lineCap='round';lidp();g.strokeStyle='#17120f';g.lineWidth=4;g.stroke();
 for(let i=2;i<N-1;i+=3){const[x,y]=up[i],t=(x-cx)/R;g.beginPath();g.moveTo(x,y);g.lineTo(x+t*R*.1,y-R*(.1+.08*Math.abs(Math.sin(i*3.1)))*o);g.lineWidth=3;g.stroke()}
 g.strokeStyle='#c92f17';g.lineWidth=2;g.globalAlpha=.7*o;for(let i=0;i<14;i++){const t=i/14*TAU,L=R*(1.2+.2*Math.sin(q*6+i));g.beginPath();g.moveTo(cx+Math.cos(t)*R*1.1,cy+Math.sin(t)*R*.66);g.lineTo(cx+Math.cos(t)*L,cy+Math.sin(t)*L*.6);g.stroke()}
 g.globalAlpha=1;if(q<.5)emit('eye',cx,cy,1.2)},
rune(s,q){if(q<1.2&&Math.random()<.75)for(let i=0;i<4;i++){const a=rand(0,TAU),L=s.r*rand(1.2,2.6);g.beginPath();g.moveTo(s.cx,s.cy);
  for(let j=1;j<=9;j++){const d=L*j/9,o=rand(-14,14);g.lineTo(s.cx+Math.cos(a)*d-Math.sin(a)*o,s.cy+Math.sin(a)*d+Math.cos(a)*o)}
  g.strokeStyle=i%2?'#c92f17':'#17120f';g.lineWidth=2.4;g.stroke()}
 if(q<.4)for(let i=0;i<3;i++)emit('rune',s.cx,s.cy,1.3)},
earth(s,q){const{cx,cy,r}=s,fd=q>2.3?Math.max(0,1-(q-2.3)/.8):1;if(fd<=0)return;const e=1-(1-Math.min(1,q/.35))**3;
 g.save();g.globalAlpha=fd;g.lineCap='round';
 for(let i=0;i<8;i++){const a=i/8*TAU+s.sd,L=r*1.6*e;g.beginPath();g.moveTo(cx,cy+r*.3);for(let j=1;j<=8;j++){const d=L*j/8,o=Math.sin(j*2.7+i*3)*7;g.lineTo(cx+Math.cos(a)*d-Math.sin(a)*o,cy+r*.3+(Math.sin(a)*d+Math.cos(a)*o)*.45)}g.strokeStyle='#17120f';g.lineWidth=2.4;g.stroke()}
 for(let i=0;i<7;i++){const x=cx+(i-3)*r*.34,h=r*(.9+.6*Math.abs(Math.sin(i*2.3)))*(i%2?.8:1)*e*(q>2?Math.max(0,1-(q-2)/.3):1),w=r*.16,by=cy+r*.45+Math.abs(i-3)*4;
  g.beginPath();g.moveTo(x-w,by);g.lineTo(x-w*.6,by-h*.55);g.lineTo(x-w*.1,by-h*.5);g.lineTo(x+w*.15,by-h);g.lineTo(x+w*.5,by-h*.45);g.lineTo(x+w,by);g.closePath();g.fillStyle=i%2?'#b07a3a':'#8a5e32';g.fill();g.strokeStyle='#17120f';g.lineWidth=2.6;g.stroke();
  g.lineWidth=1.2;g.beginPath();g.moveTo(x-w*.3,by);g.lineTo(x-w*.2,by-h*.4);g.moveTo(x+w*.2,by);g.lineTo(x+w*.1,by-h*.3);g.stroke()}
 g.restore();if(q<.4)for(let i=0;i<5;i++)emit('earth',cx+rand(-r,r),cy,1.2)},
wind(s,q){const{cx,cy,r}=s,fd=q>2?Math.max(0,1-(q-2)/.8):1;if(fd<=0)return;g.save();g.globalAlpha=fd;g.lineCap='round';
 for(let j=0;j<4;j++){g.beginPath();for(let i=0;i<=30;i++){const t=i/30,a=j*TAU/4+q*5+t*5.5,d=t*r*2.4*Math.min(1,q*2.5);g.lineTo(cx+Math.cos(a)*d,cy+Math.sin(a)*d*.8)}g.strokeStyle=j%2?'#4a6f7a':'#17120f';g.lineWidth=2.4;g.stroke()}
 g.restore();if(q<2)for(let i=0;i<4;i++){emit('wind',cx,cy);const p=parts[parts.length-1];p.o=[cx,cy];p.a=rand(0,TAU);p.rad=rand(10,r*.8);p.vr=rand(60,160);p.sp=rand(3,5.5);p.sq=.8;p.m=rand(.8,1.6)}},
void(s,q){const{cx,cy,r}=s,fd=q>2.2?Math.max(0,1-(q-2.2)/.8):1;if(fd<=0)return;const R=r*.7*(1-(1-Math.min(1,q/.5))**3)*fd;
 g.save();g.globalAlpha=fd;g.lineCap='round';
 for(let j=0;j<3;j++){g.beginPath();g.ellipse(cx,cy,R*(1.7+.55*j),R*(.55+.18*j),-.35,0,TAU);g.setLineDash([12,9]);g.lineDashOffset=-q*(50+30*j)*(j%2?-1:1);g.strokeStyle=j==1?'#c92f17':'#17120f';g.lineWidth=2.4-j*.4;g.stroke()}
 g.setLineDash([]);const rim=wc(cx,cy,R,s.sd,36);g.beginPath();tr(rim);g.fillStyle='#17120f';g.fill();g.strokeStyle='#e9dcc0';g.lineWidth=2;g.stroke();inked(wc(cx,cy,R+4,s.sd+1),1.3,'#c92f17');
 g.restore();if(q<1.9)for(let i=0;i<3;i++){emit('void',cx,cy);const p=parts[parts.length-1];p.o=[cx,cy];p.a=rand(0,TAU);p.rad=r*rand(1.8,3.2);p.vr=-p.rad*.85;p.sp=rand(2,4);p.sq=.55;p.m=1.2;p.sz=rand(1.5,3.5)}},
frost(s,q){const{cx,cy,r}=s,fd=q>2.2?Math.max(0,1-(q-2.2)/.8):1;if(fd<=0)return;const e=1-(1-Math.min(1,q/.6))**3,L=r*1.6*e;
 g.save();g.globalAlpha=fd;g.lineCap='round';const rim=wc(cx,cy,r*1.5*e,s.sd);g.beginPath();tr(rim);g.fillStyle='rgba(160,205,228,.28)';g.fill();inked(rim,1.5,'#3a6f94');
 for(let b=0;b<6;b++){const a=b*TAU/6+.15,ux=Math.cos(a),uy=Math.sin(a),P=(t,o=0)=>[cx+ux*L*t-uy*o,cy+uy*L*t+ux*o];
  g.beginPath();g.moveTo(cx,cy);g.lineTo(...P(1));for(const t of[.4,.65,.85]){const z=L*.28*(1-t*.5);g.moveTo(...P(t));g.lineTo(...P(t+.14,z));g.moveTo(...P(t));g.lineTo(...P(t+.14,-z))}
  g.strokeStyle='#17120f';g.lineWidth=4.5;g.stroke();g.strokeStyle='#8fc7e0';g.lineWidth=2;g.stroke()}
 g.restore();if(q<2)emit('frost',cx+rand(-r,r)*1.5,cy-r*rand(.5,1.6))},
bloom(s,q){const{cx,cy,r}=s,fd=q>2.4?Math.max(0,1-(q-2.4)/.8):1;if(fd<=0)return;g.save();g.globalAlpha=fd;g.lineCap='round';
 for(let v=0;v<5;v++){const a0=v*TAU/5+s.sd,gr=Math.min(1,Math.max(0,(q-v*.08)/.9)),N=Math.round(40*gr);if(N<2)continue;
  const pt=i=>{const t=i/40,a=a0+.9*Math.sin(t*4+v),d=t*r*1.7;return[cx+Math.cos(a)*d,cy+Math.sin(a)*d*.9]};
  g.beginPath();for(let i=0;i<=N;i++){const[x,y]=pt(i);i?g.lineTo(x,y):g.moveTo(x,y)}g.strokeStyle='#17120f';g.lineWidth=4.5;g.stroke();g.strokeStyle='#5d8a2f';g.lineWidth=2.4;g.stroke();
  for(const li of[12,24])if(N>li){const[x,y]=pt(li),a=a0+.9*Math.sin(li/40*4+v)+(li>15?-1:1);g.beginPath();g.ellipse(x+Math.cos(a)*7,y+Math.sin(a)*7,9,4.5,a,0,TAU);g.fillStyle='#5d8a2f';g.fill();g.strokeStyle='#17120f';g.lineWidth=1.6;g.stroke()}
  if(N>=40){const[x,y]=pt(40),z=r*.13;for(let k=0;k<5;k++){const a=k*TAU/5+v;g.beginPath();g.ellipse(x+Math.cos(a)*z,y+Math.sin(a)*z,z*.8,z*.5,a,0,TAU);g.fillStyle='#e8788f';g.fill();g.strokeStyle='#17120f';g.lineWidth=1.5;g.stroke()}g.beginPath();g.arc(x,y,z*.4,0,TAU);g.fillStyle='#f2a516';g.fill();g.stroke()}}
 g.restore();if(q<2&&Math.random()<.5)emit('bloom',cx+rand(-r,r)*1.5,cy+rand(-r,r)*1.2)}
}};
