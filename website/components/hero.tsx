"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { site } from "@/lib/site";
import { Button } from "./ui/button";
import { TerminalDemo } from "./terminal-demo";
import { Logo } from "@/components/logo";
import { Download, ArrowRight, Copy, Check, Zap, Cpu, Terminal } from "lucide-react";

export function Hero() {
  const [copied, setCopied] = useState(false);
  const installCmd = "curl -fsSL https://rahulchaube.space/install | bash";

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden border-b border-zinc-200 dark:border-[#163830] py-16 lg:py-24 font-sans bg-[#F4F8F6] dark:bg-[#071A16] transition-colors duration-200">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-600/10 rounded-full blur-3xl" />

      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column — Brand & CTAs */}
          <div className="lg:col-span-7 text-left space-y-6">

            {/* Title & Brand Logo */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-3">
                <Logo className="w-12 h-12 shrink-0" />
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-[#F0F6FC] leading-tight">
                  {site.name}
                </h1>
              </div>
              <p className="text-lg sm:text-xl text-zinc-600 dark:text-[#8B949E] leading-relaxed max-w-xl font-medium">
                {site.tagline}
              </p>
            </motion.div>

            {/* Quick Install Bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-[#0A1F1B] border border-zinc-300 dark:border-[#163830] rounded-xl p-3 flex items-center justify-between font-mono text-xs max-w-lg shadow-sm"
            >
              <div className="flex items-center gap-2 overflow-x-auto text-zinc-800 dark:text-[#F0F6FC] pr-2">
                <span className="text-[#2FA866] shrink-0">$</span>
                <span className="truncate">{installCmd}</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-[#0E2923] hover:bg-zinc-200 dark:hover:bg-[#163830] text-zinc-800 dark:text-[#F0F6FC] transition-colors shrink-0 font-sans font-semibold text-[11px]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#6FCF63]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <Button
                onClick={() => (window.location.href = "/download")}
                size="lg"
                variant="primary"
              >
                <Download className="w-4 h-4" /> Download v1.0.0
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => (window.location.href = "/docs")}
              >
                Documentation <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>

          {/* Right Column — Interactive Terminal & Feature Cards */}
          <div className="lg:col-span-5 relative space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <TerminalDemo />
            </motion.div>

            {/* Floating Badges */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-2 font-mono text-[11px]"
            >
              <div className="p-2.5 rounded-lg bg-white dark:bg-[#0A1F1B] border border-zinc-200 dark:border-[#163830] flex items-center justify-center gap-1.5 text-zinc-700 dark:text-[#8B949E]">
                <Zap className="w-3.5 h-3.5 text-[#2FA866]" /> &lt;20ms
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-[#0A1F1B] border border-zinc-200 dark:border-[#163830] flex items-center justify-center gap-1.5 text-zinc-700 dark:text-[#8B949E]">
                <Cpu className="w-3.5 h-3.5 text-[#6FCF63]" /> TS &amp; JSX
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-[#0A1F1B] border border-zinc-200 dark:border-[#163830] flex items-center justify-center gap-1.5 text-zinc-700 dark:text-[#8B949E]">
                <Terminal className="w-3.5 h-3.5 text-[#A8F05B]" /> 21 CLI
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
