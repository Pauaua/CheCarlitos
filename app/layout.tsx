import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald", display: "swap" });

const description =
  "Venta, instalación, mantención y reparación de aire acondicionado domiciliario y automotriz. Carga de gas refrigerante y repuestos de calefacción automotriz. Servicio a domicilio y atención a empresas. ¡Cotiza aquí!";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Che Carlitos | Aire acondicionado domiciliario y automotriz",
    template: "%s | Che Carlitos",
  },
  description,
  keywords: [
    "aire acondicionado",
    "instalación de aire acondicionado",
    "mantención de aire acondicionado",
    "reparación de aire acondicionado",
    "carga de gas refrigerante",
    "aire acondicionado automotriz",
    "repuestos calefacción automotriz",
    "radiador de calefacción",
    "motor ventilador calefacción",
    "servicio a domicilio",
    "Chile",
  ],
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "/",
    siteName: SITE.name,
    title: "Che Carlitos | Aire acondicionado domiciliario y automotriz",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Che Carlitos | Aire acondicionado domiciliario y automotriz",
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1F3A6D",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL" className={`${inter.variable} ${oswald.variable}`}>
      <body>
        {/* Sin JavaScript, muestra el contenido que normalmente aparece con animación */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
