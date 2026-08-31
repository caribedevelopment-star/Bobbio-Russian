"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./RenderLightSequence.module.css";

export type LightSequenceItem = { src: string; title: string; meta: string; note: string };

export default function RenderLightSequence({ items }: { items: LightSequenceItem[] }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = root.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = Math.max(1, el.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / travel));
      const index = Math.min(items.length - 1, Math.floor(progress * items.length));
      el.style.setProperty("--sequence", `${progress}`);
      el.style.setProperty("--segment", `${(progress * items.length) % 1}`);
      setActive((current) => current === index ? current : index);
    };
    const request = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", request); window.removeEventListener("resize", request); };
  }, [items.length]);

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const el = root.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--lx", `${((event.clientX - rect.left) / Math.max(1, rect.width)) * 100}%`);
    el.style.setProperty("--ly", `${((event.clientY - rect.top) / Math.max(1, rect.height)) * 100}%`);
  };

  return (
    <section ref={root} onPointerMove={onPointerMove} className={styles.sequence} aria-label="Selected render atmospheres">
      <div className={styles.sticky}>
        <div className={styles.images}>
          {items.map((item, index) => (
            <figure key={`${item.title}-${index}`} className={`${styles.frame} ${active === index ? styles.active : ""}`}>
              <img src={item.src} alt={item.title} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
            </figure>
          ))}
          <div className={styles.lightProbe} aria-hidden="true" />
          <div className={styles.vignette} aria-hidden="true" />
          <div className={styles.archLines} aria-hidden="true"><i /><i /><i /><i /><span>A—A</span><b>1:50</b></div>
        </div>

        <div className={styles.top}><span>VISUAL STUDY / LIGHT SEQUENCE</span><b>{String(active + 1).padStart(2,"0")} / {String(items.length).padStart(2,"0")}</b><span>SCROLL TO ADVANCE ↓</span></div>
        <div className={styles.copy}>
          <span>{items[active]?.meta}</span>
          <h2>{items[active]?.title}</h2>
          <p>{items[active]?.note}</p>
        </div>
        <div className={styles.index}>
          {items.map((item, index) => <button type="button" key={item.title} onClick={() => {
            const el = root.current;
            if (!el) return;
            const top = window.scrollY + el.getBoundingClientRect().top;
            const travel = Math.max(1, el.offsetHeight - window.innerHeight);
            window.scrollTo({ top: top + travel * ((index + 0.15) / items.length), behavior: "smooth" });
          }} className={active === index ? styles.current : undefined}><i /><span>0{index + 1}</span><b>{item.meta}</b></button>)}
        </div>
        <div className={styles.progress}><i style={{ transform: `scaleX(${(active + 1) / items.length})` }} /></div>
      </div>
    </section>
  );
}
