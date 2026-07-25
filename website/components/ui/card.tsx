import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200 dark:border-[#30363D] bg-white dark:bg-[#1C2128] p-6 shadow-sm hover:border-zinc-300 dark:hover:border-[#484F58] transition-all font-sans text-zinc-900 dark:text-[#F0F6FC]",
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
        "inline-flex items-center rounded-md border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 font-mono",
        className
      )}
      {...props}
    />
  );
}
