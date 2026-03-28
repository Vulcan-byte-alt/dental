"""
Image compression script -- converts images to WebP where it saves space,
otherwise copies the original untouched.
Output: assets/images-optimized/
"""

import shutil
from pathlib import Path
from PIL import Image

INPUT_DIR   = Path("assets/images")
OUTPUT_DIR  = Path("assets/images-optimized")
MAX_WIDTH   = 1920
JPG_QUALITY = 85
PNG_QUALITY = 88

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

total_in  = 0
total_out = 0

for src in sorted(INPUT_DIR.iterdir()):
    if src.suffix.lower() not in (".jpg", ".jpeg", ".png"):
        continue

    is_png    = src.suffix.lower() == ".png"
    quality   = PNG_QUALITY if is_png else JPG_QUALITY
    dest_webp = OUTPUT_DIR / (src.stem + ".webp")
    dest_copy = OUTPUT_DIR / src.name

    with Image.open(src) as img:
        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGB")
        if img.width > MAX_WIDTH:
            ratio = MAX_WIDTH / img.width
            img   = img.resize((MAX_WIDTH, int(img.height * ratio)), Image.LANCZOS)
        img.save(dest_webp, "WEBP", quality=quality, method=6)

    size_in   = src.stat().st_size
    size_webp = dest_webp.stat().st_size

    if size_webp < size_in:
        dest     = dest_webp
        size_out = size_webp
        note     = "webp"
    else:
        # Already optimal — copy original untouched
        dest_webp.unlink()
        shutil.copy2(src, dest_copy)
        dest     = dest_copy
        size_out = dest_copy.stat().st_size
        note     = "copied as-is"

    saving    = (1 - size_out / size_in) * 100
    total_in  += size_in
    total_out += size_out

    print("  %-55s %7.0f KB  ->  %6.0f KB  (%s, %.0f%%)" % (
        src.name, size_in / 1024, size_out / 1024, note, saving))

print()
print("  Total: %.1f MB  ->  %.1f MB  (%.0f%% reduction)" % (
    total_in / 1024 / 1024, total_out / 1024 / 1024,
    (1 - total_out / total_in) * 100))
print("  Output: %s" % OUTPUT_DIR.resolve())
