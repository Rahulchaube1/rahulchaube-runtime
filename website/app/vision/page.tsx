import { ProjectArticle } from "@/components/project-article";
export const metadata = { title: "Engineering principles", alternates: { canonical: "/vision" } };
export default function Vision() {
  return (
    <ProjectArticle
      title="Engineering principles"
      intro="RC keeps the everyday edit, run, test and build workflow in a single executable."
    >
      <h2>Keep installation small</h2>
      <p>
        The release carries the native host, JavaScript engine and TypeScript compiler. The installer verifies
        the archive against its published digest. <a href="/download">Release downloads</a>
      </p>
      <h2>Make results reproducible</h2>
      <p>
        The benchmark harness records versions, workloads, sample times and memory. Developers can compare the
        numbers on their own machines. <a href="/docs/benchmarks">Benchmark methodology</a>
      </p>
      <h2>Document the host</h2>
      <p>
        Each built-in module has a reference and runnable examples. Compatibility guidance describes the APIs
        available to application code. <a href="/docs/api">Library reference</a>
      </p>
    </ProjectArticle>
  );
}
