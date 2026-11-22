import { ProjectArticle } from "@/components/project-article";
import { site } from "@/lib/site";
export const metadata = { title: "Security policy", alternates: { canonical: "/security" } };
export default function Security() {
  return (
    <ProjectArticle
      title="Security policy"
      intro="The project’s disclosure policy covers the RC Runtime CLI, website, API, installer and bundled assets."
    >
      <h2>Report privately</h2>
      <p>
        Send reports to <a href="mailto:security@rahulchaube.space">security@rahulchaube.space</a>. Include
        the affected version, a description and relevant details so maintainers can investigate. The
        repository policy describes response expectations and coordinated disclosure.
      </p>
      <p>
        <a href={site.social.github + "/blob/main/community/SECURITY.md"}>Read the security policy</a>
      </p>
      <h2>Verify downloads</h2>
      <p>
        Compare the SHA-256 digest of a downloaded archive with the published release. RC installers perform
        this check before activation. <a href="/releases">Release checksums</a>
      </p>
    </ProjectArticle>
  );
}
