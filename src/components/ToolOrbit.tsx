import styles from "./ToolOrbit.module.css";

const tools = [
  { name: "AutoCAD", short: "AC", group: "DRAW", cls: "t1" },
  { name: "Revit", short: "RV", group: "BIM", cls: "t2" },
  { name: "SketchUp", short: "SU", group: "MODEL", cls: "t3" },
  { name: "D5 Render", short: "D5", group: "LIGHT", cls: "t4" },
  { name: "Twinmotion", short: "TM", group: "SPACE", cls: "t5" },
  { name: "Unreal Engine", short: "UE", group: "REALTIME", cls: "t6" },
  { name: "V-Ray", short: "VR", group: "IMAGE", cls: "t7" },
  { name: "Blender", short: "BL", group: "GEOMETRY", cls: "t8" },
] as const;

export default function ToolOrbit() {
  return (
    <div className={styles.stage} role="img" aria-label="Floating design software ecosystem">
      <div className={styles.architecture} aria-hidden="true">
        <span className={styles.slabA} /><span className={styles.slabB} /><span className={styles.slabC} />
        <i className={styles.columnA} /><i className={styles.columnB} /><i className={styles.columnC} />
        <b className={styles.axisA} /><b className={styles.axisB} />
      </div>
      <div className={styles.core}>
        <span>DIGITAL</span><strong>ATELIER</strong><small>draw → model → light → experience</small>
      </div>
      {tools.map((tool, index) => (
        <div className={`${styles.tool} ${styles[tool.cls]}`} style={{ "--delay": `${index * -.7}s` } as React.CSSProperties} key={tool.name}>
          <div className={styles.sphere}>
            <i /><b /><em />
            <span>{tool.short}</span>
          </div>
          <div className={styles.label}><strong>{tool.name}</strong><small>{tool.group}</small></div>
        </div>
      ))}
      <div className={styles.measureA} aria-hidden="true"><span>8.40 m</span></div>
      <div className={styles.measureB} aria-hidden="true"><span>±0.00</span></div>
    </div>
  );
}
