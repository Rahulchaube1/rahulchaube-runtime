import manifest from "./release-manifest.json";

const ref = process.env.VERCEL_GIT_COMMIT_SHA;
const downloadUrl = ref && /^[a-f0-9]{40}$/.test(ref)
  ? manifest.downloadUrl.replace("refs/heads/main", ref)
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
  version: manifest.version, tag: `v${manifest.version}`, date: "2026-11-19", isLatest: true,
  notes: ["Load CLI commands on demand.", "Run relative script paths and forward script arguments.", "Verify release archives before installation."],
  changelog: {
    features: ["Forward options to a script after --."],
    fixes: ["Corrected file execution and delegated command exit codes."],
    improvements: ["Reduced command startup work and added verified installation."],
  },
  assets,
}];

export function getLatestRelease() { return releases[0]; }
