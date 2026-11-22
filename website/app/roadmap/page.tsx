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
          <a href="/docs/runtime">Standalone JavaScript and TypeScript execution</a> on Linux, macOS and
          Windows.
        </li>
        <li>
          <a href="/docs/rc-web">RC Web</a> and isolated test files.
        </li>
        <li>
          <a href="/docs/package-manager">Checksum-pinned modules</a> with offline restoration.
        </li>
        <li>
          <a href="/docs/watch-mode">Watch mode</a> and commands for <a href="/docs/editor">VS Code</a>.
        </li>
      </ul>
      <h2>Track upcoming work</h2>
      <p>
        Open feature requests and propose changes on the public issue tracker. Published release notes
        identify features that have shipped.
      </p>
      <p>
        <a href={site.social.issues}>Feature requests</a> · <a href="/releases">Release notes</a>
      </p>
    </ProjectArticle>
  );
}
