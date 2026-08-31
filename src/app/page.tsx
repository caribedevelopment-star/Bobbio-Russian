import HomeJourney from "../components/HomeJourney";
import HomeLoader from "../components/HomeLoader";
import ImmersiveHomeHero from "../components/ImmersiveHomeHero";
import styles from "./home.module.css";

export default function Home() {
  return (
    <main className="pageEnter">
      <HomeLoader />
      <ImmersiveHomeHero />
      <HomeJourney />

      <footer className={styles.footer}>
        <p>Architecture · Luxury interiors · Bio-design · Creative direction</p>
        <a href="mailto:hello@bobbiorussian.com">LET&apos;S MAKE IT <em>TANGIBLE.</em> ↗</a>
      </footer>
    </main>
  );
}
