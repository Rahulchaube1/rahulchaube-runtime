import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Braces, SquareTerminal, GraduationCap } from "lucide-react";
import { Hero } from "@/components/hero";
import { TerminalDemo } from "@/components/terminal-demo";
import measurements from "@/public/benchmarks.json";
import { versionInfo } from "@/lib/releases";

export const metadata = { alternates: { canonical: "/" } };

const guides = [
  {
    href: "/learn",
    title: "Learn RC",
    detail: "Build a TypeScript HTTP service in five hands-on lessons.",
    icon: GraduationCap,
  },
  {
    href: "/docs/api",
    title: "Built-in libraries",
    detail: "Explore the APIs for HTTP routing, tests and file access.",
    icon: Braces,
  },
  {
    href: "/docs/cli",
    title: "CLI reference",
    detail: "Look up every command, argument and watch option.",
    icon: SquareTerminal,
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="stats-band">
        <div className="site-wrap stats-grid">
          <Link href="/benchmarks">
            <strong>
              {measurements.engines.rc.executable_mib} <small>MiB</small>
            </strong>
            <span>
              Linux x64 executable <ArrowUpRight size={13} />
            </span>
          </Link>
          <Link href="/benchmarks">
            <strong>
              {measurements.workloads.hello.rc.median_ms} <small>ms</small>
            </strong>
            <span>
              Median hello world · Linux x64 <ArrowUpRight size={13} />
            </span>
          </Link>
          <Link href="/download">
            <strong>
              {Object.keys(versionInfo.assets).length} <small>targets</small>
            </strong>
            <span>
              Linux, macOS and Windows <ArrowUpRight size={13} />
            </span>
          </Link>
        </div>
      </div>
      <section className="site-wrap home-section">
        <div className="section-heading">
          <h2>
            Developer resources<span>.</span>
          </h2>
          <Link className="text-link" href="/docs">
            All documentation <ArrowRight size={15} />
          </Link>
        </div>
        <div className="resource-grid">
          {guides.map(({ href, title, detail, icon: Icon }) => (
            <Link key={href} href={href} className="resource-card">
              <div className="card-icons">
                <span className="tile-icon">
                  <Icon size={23} strokeWidth={1.65} />
                </span>
                <ArrowUpRight size={17} />
              </div>
              <h3>{title}</h3>
              <p>{detail}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="workbench">
        <div className="site-wrap workbench-grid">
          <div>
            <div className="section-kicker">
              <BookOpen size={15} /> RC Web
            </div>
            <h2>
              Your first
              <br />
              HTTP service<span>.</span>
            </h2>
            <p>Scaffold a typed router, run its tests and serve a real request from your terminal.</p>
            <Link href="/docs/tutorials-first-steps" className="text-link">
              Start the tutorial <ArrowRight size={15} />
            </Link>
          </div>
          <TerminalDemo />
        </div>
      </section>
    </>
  );
}
