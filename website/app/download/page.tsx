import { DownloadTabs } from "@/components/download-tabs";
import { Card } from "@/components/ui/card";
import { downloadTargets } from "@/lib/site";
import { Download, Tag, Monitor, Apple, Terminal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Download RahulChaube Runtime — Official Packages & Installers",
  description:
    "Download RahulChaube Runtime for Windows, Linux, macOS, Docker, Homebrew, Scoop, Winget, APT, and RPM.",
};

const getTargetIcon = (os: string) => {
  if (os === "windows") return Monitor;
  if (os === "macos") return Apple;
  return Terminal;
};

export default function DownloadPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl font-sans">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold mb-4 border border-blue-500/20 font-mono">
          <Tag className="w-3.5 h-3.5" />
          Official Downloads
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F0F6FC] tracking-tight mb-4">
          Download RahulChaube Runtime
        </h1>
        <p className="text-[#8B949E] text-sm sm:text-base">
          Single binary executable for JavaScript &amp; TypeScript. Choose your operating system or package manager below.
        </p>
      </div>

      {/* Interactive Tabs */}
      <div className="mb-16">
        <DownloadTabs />
      </div>

      {/* Direct Binary Downloads Section */}
      <div className="mt-16 border-t border-[#30363D] pt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#F0F6FC]">Direct Binary Archives</h2>
            <p className="text-xs text-[#8B949E] mt-0.5">
              Pre-built standalone archives for custom deployments or offline installation.
            </p>
          </div>
          <Link
            href="/releases"
            className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-medium"
          >
            View all releases &amp; checksums →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {downloadTargets.map((t) => {
            const IconComponent = getTargetIcon(t.os);
            return (
              <Card key={`${t.os}-${t.arch}`} className="flex flex-col justify-between">
                <div>
                  <div className="p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] w-fit mb-3 text-blue-400">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-[#F0F6FC] text-sm">{t.label}</h3>
                  <p className="text-xs text-[#8B949E] mb-4 font-mono mt-0.5">
                    Target: {t.os} / {t.arch}
                  </p>
                </div>
                <a
                  href={`https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v1.0.0/rahulchaube-${t.os}-${t.arch}.${t.os === "windows" ? "zip" : "tar.gz"}`}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#161B22] hover:bg-[#252C35] border border-[#30363D] text-xs font-semibold text-[#F0F6FC] transition-colors"
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
