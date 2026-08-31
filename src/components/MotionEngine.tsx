"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import RouteTransitionCanvas from "./RouteTransitionCanvas";
import transition from "./RouteVeil.module.css";

type Phase = "idle" | "closing" | "opening";

const routeMeta: Record<string, [string, string]> = {
  "/": ["00", "THRESHOLD"],
  "/practice": ["01", "ATELIER"],
  "/work": ["02", "CULTIVATED MATTER"],
  "/renders": ["03", "STUDIES IN LIGHT"],
  "/profile": ["04", "PROVENANCE"],
};

export default function MotionEngine() {
  const pathname = usePathname();
  const router = useRouter();
  const initial = useRef(true);
  const navigating = useRef(false);
  const timers = useRef<number[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [targetMeta, setTargetMeta] = useState<[string, string]>(routeMeta[pathname] ?? ["BR", "SPATIAL INDEX"]);

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      return;
    }
    if (!navigating.current) return;
    setTargetMeta(routeMeta[pathname] ?? ["BR", "SPATIAL INDEX"]);
    setPhase("opening");
    const timer = window.setTimeout(() => {
      setPhase("idle");
      navigating.current = false;
      document.documentElement.removeAttribute("data-route-transition");
    }, 920);
    timers.current.push(timer);
  }, [pathname]);

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

    const onNavigate = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target as Element | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const raw = anchor.getAttribute("href");
      if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:") || raw.startsWith("http")) return;

      let url: URL;
      try { url = new URL(raw, window.location.href); } catch { return; }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === pathname && url.hash) return;
      if (url.pathname === pathname && !url.search && !url.hash) return;
      if (navigating.current) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      navigating.current = true;
      setTargetMeta(routeMeta[url.pathname] ?? ["BR", "SPATIAL INDEX"]);
      setPhase("closing");
      document.documentElement.setAttribute("data-route-transition", "true");
      const timer = window.setTimeout(() => router.push(`${url.pathname}${url.search}${url.hash}`), 680);
      timers.current.push(timer);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("click", onNavigate, true);
    return () => {
      cancelAnimationFrame(frame);
      mutation.disconnect();
      reveal.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("click", onNavigate, true);
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
    };
  }, [pathname, router]);

  const active = phase !== "idle";
  return (
    <div className={`${transition.veil} ${active ? transition.active : ""} ${phase === "closing" ? transition.closing : ""} ${phase === "opening" ? transition.opening : ""}`} aria-hidden="true">
      <RouteTransitionCanvas className={transition.world} active={active} phase={phase} />
      <span className={transition.darkField} />
      <span className={transition.axis} />
      <span className={transition.cross} />
      <span className={transition.sectionLine}><i /><i /><i /></span>
      <span className={transition.routeLabel}><b>{targetMeta[0]}</b><i />{targetMeta[1]}</span>
      <span className={transition.status}>{phase === "closing" ? "ENTERING / SPATIAL TRANSITION" : "RECONSTRUCTING / NEXT ROOM"}</span>
    </div>
  );
}
