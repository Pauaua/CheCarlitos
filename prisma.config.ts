import "dotenv/config";
import { defineConfig } from "prisma/config";

// Configuración de la CLI de Prisma (migraciones, generate, studio).
// Las migraciones usan la conexión DIRECTA de Supabase (puerto 5432),
// porque el pooler en modo transacción (puerto 6543) no las soporta.
// En tiempo de ejecución la app usa DATABASE_URL (ver lib/prisma.ts).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
