"""Export website icons from Rahul Chaube's original logo, preserving its aspect ratio."""

from base64 import b64encode
from pathlib import Path
from shutil import copyfile

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BRANDING = ROOT / "branding"
PUBLIC = ROOT / "website" / "public"
BACKDROP = "#071a16"


def export_icon(mark, width, height):
    # The reference leaves about a tenth of the canvas at either side.
    art_width = round(width * 155 / 187)
    art_height = round(art_width * mark.height / mark.width)
    artwork = mark.resize((art_width, art_height), Image.Resampling.LANCZOS)
    badge = Image.new("RGB", (width, height), BACKDROP)
    position = ((width - art_width) // 2, (height - art_height) // 2)
    if width != height:
        position = (round(width * 19 / 187), round(height * 13 / 162))
    badge.paste(artwork, position, artwork)
    return badge


def svg_image(asset, media_type, width, height):
    data = b64encode(asset.read_bytes()).decode("ascii")
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
        f'viewBox="0 0 {width} {height}" role="img" aria-label="RC Runtime">\n'
        f'  <image width="{width}" height="{height}" href="data:{media_type};base64,{data}"/>\n'
        '</svg>\n'
    )


def export_assets():
    with Image.open(BRANDING / "logo.png") as original:
        mark = original.convert("RGBA")
    mark = mark.crop(mark.getchannel("A").getbbox())
    export_icon(mark, 187, 162).save(PUBLIC / "rc-logo.png", optimize=True)
    for size in (16, 32, 64, 128, 180, 192, 256, 512, 1024):
        icon = export_icon(mark, size, size)
        name = f"icon-{size}.png" if size != 180 else "apple-touch-icon.png"
        path = PUBLIC / name
        icon.save(path, optimize=True)
        if size in (32, 180, 192, 512):
            copyfile(path, PUBLIC / f"rc-mark-{size}.png")
        if size in (16, 32):
            copyfile(path, PUBLIC / f"favicon-{size}x{size}.png")
    for destination in (BRANDING, PUBLIC):
        copyfile(PUBLIC / "icon-192.png", destination / "logo-icon.png")
        (destination / "favicon.svg").write_text(
            svg_image(PUBLIC / "icon-128.png", "image/png", 64, 64), encoding="utf-8"
        )
    export_icon(mark, 64, 64).save(
        PUBLIC / "favicon.ico", sizes=[(size, size) for size in (16, 32, 48, 64)]
    )
    # The current sharing card is the source for older published preview URLs.
    with Image.open(PUBLIC / "rc-social.jpg") as card:
        card.convert("RGB").save(PUBLIC / "social-card.png", optimize=True)
    copyfile(PUBLIC / "social-card.png", PUBLIC / "og-image.png")
    (BRANDING / "social-banner.svg").write_text(
        svg_image(PUBLIC / "rc-social.jpg", "image/jpeg", 1200, 630), encoding="utf-8"
    )


if __name__ == "__main__":
    export_assets()
