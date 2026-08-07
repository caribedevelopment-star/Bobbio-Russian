import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile", description: "Origins, formation and design trajectory of Alessandro Bobbio Russian." };

const timeline = [
  ["01","Caracas","Born in Caracas to an Italian family, with identity shaped by the convergence of Venezuelan and Italian cultural legacies."],
  ["02","La Salle","An early education associated with discipline, integrity and perseverance, before moving toward construction and spatial thinking."],
  ["03","Civil Engineering","Civil Engineering studies at Universidad Católica in Caracas established a foundation in structure, systems, precision and the craft of building."],
  ["04","Madrid","Migration and travel expanded the cultural frame of the practice, eventually leading to Madrid as the base for professional and creative development."],
  ["05","IED Madrid","Interior Design studies at IED deepened spatial thinking through material exploration, human scale, furniture, concept development and sustainable design methodologies."],
  ["06","Current Practice","Luxury interiors, Total Living, digital visualization and Bio-Design now operate as connected dimensions of a practice moving from data and concept to physical experience."],
] as const;

export default function ProfilePage() {
  return (
    <main id="main">
      <header className="route-hero"><p className="route-eyebrow">04 · Profile</p><h1>Behind the design.</h1><p className="route-hero__copy">Born in Caracas. Shaped by Italian roots. Developed in Madrid. A trajectory where structural logic and spatial sensitivity increasingly converge.</p></header>
      <section className="shell route-section"><div className="route-grid"><div className="route-copy"><h2>Structure meets sensitivity.</h2><p>The practice is grounded in building logic but developed through interior architecture, visualization and systems thinking. Rather than separating technical and creative work, the portfolio treats them as consecutive layers of the same process.</p></div></div><div className="profile-timeline">{timeline.map(([index,title,copy])=><article key={title}><span>{index}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
      <section className="process"><div className="shell process__inner"><p className="kicker">Formation</p><div className="practice-chapters"><article className="practice-chapter"><span>01</span><h2>Civil Engineering</h2><p>Structural logic, technical precision and construction thinking.</p></article><article className="practice-chapter"><span>02</span><h2>Interior Design</h2><p>Spatial experience, materiality, human scale, concept, furniture and sustainable design at IED Madrid.</p></article><article className="practice-chapter"><span>03</span><h2>Professional Practice</h2><p>Luxury interiors, Total Living, visualization, suppliers, manufacturing, installation and project delivery.</p></article><article className="practice-chapter"><span>04</span><h2>Independent Research</h2><p>Productive architecture, hydroponics, aeroponics, digital twins and resilient systems.</p></article></div></div></section>
    </main>
  );
}
