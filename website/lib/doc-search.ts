import type { Guide } from "./doc-catalog";
export interface SearchEntry extends Guide {
  headings: string;
  body: string;
}

export function searchGuides(index: SearchEntry[], query: string) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return index;
  return index
    .map((guide) => {
      const fields = [
        guide.title,
        guide.slug,
        guide.slug.replace(/^rc-/, "rc:"),
        guide.summary,
        guide.headings,
        guide.body,
      ].map((value) => value.toLowerCase());
      const weights = [12, 9, 9, 5, 3, 1];
      const points = terms.map((term) =>
        fields.reduce((sum, field, i) => sum + (field.includes(term) ? weights[i] : 0), 0),
      );
      const score = points.every(Boolean) ? points.reduce((a, b) => a + b, 0) : 0;
      return { guide, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.guide);
}
