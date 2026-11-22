/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  outputFileTracingIncludes: { "/docs": ["./content/docs/*.md"] },
  async redirects() {
    return [
      { source: "/rc-engine.webp", destination: "/rc-flow.webp", permanent: true },
      { source: "/docs/reference-cli-specification", destination: "/docs/cli", permanent: true },
      {
        source: "/docs/explanations-architecture-and-lifecycle",
        destination: "/docs/architecture#execution-lifecycle",
        permanent: true,
      },
      { source: "/docs/performance", destination: "/docs/benchmarks", permanent: true },
      { source: "/docs/plugins", destination: "/docs/compatibility#earlier-cli-plug-ins", permanent: true },
    ];
  },
  async rewrites() {
    return [{ source: "/install", destination: "/install.sh" }];
  },
  async headers() {
    return ["/install", "/install.sh", "/install.ps1", "/install-runtime.mjs"].map((source) => ({
      source,
      headers: [
        { key: "Cache-Control", value: "no-store" },
        { key: "Content-Type", value: "text/plain; charset=utf-8" },
      ],
    }));
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
