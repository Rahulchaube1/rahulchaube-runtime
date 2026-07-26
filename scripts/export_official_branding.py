import os
import base64
from PIL import Image, ImageDraw

# Paths
ROOT_DIR = r"c:\Users\Rahul Chaube\Downloads\runtime"
BRANDING_DIR = os.path.join(ROOT_DIR, "branding")
PUBLIC_DIR = os.path.join(ROOT_DIR, "website", "public")
MASTER_IMAGE_PATH = os.path.join(BRANDING_DIR, "rahulchaube-runtime.png")

os.makedirs(BRANDING_DIR, exist_ok=True)
os.makedirs(PUBLIC_DIR, exist_ok=True)

print(f"Loading master image from: {MASTER_IMAGE_PATH}")
master_img = Image.open(MASTER_IMAGE_PATH).convert("RGBA")

# Crop mark icon (the left rounded icon box)
# In 300x102 master image, icon is situated around x=[12, 98], y=[10, 92]
mark_img = master_img.crop((12, 10, 98, 92))
mark_path = os.path.join(BRANDING_DIR, "mark.png")
mark_img.save(mark_path, "PNG")
mark_img.save(os.path.join(PUBLIC_DIR, "logo.png"), "PNG")
print("Saved mark.png and logo.png")

# Crop wordmark
wordmark_img = master_img.crop((96, 0, 300, 102))
wordmark_path = os.path.join(BRANDING_DIR, "wordmark.png")
wordmark_img.save(wordmark_path, "PNG")
print("Saved wordmark.png")

# Helper to create b64 SVG
def image_to_b64_png(pil_img):
    import io
    buf = io.BytesIO()
    pil_img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("utf-8")

mark_b64 = image_to_b64_png(mark_img)
master_b64 = image_to_b64_png(master_img)
wordmark_b64 = image_to_b64_png(wordmark_img)

# 1. Generate SVG Files
def write_svg(filepath, width, height, b64_data):
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
  <image xlink:href="data:image/png;base64,{b64_data}" width="{width}" height="{height}" />
</svg>'''
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(svg_content)
    print(f"Wrote SVG: {filepath}")

# Generate requested branding SVGs
write_svg(os.path.join(BRANDING_DIR, "logo.svg"), 300, 102, master_b64)
write_svg(os.path.join(BRANDING_DIR, "logo-dark.svg"), 300, 102, master_b64)
write_svg(os.path.join(BRANDING_DIR, "logo-light.svg"), 300, 102, master_b64)
write_svg(os.path.join(BRANDING_DIR, "favicon.svg"), 64, 64, mark_b64)
write_svg(os.path.join(BRANDING_DIR, "wordmark.svg"), 204, 102, wordmark_b64)
write_svg(os.path.join(BRANDING_DIR, "mark.svg"), 86, 82, mark_b64)

# Generate requested public SVGs
write_svg(os.path.join(PUBLIC_DIR, "logo.svg"), 300, 102, master_b64)
write_svg(os.path.join(PUBLIC_DIR, "favicon.svg"), 64, 64, mark_b64)

# 2. Generate PNG Icons
sizes = {
    "icon-16.png": 16,
    "icon-32.png": 32,
    "icon-64.png": 64,
    "icon-128.png": 128,
    "icon-256.png": 256,
    "icon-512.png": 512,
    "icon-1024.png": 1024,
    "apple-touch-icon.png": 180,
    "favicon-16x16.png": 16,
    "favicon-32x32.png": 32,
}

for filename, sz in sizes.items():
    resized = mark_img.resize((sz, sz), Image.Resampling.LANCZOS)
    out_path = os.path.join(PUBLIC_DIR, filename)
    resized.save(out_path, "PNG")
    print(f"Generated PNG: {out_path} ({sz}x{sz})")

# Generate favicon.ico
mark_img.resize((32, 32), Image.Resampling.LANCZOS).save(os.path.join(PUBLIC_DIR, "favicon.ico"), format="ICO")
print("Generated favicon.ico")

# 3. Generate Social Card & OG Image (1200x630)
def generate_og_card(filepath):
    card = Image.new("RGBA", (1200, 630), (7, 26, 22, 255))
    draw = ImageDraw.Draw(card)
    
    # Draw dark grid lines
    for x in range(0, 1200, 40):
        draw.line([(x, 0), (x, 630)], fill=(22, 56, 48, 80), width=1)
    for y in range(0, 630, 40):
        draw.line([(0, y), (1200, y)], fill=(22, 56, 48, 80), width=1)

    # Scale master logo to width 600
    logo_w = 600
    logo_h = int(master_img.height * (logo_w / master_img.width))
    scaled_master = master_img.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
    
    # Paste centered
    paste_x = (1200 - logo_w) // 2
    paste_y = (630 - logo_h) // 2 - 30
    card.paste(scaled_master, (paste_x, paste_y), scaled_master)
    
    # Subtitle text
    sub_text = "High-Performance JavaScript & TypeScript Platform"
    draw.text((1200 // 2 - 280, paste_y + logo_h + 40), sub_text, fill=(139, 148, 158, 255))

    card.save(filepath, "PNG")
    print(f"Generated OG card: {filepath}")

generate_og_card(os.path.join(PUBLIC_DIR, "social-card.png"))
generate_og_card(os.path.join(PUBLIC_DIR, "og-image.png"))

print("\nAll official branding exports generated successfully from rahulchaube-runtime.png!")
