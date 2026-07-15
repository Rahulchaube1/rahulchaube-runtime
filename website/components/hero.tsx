"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/site";
import { Button } from "./ui/button";
import { CodeBlock } from "./code-block";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-black/10 dark:border-white/10">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand/10 via-transparent to-brand-accent/10" />
      <div className="mx-auto max-w-6xl px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-6 grid h-16 w-16 rotate-45 place-items-center rounded-2xl bg-brand shadow-2xl shadow-brand/30"
        >
          <span className="-rotate-45 text-3xl text-white">◆</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-extrabold tracking-tight sm:text-6xl"
        >
          {site.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-4 max-w-2xl text-lg text-ink-700 dark:text-white/70"
        >
          {site.tagline}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-8 flex max-w-md flex-col items-center gap-3"
        >
          <CodeBlock code={site.installCommand} lang="sh" />
          <div className="flex gap-3">
            <Button onClick={() => (window.location.href = "/download")}>Download</Button>
            <Button variant="outline" onClick={() => (window.location.href = "/docs")}>
              Read the docs
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
