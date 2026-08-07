import Link from "next/link";
import type { Project } from "@/content/site";

const nav = [
  ["Index", "/"],
  ["Work", "/work"],
  ["Practice", "/practice"],
  ["Bio-Design", "/bio-design"],
  ["Profile", "/profile"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Alessandro Bobbio Russian — home">
        <span className="brand-mark">ABR</span>
        <span className="brand-name">Alessandro Bobbio Russian</span>
      </Link>
      <nav className="primary-nav" aria-label="Primary navigation">
        {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div><p className="kicker">Madrid · Spain</p><p className="footer-title">From Bit to Matter.</p></div>
      <div className="footer-links">
        <a href="https://www.linkedin.com/in/bobbiorussian/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
        <Link href="/contact">Contact</Link>
      </div>
      <p className="footer-meta">Architectural Designer · Luxury Interiors · Bio-Designer</p>
    </footer>
  );
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link className="project-card" href={`/work/${project.slug}`}>
      <div className="project-card__media">
        {project.cover ? <img src={project.cover} alt="" loading="lazy" /> : (
          <div className="project-card__poster"><span>{String(index + 1).padStart(2, "0")}</span><small>Film / Case study</small></div>
        )}
        <span className="project-card__number">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="project-card__body"><p>{project.eyebrow}</p><h3>{project.title}</h3><span>View project ↗</span></div>
    </Link>
  );
}

export function SectionIntro({ index, label, title, copy }: { index: string; label: string; title: string; copy?: string }) {
  return (
    <div className="section-intro">
      <p className="section-index">{index}</p><p className="kicker">{label}</p><h2>{title}</h2>{copy ? <p className="section-copy">{copy}</p> : null}
    </div>
  );
}
