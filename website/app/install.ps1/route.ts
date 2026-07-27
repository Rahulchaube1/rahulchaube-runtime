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

$RepoRuntimeDir = Join-Path $PWD "runtime"
if (Test-Path $RepoRuntimeDir) {
    Write-Host "[OK] Deploying self-contained runtime engine..." -ForegroundColor Gray
    Copy-Item -Path "$RepoRuntimeDir/*" -Destination $RuntimeDir -Recurse -Force
}

$RepoPackages = Join-Path $PWD "packages"
$RepoCliDir = Join-Path $RepoPackages "rahulchaube-cli"
if (Test-Path $RepoCliDir) {
    Write-Host "[OK] Deploying local CLI package..." -ForegroundColor Gray
    Copy-Item -Path "$RepoCliDir/*" -Destination $CliDir -Recurse -Force
} else {
    Write-Host "[OK] Downloading RahulChaube Runtime release bundle..." -ForegroundColor Gray
    $BaseUrl = "https://raw.githubusercontent.com/Rahulchaube1/rahulchaube-runtime/main"
    
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
