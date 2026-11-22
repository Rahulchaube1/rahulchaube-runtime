import Link from "next/link";
import { BenchmarkChart } from "@/components/benchmark-chart";
import { PageIntro } from "@/components/page-intro";
import data from "@/public/benchmarks.json";
import installs from "@/public/install-benchmarks.json";
export const metadata = {
  title: "Benchmarks",
  description: "Measured execution and package installation times for RC Runtime, Bun, Node.js and npm.",
  alternates: { canonical: "/benchmarks" },
};
export default function Benchmarks() {
  return (
    <div className="site-wrap page-shell">
      <PageIntro section="Measurements" title="Runtime benchmarks">
        Each runtime executes the same program in a fresh process. The npm execution column runs that program
        through a Node.js package script.
      </PageIntro>
      <BenchmarkChart />
      <section className="page-section">
        <h2>Offline install from a warm cache</h2>
        <p>
          Each tool installed {installs.package} {installs.version} into a fresh project. RC restored one
          pinned ES module. Bun and npm restored the package and its metadata from lockfiles. Every run
          verified the same JavaScript file by SHA-256.
        </p>
        <div className="table-scroll">
          <table className="data-table install-data">
            <thead>
              <tr>
                <th scope="col">Tool</th>
                <th scope="col">Median install (ms)</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["RC Runtime", installs.results.rc],
                  ["Bun", installs.results.bun],
                  ["npm", installs.results.npm],
                ] as const
              ).map(([label, result]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{result.median_ms.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="page-section">
        <h2>Test environment</h2>
        <p>
          {data.date} · {data.cpu} · {data.system}
        </p>
        <p>
          {data.samples} timed runs followed {data.warmups} warmups per workload. Execution order was
          interleaved and randomized. Elapsed time includes startup and exit with a warm filesystem cache.
          Peak resident memory comes from the operating system.
        </p>
        <ul className="environment-list">
          {Object.entries(data.engines).map(([name, item]) => (
            <li key={name}>
              <strong>{name === "rc" ? item.version : name + " " + item.version}</strong>
              {item.executable_mib != null && " · " + item.executable_mib + " MiB executable"}
            </li>
          ))}
        </ul>
        <div className="button-row">
          <Link className="btn secondary" href="/docs/benchmarks">
            Reproduce the benchmarks
          </Link>
          <a className="text-link" href="/benchmarks.json">
            Execution samples ↗
          </a>
          <a className="text-link" href="/install-benchmarks.json">
            Install samples ↗
          </a>
        </div>
      </section>
    </div>
  );
}
