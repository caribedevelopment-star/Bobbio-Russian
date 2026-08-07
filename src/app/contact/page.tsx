import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact", description: "Contact Alessandro Bobbio Russian in Madrid." };

export default function ContactPage() {
  return (
    <main id="main">
      <section className="shell contact-panel">
        <div><p className="route-eyebrow">05 · Contact</p><h1>Let’s make ideas physical.</h1></div>
        <div><p className="route-hero__copy">Madrid, Spain · Architectural Design · Luxury Interiors · Bio-Design</p><div className="contact-links"><a href="https://www.linkedin.com/in/bobbiorussian/" target="_blank" rel="noreferrer"><span>LinkedIn</span><b>↗</b></a><a href="https://bobbio-russian.carrd.co/" target="_blank" rel="noreferrer"><span>Legacy portfolio</span><b>↗</b></a></div></div>
      </section>
    </main>
  );
}
