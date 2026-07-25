import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200 dark:border-[#163830] bg-white dark:bg-[#0E2923] p-6 shadow-sm hover:border-zinc-300 dark:hover:border-[#2FA866]/50 transition-all font-sans text-zinc-900 dark:text-[#F0F6FC]",
        className
      )}
      {...props}
    />
  );
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-[#2FA866]/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-[#2FA866] dark:text-[#A8F05B] font-mono",
        className
      )}
      {...props}
    />
  );
}
