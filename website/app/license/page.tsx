import { ProjectArticle } from "@/components/project-article";
import { site } from "@/lib/site";
export const metadata = {
  title: "MIT License",
  description: "RC Runtime project license and third-party notices.",
  alternates: { canonical: "/license" },
};
export default function License() {
  return (
    <ProjectArticle
      title="MIT License"
      intro="Rahul Chaube releases the original RC Runtime source code under the MIT License."
    >
      <h2>License text</h2>
      <pre className="license-copy">{`MIT License

Copyright (c) 2026 Rahul Chaube

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}</pre>
      <h2>Third-party notices</h2>
      <p>
        The binary includes the Go runtime, QuickJS-NG, quickjs-go and esbuild. The archives ship their
        license notices alongside the executable.
      </p>
      <p>
        <a href={site.social.github + "/blob/main/LICENSE.md"}>Repository license</a> ·{" "}
        <a href={site.social.github + "/tree/main/licenses"}>Third-party notices</a>
      </p>
    </ProjectArticle>
  );
}
