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
    <aside className="w-64 shrink-0 border-r border-[#30363D] p-4 font-sans bg-[#0D1117]">
      <div className="mb-4">
        <SearchModal />
      </div>

      <nav className="space-y-1 text-xs">
        <div className="px-3 py-1.5 text-[10px] font-bold text-[#8B949E] uppercase tracking-wider font-mono">
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
                "block rounded-lg px-3 py-2 transition-all font-medium",
                active
                  ? "bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20"
                  : "text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#161B22]"
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
