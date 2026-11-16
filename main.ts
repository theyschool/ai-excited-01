// Dragon Gate — ai-excited-01 entrypoint.
//
// The entry is a single image, entry.png, stored next to this file. This
// program places an exact copy of it at <output>/entry.png. The output
// directory is MAKEFUN_OUTPUT_DIR when set, otherwise /output. It needs no
// network, and every run writes the same bytes.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, "entry.png");

// A whole PNG starts with its 8-byte signature; a whole JPEG starts with
// the SOI marker FF D8 FF. Anything else is not an image the gate accepts.
function kindOf(bytes: Buffer): "png" | "jpeg" | null {
  const pngSig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (pngSig.every((b, i) => bytes[i] === b)) return "png";
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "jpeg";
  }
  return null;
}

const image = readFileSync(sourcePath);
if (image.length === 0) {
  throw new Error("entry.png is empty");
}
const kind = kindOf(image);
if (kind === null) {
  throw new Error("entry.png is neither a whole PNG nor a whole JPEG");
}

const target = join(outDir, "entry.png");
mkdirSync(outDir, { recursive: true });
writeFileSync(target, image);
console.log(`wrote ${image.length} bytes (${kind}) to ${target}`);
