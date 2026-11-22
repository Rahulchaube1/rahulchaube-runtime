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
        <a href={site.social.issues}>Project issues</a> · <a href="/docs/contributing">Contribution guide</a>
      </p>
      <h2>Follow the project</h2>
      <p>
        <a href="/blog">Engineering notes</a> · <a href="/feed.xml">RSS feed</a> ·{" "}
        <a href={site.social.x}>Rahul on X</a> · <a href={site.social.linkedin}>Rahul on LinkedIn</a>
      </p>
    </ProjectArticle>
  );
}
