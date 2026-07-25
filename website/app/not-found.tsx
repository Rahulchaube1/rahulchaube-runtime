import Link from "next/link";
import { Logo } from "@/components/logo";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center max-w-lg font-sans">
      <div className="flex justify-center mb-6">
        <Logo className="w-16 h-16 shadow-xl shadow-[#2FA866]/10" />
      </div>
      <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-[#2FA866] dark:text-[#A8F05B] text-xs font-semibold mb-4 border border-[#2FA866]/20 font-mono">
        404 Page Not Found
      </div>
      <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-[#F0F6FC] tracking-tight mb-3">
        Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-zinc-600 dark:text-[#8B949E] mb-8 leading-relaxed">
        The route or documentation article you requested does not exist or has been moved.
      </p>

      <div className="flex justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2FA866] hover:bg-[#279559] text-white font-semibold text-xs transition-colors shadow-sm"
        >
          <Home className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 dark:bg-[#163830] hover:bg-zinc-200 dark:hover:bg-[#0E2923] text-zinc-900 dark:text-[#F0F6FC] border border-zinc-200 dark:border-[#163830] text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Documentation
        </Link>
      </div>
    </div>
  );
}
