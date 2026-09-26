# Home Memoji reaction assets

Generated with the built-in image_gen tool using `src/assets/image/zaka-memoji-screenlit.webp` as the edit target. The final project assets are `src/assets/image/zaka-memoji-quarter-blink-eyes.png`, `src/assets/image/zaka-memoji-half-blink-eyes.png`, `src/assets/image/zaka-memoji-blink-eyes.png`, and `src/assets/image/zaka-memoji-gaze-eyes.png`. Each is a feathered crop of the generated portrait so the base Memoji and laptop stay fixed.

## Blink prompt

Use case: precise-object-edit. Asset: closed-blink expression layer for the existing 1120x1404 home-screen Memoji portrait. Use the supplied image as the edit target. Keep the exact camera, scale, centered face, hair, smile, laptop, stickers, backdrop, warm hair rim light, and cool laptop screen light. Change only BOTH eyelids and eyebrows: both eyes naturally closed in a soft blink, brows lowered slightly and relaxed as in a quick blink. Do not shift the head or laptop. No additional objects or text. Match the exact source image dimensions and composition; the eyebrow-and-eye area will be feather-masked over the source in code, so align facial features precisely.

## Quarter-blink prompt

Use case: precise-object-edit. Image 1 is the original Memoji edit target. Image 2 is a half-blink supporting reference. Generate an early blink pose only ONE QUARTER closed, between these two: both eyelids lower just slightly and symmetrically, with the eyebrows only a few pixels lower than Image 1. Both eyes remain mostly open, natural and matched. Preserve the exact 1120x1404 composition and every other detail from Image 1: head, hair, nose, smile, laptop, stickers, black background, warm rim light, cool screen light. No changes outside eyes and brows. Pixel alignment to Image 1 is essential for compositing.

## Half-blink prompt

Use case: precise-object-edit. Image 1 is the edit target: the original Zaka Memoji portrait. Image 2 is a supporting closed-eye expression reference. Produce a halfway blink pose exactly between their eyelids: BOTH eyes are symmetrically half closed, upper lids halfway down, brows mildly lowered. Keep the original portrait's exact 1120x1404 framing, face location, hair, smile, laptop, stickers, black background, warm rim light and cool screen light. The eyes must not be mismatched and must not be a wink. No changes outside eyes and brows. Pixel alignment is essential because this is an intermediate frame composited onto Image 1.

## Downward gaze prompt

Use case: precise-object-edit. Create an expression-layer image aligned exactly to the supplied Memoji portrait, same 1120x1404 framing. The character has just blinked and is now calmly reading the laptop screen: BOTH upper eyelids are lowered to a relaxed half-open squint, both pupils look clearly DOWN toward the laptop, and BOTH eyebrows tilt down a little into a focused, curious expression. The eyes should appear narrower than the original, never wide or startled. Change only the brows and eyes. Keep the head, hair, face position, nose, mouth, laptop, stickers, black background, warm rim lighting and cool screen lighting aligned with the original. No added text or objects. This will be masked over the original eye-and-brow region, so pixel alignment is critical.

## 60 fps render

`scripts/generate-memoji-reaction.py` combines the two expression crops with the original portrait and a moving screen glow. It encodes 168 frames of 1120 × 1404 H.264 MP4 at 60 fps into `src/assets/video/memoji-reaction-60fps.mp4`. The site plays that clip on hover or tap and shows the original portrait for reduced motion.

To regenerate, install Pillow and ffmpeg, then run `python scripts/generate-memoji-reaction.py` from the repository root. Set `FFMPEG_BIN` to the ffmpeg executable path if it is not on `PATH`.
