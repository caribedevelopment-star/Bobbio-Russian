import styles from "./ArchitecturalNotation.module.css";

export default function ArchitecturalNotation({ variant = "journey" }: { variant?: "hero" | "journey" }) {
  return (
    <div className={`${styles.overlay} ${styles[variant]}`} aria-hidden="true">
      <div className={styles.gridBubbles}><span>A</span><span>B</span><span>1</span><span>2</span></div>
      <div className={styles.dimTop}><i /><b>5 800</b><i /></div>
      <div className={styles.dimRight}><i /><b>3 200</b><i /></div>
      <div className={styles.section}><span>A</span><i /><b>SECTION A—A</b><i /><span>A</span></div>
      <div className={styles.levels}><span>+3.150 / ROOF</span><span>+2.150 / BEAM</span><span>±0.000 / DATUM</span><span>−1.650 / FFL</span></div>
      <div className={styles.detail}><b>DET. 04</b><span>STEEL / GLASS / LIGHT</span><i /></div>
      <div className={styles.triangle}><i /><i /><i /><span>3² + 4² = 5²</span></div>
      <div className={styles.scan} />
    </div>
  );
}
