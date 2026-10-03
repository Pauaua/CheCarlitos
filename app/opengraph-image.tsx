import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Imagen para compartir en redes (Open Graph), generada a partir del logo.

export const alt = "Che Carlitos — Aire acondicionado domiciliario y automotriz";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 56,
          padding: 80,
          color: "white",
          backgroundImage: "linear-gradient(120deg, #1F3A6D 0%, #1F3A6D 40%, #D9622B 90%, #F08A4B 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 300, height: 300, borderRadius: 9999, background: "white" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={270} height={234} alt="" />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>
            Che Carlitos
          </div>
          <div style={{ fontSize: 38, marginTop: 16, maxWidth: 720, lineHeight: 1.3 }}>
            Aire acondicionado domiciliario y automotriz · Repuestos de calefacción automotriz
          </div>
        </div>
      </div>
    ),
    size,
  );
}
