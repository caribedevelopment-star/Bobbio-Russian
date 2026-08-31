"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./HomeJourney.module.css";

type Family = "design" | "visual" | "creative" | "code" | "data";
type Tool = { name: string; short: string; note: string; family: Family; src?: string };

const tools: Tool[] = [
  { name: "AutoCAD", short: "AC", note: "draw / dimension", family: "design", src: "https://cdn.simpleicons.org/autodesk/FFFFFF" },
  { name: "Revit", short: "RV", note: "BIM / coordinate", family: "design", src: "https://cdn.simpleicons.org/autodesk/FFFFFF" },
  { name: "SketchUp", short: "SU", note: "model / iterate", family: "design", src: "https://cdn.simpleicons.org/sketchup/FFFFFF" },
  { name: "BIM Systems", short: "BIM", note: "information / delivery", family: "design", src: "https://cdn.simpleicons.org/autodesk/FFFFFF" },
  { name: "D5 Render", short: "D5", note: "material / light", family: "visual", src: "https://www.d5render.com/favicon.ico" },
  { name: "Twinmotion", short: "TM", note: "immersive / 360°", family: "visual", src: "https://www.twinmotion.com/favicon.ico" },
  { name: "Unreal Engine", short: "UE", note: "realtime / cinematic", family: "visual", src: "https://cdn.simpleicons.org/unrealengine/FFFFFF" },
  { name: "V-Ray", short: "VR", note: "fidelity / material", family: "visual", src: "https://www.chaos.com/favicon.ico" },
  { name: "Blender", short: "BL", note: "geometry / assets", family: "visual", src: "https://cdn.simpleicons.org/blender/FFFFFF" },
  { name: "Adobe Creative Cloud", short: "CC", note: "image / graphic / film", family: "creative", src: "https://cdn.simpleicons.org/adobecreativecloud/FFFFFF" },
  { name: "Visual Studio Code", short: "VS", note: "code / prototype", family: "code", src: "https://cdn.simpleicons.org/visualstudiocode/FFFFFF" },
  { name: "Codex", short: "CX", note: "AI / build / iterate", family: "code", src: "https://cdn.simpleicons.org/openai/FFFFFF" },
  { name: "APIs", short: "API", note: "connect / automate", family: "code" },
  { name: "SQL", short: "SQL", note: "query / structure", family: "data", src: "https://cdn.simpleicons.org/postgresql/FFFFFF" },
  { name: "Supabase", short: "SB", note: "database / realtime", family: "data", src: "https://cdn.simpleicons.org/supabase/FFFFFF" },
  { name: "Excel", short: "XL", note: "analyse / organise", family: "data", src: "https://cdn.simpleicons.org/microsoftexcel/FFFFFF" },
];

const familyMeta: Record<Family, { index: string; title: string; eyebrow: string }> = {
  design: { index: "01", title: "Draw / coordinate", eyebrow: "ARCHITECTURE + BIM" },
  visual: { index: "02", title: "Model / illuminate", eyebrow: "SPACE + REALTIME" },
  creative: { index: "03", title: "Edit / communicate", eyebrow: "IMAGE + NARRATIVE" },
  code: { index: "04", title: "Build / connect", eyebrow: "CODE + AI + APIs" },
  data: { index: "05", title: "Structure / learn", eyebrow: "DATA + SYSTEMS" },
};

const chapters = [
  ["01", "ATELIER", "/practice", "Architecture, interiors + direction"],
  ["02", "CULTIVATED MATTER", "/work", "Bio-design, systems + Urban Ponics"],
  ["03", "STUDIES IN LIGHT", "/renders", "Process, tools + visualisation"],
  ["04", "PROVENANCE", "/profile", "Origins, map + formation"],
] as const;

function BrandOrb({ tool }: { tool: Tool }) {
  const [failed, setFailed] = useState(!tool.src);
  return (
    <div className={styles.orbFace}>
      {!failed && tool.src ? <img src={tool.src} alt="" aria-hidden="true" onError={() => setFailed(true)} /> : <b>{tool.short}</b>}
      <span>{tool.name}</span><small>{tool.note}</small>
    </div>
  );
}

export default function HomeJourney() {
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = root.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = Math.max(1, el.offsetHeight - window.innerHeight);
      const p = Math.max(0, Math.min(1, -rect.top / travel));
      const nextStep = Math.min(6, Math.floor(p * 7));
      setProgress(p);
      setStep(nextStep);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const activeFamily: Family | null = step === 1 ? "design" : step === 2 ? "visual" : step === 3 ? "creative" : step === 4 ? "code" : step === 5 ? "data" : null;

  return (
    <section ref={root} className={`${styles.journey} ${styles[`step${step}`]}`} aria-label="Digital atelier journey">
      <div className={styles.sticky}>
        <div className={styles.frame} aria-hidden="true"><i /><i /><i /><i /></div>
        <div className={styles.topline}><span>BR / HOME EXPERIENCE</span><span>SCROLL TO TRAVEL</span><span>{String(Math.round(progress * 100)).padStart(3, "0")}%</span></div>

        <div className={styles.copy}>
          {step === 0 && <><p>00 / THE DIGITAL ATELIER</p><h2>One practice.<br /><em>Many instruments.</em></h2><span>The tools are not the work. They are the spatial language used to move from an idea to an experience.</span></>}
          {activeFamily && <><p>{familyMeta[activeFamily].index} / {familyMeta[activeFamily].eyebrow}</p><h2>{familyMeta[activeFamily].title.split(" / ")[0]}<br /><em>{familyMeta[activeFamily].title.split(" / ")[1]}.</em></h2><span>Move through the workflow. Each family activates a different layer of the same design system.</span></>}
          {step === 6 && <><p>06 / PORTFOLIO PLAN</p><h2>Choose<br /><em>where to enter.</em></h2><span>The tour ends here. The practice opens into four independent rooms.</span></>}
        </div>

        <div className={styles.system} aria-hidden={step === 6}>
          <div className={styles.architecture}>
            <i className={styles.slabA} /><i className={styles.slabB} /><i className={styles.slabC} />
            <span className={styles.axisA} /><span className={styles.axisB} />
            <b className={styles.core}>BR</b>
          </div>
          {(["design", "visual", "creative", "code", "data"] as Family[]).map((family) => (
            <div key={family} className={`${styles.family} ${styles[family]} ${activeFamily === family ? styles.active : ""}`}>
              {tools.filter((tool) => tool.family === family).map((tool, index) => (
                <article key={tool.name} className={`${styles.tool} ${styles[`position${index + 1}`]}`} style={{ animationDelay: `${index * -.9}s` }}>
                  <BrandOrb tool={tool} />
                </article>
              ))}
            </div>
          ))}
          <div className={styles.ringA} /><div className={styles.ringB} /><div className={styles.ringC} />
        </div>

        <div className={styles.chapterMenu} aria-hidden={step !== 6}>
          {chapters.map(([no, name, href, note]) => (
            <Link href={href} prefetch={false} key={href}>
              <span>{no}</span><strong>{name}</strong><small>{note}</small><b>↗</b>
            </Link>
          ))}
        </div>

        <div className={styles.progress}><i style={{ transform: `scaleX(${progress})` }} /></div>
        <div className={styles.bottomline}><span>DRAW</span><span>MODEL</span><span>EDIT</span><span>BUILD</span><span>DATA</span><span>ENTER</span></div>
      </div>
    </section>
  );
}
