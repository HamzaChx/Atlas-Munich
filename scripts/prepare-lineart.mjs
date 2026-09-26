// ============================================
// Atlas Munich – line art → ink mask
//
// Turns a generated stick-figure drawing (dark lines on white, or on a
// transparent ground) into the mask the /chat landing inks in each card's
// accent colour. Darkness becomes opacity, colour is thrown away, the figure
// is trimmed and centred on a square with even padding.
//
//   node scripts/prepare-lineart.mjs <riad|dalilah|ilham|loubna> <image>
//
// Writes public/characters/<name>-line.webp. Then add
//   lineArt: "/characters/<name>-line.webp",
// to that helper in src/data/assistants.ts.
// ============================================

import sharp from "sharp";

const [name, input] = process.argv.slice(2);
if (!name || !input) {
  console.error("usage: node scripts/prepare-lineart.mjs <name> <image>");
  process.exit(1);
}

const SIZE = 512;
const PAD = 0.06;

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

// Ink = how dark the pixel is, times how opaque it already was. A soft floor
// drops paper grain and JPEG noise; the rest keeps anti-aliased edges smooth.
const out = Buffer.alloc(info.width * info.height * 4);
for (let i = 0; i < info.width * info.height; i++) {
  const r = data[i * 4];
  const g = data[i * 4 + 1];
  const b = data[i * 4 + 2];
  const a = data[i * 4 + 3] / 255;
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const ink = Math.max(0, Math.min(1, (1 - luminance - 0.12) / 0.6)) * a;
  out[i * 4 + 3] = Math.round(ink * 255);
}

const inner = Math.round(SIZE * (1 - PAD * 2));
const trimmed = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
  .trim({ threshold: 10 })
  .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

const file = `public/characters/${name}-line.webp`;
await sharp({
  create: { width: SIZE, height: SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite([{ input: trimmed, gravity: "center" }])
  .webp({ quality: 90, alphaQuality: 100 })
  .toFile(file);

console.log(
  `wrote ${file}\nnow add  lineArt: "/${file.replace(/^public\//, "")}",  to ${name} in src/data/assistants.ts`
);
