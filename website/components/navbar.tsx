"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { Logo } from "@/components/logo";
import { SearchModal } from "@/components/search-modal";
import { ThemeToggle } from "@/components/theme-toggle";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 dark:border-[#163830] bg-white/90 dark:bg-[#071A16]/90 backdrop-blur-md font-sans transition-colors duration-200">
      <nav className="site-container h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 font-bold text-zinc-900 dark:text-[#F0F6FC] hover:opacity-95 transition-opacity">
          <Logo className="w-9 h-9 shrink-0" />
          <div className="flex flex-col text-left">
            <span className="text-base sm:text-lg tracking-tight font-black flex items-center gap-2">
              RahulChaube <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-[#2FA866] dark:text-[#A8F05B] border border-[#2FA866]/30 font-mono font-semibold">v1.0</span>
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="hidden items-center gap-1.5 text-sm text-zinc-600 dark:text-[#8B949E] md:flex">
          {site.nav.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg transition-all font-semibold relative",
                  isActive
                    ? "text-zinc-900 dark:text-[#F0F6FC] bg-zinc-100 dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830]"
                    : "hover:text-zinc-900 dark:hover:text-[#F0F6FC] hover:bg-zinc-100 dark:hover:bg-[#0A1F1B]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Search, Theme Toggle & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <SearchModal />
          </div>

          <ThemeToggle />

          <Link
            href="/download"
            className="flex items-center gap-2 px-4.5 py-2.5 text-sm font-bold rounded-xl bg-[#2FA866] hover:bg-[#279559] text-white transition-all shadow-md hover:shadow-lg hover:shadow-[#2FA866]/20 hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
