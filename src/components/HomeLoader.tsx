"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HomeLoader.module.css";

const phases = ["DRAW", "STRUCTURE", "MODEL", "LIGHT", "EXPERIENCE"] as const;
const preloadMarks = [
  "https://cdn.simpleicons.org/autodesk/FFFFFF",
  "https://cdn.simpleicons.org/sketchup/FFFFFF",
  "https://cdn.simpleicons.org/unrealengine/FFFFFF",
  "https://cdn.simpleicons.org/blender/FFFFFF",
  "https://cdn.simpleicons.org/adobephotoshop/FFFFFF",
  "https://cdn.simpleicons.org/visualstudiocode/FFFFFF",
  "https://cdn.simpleicons.org/openai/FFFFFF",
  "https://cdn.simpleicons.org/supabase/FFFFFF",
];

export default function HomeLoader() {
  const root = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const leave = () => {
    if (leaving) return;
    setLeaving(true);
    sessionStorage.setItem("br-home-loaded", "1");
    window.setTimeout(() => setVisible(false), 1080);
  };

  useEffect(() => {
    if (sessionStorage.getItem("br-home-loaded") === "1") {
      setVisible(false);
      return;
    }

    const started = performance.now();
    let raf = 0;
    let completed = 0;
    const total = 3;
    const mark = () => { completed += 1; };

    (document.fonts?.ready ?? Promise.resolve()).then(mark);
    new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    }).then(mark);
    Promise.allSettled(preloadMarks.map((src) => new Promise<void>((resolve) => {
      const image = new Image();
      image.onload = () => resolve();
      image.onerror = () => resolve();
      image.src = src;
    }))).then(mark);

    const tick = (now: number) => {
      const elapsed = now - started;
      const actual = completed / total;
      const temporal = Math.min(0.95, elapsed / 1850);
      const blended = Math.min(0.99, Math.max(temporal * 0.68, actual * 0.94));
      const finished = completed >= total && elapsed > 1120;
      const value = finished ? 100 : Math.round(blended * 100);
      setProgress(value);
      if (finished) {
        setReady(true);
        window.setTimeout(leave, 980);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!visible) return null;
  const phaseIndex = Math.min(phases.length - 1, Math.floor(progress / 20));
  const load = progress / 100;

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = root.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
    const y = (event.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
    el.style.setProperty("--lx", `${x}`);
    el.style.setProperty("--ly", `${y}`);
  };

  return (
    <div
      ref={root}
      onPointerMove={onPointerMove}
      style={{ "--load": load } as React.CSSProperties}
      data-phase={phases[phaseIndex].toLowerCase()}
      className={`${styles.loader} ${leaving ? styles.exit : ""}`}
      aria-label={`Preparing portfolio ${progress}%`}
    >
      <div className={styles.frame} aria-hidden="true"><i /><i /><i /><i /></div>
      <div className={styles.coordinates}><span>BR / ARCHITECTURAL FIELD</span><span>MADRID · 40.4168° N</span><span>PORTFOLIO / 2026</span></div>

      <div className={styles.structure} aria-hidden="true">
        <div className={styles.axisA} /><div className={styles.axisB} /><div className={styles.axisC} />
        <div className={styles.beamA} /><div className={styles.beamB} /><div className={styles.beamC} /><div className={styles.beamD} />
        <div className={styles.columnA} /><div className={styles.columnB} /><div className={styles.columnC} />
        <div className={styles.braceA} /><div className={styles.braceB} />
        <div className={styles.triangle}><i /><i /><i /><span>3² + 4² = 5²</span></div>
        <div className={styles.dimension}><i /><b>8 600</b><i /></div>
        <div className={styles.levels}><span>+3.600</span><span>+2.350</span><span>±0.000</span></div>
        <div className={styles.trace}><i /><i /><i /><i /><i /></div>
      </div>

      <div className={styles.nameBlock}>
        <span className={styles.pre}>ARCHITECTURE / BIO-DESIGN / CREATIVE DIRECTION</span>
        <h1><span>BOBBIO</span><span>RUSSIAN</span></h1>
        <div className={styles.status}><span>{phases[phaseIndex]} / {String(progress).padStart(3, "0")}%</span><i>{ready ? "FIELD READY" : "CONSTRUCTING"}</i></div>
        <div className={styles.track}><i style={{ width: `${progress}%` }} /><b style={{ left: `${progress}%` }} /></div>
        <div className={styles.readout}>{phases.map((phase, index) => <b className={index === phaseIndex ? styles.activePhase : undefined} key={phase}>{phase}</b>)}</div>
        <div className={styles.loadMeta}><span>HOME / ASSETS</span><span>{progress < 100 ? "PRELOAD ACTIVE" : "READY TO ENTER"}</span></div>
        {ready && <button type="button" onClick={leave}>ENTER THE FIELD <b>↗</b></button>}
      </div>

      <div className={styles.surfaceTag}>SURFACE / 128.40 m²</div>
      <div className={styles.sectionTag}>SECTION A—A / 1:50</div>
    </div>
  );
}
