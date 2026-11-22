import { PageIntro } from "@/components/page-intro";
import { CommandToolkit } from "@/components/command-toolkit";

export const metadata = {
  title: "Command toolkit",
  description:
    "Explore RC’s formatter, TypeScript checker, bundler, test runner, package installer and runtime, with commands and reproducible measurements.",
  alternates: { canonical: "/commands" },
};

export default function CommandsPage() {
  return (
    <>
      <div className="site-wrap page-shell command-intro">
        <PageIntro section="RC Runtime CLI" title="Command toolkit">
          Six tools ship with the native runtime. Select a command for its examples, timings and full guide.
        </PageIntro>
      </div>
      <CommandToolkit />
    </>
  );
}
