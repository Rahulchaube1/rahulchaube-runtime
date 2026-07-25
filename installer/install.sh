#!/usr/bin/env bash
#
# RahulChaube Runtime — POSIX installer (Linux / macOS)
#
# Detects OS + CPU, downloads the latest release, verifies its checksum,
# installs it, and adds it to PATH.
#
# Usage:
#   curl -fsSL https://rahulchaube.space/install | bash
#   ./install.sh [--version 1.0.0] [--dry-run]

set -euo pipefail

REPO="${RAHULCHAUBE_REPO:-rahulchaube/rahulchaube-runtime}"
BASE_URL="${RAHULCHAUBE_INSTALL_BASE:-https://github.com/${REPO}/releases/download}"
INSTALL_DIR="${RAHULCHAUBE_INSTALL_DIR:-$HOME/.rahulchaube/bin}"
VERSION=""
DRY_RUN=0

log()  { printf '\033[35m◆\033[0m %s\n' "$*"; }
ok()   { printf '\033[32m✔\033[0m %s\n' "$*"; }
err()  { printf '\033[31m✖\033[0m %s\n' "$*" >&2; }
die()  { err "$*"; exit 1; }

while [ $# -gt 0 ]; do
  case "$1" in
    --version) VERSION="$2"; shift 2 ;;
    --dry-run) DRY_RUN=1; shift ;;
    --upgrade) UPGRADE=1; shift ;;
    --uninstall) UNINSTALL=1; shift ;;
    *) die "Unknown argument: $1" ;;
  esac
done

if [ "${UNINSTALL:-0}" -eq 1 ]; then
  log "Uninstalling RahulChaube Runtime..."
  rm -rf "$INSTALL_DIR"
  ok "Removed $INSTALL_DIR"
  exit 0
fi

detect_os() {
  local os
  os="$(uname -s)"
  case "$os" in
    Linux)  echo "linux" ;;
    Darwin) echo "macos" ;;
    *) die "Unsupported OS: $os" ;;
  esac
}

detect_arch() {
  local arch
  arch="$(uname -m)"
  case "$arch" in
    x86_64|amd64) echo "x64" ;;
    arm64|aarch64) echo "arm64" ;;
    *) die "Unsupported architecture: $arch" ;;
  esac
}

resolve_version() {
  [ -n "$VERSION" ] && { echo "$VERSION"; return; }
  curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" \
    | grep -m1 '"tag_name"' | sed -E 's/.*"tag_name": *"([^"]+)".*/\1/'
}

main() {
  command -v curl >/dev/null 2>&1 || die "curl is required"
  command -v sha256sum >/dev/null 2>&1 || command -v shasum >/dev/null 2>&1 || die "sha256sum/shasum required"

  local os arch ver ext url tmp
  os="$(detect_os)"
  arch="$(detect_arch)"
  ver="$(resolve_version)"
  [ -n "$ver" ] || die "Could not resolve version"
  ext="tar.gz"
  url="${BASE_URL}/${ver}/rahulchaube-${os}-${arch}.${ext}"

  log "Installing RahulChaube Runtime ${ver} for ${os}/${arch}"
  [ "$DRY_RUN" -eq 1 ] && { ok "Dry run: would download $url"; exit 0; }

  tmp="$(mktemp -d)"
  trap 'rm -rf "$tmp"' EXIT

  log "Downloading ${url}"
  curl -fsSL "$url" -o "$tmp/archive.${ext}" || die "Download failed"
  curl -fsSL "${url}.sha256" -o "$tmp/archive.${ext}.sha256" || log "No checksum published; skipping verification"

  if [ -f "$tmp/archive.${ext}.sha256" ]; then
    ( cd "$tmp" && (sha256sum -c "archive.${ext}.sha256" 2>/dev/null || shasum -a 256 -c "archive.${ext}.sha256") ) \
      || die "Checksum verification failed"
    ok "Verified checksum"
  fi

  mkdir -p "$INSTALL_DIR"
  tar -xzf "$tmp/archive.${ext}" -C "$INSTALL_DIR" || die "Extraction failed"
  chmod +x "$INSTALL_DIR/rahulchaube" 2>/dev/null || true

  # Ensure on PATH for common shells.
  case ":$PATH:" in
    *":$INSTALL_DIR:"*) ;;
    *) printf '\nexport PATH="%s:$PATH"\n' "$INSTALL_DIR" >> "$HOME/.$(basename "$SHELL")rc" 2>/dev/null || true ;;
  esac

  ok "Installed to $INSTALL_DIR/rahulchaube"
  log "Run: rahulchaube --help"
}

main "$@"
