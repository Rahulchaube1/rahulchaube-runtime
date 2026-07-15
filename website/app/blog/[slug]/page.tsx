import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, posts } from "@/lib/blog";
import { Markdown } from "@/components/markdown";
import type { Metadata } from "next";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post?.title ?? "Blog", description: post?.description };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/blog" className="text-sm text-brand">← Back to blog</Link>
      <p className="mt-4 text-xs uppercase tracking-wide text-brand">{post.category}</p>
      <h1 className="mt-2 text-4xl font-extrabold">{post.title}</h1>
      <p className="mt-2 text-sm text-ink-700 dark:text-white/60">{post.date} · {post.author}</p>
      <div className="mt-8">
        <Markdown source={post.body} />
      </div>
    </article>
  );
}
