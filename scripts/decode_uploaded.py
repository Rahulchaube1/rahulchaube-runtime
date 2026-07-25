import json
import base64
import re
from PIL import Image, ImageFile

ImageFile.LOAD_TRUNCATED_IMAGES = True

transcript_path = r'C:\Users\Rahul Chaube\.gemini\antigravity\brain\b651f046-ae2f-43cb-bfb4-c9666fff8dda\.system_generated\logs\transcript_full.jsonl'
output_path = r'c:\Users\Rahul Chaube\Downloads\runtime\branding\uploaded_reference.png'

with open(transcript_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for line in reversed(lines):
    if 'data:image/png;base64,' in line:
        data = json.loads(line)
        if data.get('type') == 'USER_INPUT':
            content = data.get('content', '')
            if 'data:image/png;base64,' in content:
                start = content.find('data:image/png;base64,') + len('data:image/png;base64,')
                end = content.find('"', start)
                if end == -1:
                    end = content.find("'", start)
                raw_str = content[start:end]
                clean_b64 = re.sub(r'[^A-Za-z0-9+/=]', '', raw_str)
                
                # Truncate to multiple of 4
                mod = len(clean_b64) % 4
                if mod != 0:
                    clean_b64 = clean_b64[:-mod]
                    
                decoded = base64.b64decode(clean_b64)
                with open(output_path, 'wb') as img_file:
                    img_file.write(decoded)
                print(f"Decoded {len(decoded)} bytes image successfully!")
                
                try:
                    img = Image.open(output_path)
                    img.load()
                    print(f"PIL successfully loaded image! Size: {img.size}, Mode: {img.mode}")
                    # Save re-encoded non-truncated PNG
                    img.save(r'c:\Users\Rahul Chaube\Downloads\runtime\branding\uploaded_reference_clean.png')
                    print("Saved clean PNG!")
                except Exception as e:
                    print(f"Error loading with PIL: {e}")
                break
