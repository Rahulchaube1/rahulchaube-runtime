import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "outline" }) {
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-accent shadow-lg shadow-brand/20",
    outline: "border border-brand/40 text-brand hover:bg-brand/10",
    ghost: "text-ink-700 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
