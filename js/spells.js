window.ASHWICK_SPELL_EFFECTS = ({g,TAU,rand,wc,tr,inked,stage,emit,parts,getPointer}) => { let {mx,my}=getPointer(); return {
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
