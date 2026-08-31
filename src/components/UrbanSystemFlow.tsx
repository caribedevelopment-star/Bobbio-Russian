"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./UrbanSystemFlow.module.css";

type Stage = "water" | "root" | "light" | "structure";

const stages: Array<{ key: Stage; no: string; label: string; note: string; title: string; emphasis: string; body: string }> = [
  { key: "water", no: "01", label: "WATER", note: "flow / nutrient", title: "Circulate", emphasis: "resources.", body: "Water is an active spatial layer: moving through the productive frame, feeding crops and linking infrastructure with the living surface." },
  { key: "root", no: "02", label: "ROOT", note: "growth / network", title: "Grow", emphasis: "networks.", body: "Roots, crops and support systems expand through a modular logic. Biology is not decoration here; it is one of the project systems." },
  { key: "light", no: "03", label: "LIGHT", note: "energy / climate", title: "Tune", emphasis: "conditions.", body: "Natural and controlled light become environmental inputs. The productive architecture is tuned through intensity, rhythm and climate." },
  { key: "structure", no: "04", label: "STRUCTURE", note: "module / scale", title: "Build", emphasis: "adaptability.", body: "A repeatable frame allows greenhouse, tower and NFT components to change scale while preserving technical and spatial coherence." },
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
    const pointer = { x: 0.66, y: 0.45, active: false };
    let width = 1;
    let height = 1;
    let raf = 0;
    let t = 0;

    const particles = Array.from({ length: compact ? 36 : 72 }, (_, i) => ({ seed: (i * 0.6180339887) % 1, offset: i / (compact ? 36 : 72), lane: ((i * 37) % 100) / 100 }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, compact ? 1.15 : 1.55);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) { pointer.active = false; return; }
      pointer.active = true;
      pointer.x = (event.clientX - rect.left) / Math.max(1, rect.width);
      pointer.y = (event.clientY - rect.top) / Math.max(1, rect.height);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    window.addEventListener("pointermove", onMove, { passive: true });

    const drawDatum = () => {
      ctx.lineWidth = 0.7;
      ctx.strokeStyle = "rgba(231,223,207,.045)";
      const xs = [0.18, 0.34, 0.52, 0.7, 0.84];
      const ys = [0.2, 0.36, 0.54, 0.72];
      xs.forEach((x) => { ctx.beginPath(); ctx.moveTo(width * x, height * 0.13); ctx.lineTo(width * x, height * 0.78); ctx.stroke(); });
      ys.forEach((y) => { ctx.beginPath(); ctx.moveTo(width * 0.12, height * y); ctx.lineTo(width * 0.9, height * y); ctx.stroke(); });
    };

    const drawWater = () => {
      ctx.lineWidth = 1;
      for (let line = 0; line < 5; line++) {
        ctx.beginPath();
        for (let i = 0; i <= 80; i++) {
          const p = i / 80;
          const x = width * (0.15 + p * 0.72);
          const base = 0.28 + line * 0.09;
          const y = height * (base + Math.sin(p * 7.5 + t * 0.85 + line * 0.8) * 0.012);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(126,171,186,${0.07 + line * 0.012})`;
        ctx.stroke();
      }
      particles.forEach((particle) => {
        const p = (particle.offset + t * 0.04 + particle.seed * 0.04) % 1;
        const x = width * (0.15 + p * 0.72);
        const y = height * (0.27 + particle.lane * 0.38 + Math.sin(p * 8 + particle.seed * 8 + t) * 0.01);
        ctx.fillStyle = "rgba(126,171,186,.66)";
        ctx.beginPath(); ctx.arc(x, y, 0.8 + particle.lane * 1.15, 0, Math.PI * 2); ctx.fill();
      });
    };

    const drawRoot = () => {
      const anchors = [0.3, 0.44, 0.58, 0.72];
      anchors.forEach((ax, index) => {
        const baseX = width * ax;
        const baseY = height * (0.34 + (index % 2) * 0.08);
        for (let branch = 0; branch < 9; branch++) {
          const side = branch % 2 ? -1 : 1;
          const depth = 0.09 + branch * 0.008;
          const ex = baseX + width * side * (0.035 + (branch % 4) * 0.012);
          const ey = baseY + height * depth;
          const cx = baseX + width * side * 0.018;
          const cy = baseY + height * depth * 0.48;
          ctx.strokeStyle = `rgba(156,171,148,${0.08 + (branch % 3) * 0.02})`;
          ctx.beginPath(); ctx.moveTo(baseX, baseY); ctx.quadraticCurveTo(cx, cy, ex, ey); ctx.stroke();
          ctx.fillStyle = "rgba(156,171,148,.42)";
          ctx.beginPath(); ctx.arc(ex, ey, 1 + (branch % 3) * 0.3, 0, Math.PI * 2); ctx.fill();
        }
      });
    };

    const drawLight = () => {
      const x = width * (pointer.active ? pointer.x : 0.64);
      const y = height * (pointer.active ? pointer.y : 0.25);
      const gradient = ctx.createLinearGradient(x, y, width * 0.5, height * 0.75);
      gradient.addColorStop(0, "rgba(214,194,143,.15)");
      gradient.addColorStop(0.36, "rgba(214,194,143,.045)");
      gradient.addColorStop(1, "rgba(214,194,143,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < 9; i++) {
        const startX = width * (0.24 + i * 0.067);
        ctx.strokeStyle = `rgba(214,194,143,${0.04 + (i % 3) * 0.018})`;
        ctx.beginPath(); ctx.moveTo(startX, height * 0.16); ctx.lineTo(startX + width * 0.05, height * 0.68); ctx.stroke();
      }
    };

    const drawStructure = () => {
      ctx.strokeStyle = "rgba(231,223,207,.11)";
      ctx.lineWidth = 0.8;
      const xA = width * 0.23;
      const xB = width * 0.78;
      const yA = height * 0.22;
      const yB = height * 0.67;
      ctx.strokeRect(xA, yA, xB - xA, yB - yA);
      [0.37, 0.52, 0.66].forEach((x) => { ctx.beginPath(); ctx.moveTo(width * x, yA); ctx.lineTo(width * x, yB); ctx.stroke(); });
      ctx.strokeStyle = "rgba(214,194,143,.19)";
      ctx.beginPath(); ctx.moveTo(xA, yB); ctx.lineTo(width * 0.52, yA); ctx.lineTo(xB, yB); ctx.stroke();
      const px = width * (pointer.active ? pointer.x : 0.58);
      const py = height * (pointer.active ? pointer.y : 0.44);
      ctx.beginPath(); ctx.moveTo(px - 18, py); ctx.lineTo(px + 18, py); ctx.moveTo(px, py - 18); ctx.lineTo(px, py + 18); ctx.stroke();
    };

    const render = () => {
      t += reduced ? 0 : 0.016;
      ctx.clearRect(0, 0, width, height);
      drawDatum();
      const active = stageRef.current;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      if (active === "water") drawWater();
      if (active === "root") drawRoot();
      if (active === "light") drawLight();
      if (active === "structure") drawStructure();
      ctx.restore();
      raf = requestAnimationFrame(render);
    };
    render();

    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener("pointermove", onMove); };
  }, []);

  const current = stages.find((item) => item.key === stage)!;

  return (
    <section className={`${styles.section} ${styles[stage]}`} data-reveal aria-label="Urban Ponics living system interaction">
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div className={styles.top}><span>02 / PRODUCTIVE SYSTEM / LIVE LAYERS</span><span>MOVE / TOUCH / SELECT A SYSTEM</span></div>
      <div className={styles.body}>
        <div className={styles.copy}>
          <div><span>{current.no} / {current.label}</span><h3>{current.title}<br /><em>{current.emphasis}</em></h3><p>{current.body}</p></div>
          <div className={styles.readout}><i /><b>SYSTEM ACTIVE</b><span>{current.note.toUpperCase()}</span></div>
        </div>

        <div className={styles.stage}>
          <div className={styles.rig} aria-hidden="true">
            <div className={styles.frameA}><i /><i /><i /><i /><b /><b /></div>
            <div className={styles.growColumns}><span /><span /><span /><span /></div>
            <div className={styles.channels}><i /><i /><i /><i /><i /></div>
            <div className={styles.lightBars}><b /><b /><b /></div>
            <div className={styles.cropNodes}>{Array.from({ length: 12 }).map((_, index) => <i key={index} />)}</div>
            <div className={styles.dimensions}><span>4 800</span><span>2 400</span><b>±0.000</b></div>
            <div className={styles.sectionMark}><span>A</span><i /><b>SECTION A—A</b><i /><span>A</span></div>
          </div>
          <div className={styles.meta}><span>UP / MODULE 01</span><span>PRODUCTIVE LANDSCAPE / SYSTEM VIEW</span></div>
          <div className={styles.controls}>
            {stages.map((item) => <button type="button" key={item.key} className={stage === item.key ? styles.active : undefined} onClick={() => setStage(item.key)}><span>{item.no}</span><b>{item.label}</b><small>{item.note}</small></button>)}
          </div>
        </div>
      </div>
    </section>
  );
}
