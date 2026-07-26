"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/code-block";
import { Terminal, ShieldCheck, Copy, Check, Apple, Monitor, Container, Package } from "lucide-react";

export function DownloadTabs() {
  const [selectedTab, setSelectedTab] = useState<
    "mac" | "linux" | "win" | "docker" | "brew" | "winget" | "apt" | "dnf" | "ps"
  >("mac");
  const [copied, setCopied] = useState(false);

  const tabs = [
    { id: "mac", label: "macOS", icon: Apple, category: "OS" },
    { id: "linux", label: "Linux", icon: Terminal, category: "OS" },
    { id: "win", label: "Windows", icon: Monitor, category: "OS" },
    { id: "docker", label: "Docker", icon: Container, category: "OS" },
    { id: "brew", label: "Homebrew", icon: Package, category: "PM" },
    { id: "winget", label: "Winget", icon: Package, category: "PM" },
    { id: "apt", label: "APT", icon: Package, category: "PM" },
    { id: "dnf", label: "DNF", icon: Package, category: "PM" },
    { id: "ps", label: "PowerShell", icon: Terminal, category: "PM" },
  ] as const;

  const commands = {
    mac: "curl -fsSL https://rahulchaube.space/install | bash",
    linux: "curl -fsSL https://rahulchaube.space/install | bash",
    win: 'powershell -c "irm https://rahulchaube.space/install.ps1 | iex"',
    docker: "docker run -it --rm rahulchaube/runtime:latest rahulchaube --version",
    brew: "brew install rahulchaube/tap/rahulchaube",
    winget: "winget install RahulChaube.Runtime",
    apt: "curl -fsSL https://rahulchaube.space/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/rahulchaube.gpg\necho \"deb [signed-by=/etc/apt/keyrings/rahulchaube.gpg] https://rahulchaube.space/apt stable main\" | sudo tee /etc/apt/sources.list.d/rahulchaube.list\nsudo apt update && sudo apt install rahulchaube",
    dnf: "sudo dnf config-manager --add-repo https://rahulchaube.space/rpm/rahulchaube.repo\nsudo dnf install rahulchaube",
    ps: 'irm https://rahulchaube.space/install.ps1 | iex',
  };

  const currentCommand = commands[selectedTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      {/* Tabs Bar */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 p-2 rounded-2xl bg-zinc-100 dark:bg-[#0A1F1B] border border-zinc-200 dark:border-[#163830]">
        {tabs.map((t) => {
          const IconComp = t.icon;
          const isActive = selectedTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTab(t.id as any)}
              className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                isActive
                  ? "bg-[#2FA866] text-white shadow-md"
                  : "text-zinc-600 dark:text-[#8B949E] hover:text-zinc-900 dark:hover:text-[#F0F6FC] hover:bg-zinc-200 dark:hover:bg-[#0E2923]"
              }`}
            >
              <IconComp className="w-4 h-4 shrink-0" />
              <span className="truncate">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Command Box */}
      <div className="bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] rounded-2xl p-8 shadow-xl relative space-y-4">
        <div className="flex items-center justify-between text-xs sm:text-sm text-zinc-600 dark:text-[#8B949E] font-mono">
          <span className="flex items-center gap-2.5 font-bold">
            <Terminal className="w-4 h-4 text-[#2FA866] dark:text-[#A8F05B]" />
            Installation command for <strong className="text-zinc-900 dark:text-[#F0F6FC]">{tabs.find((t) => t.id === selectedTab)?.label}</strong>
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[#2FA866] dark:text-[#A8F05B] hover:underline font-sans font-bold transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-[#6FCF63]" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <CodeBlock code={currentCommand} lang="sh" />

        <div className="pt-4 border-t border-zinc-200 dark:border-[#163830] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-zinc-500 dark:text-[#8B949E]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#6FCF63] shrink-0" />
            <span className="font-medium">Official release binaries verified with SHA-256 checksums.</span>
          </div>
          <span className="font-mono text-xs font-bold">rahulchaube-runtime-v1.0.0</span>
        </div>
      </div>
    </div>
  );
}
