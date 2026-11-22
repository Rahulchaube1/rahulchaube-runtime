import type { ReactNode } from "react";
import { PageIntro } from "./page-intro";
export function ProjectArticle({
  title,
  intro,
  children,
}: {
  readonly title: string;
  readonly intro: string;
  readonly children: ReactNode;
}) {
  return (
    <article className="site-wrap page-shell simple-article">
      <PageIntro section="Project" title={title}>
        {intro}
      </PageIntro>
      <div className="prose-rc">{children}</div>
    </article>
  );
}
