import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ChevronRight, ChevronDown, Pencil, List } from "lucide-react";
import { DocsSidebar } from "@/components/docs-sidebar";
import { LessonCompletion } from "@/components/lesson-progress";
import { Markdown } from "@/components/markdown";
import { docUrl, getGuide, getSection, guides, lessons } from "@/lib/doc-catalog";
import { guideHeadings, readGuide } from "@/lib/docs";
import { site } from "@/lib/site";

type Props = Readonly<{ params: Promise<{ slug: string }> }>;
export function generateStaticParams() {
  return guides.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  return guide
    ? { title: guide.title, description: guide.summary, alternates: { canonical: docUrl(guide) } }
    : {};
}
export default async function DocPage({ params }: Props) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();
  const body = readGuide(guide.slug);
  const section = getSection(guide.section);
  const index = lessons.findIndex((lesson) => lesson.slug === guide.slug);
  const sequence = index >= 0 ? lessons : guides.filter((item) => item.section === guide.section);
  const position = sequence.findIndex((item) => item.slug === guide.slug);
  const [previous, next] = [sequence[position - 1], sequence[position + 1]];
  const outline = guideHeadings(body);
  const anchors = outline.map(({ label, id }) => (
    <a key={id} href={"#" + id}>
      {label}
    </a>
  ));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: guide.title,
    description: guide.summary,
    url: site.domain + docUrl(guide),
    author: { "@type": "Person", name: "Rahul Chaube" },
  };
  return (
    <div className="site-wrap doc-layout">
      <DocsSidebar active={guide.slug} />
      <article className="doc-article">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/docs">Docs</Link>
          <ChevronRight size={12} />
          <Link href={"/docs#" + section.id}>{section.title}</Link>
        </nav>
        {index >= 0 && (
          <Link href="/learn" className="lesson-label">
            Learn RC <span>/</span> Lesson {index + 1} of {lessons.length}
          </Link>
        )}
        <h1>{guide.title}</h1>
        <p className="doc-summary">{guide.summary}</p>
        <details className="mobile-outline" key={guide.slug}>
          <summary>
            <List size={15} /> On this page <ChevronDown size={14} />
          </summary>
          {anchors}
        </details>
        <Markdown source={body} />
        <div className="article-actions">
          {index >= 0 && <LessonCompletion slug={guide.slug} />}
          <a href={site.social.github + "/edit/main/website/content/docs/" + guide.slug + ".md"}>
            <Pencil size={13} /> Edit this guide
          </a>
        </div>
        <nav className="doc-pager" aria-label="Adjacent guides">
          {previous && (
            <Link href={docUrl(previous)}>
              <small>
                <ArrowLeft size={13} /> Previous
              </small>
              {previous.title}
            </Link>
          )}
          {next ? (
            <Link className="next" href={docUrl(next)}>
              <small>
                Next <ArrowRight size={13} />
              </small>
              {next.title}
            </Link>
          ) : (
            <Link className="next" href={index >= 0 ? "/learn" : "/docs"}>
              <small>
                Return to <ArrowRight size={13} />
              </small>
              {index >= 0 ? "Course overview" : "Handbook"}
            </Link>
          )}
        </nav>
      </article>
      <aside className="doc-outline">
        <div>
          <h2>
            <List size={14} /> On this page
          </h2>
          <nav aria-label="On this page">{anchors}</nav>
        </div>
      </aside>
    </div>
  );
}
