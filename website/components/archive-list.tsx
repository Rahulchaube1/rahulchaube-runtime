import { ArrowDownToLine } from "lucide-react";
import { getLatestRelease } from "@/lib/releases";
export function ArchiveList() {
  return (
    <div className="archive-list">
      {getLatestRelease().assets.map((asset) => (
        <div key={asset.target} className="archive-row">
          <div>
            <strong>{asset.platform}</strong>
            <small>
              {asset.filename} · {asset.size}
            </small>
            <details>
              <summary>SHA-256 checksum</summary>
              <code>{asset.sha256}</code>
            </details>
          </div>
          <a
            className="btn secondary"
            href={asset.downloadUrl}
            aria-label={"Download archive for " + asset.platform}
          >
            <ArrowDownToLine size={15} /> Download
          </a>
        </div>
      ))}
    </div>
  );
}
