export const site = {
  name: "RahulChaube Runtime",
  shortName: "RahulChaube",
  tagline: "The Next Generation JavaScript Runtime & Developer Platform.",
  domain: "https://rahulchaube.space",
  description:
    "RahulChaube Runtime is an independent, MIT-licensed JavaScript & TypeScript runtime and developer platform with a colorful CLI, fast installs, and a premium developer experience.",
  nav: [
    { href: "/", label: "Home" },
    { href: "/download", label: "Download" },
    { href: "/releases", label: "Releases" },
    { href: "/docs", label: "Docs" },
    { href: "/benchmarks", label: "Benchmarks" },
    { href: "/blog", label: "Blog" },
    { href: "/roadmap", label: "Roadmap" },
  ],
  social: {
    github: "https://github.com/Rahulchaube1/rahulchaube-runtime",
  },
  installCommand: "curl -fsSL https://rahulchaube.space/install | bash",
} as const;

export type PlatformTarget = {
  os: string;
  arch: string;
  label: string;
  emoji: string;
};

export const downloadTargets: PlatformTarget[] = [
  { os: "windows", arch: "x64", label: "Windows", emoji: "🪟" },
  { os: "macos", arch: "x64", label: "macOS Intel", emoji: "🍎" },
  { os: "macos", arch: "arm64", label: "macOS ARM", emoji: "🍎" },
  { os: "linux", arch: "x64", label: "Linux x64", emoji: "🐧" },
  { os: "linux", arch: "arm64", label: "Linux ARM", emoji: "🐧" },
];
