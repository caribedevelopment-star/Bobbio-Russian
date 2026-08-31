"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import HomeLivingField from "./HomeLivingField";
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
  { name: "Photoshop", short: "PS", note: "image / post", family: "creative", src: "https://cdn.simpleicons.org/adobephotoshop/FFFFFF" },
  { name: "Illustrator", short: "AI", note: "graphic / vector", family: "creative", src: "https://cdn.simpleicons.org/adobeillustrator/FFFFFF" },
  { name: "InDesign", short: "ID", note: "layout / editorial", family: "creative", src: "https://cdn.simpleicons.org/adobeindesign/FFFFFF" },
  { name: "Premiere Pro", short: "PR", note: "film / sequence", family: "creative", src: "https://cdn.simpleicons.org/adobepremierepro/FFFFFF" },
  { name: "After Effects", short: "AE", note: "motion / composite", family: "creative", src: "https://cdn.simpleicons.org/adobeaftereffects/FFFFFF" },
  { name: "Visual Studio Code", short: "VS", note: "code / prototype", family: "code", src: "https://cdn.simpleicons.org/visualstudiocode/FFFFFF" },
  { name: "Codex", short: "CX", note: "AI / build / iterate", family: "code", src: "https://cdn.simpleicons.org/openai/FFFFFF" },
  { name: "APIs", short: "API", note: "connect / automate", family: "code" },
  { name: "SQL", short: "SQL", note: "query / structure", family: "data", src: "https://cdn.simpleicons.org/postgresql/FFFFFF" },
  { name: "Supabase", short: "SB", note: "database / realtime", family: "data", src: "https://cdn.simpleicons.org/supabase/FFFFFF" },
  { name: "Excel", short: "XL", note: "analyse / organise", family: "data", src: "https://cdn.simpleicons.org/microsoftexcel/FFFFFF" },
];

const familyMeta: Record<Family, { index: string; title: string; emphasis: string; eyebrow: string; body: string }> = {
  design: { index: "01", title: "Draw", emphasis: "coordinate.", eyebrow: "ARCHITECTURE + BIM", body: "Lines become constraints, dimensions become relationships and the model starts carrying information." },
  visual: { index: "02", title: "Model", emphasis: "illuminate.", eyebrow: "SPACE + REALTIME", body: "Geometry becomes atmosphere. Camera, material and light are tested as spatial decisions rather than decoration." },
  creative: { index: "03", title: "Edit", emphasis: "communicate.", eyebrow: "ADOBE + NARRATIVE", body: "The project becomes legible through image, sequence, typography and motion without losing architectural intent." },
  code: { index: "04", title: "Build", emphasis: "connect.", eyebrow: "CODE + AI + APIs", body: "Interfaces, automation and AI extend the design process into interactive systems that can react and evolve." },
  data: { index: "05", title: "Structure", emphasis: "learn.", eyebrow: "DATA + SYSTEMS", body: "Information is organised so projects, tools and digital experiences can remain coherent as they grow." },
};

const chapters = [
  ["01", "ATELIER", "/practice", "Architecture, interiors + direction", "SPACE / DETAIL / SYSTEM"],
  ["02", "CULTIVATED MATTER", "/work", "Bio-design, systems + Urban Ponics", "LIVING / DIGITAL / EXPERIMENTAL"],
  ["03", "STUDIES IN LIGHT", "/renders", "Process, tools + visualisation", "DRAW / MODEL / LIGHT"],
  ["04", "PROVENANCE", "/profile", "Origins, map + formation", "CARACAS / ITALY / MADRID"],
] as const;

const steps = ["ORIGIN", "DRAW", "MODEL", "EDIT", "BUILD", "DATA", "ENTER"];

function BrandOrb({ tool }: { tool: Tool }) {
  const [failed, setFailed] = useState(!tool.src);
  return (
    <div className={styles.orbFace}>
      <i className={styles.orbSpecular} />
      {!failed && tool.src ? <img src={tool.src} alt="" aria-hidden="true" onError={() => setFailed(true)} /> : <b>{tool.short}</b>}
      <span>{tool.name}</span>
      <small>{tool.note}</small>
    </div>
  );
}

export default function HomeJourney() {
  const root = useRef<HTMLElement>(null);
  const progressLine = useRef<HTMLElement>(null);
  const progressReadout = useRef<HTMLSpanElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let raf = 0;
    let currentStep = -1;

    const update = () => {
      const el = root.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = Math.max(1, el.offsetHeight - window.innerHeight);
      const p = Math.max(0, Math.min(1, -rect.top / travel));
      const scaled = p * 7;
      const nextStep = Math.min(6, Math.floor(scaled));
      const local = Math.max(0, Math.min(1, scaled - nextStep));

      el.style.setProperty("--journey", `${p}`);
      el.style.setProperty("--local", `${local}`);
      if (progressLine.current) progressLine.current.style.transform = `scaleX(${p})`;
      if (progressReadout.current) progressReadout.current.textContent = `${String(Math.round(p * 100)).padStart(3, "0")}%`;
      if (nextStep !== currentStep) {
        currentStep = nextStep;
        setStep(nextStep);
      }
    };

    const requestUpdate = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const el = root.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--jx", `${(event.clientX - rect.left) / Math.max(1, rect.width)}`);
    el.style.setProperty("--jy", `${(event.clientY - rect.top) / Math.max(1, rect.height)}`);
  };

  const goToStep = (index: number) => {
    const el = root.current;
    if (!el) return;
    const top = window.scrollY + el.getBoundingClientRect().top;
    const travel = Math.max(1, el.offsetHeight - window.innerHeight);
    const targetProgress = index === 6 ? 0.94 : Math.min(0.84, (index + 0.22) / 7);
    window.scrollTo({ top: top + travel * targetProgress, behavior: "smooth" });
  };

  const activeFamily: Family | null = step === 1 ? "design" : step === 2 ? "visual" : step === 3 ? "creative" : step === 4 ? "code" : step === 5 ? "data" : null;

  return (
    <section id="home-journey" ref={root} onPointerMove={onPointerMove} className={`${styles.journey} ${styles[`step${step}`]}`} aria-label="Bobbio Russian digital atelier journey">
      <div className={styles.sticky}>
        <HomeLivingField className={styles.livingField} />
        <div className={styles.atmosphere} aria-hidden="true" />
        <div className={styles.frame} aria-hidden="true"><i /><i /><i /><i /></div>
        <div className={styles.planGrid} aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
        <div className={styles.contour} aria-hidden="true"><i /><i /><i /></div>

        <div className={styles.topline}>
          <span>BR / DIGITAL ATELIER</span>
          <span>SCROLL-SYNCHRONISED SPATIAL WORKFLOW</span>
          <span ref={progressReadout}>000%</span>
        </div>

        <nav className={styles.rail} aria-label="Journey chapters">
          {steps.map((label, index) => (
            <button type="button" key={label} onClick={() => goToStep(index)} className={step === index ? styles.railActive : undefined} aria-label={`Go to ${label}`}>
              <i /><span>{String(index).padStart(2, "0")}</span><b>{label}</b>
            </button>
          ))}
        </nav>

        <div className={styles.copy} aria-live="polite">
          <div className={styles.copyRule}><i /><span>SECTION / {String(step).padStart(2, "0")}</span></div>
          {step === 0 && <><p>00 / THE DIGITAL ATELIER</p><h2>One practice.<br /><em>Many instruments.</em></h2><span>Scroll through the system. The same architectural core changes character as different tools enter the workflow.</span></>}
          {activeFamily && <><p>{familyMeta[activeFamily].index} / {familyMeta[activeFamily].eyebrow}</p><h2>{familyMeta[activeFamily].title}<br /><em>{familyMeta[activeFamily].emphasis}</em></h2><span>{familyMeta[activeFamily].body}</span></>}
          {step === 6 && <><p>06 / PORTFOLIO PLAN</p><h2>Choose<br /><em>where to enter.</em></h2><span>The guided tour ends here. Four rooms open into the work, process and origins behind the practice.</span></>}
        </div>

        <div className={styles.system} aria-hidden={step === 6}>
          <div className={styles.energyPlane} />
          <div className={styles.architecture}>
            <i className={styles.slabA} /><i className={styles.slabB} /><i className={styles.slabC} />
            <i className={styles.columnA} /><i className={styles.columnB} /><i className={styles.columnC} />
            <span className={styles.axisA} /><span className={styles.axisB} /><span className={styles.axisC} />
            <span className={styles.bridgeA} /><span className={styles.bridgeB} />
            <b className={styles.core}><em>BR</em><i /></b>
          </div>

          {(["design", "visual", "creative", "code", "data"] as Family[]).map((family) => {
            const familyTools = tools.filter((tool) => tool.family === family);
            return (
              <div key={family} className={`${styles.family} ${styles[family]} ${activeFamily === family ? styles.active : ""}`}>
                <div className={styles.orbitTrack} />
                {familyTools.map((tool, index) => {
                  const angle = -94 + (360 / familyTools.length) * index;
                  const radius = 210 + (index % 2) * 34;
                  return (
                    <article key={tool.name} className={styles.tool} style={{ "--angle": `${angle}deg`, "--radius": `${radius}px`, "--delay": `${index * -0.73}s` } as React.CSSProperties}>
                      <BrandOrb tool={tool} />
                    </article>
                  );
                })}
              </div>
            );
          })}

          <div className={styles.ringA} /><div className={styles.ringB} /><div className={styles.ringC} />
          <div className={styles.measureA}><i /><span>8.40 m</span><i /></div>
          <div className={styles.measureB}><span>±0.00</span></div>
          <div className={styles.datum}>A—A / LIVING WORKFLOW</div>
          <div className={styles.particles}><i /><i /><i /><i /><i /><i /></div>
        </div>

        <div id="portfolio-menu" className={styles.chapterMenu} aria-hidden={step !== 6}>
          <div className={styles.menuIntro}><span>SELECT A ROOM</span><b>04 CHAPTERS / ONE PRACTICE</b></div>
          {chapters.map(([no, name, href, note, meta]) => (
            <Link href={href} prefetch={false} key={href} tabIndex={step === 6 ? 0 : -1}>
              <span>{no}</span>
              <div><small>{meta}</small><strong>{name}</strong><p>{note}</p></div>
              <b>↗</b>
              <i className={styles.menuOrganism}><em /><em /><em /></i>
            </Link>
          ))}
        </div>

        <div className={styles.hint}><i /><span>{step < 6 ? "KEEP SCROLLING / THE SYSTEM WILL CHANGE" : "SELECT A CHAPTER / OR CONTINUE DOWN"}</span></div>
        <div className={styles.progress}><i ref={progressLine} /></div>
        <div className={styles.bottomline}><span>DRAW</span><span>MODEL</span><span>EDIT</span><span>BUILD</span><span>DATA</span><span>ENTER</span></div>
      </div>
      <span id="home-journey-end" className={styles.menuAnchor} aria-hidden="true" />
    </section>
  );
}
