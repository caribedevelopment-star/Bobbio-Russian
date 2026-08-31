"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ArchitecturalNotation from "./ArchitecturalNotation";
import HomeLivingField from "./HomeLivingField";
import HomeWorldCanvas from "./HomeWorldCanvas";
import ToolMoleculeCanvas from "./ToolMoleculeCanvas";
import styles from "./HomeJourney.module.css";
import architectural from "./HomeJourneyArchitectural.module.css";
import molecule from "./ToolMolecules.module.css";
import polish from "./HomeJourneyPolish.module.css";

type Family = "design" | "visual" | "creative" | "code" | "data";
type Tool = { name: string; short: string; note: string; family: Family; company: string; src?: string };
type Layout = { x: number; y: number; size: number; mx: number; my: number; ms: number; rot: number };

const tools: Tool[] = [
  { name: "AutoCAD", short: "AC", note: "draw / dimension", family: "design", company: "Autodesk", src: "https://cdn.simpleicons.org/autodesk/FFFFFF" },
  { name: "Revit", short: "RV", note: "BIM / coordinate", family: "design", company: "Autodesk", src: "https://cdn.simpleicons.org/autodesk/FFFFFF" },
  { name: "SketchUp", short: "SU", note: "model / iterate", family: "design", company: "Trimble", src: "https://cdn.simpleicons.org/sketchup/FFFFFF" },
  { name: "BIM Systems", short: "BIM", note: "information / delivery", family: "design", company: "Open BIM" },
  { name: "D5 Render", short: "D5", note: "material / light", family: "visual", company: "D5", src: "https://www.d5render.com/favicon.ico" },
  { name: "Twinmotion", short: "TM", note: "immersive / 360°", family: "visual", company: "Epic Games", src: "https://www.twinmotion.com/favicon.ico" },
  { name: "Unreal Engine", short: "UE", note: "realtime / cinematic", family: "visual", company: "Epic Games", src: "https://cdn.simpleicons.org/unrealengine/FFFFFF" },
  { name: "V-Ray", short: "VR", note: "fidelity / material", family: "visual", company: "Chaos", src: "https://www.chaos.com/favicon.ico" },
  { name: "Blender", short: "BL", note: "geometry / assets", family: "visual", company: "Blender", src: "https://cdn.simpleicons.org/blender/FFFFFF" },
  { name: "Photoshop", short: "PS", note: "image / post", family: "creative", company: "Adobe", src: "https://cdn.simpleicons.org/adobephotoshop/FFFFFF" },
  { name: "Illustrator", short: "AI", note: "graphic / vector", family: "creative", company: "Adobe", src: "https://cdn.simpleicons.org/adobeillustrator/FFFFFF" },
  { name: "InDesign", short: "ID", note: "layout / editorial", family: "creative", company: "Adobe", src: "https://cdn.simpleicons.org/adobeindesign/FFFFFF" },
  { name: "Premiere Pro", short: "PR", note: "film / sequence", family: "creative", company: "Adobe", src: "https://cdn.simpleicons.org/adobepremierepro/FFFFFF" },
  { name: "After Effects", short: "AE", note: "motion / composite", family: "creative", company: "Adobe", src: "https://cdn.simpleicons.org/adobeaftereffects/FFFFFF" },
  { name: "Visual Studio Code", short: "VS", note: "code / prototype", family: "code", company: "Microsoft", src: "https://cdn.simpleicons.org/visualstudiocode/FFFFFF" },
  { name: "Codex", short: "CX", note: "AI / build / iterate", family: "code", company: "OpenAI", src: "https://cdn.simpleicons.org/openai/FFFFFF" },
  { name: "APIs", short: "API", note: "connect / automate", family: "code", company: "Web Systems" },
  { name: "SQL", short: "SQL", note: "query / structure", family: "data", company: "PostgreSQL", src: "https://cdn.simpleicons.org/postgresql/FFFFFF" },
  { name: "Supabase", short: "SB", note: "database / realtime", family: "data", company: "Supabase", src: "https://cdn.simpleicons.org/supabase/FFFFFF" },
  { name: "Excel", short: "XL", note: "analyse / organise", family: "data", company: "Microsoft", src: "https://cdn.simpleicons.org/microsoftexcel/FFFFFF" },
];

const toolLayouts: Record<Family, Layout[]> = {
  design: [
    { x: 38, y: 36, size: 128, mx: 28, my: 34, ms: 92, rot: -8 },
    { x: 58, y: 29, size: 96, mx: 68, my: 31, ms: 76, rot: 6 },
    { x: 43, y: 62, size: 112, mx: 31, my: 69, ms: 84, rot: 4 },
    { x: 65, y: 57, size: 86, mx: 70, my: 67, ms: 70, rot: -6 },
  ],
  visual: [
    { x: 31, y: 43, size: 92, mx: 25, my: 35, ms: 72, rot: -5 },
    { x: 48, y: 27, size: 132, mx: 68, my: 29, ms: 88, rot: 7 },
    { x: 67, y: 40, size: 104, mx: 24, my: 67, ms: 80, rot: -7 },
    { x: 42, y: 68, size: 116, mx: 69, my: 67, ms: 88, rot: 5 },
    { x: 65, y: 66, size: 82, mx: 50, my: 52, ms: 66, rot: -3 },
  ],
  creative: [
    { x: 33, y: 37, size: 102, mx: 27, my: 35, ms: 76, rot: -10 },
    { x: 50, y: 25, size: 124, mx: 68, my: 30, ms: 88, rot: 8 },
    { x: 69, y: 43, size: 86, mx: 24, my: 68, ms: 70, rot: -4 },
    { x: 40, y: 68, size: 110, mx: 69, my: 67, ms: 82, rot: 5 },
    { x: 62, y: 64, size: 96, mx: 50, my: 52, ms: 72, rot: -8 },
  ],
  code: [
    { x: 38, y: 36, size: 126, mx: 28, my: 35, ms: 92, rot: -7 },
    { x: 64, y: 39, size: 98, mx: 69, my: 35, ms: 78, rot: 6 },
    { x: 51, y: 65, size: 138, mx: 49, my: 69, ms: 96, rot: 3 },
  ],
  data: [
    { x: 35, y: 49, size: 102, mx: 26, my: 38, ms: 82, rot: -5 },
    { x: 52, y: 29, size: 128, mx: 70, my: 35, ms: 94, rot: 7 },
    { x: 66, y: 63, size: 92, mx: 49, my: 69, ms: 74, rot: -6 },
  ],
};

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
  ["03", "STUDIES IN LIGHT", "/renders", "Process + visualisation", "DRAW / MODEL / LIGHT"],
  ["04", "PROVENANCE", "/profile", "Origins, map + formation", "CARACAS / ITALY / MADRID"],
] as const;

const steps = ["ORIGIN", "DRAW", "MODEL", "EDIT", "BUILD", "DATA", "ENTER"];

function BrandOrb({ tool }: { tool: Tool }) {
  const [failed, setFailed] = useState(!tool.src);
  return (
    <div className={`${styles.orbFace} ${molecule.face}`}>
      <i className={styles.orbSpecular} />
      {!failed && tool.src ? <img src={tool.src} alt="" aria-hidden="true" onError={() => setFailed(true)} /> : <b>{tool.short}</b>}
      <span>{tool.name}</span><small>{tool.note}</small><em className={molecule.company}>{tool.company}</em>
    </div>
  );
}

export default function HomeJourney() {
  const root = useRef<HTMLElement>(null);
  const progressLine = useRef<HTMLElement>(null);
  const progressReadout = useRef<HTMLSpanElement>(null);
  const [step, setStep] = useState(0);
  const [hoveredTool, setHoveredTool] = useState(-1);

  useEffect(() => {
    let raf = 0;
    let currentStep = -1;
    const update = () => {
      const el = root.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = Math.max(1, el.offsetHeight - window.innerHeight);
      const p = Math.max(0, Math.min(1, -rect.top / travel));
      const nextStep = Math.min(6, Math.floor(p * 7));
      el.style.setProperty("--journey", `${p}`);
      if (progressLine.current) progressLine.current.style.transform = `scaleX(${p})`;
      if (progressReadout.current) progressReadout.current.textContent = `${String(Math.round(p * 100)).padStart(3, "0")}%`;
      if (nextStep !== currentStep) { currentStep = nextStep; setHoveredTool(-1); setStep(nextStep); }
    };
    const requestUpdate = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", requestUpdate); window.removeEventListener("resize", requestUpdate); };
  }, []);

  const goToStep = (index: number) => {
    const el = root.current;
    if (!el) return;
    const top = window.scrollY + el.getBoundingClientRect().top;
    const travel = Math.max(1, el.offsetHeight - window.innerHeight);
    const target = index === 6 ? 0.955 : (index + 0.18) / 7;
    window.scrollTo({ top: top + travel * target, behavior: "smooth" });
  };

  const activeFamily: Family | null = step === 1 ? "design" : step === 2 ? "visual" : step === 3 ? "creative" : step === 4 ? "code" : step === 5 ? "data" : null;
  const activeTools = activeFamily ? tools.filter((tool) => tool.family === activeFamily) : [];
  const layouts = activeFamily ? toolLayouts[activeFamily] : [];

  return (
    <section id="home-journey" ref={root} data-step={step} className={`${styles.journey} ${architectural.journey} ${polish.journey} ${styles[`step${step}`]}`} aria-label="Bobbio Russian digital atelier journey">
      <div className={`${styles.sticky} ${architectural.stage} ${polish.stage}`}>
        <HomeLivingField className={`${styles.livingField} ${architectural.living}`} />
        <HomeWorldCanvas className={`${styles.world} ${architectural.world}`} mode="journey" step={step} />
        <ArchitecturalNotation variant="journey" />
        <div className={`${styles.vignette} ${architectural.vignette}`} aria-hidden="true" />
        <div className={`${styles.planGrid} ${architectural.plan}`} aria-hidden="true"><span /><span /><span /><span /></div>
        <div className={styles.frame} aria-hidden="true"><i /><i /><i /><i /></div>

        <div className={polish.bridge} aria-hidden="true"><span>BOBBIO RUSSIAN</span><i /><b>DIGITAL ATELIER / 05 SYSTEMS</b></div>

        <div className={styles.topline}><span>BR / DIGITAL ATELIER</span><span>ARCHITECTURAL WORKFLOW / WEBGL</span><span ref={progressReadout}>000%</span></div>

        <nav className={styles.rail} aria-label="Journey chapters">
          {steps.map((label, index) => <button type="button" key={label} onClick={() => goToStep(index)} className={step === index ? styles.railActive : undefined}><i /><span>{String(index).padStart(2, "0")}</span><b>{label}</b></button>)}
        </nav>

        <div className={`${styles.copy} ${architectural.copy}`} aria-live="polite">
          <div className={styles.copyRule}><i /><span>SECTION / {String(step).padStart(2, "0")}</span></div>
          {step === 0 && <><p>00 / THE DIGITAL ATELIER</p><h2>Structure.<br /><em>Then life.</em></h2><span>The same architectural field carries the whole journey. Beams, sections, drawing geometry and tools reorganise as the practice moves from line to space, image, code and data.</span></>}
          {activeFamily && <><p>{familyMeta[activeFamily].index} / {familyMeta[activeFamily].eyebrow}</p><h2>{familyMeta[activeFamily].title}<br /><em>{familyMeta[activeFamily].emphasis}</em></h2><span>{familyMeta[activeFamily].body}</span></>}
          {step === 6 && <><p>06 / PORTFOLIO PLAN</p><h2>Choose<br /><em>where to enter.</em></h2><span>The structural field clears and becomes four rooms. Choose the part of the practice you want to inspect.</span></>}
        </div>

        <div data-family={activeFamily ?? "none"} className={`${styles.toolLayer} ${activeFamily ? styles.toolLayerActive : ""} ${molecule.shell} ${architectural.tools} ${polish.toolShell} ${activeFamily ? `${molecule.active} ${molecule[activeFamily]}` : ""}`} aria-hidden={!activeFamily}>
          <ToolMoleculeCanvas className={molecule.canvas} family={activeFamily} hovered={hoveredTool} />
          <div className={`${styles.toolHeader} ${molecule.header}`}><span>{activeFamily ? familyMeta[activeFamily].eyebrow : "DIGITAL TOOLCHAIN"}</span><b>{String(activeTools.length).padStart(2, "0")} INSTRUMENTS</b></div>
          <div className={`${styles.tools} ${molecule.cluster}`}>
            {activeTools.map((tool, index) => {
              const layout = layouts[index] ?? layouts[0];
              const interaction = ["magnet", "ripple", "shear", "bloom", "vortex"][index % 5];
              const toolStyle = layout ? {
                "--x": `${layout.x}%`, "--y": `${layout.y}%`, "--size": `${layout.size}px`,
                "--mx": `${layout.mx}%`, "--my": `${layout.my}%`, "--msize": `${layout.ms}px`,
                "--rot": `${layout.rot}deg`, "--delay": `${index * -0.72}s`,
              } as React.CSSProperties : undefined;
              return (
                <article key={tool.name} data-interaction={interaction} className={`${styles.tool} ${molecule.tool}`} style={toolStyle} onPointerEnter={() => setHoveredTool(index)} onPointerLeave={() => setHoveredTool(-1)}>
                  <BrandOrb tool={tool} />
                </article>
              );
            })}
          </div>
        </div>

        <div className={styles.worldMeta} aria-hidden="true"><span>A—A / STRUCTURAL WORKFLOW</span><b>±0.00</b><small>REALTIME MODEL / SCROLL LINKED</small></div>
        <div className={styles.measure} aria-hidden="true"><i /><span>8.40 m</span><i /></div>

        <div id="portfolio-menu" className={`${styles.chapterMenu} ${architectural.chapter}`} aria-hidden={step !== 6}>
          <div className={styles.menuIntro}><span>SELECT A ROOM</span><b>04 CHAPTERS / ONE PRACTICE</b></div>
          {chapters.map(([no, name, href, note, meta]) => <Link href={href} prefetch={false} key={href} tabIndex={step === 6 ? 0 : -1}><span>{no}</span><div><small>{meta}</small><strong>{name}</strong><p>{note}</p></div><b>↗</b><i className={styles.menuOrganism}><em /><em /><em /></i></Link>)}
        </div>

        <div className={styles.hint}><i /><span>{step < 6 ? "SCROLL / THE STRUCTURE RECONFIGURES" : "SELECT A CHAPTER"}</span></div>
        <div className={styles.progress}><i ref={progressLine} /></div>
        <div className={styles.bottomline}>{steps.slice(1).map((label) => <span key={label}>{label}</span>)}</div>
      </div>
      <span id="home-journey-end" className={styles.menuAnchor} aria-hidden="true" />
    </section>
  );
}
