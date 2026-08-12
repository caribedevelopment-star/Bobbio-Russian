import type { Metadata } from "next";
import Link from "next/link";
import RoleSystem from "../../components/RoleSystem";
import Lexicon from "../../components/Lexicon";
import styles from "./practice.module.css";

export const metadata: Metadata = { title: "Convergence", description: "Architectural and luxury design, bio-design and creative project leadership." };

const roles = [
  ["01", "SPACE / MATERIAL / DETAIL", "Architectural + Luxury Design", "I design space from the inside out: proportion, circulation, furniture, light, kitchens and material decisions resolved as one architectural language."],
  ["02", "LIVING / DIGITAL / EXPERIMENTAL", "Bio-Designer", "I explore what happens when design stops treating nature as inspiration and begins working with living systems, fabrication and technology as active materials."],
  ["03", "VISION / COORDINATION / DELIVERY", "Creative Project Lead", "I protect the central idea while it passes through clients, teams, drawings, visualisations and technical constraints — keeping the project coherent from intuition to delivery."],
] as const;

export default function PracticePage() {
  return (
    <main className="pageEnter pagePadTop">
      <header className={styles.header}>
        <p className="eyebrow" data-reveal>01 / <Lexicon term="convergence" /></p>
        <h1 data-reveal><Lexicon term="convergence" /><br /><em>Three disciplines orbit one practice.</em></h1>
        <p data-reveal>I do not see architecture, biology and leadership as separate identities. They are different instruments: the work becomes more precise when they are allowed to influence one another.</p>
      </header>

      <section className={styles.diagram} data-reveal><RoleSystem /></section>

      <section className={styles.roles}>
        {roles.map(([no, meta, title, text], index) => (
          <article className={`${styles.roleCard} ${styles[`card${index + 1}`]}`} key={no} data-reveal>
            <span>{no}</span><div><p>{meta}</p><h2>{title}</h2></div><p>{text}</p><i aria-hidden="true" />
          </article>
        ))}
      </section>

      <section className={styles.next} data-reveal><span>NEXT / 02</span><h2>Ideas become convincing<br /><em>when they begin to move.</em></h2><Link prefetch={false} href="/work">Enter the next chapter ↗</Link></section>
    </main>
  );
}
