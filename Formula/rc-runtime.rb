class RcRuntime < Formula
  desc "Standalone JavaScript and TypeScript runtime with a bundler and test runner"
  homepage "https://www.rahulchaube.space/"
  version "1.3.0"
  license "MIT"

  on_macos do
    on_arm do
      url "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v#{version}/runtime-darwin-arm64.tar.gz"
      sha256 "d39a898402aae2489a195defbf4388f808b26611a36ddcb31d82764736e29678"
    end
    on_intel do
      url "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v#{version}/runtime-darwin-x64.tar.gz"
      sha256 "6a9649e73b0e8a1c36488d560c38e91794a38cfa4276f2a44eaa2242fbaea398"
    end
  end

  on_linux do
    on_arm do
      url "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v#{version}/runtime-linux-arm64.tar.gz"
      sha256 "639016e2aeaac1a5611b334353fa7b74871cb5efc9dd9826f7153f106cbea527"
    end
    on_intel do
      url "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v#{version}/runtime-linux-x64.tar.gz"
      sha256 "260c231860102ff634d55c6dffa07b5d58f955b11e6f377019ce9f9eb958e168"
    end
  end

  def install
    bin.install "bin/rc"
    pkgshare.install "LICENSE.md", "licenses"
  end

  test do
    (testpath/"hello.ts").write("const value: number = 21; console.log(value * 2);")
    assert_equal "42", shell_output("#{bin}/rc run hello.ts").strip
  end
end
