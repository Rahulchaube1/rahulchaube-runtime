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
    <div className="container mx-auto px-4 py-12 max-w-5xl font-sans">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold mb-4 border border-blue-500/20 font-mono">
          <Tag className="w-3.5 h-3.5" />
          Release Center
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F0F6FC] tracking-tight mb-2">
          Releases &amp; Changelog
        </h1>
        <p className="text-[#8B949E] text-sm max-w-2xl">
          Official production releases, checksums, and release notes for Windows, Linux, and macOS.
        </p>
      </div>

      {/* Latest Release Card */}
      <div className="bg-[#1C2128] border border-[#30363D] rounded-xl p-6 sm:p-8 mb-12 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-[#30363D]">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-[#F0F6FC]">v{latest.version}</span>
              <span className="px-2.5 py-0.5 rounded-md bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3 h-3" /> Latest Release
              </span>
            </div>
            <p className="text-xs text-[#8B949E] mt-1 flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-[#8B949E]" /> Released on {latest.date}
            </p>
          </div>

          <Link
            href="/download"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" /> Download v{latest.version}
          </Link>
        </div>

        {/* Highlights */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-[#F0F6FC] uppercase tracking-wider mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" /> Release Highlights
          </h3>
          <ul className="space-y-2 text-xs text-[#8B949E]">
            {latest.notes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Assets & Checksums */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-[#F0F6FC] uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-400" /> Official Packages &amp; Checksums
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {latest.assets.map((asset, idx) => (
              <div
                key={idx}
                className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#484F58] transition-colors"
              >
                <div>
                  <div className="font-semibold text-xs text-[#F0F6FC]">{asset.platform}</div>
                  <div className="text-[11px] text-[#8B949E] font-mono mt-0.5">{asset.filename} ({asset.size})</div>
                  <div className="text-[11px] text-[#8B949E] font-mono mt-1 break-all">
                    SHA256: <span className="text-[#F0F6FC]">{asset.sha256}</span>
                  </div>
                </div>
                <a
                  href={asset.downloadUrl}
                  className="px-3 py-1.5 rounded-md bg-[#1C2128] hover:bg-[#252C35] border border-[#30363D] text-[#F0F6FC] font-medium text-xs transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-center"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Changelog */}
        <div>
          <h3 className="text-xs font-semibold text-[#F0F6FC] uppercase tracking-wider mb-4">Detailed Changelog</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#161B22] p-4 rounded-lg border border-[#30363D]">
              <h4 className="text-[11px] font-bold text-green-400 uppercase tracking-wider mb-2 font-mono">Features</h4>
              <ul className="space-y-1.5 text-xs text-[#8B949E]">
                {latest.changelog.features.map((f, i) => (
                  <li key={i}>+ {f}</li>
                ))}
              </ul>
            </div>
            <div className="bg-[#161B22] p-4 rounded-lg border border-[#30363D]">
              <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2 font-mono">Fixes</h4>
              <ul className="space-y-1.5 text-xs text-[#8B949E]">
                {latest.changelog.fixes.map((f, i) => (
                  <li key={i}>✓ {f}</li>
                ))}
              </ul>
            </div>
            <div className="bg-[#161B22] p-4 rounded-lg border border-[#30363D]">
              <h4 className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-2 font-mono">Improvements</h4>
              <ul className="space-y-1.5 text-xs text-[#8B949E]">
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
