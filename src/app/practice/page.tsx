import type { Metadata } from "next";
import Link from "next/link";
import RoleSystem from "../../components/RoleSystem";
import styles from "./practice.module.css";

export const metadata: Metadata = { title: "Practice", description: "Architectural and luxury design, bio-design and creative project leadership." };

const roles = [
  ["01", "SPACE / MATERIAL / DETAIL", "Architectural + Luxury Design", "Spatial concepts, high-end interiors, kitchens, furniture and technical thinking resolved as one coherent system — from first diagram to buildable detail."],
  ["02", "LIVING / DIGITAL / EXPERIMENTAL", "Bio-Designer", "Living systems, digital fabrication, immersive visualisation and research-led design. Biology and technology become active design materials."],
  ["03", "VISION / COORDINATION / DELIVERY", "Creative Project Lead", "I connect concept, client, teams and visual storytelling so a strong idea survives the whole process — not only the first presentation."],
] as const;

export default function PracticePage() {
  return (
    <main className="pageEnter pagePadTop">
      <header className={styles.header}>
        <p className="eyebrow" data-reveal>01 / PRACTICE</p>
        <h1 data-reveal>Three roles.<br /><em>One creative system.</em></h1>
        <p data-reveal>The diagram has been rebuilt to show the overlap clearly: each discipline is legible on its own, while the center explains where my actual value sits.</p>
      </header>

      <section className={styles.diagram} data-reveal><RoleSystem /></section>

      <section className={styles.roles}>
        {roles.map(([no, meta, title, text], index) => (
          <article className={`${styles.roleCard} ${styles[`card${index + 1}`]}`} key={no} data-reveal>
            <span>{no}</span><div><p>{meta}</p><h2>{title}</h2></div><p>{text}</p><i aria-hidden="true" />
          </article>
        ))}
      </section>

      <section className={styles.next} data-reveal><span>NEXT / 02</span><h2>See the practice<br /><em>become a project.</em></h2><Link prefetch={false} href="/work">Enter selected work ↗</Link></section>
    </main>
  );
}
