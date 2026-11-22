$ErrorActionPreference = "Stop"
function Install-RCRuntime {
    $arch = [Runtime.InteropServices.RuntimeInformation]::OSArchitecture.ToString()
    if ($arch -ne "X64") { throw "RC Runtime for Windows requires x64. Found $arch." }
    $filename = "runtime-win-x64.zip"
    $requested = ""
    $dryRun = $false
    for ($i = 0; $i -lt $args.Count; $i++) {
        switch ($args[$i]) {
            "--dry-run" { $dryRun = $true }
            "--version" {
                if (++$i -ge $args.Count) { throw "Missing version" }
                $requested = $args[$i] -replace "^v", ""
            }
            default { throw "Unknown installer option: $($args[$i])" }
        }
    }
    if ($env:RAHULCHAUBE_INSTALL_ARCHIVE_DIR) {
        $archiveDir = $env:RAHULCHAUBE_INSTALL_ARCHIVE_DIR
        $version = (Get-Content -LiteralPath (Join-Path $archiveDir "VERSION") -Raw).Trim()
        $record = Get-Content -LiteralPath (Join-Path $archiveDir "SHA256SUMS") | Where-Object { ($_ -split '\s+')[1] -eq $filename }
        $digest = ($record -split '\s+')[0]
    } else {
        $origin = if ($env:RAHULCHAUBE_INSTALL_ORIGIN) { $env:RAHULCHAUBE_INSTALL_ORIGIN } else { "https://www.rahulchaube.space" }
        $meta = (Invoke-WebRequest "$origin/api/install?platform=win-x64" -UseBasicParsing).Content.Trim()
        $version, $digest, $url = $meta -split "\s+"
        if ($url -notlike "https://*") { throw "Invalid release URL" }
    }
    if ($version -notmatch '^\d+\.\d+\.\d+$' -or $digest -notmatch '^[0-9a-f]{64}$') { throw "Invalid release metadata" }
    if ($requested -and $requested -ne $version) { throw "This installer provides v$version" }
    if ($dryRun) { Write-Output "RC Runtime v$version is available for win-x64"; return }
    $dest = if ($env:RC_INSTALL_DIR) { $env:RC_INSTALL_DIR } elseif ($env:RAHULCHAUBE_INSTALL_DIR) { $env:RAHULCHAUBE_INSTALL_DIR } else { Join-Path $HOME ".rc-runtime" }
    $dest = [IO.Path]::GetFullPath($dest)
    $stage = Join-Path $dest (".install-" + [guid]::NewGuid())
    [IO.Directory]::CreateDirectory($stage) | Out-Null
    try {
        $file = Join-Path $stage $filename
        if ($archiveDir) { Copy-Item -LiteralPath (Join-Path $archiveDir $filename) -Destination $file }
        else { Invoke-WebRequest $url -UseBasicParsing -OutFile $file }
        if ((Get-FileHash -LiteralPath $file -Algorithm SHA256).Hash -ne $digest) { throw "SHA-256 mismatch for $filename" }
        # bsdtar handles the POSIX archive entries on supported Windows versions.
        & (Join-Path $env:SystemRoot "System32/tar.exe") -xf $file -C $stage
        if ($LASTEXITCODE -ne 0) { throw "Archive extraction failed" }
        # Windows locks a running executable. Use a temporary copy while activating bin/rc.exe.
        $helper = Join-Path $stage "setup.exe"
        Copy-Item -LiteralPath (Join-Path $stage "bin/rc.exe") -Destination $helper
        $reported = & $helper --version
        if ($LASTEXITCODE -ne 0 -or $reported -ne "RC Runtime v$version") { throw "Archive version check failed" }
        & $helper __activate $stage $dest
        if ($LASTEXITCODE -ne 0) { throw "Installation failed" }
    } finally { Remove-Item -LiteralPath $stage -Recurse -Force }
    $bin = Join-Path $dest "bin"
    Write-Output "Installed RC Runtime v$version to $bin"
    if (-not $env:RC_INSTALL_DIR -and -not $env:RAHULCHAUBE_INSTALL_DIR -and -not $requested) {
        $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
        if (($userPath -split ";") -notcontains $bin) { [Environment]::SetEnvironmentVariable("Path", "$bin;$userPath", "User") }
        if (($env:Path -split ";") -notcontains $bin) { $env:Path = "$bin;$env:Path" }
    }
}
Install-RCRuntime @args
