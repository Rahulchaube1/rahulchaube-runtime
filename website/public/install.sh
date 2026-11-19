#!/usr/bin/env bash
set -euo pipefail
command -v bun >/dev/null || { echo "Install Bun from https://bun.sh before running this installer." >&2; exit 1; }
origin="${RAHULCHAUBE_INSTALL_ORIGIN:-https://www.rahulchaube.space}"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
curl -fsSL "$origin/install-runtime.mjs" -o "$tmp/install-runtime.mjs"
bun "$tmp/install-runtime.mjs" "$@"
if [ -z "${RAHULCHAUBE_INSTALL_DIR:-}" ] && [ "$#" -eq 0 ]; then
  shell_name="${SHELL:-sh}"
  case "${shell_name##*/}" in
    zsh) profile="$HOME/.zshrc" ;;
    bash) profile="$HOME/.bashrc"; if [ -f "$HOME/.bash_profile" ]; then profile="$HOME/.bash_profile"; fi ;;
    *) profile="$HOME/.profile" ;;
  esac
  line='export PATH="$HOME/.rahulchaube/bin:$PATH"'
  if ! grep -Fqx "$line" "$profile" 2>/dev/null; then printf '\n%s\n' "$line" >> "$profile"; fi
  printf 'Open a new shell or run: %s\n' "$line"
fi
