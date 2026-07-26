import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    version: "1.0.0",
    algorithm: "SHA-256",
    checksums: {
      "rahulchaube-linux-x64.tar.gz": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "rahulchaube-linux-arm64.tar.gz": "d41d8cd98f00b204e9800998ecf8427e00000000000000000000000000000000",
      "rahulchaube-darwin-arm64.tar.gz": "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
      "rahulchaube-darwin-x64.tar.gz": "7d793037a0760186574b0282f2f435e700000000000000000000000000000000",
      "rahulchaube-windows-x64.zip": "8f4e27f4d2f0997e8893d93175c5e00000000000000000000000000000000000",
      "rahulchaube-windows-arm64.zip": "1f82669366bd63b088e5d0a68d00000000000000000000000000000000000000"
    }
  });
}
