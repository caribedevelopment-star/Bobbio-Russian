import styles from "./GlobePrompt.module.css";

export default function GlobePrompt() {
  return (
    <div className={styles.prompt} aria-hidden="true">
      <div className={styles.hand}><span /><i /></div>
      <div className={styles.copy}>
        <b>TOUCH / DRAG THE WORLD</b>
        <span>Move the map to trace the routes</span>
      </div>
      <div className={styles.scroll}>
        <small>SWIPE DOWN</small>
        <i>↓</i>
      </div>
    </div>
  );
}
