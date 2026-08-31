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
    const pointer = { x: 0.62, y: 0.42, tx: 0.62, ty: 0.42, active: false };
    let width = 1;
    let height = 1;
    let raf = 0;
    let t = 0;
    let activeStage: Stage = stageRef.current;
    let stageEnteredAt = 0;

    const particles = Array.from({ length: compact ? 52 : 116 }, (_, i) => ({
      seed: (i * 0.6180339887) % 1,
      offset: i / (compact ? 52 : 116),
      lane: ((i * 37) % 100) / 100,
      size: 0.55 + ((i * 29) % 100) / 100 * 1.8,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, compact ? 1.2 : 1.65);
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

    const drawWater = (age: number) => {
      const wake = smooth(clamp01(age / 0.85));
      for (let line = 0; line < 7; line += 1) {
        ctx.beginPath();
        for (let i = 0; i <= 100; i += 1) {
          const p = i / 100;
          const x = width * (0.13 + p * 0.76);
          const base = 0.23 + line * 0.068;
          const y = height * (base + Math.sin(p * 8.5 + t * 0.95 + line) * 0.014 + Math.sin(p * 21 + line) * 0.0025);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(126,171,186,${(0.052 + line * 0.01) * wake})`;
        ctx.lineWidth = line % 3 === 0 ? 1.05 : 0.55;
        ctx.stroke();
      }
      particles.forEach((particle) => {
        const p = (particle.offset + t * (0.032 + particle.seed * 0.02)) % 1;
        const x = width * (0.13 + p * 0.76);
        const y = height * (0.23 + particle.lane * 0.41 + Math.sin(p * 9 + particle.seed * 8 + t) * 0.014);
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 7 + particle.size * 3);
        glow.addColorStop(0, `rgba(126,171,186,${0.34 * wake})`);
        glow.addColorStop(1, "rgba(126,171,186,0)");
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(x, y, 7 + particle.size * 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(150,198,214,${0.7 * wake})`;
        ctx.beginPath(); ctx.ellipse(x, y, particle.size * 1.35, particle.size * 0.65, 0, 0, Math.PI * 2); ctx.fill();
      });
    };

    const drawPartialQuadratic = (x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, progress: number, alpha: number, widthPx: number) => {
      const segments = 22;
      const visible = Math.max(1, Math.floor(segments * clamp01(progress)));
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      for (let i = 1; i <= visible; i += 1) {
        const p = (i / segments) * clamp01(progress);
        const inv = 1 - p;
        const x = inv * inv * x0 + 2 * inv * p * cx + p * p * x1;
        const y = inv * inv * y0 + 2 * inv * p * cy + p * p * y1;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(156,171,148,${alpha})`;
      ctx.lineWidth = widthPx;
      ctx.stroke();
    };

    const drawRoots = (age: number) => {
      const growth = reduced ? 1 : smooth(clamp01(age / 2.65));
      const anchors = [0.27, 0.4, 0.54, 0.68, 0.79];
      anchors.forEach((ax, index) => {
        const baseX = width * ax;
        const baseY = height * (0.31 + (index % 2) * 0.055);
        ctx.fillStyle = `rgba(156,171,148,${0.3 + growth * 0.35})`;
        ctx.beginPath(); ctx.arc(baseX, baseY, 2.2 + growth * 1.4, 0, Math.PI * 2); ctx.fill();

        for (let branch = 0; branch < 13; branch += 1) {
          const local = clamp01(growth * 1.38 - branch * 0.035 - index * 0.018);
          if (local <= 0) continue;
          const side = branch % 2 ? -1 : 1;
          const depth = 0.068 + branch * 0.0095;
          const spread = 0.028 + (branch % 5) * 0.011;
          const ex = baseX + width * side * spread;
          const ey = baseY + height * depth;
          const cx = baseX + width * side * (spread * 0.36 + Math.sin(branch + t * 0.18) * 0.004);
          const cy = baseY + height * depth * 0.47;
          drawPartialQuadratic(baseX, baseY, cx, cy, ex, ey, local, 0.08 + local * 0.26, 0.55 + local * 0.45);

          if (local > 0.56) {
            const secondary = clamp01((local - 0.56) / 0.44);
            const sx = ex - width * side * 0.004;
            const sy = ey - height * 0.012;
            const secX = ex + width * -side * (0.012 + (branch % 3) * 0.005);
            const secY = ey + height * (0.025 + (branch % 4) * 0.006);
            drawPartialQuadratic(sx, sy, ex, ey + height * 0.008, secX, secY, secondary, 0.07 + secondary * 0.18, 0.42);
          }

          if (local > 0.92) {
            const glow = ctx.createRadialGradient(ex, ey, 0, ex, ey, 9);
            glow.addColorStop(0, "rgba(156,171,148,.32)");
            glow.addColorStop(1, "rgba(156,171,148,0)");
            ctx.fillStyle = glow;
            ctx.beginPath(); ctx.arc(ex, ey, 9, 0, Math.PI * 2); ctx.fill();
          }
        }
      });
    };

    const drawLight = (age: number) => {
      const reveal = smooth(clamp01(age / 0.9));
      const day = reduced ? 0.58 : (0.12 + (age * 0.055) % 0.76);
      const sunX = width * (0.14 + day * 0.72);
      const sunY = height * (0.48 - Math.sin(day * Math.PI) * 0.31);

      ctx.save();
      ctx.strokeStyle = `rgba(214,194,143,${0.17 * reveal})`;
      ctx.setLineDash([4, 7]);
      ctx.beginPath();
      for (let i = 0; i <= 70; i += 1) {
        const p = i / 70;
        const x = width * (0.14 + p * 0.72);
        const y = height * (0.48 - Math.sin(p * Math.PI) * 0.31);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, Math.min(width, height) * 0.16);
      sunGlow.addColorStop(0, `rgba(255,229,174,${0.34 * reveal})`);
      sunGlow.addColorStop(0.18, `rgba(214,194,143,${0.14 * reveal})`);
      sunGlow.addColorStop(1, "rgba(214,194,143,0)");
      ctx.fillStyle = sunGlow;
      ctx.beginPath(); ctx.arc(sunX, sunY, Math.min(width, height) * 0.16, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(255,229,174,${0.8 * reveal})`;
      ctx.beginPath(); ctx.arc(sunX, sunY, compact ? 4.5 : 6.5, 0, Math.PI * 2); ctx.fill();

      const targets = [0.29, 0.42, 0.55, 0.68, 0.78];
      targets.forEach((tx, i) => {
        const x = width * tx;
        const y = height * (0.6 + (i % 2) * 0.035);
        ctx.strokeStyle = `rgba(214,194,143,${(0.045 + (i % 3) * 0.018) * reveal})`;
        ctx.beginPath(); ctx.moveTo(sunX, sunY); ctx.lineTo(x, y); ctx.stroke();
        const shadowDx = (x - sunX) * 0.18;
        const shadowDy = (y - sunY) * 0.11;
        ctx.strokeStyle = `rgba(126,141,148,${0.075 * reveal})`;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + shadowDx, y + shadowDy); ctx.stroke();
      });

      ctx.font = `${compact ? 6 : 7}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.fillStyle = `rgba(214,194,143,${0.56 * reveal})`;
      ctx.fillText("E / 08:00", width * 0.13, height * 0.515);
      ctx.fillText("S / 12:00", width * 0.48, height * 0.135);
      ctx.fillText("W / 18:00", width * 0.81, height * 0.515);
      ctx.fillText(`SOLAR ALT / ${Math.round(Math.sin(day * Math.PI) * 62)}°`, sunX + 12, sunY - 9);
      ctx.restore();
    };

    const drawAir = (age: number) => {
      const reveal = smooth(clamp01(age / 0.7));
      const laneCount = compact ? 8 : 12;
      for (let lane = 0; lane < laneCount; lane += 1) {
        ctx.beginPath();
        for (let i = 0; i <= 82; i += 1) {
          const p = i / 82;
          const x = width * (0.1 + p * 0.82);
          const base = 0.17 + lane * (0.62 / Math.max(1, laneCount - 1));
          const y = height * (base + Math.sin(p * 6.5 + t * 0.64 + lane * 0.72) * 0.019 + Math.sin(p * 14 + lane) * 0.0045);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(183,199,227,${(0.032 + (lane % 4) * 0.012) * reveal})`;
        ctx.lineWidth = lane % 4 === 0 ? 0.9 : 0.48;
        ctx.stroke();
      }

      particles.forEach((particle, index) => {
        const speed = 0.028 + particle.seed * 0.035;
        const p = (particle.offset + age * speed) % 1;
        const x = width * (0.1 + p * 0.82);
        const lane = index % laneCount;
        const base = 0.17 + lane * (0.62 / Math.max(1, laneCount - 1));
        const y = height * (base + Math.sin(p * 6.5 + t * 0.64 + lane * 0.72) * 0.019 + Math.sin(p * 18 + particle.seed * 12) * 0.005);
        const tail = 6 + particle.size * 4;
        ctx.strokeStyle = `rgba(201,214,236,${0.16 * reveal})`;
        ctx.beginPath(); ctx.moveTo(x - tail, y + Math.sin(p * 9) * 1.5); ctx.lineTo(x, y); ctx.stroke();
        ctx.fillStyle = `rgba(214,225,244,${(0.32 + particle.seed * 0.34) * reveal})`;
        ctx.beginPath(); ctx.arc(x, y, particle.size * 0.7, 0, Math.PI * 2); ctx.fill();
      });

      if (!compact) {
        ctx.font = "7px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.fillStyle = `rgba(183,199,227,${0.44 * reveal})`;
        ctx.fillText("INLET / COOL AIR", width * 0.11, height * 0.12);
        ctx.fillText("EXHAUST / WARM AIR", width * 0.77, height * 0.82);
      }
    };

    const drawDimension = (x1: number, y1: number, x2: number, y2: number, label: string, alpha: number) => {
      ctx.strokeStyle = `rgba(231,223,207,${alpha})`;
      ctx.fillStyle = `rgba(231,223,207,${Math.min(0.56, alpha * 2.3)})`;
      ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.max(1, Math.hypot(dx, dy));
      const nx = -dy / len;
      const ny = dx / len;
      const tick = 5;
      [0, 1].forEach((end) => {
        const x = end ? x2 : x1;
        const y = end ? y2 : y1;
        ctx.beginPath(); ctx.moveTo(x - nx * tick, y - ny * tick); ctx.lineTo(x + nx * tick, y + ny * tick); ctx.stroke();
      });
      ctx.font = `${compact ? 6 : 7}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.fillText(label, (x1 + x2) * 0.5 + nx * 11, (y1 + y2) * 0.5 + ny * 11);
    };

    const drawStructure = (age: number) => {
      const reveal = smooth(clamp01(age / 1.45));
      const xA = width * 0.2;
      const xB = width * 0.8;
      const yA = height * 0.19;
      const yB = height * 0.69;
      const frameReveal = smooth(clamp01(reveal * 1.25));

      ctx.strokeStyle = `rgba(231,223,207,${0.15 * frameReveal})`;
      ctx.lineWidth = 0.85;
      ctx.strokeRect(xA, yA, (xB - xA) * frameReveal, yB - yA);
      [0.35, 0.5, 0.65].forEach((x, i) => {
        const local = clamp01(reveal * 1.5 - i * 0.12);
        ctx.beginPath(); ctx.moveTo(width * x, yB); ctx.lineTo(width * x, yB - (yB - yA) * local); ctx.stroke();
      });

      ctx.strokeStyle = `rgba(214,194,143,${0.22 * reveal})`;
      ctx.beginPath(); ctx.moveTo(xA, yB); ctx.lineTo(width * 0.5, yA); ctx.lineTo(xB, yB); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(xA, yA); ctx.lineTo(width * 0.5, yB); ctx.lineTo(xB, yA); ctx.stroke();

      const surface = [
        [width * 0.3, height * 0.37],
        [width * 0.68, height * 0.37],
        [width * 0.75, height * 0.58],
        [width * 0.25, height * 0.58],
      ] as const;
      ctx.fillStyle = `rgba(156,171,148,${0.035 * reveal})`;
      ctx.strokeStyle = `rgba(156,171,148,${0.18 * reveal})`;
      ctx.beginPath();
      surface.forEach(([x, y], index) => index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
      ctx.closePath(); ctx.fill(); ctx.stroke();

      drawDimension(width * 0.2, height * 0.76, width * 0.8, height * 0.76, "4 800 mm", 0.16 * reveal);
      drawDimension(width * 0.84, height * 0.19, width * 0.84, height * 0.69, "2 400 mm", 0.14 * reveal);
      drawDimension(width * 0.3, height * 0.63, width * 0.75, height * 0.63, "GROW SURFACE / 36.8 m²", 0.13 * reveal);

      ctx.font = `${compact ? 6 : 7}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.fillStyle = `rgba(214,194,143,${0.52 * reveal})`;
      ctx.fillText("MODULE / 01", width * 0.21, height * 0.16);
      ctx.fillText("±0.000 / FFL", width * 0.21, height * 0.705);
      ctx.fillText("SECTION A—A", width * 0.68, height * 0.16);
      if (!compact) {
        ctx.fillStyle = `rgba(231,223,207,${0.32 * reveal})`;
        ctx.fillText("STRUCTURAL BAY / 12.4 m²", width * 0.31, height * 0.35);
        ctx.fillText("PRODUCTIVE AREA / 36.8 m²", width * 0.47, height * 0.595);
      }
    };

    const render = () => {
      t += reduced ? 0 : 0.016;
      pointer.x += (pointer.tx - pointer.x) * 0.065;
      pointer.y += (pointer.ty - pointer.y) * 0.065;

      const requested = stageRef.current;
      if (requested !== activeStage) {
        activeStage = requested;
        stageEnteredAt = t;
      }
      const age = t - stageEnteredAt;

      ctx.clearRect(0, 0, width, height);
      drawDatum();
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      if (activeStage === "water") drawWater(age);
      if (activeStage === "root") drawRoots(age);
      if (activeStage === "light") drawLight(age);
      if (activeStage === "air") drawAir(age);
      if (activeStage === "structure") drawStructure(age);
      ctx.restore();
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
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
