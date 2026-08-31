"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./UrbanSystemFlow.module.css";

type Stage = "water" | "root" | "light" | "air" | "structure";
type StageItem = { key: Stage; no: string; label: string; note: string; title: string; emphasis: string; body: string; metric: string; value: string };
type RootBranch = { x0:number; y0:number; cx:number; cy:number; x1:number; y1:number; level:number; delay:number; width:number; seed:number };

const stages: StageItem[] = [
  { key:"water", no:"01", label:"WATER", note:"nutrient loop", title:"Circulate", emphasis:"resources.", body:"Water becomes a visible infrastructure layer: a recirculating loop crossing the productive frame, feeding the crop lines and returning through the same spatial system.", metric:"LOOP", value:"RECIRCULATING" },
  { key:"root", no:"02", label:"ROOTS", note:"living network", title:"Grow", emphasis:"networks.", body:"One living system expands through the greenhouse. Primary roots carry the network; secondary and tertiary branches search, adapt and connect the productive surface.", metric:"BIO LAYER", value:"GROWING" },
  { key:"light", no:"03", label:"LIGHT", note:"solar path", title:"Tune", emphasis:"conditions.", body:"The greenhouse is read as a solar instrument. A clear east–south–west parabola shows the sun angle, roof incidence and the changing shadow field across the productive floor.", metric:"SOLAR PATH", value:"RESPONSIVE" },
  { key:"air", no:"04", label:"AIR", note:"cross flow", title:"Move", emphasis:"climate.", body:"Cool air enters low, accelerates through the productive volume and leaves through the warmer upper zone. Flow becomes a spatial section rather than an invisible technical note.", metric:"VENTILATION", value:"CROSS-FLOW" },
  { key:"structure", no:"05", label:"STRUCTURE", note:"area / module", title:"Measure", emphasis:"the frame.", body:"The productive envelope resolves into bays, roof frames, floor surface and measured spans. Structure is shown as a buildable system with area, level and section information.", metric:"MODULE", value:"4.80 × 7.20 m" },
];

const clamp01 = (v:number) => Math.max(0,Math.min(1,v));
const ease = (v:number) => { const x=clamp01(v); return x*x*(3-2*x); };
const pseudo = (n:number) => (Math.sin(n*91.173 + 17.31)*43758.5453)%1;

function buildRoots(): RootBranch[] {
  const branches: RootBranch[] = [];
  const add = (x0:number,y0:number,angle:number,length:number,level:number,delay:number,seed:number) => {
    const bend = (pseudo(seed+2.1)-.5)*.7;
    const x1=x0+Math.cos(angle)*length;
    const y1=y0+Math.sin(angle)*length;
    const cx=x0+Math.cos(angle+bend)*length*.52;
    const cy=y0+Math.sin(angle+bend)*length*.52;
    branches.push({x0,y0,cx,cy,x1,y1,level,delay,width:Math.max(.28,2.4-level*.58),seed});
    if(level>=3) return;
    const children = level===0 ? 3 : 2;
    for(let i=0;i<children;i+=1){
      const spread=(i-(children-1)/2)*(.55-level*.07)+(pseudo(seed+i*3.7)-.5)*.28;
      add(x1,y1,angle+spread,length*(.64+(pseudo(seed+i+5)+1)*.06),level+1,delay+.16+level*.09+i*.035,seed*1.71+i*7.13+3);
    }
  };
  const originX=.61, originY=.43;
  const majors=[1.12,1.30,1.48,1.66,1.84,2.04];
  majors.forEach((angle,i)=>add(originX,originY,angle,.22+(i%2)*.035,0,i*.06,13+i*9));
  add(originX,originY,Math.PI/2,.34,0,.02,77);
  add(originX-.012,originY+.035,2.16,.27,0,.09,103);
  return branches;
}

export default function UrbanSystemFlow(){
  const [stage,setStage]=useState<Stage>("water");
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const stageRef=useRef(stage);
  stageRef.current=stage;
  const roots=useMemo(buildRoots,[]);

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas) return;
    const ctx=canvas.getContext("2d");
    if(!ctx) return;
    const compact=window.matchMedia("(max-width:760px)").matches;
    const reduced=window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    let width=1,height=1,raf=0,t=0,activeStage:Stage=stageRef.current,entered=0;
    const pointer={x:.62,y:.48,tx:.62,ty:.48,active:false};
    const particles=Array.from({length:compact?78:180},(_,i)=>({seed:(i*.618033)%1,offset:i/(compact?78:180),lane:(i*37%100)/100,size:.35+(i*29%100)/100*.9}));

    const resize=()=>{
      const r=canvas.getBoundingClientRect(); width=Math.max(1,r.width); height=Math.max(1,r.height);
      const dpr=Math.min(window.devicePixelRatio||1,compact?1.25:1.75);
      canvas.width=Math.round(width*dpr); canvas.height=Math.round(height*dpr); ctx.setTransform(dpr,0,0,dpr,0,0);
    };
    const onMove=(event:PointerEvent)=>{
      const r=canvas.getBoundingClientRect();
      pointer.active=event.clientX>=r.left&&event.clientX<=r.right&&event.clientY>=r.top&&event.clientY<=r.bottom;
      if(pointer.active){pointer.tx=(event.clientX-r.left)/Math.max(1,r.width);pointer.ty=(event.clientY-r.top)/Math.max(1,r.height);}
    };
    const ro=new ResizeObserver(resize);ro.observe(canvas);resize();window.addEventListener("pointermove",onMove,{passive:true});

    const line=(x1:number,y1:number,x2:number,y2:number,color:string,lw=.7)=>{ctx.strokeStyle=color;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();};

    const greenhousePoints=()=>{
      const cx=width*(compact?.53:.64); const frontW=width*(compact?.72:.47); const backShiftX=-frontW*.17; const backShiftY=-height*.09;
      const baseY=height*(compact?.72:.75); const eaveY=height*(compact?.43:.45); const ridgeY=height*(compact?.27:.25);
      const left=cx-frontW/2,right=cx+frontW/2,peak=cx;
      const front={lb:[left,baseY] as const,rb:[right,baseY] as const,le:[left,eaveY] as const,re:[right,eaveY] as const,p:[peak,ridgeY] as const};
      const shift=([x,y]:readonly[number,number])=>[x+backShiftX,y+backShiftY] as const;
      const back={lb:shift(front.lb),rb:shift(front.rb),le:shift(front.le),re:shift(front.re),p:shift(front.p)};
      return {front,back,cx,frontW,baseY,eaveY,ridgeY};
    };

    const drawGreenhouse=(focus:Stage,reveal=1)=>{
      const {front:f,back:b}=greenhousePoints();
      const base=focus==="structure"?.22:.075;
      const warm=focus==="structure"?.35:.11;
      ctx.save();ctx.globalCompositeOperation="lighter";
      const frame=(a:readonly[number,number],c:readonly[number,number],strong=false)=>line(a[0],a[1],c[0],c[1],`rgba(${strong?"214,194,143":"231,223,207"},${(strong?warm:base)*reveal})`,strong?1.15:.65);
      [[f.lb,f.le],[f.le,f.p],[f.p,f.re],[f.re,f.rb],[f.lb,f.rb],[b.lb,b.le],[b.le,b.p],[b.p,b.re],[b.re,b.rb],[b.lb,b.rb],[f.lb,b.lb],[f.rb,b.rb],[f.le,b.le],[f.re,b.re],[f.p,b.p]].forEach(([a,c],i)=>frame(a,c,focus==="structure"&&(i<5||i===14)));
      for(let bay=1;bay<=5;bay+=1){
        const q=bay/6; const interp=(a:readonly[number,number],c:readonly[number,number])=>[a[0]+(c[0]-a[0])*q,a[1]+(c[1]-a[1])*q] as const;
        const lb=interp(f.lb,b.lb), rb=interp(f.rb,b.rb), le=interp(f.le,b.le), re=interp(f.re,b.re), p=interp(f.p,b.p);
        frame(lb,le,focus==="structure"&&bay%2===0);frame(le,p,false);frame(p,re,false);frame(re,rb,false);
      }
      // transparent panel mesh
      ctx.strokeStyle=`rgba(126,171,186,${(focus==="light"?.095:.032)*reveal})`;ctx.lineWidth=.45;
      for(let i=1;i<8;i+=1){const q=i/8;line(f.le[0]+(f.p[0]-f.le[0])*q,f.le[1]+(f.p[1]-f.le[1])*q,b.le[0]+(b.p[0]-b.le[0])*q,b.le[1]+(b.p[1]-b.le[1])*q,ctx.strokeStyle,.45);}
      // perspective floor mesh
      for(let i=0;i<=6;i+=1){const q=i/6;const x1=f.lb[0]+(f.rb[0]-f.lb[0])*q;const x2=b.lb[0]+(b.rb[0]-b.lb[0])*q;line(x1,f.lb[1],x2,b.lb[1],`rgba(156,171,148,${.028*reveal})`,.45);}
      for(let i=1;i<=5;i+=1){const q=i/6;line(f.lb[0]+(b.lb[0]-f.lb[0])*q,f.lb[1]+(b.lb[1]-f.lb[1])*q,f.rb[0]+(b.rb[0]-f.rb[0])*q,f.rb[1]+(b.rb[1]-f.rb[1])*q,`rgba(156,171,148,${.028*reveal})`,.45);}
      ctx.restore();
    };

    const drawWater=(age:number)=>{
      const r=ease(age/.75),g=greenhousePoints();
      const x0=g.front.lb[0]-width*.02,x1=g.front.rb[0]+width*.02;
      for(let lane=0;lane<8;lane+=1){ctx.beginPath();for(let i=0;i<=110;i+=1){const p=i/110;const x=x0+(x1-x0)*p;const y=g.eaveY+height*(.055+lane*.032)+Math.sin(p*10+t*.8+lane)*height*.006;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.strokeStyle=`rgba(126,171,186,${(.06+lane%3*.018)*r})`;ctx.lineWidth=lane%3===0?1.1:.55;ctx.stroke();}
      particles.forEach(p=>{const u=(p.offset+age*(.025+p.seed*.026))%1;const x=x0+(x1-x0)*u;const lane=Math.floor(p.lane*8)%8;const y=g.eaveY+height*(.055+lane*.032)+Math.sin(u*10+t*.8+lane)*height*.006;ctx.fillStyle=`rgba(160,211,228,${.72*r})`;ctx.beginPath();ctx.ellipse(x,y,p.size*1.3,p.size*.5,0,0,Math.PI*2);ctx.fill();});
      ctx.font=`${compact?6:7}px ui-monospace,monospace`;ctx.fillStyle=`rgba(126,171,186,${.6*r})`;ctx.fillText("NUTRIENT SUPPLY",x0,g.eaveY+height*.028);ctx.fillText("RETURN / RECIRCULATE",x1-(compact?105:128),g.eaveY+height*.33);
    };

    const pointQuad=(u:number,b:RootBranch)=>{const v=1-u;return [v*v*b.x0+2*v*u*b.cx+u*u*b.x1,v*v*b.y0+2*v*u*b.cy+u*u*b.y1] as const;};
    const drawRoots=(age:number)=>{
      const reveal=reduced?1:ease(age/3.8); const g=greenhousePoints();
      ctx.save();ctx.globalCompositeOperation="lighter";ctx.lineCap="round";ctx.lineJoin="round";
      roots.forEach((b,index)=>{
        const local=ease((reveal-b.delay)/(1-b.delay)); if(local<=0)return;
        const segments=36;ctx.beginPath();
        for(let i=0;i<=segments;i+=1){const u=(i/segments)*local;const [nx,ny]=pointQuad(u,b);const x=g.front.lb[0]+nx*(g.front.rb[0]-g.front.lb[0]);const y=g.ridgeY+ny*(height*.72);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}        
        const alpha=.09+(1-b.level/4)*.28;ctx.strokeStyle=`rgba(145,190,134,${alpha})`;ctx.lineWidth=Math.max(.45,b.width*(compact?.78:1.12));ctx.shadowColor="rgba(118,185,119,.26)";ctx.shadowBlur=8+b.width*4;ctx.stroke();ctx.shadowBlur=0;
        if(index%4===0&&local>.25){const u=(t*.08+b.seed)%Math.max(.28,local);const [nx,ny]=pointQuad(u,b);const x=g.front.lb[0]+nx*(g.front.rb[0]-g.front.lb[0]);const y=g.ridgeY+ny*(height*.72);const glow=ctx.createRadialGradient(x,y,0,x,y,compact?7:12);glow.addColorStop(0,"rgba(185,235,166,.5)");glow.addColorStop(1,"rgba(120,190,115,0)");ctx.fillStyle=glow;ctx.beginPath();ctx.arc(x,y,compact?7:12,0,Math.PI*2);ctx.fill();}
      });
      const ox=g.front.lb[0]+.61*(g.front.rb[0]-g.front.lb[0]);const oy=g.ridgeY+.43*(height*.72);const core=ctx.createRadialGradient(ox,oy,0,ox,oy,compact?36:62);core.addColorStop(0,"rgba(156,205,143,.18)");core.addColorStop(1,"rgba(156,171,148,0)");ctx.fillStyle=core;ctx.beginPath();ctx.arc(ox,oy,compact?36:62,0,Math.PI*2);ctx.fill();
      ctx.restore();
    };

    const drawLight=(age:number)=>{
      const r=ease(age/.7),g=greenhousePoints();const shift=pointer.active?(pointer.x-.5)*.08:0;const day=clamp01((reduced?.52:.06+(age*.052)% .88)+shift);
      const x0=width*.055,x1=width*.94,base=height*.61,apex=height*.075;
      ctx.save();ctx.globalCompositeOperation="lighter";ctx.setLineDash([5,7]);ctx.strokeStyle=`rgba(214,194,143,${.3*r})`;ctx.lineWidth=1.15;ctx.beginPath();for(let i=0;i<=130;i+=1){const u=i/130,x=x0+(x1-x0)*u,y=base-Math.sin(u*Math.PI)*(base-apex);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();ctx.setLineDash([]);
      const sx=x0+(x1-x0)*day,sy=base-Math.sin(day*Math.PI)*(base-apex),sr=compact?19:34,halo=Math.min(width,height)*(compact?.2:.31);const grad=ctx.createRadialGradient(sx,sy,0,sx,sy,halo);grad.addColorStop(0,`rgba(255,229,174,${.42*r})`);grad.addColorStop(.12,`rgba(214,194,143,${.17*r})`);grad.addColorStop(1,"rgba(214,194,143,0)");ctx.fillStyle=grad;ctx.beginPath();ctx.arc(sx,sy,halo,0,Math.PI*2);ctx.fill();ctx.fillStyle=`rgba(255,233,188,${.94*r})`;ctx.beginPath();ctx.arc(sx,sy,sr,0,Math.PI*2);ctx.fill();ctx.strokeStyle=`rgba(255,233,188,${.38*r})`;ctx.beginPath();ctx.arc(sx,sy,sr+10,0,Math.PI*2);ctx.stroke();
      [g.front.le,g.front.p,g.front.re,g.back.p].forEach((pt,i)=>{ctx.strokeStyle=`rgba(214,194,143,${(.055+i*.012)*r})`;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(pt[0],pt[1]);ctx.stroke();const dx=(pt[0]-sx)*.22,dy=(pt[1]-sy)*.22;ctx.strokeStyle=`rgba(45,58,64,${.16*r})`;ctx.beginPath();ctx.moveTo(pt[0],pt[1]);ctx.lineTo(pt[0]+dx,pt[1]+dy);ctx.stroke();});
      ctx.font=`${compact?6:8}px ui-monospace,monospace`;ctx.fillStyle=`rgba(214,194,143,${.72*r})`;ctx.fillText("E / 08:00",x0,base+18);ctx.fillText("S / 12:00",width*.48,apex-10);ctx.fillText("W / 18:00",x1-55,base+18);ctx.fillText(`SOLAR ALT / ${Math.round(Math.sin(day*Math.PI)*68)}°`,Math.min(width-120,sx+sr+12),Math.max(18,sy-12));ctx.restore();
    };

    const drawAir=(age:number)=>{
      const r=ease(age/.65),g=greenhousePoints();const left=g.front.lb[0]-width*.12,right=g.front.rb[0]+width*.14;
      ctx.save();ctx.globalCompositeOperation="lighter";
      const lanes=compact?12:20;for(let lane=0;lane<lanes;lane+=1){ctx.beginPath();for(let i=0;i<=110;i+=1){const u=i/110,x=left+(right-left)*u;const center=g.eaveY+height*(.04+lane*(.26/lanes));const lift=Math.sin(u*Math.PI)*height*(-.07-lane*.0015);const y=center+lift+Math.sin(u*9+t*.75+lane*.67)*height*.008;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.strokeStyle=`rgba(183,199,227,${(.025+lane%5*.009)*r})`;ctx.lineWidth=lane%5===0?.9:.4;ctx.stroke();}
      particles.forEach((p,index)=>{const lane=index%lanes,u=(p.offset+age*(.03+p.seed*.035))%1,x=left+(right-left)*u,center=g.eaveY+height*(.04+lane*(.26/lanes)),y=center+Math.sin(u*Math.PI)*height*(-.07-lane*.0015)+Math.sin(u*9+t*.75+lane*.67)*height*.008;ctx.strokeStyle=`rgba(210,224,245,${.12*r})`;ctx.beginPath();ctx.moveTo(x-(8+p.size*7),y);ctx.lineTo(x,y);ctx.stroke();ctx.fillStyle=`rgba(218,229,248,${(.3+p.seed*.38)*r})`;ctx.beginPath();ctx.arc(x,y,p.size*.55,0,Math.PI*2);ctx.fill();});
      const vx=g.front.p[0],vy=g.front.p[1];for(let ring=0;ring<4;ring+=1){ctx.strokeStyle=`rgba(183,199,227,${(.12-ring*.02)*r})`;ctx.beginPath();ctx.ellipse(vx,vy,40+ring*24,13+ring*8,t*.04,0,Math.PI*2);ctx.stroke();}
      ctx.font=`${compact?6:7}px ui-monospace,monospace`;ctx.fillStyle=`rgba(183,199,227,${.65*r})`;ctx.fillText("COOL AIR / INLET",left,g.baseY+18);ctx.fillText("WARM AIR / RIDGE EXHAUST",Math.min(width-155,vx+32),vy-16);ctx.restore();
    };

    const dimension=(x1:number,y1:number,x2:number,y2:number,label:string,a:number)=>{const dx=x2-x1,dy=y2-y1,l=Math.max(1,Math.hypot(dx,dy)),nx=-dy/l,ny=dx/l;line(x1,y1,x2,y2,`rgba(231,223,207,${a})`,.7);[0,1].forEach(k=>{const x=k?x2:x1,y=k?y2:y1;line(x-nx*5,y-ny*5,x+nx*5,y+ny*5,`rgba(231,223,207,${a*1.4})`,.7);});ctx.font=`${compact?6:7}px ui-monospace,monospace`;ctx.fillStyle=`rgba(231,223,207,${Math.min(.68,a*3)})`;ctx.fillText(label,(x1+x2)/2+nx*12,(y1+y2)/2+ny*12);};
    const drawStructure=(age:number)=>{
      const r=ease(age/1.1),g=greenhousePoints();ctx.save();ctx.globalCompositeOperation="lighter";
      const floor=[g.front.lb,g.front.rb,g.back.rb,g.back.lb] as const;ctx.fillStyle=`rgba(156,171,148,${.045*r})`;ctx.strokeStyle=`rgba(156,171,148,${.26*r})`;ctx.beginPath();floor.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();ctx.stroke();
      // hatch productive surface
      for(let i=0;i<11;i+=1){const u=i/10;const ax=g.front.lb[0]+(g.front.rb[0]-g.front.lb[0])*u,ay=g.front.lb[1],bx=g.back.lb[0]+(g.back.rb[0]-g.back.lb[0])*u,by=g.back.lb[1];line(ax,ay,bx,by,`rgba(156,171,148,${.08*r})`,.45);}
      dimension(g.front.lb[0],g.front.lb[1]+height*.075,g.front.rb[0],g.front.rb[1]+height*.075,"SPAN / 4 800 mm",.2*r);dimension(g.front.rb[0]+width*.04,g.front.rb[1],g.front.re[0]+width*.04,g.front.re[1],"EAVE / 2 400 mm",.18*r);dimension(g.front.lb[0],g.baseY+height*.13,g.back.lb[0],g.back.lb[1]+height*.13,"BAY DEPTH / 7 200 mm",.16*r);
      ctx.font=`${compact?6:8}px ui-monospace,monospace`;ctx.fillStyle=`rgba(214,194,143,${.72*r})`;ctx.fillText("GROW SURFACE / 34.56 m²",g.front.lb[0]+15,g.baseY-height*.035);ctx.fillText("±0.000 / FFL",g.front.lb[0],g.baseY+height*.035);ctx.fillText("+2.400 / EAVE",g.front.re[0]+8,g.front.re[1]);ctx.fillText("+3.650 / RIDGE",g.front.p[0]+10,g.front.p[1]);ctx.fillText("SECTION A—A / 1:50",g.back.le[0],g.back.le[1]-12);
      ctx.restore();
    };

    const render=()=>{
      t+=reduced?0:.016;pointer.x+=(pointer.tx-pointer.x)*.06;pointer.y+=(pointer.ty-pointer.y)*.06;
      if(stageRef.current!==activeStage){activeStage=stageRef.current;entered=t;}
      const age=t-entered;ctx.clearRect(0,0,width,height);
      const gradient=ctx.createLinearGradient(0,0,width,height);gradient.addColorStop(0,"rgba(8,13,15,.12)");gradient.addColorStop(.55,"rgba(7,11,12,.02)");gradient.addColorStop(1,"rgba(12,17,17,.12)");ctx.fillStyle=gradient;ctx.fillRect(0,0,width,height);
      drawGreenhouse(activeStage,ease(age/.45));
      if(activeStage==="water")drawWater(age);if(activeStage==="root")drawRoots(age);if(activeStage==="light")drawLight(age);if(activeStage==="air")drawAir(age);if(activeStage==="structure")drawStructure(age);
      raf=requestAnimationFrame(render);
    };render();
    return()=>{cancelAnimationFrame(raf);ro.disconnect();window.removeEventListener("pointermove",onMove);};
  },[roots]);

  const current=stages.find(item=>item.key===stage)!;
  return <section className={`${styles.section} ${styles[stage]}`} aria-label="Urban Ponics bioclimatic model">
    <div className={styles.sticky}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div className={styles.top}><span>01 / URBAN PONICS / BIOCLIMATIC GREENHOUSE</span><span>LIVE MODEL / SELECT A SYSTEM</span></div>
      <div className={styles.copy}>
        <p>SYSTEM LAYER / {current.no}</p><h2>{current.title}<br/><em>{current.emphasis}</em></h2><span>{current.body}</span>
        <div className={styles.metric}><i/><div><small>{current.metric}</small><b>{current.value}</b></div></div>
      </div>
      <div className={styles.modelMeta}><span>GREENHOUSE / GH—01</span><b>WIREFRAME BIOCLIMATIC MODEL</b><small>4.80 × 7.20 m / PRODUCTIVE ENVELOPE</small></div>
      <div className={styles.controls}>{stages.map(item=><button type="button" key={item.key} className={stage===item.key?styles.active:undefined} onClick={()=>setStage(item.key)}><span>{item.no}</span><b>{item.label}</b><small>{item.note}</small></button>)}</div>
      <div className={styles.footer}><span>WATER → ROOTS → LIGHT → AIR → STRUCTURE</span><span>THE SYSTEM IS THE ARCHITECTURE</span></div>
    </div>
  </section>;
}
