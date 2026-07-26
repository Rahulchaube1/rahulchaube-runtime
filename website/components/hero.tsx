"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { site } from "@/lib/site";
import { Button } from "./ui/button";
import { TerminalDemo } from "./terminal-demo";
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
    <section className="relative overflow-hidden border-b border-zinc-200 dark:border-[#163830] py-20 lg:py-32 font-sans bg-[#F4F8F6] dark:bg-[#071A16] transition-colors duration-200 min-h-[85vh] flex items-center">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute top-0 right-1/4 -z-10 w-[30rem] h-[30rem] bg-emerald-500/10 dark:bg-emerald-600/10 rounded-full blur-3xl" />

      <div className="site-container w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column — Brand & CTAs */}
          <div className="lg:col-span-6 text-left space-y-8">

            {/* Title & Brand Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src="/rahulchaube-runtime.png"
                  alt="RahulChaube Runtime Logo"
                  className="h-16 sm:h-20 w-auto object-contain shrink-0"
                />
              </div>
              <p className="text-body-fluid text-zinc-600 dark:text-[#8B949E] leading-relaxed max-w-2xl font-medium">
                {site.tagline}
              </p>
            </motion.div>

            {/* Quick Install Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-[#0A1F1B] border border-zinc-300 dark:border-[#163830] rounded-2xl p-4 flex items-center justify-between font-mono text-sm max-w-xl shadow-md"
            >
              <div className="flex items-center gap-3 overflow-x-auto text-zinc-800 dark:text-[#F0F6FC] pr-3">
                <span className="text-[#2FA866] shrink-0 font-bold">$</span>
                <span className="truncate font-semibold">{installCmd}</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-[#0E2923] hover:bg-zinc-200 dark:hover:bg-[#163830] text-zinc-800 dark:text-[#F0F6FC] transition-colors shrink-0 font-sans font-bold text-xs"
              >
                {copied ? <Check className="w-4 h-4 text-[#6FCF63]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Button
                onClick={() => (window.location.href = "/download")}
                size="xl"
                variant="primary"
              >
                <Download className="w-5 h-5" /> Download v1.0.0
              </Button>

              <Button
                variant="secondary"
                size="xl"
                onClick={() => (window.location.href = "/docs")}
              >
                Documentation <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>

          {/* Right Column — Interactive Terminal & Feature Cards */}
          <div className="lg:col-span-6 relative space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <TerminalDemo />
            </motion.div>

            {/* Floating Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-3 gap-3 font-mono text-xs"
            >
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0A1F1B] border border-zinc-200 dark:border-[#163830] flex items-center justify-center gap-2 text-zinc-800 dark:text-[#F0F6FC] font-semibold shadow-sm">
                <Zap className="w-4 h-4 text-[#2FA866]" /> &lt;20ms
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0A1F1B] border border-zinc-200 dark:border-[#163830] flex items-center justify-center gap-2 text-zinc-800 dark:text-[#F0F6FC] font-semibold shadow-sm">
                <Cpu className="w-4 h-4 text-[#6FCF63]" /> TS &amp; JSX
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0A1F1B] border border-zinc-200 dark:border-[#163830] flex items-center justify-center gap-2 text-zinc-800 dark:text-[#F0F6FC] font-semibold shadow-sm">
                <Terminal className="w-4 h-4 text-[#A8F05B]" /> 21 CLI
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
