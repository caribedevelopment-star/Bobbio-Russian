import type { Metadata } from "next";
import Link from "next/link";
import LazyEmbed from "../../components/LazyEmbed";
import Lexicon from "../../components/Lexicon";
import styles from "./work.module.css";

export const metadata: Metadata = { title: "Matter in Motion", description: "Urban Ponics immersive case study by Bobbio Russian." };

const TOWER = "https://sketchfab.com/models/1accfef6146640308048131fe7f0ca1d/embed?ui_theme=dark&ui_infos=0&ui_controls=1&autostart=1&preload=1&ui_hint=0";
const NFT = "https://sketchfab.com/models/d8f12e0f476247adb94ecf52a1573637/embed?ui_theme=dark&ui_infos=0&ui_controls=1&autostart=1&preload=1&ui_hint=0";
const FILM = "https://player.vimeo.com/video/1211006561?badge=0&autopause=0&background=1&autoplay=1&muted=1&loop=1";
const thumb = (id: string, width = 1800) => `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;

const visualFrames = [
  { id: "1I4naD0-rjA3w8v-KAvKebwca4ka4wrXn", no: "01", title: "Full-Spectrum Farming", caption: "Brand + spatial proposition" },
  { id: "1kJw8QPOCwdknjX4MGl5ChomtXiC96_8N", no: "02", title: "Farms for Cities", caption: "Urban greenhouse system" },
  { id: "1bMz-_KByWZbRQ9fJ2AmhMYYsiCyYUT9Y", no: "03", title: "Smart Systems", caption: "AgTech + vertical growing" },
  { id: "1zNwNWwNEawNWhWBD14DHF7uAUbxpTX8Q", no: "04", title: "Project Language", caption: "System translated into image" },
];

export default function WorkPage() {
  return (
    <main className="pageEnter pagePadTop">
      <header className={styles.header}>
        <p className="eyebrow" data-reveal>02 / <Lexicon term="matter" /></p>
        <h1 data-reveal><Lexicon term="matter" /><br /><em>Urban Ponics.</em></h1>
        <p data-reveal>A bio-design project read through four different lenses: the film creates atmosphere, the text explains intent, the visual frames build the world, and the 3D catalogue exposes the objects and systems themselves.</p>
      </header>

      <section className={styles.filmSection}>
        <div className={styles.sectionLead} data-reveal>
          <div><span>01</span><p>FILM / ATMOSPHERE</p></div>
          <h2>The project<br /><em>before explanation.</em></h2>
          <p>Movement, sound and rhythm establish the emotional territory first. The film is the entrance — not the documentation.</p>
        </div>
        <div className={styles.filmFrame} data-reveal>
          <div className={styles.filmCoordinates}><span>URBAN PONICS</span><span>MOVING IMAGE · 16:9</span></div>
          <LazyEmbed title="Urban Ponics film" src={FILM} kind="film" status="Film · atmosphere" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" />
        </div>
      </section>

      <section className={styles.narrative}>
        <div className={styles.narrativeIndex} data-reveal><span>02</span><i /><b>THE IDEA / SYSTEM</b></div>
        <div className={styles.narrativeStatement} data-reveal>
          <p>“Cities should not only consume landscapes. They can become productive landscapes themselves.”</p>
        </div>
        <div className={styles.narrativeGrid}>
          <article data-reveal><span>WHY</span><h3>Food closer to people.</h3><p>Urban Ponics explores compact growing systems as part of the city rather than infrastructure hidden far outside it.</p></article>
          <article data-reveal><span>HOW</span><h3>Modular by design.</h3><p>The greenhouse, tower and NFT system operate as a family: scalable pieces capable of adapting to climate, crop and available space.</p></article>
          <article data-reveal><span>MY ROLE</span><h3>Designing the translation.</h3><p>From digital objects and spatial visualisation to the project language, the work connects system logic with an experience people can understand.</p></article>
        </div>
        <div className={styles.systemDrawing} aria-hidden="true"><span /><span /><span /><i /><b /></div>
      </section>

      <section className={styles.visualSection}>
        <div className={styles.sectionLead} data-reveal>
          <div><span>03</span><p>RENDERS / VISUAL FRAMES</p></div>
          <h2>A system needs<br /><em>a visual world.</em></h2>
          <p>Project frames translate technology into something legible and desirable: city, agriculture, product and identity are shown as one ecosystem.</p>
        </div>
        <div className={styles.visualRail}>
          {visualFrames.map((frame, index) => (
            <figure className={`${styles.visualFrame} ${index % 2 ? styles.visualOffset : ""}`} key={frame.id} data-reveal>
              <div className={styles.visualImage}><img src={thumb(frame.id)} alt={`Urban Ponics ${frame.title}`} loading={index < 2 ? "eager" : "lazy"} decoding="async" /><span /></div>
              <figcaption><i>{frame.no}</i><div><b>{frame.title}</b><small>{frame.caption}</small></div></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={styles.catalogue}>
        <div className={styles.catalogueHeader} data-reveal>
          <div><span>04</span><p>3D CATALOGUE / OBJECTS</p></div>
          <h2>Touch the<br /><em>system itself.</em></h2>
          <p>The catalogue is interactive. These are not rendered stills: rotate, inspect and understand the objects as designed pieces.</p>
        </div>
        <div className={styles.catalogueGrid}>
          <article data-reveal>
            <div className={styles.modelMeta}><span>OBJECT / 01</span><b>TOWER</b><i>Interactive 3D</i></div>
            <LazyEmbed title="Urban Ponics Tower interactive 3D" src={TOWER} kind="model" status="Tower · live 3D" allow="autoplay; fullscreen; xr-spatial-tracking" />
            <p>A vertical growing object conceived as architecture, product and biological infrastructure at the same time.</p>
          </article>
          <article className={styles.catalogueOffset} data-reveal>
            <div className={styles.modelMeta}><span>SYSTEM / 02</span><b>NFT SYSTEM</b><i>Interactive 3D</i></div>
            <LazyEmbed title="Urban Ponics NFT System interactive 3D" src={NFT} kind="model" status="NFT System · live 3D" allow="autoplay; fullscreen; xr-spatial-tracking" />
            <p>The nutrient-film system exposes the technical logic behind the living layer — infrastructure made visible.</p>
          </article>
        </div>
      </section>

      <section className={styles.renderCta} data-reveal><span>NEXT / 03</span><h2>From a living system<br /><em>to imagined interiors.</em></h2><Link prefetch={false} href="/renders">Enter the visual archive ↗</Link></section>
    </main>
  );
}
