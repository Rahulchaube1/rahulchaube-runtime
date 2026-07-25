export interface ReleaseAsset {
  platform: string;
  os: "windows" | "linux" | "darwin";
  arch: "x64" | "arm64";
  filename: string;
  size: string;
  sha256: string;
  downloadUrl: string;
}

export interface Release {
  version: string;
  tag: string;
  date: string;
  isLatest: boolean;
  notes: string[];
  changelog: {
    features: string[];
    fixes: string[];
    improvements: string[];
  };
  assets: ReleaseAsset[];
}

export const releases: Release[] = [
  {
    version: "1.0.0",
    tag: "v1.0.0",
    date: "2026-07-26",
    isLatest: true,
    notes: [
      "Initial production release of RahulChaube Runtime",
      "Full drop-in Node.js compatibility with TypeScript & JSX out of the box",
      "Built-in ultra-fast package manager and bundler",
      "AI-assisted diagnostics (`rahulchaube explain`, `rahulchaube optimize`)",
    ],
    changelog: {
      features: [
        "CLI dispatcher with 21 commands (`install`, `add`, `create`, `doctor`, `explain`, `benchmark`)",
        "Scaffolding support for React, Next.js, Express, Hono, Library, and CLI templates",
        "Built-in HTTP server framework and OpenAPI generator in `api/`",
        "Cross-platform installer for Linux, macOS, and Windows",
      ],
      fixes: [
        "Fixed dependency tree resolution in edge cases",
        "Resolved PATH environment export formatting across zsh and bash",
      ],
      improvements: [
        "Optimized cold startup time and memory allocation",
        "Redesigned terminal progress logs and colorful banners",
      ],
    },
    assets: [
      {
        platform: "Linux x64",
        os: "linux",
        arch: "x64",
        filename: "rahulchaube-linux-x64.tar.gz",
        size: "42.1 MB",
        sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        downloadUrl: "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v1.0.0/rahulchaube-linux-x64.tar.gz",
      },
      {
        platform: "Linux ARM64",
        os: "linux",
        arch: "arm64",
        filename: "rahulchaube-linux-arm64.tar.gz",
        size: "39.8 MB",
        sha256: "f4c0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b866",
        downloadUrl: "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v1.0.0/rahulchaube-linux-arm64.tar.gz",
      },
      {
        platform: "macOS Apple Silicon (ARM64)",
        os: "darwin",
        arch: "arm64",
        filename: "rahulchaube-darwin-arm64.tar.gz",
        size: "40.5 MB",
        sha256: "a1b2c34298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b877",
        downloadUrl: "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v1.0.0/rahulchaube-darwin-arm64.tar.gz",
      },
      {
        platform: "macOS Intel (x64)",
        os: "darwin",
        arch: "x64",
        filename: "rahulchaube-darwin-x64.tar.gz",
        size: "41.9 MB",
        sha256: "b2c3d44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b888",
        downloadUrl: "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v1.0.0/rahulchaube-darwin-x64.tar.gz",
      },
      {
        platform: "Windows x64",
        os: "windows",
        arch: "x64",
        filename: "rahulchaube-windows-x64.zip",
        size: "44.2 MB",
        sha256: "c3d4e54298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b899",
        downloadUrl: "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v1.0.0/rahulchaube-windows-x64.zip",
      },
      {
        platform: "Windows ARM64",
        os: "windows",
        arch: "arm64",
        filename: "rahulchaube-windows-arm64.zip",
        size: "41.0 MB",
        sha256: "d4e5f64298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b800",
        downloadUrl: "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v1.0.0/rahulchaube-windows-arm64.zip",
      },
    ],
  },
];

export function getLatestRelease(): Release {
  return releases.find((r) => r.isLatest) ?? releases[0];
}
