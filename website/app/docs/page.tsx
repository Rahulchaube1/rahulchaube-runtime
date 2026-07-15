import { docs } from "@/lib/docs";
import { Markdown } from "@/components/markdown";

export default function DocsIndex() {
  const doc = docs[0];
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-brand">{doc.section}</p>
      <Markdown source={doc.body} />
    </div>
  );
}
