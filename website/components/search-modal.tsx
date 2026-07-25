"use client";

import { useEffect, useState } from "react";
import { docs } from "@/lib/docs";
import { Search, X, Command, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

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
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-xs transition-all w-full sm:w-64"
      >
        <Search className="w-3.5 h-3.5 text-zinc-500" />
        <span className="flex-1 text-left">Search docs...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 border border-zinc-700 font-mono">
          <Command className="w-2.5 h-2.5" /> K
        </kbd>
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4">
          <div
            className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onKeyDown={handleKeyDown}
          >
            {/* Input Bar */}
            <div className="flex items-center px-4 py-3 border-b border-zinc-800 gap-3">
              <Search className="w-4 h-4 text-cyan-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documentation, commands, APIs..."
                className="bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none w-full"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-zinc-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500">
                  No matching documentation found for &quot;{query}&quot;.
                </div>
              ) : (
                results.map((doc, idx) => (
                  <button
                    key={doc.slug}
                    onClick={() => handleSelect(doc.slug)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between text-xs ${
                      selectedIndex === idx
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-medium"
                        : "text-zinc-300 hover:bg-zinc-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-zinc-500 shrink-0" />
                      <div>
                        <div className="font-semibold">{doc.title}</div>
                        <div className="text-[10px] text-zinc-500">{doc.section}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-zinc-800/80 bg-zinc-950/60 text-[10px] text-zinc-500 flex items-center justify-between font-mono">
              <span className="flex items-center gap-2">
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
