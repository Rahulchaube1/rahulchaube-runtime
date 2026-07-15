import Link from "next/link";
import { site } from "@/lib/site";
import { ThemeToggle } from "./theme-toggle";
import { Github } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-ink-900/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="grid h-7 w-7 rotate-45 place-items-center rounded-lg bg-brand">
            <span className="-rotate-45 text-white">◆</span>
          </span>
          <span>{site.shortName}</span>
        </Link>
        <div className="hidden gap-6 text-sm text-ink-700 dark:text-white/80 md:flex">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-brand">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={site.social.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-black/10 p-2 dark:border-white/10"
            aria-label="GitHub"
          >
            <Github size={16} />
          </a>
        </div>
      </nav>
    </header>
  );
}
