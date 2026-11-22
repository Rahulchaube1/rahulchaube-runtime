"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, BookOpen, CornerDownLeft, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { docUrl, getSection } from "@/lib/doc-catalog";
import { searchGuides, type SearchEntry } from "@/lib/doc-search";

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [index, setIndex] = useState<SearchEntry[]>([]);
  const [error, setError] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const results = query.trim() ? searchGuides(index, query) : index.slice(0, 6);

  useEffect(() => {
    const keys = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((previous) => !previous);
      }
    };
    window.addEventListener("keydown", keys);
    return () => window.removeEventListener("keydown", keys);
  }, []);
  useEffect(() => {
    if (!open) {
      dialog.current?.close();
      return;
    }
    dialog.current?.setAttribute("closedby", "any");
    dialog.current?.showModal();
    input.current?.focus();
  }, [open]);
  useEffect(() => {
    if (!open || index.length) return;
    const request = new AbortController();
    fetch("/docs/search-index.json", { signal: request.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Search index unavailable");
        return response.json() as Promise<SearchEntry[]>;
      })
      .then(setIndex)
      .catch(() => {
        if (!request.signal.aborted) setError(true);
      });
    return () => request.abort();
  }, [open, index.length]);
  useEffect(() => {
    list.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active]);
  function select(slug: string) {
    setOpen(false);
    setQuery("");
    setActive(0);
    router.push("/docs/" + slug);
  }

  let emptyMessage = "Loading guides…";
  if (index.length) emptyMessage = "No guides match this search.";
  if (error) emptyMessage = "Search could not load. Reopen search to retry.";
  return (
    <>
      <div className="search-control">
        <button
          type="button"
          className="search-trigger"
          aria-label="Search documentation"
          aria-keyshortcuts="Control+K Meta+K"
          onClick={() => setOpen(true)}
        >
          <Search size={16} />
          <span>Search documentation</span>
        </button>
        <kbd aria-hidden="true">⌘ K</kbd>
      </div>
      <dialog
        className="search-dialog"
        ref={dialog}
        aria-label="Search documentation"
        onClose={() => {
          setOpen(false);
          setError(false);
        }}
      >
        <div className="search-inner">
          <div className="search-input">
            <Search size={19} />
            <input
              ref={input}
              aria-label="Search query"
              placeholder="Search guides, commands and APIs"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={(event) => {
                if (!results.length) return;
                if (event.key === "Enter") {
                  event.preventDefault();
                  select(results[active].slug);
                }
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  setActive(
                    (active + (event.key === "ArrowDown" ? 1 : -1) + results.length) % results.length,
                  );
                }
              }}
            />
            <button
              type="button"
              className="icon-button"
              aria-label="Close search"
              onClick={() => setOpen(false)}
            >
              <X size={17} />
            </button>
          </div>
          <div className="search-results" aria-label="Search results" ref={list}>
            {results.map((guide, i) => (
              <a
                key={guide.slug}
                href={docUrl(guide)}
                data-active={i === active}
                onClick={(event) => {
                  if (!event.metaKey && !event.ctrlKey) {
                    event.preventDefault();
                    select(guide.slug);
                  }
                }}
              >
                <BookOpen size={17} />
                <span>
                  <strong>{guide.title}</strong>
                  <small>{getSection(guide.section).title}</small>
                </span>
                <CornerDownLeft size={14} />
              </a>
            ))}
            {!results.length && <output>{emptyMessage}</output>}
          </div>
          <div className="search-help">
            <span>
              <ArrowUp size={12} />
              <ArrowDown size={12} /> Navigate
            </span>
            <span>
              <CornerDownLeft size={12} /> Open
            </span>
            <span>Esc to close</span>
          </div>
        </div>
      </dialog>
    </>
  );
}
