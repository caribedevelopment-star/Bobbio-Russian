import HomeJourney from "../components/HomeJourney";
import HomeLoader from "../components/HomeLoader";
import ImmersiveHomeHero from "../components/ImmersiveHomeHero";
import styles from "./home.module.css";

const brands = ["BONTEMPI CASA", "FEBAL CASA", "COLOMBINI GROUP", "GRUPO TJC"];

export default function Home() {
  return (
    <main className="pageEnter">
      <HomeLoader />
      <ImmersiveHomeHero />
      <HomeJourney />

      <section className={styles.brands}>
        <div className={styles.brandIntro} data-reveal>
          <p className="eyebrow">SELECTED PROFESSIONAL CONTEXT</p>
          <h2>Ideas move through<br /><em>people, systems and matter.</em></h2>
        </div>
        <div className={styles.brandMarquee} aria-label="Selected brands and groups">
          <div>{[...brands, ...brands, ...brands].map((brand, index) => <span key={`${brand}-${index}`}>{brand}</span>)}</div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Architecture · Luxury interiors · Bio-design · Creative direction</p>
        <a href="mailto:hello@bobbiorussian.com">LET&apos;S MAKE IT <em>TANGIBLE.</em> ↗</a>
      </footer>
    </main>
  );
}
