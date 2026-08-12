import styles from "./RoleSystem.module.css";

export default function RoleSystem() {
  return (
    <div className={styles.wrap} role="img" aria-label="Living diagram connecting Architectural and Luxury Design, Bio-Designer and Creative Project Lead">
      <svg className={styles.energy} viewBox="0 0 700 620" aria-hidden="true">
        <path d="M350 64 C545 64 622 190 582 332 C552 436 463 518 350 552" />
        <path d="M350 552 C220 548 126 468 108 346 C88 210 175 80 350 64" />
        <path className={styles.cross} d="M160 422 C255 278 452 274 548 422" />
      </svg>
      <div className={`${styles.role} ${styles.arch}`}><span>01</span><b>Architectural +<br />Luxury Design</b><small>Space · material · detail</small></div>
      <div className={`${styles.role} ${styles.bio}`}><span>02</span><b>Bio-Designer</b><small>Living · digital · experimental</small></div>
      <div className={`${styles.role} ${styles.lead}`}><span>03</span><b>Creative<br />Project Lead</b><small>Vision · teams · delivery</small></div>
      <div className={styles.core}><strong>BR</strong><span>Integrated<br />Practice</span></div>
      <i className={`${styles.particle} ${styles.p1}`} />
      <i className={`${styles.particle} ${styles.p2}`} />
      <i className={`${styles.particle} ${styles.p3}`} />
    </div>
  );
}
