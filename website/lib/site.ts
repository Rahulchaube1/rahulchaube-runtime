import release from "./release-manifest.json";

export interface DownloadTarget {
  os: string;
  arch: string;
  label: string;
}

export const site = {
  name: "RC Runtime",
  shortName: "RC Runtime",
  company: "RahulChaube",
  domain: "https://www.rahulchaube.space",
  tagline: "Standalone JavaScript and TypeScript runtime by Rahul Chaube.",
  description:
    "Run JavaScript and TypeScript, bundle modules, test code and serve HTTP with RC Web. RC Runtime is open source under the MIT License.",
  version: release.version,
  social: {
    github: "https://github.com/Rahulchaube1/rahulchaube-runtime",
    x: "https://x.com/RahulChaube_",
    linkedin: "https://www.linkedin.com/in/rahulchaube1",
    issues: "https://github.com/Rahulchaube1/rahulchaube-runtime/issues",
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
