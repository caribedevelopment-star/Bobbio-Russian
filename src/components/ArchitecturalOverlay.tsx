import styles from "./ArchitecturalOverlay.module.css";

export default function ArchitecturalOverlay() {
  return (
    <div className={styles.overlay} aria-hidden="true">
      <div className={`${styles.dimension} ${styles.dimTop}`}><i /><span>12.80 m</span><i /></div>
      <div className={`${styles.dimension} ${styles.dimSide}`}><i /><span>7.40 m</span><i /></div>

      <div className={`${styles.note} ${styles.noteA}`}><span>A–A</span><b>SECTION</b><small>01 / SPATIAL INDEX</small></div>
      <div className={`${styles.note} ${styles.noteB}`}><span>±0.00</span><b>DATUM</b><small>MADRID / 40.4168° N</small></div>
      <div className={`${styles.note} ${styles.noteC}`}><span>128.4 m²</span><b>FIELD AREA</b><small>ACTIVE PORTFOLIO PLANE</small></div>
      <div className={`${styles.note} ${styles.noteD}`}><span>1:50</span><b>SCALE</b><small>DRAW → MODEL → MATTER</small></div>

      <div className={styles.axisX}><span>X</span></div>
      <div className={styles.axisY}><span>Y</span></div>
      <div className={styles.target}><span /><i /></div>

      <div className={styles.entryCue}>
        <span>START HERE</span>
        <b>READ THE PRACTICE</b>
        <i>↓</i>
      </div>
    </div>
  );
}
