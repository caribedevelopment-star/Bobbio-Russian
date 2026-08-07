import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/content/site";

export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  if (!project) notFound();
  const currentIndex = projects.findIndex(item => item.slug === slug);
  const next = projects[(currentIndex + 1) % projects.length];

  return (
    <main id="main">
      <header className="project-hero">
        <div className="project-hero__media">
          {project.cover ? <img src={project.cover} alt="" /> : <div className="project-card__poster"><span>{String(currentIndex+1).padStart(2,"0")}</span><small>{project.eyebrow}</small></div>}
        </div>
        <div className="project-hero__shade" />
        <div className="project-hero__content"><p className="route-eyebrow">{project.eyebrow}</p><h1>{project.title}</h1></div>
      </header>
      <section className="shell project-body">
        <div className="project-intro">
          <p className="project-intro__summary">{project.summary}</p>
          <dl className="project-meta">{project.meta.map(item=><div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
        </div>
        <div className="project-prose">{project.body.map(paragraph=><p key={paragraph}>{paragraph}</p>)}{project.external ? <a className="process-link" href={project.external.href} target="_blank" rel="noreferrer">{project.external.label} ↗</a> : null}</div>
        {project.video ? <div className="project-video"><iframe src={project.video} title={`${project.title} video`} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen loading="lazy" /></div> : null}
        {project.gallery ? <div className="project-gallery">{project.gallery.map((image,index)=><figure key={image}><img src={image} alt={`${project.title} — view ${index+1}`} loading="lazy" /></figure>)}</div> : null}
        <div className="project-next"><p className="kicker">Next project</p><Link className="big-link" href={`/work/${next.slug}`}>{next.title}<span>↗</span></Link></div>
      </section>
    </main>
  );
}
