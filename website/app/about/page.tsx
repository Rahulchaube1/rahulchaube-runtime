import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — RC Runtime",
  description: "About RC Runtime, engineering philosophy, platform architecture, and developer platform vision.",
};

export default function AboutPage() {
  return (
    <div className="site-container py-16 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-[#F0F6FC] tracking-tight font-title">
          About RC Runtime
        </h1>
        <div className="space-y-4 text-zinc-700 dark:text-[#8B949E] text-base leading-relaxed">
          <p>
            Rahul Chaube created RC Runtime (RahulChaube Runtime) to run JavaScript and TypeScript from one native executable. The Go host embeds QuickJS-NG and esbuild, and includes RC Web, a test runner and filesystem helpers.
          </p>
          <p>
            The source is available under the MIT License. You can build the executable yourself, report a problem or contribute a change on GitHub.
          </p>
        </div>
      </div>
    </div>
  );
}
