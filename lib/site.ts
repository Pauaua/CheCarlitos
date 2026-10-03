// Datos de contacto y configuración general del sitio.
// Algunos valores se pueden sobrescribir con variables de entorno (ver .env.example).

export const SITE = {
  name: "Che Carlitos",
  legalName: "Che Carlitos",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "aireacondicionado.cc@hotmail.com",
  // Teléfonos de contacto visibles en la página (se pueden sobrescribir con NEXT_PUBLIC_PHONE y NEXT_PUBLIC_PHONE_2).
  // El primero es también el número de WhatsApp.
  phones: [
    process.env.NEXT_PUBLIC_PHONE || "+56 9 7692 5964",
    process.env.NEXT_PUBLIC_PHONE_2 || "+56 9 9802 7948",
  ],
  // Zona de cobertura y horario de atención
  serviceArea: "Toda la Región Metropolitana. Envíos a todo Chile.",
  hours: "09:00 a 18:00 hrs.",
} as const;

// Número de WhatsApp, solo dígitos y con código de país (se puede sobrescribir con NEXT_PUBLIC_WHATSAPP_NUMBER)
// Créditos del footer (agencia que hizo el sitio)
export const CREDITS = { name: "Phantasia", url: "https://phantasia.cl" } as const;

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "56976925964";

export const WHATSAPP_DEFAULT_MESSAGE = "Hola Che Carlitos, quisiera cotizar un servicio.";

export function whatsappUrl(message: string = WHATSAPP_DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
