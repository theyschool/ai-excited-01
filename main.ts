// ai-excited-01 entrypoint (Node 22, standard library only).
//
// The entry is a single image, entry.png, sitting beside this file. This
// program places an exact copy of it at <output>/entry.png, where the
// output directory comes from MAKEFUN_OUTPUT_DIR (or /output by default).
// It uses no network and writes the same bytes on every run.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const SOURCE = join(dirname(fileURLToPath(import.meta.url)), 'entry.png');

// The file must be a whole PNG or a whole JPEG: read its kind off the
// first bytes. Anything else is not an image the gate accepts.
function imageKind(bytes: Buffer): 'png' | 'jpeg' | null {
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return 'png';
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'jpeg';
  }
  return null;
}

const image = readFileSync(SOURCE);
const kind = imageKind(image);
if (kind === null) {
  throw new Error('entry.png is neither a PNG nor a JPEG');
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, 'entry.png'), image);
console.log(
  `wrote ${image.length} bytes (${kind}) to ${join(OUTPUT_DIR, 'entry.png')}`,
);
