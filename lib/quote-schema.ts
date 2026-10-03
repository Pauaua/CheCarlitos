import { z } from "zod";

// Schema del formulario de cotización. Se comparte entre el cliente (QuoteForm)
// y el servidor (app/api/cotizacion/route.ts) para validar con las mismas reglas.

export const SERVICE_OPTIONS = [
  "Venta de equipo",
  "Instalación",
  "Mantención",
  "Reparación",
  "Aire automotriz",
  "Carga de gas",
  "Repuestos calefacción automotriz",
  "Otro",
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

export const CLIENT_TYPES = [
  { value: "particular", label: "Particular" },
  { value: "empresa", label: "Empresa" },
] as const;

export const CATEGORIES = [
  { value: "domiciliario", label: "Domiciliario" },
  { value: "vehicular", label: "Vehicular" },
] as const;

export type ClientTypeValue = (typeof CLIENT_TYPES)[number]["value"];
export type CategoryValue = (typeof CATEGORIES)[number]["value"];

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Máximo ${max} caracteres.`)
    .optional()
    .transform((value) => (value ? value : undefined));

export const quoteSchema = z.object({
  name: z
    .string("Ingresa tu nombre.")
    .trim()
    .min(2, "Ingresa tu nombre.")
    .max(100, "Máximo 100 caracteres."),
  email: z.string("Ingresa un correo válido.").trim().toLowerCase().pipe(z.email("Ingresa un correo válido.")),
  phone: z
    .string("Ingresa tu teléfono.")
    .trim()
    .min(1, "Ingresa tu teléfono.")
    .regex(/^\+?[\d\s()-]{8,20}$/, "Ingresa un teléfono válido (ej: +56 9 1234 5678)."),
  clientType: z.enum(["particular", "empresa"], "Selecciona el tipo de cliente."),
  companyName: optionalText(120),
  city: optionalText(80),
  service: z.enum(SERVICE_OPTIONS, "Selecciona un servicio o producto."),
  category: z.enum(["domiciliario", "vehicular"], "Selecciona domiciliario o vehicular."),
  message: optionalText(2000),
});

export type QuoteInput = z.input<typeof quoteSchema>;
export type QuoteData = z.output<typeof quoteSchema>;
export type QuoteFieldErrors = Partial<Record<keyof QuoteInput, string>>;

/** Nombre del campo trampa (honeypot). Un humano nunca lo ve ni lo completa. */
export const HONEYPOT_FIELD = "website";

/** Convierte los errores de Zod en un mensaje por campo. */
export function toFieldErrors(error: z.ZodError): QuoteFieldErrors {
  const result: QuoteFieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as keyof QuoteInput | undefined;
    if (field && !result[field]) result[field] = issue.message;
  }
  return result;
}
