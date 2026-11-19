/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  async rewrites() {
    return [{ source: "/install", destination: "/install.sh" }];
  },
  async headers() {
    return ["/install", "/install.sh", "/install.ps1", "/install-runtime.mjs"].map(source => ({
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
