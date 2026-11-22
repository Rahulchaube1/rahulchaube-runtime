#!/usr/bin/env bash
set -euo pipefail

install_rc() {
  local platform arch target filename origin metadata version digest url requested="" dry=0
  local dest stage actual installed profile shell_name line local_archive
  case "$(uname -s)" in Linux) platform=linux ;; Darwin) platform=darwin ;; *) echo "Unsupported operating system" >&2; return 1 ;; esac
  case "$(uname -m)" in x86_64|amd64) arch=x64 ;; arm64|aarch64) arch=arm64 ;; *) echo "Unsupported processor" >&2; return 1 ;; esac
  target="$platform-$arch"
  filename="runtime-$target.tar.gz"
  origin="${RAHULCHAUBE_INSTALL_ORIGIN:-https://www.rahulchaube.space}"
  local_archive="${RAHULCHAUBE_INSTALL_ARCHIVE_DIR:-}"
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --version) [[ $# -gt 1 ]] || { echo "Missing version" >&2; return 1; }; requested="${2#v}"; shift 2 ;;
      --dry-run) dry=1; shift ;;
      *) echo "Unknown installer option: $1" >&2; return 1 ;;
    esac
  done
  if [[ -n "$local_archive" ]]; then
    version="$(cat "$local_archive/VERSION")"
    digest="$(awk -v f="$filename" '$2 == f {print $1}' "$local_archive/SHA256SUMS")"
  else
    metadata="$(curl -fsSL --retry 2 "$origin/api/install?platform=$target")"
    IFS=$'\t' read -r version digest url <<< "$metadata"
    [[ "$url" == https://* ]] || { echo "Invalid release URL" >&2; return 1; }
  fi
  [[ "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ && "$digest" =~ ^[0-9a-f]{64}$ ]] || { echo "Invalid release metadata" >&2; return 1; }
  [[ -z "$requested" || "$requested" == "$version" ]] || { echo "This installer provides v$version" >&2; return 1; }
  if [[ "$dry" == 1 ]]; then echo "RC Runtime v$version is available for $target"; return; fi

  dest="${RC_INSTALL_DIR:-${RAHULCHAUBE_INSTALL_DIR:-$HOME/.rc-runtime}}"
  mkdir -p "$dest"
  dest="$(cd "$dest" && pwd)"
  stage="$(mktemp -d "$dest/.install-XXXXXX")"
  # Keep cleanup scoped to this installation, including on interrupted downloads.
  (
    trap 'rm -rf "$stage"' EXIT
    if [[ -n "$local_archive" ]]; then cp "$local_archive/$filename" "$stage/archive"; else curl -fsSL --retry 2 "$url" -o "$stage/archive"; fi
    if command -v sha256sum >/dev/null; then actual="$(sha256sum < "$stage/archive")"; else actual="$(shasum -a 256 < "$stage/archive")"; fi
    [[ "${actual%% *}" == "$digest" ]] || { echo "SHA-256 mismatch for $filename" >&2; exit 1; }
    tar -xzf "$stage/archive" -C "$stage"
    installed="$("$stage/bin/rc" --version)"
    [[ "$installed" == "RC Runtime v$version" ]] || { echo "Archive version check failed" >&2; exit 1; }
    "$stage/bin/rc" __activate "$stage" "$dest"
  )
  echo "Installed RC Runtime v$version to $dest/bin"
  if [[ -z "${RC_INSTALL_DIR:-${RAHULCHAUBE_INSTALL_DIR:-}}" && -z "$requested" ]]; then
    shell_name="${SHELL:-sh}"
    case "${shell_name##*/}" in
      zsh) profile="$HOME/.zshrc" ;;
      bash) profile="$HOME/.bashrc"; if [[ -f "$HOME/.bash_profile" ]]; then profile="$HOME/.bash_profile"; fi ;;
      *) profile="$HOME/.profile" ;;
    esac
    line='export PATH="$HOME/.rc-runtime/bin:$PATH"'
    if ! grep -Fqx "$line" "$profile" 2>/dev/null; then printf '\n%s\n' "$line" >> "$profile"; fi
    printf 'Open a new terminal or run %s\n' "$line"
  fi
}
install_rc "$@"
