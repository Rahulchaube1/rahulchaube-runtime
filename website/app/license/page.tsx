import { site } from "@/lib/site";
import { ShieldCheck, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Source Licenses & Legal Notices — EverestQ Runtime",
  description: "Open source license text, MIT copyright declarations, and upstream software disclosures for EverestQ Runtime.",
};

export default function LicensePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl font-sans">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-[#F0F6FC] tracking-tight mb-2">
          Open Source Licenses &amp; Disclosures
        </h1>
        <p className="text-zinc-600 dark:text-[#8B949E] text-sm">
          EverestQ Runtime is distributed under the open-source MIT License.
        </p>
      </div>

      <div className="space-y-8">
        {/* Main MIT License */}
        <div className="bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] rounded-xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-[#F0F6FC] mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2FA866]" /> EverestQ Runtime MIT License
          </h2>
          <pre className="p-4 rounded-lg bg-zinc-100 dark:bg-[#0A1F1B] border border-zinc-200 dark:border-[#163830] font-mono text-xs text-zinc-800 dark:text-[#8B949E] overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`MIT License

Copyright (c) 2026 EverestQ.

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

        {/* Upstream Open Source Disclosures */}
        <div className="bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] rounded-xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-[#F0F6FC] mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#6FCF63]" /> Upstream Engine Attribution
          </h2>
          <p className="text-xs text-zinc-600 dark:text-[#8B949E] leading-relaxed mb-4">
            EverestQ Runtime incorporates components derived from open-source projects including Bun (Oven LLC) and WebKit under the MIT and LGPL licenses.
          </p>
          <div className="text-xs text-zinc-600 dark:text-[#8B949E] font-mono p-4 rounded-lg bg-zinc-100 dark:bg-[#0A1F1B] border border-zinc-200 dark:border-[#163830]">
            EverestQ Runtime is an independent, MIT-licensed software platform. Not affiliated with or endorsed by Oven LLC or Apple Inc.
          </div>
        </div>
      </div>
    </div>
  );
}
