import { DownloadTabs } from "@/components/download-tabs";
import { Card } from "@/components/ui/card";
import { getLatestRelease } from "@/lib/releases";
import { Download, Monitor, Apple, Terminal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Download RC Runtime — Official Packages & Installers",
  description:
    "Download RC Runtime for Windows x64, Linux, and macOS.",
};

const getTargetIcon = (os: string) => {
  if (os === "windows") return Monitor;
  if (os === "darwin") return Apple;
  return Terminal;
};

export default function DownloadPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl font-sans">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-[#F0F6FC] tracking-tight mb-4">
          Download RC Runtime
        </h1>
        <p className="text-zinc-600 dark:text-[#8B949E] text-sm sm:text-base">
          Run RC from the verified archive. The JavaScript engine, TypeScript compiler and RC Web ship inside the executable.
        </p>
      </div>

      {/* Interactive Tabs */}
      <div className="mb-16">
        <DownloadTabs />
      </div>

      <section id="vscode" className="scroll-mt-24 mb-12">
        <h2 className="text-xl font-bold">RC Runtime for VS Code</h2>
        <p className="mt-2 mb-4 text-sm text-zinc-600 dark:text-[#8B949E]">
          In the Extensions view, choose Install from VSIX and select the downloaded file.
          Open a JavaScript or TypeScript file and choose RC Runtime: Watch Current File to restart on save.
        </p>
        <a href="/extensions/rahulchaube-runtime-1.1.0.vsix" download
          className="inline-flex items-center gap-2 font-semibold text-sm underline underline-offset-4">
          <Download aria-hidden="true" className="h-4 w-4" /> Download extension 1.1.0
        </a>
        <a className="ml-5 text-sm underline" href="/extensions/SHA256SUMS">SHA-256 checksum</a>
      </section>

      {/* Direct Binary Downloads Section */}
      <div className="mt-16 border-t border-zinc-200 dark:border-[#163830] pt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-[#F0F6FC]">Release archives</h2>
            <p className="text-xs text-zinc-600 dark:text-[#8B949E] mt-0.5">
              Choose the archive for your operating system and processor.
            </p>
          </div>
          <Link
            href="/releases"
            className="text-xs text-[#2FA866] dark:text-[#A8F05B] hover:underline flex items-center gap-1 font-medium"
          >
            View all releases &amp; checksums →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {getLatestRelease().assets.map((t) => {
            const IconComponent = getTargetIcon(t.os);
            return (
              <Card key={`${t.os}-${t.arch}`} className="flex flex-col justify-between">
                <div>
                  <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-[#0A1F1B] border border-zinc-200 dark:border-[#163830] w-fit mb-3 text-[#2FA866] dark:text-[#A8F05B]">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-[#F0F6FC] text-sm">{t.platform}</h3>
                  <p className="text-xs text-zinc-600 dark:text-[#8B949E] mb-4 font-mono mt-0.5">
                    Target: {t.os} / {t.arch}
                  </p>
                </div>
                <a
                  href={t.downloadUrl}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-[#0A1F1B] hover:bg-zinc-200 dark:hover:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] text-xs font-semibold text-zinc-900 dark:text-[#F0F6FC] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download Archive
                </a>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
