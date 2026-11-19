import { releases, getLatestRelease } from "@/lib/releases";
import { Download, Calendar, ShieldCheck, FileText } from "lucide-react";
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
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-[#F0F6FC] tracking-tight mb-2">
          Releases &amp; Changelog
        </h1>
        <p className="text-zinc-600 dark:text-[#8B949E] text-sm max-w-2xl">
          Compare the SHA-256 digest below after downloading your release archive.
        </p>
      </div>

      {/* Latest Release Card */}
      <div className="bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] rounded-xl p-6 sm:p-8 mb-12 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-200 dark:border-[#163830]">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-zinc-900 dark:text-[#F0F6FC]">v{latest.version}</span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-[#8B949E] mt-1 flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5" /> Released on {latest.date}
            </p>
          </div>

          <Link
            href="/download"
            className="px-4 py-2 rounded-lg bg-[#2FA866] hover:bg-[#279559] text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" /> Download v{latest.version}
          </Link>
        </div>

        {/* Highlights */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-zinc-900 dark:text-[#F0F6FC] uppercase tracking-wider mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#2FA866] dark:text-[#A8F05B]" /> Release Highlights
          </h3>
          <ul className="space-y-2 text-xs text-zinc-600 dark:text-[#8B949E]">
            {latest.notes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#2FA866] dark:text-[#A8F05B] mt-0.5">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Assets & Checksums */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-zinc-900 dark:text-[#F0F6FC] uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#6FCF63]" /> Official Packages &amp; Checksums
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {latest.assets.map((asset, idx) => (
              <div
                key={idx}
                className="bg-zinc-50 dark:bg-[#0A1F1B] border border-zinc-200 dark:border-[#163830] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-300 dark:hover:border-[#2FA866]/40 transition-colors"
              >
                <div>
                  <div className="font-semibold text-xs text-zinc-900 dark:text-[#F0F6FC]">{asset.platform}</div>
                  <div className="text-[11px] text-zinc-500 dark:text-[#8B949E] font-mono mt-0.5">{asset.filename} ({asset.size})</div>
                  <div className="text-[11px] text-zinc-500 dark:text-[#8B949E] font-mono mt-1 break-all">
                    SHA256: <span className="text-zinc-800 dark:text-[#F0F6FC]">{asset.sha256}</span>
                  </div>
                </div>
                <a
                  href={asset.downloadUrl}
                  className="px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-[#0E2923] hover:bg-zinc-200 dark:hover:bg-[#163830] border border-zinc-200 dark:border-[#163830] text-zinc-900 dark:text-[#F0F6FC] font-medium text-xs transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-center"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Changelog */}
        <div>
          <h3 className="text-xs font-semibold text-zinc-900 dark:text-[#F0F6FC] uppercase tracking-wider mb-4">Detailed Changelog</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-50 dark:bg-[#0A1F1B] p-4 rounded-lg border border-zinc-200 dark:border-[#163830]">
              <h4 className="text-[11px] font-bold text-[#6FCF63] uppercase tracking-wider mb-2 font-mono">Features</h4>
              <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-[#8B949E]">
                {latest.changelog.features.map((f, i) => (
                  <li key={i}>+ {f}</li>
                ))}
              </ul>
            </div>
            <div className="bg-zinc-50 dark:bg-[#0A1F1B] p-4 rounded-lg border border-zinc-200 dark:border-[#163830]">
              <h4 className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2 font-mono">Fixes</h4>
              <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-[#8B949E]">
                {latest.changelog.fixes.map((f, i) => (
                  <li key={i}>- {f}</li>
                ))}
              </ul>
            </div>
            <div className="bg-zinc-50 dark:bg-[#0A1F1B] p-4 rounded-lg border border-zinc-200 dark:border-[#163830]">
              <h4 className="text-[11px] font-bold text-[#2FA866] dark:text-[#A8F05B] uppercase tracking-wider mb-2 font-mono">Improvements</h4>
              <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-[#8B949E]">
                {latest.changelog.improvements.map((f, i) => (
                  <li key={i}>* {f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
