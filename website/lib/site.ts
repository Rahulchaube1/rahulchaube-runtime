export interface DownloadTarget {
  os: string;
  arch: string;
  label: string;
}

export const site = {
  name: "RahulChaube Runtime",
  shortName: "RahulChaube",
  domain: "https://rahulchaube.space",
  tagline: "A fast, drop-in JavaScript runtime & developer platform.",
  description:
    "An independent, MIT-licensed JavaScript and TypeScript runtime engineered for ultra-fast startup, scannable CLI tooling, integrated package management, and multi-OS distribution.",
  version: "1.0.0",
  social: {
    github: "https://github.com/Rahulchaube1/rahulchaube-runtime",
    npm: "https://www.npmjs.com/package/rahulchaube",
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
