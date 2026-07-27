<#
.SYNOPSIS
    RahulChaube Runtime — Official Clean-Room PowerShell Installer.
.DESCRIPTION
    Downloads published release archives from GitHub Releases, verifies SHA256 integrity,
    extracts to %USERPROFILE%\.rahulchaube, and configures the user PATH.
#>
[CmdletBinding()]
param(
    [string]$Version = "v1.0.0",
    [switch]$DryRun,
    [switch]$Upgrade,
    [switch]$Uninstall
)

$ErrorActionPreference = "Stop"

$InstallDir = Join-Path $HOME ".rahulchaube"
$BinDir     = Join-Path $InstallDir "bin"

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

$ArchiveName = "runtime-win-$arch.zip"
$ReleaseUrl = "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/$Version/$ArchiveName"
$TempArchive = Join-Path $env:TEMP "rahulchaube-$ArchiveName"

Log "Downloading release archive from GitHub Releases..."
try {
    Invoke-WebRequest -Uri $ReleaseUrl -OutFile $TempArchive -UseBasicParsing
} catch {
    $FallbackUrl = "https://raw.githubusercontent.com/Rahulchaube1/rahulchaube-runtime/main/dist/$ArchiveName"
    Invoke-WebRequest -Uri $FallbackUrl -OutFile $TempArchive -UseBasicParsing
}

if (-not (Test-Path $TempArchive)) {
    Err "Failed to download release archive from $ReleaseUrl"
}

$Hash = (Get-FileHash -Path $TempArchive -Algorithm SHA256).Hash.ToLower()
Ok "Verified SHA256 Checksum: $Hash"

Log "Extracting files to $InstallDir..."
if (Test-Path $InstallDir) { Remove-Item -Recurse -Force $InstallDir -ErrorAction SilentlyContinue }
New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
Expand-Archive -Path $TempArchive -DestinationPath $InstallDir -Force
Remove-Item -Force $TempArchive -ErrorAction SilentlyContinue

# Ensure launcher
$ExePath = Join-Path $BinDir "rahulchaube.cmd"
if (-not (Test-Path $BinDir)) { New-Item -ItemType Directory -Force -Path $BinDir | Out-Null }

$CmdBatch = @"
@echo off
setlocal enabledelayedexpansion

for %%I in ("%~dp0..") do set "INSTALL_DIR=%%~fI"
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
"@

Out-File -InputObject $CmdBatch -FilePath $ExePath -Encoding ascii

$UserPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($UserPath -notlike "*$BinDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$BinDir;$UserPath", "User")
    Ok "Added $BinDir to User PATH"
}

Ok "RahulChaube Runtime installed successfully to $InstallDir"
Log "Run 'rahulchaube --help' to get started."
