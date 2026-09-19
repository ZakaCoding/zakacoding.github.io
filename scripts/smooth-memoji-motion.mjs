import { readFile, writeFile } from 'node:fs/promises';

const file = new URL('../src/assets/lottie/memoji-optimized.json', import.meta.url);
const animation = JSON.parse(await readFile(file, 'utf8'));
const layers = [...animation.layers].sort((a, b) => a.ip - b.ip);
const factor = 60 / animation.fr;
const end = animation.op * factor;
const starts = layers.map((layer) => layer.ip * factor);
// Incoming images sit above the outgoing image. Keep the lower image opaque
// until the blend finishes, so the white background never flashes through.
const blends = starts.map((start, index) => (
  index === 0 ? 0 : ((starts[index + 1] ?? end) - start) * 0.75
));
for (const [index, layer] of layers.entries()) {
  const start = starts[index];
  layer.ip = start;
  layer.op = index === layers.length - 1 ? end : starts[index + 1] + blends[index + 1];
  layer.st = (layer.st ?? 0) * factor;
  layer.ks.o = index === 0 ? { a: 0, k: 100 } : {
    a: 1,
    k: [
      {
        t: start, s: [0], e: [100],
        o: { x: [0.333], y: [0.333] },
        i: { x: [0.667], y: [0.667] },
      },
      { t: start + blends[index], s: [100] },
    ],
  };
}
animation.fr = 60;
animation.ip *= factor;
animation.op = end;
animation.nm = 'Zaka Memoji — 60 fps blended wink';
animation.layers = layers.reverse();
await writeFile(file, JSON.stringify(animation));
