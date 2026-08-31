"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./UrbanSystemFlow.module.css";

type Stage = "water" | "root" | "light" | "air" | "structure";
type StageItem = { key: Stage; no: string; label: string; note: string; title: string; emphasis: string; body: string; metric: string; value: string };

type Particle = { seed: number; offset: number; lane: number; size: number };

const stages: StageItem[] = [
  { key: "water", no: "01", label: "WATER", note: "flow / nutrient", title: "Circulate", emphasis: "resources.", body: "Water moves through the productive frame as infrastructure and habitat at once: feeding crops, carrying nutrients and closing the distance between technical systems and the living surface.", metric: "LOOP", value: "RECIRCULATING" },
  { key: "root", no: "02", label: "ROOTS", note: "growth / network", title: "Grow", emphasis: "networks.", body: "The biological layer is designed as a spatial network. Roots, crops and support systems occupy the same modular logic as the architecture instead of sitting on top of it as decoration.", metric: "BIO LAYER", value: "ACTIVE" },
  { key: "light", no: "03", label: "LIGHT", note: "solar / climate", title: "Tune", emphasis: "conditions.", body: "Daylight and controlled illumination are treated as environmental inputs. Intensity, duration and shadow shape both productive performance and spatial atmosphere.", metric: "SOLAR PATH", value: "RESPONSIVE" },
  { key: "air", no: "04", label: "AIR", note: "flow / exchange", title: "Move", emphasis: "climate.", body: "Airflow crosses the greenhouse frame to regulate heat, humidity and exchange. The envelope is understood as a climatic interface rather than a sealed object.", metric: "VENTILATION", value: "CROSS-FLOW" },
  { key: "structure", no: "05", label: "STRUCTURE", note: "area / module", title: "Build", emphasis: "adaptability.", body: "A repeatable structural frame lets towers, channels, light and climate systems change scale while preserving a coherent technical and spatial language.", metric: "MODULE", value: "SCALABLE" },
];

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => value * value * (3 - 2 * value);

export default function UrbanSystemFlow() {
  const [stage, setStage] = useState<Stage>("water");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef(stage);
  stageRef.current = stage;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const compact = window.matchMedia("(max-width: 760px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0.58, y: 0.42, tx: 0.58, ty: 0.42, active: false };
    let width = 1;
    let height = 1;
    let raf = 0;
    let t = 0;
    let activeStage: Stage = stageRef.current;
    let stageEnteredAt = 0;

    const count = compact ? 72 : 156;
    const particles: Particle[] = Array.from({ length: count }, (_, i) => ({
      seed: (i * 0.6180339887) % 1,
      offset: i / count,
      lane: ((i * 37) % 100) / 100,
      size: 0.45 + ((i * 29) % 100) / 100 * 1.35,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, compact ? 1.2 : 1.7);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      pointer.active = inside;
      if (!inside) return;
      pointer.tx = (event.clientX - rect.left) / Math.max(1, rect.width);
      pointer.ty = (event.clientY - rect.top) / Math.max(1, rect.height);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    window.addEventListener("pointermove", onMove, { passive: true });

    const drawDatum = () => {
      ctx.lineWidth = 0.55;
      ctx.strokeStyle = "rgba(231,223,207,.035)";
      [0.12,0.28,0.45,0.62,0.79,0.9].forEach((x) => { ctx.beginPath(); ctx.moveTo(width*x,height*.1); ctx.lineTo(width*x,height*.84); ctx.stroke(); });
      [0.16,0.34,0.52,0.7,0.82].forEach((y) => { ctx.beginPath(); ctx.moveTo(width*.07,height*y); ctx.lineTo(width*.94,height*y); ctx.stroke(); });
    };

    const drawWater = (age: number) => {
      const reveal = smooth(clamp01(age / .8));
      const lanes = compact ? 7 : 10;
      for (let lane = 0; lane < lanes; lane += 1) {
        ctx.beginPath();
        for (let i = 0; i <= 120; i += 1) {
          const p = i / 120;
          const x = width * (.08 + p * .84);
          const base = .19 + lane * (.55 / Math.max(1, lanes - 1));
          const y = height * (base + Math.sin(p*8.2 + t*.92 + lane*.8)*.016 + Math.sin(p*22 + lane)*.003);
          if (i === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        ctx.strokeStyle = `rgba(126,171,186,${(.055 + (lane%4)*.012)*reveal})`;
        ctx.lineWidth = lane % 3 === 0 ? 1.15 : .55;
        ctx.stroke();
      }
      particles.forEach((particle) => {
        const p = (particle.offset + age * (.028 + particle.seed*.028)) % 1;
        const x = width * (.08 + p*.84);
        const y = height * (.19 + particle.lane*.55 + Math.sin(p*10 + particle.seed*9 + t)*.014);
        const glowR = 6 + particle.size*4;
        const glow = ctx.createRadialGradient(x,y,0,x,y,glowR);
        glow.addColorStop(0,`rgba(126,171,186,${.28*reveal})`);
        glow.addColorStop(1,"rgba(126,171,186,0)");
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x,y,glowR,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = `rgba(160,207,222,${.72*reveal})`;
        ctx.beginPath(); ctx.ellipse(x,y,particle.size*1.1,particle.size*.48,0,0,Math.PI*2); ctx.fill();
      });
    };

    const pointOnQuadratic = (p: number, x0: number, y0: number, cx: number, cy: number, x1: number, y1: number) => {
      const inv = 1-p;
      return [inv*inv*x0 + 2*inv*p*cx + p*p*x1, inv*inv*y0 + 2*inv*p*cy + p*p*y1] as const;
    };

    const drawQuadratic = (x0:number,y0:number,cx:number,cy:number,x1:number,y1:number,progress:number,alpha:number,lineWidth:number) => {
      const visible = clamp01(progress);
      if (visible <= 0) return;
      const segments = 34;
      ctx.beginPath(); ctx.moveTo(x0,y0);
      for (let i=1;i<=segments;i+=1) {
        const p = (i/segments)*visible;
        const [x,y] = pointOnQuadratic(p,x0,y0,cx,cy,x1,y1);
        ctx.lineTo(x,y);
      }
      ctx.strokeStyle=`rgba(156,171,148,${alpha})`; ctx.lineWidth=lineWidth; ctx.stroke();
    };

    const drawRoots = (age: number) => {
      const growth = reduced ? 1 : smooth(clamp01(age/3.2));
      const anchors = [0.2,0.34,0.49,0.64,0.79];
      anchors.forEach((ax,index) => {
        const x0 = width*ax;
        const y0 = height*(.29 + (index%2)*.035);
        const trunkProgress = clamp01(growth*1.22 - index*.025);
        const trunkEndX = x0 + width*(index%2 ? -.012 : .012);
        const trunkEndY = height*.76;
        drawQuadratic(x0,y0,x0 + Math.sin(index)*width*.025,height*.5,trunkEndX,trunkEndY,trunkProgress,.18 + trunkProgress*.32,1.25);

        for (let branch=0; branch<15; branch+=1) {
          const branchOriginP = .16 + (branch/15)*.7;
          const generation = clamp01((growth - branchOriginP*.62)*2.2);
          if (generation <= 0) continue;
          const [bx,by] = pointOnQuadratic(branchOriginP,x0,y0,x0 + Math.sin(index)*width*.025,height*.5,trunkEndX,trunkEndY);
          const side = branch%2 ? -1 : 1;
          const spread = width*(.028 + (branch%5)*.009);
          const depth = height*(.04 + (branch%4)*.012);
          const ex = bx + side*spread;
          const ey = by + depth;
          drawQuadratic(bx,by,bx + side*spread*.42,by+depth*.24,ex,ey,generation,.1 + generation*.24,.72);

          if (generation > .55) {
            const secondary = clamp01((generation-.55)/.45);
            const side2 = -side;
            const ex2 = ex + side2*spread*.48;
            const ey2 = ey + depth*.58;
            drawQuadratic(ex,ey,ex + side2*spread*.18,ey+depth*.24,ex2,ey2,secondary,.08 + secondary*.17,.44);
          }
          if (generation > .92) {
            const glow = ctx.createRadialGradient(ex,ey,0,ex,ey,compact?7:11);
            glow.addColorStop(0,"rgba(156,171,148,.34)"); glow.addColorStop(1,"rgba(156,171,148,0)");
            ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(ex,ey,compact?7:11,0,Math.PI*2); ctx.fill();
          }
        }
        ctx.fillStyle=`rgba(156,171,148,${.35 + trunkProgress*.45})`;
        ctx.beginPath(); ctx.arc(x0,y0,compact?2.3:3.2,0,Math.PI*2); ctx.fill();
      });
    };

    const drawLight = (age: number) => {
      const reveal = smooth(clamp01(age/.8));
      const pointerShift = pointer.active ? (pointer.x-.5)*.12 : 0;
      const day = clamp01((reduced ? .54 : .08 + (age*.045)% .84) + pointerShift);
      const arcX0 = width*.08;
      const arcX1 = width*.92;
      const baseline = height*.59;
      const apex = height*.105;

      ctx.save();
      ctx.strokeStyle=`rgba(214,194,143,${.23*reveal})`; ctx.lineWidth=1.1; ctx.setLineDash([5,7]);
      ctx.beginPath();
      for(let i=0;i<=120;i+=1){const p=i/120;const x=arcX0+(arcX1-arcX0)*p;const y=baseline-Math.sin(p*Math.PI)*(baseline-apex);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();ctx.setLineDash([]);

      const sunX = arcX0 + (arcX1-arcX0)*day;
      const sunY = baseline - Math.sin(day*Math.PI)*(baseline-apex);
      const sunRadius = compact ? 13 : 22;
      const haloRadius = Math.min(width,height)*(compact?.16:.24);
      const halo=ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,haloRadius);
      halo.addColorStop(0,`rgba(255,228,171,${.4*reveal})`);halo.addColorStop(.16,`rgba(214,194,143,${.17*reveal})`);halo.addColorStop(1,"rgba(214,194,143,0)");
      ctx.fillStyle=halo;ctx.beginPath();ctx.arc(sunX,sunY,haloRadius,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=`rgba(255,232,181,${.94*reveal})`;ctx.beginPath();ctx.arc(sunX,sunY,sunRadius,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle=`rgba(255,232,181,${.42*reveal})`;ctx.beginPath();ctx.arc(sunX,sunY,sunRadius+7,0,Math.PI*2);ctx.stroke();

      [0.22,0.36,0.5,0.64,0.78].forEach((tx,i)=>{const x=width*tx;const y=height*(.66+(i%2)*.025);ctx.strokeStyle=`rgba(214,194,143,${(.055+(i%3)*.018)*reveal})`;ctx.beginPath();ctx.moveTo(sunX,sunY);ctx.lineTo(x,y);ctx.stroke();const shadowScale=.22;ctx.strokeStyle=`rgba(74,91,101,${.12*reveal})`;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(x-sunX)*shadowScale,y+(y-sunY)*shadowScale);ctx.stroke();});

      ctx.font=`${compact?6:8}px ui-monospace,SFMono-Regular,Menlo,monospace`;ctx.fillStyle=`rgba(214,194,143,${.68*reveal})`;
      ctx.fillText("E / 08:00",width*.075,height*.625);ctx.fillText("S / 12:00",width*.475,height*.085);ctx.fillText("W / 18:00",width*.84,height*.625);
      ctx.fillText(`SUN ALT / ${Math.round(Math.sin(day*Math.PI)*68)}°`,Math.min(width-115,sunX+sunRadius+9),Math.max(18,sunY-10));
      ctx.restore();
    };

    const drawAir = (age: number) => {
      const reveal=smooth(clamp01(age/.7));
      const lanes=compact?10:16;
      for(let lane=0;lane<lanes;lane+=1){ctx.beginPath();for(let i=0;i<=100;i+=1){const p=i/100;const x=width*(.055+p*.89);const base=.14+lane*(.68/Math.max(1,lanes-1));const vortex=Math.sin(p*7+t*.68+lane*.58)*.021+Math.sin(p*18+lane*1.3)*.005;const y=height*(base+vortex);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.strokeStyle=`rgba(183,199,227,${(.028+(lane%5)*.011)*reveal})`;ctx.lineWidth=lane%4===0?.95:.42;ctx.stroke();}
      particles.forEach((particle,index)=>{const lane=index%lanes;const speed=.025+particle.seed*.042;const p=(particle.offset+age*speed)%1;const x=width*(.055+p*.89);const base=.14+lane*(.68/Math.max(1,lanes-1));const y=height*(base+Math.sin(p*7+t*.68+lane*.58)*.021+Math.sin(p*19+particle.seed*11)*.006);const tail=5+particle.size*7;ctx.strokeStyle=`rgba(205,218,239,${.2*reveal})`;ctx.beginPath();ctx.moveTo(x-tail,y+Math.sin(p*11)*2);ctx.lineTo(x,y);ctx.stroke();ctx.fillStyle=`rgba(221,230,247,${(.38+particle.seed*.32)*reveal})`;ctx.beginPath();ctx.arc(x,y,particle.size*.64,0,Math.PI*2);ctx.fill();});
      ctx.font=`${compact?6:8}px ui-monospace,SFMono-Regular,Menlo,monospace`;ctx.fillStyle=`rgba(183,199,227,${.56*reveal})`;ctx.fillText("INLET / COOL AIR",width*.06,height*.105);ctx.fillText("CROSS VENTILATION / ΔP",width*.43,height*.12);ctx.fillText("EXHAUST / WARM AIR",width*.76,height*.86);
    };

    const drawDimension = (x1:number,y1:number,x2:number,y2:number,label:string,alpha:number) => {ctx.strokeStyle=`rgba(231,223,207,${alpha})`;ctx.fillStyle=`rgba(231,223,207,${Math.min(.62,alpha*2.5)})`;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();const dx=x2-x1;const dy=y2-y1;const len=Math.max(1,Math.hypot(dx,dy));const nx=-dy/len;const ny=dx/len;[0,1].forEach(end=>{const x=end?x2:x1;const y=end?y2:y1;ctx.beginPath();ctx.moveTo(x-nx*5,y-ny*5);ctx.lineTo(x+nx*5,y+ny*5);ctx.stroke();});ctx.font=`${compact?6:8}px ui-monospace,SFMono-Regular,Menlo,monospace`;ctx.fillText(label,(x1+x2)*.5+nx*12,(y1+y2)*.5+ny*12);};

    const drawStructure = (age:number) => {
      const reveal=smooth(clamp01(age/1.6));
      const xA=width*.13,xB=width*.86,yA=height*.16,yB=height*.72;
      ctx.strokeStyle=`rgba(231,223,207,${.19*reveal})`;ctx.lineWidth=.9;
      const horizontal = clamp01(reveal*1.35);ctx.beginPath();ctx.moveTo(xA,yA);ctx.lineTo(xA+(xB-xA)*horizontal,yA);ctx.stroke();ctx.beginPath();ctx.moveTo(xA,yB);ctx.lineTo(xA+(xB-xA)*horizontal,yB);ctx.stroke();
      [0.13,.31,.49,.67,.86].forEach((x,i)=>{const local=clamp01(reveal*1.55-i*.08);ctx.beginPath();ctx.moveTo(width*x,yB);ctx.lineTo(width*x,yB-(yB-yA)*local);ctx.stroke();});
      ctx.strokeStyle=`rgba(214,194,143,${.25*reveal})`;[[.13,.16,.31,.72],[.31,.72,.49,.16],[.49,.16,.67,.72],[.67,.72,.86,.16]].forEach(([x1,y1,x2,y2])=>{ctx.beginPath();ctx.moveTo(width*x1,height*y1);ctx.lineTo(width*x2,height*y2);ctx.stroke();});
      const surface=[[width*.24,height*.39],[width*.71,height*.39],[width*.79,height*.61],[width*.2,height*.61]] as const;ctx.fillStyle=`rgba(156,171,148,${.055*reveal})`;ctx.strokeStyle=`rgba(156,171,148,${.24*reveal})`;ctx.beginPath();surface.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();ctx.stroke();
      drawDimension(width*.13,height*.79,width*.86,height*.79,"OVERALL / 4 800 mm",.22*reveal);drawDimension(width*.9,height*.16,width*.9,height*.72,"HEIGHT / 2 400 mm",.2*reveal);drawDimension(width*.24,height*.65,width*.79,height*.65,"PRODUCTIVE SURFACE / 36.8 m²",.19*reveal);
      ctx.font=`${compact?6:8}px ui-monospace,SFMono-Regular,Menlo,monospace`;ctx.fillStyle=`rgba(214,194,143,${.62*reveal})`;ctx.fillText("MODULE / 01",width*.13,height*.13);ctx.fillText("+2.400 / TOP BEAM",width*.69,height*.145);ctx.fillText("±0.000 / FFL",width*.13,height*.745);ctx.fillText("SECTION A—A / 1:50",width*.64,height*.755);ctx.fillStyle=`rgba(231,223,207,${.38*reveal})`;ctx.fillText("STRUCTURAL BAY / 12.4 m²",width*.29,height*.36);ctx.fillText("GROW AREA / 36.8 m²",width*.48,height*.585);
    };

    const render = () => {
      t += reduced ? 0 : .016;
      pointer.x += (pointer.tx-pointer.x)*.065; pointer.y += (pointer.ty-pointer.y)*.065;
      const requested=stageRef.current;if(requested!==activeStage){activeStage=requested;stageEnteredAt=t;}const age=t-stageEnteredAt;
      ctx.clearRect(0,0,width,height);drawDatum();ctx.save();ctx.globalCompositeOperation="lighter";
      if(activeStage==="water")drawWater(age);if(activeStage==="root")drawRoots(age);if(activeStage==="light")drawLight(age);if(activeStage==="air")drawAir(age);if(activeStage==="structure")drawStructure(age);ctx.restore();raf=requestAnimationFrame(render);
    };
    render();
    return()=>{cancelAnimationFrame(raf);ro.disconnect();window.removeEventListener("pointermove",onMove);};
  },[]);

  const current=stages.find(item=>item.key===stage)!;
  return (
    <section className={`${styles.section} ${styles[stage]}`} aria-label="Urban Ponics bioclimatic model">
      <div className={styles.sticky}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        <div className={styles.top}><span>01 / BIOCLIMATIC MODEL / PRODUCTIVE LANDSCAPE</span><span>SELECT A SYSTEM / MOVE THROUGH THE FIELD</span></div>
        <div className={styles.copy}><p>URBAN PONICS / SYSTEM LAYER {current.no}</p><h2>{current.title}<br /><em>{current.emphasis}</em></h2><span>{current.body}</span><div className={styles.metric}><i /><div><small>{current.metric}</small><b>{current.value}</b></div></div></div>
        <div className={styles.rig} aria-hidden="true"><div className={styles.frameA}><i /><i /><i /><i /><b /><b /></div><div className={styles.growColumns}><span /><span /><span /><span /></div><div className={styles.channels}><i /><i /><i /><i /><i /></div><div className={styles.lightBars}><b /><b /><b /></div><div className={styles.airPaths}><i /><i /><i /></div><div className={styles.cropNodes}>{Array.from({length:16}).map((_,index)=><i key={index}/>)}</div><div className={styles.dimensions}><span>4 800</span><span>2 400</span><b>±0.000</b></div><div className={styles.sectionMark}><span>A</span><i /><b>SECTION A—A</b><i /><span>A</span></div><div className={styles.surface}><span>GROW AREA</span><b>36.8 m²</b></div></div>
        <div className={styles.controls}>{stages.map(item=><button type="button" key={item.key} className={stage===item.key?styles.active:undefined} onClick={()=>setStage(item.key)}><span>{item.no}</span><b>{item.label}</b><small>{item.note}</small></button>)}</div>
        <div className={styles.footer}><span>WATER → ROOTS → LIGHT → AIR → STRUCTURE</span><span>THE SYSTEM IS THE ARCHITECTURE</span></div>
      </div>
    </section>
  );
}
