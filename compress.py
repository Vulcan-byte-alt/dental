import subprocess
import os

# ─────────────────────────────────────────────────────────────────────────────
# Changes vs original:
#
#   film-grain  12  -> 0   Main fix for the oily/waxy look. Synthetic grain
#                          denoises then re-adds fake texture at high levels.
#
#   enable-tf    0  -> 1   Temporal filtering ON. Cleans noise before encoding
#                          which significantly reduces pixelation at low bitrates.
#
#   tune         0  -> 2   SSIM-optimised (tune=2 requires CRF mode).
#                          Produces sharper, more faithful detail vs VQ tune.
#
#   crf         30  -> 28  Better quality floor (lower = higher quality in AV1).
#
#   scale           lanczos  Sharper downscale kernel, clearly noticeable on a
#                            4K source being scaled to 720p.
# ─────────────────────────────────────────────────────────────────────────────


def get_duration(path):
    out = subprocess.check_output([
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        path,
    ])
    return float(out.decode().strip())


def compress_hero(input_file, output_file, target_size_mb=0.90):
    if not os.path.exists(input_file):
        print(f"Error: {input_file!r} not found.")
        return

    duration    = get_duration(input_file)
    # 5% headroom so output reliably stays under target
    max_kbps    = int(target_size_mb * 0.95 * 8192 / duration)

    print(f"Source  : {input_file}  ({duration:.1f}s)")
    print(f"Target  : {target_size_mb} MB  ->  max {max_kbps} kbps")

    if max_kbps < 150:
        print("Note: very low bitrate. Trim source to <=30s for best quality.")

    cmd = [
        "ffmpeg", "-y", "-i", input_file,
        "-c:v", "libsvtav1",
        "-preset", "4",               # 0=slowest/best quality, 12=fastest
        "-crf", "28",                 # quality floor (lower = better, 0-63)
        "-pix_fmt", "yuv420p10le",    # 10-bit keeps gradients smooth
        "-svtav1-params",
            f"rc=0"                   # CRF mode (required for tune=2)
            f":mbr={max_kbps}"        # hard bitrate ceiling for size control
            ":tune=2"                 # SSIM-optimised: sharper, less oily
            ":film-grain=0"           # no synthetic grain: fixes oily look
            ":enable-tf=1"            # temporal filter: less pixelation
            ":keyint=10s",            # keyframe every 10s (fine for looping bg)
        "-vf", "scale=1280:-2:flags=lanczos",   # sharp 4K->720p downscale
        "-an", "-sn",
        output_file,
    ]

    print("\nEncoding...")
    subprocess.run(cmd, check=True)

    final_mb = os.path.getsize(output_file) / (1024 * 1024)
    print(f"\nDone.  {output_file}  ({final_mb:.3f} MB)")

    if final_mb > target_size_mb:
        over = final_mb - target_size_mb
        print(f"Over target by {over:.3f} MB. Lower target_size_mb by 0.05 and re-run.")


if __name__ == "__main__":
    compress_hero("hero1.mp4", "hero.mp4", target_size_mb=0.90)
