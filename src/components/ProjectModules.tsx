import Link from "next/link";
import type { Project } from "@/content/site";
import { projects } from "@/content/site";
import { MediaFrame, PanoramaExperience } from "./Media";

export function ProjectCard({ project, index }: { project: Project; index: number }) { return <article className={`project-card project-${index}`}><Link href={`/work/${project.slug}`}><MediaFrame media={project.cover} /><div className="project-card-copy"><span>0{index + 1} / {project.disciplines[0]}</span><h3>{project.title}</h3><p>{project.subtitle}</p></div></Link></article>; }
export function ProjectHero({ project }: { project: Project }) { return <header className="project-hero"><div><p className="kicker">{project.disciplines.join(" · ")}</p><h1>{project.title}</h1><p>{project.subtitle}</p></div><MediaFrame media={project.cover} /></header>; }
export function ProjectIntroduction({ project }: { project: Project }) { return <section className="project-intro section"><p className="section-label">Introduction</p><h2>{project.summary}</h2></section>; }
export function ProjectMetadata({ project }: { project: Project }) { return <aside className="metadata"><div><span>Status</span><p>{project.status}</p></div><div><span>Disciplines</span><p>{project.disciplines.join(", ")}</p></div></aside>; }
export function FullBleedMedia({ project }: { project: Project }) { return <MediaFrame media={project.cover} className="full-bleed" />; }
export function EditorialGallery({ project }: { project: Project }) { return <section className="editorial-gallery" aria-label="Project media"><MediaFrame media={{...project.cover, caption: "Spatial study"}} /><MediaFrame media={{...project.cover, tone: project.cover.tone === "green" ? "dark" : "stone", caption: "Technical layer"}} /></section>; }
export function VideoSection() { return null; }
export function PanoramaPreview({ project }: { project: Project }) { return <section className="section"><p className="section-label">Immersive view</p><PanoramaExperience media={{...project.cover, caption: `${project.title} / panorama preview`}} /></section>; }
export function ProcessTimeline({ project }: { project: Project }) { return <section className="section process"><p className="section-label">From bit to matter</p>{project.process.map((step, i) => <div key={step.label}><b>0{i + 1}</b><h3>{step.label}</h3><p>{step.text}</p></div>)}</section>; }
export function TechnicalLayers({ project }: { project: Project }) { return <section className="technical-layers section"><p className="section-label">Technical layers</p><p>Project-specific drawings and original technical documentation are being prepared for publication.</p></section>; }
export function MaterialPalette() { return null; }
export function DrawingViewer() { return null; }
export function ProjectCredits({ project }: { project: Project }) { return <section className="credits section"><p className="section-label">Credits</p>{project.credits.map(x => <p key={x}>{x}</p>)}</section>; }
export function NextProject({ project }: { project: Project }) { const next = projects.find(p => p.slug === project.nextProject)!; return <Link className="next-project" href={`/work/${next.slug}`}><span>Next project</span><strong>{next.title}</strong><i aria-hidden="true">↗</i></Link>; }
