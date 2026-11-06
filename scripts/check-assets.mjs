import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imageDir = path.join(root, 'public', 'images');

const expected = [
  { file: 'zforce-zf435-front.png', ratio: 1, role: 'gallery 1' },
  { file: 'zforce-zf435-details.png', ratio: 1, role: 'gallery 2' },
  { file: 'zforce-zf435-angles.png', ratio: 1, role: 'gallery 3' },
  { file: 'zforce-zf435-hero-studio.png', ratio: 2, role: 'hero' },
  { file: 'zforce-zf435-hero-lifestyle.png', ratio: 2, role: 'campaign' },
];

/** Reads width/height from a PNG's IHDR chunk. */
async function pngSize(file) {
  const buffer = await readFile(file);
  const signature = buffer.subarray(0, 8).toString('hex');
  if (signature !== '89504e470d0a1a0a') return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

let missing = 0;

for (const image of expected) {
  const filePath = path.join(imageDir, image.file);
  try {
    const info = await stat(filePath);
    if (info.size < 1000) throw new Error('file looks empty');
    const size = await pngSize(filePath);
    if (!size) throw new Error('not a readable PNG');
    const actual = size.width / size.height;
    const ratioOk = Math.abs(actual - image.ratio) < 0.02;
    const detail = `${size.width}×${size.height}  ${(info.size / 1024).toFixed(0)} KB`;
    console.log(`${ratioOk ? '✓' : '!'} ${image.file.padEnd(34)} ${image.role.padEnd(9)} ${detail}${ratioOk ? '' : `  expected ${image.ratio}:1`}`);
    if (!ratioOk) missing += 1;
  } catch (error) {
    missing += 1;
    console.log(`✗ ${image.file.padEnd(34)} ${image.role.padEnd(9)} missing — ${error.message}`);
  }
}

if (missing > 0) {
  console.log(`\n${missing} image issue(s). Add the supplied files to public/images/ (see public/images/README.md).`);
  process.exitCode = 1;
} else {
  console.log('\nAll five product images are in place.');
}
