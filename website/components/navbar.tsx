"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { Logo } from "@/components/logo";
import { SearchModal } from "@/components/search-modal";
import { ThemeToggle } from "@/components/theme-toggle";
import { Github } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 dark:border-[#163830] bg-white/85 dark:bg-[#071A16]/85 backdrop-blur-md font-sans transition-colors duration-200">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-zinc-900 dark:text-[#F0F6FC] hover:opacity-90 transition-opacity">
          <Logo className="w-7 h-7" />
          <div className="flex flex-col text-left">
            <span className="text-sm tracking-tight font-extrabold flex items-center gap-1.5">
              RahulChaube <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-[#2FA866] dark:text-[#A8F05B] border border-[#2FA866]/20 font-mono">v1.0</span>
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="hidden items-center gap-1 text-xs text-zinc-600 dark:text-[#8B949E] md:flex">
          {site.nav.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-1.5 rounded-md transition-colors font-medium relative",
                  isActive
                    ? "text-zinc-900 dark:text-[#F0F6FC] font-semibold bg-zinc-100 dark:bg-[#0E2923]"
                    : "hover:text-zinc-900 dark:hover:text-[#F0F6FC] hover:bg-zinc-100 dark:hover:bg-[#0A1F1B]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Search, Theme Toggle & Actions */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:block">
            <SearchModal />
          </div>

          <ThemeToggle />

          <a
            href={site.social.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-[#0A1F1B] hover:bg-zinc-200 dark:hover:bg-[#0E2923] text-zinc-900 dark:text-[#F0F6FC] border border-zinc-200 dark:border-[#163830] transition-all"
            aria-label="GitHub Repository"
          >
            <Github className="w-3.5 h-3.5 text-zinc-700 dark:text-[#F0F6FC]" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
