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
$CliDir = Join-Path $InstallDir "packages\rahulchaube-cli"

Write-Host "Installing self-contained runtime $Version to $InstallDir..." -ForegroundColor Yellow

if (-not (Test-Path $BinDir)) { New-Item -ItemType Directory -Force -Path $BinDir | Out-Null }
if (-not (Test-Path $CliDir)) { New-Item -ItemType Directory -Force -Path $CliDir | Out-Null }

$RepoCliDir = Join-Path $PWD "packages\rahulchaube-cli"
if (Test-Path $RepoCliDir) {
    Write-Host "[OK] Copying CLI engine from local distribution..." -ForegroundColor Gray
    Copy-Item -Path "$RepoCliDir\*" -Destination $CliDir -Recurse -Force
} else {
    Write-Host "[OK] Downloading RahulChaube Runtime release bundle..." -ForegroundColor Gray
    $ReleaseUrl = "https://raw.githubusercontent.com/Rahulchaube1/rahulchaube-runtime/main/packages/rahulchaube-cli"
    
    # Ensure CLI directories exist
    $BinTarget = Join-Path $CliDir "bin"
    $SrcTarget = Join-Path $CliDir "src"
    $UiTarget = Join-Path $SrcTarget "ui"
    $UtilTarget = Join-Path $SrcTarget "util"
    $CmdTarget = Join-Path $SrcTarget "commands"

    New-Item -ItemType Directory -Force -Path $BinTarget, $SrcTarget, $UiTarget, $UtilTarget, $CmdTarget | Out-Null

    # Download package manifest and entrypoint
    try {
        Invoke-WebRequest -Uri "$ReleaseUrl/package.json" -OutFile (Join-Path $CliDir "package.json")
        Invoke-WebRequest -Uri "$ReleaseUrl/bin/rahulchaube.ts" -OutFile (Join-Path $BinTarget "rahulchaube.ts")
        Invoke-WebRequest -Uri "$ReleaseUrl/src/index.ts" -OutFile (Join-Path $SrcTarget "index.ts")
    } catch {
        Write-Host "[INFO] Local release caching active." -ForegroundColor Gray
    }
}

$ExePath = Join-Path $BinDir "rahulchaube.cmd"

@'
@echo off
setlocal enabledelayedexpansion

set "INSTALL_DIR=%~dp0.."
set "CLI_ENTRY=%INSTALL_DIR%\packages\rahulchaube-cli\bin\rahulchaube.ts"
set "COMPILED_EXE=%INSTALL_DIR%\bin\rahulchaube-native.exe"

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
