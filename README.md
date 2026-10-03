# Che Carlitos — Landing page

Landing page de **Che Carlitos**: aire acondicionado domiciliario y vehicular, y repuestos especializados para calefacción automotriz. Incluye un formulario de cotización que guarda cada solicitud en una base de datos (Supabase) y la envía por correo (Resend).

**Stack:** Next.js 16 (App Router + TypeScript) · Tailwind CSS 4 · Prisma 7 + PostgreSQL (Supabase) · Resend · Zod · lucide-react · framer-motion

---

## 1. Puesta en marcha local

Requisitos: Node.js 20.9 o superior.

```bash
npm install          # instala dependencias y genera el cliente de Prisma
cp .env.example .env # luego completa las variables (ver pasos 2 y 4)
npx prisma migrate dev --name init   # crea la tabla en Supabase (paso 3)
npm run dev          # http://localhost:3000
```

> La página se ve completa aunque todavía no configures Supabase ni Resend. Lo único que no va a funcionar es el envío del formulario: mostrará un mensaje de error.

## 2. Crear la base de datos en Supabase

1. Entra a <https://supabase.com>, crea una cuenta y presiona **New project**.
2. Elige un nombre (ej: `che-carlitos`), una **contraseña de base de datos** (guárdala) y la región más cercana (ej: *South America (São Paulo)*).
3. Cuando el proyecto esté listo, presiona el botón **Connect** (arriba en el panel) y abre la pestaña **ORMs → Prisma**. Ahí verás dos URLs:
   - **`DATABASE_URL`** → la conexión con *pooler* en modo transacción, **puerto 6543**, termina en `?pgbouncer=true`. La usa la aplicación.
   - **`DIRECT_URL`** → la conexión directa / sesión, **puerto 5432**. La usa Prisma para crear las tablas (migraciones).
4. Cópialas en tu `.env` reemplazando `[YOUR-PASSWORD]` por la contraseña que elegiste:

```env
DATABASE_URL="postgresql://postgres.xxxx:TU_CLAVE@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxx:TU_CLAVE@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"
```

> Si tu contraseña tiene caracteres especiales (`@`, `#`, `/`, etc.), debes codificarlos en la URL (por ejemplo `@` → `%40`).

## 3. Crear la tabla con Prisma

```bash
npx prisma migrate dev --name init
```

Esto crea la tabla `QuoteRequest` en Supabase y guarda la migración en `prisma/migrations/` (súbela al repositorio). Para ver las solicitudes recibidas puedes usar el **Table Editor** de Supabase o:

```bash
npm run db:studio
```

> **Nota Prisma 7:** en esta versión las URLs ya no van dentro de `schema.prisma`. `DIRECT_URL` se lee en `prisma.config.ts` (migraciones) y `DATABASE_URL` en `lib/prisma.ts` (la app, a través del adaptador `@prisma/adapter-pg`).

## 4. Configurar Resend (envío de correos)

1. Crea una cuenta en <https://resend.com>.
2. Ve a **API Keys → Create API Key**, dale permiso *Sending access* y copia la clave (empieza con `re_`).
3. Pégala en `.env`:

```env
RESEND_API_KEY=re_xxxxxxxxx
EMAIL_FROM="Che Carlitos <onboarding@resend.dev>"
EMAIL_TO=aireacondicionado.cc@hotmail.com
```

### ⚠️ IMPORTANTE: el remitente de prueba

Con el remitente de prueba **`onboarding@resend.dev`**, Resend **solo permite enviar correos a la dirección con la que se registró la cuenta**. Tienes dos opciones:

- **Opción A (rápida):** crea la cuenta de Resend con **aireacondicionado.cc@hotmail.com**. Así los avisos de cotización llegarán sin problema a ese correo.
- **Opción B (recomendada para producción):** verifica un dominio propio en Resend (**Domains → Add Domain**, y agrega los registros DNS que te indique). Luego usa un remitente como:

  ```env
  EMAIL_FROM="Che Carlitos <contacto@midominio.cl>"
  ```

### Correo de confirmación al cliente (opcional)

Si `SEND_CLIENT_CONFIRMATION=true`, además se envía un correo de confirmación a quien pidió la cotización. **Requiere la opción B** (dominio verificado), porque con `onboarding@resend.dev` no se puede enviar a terceros.

## 5. Variables de entorno

| Variable | Descripción |
| --- | --- |
| `DATABASE_URL` | Conexión con pooler de Supabase (puerto 6543, `?pgbouncer=true`) |
| `DIRECT_URL` | Conexión directa de Supabase (puerto 5432), para migraciones |
| `RESEND_API_KEY` | API key de Resend |
| `EMAIL_FROM` | Remitente de los correos |
| `EMAIL_TO` | Correo que recibe las cotizaciones |
| `SEND_CLIENT_CONFIRMATION` | `true` para enviar confirmación al cliente |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp, solo dígitos con código de país (ej: `56912345678`) |
| `NEXT_PUBLIC_PHONE` | Teléfono principal (también WhatsApp) como se muestra en la página (ej: `+56 9 1234 5678`) |
| `NEXT_PUBLIC_PHONE_2` | Segundo teléfono de contacto (solo llamadas) |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (para SEO y Open Graph) |

## 6. Desplegar en Vercel

1. Sube el proyecto a un repositorio de GitHub (el `.env` **no** se sube; ya está en `.gitignore`).
2. En <https://vercel.com> presiona **Add New → Project** e importa el repositorio. Vercel detecta Next.js automáticamente.
3. Antes de presionar **Deploy**, abre **Environment Variables** y agrega **todas** las variables de la tabla anterior con sus valores reales (en `NEXT_PUBLIC_SITE_URL` pon la URL final, ej: `https://checarlitos.cl`).
4. Presiona **Deploy**. El build ejecuta `prisma generate` automáticamente.
5. La tabla ya existe porque corriste la migración en el paso 3. Si en el futuro cambias `schema.prisma`, ejecuta `npx prisma migrate dev` localmente y luego `npm run db:deploy` apuntando a producción.
6. (Opcional) En **Settings → Domains** conecta tu dominio propio.

> Las variables `NEXT_PUBLIC_*` se incrustan al compilar: si las cambias en Vercel, vuelve a desplegar.

---

## Cómo editar la página

| Quiero cambiar… | Archivo |
| --- | --- |
| Textos de servicios, productos, empresas, “por qué elegirnos”, pasos | `lib/content.ts` |
| Correo, teléfono, WhatsApp, zona de cobertura | `lib/site.ts` (o variables de entorno) |
| Opciones del formulario y validaciones | `lib/quote-schema.ts` |
| Plantilla del correo | `lib/email.ts` |
| Colores y tipografías | `app/globals.css` (bloque `@theme`) y `app/layout.tsx` |
| Título, descripción y SEO | `app/layout.tsx` |
| Cada sección visual | `components/` (Header, Hero, Services, Products, ServiceLines, Business, WhyUs, Process, QuoteForm, Footer, WhatsAppButton) |

### Colores de marca

Disponibles como clases de Tailwind (`bg-brand-navy`, `text-brand-orange`, etc.):

| Token | Color | Uso |
| --- | --- | --- |
| `brand-navy` | `#1F3A6D` | Títulos, textos fuertes |
| `brand-navy-dark` | `#142849` | Fondos oscuros, footer |
| `brand-orange` | `#D9622B` | Acentos, degradados |
| `brand-orange-light` | `#F08A4B` | Hover, degradados |
| `brand-orange-dark` | `#C4551F` | Botones y textos naranjos (cumple contraste AA con texto blanco) |
| `brand-cream` | `#F7F2EA` | Fondo general |
| `brand-ice` | `#E8F0FA` | Fondos “fríos” |
| `ink` / `muted` | `#1E2430` / `#5B6472` | Texto neutro / gris |

Además están las utilidades `bg-cold-warm` (degradado azul → naranjo) y `text-cold-warm`.

### Logo y favicon

`public/logo.png` es un **logo provisorio**. Reemplázalo por el logo real (ideal: PNG cuadrado de 512×512 o más) y ejecuta:

```bash
npm run icons
```

Esto regenera `app/icon.png` y `app/apple-icon.png` (favicon e ícono de iPhone). La imagen para redes sociales (`app/opengraph-image.tsx`) usa el logo automáticamente.

### Fotos

Busca los comentarios `FOTO:` en `components/` para ver dónde conviene poner fotos reales (hero, productos, sección hogar/vehículos). Guarda las fotos en `public/fotos/` y usa el componente `<Image>` de `next/image`.

## Cómo funciona el formulario

1. El navegador valida con el schema de Zod (`lib/quote-schema.ts`).
2. Se envía a `POST /api/cotizacion` (`app/api/cotizacion/route.ts`), que:
   - aplica un **rate limit** por IP (5 solicitudes cada 10 minutos, en memoria);
   - descarta en silencio a los bots que completen el **campo trampa** (honeypot);
   - vuelve a validar con **el mismo schema**;
   - **guarda** la solicitud en la base de datos;
   - **envía el correo** a `EMAIL_TO` con `replyTo` = correo del cliente (puedes responderle directo);
   - si el correo falla, la solicitud queda guardada con `emailSent = false` y el error se registra en la consola (logs de Vercel).
3. Los botones “Cotizar” de cada producto dejan preseleccionado el servicio en el formulario.

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (incluye `prisma generate`) |
| `npm run start` | Servir el build |
| `npm run lint` | ESLint |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:deploy` | `prisma migrate deploy` (producción) |
| `npm run db:studio` | Explorador visual de la base de datos |
| `npm run icons` | Regenerar favicon desde `public/logo.png` |
