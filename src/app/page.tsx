"use client";

import { useEffect, useRef } from "react";

const SKETCHFAB_TOWER =
  "https://sketchfab.com/models/1accfef6146640308048131fe7f0ca1d/embed?ui_theme=dark&ui_infos=0&ui_controls=1&ui_stop=0";
const SKETCHFAB_NFT =
  "https://sketchfab.com/models/d8f12e0f476247adb94ecf52a1573637/embed?ui_theme=dark&ui_infos=0&ui_controls=1&ui_stop=0";
const VIMEO =
  "https://player.vimeo.com/video/1211006561?badge=0&autopause=0&player_id=0&app_id=58479";
const TWINMOTION =
  "https://twinmotion.unrealengine.com/panorama/RNq6WfMy27Nonz23?lang=es-ES&c=7A9F8E224CB4A881FF5423932245ECBC";

type Marker = { lat: number; lon: number; label: string; kind: "home" | "identity" | "base" | "travel" };

const markers: Marker[] = [
  { lat: 10.48, lon: -66.9, label: "CARACAS", kind: "home" },
  { lat: 41.9, lon: 12.5, label: "ITALIA", kind: "identity" },
  { lat: 40.42, lon: -3.7, label: "MADRID", kind: "base" },
  { lat: 18.47, lon: -66.12, label: "CARIBE", kind: "travel" },
  { lat: 39.47, lon: -0.38, label: "VALENCIA", kind: "travel" },
];

function Globe() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rotation = -16;
    let dragging = false;
    let lastX = 0;
    let raf = 0;

    const resize = () => {
      const box = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width;
      height = box.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const project = (lat: number, lon: number, radius: number) => {
      const phi = (lat * Math.PI) / 180;
      const lambda = ((lon + rotation) * Math.PI) / 180;
      const x = width / 2 + radius * Math.cos(phi) * Math.sin(lambda);
      const y = height / 2 - radius * Math.sin(phi);
      const z = Math.cos(phi) * Math.cos(lambda);
      return { x, y, z };
    };

    const line = (points: Array<[number, number]>, radius: number, stroke: string, alpha = 1) => {
      ctx.beginPath();
      let active = false;
      for (const [lat, lon] of points) {
        const p = project(lat, lon, radius);
        if (p.z <= 0) {
          active = false;
          continue;
        }
        if (!active) {
          ctx.moveTo(p.x, p.y);
          active = true;
        } else ctx.lineTo(p.x, p.y);
      }
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = stroke;
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const route = (a: Marker, b: Marker, radius: number) => {
      const pts: Array<[number, number]> = [];
      for (let i = 0; i <= 50; i++) {
        const t = i / 50;
        pts.push([
          a.lat + (b.lat - a.lat) * t + Math.sin(Math.PI * t) * 8,
          a.lon + (b.lon - a.lon) * t,
        ]);
      }
      line(pts, radius, "#d8ff62", 0.72);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const r = Math.min(width, height) * 0.39;
      const cx = width / 2;
      const cy = height / 2;

      const halo = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, 0, cx, cy, r * 1.25);
      halo.addColorStop(0, "rgba(216,255,98,.24)");
      halo.addColorStop(0.45, "rgba(120,140,100,.10)");
      halo.addColorStop(1, "rgba(5,7,6,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.25, 0, Math.PI * 2);
      ctx.fill();

      const globe = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.05, cx, cy, r);
      globe.addColorStop(0, "#253129");
      globe.addColorStop(0.58, "#111612");
      globe.addColorStop(1, "#050706");
      ctx.fillStyle = globe;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.12)";
      ctx.stroke();

      ctx.lineWidth = 0.65;
      for (let lat = -75; lat <= 75; lat += 15) {
        const pts: Array<[number, number]> = [];
        for (let lon = -180; lon <= 180; lon += 3) pts.push([lat, lon]);
        line(pts, r, "rgba(255,255,255,.11)");
      }
      for (let lon = -180; lon < 180; lon += 15) {
        const pts: Array<[number, number]> = [];
        for (let lat = -90; lat <= 90; lat += 3) pts.push([lat, lon]);
        line(pts, r, "rgba(255,255,255,.08)");
      }

      const caracas = markers[0];
      const italy = markers[1];
      const madrid = markers[2];
      route(caracas, madrid, r);
      route(italy, madrid, r);
      route(madrid, markers[3], r);

      markers.forEach((m) => {
        const p = project(m.lat, m.lon, r);
        if (p.z <= 0) return;
        const radius = m.kind === "base" ? 5 : 3.5;
        ctx.fillStyle = m.kind === "travel" ? "rgba(216,255,98,.55)" : "#d8ff62";
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
        if (m.kind !== "travel") {
          ctx.fillStyle = "rgba(245,243,236,.86)";
          ctx.font = "700 9px Arial";
          ctx.fillText(m.label, p.x + 10, p.y + 3);
        }
      });

      if (!dragging) rotation += 0.022;
      raf = requestAnimationFrame(draw);
    };

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      rotation += (e.clientX - lastX) * 0.28;
      lastX = e.clientX;
    };
    const up = () => {
      dragging = false;
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, []);

  return <canvas ref={ref} className="globeCanvas" aria-label="Animated globe showing Venezuela, Italy and Spain" />;
}

export default function Home() {
  useEffect(() => {
    const reveal = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.14 },
    );
    document.querySelectorAll("[data-reveal]").forEach((node) => reveal.observe(node));

    const move = (e: PointerEvent) => {
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
      document.documentElement.style.setProperty("--px", String(e.clientX / window.innerWidth - 0.5));
      document.documentElement.style.setProperty("--py", String(e.clientY / window.innerHeight - 0.5));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      reveal.disconnect();
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <main>
      <div className="cursorGlow" aria-hidden="true" />
      <nav className="nav">
        <a href="#top" className="monogram" aria-label="Back to top">BR</a>
        <div className="navLinks">
          <a href="#practice">Practice</a>
          <a href="#work">Work</a>
          <a href="#profile">Profile</a>
        </div>
        <a href="#contact" className="navCta">Contact ↗</a>
      </nav>

      <section id="top" className="hero">
        <div className="heroTop" data-reveal>
          <span>Architectural Designer</span>
          <span>Madrid · 2026</span>
        </div>
        <div className="heroStage">
          <p className="heroKicker" data-reveal>From bit to matter.</p>
          <h1 aria-label="Bobbio Russian">
            <span className="heroWord heroWordA">BOBBIO</span>
            <span className="heroWord heroWordB">RUSSIAN</span>
          </h1>
          <div className="heroOrb" aria-hidden="true"><span /></div>
          <p className="heroStatement" data-reveal>
            Architecture, high-end interiors and bio-design shaped through technology, material intelligence and atmosphere.
          </p>
        </div>
        <div className="heroBottom" data-reveal>
          <a href="#practice">Scroll to discover ↓</a>
          <span>Venezuelan-born · Italian · Based in Spain</span>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div>ARCHITECTURE — INTERIORS — BIO-DESIGN — DIGITAL CRAFT — IMMERSIVE VISUALISATION — ARCHITECTURE — INTERIORS — BIO-DESIGN — DIGITAL CRAFT — IMMERSIVE VISUALISATION —</div>
      </div>

      <section id="practice" className="practice sectionPad">
        <div className="sectionIntro" data-reveal>
          <p className="sectionIndex">01 / PRACTICE</p>
          <h2>I work across <em>three worlds</em> without treating them as the same thing.</h2>
        </div>
        <div className="discipline disciplineLight" data-reveal>
          <div className="disciplineNo">01</div>
          <div><p className="micro">SPACE / SYSTEM / PROPORTION</p><h3>Architectural<br />Design</h3></div>
          <p>Concept development, spatial strategy, technical thinking and digital workflows. I move from the first diagram to a space that can actually be built.</p>
        </div>
        <div className="discipline" data-reveal>
          <div className="disciplineNo">02</div>
          <div><p className="micro">MATERIAL / DETAIL / ATMOSPHERE</p><h3>Luxury<br />Interiors</h3></div>
          <p>High-end residential interiors with a strong focus on kitchens, furniture, material selection and precision detailing. The goal is not decoration; it is coherence.</p>
        </div>
        <div className="discipline disciplineAccent" data-reveal>
          <div className="disciplineNo">03</div>
          <div><p className="micro">LIVING / DIGITAL / EXPERIMENTAL</p><h3>Bio-Design<br />+ Digital</h3></div>
          <p>Living systems, 3D, real-time rendering, immersive visualization and research-led design. Technology is part of the design language, not a final presentation layer.</p>
        </div>
      </section>

      <section id="work" className="work sectionPad">
        <div className="workHeader" data-reveal>
          <p className="sectionIndex">02 / SELECTED WORK</p>
          <h2>Projects are not thumbnails.<br /><span>They are worlds.</span></h2>
        </div>

        <article className="urbanCase">
          <div className="urbanTitle" data-reveal>
            <div><p className="micro lime">FEATURED CASE STUDY · BIO-DESIGN</p><h3>URBAN<br />PONICS</h3></div>
            <p>A living-system project explored through film, interactive objects, system design and an immersive spatial environment. Move through the case study rather than looking at a static gallery.</p>
          </div>

          <div className="chapter chapterFilm" data-reveal>
            <div className="chapterMeta"><span>ACT I</span><span>THE FILM</span><span>01 / 04</span></div>
            <div className="media mediaFilm">
              <iframe title="Urban Ponics film" src={VIMEO} allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" allowFullScreen />
            </div>
          </div>

          <div className="chapterGrid">
            <div className="chapter" data-reveal>
              <div className="chapterMeta"><span>ACT II</span><span>THE OBJECT</span><span>02 / 04</span></div>
              <div className="media mediaModel">
                <iframe title="Urban Ponics Tower interactive 3D" src={SKETCHFAB_TOWER} allow="autoplay; fullscreen; xr-spatial-tracking" allowFullScreen loading="lazy" />
              </div>
              <div className="chapterCopy"><b>Tower</b><span>Interactive 3D · Sketchfab</span></div>
            </div>
            <div className="chapter chapterOffset" data-reveal>
              <div className="chapterMeta"><span>ACT III</span><span>THE SYSTEM</span><span>03 / 04</span></div>
              <div className="media mediaModel">
                <iframe title="Urban Ponics NFT System interactive 3D" src={SKETCHFAB_NFT} allow="autoplay; fullscreen; xr-spatial-tracking" allowFullScreen loading="lazy" />
              </div>
              <div className="chapterCopy"><b>NFT System</b><span>Interactive 3D · Sketchfab</span></div>
            </div>
          </div>

          <div className="chapter chapterPanorama" data-reveal>
            <div className="chapterMeta"><span>ACT IV</span><span>THE SPACE</span><span>04 / 04</span></div>
            <div className="media mediaPano">
              <iframe title="Urban Ponics Twinmotion panorama" src={TWINMOTION} allow="fullscreen; accelerometer; gyroscope" allowFullScreen loading="lazy" />
            </div>
            <div className="chapterCopy"><b>Enter the environment</b><span>360º panorama · Twinmotion</span></div>
          </div>
        </article>

        <div className="workStrip" data-reveal>
          <article><span>HIGH-END INTERIORS</span><h4>Material.<br />Precision.<br />Restraint.</h4><p>Residential environments and kitchen design where furniture, lighting and finishes are resolved as one architectural system.</p></article>
          <article><span>ARCHITECTURAL WORK</span><h4>Space before<br />surface.</h4><p>Projects driven by circulation, proportion and the relationship between human movement and built form.</p></article>
          <article><span>VISUALISATION</span><h4>Design in<br />real time.</h4><p>Twinmotion, D5, Unreal, V-Ray and 360º workflows used to test atmosphere and communicate decisions before matter exists.</p></article>
        </div>
      </section>

      <section id="profile" className="profile sectionPad">
        <div className="profileHeadline" data-reveal>
          <p className="sectionIndex darkIndex">03 / PROFILE</p>
          <h2>My point of view was built <em>between places.</em></h2>
        </div>
        <div className="profileGrid">
          <div className="profileCopy" data-reveal>
            <p className="profileLead">I’m Alessandro Bobbio Russian, a Venezuelan-born Italian architectural designer based in Madrid.</p>
            <p>I grew up with one cultural reference, inherited another, and built my professional life in a third. Travel has made that mix wider: cities, materials, ways of living and different ideas of what “home” means all feed the way I design.</p>
            <p>My work sits between architectural rigor and visual emotion. I care about how something is built, but also about what it feels like to move through it.</p>
            <div className="facts">
              <div><span>ORIGIN</span><b>Caracas, Venezuela</b></div>
              <div><span>CITIZENSHIP</span><b>Italian</b></div>
              <div><span>BASED</span><b>Madrid, Spain</b></div>
              <div><span>LANGUAGES</span><b>ES · EN · IT · FR</b></div>
            </div>
          </div>
          <div className="globeWrap" data-reveal>
            <Globe />
            <div className="globeLabel globeLabelA"><span>10°N</span>ORIGIN</div>
            <div className="globeLabel globeLabelB"><span>41°N</span>IDENTITY</div>
            <div className="globeHint">DRAG THE PLANET ↔</div>
          </div>
        </div>
      </section>

      <section className="manifesto sectionPad">
        <p className="sectionIndex" data-reveal>04 / APPROACH</p>
        <div className="manifestoGrid">
          <h2 data-reveal>Design should feel <em>inevitable</em>, not decorated.</h2>
          <p data-reveal>I look for the point where function, technology, matter and emotion stop competing and become one thing.</p>
        </div>
      </section>

      <footer id="contact" className="footer sectionPad">
        <div className="footerTop" data-reveal>
          <p>Architecture · Interiors · Bio-design</p>
          <a href="mailto:hello@bobbiorussian.com">LET’S<br />MAKE IT<br /><em>TANGIBLE.</em> ↗</a>
        </div>
        <div className="footerBottom"><b>BOBBIO RUSSIAN</b><span>Architectural Designer · Madrid</span><span>© 2026</span></div>
      </footer>
    </main>
  );
}
