import { Resend } from "resend";
import type { QuoteData } from "@/lib/quote-schema";
import { SITE } from "@/lib/site";

// Envío de correos con Resend + plantillas HTML simples con los colores de la marca.

const COLORS = {
  navy: "#1F3A6D",
  navyDark: "#142849",
  orange: "#D9622B",
  cream: "#F7F2EA",
  ice: "#E8F0FA",
  text: "#1E2430",
  muted: "#5B6472",
};

let resendClient: Resend | null = null;

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Falta la variable de entorno RESEND_API_KEY");
  resendClient ??= new Resend(apiKey);
  return resendClient;
}

const FROM = () => process.env.EMAIL_FROM || "Che Carlitos <onboarding@resend.dev>";
const TO = () => process.env.EMAIL_TO || SITE.email;

/** Escapa texto ingresado por el usuario antes de insertarlo en HTML. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const CLIENT_TYPE_LABEL = { particular: "Particular", empresa: "Empresa" } as const;
const CATEGORY_LABEL = { domiciliario: "Domiciliario", vehicular: "Vehicular" } as const;

function quoteRows(data: QuoteData): [string, string][] {
  return [
    ["Nombre", data.name],
    ["Correo", data.email],
    ["Teléfono", data.phone],
    ["Tipo de cliente", CLIENT_TYPE_LABEL[data.clientType]],
    ...(data.companyName ? ([["Empresa", data.companyName]] as [string, string][]) : []),
    ["Comuna o ciudad", data.city ?? "—"],
    ["Servicio / producto", data.service],
    ["Tipo", CATEGORY_LABEL[data.category]],
    ["Mensaje", data.message ?? "—"],
  ];
}

function layout(title: string, body: string) {
  return `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:24px;background:${COLORS.cream};font-family:Arial,Helvetica,sans-serif;color:${COLORS.text};">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">
      <tr>
        <td style="background:${COLORS.navy};padding:24px 28px;">
          <p style="margin:0;font-size:22px;font-weight:bold;letter-spacing:1px;color:#ffffff;text-transform:uppercase;">${SITE.name}</p>
          <p style="margin:6px 0 0;font-size:14px;color:#cdd8ea;">${escapeHtml(title)}</p>
        </td>
      </tr>
      <tr><td style="height:4px;background:linear-gradient(90deg,${COLORS.navy},${COLORS.orange});background-color:${COLORS.orange};"></td></tr>
      <tr><td style="padding:28px;">${body}</td></tr>
      <tr>
        <td style="padding:16px 28px;background:${COLORS.ice};font-size:12px;color:${COLORS.muted};">
          ${SITE.name} · Aire acondicionado domiciliario y vehicular · ${SITE.email}
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function quoteEmailHtml(data: QuoteData) {
  const rows = quoteRows(data)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid ${COLORS.ice};font-size:13px;color:${COLORS.muted};width:38%;vertical-align:top;">${label}</td>
          <td style="padding:10px 12px;border-bottom:1px solid ${COLORS.ice};font-size:15px;color:${COLORS.text};white-space:pre-wrap;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return layout(
    "Nueva solicitud de cotización desde el sitio web",
    `<p style="margin:0 0 18px;font-size:16px;">Llegó una nueva solicitud de cotización:</p>
     <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${rows}</table>
     <p style="margin:24px 0 0;">
       <a href="mailto:${escapeHtml(data.email)}" style="display:inline-block;background:${COLORS.orange};color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:999px;">Responder al cliente</a>
     </p>`,
  );
}

function quoteEmailText(data: QuoteData) {
  return quoteRows(data)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

export function confirmationEmailHtml(data: QuoteData) {
  return layout(
    "Recibimos tu solicitud de cotización",
    `<p style="margin:0 0 14px;font-size:16px;">Hola ${escapeHtml(data.name)},</p>
     <p style="margin:0 0 14px;font-size:15px;line-height:1.6;">
       Gracias por contactarte con <strong>${SITE.name}</strong>. Recibimos tu solicitud de cotización por
       <strong>${escapeHtml(data.service)}</strong> y te responderemos a la brevedad.
     </p>
     <p style="margin:0;font-size:15px;line-height:1.6;">Si necesitas agregar información, simplemente responde este correo.</p>`,
  );
}

/** Envía la solicitud al correo de la empresa. Lanza un error si Resend falla. */
export async function sendQuoteEmail(data: QuoteData) {
  const { error } = await getResend().emails.send({
    from: FROM(),
    to: TO(),
    replyTo: data.email,
    subject: `Nueva cotización: ${data.service} (${CATEGORY_LABEL[data.category]}) — ${data.name}`,
    html: quoteEmailHtml(data),
    text: quoteEmailText(data),
  });
  if (error) throw new Error(`Resend: ${error.name} - ${error.message}`);
}

/** Correo de confirmación al cliente (solo si SEND_CLIENT_CONFIRMATION=true). */
export async function sendClientConfirmation(data: QuoteData) {
  if (process.env.SEND_CLIENT_CONFIRMATION !== "true") return;

  const { error } = await getResend().emails.send({
    from: FROM(),
    to: data.email,
    replyTo: TO(),
    subject: `Recibimos tu solicitud de cotización — ${SITE.name}`,
    html: confirmationEmailHtml(data),
  });
  if (error) throw new Error(`Resend (confirmación): ${error.name} - ${error.message}`);
}
