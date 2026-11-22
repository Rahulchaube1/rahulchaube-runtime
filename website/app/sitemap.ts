import type { MetadataRoute } from "next";
import { docs } from "@/lib/docs";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/download", "/docs", "/benchmarks", "/blog", "/roadmap", "/releases", "/license", "/about", "/community", ...docs.map(doc => "/docs/" + doc.slug)];
  const now = new Date();
  return routes.map((r) => ({
    url: `${site.domain}${r}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.7,
  }));
}
