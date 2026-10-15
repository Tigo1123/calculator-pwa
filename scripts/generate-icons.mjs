// Generate PNG icons from the SVG using sharp
import sharp from "sharp";
import { fileURLToPath } from "url";
import path from "path";

const root = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(root, "..", "public");
const src = path.join(pub, "icon.svg");
const maskable = path.join(root, "icon-maskable.svg");

const jobs = [
  [src, "icon-192.png", 192],
  [src, "icon-512.png", 512],
  [maskable, "icon-maskable-512.png", 512],
  [src, "apple-touch-icon.png", 180],
];

for (const [input, out, size] of jobs) {
  await sharp(input).resize(size, size).png().toFile(path.join(pub, out));
  console.log("✔", out);
}
