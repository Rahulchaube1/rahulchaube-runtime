import { site } from "@/lib/site";
import { ShieldCheck, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Software License & Legal Notices — RahulChaube Runtime",
  description: "Software license terms, copyright declarations, and legal disclosures for RahulChaube Runtime.",
};

export default function LicensePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl font-sans">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-[#F0F6FC] tracking-tight mb-2 font-title">
          Software License &amp; Disclosures
        </h1>
        <p className="text-zinc-600 dark:text-[#8B949E] text-sm font-sans">
          RahulChaube Runtime software terms and copyright declarations.
        </p>
      </div>

      <div className="space-y-8">
        {/* Main Software License */}
        <div className="bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] rounded-xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-[#F0F6FC] mb-4 flex items-center gap-2 font-title">
            <ShieldCheck className="w-5 h-5 text-[#2FA866]" /> RahulChaube Runtime Software License
          </h2>
          <pre className="p-4 rounded-lg bg-zinc-100 dark:bg-[#0A1F1B] border border-zinc-200 dark:border-[#163830] font-mono text-xs text-zinc-800 dark:text-[#8B949E] overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`RahulChaube Runtime License

Copyright (c) 2026 RahulChaube.

All rights reserved.

Permission is hereby granted to use, run, and execute the Software for personal,
development, and enterprise production environments in accordance with the
RahulChaube Runtime Terms of Service.

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
            RahulChaube Runtime incorporates high-performance engine execution components.
          </p>
          <div className="text-xs text-zinc-600 dark:text-[#8B949E] font-mono p-4 rounded-lg bg-zinc-100 dark:bg-[#0A1F1B] border border-zinc-200 dark:border-[#163830]">
            RahulChaube Runtime is an independent enterprise software platform.
          </div>
        </div>
      </div>
    </div>
  );
}
