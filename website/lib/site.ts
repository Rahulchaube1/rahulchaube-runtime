export interface DownloadTarget {
  os: string;
  arch: string;
  label: string;
}

export const site = {
  name: "EverestQ Runtime",
  shortName: "EverestQ",
  company: "EverestQ",
  domain: "https://everestqai.com",
  tagline: "High-performance JavaScript & TypeScript developer platform.",
  description:
    "A next-generation JavaScript & TypeScript runtime, package manager, and developer platform engineered for high-throughput execution, instant startup, and modular CLI tooling.",
  version: "1.0.0",
  social: {
    github: "https://github.com/Rahulchaube1/rahulchaube-runtime",
    npm: "https://www.npmjs.com/package/rahulchaube",
    x: "https://x.com/everestqai",
    linkedin: "https://linkedin.com/company/everestq",
    discord: "https://discord.gg/everestq",
  },
  nav: [
    { label: "Overview", href: "/" },
    { label: "Download", href: "/download" },
    { label: "Releases", href: "/releases" },
    { label: "Docs", href: "/docs" },
    { label: "Benchmarks", href: "/benchmarks" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Blog", href: "/blog" },
  ],
};

export const downloadTargets: DownloadTarget[] = [
  { os: "windows", arch: "x64", label: "Windows x64" },
  { os: "macos", arch: "x64", label: "macOS Intel" },
  { os: "macos", arch: "arm64", label: "macOS Apple Silicon" },
  { os: "linux", arch: "x64", label: "Linux x64" },
  { os: "linux", arch: "arm64", label: "Linux ARM64" },
];
