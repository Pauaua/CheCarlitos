// Rate limiting básico en memoria (ventana fija por IP).
// Nota: en Vercel cada instancia tiene su propia memoria, así que es una
// protección "best effort". Para algo más estricto, usar Upstash Redis o similar.

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();

export function rateLimit(key: string, { limit = 5, windowMs = 10 * 60 * 1000 } = {}) {
  const now = Date.now();

  // Limpieza ocasional para que el Map no crezca indefinidamente
  if (buckets.size > 5000) {
    for (const [k, entry] of buckets) if (entry.resetAt <= now) buckets.delete(k);
  }

  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  entry.count += 1;
  if (entry.count > limit) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { allowed: true, retryAfter: 0 };
}

export function getClientIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
