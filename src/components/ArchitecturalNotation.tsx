import styles from "./ArchitecturalNotation.module.css";

export default function ArchitecturalNotation({ variant = "journey" }: { variant?: "hero" | "journey" }) {
  return (
    <div className={`${styles.overlay} ${styles[variant]}`} aria-hidden="true">
      <div className={styles.gridBubbles}><span>A</span><span>B</span><span>1</span><span>2</span></div>
      <div className={styles.dimTop}><i /><b>OVERALL / 8 600 mm</b><i /></div>
      <div className={styles.dimRight}><i /><b>HEIGHT / 4 000 mm</b><i /></div>
      <div className={styles.dimBay}><i /><b>STRUCTURAL BAY / 2 150</b><i /></div>
      <div className={styles.section}><span>A</span><i /><b>SECTION A—A / 1:50</b><i /><span>A</span></div>
      <div className={styles.levels}><span>+3.600 / RIDGE</span><span>+2.350 / ROOF BEAM</span><span>+1.050 / MEZZANINE</span><span>±0.000 / FFL</span><span>−1.650 / DATUM</span></div>
      <div className={styles.detail}><b>DET. 04</b><span>STEEL PROFILE / 80 × 80</span><i /></div>
      <div className={styles.triangle}><i /><i /><i /><span>3² + 4² = 5²</span><b>PYTHAGORAS / SET OUT</b></div>
      <div className={styles.compass}><span>N</span><span>E</span><span>S</span><span>W</span><i /><b>32° / TRUE N</b></div>
      <div className={styles.surface}><span>MEASURED SURFACE / A</span><b>128.40 m²</b><i>PERIMETER / 46.20 m</i></div>
      <div className={styles.surfaceB}><span>MEZZANINE / B</span><b>42.75 m²</b><i>LEVEL / +1.050</i></div>
      <div className={styles.coordinate}><span>X 04.350</span><i /><span>Y 02.350</span></div>
      <div className={styles.scan} />
    </div>
  );
}
