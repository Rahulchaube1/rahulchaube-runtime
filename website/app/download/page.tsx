import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import { ArchiveList } from "@/components/archive-list";
import { DownloadTabs } from "@/components/download-tabs";
import { site } from "@/lib/site";
export const metadata = {
  title: "Download RC Runtime",
  description: "Install the standalone runtime on Linux, macOS or Windows and verify archive checksums.",
  alternates: { canonical: "/download" },
};
export default function Downloads() {
  return (
    <div className="site-wrap page-shell">
      <PageIntro section={"Stable release / v" + site.version} title="Download RC Runtime">
        Install the standalone executable for Linux, macOS or Windows. Each installer checks the download
        against its published SHA-256 digest.
      </PageIntro>
      <div className="download-grid">
        <DownloadTabs />
        <aside className="info-panel">
          <h2>After installation</h2>
          <p>Write your first TypeScript program, then start an HTTP service with RC Web.</p>
          <Link className="text-link" href="/learn">
            Learn RC <ArrowRight size={15} />
          </Link>
          <Link className="text-link" href="/docs/installation">
            Installation guide <ArrowRight size={15} />
          </Link>
          <Link className="text-link" href="/docs/installation#homebrew">
            Install with Homebrew <ArrowRight size={15} />
          </Link>
          <Link className="text-link" href="/docs/installation#scoop">
            Install with Scoop <ArrowRight size={15} />
          </Link>
        </aside>
      </div>
      <section className="page-section">
        <h2>Release archives</h2>
        <p>Choose the binary for your operating system and processor.</p>
        <ArchiveList />
      </section>
      <section className="page-section" id="vscode">
        <h2>VS Code extension</h2>
        <p>
          Run, watch and test a saved file in VS Code, VSCodium or code-server. In Extensions, choose{" "}
          <strong>Install from VSIX</strong> and select the downloaded file.
        </p>
        <div className="button-row">
          <a className="btn secondary" href={`/extensions/rahulchaube-runtime-${site.editorVersion}.vsix`} download>
            <Download size={15} /> Download extension {site.editorVersion}
          </a>
          <Link className="text-link" href="/docs/editor">
            Editor guide <ArrowRight size={15} />
          </Link>
          <a className="text-link" href={`${site.social.github}/releases/tag/editor-v${site.editorVersion}`}>
            GitHub release <ArrowRight size={15} />
          </a>
          <a className="text-link" href="/extensions/SHA256SUMS" download>Download SHA-256 checksums</a>
        </div>
      </section>
    </div>
  );
}
