import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, posts } from "@/lib/blog";
import { Markdown } from "@/components/markdown";
import type { Metadata } from "next";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return posts.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return post
    ? { title: post.title, description: post.description, alternates: { canonical: "/blog/" + slug } }
    : {};
}
export default async function BlogPost({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return (
    <article className="site-wrap page-shell simple-article">
      <Link className="text-link" href="/blog">
        ← Engineering notes
      </Link>
      <header className="page-intro">
        <div className="section-kicker">
          {post.date} · {post.category}
        </div>
        <h1>{post.title}</h1>
        <p>{post.author}</p>
      </header>
      {post.slug !== "standalone-rc-runtime" && (
        <div className="archive-note">
          Project archive. This article describes an earlier CLI.{" "}
          <Link href="/docs">Read the current handbook →</Link>
        </div>
      )}
      <Markdown source={post.body.replace(/^# [^\n]+\n+/, "")} />
    </article>
  );
}
