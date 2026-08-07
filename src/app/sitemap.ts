import type { MetadataRoute } from "next";
import { projects } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://bobbio-russian.vercel.app";
  const staticRoutes = ["", "/work", "/practice", "/bio-design", "/profile", "/contact"];
  return [...staticRoutes.map(path => ({ url: `${base}${path}`, changeFrequency: "monthly" as const, priority: path === "" ? 1 : .8 })), ...projects.map(project => ({ url: `${base}/work/${project.slug}`, changeFrequency: "monthly" as const, priority: .7 }))];
}
