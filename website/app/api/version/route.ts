import { NextResponse } from "next/server";

export interface VersionInfo {
  version: string;
  channel: string;
  release: string;
  downloadUrl: string;
  assets: {
    "win-x64": string;
    "linux-x64": string;
    "linux-arm64": string;
    "darwin-x64": string;
    "darwin-arm64": string;
  };
  sha256: Record<string, string>;
}

const VERSION_DATA: VersionInfo = {
  version: "1.0.0",
  channel: "stable",
  release: "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/tag/v1.0.0",
  downloadUrl: "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v1.0.0",
  assets: {
    "win-x64": "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v1.0.0/runtime-win-x64.zip",
    "linux-x64": "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v1.0.0/runtime-linux-x64.tar.gz",
    "linux-arm64": "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v1.0.0/runtime-linux-arm64.tar.gz",
    "darwin-x64": "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v1.0.0/runtime-darwin-x64.tar.gz",
    "darwin-arm64": "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v1.0.0/runtime-darwin-arm64.tar.gz",
  },
  sha256: {
    "runtime-win-x64.zip": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "runtime-linux-x64.tar.gz": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "runtime-linux-arm64.tar.gz": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "runtime-darwin-x64.tar.gz": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "runtime-darwin-arm64.tar.gz": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  },
};

export function GET() {
  return NextResponse.json(VERSION_DATA, {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=60, s-maxage=60",
    },
  });
}
