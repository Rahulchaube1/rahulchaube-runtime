import { NextResponse } from "next/server";

const POWERSHELL_SCRIPT = `# RahulChaube Runtime — Official Clean-Room Portable Windows PowerShell Installer
# https://rahulchaube.space

$ErrorActionPreference = "Stop"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "RahulChaube Runtime Installer for Windows" -ForegroundColor Cyan
Write-Host "High-performance JS/TS runtime & developer platform" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$Version = "v1.0.0"
$InstallDir = Join-Path $HOME ".rahulchaube"
$BinDir = Join-Path $InstallDir "bin"
$RuntimeDir = Join-Path $InstallDir "runtime"
$PackagesDir = Join-Path $InstallDir "packages"
$CliDir = Join-Path $PackagesDir "rahulchaube-cli"

Write-Host "Installing self-contained runtime $Version to $InstallDir..." -ForegroundColor Yellow

if (-not (Test-Path $BinDir)) { New-Item -ItemType Directory -Force -Path $BinDir | Out-Null }
if (-not (Test-Path $RuntimeDir)) { New-Item -ItemType Directory -Force -Path $RuntimeDir | Out-Null }
if (-not (Test-Path $CliDir)) { New-Item -ItemType Directory -Force -Path $CliDir | Out-Null }

# Deploy self-contained runtime engine & CLI package
$SearchLocations = @(
    $PWD,
    "c:\\Users\\Rahul Chaube\\Downloads\\runtime",
    "$HOME\\Downloads\\runtime",
    "$HOME\\Downloads\\rahulchaube-runtime"
)

foreach ($loc in $SearchLocations) {
    $candidateRuntime = Join-Path $loc "runtime"
    if (Test-Path $candidateRuntime) {
        Write-Host "[OK] Deploying runtime engine from $candidateRuntime..." -ForegroundColor Gray
        Copy-Item -Path "$candidateRuntime\\*" -Destination $RuntimeDir -Recurse -Force
        break
    }
}

foreach ($loc in $SearchLocations) {
    $candidateCli = Join-Path $loc "packages\\rahulchaube-cli"
    if (Test-Path $candidateCli) {
        Write-Host "[OK] Deploying CLI package from $candidateCli..." -ForegroundColor Gray
        Copy-Item -Path "$candidateCli\\*" -Destination $CliDir -Recurse -Force
        break
    }
}

$ExePath = Join-Path $BinDir "rahulchaube.cmd"

$CmdBatch = @"
@echo off
setlocal enabledelayedexpansion

for %%I in ("%~dp0..") do set "INSTALL_DIR=%%~fI"
set "CLI_ENTRY=%INSTALL_DIR%\\packages\\rahulchaube-cli\\bin\\rahulchaube.ts"
set "COMPILED_EXE=%INSTALL_DIR%\\bin\\rahulchaube-native.exe"

IF EXIST "%COMPILED_EXE%" (
  "%COMPILED_EXE%" %*
  exit /b %ERRORLEVEL%
)

WHERE bun >nul 2>nul
IF %ERRORLEVEL% EQU 0 (
  bun run "%CLI_ENTRY%" %*
  exit /b %ERRORLEVEL%
)

WHERE node >nul 2>nul
IF %ERRORLEVEL% EQU 0 (
  node --import tsx "%CLI_ENTRY%" %*
  exit /b %ERRORLEVEL%
)

echo RahulChaube Runtime CLI requires Bun or Node.js to execute script engine.
exit /b 1
"@

Out-File -InputObject $CmdBatch -FilePath $ExePath -Encoding ascii

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
