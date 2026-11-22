import { Code } from "lucide-react";

const TEMPLATES = [
  { title: "Start an HTTP service", command: "rc init hello", description: "Generate a TypeScript route, a server entry and a test. Open the new hello directory." },
  { title: "Test a route", command: "rc test", description: "From your project directory, run the test suite against the app’s handlers." },
  { title: "Watch a service", command: "rc run --watch server.ts", description: "Restart the server when you save the entry or one of its imported files." },
  { title: "Bundle the application", command: "rc build server.ts --outfile dist/server.mjs", description: "Produce an ES module you can run with RC Runtime." },
];

export function TemplatesGallery() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 font-sans border-t border-zinc-200 dark:border-[#163830]">
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
        <h2 className="text-h2-fluid font-black text-zinc-900 dark:text-[#F0F6FC]">
          Develop with RC Web
        </h2>
        <p className="text-body-fluid text-zinc-600 dark:text-[#8B949E]">
          Create a project, then run the remaining commands from its directory.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.title}
            className="p-8 rounded-2xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] shadow-md space-y-5 hover-card-lift hover:border-[#2FA866]/60 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg sm:text-xl text-zinc-900 dark:text-[#F0F6FC] flex items-center gap-2.5">
                  <Code className="w-5 h-5 text-[#2FA866] dark:text-[#A8F05B]" /> {tmpl.title}
                </h3>
              </div>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-[#8B949E] leading-relaxed">
                {tmpl.description}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-[#0A1F1B] border border-zinc-200 dark:border-[#163830] font-mono text-xs sm:text-sm text-[#2FA866] dark:text-[#A8F05B] font-bold">
              $ {tmpl.command}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
