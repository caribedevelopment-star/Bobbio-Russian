import type { Metadata } from "next";
import RenderGallery, { type RenderItem } from "../../components/RenderGallery";
import Lexicon from "../../components/Lexicon";
import styles from "./renders.module.css";

export const metadata: Metadata = { title: "Visions", description: "Interior visualisation gallery by Bobbio Russian." };

const items: RenderItem[] = [
  { id: "1nJ_L1eYlSzVySvarYt0_nNi55HwnlfIM", series: "Series 1277", frame: "Kitchen study", alt: "Warm contemporary kitchen interior render" },
  { id: "1pnrBoKtUEUXoUhh4yBhY_qBHW1MbG6Ok", series: "Series 1283", frame: "Bath study", alt: "Minimal bathroom interior render with glass shower" },
  { id: "1vSOhau2eUeIJKvmSGFzGHBqce0kvHQng", series: "Series 1280", frame: "Kitchen study", alt: "Minimal linear kitchen render with wood cabinetry" },
  { id: "1RyXvpwXzp8R1ZyPpcW03mg9dDrsrKZy7", series: "Series 1274", frame: "Kitchen study", alt: "Dark and white kitchen render with integrated planter" },
  { id: "1bRNAdJ7t0IaUij0LQ-w3c_7Ev8bA0fzF", series: "Series 1285", frame: "Interior study", alt: "Interior visualisation from series 1285" },
  { id: "1DsiIBBdmWcHs2zJA8TQqHo4T_INZAXCc", series: "Series 1282", frame: "Interior study", alt: "Interior visualisation from series 1282" },
  { id: "1S_ZeuspkHqJDvJEuP3GWIlXM5TvkDvNz", series: "Series 1271", frame: "Interior study", alt: "Interior visualisation from series 1271" },
  { id: "1P3pkQdZJ_ryhFMndeS8nL0ooCPO_B_uJ", series: "Series 1268", frame: "Interior study", alt: "Interior visualisation from series 1268" },
  { id: "1gv3vSyafG0OuhaowjUKfl2rq8tfBnDqQ", series: "Series 1266", frame: "Interior study", alt: "Interior visualisation from series 1266" },
  { id: "1l_5ybCCbWoIHSXB2qcdknN1N39A2Aeyd", series: "Series 1242", frame: "Interior study", alt: "Interior visualisation from series 1242" },
];

export default function RendersPage() {
  return (
    <main className="pageEnter pagePadTop">
      <header className={styles.header}>
        <p className="eyebrow" data-reveal>03 / <Lexicon term="visions" /></p>
        <h1 data-reveal><Lexicon term="visions" /><br /><em>Before matter.</em></h1>
        <div data-reveal><p>These images are not the end of the process. They are a laboratory for light, proportion, material and atmosphere — a way to inhabit a room before it exists.</p><span>Selected visual studies · interior environments</span></div>
      </header>
      <section className={styles.gallery} data-reveal><RenderGallery items={items} /></section>
      <section className={styles.note}><p>A visual archive in progress: fragments of kitchens, interiors and material studies seen through different levels of realism and mood.</p></section>
    </main>
  );
}
