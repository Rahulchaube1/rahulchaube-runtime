import os
from PIL import Image, ImageDraw, ImageFont

def create_logo_image(size):
    width, height = size, size
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Outer dark rounded rect
    rx = int(width * 0.22)
    bg_color = (7, 26, 22, 255) # #071A16
    draw.rounded_rectangle([0, 0, width-1, height-1], radius=rx, fill=bg_color, outline=(22, 56, 48, 255), width=max(1, int(width*0.03)))
    
    # Gradient colors
    c_top = (168, 240, 91, 255)  # #A8F05B
    c_mid = (111, 207, 99, 255)  # #6FCF63
    c_bot = (47, 168, 102, 255)  # #2FA866
    
    # Scale coordinates relative to size
    # Left Pillar (R)
    x1 = int(width * 0.19)
    y1 = int(height * 0.19)
    w1 = int(width * 0.16)
    h1 = int(height * 0.62)
    draw.rounded_rectangle([x1, y1, x1+w1, y1+h1], radius=int(w1*0.4), fill=c_mid)
    
    # Upper Loop of R / C Curve
    st_w = max(2, int(width * 0.15))
    cx1 = int(width * 0.35)
    cy1 = int(height * 0.19)
    cw = int(width * 0.44)
    ch = int(height * 0.38)
    draw.arc([cx1, cy1, cx1+cw, cy1+ch], start=270, end=90, fill=c_top, width=st_w)
    draw.line([int(width*0.35), int(height*0.19)+st_w//2, int(width*0.58), int(height*0.19)+st_w//2], fill=c_top, width=st_w)
    draw.line([int(width*0.35), int(height*0.57)-st_w//2, int(width*0.58), int(height*0.57)-st_w//2], fill=c_mid, width=st_w)
    
    # Diagonal Leg
    draw.line([int(width*0.42), int(height*0.48), int(width*0.68), int(height*0.80)], fill=c_bot, width=st_w)
    
    return img

def create_social_card():
    width, height = 1200, 630
    img = Image.new("RGBA", (width, height), (7, 26, 22, 255))
    draw = ImageDraw.Draw(img)
    
    logo = create_logo_image(160)
    img.paste(logo, (100, 235), logo)
    
    # Text
    draw.text((300, 240), "RahulChaube Runtime", fill=(240, 246, 252, 255))
    draw.text((300, 310), "A next-generation JavaScript & TypeScript runtime.", fill=(139, 148, 158, 255))
    draw.text((300, 360), "v1.0.0 General Availability · MIT Licensed", fill=(111, 207, 99, 255))
    
    return img

output_dir = "website/public"
os.makedirs(output_dir, exist_ok=True)

sizes = {
    "icon-1024.png": 1024,
    "icon-512.png": 512,
    "icon-256.png": 256,
    "icon-128.png": 128,
    "icon-64.png": 64,
    "icon-32.png": 32,
    "icon-16.png": 16,
    "apple-touch-icon.png": 180,
}

for filename, sz in sizes.items():
    img = create_logo_image(sz)
    path = os.path.join(output_dir, filename)
    img.save(path, "PNG")
    print(f"Generated {path} ({sz}x{sz})")

social = create_social_card()
social.save(os.path.join(output_dir, "social-card.png"), "PNG")
social.save(os.path.join(output_dir, "og-image.png"), "PNG")
print("Generated social-card.png and og-image.png (1200x630)")
