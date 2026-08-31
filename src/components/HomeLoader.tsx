"use client";

import { useEffect, useState } from "react";
import styles from "./HomeLoader.module.css";

const phases = ["DRAW", "MODEL", "LIGHT", "EXPERIENCE"] as const;

export default function HomeLoader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("br-home-loaded") === "1") {
      setVisible(false);
      return;
    }

    const started = performance.now();
    let raf = 0;
    let ready = false;

    Promise.allSettled([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise<void>((resolve) => {
        if (document.readyState === "complete") resolve();
        else window.addEventListener("load", () => resolve(), { once: true });
      }),
    ]).then(() => { ready = true; });

    const tick = (now: number) => {
      const elapsed = now - started;
      const soft = Math.min(92, elapsed / 13);
      const next = ready && elapsed > 780 ? 100 : soft;
      setProgress(Math.round(next));

      if (next >= 100) {
        sessionStorage.setItem("br-home-loaded", "1");
        window.setTimeout(() => setVisible(false), 620);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!visible) return null;

  const phaseIndex = Math.min(phases.length - 1, Math.floor(progress / 25));

  return (
    <div className={`${styles.loader} ${progress === 100 ? styles.exit : ""}`} aria-label={`Preparing portfolio ${progress}%`}>
      <div className={styles.coordinates}><span>BR / DIGITAL ATELIER</span><span>MADRID · 2026</span></div>
      <div className={styles.core} aria-hidden="true">
        <i className={styles.ringA} /><i className={styles.ringB} /><i className={styles.ringC} />
        <span className={styles.axisX} /><span className={styles.axisY} />
        <b>BR</b>
      </div>
      <div className={styles.copy}>
        <p>PREPARING THE SPATIAL ARCHIVE</p>
        <h2>{phases[phaseIndex]}</h2>
        <div className={styles.track}><i style={{ width: `${progress}%` }} /></div>
        <div className={styles.readout}><span>{String(progress).padStart(3, "0")}%</span><span>LOAD / HOME EXPERIENCE</span></div>
      </div>
      <div className={styles.cornerA}>X 40.4168° N</div><div className={styles.cornerB}>Y 3.7038° W</div>
    </div>
  );
}
