import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import { getLatestRelease } from "@/lib/releases";
import { site } from "@/lib/site";
import { PageIntro } from "@/components/page-intro";
import { ArchiveList } from "@/components/archive-list";
export const metadata = {
  title: "Release notes",
  description: "Stable RC Runtime release notes, native archives and checksums.",
  alternates: { canonical: "/releases" },
};
export default function Releases() {
  const release = getLatestRelease();
  return (
    <div className="site-wrap page-shell">
      <PageIntro section="Releases" title={"RC Runtime " + release.version}>
        The standalone release for JavaScript, TypeScript and RC Web. Published {release.date}.
      </PageIntro>
      <div className="button-row">
        <Link className="btn primary" href="/download">
          Install this release <ArrowRight size={15} />
        </Link>
        <a className="btn secondary" href={site.social.github + "/releases/tag/" + release.tag}>
          <Github size={16} /> GitHub release
        </a>
      </div>
      <section className="page-section">
        <h2>What shipped</h2>
        <div className="release-changes">
          {Object.entries(release.changelog).map(([group, items]) => (
            <div className="info-panel" key={group}>
              <h3>{group}</h3>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="page-section">
        <h2>Archives and checksums</h2>
        <ArchiveList />
      </section>
      <section className="page-section">
        <h2>Earlier releases</h2>
        <p>Find previous binaries and the earlier CLI at their original tags.</p>
        <a className="text-link" href={site.social.github + "/releases"}>
          All GitHub releases <ArrowRight size={15} />
        </a>
      </section>
    </div>
  );
}
