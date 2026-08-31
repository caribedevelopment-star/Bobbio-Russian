"use client";

import { useRef } from "react";
import ArchitecturalOverlay from "./ArchitecturalOverlay";
import HomeLivingField from "./HomeLivingField";
import SpatialCore from "./SpatialCore";
import styles from "./ImmersiveHomeHero.module.css";

export default function ImmersiveHomeHero() {
  const root = useRef<HTMLElement>(null);

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const el = root.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / Math.max(1, rect.width);
    const y = (event.clientY - rect.top) / Math.max(1, rect.height);
    el.style.setProperty("--hx", `${x}`);
    el.style.setProperty("--hy", `${y}`);
  };

  return (
    <section id="home-top" ref={root} onPointerMove={onPointerMove} className={styles.hero} aria-label="Bobbio Russian architectural portfolio introduction">
      <HomeLivingField className={styles.field} />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.blueprint} aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <div className={styles.frame} aria-hidden="true"><i /><i /><i /><i /></div>

      <div className={styles.topline}>
        <span>BOBBIO RUSSIAN / ARCHITECTURAL DESIGN</span>
        <span>MADRID / 40.4168° N</span>
        <span>PORTFOLIO / 2026</span>
      </div>

      <div className={styles.copy}>
        <p className={styles.kicker}>FROM BIT TO MATTER.</p>
        <h1><span>BOBBIO</span><span>RUSSIAN</span></h1>
        <div className={styles.introRow}>
          <p>Architecture, luxury interiors and living systems developed through drawing, modelling, material, light, computation and immersive space.</p>
          <div className={styles.disciplines}>
            <span>01 / ARCHITECTURE</span>
            <span>02 / BIO-DESIGN</span>
            <span>03 / CREATIVE DIRECTION</span>
          </div>
        </div>
      </div>

      <div className={styles.object} aria-hidden="true">
        <div className={styles.objectGlow} />
        <SpatialCore />
        <ArchitecturalOverlay />
        <div className={styles.measureX}><i /><span>12.80 m</span><i /></div>
        <div className={styles.measureY}><i /><span>7.40 m</span><i /></div>
        <div className={styles.sectionTag}>A—A / SECTION</div>
        <div className={styles.areaTag}>AREA / 128.4 m²</div>
      </div>

      <a className={styles.scrollCue} href="#home-journey">
        <span>SCROLL TO EXPLORE</span>
        <i><b /></i>
      </a>

      <div className={styles.bottomline}>
        <span>VENEZUELAN · ITALIAN · MADRID-BASED</span>
        <span>DRAW → MODEL → LIGHT → BUILD → EXPERIENCE</span>
      </div>
    </section>
  );
}
