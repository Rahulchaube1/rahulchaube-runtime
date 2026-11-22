import { readFileSync } from "node:fs";
import { join } from "node:path";
import { guides } from "./doc-catalog";

export function readGuide(slug: string, directory = join(process.cwd(), "content", "docs")) {
  if (!guides.some((guide) => guide.slug === slug)) throw new Error("Unknown documentation page");
  return readFileSync(join(directory, slug + ".md"), "utf8");
}

export function headingId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function guideHeadings(body: string) {
  return [...body.replace(/```[\s\S]*?```/g, "").matchAll(/^## (.+)$/gm)].map((match) => ({
    label: match[1],
    id: headingId(match[1]),
  }));
}

export function searchIndex(directory?: string) {
  return guides.map((guide) => {
    const body = readGuide(guide.slug, directory);
    return {
      ...guide,
      headings: guideHeadings(body)
        .map((heading) => heading.label)
        .join(" "),
      body,
    };
  });
}
