#!/usr/bin/env bash
# RahulChaube Runtime — Official POSIX Installer (Linux / macOS)

set -euo pipefail

REPO="${RAHULCHAUBE_REPO:-Rahulchaube1/rahulchaube-runtime}"
INSTALL_DIR="${RAHULCHAUBE_INSTALL_DIR:-$HOME/.rahulchaube}"
BIN_DIR="${INSTALL_DIR}/bin"
CLI_DIR="${INSTALL_DIR}/packages/rahulchaube-cli"
VERSION="v1.0.0"
DRY_RUN=0

log()  { printf '\033[36m[rahulchaube]\033[0m %s\n' "$*"; }
ok()   { printf '\033[32m[OK]\033[0m %s\n' "$*"; }
err()  { printf '\033[31m[ERR]\033[0m %s\n' "$*" >&2; }
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
  case "$(uname -s)" in
    Linux)  echo "linux" ;;
    Darwin) echo "darwin" ;;
    *) die "Unsupported OS" ;;
  esac
}

detect_arch() {
  case "$(uname -m)" in
    x86_64|amd64) echo "x64" ;;
    arm64|aarch64) echo "arm64" ;;
    *) echo "x64" ;;
  esac
}

main() {
  local os arch
  os="$(detect_os)"
  arch="$(detect_arch)"
  log "Installing RahulChaube Runtime ${VERSION} for ${os}/${arch}..."

  if [ "$DRY_RUN" -eq 1 ]; then
    ok "Dry run: would install to $INSTALL_DIR"
    exit 0
  fi

  mkdir -p "$BIN_DIR"
  mkdir -p "$CLI_DIR"

  if [ -d "packages/rahulchaube-cli" ]; then
    cp -r packages/rahulchaube-cli/* "$CLI_DIR/" 2>/dev/null || true
  else
    RELEASE_URL="https://raw.githubusercontent.com/${REPO}/main/packages/rahulchaube-cli"
    mkdir -p "${CLI_DIR}/bin" "${CLI_DIR}/src"
    curl -fsSL "${RELEASE_URL}/package.json" -o "${CLI_DIR}/package.json" 2>/dev/null || true
    curl -fsSL "${RELEASE_URL}/bin/rahulchaube.ts" -o "${CLI_DIR}/bin/rahulchaube.ts" 2>/dev/null || true
    curl -fsSL "${RELEASE_URL}/src/index.ts" -o "${CLI_DIR}/src/index.ts" 2>/dev/null || true
  fi

  cat << 'EOF' > "${BIN_DIR}/rahulchaube"
#!/usr/bin/env bash
# RahulChaube Runtime Portable CLI Launcher
INSTALL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CLI_ENTRY="${INSTALL_DIR}/packages/rahulchaube-cli/bin/rahulchaube.ts"
COMPILED_EXE="${INSTALL_DIR}/bin/rahulchaube-native"

if [ -x "${COMPILED_EXE}" ]; then
  exec "${COMPILED_EXE}" "$@"
elif command -v bun >/dev/null 2>&1; then
  exec bun run "${CLI_ENTRY}" "$@"
elif command -v node >/dev/null 2>&1; then
  exec node --import tsx "${CLI_ENTRY}" "$@"
else
  echo "RahulChaube Runtime CLI requires Bun or Node.js to execute script engine."
  exit 1
fi
EOF
  chmod +x "${BIN_DIR}/rahulchaube"

  SHELL_NAME="$(basename "${SHELL:-bash}")"
  PROFILE=""
  case "$SHELL_NAME" in
    zsh)  PROFILE="${HOME}/.zshrc" ;;
    bash) PROFILE="${HOME}/.bashrc" ;;
    *)    PROFILE="${HOME}/.profile" ;;
  esac

  if [ -n "${PROFILE}" ] && [ -f "${PROFILE}" ]; then
    if ! grep -q "${BIN_DIR}" "${PROFILE}"; then
      echo "" >> "${PROFILE}"
      echo 'export PATH="'"${BIN_DIR}"':$PATH"' >> "${PROFILE}"
      ok "Added ${BIN_DIR} to ${PROFILE}"
    fi
  fi

  ok "Installed to ${INSTALL_DIR}"
  log "Run: rahulchaube --help"
}

main "$@"
