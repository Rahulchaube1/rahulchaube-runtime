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
  notes: ["Start the CLI with a native Blyx executable.", "Run Blyx programs with the bundled interpreter or build standalone executables."],
  changelog: {
    features: ["Use rahulchaube blyx to access the compiler and interpreter.", "Run JS and TS files with top-level await and dynamic imports through JavaScriptCore."],
    fixes: ["Verify the native launcher during installation."],
    improvements: ["Run help and version directly from the native executable."],
  },
  assets,
}];

export function getLatestRelease() { return releases[0]; }
