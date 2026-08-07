import Link from "next/link";

export default function NotFound() {
  return <main id="main"><section className="route-hero"><p className="route-eyebrow">404 · Not found</p><h1>This space does not exist.</h1><p className="route-hero__copy">Return to the portfolio index and continue exploring the work.</p><Link className="process-link" href="/">Back to Index ↗</Link></section></main>;
}
