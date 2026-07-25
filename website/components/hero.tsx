"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/site";
import { Button } from "./ui/button";
import { TerminalDemo } from "./terminal-demo";
import { Sparkles, Download, ArrowRight, Tag } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-800/80 py-16 sm:py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-zinc-950 to-zinc-950" />

      <div className="mx-auto max-w-6xl px-4 text-center">
        {/* Release Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-6 border border-cyan-500/20"
        >
          <Tag className="w-3.5 h-3.5" />
          <span>v1.0.0 General Availability is Live</span>
          <Sparkles className="w-3 h-3 text-yellow-400" />
        </motion.div>

        {/* Diamond Logo Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mb-6 grid h-16 w-16 rotate-45 place-items-center rounded-2xl bg-cyan-500 shadow-2xl shadow-cyan-500/30"
        >
          <span className="-rotate-45 text-3xl font-extrabold text-zinc-950">◆</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white max-w-4xl mx-auto leading-tight"
        >
          {site.name}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-zinc-400"
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
            className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download v1.0.0
          </Button>

          <Button
            variant="outline"
            onClick={() => (window.location.href = "/docs")}
            className="border-zinc-700 hover:bg-zinc-800 text-zinc-200 font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2"
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
