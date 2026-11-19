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
  notes: ["Watch JavaScript and TypeScript projects in the terminal or VS Code.", "Reload changed modules while keeping compatible process state."],
  changelog: {
    features: ["Run, watch, hot reload and stop a project with the RC Runtime editor commands."],
    fixes: ["Restart when an imported module changes and recover after correcting syntax errors."],
    improvements: ["Download verified public release archives without signing in."],
  },
  assets,
}];

export function getLatestRelease() { return releases[0]; }
