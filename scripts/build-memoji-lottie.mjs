// Convert cropped, alpha-keyed frames from the supplied recording to raster Lottie.
// Usage: node scripts/build-memoji-lottie.mjs /absolute/frame-directory
// Frames: ffmpeg -i recording.mp4 -t 4.6 -vf
// 'crop=280:285:110:275,fps=15,format=rgba,colorkey=0xFFFFFF:0.055:0.025'
// -c:v libwebp -quality 88 frame-%03d.webp
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
const directory = process.argv[2];
if (!directory) throw new Error('Supply the extracted frame directory');
const files = readdirSync(directory).filter(name => /^frame-\d+\.webp$/.test(name)).sort();
if (!files.length) throw new Error('No frames found');
const animation = {
  v: '5.12.2', fr: 15, ip: 0, op: files.length, w: 280, h: 285,
  nm: 'Zaka Memoji — recorded motion (raster frames)', ddd: 0,
  assets: files.map((name, index) => ({
    id: `frame_${index}`, w: 280, h: 285, u: '', e: 1,
    p: `data:image/webp;base64,${readFileSync(`${directory}/${name}`).toString('base64')}`,
  })),
  layers: files.map((_, index) => ({
    ddd: 0, ind: index + 1, ty: 2, nm: `Recorded frame ${index}`, refId: `frame_${index}`,
    sr: 1, ip: index, op: index + 1, st: 0, bm: 0,
    ks: { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [0, 0, 0] },
      a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] } },
  })),
};
writeFileSync(new URL('../public/motion/zaka-memoji.json', import.meta.url), JSON.stringify(animation));
console.log(`Built ${files.length} raster frames; original recording UI and audio excluded.`);
