// Datos de contacto y configuración general del sitio.
// Los valores marcados como PLACEHOLDER deben reemplazarse (o definirse en .env).

export const SITE = {
  name: "Che Carlitos",
  legalName: "Che Carlitos",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "airesacondicionados.cc@hotmail.com",
  // PLACEHOLDER: teléfono visible en la página (NEXT_PUBLIC_PHONE)
  phone: process.env.NEXT_PUBLIC_PHONE || "+56 9 0000 0000",
  // PLACEHOLDER: zona de cobertura
  serviceArea: "Región Metropolitana y alrededores",
} as const;

// PLACEHOLDER: número de WhatsApp, solo dígitos y con código de país (ej: 56912345678)
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "56900000000";

export const WHATSAPP_DEFAULT_MESSAGE = "Hola Che Carlitos, quisiera cotizar un servicio.";

export function whatsappUrl(message: string = WHATSAPP_DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function phoneHref(phone: string = SITE.phone) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
