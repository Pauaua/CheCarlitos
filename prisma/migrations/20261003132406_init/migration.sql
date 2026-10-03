-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('particular', 'empresa');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('domiciliario', 'vehicular');

-- CreateTable
CREATE TABLE "QuoteRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "clientType" "ClientType" NOT NULL,
    "companyName" TEXT,
    "city" TEXT,
    "service" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "message" TEXT,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuoteRequest_createdAt_idx" ON "QuoteRequest"("createdAt");
