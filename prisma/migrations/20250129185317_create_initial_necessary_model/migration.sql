-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Land" (
    "id" SERIAL NOT NULL,
    "landSize" DOUBLE PRECISION NOT NULL,
    "farmerId" INTEGER NOT NULL,
    "upi" VARCHAR(32) NOT NULL,
    "location" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Land_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fertilizer" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "pricePerKg" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fertilizer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seed" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "pricePerKg" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "farmerId" INTEGER NOT NULL,
    "landId" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderDetails" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "fertilizerId" INTEGER,
    "seedId" INTEGER,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FertilizerToSeed" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FertilizerToSeed_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Land_upi_key" ON "Land"("upi");

-- CreateIndex
CREATE INDEX "Land_farmerId_idx" ON "Land"("farmerId");

-- CreateIndex
CREATE INDEX "Land_upi_idx" ON "Land"("upi");

-- CreateIndex
CREATE UNIQUE INDEX "Fertilizer_name_key" ON "Fertilizer"("name");

-- CreateIndex
CREATE INDEX "Fertilizer_name_idx" ON "Fertilizer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Seed_name_key" ON "Seed"("name");

-- CreateIndex
CREATE INDEX "Seed_name_idx" ON "Seed"("name");

-- CreateIndex
CREATE INDEX "Order_farmerId_idx" ON "Order"("farmerId");

-- CreateIndex
CREATE INDEX "Order_landId_idx" ON "Order"("landId");

-- CreateIndex
CREATE INDEX "OrderDetails_orderId_idx" ON "OrderDetails"("orderId");

-- CreateIndex
CREATE INDEX "OrderDetails_fertilizerId_idx" ON "OrderDetails"("fertilizerId");

-- CreateIndex
CREATE INDEX "OrderDetails_seedId_idx" ON "OrderDetails"("seedId");

-- CreateIndex
CREATE INDEX "_FertilizerToSeed_B_index" ON "_FertilizerToSeed"("B");

-- CreateIndex
CREATE INDEX "Farmer_phoneNumber_idx" ON "Farmer"("phoneNumber");

-- AddForeignKey
ALTER TABLE "Land" ADD CONSTRAINT "Land_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_landId_fkey" FOREIGN KEY ("landId") REFERENCES "Land"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_fertilizerId_fkey" FOREIGN KEY ("fertilizerId") REFERENCES "Fertilizer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_seedId_fkey" FOREIGN KEY ("seedId") REFERENCES "Seed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FertilizerToSeed" ADD CONSTRAINT "_FertilizerToSeed_A_fkey" FOREIGN KEY ("A") REFERENCES "Fertilizer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FertilizerToSeed" ADD CONSTRAINT "_FertilizerToSeed_B_fkey" FOREIGN KEY ("B") REFERENCES "Seed"("id") ON DELETE CASCADE ON UPDATE CASCADE;
