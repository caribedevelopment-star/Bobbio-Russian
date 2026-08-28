import type { Metadata } from "next";
import IdentityGlobe from "../../components/IdentityGlobe";
import GlobePrompt from "../../components/GlobePrompt";
import Lexicon from "../../components/Lexicon";
import styles from "./profile.module.css";

export const metadata: Metadata = { title: "Genesis", description: "Alessandro Bobbio Russian — Venezuelan, Italian, Madrid-based designer. Identity, travel and education." };

const education = [
  { no: "01", ghost: "LS", institution: "Colegio La Salle", place: "Caracas · Venezuela", title: "School Formation", text: "The first layer: discipline, structure and curiosity. Caracas is where my visual and cultural point of view began." },
  { no: "02", ghost: "UCAB", institution: "Universidad Católica Andrés Bello", place: "Caracas · Venezuela", title: "Civil Engineering Studies", text: "Engineering trained the analytical side of my practice: systems, structure, scale, feasibility and the instinct to understand how something works before deciding how it should look." },
  { no: "03", ghost: "IED", institution: "IED Madrid", place: "Madrid · Spain", title: "Interior Design", text: "At IED, technical thinking met material, atmosphere, furniture, light and human experience. That collision became the foundation of the designer I am now." },
];

export default function ProfilePage() {
  return (
    <main className="pageEnter pagePadTop">
      <section className={styles.profile}>
        <header className={styles.header}>
          <p className="eyebrow darkEyebrow" data-reveal>04 / <Lexicon term="genesis" /></p>
          <h1 data-reveal><Lexicon term="genesis" /><br /><em>Venezuela. Italy. Madrid.</em></h1>
          <p data-reveal>Identity is not a pin on a map. It is a sequence of places, inherited cultures, schools, journeys and professional encounters that slowly become a way of seeing.</p>
        </header>

        <div className={styles.profileGrid}>
          <div className={styles.copy} data-reveal>
            <p className={styles.lead}>I&apos;m Alessandro Bobbio Russian — Venezuelan by birth, Italian by citizenship and family identity, living and working in Madrid.</p>
            <p>Caracas is the emotional origin. Italy is an inherited sense of identity and permanence. Madrid is the place where the professional language became concrete. Miami and the Netherlands belong to the wider map: movement, travel and work that keep expanding the reference library behind every project.</p>
            <div className={styles.identityCards}>
              <article><span>ORIGIN</span><b>Caracas</b><small>Venezuela · root + first cultural lens</small></article>
              <article><span>IDENTITY</span><b>Italy</b><small>Citizenship · heritage · family identity</small></article>
              <article><span>BASE</span><b>Madrid</b><small>Spain · current home + professional base</small></article>
            </div>
          </div>
          <div className={styles.globePanel} data-reveal>
            <div className={styles.globe}><IdentityGlobe /><GlobePrompt /></div>
            <div className={styles.legend}>
              <div><i className={styles.heritage} /><span><b>ROOT / IDENTITY</b><small>Caracas → Madrid · Caracas → Italy</small></span></div>
              <div><i className={styles.journey} /><span><b>JOURNEYS / WORK</b><small>Madrid → Miami · Madrid → Netherlands</small></span></div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.education}>
        <header className={styles.educationHeader} data-reveal><p className="eyebrow">FORMATION / CHRONOLOGY</p><h2>Three institutions.<br /><em>One way of learning to see.</em></h2><p>La Salle formed the foundation. UCAB introduced engineering logic. IED transformed that rigor into spatial language. The sequence matters because each stage still survives inside the work.</p></header>
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
