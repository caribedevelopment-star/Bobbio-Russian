"use client";

import { useEffect } from "react";

export default function MotionEngine() {
  useEffect(() => {
    const reveal = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add("isVisible")),
      { threshold: 0.1, rootMargin: "0px 0px -7%" },
    );
    document.querySelectorAll("[data-reveal]").forEach(node => reveal.observe(node));

    const onPointer = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
      document.documentElement.style.setProperty("--my", `${event.clientY}px`);
      document.documentElement.style.setProperty("--px", String(event.clientX / innerWidth - 0.5));
      document.documentElement.style.setProperty("--py", String(event.clientY / innerHeight - 0.5));
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      reveal.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return null;
}
