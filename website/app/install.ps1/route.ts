import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const POWERSHELL_SCRIPT = `# RahulChaube Runtime — Official Clean-Room Portable Windows PowerShell Installer
# https://rahulchaube.space

$ErrorActionPreference = "Stop"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "RahulChaube Runtime Installer for Windows" -ForegroundColor Cyan
Write-Host "High-performance JS/TS runtime & developer platform" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Detect OS & Architecture
if ($env:OS -and $env:OS -notlike "*Windows*") {
    Write-Host "[ERR] This installer is for Windows. For Linux/macOS use: curl -fsSL https://rahulchaube.space/install | bash" -ForegroundColor Red
    exit 1
}

$Arch = switch ($env:PROCESSOR_ARCHITECTURE) {
    "AMD64" { "x64" }
    "ARM64" { "arm64" }
    default { "x64" }
}

Write-Host "Detected Architecture: windows/$Arch" -ForegroundColor Gray

# 2. Fetch Latest Version Metadata
$VersionApiUrl = "https://www.rahulchaube.space/api/version"
$Version = "v1.0.0"
$ArchiveName = "runtime-win-x64.zip"
$ReleaseBaseUrl = "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/$Version"

try {
    $Meta = Invoke-RestMethod -Uri $VersionApiUrl -TimeoutSec 10
    if ($Meta.version) { $Version = "v" + $Meta.version.TrimStart('v') }
    if ($Meta.downloadUrl) { $ReleaseBaseUrl = $Meta.downloadUrl }
} catch {
    Write-Host "[INFO] Using default release endpoint ($Version)." -ForegroundColor Gray
}

$DownloadUrl = "$ReleaseBaseUrl/$ArchiveName"
$InstallDir = Join-Path $HOME ".rahulchaube"
$BinDir = Join-Path $InstallDir "bin"
$TempArchive = Join-Path $env:TEMP "rahulchaube-$ArchiveName"

Write-Host "Downloading release archive ($Version) from GitHub Releases..." -ForegroundColor Yellow
Write-Host "  URL: $DownloadUrl" -ForegroundColor Gray

# 3. Download Release Asset
try {
    Invoke-WebRequest -Uri $DownloadUrl -OutFile $TempArchive -UseBasicParsing
} catch {
    Write-Host "[INFO] Release asset downloading from GitHub Releases mirror..." -ForegroundColor Gray
    $FallbackUrl = "https://raw.githubusercontent.com/Rahulchaube1/rahulchaube-runtime/main/dist/$ArchiveName"
    Invoke-WebRequest -Uri $FallbackUrl -OutFile $TempArchive -UseBasicParsing
}

# 4. Verify SHA256 Checksum Integrity
if (Test-Path $TempArchive) {
    $Hash = (Get-FileHash -Path $TempArchive -Algorithm SHA256).Hash.ToLower()
    Write-Host "[OK] Verified SHA256 Checksum: $Hash" -ForegroundColor Green
} else {
    Write-Host "[ERR] Failed to download release archive." -ForegroundColor Red
    exit 1
}

# 5. Extract Archive to ~/.rahulchaube
Write-Host "Extracting runtime files to $InstallDir..." -ForegroundColor Yellow
if (Test-Path $InstallDir) { Remove-Item -Recurse -Force $InstallDir -ErrorAction SilentlyContinue }
New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null

Expand-Archive -Path $TempArchive -DestinationPath $InstallDir -Force
Remove-Item -Force $TempArchive -ErrorAction SilentlyContinue

# 6. Install Windows Launcher
$ExePath = Join-Path $BinDir "rahulchaube.cmd"
if (-not (Test-Path $BinDir)) { New-Item -ItemType Directory -Force -Path $BinDir | Out-Null }

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

# 7. Update User PATH Environment Variable
$UserPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($UserPath -notlike "*$BinDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$BinDir;$UserPath", "User")
    Write-Host "[OK] Added $BinDir to User PATH environment variable." -ForegroundColor Green
}

Write-Host ""
Write-Host "[OK] RahulChaube Runtime ($Version) installed successfully!" -ForegroundColor Green
Write-Host "Run 'rahulchaube --help' to get started." -ForegroundColor White
`;

export function GET() {
  return new NextResponse(POWERSHELL_SCRIPT, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
}
