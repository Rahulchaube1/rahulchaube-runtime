import Link from "next/link";
import Image from "next/image";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Braces,
  FileCode2,
  Terminal,
} from "lucide-react";
import { CopyButton } from "./code-block";
import { highlightCode } from "./markdown";
import { helloExample } from "@/lib/hello-example";
import { site } from "@/lib/site";

export function Hero() {
  const command = "rc " + helloExample.args.join(" ");
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
        <figure className="runtime-figure" aria-label="TypeScript example and its RC terminal output">
          <div className="runtime-stage">
            <Image
              className="runtime-art"
              src="/rc-flow.webp"
              alt=""
              width={1080}
              height={720}
              sizes="(max-width: 760px) 92vw, 580px"
              preload
              unoptimized
            />
            <div className="runtime-window">
              <div className="runtime-filebar">
                <span>
                  <FileCode2 size={16} /> hello.ts
                </span>
                <a
                  href="/examples/hello.ts"
                  download="hello.ts"
                  aria-label="Download hello.ts"
                  title="Download hello.ts"
                >
                  <ArrowDownToLine size={16} />
                </a>
              </div>
              <pre className="runtime-source">
                <code className="syntax">{highlightCode(helloExample.source, "typescript")}</code>
              </pre>
              <div className="runtime-output">
                <div className="runtime-command">
                  <Terminal size={17} aria-hidden="true" />
                  <code>{command}</code>
                  <CopyButton text={command} label="Copy example command" />
                </div>
                <samp>{helloExample.output}</samp>
              </div>
            </div>
          </div>
          <figcaption>
            <span>
              <Braces size={14} /> QuickJS-NG <i>/</i> esbuild
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
