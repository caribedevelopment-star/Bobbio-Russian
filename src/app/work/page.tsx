import type { Metadata } from "next";
import { ProjectCard } from "@/components/SiteChrome";
import { projects } from "@/content/site";

export const metadata: Metadata = { title: "Work", description: "Selected architectural, visualization and bio-design work by Alessandro Bobbio Russian." };

export default function WorkPage() {
  return (
    <main id="main">
      <header className="route-hero">
        <p className="route-eyebrow">01 · Selected Work</p>
        <h1>Work across space, image and systems.</h1>
        <p className="route-hero__copy">A curated index connecting luxury interiors, visualization, technical thinking and productive architecture.</p>
      </header>
      <section className="shell route-section">
        <div className="project-grid">{projects.map((project,index)=><ProjectCard key={project.slug} project={project} index={index} />)}</div>
      </section>
      <section className="shell route-section">
        <p className="kicker">Technical index</p>
        <div className="index-list">{projects.map((project,index)=><a key={project.slug} href={`/work/${project.slug}`}><span>{String(index+1).padStart(2,"0")}</span><strong>{project.title}</strong><small>{project.eyebrow}</small><b>↗</b></a>)}</div>
      </section>
    </main>
  );
}
