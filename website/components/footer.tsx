"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/lib/site";
import { Logo } from "@/components/logo";

const AI_PROMPT = `Tell me about RahulChaube Runtime (https://www.rahulchaube.space).

Explain:
• What RahulChaube Runtime is
• Why it exists
• Its architecture
• CLI features
• Runtime features
• Package manager
• Bundler
• Developer experience
• Performance philosophy
• Ecosystem
• Documentation
• API
• Plugin system

Compare it fairly with
• Node.js
• Deno
• npm

Explain strengths, weaknesses and ideal use cases.
Do not invent features. Base your answer on publicly available information.`;

const encodedPrompt = encodeURIComponent(AI_PROMPT);

const AI_PLATFORMS = [
  {
    name: "ChatGPT",
    url: `https://chatgpt.com/?q=${encodedPrompt}`,
    type: "svg",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0813 4.779-2.7582a.794.794 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.5045 4.5045 0 0 1-4.4952 4.4952zM3.6 18.3044a4.4907 4.4907 0 0 1-.5358-3.0137l.142.0859 4.7838 2.7582a.7797.7797 0 0 0 .7855 0l5.836-3.368-2.02-1.1687a.0762.0762 0 0 1-.038-.0523l-4.8362-2.7917a4.5045 4.5045 0 0 1-4.1173 7.5503zM2.378 8.653a4.4755 4.4755 0 0 1 2.34-1.9729l-.0047.1627v5.5165a.7749.7749 0 0 0 .3928.6812l5.836 3.368-2.02 1.1686a.0762.0762 0 0 1-.0669.0095l-4.8362-2.7917a4.5045 4.5045 0 0 1-1.641-6.1419zm16.5966 3.8558l-5.836-3.368 2.02-1.1686a.0762.0762 0 0 1 .0668-.0095l4.8362 2.7917a4.5045 4.5045 0 0 1 1.0189 6.2758 4.4755 4.4755 0 0 1-2.34 1.9729l.0047-.1627v-5.5165a.7845.7845 0 0 0-.3928-.6813zm2.0153-3.0232l-.142-.0859-4.7838-2.7582a.7797.7797 0 0 0-.7855 0l-5.836 3.368 2.02 1.1687a.0762.0762 0 0 1 .038.0523l4.8362 2.7917a4.5045 4.5045 0 0 1 4.6531-4.5366 4.4907 4.4907 0 0 1 .000.0000zM8.3056 11.5898l-2.02-1.1686a.071.071 0 0 1-.038-.052V4.7866a4.5045 4.5045 0 0 1 7.3716-3.4544l-.1419.0813-4.779 2.7582a.794.794 0 0 0-.3927.6813v6.7369z"/>
      </svg>
    ),
  },
  {
    name: "Claude",
    url: `https://claude.ai/new?q=${encodedPrompt}`,
    type: "svg",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-4H9v-2h2V8.5h2V10.5h2v2h-2v4z"/>
        <path d="M13.727 3.652c-.544.17-.992.548-1.727 1.348l-2 2.18-2-2.18c-.735-.8-1.183-1.178-1.727-1.348-.908-.284-1.892.112-2.316.932-.424.82-.208 1.848.512 2.44l2.58 2.12-2.58 2.12c-.72.592-.936 1.62-.512 2.44.424.82 1.408 1.216 2.316.932.544-.17.992-.548 1.727-1.348l2-2.18 2 2.18c.735.8 1.183 1.178 1.727 1.348.908.284 1.892-.112 2.316-.932.424-.82.208-1.848-.512-2.44l-2.58-2.12 2.58-2.12c.72-.592.936-1.62.512-2.44-.424-.82-1.408-1.216-2.316-.932z"/>
      </svg>
    ),
  },
  {
    name: "Gemini",
    url: `https://gemini.google.com/app?q=${encodedPrompt}`,
    type: "svg",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M12 24c0-6.627-5.373-12-12-12 6.627 0 12-5.373 12-12 0 6.627 5.373 12 12 12-6.627 0-12 5.373-12 12z"/>
      </svg>
    ),
  },
  {
    name: "Grok",
    url: `https://grok.com/?q=${encodedPrompt}`,
    type: "svg",
    icon: (
      <svg viewBox="0.36 0.5 33.33 32" fill="currentColor" className="w-8 h-8">
        <path d="M13.2371 21.0407L24.3186 12.8506C24.8619 12.4491 25.6384 12.6057 25.8973 13.2294C27.2597 16.5185 26.651 20.4712 23.9403 23.1851C21.2297 25.8989 17.4581 26.4941 14.0108 25.1386L10.2449 26.8843C15.6463 30.5806 22.2053 29.6665 26.304 25.5601C29.5551 22.3051 30.562 17.8683 29.6205 13.8673L29.629 13.8758C28.2637 7.99809 29.9647 5.64871 33.449 0.844576C33.5314 0.730667 33.6139 0.616757 33.6964 0.5L29.1113 5.09055V5.07631L13.2343 21.0436"/>
        <path d="M10.9503 23.0313C7.07343 19.3235 7.74185 13.5853 11.0498 10.2763C13.4959 7.82722 17.5036 6.82767 21.0021 8.2971L24.7595 6.55998C24.0826 6.07017 23.215 5.54334 22.2195 5.17313C17.7198 3.31926 12.3326 4.24192 8.67479 7.90126C5.15635 11.4239 4.0499 16.8403 5.94992 21.4622C7.36924 24.9165 5.04257 27.3598 2.69884 29.826C1.86829 30.7002 1.0349 31.5745 0.36364 32.5L10.9474 23.0341"/>
      </svg>
    ),
  },
  {
    name: "EverestQ",
    url: `https://everestqai.com/?q=${encodedPrompt}`,
    type: "img",
    src: "/ai-everestq-icon.png",
  },
];

export function Footer() {
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  const handlePlatformClick = (platformName: string, url: string) => {
    // Copy prompt to clipboard automatically
    if (navigator.clipboard) {
      navigator.clipboard.writeText(AI_PROMPT);
      setCopiedToast(`Prompt copied for ${platformName}! Opening...`);
      setTimeout(() => setCopiedToast(null), 3000);
    }
  };

  return (
    <footer className="border-t border-zinc-200 dark:border-[#163830] bg-white dark:bg-[#071A16] font-sans text-sm text-zinc-600 dark:text-[#8B949E] transition-colors duration-200">
      <div className="site-container grid gap-10 py-16 lg:py-20 md:grid-cols-5">
        
        {/* Brand & Trusted AI Ecosystem Column */}
        <div className="md:col-span-1 space-y-6">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-3 font-bold text-zinc-900 dark:text-[#F0F6FC]">
              <Logo className="h-10 w-auto" />
            </Link>
            <p className="text-sm text-zinc-600 dark:text-[#8B949E] leading-relaxed">
              High-performance developer platform for JavaScript &amp; TypeScript.
            </p>
          </div>

          {/* Trusted AI Ecosystem Section */}
          <div className="pt-2 space-y-3">
            <h5 className="text-xs font-bold text-zinc-400 dark:text-[#8B949E] uppercase tracking-wider font-title">
              Trusted AI Ecosystem
            </h5>

            <div className="flex flex-wrap items-center gap-4">
              {AI_PLATFORMS.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handlePlatformClick(platform.name, platform.url)}
                  aria-label={`Ask ${platform.name} about RahulChaube Runtime`}
                  title={`Ask ${platform.name} about RahulChaube Runtime`}
                  className="text-zinc-500 dark:text-[#8B949E] hover:text-[#2FA866] dark:hover:text-[#A8F05B] transition-all duration-200 hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(47,168,102,0.6)] cursor-pointer inline-flex items-center justify-center p-1 rounded-lg"
                >
                  {platform.type === "svg" ? (
                    platform.icon
                  ) : (
                    <img
                      src={platform.src}
                      alt={platform.name}
                      className="w-8 h-8 object-contain rounded-lg filter grayscale hover:grayscale-0 transition-all duration-200"
                    />
                  )}
                </a>
              ))}
            </div>

            {copiedToast && (
              <div className="text-[11px] font-mono text-[#2FA866] dark:text-[#A8F05B] animate-pulse">
                {copiedToast}
              </div>
            )}

            <p className="text-xs text-zinc-500 dark:text-[#8B949E] leading-tight font-sans">
              Ask your favorite AI assistant about RahulChaube Runtime.
            </p>
          </div>
        </div>

        {/* Product & Download */}
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-[#F0F6FC] uppercase tracking-wider mb-4 font-title">Product</h4>
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
          <h4 className="text-sm font-bold text-zinc-900 dark:text-[#F0F6FC] uppercase tracking-wider mb-4 font-title">Documentation</h4>
          <ul className="space-y-3 font-medium">
            <li><Link href="/docs" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Docs Home</Link></li>
            <li><Link href="/docs/cli" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">CLI Reference</Link></li>
            <li><a href="/api/openapi.json" target="_blank" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">API Specs</a></li>
            <li><Link href="/blog" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Blog</Link></li>
          </ul>
        </div>

        {/* Legal & Security */}
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-[#F0F6FC] uppercase tracking-wider mb-4 font-title">Legal</h4>
          <ul className="space-y-3 font-medium">
            <li><Link href="/license" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Privacy Policy</Link></li>
            <li><Link href="/license" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Terms of Service</Link></li>
            <li><Link href="/license" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Security</Link></li>
            <li><Link href="/license" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors">Software License</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-[#F0F6FC] uppercase tracking-wider mb-4 font-title">Contact</h4>
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
