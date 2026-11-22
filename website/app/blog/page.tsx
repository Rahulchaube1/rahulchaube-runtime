import Link from "next/link";
import { posts } from "@/lib/blog";
import { PageIntro } from "@/components/page-intro";
import { ArrowUpRight } from "lucide-react";
export const metadata = {
  title: "Engineering notes",
  description: "Release notes and archived RC project articles.",
  alternates: { canonical: "/blog" },
};
export default function Blog() {
  return (
    <div className="site-wrap page-shell">
      <PageIntro section="Blog" title="Engineering notes">
        Release announcements and articles from the project archive.
      </PageIntro>
      <div className="note-list">
        {posts.map((post) => (
          <Link key={post.slug} href={"/blog/" + post.slug}>
            <small>
              {post.date} · {post.category}
            </small>
            <h2>
              {post.title} <ArrowUpRight size={16} />
            </h2>
            <p>{post.description}</p>
          </Link>
        ))}
      </div>
      <a className="text-link" href="/feed.xml">
        Subscribe via RSS ↗
      </a>
    </div>
  );
}
