"use client";

import { useRef } from "react";
import ArchitecturalNotation from "./ArchitecturalNotation";
import HomeLivingField from "./HomeLivingField";
import HomeWorldCanvas from "./HomeWorldCanvas";
import styles from "./ImmersiveHomeHero.module.css";
import atmosphere from "./ImmersiveHomeAtmosphere.module.css";

const brands = ["BONTEMPI CASA", "FEBAL CASA", "COLOMBINI GROUP", "GRUPO TJC"];

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
    <section id="home-top" ref={root} onPointerMove={onPointerMove} className={`${styles.hero} ${atmosphere.hero}`} aria-label="Bobbio Russian architectural portfolio introduction">
      <HomeLivingField className={`${styles.field} ${atmosphere.field}`} />
      <HomeWorldCanvas className={`${styles.world} ${atmosphere.world}`} mode="hero" />
      <ArchitecturalNotation variant="hero" />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.plan} aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
      <div className={styles.frame} aria-hidden="true"><i /><i /><i /><i /></div>

      <div className={styles.topline}>
        <span>BOBBIO RUSSIAN / ARCHITECTURAL DESIGN</span>
        <span>MADRID / 40.4168° N</span>
        <span>PORTFOLIO / 2026</span>
      </div>

      <div className={styles.copy}>
        <p className={styles.kicker}>FROM DRAWING TO EXPERIENCE.</p>
        <h1><span>BOBBIO</span><span>RUSSIAN</span></h1>

        <div className={styles.brandBand} aria-label="Selected professional context">
          <div className={styles.brandTrack}>
            {[...brands, ...brands, ...brands].map((brand, index) => <span key={`${brand}-${index}`}><i />{brand}</span>)}
          </div>
        </div>

        <div className={styles.introRow}>
          <p>Architecture, luxury interiors and living systems developed through structure, drawing, modelling, material, light, computation and immersive space.</p>
          <div className={styles.actions}>
            <a href="#home-journey"><span>ENTER EXPERIENCE</span><b>↓</b></a>
            <a href="#portfolio-menu"><span>CHOOSE A SECTION</span><b>↗</b></a>
          </div>
        </div>
      </div>

      <div className={styles.worldMeta} aria-hidden="true">
        <span>LIVE ARCHITECTURAL FIELD</span>
        <b>A—A / 1:50</b>
        <small>STRUCTURE / SECTION / REALTIME</small>
      </div>
      <div className={styles.measureX} aria-hidden="true"><i /><span>12.80 m</span><i /></div>
      <div className={styles.measureY} aria-hidden="true"><i /><span>7.40 m</span><i /></div>
      <div className={styles.areaTag} aria-hidden="true">AREA / 128.4 m²</div>
      <div className={styles.datum} aria-hidden="true">±0.00 / DATUM</div>

      <div className={styles.disciplines}>
        <span><i />01 / ARCHITECTURE</span>
        <span><i />02 / BIO-DESIGN</span>
        <span><i />03 / CREATIVE DIRECTION</span>
      </div>

      <div className={styles.bottomline}>
        <span>VENEZUELAN · ITALIAN · MADRID-BASED</span>
        <span>DRAW → STRUCTURE → MODEL → LIGHT → EXPERIENCE</span>
      </div>
    </section>
  );
}
