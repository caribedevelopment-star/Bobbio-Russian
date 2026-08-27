"use client";

import { useState, type CSSProperties } from "react";
import styles from "./ClayCompare.module.css";

type Props = {
  src: string;
  alt: string;
  label?: string;
};

export default function ClayCompare({ src, alt, label = "Spatial study" }: Props) {
  const [split, setSplit] = useState(48);

  return (
    <div className={styles.compare} style={{ "--split": `${split}%` } as CSSProperties}>
      <img className={styles.final} src={src} alt={alt} decoding="async" loading="lazy" />
      <div className={styles.clayLayer}>
        <img className={styles.clay} src={src} alt="" aria-hidden="true" decoding="async" loading="lazy" />
      </div>
      <div className={styles.divider} aria-hidden="true"><span /></div>
      <div className={`${styles.label} ${styles.labelClay}`}><b>CLAY</b><span>form · proportion · light</span></div>
      <div className={`${styles.label} ${styles.labelFinal}`}><b>FINAL</b><span>material · atmosphere · detail</span></div>
      <div className={styles.caption}><span>PROCESS STUDY</span><b>{label}</b></div>
      <input
        className={styles.range}
        type="range"
        min="8"
        max="92"
        value={split}
        onChange={(event) => setSplit(Number(event.target.value))}
        aria-label="Compare clay study and final render"
      />
    </div>
  );
}
