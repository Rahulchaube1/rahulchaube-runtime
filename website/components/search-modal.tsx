"use client";

import { useEffect, useState } from "react";
import type { DocPage } from "@/lib/docs";
import { Search, X, Command, BookOpen, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const [docs, setDocs] = useState<DocPage[]>([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!isOpen || docs.length) return;
    setLoadError(false);
    import("@/lib/docs").then(module => setDocs(module.docs)).catch(() => setLoadError(true));
  }, [isOpen, docs.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const results = query.trim()
    ? docs.filter(
        (d) =>
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          d.section.toLowerCase().includes(query.toLowerCase()) ||
          d.body.toLowerCase().includes(query.toLowerCase())
      )
    : docs.slice(0, 6);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/docs/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex].slug);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        aria-label="Search documentation"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-[#161B22] border border-zinc-200 dark:border-[#30363D] text-zinc-600 dark:text-[#8B949E] hover:text-zinc-900 dark:hover:text-[#F0F6FC] hover:border-zinc-300 dark:hover:border-[#484F58] text-xs transition-all w-full sm:w-64 font-sans"
      >
        <Search className="w-3.5 h-3.5 text-zinc-500 dark:text-[#8B949E]" />
        <span className="hidden sm:block flex-1 text-left font-medium">Search documentation...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-[#1C2128] text-[10px] text-zinc-600 dark:text-[#8B949E] border border-zinc-300 dark:border-[#30363D] font-mono">
          <Command className="w-2.5 h-2.5" /> K
        </kbd>
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 font-sans">
          <div
            className="bg-white dark:bg-[#161B22] border border-zinc-200 dark:border-[#30363D] rounded-xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            role="dialog" aria-modal="true" aria-label="Search documentation"
            onKeyDown={handleKeyDown}
          >
            {/* Input Bar */}
            <div className="flex items-center px-4 py-3 border-b border-zinc-200 dark:border-[#30363D] gap-3">
              <Search className="w-4 h-4 text-blue-500 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search query"
                placeholder="Search documentation, commands, APIs..."
                className="bg-transparent text-xs text-zinc-900 dark:text-[#F0F6FC] placeholder-zinc-400 dark:placeholder-[#8B949E] focus:outline-none w-full font-mono"
              />
              {isOpen && (
                <button aria-label="Close search" onClick={() => setIsOpen(false)} className="text-zinc-400 dark:text-[#8B949E] hover:text-zinc-900 dark:hover:text-[#F0F6FC]">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500 dark:text-[#8B949E]">
                  {loadError ? "Search could not load. Close and reopen to retry." : !docs.length ? "Loading documentation…" : `No matching documentation for “${query}”.`}
                </div>
              ) : (
                results.map((doc, idx) => (
                  <button
                    key={doc.slug}
                    onClick={() => handleSelect(doc.slug)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center justify-between text-xs ${
                      selectedIndex === idx
                        ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-medium"
                        : "text-zinc-900 dark:text-[#F0F6FC] hover:bg-zinc-100 dark:hover:bg-[#1C2128]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-zinc-400 dark:text-[#8B949E] shrink-0" />
                      <div>
                        <div className="font-semibold text-xs">{doc.title}</div>
                        <div className="text-[10px] text-zinc-500 dark:text-[#8B949E] font-mono">{doc.section}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-[#8B949E]" />
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-zinc-200 dark:border-[#30363D] bg-zinc-50 dark:bg-[#0D1117] text-[10px] text-zinc-500 dark:text-[#8B949E] flex items-center justify-between font-mono">
              <span className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </span>
              <span>RahulChaube Docs v1.0</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
