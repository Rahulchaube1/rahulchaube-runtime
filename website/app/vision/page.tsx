import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vision & Mission — RC Runtime",
  description: "The long-term engineering vision, performance principles, and roadmap for RC Runtime.",
};

export default function VisionPage() {
  return (
    <div className="site-container py-16 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-[#F0F6FC] tracking-tight font-title">
          Vision &amp; Engineering Philosophy
        </h1>
        <div className="space-y-4 text-zinc-700 dark:text-[#8B949E] text-base leading-relaxed">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-[#F0F6FC] font-title">
            1. Toolchain Unification
          </h2>
          <p>
            Developers should not need 10 different configuration files and build tools to run a TypeScript application. One binary should handle execution, bundling, testing, and package installation.
          </p>

          <h2 className="text-xl font-bold text-zinc-900 dark:text-[#F0F6FC] font-title">
            2. First-Class Diagnostics
          </h2>
          <p>
            Error messages should be actionable. Built-in environment diagnostics (\`doctor\`) and AI error analysis (\`explain\`) dramatically reduce time spent debugging infrastructure issues.
          </p>
        </div>
      </div>
    </div>
  );
}
