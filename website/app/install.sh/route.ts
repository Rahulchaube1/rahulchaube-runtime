import { NextResponse } from "next/server";

const INSTALL_SCRIPT = `#!/usr/bin/env bash
# RahulChaube Runtime — Official POSIX Installation Script
# https://rahulchaube.space

set -euo pipefail

BOLD="\\033[1m"
CYAN="\\033[36m"
GREEN="\\033[32m"
RED="\\033[31m"
RESET="\\033[0m"

echo -e "\${CYAN}\${BOLD}"
echo "RahulChaube Runtime Installer"
echo "High-performance JS/TS runtime & developer platform"
echo -e "\${RESET}"

# Detect OS
OS="\$(uname -s | tr '[:upper:]' '[:lower:]')"
case "\$OS" in
  linux*)  PLATFORM="linux" ;;
  darwin*) PLATFORM="darwin" ;;
  *)
    echo -e "\${RED}Error: Unsupported operating system '\$OS'. Supported: Linux, macOS.\${RESET}"
    exit 1
    ;;
esac

# Detect Architecture
ARCH="\$(uname -m)"
case "\$ARCH" in
  x86_64|amd64)  ARCH="x64" ;;
  arm64|aarch64) ARCH="arm64" ;;
  *)
    echo -e "\${RED}Error: Unsupported architecture '\$ARCH'. Supported: x64, arm64.\${RESET}"
    exit 1
    ;;
esac

VERSION="v1.0.0"
INSTALL_DIR="\${HOME}/.rahulchaube"
BIN_DIR="\${INSTALL_DIR}/bin"
CLI_DIR="\${INSTALL_DIR}/packages/rahulchaube-cli"

echo -e "Detected: \${BOLD}\${PLATFORM}-\${ARCH}\${RESET}"
echo -e "Installing version: \${BOLD}\${VERSION}\${RESET}"

mkdir -p "\${BIN_DIR}"
mkdir -p "\${CLI_DIR}"

if [ -d "packages/rahulchaube-cli" ]; then
  cp -r packages/rahulchaube-cli/* "\${CLI_DIR}/" 2>/dev/null || true
fi

cat << 'EOF' > "\${BIN_DIR}/rahulchaube"
#!/usr/bin/env bash
# RahulChaube Runtime Portable CLI Launcher
INSTALL_DIR="\$(cd "\$(dirname "\$0")/.." && pwd)"
CLI_ENTRY="\${INSTALL_DIR}/packages/rahulchaube-cli/bin/rahulchaube.ts"
COMPILED_EXE="\${INSTALL_DIR}/bin/rahulchaube-native"

if [ -x "\${COMPILED_EXE}" ]; then
  exec "\${COMPILED_EXE}" "\$@"
elif command -v bun >/dev/null 2>&1; then
  exec bun run "\${CLI_ENTRY}" "\$@"
elif command -v node >/dev/null 2>&1; then
  exec node --import tsx "\${CLI_ENTRY}" "\$@"
else
  echo "RahulChaube Runtime CLI requires Bun or Node.js to execute script engine."
  exit 1
fi
EOF
chmod +x "\${BIN_DIR}/rahulchaube"

SHELL_NAME="\$(basename "\${SHELL:-bash}")"
PROFILE=""

case "\$SHELL_NAME" in
  zsh)  PROFILE="\${HOME}/.zshrc" ;;
  bash)
    if [ -f "\${HOME}/.bash_profile" ]; then
      PROFILE="\${HOME}/.bash_profile"
    else
      PROFILE="\${HOME}/.bashrc"
    fi
    ;;
  *) PROFILE="\${HOME}/.profile" ;;
esac

EXPORT_CMD="export PATH=\\"\${BIN_DIR}:\\$PATH\\""

if [ -n "\${PROFILE}" ] && [ -f "\${PROFILE}" ]; then
  if ! grep -q "\${BIN_DIR}" "\${PROFILE}"; then
    echo "" >> "\${PROFILE}"
    echo "# RahulChaube Runtime" >> "\${PROFILE}"
    echo "\${EXPORT_CMD}" >> "\${PROFILE}"
    echo -e "\${GREEN}Added RahulChaube Runtime to \${PROFILE}\${RESET}"
  fi
fi

echo ""
echo -e "\${GREEN}\${BOLD}[OK] RahulChaube Runtime installed successfully!\${RESET}"
echo -e "  \${BOLD}export PATH=\"\${BIN_DIR}:\$PATH\"\${RESET}"
echo -e "  \${BOLD}rahulchaube --help\${RESET}"
`;

export function GET() {
  return new NextResponse(INSTALL_SCRIPT, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
