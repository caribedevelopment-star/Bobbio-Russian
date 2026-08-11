"use client";

import { useEffect, useRef } from "react";

const SKETCHFAB_TOWER = "https://sketchfab.com/models/1accfef6146640308048131fe7f0ca1d/embed?ui_theme=dark&ui_infos=0&ui_controls=1&ui_stop=0&autostart=1&preload=1&ui_hint=0";
const SKETCHFAB_NFT = "https://sketchfab.com/models/d8f12e0f476247adb94ecf52a1573637/embed?ui_theme=dark&ui_infos=0&ui_controls=1&ui_stop=0&autostart=1&preload=1&ui_hint=0";
const VIMEO = "https://player.vimeo.com/video/1211006561?badge=0&autopause=0&background=1&autoplay=1&muted=1&loop=1";
const TWINMOTION = "https://twinmotion.unrealengine.com/panorama/RNq6WfMy27Nonz23?lang=es-ES&c=7A9F8E224CB4A881FF5423932245ECBC";

type Marker = { lat: number; lon: number; label: string; kind: "origin" | "identity" | "base" | "travel" };
const markers: Marker[] = [
  { lat: 10.48, lon: -66.9, label: "CARACAS", kind: "origin" },
  { lat: 41.9, lon: 12.5, label: "ITALIA", kind: "identity" },
  { lat: 40.42, lon: -3.7, label: "MADRID", kind: "base" },
  { lat: 18.47, lon: -66.12, label: "CARIBE", kind: "travel" },
  { lat: 39.47, lon: -0.38, label: "VALENCIA", kind: "travel" },
];

const education = [
  { no: "01", key: "LS", place: "Colegio La Salle · Caracas", title: "School Formation", meta: "Caracas · Venezuela", text: "The first layer: discipline, structure and curiosity. Caracas is where my visual and cultural point of view began." },
  { no: "02", key: "UCAB", place: "Universidad Católica Andrés Bello", title: "Civil Engineering Studies", meta: "Caracas · Venezuela", text: "Engineering gave me systems thinking, technical logic and a rigorous relationship with structure, scale and feasibility." },
  { no: "03", key: "IED", place: "IED Madrid", title: "Interior Design", meta: "Madrid · Spain", text: "At IED, technical thinking became spatial narrative: material, atmosphere, furniture, light and human experience." },
];

function SectionBridge({ no, next, caption }: { no: string; next: string; caption: string }) {
  return (
    <div className="sectionBridge" aria-hidden="true">
      <div className="bridgeLine"><span /></div>
      <div className="bridgeOrb"><i /><b>{no}</b></div>
      <div className="bridgeCopy"><span>NEXT</span><strong>{next}</strong><small>{caption}</small></div>
    </div>
  );
}

function PracticeOrbit() {
  return (
    <div className="practiceOrbit" data-reveal>
      <div className="orbitIntro">
        <p className="micro">ONE PRACTICE / THREE MODES</p>
        <h3>My value is in the <em>overlap.</em></h3>
        <p>I move between spatial design, living systems and project leadership. The strongest work happens when those three disciplines inform one another.</p>
      </div>
      <div className="roleDiagram" role="img" aria-label="Circular diagram connecting Architectural and Luxury Design, Bio-Designer and Creative Project Lead">
        <svg viewBox="0 0 600 600" aria-hidden="true">
          <circle className="roleRing roleRingOuter" cx="300" cy="300" r="238" />
          <circle className="roleRing roleRingInner" cx="300" cy="300" r="162" />
          <path className="roleEnergy roleEnergyA" d="M300 72 C430 74 526 179 526 300 C526 422 428 524 300 526" />
          <path className="roleEnergy roleEnergyB" d="M300 526 C170 526 74 424 74 300 C74 178 171 74 300 72" />
          <path className="roleTriangle" d="M300 105 L112 458 L488 458 Z" />
          <circle className="rolePulse rolePulseA" cx="300" cy="105" r="6" />
          <circle className="rolePulse rolePulseB" cx="112" cy="458" r="6" />
          <circle className="rolePulse rolePulseC" cx="488" cy="458" r="6" />
        </svg>
        <div className="roleNode roleNodeA"><span>01</span><b>Architectural +<br />Luxury Design</b></div>
        <div className="roleNode roleNodeB"><span>02</span><b>Bio-Designer</b></div>
        <div className="roleNode roleNodeC"><span>03</span><b>Creative<br />Project Lead</b></div>
        <div className="roleCore"><span>BR</span><small>ONE CREATIVE<br />DIRECTION</small></div>
        <i className="orbitParticle particleA" /><i className="orbitParticle particleB" /><i className="orbitParticle particleC" />
      </div>
    </div>
  );
}

function Globe() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0, height = 0, dpr = 1, rotation = -14, dragging = false, lastX = 0, raf = 0, phase = 0;
    const resize = () => {
      const box = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width; height = box.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const project = (lat: number, lon: number, radius: number) => {
      const phi = lat * Math.PI / 180;
      const lambda = (lon + rotation) * Math.PI / 180;
      return { x: width / 2 + radius * Math.cos(phi) * Math.sin(lambda), y: height / 2 - radius * Math.sin(phi), z: Math.cos(phi) * Math.cos(lambda) };
    };
    const drawPath = (points: Array<[number, number]>, radius: number, stroke: string, alpha: number, lineWidth = 1) => {
      ctx.beginPath(); let active = false;
      points.forEach(([lat, lon]) => {
        const p = project(lat, lon, radius);
        if (p.z <= 0) { active = false; return; }
        if (!active) { ctx.moveTo(p.x, p.y); active = true; } else ctx.lineTo(p.x, p.y);
      });
      ctx.globalAlpha = alpha; ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); ctx.globalAlpha = 1;
    };
    const route = (a: Marker, b: Marker, radius: number, color: string, offset: number, faint = false) => {
      const pts: Array<[number, number]> = [];
      for (let i = 0; i <= 80; i++) {
        const t = i / 80;
        pts.push([a.lat + (b.lat - a.lat) * t + Math.sin(Math.PI * t) * 10, a.lon + (b.lon - a.lon) * t]);
      }
      drawPath(pts, radius, color, faint ? .16 : .13, faint ? 2.2 : 5.5);
      drawPath(pts, radius, color, faint ? .34 : .9, faint ? .7 : 1.45);
      if (!faint) {
        const idx = Math.floor(((phase + offset) % 1) * (pts.length - 1));
        const p = project(pts[idx][0], pts[idx][1], radius);
        if (p.z > 0) {
          const pulse = 5 + Math.sin(phase * Math.PI * 8) * 2;
          ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 18;
          ctx.beginPath(); ctx.arc(p.x, p.y, pulse, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
        }
      }
    };
    const marker = (m: Marker, radius: number) => {
      const p = project(m.lat, m.lon, radius); if (p.z <= 0) return;
      const primary = m.kind !== "travel";
      if (primary) {
        ctx.strokeStyle = "rgba(214,194,143,.35)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 10 + Math.sin(phase * 14) * 2, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.fillStyle = m.kind === "travel" ? "rgba(214,194,143,.38)" : "#d6c28f";
      ctx.beginPath(); ctx.arc(p.x, p.y, m.kind === "base" ? 5.5 : 4, 0, Math.PI * 2); ctx.fill();
      if (primary) {
        ctx.font = "800 9px Arial"; const text = m.label; const tw = ctx.measureText(text).width;
        ctx.fillStyle = "rgba(9,11,13,.78)"; ctx.strokeStyle = "rgba(214,194,143,.25)";
        ctx.beginPath(); ctx.roundRect(p.x + 10, p.y - 12, tw + 18, 23, 11); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "rgba(243,239,231,.92)"; ctx.fillText(text, p.x + 19, p.y + 3);
      }
    };
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const r = Math.min(width, height) * .39, cx = width / 2, cy = height / 2;
      const halo = ctx.createRadialGradient(cx-r*.35,cy-r*.35,0,cx,cy,r*1.28);
      halo.addColorStop(0,"rgba(214,194,143,.24)"); halo.addColorStop(.45,"rgba(143,154,130,.11)"); halo.addColorStop(1,"rgba(9,11,13,0)");
      ctx.fillStyle=halo; ctx.beginPath(); ctx.arc(cx,cy,r*1.28,0,Math.PI*2); ctx.fill();
      const globe = ctx.createRadialGradient(cx-r*.35,cy-r*.4,r*.04,cx,cy,r);
      globe.addColorStop(0,"#2a343a"); globe.addColorStop(.58,"#151a1e"); globe.addColorStop(1,"#080a0c");
      ctx.fillStyle=globe; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle="rgba(255,255,255,.15)"; ctx.lineWidth=1; ctx.stroke();
      for(let lat=-75;lat<=75;lat+=15){const pts:Array<[number,number]>=[];for(let lon=-180;lon<=180;lon+=3)pts.push([lat,lon]);drawPath(pts,r,"rgba(255,255,255,.1)",1,.6)}
      for(let lon=-180;lon<180;lon+=15){const pts:Array<[number,number]>=[];for(let lat=-90;lat<=90;lat+=3)pts.push([lat,lon]);drawPath(pts,r,"rgba(255,255,255,.07)",1,.6)}
      const caracas=markers[0], italy=markers[1], madrid=markers[2];
      route(caracas, italy, r, "#d6c28f", 0);
      route(italy, madrid, r, "#a9b79d", .52);
      route(caracas, madrid, r, "#d6c28f", .2, true);
      markers.forEach(m=>marker(m,r));
      if(!dragging) rotation += .018; phase = (phase + .0028) % 1; raf=requestAnimationFrame(draw);
    };
    const down=(e:PointerEvent)=>{dragging=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId)};
    const move=(e:PointerEvent)=>{if(!dragging)return;rotation+=(e.clientX-lastX)*.28;lastX=e.clientX};
    const up=()=>{dragging=false};
    resize(); window.addEventListener("resize",resize); canvas.addEventListener("pointerdown",down); canvas.addEventListener("pointermove",move); canvas.addEventListener("pointerup",up); canvas.addEventListener("pointercancel",up); raf=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);canvas.removeEventListener("pointerdown",down);canvas.removeEventListener("pointermove",move);canvas.removeEventListener("pointerup",up);canvas.removeEventListener("pointercancel",up)};
  }, []);
  return <canvas ref={ref} className="globeCanvas" aria-label="Interactive globe connecting Caracas, Italy and Madrid" />;
}

export default function Home() {
  useEffect(() => {
    const reveal = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && e.target.classList.add("is-visible")), { threshold: .1, rootMargin: "0px 0px -7%" });
    document.querySelectorAll("[data-reveal]").forEach(n => reveal.observe(n));
    const move=(e:PointerEvent)=>{document.documentElement.style.setProperty("--mx",`${e.clientX}px`);document.documentElement.style.setProperty("--my",`${e.clientY}px`);document.documentElement.style.setProperty("--px",String(e.clientX/innerWidth-.5));document.documentElement.style.setProperty("--py",String(e.clientY/innerHeight-.5))};
    const scroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty("--scroll",String(max>0?scrollY/max:0))};
    addEventListener("pointermove",move,{passive:true});addEventListener("scroll",scroll,{passive:true});scroll();
    return()=>{reveal.disconnect();removeEventListener("pointermove",move);removeEventListener("scroll",scroll)};
  }, []);

  return (
    <main>
      <div className="scrollProgress" aria-hidden="true" /><div className="cursorGlow" aria-hidden="true" />
      <nav className="nav"><a href="#top" className="monogram">BR</a><div className="navLinks"><a href="#practice">Practice</a><a href="#work">Work</a><a href="#profile">Profile</a><a href="#education">Education</a></div><a href="#contact" className="navCta">Contact ↗</a></nav>

      <section id="top" className="hero sectionFx">
        <div className="heroTop" data-reveal><span>Architectural + Luxury Designer</span><span>Madrid · 2026</span></div>
        <div className="heroStage"><p className="heroKicker" data-reveal>From bit to matter.</p><h1 aria-label="Bobbio Russian"><span className="heroWord heroWordA">BOBBIO</span><span className="heroWord heroWordB">RUSSIAN</span></h1><div className="heroOrb"><span /></div><p className="heroStatement" data-reveal>Architectural and luxury design, bio-design and creative project leadership — connected by technology, material intelligence and atmosphere.</p></div>
        <div className="heroBottom" data-reveal><a href="#practice">Scroll to discover ↓</a><span>Venezuelan · Italian · Madrid-based</span></div>
      </section>
      <div className="ticker"><div>ARCHITECTURAL + LUXURY DESIGN — BIO-DESIGN — CREATIVE PROJECT LEAD — DIGITAL CRAFT — IMMERSIVE VISUALISATION — ARCHITECTURAL + LUXURY DESIGN — BIO-DESIGN — CREATIVE PROJECT LEAD —</div></div>

      <section id="practice" className="practice sectionPad sectionFx">
        <div className="sectionIntro" data-reveal><p className="sectionIndex">01 / PRACTICE</p><h2>Three roles. <em>One point of view.</em></h2></div>
        <PracticeOrbit />
        <div className="discipline disciplineLight" data-reveal><div className="disciplineNo">01</div><div><p className="micro">SPACE / MATERIAL / DETAIL</p><h3>Architectural +<br />Luxury Design</h3></div><p>Spatial concepts, high-end interiors, kitchens, furniture and technical thinking resolved as one coherent system — from first diagram to buildable detail.</p></div>
        <div className="discipline disciplineBio" data-reveal><div className="disciplineNo">02</div><div><p className="micro">LIVING / DIGITAL / EXPERIMENTAL</p><h3>Bio-<br />Designer</h3></div><p>Living systems, digital fabrication, 3D and research-led design. Biology and technology become active design materials rather than presentation layers.</p></div>
        <div className="discipline disciplineLead" data-reveal><div className="disciplineNo">03</div><div><p className="micro">VISION / COORDINATION / DELIVERY</p><h3>Creative<br />Project Lead</h3></div><p>I connect concept, client, technical teams and visual storytelling so a strong idea survives the entire process — not only the first presentation.</p></div>
      </section>

      <SectionBridge no="02" next="Selected Work" caption="From practice to proof" />

      <section id="work" className="work sectionPad sectionFx">
        <div className="workHeader" data-reveal><p className="sectionIndex">02 / SELECTED WORK</p><h2>Projects are not thumbnails.<br /><span>They are worlds.</span></h2></div>
        <article className="urbanCase">
          <div className="urbanTitle" data-reveal><div><p className="micro accentText">FEATURED CASE STUDY · BIO-DESIGN</p><h3>URBAN<br />PONICS</h3></div><p>A living-system project told as a continuous sequence: film, object, system and space. The media is loaded into the narrative instead of sitting outside it.</p></div>
          <div className="chapter" data-reveal><div className="chapterMeta"><span>ACT I</span><span>THE FILM</span><span>01 / 04</span></div><div className="mediaShell mediaShellHero"><div className="media mediaFilm"><iframe title="Urban Ponics film" src={VIMEO} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen /></div><span className="mediaStatus">LIVE FILM · AUTOPLAY</span></div></div>
          <div className="chapterGrid">
            <div className="chapter" data-reveal><div className="chapterMeta"><span>ACT II</span><span>THE OBJECT</span><span>02 / 04</span></div><div className="mediaShell"><div className="media mediaModel"><iframe title="Urban Ponics Tower interactive 3D" src={SKETCHFAB_TOWER} allow="autoplay; fullscreen; xr-spatial-tracking" allowFullScreen loading="eager" /></div><span className="mediaStatus">LIVE 3D · AUTO-LOADED</span></div><div className="chapterCopy"><b>Tower</b><span>Sketchfab</span></div></div>
            <div className="chapter chapterOffset" data-reveal><div className="chapterMeta"><span>ACT III</span><span>THE SYSTEM</span><span>03 / 04</span></div><div className="mediaShell"><div className="media mediaModel"><iframe title="Urban Ponics NFT System interactive 3D" src={SKETCHFAB_NFT} allow="autoplay; fullscreen; xr-spatial-tracking" allowFullScreen loading="eager" /></div><span className="mediaStatus">LIVE 3D · AUTO-LOADED</span></div><div className="chapterCopy"><b>NFT System</b><span>Sketchfab</span></div></div>
          </div>
          <div className="chapter chapterPanorama" data-reveal><div className="chapterMeta"><span>ACT IV</span><span>THE SPACE</span><span>04 / 04</span></div><div className="mediaShell"><div className="media mediaPano"><iframe title="Urban Ponics Twinmotion panorama" src={TWINMOTION} allow="fullscreen; accelerometer; gyroscope" allowFullScreen loading="lazy" /></div><span className="mediaStatus">IMMERSIVE 360º</span></div><div className="chapterCopy"><b>Enter the environment</b><span>Twinmotion</span></div></div>
        </article>
      </section>

      <SectionBridge no="03" next="Profile" caption="Work becomes identity" />

      <section id="profile" className="profile sectionPad sectionFx">
        <div className="profileHeadline" data-reveal><p className="sectionIndex darkIndex">03 / PROFILE</p><h2>Venezuelan by origin. <em>Italian by identity.</em> Based in Madrid.</h2></div>
        <div className="identityStatement" data-reveal><span>CARACAS</span><i>→</i><span>ITALIA</span><i>→</i><span>MADRID</span></div>
        <div className="profileGrid">
          <div className="profileCopy" data-reveal><p className="profileLead">I’m Alessandro Bobbio Russian — Venezuelan-born, Italian and currently living and working in Madrid.</p><p>Caracas is my origin and first cultural lens. Italy is my family identity and citizenship. Madrid is my home and professional base today. Travel expands that mix: different cities, materials and ways of living continuously feed the way I design.</p><div className="identityCards"><article><span>ORIGIN</span><b>Venezuela</b><small>Caracas · where my story starts.</small></article><article><span>IDENTITY</span><b>Italy</b><small>Italian citizenship and heritage.</small></article><article><span>BASE</span><b>Spain</b><small>Madrid · where I live and practice.</small></article></div><div className="facts"><div><span>ORIGIN</span><b>Caracas, Venezuela</b></div><div><span>CITIZENSHIP</span><b>Italian</b></div><div><span>BASED</span><b>Madrid, Spain</b></div><div><span>LANGUAGES</span><b>ES · EN · IT · FR</b></div></div></div>
          <div className="globePanel" data-reveal><div className="globeWrap"><Globe /><div className="globeHint">DRAG THE PLANET ↔</div></div><div className="routeLegend"><div><span className="routeDot origin" /><b>Caracas</b><small>Origin</small></div><div><span className="routeDot identity" /><b>Italia</b><small>Identity + citizenship</small></div><div><span className="routeDot base" /><b>Madrid</b><small>Current base</small></div></div></div>
        </div>
      </section>

      <SectionBridge no="04" next="Education" caption="The path behind the practice" />

      <section id="education" className="education sectionPad sectionFx">
        <div className="educationHeader" data-reveal><p className="sectionIndex">04 / EDUCATION</p><div><h2>Three institutions.<br /><em>One evolving discipline.</em></h2><p>From foundation, to engineering logic, to design practice — the timeline explains how each stage changed the way I think.</p></div></div>
        <div className="educationTrack" data-reveal>
          <div className="educationRail"><span /></div>
          {education.map((item, index) => <article className={`educationItem educationItem${index + 1}`} key={item.no}><div className="eduIndex"><span>{item.no}</span><i /></div><div className="eduCard"><div className="eduGhost">{item.key}</div><p className="micro">{item.meta}</p><h3>{item.place}</h3><h4>{item.title}</h4><p>{item.text}</p><div className="eduPulse"><span /></div></div></article>)}
        </div>
      </section>

      <SectionBridge no="05" next="Approach" caption="From formation to philosophy" />

      <section className="manifesto sectionPad sectionFx"><p className="sectionIndex" data-reveal>05 / APPROACH</p><div className="manifestoGrid"><h2 data-reveal>Design should feel <em>inevitable</em>, not decorated.</h2><p data-reveal>I look for the point where function, leadership, technology, matter and emotion stop competing and become one thing.</p></div></section>
      <footer id="contact" className="footer sectionPad"><div className="footerTop" data-reveal><p>Architecture · Luxury · Bio-design · Creative direction</p><a href="mailto:hello@bobbiorussian.com">LET’S<br />MAKE IT<br /><em>TANGIBLE.</em> ↗</a></div><div className="footerBottom"><b>BOBBIO RUSSIAN</b><span>Madrid · 2026</span><span>© 2026</span></div></footer>
      <nav className="mobileDock"><a href="#practice">Practice</a><a href="#work">Work</a><a href="#profile">Profile</a><a href="#education">Education</a></nav>
    </main>
  );
}
