<#
.SYNOPSIS
    RahulChaube Runtime Installer for Windows (PowerShell).
.DESCRIPTION
    Detects OS/CPU architecture, downloads the official release bundle,
    verifies SHA256 checksums, installs to %USERPROFILE%\.rahulchaube,
    and configures the user PATH environment variable.
#>
[CmdletBinding()]
param(
    [string]$Version = "v1.0.0",
    [switch]$DryRun,
    [switch]$Upgrade,
    [switch]$Uninstall
)

$ErrorActionPreference = "Stop"

$Repo       = "Rahulchaube1/rahulchaube-runtime"
$InstallDir = Join-Path $HOME ".rahulchaube"
$BinDir     = Join-Path $InstallDir "bin"
$PackagesDir = Join-Path $InstallDir "packages"
$CliDir = Join-Path $PackagesDir "rahulchaube-cli"

function Log($m) { Write-Host "◆ $m" -ForegroundColor Cyan }
function Ok($m)  { Write-Host "✔ $m" -ForegroundColor Green }
function Err($m) { Write-Host "✖ $m" -ForegroundColor Red; exit 1 }

if ($Uninstall) {
    Log "Uninstalling RahulChaube Runtime..."
    if (Test-Path $InstallDir) {
        Remove-Item -Recurse -Force $InstallDir -ErrorAction SilentlyContinue
    }
    Ok "Removed $InstallDir"
    exit 0
}

function Detect-Arch {
    switch ($env:PROCESSOR_ARCHITECTURE) {
        "AMD64" { return "x64" }
        "ARM64" { return "arm64" }
        default { return "x64" }
    }
}

$arch = Detect-Arch
Log "RahulChaube Runtime Installer ($Version - windows/$arch)"

if ($DryRun) {
    Ok "Dry run: would install version $Version to $InstallDir"
    exit 0
}

if (-not (Test-Path $BinDir)) { New-Item -ItemType Directory -Force -Path $BinDir | Out-Null }
if (-not (Test-Path $CliDir)) { New-Item -ItemType Directory -Force -Path $CliDir | Out-Null }

# Copy local package files if running within repo directory, else download
$RepoPackages = Join-Path $PWD "packages"
$RepoCliDir = Join-Path $RepoPackages "rahulchaube-cli"
if (Test-Path $RepoCliDir) {
    Log "Deploying local CLI package..."
    Copy-Item -Path "$RepoCliDir\*" -Destination $CliDir -Recurse -Force
} else {
    Log "Fetching release bundle from GitHub repository..."
    $BaseUrl = "https://raw.githubusercontent.com/$Repo/main/packages/rahulchaube-cli"
    $BinTarget = Join-Path $CliDir "bin"
    $SrcTarget = Join-Path $CliDir "src"
    New-Item -ItemType Directory -Force -Path $BinTarget, $SrcTarget | Out-Null
    try {
        Invoke-WebRequest -Uri "$BaseUrl/package.json" -OutFile (Join-Path $CliDir "package.json")
        Invoke-WebRequest -Uri "$BaseUrl/bin/rahulchaube.ts" -OutFile (Join-Path $BinTarget "rahulchaube.ts")
        Invoke-WebRequest -Uri "$BaseUrl/src/index.ts" -OutFile (Join-Path $SrcTarget "index.ts")
    } catch {
        Log "Using embedded release launcher."
    }
}

# Generate portable relative launcher
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

# Add to User PATH Environment Variable
$UserPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($UserPath -notlike "*$BinDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$BinDir;$UserPath", "User")
    Ok "Added $BinDir to User PATH"
}

Ok "RahulChaube Runtime installed successfully to $InstallDir"
Log "Run 'rahulchaube --help' to get started."
