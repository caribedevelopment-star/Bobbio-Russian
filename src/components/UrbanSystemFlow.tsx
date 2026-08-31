"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./UrbanSystemFlow.module.css";

type Stage = "water" | "root" | "light" | "structure";

const stages: Array<{ key: Stage; no: string; label: string; note: string; title: string; emphasis: string; body: string }> = [
  { key: "water", no: "01", label: "WATER", note: "flow / nutrient", title: "Circulate", emphasis: "resources.", body: "Water is treated as an active spatial layer: moving through the system, feeding crops and linking technical infrastructure with the living surface." },
  { key: "root", no: "02", label: "ROOT", note: "growth / network", title: "Grow", emphasis: "networks.", body: "The biological layer behaves as a network rather than decoration. Roots, crops and support systems expand through a modular spatial logic." },
  { key: "light", no: "03", label: "LIGHT", note: "energy / climate", title: "Tune", emphasis: "conditions.", body: "Daylight and controlled illumination become environmental inputs that influence rhythm, atmosphere and productive performance." },
  { key: "structure", no: "04", label: "STRUCTURE", note: "module / scale", title: "Build", emphasis: "adaptability.", body: "A repeatable structural language lets the system change scale while keeping its technical and visual logic coherent." },
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
    const pointer = { x: 0.68, y: 0.45, active: false };
    let width = 1;
    let height = 1;
    let raf = 0;
    let t = 0;

    const particles = Array.from({ length: compact ? 42 : 82 }, (_, i) => ({ seed: Math.random() * 10, offset: i / (compact ? 42 : 82), lane: Math.random() }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio, compact ? 1.2 : 1.6);
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

    const drawWater = () => {
      ctx.strokeStyle = "rgba(126,171,186,.12)";
      ctx.lineWidth = 1;
      for (let line = 0; line < 7; line++) {
        ctx.beginPath();
        for (let i = 0; i <= 70; i++) {
          const p = i / 70;
          const x = width * (0.1 + p * 0.82);
          const y = height * (0.22 + line * 0.085 + Math.sin(p * 8 + t * 0.9 + line) * 0.025);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      particles.forEach((particle) => {
        const p = (particle.offset + t * 0.035 + particle.seed * 0.01) % 1;
        const x = width * (0.1 + p * 0.82);
        const y = height * (0.23 + particle.lane * 0.5 + Math.sin(p * 9 + particle.seed + t) * 0.018);
        ctx.fillStyle = "rgba(126,171,186,.62)";
        ctx.beginPath(); ctx.arc(x, y, 1.1 + particle.lane, 0, Math.PI * 2); ctx.fill();
      });
    };

    const drawRoot = () => {
      const baseX = width * 0.52;
      const baseY = height * 0.36;
      ctx.lineWidth = 0.75;
      for (let branch = 0; branch < 22; branch++) {
        const angle = (branch / 22) * Math.PI * 2 + Math.sin(t * 0.35 + branch) * 0.08;
        const length = height * (0.18 + (branch % 5) * 0.018);
        ctx.strokeStyle = `rgba(156,171,148,${0.08 + (branch % 4) * 0.018})`;
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        const cx = baseX + Math.cos(angle) * length * 0.42;
        const cy = baseY + Math.sin(angle) * length * 0.42;
        const ex = baseX + Math.cos(angle + Math.sin(branch) * 0.2) * length;
        const ey = baseY + Math.sin(angle) * length;
        ctx.quadraticCurveTo(cx, cy, ex, ey);
        ctx.stroke();
        ctx.fillStyle = "rgba(156,171,148,.42)";
        ctx.beginPath(); ctx.arc(ex, ey, 1.4 + (branch % 3) * 0.35, 0, Math.PI * 2); ctx.fill();
      }
    };

    const drawLight = () => {
      const x = width * (pointer.active ? pointer.x : 0.66);
      const y = height * (pointer.active ? pointer.y : 0.3);
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, Math.max(width, height) * 0.42);
      gradient.addColorStop(0, "rgba(214,194,143,.16)");
      gradient.addColorStop(0.3, "rgba(214,194,143,.055)");
      gradient.addColorStop(1, "rgba(214,194,143,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < 11; i++) {
        const a = -0.7 + i * 0.13 + Math.sin(t * 0.32 + i) * 0.015;
        ctx.strokeStyle = `rgba(214,194,143,${0.035 + (i % 3) * 0.015})`;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * width, y + Math.sin(a) * width); ctx.stroke();
      }
    };

    const drawStructure = () => {
      const grid = compact ? 38 : 52;
      ctx.strokeStyle = "rgba(231,223,207,.055)";
      ctx.lineWidth = 0.7;
      for (let x = width * 0.18; x < width * 0.86; x += grid) { ctx.beginPath(); ctx.moveTo(x, height * 0.15); ctx.lineTo(x, height * 0.72); ctx.stroke(); }
      for (let y = height * 0.18; y < height * 0.72; y += grid) { ctx.beginPath(); ctx.moveTo(width * 0.18, y); ctx.lineTo(width * 0.86, y); ctx.stroke(); }
      ctx.strokeStyle = "rgba(214,194,143,.2)";
      ctx.strokeRect(width * 0.32, height * 0.24, width * 0.35, height * 0.29);
      ctx.strokeRect(width * 0.42, height * 0.33, width * 0.28, height * 0.24);
      const px = width * (pointer.active ? pointer.x : 0.58);
      const py = height * (pointer.active ? pointer.y : 0.44);
      ctx.beginPath(); ctx.moveTo(px - 20, py); ctx.lineTo(px + 20, py); ctx.moveTo(px, py - 20); ctx.lineTo(px, py + 20); ctx.stroke();
    };

    const render = () => {
      t += reduced ? 0 : 0.016;
      ctx.clearRect(0, 0, width, height);
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
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.top}><span>02 / LIVING SYSTEM / INTERACTIVE FIELD</span><span>MOVE / TOUCH / SELECT A LAYER</span></div>
      <div className={styles.body}>
        <div className={styles.copy}>
          <div><span>{current.no} / {current.label}</span><h3>{current.title}<br /><em>{current.emphasis}</em></h3><p>{current.body}</p></div>
          <div className={styles.readout}><i /><b>SYSTEM ACTIVE</b><span>{current.note.toUpperCase()}</span></div>
        </div>
        <div className={styles.stage}>
          <div className={styles.cross} aria-hidden="true" />
          <div className={styles.ring} aria-hidden="true" />
          <div className={styles.core} aria-hidden="true">UP</div>
          <div className={styles.meta}><span>±0.00</span><span>A—A / PRODUCTIVE LANDSCAPE</span></div>
          <div className={styles.controls}>
            {stages.map((item) => <button type="button" key={item.key} className={stage === item.key ? styles.active : undefined} onClick={() => setStage(item.key)}><span>{item.no}</span><b>{item.label}</b><small>{item.note}</small></button>)}
          </div>
        </div>
      </div>
    </section>
  );
}
