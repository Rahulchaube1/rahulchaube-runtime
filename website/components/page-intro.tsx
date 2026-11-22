import type { ReactNode } from "react";
export function PageIntro({
  section,
  title,
  children,
}: {
  readonly section: string;
  readonly title: string;
  readonly children: ReactNode;
}) {
  return (
    <header className="page-intro">
      <div className="section-kicker">{section}</div>
      <h1>
        {title}
        <span>.</span>
      </h1>
      <p>{children}</p>
    </header>
  );
}
