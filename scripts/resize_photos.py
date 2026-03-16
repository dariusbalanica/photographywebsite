"""python -m venv venv
resize_images.py
----------------
Resizes all images in a folder so that each file is under a target size (default: 10MB).
Saves resized copies to an output folder, leaving originals untouched.

Usage:
    pip install Pillow
    python resize_images.py
    python resize_images.py --input ./my_photos --output ./resized --max-mb 10
"""

import os
import sys
import argparse
from pathlib import Path
from PIL import Image

# ── Configuration ────────────────────────────────────────────────────────────

SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".tiff", ".bmp"}

# ── Helpers ───────────────────────────────────────────────────────────────────

def file_size_mb(path: Path) -> float:
    return path.stat().st_size / (1024 * 1024)


def resize_to_fit(image: Image.Image, max_bytes: int, save_path: Path, fmt: str, quality: int = 95) -> bool:
    """
    Iteratively reduces quality (JPEG/WebP) or dimensions (PNG) until the
    saved file is under max_bytes. Returns True if it succeeded.
    """
    # ── JPEG / WebP: reduce quality first, then scale down ──────────────────
    if fmt in ("JPEG", "WEBP"):
        q = quality
        while q >= 20:
            image.save(save_path, format=fmt, quality=q, optimize=True)
            if save_path.stat().st_size <= max_bytes:
                return True
            q -= 5

        # Still too big → scale down dimensions
        img = image.copy()
        while True:
            w, h = img.size
            img = img.resize((int(w * 0.85), int(h * 0.85)), Image.LANCZOS)
            img.save(save_path, format=fmt, quality=20, optimize=True)
            if save_path.stat().st_size <= max_bytes:
                return True
            if min(img.size) < 100:
                return False  # can't shrink further

    # ── PNG: scale down dimensions (PNGs don't have lossy quality) ───────────
    else:
        img = image.copy()
        img.save(save_path, format=fmt, optimize=True)
        if save_path.stat().st_size <= max_bytes:
            return True

        while True:
            w, h = img.size
            img = img.resize((int(w * 0.85), int(h * 0.85)), Image.LANCZOS)
            img.save(save_path, format=fmt, optimize=True)
            if save_path.stat().st_size <= max_bytes:
                return True
            if min(img.size) < 100:
                return False


def process_image(src: Path, dst_dir: Path, max_mb: float) -> dict:
    """
    Processes a single image. Returns a result dict with status info.
    """
    max_bytes = int(max_mb * 1024 * 1024)
    original_mb = file_size_mb(src)

    # Determine output path (always save as the same extension)
    dst = dst_dir / src.name

    # Skip if already small enough — just copy
    if original_mb <= max_mb:
        import shutil
        shutil.copy2(src, dst)
        return {"file": src.name, "status": "copied (already under limit)",
                "original_mb": original_mb, "final_mb": original_mb}

    try:
        img = Image.open(src)

        # Preserve EXIF data if available
        exif = img.info.get("exif", b"")

        # Convert RGBA/palette PNGs to RGB for JPEG saving (if needed)
        ext = src.suffix.lower()
        fmt_map = {".jpg": "JPEG", ".jpeg": "JPEG", ".png": "PNG",
                   ".webp": "WEBP", ".tiff": "TIFF", ".bmp": "BMP"}
        fmt = fmt_map.get(ext, "JPEG")

        if fmt == "JPEG" and img.mode in ("RGBA", "P", "LA"):
            img = img.convert("RGB")

        success = resize_to_fit(img, max_bytes, dst, fmt)
        final_mb = file_size_mb(dst)

        status = "resized" if success else "warning: resized (still slightly over -- image too complex)"
        return {"file": src.name, "status": status,
                "original_mb": original_mb, "final_mb": final_mb}

    except Exception as e:
        return {"file": src.name, "status": f"error: {e}",
                "original_mb": original_mb, "final_mb": None}


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Resize images to fit under a max file size.")
    parser.add_argument("--input",  "-i", default="./images",  help="Input folder (default: ./images)")
    parser.add_argument("--output", "-o", default="./resized", help="Output folder (default: ./resized)")
    parser.add_argument("--max-mb", "-m", type=float, default=10.0, help="Max file size in MB (default: 10)")
    args = parser.parse_args()

    input_dir  = Path(args.input)
    output_dir = Path(args.output)
    max_mb     = args.max_mb

    # Validate input folder
    if not input_dir.exists():
        print(f"Error: Input folder not found: {input_dir}")
        sys.exit(1)

    # Create output folder
    output_dir.mkdir(parents=True, exist_ok=True)

    # Collect all supported images
    images = [f for f in input_dir.iterdir()
              if f.is_file() and f.suffix.lower() in SUPPORTED_EXTENSIONS]

    if not images:
        print(f"No supported images found in '{input_dir}'.")
        print(f"Supported formats: {', '.join(SUPPORTED_EXTENSIONS)}")
        sys.exit(0)

    print(f"\nInput:  {input_dir.resolve()}")
    print(f"Output: {output_dir.resolve()}")
    print(f"Max size: {max_mb} MB")
    print(f"Found {len(images)} image(s)\n")
    print(f"{'File':<40} {'Original':>10} {'Final':>10}  Status")
    print("─" * 80)

    results = []
    for img_path in sorted(images):
        result = process_image(img_path, output_dir, max_mb)
        results.append(result)

        orig  = f"{result['original_mb']:.2f} MB"
        final = f"{result['final_mb']:.2f} MB" if result['final_mb'] is not None else "—"
        print(f"{result['file']:<40} {orig:>10} {final:>10}  {result['status']}")

    # Summary
    total     = len(results)
    copied    = sum(1 for r in results if "copied" in r["status"])
    resized   = sum(1 for r in results if "resized" == r["status"])
    warnings  = sum(1 for r in results if "warning" in r["status"])
    errors    = sum(1 for r in results if "error" in r["status"])

    print("─" * 80)
    print(f"\nDone. {total} file(s) processed:")
    print(f"   - {copied} already under {max_mb} MB (copied as-is)")
    print(f"   - {resized} resized successfully")
    if warnings: print(f"   - {warnings} resized but may still be slightly over limit")
    if errors:   print(f"   - {errors} error(s) -- check filenames above")
    print(f"\nOutput saved to: {output_dir.resolve()}\n")


if __name__ == "__main__":
    main()