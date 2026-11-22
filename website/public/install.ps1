$ErrorActionPreference = "Stop"

function Get-RCInstallOptions([string[]]$Options) {
    $result = @{ Version = ""; DryRun = $false }
    for ($i = 0; $i -lt $Options.Count; $i++) {
        switch ($Options[$i]) {
            "--dry-run" { $result.DryRun = $true }
            "--version" {
                if (++$i -ge $Options.Count) { throw "Missing version" }
                $result.Version = $Options[$i] -replace "^v", ""
            }
            default { throw "Unknown installer option: $($Options[$i])" }
        }
    }
    return $result
}

function Get-RCRelease($ArchiveDir, $Filename) {
    if ($ArchiveDir) {
        $version = (Get-Content -LiteralPath (Join-Path $ArchiveDir "VERSION") -Raw).Trim()
        $record = Get-Content -LiteralPath (Join-Path $ArchiveDir "SHA256SUMS") | Where-Object { ($_ -split '\s+')[1] -eq $Filename }
        $digest = ($record -split '\s+')[0]
        $url = $null
    } else {
        $origin = if ($env:RAHULCHAUBE_INSTALL_ORIGIN) { $env:RAHULCHAUBE_INSTALL_ORIGIN } else { "https://www.rahulchaube.space" }
        $client = [Net.WebClient]::new()
        try { $meta = $client.DownloadString("$origin/api/install?platform=win-x64").Trim() }
        finally { $client.Dispose() }
        $version, $digest, $url = $meta -split "\s+"
        if ($url -notlike "https://*") { throw "Invalid release URL" }
    }
    if ($version -notmatch '^\d+\.\d+\.\d+$' -or $digest -notmatch '^[0-9a-f]{64}$') { throw "Invalid release metadata" }
    return @{ Version = $version; Digest = $digest; Url = $url }
}

function Get-RCArchive($Release, $ArchiveDir, $Filename, $File) {
    if ($ArchiveDir) { Copy-Item -LiteralPath (Join-Path $ArchiveDir $Filename) -Destination $File }
    else {
        $client = [Net.WebClient]::new()
        try { $client.DownloadFile($Release.Url, $File) } finally { $client.Dispose() }
    }
    $stream = [IO.File]::OpenRead($File)
    $sha256 = [Security.Cryptography.SHA256]::Create()
    try { $actual = [BitConverter]::ToString($sha256.ComputeHash($stream)).Replace("-", "") }
    finally { $stream.Dispose(); $sha256.Dispose() }
    if ($actual -ne $Release.Digest) { throw "SHA-256 mismatch for $Filename" }
}

function Install-RCArchive($Release, $ArchiveDir, $Filename, $Dest) {
    $stage = Join-Path $Dest (".install-" + [guid]::NewGuid())
    [IO.Directory]::CreateDirectory($stage) | Out-Null
    try {
        $file = Join-Path $stage $Filename
        Get-RCArchive $Release $ArchiveDir $Filename $file
        & (Join-Path $env:SystemRoot "System32/tar.exe") -xf $file -C $stage
        if ($LASTEXITCODE -ne 0) { throw "Archive extraction failed" }
        # Windows locks a running executable. Use a temporary copy while activating bin/rc.exe.
        $helper = Join-Path $stage "setup.exe"
        Copy-Item -LiteralPath (Join-Path $stage "bin/rc.exe") -Destination $helper
        $reported = & $helper --version
        if ($LASTEXITCODE -ne 0 -or $reported -ne "RC Runtime v$($Release.Version)") { throw "Archive version check failed" }
        & $helper __activate $stage $Dest
        if ($LASTEXITCODE -ne 0) { throw "Installation failed" }
    } finally { Remove-Item -LiteralPath $stage -Recurse -Force }
}

function Install-RCRuntime {
    $arch = [Runtime.InteropServices.RuntimeInformation]::OSArchitecture.ToString()
    if ($arch -ne "X64") { throw "RC Runtime for Windows requires x64. Found $arch." }
    $options = Get-RCInstallOptions -Options $args
    $filename = "runtime-win-x64.zip"
    $archiveDir = $env:RAHULCHAUBE_INSTALL_ARCHIVE_DIR
    $release = Get-RCRelease $archiveDir $filename
    if ($options.Version -and $options.Version -ne $release.Version) { throw "This installer provides v$($release.Version)" }
    if ($options.DryRun) { Write-Output "RC Runtime v$($release.Version) is available for win-x64"; return }

    $dest = if ($env:RC_INSTALL_DIR) { $env:RC_INSTALL_DIR } elseif ($env:RAHULCHAUBE_INSTALL_DIR) { $env:RAHULCHAUBE_INSTALL_DIR } else { Join-Path $HOME ".rc-runtime" }
    $dest = [IO.Path]::GetFullPath($dest)
    Install-RCArchive $release $archiveDir $filename $dest
    $bin = Join-Path $dest "bin"
    Write-Output "Installed RC Runtime v$($release.Version) to $bin"
    if (-not $env:RC_INSTALL_DIR -and -not $env:RAHULCHAUBE_INSTALL_DIR -and -not $options.Version) {
        $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
        if (($userPath -split ";") -notcontains $bin) { [Environment]::SetEnvironmentVariable("Path", "$bin;$userPath", "User") }
        if (($env:Path -split ";") -notcontains $bin) { $env:Path = "$bin;$env:Path" }
    }
}
Install-RCRuntime @args
