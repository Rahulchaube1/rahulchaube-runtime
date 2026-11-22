"""Rebuild the optional language-service assets embedded in the RC executable."""
import base64
import gzip
import hashlib
import io
from pathlib import Path
import tarfile
from urllib.request import urlopen
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

VERSION = "5.9.3"
INTEGRITY = "jl1vZzPDinLr9eUt3J/t7V6FgNEw9QjvBPdysz9KfQDD41fQrC2Y4vKQdiaUpFT4bXlb1RHhLpp8wtm6M5TgSw=="
ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "native" / "tooling"

def main():
    with urlopen(f"https://registry.npmjs.org/typescript/-/typescript-{VERSION}.tgz", timeout=40) as response:
        archive = response.read()
    if hashlib.sha512(archive).digest() != base64.b64decode(INTEGRITY):
        raise ValueError("TypeScript package integrity check failed")
    with tarfile.open(fileobj=io.BytesIO(archive), mode="r:gz") as package:
        def read(name):
            return package.extractfile("package/" + name).read()
        with (DEST / "typescript.js.gz").open("wb") as output, gzip.GzipFile(filename="", fileobj=output, mode="wb", mtime=0) as compressed:
            compressed.write(read("lib/typescript.js"))
        with ZipFile(DEST / "libraries.zip", "w") as libs:
            for member in sorted(package.getnames()):
                name = Path(member).name
                if member == "package/lib/" + name and name.startswith("lib.") and name.endswith(".d.ts"):
                    libs.writestr(ZipInfo(name), read("lib/" + name), compress_type=ZIP_DEFLATED)
        (ROOT / "licenses/TypeScript.txt").write_bytes(read("LICENSE.txt"))
        (ROOT / "licenses/TypeScript-notices.txt").write_bytes(read("ThirdPartyNoticeText.txt"))

if __name__ == "__main__":
    main()
