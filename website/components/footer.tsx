import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-[#163830] bg-white dark:bg-[#071A16] font-sans text-sm text-zinc-600 dark:text-[#8B949E] transition-colors duration-200">
      <div className="site-container grid gap-10 py-16 lg:py-20 md:grid-cols-5">
        
        {/* Brand Column */}
        <div className="md:col-span-1 space-y-4">
          <Link href="/" className="flex items-center gap-3 font-bold text-zinc-900 dark:text-[#F0F6FC]">
            <Logo className="w-8 h-8" />
            <span className="text-base sm:text-lg tracking-tight font-black">{site.name}</span>
          </Link>
          <p className="text-sm text-zinc-600 dark:text-[#8B949E] leading-relaxed">
            High-performance developer platform for JavaScript &amp; TypeScript.
          </p>
        </div>

        {/* Product & Download */}
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-[#F0F6FC] uppercase tracking-wider mb-4">Product</h4>
          <ul className="space-y-3 font-medium">
            <li><Link href="/" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Overview</Link></li>
            <li><Link href="/download" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Download</Link></li>
            <li><Link href="/benchmarks" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Benchmarks</Link></li>
            <li><Link href="/roadmap" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Roadmap</Link></li>
            <li><Link href="/releases" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Releases</Link></li>
          </ul>
        </div>

        {/* Documentation & Resources */}
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-[#F0F6FC] uppercase tracking-wider mb-4">Documentation</h4>
          <ul className="space-y-3 font-medium">
            <li><Link href="/docs" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Docs Home</Link></li>
            <li><Link href="/docs/cli" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">CLI Reference</Link></li>
            <li><a href="/api/openapi.json" target="_blank" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">API Specs</a></li>
            <li><Link href="/blog" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Blog</Link></li>
          </ul>
        </div>

        {/* Legal & Security */}
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-[#F0F6FC] uppercase tracking-wider mb-4">Legal</h4>
          <ul className="space-y-3 font-medium">
            <li><Link href="/license" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Privacy Policy</Link></li>
            <li><Link href="/license" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Terms of Service</Link></li>
            <li><Link href="/license" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Security</Link></li>
            <li><Link href="/license" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Open Source License</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-[#F0F6FC] uppercase tracking-wider mb-4">Contact</h4>
          <ul className="space-y-3 font-medium">
            <li><a href="mailto:rahulchaube@users.noreply.github.com" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Support Email</a></li>
            <li><a href={site.social.discord} target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Discord Community</a></li>
            <li><a href={site.social.x} target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">X (Twitter)</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-200 dark:border-[#163830] py-8 bg-zinc-50/50 dark:bg-[#0A1F1B]/60">
        <div className="site-container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-medium">
          <span className="text-zinc-500 dark:text-[#8B949E]">© 2026 RahulChaube Runtime</span>
          <div className="flex items-center gap-8 text-zinc-500 dark:text-[#8B949E]">
            <Link href="/license" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Privacy</Link>
            <Link href="/license" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Terms</Link>
            <Link href="/license" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Security</Link>
            <Link href="/license" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">License</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
