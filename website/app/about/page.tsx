import { ProjectArticle } from "@/components/project-article";
import { site } from "@/lib/site";
export const metadata = {
  title: "About RC Runtime",
  description: "Meet Rahul Chaube and learn how RC Runtime is built.",
  alternates: { canonical: "/about" },
};
export default function About() {
  return (
    <ProjectArticle
      title="About RC Runtime"
      intro="Rahul Chaube created RC Runtime (RahulChaube Runtime) to run JavaScript and TypeScript from one native executable."
    >
      <h2>The runtime</h2>
      <p>
        The Go host embeds QuickJS-NG and esbuild. The executable includes RC Web, a test runner and
        filesystem helpers. You can use the distribution, build it from source or contribute a change under
        the MIT License.
      </p>
      <p>
        <a href="/docs/architecture">Runtime architecture</a> ·{" "}
        <a href="/docs/contributing">Build from source</a> · <a href="/vision">Engineering principles</a>
      </p>
      <h2>Rahul Chaube</h2>
      <p>
        <a href="https://www.rahulchaube1.com/">Portfolio</a> ·{" "}
        <a href="https://github.com/Rahulchaube1">GitHub</a> · <a href={site.social.linkedin}>LinkedIn</a> ·{" "}
        <a href={site.social.x}>X</a> · <a href="https://www.rahulchaube1.com/contact">Contact</a>
      </p>
    </ProjectArticle>
  );
}
