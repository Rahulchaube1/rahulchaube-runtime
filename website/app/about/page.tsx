import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — RahulChaube Runtime",
  description: "About RahulChaube Runtime, engineering philosophy, platform architecture, and developer platform vision.",
};

export default function AboutPage() {
  return (
    <div className="site-container py-16 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-[#F0F6FC] tracking-tight font-title">
          About RahulChaube Runtime
        </h1>
        <div className="space-y-4 text-zinc-700 dark:text-[#8B949E] text-base leading-relaxed">
          <p>
            RahulChaube Runtime is a high-performance JavaScript &amp; TypeScript developer platform designed to streamline application execution, package management, bundling, and environment diagnostics into a single unified executable.
          </p>
          <p>
            By combining high-speed execution with built-in developer diagnostic tools (\`doctor\`, \`explain\`, \`graph\`), RahulChaube Runtime eliminates toolchain fragmentation and delivers an integrated workflow for modern engineering teams.
          </p>
        </div>
      </div>
    </div>
  );
}
