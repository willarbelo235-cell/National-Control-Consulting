#!/usr/bin/env python3
"""Generate a placeholder PNG logo.

Creates `project-root/images/logo.png` at a larger size (default 512x512).
If Pillow is not installed the script will attempt to install it.
"""
import os
import sys
import subprocess

out_dir = os.path.join(os.path.dirname(__file__), 'images')
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, 'logo.png')

SIZE = int(os.environ.get('LOGO_SIZE', '512'))

def ensure_pillow():
    try:
        from PIL import Image, ImageDraw
        return Image, ImageDraw
    except Exception:
        print('Pillow not found; installing...')
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '--user', 'Pillow'])
        from PIL import Image, ImageDraw
        return Image, ImageDraw

def make_logo(path, size):
    Image, ImageDraw = ensure_pillow()
    img = Image.new('RGBA', (size, size), (3, 51, 102, 255))
    draw = ImageDraw.Draw(img)
    # center circle
    margin = size // 8
    bbox = (margin, margin, size - margin, size - margin)
    draw.ellipse(bbox, fill=(10,180,255,255))
    # inner smaller circle
    inner = (size//3, size//3, size - size//3, size - size//3)
    draw.ellipse(inner, fill=(255,255,255,255))
    img.save(path, format='PNG')

if __name__ == '__main__':
    try:
        make_logo(out_path, SIZE)
        print('Wrote', out_path)
    except Exception as e:
        print('Failed to create logo:', e)
        sys.exit(1)
