import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "@/components/logo";
import { Github, ShieldCheck, Rss, Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-[#30363D] bg-white dark:bg-[#0D1117] font-sans text-xs text-zinc-600 dark:text-[#8B949E] transition-colors duration-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2.5 font-bold text-zinc-900 dark:text-[#F0F6FC] mb-3">
            <Logo className="w-6 h-6" />
            <span className="text-sm tracking-tight">{site.name}</span>
          </Link>
          <p className="text-xs text-zinc-600 dark:text-[#8B949E] leading-relaxed mb-4">{site.description}</p>
          <div className="flex items-center gap-2 text-[11px] text-green-600 dark:text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Platform Status: Operational</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-zinc-900 dark:text-[#F0F6FC] uppercase tracking-wider mb-3">Product</h4>
          <ul className="space-y-2">
            <li><Link href="/download" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Download Center</Link></li>
            <li><Link href="/releases" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Release Notes &amp; Checksums</Link></li>
            <li><Link href="/docs" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Documentation</Link></li>
            <li><Link href="/benchmarks" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Benchmarks</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-zinc-900 dark:text-[#F0F6FC] uppercase tracking-wider mb-3">Ecosystem &amp; API</h4>
          <ul className="space-y-2">
            <li><Link href="/blog" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Engineering Blog</Link></li>
            <li><Link href="/roadmap" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Product Roadmap</Link></li>
            <li><a href="/api/openapi.json" target="_blank" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">OpenAPI Spec</a></li>
            <li><a href="/feed.xml" target="_blank" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors flex items-center gap-1"><Rss className="w-3 h-3 text-amber-500" /> RSS Feed</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-zinc-900 dark:text-[#F0F6FC] uppercase tracking-wider mb-3">Open Source</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> <span>MIT License</span></li>
            <li className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-zinc-500 dark:text-[#8B949E]" /> <span>Independent Bun Engine Fork</span></li>
            <li><a href={site.social.github} target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors flex items-center gap-1 mt-2"><Github className="w-3.5 h-3.5" /> GitHub Repository</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-200 dark:border-[#30363D] py-4 text-center text-[11px] text-zinc-500 dark:text-[#8B949E] bg-zinc-100/50 dark:bg-[#161B22]/40">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} RahulChaube Runtime. All rights reserved.</span>
          <span>RahulChaube Runtime is an independent, MIT-licensed fork. Not affiliated with or endorsed by Oven LLC.</span>
        </div>
      </div>
    </footer>
  );
}
