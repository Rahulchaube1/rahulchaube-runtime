"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/site";
import { Button } from "./ui/button";
import { TerminalDemo } from "./terminal-demo";
import { Logo } from "@/components/logo";
import { Download, ArrowRight, Tag, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[#30363D] py-16 sm:py-24 font-sans bg-[#0D1117]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/30 via-[#0D1117] to-[#0D1117]" />

      <div className="mx-auto max-w-6xl px-4 text-center">
        {/* Release Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold mb-6 border border-blue-500/20 font-mono"
        >
          <Tag className="w-3.5 h-3.5" />
          <span>v1.0.0 General Availability is Live</span>
          <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mb-6 flex justify-center"
        >
          <Logo className="w-16 h-16 shadow-xl shadow-blue-500/10" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl font-extrabold tracking-tight sm:text-6xl text-[#F0F6FC] max-w-4xl mx-auto leading-tight"
        >
          {site.name}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-[#8B949E]"
        >
          {site.tagline}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-8 flex flex-wrap justify-center gap-3"
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
            Read Documentation <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Animated Terminal Demo */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <TerminalDemo />
        </motion.div>
      </div>
    </section>
  );
}
