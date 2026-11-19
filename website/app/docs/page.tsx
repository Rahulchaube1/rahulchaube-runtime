import { getDoc } from "@/lib/docs";
import { Markdown } from "@/components/markdown";

export default function DocsIndex() {
  const doc = getDoc("getting-started")!;
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-brand">{doc.section}</p>
      <Markdown source={doc.body} />
    </div>
  );
}
