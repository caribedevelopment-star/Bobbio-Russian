import type { MetadataRoute } from "next";
import { projects } from "@/content/site";
export default function sitemap(): MetadataRoute.Sitemap { const base = "https://bobbio-russian.vercel.app"; return ["", "/work", "/practice", "/bio-design", "/profile", "/contact", ...projects.map(p => `/work/${p.slug}`)].map(url => ({ url: `${base}${url}`, changeFrequency: "monthly" as const, priority: url === "" ? 1 : .7 })); }
