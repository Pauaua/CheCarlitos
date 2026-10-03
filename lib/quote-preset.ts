import type { CategoryValue, ClientTypeValue, ServiceOption } from "@/lib/quote-schema";

// Permite que cualquier botón "Cotizar" de la página deje preseleccionado
// un servicio/producto en el formulario (QuoteForm escucha este evento).

export type QuotePreset = {
  service?: ServiceOption;
  category?: CategoryValue;
  clientType?: ClientTypeValue;
  message?: string;
};

export const QUOTE_PRESET_EVENT = "quote:preset";

export function dispatchQuotePreset(preset: QuotePreset) {
  window.dispatchEvent(new CustomEvent<QuotePreset>(QUOTE_PRESET_EVENT, { detail: preset }));
}
