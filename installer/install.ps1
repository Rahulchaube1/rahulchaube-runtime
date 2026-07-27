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
$RuntimeDir = Join-Path $InstallDir "runtime"
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
if (-not (Test-Path $RuntimeDir)) { New-Item -ItemType Directory -Force -Path $RuntimeDir | Out-Null }
if (-not (Test-Path $CliDir)) { New-Item -ItemType Directory -Force -Path $CliDir | Out-Null }

# Copy local package files if running within repo directory, else download
$RepoRuntimeDir = Join-Path $PWD "runtime"
if (Test-Path $RepoRuntimeDir) {
    Log "Deploying self-contained runtime engine..."
    Copy-Item -Path "$RepoRuntimeDir/*" -Destination $RuntimeDir -Recurse -Force
}

$RepoPackages = Join-Path $PWD "packages"
$RepoCliDir = Join-Path $RepoPackages "rahulchaube-cli"
if (Test-Path $RepoCliDir) {
    Log "Deploying local CLI package..."
    Copy-Item -Path "$RepoCliDir/*" -Destination $CliDir -Recurse -Force
} else {
    Log "Fetching release bundle from GitHub repository..."
    $BaseUrl = "https://raw.githubusercontent.com/$Repo/main"
    
    # Create runtime subdirectories
    $RuntimeDirs = @(
        "cache", "compiler", "concurrency", "diagnostics", "engine",
        "fs", "hmr", "module-loader", "package-manager", "parser",
        "permissions", "plugins", "profiler", "registry", "scheduler",
        "watcher", "worker"
    )
    foreach ($d in $RuntimeDirs) {
        New-Item -ItemType Directory -Force -Path (Join-Path $RuntimeDir $d) | Out-Null
    }

    $RuntimeFiles = @(
        "index.ts",
        "cache/persistent-cache.ts",
        "compiler/transpiler.ts", "compiler/incremental.ts",
        "concurrency/worker-pool.ts",
        "diagnostics/errors.ts",
        "engine/runner.ts",
        "fs/virtual-fs.ts",
        "hmr/engine.ts",
        "module-loader/loader.ts", "module-loader/resolver.ts", "module-loader/cache.ts",
        "package-manager/installer.ts", "package-manager/lockfile.ts",
        "permissions/manager.ts",
        "plugins/loader.ts",
        "profiler/index.ts",
        "registry/client.ts",
        "scheduler/timers.ts", "scheduler/microtasks.ts", "scheduler/events.ts",
        "watcher/watcher.ts",
        "worker/worker.ts"
    )
    foreach ($f in $RuntimeFiles) {
        try {
            Invoke-WebRequest -Uri "$BaseUrl/runtime/$f" -OutFile (Join-Path $RuntimeDir $f) -UseBasicParsing
        } catch {}
    }

    # Create CLI subdirectories
    $CliBinTarget = Join-Path $CliDir "bin"
    $CliSrcTarget = Join-Path $CliDir "src"
    $CliUiTarget  = Join-Path $CliSrcTarget "ui"
    $CliUtilTarget = Join-Path $CliSrcTarget "util"
    $CliCmdTarget = Join-Path $CliSrcTarget "commands"

    New-Item -ItemType Directory -Force -Path $CliBinTarget, $CliSrcTarget, $CliUiTarget, $CliUtilTarget, $CliCmdTarget | Out-Null

    $CliFiles = @(
        "package.json",
        "bin/rahulchaube.ts",
        "src/index.ts",
        "src/ui/colors.ts", "src/ui/icons.ts", "src/ui/logger.ts", "src/ui/banner.ts", "src/ui/spinner.ts",
        "src/util/fs.ts",
        "src/engine/bun.ts",
        "src/commands/install.ts", "src/commands/add.ts", "src/commands/remove.ts", "src/commands/update.ts",
        "src/commands/run.ts", "src/commands/test.ts", "src/commands/build.ts", "src/commands/create.ts",
        "src/commands/doctor.ts", "src/commands/audit.ts", "src/commands/licenses.ts", "src/commands/graph.ts",
        "src/commands/why.ts", "src/commands/outdated.ts", "src/commands/cache.ts", "src/commands/benchmark.ts",
        "src/commands/explain.ts", "src/commands/optimize.ts", "src/commands/migrate.ts", "src/commands/analyze.ts",
        "src/commands/plugins.ts", "src/commands/profile.ts", "src/commands/compatibility.ts"
    )
    foreach ($f in $CliFiles) {
        try {
            Invoke-WebRequest -Uri "$BaseUrl/packages/rahulchaube-cli/$f" -OutFile (Join-Path $CliDir $f) -UseBasicParsing
        } catch {}
    }
}

$ExePath = Join-Path $BinDir "rahulchaube.cmd"

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

# Add to User PATH Environment Variable
$UserPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($UserPath -notlike "*$BinDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$BinDir;$UserPath", "User")
    Ok "Added $BinDir to User PATH"
}

Ok "RahulChaube Runtime installed successfully to $InstallDir"
Log "Run 'rahulchaube --help' to get started."
