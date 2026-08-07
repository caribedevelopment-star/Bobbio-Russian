import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Bio-Design", description: "Productive architecture, Urban Ponics and resilient systems." };

export default function BioDesignPage() {
  return (
    <main id="main">
      <header className="route-hero"><p className="route-eyebrow">03 · Bio-Design</p><h1>Architecture as a productive ecosystem.</h1><p className="route-hero__copy">A second dimension of the same design practice: systems thinking applied to food production, bioclimatic performance and resilient urban environments.</p></header>
      <section className="bio-feature">
        <div className="bio-feature__media"><img src="https://bobbio-russian.carrd.co/assets/images/image03.png?v=a4fe6713" alt="Productive architecture visualization" /></div>
        <div className="bio-feature__copy"><p className="kicker">The Architecture of Sustenance</p><h2>Digital twin first. Physical system second.</h2><p>Projects begin with a digital twin so spatial, environmental and productive ideas can be tested before construction. Bioclimatic design, hydroponic and aeroponic systems and advanced materials are treated as one connected habitat.</p><Link className="process-link" href="/work/architecture-of-sustenance">View case study ↗</Link></div>
      </section>
      <section className="shell route-section"><div className="route-grid"><div className="route-copy"><p className="kicker">Urban Ponics</p><h2>Technology serving productive space.</h2><p>The collaboration explores biomimetic innovation, Full Spectrum Farming, NACAR plant nutrition, parametric design and circular manufacturing as tools for evolving static structures into productive ecosystems capable of operating across climates.</p></div></div><div className="project-video"><iframe src="https://player.vimeo.com/video/1211006561?h=3526d55a15&dnt=1" title="Urban Ponics" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen /></div></section>
      <section className="process"><div className="shell process__inner"><p className="kicker">Continuity</p><div className="route-grid"><div className="route-copy"><h2>From OAYA to productive habitats.</h2><p>OAYA already connected architecture, community and urban farming in Petare. The current Bio-Design direction expands that interest toward digital twins, controlled growing systems and circular productive environments.</p><Link className="process-link" href="/work/oaya">Explore OAYA ↗</Link></div></div></div></section>
    </main>
  );
}
