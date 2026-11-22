import type { MetadataRoute } from "next";
import { guides, docUrl } from "@/lib/doc-catalog";
import { posts } from "@/lib/blog";
import { site } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "/",
    "/download",
    "/commands",
    "/learn",
    "/docs",
    "/benchmarks",
    "/blog",
    "/roadmap",
    "/releases",
    "/license",
    "/about",
    "/community",
    "/security",
    "/vision",
    ...guides.map(docUrl),
    ...posts.map((post) => "/blog/" + post.slug),
  ];
  return pages.map((path) => ({ url: new URL(path, site.domain).href, priority: path === "/" ? 1 : 0.7 }));
}
