-- CreateTable
CREATE TABLE "StoreAdmin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" VARCHAR(32) NOT NULL,
    "lastName" VARCHAR(32) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StoreAdmin_email_key" ON "StoreAdmin"("email");

-- CreateIndex
CREATE INDEX "StoreAdmin_email_idx" ON "StoreAdmin"("email");
