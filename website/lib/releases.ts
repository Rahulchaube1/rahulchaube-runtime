import manifest from "./release-manifest.json";

const ref = process.env.VERCEL_GIT_COMMIT_SHA;
const downloadUrl = ref && /^[a-f0-9]{40}$/.test(ref)
  ? manifest.downloadUrl.replace(/\/(?:refs\/heads\/main|v[\d.]+)\/dist$/, `/${ref}/dist`)
  : manifest.downloadUrl;
export const versionInfo = {
  ...manifest, downloadUrl,
  assets: Object.fromEntries(Object.entries(manifest.assets).map(([target, url]) =>
    [target, url.replace(manifest.downloadUrl, downloadUrl)])),
};

const labels: Record<string, string> = {
  "win-x64": "Windows x64",
  "linux-x64": "Linux x64",
  "linux-arm64": "Linux ARM64",
  "darwin-x64": "macOS Intel",
  "darwin-arm64": "macOS Apple Silicon",
};

const assets = Object.entries(versionInfo.assets).map(([target, downloadUrl]) => {
  const filename = downloadUrl.split("/").pop()! as keyof typeof manifest.sha256;
  const [os, arch] = target.split("-");
  return {
    target, platform: labels[target], os: os === "win" ? "windows" : os, arch, filename,
    size: `${(manifest.sizes[filename] / 1024).toFixed(1)} KiB`,
    sha256: manifest.sha256[filename], downloadUrl,
  };
});

export const releases = [{
  version: manifest.version, tag: `v${manifest.version}`, date: "2026-11-22", isLatest: true,
  notes: ["Format JS and TS in place or validate formatting in CI.", "Check project types offline using TypeScript 5.9.3 and the RC declarations."],
  changelog: {
    features: ["Run rc fmt and rc check from the CLI and editor.", "Explore six command guides with reproducible workload charts."],
    fixes: ["Provide the native stack size needed by the embedded TypeScript compiler on static Linux builds."],
    improvements: ["Fetch up to four distinct pinned modules concurrently.", "Use a direct transform for standalone TypeScript scripts that have no project configuration or module imports."],
  },
  assets,
}];

export function getLatestRelease() { return releases[0]; }
