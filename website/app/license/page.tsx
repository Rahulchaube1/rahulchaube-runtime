import { site } from "@/lib/site";
import { ShieldCheck, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Software License & Legal Notices — RC Runtime",
  description: "Software license terms, copyright declarations, and legal disclosures for RC Runtime.",
};

export default function LicensePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl font-sans">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-[#F0F6FC] tracking-tight mb-2 font-title">
          Software License &amp; Disclosures
        </h1>
        <p className="text-zinc-600 dark:text-[#8B949E] text-sm font-sans">
          RC Runtime software terms and copyright declarations.
        </p>
      </div>

      <div className="space-y-8">
        {/* Main Software License */}
        <div className="bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] rounded-xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-[#F0F6FC] mb-4 flex items-center gap-2 font-title">
            <ShieldCheck className="w-5 h-5 text-[#2FA866]" /> RC Runtime Software License
          </h2>
          <pre className="p-4 rounded-lg bg-zinc-100 dark:bg-[#0A1F1B] border border-zinc-200 dark:border-[#163830] font-mono text-xs text-zinc-800 dark:text-[#8B949E] overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`MIT License

Copyright (c) 2026 Rahul Chaube

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
          </pre>
        </div>

        {/* Engine Attribution Disclosures */}
        <div className="bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] rounded-xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-[#F0F6FC] mb-3 flex items-center gap-2 font-title">
            <FileText className="w-5 h-5 text-[#6FCF63]" /> Engine Attribution &amp; Disclosures
          </h2>
          <p className="text-xs text-zinc-600 dark:text-[#8B949E] leading-relaxed mb-4">
            RC Runtime embeds QuickJS-NG, quickjs-go, esbuild and the Go standard library. Release archives include their license notices.
          </p>
          <div className="text-xs text-zinc-600 dark:text-[#8B949E] font-mono p-4 rounded-lg bg-zinc-100 dark:bg-[#0A1F1B] border border-zinc-200 dark:border-[#163830]">
            <a className="underline" href={site.social.github + "/tree/main/licenses"}>Third-party license notices</a>
          </div>
        </div>
      </div>
    </div>
  );
}
