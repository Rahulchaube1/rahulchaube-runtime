import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-[#163830] bg-white dark:bg-[#071A16] font-sans text-xs text-zinc-600 dark:text-[#8B949E] transition-colors duration-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-5">
        
        {/* Brand Column */}
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-zinc-900 dark:text-[#F0F6FC] mb-3">
            <Logo className="w-6 h-6" />
            <span className="text-sm tracking-tight font-extrabold">{site.company}</span>
          </Link>
          <p className="text-xs text-zinc-600 dark:text-[#8B949E] leading-relaxed">
            High-performance developer platform for JavaScript &amp; TypeScript.
          </p>
        </div>

        {/* Company Column */}
        <div>
          <h4 className="text-xs font-semibold text-zinc-900 dark:text-[#F0F6FC] uppercase tracking-wider mb-3">Company</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">About</Link></li>
            <li><Link href="/download" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Products</Link></li>
            <li><Link href="/download" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Runtime</Link></li>
            <li><Link href="/docs" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Studio</Link></li>
            <li><a href="/api/openapi.json" target="_blank" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">API</a></li>
            <li><Link href="/roadmap" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Platform</Link></li>
          </ul>
        </div>

        {/* Resources Column */}
        <div>
          <h4 className="text-xs font-semibold text-zinc-900 dark:text-[#F0F6FC] uppercase tracking-wider mb-3">Resources</h4>
          <ul className="space-y-2">
            <li><Link href="/docs" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Documentation</Link></li>
            <li><Link href="/blog" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Blog</Link></li>
            <li><Link href="/roadmap" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Roadmap</Link></li>
            <li><Link href="/releases" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Release Notes</Link></li>
          </ul>
        </div>

        {/* Developers Column */}
        <div>
          <h4 className="text-xs font-semibold text-zinc-900 dark:text-[#F0F6FC] uppercase tracking-wider mb-3">Developers</h4>
          <ul className="space-y-2">
            <li><Link href="/docs/cli" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">CLI</Link></li>
            <li><Link href="/docs" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Plugins</Link></li>
            <li><Link href="/docs" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Templates</Link></li>
            <li><a href="/api/openapi.json" target="_blank" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">API Specs</a></li>
          </ul>
        </div>

        {/* Community / Contact Column */}
        <div>
          <h4 className="text-xs font-semibold text-zinc-900 dark:text-[#F0F6FC] uppercase tracking-wider mb-3">Community &amp; Contact</h4>
          <ul className="space-y-2">
            <li><a href="mailto:rahulchaube@users.noreply.github.com" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Email</a></li>
            <li><a href={site.social.discord} target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Discord</a></li>
            <li><a href={site.social.x} target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">X (Twitter)</a></li>
            <li><a href={site.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">LinkedIn</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-200 dark:border-[#163830] py-6 bg-zinc-50/50 dark:bg-[#0A1F1B]/60">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-zinc-500 dark:text-[#8B949E]">© 2026 RahulChaube Runtime. All rights reserved.</span>
          <div className="flex items-center gap-6 text-zinc-500 dark:text-[#8B949E]">
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
