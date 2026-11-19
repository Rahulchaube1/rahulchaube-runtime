"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docSections, docs } from "@/lib/docs";
import { cn } from "@/lib/utils";

export function DocsSidebar() {
  const pathname = usePathname();
  const slugFor = (section: string) => docs.find((d) => d.section === section)?.slug ?? "";

  return (
    <aside className="hidden sm:block w-56 shrink-0 border-r border-zinc-200 dark:border-[#30363D] p-4 font-sans bg-zinc-50 dark:bg-[#0D1117] transition-colors duration-200">

      <nav className="space-y-1 text-xs">
        <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-500 dark:text-[#8B949E] uppercase tracking-wider font-mono">
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
                  ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/20"
                  : "text-zinc-600 dark:text-[#8B949E] hover:text-zinc-900 dark:hover:text-[#F0F6FC] hover:bg-zinc-100 dark:hover:bg-[#161B22]"
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
