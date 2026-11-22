import Link from "next/link";
import { BookOpen, ChevronDown, GraduationCap } from "lucide-react";
import { sections, guides, docUrl } from "@/lib/doc-catalog";

export function DocsSidebar({ active }: { active: string }) {
  const nav = (
    <nav aria-label="Handbook chapters">
      <Link className="side-overview" href="/docs">
        <BookOpen size={15} /> Handbook overview
      </Link>
      <Link className="side-overview" href="/learn">
        <GraduationCap size={16} /> Learn RC
      </Link>
      {sections.map((section) => (
        <div className="side-group" key={section.id}>
          <h2>{section.title}</h2>
          {guides
            .filter((guide) => guide.section === section.id)
            .map((guide) => (
              <Link
                key={guide.slug}
                href={docUrl(guide)}
                aria-current={active === guide.slug ? "page" : undefined}
              >
                {guide.title}
              </Link>
            ))}
        </div>
      ))}
    </nav>
  );
  return (
    <aside className="docs-sidebar">
      <div className="side-desktop">{nav}</div>
      <details className="side-mobile" key={active}>
        <summary>
          <BookOpen size={16} /> Browse the handbook <ChevronDown size={15} />
        </summary>
        {nav}
      </details>
    </aside>
  );
}
