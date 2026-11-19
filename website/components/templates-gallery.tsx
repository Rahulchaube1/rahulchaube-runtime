import { Code } from "lucide-react";

const TEMPLATES = [
  {
    title: "React 19 + TypeScript",
    command: "rahulchaube create react my-app",
    description: "Start a React project with a TypeScript entry point."
  },
  {
    title: "HTTP REST API Server",
    command: "rahulchaube create hono my-api",
    description: "Create a Hono server with a sample route."
  },
  {
    title: "Next.js app",
    command: "rahulchaube create next my-site",
    description: "Create a Next.js project with a page in src/pages."
  },
  {
    title: "CLI Tooling Template",
    command: "rahulchaube create cli my-tool",
    description: "Start a command-line tool with a TypeScript entry point."
  }
];

export function TemplatesGallery() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 font-sans border-t border-zinc-200 dark:border-[#163830]">
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
        <h2 className="text-h2-fluid font-black text-zinc-900 dark:text-[#F0F6FC]">
          Project templates
        </h2>
        <p className="text-body-fluid text-zinc-600 dark:text-[#8B949E]">
          Run a command from the directory where you want to create your project.
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
