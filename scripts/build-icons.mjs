import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const source =
  process.argv[2] ??
  path.join(
    process.env.USERPROFILE ?? process.env.HOME ?? "",
    ".cursor/projects/c-Users-kazem-OneDrive-Desktop-albionmoneymaking/assets/icon-transparent.png",
  );

if (!fs.existsSync(source)) {
  console.error("Source icon not found:", source);
  process.exit(1);
}

function isBackgroundPixel(r, g, b) {
  const avg = (r + g + b) / 3;
  const chroma = Math.max(r, g, b) - Math.min(r, g, b);
  return avg >= 215 && chroma <= 18;
}

function colorsMatch(r1, g1, b1, r2, g2, b2, tolerance = 28) {
  return (
    Math.abs(r1 - r2) <= tolerance &&
    Math.abs(g1 - g2) <= tolerance &&
    Math.abs(b1 - b2) <= tolerance
  );
}

async function removeCheckerboard(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const background = new Uint8Array(width * height);
  const queue = [];

  const visit = (x, y) => {
    const index = y * width + x;
    if (background[index]) {
      return;
    }

    const offset = index * channels;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];

    if (!isBackgroundPixel(r, g, b)) {
      return;
    }

    background[index] = 1;
    queue.push(index);
  };

  for (let x = 0; x < width; x++) {
    visit(x, 0);
    visit(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    visit(0, y);
    visit(width - 1, y);
  }

  while (queue.length > 0) {
    const index = queue.pop();
    const x = index % width;
    const y = (index - x) / width;
    const offset = index * channels;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];

    const neighbors = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];

    for (const [nx, ny] of neighbors) {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
        continue;
      }

      const neighborIndex = ny * width + nx;
      if (background[neighborIndex]) {
        continue;
      }

      const neighborOffset = neighborIndex * channels;
      const nr = data[neighborOffset];
      const ng = data[neighborOffset + 1];
      const nb = data[neighborOffset + 2];

      if (
        isBackgroundPixel(nr, ng, nb) &&
        colorsMatch(r, g, b, nr, ng, nb)
      ) {
        background[neighborIndex] = 1;
        queue.push(neighborIndex);
      }
    }
  }

  let transparentCount = 0;
  for (let index = 0; index < width * height; index++) {
    const offset = index * channels;
    if (background[index]) {
      data[offset + 3] = 0;
      transparentCount++;
      continue;
    }

    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    const alpha = data[offset + 3];

    // Remove faint background halos left on anti-aliased edges.
    if (alpha < 255 && isBackgroundPixel(r, g, b)) {
      data[offset + 3] = 0;
      transparentCount++;
    }
  }

  console.log(
    "Removed background pixels:",
    transparentCount,
    `(${((transparentCount / (width * height)) * 100).toFixed(1)}%)`,
  );

  return sharp(data, { raw: { width, height, channels } })
    .trim({ threshold: 1 })
    .png()
    .toBuffer();
}

const meta = await sharp(source).metadata();
console.log("Source:", meta.width, "x", meta.height, "alpha:", meta.hasAlpha);

const cutout = await removeCheckerboard(source);

const square = await sharp(cutout)
  .resize(512, 512, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

const squareMeta = await sharp(square).metadata();
console.log("Output:", squareMeta.width, "x", squareMeta.height, "alpha:", squareMeta.hasAlpha);

const targets = [
  path.join(root, "src/app/icon.png"),
  path.join(root, "src/app/apple-icon.png"),
  path.join(root, "public/icon.png"),
];

for (const target of targets) {
  fs.writeFileSync(target, square);
  console.log("Wrote", target);
}

// Small square PNGs embed cleanly in .ico; large ones break Next.js favicon decoding.
const sizes = [16, 32, 48];
const buffers = await Promise.all(
  sizes.map((size) =>
    sharp(square)
      .resize(size, size, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9, palette: true })
      .toBuffer(),
  ),
);
const ico = await pngToIco(buffers);

for (const target of [
  path.join(root, "src/app/favicon.ico"),
  path.join(root, "public/favicon.ico"),
]) {
  fs.writeFileSync(target, ico);
  console.log("Wrote", target, `(${ico.length} bytes)`);
}
