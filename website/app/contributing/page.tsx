import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contributing Guidelines — RC Runtime",
  description: "How to contribute to RC Runtime CLI, documentation, and starter templates.",
};

export default function ContributingPage() {
  return (
    <div className="site-container py-16 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-[#F0F6FC] tracking-tight font-title">
          Contributing to RC Runtime
        </h1>
        <div className="space-y-4 text-zinc-700 dark:text-[#8B949E] text-base leading-relaxed">
          <p>
            We welcome pull requests and issue reports for CLI features, documentation improvements, diagnostic checks, and starter templates.
          </p>
          <div className="p-4 rounded-xl bg-zinc-100 dark:bg-[#0A1F1B] border border-zinc-200 dark:border-[#163830] font-mono text-sm">
            git clone https://github.com/Rahulchaube1/rahulchaube-runtime.git
          </div>
        </div>
      </div>
    </div>
  );
}
