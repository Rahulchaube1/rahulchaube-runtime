import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Search, GraduationCap } from "lucide-react";
import { docUrl, guides, sections, getSection } from "@/lib/doc-catalog";
import { searchIndex } from "@/lib/docs";
import { searchGuides } from "@/lib/doc-search";

export const metadata = {
  title: "Developer handbook",
  description: "Installation, hands-on guides and API references for RC Runtime.",
  alternates: { canonical: "/docs" },
};
export default async function DocsIndex({
  searchParams,
}: {
  readonly searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const query = (typeof q === "string" ? q : "").trim();
  const results = query ? searchGuides(searchIndex(), query) : [];
  return (
    <div className="site-wrap page-shell handbook-index">
      <div className="page-intro">
        <div className="section-kicker">
          <BookOpen size={16} /> Documentation
        </div>
        <h1>
          Developer handbook<span>.</span>
        </h1>
        <p>Install the runtime, build a service or go straight to the command and API references.</p>
      </div>
      <form className="directory-search" action="/docs" role="search">
        <Search size={18} />
        <input
          name="q"
          type="search"
          aria-label="Search the handbook"
          defaultValue={query}
          placeholder="Search the handbook"
        />
        <button className="btn secondary" type="submit">
          Search
        </button>
      </form>
      {query ? (
        <section className="directory-results">
          <div className="section-heading">
            <h2>Results for “{query}”</h2>
            <Link href="/docs" className="text-link">
              Clear search
            </Link>
          </div>
          {results.length ? (
            <ul>
              {results.map((guide) => (
                <li key={guide.slug}>
                  <Link href={docUrl(guide)}>
                    <span>
                      <small>{getSection(guide.section).title}</small>
                      <strong>{guide.title}</strong>
                      <span>{guide.summary}</span>
                    </span>
                    <ArrowRight size={18} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No matching guides. Try a command, module name or shorter phrase.</p>
          )}
        </section>
      ) : (
        <>
          <Link href="/learn" className="course-banner">
            <span className="tile-icon">
              <GraduationCap size={24} />
            </span>
            <span>
              <strong>New to RC? Start the course.</strong>
              <small>Five lessons, from a script to a tested HTTP service.</small>
            </span>
            <ArrowRight size={20} />
          </Link>
          <div className="directory-grid">
            {sections.map((section) => (
              <section className="directory-card" id={section.id} key={section.id}>
                <h2>{section.title}</h2>
                <p>{section.description}</p>
                <ul>
                  {guides
                    .filter((guide) => guide.section === section.id)
                    .map((guide) => (
                      <li key={guide.slug}>
                        <Link href={docUrl(guide)}>
                          {guide.title}
                          <ArrowUpRight size={14} />
                        </Link>
                      </li>
                    ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
