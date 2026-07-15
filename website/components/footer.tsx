import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white/60 dark:border-white/10 dark:bg-ink-900/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold">
            <span className="grid h-7 w-7 rotate-45 place-items-center rounded-lg bg-brand">
              <span className="-rotate-45 text-white">◆</span>
            </span>
            {site.shortName}
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink-700 dark:text-white/70">{site.tagline}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Product</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-700 dark:text-white/70">
            <li><Link href="/download" className="hover:text-brand">Download</Link></li>
            <li><Link href="/docs" className="hover:text-brand">Docs</Link></li>
            <li><Link href="/benchmarks" className="hover:text-brand">Benchmarks</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Community</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-700 dark:text-white/70">
            <li><Link href="/blog" className="hover:text-brand">Blog</Link></li>
            <li><Link href="/roadmap" className="hover:text-brand">Roadmap</Link></li>
            <li><a href={site.social.github} className="hover:text-brand">GitHub</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-700 dark:text-white/70">
            <li><span>MIT License</span></li>
            <li><span>Independent fork of Bun</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-black/10 py-4 text-center text-xs text-ink-700 dark:border-white/10 dark:text-white/50">
        {site.name} is an independent, MIT-licensed fork of Bun. Not affiliated with or endorsed by the Bun authors.
      </div>
    </footer>
  );
}
