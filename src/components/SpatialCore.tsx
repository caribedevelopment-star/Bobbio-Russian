import styles from "./SpatialCore.module.css";

export default function SpatialCore() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.scene}>
        <div className={`${styles.plane} ${styles.floor}`} />
        <div className={`${styles.plane} ${styles.wallA}`} />
        <div className={`${styles.plane} ${styles.wallB}`} />
        <div className={`${styles.frame} ${styles.frameA}`} />
        <div className={`${styles.frame} ${styles.frameB}`} />
        <div className={`${styles.frame} ${styles.frameC}`} />
        <div className={styles.core}>
          <i /><i /><i /><i />
        </div>
        <div className={`${styles.axis} ${styles.axisX}`} />
        <div className={`${styles.axis} ${styles.axisY}`} />
        <div className={`${styles.axis} ${styles.axisZ}`} />
        <div className={`${styles.node} ${styles.nodeA}`}><span>01</span></div>
        <div className={`${styles.node} ${styles.nodeB}`}><span>02</span></div>
        <div className={`${styles.node} ${styles.nodeC}`}><span>03</span></div>
        <div className={`${styles.node} ${styles.nodeD}`}><span>04</span></div>
      </div>
      <div className={styles.caption}><span>PLAN</span><span>SECTION</span><span>MATTER</span><span>LIGHT</span></div>
    </div>
  );
}
