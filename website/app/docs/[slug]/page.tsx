import { notFound } from "next/navigation";
import { docs, getDoc } from "@/lib/docs";
import { Markdown } from "@/components/markdown";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

export function generateStaticParams() {
  return docs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  return {
    title: `${doc?.title ?? "Documentation"} — RahulChaube Runtime`,
    description: `Official documentation for ${doc?.title ?? "RahulChaube Runtime"}.`,
  };
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

  const currentIndex = docs.findIndex((d) => d.slug === slug);
  const prevDoc = currentIndex > 0 ? docs[currentIndex - 1] : null;
  const nextDoc = currentIndex < docs.length - 1 ? docs[currentIndex + 1] : null;

  return (
    <div className="max-w-4xl py-6 px-4 font-sans">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-[#8B949E] mb-6 font-mono">
        <Link href="/docs" className="hover:text-[#F0F6FC] transition-colors flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" /> Docs
        </Link>
        <ChevronRight className="w-3 h-3 text-[#30363D]" />
        <span className="text-[#8B949E]">{doc.section}</span>
        <ChevronRight className="w-3 h-3 text-[#30363D]" />
        <span className="text-blue-400 font-medium">{doc.title}</span>
      </nav>

      {/* Doc Body */}
      <div className="prose prose-invert prose-blue max-w-none mb-12">
        <Markdown source={doc.body} />
      </div>

      {/* Previous / Next Navigation Cards */}
      <div className="pt-8 border-t border-[#30363D] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {prevDoc ? (
          <Link
            href={`/docs/${prevDoc.slug}`}
            className="p-4 rounded-xl border border-[#30363D] bg-[#161B22] hover:bg-[#1C2128] hover:border-[#484F58] transition-all group text-left"
          >
            <div className="text-[10px] text-[#8B949E] flex items-center gap-1 mb-1 font-mono">
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" /> Previous
            </div>
            <div className="font-semibold text-[#F0F6FC] group-hover:text-blue-400 transition-colors">
              {prevDoc.title}
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextDoc ? (
          <Link
            href={`/docs/${nextDoc.slug}`}
            className="p-4 rounded-xl border border-[#30363D] bg-[#161B22] hover:bg-[#1C2128] hover:border-[#484F58] transition-all group text-right sm:col-start-2"
          >
            <div className="text-[10px] text-[#8B949E] flex items-center justify-end gap-1 mb-1 font-mono">
              Next <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="font-semibold text-[#F0F6FC] group-hover:text-blue-400 transition-colors">
              {nextDoc.title}
            </div>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
