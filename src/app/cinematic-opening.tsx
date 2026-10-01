"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const VIMEO =
  "https://player.vimeo.com/video/1211006561?badge=0&autopause=0&background=1&autoplay=1&muted=1&loop=1";

gsap.registerPlugin(ScrollTrigger);

export function CinematicHero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!root.current) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const context = gsap.context(() => {
      const desktop = window.matchMedia("(min-width: 901px)").matches;

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: desktop ? 0.8 : 0.45,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(
          "[data-hero-media]",
          {
            clipPath: desktop
              ? "inset(17% 25% 15% 25% round 28px)"
              : "inset(18% 6% 18% 6% round 22px)",
            scale: 1.085,
          },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            scale: 1,
            duration: 0.72,
          },
          0,
        )
        .to(
          "[data-hero-title-a]",
          {
            xPercent: desktop ? -18 : -8,
            yPercent: desktop ? -78 : -48,
            scale: desktop ? 0.84 : 0.92,
            opacity: 0.22,
            duration: 0.72,
          },
          0,
        )
        .to(
          "[data-hero-title-b]",
          {
            xPercent: desktop ? 14 : 7,
            yPercent: desktop ? 68 : 44,
            scale: desktop ? 0.84 : 0.92,
            opacity: 0.16,
            duration: 0.72,
          },
          0,
        )
        .to(
          "[data-hero-meta]",
          { y: -24, opacity: 0, duration: 0.28 },
          0.03,
        )
        .to(
          "[data-hero-statement]",
          { y: -42, opacity: 0, duration: 0.35 },
          0.14,
        )
        .fromTo(
          "[data-transition-copy]",
          { y: 38, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.24 },
          0.64,
        )
        .fromTo(
          "[data-transition-line]",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.28, transformOrigin: "left center" },
          0.68,
        );
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section ref={root} id="top" className="cinematicHero" aria-label="Bobbio Russian introduction">
      <div className="cinematicHeroStage">
        <div className="cinematicHeroMedia" data-hero-media aria-hidden="true">
          <iframe
            src={VIMEO}
            title="Urban Ponics cinematic background"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            tabIndex={-1}
          />
          <div className="cinematicHeroVeil" />
        </div>

        <div className="cinematicHeroMeta" data-hero-meta>
          <span>Architectural Designer / Bio Designer</span>
          <span>Madrid · 2026</span>
        </div>

        <p className="cinematicEyebrow" data-hero-meta>
          From bit to matter.
        </p>

        <h1 className="cinematicTitle" aria-label="Bobbio Russian">
          <span data-hero-title-a>BOBBIO</span>
          <span data-hero-title-b>RUSSIAN</span>
        </h1>

        <p className="cinematicHeroStatement" data-hero-statement>
          Architecture, luxury interiors, bio-design and immersive visualisation —
          shaped as one precise, material practice.
        </p>

        <div className="cinematicHeroFooter" data-hero-meta>
          <a href="#work">Scroll to selected work ↓</a>
          <span>Venezuelan · Italian · Madrid-based</span>
        </div>

        <div className="cinematicTransitionCue" data-transition-copy aria-hidden="true">
          <span>01</span>
          <strong>SELECTED WORK</strong>
          <i data-transition-line />
        </div>
      </div>
    </section>
  );
}

export function CinematicGallery() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!root.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-gallery-head]",
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 78%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        "[data-project-card]",
        {
          clipPath: "inset(7% 7% 7% 7% round 26px)",
          scale: 0.96,
        },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-project-card]",
            start: "top 84%",
            end: "top 18%",
            scrub: 0.55,
          },
        },
      );

      gsap.fromTo(
        "[data-project-copy]",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-project-card]",
            start: "top 50%",
            once: true,
          },
        },
      );
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section ref={root} id="work" className="cinematicGallery sectionFx">
      <header className="cinematicGalleryHeader" data-gallery-head>
        <p className="sectionIndex">02 / SELECTED WORK</p>
        <div>
          <h2>
            Projects are not thumbnails.
            <br />
            <em>They are worlds.</em>
          </h2>
          <p>
            The repository currently contains one fully verified visual case study.
            It is treated at full scale rather than padded with invented work.
          </p>
        </div>
      </header>

      <a
        className="cinematicProject"
        data-project-card
        href="#urban-detail"
        aria-label="Open the Urban Ponics case study"
      >
        <div className="cinematicProjectMedia">
          <iframe
            src={VIMEO}
            title="Urban Ponics project film"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            loading="lazy"
            tabIndex={-1}
          />
          <div className="cinematicProjectShade" />
        </div>

        <div className="cinematicProjectTop" data-project-copy>
          <span>01 / 01</span>
          <span>BIO-DESIGN · LIVING SYSTEMS</span>
          <span>MADRID / NL</span>
        </div>

        <div className="cinematicProjectCopy" data-project-copy>
          <p>FEATURED CASE STUDY</p>
          <h3>URBAN PONICS</h3>
          <div>
            <span>Film · Interactive 3D · NFT system · 360º environment</span>
            <b>OPEN CASE STUDY ↘</b>
          </div>
        </div>
      </a>

      <div className="cinematicGalleryFoot">
        <span>Verified project material only</span>
        <span>More work can enter this rail when assets are added to the repository.</span>
      </div>
    </section>
  );
}
