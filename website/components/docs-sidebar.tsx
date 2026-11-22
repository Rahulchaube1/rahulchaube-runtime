"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docSections, docs } from "@/lib/docs";

export function DocsSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 border-r border-zinc-200 p-4 dark:border-vscode-border sm:block">
      <nav aria-label="Documentation" className="space-y-4 text-sm">
        {docSections.map(section => (
          <div key={section}>
            <p className="mb-1 font-semibold">{section}</p>
            {docs.filter(doc => doc.section === section).map(doc => {
              const href = "/docs/" + doc.slug;
              return <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}
                className="block rounded px-2 py-1 text-zinc-600 hover:underline aria-[current=page]:font-semibold dark:text-zinc-300">
                {doc.title}
              </Link>;
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
