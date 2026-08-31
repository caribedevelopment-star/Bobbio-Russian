"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./UrbanSystemFlow.module.css";

type Stage = "water" | "root" | "light" | "air" | "structure";

type StageItem = {
  key: Stage;
  no: string;
  label: string;
  note: string;
  title: string;
  emphasis: string;
  body: string;
  metric: string;
  value: string;
};

const stages: StageItem[] = [
  { key: "water", no: "01", label: "WATER", note: "flow / nutrient", title: "Circulate", emphasis: "resources.", body: "Water moves through the productive frame as infrastructure and habitat at once: feeding crops, carrying nutrients and closing the distance between technical systems and the living surface.", metric: "LOOP", value: "RECIRCULATING" },
  { key: "root", no: "02", label: "ROOTS", note: "growth / network", title: "Grow", emphasis: "networks.", body: "The biological layer is designed as a spatial network. Roots, crops and support systems occupy the same modular logic as the architecture instead of sitting on top of it as decoration.", metric: "BIO LAYER", value: "ACTIVE" },
  { key: "light", no: "03", label: "LIGHT", note: "energy / climate", title: "Tune", emphasis: "conditions.", body: "Daylight and controlled illumination are treated as environmental inputs. Intensity, duration and shadow shape both productive performance and spatial atmosphere.", metric: "PHOTOPERIOD", value: "TUNED" },
  { key: "air", no: "04", label: "AIR", note: "flow / exchange", title: "Move", emphasis: "climate.", body: "Airflow crosses the greenhouse frame to regulate heat, humidity and exchange. The envelope is understood as a climatic interface rather than a sealed object.", metric: "VENTILATION", value: "CROSS-FLOW" },
  { key: "structure", no: "05", label: "STRUCTURE", note: "module / scale", title: "Build", emphasis: "adaptability.", body: "A repeatable structural frame lets towers, channels, light and climate systems change scale while preserving a coherent technical and spatial language.", metric: "MODULE", value: "SCALABLE" },
];

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
    const pointer = { x: 0.62, y: 0.42, tx: 0.62, ty: 0.42, active: false };
    let width = 1;
    let height = 1;
    let raf = 0;
    let t = 0;

    const particles = Array.from({ length: compact ? 42 : 96 }, (_, i) => ({ seed: (i * 0.6180339887) % 1, offset: i / (compact ? 42 : 96), lane: ((i * 37) % 100) / 100 }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, compact ? 1.1 : 1.5);
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
      const xs = [0.17, 0.33, 0.5, 0.67, 0.83];
      const ys = [0.19, 0.36, 0.53, 0.7];
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = "rgba(231,223,207,.04)";
      xs.forEach((x) => { ctx.beginPath(); ctx.moveTo(width * x, height * 0.12); ctx.lineTo(width * x, height * 0.8); ctx.stroke(); });
      ys.forEach((y) => { ctx.beginPath(); ctx.moveTo(width * 0.11, height * y); ctx.lineTo(width * 0.91, height * y); ctx.stroke(); });
    };

    const drawWater = () => {
      for (let line = 0; line < 6; line += 1) {
        ctx.beginPath();
        for (let i = 0; i <= 90; i += 1) {
          const p = i / 90;
          const x = width * (0.14 + p * 0.74);
          const base = 0.25 + line * 0.075;
          const y = height * (base + Math.sin(p * 8 + t * 0.9 + line) * 0.013);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(126,171,186,${0.07 + line * 0.012})`;
        ctx.stroke();
      }
      particles.forEach((particle) => {
        const p = (particle.offset + t * 0.042 + particle.seed * 0.05) % 1;
        const x = width * (0.14 + p * 0.74);
        const y = height * (0.25 + particle.lane * 0.39 + Math.sin(p * 8 + particle.seed * 7 + t) * 0.012);
        ctx.fillStyle = "rgba(126,171,186,.68)";
        ctx.beginPath(); ctx.arc(x, y, 0.7 + particle.lane * 1.4, 0, Math.PI * 2); ctx.fill();
      });
    };

    const drawRoots = () => {
      [0.28, 0.42, 0.57, 0.72].forEach((ax, index) => {
        const baseX = width * ax;
        const baseY = height * (0.34 + (index % 2) * 0.055);
        for (let branch = 0; branch < 11; branch += 1) {
          const side = branch % 2 ? -1 : 1;
          const depth = 0.075 + branch * 0.009;
          const ex = baseX + width * side * (0.032 + (branch % 4) * 0.013);
          const ey = baseY + height * depth;
          const cx = baseX + width * side * 0.018;
          const cy = baseY + height * depth * 0.5;
          ctx.strokeStyle = `rgba(156,171,148,${0.075 + (branch % 4) * 0.018})`;
          ctx.beginPath(); ctx.moveTo(baseX, baseY); ctx.quadraticCurveTo(cx, cy, ex, ey); ctx.stroke();
          ctx.fillStyle = "rgba(156,171,148,.46)";
          ctx.beginPath(); ctx.arc(ex, ey, 1 + (branch % 3) * 0.35, 0, Math.PI * 2); ctx.fill();
        }
      });
    };

    const drawLight = () => {
      const x = width * (pointer.active ? pointer.x : 0.66);
      const y = height * (pointer.active ? pointer.y : 0.22);
      const glow = ctx.createRadialGradient(x, y, 0, x, y, Math.max(width, height) * 0.5);
      glow.addColorStop(0, "rgba(214,194,143,.17)");
      glow.addColorStop(0.33, "rgba(214,194,143,.052)");
      glow.addColorStop(1, "rgba(214,194,143,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < 11; i += 1) {
        const startX = width * (0.2 + i * 0.057);
        ctx.strokeStyle = `rgba(214,194,143,${0.035 + (i % 4) * 0.015})`;
        ctx.beginPath(); ctx.moveTo(startX, height * 0.13); ctx.lineTo(startX + width * 0.07, height * 0.7); ctx.stroke();
      }
    };

    const drawAir = () => {
      for (let lane = 0; lane < 9; lane += 1) {
        ctx.beginPath();
        for (let i = 0; i <= 70; i += 1) {
          const p = i / 70;
          const x = width * (0.12 + p * 0.78);
          const base = 0.22 + lane * 0.065;
          const y = height * (base + Math.sin(p * 6 + t * 0.55 + lane * 0.8) * 0.018 + Math.sin(p * 13 + lane) * 0.004);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(183,199,227,${0.04 + (lane % 3) * 0.018})`;
        ctx.stroke();
      }
    };

    const drawStructure = () => {
      const xA = width * 0.22;
      const xB = width * 0.79;
      const yA = height * 0.2;
      const yB = height * 0.68;
      ctx.strokeStyle = "rgba(231,223,207,.12)";
      ctx.lineWidth = 0.8;
      ctx.strokeRect(xA, yA, xB - xA, yB - yA);
      [0.36, 0.5, 0.64].forEach((x) => { ctx.beginPath(); ctx.moveTo(width * x, yA); ctx.lineTo(width * x, yB); ctx.stroke(); });
      ctx.strokeStyle = "rgba(214,194,143,.2)";
      ctx.beginPath(); ctx.moveTo(xA, yB); ctx.lineTo(width * 0.5, yA); ctx.lineTo(xB, yB); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(xA, yA); ctx.lineTo(width * 0.5, yB); ctx.lineTo(xB, yA); ctx.stroke();
    };

    const render = () => {
      t += reduced ? 0 : 0.016;
      pointer.x += (pointer.tx - pointer.x) * 0.065;
      pointer.y += (pointer.ty - pointer.y) * 0.065;
      ctx.clearRect(0, 0, width, height);
      drawDatum();
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const active = stageRef.current;
      if (active === "water") drawWater();
      if (active === "root") drawRoots();
      if (active === "light") drawLight();
      if (active === "air") drawAir();
      if (active === "structure") drawStructure();
      ctx.restore();
      raf = requestAnimationFrame(render);
    };
    render();

    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener("pointermove", onMove); };
  }, []);

  const current = stages.find((item) => item.key === stage)!;

  return (
    <section className={`${styles.section} ${styles[stage]}`} aria-label="Urban Ponics bioclimatic model">
      <div className={styles.sticky}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        <div className={styles.top}><span>01 / BIOCLIMATIC MODEL / PRODUCTIVE LANDSCAPE</span><span>SELECT A SYSTEM / MOVE THROUGH THE FIELD</span></div>

        <div className={styles.copy}>
          <p>URBAN PONICS / SYSTEM LAYER {current.no}</p>
          <h2>{current.title}<br /><em>{current.emphasis}</em></h2>
          <span>{current.body}</span>
          <div className={styles.metric}><i /><div><small>{current.metric}</small><b>{current.value}</b></div></div>
        </div>

        <div className={styles.rig} aria-hidden="true">
          <div className={styles.frameA}><i /><i /><i /><i /><b /><b /></div>
          <div className={styles.growColumns}><span /><span /><span /><span /></div>
          <div className={styles.channels}><i /><i /><i /><i /><i /></div>
          <div className={styles.lightBars}><b /><b /><b /></div>
          <div className={styles.airPaths}><i /><i /><i /></div>
          <div className={styles.cropNodes}>{Array.from({ length: 16 }).map((_, index) => <i key={index} />)}</div>
          <div className={styles.dimensions}><span>4 800</span><span>2 400</span><b>±0.000</b></div>
          <div className={styles.sectionMark}><span>A</span><i /><b>SECTION A—A</b><i /><span>A</span></div>
          <div className={styles.surface}><span>GROW AREA</span><b>36.8 m²</b></div>
        </div>

        <div className={styles.controls}>
          {stages.map((item) => (
            <button type="button" key={item.key} className={stage === item.key ? styles.active : undefined} onClick={() => setStage(item.key)}>
              <span>{item.no}</span><b>{item.label}</b><small>{item.note}</small>
            </button>
          ))}
        </div>

        <div className={styles.footer}><span>WATER → ROOTS → LIGHT → AIR → STRUCTURE</span><span>THE SYSTEM IS THE ARCHITECTURE</span></div>
      </div>
    </section>
  );
}
