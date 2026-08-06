import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Practice", description: "Architectural design, digital development, project delivery and creative direction." };
const chapters = [
 ["01", "Architectural Design", "Spatial planning, luxury interiors, premium kitchens, Total Living, bespoke furniture and material definition.", "Space is developed at the scale of daily life—from the room to the fitted detail."],
 ["02", "Digital Development", "3D modeling, technical drawings, visualization, animation, panoramas and digital twins.", "Digital space is a place to test, coordinate and communicate before matter is committed."],
 ["03", "Project Delivery", "Technical documentation, supplier and manufacturing coordination, installation and client communication.", "Design remains present through the chain of decisions that makes an environment real."],
 ["04", "Creative Direction", "Architectural presentations, renders, animation, video and visual storytelling.", "Every representation should clarify an idea—not simply decorate it."],
];
export default function Practice() { return <main className="page"><header className="page-hero practice-hero"><p className="kicker">Practice / From bit to matter</p><h1>Designing the entire<br /><em>transition.</em></h1><p>A practice connecting spatial thinking, technical development, communication and delivery.</p></header><section className="practice-chapters">{chapters.map(x => <article key={x[0]}><span>{x[0]}</span><h2>{x[1]}</h2><p>{x[2]}</p><blockquote>{x[3]}</blockquote></article>)}</section><section className="contact-band compact"><p>Connected workflows, one spatial intention.</p><h2>See the work<br /><em>in context.</em></h2><Link href="/work">View work ↗</Link></section></main>; }
