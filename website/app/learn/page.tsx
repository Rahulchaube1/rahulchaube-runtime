import { GraduationCap } from "lucide-react";
import { CoursePath } from "@/components/lesson-progress";
export const metadata = {
  title: "Learn RC",
  description: "Build a working TypeScript HTTP service with RC Runtime in five hands-on lessons.",
  alternates: { canonical: "/learn" },
};
export default function LearnPage() {
  return (
    <div className="site-wrap page-shell">
      <div className="page-intro">
        <div className="section-kicker">
          <GraduationCap size={16} /> Guided course
        </div>
        <h1>
          Learn RC<span>.</span>
        </h1>
        <p>
          Start with one TypeScript file. Finish with a tested HTTP service you can bundle and run on another
          machine.
        </p>
      </div>
      <CoursePath />
    </div>
  );
}
