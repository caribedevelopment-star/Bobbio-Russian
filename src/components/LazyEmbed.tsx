"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./LazyEmbed.module.css";

type Props = {
  title: string;
  src: string;
  kind: "film" | "model" | "panorama";
  status: string;
  allow: string;
};

export default function LazyEmbed({ title, src, kind, status, allow }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || active) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [active]);

  return (
    <div ref={ref} className={`${styles.shell} ${styles[kind]}`}>
      <div className={styles.ambient} />
      {active ? (
        <iframe title={title} src={src} allow={allow} allowFullScreen loading="lazy" />
      ) : (
        <div className={styles.loader}><i /><span>Preparing immersive media</span></div>
      )}
      <div className={styles.status}><i />{status}</div>
    </div>
  );
}
