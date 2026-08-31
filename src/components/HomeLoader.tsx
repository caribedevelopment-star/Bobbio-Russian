"use client";

import { useEffect, useRef, useState } from "react";
import HomeLivingField from "./HomeLivingField";
import styles from "./HomeLoader.module.css";

const phases = ["DRAW", "MODEL", "MATERIAL", "LIGHT", "EXPERIENCE"] as const;
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
    window.setTimeout(() => setVisible(false), 720);
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
      const temporal = Math.min(0.94, elapsed / 1450);
      const blended = Math.min(0.98, Math.max(temporal * 0.62, actual * 0.92));
      const finished = completed >= total && elapsed > 900;
      const value = finished ? 100 : Math.round(blended * 100);
      setProgress(value);

      if (finished) {
        setReady(true);
        window.setTimeout(leave, 820);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!visible) return null;

  const phaseIndex = Math.min(phases.length - 1, Math.floor(progress / 20));

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = root.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 18;
    const y = ((event.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 14;
    el.style.setProperty("--lx", `${x}px`);
    el.style.setProperty("--ly", `${y}px`);
  };

  return (
    <div ref={root} onPointerMove={onPointerMove} className={`${styles.loader} ${leaving ? styles.exit : ""}`} aria-label={`Preparing portfolio ${progress}%`}>
      <HomeLivingField className={styles.field} />
      <div className={styles.coordinates}><span>BR / SPATIAL ARCHIVE</span><span>MADRID · 40.4168° N</span><span>HOME / 2026</span></div>
      <div className={styles.frame} aria-hidden="true"><i /><i /><i /><i /></div>
      <div className={styles.core} aria-hidden="true">
        <i className={styles.ringA} /><i className={styles.ringB} /><i className={styles.ringC} />
        <span className={styles.axisX} /><span className={styles.axisY} />
        <span className={styles.slabA} /><span className={styles.slabB} /><span className={styles.slabC} />
        <b>BR</b>
      </div>
      <div className={styles.copy}>
        <div className={styles.status}><span>PREPARING THE DIGITAL ATELIER</span><i>{ready ? "READY" : "LOADING"}</i></div>
        <h2>{phases[phaseIndex]}</h2>
        <div className={styles.track}><i style={{ width: `${progress}%` }} /></div>
        <div className={styles.readout}><span>{String(progress).padStart(3, "0")}%</span><span>{phases.map((phase, index) => <b className={index === phaseIndex ? styles.activePhase : undefined} key={phase}>{phase}</b>)}</span></div>
        {ready && <button type="button" onClick={leave}>ENTER THE ATELIER <b>↗</b></button>}
      </div>
      <div className={styles.cornerA}>X / DRAWING PLANE</div><div className={styles.cornerB}>Y / EXPERIENCE FIELD</div>
    </div>
  );
}
