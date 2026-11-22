import Link from "next/link";
import { Github, Linkedin, ArrowUpRight } from "lucide-react";
import { Logo } from "./logo";
import { site } from "@/lib/site";

const links = [
  {
    title: "Runtime",
    items: [
      ["Download", "/download"],
      ["Releases", "/releases"],
      ["Benchmarks", "/benchmarks"],
      ["Roadmap", "/roadmap"],
    ],
  },
  {
    title: "Developers",
    items: [
      ["Documentation", "/docs"],
      ["Learn RC", "/learn"],
      ["CLI reference", "/docs/cli"],
      ["Release API", "/docs/website-api"],
    ],
  },
  {
    title: "Project",
    items: [
      ["About Rahul", "/about"],
      ["Community", "/community"],
      ["Engineering notes", "/blog"],
      ["Contributing", "/docs/contributing"],
    ],
  },
];
const assistants = [
  ["ChatGPT", "https://chatgpt.com/?q="],
  ["Claude", "https://claude.ai/new?q="],
  ["Gemini", "https://gemini.google.com/app?q="],
  ["Grok", "https://grok.com/?q="],
  ["EverestQ", "https://everestqai.com/?q="],
];
const prompt = encodeURIComponent(
  "Explain RC Runtime and its supported APIs using the official handbook at https://www.rahulchaube.space/docs.",
);
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-wrap">
        <div className="footer-grid">
          <div>
            <Link href="/">
              <Logo />
            </Link>
            <p>
              An open-source JavaScript and TypeScript runtime by{" "}
              <a href="https://www.rahulchaube1.com/">Rahul Chaube</a>.
            </p>
            <div className="social-links">
              <a href="https://github.com/Rahulchaube1" aria-label="Rahul on GitHub">
                <Github size={17} />
              </a>
              <a href={site.social.linkedin} aria-label="Rahul on LinkedIn">
                <Linkedin size={17} />
              </a>
              <a href={site.social.x}>X</a>
            </div>
          </div>
          {links.map((group) => (
            <div key={group.title}>
              <h2>{group.title}</h2>
              {group.items.map(([label, href]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© 2026 Rahul Chaube</span>
          <div>
            <Link href="/license">MIT License</Link>
            <Link href="/security">Security</Link>
            <a href="https://www.rahulchaube1.com/contact">
              Contact <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
        <details className="assistant-links">
          <summary>Ask an AI assistant about RC</summary>
          <div>
            {assistants.map(([name, url]) => (
              <a key={name} href={url + prompt} rel="noreferrer" target="_blank">
                {name} ↗
              </a>
            ))}
          </div>
        </details>
      </div>
    </footer>
  );
}
