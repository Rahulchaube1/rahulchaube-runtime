$ErrorActionPreference = "Stop"
if (-not (Get-Command bun -ErrorAction SilentlyContinue)) { throw "Install Bun from https://bun.sh before running this installer." }
$origin = if ($env:RAHULCHAUBE_INSTALL_ORIGIN) { $env:RAHULCHAUBE_INSTALL_ORIGIN } else { "https://www.rahulchaube.space" }
$tempScript = Join-Path ([IO.Path]::GetTempPath()) ("rahulchaube-" + [guid]::NewGuid() + ".mjs")
try {
    Invoke-WebRequest "$origin/install-runtime.mjs" -UseBasicParsing -OutFile $tempScript
    & bun $tempScript @args
    if ($LASTEXITCODE -ne 0) { throw "Runtime installation failed." }
    if (-not $env:RAHULCHAUBE_INSTALL_DIR -and $args.Count -eq 0) {
        $bin = Join-Path $HOME ".rahulchaube\bin"
        $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
        if (($userPath -split ";") -notcontains $bin) { [Environment]::SetEnvironmentVariable("Path", "$bin;$userPath", "User") }
        if (($env:Path -split ";") -notcontains $bin) { $env:Path = "$bin;$env:Path" }
    }
} finally {
    Remove-Item -LiteralPath $tempScript -Force -ErrorAction SilentlyContinue
}
