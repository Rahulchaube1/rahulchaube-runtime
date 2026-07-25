<#
.SYNOPSIS
    RahulChaube Runtime installer for Windows (PowerShell).
.DESCRIPTION
    Detects OS/CPU, downloads the latest release, verifies its checksum,
    installs it, and adds it to the user PATH.
.PARAMETER Version
    Specific version to install (default: latest).
.PARAMETER DryRun
    Print the resolved URL without downloading.
#>
[CmdletBinding()]
param(
    [string]$Version = "",
    [switch]$DryRun,
    [switch]$Upgrade,
    [switch]$Uninstall
)

$ErrorActionPreference = "Stop"

$Repo      = if ($env:RAHULCHAUBE_REPO) { $env:RAHULCHAUBE_REPO } else { "rahulchaube/rahulchaube-runtime" }
$BaseUrl   = if ($env:RAHULCHAUBE_INSTALL_BASE) { $env:RAHULCHAUBE_INSTALL_BASE } else { "https://github.com/$Repo/releases/download" }
$InstallDir = if ($env:RAHULCHAUBE_INSTALL_DIR) { $env:RAHULCHAUBE_INSTALL_DIR } else { "$env:LOCALAPPDATA\rahulchaube" }

function Log($m) { Write-Host "$([char]0x25C6) $m" }
function Ok($m)  { Write-Host "$([char]0x2714) $m" -ForegroundColor Green }
function Err($m) { Write-Host "$([char]0x2716) $m" -ForegroundColor Red; exit 1 }

if ($Uninstall) {
    Log "Uninstalling RahulChaube Runtime..."
    if (Test-Path $InstallDir) { Remove-Item -Recurse -Force $InstallDir -ErrorAction SilentlyContinue }
    Ok "Removed $InstallDir"
    exit 0
}

function Detect-Arch {
    switch ($env:PROCESSOR_ARCHITECTURE) {
        "AMD64" { return "x64" }
        "ARM64" { return "arm64" }
        default { Err "Unsupported architecture: $env:PROCESSOR_ARCHITECTURE" }
    }
}

function Resolve-Version {
    if ($Version) { return $Version }
    try {
        $rel = Invoke-RestMethod "https://api.github.com/repos/$Repo/releases/latest"
        return $rel.tag_name
    } catch {
        Err "Could not resolve latest version: $_"
    }
}

$arch = Detect-Arch
$ver  = Resolve-Version
$url  = "$BaseUrl/$ver/rahulchaube-windows-$arch.zip"

Log "Installing RahulChaube Runtime $ver for windows/$arch"
if ($DryRun) { Ok "Dry run: would download $url"; exit 0 }

$tmp = Join-Path $env:TEMP ("rahulchaube-" + [guid]::NewGuid())
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
try {
    Log "Downloading $url"
    Invoke-WebRequest -Uri $url -OutFile (Join-Path $tmp "archive.zip")
    $shaUrl = "$url.sha256"
    try { Invoke-WebRequest -Uri $shaUrl -OutFile (Join-Path $tmp "archive.zip.sha256") } catch { Log "No checksum published; skipping verification" }

    if (Test-Path (Join-Path $tmp "archive.zip.sha256")) {
        $expected = (Get-Content (Join-Path $tmp "archive.zip.sha256")).Split(' ')[0]
        $actual   = (Get-FileHash (Join-Path $tmp "archive.zip") -Algorithm SHA256).Hash.ToLower()
        if ($actual -ne $expected) { Err "Checksum verification failed" }
        Ok "Verified checksum"
    }

    New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
    Expand-Archive -Path (Join-Path $tmp "archive.zip") -DestinationPath $InstallDir -Force
    Ok "Installed to $InstallDir"

    $p = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($p -notlike "*$InstallDir*") {
        [Environment]::SetEnvironmentVariable("Path", "$p;$InstallDir", "User")
        Ok "Added to user PATH (restart terminal to apply)"
    }
    Log "Run: rahulchaube --help"
} finally {
    Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
}
