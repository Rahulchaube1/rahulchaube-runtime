import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, BookOpen, Cpu, Terminal } from "lucide-react";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="hero">
      <div className="site-wrap hero-grid">
        <div className="hero-copy">
          <Link className="release-pill" href="/releases">
            <span className="release-dot" />v{site.version} is available <ArrowUpRight size={13} />
          </Link>
          <h1>
            Build with
            <br />
            <span>
              RC Runtime<span className="hero-dot">.</span>
            </span>
          </h1>
          <p>
            A standalone JavaScript and TypeScript runtime. Run scripts, bundle modules, test code and serve
            HTTP with one native executable.
          </p>
          <div className="hero-actions">
            <Link className="btn primary" href="/download">
              <Terminal size={17} /> Install RC Runtime <ArrowRight size={16} />
            </Link>
            <Link className="btn secondary" href="/docs">
              <BookOpen size={16} /> Read the docs
            </Link>
          </div>
        </div>
        <figure className="engine-figure">
          <div className="engine-frame">
            <Image
              src="/rc-engine.webp"
              alt="An exploded graphite and copper processor bearing the green RC Runtime logo"
              width={1152}
              height={768}
              sizes="(max-width: 760px) 92vw, 600px"
              preload
              unoptimized
            />
          </div>
          <figcaption>
            <span>
              <Cpu size={13} /> QuickJS-NG <i>/</i> esbuild
            </span>
            <Link href="/docs/architecture">
              Architecture <ArrowUpRight size={13} />
            </Link>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
