"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function MotionEngine() {
  const pathname = usePathname();

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

    const register = () => {
      document.querySelectorAll("[data-reveal]").forEach(node => reveal.observe(node));
    };

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

  return null;
}
