import Link from "next/link";
import { posts } from "@/lib/blog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "News, engineering notes, and guides from the RahulChaube Runtime team.",
};

export default function BlogIndex() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Blog</h1>
      <p className="mt-3 text-ink-700 dark:text-white/70">Developer news, guides, and release notes.</p>
      <div className="mt-10 space-y-5">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`}>
            <Card className="transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-2 text-xs text-ink-700 dark:text-white/60">
                <span>{p.date}</span>
                <span>·</span>
                <span>{p.category}</span>
              </div>
              <h2 className="mt-2 text-xl font-semibold">{p.title}</h2>
              <p className="mt-2 text-sm text-ink-700 dark:text-white/70">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
