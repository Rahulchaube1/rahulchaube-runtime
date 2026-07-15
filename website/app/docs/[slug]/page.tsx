import { notFound } from "next/navigation";
import { docs, getDoc } from "@/lib/docs";
import { Markdown } from "@/components/markdown";
import type { Metadata } from "next";

export function generateStaticParams() {
  return docs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  return { title: doc?.title ?? "Docs" };
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-brand">{doc.section}</p>
      <Markdown source={doc.body} />
    </div>
  );
}
