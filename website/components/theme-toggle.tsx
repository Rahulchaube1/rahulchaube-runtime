"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const initial = stored ? stored === "dark" : true;
    setDark(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      aria-label="Toggle light and dark mode"
      onClick={toggle}
      className="p-2 rounded-lg border border-zinc-200 dark:border-[#30363D] bg-zinc-100 dark:bg-[#161B22] text-zinc-700 dark:text-[#8B949E] hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-all"
    >
      {dark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
    </button>
  );
}
