import Link from "next/link";
import { ProjectCard, SectionIntro } from "@/components/SiteChrome";
import { capabilities, ecosystem, projects } from "@/content/site";

export default function Home() {
  return (
    <main id="main">
      <section className="hero">
        <div className="hero__media"><img src="https://bobbio-russian.carrd.co/assets/images/gallery05/3dc68b3a.jpg?v=a4fe6713" alt="Contemporary interior visualization" /><div className="hero__veil" /></div>
        <div className="hero__content">
          <p className="hero__location">Madrid · Spain</p>
          <h1>Alessandro<span>Bobbio Russian</span></h1>
          <div className="hero__bottom"><p>Architectural Designer · Luxury Interiors · Bio-Designer</p><p className="hero__manifesto">From Bit to Matter.</p></div>
        </div>
      </section>

      <section className="statement shell">
        <p className="statement__lead">Designing the transition from <em>digital vision</em> to <em>physical experience.</em></p>
        <p className="statement__copy">A multidisciplinary practice connecting luxury interiors, technical development, visualization and productive architecture—from capture and concept to manufacturing, installation and lived experience.</p>
      </section>

      <section className="duality">
        <article className="duality__panel duality__panel--architecture">
          <div className="duality__top"><span>01</span><span>Architectural Design</span></div>
          <h2>Spaces shaped around how people actually live.</h2>
          <p>Luxury residential interiors, Total Living, premium kitchens, bespoke furniture, material definition, visualization and project delivery.</p>
          <Link href="/practice">Explore practice ↗</Link>
        </article>
        <article className="duality__panel duality__panel--bio">
          <img src="https://bobbio-russian.carrd.co/assets/images/image03.png?v=a4fe6713" alt="" /><div className="duality__overlay" />
          <div className="duality__top"><span>02</span><span>Bio-Design</span></div>
          <h2>Architecture as a productive ecosystem.</h2>
          <p>Biomimetic thinking, productive architecture, hydroponic and aeroponic systems, digital twins and resilient environments.</p>
          <Link href="/bio-design">Enter bio-design ↗</Link>
        </article>
      </section>

      <section className="work-section shell">
        <SectionIntro index="03" label="Selected work" title="Built thinking, visualized." copy="Real material from the existing portfolio, reorganized into a clearer architectural narrative." />
        <div className="project-grid">{projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>
        <Link className="big-link" href="/work">View all work <span>↗</span></Link>
      </section>

      <section className="process">
        <div className="shell process__inner">
          <SectionIntro index="04" label="From Bit to Matter" title="A project is a chain of decisions." copy="Reality is captured, translated into data, designed, visualized, validated and finally delivered as physical experience." />
          <ol className="process-line">{["Reality","Capture","Model","Design","Visualize","Validate","Manufacture","Install","Experience"].map((step,index)=><li key={step}><span>{String(index+1).padStart(2,"0")}</span><strong>{step}</strong></li>)}</ol>
          <a className="process-link" href="https://twinmotion.unrealengine.com/panorama/RNq6WfMy27Nonz23?lang=es-ES" target="_blank" rel="noreferrer">Enter Panorama Set 360° ↗</a>
        </div>
      </section>

      <section className="capabilities shell">
        <SectionIntro index="05" label="Capabilities" title="Tools matter when they move a project forward." />
        <div className="capability-list">{capabilities.map(item=><article key={item.title}><span>{item.index}</span><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div>
      </section>

      <section className="ecosystem shell">
        <SectionIntro index="06" label="Professional ecosystem" title="Design happens through relationships." />
        <div className="ecosystem-list">{ecosystem.map(item=><a key={item.name} href={item.href} target="_blank" rel="noreferrer"><span>{item.name}</span><small>{item.relation}</small><b>↗</b></a>)}</div>
      </section>

      <section className="origin">
        <div className="origin__copy"><p className="kicker">07 · Origins</p><h2>Born in Caracas.<br />Shaped by Italian roots.<br />Developed in Madrid.</h2><p>A practice informed by structural thinking, migration, material culture and a continuous search for ways to connect technology with human experience.</p><Link href="/profile">Behind the design ↗</Link></div>
        <div className="origin__image"><img src="https://bobbio-russian.carrd.co/assets/images/gallery05/ed2a2e65.jpg?v=a4fe6713" alt="" loading="lazy" /></div>
      </section>

      <section className="closing shell"><p className="kicker">Selected collaborations</p><h2>Architecture, interiors and systems that move from idea to experience.</h2><Link className="big-link" href="/contact">Start a conversation <span>↗</span></Link></section>
    </main>
  );
}
