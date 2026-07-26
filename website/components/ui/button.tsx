import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "icon" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2FA866] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none font-sans active:scale-[0.98]";

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5 font-semibold",
    xl: "px-8 py-4 text-base sm:text-lg gap-3 font-bold tracking-tight rounded-2xl shadow-lg",
  };

  const variants = {
    primary:
      "bg-[#2FA866] hover:bg-[#279559] text-white shadow-md border border-[#2FA866]/50 hover:shadow-lg hover:shadow-[#2FA866]/25 hover:-translate-y-0.5",
    secondary:
      "bg-zinc-100 dark:bg-[#0E2923] hover:bg-zinc-200 dark:hover:bg-[#163830] text-zinc-900 dark:text-[#F0F6FC] border border-zinc-300 dark:border-[#163830] hover:border-[#2FA866]/40 hover:-translate-y-0.5",
    outline:
      "bg-transparent hover:bg-zinc-100 dark:hover:bg-[#0A1F1B] text-zinc-900 dark:text-[#F0F6FC] border border-zinc-300 dark:border-[#163830] hover:border-[#2FA866]/40",
    ghost:
      "bg-transparent hover:bg-zinc-100 dark:hover:bg-[#0A1F1B] text-zinc-600 dark:text-[#8B949E] hover:text-zinc-900 dark:hover:text-[#F0F6FC]",
    icon:
      "p-2.5 bg-zinc-100 dark:bg-[#0A1F1B] hover:bg-zinc-200 dark:hover:bg-[#0E2923] text-zinc-700 dark:text-[#8B949E] hover:text-zinc-900 dark:hover:text-[#F0F6FC] border border-zinc-300 dark:border-[#163830]",
    danger:
      "bg-red-600 hover:bg-red-500 text-white border border-red-500/50 shadow-sm",
  };

  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      disabled={disabled}
      {...props}
    />
  );
}
