"use client";

import { useEffect, useRef, useState } from "react";
import HomeWorldCanvas from "./HomeWorldCanvas";
import ToolMoleculeCanvas from "./ToolMoleculeCanvas";
import styles from "./HomeThresholdTransition.module.css";

export default function HomeThresholdTransition() {
  const root = useRef<HTMLElement>(null);
  const [familyOn, setFamilyOn] = useState(false);
  const [worldStep, setWorldStep] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = root.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = Math.max(1, el.offsetHeight - window.innerHeight);
      const p = Math.max(0, Math.min(1, -rect.top / travel));
      el.style.setProperty("--bridge", String(p));
      setFamilyOn(p > 0.34);
      setWorldStep(p > 0.72 ? 1 : 0);
    };
    const request = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, []);

  return (
    <section ref={root} className={styles.section} aria-label="Transition from identity to digital atelier">
      <div className={styles.sticky}>
        <HomeWorldCanvas className={styles.world} mode="journey" step={worldStep} />
        <ToolMoleculeCanvas className={styles.particles} family={familyOn ? "design" : null} hovered={-1} />

        <div className={styles.drawing} aria-hidden="true">
          <i className={styles.axisX} /><i className={styles.axisY} />
          <span className={styles.dimA}>8 600</span><span className={styles.dimB}>4 000</span>
          <div className={styles.truss}><i /><i /><i /><b>3 / 4 / 5</b></div>
          <div className={styles.compass}><b>N</b><i /><span>32°</span></div>
          <div className={styles.sectionLine}><span>A</span><i /><b>SECTION A—A / 1:50</b><i /><span>A</span></div>
        </div>

        <div className={styles.title} aria-hidden="true"><span>BOBBIO</span><span>RUSSIAN</span></div>
        <div className={styles.slicer} aria-hidden="true"><i /><i /><i /><i /><i /></div>

        <div className={styles.meta}>
          <span>00 / THRESHOLD</span>
          <b>IDENTITY → STRUCTURE → INSTRUMENTS</b>
        </div>
        <div className={styles.target}>
          <span>DIGITAL ATELIER</span>
          <strong>05 SYSTEMS.<br /><em>ONE FIELD.</em></strong>
          <p>The title becomes drawing. The drawing becomes structure. The structure releases the instruments used to build the work.</p>
        </div>
        <div className={styles.progress} aria-hidden="true"><i /></div>
      </div>
    </section>
  );
}
