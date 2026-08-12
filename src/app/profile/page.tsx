import type { Metadata } from "next";
import IdentityGlobe from "../../components/IdentityGlobe";
import styles from "./profile.module.css";

export const metadata: Metadata = { title: "Profile + Education", description: "Alessandro Bobbio Russian — Venezuelan, Italian, Madrid-based designer. Profile, travel and education." };

const education = [
  { no: "01", ghost: "LS", institution: "Colegio La Salle", place: "Caracas · Venezuela", title: "School Formation", text: "The first layer: discipline, structure and curiosity. Caracas is where my visual and cultural point of view began." },
  { no: "02", ghost: "UCAB", institution: "Universidad Católica Andrés Bello", place: "Caracas · Venezuela", title: "Civil Engineering Studies", text: "Engineering gave me systems thinking, technical logic and a rigorous relationship with structure, scale and feasibility." },
  { no: "03", ghost: "IED", institution: "IED Madrid", place: "Madrid · Spain", title: "Interior Design", text: "At IED, technical thinking became spatial narrative: material, atmosphere, furniture, light and human experience." },
];

export default function ProfilePage() {
  return (
    <main className="pageEnter pagePadTop">
      <section className={styles.profile}>
        <header className={styles.header}>
          <p className="eyebrow darkEyebrow" data-reveal>04 / PROFILE + EDUCATION</p>
          <h1 data-reveal>Venezuelan by origin.<br /><em>Italian by identity.</em><br />Based in Madrid.</h1>
          <p data-reveal>I&apos;m Alessandro Bobbio Russian — Venezuelan-born, Italian by citizenship and family identity, living and working in Madrid. Travel and work have added Miami and the Netherlands to that map.</p>
        </header>

        <div className={styles.profileGrid}>
          <div className={styles.copy} data-reveal>
            <p className={styles.lead}>Caracas is my origin. Italy is part of who I am. Madrid is the base from which my professional practice keeps evolving.</p>
            <p>That combination shapes my design language: Latin warmth, European rigor and an international curiosity built through movement, observation and different ideas of what home can mean.</p>
            <div className={styles.identityCards}>
              <article><span>ORIGIN</span><b>Caracas</b><small>Venezuela · root + first cultural lens</small></article>
              <article><span>IDENTITY</span><b>Italy</b><small>Citizenship · heritage · family identity</small></article>
              <article><span>BASE</span><b>Madrid</b><small>Spain · current home + professional base</small></article>
            </div>
          </div>
          <div className={styles.globePanel} data-reveal>
            <div className={styles.globe}><IdentityGlobe /><span className={styles.drag}>DRAG THE PLANET ↔</span></div>
            <div className={styles.legend}>
              <div><i className={styles.heritage} /><span><b>ROOT / IDENTITY</b><small>Caracas → Madrid · Caracas → Italy</small></span></div>
              <div><i className={styles.journey} /><span><b>WORK / TRAVEL</b><small>Madrid → Miami · Madrid → Netherlands</small></span></div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.education}>
        <header className={styles.educationHeader} data-reveal><p className="eyebrow">EDUCATION / CHRONOLOGY</p><h2>Three institutions.<br /><em>One evolving discipline.</em></h2><p>Foundation → engineering logic → interior design. The timeline now lives inside Profile so the page reads as one continuous biography.</p></header>
        <div className={styles.timeline} data-reveal>
          <div className={styles.rail}><span /></div>
          {education.map((item, index) => (
            <article className={styles.timelineItem} key={item.no}>
              <div className={styles.node}><span>{item.no}</span><i /></div>
              <div className={styles.card}>
                <div className={styles.ghost}>{item.ghost}</div>
                <p>{item.place}</p><h3>{item.institution}</h3><h4>{item.title}</h4><p>{item.text}</p>
                <div className={styles.pulse} style={{ animationDelay: `${index * .8}s` }} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
