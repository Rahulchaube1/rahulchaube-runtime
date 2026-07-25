"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/code-block";
import { Terminal, ShieldCheck, Download, Package, Layers, Copy, Check } from "lucide-react";

export function DownloadTabs() {
  const [activeCategory, setActiveCategory] = useState<"os" | "pm">("os");
  const [selectedOs, setSelectedOs] = useState<"mac" | "linux" | "win" | "docker">("mac");
  const [selectedPm, setSelectedPm] = useState<"brew" | "scoop" | "choco" | "winget" | "apt" | "rpm">("brew");
  const [copied, setCopied] = useState(false);

  const osOptions = [
    { id: "mac", label: "macOS", badge: "Apple Silicon & Intel", icon: "🍎" },
    { id: "linux", label: "Linux", badge: "Ubuntu, Debian, Fedora, Arch", icon: "🐧" },
    { id: "win", label: "Windows", badge: "x64 & ARM64", icon: "🪟" },
    { id: "docker", label: "Docker", badge: "Official Container Image", icon: "🐳" },
  ] as const;

  const pmOptions = [
    { id: "brew", label: "Homebrew", os: "macOS / Linux" },
    { id: "scoop", label: "Scoop", os: "Windows" },
    { id: "choco", label: "Chocolatey", os: "Windows" },
    { id: "winget", label: "Winget", os: "Windows" },
    { id: "apt", label: "APT", os: "Ubuntu / Debian" },
    { id: "rpm", label: "RPM / DNF", os: "Fedora / RHEL" },
  ] as const;

  const osCommands = {
    mac: "curl -fsSL https://rahulchaube.space/install | bash",
    linux: "curl -fsSL https://rahulchaube.space/install | bash",
    win: 'powershell -c "irm https://rahulchaube.space/install.ps1 | iex"',
    docker: "docker run -it --rm rahulchaube/runtime:latest rahulchaube --version",
  };

  const pmCommands = {
    brew: "brew install rahulchaube/tap/rahulchaube",
    scoop: "scoop bucket add rahulchaube https://github.com/Rahulchaube1/scoop-bucket\nscoop install rahulchaube",
    choco: "choco install rahulchaube",
    winget: "winget install RahulChaube.Runtime",
    apt: "curl -fsSL https://rahulchaube.space/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/rahulchaube.gpg\necho \"deb [signed-by=/etc/apt/keyrings/rahulchaube.gpg] https://rahulchaube.space/apt stable main\" | sudo tee /etc/apt/sources.list.d/rahulchaube.list\nsudo apt update && sudo apt install rahulchaube",
    rpm: "sudo dnf config-manager --add-repo https://rahulchaube.space/rpm/rahulchaube.repo\nsudo dnf install rahulchaube",
  };

  const currentCommand =
    activeCategory === "os" ? osCommands[selectedOs] : pmCommands[selectedPm];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Category Selector */}
      <div className="flex justify-center">
        <div className="bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 flex gap-2">
          <button
            onClick={() => setActiveCategory("os")}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
              activeCategory === "os"
                ? "bg-cyan-500 text-zinc-950 shadow-md font-semibold"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            }`}
          >
            <Terminal className="w-4 h-4" /> Operating Systems
          </button>
          <button
            onClick={() => setActiveCategory("pm")}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
              activeCategory === "pm"
                ? "bg-cyan-500 text-zinc-950 shadow-md font-semibold"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            }`}
          >
            <Package className="w-4 h-4" /> Package Managers
          </button>
        </div>
      </div>

      {/* Sub Options */}
      {activeCategory === "os" ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {osOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedOs(opt.id as any)}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                selectedOs === opt.id
                  ? "bg-cyan-500/10 border-cyan-500/50 ring-1 ring-cyan-500/50"
                  : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="text-2xl mb-2">{opt.icon}</div>
              <div>
                <div className="font-semibold text-sm text-white">{opt.label}</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">{opt.badge}</div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {pmOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedPm(opt.id as any)}
              className={`p-3 rounded-xl border text-center transition-all ${
                selectedPm === opt.id
                  ? "bg-cyan-500/10 border-cyan-500/50 ring-1 ring-cyan-500/50"
                  : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="font-semibold text-xs text-white">{opt.label}</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">{opt.os}</div>
            </button>
          ))}
        </div>
      )}

      {/* Interactive Command Display */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between mb-3 text-xs text-zinc-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            {activeCategory === "os"
              ? `Installation command for ${osOptions.find((o) => o.id === selectedOs)?.label}`
              : `Package installation via ${pmOptions.find((p) => p.id === selectedPm)?.label}`}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-sans font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <CodeBlock code={currentCommand} lang="sh" />

        <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center gap-2 text-xs text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>All packages are signed and verified with SHA256 checksums.</span>
        </div>
      </div>
    </div>
  );
}
