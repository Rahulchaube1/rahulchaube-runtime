import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Policy — RC Runtime",
  description: "Security vulnerability disclosure policy, audit reporting guidelines, and security practices for RC Runtime.",
};

export default function SecurityPage() {
  return (
    <div className="site-container py-16 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-[#F0F6FC] tracking-tight font-title">
          Security Policy &amp; Vulnerability Disclosure
        </h1>
        <div className="space-y-4 text-zinc-700 dark:text-[#8B949E] text-base leading-relaxed">
          <p>
            Security is paramount to the RC Runtime developer platform. We perform automated dependency auditing and provide native security scanning via \`rahulchaube audit\`.
          </p>

          <h2 className="text-xl font-bold text-zinc-900 dark:text-[#F0F6FC] font-title">
            Reporting Vulnerabilities
          </h2>
          <p>
            Please report any security concerns directly to our security engineering contacts via email at: <a href="mailto:rahulchaube@users.noreply.github.com" className="text-[#2FA866] underline font-mono">rahulchaube@users.noreply.github.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
