import { notFound } from "next/navigation";
import { docs, getDoc } from "@/lib/docs";
import { Markdown } from "@/components/markdown";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return docs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  return {
    title: `${doc?.title ?? "Documentation"} — RC Runtime`,
    description: `Official documentation for ${doc?.title ?? "RC Runtime"}. Detailed overview, code examples, CLI subcommands, and best practices.`,
    alternates: {
      canonical: `${site.domain}/docs/${slug}`,
    },
  };
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

  const currentIndex = docs.findIndex((d) => d.slug === slug);
  const prevDoc = currentIndex > 0 ? docs[currentIndex - 1] : null;
  const nextDoc = currentIndex < docs.length - 1 ? docs[currentIndex + 1] : null;

  const docJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: doc.title,
        description: `Official documentation for ${doc.title} in RC Runtime.`,
        url: `${site.domain}/docs/${slug}`,
        author: {
          "@type": "Organization",
          name: site.name,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Docs",
            item: `${site.domain}/docs`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: doc.section,
            item: `${site.domain}/docs#${doc.section.toLowerCase().replace(/\s+/g, "-")}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: doc.title,
            item: `${site.domain}/docs/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="max-w-4xl py-6 px-4 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(docJsonLd) }}
      />
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-[#8B949E] mb-6 font-mono">
        <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-[#F0F6FC] transition-colors flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" /> Docs
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-400 dark:text-[#30363D]" />
        <span className="text-zinc-600 dark:text-[#8B949E]">{doc.section}</span>
        <ChevronRight className="w-3 h-3 text-zinc-400 dark:text-[#30363D]" />
        <span className="text-[#2FA866] dark:text-[#A8F05B] font-medium">{doc.title}</span>
      </nav>

      {/* Doc Body */}
      <div className="prose dark:prose-invert prose-emerald max-w-none mb-12 text-zinc-900 dark:text-[#F0F6FC]">
        <Markdown source={doc.body} />
      </div>

      {/* Previous / Next Navigation Cards */}
      <div className="pt-8 border-t border-zinc-200 dark:border-[#163830] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {prevDoc ? (
          <Link
            href={`/docs/${prevDoc.slug}`}
            className="p-4 rounded-xl border border-zinc-200 dark:border-[#163830] bg-white dark:bg-[#0E2923] hover:bg-zinc-50 dark:hover:bg-[#163830] transition-all group text-left"
          >
            <div className="text-[10px] text-zinc-500 dark:text-[#8B949E] flex items-center gap-1 mb-1 font-mono">
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" /> Previous
            </div>
            <div className="font-semibold text-zinc-900 dark:text-[#F0F6FC] group-hover:text-[#2FA866] dark:group-hover:text-[#A8F05B] transition-colors">
              {prevDoc.title}
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextDoc ? (
          <Link
            href={`/docs/${nextDoc.slug}`}
            className="p-4 rounded-xl border border-zinc-200 dark:border-[#163830] bg-white dark:bg-[#0E2923] hover:bg-zinc-50 dark:hover:bg-[#163830] transition-all group text-right sm:col-start-2"
          >
            <div className="text-[10px] text-zinc-500 dark:text-[#8B949E] flex items-center justify-end gap-1 mb-1 font-mono">
              Next <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="font-semibold text-zinc-900 dark:text-[#F0F6FC] group-hover:text-[#2FA866] dark:group-hover:text-[#A8F05B] transition-colors">
              {nextDoc.title}
            </div>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
