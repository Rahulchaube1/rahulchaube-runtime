"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Menu, X } from "lucide-react";
import { site } from "@/lib/site";
import { Logo } from "./logo";
import { SearchModal } from "./search-modal";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = site.nav.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      onClick={() => setOpen(false)}
      aria-current={pathname === item.href || pathname.startsWith(item.href + "/") ? "page" : undefined}
    >
      {item.label}
    </Link>
  ));
  return (
    <header className="site-header">
      <nav className="site-wrap main-nav" aria-label="Main navigation">
        <Link href="/" onClick={() => setOpen(false)} aria-label="RC Runtime home">
          <Logo />
        </Link>
        <div className="desktop-links">{links}</div>
        <div className="nav-tools">
          <SearchModal />
          <ThemeToggle />
          <a className="github-link" href={site.social.github}>
            <Github size={16} />
            <span>GitHub</span>
          </a>
          <button
            type="button"
            className="icon-button menu-trigger"
            aria-label="Navigation menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      {open && (
        <nav id="mobile-nav" className="mobile-links" aria-label="Mobile navigation">
          {links}
          <a href={site.social.github}>GitHub</a>
        </nav>
      )}
    </header>
  );
}
