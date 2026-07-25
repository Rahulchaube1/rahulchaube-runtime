import Link from "next/link";
import { posts } from "@/lib/blog";
import { Card, Badge } from "@/components/ui/card";
import { Calendar, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engineering Blog — RahulChaube Runtime",
  description: "News, engineering notes, release updates, and architecture guides from the RahulChaube Runtime team.",
};

export default function BlogIndex() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 font-sans">
      <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-4 border border-blue-500/20 font-mono w-fit">
        <FileText className="w-3.5 h-3.5" />
        Engineering Blog
      </div>
      <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-[#F0F6FC]">Engineering &amp; Release Notes</h1>
      <p className="mt-2 text-xs text-zinc-600 dark:text-[#8B949E]">Deep dives into runtime architecture, CLI design, and platform updates.</p>

      <div className="mt-10 space-y-4">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="block group">
            <Card className="bg-white dark:bg-[#1C2128] border-zinc-200 dark:border-[#30363D] hover:border-blue-500/50 transition-all">
              <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-[#8B949E] font-mono">
                <Calendar className="w-3 h-3 text-zinc-400 dark:text-[#8B949E]" />
                <span>{p.date}</span>
                <span>·</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">{p.category}</span>
              </div>
              <h2 className="mt-2 text-lg font-bold text-zinc-900 dark:text-[#F0F6FC] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{p.title}</h2>
              <p className="mt-2 text-xs text-zinc-600 dark:text-[#8B949E] leading-relaxed">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <Badge key={t}>#{t}</Badge>
                ))}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
