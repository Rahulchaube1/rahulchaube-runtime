"use client";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  function toggle() {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      /* The current page still uses the selected theme. */
    }
  }
  return (
    <button
      type="button"
      className="icon-button theme-toggle"
      aria-label="Toggle light and dark mode"
      onClick={toggle}
    >
      <Sun size={17} className="theme-sun" />
      <Moon size={17} className="theme-moon" />
    </button>
  );
}
