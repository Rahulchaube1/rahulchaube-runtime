import { releases, getLatestRelease } from "@/lib/releases";
import { Download, Tag, Calendar, CheckCircle2, ShieldCheck, FileText } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Releases & Changelog — RahulChaube Runtime",
  description: "Download official release binaries, release notes, SHA256 checksums, and version history for RahulChaube Runtime.",
};

export default function ReleasesPage() {
  const latest = getLatestRelease();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-4 border border-cyan-500/20">
          <Tag className="w-3.5 h-3.5" />
          Release Center
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Releases &amp; Changelog
        </h1>
        <p className="text-zinc-400 text-base max-w-2xl">
          Official production releases, checksums, and release notes for Windows, Linux, and macOS.
        </p>
      </div>

      {/* Latest Release Card */}
      <div className="bg-zinc-900/80 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 mb-12 shadow-xl shadow-cyan-950/20 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-white">v{latest.version}</span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Latest Release
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" /> Released on {latest.date}
            </p>
          </div>

          <Link
            href="/download"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" /> Download v{latest.version}
          </Link>
        </div>

        {/* Highlights */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" /> Release Highlights
          </h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            {latest.notes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Assets & Checksums */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Official Packages &amp; Checksums
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {latest.assets.map((asset, idx) => (
              <div
                key={idx}
                className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
              >
                <div>
                  <div className="font-semibold text-sm text-white">{asset.platform}</div>
                  <div className="text-xs text-zinc-500 font-mono mt-0.5">{asset.filename} ({asset.size})</div>
                  <div className="text-[11px] text-zinc-500 font-mono mt-1 break-all">
                    SHA256: <span className="text-zinc-400">{asset.sha256}</span>
                  </div>
                </div>
                <a
                  href={asset.downloadUrl}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-center"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Changelog */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Detailed Changelog</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/80">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Features</h4>
              <ul className="space-y-1.5 text-xs text-zinc-400">
                {latest.changelog.features.map((f, i) => (
                  <li key={i}>+ {f}</li>
                ))}
              </ul>
            </div>
            <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/80">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Fixes</h4>
              <ul className="space-y-1.5 text-xs text-zinc-400">
                {latest.changelog.fixes.map((f, i) => (
                  <li key={i}>✓ {f}</li>
                ))}
              </ul>
            </div>
            <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/80">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">Improvements</h4>
              <ul className="space-y-1.5 text-xs text-zinc-400">
                {latest.changelog.improvements.map((f, i) => (
                  <li key={i}>⚡ {f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
