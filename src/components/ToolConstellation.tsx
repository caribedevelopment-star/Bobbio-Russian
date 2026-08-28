"use client";

import { useState } from "react";
import styles from "./ToolConstellation.module.css";

type Tool = {
  name: string;
  role: string;
  src: string;
  fallback: string;
};

const tools: Tool[] = [
  { name: "AutoCAD", role: "Draw / dimension", src: "https://cdn.simpleicons.org/autodesk/FFFFFF", fallback: "AC" },
  { name: "Revit", role: "BIM / coordinate", src: "https://cdn.simpleicons.org/autodesk/FFFFFF", fallback: "RV" },
  { name: "SketchUp", role: "Model / iterate", src: "https://cdn.simpleicons.org/sketchup/FFFFFF", fallback: "SU" },
  { name: "D5 Render", role: "Material / light", src: "https://www.d5render.com/favicon.ico", fallback: "D5" },
  { name: "Twinmotion", role: "Immersive / 360º", src: "https://www.twinmotion.com/favicon.ico", fallback: "TM" },
  { name: "Unreal Engine", role: "Realtime / cinematic", src: "https://cdn.simpleicons.org/unrealengine/FFFFFF", fallback: "UE" },
  { name: "V-Ray", role: "Fidelity / material", src: "https://www.chaos.com/favicon.ico", fallback: "VR" },
  { name: "Blender", role: "Geometry / assets", src: "https://cdn.simpleicons.org/blender/FFFFFF", fallback: "BL" },
];

function BrandMark({ tool }: { tool: Tool }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <span className={styles.fallback}>{tool.fallback}</span>
  ) : (
    <img src={tool.src} alt="" aria-hidden="true" onError={() => setFailed(true)} />
  );
}

export default function ToolConstellation() {
  return (
    <section className={styles.scene} aria-label="Architectural visualization toolchain">
      <div className={styles.sceneHeader} data-reveal>
        <div><span>VISUAL WORKSHOP / 00</span><b>DIGITAL DESIGN ENVIRONMENT</b></div>
        <h2>Tools orbit<br /><em>the design decision.</em></h2>
        <p>Drawing, BIM, modelling and realtime engines are treated as one continuous spatial workflow. The software changes; the architectural intent does not.</p>
      </div>

      <div className={styles.stage} data-reveal>
        <div className={styles.gridFloor} aria-hidden="true" />
        <div className={styles.model} aria-hidden="true">
          <span className={styles.slabA} />
          <span className={styles.slabB} />
          <span className={styles.slabC} />
          <i className={styles.columnA} />
          <i className={styles.columnB} />
          <i className={styles.columnC} />
          <b className={styles.core}>BR</b>
        </div>
        <div className={styles.measureX} aria-hidden="true"><i /><span>8.40 m</span><i /></div>
        <div className={styles.measureY} aria-hidden="true"><i /><span>3.10 m</span><i /></div>
        <div className={styles.datum} aria-hidden="true">±0.00 / TOOLCHAIN PLANE</div>

        <div className={styles.tools}>
          {tools.map((tool, index) => (
            <article className={`${styles.tool} ${styles[`tool${index + 1}`]}`} key={tool.name}>
              <div className={styles.logo}><BrandMark tool={tool} /></div>
              <div><b>{tool.name}</b><span>{tool.role}</span></div>
              <i aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
