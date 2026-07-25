"use client";

import { useEffect, useState } from "react";
import { docs } from "@/lib/docs";
import { Search, X, Command, BookOpen, ChevronRight } from "lucide-react";
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
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#F0F6FC] hover:border-[#484F58] text-xs transition-all w-full sm:w-64 font-sans"
      >
        <Search className="w-3.5 h-3.5 text-[#8B949E]" />
        <span className="flex-1 text-left font-medium">Search documentation...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#1C2128] text-[10px] text-[#8B949E] border border-[#30363D] font-mono">
          <Command className="w-2.5 h-2.5" /> K
        </kbd>
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 font-sans">
          <div
            className="bg-[#161B22] border border-[#30363D] rounded-xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onKeyDown={handleKeyDown}
          >
            {/* Input Bar */}
            <div className="flex items-center px-4 py-3 border-b border-[#30363D] gap-3">
              <Search className="w-4 h-4 text-blue-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documentation, commands, APIs..."
                className="bg-transparent text-xs text-[#F0F6FC] placeholder-[#8B949E] focus:outline-none w-full font-mono"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-[#8B949E] hover:text-[#F0F6FC]">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#8B949E]">
                  No matching documentation found for &quot;{query}&quot;.
                </div>
              ) : (
                results.map((doc, idx) => (
                  <button
                    key={doc.slug}
                    onClick={() => handleSelect(doc.slug)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center justify-between text-xs ${
                      selectedIndex === idx
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/30 font-medium"
                        : "text-[#F0F6FC] hover:bg-[#1C2128]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-[#8B949E] shrink-0" />
                      <div>
                        <div className="font-semibold text-xs">{doc.title}</div>
                        <div className="text-[10px] text-[#8B949E] font-mono">{doc.section}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8B949E]" />
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-[#30363D] bg-[#0D1117] text-[10px] text-[#8B949E] flex items-center justify-between font-mono">
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
