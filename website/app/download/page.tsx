import { DownloadTabs } from "@/components/download-tabs";
import { Card } from "@/components/ui/card";
import { downloadTargets } from "@/lib/site";
import { Download, ShieldCheck, Tag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Download RahulChaube Runtime — Official Packages & Installers",
  description:
    "Download RahulChaube Runtime for Windows, Linux, macOS, Docker, Homebrew, Scoop, Winget, APT, and RPM.",
};

export default function DownloadPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-4 border border-cyan-500/20">
          <Tag className="w-3.5 h-3.5" />
          Official Downloads
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Download RahulChaube Runtime
        </h1>
        <p className="text-zinc-400 text-base sm:text-lg">
          Single binary executable for JavaScript &amp; TypeScript. Choose your operating system or package manager below.
        </p>
      </div>

      {/* Interactive Tabs */}
      <div className="mb-16">
        <DownloadTabs />
      </div>

      {/* Direct Binary Downloads Section */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Direct Binary Archives</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Pre-built standalone archives for custom deployments or offline installation.
            </p>
          </div>
          <Link
            href="/releases"
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
          >
            View all releases &amp; checksums →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {downloadTargets.map((t) => (
            <Card key={`${t.os}-${t.arch}`}>
              <div className="text-3xl mb-2">{t.emoji}</div>
              <h3 className="font-semibold text-white">{t.label}</h3>
              <p className="text-xs text-zinc-400 mb-4">
                Architecture: <span className="font-mono text-zinc-300">{t.os} / {t.arch}</span>
              </p>
              <a
                href={`https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v1.0.0/rahulchaube-${t.os}-${t.arch}.${t.os === "windows" ? "zip" : "tar.gz"}`}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download Archive
              </a>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
