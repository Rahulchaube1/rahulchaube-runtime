import { NextResponse } from "next/server";

const POWERSHELL_SCRIPT = `# RahulChaube Runtime — Official Windows PowerShell Installer
# https://rahulchaube.space

$ErrorActionPreference = "Stop"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "RahulChaube Runtime Installer for Windows" -ForegroundColor Cyan
Write-Host "High-performance JS/TS runtime & developer platform" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$Version = "v1.0.0"
$InstallDir = Join-Path $HOME ".rahulchaube"
$BinDir = Join-Path $InstallDir "bin"

Write-Host "Installing version $Version to $BinDir..." -ForegroundColor Yellow

if (-not (Test-Path $BinDir)) {
    New-Item -ItemType Directory -Force -Path $BinDir | Out-Null
}

$ExePath = Join-Path $BinDir "rahulchaube.cmd"
$CliPath = Join-Path $PWD "packages\rahulchaube-cli\bin\rahulchaube.ts"

@'
@echo off
setlocal enabledelayedexpansion

WHERE bun >nul 2>nul
IF %ERRORLEVEL% EQU 0 (
  bun run "C:\Users\Rahul Chaube\Downloads\runtime\packages\rahulchaube-cli\bin\rahulchaube.ts" %*
  exit /b %ERRORLEVEL%
)

WHERE node >nul 2>nul
IF %ERRORLEVEL% EQU 0 (
  node --import tsx "C:\Users\Rahul Chaube\Downloads\runtime\packages\rahulchaube-cli\bin\rahulchaube.ts" %*
  exit /b %ERRORLEVEL%
)

echo RahulChaube Runtime CLI launcher requires Bun or Node.js to execute.
exit /b 1
'@ | Out-File -FilePath $ExePath -Encoding ascii

# Add to User PATH Environment Variable if not already present
$UserPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($UserPath -notlike "*$BinDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$BinDir;$UserPath", "User")
    Write-Host "[OK] Added $BinDir to User PATH environment variable." -ForegroundColor Green
}

Write-Host ""
Write-Host "[OK] RahulChaube Runtime installed successfully!" -ForegroundColor Green
Write-Host "Run 'rahulchaube --help' to get started." -ForegroundColor White
`;

export function GET() {
  return new NextResponse(POWERSHELL_SCRIPT, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
