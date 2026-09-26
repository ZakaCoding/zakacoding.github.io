"""Render the home Memoji reaction at 60 fps.

Requires Pillow and ffmpeg. Run from the repository root.
"""

from pathlib import Path
import math
import os
import shutil
import subprocess

from PIL import Image, ImageChops, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'src' / 'assets' / 'image'
OUTPUT = ROOT / 'src' / 'assets' / 'video' / 'memoji-reaction-60fps.mp4'
FPS = 60
DURATION = 2.8
PATCH_POS = (315, 385)


def smooth(start, end, time):
    value = max(0, min(1, (time - start) / (end - start)))
    return value * value * (3 - 2 * value)


def glow(width, height, color, strength):
    image = Image.new('RGBA', (width, height))
    pixels = image.load()
    for y in range(height):
        ny = (y - height / 2) / (height / 2)
        for x in range(width):
            nx = (x - width / 2) / (width / 2)
            radius = math.sqrt(nx * nx + ny * ny)
            pixels[x, y] = (*color, round(strength * max(0, 1 - radius) ** 1.7))
    return image


def with_strength(image, strength):
    layer = image.copy()
    alpha = image.getchannel('A').point(lambda value: round(value * strength))
    layer.putalpha(alpha)
    return layer


def blink_mask(alpha, closure):
    if closure <= 0:
        return None
    # Brows ease downward while each upper eyelid sweeps across the eyes.
    coverage = Image.new('L', alpha.size)
    draw = ImageDraw.Draw(coverage)
    edge = 548 + 106 * closure
    for row in range(alpha.height):
        y = PATCH_POS[1] + row
        if y < 550:
            strength = smooth(0.02, 0.22, closure)
        else:
            strength = max(0, min(1, (edge - y) / 11))
        if strength:
            draw.line((0, row, alpha.width, row), fill=round(255 * strength))
    return ImageChops.multiply(alpha, coverage)


def main():
    base = Image.open(ASSETS / 'zaka-memoji-screenlit.webp').convert('RGBA')
    blink = Image.open(ASSETS / 'zaka-memoji-blink-eyes.png').convert('RGBA')
    half_blink = Image.open(ASSETS / 'zaka-memoji-half-blink-eyes.png').convert('RGBA')
    quarter_blink = Image.open(ASSETS / 'zaka-memoji-quarter-blink-eyes.png').convert('RGBA')
    gaze = Image.open(ASSETS / 'zaka-memoji-gaze-eyes.png').convert('RGBA')
    face_glow = glow(550, 230, (140, 192, 255), 38)
    rim_glow = glow(700, 35, (188, 220, 255), 75)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    encoder = os.environ.get('FFMPEG_BIN') or shutil.which('ffmpeg')
    if not encoder:
        raise RuntimeError('Set FFMPEG_BIN to an ffmpeg executable')
    command = [
        encoder, '-y', '-loglevel', 'error',
        '-f', 'rawvideo', '-pixel_format', 'rgb24',
        '-video_size', f'{base.width}x{base.height}', '-framerate', str(FPS),
        '-i', '-', '-an', '-c:v', 'libx264', '-preset', 'medium',
        '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
        str(OUTPUT),
    ]
    process = subprocess.Popen(command, stdin=subprocess.PIPE)
    try:
        for frame in range(round(DURATION * FPS)):
            time = frame / FPS
            first_blink = smooth(0.14, 0.37, time) * (1 - smooth(0.43, 0.66, time))
            last_blink = smooth(2.12, 2.32, time) * (1 - smooth(2.41, 2.69, time))
            closure = max(first_blink, last_blink)
            gaze_strength = smooth(0.37, 0.49, time) * (1 - smooth(2.32, 2.42, time))
            light_strength = smooth(0.19, 0.69, time) * (1 - smooth(2.15, 2.70, time))
            image = base.copy()

            if gaze_strength > 0:
                image.alpha_composite(with_strength(gaze, gaze_strength), PATCH_POS)
            quarter_strength = smooth(0.02, 0.26, closure)
            if quarter_strength > 0:
                image.alpha_composite(with_strength(quarter_blink, quarter_strength), PATCH_POS)
            half_strength = smooth(0.23, 0.59, closure)
            if half_strength > 0:
                image.alpha_composite(with_strength(half_blink, half_strength), PATCH_POS)
            closed_progress = smooth(0.56, 0.98, closure)
            lid_alpha = blink_mask(blink.getchannel('A'), closed_progress)
            if lid_alpha is not None:
                lid = blink.copy()
                lid.putalpha(lid_alpha)
                image.alpha_composite(lid, PATCH_POS)
            if light_strength > 0:
                shift = round(-14 + 28 * smooth(0.2, 2.15, time))
                image.alpha_composite(with_strength(face_glow, light_strength), (285 + shift, 560))
                image.alpha_composite(with_strength(rim_glow, light_strength), (210 + shift, 744))

            process.stdin.write(image.convert('RGB').tobytes())
        process.stdin.close()
        if process.wait() != 0:
            raise RuntimeError('ffmpeg failed to encode the Memoji reaction')
    finally:
        if process.poll() is None:
            process.kill()
    print(OUTPUT)


if __name__ == '__main__':
    main()
