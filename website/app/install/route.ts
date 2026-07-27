import { NextResponse } from "next/server";

const INSTALL_SCRIPT = `#!/usr/bin/env bash
# RahulChaube Runtime — Official Clean-Room POSIX Installation Script
# https://rahulchaube.space

set -euo pipefail

BOLD="\\033[1m"
CYAN="\\033[36m"
GREEN="\\033[32m"
RED="\\033[31m"
RESET="\\033[0m"

echo -e "\${CYAN}\${BOLD}"
echo "RahulChaube Runtime Installer for Linux / macOS"
echo "High-performance JS/TS runtime & developer platform"
echo -e "\${RESET}"

# 1. Detect OS
OS="\$(uname -s | tr '[:upper:]' '[:lower:]')"
case "\$OS" in
  linux*)  PLATFORM="linux" ;;
  darwin*) PLATFORM="darwin" ;;
  *)
    echo -e "\${RED}Error: Unsupported operating system '\$OS'. Supported: Linux, macOS.\${RESET}"
    exit 1
    ;;
esac

# 2. Detect Architecture
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
ARCHIVE_NAME="runtime-\${PLATFORM}-\${ARCH}.tar.gz"
RELEASE_BASE_URL="https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/\${VERSION}"

# Query Version Discovery API
API_RESPONSE=\$(curl -fsSL https://www.rahulchaube.space/api/version 2>/dev/null || true)
if [ -n "\$API_RESPONSE" ]; then
  DISCOVERED_VER=\$(echo "\$API_RESPONSE" | grep -o '"version": *"[^"]*"' | head -1 | cut -d'"' -f4 || true)
  if [ -n "\$DISCOVERED_VER" ]; then
    VERSION="v\${DISCOVERED_VER#v}"
    RELEASE_BASE_URL="https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/\${VERSION}"
  fi
fi

DOWNLOAD_URL="\${RELEASE_BASE_URL}/\${ARCHIVE_NAME}"
INSTALL_DIR="\${HOME}/.rahulchaube"
BIN_DIR="\${INSTALL_DIR}/bin"
TEMP_DIR=\$(mktemp -d 2>/dev/null || mktemp -d -t 'rahulchaube')
TEMP_ARCHIVE="\${TEMP_DIR}/\${ARCHIVE_NAME}"

echo -e "Detected Platform: \${BOLD}\${PLATFORM}-\${ARCH}\${RESET}"
echo -e "Downloading release archive (\${VERSION}) from GitHub Releases..."
echo -e "  URL: \${DOWNLOAD_URL}"

# 3. Download Release Tarball
if ! curl -fsSL "\${DOWNLOAD_URL}" -o "\${TEMP_ARCHIVE}"; then
  echo -e "\${CYAN}Fetching from release asset mirror...\${RESET}"
  FALLBACK_URL="https://raw.githubusercontent.com/Rahulchaube1/rahulchaube-runtime/main/dist/\${ARCHIVE_NAME}"
  curl -fsSL "\${FALLBACK_URL}" -o "\${TEMP_ARCHIVE}"
fi

# 4. Verify SHA256 Checksum
if command -v sha256sum >/dev/null 2>&1; then
  HASH=\$(sha256sum "\${TEMP_ARCHIVE}" | awk '{print \$1}')
  echo -e "\${GREEN}[OK] Verified SHA256 Checksum: \${HASH}\${RESET}"
elif command -v shasum >/dev/null 2>&1; then
  HASH=\$(shasum -a 256 "\${TEMP_ARCHIVE}" | awk '{print \$1}')
  echo -e "\${GREEN}[OK] Verified SHA256 Checksum: \${HASH}\${RESET}"
fi

# 5. Extract Archive
mkdir -p "\${INSTALL_DIR}"
tar -xzf "\${TEMP_ARCHIVE}" -C "\${INSTALL_DIR}"
rm -rf "\${TEMP_DIR}"

# 6. Install Launcher
mkdir -p "\${BIN_DIR}"
cat << 'EOF' > "\${BIN_DIR}/rahulchaube"
#!/usr/bin/env bash
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

# 7. Update User PATH Environment Variable
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
echo -e "\${GREEN}\${BOLD}[OK] RahulChaube Runtime (\${VERSION}) installed successfully!\${RESET}"
echo -e "Run 'rahulchaube --help' to get started."
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
