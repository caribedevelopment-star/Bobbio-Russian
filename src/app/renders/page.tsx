import type { Metadata } from "next";
import RenderGallery, { type RenderItem } from "../../components/RenderGallery";
import Lexicon from "../../components/Lexicon";
import styles from "./renders.module.css";

export const metadata: Metadata = { title: "Visions", description: "Interior visualisation gallery by Bobbio Russian." };

const thumb = (id: string, width = 1800) => `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;

const items: RenderItem[] = [
  { id: "1nJ_L1eYlSzVySvarYt0_nNi55HwnlfIM", series: "Residence 1277", frame: "Kitchen · Frame 01", alt: "Warm contemporary kitchen interior render" },
  { id: "1pnrBoKtUEUXoUhh4yBhY_qBHW1MbG6Ok", series: "Residence 1283", frame: "Frame 01", alt: "Luxury interior render from residence 1283" },
  { id: "1qAsRY55H9CrOhdeGgfiahSXj8kFCmM0D", series: "Residence 1283", frame: "Frame 02", alt: "Luxury interior render from residence 1283" },
  { id: "1MQBpbfZI5joRRawhmSySd93EDkwpEFfv", series: "Residence 1283", frame: "Frame 03", alt: "Luxury interior render from residence 1283" },
  { id: "10Zxsv2-RrtRoS0HDNRPoIdhZOw5GlzjS", series: "Residence 1283", frame: "Frame 04", alt: "Luxury interior render from residence 1283" },
  { id: "1efKf_xiBJanxhPEg0dFSHw5IGOl_5Rd2", series: "Residence 1283", frame: "Frame 05", alt: "Luxury interior render from residence 1283" },
  { id: "1-exaw2HEZTASqI2JO41YJQS-3d0vLJt2", series: "Residence 1283", frame: "Frame 06", alt: "Luxury interior render from residence 1283" },
  { id: "1RG3f1nnlSRd5iwtH8lp0hMulyGjhneFd", series: "Residence 1283", frame: "Frame 07", alt: "Luxury interior render from residence 1283" },
  { id: "11WR-yfebbpvNCb_j86z_WVnDkzAJi_e2", series: "Residence 1283", frame: "Frame 08", alt: "Luxury interior render from residence 1283" },
  { id: "1vSOhau2eUeIJKvmSGFzGHBqce0kvHQng", series: "Residence 1280", frame: "Kitchen study", alt: "Minimal linear kitchen render with wood cabinetry" },
  { id: "1RyXvpwXzp8R1ZyPpcW03mg9dDrsrKZy7", series: "Residence 1274", frame: "Kitchen study", alt: "Dark and white kitchen render with integrated planter" },
  { id: "1bRNAdJ7t0IaUij0LQ-w3c_7Ev8bA0fzF", series: "Residence 1285", frame: "Interior study", alt: "Interior visualisation from series 1285" },
  { id: "1DsiIBBdmWcHs2zJA8TQqHo4T_INZAXCc", series: "Residence 1282", frame: "Interior study", alt: "Interior visualisation from series 1282" },
  { id: "1S_ZeuspkHqJDvJEuP3GWIlXM5TvkDvNz", series: "Residence 1271", frame: "Interior study", alt: "Interior visualisation from series 1271" },
  { id: "1P3pkQdZJ_ryhFMndeS8nL0ooCPO_B_uJ", series: "Residence 1268", frame: "Interior study", alt: "Interior visualisation from series 1268" },
  { id: "1gv3vSyafG0OuhaowjUKfl2rq8tfBnDqQ", series: "Residence 1266", frame: "Interior study", alt: "Interior visualisation from series 1266" },
  { id: "1l_5ybCCbWoIHSXB2qcdknN1N39A2Aeyd", series: "Residence 1242", frame: "Interior study", alt: "Interior visualisation from series 1242" },
  { id: "1EKJLNizY-AHBeC29I0qI6O9yd7L_slb5", series: "Study 1267", frame: "Frame 01", alt: "Interior visualisation from study 1267" },
  { id: "1_miBDWxsBNR4MvCb79fec30J05guNAq2", series: "Study 1267", frame: "Frame 02", alt: "Interior visualisation from study 1267" },
  { id: "17cqLwGnPErlO5ml2sODpZHTCow2k_qy7", series: "Study 1267", frame: "Frame 03", alt: "Interior visualisation from study 1267" },
  { id: "1u3SKEkouiRJspmTUBCZ_pzfo2NmbFYfL", series: "Study 1267", frame: "Frame 04", alt: "Interior visualisation from study 1267" },
  { id: "1N4lp0cYVs-Ek4PO-O56QUOYmVqSoELF2", series: "Study 1267", frame: "Frame 05", alt: "Interior visualisation from study 1267" },
  { id: "1Xsxf0fXUtlMna6o1e3GPxH03BpS2FkS8", series: "Study 1254", frame: "Frame 01", alt: "Interior visualisation from study 1254" },
  { id: "1D7nf7z1v-zYnT4sqdhmcWeOKvUavKpwE", series: "Study 1254", frame: "Frame 02", alt: "Interior visualisation from study 1254" },
  { id: "1Ls8UYQyfd5962YtOFI0RJcU7z2sv_szw", series: "Study 1254", frame: "Frame 03", alt: "Interior visualisation from study 1254" },
  { id: "1uiK8gZZwwkGn70W-V4UoWg_V_fnkwy8M", series: "Study 1254", frame: "Frame 04", alt: "Interior visualisation from study 1254" },
];

const reel = [items[1], items[9], items[17]];

export default function RendersPage() {
  return (
    <main className="pageEnter pagePadTop">
      <header className={styles.header}>
        <p className="eyebrow" data-reveal>03 / <Lexicon term="visions" /></p>
        <h1 data-reveal><Lexicon term="visions" /><br /><em>Before matter.</em></h1>
        <div data-reveal><p>A private cinema of unbuilt rooms. Light, stone, lacquer, timber and silence are tested here before they become physical decisions.</p><span>26 selected frames · interior environments</span></div>
      </header>

      <section className={styles.reel} data-reveal>
        <div className={styles.reelTop}><span>VISUAL REEL / 03 FRAGMENTS</span><b>LUXURY INTERIORS · LIGHT STUDIES</b><i>SCROLL ↓</i></div>
        <div className={styles.reelFrames}>
          {reel.map((item, index) => (
            <figure key={item.id} className={styles.reelFrame}>
              <img src={thumb(item.id, 2000)} alt={item.alt} loading="eager" decoding="async" />
              <figcaption><span>0{index + 1}</span><b>{item.series}</b><small>{item.frame}</small></figcaption>
            </figure>
          ))}
        </div>
        <div className={styles.reelLine} aria-hidden="true"><span /></div>
      </section>

      <section className={styles.manifesto}>
        <p className="eyebrow" data-reveal>VISUALISATION AS DESIGN</p>
        <h2 data-reveal>Not an image of the end.<br /><em>A tool for deciding the beginning.</em></h2>
        <div className={styles.manifestoNotes} data-reveal><span>LIGHT</span><span>PROPORTION</span><span>MATERIAL</span><span>ATMOSPHERE</span><span>DETAIL</span></div>
      </section>

      <section className={styles.gallery} data-reveal><RenderGallery items={items} /></section>
      <section className={styles.note}><p>Visual archive / selected frames from residential and interior studies. Open any image to enter the full-screen viewer.</p></section>
    </main>
  );
}
