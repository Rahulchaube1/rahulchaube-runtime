import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowRight,
  Box,
  Braces,
  CircleCheck,
  FlaskConical,
  Package,
  SquareTerminal,
} from "lucide-react";
import type { CommandName } from "@/lib/toolkit";
import { commandNames, commandInfo } from "@/lib/toolkit";
import measurements from "@/public/toolkit-benchmarks.json";
import { CommandChart } from "./command-chart";
import { CopyButton } from "./code-block";

const icons = {
  fmt: Braces,
  check: CircleCheck,
  build: Box,
  test: FlaskConical,
  install: Package,
  run: SquareTerminal,
};

export function CommandProof({ name }: { readonly name: CommandName }) {
  return (
    <section id="measurements" className="command-proof">
      <h2>Measurements</h2>
      <CommandChart name={name} />
      <p>
        {measurements.version} · {measurements.cpu} · {measurements.system} ({measurements.arch}). Each size
        has {measurements.warmups} warmups. The clock includes process startup and exit. Fixture setup and
        output verification happen outside the timed interval.
      </p>
      <p>From a checkout of the repository, reproduce this workload on Linux.</p>
      <div className="tool-command">
        <code>python3 benchmarks/toolkit.py --command {name}</code>
        <CopyButton text={"python3 benchmarks/toolkit.py --command " + name} />
      </div>
      <a className="text-link" href="/toolkit-benchmarks.json" download>
        <ArrowDownToLine size={15} /> Download raw samples
      </a>
    </section>
  );
}

export function CommandToolkit({ homepage = false }: { readonly homepage?: boolean }) {
  return (
    <section className="site-wrap command-catalog" id="toolkit" aria-label="RC command toolkit">
      {homepage && (
        <div className="toolkit-heading">
          <h2>
            Six commands, one executable<span>.</span>
          </h2>
          <p>
            From the first edit to a tested release. Explore the commands and the workloads used to measure
            them.
          </p>
        </div>
      )}
      <nav className="command-jumps" aria-label="Jump to a command">
        {commandNames.map((name) => {
          const Icon = icons[name];
          return (
            <a href={"#" + name} key={name}>
              <Icon size={16} aria-hidden="true" /> {name}
            </a>
          );
        })}
      </nav>
      <div className="tool-sections">
        {commandNames.map((name) => {
          const info = commandInfo[name];
          const Icon = icons[name];
          const Heading = homepage ? "h3" : "h2";
          return (
            <section key={name} id={name} className="tool-section" aria-labelledby={"cmd-" + name}>
              <div className="tool-description">
                <div className="tool-signature">
                  <Icon size={17} aria-hidden="true" />
                  <code>rc {name}</code>
                </div>
                <Heading id={"cmd-" + name}>{info.title}</Heading>
                <p>{info.summary}</p>
                <div className="tool-command">
                  <code>{info.example}</code>
                  <CopyButton text={info.example} />
                </div>
                <Link className="text-link" href={"/docs/" + name}>
                  Read the {name} guide <ArrowRight size={15} />
                </Link>
              </div>
              <CommandChart name={name} />
            </section>
          );
        })}
      </div>
      <div className="toolkit-method">
        <span>
          {measurements.version} · {measurements.arch} · {measurements.cpu}
        </span>
        <Link href="/docs/benchmarks" className="text-link">
          Benchmark methodology <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
