"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docSections } from "@/lib/docs";
import { docs } from "@/lib/docs";
import { cn } from "@/lib/utils";

export function DocsSidebar() {
  const pathname = usePathname();
  const slugFor = (section: string) => docs.find((d) => d.section === section)?.slug ?? "";

  return (
    <aside className="w-60 shrink-0 border-r border-black/10 p-4 dark:border-white/10">
      <nav className="space-y-1 text-sm">
        {docSections.map((section) => {
          const slug = slugFor(section);
          const href = `/docs/${slug}`;
          const active = pathname === href;
          return (
            <Link
              key={section}
              href={href}
              className={cn(
                "block rounded-lg px-3 py-2",
                active ? "bg-brand/10 font-semibold text-brand" : "text-ink-700 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/5",
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
