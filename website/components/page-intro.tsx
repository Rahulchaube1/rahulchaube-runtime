import type { ReactNode } from "react";
export function PageIntro({
  section,
  title,
  children,
}: {
  section: string;
  title: string;
  children: ReactNode;
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
