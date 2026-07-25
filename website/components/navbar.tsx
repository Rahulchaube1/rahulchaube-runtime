"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { Logo } from "@/components/logo";
import { SearchModal } from "@/components/search-modal";
import { Github, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[#30363D] bg-[#0D1117]/85 backdrop-blur-md font-sans">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-[#F0F6FC] hover:opacity-90 transition-opacity">
          <Logo className="w-7 h-7" />
          <div className="flex flex-col text-left">
            <span className="text-sm tracking-tight font-extrabold flex items-center gap-1">
              RahulChaube <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">v1.0</span>
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="hidden items-center gap-1 text-xs text-[#8B949E] md:flex">
          {site.nav.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-1.5 rounded-md transition-colors font-medium relative",
                  isActive
                    ? "text-[#F0F6FC] font-semibold bg-[#1C2128]"
                    : "hover:text-[#F0F6FC] hover:bg-[#161B22]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <SearchModal />
          </div>

          <a
            href={site.social.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#161B22] hover:bg-[#1C2128] text-[#F0F6FC] border border-[#30363D] transition-all"
            aria-label="GitHub Repository"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
