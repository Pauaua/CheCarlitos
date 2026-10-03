// Genera los íconos del sitio (favicon y apple-touch-icon) a partir de public/logo.png.
// Uso: reemplaza public/logo.png por el logo real y ejecuta `npm run icons`.
import sharp from "sharp";
import { existsSync } from "node:fs";

const SOURCE = "public/logo.png";
const BACKGROUND = "#F7F2EA"; // brand-cream

if (!existsSync(SOURCE)) {
  console.error(`No se encontró ${SOURCE}`);
  process.exit(1);
}

const targets = [
  { file: "app/icon.png", size: 512, padding: 0.06 },
  { file: "app/apple-icon.png", size: 180, padding: 0.12 },
];

for (const { file, size, padding } of targets) {
  const inner = Math.round(size * (1 - padding * 2));
  const logo = await sharp(SOURCE)
    .resize(inner, inner, { fit: "contain", background: BACKGROUND })
    .toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background: BACKGROUND },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(file);

  console.log(`✔ ${file} (${size}x${size})`);
}
