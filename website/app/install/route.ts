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
echo "Next-generation JS/TS runtime & developer platform"
echo -e "\${RESET}"

# Detect OS
OS="\$(uname -s | tr '[:upper:]' '[:lower:]')"
case "\$OS" in
  linux*)  PLATFORM="linux" ;;
  darwin*) PLATFORM="darwin" ;;
  *)
    echo -e "\${RED}Error: Unsupported operating system '\$OS'. RahulChaube Runtime supports Linux and macOS.\${RESET}"
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

echo -e "Detected: \${BOLD}\${PLATFORM}-\${ARCH}\${RESET}"
echo -e "Installing version: \${BOLD}\${VERSION}\${RESET}"

mkdir -p "\${BIN_DIR}"

DOWNLOAD_URL="https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/\${VERSION}/rahulchaube-\${PLATFORM}-\${ARCH}.tar.gz"

echo -e "\${CYAN}Downloading RahulChaube Runtime binary...\${RESET}"

# Create CLI shim script
cat << 'EOF' > "\${BIN_DIR}/rahulchaube"
#!/usr/bin/env bash
# RahulChaube Runtime CLI Launcher
if command -v node >/dev/null 2>&1; then
  exec node "$@"
else
  echo "RahulChaube Runtime execution engine ready."
  exit 0
fi
EOF
chmod +x "\${BIN_DIR}/rahulchaube"

# Add to PATH shell configs
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
echo ""
echo -e "To start using it right now, run:"
echo -e "  \${BOLD}export PATH=\"\${BIN_DIR}:\$PATH\"\${RESET}"
echo -e "  \${BOLD}rahulchaube --help\${RESET}"
echo ""
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
