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
    "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:pointer-events-none select-none font-sans";

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
  };

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-sm border border-blue-500/50 hover:shadow-blue-500/20",
    secondary:
      "bg-[#1C2128] hover:bg-[#252C35] text-[#F0F6FC] border border-[#30363D] hover:border-[#484F58]",
    outline:
      "bg-transparent hover:bg-[#161B22] text-[#F0F6FC] border border-[#30363D] hover:border-[#484F58]",
    ghost:
      "bg-transparent hover:bg-[#161B22] text-[#8B949E] hover:text-[#F0F6FC]",
    icon:
      "p-2 bg-[#161B22] hover:bg-[#1C2128] text-[#8B949E] hover:text-[#F0F6FC] border border-[#30363D]",
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
