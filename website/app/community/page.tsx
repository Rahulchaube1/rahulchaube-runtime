import Link from "next/link";
import { ProjectArticle } from "@/components/project-article";
import { site } from "@/lib/site";
export const metadata = { title: "Community", alternates: { canonical: "/community" } };
export default function Community() {
  return (
    <ProjectArticle title="Community" intro="Follow releases, ask questions and contribute to RC Runtime.">
      <h2>Talk about a change</h2>
      <p>
        Use GitHub Issues for bug reports and feature requests. Include the RC version, operating system and a
        small example that shows the behavior.
      </p>
      <p>
        <a href={site.social.issues}>Project issues</a> ·{" "}
        <Link href="/docs/contributing">Contribution guide</Link>
      </p>
      <h2>Follow the project</h2>
      <p>
        <Link href="/blog">Engineering notes</Link> ·{" "}
        <a rel="alternate" type="application/rss+xml" href={site.feed}>
          RSS feed
        </a>{" "}
        · <a href={site.social.x}>Rahul on X</a> · <a href={site.social.linkedin}>Rahul on LinkedIn</a>
      </p>
    </ProjectArticle>
  );
}
