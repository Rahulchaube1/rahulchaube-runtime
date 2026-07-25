"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docSections, docs } from "@/lib/docs";
import { cn } from "@/lib/utils";
import { SearchModal } from "@/components/search-modal";

export function DocsSidebar() {
  const pathname = usePathname();
  const slugFor = (section: string) => docs.find((d) => d.section === section)?.slug ?? "";

  return (
    <aside className="w-64 shrink-0 border-r border-zinc-800/80 p-4 font-sans bg-zinc-950/40">
      <div className="mb-4">
        <SearchModal />
      </div>

      <nav className="space-y-1 text-xs">
        <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          Documentation
        </div>
        {docSections.map((section) => {
          const slug = slugFor(section);
          const href = `/docs/${slug}`;
          const active = pathname === href;
          return (
            <Link
              key={section}
              href={href}
              className={cn(
                "block rounded-xl px-3 py-2 transition-all font-medium",
                active
                  ? "bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              )}
            >
              {section}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
