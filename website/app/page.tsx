import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Hero } from "@/components/hero";
import { TemplatesGallery } from "@/components/templates-gallery";

const guides = [
  { href: "/docs/cli", title: "CLI reference", detail: "Find a command and its options." },
  { href: "/docs/rc-web", title: "RC Web", detail: "Build and test your first HTTP route." },
  { href: "/benchmarks", title: "Benchmarks", detail: "Run the suite on your machine." },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <section aria-label="Developer resources" className="mx-auto grid max-w-6xl gap-4 px-6 py-10 md:grid-cols-3">
        {guides.map(({ href, title, detail }) => (
          <Link key={href} href={href} className="group rounded-xl border border-zinc-200 bg-white p-5 hover:border-brand dark:border-vscode-border dark:bg-ink-800">
            <h2 className="flex items-center justify-between font-semibold">{title}<ArrowUpRight size={16} className="text-emerald-700 dark:text-brand-lime" /></h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{detail}</p>
          </Link>
        ))}
      </section>
      <TemplatesGallery />
    </>
  );
}
