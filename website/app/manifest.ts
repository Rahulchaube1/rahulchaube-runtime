import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#111213",
    theme_color: "#111213",
    icons: [
      { src: "/rc-mark-192.png", sizes: "192x192", type: "image/png" },
      { src: "/rc-mark-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
