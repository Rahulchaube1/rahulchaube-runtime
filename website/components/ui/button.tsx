import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "icon" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#2FA866]/50 disabled:opacity-50 disabled:pointer-events-none select-none font-sans";

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
  };

  const variants = {
    primary:
      "bg-[#2FA866] hover:bg-[#279559] text-white font-semibold shadow-sm border border-[#2FA866]/50 hover:shadow-[#2FA866]/20",
    secondary:
      "bg-zinc-100 dark:bg-[#0E2923] hover:bg-zinc-200 dark:hover:bg-[#163830] text-zinc-900 dark:text-[#F0F6FC] border border-zinc-300 dark:border-[#163830]",
    outline:
      "bg-transparent hover:bg-zinc-100 dark:hover:bg-[#0A1F1B] text-zinc-900 dark:text-[#F0F6FC] border border-zinc-300 dark:border-[#163830]",
    ghost:
      "bg-transparent hover:bg-zinc-100 dark:hover:bg-[#0A1F1B] text-zinc-600 dark:text-[#8B949E] hover:text-zinc-900 dark:hover:text-[#F0F6FC]",
    icon:
      "p-2 bg-zinc-100 dark:bg-[#0A1F1B] hover:bg-zinc-200 dark:hover:bg-[#0E2923] text-zinc-700 dark:text-[#8B949E] hover:text-zinc-900 dark:hover:text-[#F0F6FC] border border-zinc-300 dark:border-[#163830]",
    danger:
      "bg-red-600 hover:bg-red-500 text-white border border-red-500/50",
  };

  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      disabled={disabled}
      {...props}
    />
  );
}
