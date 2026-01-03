#!/usr/bin/env python3
import os, base64

PNG_B64 = (
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/" 
    "x8AAwMBApM1q+QAAAAASUVORK5CYII="
)

out_dir = os.path.join(os.path.dirname(__file__), 'images')
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, 'logo.png')
with open(out_path, 'wb') as f:
    f.write(base64.b64decode(PNG_B64))
print('Wrote', out_path)
