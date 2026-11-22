import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
export default function NotFound() {
  return (
    <div className="site-wrap page-shell">
      <PageIntro section="404" title="Page not found">
        The requested page could not be found. Browse the handbook or return to the homepage.
      </PageIntro>
      <div className="button-row">
        <Link className="btn primary" href="/docs">
          Open the handbook
        </Link>
        <Link className="btn secondary" href="/">
          Homepage
        </Link>
      </div>
    </div>
  );
}
