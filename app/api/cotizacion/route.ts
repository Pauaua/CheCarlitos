import { sendClientConfirmation, sendQuoteEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { HONEYPOT_FIELD, quoteSchema, toFieldErrors } from "@/lib/quote-schema";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

// POST /api/cotizacion
// 1) Valida con Zod  2) Guarda en la BD con Prisma  3) Envía el correo con Resend
// Si el correo falla, la solicitud queda guardada igual (emailSent = false).

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const limit = rateLimit(`cotizacion:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!limit.allowed) {
    return Response.json(
      { ok: false, error: "Recibimos demasiadas solicitudes desde tu conexión. Inténtalo en unos minutos." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
  }

  // Honeypot: si un bot completó el campo oculto, respondemos "ok" sin guardar nada.
  if (typeof body[HONEYPOT_FIELD] === "string" && body[HONEYPOT_FIELD] !== "") {
    return Response.json({ ok: true });
  }

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Revisa los campos marcados.", fieldErrors: toFieldErrors(parsed.error) },
      { status: 400 },
    );
  }

  const data = {
    ...parsed.data,
    companyName: parsed.data.clientType === "empresa" ? parsed.data.companyName : undefined,
  };

  // Paso 1: guardar en la base de datos
  let savedId: string | null = null;
  try {
    const saved = await prisma.quoteRequest.create({ data, select: { id: true } });
    savedId = saved.id;
  } catch (error) {
    console.error("[cotizacion] Error al guardar en la base de datos:", error);
  }

  // Paso 2: enviar el correo a la empresa
  let emailSent = false;
  try {
    await sendQuoteEmail(data);
    emailSent = true;
  } catch (error) {
    console.error("[cotizacion] Error al enviar el correo:", error);
  }

  if (savedId && emailSent) {
    await prisma.quoteRequest
      .update({ where: { id: savedId }, data: { emailSent: true } })
      .catch((error) => console.error("[cotizacion] Error al marcar emailSent:", error));
  }

  // Si no se pudo guardar NI enviar, la solicitud se perdería: avisamos al usuario.
  if (!savedId && !emailSent) {
    return Response.json(
      {
        ok: false,
        error: "No pudimos registrar tu solicitud en este momento. Inténtalo nuevamente o escríbenos por WhatsApp.",
      },
      { status: 500 },
    );
  }

  // Paso 3 (opcional): confirmación al cliente
  try {
    await sendClientConfirmation(data);
  } catch (error) {
    console.error("[cotizacion] Error al enviar la confirmación al cliente:", error);
  }

  return Response.json({ ok: true });
}
