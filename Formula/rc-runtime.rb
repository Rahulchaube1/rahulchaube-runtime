class RcRuntime < Formula
  desc "Standalone JavaScript and TypeScript runtime with a bundler and test runner"
  homepage "https://www.rahulchaube.space/"
  version "1.4.0"
  license "MIT"

  on_macos do
    on_arm do
      url "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v#{version}/runtime-darwin-arm64.tar.gz"
      sha256 "12ce3356af856f60fe99795aeaa68c89219fa5f085e040c47ab1c43ac86394e6"
    end
    on_intel do
      url "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v#{version}/runtime-darwin-x64.tar.gz"
      sha256 "a58c6d49bb0eb637390eda2d327c5edd4f29e2aeb9f7ea45327dbddd09f94514"
    end
  end

  on_linux do
    on_arm do
      url "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v#{version}/runtime-linux-arm64.tar.gz"
      sha256 "8d8f39c73ee9bd8f8c8ef12ffa95f972eadb8df094b3603ec2746f0454ac71c3"
    end
    on_intel do
      url "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v#{version}/runtime-linux-x64.tar.gz"
      sha256 "6d939cded6bdb45c43b4b600523e021249f5a36c8223090fec61bb305340fb71"
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
