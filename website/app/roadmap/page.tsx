import Link from "next/link";
import { ProjectArticle } from "@/components/project-article";
import { site } from "@/lib/site";
export const metadata = { title: "Roadmap", alternates: { canonical: "/roadmap" } };
export default function Roadmap() {
  return (
    <ProjectArticle
      title="Roadmap"
      intro="The current release brings native execution and a complete HTTP starter to five platform targets."
    >
      <h2>Available in RC 1.3</h2>
      <ul>
        <li>
          <Link href="/docs/runtime">Standalone JavaScript and TypeScript execution</Link> on Linux, macOS and
          Windows.
        </li>
        <li>
          <Link href="/docs/rc-web">RC Web</Link> and isolated test files.
        </li>
        <li>
          <Link href="/docs/package-manager">Checksum-pinned modules</Link> with offline restoration.
        </li>
        <li>
          <Link href="/docs/watch-mode">Watch mode</Link> and commands for{" "}
          <Link href="/docs/editor">VS Code</Link>.
        </li>
      </ul>
      <h2>Track upcoming work</h2>
      <p>
        Open feature requests and propose changes on the public issue tracker. Published release notes
        identify features that have shipped.
      </p>
      <p>
        <a href={site.social.issues}>Feature requests</a> · <Link href="/releases">Release notes</Link>
      </p>
    </ProjectArticle>
  );
}
