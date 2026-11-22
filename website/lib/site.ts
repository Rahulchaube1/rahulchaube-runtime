import release from "./release-manifest.json";
export const site = {
  name: "RC Runtime",
  shortName: "RC Runtime",
  company: "RahulChaube",
  domain: "https://www.rahulchaube.space",
  feed: "/feed.xml",
  themeColor: "#0d1117",
  tagline: "Standalone JavaScript and TypeScript runtime by Rahul Chaube.",
  description:
    "Format, type-check, build, test, install and run JavaScript and TypeScript with one native executable. Build HTTP services with RC Web. RC Runtime is open source under the MIT License.",
  version: release.version,
  editorVersion: "1.2.0",
  social: {
    github: "https://github.com/Rahulchaube1/rahulchaube-runtime",
    x: "https://x.com/RahulChaube_",
    linkedin: "https://www.linkedin.com/in/rahulchaube1",
    issues: "https://github.com/Rahulchaube1/rahulchaube-runtime/issues",
  },
  nav: [
    { label: "Commands", href: "/commands" },
    { label: "Docs", href: "/docs" },
    { label: "Learn", href: "/learn" },
    { label: "Downloads", href: "/download" },
    { label: "Benchmarks", href: "/benchmarks" },
    { label: "Releases", href: "/releases" },
  ],
};
