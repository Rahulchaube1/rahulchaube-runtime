import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Community & Support — RC Runtime",
  description: "Join the RC Runtime community on GitHub and X (Twitter).",
};

export default function CommunityPage() {
  return (
    <div className="site-container py-16 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-[#F0F6FC] tracking-tight font-title">
          Community &amp; Developer Ecosystem
        </h1>
        <p className="text-zinc-600 dark:text-[#8B949E] text-base">
          Connect with developers and maintainers building high-performance JavaScript applications.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href={site.social.issues}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-2xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] hover:border-[#2FA866] transition-colors shadow-sm"
          >
            <h3 className="text-lg font-bold text-zinc-900 dark:text-[#F0F6FC] font-title mb-2">GitHub issues</h3>
            <p className="text-sm text-zinc-600 dark:text-[#8B949E]">
              Report reproducible issues, request features and share project feedback.
            </p>
          </a>

          <a
            href={site.social.x}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-2xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] hover:border-[#2FA866] transition-colors shadow-sm"
          >
            <h3 className="text-lg font-bold text-zinc-900 dark:text-[#F0F6FC] font-title mb-2">X (Twitter)</h3>
            <p className="text-sm text-zinc-600 dark:text-[#8B949E]">
              Follow official platform announcements, release notes, and performance benchmark updates.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
