import styles from "./RoleSystem.module.css";
import motion from "./RoleSystemMotion.module.css";

const roles = [
  {
    key: "arch",
    no: "01",
    title: <>Architectural +<br />Luxury Design</>,
    meta: "Space · material · detail",
  },
  {
    key: "bio",
    no: "02",
    title: <>Bio-Designer</>,
    meta: "Living · digital · experimental",
  },
  {
    key: "lead",
    no: "03",
    title: <>Creative<br />Project Lead</>,
    meta: "Vision · teams · delivery",
  },
] as const;

const motionClass = {
  arch: motion.archMotion,
  bio: motion.bioMotion,
  lead: motion.leadMotion,
} as const;

export default function RoleSystem() {
  return (
    <div className={`${styles.wrap} ${motion.triangle}`} role="img" aria-label="Three dimensional spheres connecting Architectural and Luxury Design, Bio-Designer and Creative Project Lead">
      <svg className={styles.energy} viewBox="0 0 760 650" aria-hidden="true">
        <path d="M380 72 C592 76 676 214 617 363 C575 469 479 547 380 577" />
        <path d="M380 577 C235 566 119 484 111 342 C104 203 207 88 380 72" />
        <path className={styles.cross} d="M157 443 C255 278 496 269 596 443" />
      </svg>

      {roles.map((role) => (
        <div key={role.key} className={`${styles.sphereWrap} ${styles[role.key]} ${motionClass[role.key]}`}>
          <div className={styles.sphere}>
            <span className={styles.sphereGlow} />
            <span className={styles.latitude} />
            <span className={styles.longitude} />
            <span className={styles.longitudeTwo} />
            <div className={styles.sphereCopy}>
              <span>{role.no}</span>
              <b>{role.title}</b>
              <small>{role.meta}</small>
            </div>
          </div>
          <i className={styles.sphereOrbit} />
        </div>
      ))}

      <div className={`${styles.core} ${motion.coreMotion}`}>
        <span className={styles.coreHalo} />
        <strong>BR</strong>
        <span>Integrated<br />Practice</span>
      </div>

      <i className={`${styles.particle} ${styles.p1}`} />
      <i className={`${styles.particle} ${styles.p2}`} />
      <i className={`${styles.particle} ${styles.p3}`} />
    </div>
  );
}
