"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import transition from "./RouteVeil.module.css";

const routeMeta: Record<string, [string, string]> = {
  "/": ["00", "THRESHOLD"],
  "/practice": ["01", "ATELIER"],
  "/work": ["02", "CULTIVATED MATTER"],
  "/renders": ["03", "STUDIES IN LIGHT"],
  "/profile": ["04", "PROVENANCE"],
};

export default function MotionEngine() {
  const pathname = usePathname();
  const meta = routeMeta[pathname] ?? ["BR", "SPATIAL INDEX"];

  useEffect(() => {
    const reveal = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("isVisible");
          reveal.unobserve(entry.target);
        }
      }),
      { threshold: 0.08, rootMargin: "0px 0px -5%" },
    );

    const register = () => document.querySelectorAll("[data-reveal]").forEach(node => reveal.observe(node));
    const frame = requestAnimationFrame(register);
    const mutation = new MutationObserver(register);
    mutation.observe(document.body, { childList: true, subtree: true });

    const onPointer = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
      document.documentElement.style.setProperty("--my", `${event.clientY}px`);
      document.documentElement.style.setProperty("--px", String(event.clientX / innerWidth - 0.5));
      document.documentElement.style.setProperty("--py", String(event.clientY / innerHeight - 0.5));
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      mutation.disconnect();
      reveal.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, [pathname]);

  return (
    <div key={pathname} className={transition.veil} aria-hidden="true">
      <span className={transition.axis} />
      <span className={transition.cross} />
      <span className={transition.node} />
      <span className={transition.aperture}><i /><i /><i /></span>
      <span className={transition.routeLabel}><b>{meta[0]}</b><i />{meta[1]}</span>
    </div>
  );
}
