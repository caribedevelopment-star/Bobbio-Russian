import type { Metadata } from "next";

export const metadata: Metadata = { title: "Practice", description: "Architectural design, digital development, visualization and project delivery." };

const chapters = [
  ["01","Architectural Design","Spatial planning, luxury interiors, premium kitchens, Total Living, bespoke furniture and material definition. The objective is not a standalone image, but a coherent environment built around use, proportion and detail."],
  ["02","Digital Development","Site capture and point clouds feed modeling and documentation workflows across SketchUp, AutoCAD, Revit, Metron, TopSolid and Blender, connecting measured reality with design decisions."],
  ["03","Visualization","Twinmotion, D5, V-Ray and Unreal workflows are used to test light, material atmosphere, animation, panoramas and immersive presentation before physical delivery."],
  ["04","Project Delivery","Quotations, supplier and manufacturing coordination, measurements, installation, site supervision and client communication close the distance between concept and built experience."],
] as const;

export default function PracticePage() {
  return (
    <main id="main">
      <header className="route-hero"><p className="route-eyebrow">02 · Practice</p><h1>Design is only the beginning.</h1><p className="route-hero__copy">The practice follows a project from spatial intent through technical development, visualization, manufacturing and installation.</p></header>
      <section className="shell route-section">
        <div className="route-grid"><div className="route-copy"><h2>From measured reality to lived space.</h2><p>The workflow combines architectural thinking, commercial awareness and technical coordination. Tools are selected for what they enable at each stage rather than displayed as isolated software skills.</p></div></div>
      </section>
      <section className="shell route-section"><div className="practice-chapters">{chapters.map(([index,title,copy])=><article className="practice-chapter" key={title}><span>{index}</span><h2>{title}</h2><p>{copy}</p></article>)}</div></section>
      <section className="process"><div className="shell process__inner"><p className="kicker">Immersive workflow</p><div className="route-grid"><div className="route-copy"><h2>360° — Del Bit al Átomo.</h2><p>Data capture through point clouds and Leica / Proliner systems supports high-fidelity 3D modeling. BIM, real-time path tracing and VR then make the proposal explorable before manufacturing and assembly.</p><a className="process-link" href="https://twinmotion.unrealengine.com/panorama/RNq6WfMy27Nonz23?lang=es-ES" target="_blank" rel="noreferrer">Open Twinmotion Panorama Set ↗</a></div></div></div></section>
    </main>
  );
}
