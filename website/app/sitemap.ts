import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/download", "/docs", "/benchmarks", "/blog", "/roadmap"];
  const now = new Date();
  return routes.map((r) => ({
    url: `${site.domain}${r}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.7,
  }));
}
